import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';
import Home from './routes/Home';
import Register from './routes/Register';
import Login from './routes/Login';
import CreateTeam from './routes/CreateTeam';
import ViewTeam from './routes/ViewTeam';


const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    decode(token);
    decode(refreshToken);
  } catch (err) {
    return false;
  }
  return true;
};


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      (isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      ))}
  />
);

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <PrivateRoute path="/create-team" exact component={CreateTeam} />
      <PrivateRoute path="/view-team" exact component={ViewTeam} />
    </Switch>
  </BrowserRouter>
);
