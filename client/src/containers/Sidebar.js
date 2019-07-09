import React from 'react';
import _ from 'lodash';
import gql from 'graphql-tag';
import decode from 'jwt-decode';
import { graphql } from 'react-apollo';

import Channels from '../components/Channels';
import Teams from '../components/Teams';

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

const Sidebar = ({ data: { loading, allTeams }, currentTeamId }) => {
  if (loading) {
    return null;
  }

  const teamIdx = _.findIndex(allTeams, ['id', currentTeamId]);

  const team = allTeams[teamIdx];

  let username;

  try {
    const token = localStorage.getItem('token');
    const { user } = decode(token);

    username = user.username;
  } catch (err) {}

  return [
    <Teams
      key="team-sidebar"
      teams={allTeams.map((t) => ({
        id: t.id,
        letter: t.name.charAt(0).toUpperCase(),
      }))}
    />,
    <Channels
      key="channels-sidebar"
      teamName={team.name}
      username={username}
      channels={team.channels}
      users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
    />,
  ];
};

export default graphql(allTeamsQuery)(Sidebar);
