import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Comment, List, Avatar } from 'antd';

import Messages from '../components/Messages';

const MESSAGESQUERY = gql`
  query($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;
const MessageContainer = ({ data: { loading, messages } }) =>
  loading ? null : (
    <Messages>
      <List
        className="commentList"
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={(m) => (
          <li>
            <Comment
              // actions={item.actions}
              author={m.user.username}
              avatar={
                <Avatar
                  style={{ color: '#ffffff', backgroundColor: '#007ea7' }}
                >
                  {m.user.username.charAt(0).toUpperCase()}
                </Avatar>
              }
              content={m.text}
              datetime={Date(m.createdAt)}
            />
          </li>
        )}
      />
    </Messages>
  );

export default graphql(MESSAGESQUERY, {
  variables: (props) => ({
    channelId: props.channelId,
  }),
})(MessageContainer);
