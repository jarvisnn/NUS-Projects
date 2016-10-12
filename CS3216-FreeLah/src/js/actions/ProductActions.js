import alt from '../alt';
import api from '../api';

class ProductActions {
  createProduct(userId, product) {
    this.dispatch();
    api.createProduct(userId, product)
      .then((res) => {
        this.actions.createProductSuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        this.actions.createProductFailed(err);
      });
  }
  createProductSuccess(product) {
    this.dispatch(product);
  }
  createProductFailed(err) {
    this.dispatch(err);
  }

  getProduct(productId) {
    if (this.alt.dispatcher.isDispatching()){
      window.setTimeout(() => {
        this.dispatch();
      })
    } else {
      this.dispatch();
    }
    api.getProduct(productId)
      .then((res) => {
        console.log(res);
        this.actions.getProductSuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        console.log(err);
        this.actions.getProductFailed(err.message, productId);
      });
  }

  getProductSuccess(product) {
    this.dispatch(product);
  }
  getProductFailed(err, productId) {
    this.dispatch({err, productId});
  }

  getAllProducts() {
    if (this.alt.dispatcher.isDispatching()){
      window.setTimeout(() => {
        this.dispatch();
      })
    } else {
      this.dispatch();
    }
    api.getAllProducts()
      .then((res) => {
        this.actions.getAllProductsSuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        this.actions.getAllProductsFailed(err.message);
      });
  }
  getAllProductsSuccess(product) {
    this.dispatch(product);
  }
  getAllProductsFailed(err) {
    this.dispatch(err);
  }


  updateProduct(userId, productId, data) {
    this.dispatch();
    api.updateProduct(userId, productId, data)
      .then((res) => {
        this.actions.updateProductSuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        this.actions.updateProductFailed(err.message);
      });
  }

  updateProductSuccess(user) {
    this.dispatch(user);
  }
  updateProductFailed(err) {
    this.dispatch(err);
  }
}

export default alt.createActions(ProductActions);
