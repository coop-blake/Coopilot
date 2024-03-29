define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',

        'balek-modules/coopilot/UNFIPackChange/Interface/main',
        'balek-modules/components/syncedMap/Interface',
        'balek-modules/components/syncedCommander/Interface',],
    function (declare, lang, topic,
              UNFIPackChange,
              SyncedMapInterface,
              _SyncedCommanderInterface ) {
        return declare("moduleCoopilotUNFIPackChangeInterface", _SyncedCommanderInterface, {
            _instanceKey: null,
            importerInterfaces: null,

            importerInstancesSyncedMap: null,
            importerInstancesSyncedMapStateWatchHandle: null,

            constructor: function (args) {
                declare.safeMixin(this, args);
                console.log("moduleCoopilotUNFIPackChangeInterface started", this._instanceKey);
                this.importerInterfaces = {}
                this._newImporterSubscribeHandle=  topic.subscribe("newUNFIPackChange", lang.hitch(this, function(topicCallback){
                    //    console.log("createNewDiaplodeFile topic Command Called");
                    this._instanceCommands.newImporter().then(lang.hitch(this, function(commandReturnResults){
                        topicCallback(commandReturnResults);
                              console.log("New Importer Received Command Response", commandReturnResults);
                    })).catch(function(commandErrorResults){
                        console.log("New Importer Received Error Response", commandErrorResults);
                    });
                }));

            },
            onInterfaceStateChange: function (name, oldState, newState) {
                this.inherited(arguments);
                if (name === "Status" && newState === "Ready") {
                    console.log("Instance Status:", newState);
                }else if (name === "importerInstancesSyncedMapComponentKey") {

                    if(this.importerInstancesSyncedMap === null)
                    {
                        this.importerInstancesSyncedMap = new SyncedMapInterface({_instanceKey: this._instanceKey, _componentKey: newState.toString()});
                        this.importerInstancesSyncedMapStateWatchHandle = this.importerInstancesSyncedMap.setStateWatcher(lang.hitch(this, this.onImporterInstancesSyncedMapChange))
                    }
                }
            },
            onImporterInstancesSyncedMapChange: function(name, oldState, newState){
                let newImporterKeys = newState
                if(this.importerInterfaces[newImporterKeys.componentKey] === undefined)
                {
                    let newUNFIPackChange = UNFIPackChange({
                        _instanceKey:newImporterKeys.instanceKey,
                        _componentKey:newImporterKeys.componentKey,
                        _sessionKey:newImporterKeys.sessionKey})
                    this.importerInterfaces[newImporterKeys.componentKey] = newUNFIPackChange

                    newUNFIPackChange.getContainerKeys().then(lang.hitch(this, function(containerKeys){
                        if(Array.isArray(containerKeys) && containerKeys.length === 0)
                        {
                           topic.publish("addToCurrentWorkspace",newUNFIPackChange );
                        }
                    })).catch(lang.hitch(this, function(error){
                        console.log(error);
                    }));

                }
            },
            unload: function() {
                this.importerInstancesSyncedMapStateWatchHandle.unwatch();
                this.importerInstancesSyncedMapStateWatchHandle.remove();
                this._newImporterSubscribeHandle.remove()
                this.importerInstancesSyncedMap.unload();
            }
        });
    }
);