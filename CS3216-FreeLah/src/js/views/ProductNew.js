import React from 'react';
import {AppStore, ProductCreatingStore} from '../stores';
import {ProductCreatingActions} from '../actions';
import {HeaderConstants} from '../constants';
import Header from './Header';
import mui from 'material-ui';
import {PropTypes} from 'react-router';
import {MenuItem, TextField, RaisedButton, LinearProgress, Dialog} from 'material-ui'
import {Grid, Row, Col} from 'react-bootstrap';

let ThemeManager = new mui.Styles.ThemeManager();

class ProductNew extends React.Component {

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  constructor(props) {
    super(props);
    this.state = ProductCreatingStore.getState();
    this.user = AppStore.getState().user;
    this.onChange = this.onChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
  }

  componentDidMount() {
    ProductCreatingActions.startPost();
    ProductCreatingStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ProductCreatingStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
    console.log(state);
    if (this.state.product !== null) {
      this.context.history.pushState(null, '/products/'+this.state.product.id);
    }
  }

  handlePost(e) {
    e.preventDefault();

    if (!navigator.onLine) {
      this.refs.nointernet.show();
    } else {
      let name = this.refs.productname.refs.input.getDOMNode().value;
      let location = this.refs.location.refs.input.getDOMNode().value;
      let discription = this.refs.description.refs.input.getDOMNode().value;
      let expiryDate = this.refs.expiryDate.refs.input.getDOMNode().value;
      let images = this.state.images;

      ProductCreatingActions.create(this.user, name, location, discription, expiryDate, images);
    }
  }

  handleFileChange(e) {
    this.setState({imageFileName: e.target.value.split(/[/\\]+/)[(e.target.value.split(/[/\\]+/).length-1 )]});

    let reader = new FileReader();
    reader.onload = function(upload) {
      ProductCreatingActions.uploadImages(upload.target.result.split(',')[1]);
    }
    reader.readAsDataURL(e.target.files[0]);

    // var file = e.target.files[0];
    // var reader = new FileReader();  

    // reader.onload = function(e) {
    //   var img = document.createElement("img");
    //   var canvas = document.createElement("canvas");
    //   var ctx = canvas.getContext("2d");

    //   img.src = e.target.result;

    //   var MAX_WIDTH = 600;
    //   var MAX_HEIGHT = 600;
    //   var width = img.width;
    //   var height = img.height;

    //   if (width > height) {
    //     if (width > MAX_WIDTH) {
    //       height *= MAX_WIDTH / width;
    //       width = MAX_WIDTH;
    //     }
    //   } else {
    //     if (height > MAX_HEIGHT) {
    //       width *= MAX_HEIGHT / height;
    //       height = MAX_HEIGHT;
    //     }
    //   }

    //   canvas.width = width;
    //   canvas.height = height;
    //   ctx.drawImage(img, 0, 0, width, height);
    //   var dataurl = canvas.toDataURL();
    //   ProductCreatingActions.uploadImages(dataurl.split(',')[1]);
    //   // this.setState({errors: {errors: [{path:'imgUrls', message:dataurl}]}});
    // }
    // reader.readAsDataURL(file);
  }

  handleGoBack() {
    this.context.history.pushState(null, '/');
  }

  render() {
    let errors = this.state.errors ? this.state.errors.errors : this.state.errors;
    let map = {name:0, location:1, description:2, expiryDate:3, imgUrls:4}
    var error = [null, null, null, null, null]; 

    for (var i in errors) {
      error[map[errors[i].path]] = errors[i].message
        .replace('null', 'empty').replace('imgUrls', 'image').replace('expiryDate', 'Bidding period');
    }
    
    if (this.state.errors && this.state.errors.message && this.state.errors.message.indexOf("is not a valid integer") > -1) {
      error[map['expiryDate']] = 'Bidding time should be an interger';
    }

    return (
      <div className='newproduct'>
        <Header leftItemTouchTap={this.handleGoBack} mode={HeaderConstants.NEWPRODUCT} />

        <Grid>
          <div className="fl-auth lead">
          <form bsStyle="inline" onSubmit={this.handleLogin}>
          <Row>
            <Col style={{paddingLeft: '20px', paddingRight:'20px'}}>
              <TextField ref="productname" hintText="Product Name" floatingLabelText="Product Name" required={true} errorText={error[map['name']]} fullWidth/>
              <TextField ref="location" hintText="Location" floatingLabelText="Location" required={true} errorText={error[map['location']]} fullWidth/>
              <TextField ref="description" hintText="Description" floatingLabelText="Description" required={true} errorText={error[map['description']]} fullWidth/>
              <TextField ref="expiryDate" hintText="Enter 0 for 'First come first serve'" floatingLabelText="Bidding Time (in hours)" required={true} errorText={error[map['expiryDate']]} fullWidth/>
              <TextField ref="image" value={this.state.imageFileName} hintText="Upload Image" floatingLabelText="Upload Image" required={true} errorText={error[map['imgUrls']]} fullWidth/>

              <input ref="imageSource" type="file" name="image" accept="image/*;capture=camera" 
                  style={{ height:'100px', marginTop:'-80px', opacity:'0.0', position:'absolute'}} 
                  onChange={this.handleFileChange}/>
            </Col>
          </Row>
          <Row>
            <Col style={{'padding': '20px'}}>
              <RaisedButton type="submit" bsStyle="success" onTouchTap={this.handlePost} fullWidth disabled={!!this.state.creating}>
                Submit
              </RaisedButton >
              {this.state.creating ? (<LinearProgress mode="indeterminate"  />) : null}
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

ProductNew.childContextTypes = {
  muiTheme: React.PropTypes.object
};
ProductNew.contextTypes = {
  history: PropTypes.history //from react-router
}
ProductNew.propTypes = {
  params: React.PropTypes.object //from react-router
}

export default ProductNew;

