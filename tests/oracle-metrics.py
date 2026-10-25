#!/usr/bin/env python3
"""Regression checks for denominator separation in the evaluation harness."""
import importlib.util
from pathlib import Path
import unittest
import sys
import copy
import itertools
import random
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

spec = importlib.util.spec_from_file_location("evaluate", Path(__file__).resolve().parents[1] / "tools/evaluate.py")
evaluate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(evaluate)


class MetricSemantics(unittest.TestCase):
    def setUp(self):
        self.truth = {"pairs": [
            {"left": "a", "right": "b", "relation": "byte-identical"},
            {"left": "a", "right": "c", "relation": "near-source"},
            {"left": "a", "right": "d", "relation": "negative"},
        ]}

    def test_exact_true_positive_does_not_improve_near_recall(self):
        pairs = [{"left": "a", "right": "b", "evidence": "byte-identical"},
                 {"left": "a", "right": "d", "evidence": "perceptual-candidate"}]
        scores = evaluate.score(self.truth, pairs)
        self.assertEqual(scores["exact"]["recall"], 1)
        self.assertEqual(scores["nearOnly"]["recall"], 0)
        self.assertEqual(scores["nearOnly"]["precision"], 0)
        self.assertEqual(scores["nearOnly"]["fp"], 1)
        self.assertEqual(scores["nearOnlyUniverse"], 2)

    def test_wrong_exact_tier_is_visible(self):
        scores = evaluate.score(self.truth, [{"left": "a", "right": "b", "evidence": "pixel-identical"}])
        self.assertEqual(len(scores["exactEvidenceTierMismatches"]), 1)

    def test_wrong_tier_diagnostics_preserve_nested_boolean_metadata(self):
        row = {"left": "a", "right": "b", "evidence": "pixel-identical", "lowContrast": False,
               "diagnostic": {"flag": True, "values": [None, "detail"]}}
        scores = evaluate.score(self.truth, [row])
        self.assertEqual(scores["exactEvidenceTierMismatches"], [row])

    def test_unknown_pair_is_error_not_silently_ignored(self):
        with self.assertRaises(RuntimeError):
            evaluate.score(self.truth, [{"left": "a", "right": "unknown", "evidence": "byte-identical"}])

    def test_candidate_on_exact_pair_is_excluded_from_near_denominator(self):
        scores = evaluate.score(self.truth, [{"left": "a", "right": "b", "evidence": "perceptual-candidate"}])
        self.assertEqual(scores["nearOnly"]["tp"], 0)
        self.assertEqual(scores["nearOnly"]["fp"], 0)
        self.assertEqual(scores["exactPairsEmittedAsCandidates"], 1)

    def test_empty_universe_and_undefined_ratios(self):
        scores = evaluate.score({"pairs": []}, [])
        self.assertIsNone(scores["exact"]["precision"])
        self.assertEqual(scores["pairUniverse"], 0)

    def test_seeded_predictions_challenges_reversed_ids_and_duplicates(self):
        rng = random.Random(570)
        ids = ["a", "zz", "中", "long-name", "bb", "x"]
        truth = {"images": [{"id": "zz", "transform": "challenge-crop"}],
                 "pairs": [{"left": a, "right": b, "relation": rng.choice(
                     ["byte-identical", "pixel-identical", "near-source", "negative"])}
                           for a, b in itertools.combinations(ids, 2)]}
        for _ in range(12):
            predictions = [{"left": row["right"], "right": row["left"], "evidence": rng.choice(
                ["byte-identical", "pixel-identical", "perceptual-candidate"])}
                           for row in truth["pairs"] if rng.random() < .7]
            if predictions:
                predictions.append(predictions[0])
            evaluate.score(truth, predictions)

    def test_each_metric_field_is_checked_and_corruption_fails(self):
        expected = evaluate._metric_reference.score(self.truth, [])
        def corrupt_each(value):
            if isinstance(value, dict):
                for key, child in value.items():
                    for replacement in corrupt_each(child):
                        yield {**value, key: replacement}
                yield {**value, "unexpected": 1}
            elif isinstance(value, list):
                yield value + ["unexpected"]
            else:
                yield "corrupt"
                yield True
        for bad in corrupt_each(copy.deepcopy(expected)):
            with patch.object(evaluate, "run_bridge", return_value=bad):
                with self.assertRaisesRegex(AssertionError, "Independent metric oracle mismatch"):
                    evaluate.score(self.truth, [])


if __name__ == "__main__":
    unittest.main()
