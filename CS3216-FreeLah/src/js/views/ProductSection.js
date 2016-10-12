import React from 'react';
import ProductCard from './ProductCard';
import {CircularProgress, Paper, Snackbar} from 'material-ui';
import {Link} from 'react-router';

class ProductSection extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleScroll = this.handleScroll.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.dismissSnackbar = this.dismissSnackbar.bind(this);
    this.state = {
      products: [],
      page: 0,
      loadingFlag: false,
      hasMore: true
    }

  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    let windowHeight = document.body.clientHeight;
    let inHeight = window.innerHeight;
    let scrollT = document.body.scrollTop;
    let totalScrolled = scrollT+inHeight;

    if (totalScrolled + 100 > windowHeight && this.state.hasMore) {
      if (!this.state.loadingFlag) {
        this.setState({
          loadingFlag: true
        })
        setTimeout(this.loadMore, 1500);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.hasMore && prevState.hasMore) {
      this.refs.snackbar.show()
    }
    if (this.state.page === 0 && !!this.props.products) this.loadMore();
  }

  dismissSnackbar() {
    this.refs.snackbar.dismiss()
  }

  loadMore() {
   
    let hasMore = this.state.hasMore;
    let products = this.props.products;

    if (hasMore) { 
      let newProducts = [];
      let nextPage = this.state.page;
      if (!!products) {
        nextPage = this.state.page + 1;
        let nextCount = nextPage*10;
        if (nextCount>products.length) {
          nextCount = products.length;
          hasMore = false;
        }
        for (let i = this.state.page*10; i<nextCount; i++) {
          let product = this.props.products[i];
          newProducts.push(product);
        };
      }
      this.setState({
        products: this.state.products.concat(newProducts),
        loadingFlag: false,
        page:nextPage,
        hasMore
      });
    }
  }

  render() {
    let style = {
      wrapper : {
        width:'50%'
        // float:'left'
      }
    }
    let productList = [];
    if (!!this.state.products) {
      this.state.products.forEach((product, i) => {
        productList.push(
          <Link style={style.wrapper} key={i}
          to={`/products/${product.id}`}>
            <ProductCard key={i}
                id={product.id}
                mode='overview'
                name={product.name}
                description={product.description}
                status={product.status}
                location={product.location}
                expiryDate={product.expiryDate}
                highestBid={product.highestBid}
                imgUrls={product.imgUrls}
                userId={product.userId}
                createdAt={product.createdAt}/>
          </Link>
        );
      });
    }
    let snackbar = (
      <Snackbar
        ref='snackbar'
        message="No more items"
        action="dismiss"
        autoHideDuration={3000}
        onActionTouchTap={this.dismissSnackbar}
      />);
    return (
      <div className='productSection'>
        <Paper style={{display: 'flex', flexWrap: 'wrap', paddingRight: '10px', paddingBottom: '10px'}}>
          {productList}
           {this.state.loadingFlag ? (<div className='center'><CircularProgress mode='indeterminate'/></div>) : null}
        </Paper>
        {snackbar}
      </div>
    );
  }
}

ProductSection.propTypes = {
  products: React.PropTypes.array
};

export default ProductSection;