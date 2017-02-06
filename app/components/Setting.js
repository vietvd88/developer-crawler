// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Setting.css';
import SortTable from './SortTable'
import { Button, FormControl } from 'react-bootstrap';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.props.getDeveloperListAsync();

    this.filterDeveloperComponent = this.filterDeveloperComponent.bind(this);
  }

  filterDeveloperComponent() {
    this.props.filterDeveloper(this.props.country, this.props.skill)
  }

  render() {

    return (
      <div>
        <div className={styles.container}>
          <Link to={{ pathname: '/' }}>
            HomePage
          </Link>

          <br/>
          <br/>
          <div className={"form-group"}>
            <label>Seed Url</label>
            <input type="email" className={"form-control"} placeholder="Url to get developer list"></input>
          </div>

          <select className={styles.selectSeed}>
            <option>Qiita</option>
            <option>Github</option>
            <option>Facebook</option>
            <option>Linkedin</option>
            <option>Tweeter</option>
          </select>

          <br/>

          <button className={"btn btn-large btn-default"}>Go Back</button>
          <button className={"btn btn-large btn-primary"}>Apply</button>
        </div>
      </div>
    );
  }
}
