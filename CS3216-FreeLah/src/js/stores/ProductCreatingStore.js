import alt from '../alt';
import ProductCreatingActions from '../actions/ProductCreatingActions';

class ProductCreatingStore {
  constructor() {
    this.product = null;
    this.errors = null;
    this.images = null;
    this.creating = false;
    this.bindListeners({
      handleUploadImages: ProductCreatingActions.UPLOAD_IMAGES,
      handleCreate: ProductCreatingActions.CREATE,
      handleCreateProductSuccess: ProductCreatingActions.CREATE_PRODUCT_SUCCESS,
      handleCreateProductFailed: ProductCreatingActions.CREATE_PRODUCT_FAILED,
      handleStartPost: ProductCreatingActions.START_POST
    });
  }

  handleStartPost() {
    this.product = null;
    this.errors = null;
    this.images = null;
  }

  handleCreate() {
    this.creating = true;
  }
  handleUploadImages(images) {
    console.log(images);

    this.images = images;
  }

  handleCreateProductSuccess(data) {
    this.product = data;
    this.creating = false;
  }

  handleCreateProductFailed(err) {
    this.errors = err;
    this.creating = false;
  }

}

export default alt.createStore(ProductCreatingStore, 'ProductCreatingStore');