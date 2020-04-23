import * as request from 'request-promise-native';

export class SlackClient {
  hook: string;

  constructor(hook) {
    this.hook = hook;
  }

  async send(message: string) {
    await request({
      uri: this.hook,
      method: 'POST',
      body: {
        text: message,
      },
      json: true,
    });
  }
}
