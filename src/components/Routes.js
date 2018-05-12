import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom';

export const AuthorizedRoute = ({ component: Component, isUser, ...rest }) => (
  <Route {...rest} render={props => {
    return isUser ? <Component {...props} {...rest} />
      : <Redirect to="/register" />
  }} />
)

export  const UnauthorizedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <Component {...props} {...rest}/>
  )}/>
)
