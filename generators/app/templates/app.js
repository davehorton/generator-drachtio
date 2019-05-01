const Srf = require('drachtio-srf');
const srf = new Srf();
<% if (useFsmrf) { -%>
const Mrf = require('drachtio-fsmrf');
const mrf = new Mrf(srf);
const {LoadBalancer} = require('drachtio-fn-fsmrf-sugar');
<% } -%>
const config = require('config');
const logger = require('pino')(config.get('logging'));
<% if (handles.includes('register')) { -%>
const regParser = require('drachtio-mw-registration-parser') ;
<% } -%>
<% if (test) { -%>

// disable logging in test mode
if (process.env.NODE_ENV === 'test') {
  const noop = () => {};
  logger.info = logger.debug = noop;
  logger.child = () => {return {info: noop, error: noop, debug: noop};};
}
<% } -%>

srf.connect(config.get('drachtio'));
srf.on('connect', (err, hp) => {
  if (err) throw err;
  logger.info(`connected to drachtio listening on ${hp}`);
<% if (useFsmrf) { -%>
  const lb = srf.locals.lb = new LoadBalancer();
  lb.start({servers: config.get('freeswitch'), logger, mrf});
<% } -%>
<% if (test) { -%>
});
if (process.env.NODE_ENV !== 'test') {
  srf.on('error', (err) => logger.error(err));
}
<% } else { -%>
})
  .on('error', (err) => logger.error(err));
<% } -%>

<% if (handles.includes('register')) { -%>
// middleware
srf.use('register', regParser);

<% } %>
<% if (handles.includes('invite')) { -%>
srf.invite(require('./lib/invite')({logger}));
<% } -%>
<% if (handles.includes('register')) { -%>
srf.register(require('./lib/register')({logger}));
<% } -%>
<% if (handles.includes('options')) { -%>
srf.options(require('./lib/options')({logger}));
<% } -%>
<% if (handles.includes('info')) { -%>
srf.info(require('./lib/info')({logger}));
<% } -%>
<% if (handles.includes('subscribe')) { -%>
srf.subscribe(require('./lib/subscribe')({logger}));
<% } -%>
<% if (handles.includes('publish')) { -%>
srf.publish(require('./lib/publish')({logger}));
<% } -%>
<% if (handles.includes('message')) { -%>
srf.message(require('./lib/message')({logger}));
<% } -%>

<% if (test) { -%>
module.exports = {srf};
<% } -%>
