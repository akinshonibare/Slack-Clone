import React, { Component } from 'react';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';

class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
    openInvitePeopleModal: false,
  };

  toggleAddChannelModal = () => {
    this.setState((state) => ({
      openAddChannelModal: !state.openAddChannelModal,
    }));
  };

  toggleInvitePeopleModal = () => {
    this.setState((state) => ({
      openInvitePeopleModal: !state.openInvitePeopleModal,
    }));
  };

  render() {
    const { teams, team } = this.props;
    const { openAddChannelModal, openInvitePeopleModal } = this.state;
    let username = '';
    let isOwner = false;

    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);

      username = user.username;
      isOwner = user.id === team.owner;

    } catch (err) {}

    return [
      <Teams key="team-sidebar" teams={teams} />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        isOwner={isOwner}
        channels={team.channels}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
        onAddChannelClick={this.toggleAddChannelModal}
        onInvitePeopleClick={this.toggleInvitePeopleModal}
      />,
      <AddChannelModal
        teamId={team.id}
        open={openAddChannelModal}
        key="sidebar-add-channel-modal"
        onClose={this.toggleAddChannelModal}
      />,
      <InvitePeopleModal
        teamId={team.id}
        open={openInvitePeopleModal}
        key="sidebar-invite-people-modal"
        onClose={this.toggleInvitePeopleModal}
      />,
    ];
  }
}

export default Sidebar;
