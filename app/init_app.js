var Github = require('./crawler/Github')
var GithubDeveloper = require('./model/GithubDeveloper')
var GithubDeveloperRepo = require('./model/GithubDeveloperRepo')
var GithubDeveloperComment = require('./model/GithubDeveloperComment')
var DeveloperUrlQueue = require('./model/DeveloperUrlQueue')
var FacebookDeveloper = require('./model/FacebookDeveloper')
var FacebookDeveloperJob = require('./model/FacebookDeveloperJob')
var FacebookDeveloperEducation = require('./model/FacebookDeveloperEducation')
var QiitaDeveloper = require('./model/QiitaDeveloper')
var QiitaDeveloperPost = require('./model/QiitaDeveloperPost')

var models = {}
function getModel(name) {
  if (models[name]) {
    console.log('model ' + name + ' exist')
    return models[name]
  } else {
    console.log('model ' + name + ' not exist, now creating it')
    eval("var model = new " + name + "()")
    models[name] = model
    return model
  }
}

function getBrowser() {
  const webdriverio = require('webdriverio')
  const options = {
    host: 'localhost', // Use localhost as chrome driver server
    port: 9515,        // "9515" is the port opened by chrome driver.
    desiredCapabilities: {
      browserName: 'chrome',
      chromeOptions: {
        binary: './node_modules/electron/dist/Electron.app/Contents/MacOS/Electron', // Path to your Electron binary.
        args: [/* cli arguments */]           // Optional, perhaps 'app=' + /path/to/your/app/
      }
    }
  }
  return webdriverio.remote(options).init()
}

var developerListBrowser
function startCrawlingDeveloper(url, type) {
  console.log('===== startCrawlingDeveloper =====', url, type)
  developerListBrowser = getBrowser()
  var crawler
  if (type == 'github') {
    var Github = require('./crawler/Github')
    crawler = new Github(developerListBrowser)
  } else if (type == 'qiita') {
    var Qiita = require('./crawler/Qiita')
    crawler = new Qiita(developerListBrowser)
  } else {
    return
  }
  crawler.getSeedURLs(url, function (data, error) {
    if (error != null) {
      console.log(error)
      return
    }
  })
}

function stopCrawlingDeveloper() {
  console.log('===== stopCrawlingDeveloper =====')
  developerListBrowser.end()
}

function crawlDeveloperInfo() {
  console.log('===== crawlDeveloperInfo =====')
  // facebook.getPeronalInformation('https://m.facebook.com/xxx/about')
  var queueModel = getModel('DeveloperUrlQueue')
  queueModel.get([], {}, 1).then(data => {
    // console.log(data)
    if (data == null || data == undefined || data.length <= 0) {
      return;
    }
    var url = data[0].url
    var type = data[0].type
    console.log('(url, type): ', url, type)

    if (type == 'github') {
      var Github = require('./crawler/Github')
      crawler = new Github()
    } else if (type == 'qiita') {
      var Qiita = require('./crawler/Qiita')
      crawler = new Qiita()
    } else if (type == 'facebook') {
      var Facebook = require('./crawler/Facebook')
      crawler = new Facebook()
    } else {
      return
    }
    crawler.getPeronalInformation(url)
  })
}

setInterval(function(){ 
  crawlDeveloperInfo()
}, 30000)
