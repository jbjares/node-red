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
    var htmlToText = require('html-to-text');
    var emojiStrip = require('emoji-strip');
    const emojiRegex = require('emoji-regex');
    var emoji_replace = require('emoji-replace');
    // The main node definition - most things happen in here
    function HtmltotextWatsonConversation(n) {
        // Create a RED node
        RED.nodes.createNode(this,n);

        // Store local copies of the node configuration (as defined in the .html)
        this.topic = n.topic;

        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;

        // Do whatever you need to do in here - declare callbacks etc
        // Note: this sample doesn't do anything much - it will only send
        // this message once at startup...
        // Look at other real nodes for some better ideas of what to do....
        var msg = {};
        msg.topic = this.topic;
        msg.payload = "Hello world !"

        // send out the message to the rest of the workspace.
        // ... this message will get sent at startup so you may not see it in a debug node.
        this.send(msg);

        // respond to inputs....
        this.on('input', function (msg) {
            //node.warn("I saw a payload: "+msg.payload);
            // in this example just send it straight on... should process it here really
            //node.send(msg);
            //var originalPayload = msg.payload;

            //if(msg.payload.output.text[0]!=null){
             //   console.log(msg.payload.output.text[0]);
            //}
            //msg.payload = {chatId : msg.telegramMsg.chat_id,
             //   type : "message",
              //  content : msg.payload.output.text[0]};

            console.log("msg output init : "+msg.payload.output.text[0]);
            var msgToTranslateToText = msg.payload.output.text[0];
            console.log("msgToTranslateToText: "+msgToTranslateToText);
            var text = htmlToText.fromString(msgToTranslateToText, {
                wordwrap: 130
            });
            console.log("msgToTranslateToText after htmml converter: "+msgToTranslateToText);
            var newtext = emojiStrip(text);

            console.log("msgToTranslateToText after emojiStrip: "+newtext);
            newtext = newtext.replace("/(]+)>)/ig", "");
            console.log("msgToTranslateToText after regex: "+newtext);

            var finalText = emoji_replace(newtext);
            msg.payload.output.text[0] = emojiStrip(finalText);

            console.log("msg output final : "+msg.payload.output.text[0]);
            //msg.payload = originalPayload;

            console.log(JSON.stringify(msg));
            node.send(msg);
        });

        this.on("close", function() {
            // Called when the node is shutdown - eg on redeploy.
            // Allows ports to be closed, connections dropped etc.
            // eg: node.client.disconnect();
        });
    }

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("HtmltotextWatsonConversation",HtmltotextWatsonConversation);

}
