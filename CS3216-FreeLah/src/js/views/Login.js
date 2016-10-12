import React from 'react';
import {PropTypes, Link} from 'react-router'
import {AppStore} from '../stores';
import AppActions from '../actions/AppActions';
import {Grid, Row, Col} from 'react-bootstrap';
import {TextField, RaisedButton, Dialog, LinearProgress} from 'material-ui';
import mui from 'material-ui';
import Header from './Header';
import {HeaderConstants} from '../constants'

let ThemeManager = new mui.Styles.ThemeManager();

class Login extends React.Component {

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = AppStore.getState();
    this.onChange = this.onChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
  }

  componentDidMount() {
    if (this.state.user) {
      this.context.history.pushState(null, '/');
    }
    AppStore.listen(this.onChange);
  }

  componentWillUnmount() {
    AppStore.unlisten(this.onChange);
  }


  onChange(state) {
    this.setState(state);
    if (this.state.isLoggedIn) {
      // AppStore.unlisten(this.onChange);   
      console.log(state);
      this.context.history.pushState(null, '/');
    } else if (this.state.error) {
      // error handler
      console.log(state);
    }
  }

  handleGoBack() {
    this.context.history.pushState(null, '/');
  }

  handleLogin(e) {
    e.preventDefault();

    if (!navigator.onLine) {
      this.refs.nointernet.show();
    } else {
      let username = this.refs.username.refs.input.getDOMNode().value;
      let password = this.refs.password.refs.input.getDOMNode().value;
      AppActions.login(username, password);  
    }
  }

  render() {
    var usernameErr = null, passwordErr = null;
    console.log(this.state);
    if (this.state.error && this.state.error.message == 'User does not exist!') {
      usernameErr = 'User does not exist!';
    } else if (this.state.error && this.state.error.message == 'Password is wrong!') {
      passwordErr = 'Password is wrong!';
    } 
    return (
      <div className='login'>
      <Header leftItemTouchTap={this.handleGoBack} mode={HeaderConstants.ONLYBACK}/>
      <Grid>
        <div className="fl-auth lead">
        <Row>
            <Col xs={3} md={4}/>
            <Col xs={6} md={4} style={{textAlign: 'center', paddingTop: '20px'}}>
              <h3>FreeLah</h3>
            </Col>
            <Col xs={3} md={4}/>
        </Row>
        <form bsStyle="inline" onSubmit={this.handleLogin}>
        <Row>
          <Col style={{paddingLeft: '20px', paddingRight:'20px'}}>
            <TextField autoCapitalize="none" ref="username" hintText="User Name" floatingLabelText="User Name" required={true} errorText={usernameErr} fullWidth/>
            <TextField autoCapitalize="none" ref="password" hintText="Password" floatingLabelText="Password" type="password" required={true} errorText={passwordErr} minLength={5} fullWidth/>
          </Col>
        </Row>
        <Row>
          <Col style={{'padding': '20px'}}>
          
            <RaisedButton type="submit" bsStyle="success" onTouchTap={this.handleLogin} fullWidth disabled={!!this.state.loggingIn}>
              Log in
            </RaisedButton >
            {this.state.loggingIn ? (<LinearProgress mode="indeterminate"/>) : null}
            <Link to={`/signup`} style={{textAlign: 'center', fontSize:'14px'}}>
                <p style={{paddingTop:'5px', color:'blue'}}>Don't have an account?</p>
            </Link>
          </Col>
        </Row>
        </form>
        </div>
      </Grid>
      <Dialog ref='nointernet'
        title="No internet connection"
        actions={[{text: 'OK'}]}
        modal={false}
      >
        Sorry this command needs an internet connection. Please try again later.
      </Dialog>
      </div>
    );
  }

}
Login.childContextTypes = {
  muiTheme: React.PropTypes.object
};
Login.contextTypes = {
  history: PropTypes.history
}

export default Login;

