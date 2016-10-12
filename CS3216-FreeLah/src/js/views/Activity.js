import React from 'react';
import {PropTypes, Link} from 'react-router'
import {AppStore, ActivityStore} from '../stores';
import ActivityActions from '../actions/ActivityActions';
import mui, {LeftNav, MenuItem, Card, CardTitle, CardText} from 'material-ui';
import Header from './Header';
import {HeaderConstants} from '../constants';

let ThemeManager = new mui.Styles.ThemeManager();
class Activity extends React.Component {

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }
  constructor(props, context) {
    super(props. context);
    this.state = ActivityStore.getState();
    this.onChange = this.onChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.toggleLeftNav = this.toggleLeftNav.bind(this);
    this.state.user = AppStore.getState().user;
    this.state.hasUser = AppStore.getState().isLoggedIn;
  }

  componentDidMount() {
    ActivityStore.listen(this.onChange);
    ActivityActions.getActivity(this.state.user.id, this.state.user.basicAuth);
  }

  componentWillUnmount() {
    ActivityStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleUpdate(e) {
    ActivityActions.getActivity(this.state.user.id, this.state.user.basicAuth);
  }

  toggleLeftNav(){
    this.refs.leftNav.toggle();
  }


  render() {
    const pageMenuItems = [
      {
        type: MenuItem.Types.LINK,
        text: 'Home',
        payload: '/'
      },
      {
        type: MenuItem.Types.LINK,
        text: 'About',
        payload: '/about'
      }
    ];

    var menuItems;
    if (this.state.hasUser) {
      menuItems = pageMenuItems.concat([{
        type: MenuItem.Types.LINK,
        text: 'Activity',
        payload: '/activity'
      },
      {
        type: MenuItem.Types.LINK,
        text: 'Log out',
        payload: '/logout'
      }]);
    } else {
      menuItems = pageMenuItems.concat([{
        type: MenuItem.Types.LINK,
        text: 'Log in',
        payload: '/login'
      },
      {
        type: MenuItem.Types.LINK,
        text: 'Sign up',
        payload: '/signup'
      }]);
    }
    console.log(this.state);
    let items = [];
    if (this.state.activities) {
      items= this.state.activities.map((activity, i) => {
        console.log(activity);
        return (
          <Link to={activity.productId==-1 ? '/products/new' : '/products/'+activity.productId}>
            <Card key={i}>
              <CardTitle
              title={activity.title}
              />
              <CardText>
              {activity.message}
              </CardText>
            </Card>
          </Link>
          )
      });
    }
    return (
      <div className='activity'>
        <LeftNav ref="leftNav" docked={false} menuItems={menuItems}/>
        <Header point={this.state.user ? this.state.user.point : 0} leftItemTouchTap={this.toggleLeftNav} mode={HeaderConstants.ACTIVITY} handlePost={this.handlePost} />
        {items}
      </div>
    );
  }

}
Activity.childContextTypes = {
  muiTheme: React.PropTypes.object
};
Activity.contextTypes = {
  history: PropTypes.history
}

export default Activity;

