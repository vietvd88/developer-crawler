var FacebookDeveloper = require('../model/FacebookDeveloper')
var FacebookDeveloperJob = require('../model/FacebookDeveloperJob')
var FacebookDeveloperEducation = require('../model/FacebookDeveloperEducation')

module.exports = class Facebook {
  constructor(url) {
    this.url = url
    this.done = false
    this.seedUrls = []

    this.browser = getBrowser()
    this.browser.init()
    this.developerModel = new FacebookDeveloper()
    this.jobModel = new FacebookDeveloperJob()
    this.educationModel = new FacebookDeveloperEducation()
  }

  getSeedURLs(url, callback) {
    console.log('getSeedURLs')
    // callback = callback || function () {};
    // var elemId
    this.browser
      .url(url)
      // get user name
      .getText('.tableList article .ItemLink__info a').then((names) => {
        // console.log(names)
        if (Array.isArray(names)) {
            for (var i = names.length - 1; i >= 0; i--) {
                this.seedUrls.push('http://qiita.com/' + names[i])
            }
        } else {
            this.seedUrls.push('http://qiita.com/' + names)
        }
        
        this.getNextPostPage((url, callback) => { this.getSeedURLs(url, callback) }, callback, this.seedUrls)
      })
      .catch(function(reason) {
        console.log(reason)
        callback(null, reason)
      });
  }

  getPeronalInformation(url) {
    // return;
    this.getDeveloperInfo(url, (developerInfo, error) => {
        console.log(developerInfo)
        // this.getEducation(url)
        // this.getJob(url)
    })
  }

  getDeveloperInfo(url, callback) {
    console.log('get develep info: ' + url)
    var developerModel = this.developerModel
    var developerInfo = {}
    var crawler = this
    var browser = this.browser
    
    browser
    .url(url)
    .getTitle().then(function(name) {
        developerInfo.user_name = name;
        developerInfo.name = name;
    })
    // .element('#contact-info div[title="Facebook"] ._5cdv').then((response) => {
    //     return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'link')
    // })
    .element('#contact-info div[title="Websites"] ._5cdv').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'website')
    })
    .element('#basic-info div[title="Birthday"] ._5cdv').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'birthday')
    })
    // .element('#basic-info div[title="Gender"] ._5cdv').then((response) => {
    //     return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'gender')
    // })
    .element('#living div div header:nth-child(1) h4:nth-child(1)').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'location')
    })
    .element('#living div div header:nth-child(2) h4:nth-child(1)').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'hometown')
    })

    // .getAttribute('.bp a img', 'src').then((response) => {
    //     developerInfo.avatar = response;
    // })
    // .element('#contact-info tbody a').then((response) => {
    //     return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'website')
    // })
    // .element('#basic-info div[title="Birthday"] .ds').then((response) => {
    //     return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'birthday')
    // })
    // .element('#living div[title="Current City"] .ds').then((response) => {
    //     return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'location')
    // })
    // .element('#living div[title="Hometown"] .ds').then((response) => {
    //     return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'hometown')
    // })
    .then(function () {
      console.log(developerInfo)
      var condition = {user_name: developerInfo.user_name}
      developerModel.update(condition, developerInfo)
      callback(developerInfo, null)
    })
    .catch(function (error) {
        console.log(error)
        callback(null, error)
    })
  }

  getEducation(url) {
    var crawler = this
    var browser = this.browser

    browser
    .url(url)
    .elements('#education .da').then((response) => {
      crawler.getEducationInfo(browser, 0, response.value)
    })
    .catch(function(e) {
        console.log(e)
    })
  }

  getEducationInfo(browser, index, elemIdList, callback) {
    callback = callback || function () {}
    var educationModel = this.educationModel
    var educationInfo = {}
    var crawler = this
    var browser = this.browser
    if (index >= elemIdList.length) {
        callback()
        return
    }
    var elemId = elemIdList[index].ELEMENT
    browser
    .element('.bu').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, educationInfo, 'user_name')
    })
    .elementIdElement(elemId, '.di').then((response) => {
      return crawler.getElemTextByElemResponse(browser, response, educationInfo, 'college')
    })
    .elementIdElement(elemId, '.dk').then((response) => {
      return crawler.getElemTextByElemResponse(browser, response, educationInfo, 'grade')
    })
    .elementIdElement(elemId, '.dl').then((response) => {
      return crawler.getElemTextByElemResponse(browser, response, educationInfo, 'duration')
    })
    .catch(function(e) {
      console.log(e)
      // callback(null, e)
    })
    .then((response) => {
      var condition = {user_name: educationInfo.user_name, college: educationInfo.college}
      educationModel.update(condition, educationInfo)
      this.getEducationInfo(browser, index + 1, elemIdList, callback)
    })
  }

  getJob(url) {
    var crawler = this
    var browser = this.browser

    browser
    .url(url)
    .elements('#work .cw .da').then((response) => {
      crawler.getJobInfo(browser, 0, response.value)
    })
    .catch(function(e) {
        console.log(e)
    })
  }

  getJobInfo(browser, index, elemIdList, callback) {
    callback = callback || function () {}
    var jobModel = this.jobModel
    var jobInfo = {}
    var crawler = this
    var browser = this.browser
    if (index >= elemIdList.length) {
        callback()
        return
    }
    var elemId = elemIdList[index].ELEMENT
    browser
    .element('.bu').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, jobInfo, 'user_name')
    })
    .elementIdElement(elemId, '.db').then((response) => {
      return crawler.getElemTextByElemResponse(browser, response, jobInfo, 'company')
    })
    .elementIdElement(elemId, '.df').then((response) => {
      return crawler.getElemTextByElemResponse(browser, response, jobInfo, 'position')
    })
    .elementIdElement(elemId, '.dg').then((response) => {
      return crawler.getElemTextByElemResponse(browser, response, jobInfo, 'duration')
    })
    .catch(function(e) {
      console.log(e)
      // callback(null, e)
    })
    .then((response) => {
      var condition = {user_name: jobInfo.user_name, company: jobInfo.company, duration: jobInfo.duration}
      jobModel.update(condition, jobInfo)
      this.getJobInfo(browser, index + 1, elemIdList, callback)
    })
  }

  getElemTextByElemResponse(browser, elemResponse, infoObj, attribute) {
        var crawler = this;
        if (elemResponse && elemResponse.value) {
          return crawler.getElemText(browser, elemResponse.value.ELEMENT, infoObj, attribute)  
        }
        infoObj[attribute] = ''
        return browser;
    }
    getElemText(browser, elemId, repoInfo, attribute) {
      return browser
        .elementIdText(elemId).then((response) => {
          repoInfo[attribute] = response.value
          return response.value
        })
    }
}
