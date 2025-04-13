// subscriptions.js
import { gql } from "@apollo/client";

export const MESSAGE_ADDED = gql`
  subscription MessageAdded {
    messageAdded {
      id
      content
      timestamp
    }
  }
`;
