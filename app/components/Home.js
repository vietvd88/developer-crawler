// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import SortTable from './SortTable'
import { Button, FormControl } from 'react-bootstrap';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this._countryOptions = ['Vietnam', 'Japan']
    this._skillOptions = ['PHP', 'Ruby', 'Python', 'Java', 'Javascript', 'Lua', 'CSS', 'HMTL', 'PERL']

    this.state = {
      countries: this._countryOptions,
      skills: this._skillOptions
    };

    this.props.getDeveloperListAsync();

    this.filterDeveloperComponent = this.filterDeveloperComponent.bind(this);
  }

  filterDeveloperComponent() {
    this.props.filterDeveloper(this.props.country, this.props.skill)
  }

  render() {
    const { countries, skills } = this.state
    const columns = [
        {name: 'Name', key: 'name', width: 200},
        {name: 'Age', key: 'age', width: 200},
        {name: 'Score', key: 'score', width: 200},
        {name: 'Skill', key: 'skill', width: 200},
    ]
    const skillOptionList = skills.map((skill) => {
      return (
        <option value={skill} key={skill} >{skill}</option>
      )
    })
    const countryOptionList = countries.map((country) => {
      return (
        <option value={country} key={country} >{country}</option>
      )
    })

    return (
      <div>
        <div className={styles.container}>
          <h2>Job Search Crawler</h2>
          <hr/>

          <br/>
          <br/>

          <Button 
            bsStyle="primary" 
            bsSize="small" 
            className={styles.crawlingButton}
            onClick={this.props.onCrawlingClick}
          >
            Start Crawling
          </Button>

          <Button 
            bsStyle="primary" 
            bsSize="small" 
            className={styles.filterButton}
            onClick={this.filterDeveloperComponent}
          >
            Filter
          </Button>

          <FormControl 
            componentClass="select" 
            placeholder="Skills" 
            className={styles.selectSkill} 
            onChange={this.props.changeSkill}
          >
            {skillOptionList}
          </FormControl>

          <FormControl 
            componentClass="select" 
            placeholder="Skills" 
            className={styles.selectCountry} 
            onChange={this.props.changeCountry}
          >
            {countryOptionList}
          </FormControl>

          <br/>
          <br/>
          <SortTable 
            dataList={this.props.developerList}
            columns={columns}
            onSortChange={this.props.sortDeveloper}
            width={800}
            height={400}
          />
          <br/>
          <br/>
          <Button bsStyle="primary" bsSize="small" className={styles.filterButton}>Download CSV</Button>
        </div>
      </div>
    );
  }
}
