export class PrAuditor {
  pull_requests: any;
  emergency_label: string;
  retroactive_approval_label: string;

  constructor(pull_requests, emergency_label, retroactive_approval_label) {
    this.pull_requests = pull_requests;
    this.emergency_label = emergency_label;
    this.retroactive_approval_label = retroactive_approval_label;
  }

  audit() {
    return this.pull_requests.filter((pr) => {
      return (pr.labels.includes(this.emergency_label))&&(pr.merged)&&(!pr.labels.includes(this.retroactive_approval_label));
    });
  }
}
