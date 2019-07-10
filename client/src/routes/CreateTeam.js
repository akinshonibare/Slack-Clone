import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Form, Input, Button, Icon, message as Message } from 'antd';

const CREATETEAMMUTATION = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

class CreateTeam extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      name: '',
      errors: {},
    });
  }

  handleSubmit = async (login) => {
    const { name } = this;
    let response = null;

    try {
      response = await this.props.mutate({
        variables: { name },
      });
    } catch (err) {
      this.props.history.push('/login');
      return;
    }

    console.log(response);

    const { ok, errors, team } = response.data.createTeam;

    if (ok) {
      Message.success('successfully created team');
      this.name = '';
      this.props.history.push(`/view-team/${team.id}`);
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
      name,
      errors: { nameError },
    } = this;
    return (
          <div className="form-wrapper">
            <Form className="form">
              <Form.Item
                validateStatus={nameError ? 'error' : ''}
                help={nameError}
              >
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Name"
                  onChange={this.onInputChange}
                  value={name}
                  name="name"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  className="form-button"
                >
                  Create
                </Button>
              </Form.Item>
            </Form>
          </div>
    );
  }
}

export default graphql(CREATETEAMMUTATION)(observer(CreateTeam));
