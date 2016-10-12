import React from 'react';
import {Card, CardMedia, CardText} from 'material-ui';
import CountdownTimer from './CountdownTimer';
import {BidStore, AppStore} from '../stores';
import {AppActions, ProductActions, BidActions} from '../actions/';
import {TextField, RaisedButton, Dialog} from 'material-ui';
import {Link, PropTypes} from 'react-router';

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.user = AppStore.getState().user;
    this.state = BidStore.getState();
    this.handleBidding = this.handleBidding.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    BidStore.listen(this.onChange);
  }

  componentWillUnmount() {
    BidStore.unlisten(this.onChange);
    BidActions.clearStore();
  }

  onChange(state) {
    this.setState(state);
    if (this.state.isDone) {
      BidActions.clearStore();
      ProductActions.getProduct(this.props.id);
      if (this.user) {
        AppActions.retrieveNewUserInfo(this.user, this.user.id);
      }
    }

  }


  handleBidding(e) {
    e.preventDefault();

    if (!navigator.onLine) {
      this.refs.nointernet.show();
    } else {
      let biddingPoint = this.refs.biddingPoint.refs.input.getDOMNode().value;
      BidActions.bid(this.user.id, this.props.id, biddingPoint)
    }
  }

  render() {
    let style = {
      card : {
        paddingBottom:'0px',
        marginTop:'10px',
        marginLeft:'10px',
      },
      cardTitleSummary: {
        width: '100%',
        fontSize: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      cardTextSummary: {
        width: '100%',
        fontSize: '13px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      cardTextFull: {
        fontSize: '14px',
      }
    }
    var imgUrl = this.props.imgUrls ? '/' + this.props.imgUrls.replace(' ', '') : "http://lorempixel.com/600/337/cats/";
    var biddingText = "" + this.props.highestBid;
    if (this.user != null && this.props.buyerId == this.user.id) {
      biddingText += ' (your bidding)'
    }

    var timeLeft = 0;
    if (this.props.status == 'bidding') {
      var currentTime = new Date();
      var createdTime = new Date(this.props.createdAt);
      var timePassed = Math.round((currentTime - createdTime) / 1000);
      timeLeft = Math.max(0, - timePassed + this.props.expiryDate*3600);
    }

    var button = null, input = null;
    var error = this.state.error;
    if (!this.user) {
      button = <Link to={`/login`}><RaisedButton type="submit" bsStyle="success" fullWidth>
        Log in to bid
      </RaisedButton></Link>
    } else if (this.props.status == 'bidding') {
      input = <TextField ref="biddingPoint" hintText="0" floatingLabelText="Bidding Point" required={true} errorText={error} fullWidth/>
      button = <RaisedButton type="submit" bsStyle="success" onTouchTap={this.handleBidding} fullWidth>
        Bid Now
      </RaisedButton>
    }

    return (
      <div>
      <Card style={style.card}>
        <CardMedia >
          <img src={imgUrl}/>
        </CardMedia>
        <CardText style={{marginBottom:'-16px', padding:'8px'}}>
          {this.props.mode === 'full' ? (<div style={{fontSize: '20px'}}><strong>{this.props.name}</strong></div>): (<div style={style.cardTitleSummary}><strong>{this.props.name}</strong></div>)}
          {this.props.mode === 'full' ? (<div style={style.cardTextFull}><b>Location</b>: {this.props.location}</div>) : (<div style={style.cardTextSummary}>Location: {this.props.location}</div>)}
          {this.props.mode === 'full' ? (<div style={style.cardTextFull}><b>Description:</b> {this.props.description}</div>) : null}
          {this.props.mode === 'full' ? (<div style={style.cardTextFull}><b>Highest bid: </b> {biddingText} </div>) : (<div style={style.cardTextSummary}>Highest bid: {biddingText}</div>)}
          <CountdownTimer expiryDate = {this.props.expiryDate} seconds={timeLeft} highestBid={this.props.highestBid} status={this.props.status}/>
          {this.props.mode === 'full' ? 
            {input,button}
            : (<div></div>)
          }
        </CardText>
      </Card>
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

ProductCard.propTypes = {
  id: React.PropTypes.number,
  mode: React.PropTypes.oneOf(['overview', 'full']),
  name: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  imgUrls: React.PropTypes.string,
  status: React.PropTypes.oneOf(['available', 'bidding', 'expired', 'given']),
  location: React.PropTypes.string.isRequired,
  expiryDate: React.PropTypes.number,
  userId: React.PropTypes.number.isRequired,
  highestBid: React.PropTypes.number,
  createdAt: React.PropTypes.string,
  buyerId: React.PropTypes.number
};

ProductCard.contextTypes = {
  history: PropTypes.history
}



export default ProductCard;