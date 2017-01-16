// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Github.css';
import SortTable from './SortTable'
import { Button, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
var FakeObjectDataListStore = require('./FakeObjectDataListStore');

export default class Home extends Component {

  constructor(props) {
    super(props);

    var queryString = this.props.location.query
    this.props.getRepoAsync(queryString.user)
    this.props.getDeveloperAsync(queryString.user)
  }

  render() {
    const columns = [
        {name: 'Repository', key: 'repo_name', width: 200},
        {name: 'Language', key: 'language', width: 200},
        {name: 'Star', key: 'star', width: 200},
        {name: 'Score', key: 'score', width: 200},
    ];

    return (
      <div>
        <div className={styles.container}>
          <h2>Job Search Crawler -- 
            <Link to={{ pathname: '/' }}>
              HomePage
            </Link>
          </h2>
          <hr/>

          <div className={styles.userPanel}>
            <img src={this.props.developer.avatar} className={styles.avatar}/>
            <span className={styles.userName}>{this.props.developer.name}</span>
          </div>

          <div className={styles.repoTable}>
            <SortTable 
              dataList={this.props.repoList} 
              columns={columns}
              onSortChange={this.props.sortRepo}
              width={800}
              height={200}
            />
          </div>

          <div className={styles.email}>
            Email: {this.props.developer.email}
          </div>

          <div className={styles.phone}>
            Phone: ---
          </div>

          <FormGroup controlId="formControlsTextarea">
            <FormControl componentClass="textarea" placeholder="textarea" className={styles.comments}/>
          </FormGroup>

          <FormGroup>
          <FormControl type="text" placeholder="New Comment" />
          </FormGroup>
          {' '}
          <Button 
            bsStyle="primary" 
            bsSize="small" 
            className={styles.filterButton}
            onClick={this.filterDeveloperComponent}
          >
            Post
          </Button>

        </div>
      </div>
    );
  }
}
