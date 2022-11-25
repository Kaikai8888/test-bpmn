async function processData(scope, callback) {
  console.log('process Data')
  let result = { data: scope.environment.output.serviceResult, processed: true }
  
  return callback(null, result)
}
module.exports = processData