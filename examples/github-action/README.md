# CI gate example

The MIT-licensed 16×16 generated PNG in `train/` is copied byte-for-byte into
`test/`. This fixture deliberately fails `--fail-on pixel` with exit 3.

```sh
npm run build
node tools/cli.mjs audit --root examples/github-action/dataset --out /tmp/visionleak-action-demo --fail-on pixel
```

The exact audit command runs in local integration tests. `visionleak.yml` is a
copyable workflow example; it is not installed in `.github/workflows/` and has
not run on GitHub. Runner setup, artifact upload and remote status remain a
phase-4 verification item after the owner authorizes a push. Use a fresh output
directory when repeating the example.

`--fail-on exact` matches byte evidence; `pixel` matches byte or pixel evidence;
`candidate` also matches perceptual candidates. Fatal errors return 1, evidence
hits 3, incomplete reports without a hit 2, and complete non-hits 0. The command
always retains a report for hits/incompleteness; it does not remove input files.
