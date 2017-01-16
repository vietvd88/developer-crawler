const webdriverio = require('webdriverio')
var GithubDeveloper = require('../model/GithubDeveloper')
var GithubDeveloperRepo = require('../model/GithubDeveloperRepo')

module.exports = class Github {
  constructor(url) {
    this.url = url
    this.done = false
    this.seedUrls = []
    const options = {
      host: 'localhost', // Use localhost as chrome driver server
      port: 9515,        // "9515" is the port opened by chrome driver.
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          binary: '../jobsearchapp/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron', // Path to your Electron binary.
          args: [/* cli arguments */]           // Optional, perhaps 'app=' + /path/to/your/app/
        }
      }
    }

    this.browser = {} //webdriverio.remote(options).init()
    this.developerModel = new GithubDeveloper()
    this.repoModel = new GithubDeveloperRepo()
  }

  getDeveloperList() {
    return Promise.all([
      this.developerModel.getAll(),
      this.repoModel.getAll()])
    .then(values => {
      var developers, repos
      [developers, repos] = values
      developers = developers.filter(function(developer) { return developer.user_name != ''})
      for (var i = 0; i < developers.length; i++) {
        var developer = developers[i]
        var developerUserName = developer.user_name
        var developerRepos = repos.filter(function(repo) {return repo.user_name == developerUserName})
        var developerSkills = developerRepos.map(function(repo) { return repo.language })
        developerSkills = developerSkills.filter(function(item, pos) {
            return developerSkills.indexOf(item) == pos && item !== '';
        })
        developer.skill = developerSkills.join(' ')
        developer.age = 20
        developer.score = 100
      }
      return developers
    })
  }

  sleep(milliseconds) {
      var start = new Date().getTime();
      while (true) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    }

  getSeedURLs(url, callback) {
    console.log('getSeedURLs')
    callback = callback || function () {};
    var elemId
    this.browser
      .url(url)
      // get user name
      .getText('.username').then((names) => {
        if (Array.isArray(names)) {
            for (var i = names.length - 1; i >= 0; i--) {
                this.seedUrls.push('https://github.com/' + names[i])
            }
        } else {
            this.seedUrls.push('https://github.com/' + names)
        }
        
        this.getNextUserPage((url, callback) => { this.getSeedURLs(url, callback) }, callback, this.seedUrls)
      })
      .catch(function(reason) {
        console.log(reason)
        callback(null, reason)
      });
  }

  getPeronalInformation(url) {
    this.getDeveloperInfo(url, (developerInfo, error) => {
        console.log(developerInfo)
        this.getRepos(url + '?tab=repositories')
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
    .getAttribute('.vcard-avatar', 'href').then((response) => {
        developerInfo.avatar = response;
    })
    .element('.vcard-fullname').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'name')
    })
    .element('.vcard-username').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'user_name')
    })
    .element('li[itemprop="homeLocation"]').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'location')
    })
    .element('li[itemprop="email"]').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'email')
    })
    .then(function () {
        var condition = {user_name: developerInfo.user_name}
        developerModel.update(condition, developerInfo)
        callback(developerInfo, null)
    })
    .catch(function (error) {
        console.log(error)
        callback(null, error)
    })
  }

  getRepos(url) {
    var crawler = this
    var browser = this.browser
    var nextRepoPageCallback = () => {
        this.getNextRepoPage(
            (url) => { this.getRepos(url) }
        )
    }

    browser
    .url(url)
    .elements('#user-repositories-list li').then((response) => {
        crawler.getRepoInfo(browser, 0, response.value, nextRepoPageCallback)
    })
    .catch(function(e) {
        console.log(e)
    })
  }
  
  getNextUserPage(nextPageCallback, endPageCallback, prevData) {
    this.getNextPage('li a[rel="next"]', nextPageCallback, endPageCallback, prevData)
  }

  getNextRepoPage(nextPageCallback, endPageCallback, prevData) {
    this.getNextPage('a[rel="next"]', nextPageCallback, endPageCallback, prevData)
  }

  getNextPage(selector, nextPageCallback, endPageCallback, prevData) {
    nextPageCallback = nextPageCallback || function () {};
    endPageCallback = endPageCallback || function () {};

    var developerModel = this.developerModel
    var developerInfo = {}
    var crawler = this
    var elemId

    this.browser
    .elements('.pagination').then((response) => {
        var hasPage = response && response.value && response.value.length > 0
        if (!hasPage) {
            endPageCallback(prevData, null)
            return
        }
        elemId = response.value[0].ELEMENT
        this.browser.elementIdElement(elemId, selector).then((response) => {
            if (response && response.value) {
                elemId = response.value.ELEMENT
                this.browser.elementIdAttribute(elemId, 'href').then((response) => {
                    if (response && response.value) {
                        var nextUrl = response.value 
                        console.log('next page: ' + nextUrl)
                        console.log('nextPageCallback: ', nextPageCallback)
                        nextPageCallback(nextUrl, endPageCallback)
                    } else {
                        console.log('endPageCallback: ', endPageCallback)
                        endPageCallback(prevData, null)
                    }
                })
            } else {
                console.log('endPageCallback: ', endPageCallback)
                endPageCallback(prevData, null)
            }
        })
        .catch(function(reason) {
            console.log(reason)
            console.log('endPageCallback: ', endPageCallback)
            endPageCallback(null, reason)
        });
    })
    .catch(function(reason) {
        console.log(reason)
        endPageCallback(null, reason)
    });
  }

  getRepoInfo(browser, index, elemIdList, callback) {
    callback = callback || function () {}
    var repoModel = this.repoModel
    var repoInfo = {}
    var crawler = this
    var browser = this.browser
    if (index >= elemIdList.length) {
        callback()
        return
    }
    var elemId = elemIdList[index].ELEMENT
      browser
      .element('.vcard-username').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, repoInfo, 'user_name')
      })
      .elementIdElement(elemId, 'a[itemprop="name codeRepository"]').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, repoInfo, 'repo_name')
      })
      // get repo description
      .elementIdElement(elemId, 'p[itemprop="description"]').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, repoInfo, 'description')
      })
      // get repo description
      .elementIdElement(elemId, 'span[itemprop="programmingLanguage"]').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, repoInfo, 'language')
      })
      // get repo description
      .elementIdElement(elemId, 'a[aria-label="Stargazers"]').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, repoInfo, 'star')
      })
      .catch(function(e) {
        console.log(e)
        // callback(null, e)
      })
      .then((response) => {
        console.log(repoInfo)
        var condition = {user_name: repoInfo.user_name, repo_name: repoInfo.repo_name}
        repoModel.update(condition, repoInfo)
        this.getRepoInfo(browser, index + 1, elemIdList, callback)
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
