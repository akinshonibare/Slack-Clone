import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TeamWrapper = styled.div`
  padding: 10px 0;
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #007ea7;
  color: #ccdbdc;
`;

const TeamList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const TeamListItem = styled.li`
  cursor: pointer;
  height: 50px;
  width: 50px;
  background-color: #003249;
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
    border-color: #80ced7;
    ${'' /* height: 50px;
    width: 50px; */}
  }
`;

const team = ({ id, letter }) => (
  <Link to={`/view-team/${id}`} key={`team-${id}`}>
    <TeamListItem>{letter}</TeamListItem>
  </Link>
);

export default ({ teams }) => (
  <TeamWrapper>
    <TeamList>{teams.map(team)}</TeamList>
  </TeamWrapper>
);
