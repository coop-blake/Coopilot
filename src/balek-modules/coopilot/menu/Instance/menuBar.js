define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
        "dojo/_base/array",

        //Balek Instance Includes
        'balek-modules/components/syncedCommander/Instance',

    ],
    function (declare,
              lang,
              topic,
              dojoArray,

              //Balek Instance Includes
              _SyncedCommanderInstance) {
        return declare("moduleCoopilotMenuInstanceMenuBar", [_SyncedCommanderInstance], {

            _sshService: null,
            constructor: function (args) {
                declare.safeMixin(this, args);
                console.log("starting moduleCoopilotMenuInstanceMenuBar");

                //set setRemoteMenu commands
                this._commands={
                    "loadModule": lang.hitch(this, this.loadModule),
                };
                this.setInterfaceCommands();

                this._interfaceState.set("Component Name","Coopilot Menu");
                //creates component Key that can be used to connect to state
                this.prepareSyncedState();

                this._interfaceState.set("Status", "Ready");

            },
            loadModule: function(module, interfaceCallback){
                topic.publish("getSessionUserGroups", this._sessionKey, lang.hitch(this, function(userGroups){
                        if(dojoArray.indexOf(userGroups, "admin") !== -1)
                        {
                            console.log("Load Module:" + module);

                        }else {
                            interfaceCallback({error: "not an administrator", data:command, groups: userGroups });
                        }
                }));

            },
            _end: function(){
                //calls inherited _end functions like stateSynced Object
                this.inherited(arguments);
            }
        });
    });