import gql from 'graphql-tag';

export const allTeamsQuery = gql`
  {
    myTeams {
      id
      name
      channels {
        id
        name
      }
    }
    invitedToTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;
