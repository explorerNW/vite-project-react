import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import environment from './environments/local.environment';

const customLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    return response;
  });
});
const httpLink = new HttpLink({
  uri: `https://${environment.apiHost}/graphql`,
});

const client = new ApolloClient({
  link: customLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const apollo = { client, ApolloProvider, gql, useQuery };
