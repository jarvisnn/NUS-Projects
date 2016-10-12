import React from 'react';
import {AppBar, IconButton, FlatButton} from 'material-ui';
import {HeaderConstants} from '../constants';
import {AppStore} from '../stores';
import mui from 'material-ui';
import {Link} from 'react-router'

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.hasUser = AppStore.getState().isLoggedIn
  }

  render() {
    let ThemeManager = new mui.Styles.ThemeManager();
    const styles = {
      buttonText: {
        color: ThemeManager.component.appBar.textColor,
        fill: ThemeManager.component.appBar.textColor
      },
      buttonRoot: {
        backgroundColor: ThemeManager.component.appBar.color,
        paddingTop: '8px'
      },
      container: {},
      imageInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        right: '0px',
        left: '0px',
        width: '100%',
        opacity: '0'
      }
    };

    switch (this.props.mode) {
      case (HeaderConstants.HOME):
        return (
          <AppBar title='FreeLah!'
            iconElementLeft={<IconButton onTouchTap={this.props.leftItemTouchTap} iconClassName='fa fa-bars'/>}
            iconElementRight={<div>
              {
                this.hasUser ? 
                (<Link to={`/products/new`}>
                  <FlatButton label='Post' style={styles.buttonRoot} labelStyle={styles.buttonText}/>
                 </Link>
                ) :
                (<Link to={`/login`}>
                  <FlatButton label='Login' style={styles.buttonRoot} labelStyle={styles.buttonText}/>
                </Link>)
              }
              {
                this.hasUser ? 
                (<Link to={`/activity`}>
                  <FlatButton label={this.props.point+' credits'} style={styles.buttonRoot} labelStyle={styles.buttonText}/>
                </Link>) :
                (<div></div>)
              }
            </div>}
          />
        );
      case (HeaderConstants.PRODUCT):
        return (
          <AppBar title='FreeLah!'
            iconElementLeft={<IconButton onTouchTap={this.props.leftItemTouchTap} iconClassName='fa fa-arrow-left'/>}
            iconElementRight={
              this.hasUser ? 
                ( <FlatButton label={this.props.point+' credits'} labelStyle={styles.buttonText}/>) :
                (<div></div>)
            }
          />
        );
      case (HeaderConstants.NEWPRODUCT):
        return (
          <AppBar title='FreeLah!'
            iconElementLeft={<IconButton onTouchTap={this.props.leftItemTouchTap} iconClassName='fa fa-arrow-left'/>}
            iconElementRight={
              <FlatButton label='New product'/>
            }
          />
        );
      case (HeaderConstants.ONLYBACK):
        return (
          <AppBar title='FreeLah!'
            iconElementLeft={<IconButton onTouchTap={this.props.leftItemTouchTap} iconClassName='fa fa-arrow-left'/>}
            iconElementRight={
              <div></div>
            }
          />
        );
      case (HeaderConstants.ACTIVITY):
        return (
          <AppBar title='FreeLah!'
            onLeftIconButtonTouchTap={this.props.leftItemTouchTap}
            iconElementRight={
              <div></div>
            }
          />
        );
    };
  }
}

Header.propTypes = {
  mode: React.PropTypes.string,
  handlePost: React.PropTypes.func,
  leftItemTouchTap: React.PropTypes.func,
  rightItemTouchTap: React.PropTypes.func,
  hasUser: React.PropTypes.bool,
  point: React.PropTypes.number
}

Header.defaultProps = {
  mode: HeaderConstants.HOME
}

export default Header;