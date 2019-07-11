import React from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

const paddingLeft = 'padding-left: 10px';

const ChannelWrapper = styled.div`
  padding: 10px 0;
  grid-column: 2;
  grid-row: 1 /4;
  background-color: #003249;
  color: #ccdbdc;
`;

const TeamNameHeader = styled.h1`
  color: #ffffff;
  font-size: 20px;
  margin: 0;
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const SideBarListHeader = styled.li`
  ${paddingLeft}
`;

const SideBarListItem = styled.li`
  cursor: pointer;
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #007ea7;
  }
`;
const PushRight = styled.div`
  ${paddingLeft}
`;
const Green = styled.span`
  color: #38978d;
`;
const Bubble = ({ on = true }) =>
  on ? <Green>&#9679;</Green> : <span>&#9675;</span>;

const channel = ({ id, name }, teamId) => (
  <Link to={`/view-team/${teamId}/${id}`} key={`channel-${id}`}>
    <SideBarListItem># {name}</SideBarListItem>
  </Link>
);
const user = ({ id, name }) => (
  <SideBarListItem key={`user-${id}`}>
    <Bubble /> {name}
  </SideBarListItem>
);

export default ({
  teamName,
  username,
  channels,
  users,
  onAddChannelClick,
  teamId,
  isOwner,
  onInvitePeopleClick,
}) => (
  <ChannelWrapper>
    <PushRight>
      <TeamNameHeader>{teamName}</TeamNameHeader>
      <p>{username}</p>
    </PushRight>
    <div>
      <SideBarList>
        <SideBarListHeader>
          Channels {isOwner && <Icon type="plus-circle" onClick={onAddChannelClick} />}
        </SideBarListHeader>
        {channels.map((c) => channel(c, teamId))}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>Direct Messages</SideBarListHeader>
        {users.map(user)}
      </SideBarList>
    </div>
    {isOwner && (
      <div>
        <a href="#invite-people" onClick={onInvitePeopleClick}>
          + Invite People
        </a>
      </div>
    )}
  </ChannelWrapper>
);
