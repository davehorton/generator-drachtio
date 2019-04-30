const test = require('blue-tape');
const { output, sippUac } = require('./sipp')('test_<%- appname %>');
const debug = require('debug')('drachtio:<%- appname %>');
const clearModule = require('clear-module');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

function connect(connectable) {
  return new Promise((resolve, reject) => {
    connectable.on('connect', () => {
      return resolve();
    });
  });
}

test.skip('startup and connect', (t) => {
  const {srf} = require('../app');

  connect(srf)
    .then(() => {
      t.pass('connected ok');
      srf.disconnect();
      t.end();
      return;
    })
    .catch((err) => {
      if (srf) srf.disconnect();
      console.log(`error received: ${err}`);
      t.error(err);
    });
});

test('expect 480', (t) => {
  clearModule('../app');
  const {srf} = require('../app');

  connect(srf)
    .then(() => {
      return sippUac('uac-expect-480.xml');
    })
    .then(() => {
      t.pass('successfully returned 480 to invite...not get to work!');
      srf.disconnect();
      t.end();
      return;
    })
    .catch((err) => {
      if (srf) srf.disconnect();
      console.log(`error received: ${err}`);
      t.error(err);
    });
});

