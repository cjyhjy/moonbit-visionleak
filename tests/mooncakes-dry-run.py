"""A successful preview must never hide a different publishing failure."""
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("mooncakes_dry_run", ROOT / "tools/mooncakes_dry_run.py")
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)
CONFIRMATION = ("Server status: 202 Accepted, detail: Dry run completed successfully. No changes were made. "
                "The dry-run was made for package localtest/dryrun version 0.1.0.")


def accepted():
    return dict(args=["publish", "--dry-run", "--frozen"], status=255, stdout="",
                stderr=("Check passed\nvalidating packaged zip: /tmp/package.zip\n"
                        "running moon check on extracted package\nCheck passed\n"
                        f"{CONFIRMATION}\n{adapter.GENERIC_ERROR}\n"),
                publisher_version=adapter.AFFECTED_PUBLISHER,
                manifest={"name": "localtest/dryrun", "version": "0.1.0"})


class Acceptance(unittest.TestCase):
    def test_completed_preview_for_current_module(self):
        self.assertTrue(adapter.accepted_dry_run(**accepted()))

    def test_other_commands_versions_and_failures_keep_raw_status(self):
        for change in [
            {"args": ["publish"]}, {"args": ["publish", "--dry-run", "-C", "/other"]},
            {"status": 1}, {"status": 0}, {"status": -15},
            {"publisher_version": "future-client"}, {"manifest": None},
            {"manifest": {"name": "another/module", "version": "0.1.0"}},
            {"manifest": {"name": "localtest/dryrun", "version": "0.2.0"}},
        ]:
            with self.subTest(change=change):
                self.assertFalse(adapter.accepted_dry_run(**{**accepted(), **change}))

    def test_rejection_partial_checks_extra_errors_and_ambiguous_responses(self):
        original = accepted()["stderr"]
        for stderr in [
            original.replace("202 Accepted", "401 Unauthorized"),
            original.replace("202 Accepted", "500 Internal Server Error"),
            original.replace(CONFIRMATION, "Server status: 202 Accepted"),
            original.replace("No changes were made.", "Still processing."),
            original.replace("Check passed\n", "", 1),
            original.replace("running moon check on extracted package", "extraction failed"),
            "Error: connection refused\n" + original,
            original + "Error: another failure\n",
            CONFIRMATION + "\n" + original,
            original.replace(adapter.GENERIC_ERROR, "Error: unexpected failure"),
        ]:
            with self.subTest(stderr=stderr):
                self.assertFalse(adapter.accepted_dry_run(**{**accepted(), "stderr": stderr}))


if __name__ == "__main__":
    unittest.main()
