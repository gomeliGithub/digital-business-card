import { GraphQLDataInterceptor } from './graphql-data.interceptor';

describe('GlobalInterceptor', () => {
  it('should be defined', () => {
    expect(new GraphQLDataInterceptor()).toBeDefined();
  });
});
