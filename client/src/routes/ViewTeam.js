import React from 'react';
import Header from '../components/Header';
import Sidebar from '../containers/Sidebar';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import AppLayout from '../components/AppLayout';

const ViewTeam = ({ match: { params }}) => (
  <AppLayout>
    <Sidebar currentTeamId={params.teamId} />
    <Header channelName="general" />
    <Messages>
      <ul>
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage channelName="general" />
  </AppLayout>
);

export default ViewTeam;
