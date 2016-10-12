import React from 'react';
import {ProductStore, AppStore} from '../stores';
import {ProductActions, AppActions} from '../actions';
import {HeaderConstants} from '../constants';
import Header from './Header';
import ProductSection from './ProductSection';
import mui, {LeftNav, MenuItem, Dialog} from 'material-ui';
import {PropTypes} from 'react-router';

let ThemeManager = new mui.Styles.ThemeManager();

class Home extends React.Component {

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = ProductStore.getState();
    this.onChange = this.onChange.bind(this);
    this.onAppStoreChange = this.onAppStoreChange.bind(this);
    this.toggleLeftNav = this.toggleLeftNav.bind(this);
    this.state.hasUser = AppStore.getState().isLoggedIn;
    this.state.user = AppStore.getState().user;
    this.state.showOnboardingAbout = AppStore.getState().showOnboardingAbout;
    this.state.showOnboardingDialog = AppStore.getState().showOnboardingDialog;
  }

  componentWillMount() {
  }

  componentDidMount() {
    ProductStore.listen(this.onChange);
    ProductActions.getAllProducts();
    AppStore.listen(this.onAppStoreChange);
    if (this.state.user) {
      AppActions.retrieveNewUserInfo(this.state.user, this.state.user.id);
    } else if (!this.state.showOnboardingAbout) {
      AppActions.showOnboardingAbout();
      this.context.history.pushState(null, '/about');
    } else if (!this.state.showOnboardingDialog) {
      AppActions.showOnboardingDialog();
      this.refs.onboarding.show();
    }
  }

  componentWillUnmount() {
    ProductStore.unlisten(this.onChange);
    AppStore.unlisten(this.onAppStoreChange);
  }

  onChange(state) {
    if (!!React.findDOMNode(this)) {
      this.setState(state);
    }
  }

  onAppStoreChange(state) {
    console.log(state);
    this.setState({
      hasUser: state.isLoggedIn,
      user: state.user
    });
  }


  toggleLeftNav(){
    this.refs.leftNav.toggle();
  }

  render() {
    let products = this.state.retrievedProducts;
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
    return (
      <div className='home'>
        <LeftNav ref="leftNav" docked={false} menuItems={menuItems}/>
        <Header point={this.state.user ? this.state.user.point : 0} leftItemTouchTap={this.toggleLeftNav} mode={HeaderConstants.HOME} />
        <ProductSection products={products}/>
        <Dialog ref='onboarding'
          title="Welcome"
          actions={[{text: 'OK'}]}
          modal={false}
        >
        Feel free to browse the items here.<br/>Sign up or login to start posting and getting some free stuff!
        </Dialog>
      </div>
    );

  }
}

Home.childContextTypes = {
  muiTheme: React.PropTypes.object
};
Home.contextTypes = {
  history: PropTypes.history
}
export default Home;

