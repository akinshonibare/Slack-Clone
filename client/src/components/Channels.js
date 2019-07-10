import React from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';
const paddingLeft = 'padding-left: 10px';

const ChannelWrapper = styled.div`
  padding: 10px 0;
  grid-column: 2;
  grid-row: 1 /4;
  background-color: #003249;
  color: #CCDBDC;
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
    background: #007EA7;
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

export default ({ teamName, username, channels, users, onAddChannelClick }) => (
  <ChannelWrapper>
    <PushRight>
      <TeamNameHeader>{teamName}</TeamNameHeader>
      <p>{username}</p>
    </PushRight>
    <div>
      <SideBarList>
        <SideBarListHeader>Channels <Icon type="plus-circle" onClick={onAddChannelClick}/></SideBarListHeader>
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
