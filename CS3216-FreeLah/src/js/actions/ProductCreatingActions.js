import alt from '../alt';
import api from '../api';

class ProductCreatingActions {
  uploadImages(images) {
    this.dispatch(images);
  }

  create(user, name, location, description, expiryDate, images) {
    this.dispatch();
    api.createProduct(user, {name, location, description, expiryDate, images})
      .then((res) => {
        console.log(res);
        this.actions.createProductSuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        console.log(err);
        this.actions.createProductFailed(err.body);
      });
  }
  createProductSuccess(data) {
    this.dispatch(data);
  }
  createProductFailed(err) {
    this.dispatch(err);
  }
  startPost() {
    this.dispatch();
  }
}

export default alt.createActions(ProductCreatingActions);
