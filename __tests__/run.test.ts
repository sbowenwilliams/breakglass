jest.mock('./../src/on_issue');
jest.mock('./../src/on_pull_request');
jest.mock('./../src/on_cron');

jest.mock('./../src/input', () => {
  return {
    getInput: jest.fn(),
  };
});

jest.mock('@actions/github', () => {
  return {
    context: {},
    GitHub: jest.fn(),
  };
});

jest.mock('@actions/core', () => {
  return {
    debug: jest.fn(),
    getInput: jest.fn(),
    setFailed: jest.fn(),
  };
});

import { mocked } from 'ts-jest/utils';
import { run } from './../src/run';
import { onIssue } from './../src/on_issue';
import { onPullRequest } from './../src/on_pull_request';
import { onCron } from './../src/on_cron';
import * as core from '@actions/core'
import * as github from '@actions/github';

describe('::run', () => {
  describe('pr event', () => {
    beforeEach(() => {
      github.context.eventName = 'pull_request';
    });

    it('only runs onPullRequest', () => {
      run();
      expect(onPullRequest).toHaveBeenCalled();
      expect(onIssue).not.toHaveBeenCalled();
    });
  });

  describe('issue event', () => {
    beforeEach(() => {
      github.context.eventName = 'issues';
    });

    it('runs onIssue', () => {
      run();
      expect(onIssue).toHaveBeenCalled();
      expect(onPullRequest).not.toHaveBeenCalled();
    });
  });

  describe('cron event', () => {
    beforeEach(() => {
      github.context.eventName = 'cron';
    })

    it('runs onCron', () => {
      run();
      expect(onCron).toHaveBeenCalled();
    });

  })

  describe('unsuppored event', () => {
    beforeEach(() => {
      github.context.eventName = 'non_supported_event';
    });

    it('fails the workflow', () => {
      run();
      expect(core.setFailed).toHaveBeenCalledWith(expect.stringMatching(/unsupported/));
    });
  });

  describe('on error', () => {
    beforeEach(() => {
      github.context.eventName = 'issues';
    });

    it('fails the workflow', () => {
      const message = 'oh no!';
      const error = new Error(message);
      mocked(onIssue).mockImplementation(() => {
        throw error;
      });
      run();
      expect(core.setFailed).toHaveBeenCalledWith(message);
    });
  });
});
