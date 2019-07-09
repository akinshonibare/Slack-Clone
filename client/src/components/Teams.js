import React from 'react';
import styled from 'styled-components';

const TeamWrapper = styled.div`
  padding: 10px 0;
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #362234;
  color: #958993;
`;

const TeamList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const TeamListItem = styled.li`
  cursor: pointer;
  height: 40px;
  width: 40px;
  background-color: #676066;
  color: #ffffff;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 11px;
  &: hover {
    border-style: solid;
    border-width: thick;
    border-color: #767676;
  }
`;

const team = ({ id, letter }) => (
  <TeamListItem key={`team-${id}`}>{letter}</TeamListItem>
);

export default ({ teams }) => (
  <TeamWrapper>
    <TeamList>{teams.map(team)}</TeamList>
  </TeamWrapper>
);
