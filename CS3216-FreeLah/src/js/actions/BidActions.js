import alt from '../alt';
import api from '../api';

class BidActions {
  bid(buyerId, prodId, biddingPoint) {
    this.dispatch();
    api.bid({buyerId, prodId, biddingPoint})
      .then((res) => {
        console.log(res);
        this.actions.bidSuccess();
      })
      .catch((err) => {
        console.log(err);
        this.actions.bidFailed(err.body);
      });
  }

  bidSuccess() {
    this.dispatch();
  }

  bidFailed(err) {
    this.dispatch(err);
  }

  clearStore() {
    if (this.alt.dispatcher.isDispatching()){
      window.setTimeout(() => {
        this.dispatch();
      })
    } else {
      this.dispatch();
    }
  }
}

export default alt.createActions(BidActions);
