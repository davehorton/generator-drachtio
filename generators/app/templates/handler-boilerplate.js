<% if (method === 'invite') { -%>
const parseUri = require('drachtio-srf').parseUri;
<% } -%>

module.exports = handler;

function handler({logger}) {
  return (req, res) => {
<% if (method === 'invite') { -%>
    const uri = parseUri(req.uri);
    logger.info(uri, `received ${req.method} from ${req.protocol}/${req.source_address}:${req.source_port}`);
<% } else { -%>
    logger.info(`received ${req.method} from ${req.protocol}/${req.source_address}:${req.source_port}`);
<% } -%>
<% if (method === 'register') { -%>
    logger.info(req.registration, 'registration details');
<% } -%>

    return res.send(480, 'Under Construction!');
  }
};
