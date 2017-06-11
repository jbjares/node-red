/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// If you use this as a template, update the copyright with your own name.

// Sample Node-RED node file


module.exports = function(RED) {
    "use strict";
    // require any external libraries we may need....
    //var foo = require("foo-library");
    var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
    var htmlToText = require('html-to-text');
    var emojiStrip = require('emoji-strip');
    const emojiRegex = require('emoji-regex');
    var emoji_replace = require('emoji-replace');
    // The main node definition - most things happen in here
    function CustomDiscoveryQuery(n) {
        // Create a RED node
        // Create a RED node
        RED.nodes.createNode(this,n);

        // Store local copies of the node configuration (as defined in the .html)
        this.query = n.query;

        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;

        // Do whatever you need to do in here - declare callbacks etc
        // Note: this sample doesn't do anything much - it will only send
        // this message once at startup...
        // Look at other real nodes for some better ideas of what to do....
        var msg = {};
        msg.query = this.query;
        msg.payload = ""

        // send out the message to the rest of the workspace.
        // ... this message will get sent at startup so you may not see it in a debug node.
        this.send(msg);

        var res = {};
        // respond to inputs....
        this.on('input', function (msg) {
            //node.warn("I saw a payload: "+msg.payload);
            // in this example just send it straight on... should process it here really
            //node.send(msg);
            //var originalPayload = msg.payload;
            var discovery = new DiscoveryV1({
                username: '0d500449-16d7-438f-9623-4cfde1dff85c',
                password: 'wlpW48uhT4bo',
                version_date: '2016-12-01'
            });
            discovery.query({
                environment_id: process.env.DISCOVERY_ENVIRONMENT || 'd9aef3da-7726-4e83-846f-90bc3af069e9',
                collection_id: process.env.DISCOVERY_COLLECTION || '328b6f42-dd5a-475b-aa5d-de89dba9c5a9',
                query: msg.query,
                passages: true,
                count: 1
            }, function (err, response) {
                var reply = {};
                if(response[0]==null){
                    reply = response;
                }
                if(response[0]!=null){
                    reply = response[0].highlight[0].text;
                }


                var text = htmlToText.fromString(JSON.stringify(reply), {wordwrap:1300});
                var jsonText = JSON.stringify(text);

                if(jsonText.includes('\\n')){
                    jsonText = jsonText.replace(/\n/g, ' ');
                    jsonText = jsonText.replace(/\\n/g, ' ')
                }
                if(jsonText.includes('\\')){
                    jsonText = jsonText.replace('\\', ' ');
                    jsonText = jsonText.replace(/\\/g, ' ')
                }
                if(jsonText.includes('...')){
                    jsonText = jsonText.replace('...', ' ');
                }
                if(jsonText.includes('>') || jsonText.includes(' > ')){
                    jsonText = jsonText.replace('>', ' em seguida ');
                    jsonText = jsonText.replace(' > ', ' em seguida ');
                }
                var newtext = emojiStrip(jsonText);

                var asteriskRegerx = "/[*]/gixsm";
                if(newtext.includes('*')){
                    newtext = newtext.replace(asteriskRegerx, " ");
                }
                msg.queryResult = newtext;
                node.send(msg);
            });
        });

        this.on("close", function() {
            // Called when the node is shutdown - eg on redeploy.
            // Allows ports to be closed, connections dropped etc.
            // eg: node.client.disconnect();
        });
    }

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("CustomDiscoveryQuery",CustomDiscoveryQuery);

}
