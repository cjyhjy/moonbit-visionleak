import { workflow_json } from '../dist/visionleak.js';
import { VisionLeakError } from './runtime.mjs';
export function workflow(request) {
  const result = JSON.parse(workflow_json(JSON.stringify(request)));
  if (!result.ok) throw new VisionLeakError(result.error.code, result.error.message);
  return result;
}
