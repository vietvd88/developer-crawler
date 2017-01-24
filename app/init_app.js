var Github = require('./crawler/Github')
var GithubDeveloper = require('./model/GithubDeveloper')
var GithubDeveloperRepo = require('./model/GithubDeveloperRepo')
var GithubDeveloperComment = require('./model/GithubDeveloperComment')
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

// var Qiita = require('./crawler/Qiita')
// const qiita = new Qiita()

var Facebook = require('./crawler/Facebook')
const facebook = new Facebook()

function startCrawling() {
  // var url = 'http://qiita.com/tags/PHP/likes';
  // qiita.getSeedURLs(url, function (data, error) {
  //   if (error != null) {
  //     console.log(error)
  //     return
  //   }
  //   console.log(data)
  //   if (data && data.length > 0) {
  //     for (var i = 0; i < data.length; i++) {
  //       var url = data[i]
  //       setTimeout((function(url){
  //         return () => {
  //           console.log('get develep info: ' + url);
  //           github.getPeronalInformation(url)
  //         }
  //       })(url), 60000 * (i+1));
  //     }
  //   }
  // })

  facebook.getPeronalInformation('https://m.facebook.com/suinyeze')
}


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

