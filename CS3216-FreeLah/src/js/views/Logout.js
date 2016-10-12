import React from 'react';
import {PropTypes} from 'react-router'
import {AppStore} from '../stores';
import AppActions from '../actions/AppActions';
import {Grid} from 'react-bootstrap';

class Logout extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    AppActions.logout();
    this.context.history.pushState(null, '/');
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Grid>
      </Grid>
    );
  }

}

Logout.contextTypes = {
  history: PropTypes.history
}

export default Logout;

