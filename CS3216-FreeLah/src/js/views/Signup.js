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

class Signup extends React.Component {

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = AppStore.getState();
    this.onChange = this.onChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
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
    this.context.history.pushState('/')
  }

  handleSignUp(e) {
    e.preventDefault();

    if (!navigator.onLine) {
      this.refs.nointernet.show();
    } else {
      let username = this.refs.username.refs.input.getDOMNode().value;
      let password = this.refs.password.refs.input.getDOMNode().value;
      let email = this.refs.email.refs.input.getDOMNode().value;
      let phoneNumber = this.refs.phone.refs.input.getDOMNode().value;
      let confirmPassword = this.refs.confirmPassword.refs.input.getDOMNode().value;
      if (password === confirmPassword) {
        AppActions.signup(username, email, phoneNumber, password);  
      } else {
        console.log("Sign Up failed!");
        this.setState({error: {errors: [{path: 'confirmPassword', message: 'Password does not match'}]}});
      }
    }
  }

  render() {
    console.log(this.state.error);

    let errors = this.state.error ? this.state.error.errors : this.state.error;
    let map = {username:0, email:1, phoneNumber:2, password:3, confirmPassword:4}
    var error = [null, null, null, null, null]; 

    for (var i in errors) {
      error[map[errors[i].path]] = errors[i].message.replace('null', 'empty').replace('phoneNumber', 'Phone number');
    }

    if (this.state.error && this.state.error.message && this.state.error.message.indexOf("is not a valid integer") > -1) {
      error[map['phoneNumber']] = 'Phone number can only contain digits'
    }

    return (
      <div className='signup'>
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
        <form bsStyle="inline" onSubmit={this.handleSignUp}>
        <Row>
          <Col style={{paddingLeft: '20px', paddingRight:'20px'}}>
            <TextField autoCapitalize="none" ref="username" hintText="User Name" floatingLabelText="User Name" required={true} errorText={error[map['username']]} fullWidth/>
            <TextField autoCapitalize="none" type="email" ref="email" hintText="Email" floatingLabelText="Email" required={true} errorText={error[map['email']]} fullWidth/>
            <TextField ref="phone" hintText="Phone Number" floatingLabelText="Phone Number" required={true} errorText={error[map['phoneNumber']]} fullWidth/>
            <TextField autoCapitalize="none" ref="password" hintText="Password" floatingLabelText="Password" type="password" required={true} errorText={error[map['password']]} minLength={5} fullWidth/>
            <TextField autoCapitalize="none" ref="confirmPassword" hintText="Confirm Password" floatingLabelText="Confirm Password" type="password" required={true} errorText={error[map['confirmPassword']]} minLength={5} fullWidth/>
          </Col>
        </Row>
        <Row>
          <Col style={{'padding': '20px'}}>
            <RaisedButton type="submit" bsStyle="success" onTouchTap={this.handleSignUp} fullWidth disabled={!!this.state.signingUp}>
              Sign up
            </RaisedButton >
            {this.state.signingUp ? (<LinearProgress mode="indeterminate"  />) : null}
            <Link to={`/login`} style={{textAlign: 'center', fontSize:'14px'}}>
                <p style={{paddingTop:'5px', color:'blue'}}>Already have an account?</p>
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
        Sorry this command need an internet connection. Please try again later.
      </Dialog>
      </div>
    );
  }

}
Signup.childContextTypes = {
  muiTheme: React.PropTypes.object
};
Signup.contextTypes = {
  history: PropTypes.history
}
Signup.contextTypes = {
  history: PropTypes.history
}

export default Signup;

