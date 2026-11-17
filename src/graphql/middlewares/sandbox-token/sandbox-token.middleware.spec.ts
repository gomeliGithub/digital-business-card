import { SandboxTokenMiddleware } from './sandbox-token.middleware';

describe('SandboxTokenMiddleware', () => {
  it('should be defined', () => {
    expect(new SandboxTokenMiddleware()).toBeDefined();
  });
});
