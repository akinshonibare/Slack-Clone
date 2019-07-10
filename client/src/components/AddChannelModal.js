import React from 'react';
import { Form, Modal, Input } from 'antd';
import { withFormik } from 'formik';
import findIndex from 'lodash/findIndex';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { allTeamsQuery } from '../graphql/team';

const CREATECHANNELMUTATION = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  isSubmitting,
}) => (
  <Modal
    title="Add New Channel"
    centered
    visible={open}
    onOk={handleSubmit}
    okText="Create Channel"
    onCancel={onClose}
    okButtonProps={{ disabled: isSubmitting }}
    cancelButtonProps={{ disabled: isSubmitting }}
  >
    <Form>
      <Form.Item>
        <Input
          placeholder="Channel Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Form.Item>
    </Form>
  </Modal>
);

export default compose(
  graphql(CREATECHANNELMUTATION),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting }
    ) => {
      await mutate({
        variables: { teamId, name: values.name },
        optimisticResponse: {
          __typename: 'Mutation',
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: values.name,
            },
          },
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }
          const data = store.readQuery({ query: allTeamsQuery });
          console.log(data);
          const teamidx = findIndex(data.myTeams, ['id', teamId]);
          data.myTeams[teamidx].channels.push(channel);
          store.writeQuery({ query: allTeamsQuery, data });
        },
      });
      onClose();
      setSubmitting(false);
    },
  })
)(AddChannelModal);
