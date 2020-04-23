import * as nock from 'nock';
import { onCron } from '../src/on_cron';
import * as github from '@actions/github';
import * as core from '@actions/core';

nock.disableNetConnect();
nock('https://api.github.com').log(console.log);

const ghClient = new github.GitHub('foozles');
const input = {
  slackHook: 'https://foo.slack/hook',
  instructions: 'this is how we pr',
  skipApprovalLabel: 'emergency-approval',
  retroactiveApprovalLabel: 'posthoc-approval',
  skipCILabel: 'emergency-ci',
  requiredChecks: [
    'ci/circleci: fast_spec',
    'ci/circleci: js',
  ],
  owner: 'owner',
  repo: 'repo'
};

describe('something', () => {
  afterEach(() => {
    expect(nock.isDone());
  });

  test('on open', async () => {
    let slackMsg;
    nock('https://foo.slack/')
      .post('/hook', (req) =>  {
        slackMsg = req;
        return true;
      }).reply(200, 'way to go');

    nock('https://api.github.com')
      .get('/repos/owner/repo/pulls?state=closed').reply(200, [
        {
          number: 1,
          title: 'Add cron file',
          labels: []
        },
        {
          number: 2,
          title: 'Something else',
          labels: []
        }]);

    nock('https://api.github.com')
      .get('/repos/owner/repo/pulls/1').reply(200, {
        url: 'www.iamaurl.com',
        merged: true,
        labels: ['emergency-approval'],
      });

    nock('https://api.github.com')
      .get('/repos/owner/repo/pulls/2').reply(200, {
        url: 'www.iamaurl.com',
        merged: true,
        labels: ['emergency-approval', 'posthoc-approval'],
      });

    await onCron(
      ghClient,
      {},
      input,
    );

    expect(slackMsg).toEqual({text: 'Emergency merged PR needs still needs a review! www.iamaurl.com'})
  });
});
