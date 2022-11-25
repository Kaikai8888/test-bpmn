'use strict';

const {Engine} = require('bpmn-engine');
const axios = require('axios')

// const getJson = require('bent')('json');

async function getRequest(scope, callback) {
  try {
    console.log(scope)
    console.log(callback)
    var result = 'mock result'
    // var result = await getJson(scope.environment.variables.apiPath); // eslint-disable-line no-var
  } catch (err) {
    return callback(null, err);
  }

  return callback(null, result);
}

const source = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:camunda="http://camunda.org/schema/1.0/bpmn">
  <process id="theProcess" isExecutable="true">
  <startEvent id="theStart" />
  <serviceTask id="serviceTask" implementation="\${environment.services.getRequest}" camunda:resultVariable="serviceResult" />
  <endEvent id="theEnd" />
  <sequenceFlow id="flow1" sourceRef="theStart" targetRef="serviceTask" />
  <sequenceFlow id="flow2" sourceRef="serviceTask" targetRef="theEnd" />
  </process>
</definitions>`;

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
  // variables: {
  //   apiPath: 'https://openapi.twse.com.tw/v1/exchangeReport​/STOCK_DAY_AVG_ALL'
  // },
  services: {
    getRequest,
  }
}, (err, execution) => {
  if (err) throw err;

  console.log('Service task output:', execution.environment.output.serviceResult);
});