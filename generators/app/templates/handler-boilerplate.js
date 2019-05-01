<% if (method === 'invite') { -%>
const parseUri = require('drachtio-srf').parseUri;
<% } -%>

module.exports = handler;

function handler({logger}) {
<% if (method === 'invite') { -%>
  return async(req, res) => {
    const srf = req.srf;
    const uri = parseUri(req.uri);
    logger.info(uri, `received ${req.method} from ${req.protocol}/${req.source_address}:${req.source_port}`);
    try {
<% } else { -%>
  return (req, res) => {
    logger.info(`received ${req.method} from ${req.protocol}/${req.source_address}:${req.source_port}`);
<% } -%>
<% if (method === 'register') { -%>
    logger.info(req.registration, 'registration details');
<% } -%>
<% if (useFsmrf && method === 'invite') { -%>
      const mediaservers = srf.locals.lb.getLeastLoaded();
      const ms = mediaservers[0];
      logger.info(`selected freeswitch media server at ${ms.address}`);
      const {endpoint, dialog} = await ms.connectCaller(req, res);
      dialog.on('destroy', () => {
        endpoint.destroy();
      });
<% } else if (method === 'invite') { -%>
      const {uas, uac} = await srf.createB2BUA(req, res, 'sip:172.38.0.12');
      logger.info('call connected successfully');
      uas.other = uac;
      uac.other = uas;
      [uas, uac].forEach((dlg) => dlg.on('destroy', () => {
        logger.info('call ended'); dlg.other.destroy();
      }));
<% } -%>
<% if (method === 'invite') { -%>
    } catch (err) {
      logger.error(err, 'Error connecting call');
    }
<% } else { -%>
    return res.send(480, 'Under Construction!');
<% } -%>
  };
}
