define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',

        'balek-modules/coopilot/menu/Interface/menuBar',
        'balek-modules/components/syncedCommander/Interface',],
    function (declare, lang, topic, //terminalInterface, consoleInterface,
              MenuBar,
              _SyncedCommanderInterface ) {
        return declare("moduleCoopilotMenuInterface", _SyncedCommanderInterface, {
            _instanceKey: null,
            _menuBarInterface: null,
            constructor: function (args) {
                declare.safeMixin(this, args);
                console.log("moduleCoopilotMenuInterface started", this._instanceKey);
            },
            onInterfaceStateChange: function (name, oldState, newState) {
                this.inherited(arguments);
                if (name === "Status" && newState === "Ready") {
                    console.log("Instance Status:", newState);

                }else if (name === "menuBarInstanceKeys") {
                    //Check that we got all the keys
                    if(newState.instanceKey && newState.sessionKey && newState.userKey && newState.componentKey)
                    {
                        this._menuBarInterface = new MenuBar({   _instanceKey:newState.instanceKey,
                            _sessionKey:  newState.sessionKey,
                            _userKey: newState.userKey,
                            _componentKey: newState.componentKey,
                            _menuInstanceCommands:  this._instanceCommands });
                    }
                }
            }
        });
    }
);