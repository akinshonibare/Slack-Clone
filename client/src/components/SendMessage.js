import React from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const ENTER_KEY = 13;

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const CREATEMESSAGEMUTATION = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

const SendMessage = ({
  channelName,
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  isSubmitting,
}) => (
  <SendMessageWrapper>
    <Input
      onKeyDown={(e) => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      onChange={handleChange}
      onBlur={handleBlur}
      name="message"
      value={values.message}
      placeholder={`Message # ${channelName}`}
    />
  </SendMessageWrapper>
);

export default compose(
  graphql(CREATEMESSAGEMUTATION),
  withFormik({
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (
      values,
      { props: { channelId, mutate }, setSubmitting, resetForm }
    ) => {
      if (!values.message || !values.message.trim()) {
        setSubmitting(false);
        return;
      }

      await mutate({
        variables: { channelId, text: values.message },
      });
      resetForm(false);
    },
  })
)(SendMessage);
