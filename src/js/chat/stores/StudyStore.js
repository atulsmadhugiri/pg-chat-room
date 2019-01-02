import firebase from 'firebase';
import alt from '../alt';

import StudyActions from '../actions/StudyActions';
import { ROOT_URL, USER_AUTH_URL } from '../../constants';

class StudyStore {
  constructor() {
    this.bindActions(StudyActions);

    this.study = null;
    this.room = null;
    this.config = null;

    this.usersFb = null;
    this.roomsFb = null;
    this.baseFb = null;
    this.configFb = null;
    this.userAuthFb = null;
  }

  initStudy({ study, room }) {
    this.study = study;
    this.room = room;

    this.baseFb = new firebase(`${ROOT_URL}/${this.study}/${this.room}`);
    this.configFb = new firebase(`${ROOT_URL}/constants/${this.study}`);
    this.userAuthFb = new firebase(USER_AUTH_URL);
    this.usersFb = this.baseFb.child('users');
    this.roomsFb = this.baseFb.child('rooms');
  }

  updateConfig(config) {
    this.config = config;
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(StudyStore, 'StudyStore');
