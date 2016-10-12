import alt from '../alt';
import api from '../api';

class UserActions {
  createUser(user) {
    this.dispatch();
    api.createUser(user)
      .then((res) => {
        this.actions.createUserSuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        this.actions.createUserFailed(err.message);
      });
  }
  createUserSuccess(user) {
    this.dispatch(user);
  }
  createUserFailed(err) {
    this.dispatch(err);
  }

  getUser(userId) {
    this.dispatch();
    api.getUser(userId)
      .then((res) => {
        this.actions.getUserSuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        this.actions.getUserFailed(err.message);
      });
  }

  getUserSuccess(user) {
    this.dispatch(user);
  }
  getUserFailed(err) {
    this.dispatch(err);
  }

  getAllUsers() {
    this.dispatch();
    api.getAllUsers()
      .then((res) => {
        this.actions.getAllUsersSuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        this.actions.getAllUsersFailed(err.message);
      });
  }

  getAllUsersSuccess(user) {
    this.dispatch(user);
  }
  getAllUsersFailed(err) {
    this.dispatch(err);
  }

  updateUser(userId, data) {
    this.dispatch();
    api.updateUser(userId, data)
      .then((res) => {
        this.actions.updateUserSuccess(JSON.parse(res.text));
      })
      .catch((err) => {
        this.actions.updateUserFailed(err.message);
      });
  }

  updateUserSuccess(user) {
    this.dispatch(user);
  }
  updateUserFailed(err) {
    this.dispatch(err);
  }

}

export default alt.createActions(UserActions);
