import React from 'react';
import styled from 'styled-components';
import { PageHeader } from 'antd';

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
`;

export default ({ channelName }) => (
  <HeaderWrapper>
    <PageHeader title={`# ${channelName}`} />
  </HeaderWrapper>
);
