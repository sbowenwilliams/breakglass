import * as core from '@actions/core';
import * as request from 'request-promise-native';
import * as github from '@actions/github';
import { Input } from './input';
import { PrAuditor } from './pr_auditor';
import { SlackClient } from './slack_client';

export async function onCron(octokit: github.GitHub, context, input: Input) {
  let prs
  await getClosedPullRequests(octokit, context, input).then(res => prs = res['data']);


  const promises = prs.map(async(pr) => {
    const detailed_pr = await getDetailedPullRequest(octokit, input.owner, input.repo, pr.number);
    return detailed_pr['data'];
  });
  const detailed_prs = await Promise.all(promises);

  const flagged_prs = (new PrAuditor(detailed_prs, input.skipApprovalLabel, input.retroactiveApprovalLabel)).audit()

  const slack_client = new SlackClient(input.slackHook)

  for(const pr of flagged_prs) {
    await slack_client.send(generateMessage(pr));
  }
}

function generateMessage(pr) {
  return `Emergency merged PR needs still needs a review! ${pr.url}`
}

function getClosedPullRequests(octokit: github.GitHub, context, input: Input) {
  return octokit.pulls.list({
    owner: input.owner,
    repo: input.repo,
    state: 'closed'
  })
}

function getDetailedPullRequest(octokit, owner, repo, pull_number) {
  return octokit.pulls.get({
    owner: owner,
    repo: repo,
    pull_number: pull_number
  })
}
