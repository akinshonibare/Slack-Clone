import React from 'react';
import styled from 'styled-components';
import { Input } from 'antd';

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

export default ({ channelName }) => (
  <SendMessageWrapper>
    <Input placeholder={`Message # ${channelName}`}/>
  </SendMessageWrapper>
);
