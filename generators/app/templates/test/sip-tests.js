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

<% if (handles.includes('invite')) { -%>
test('invite handler', (t) => {
  clearModule('../app');
  const {srf, disconnectMs} = require('../app');

  connect(srf)
    .then(() => {
      return sippUac('uac-pcap.xml');
    })
    .then(() => {
      t.pass('successfully connected call');
      if (srf.locals.lb) srf.locals.lb.disconnect();
      srf.disconnect();
      t.end();
      return;
    })
    .catch((err) => {
      if (srf.locals.lb) srf.locals.lb.disconnect();
      if (srf) srf.disconnect();
      console.log(`error received: ${err}`);
      t.error(err);
    });
});
<% } -%>

<% handles.filter((m) => m !== 'invite').forEach((m) => { -%>
test('<%= m %> handler', (t) => {
  clearModule('../app');
  const {srf} = require('../app');

  connect(srf)
    .then(() => {
      return sippUac('uac-<%= m %>-expect-480.xml');
    })
    .then(() => {
      t.pass('<%= m %> handler passed');
      if (srf.locals.lb) srf.locals.lb.disconnect();
      srf.disconnect();
      t.end();
      return;
    })
    .catch((err) => {
      if (srf.locals.lb) srf.locals.lb.disconnect();
      if (srf) srf.disconnect();
      console.log(`error received: ${err}`);
      t.error(err);
    });
});
<% }); -%>
