import * as core from '@actions/core'
import * as github from '@actions/github'
import { onPullRequest } from './on_pull_request';
import { onIssue } from './on_issue';

const PULL_REQUEST_EVENT_NAME = 'pull_request';
const ISSUE_EVENT_NAME = 'issues';

// Entry point for any GitHub Actions relating to SOX.
export async function run(): Promise<void> {
  try {
    const octokit = new github.GitHub(core.getInput('github_token'));

    switch (github.context.eventName) {
      case PULL_REQUEST_EVENT_NAME:
        onPullRequest(octokit, github.context)
        break;
      case ISSUE_EVENT_NAME:
        onIssue();
        break;
      default:
    }
  } catch (error) {
    core.setFailed(error.message);
    core.debug(error.stack);
  }
}
