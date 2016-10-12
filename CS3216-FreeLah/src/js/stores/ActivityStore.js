import alt from '../alt';
import ActivityActions from '../actions/ActivityActions';
import LocalStore from '../util/helper.js'

class ActivityStore {
  constructor() {
    this.activities = null;
    this.error = null;
    this.bindListeners({
      handleGetActivity: ActivityActions.GET_ACTIVITY,
      handleGetActivitySuccess: ActivityActions.GET_ACTIVITY_SUCCESS,
      handleGetActivityFailed: ActivityActions.GET_ACTIVITY_FAILED,
    })
  }

  handleGetActivity() {
  }

  handleGetActivitySuccess(res) {
    this.activities = res.reverse();
    LocalStore.write('activities', this.activities);
    this.error = null
  }

  handleGetActivityFailed(err) {
    if (!navigator.onLine) {
      this.activities = LocalStore.read('activities');
    } else {
      this.error = err;
      this.activities = null
    }
  }
}

export default alt.createStore(ActivityStore, 'ActivityStore');

