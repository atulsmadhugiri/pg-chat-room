import alt from '../alt';
import Firebase from 'firebase';

import AdminActions from '../actions/AdminActions';
import { STUDIES_URL, CONSTANTS_URL } from '../../constants';

const STUDIES_FB = new Firebase(STUDIES_URL);

class AdminStore {
  constructor() {
    this.bindActions(AdminActions);

    this.selectedStudy = null;
    this.studies = null;
    this.constantsFb = null;

    STUDIES_FB.on('value', snapshot => {
      const studies = snapshot.val() || [];
      this.studies = studies;

      // Need to manually emit change here because alt doesn't detect async
      // state changes in the constructor
      this.getInstance().emitChange();
      console.log(`Loaded studies: ${studies}`);
    });
  }

  addStudy(study) {
    const newStudies = this.studies.concat([study]);
    STUDIES_FB.set(newStudies);
  }

  setSelectedStudy(study) {
    this.selectedStudy = study;
    this.constantsFb = new Firebase(`${CONSTANTS_URL}/${study}`);
  }

  static get(attr) {
    return this.getState()[attr];
  }
}

export default alt.createStore(AdminStore, 'AdminStore');