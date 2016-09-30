/* eslint-disable */
import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import RepoDisplay from '../containers/repo_display';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

function handleActive(tab) {
  alert(`A tab with this route property ${tab.props['data-route']} was activated.`);
}

export default class NavTabs extends Component {
  render (){
    return (
      <Tabs>
      <Tab label="Git Graph" >
        <div id='container'>hihihihihi</div>
      </Tab>
      <Tab label="Stats" >
        <div>
          <h2 style={styles.headline}>Tab Two</h2>
          <p>
            This is another example tab.
            {console.log('hey sup Martin')}
          </p>
        </div>
      </Tab>
    </Tabs>
  )}
}
