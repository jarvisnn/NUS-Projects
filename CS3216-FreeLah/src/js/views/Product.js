import React from 'react';
import {ProductStore, AppStore} from '../stores';
import {AppActions, ProductActions} from '../actions';
import {HeaderConstants} from '../constants';
import ProductCard from './ProductCard';
import Header from './Header';
import mui, {Paper} from 'material-ui';
import {PropTypes} from 'react-router';

let ThemeManager = new mui.Styles.ThemeManager();

class Product extends React.Component {

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  constructor(props) {
    super(props);
    this.state = ProductStore.getState();
    this.onChange = this.onChange.bind(this);
    this.onAppStoreChange = this.onAppStoreChange.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
    this.state.user = AppStore.getState().user;
  }

  componentDidMount() {
    ProductStore.listen(this.onChange);
    const id = this.props.params.id;
    ProductActions.getProduct(id);
    AppStore.listen(this.onAppStoreChange);
    if (this.state.user) {
      AppActions.retrieveNewUserInfo(this.state.user, this.state.user.id);
    } 
  }

  componentWillUnmount() {
    ProductStore.unlisten(this.onChange);
    AppStore.unlisten(this.onAppStoreChange);
  }

  onChange(state) {
    this.setState(state);
  }

  onAppStoreChange(state) {
    console.log(state);
    this.setState({
      hasUser: state.isLoggedIn,
      user: state.user
    });
  }

  handlePost(e) {

  }
  handleGoBack() {
    this.context.history.goBack();
  }

  render() {
    const product = this.state.product;
    if (!!product) {
      return (
        <div className='product'>
          <Header point={this.state.user?this.state.user.point:0} leftItemTouchTap={this.handleGoBack} mode={HeaderConstants.PRODUCT}/>
          <Paper style={{paddingRight: '10px', paddingBottom:'10px', display: 'flex'}}>
          <ProductCard
            mode='full'
            id={product.id}
            name={product.name}
            description={product.description}
            status={product.status}
            location={product.location}
            expiryDate={product.expiryDate}
            imgUrls={product.imgUrls}
            userId={product.userId}
            highestBid={product.highestBid}
            createdAt={product.createdAt}
            buyerId={product.buyerId}
          />
          </Paper>
        </div>
      );
    } else {
      return <div className='product'/>;
    }

  }
}

Product.childContextTypes = {
  muiTheme: React.PropTypes.object
};

Product.propTypes = {
  params: React.PropTypes.object //from react-router
}
Product.contextTypes = {
  history: PropTypes.history
}
export default Product;

