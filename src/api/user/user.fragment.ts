import { gql } from 'apollo-server-express';

export const UserResponseFragment = gql`
  fragment UserResponse on UserResponse {
    id
    name
    email
  }
`;
