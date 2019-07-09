import React from 'react';
import styled from 'styled-components';

const paddingLeft = 'padding-left: 10px';

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 /4;
  background-color: #4e3a4c;
  color: #958993;
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
    background: #3e313c;
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

const channel = ({ id, name }) => (
  <SideBarListItem key={`channel-${id}`}># {name}</SideBarListItem>
);
const user = ({ id, name }) => (
  <SideBarListItem key={`user-${id}`}>
    <Bubble /> {name}
  </SideBarListItem>
);

export default ({ teamName, username, channels, users }) => (
  <ChannelWrapper>
    <PushRight>
      <TeamNameHeader>{teamName}</TeamNameHeader>
      <p>{username}</p>
    </PushRight>
    <div>
      <SideBarList>
        <SideBarListHeader>Channels</SideBarListHeader>
        {channels.map(channel)}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>Direct Messages</SideBarListHeader>
        {users.map(user)}
      </SideBarList>
    </div>
  </ChannelWrapper>
);
