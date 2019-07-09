import React, { Component } from 'react';
import { Form, Icon, Input, Button, message as Message } from 'antd';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const REGISTERMUTATION = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
    };
  }

  onInputChange = (e) => {
    this.setState({
      usernameError: '',
      passwordError: '',
      emailError: '',
    });
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async (e, register) => {
    e.preventDefault();
    const { username, email, password } = this.state;
    const response = await this.props.mutate({
      variables: { username, email, password },
    });
    const { ok, errors } = response.data.register;

    if (ok) {
      Message.success('successfully registered');
      this.setState({
        username: '',
        password: '',
        email: '',
      });
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      this.setState(err);
    }
  };

  render() {
    return (
      <div className="form-wrapper">
        <Form className="form">
          <Form.Item
            validateStatus={this.state.usernameError ? 'error' : ''}
            help={this.state.usernameError}
          >
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
              onChange={this.onInputChange}
              value={this.state.username}
              name="username"
            />
          </Form.Item>
          <Form.Item
            validateStatus={this.state.emailError ? 'error' : ''}
            help={this.state.emailError}
          >
            <Input
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
              onChange={this.onInputChange}
              value={this.state.email}
              name="email"
            />
          </Form.Item>
          <Form.Item
            validateStatus={this.state.passwordError ? 'error' : ''}
            help={this.state.passwordError}
          >
            <Input.Password
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              onChange={this.onInputChange}
              value={this.state.password}
              name="password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              className="form-button"
            >
              Register Now !
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default graphql(REGISTERMUTATION)(Register);
