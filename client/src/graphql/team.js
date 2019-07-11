import gql from 'graphql-tag';

export const allTeamsQuery = gql`
  {
    myTeams {
      id
      name
      owner
      channels {
        id
        name
      }
    }
    invitedToTeams {
      id
      name
      owner
      channels {
        id
        name
      }
    }
  }
`;
