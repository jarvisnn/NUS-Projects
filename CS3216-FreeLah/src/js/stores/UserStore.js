import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
  constructor() {
    this.retrieving = false;
    this.user = null;
    this.retrievedUsers = null;
    this.errors = null;
    this.bindListeners({
      handleCreateUser: UserActions.CREATE_USER,
      handleCreateUserSuccess: UserActions.CREATE_USER_SUCCESS,
      handleCreateUserFailed: UserActions.CREATE_USER_FAILED,
      handleGetUser: UserActions.GET_USER,
      handleGetUserSuccess: UserActions.GET_USER_SUCCESS,
      handleGetUserFailed: UserActions.GET_USER_FAILED,
      handleUpdateUser: UserActions.UPDATE_USER,
      handleUpdateUserSuccess: UserActions.UPDATE_USER_SUCCESS,
      handleUpdateUserFailed: UserActions.UPDATE_USER_FAILED,
      handleGetAllUsers: UserActions.GET_ALL_USERS,
      handleGetAllUsersSuccess: UserActions.GET_ALL_USERS_SUCCESS,
      handleGetAllUsersFailed: UserActions.GET_ALL_USERS_FAILED,
      
    })
  }

  handleCreateUser() {
    this.user = null;
    this.errors = null;
  }
  handleCreateUserSuccess(user) {
    this.user = user;
    this.errors = null;
  }
  handleCreateUserFailed(err) {
    this.user = null;
    this.errors = err;
  }

  handleGetUser() {
    this.retrieving = true;
    this.user = null;
    this.errors = null;
  }
  handleGetUserSuccess(user) {
    this.retrieving = false;
    this.user = user;
    this.errors = null;
  }
  handleGetUserFailed(err) {
    this.retrieving = false;
    this.user = null;
    this.errors = err;
  }

  handleUpdateUser() {
    this.user = null;
    this.errors = null;
  }
  handleUpdateUserSuccess(user) {
    this.user = user;
    this.errors = null;
  }
  handleUpdateUserFailed(err) {
    this.errors = err;
  }

  handleGetAllUsers() {
    this.retrievedUsers = null;
    this.errors = null;
  }
  handleGetAllUsersSuccess(users) {
    this.retrievedUsers = users;
  }
  handleGetAllUsersFailed(err) {
    this.errors = err
  }

}

export default alt.createStore(UserStore, 'UserStore');

