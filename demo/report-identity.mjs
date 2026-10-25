import { report_identity_json } from '../dist/visionleak.js';
// Content consistency, not a signature or trusted provenance.
export const IDENTITY_VERSION = 'vl-report-sha256-v2';
export function reportIdentity(report) {
  if (!report || typeof report !== 'object' || Array.isArray(report)) throw new Error('审计报告必须是对象。');
  const result = JSON.parse(report_identity_json(JSON.stringify(report)));
  if (!result.ok) throw new Error(result.error.message);
  return result;
}
export function reportIdentityPayload(report) { return reportIdentity(report).payload; }
export async function verifyReportIdentity(report) {
  if (typeof report?.auditId !== 'string' || !/^[a-f0-9]{64}$/.test(report.auditId)) throw new Error('审计报告缺少有效的内容摘要 auditId。');
  if (reportIdentity(report).digest !== report.auditId) throw new Error('报告内容与 auditId 不匹配，未加载报告或复核记录。请重新运行审计生成完整报告。');
}
