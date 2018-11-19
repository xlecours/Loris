import React, {Component} from 'react';
import Loader from 'Loader';
import {Tabs} from 'Tabs';
import ProfileTab from './profileTab.js';

class GenomicBrowserIndex extends Component {
  render() {
    let tabs = [{id: 'profile', label: 'Profile'}];

    return (
      <Tabs tabs={tabs} defaultTab='profile' updateURL={true}>
        <ProfileTab key='0' tabId='profile' />
        <ProfileTab key='1' tabId='profile' />
      </Tabs>
    );
  }
}

window.addEventListener('load', () => {
  ReactDOM.render(
    <GenomicBrowserIndex />,
    document.getElementById('lorisworkspace')
  );
});
