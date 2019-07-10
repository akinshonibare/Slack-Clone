import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Input, Button, Icon, Alert, message as Message } from 'antd';

const LOGINMUTATION = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

class Login extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
    });
  }

  handleSubmit = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({
      variables: { email, password },
    });

    console.log(response);

    const { ok, errors, token, refreshToken } = response.data.login;

    if (ok) {
      Message.success('successfully logged in');
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.props.history.push('/');

      this.email = '';
      this.password = '';
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.errors = err;
    }
  };

  onInputChange = (e) => {
    this.errors = {};
    const { name, value } = e.target;

    this[name] = value;
  };

  render() {
    const {
      email,
      password,
      errors: { emailError, passwordError },
    } = this;
    return (
      <div className="form-wrapper">
        <Form className="form">
          <Form.Item
            validateStatus={emailError || passwordError ? 'error' : ''}
          >
            <Input
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
              onChange={this.onInputChange}
              value={email}
              name="email"
            />
          </Form.Item>
          <Form.Item
            validateStatus={emailError || passwordError ? 'error' : ''}
          >
            <Input.Password
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              onChange={this.onInputChange}
              value={password}
              name="password"
            />
          </Form.Item>
          {(emailError || passwordError) && (
            <Alert
              className="login-alert"
              message={emailError || passwordError}
              type="error"
              showIcon
            />
          )}
          <Form.Item>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              className="form-button"
            >
              Login !
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default graphql(LOGINMUTATION)(observer(Login));
