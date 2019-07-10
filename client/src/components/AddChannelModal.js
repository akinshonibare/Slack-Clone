import React from 'react';
import { Form, Modal, Input } from 'antd';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const CREATECHANNELMUTATION = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name)
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
    handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting }) => {
      await mutate({ variables: { teamId, name: values.name } });
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
