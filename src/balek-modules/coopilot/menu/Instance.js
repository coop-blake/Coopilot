define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',


        'balek-modules/coopilot/menu/Instance/menuBar',
        'balek-modules/components/syncedCommander/Instance'

    ],
    function (declare, lang, topic,
              MenuBar,
              _SyncedCommanderInstance ) {
        return declare("moduleCoopilotMenuModuleInstance", _SyncedCommanderInstance, {
            _instanceKey: null,
            _sessionKey: null,

            _menuBarInstance: null,



            constructor: function (args) {

                declare.safeMixin(this, args);
                this._terminalInstances = [];
                //set syncedMenu commands
                this._commands={
                    "echo" : lang.hitch(this, this.echo),
                };
                //activate syncedMenu commands
                this.setInterfaceCommands();

                this._interfaceState.set("className", "moduleCoopilotMenuModuleInstance");

                topic.publish("getSessionUserKey", this._sessionKey, lang.hitch(this, function(userKey){

                    this._userKey = userKey;

                    this._menuBarInstance = new MenuBar({_instanceKey: this._instanceKey, _sessionKey: this._sessionKey, _userKey: this._userKey});
                    this._interfaceState.set("menuBarInstanceKeys", {instanceKey: this._menuBarInstance._instanceKey,
                        sessionKey: this._menuBarInstance._sessionKey,
                        userKey: this._menuBarInstance._userKey,
                        componentKey: this._menuBarInstance._componentKey});

                }));

                console.log("moduleCoopilotMenuInstance starting...", this);

            },
            loadComponents: function(){
                console.log("Loading Instance Components")
            },
            echo:function(echo, remoteMenuCallback) {
                remoteMenuCallback({message: echo});
            },
            _end: function () {
                    return new Promise(lang.hitch(this, function(Resolve, Reject){
                        console.log("destroying Coopilot Menu Module Instance ");
                        Resolve({success: "Unloaded Instance"});
                    }));
            }
        });
    }
);


