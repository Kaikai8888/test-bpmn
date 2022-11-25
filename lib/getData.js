const axios = require('axios')
async function getData(scope, callback) {
  console.log('get Data')
  let result = await axios({
    method: 'GET',
    url: scope.environment.variables.apiPath,
  }).then(result => {
    console.log('get api request result')
    return result.data
  })
  
  return callback(null, result)
}

module.exports = getData