// see action.yml for more details
import * as core from '@actions/core';

export interface Input {
  slackHook: string;
  instructions: string;
  skipApprovalLabel: string;
  skipCILabel: string;
  requiredChecks: string[];
  repo: string;
  owner: string;
  retroactiveApprovalLabel: string;
}

export function getInput(): Input {
  return {
    instructions: core.getInput('instructions'),
    requiredChecks: core.getInput('required_checks', {
      required: true,
    }).split(','),
    skipApprovalLabel: core.getInput('skip_approval_label'),
    skipCILabel: core.getInput('skip_ci_label'),
    slackHook: core.getInput('slack_hook', {
      required: true,
    }),
    repo: core.getInput('repo'),
    owner: core.getInput('owner'),
    retroactiveApprovalLabel: core.getInput('retroactive_approval_label')
  };
}
