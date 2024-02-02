import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { createUploadLink } from "apollo-upload-client";

const link = createUploadLink({
  uri: 'http://localhost:3000/graphql',
})

export const client = new ApolloClient({
  link:  (link as unknown) as ApolloLink,
  cache: new InMemoryCache().restore({}),
});
