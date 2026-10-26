"""Independent set-based scoring oracle; never imports or invokes MoonBit."""

EXACT = {"byte-identical", "pixel-identical"}


def score(truth, predictions):
    labels = {}
    for row in truth["pairs"]:
        key = tuple(sorted((row["left"], row["right"])))
        if key in labels:
            raise ValueError("Duplicate truth pair")
        labels[key] = row["relation"]
    universe = set(labels)
    exact = {key for key, relation in labels.items() if relation in EXACT}
    near = {key for key, relation in labels.items() if relation == "near-source"}
    predicted_exact, predicted_near, wrong_tier = set(), set(), []
    for row in predictions:
        key = tuple(sorted((row["left"], row["right"])))
        if key not in universe:
            raise ValueError("Unknown prediction pair")
        if row["evidence"] in EXACT:
            predicted_exact.add(key)
            if labels[key] != row["evidence"]:
                wrong_tier.append(row)
        else:
            predicted_near.add(key)

    def ratio(a, b):
        return a / b if b else None

    def counts(scope, positive, predicted):
        tp = scope & positive & predicted
        fp = (scope & predicted) - positive
        fn = (scope & positive) - predicted
        tn = scope - positive - predicted
        return {"tp": len(tp), "fp": len(fp), "fn": len(fn), "tn": len(tn),
                "precision": ratio(len(tp), len(tp) + len(fp)),
                "recall": ratio(len(tp), len(tp) + len(fn)),
                "falsePositiveRate": ratio(len(fp), len(fp) + len(tn)),
                "falsePositives": [list(key) for key in sorted(fp)],
                "falseNegatives": [list(key) for key in sorted(fn)]}

    challenges = {row["id"] for row in truth.get("images", [])
                  if row.get("transform", "").startswith("challenge-")}
    near_scope = universe - exact
    challenge_scope = {key for key in near_scope if challenges.intersection(key)}
    return {"exact": counts(universe, exact, predicted_exact),
            "nearOnly": counts(near_scope, near, predicted_near),
            "nearCommonTransforms": counts(near_scope - challenge_scope, near, predicted_near),
            "nearChallengeTransforms": counts(challenge_scope, near, predicted_near),
            "exactEvidenceTierMismatches": wrong_tier,
            "exactPairsEmittedAsCandidates": len(exact & predicted_near),
            "pairUniverse": len(universe), "nearOnlyUniverse": len(near_scope)}


def compare(actual, expected, path="scores"):
    """Fail at the differing field, including extra/missing keys and pair lists."""
    if isinstance(expected, dict):
        if not isinstance(actual, dict) or actual.keys() != expected.keys():
            raise AssertionError(f"Independent metric oracle mismatch at {path}: keys")
        for key in expected:
            compare(actual[key], expected[key], f"{path}.{key}")
    elif isinstance(expected, list):
        if not isinstance(actual, list) or len(actual) != len(expected):
            raise AssertionError(f"Independent metric oracle mismatch at {path}: list length")
        for index, value in enumerate(expected):
            compare(actual[index], value, f"{path}[{index}]")
    elif actual != expected or isinstance(actual, bool) != isinstance(expected, bool):
        raise AssertionError(f"Independent metric oracle mismatch at {path}: {actual!r} != {expected!r}")
