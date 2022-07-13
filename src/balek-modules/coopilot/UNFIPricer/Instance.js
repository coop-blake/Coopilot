define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',

        'balek-modules/coopilot/UNFIPricer/Instance/main',
        'balek-modules/components/syncedMap/Instance',

        'balek-modules/components/syncedCommander/Instance'
    ],
    function (declare, lang, topic, ImporterInstance, SyncedMapInstance, _SyncedCommanderInstance) {

        return declare("moduleDigivigilWWWSaleTagScanInstance", _SyncedCommanderInstance, {
            _instanceKey: null,
            importerInstancesSyncedMap: null,

            constructor: function (args) {

                declare.safeMixin(this, args);

                console.log("moduleCoopilotUNFIPricerInstance starting...");

                this.importerInstancesSyncedMap = new SyncedMapInstance({_instanceKey: this._instanceKey});
                //todo remove synced map from tab importer but add to dataTables
                this._interfaceState.set("importerInstancesSyncedMapComponentKey", this.importerInstancesSyncedMap._componentKey);
             /*  this.mainInstance = new MainInstance({_instanceKey: this._instanceKey, _sessionKey: this._sessionKey, _userKey: this._userKey});

                this._interfaceState.set("mainInstanceKeys", {instanceKey: this.mainInstance._instanceKey,
                    sessionKey: this.mainInstance._sessionKey,
                    userKey: this.mainInstance._userKey,
                    componentKey: this.mainInstance._componentKey});
*/

                //set setRemoteCommander commands
                this._commands={
                    "newUNFIPricer": lang.hitch(this, this.newUNFIPricer)
                };
                this.setInterfaceCommands();
                this._interfaceState.set("Component Name","Tab Importer");
                //creates component Key that can be used to connect to state
                this.prepareSyncedState();

                this._interfaceState.set("Status", "Ready");

            },
            newUNFIPricer: function( returnCallback){
                //console.log("newUNFIPricer", input);

                debugger;

                let newUNFIPricer = new ImporterInstance({_instanceKey: this._instanceKey, _sessionKey: this._sessionKey, _userKey: this._userKey});
                this.importerInstancesSyncedMap.add(newUNFIPricer._componentKey,  {instanceKey: newUNFIPricer._instanceKey,
                    sessionKey: newUNFIPricer._sessionKey,
                    userKey: newUNFIPricer._userKey,
                    componentKey: newUNFIPricer._componentKey})
                returnCallback({message: "success"});

            },
            _end: function () {
                return new Promise(lang.hitch(this, function(Resolve, Reject){
                    console.log("destroying UNFIPricer Module Interface ");
                    Resolve({success: "Unloaded Instance"});
                }));
            }
        });
    }
);


