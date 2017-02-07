// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import SortTable from './SortTable'
import { Button, FormControl, FormGroup, ControlLabel, Alert } from 'react-bootstrap';

export default class Home extends Component {

  constructor(props) {
    super(props);

    this._countryOptions = ['Vietnam', 'Japan']
    this._skillOptions = ['PHP', 'Ruby', 'Python', 'Java', 'Javascript', 'Lua', 'CSS', 'HMTL', 'PERL']

    this.state = {
      countries: this._countryOptions,
      skills: this._skillOptions
    };

    this.props.getDeveloperListAsync()

    this.filterDeveloperComponent = this.filterDeveloperComponent.bind(this)
    this.onDeveloperListUrlChange = this.onDeveloperListUrlChange.bind(this)
    this.onDeveloperListUrlTypeChange = this.onDeveloperListUrlTypeChange.bind(this)
    this.onStartCrawling = this.onStartCrawling.bind(this)
    this.setErrorMessage = this.setErrorMessage.bind(this)
    this.handleErrorDismiss = this.handleErrorDismiss.bind(this)

    this.developerListUrl = ''
    this.developerListUrlType = 'github'
    this.noticationMsg = ''
    this.crawlingButtonText = 'Start crawling'

    this.isCrawling = false
  }

  handleErrorDismiss() {
    this.setState({hasError: false})
  }

  setErrorMessage(message) {
    this.noticationMsg = message
    this.setState({hasError: true})
  }

  onDeveloperListUrlChange(evt) {
    console.log(evt.target.value)
    this.developerListUrl = evt.target.value
  }

  onDeveloperListUrlTypeChange(evt) {
    console.log(evt.target.value)
    this.developerListUrlType = evt.target.value
  }

  onStartCrawling() {
    if (this.developerListUrl == '') {
      var message = 'Need to input url to get developer list on above box'
      this.setErrorMessage(message)
      return
    }
    
    if (this.isCrawling) {
      this.crawlingButtonText = 'Start Crawling'
      this.props.stopCrawling()  
    } else {
      this.crawlingButtonText = 'Stop Crawling'
      this.props.startCrawling(this.developerListUrl, this.developerListUrlType)
    }
    this.isCrawling = !this.isCrawling
    this.setState({isCrawling: this.isCrawling})
    this.handleErrorDismiss()
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
          <div className={styles.crawlerArea}>
            <FormGroup>
              <Button 
                bsStyle="primary" 
                bsSize="small" 
                className={styles.crawlingButton}
                onClick={this.onStartCrawling}
              >
                {this.crawlingButtonText}
              </Button>

              <FormControl 
                componentClass="select" 
                className={styles.selectPage}
                onChange={this.onDeveloperListUrlTypeChange}
              >
                <option value='github' key='github' >github</option>
                <option value='qiita' key='qiita' >qiita</option>
              </FormControl>

              <FormControl 
                type="text" 
                placeholder="Url to get developer list" 
                className={styles.seedUrlBox}
                onChange={this.onDeveloperListUrlChange}
              />
            </FormGroup>
          </div>

          {
            this.state.hasError
            ? <div className={styles.errorMsg}>
                <Alert bsStyle="danger" onDismiss={this.handleErrorDismiss}>
                  {this.noticationMsg}
                </Alert>
              </div>
            : null
          }
        
          <br/>
          <div className={styles.filterArea}>
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
          </div>
          
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
