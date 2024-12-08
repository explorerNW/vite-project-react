import { apollo } from './apollo';
export const GET_USER = apollo.gql`
  query getUser {
    getUser {
     name
    }
  }
`;
