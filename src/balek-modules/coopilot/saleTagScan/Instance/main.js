define(['dojo/_base/declare',
        'dojo/_base/lang',

        'balek-modules/components/syncedStream/Instance',

        //Balek Instance Includes
        'balek-modules/components/syncedCommander/Instance',
    ],
    function (declare,
              lang,

              syncedStreamInstance,
              //Balek Instance Includes
              _SyncedCommanderInstance) {
        return declare("moduleCoopilotScansInstance", [_SyncedCommanderInstance], {

            scanEntries: null,


            constructor: function (args) {
                declare.safeMixin(this, args);
                console.log("starting moduleCoopilotScansInstance");




                this.scanEntries = new syncedStreamInstance({_instanceKey: this._instanceKey});
                this._interfaceState.set("scanEntriesComponentKey", this.scanEntries._componentKey);


                //set setRemoteCommander commands
                this._commands={
                    "addScanEntry": lang.hitch(this, this.addScanEntry),
                    "removeScanEntry" : lang.hitch(this, this.removeScanEntry)
                };
                this.setInterfaceCommands();

                this._interfaceState.set("Component Name","terminal");
                //creates component Key that can be used to connect to state
                this.prepareSyncedState();

                this._interfaceState.set("Status", "Ready");





            },
            addScanEntry: function( input){
                  console.log("addScanEntry", input);
            },
            removeScanEntry: function( input){
                console.log("removeScanEntry", input);
            },
            //##########################################################################################################
            //Instance Override Functions Section
            //##########################################################################################################
            _end: function(){
                //calls inherited _end functions like stateSynced Object
                this.inherited(arguments);
            }
        });
    });