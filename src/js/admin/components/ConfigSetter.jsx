import React from 'react';
import _ from 'underscore';

import { convertToMs, convertToMins } from '../../chat/util';
import { DEFAULT_ROOM_VALUES } from '../../constants';

const ConfigSetter = React.createClass({
  propTypes: {
    firebase: React.PropTypes.object.isRequired,
    study: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      loaded: false, // loaded data from Firebase yet?
      saved: false, // saved back to Firebase yet?

      // All attributes default to false
      config: {
        usersPerRoom: false,
        maxWaitingTime: false,
        roomOpenTime: false,
        warning: false,
        password: false,
        altPassword: false,
      },
    };
  },

  componentWillMount() {
    // Only read in initial data
    this._loadConfig(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.props.firebase.off();
    this._loadConfig(nextProps);
  },

  _loadConfig(props) {
    props.firebase.on('value', snapshot => {
      if (!snapshot.val()) {
        props.firebase.set(DEFAULT_ROOM_VALUES, (err) => {
          console.log(err);
        });
      } else {
        this.setState({
          loaded: true,
          config: snapshot.val(),
        });
      }
    });
  },

  _handleSubmit(e) {
    e.preventDefault();
    this.props.firebase.set(this.state.config, (err) => {
      this.setState({ saved: !err });
      console.log(this.state);
    });
  },

  // transform arg is used to change from mins to ms
  _handleChange(attr, transform = _.identity, e) {
    const config = _.extend({}, this.state.config, {
      [attr]: transform(e.target.value),
    });

    this.setState({
      saved: false,
      config: config,
    });
  },

  _formInputFor(attr, label, convertData = _.identity,
      convertInput = _.identity) {
    return (
      <div>
        <label htmlFor={attr}>{label}</label>
        <input type="text"
          id={attr}
          value={convertData(this.state.config[attr])}
          onChange={_.partial(this._handleChange, attr, convertInput)} />
        <div className="spacer"></div>
      </div>
    );
  },

  render() {
    return (
      <div>
        <h3>Change the settings for study {this.props.study}.</h3>

        {!this.state.loaded ? 'Loading...' :
          <form onSubmit={this._handleSubmit}>

            {this._formInputFor('usersPerRoom',
              'Users per chat room')}
            {this._formInputFor('maxWaitingTime',
              'Max waiting time (in minutes)',
              convertToMins, convertToMs)}
            {this._formInputFor('roomOpenTime',
              'Time participants have to chat (in minutes)',
              convertToMins, convertToMs)}
            {this._formInputFor('warning',
              'Minutes remaining before chat end warning',
              convertToMins, convertToMs)}
            {this._formInputFor('password',
              'Password to continue with study after chat')}
            {this._formInputFor('altPassword',
              'Password to continue if not placed in chat room')}

            <div>{this.state.saved && 'Saved!'}</div>
            <button name="submit">Save</button>
          </form>
        }
      </div>
    );
  },
});

export default ConfigSetter;