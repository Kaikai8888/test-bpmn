'use strict';

const {Engine} = require('bpmn-engine')
const fs = require('fs')
const source = fs.readFileSync('./resources/two-tasks.bpmn')
const { getData, processData } = require('./lib')

const engine = new Engine({
  name: 'service task example 1',
  source,
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda')
  },
  extensions: {
    saveToResultVariable(activity) {
      console.log('saveToResultVariable')

      if (!activity.behaviour.resultVariable) return;

      activity.on('end', ({environment, content}) => {
        environment.output[activity.behaviour.resultVariable] = content.output[0];
      });
    },
  }
});

engine.execute({
  variables: {
    apiPath: 'https://wic.heo.taipei/OpenData/API/Rain/Get?stationNo=&loginId=open_rain&dataKey=85452C1D'
  },
  services: {
    getData, processData
  }
}, (err, execution) => {
  if (err) throw err;

  console.log('Service task output:', execution.environment.output.serviceResult);
});