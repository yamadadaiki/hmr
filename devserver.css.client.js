var url = require('url');
var socket = require('webpack-dev-server/client/socket');

function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to find the current script,
  // but is not supported in all browsers.
  if (document.currentScript) {
    return document.currentScript.getAttribute('src');
  }
  // Fall back to getting all scripts in the document.
  var scriptElements = document.scripts || [];
  var currentScript = scriptElements[scriptElements.length - 1];
  if (currentScript) {
    return currentScript.getAttribute('src');
  }
  // Fail as there was no script to use.
  throw new Error('[WDS] Failed to get current script source.');
}

// Send messages to the outside, so plugins can consume it.
function sendMsg(type, data) {
  if (typeof self !== 'undefined' && (typeof WorkerGlobalScope === 'undefined' || !(self instanceof WorkerGlobalScope))) {
    self.postMessage({
      type: 'webpack' + type,
      data: data
    }, '*');
  }
}

var urlParts = void 0;
if (typeof __resourceQuery === 'string' && __resourceQuery) {
  // If this bundle is inlined, use the resource query to get the correct url.
  urlParts = url.parse(__resourceQuery.substr(1));
} else {
  // Else, get the url from the <script> this file was called with.
  var scriptHost = getCurrentScriptSource();
  // eslint-disable-next-line no-useless-escape
  scriptHost = scriptHost.replace(/\/[^\/]+$/, '');
  urlParts = url.parse(scriptHost || '/', false, true);
}

var hostname = urlParts.hostname;
var protocol = urlParts.protocol;

// check ipv4 and ipv6 `all hostname`
if (hostname === '0.0.0.0' || hostname === '::') {
  // why do we need this check?
  // hostname n/a for file protocol (example, when using electron, ionic)
  // see: https://github.com/webpack/webpack-dev-server/pull/384
  // eslint-disable-next-line no-bitwise
  if (self.location.hostname && !!~self.location.protocol.indexOf('http')) {
    hostname = self.location.hostname;
  }
}

// `hostname` can be empty when the script path is relative. In that case, specifying
// a protocol would result in an invalid URL.
// When https is used in the app, secure websockets are always necessary
// because the browser doesn't accept non-secure websockets.
if (hostname && (self.location.protocol === 'https:' || urlParts.hostname === '0.0.0.0')) {
  protocol = self.location.protocol;
}

var socketUrl = url.format({
  protocol: protocol,
  auth: urlParts.auth,
  hostname: hostname,
  port: urlParts.port,
  pathname: urlParts.path == null || urlParts.path === '/' ? '/sockjs-node' : urlParts.path
});

socket(socketUrl, {
  'css-changed': function cssChanged() {
    var $links = document.querySelectorAll('link');
    $links.forEach(function ($link) {
      var next$Link = $link.cloneNode();
      next$Link.href = $link.href + '';
      next$Link.addEventListener('load', function () {
        $link.parentNode.removeChild($link);
      });
      $link.parentNode.insertBefore(next$Link, $link.nextSibling);
    });
  },
  close: function close() {
    sendMsg('Close');
  }
});
