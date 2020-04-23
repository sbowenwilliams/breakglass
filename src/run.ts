import * as core from '@actions/core';
import * as github from '@actions/github';
import { onPullRequest } from './on_pull_request';
import { onIssue } from './on_issue';
import { onCron } from './on_cron';
import { getInput } from './input';

const PULL_REQUEST_EVENT_NAME = 'pull_request';
const ISSUE_EVENT_NAME = 'issues';
const CRON_EVENT_NAME = 'cron';
const UNSUPPORTED_EVENT = 'Workflow triggered by an unsupported event';

// Entry point for any GitHub Actions
export async function run(): Promise<void> {
  try {
    const octokit = new github.GitHub(core.getInput('github_token', {
      required: true,
    }));

    const input = getInput();

    switch (github.context.eventName) {
      case PULL_REQUEST_EVENT_NAME:
        onPullRequest(octokit, github.context, input);
        break;
      case ISSUE_EVENT_NAME:
        onIssue();
        break;
      case CRON_EVENT_NAME:
        onCron(octokit, github.context, input);
        break;
      default:
        core.setFailed(UNSUPPORTED_EVENT);
    }
  } catch (error) {
    core.setFailed(error.message);
    core.debug(error.stack);
  }
}
