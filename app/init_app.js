var Github = require('./crawler/Github')
var GithubDeveloper = require('./model/GithubDeveloper')
var GithubDeveloperRepo = require('./model/GithubDeveloperRepo')
var GithubDeveloperRepo = require('./model/GithubDeveloperComment')
var models = {}

var developerList = []
function init() {
  const github = new Github()
  github.getDeveloperList().then((developer) => {
    developerList = developer
    const script = document.createElement('script');
    const port = process.env.PORT || 3000;
    script.src = (process.env.HOT)
      ? 'http://localhost:' + port + '/dist/bundle.js'
      : './dist/bundle.js';
    // HACK: Writing the script path should be done with webpack
    document.body.appendChild(script);
  })
  .catch(function(reason) {
    console.log(reason)      
  });
}

function getDeveloperList() {
  return developerList
}

function crawlingButton() {
  console.log('=====crawlingButton=====')
}

function getRepos(userName) {
  
}

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

init()


// var Github = require('./crawler/Github')
// const github = new Github()

// function startCrawling() {
//   var url = 'http://github-awards.com/users?utf8=%E2%9C%93&type=country&language=php&country=Vietnam';
//   github.getSeedURLs(url, function (data, error) {
//     if (error != null) {
//       console.log(error)
//       return
//     }
//     // var data = ['a', 'b', 'c']
//     // console.log(data)
//     if (data && data.length > 0) {
//       // console.log('get develep info')
//       for (var i = 0; i < data.length; i++) {
//         var url = data[i]
//         setTimeout((function(url){
//           return () => {
//             console.log('get develep info: ' + url);
//             github.getPeronalInformation(url)
//             // console.log('troi oi') 
//           }
//         })(url), 60000 * (i+1));

//         // console.log('get develep info: ' + data[i])
//         // github.getPeronalInformation(data[i])
//         // github.sleep(90000) // 1.5 minute
//       }
//     }
//   })

//   // github.getPeronalInformation('https://github.com/liratanak')
// }

// const knex = require('./db/knex')

// const webdriverio = require('webdriverio')
// const options = {
//   host: 'localhost', // Use localhost as chrome driver server
//   port: 9515,        // "9515" is the port opened by chrome driver.
//   desiredCapabilities: {
//     browserName: 'chrome',
//     chromeOptions: {
//       binary: '../jobsearchapp/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron', // Path to your Electron binary.
//       args: [/* cli arguments */]           // Optional, perhaps 'app=' + /path/to/your/app/
//     }
//   }
// }

// let client = webdriverio.remote(options)

// let dbFile = '/Users/vu.viet/jobsearch/jobsearchapp/app/db/app.db';
// let knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: dbFile
//   }
// });

// knex
// .select().from('github_developer')
// .map(function(row) {
//   console.log(row);
// })


// client
//   .init()
//   .url('http://github-awards.com/users?utf8=%E2%9C%93&type=country&language=php&country=Vietnam')
//   .getTitle().then((title) => {
//     console.log(title)
//   })
//   .getText('.username').then((value) => {
//     console.log("==== username ====" + value.length)
//     // console.log(value)
//     // client.url('https://github.com/' + value[0])
//     getRepos(client, 'rilwis');
//   })

// function getRepos(client, userName) {
//   client
//     .url('https://github.com/' + userName + '?tab=repositories')
//     .elements('#user-repositories-list li').then((response) => {
//       console.log("==== text ====" + response.value.length)
//       for (var i = response.value.length - 1; i >= 0; i--) {
//         getRepoInfo(client, response.value[i].ELEMENT)
//       }

//       // client.url('https://github.com/' + value[0])
//       // getRepos(client, value);
//       // client.elementIdText(2, function(err,res) {
//       //     console.log(res.value);
//       // });
//     })
// }

// function getRepoInfo(client, elemId) {
//   var repoInfo = {}
  
//   // get repo name
//   client
//   .elementIdElement(elemId, 'a[itemprop="name codeRepository"]')
//   .then((response) => {
//     if (response && response.value) {
//       return getElemText(client, response.value.ELEMENT, repoInfo, 'name')  
//     }
//     repoInfo.name = ''
//     return client;
//   })
//   // get repo description
//   .elementIdElement(elemId, 'p[itemprop="description"]')
//   .then((response) => {
//     if (response && response.value) {
//       return getElemText(client, response.value.ELEMENT, repoInfo, 'description')  
//     }
//     repoInfo.description = ''
//     return client;
//   })
//   // get repo description
//   .elementIdElement(elemId, 'span[itemprop="programmingLanguage"]')
//   .then((response) => {
//     if (response && response.value) {
//       return getElemText(client, response.value.ELEMENT, repoInfo, 'language')  
//     }
//     repoInfo.language = ''
//     return client;
//   })
//   // get repo description
//   .elementIdElement(elemId, 'a[aria-label="Stargazers"]')
//   .then((response) => {
//     if (response && response.value) {
//       return getElemText(client, response.value.ELEMENT, repoInfo, 'star')  
//     }
//     repoInfo.star = 0
//     return client;
//   })
//   .catch(function(e) {
//     console.log(e); // "oh, no!"
//   })
//   .then((response) => {
//     console.log(repoInfo)
//   })

  
// }

// function getElemText(client, elemId, repoInfo, attribute) {
//   return client
//     .elementIdText(elemId).then((response) => {
//       repoInfo[attribute] = response.value
//       return response.value
//     })
// }

// function sleep(milliseconds) {
//   var start = new Date().getTime();
//   for (var i = 0; i < 1e7; i++) {
//     if ((new Date().getTime() - start) > milliseconds){
//       break;
//     }
//   }
// }

// var file = '/Users/vu.viet/jobsearch/jobsearchapp/app/db/app.db';

// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database(file);

// db.serialize(function() {
//   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });

// db.close();
