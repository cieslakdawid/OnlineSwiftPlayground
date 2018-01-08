// Copyright Marcin Krzyżanowski marcin@krzyzanowskim.com

let Playground = require('./playground.js')
let Base64 = require('js-base64').Base64;
let W3CWebSocket = require('websocket').w3cwebsocket;

function connect() {
    var ws = new W3CWebSocket('ws://' + location.host + '/terminal', 'terminal');
    global.playground = new Playground(ws)

    ws.onopen = function() {
        console.log('WebSocket Client Connected');
        if (ws.readyState === ws.OPEN) {
            //
        }
    };
  
    ws.onmessage = function(e) {
        if (typeof e.data === 'string') {
            command = JSON.parse(e.data)
            if (command.output.value !== undefined) {
                playground.processOutput(command.output.value, command.output.annotations)
            }
        }
    };
  
    ws.onclose = function(e) {
      console.log('Socket is closed. Reconnect will be attempted in 20 second.', e.reason);
      setTimeout(function() {
        connect();
      }, 20000);
    };
  
    ws.onerror = function(err) {
      console.error('Socket encountered error: Closing socket');
      ws.close();
    };
}

connect();
