'use strict';

const {Engine} = require('bpmn-engine');
const fs = require('fs');

async function postMessage(scope, callback) {
  let result = 'mock result'
  console.log('call postMessage')
  console.log(scope)
  console.log(callback)

  try {
  } catch (err) {
    return callback(null, err);
  }

  return callback(null, result);
}


const source = fs.readFileSync('./resources/service-task.bpmn')

const engine = new Engine({
  name: 'service task example 1',
  source,
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  },
  extensions: {
    saveToResultVariable(activity) {
      if (!activity.behaviour.resultVariable) return;

      activity.on('end', ({environment, content}) => {
        environment.output[activity.behaviour.resultVariable] = content.output[0];
      });
    },
  }
});

engine.execute({

  services: {
    postMessage,
  }
}, (err, execution) => {
  if (err) throw err;

  console.log('Service task output:', execution.environment.output.serviceResult);
});