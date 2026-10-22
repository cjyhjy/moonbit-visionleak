#!/usr/bin/env python3
"""Regression checks for denominator separation in the evaluation harness."""
import importlib.util
from pathlib import Path
import unittest

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

    def test_unknown_pair_is_error_not_silently_ignored(self):
        with self.assertRaises(ValueError):
            evaluate.score(self.truth, [{"left": "a", "right": "unknown", "evidence": "byte-identical"}])

    def test_candidate_on_exact_pair_is_excluded_from_near_denominator(self):
        scores = evaluate.score(self.truth, [{"left": "a", "right": "b", "evidence": "perceptual-candidate"}])
        self.assertEqual(scores["nearOnly"]["tp"], 0)
        self.assertEqual(scores["nearOnly"]["fp"], 0)
        self.assertEqual(scores["exactPairsEmittedAsCandidates"], 1)


if __name__ == "__main__":
    unittest.main()
