var QiitaDeveloper = require('../model/QiitaDeveloper')
var QiitaDeveloperPost = require('../model/QiitaDeveloperPost')
var DeveloperUrlQueue = require('../model/DeveloperUrlQueue')

module.exports = class Qiita {
  constructor(url) {
    this.url = url
    this.done = false
    this.seedUrls = []

    this.browser = getBrowser()
    this.browser.init()
    this.developerModel = new QiitaDeveloper()
    this.postModel = new QiitaDeveloperPost()
    this.urlQueue = new DeveloperUrlQueue()
  }

  getSeedURLs(url, callback) {
    console.log('getSeedURLs')
    var urlQueue = this.urlQueue
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
              urlQueue.insert({
                url: 'http://qiita.com/' + names[i],
                type: 'qiita'
              })
            }
        } else {
            this.seedUrls.push('http://qiita.com/' + names)
            urlQueue.insert({
              url: 'http://qiita.com/' + names,
              type: 'qiita'
            })
        }
        
        this.getNextPostPage((url, callback) => { this.getSeedURLs(url, callback) }, callback, this.seedUrls)
      })
      .catch(function(reason) {
        console.log(reason)
        callback(null, reason)
      });
  }

  getPeronalInformation(url) {
    var urlQueue = this.urlQueue
    this.getDeveloperInfo(url, (developerInfo, error) => {
      console.log(developerInfo)
      urlQueue.delete({
        url: url
      })

      if (error != null) {
        this.browser.end()
        return
      }

      this.getPosts(url)
    })
  }

  getDeveloperInfo(url, callback) {
    console.log('get develep info: ' + url)
    var developerModel = this.developerModel
    var urlQueue = this.urlQueue
    var developerInfo = {}
    var crawler = this
    var browser = this.browser
    var links = {}

    browser
    .url(url)
    .getAttribute('.newUserPageProfile_avatar img', 'src').then((response) => {
        developerInfo.avatar = response;
    })
    // .getAttribute('.newUserPageProfile_socialLink-facebook a', 'href').then((response) => {
    //   console.log('facebook link: ', response)
    //   if (response && response != null && response != undefined) {
    //     response = response.replace(/facebook/g , "m.facebook")
    //     response = response + "/about"
    //     urlQueue.insert({
    //       url: response,
    //       type: 'facebook'
    //     })
    //   }
    // })
    .element('.newUserPageProfile_socialLink-facebook a').then((response) => {
        return crawler.getElemAttributeByElemResponse(browser, response, 'href', links, 'facebook')
    })
    .element('.newUserPageProfile_name').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'user_name')
    })
    .element('.newUserPageProfile_name').then((response) => {
        return crawler.getElemTextByElemResponse(browser, response, developerInfo, 'name')
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
      console.log('links: ', links)
      var fbLink = links.facebook
      if (fbLink && fbLink != null && fbLink != undefined) {
        fbLink = fbLink.replace(/facebook/g , "m.facebook")
        fbLink = fbLink + "/about"
        urlQueue.insert({
          url: fbLink,
          type: 'facebook'
        })
      }

      developerInfo.post = 0
      developerInfo.contribution = 0
      developerInfo.follower = 0
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
        postInfo.tags = ''
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

  getElemTextByElemResponse(browser, elemResponse, infoObj, attribute) {
    if (elemResponse && elemResponse.value) {
      return this.getElemText(browser, elemResponse.value.ELEMENT, infoObj, attribute)  
    }
    infoObj[attribute] = ''
    return browser;
  }

  getElemText(browser, elemId, infoObj, attribute) {
    return browser
      .elementIdText(elemId).then((response) => {
        infoObj[attribute] = response.value
        return response.value
      })
  }

  getElemAttributeByElemResponse(browser, elemResponse, elemAttribute, infoObj, attribute) {
    if (elemResponse && elemResponse.value) {
      return this.getElemAttribute(browser, elemResponse.value.ELEMENT, elemAttribute, infoObj, attribute)  
    }
    infoObj[attribute] = ''
    return browser;
  }

  getElemAttribute(browser, elemId, elemAttribute, infoObj, attribute) {
    return browser
      .elementIdAttribute(elemId, elemAttribute).then((response) => {
        infoObj[attribute] = response.value
        return response.value
      })
  }
}
