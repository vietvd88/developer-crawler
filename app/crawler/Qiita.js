const webdriverio = require('webdriverio')
var QiitaDeveloper = require('../model/QiitaDeveloper')
var QiitaDeveloperPost = require('../model/QiitaDeveloperPost')

module.exports = class Qiita {
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

    this.browser = webdriverio.remote(options).init()
    this.developerModel = new QiitaDeveloper()
    this.postModel = new QiitaDeveloperPost()
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
    this.getDeveloperInfo(url, (developerInfo, error) => {
        console.log(developerInfo)
        this.getPosts(url)
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
    .getAttribute('.newUserPageProfile_avatar img', 'src').then((response) => {
        developerInfo.avatar = response;
    })
    .element('.newUserPageProfile_name').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'user_name')
    })
    .element('.newUserPageProfile_description').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'description')
    })
    .element('a[itemprop="email"]').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'email')
    })
    .element('a[itemprop="url"]').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'website')
    })
    .then(function () {
      // console.log(developerInfo)
        var condition = {user_name: developerInfo.user_name}
        developerModel.update(condition, developerInfo)
        callback(developerInfo, null)
    })
    .catch(function (error) {
        console.log(error)
        callback(null, error)
    })
  }

  getPosts(url) {
    var crawler = this
    var browser = this.browser
    var nextPostPageCallback = () => {
        this.getNextPostPage(
            (url) => { this.getPosts(url) }
        )
    }

    browser
    .url(url)
    .elements('.tableList article').then((response) => {
      crawler.getPostInfo(browser, 0, response.value, nextPostPageCallback)
    })
    .catch(function(e) {
        console.log(e)
    })
  }

  getPostInfo(browser, index, elemIdList, callback) {
    callback = callback || function () {}
    var postModel = this.postModel
    var postInfo = {}
    var crawler = this
    var browser = this.browser
    if (index >= elemIdList.length) {
        callback()
        return
    }
    var elemId = elemIdList[index].ELEMENT
      browser
      .elementIdElement(elemId, '.ItemLink__info a').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, postInfo, 'user_name')
      })
      .elementIdElement(elemId, '.ItemLink__title a').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, postInfo, 'title')
      })
      .elementIdElement(elemId, '.ItemLink__status li').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, postInfo, 'like')
      })
      .elementIdElement(elemId, '.ItemLink__status li a').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, postInfo, 'comment')
      })
      .catch(function(e) {
        console.log(e)
        callback(null, e)
      })
      .then((response) => {
        console.log(postInfo)
        var condition = {user_name: postInfo.user_name, title: postInfo.title}
        postModel.update(condition, postInfo)
        this.getPostInfo(browser, index + 1, elemIdList, callback)
      })
    }

  getNextPostPage(nextPageCallback, endPageCallback, prevData) {
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
