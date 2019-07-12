import React from 'react';
import { Form, Modal, Input, message as Message } from 'antd';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import normalizeErrors from '../utils/normalizeErrors';

const INVITEPEOPLEMUTATION = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

const InvitePeopleModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  isSubmitting,
  touched,
  errors,
}) => (
  <Modal
    title="Invite People to join your Team"
    centered
    visible={open}
    onOk={handleSubmit}
    okText="Invite"
    onCancel={onClose}
    okButtonProps={{ disabled: isSubmitting }}
    cancelButtonProps={{ disabled: isSubmitting }}
  >
    <Form>
      <Form.Item
        validateStatus={touched.email && errors.email ? 'error' : ''}
        help={touched.email && errors.email ? errors.email[0] : null}
      >
        <Input
          placeholder="User's email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Form.Item>
    </Form>
  </Modal>
);

export default compose(
  graphql(INVITEPEOPLEMUTATION),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting, setErrors }
    ) => {
      const response = await mutate({
        variables: { teamId, email: values.email },
      });
      const { ok, errors } = response.data.addTeamMember;
      console.log(response)
      if (ok) {
        Message.success(`Succesfully added New Member`)
        onClose();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        setErrors(normalizeErrors(errors));
      }
    },
  })
)(InvitePeopleModal);
