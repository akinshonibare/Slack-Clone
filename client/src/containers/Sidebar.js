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

  handleAddChannelClick = () => {
    this.setState({
      openAddChannelModal: true,
    });
  };

  handleInvitePeopleClick = () => {
    this.setState({
      openInvitePeopleModal: true,
    });
  };

  handleCloseAddChannelModal = () => {
    this.setState({
      openAddChannelModal: false,
    });
  };

  handleCloseInvitePeopleModal = () => {
    this.setState({
      openInvitePeopleModal: false,
    });
  };

  render() {
    const { teams, team } = this.props;
    const { openAddChannelModal, openInvitePeopleModal } = this.state;
    let username;

    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);

      username = user.username;
    } catch (err) {}

    return [
      <Teams key="team-sidebar" teams={teams} />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        channels={team.channels}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
        onAddChannelClick={this.handleAddChannelClick}
        onInvitePeopleClick={this.handleInvitePeopleClick}
      />,
      <AddChannelModal
        teamId={team.id}
        open={openAddChannelModal}
        key="sidebar-add-channel-modal"
        onClose={this.handleCloseAddChannelModal}
      />,
      <InvitePeopleModal
        teamId={team.id}
        open={openInvitePeopleModal}
        key="sidebar-invite-people-modal"
        onClose={this.handleCloseInvitePeopleModal}
      />,
    ];
  }
}

export default Sidebar;
