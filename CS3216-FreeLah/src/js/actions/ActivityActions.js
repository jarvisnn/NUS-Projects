import alt from '../alt';
import api from '../api';

class ActivityActions {
  getActivity(userId, auth) {
    this.dispatch();
    api.getActivities(userId, auth)
      .then((res) => {
        console.log(res);
        this.actions.getActivitySuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        console.log(err);
        this.actions.getActivityFailed(err.body);
      });
  }

  getActivitySuccess(res) {
    console.log(res);
    this.dispatch(res);
  }

  getActivityFailed(err) {
    console.log(err);
    this.dispatch(err);
  }
}

export default alt.createActions(ActivityActions);
