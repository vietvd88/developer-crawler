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

var browser = null
function getBrowser() {
  if (browser == null) {
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
    browser = webdriverio.remote(options).init()
    return browser
  }
  return browser
}

var Github = require('./crawler/Github')
const github = new Github()

var Qiita = require('./crawler/Qiita')
const qiita = new Qiita()

var Facebook = require('./crawler/Facebook')
const facebook = new Facebook()

function crawlDeveloper(url, type) {
  console.log('===== crawlDeveloper =====', url, type)
  var crawler
  if (type == 'github') {
    var Github = require('./crawler/Github')
    crawler = new Github()
  } else if (type == 'qiita') {
    var Qiita = require('./crawler/Qiita')
    crawler = new Qiita()
  } else {
    return
  }
  crawler.getSeedURLs(url, function (data, error) {
    if (error != null) {
      console.log(error)
      return
    }
  })

  // facebook.getPeronalInformation('https://m.facebook.com/suinyeze/about')
  // facebook.getPeronalInformation('https://m.facebook.com/bobo.pipi.1/about')
}

function crawlDeveloperInfo() {
  console.log('===== crawlDeveloperInfo =====')
  // facebook.getPeronalInformation('https://m.facebook.com/bobo.pipi.1/about')
  var queueModel = getModel('DeveloperUrlQueue')
  queueModel.getAll().then(data => {
    // console.log(data)
    if (data && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var url = data[i].url
        var type = data[i].type
        console.log(url, type)

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

        setTimeout((function(url){
          return () => {
            console.log('get develep info: ' + url);
            crawler.getPeronalInformation(url)
          }
        })(url), 30000 * (i+1));
      }
    }
  })
}
