var GithubDeveloper = require('../model/GithubDeveloper')
var GithubDeveloperRepo = require('../model/GithubDeveloperRepo')
var DeveloperUrlQueue = require('../model/DeveloperUrlQueue')

module.exports = class Github {
  constructor(browser) {
    this.done = false
    this.seedUrls = []

    this.browser = browser || getBrowser()
    this.developerModel = new GithubDeveloper()
    this.repoModel = new GithubDeveloperRepo()
    this.urlQueue = new DeveloperUrlQueue()
  }

  getSeedURLs(url, callback) {
    console.log('getSeedURLs')
    callback = callback || function () {};
    var urlQueue = this.urlQueue
    var elemId
    this.browser
      .timeouts('implicit', 5000)
      .url(url)
      // get user name
      .getText('.username').then((names) => {
        if (Array.isArray(names)) {
          for (var i = names.length - 1; i >= 0; i--) {
            var developerUrl = 'https://github.com/' + names[i]
            this.seedUrls.push(developerUrl)
            urlQueue.insert({
              url: developerUrl,
              type: 'github'
            })
          }
        } else {
          var developerUrl = 'https://github.com/' + names
          this.seedUrls.push(developerUrl)
          urlQueue.insert({
            url: developerUrl,
            type: 'github'
          })
        }
        
        this.getNextUserPage((url, callback) => { this.getSeedURLs(url, callback) }, callback, this.seedUrls)
      })
      .catch(function(reason) {
        console.log(reason)
        callback(null, reason)
      });
  }

  getPeronalInformation(url) {
    var urlQueue = this.urlQueue
    this.getDeveloperInfo(url, (developerInfo, error) => {
      urlQueue.delete({
        url: url
      })

      if (error != null) {
        this.browser.end()
        return
      }
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
      browser.end()
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
          this.browser.end()
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
                    this.browser.end()
                    endPageCallback(prevData, null)
                  }
              })
            } else {
              console.log('endPageCallback: ', endPageCallback)
              this.browser.end()
              endPageCallback(prevData, null)
            }
        })
        .catch(function(reason) {
          console.log(reason)
          console.log('endPageCallback: ', endPageCallback)
          this.browser.end()
          endPageCallback(null, reason)
        });
    })
    .catch(function(reason) {
      console.log(reason)
      this.browser.end()
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
