import { PrAuditor } from '../src/pr_auditor';

describe('PrAuditor', () => {
  test('it finds emergency merged pull requests with no reviewers', () => {
    let pr_1 = {
      labels: ['emergency-label'],
      merged: true
    }

    let pr_2 = {
      labels: ['emergency-label', 'retro-approval'],
      merged: true
    }
    let slack_client = {}
    let pr_auditor = new PrAuditor([pr_1, pr_2], 'emergency-label', 'retro-approval');
    expect(pr_auditor.audit()).toEqual([pr_1]);
  })
})
