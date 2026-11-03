import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { cli_options_json } from '../dist/visionleak.js';
import { DECODER, SUPPORTED_EXTENSIONS } from './decode.mjs';
import { IDENTITY_VERSION } from '../demo/report-identity.mjs';

// Explicit host contract. Limits and split aliases come from the executable core.
// Digests identify the installed bytes; they are not authenticity signatures.
export async function capabilities() {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
  const core = JSON.parse(cli_options_json(JSON.stringify({ operation: 'limits' })));
  if (!core.ok) throw new Error('Core does not implement the capability limits contract');
  const artifact = await readFile(new URL('../dist/visionleak.js', import.meta.url));
  return {
    ok: true, schemaVersion: 'visionleak-capabilities-v1', version: pkg.version,
    engine: { name: 'visionleak-moonbit', artifactSha256: createHash('sha256').update(artifact).digest('hex') },
    runtime: { node: process.version, requiredNode: pkg.engines.node, decoder: DECODER },
    report: { schemaVersion: 'visionleak-report-v1', identityVersion: IDENTITY_VERSION },
    input: { layout: 'split-directories-or-csv-manifest', splitAliases: core.splitAliases, extensions: SUPPORTED_EXTENSIONS,
      csvSplitInput: true, manifestInput: true, followsSymlinks: false },
    commands: ['capabilities', 'audit', 'verify', 'export-html', 'export-fixes'],
    features: { incrementalAudit: false, pairSubsetAudit: false, fingerprintCache: true,
      endToEndStreamingDecode: false, combinedFingerprint: true },
    profiles: { normalization: 'vl-rgb-v1', local: { id: 'vl-local-dhash-v1', experimental: true,
      enabledByDefault: false, windows: 20, minimumGridContrast: 16, crossScale: true } },
    limits: core.limits,
    accounting: { comparisons: 'sum of phase distanceEvaluations + pairChecks',
      auditStrategy: 'exact-first-v1', phases: ['deterministic', 'perceptual', 'local'],
      exactBudget: 'maxExactComparisons', approximateBudget: 'maxComparisons independently per perceptual/local stage',
      outputBudget: 'maxPairs shared; deterministic evidence emitted first', indexOperations: 'separate',
      indexOperationLimitMultiplier: 16, indexStatsMayBeAbsentWhenUnused: true,
      decodedPixels: 'scope.totalDecodedPixels', fingerprintedImages: 'scope.acceptedImages',
      processedImages: 'stats.processedImages (all enabled stages); see phases for stage coverage', freshBudgetPerInvocation: true,
      verifyUsesAuditPixelBudget: false },
    verification: { evidenceTypes: ['byte-identical', 'pixel-identical'],
      candidatesRecomputed: false, wholeDatasetReaudited: false, skippedCount: 'counts.skippedCandidates' },
    exitCodes: { audit: { complete: 0, fatal: 1, incomplete: 2, failOnHit: 3 },
      verify: { noInvalidExactEvidence: 0, fatal: 1, invalidOrMissing: 4 } },
  };
}
