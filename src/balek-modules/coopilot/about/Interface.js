define(['dojo/_base/declare',
        'dojo/_base/lang',
        'balek-modules/Interface',
        'dojo/topic',
        "dojo/dom-construct",
        "dojo/_base/window",
        'balek-modules/coopilot/about/Interface/main'
    ],
    function (declare, lang, baseInterface, topic, domConstruct, win, MainInterface) {

        return declare("moduleCoopilotAboutInterface", baseInterface, {
            _instanceKey: null,
            _mainInterface: null,

            constructor: function (args) {

                declare.safeMixin(this, args);
                this.showAboutSubscribeHandle =  topic.subscribe("showAboutInterface", lang.hitch(this, this.showAboutInterface));
                this._mainInterface = new MainInterface({_instanceKey: this._instanceKey});

            },
            receiveMessage: function (moduleMessage) {
                console.log("You shouldn't be seeing this", moduleMessage);
            },
            showAboutInterface: function (){
                topic.publish("displayAsDialog", this._mainInterface);
            },
            unload: function () {
                this.showAboutSubscribeHandle.remove();
                this._mainInterface.unload();
            }
        });
    }
);



