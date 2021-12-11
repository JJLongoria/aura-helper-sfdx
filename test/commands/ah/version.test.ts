import { expect, test } from '@salesforce/command/lib/test';

describe('ah:version', () => {
  test
    .stdout()
    .command([])
    .it('runs ah:version', (ctx) => {
      expect(ctx.stdout).to.contain('Aura Helper SFDX Version');
    });
});
