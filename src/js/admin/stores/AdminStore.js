import alt from '../alt';
import Firebase from 'firebase';

import AdminActions from '../actions/AdminActions';
import { ROOT_URL, CONSTANTS_URL } from '../../constants';

const ROOT_FB = new Firebase(ROOT_URL);

class AdminStore {
  constructor() {
    this.bindActions(AdminActions);

    this.jsonToCsvSelected = false;
    this.auth = null;
    this.selectedStudy = null;
    this.studies = null;
    this.fb = ROOT_FB;
    this.constantsFb = null;
    this.roomsFb = null;
  }

  selectJsonToCsv(selected) {
    this.jsonToCsvSelected = selected;
  }

  listenForStudies(studies) {
    this.studies = studies;
  }

  setAuth(auth) {
    this.auth = auth;
  }

  setSelectedStudy(study) {
    this.selectedStudy = study;
    this.constantsFb = new Firebase(`${CONSTANTS_URL}/${study}`);

    // This is probably wrong tbh
    this.roomsFb = new Firebase(`${ROOT_URL}/${study}?shallow=true`)
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(AdminStore, 'AdminStore');
