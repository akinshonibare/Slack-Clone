import React, { Component } from 'react';
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

const NEWMESSAGESUBSCRIPTION = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

class MessageContainer extends Component {
  componentDidMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ channelId }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }
  }
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (channelId) =>
    this.props.data.subscribeToMore({
      document: NEWMESSAGESUBSCRIPTION,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);
        if (!subscriptionData.data) return prev;

        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.data.newChannelMessage],
        };
      },
    });

  render() {
    const {
      data: { loading, messages },
    } = this.props;

    return loading ? null : (
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
  }
}

export default graphql(MESSAGESQUERY, {
  variables: (props) => ({
    channelId: props.channelId,
  }),
  options: {
    fetchPolicy: 'network-only',
  },
})(MessageContainer);
