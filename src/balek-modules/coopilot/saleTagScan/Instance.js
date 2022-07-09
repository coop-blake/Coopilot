define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',

        'balek-modules/coopilot/saleTagScan/Instance/main',

        'balek-modules/components/syncedCommander/Instance'
    ],
    function (declare, lang, topic, MainInstance, _SyncedCommanderInstance) {

        return declare("moduleDigivigilWWWSaleTagScanInstance", _SyncedCommanderInstance, {
            _instanceKey: null,


            mainInstance: null,
            constructor: function (args) {

                declare.safeMixin(this, args);

                console.log("moduleDigivigilWWWSaleTagScanInstance starting...");

               this.mainInstance = new MainInstance({_instanceKey: this._instanceKey, _sessionKey: this._sessionKey, _userKey: this._userKey});

                this._interfaceState.set("mainInstanceKeys", {instanceKey: this.mainInstance._instanceKey,
                    sessionKey: this.mainInstance._sessionKey,
                    userKey: this.mainInstance._userKey,
                    componentKey: this.mainInstance._componentKey});

                this.setInterfaceCommands();

            },
            receiveMessage: function (moduleMessage, wssConnection) {
               // console.log("Message", moduleMessage.messageData)
               // console.log("Message", moduleMessage.messageData)

                if (moduleMessage.instanceKey == this._instanceKey) {
                   // console.log("Message", moduleMessage.messageData)
                    if (moduleMessage.messageData.request) {
                        switch (moduleMessage.messageData.request) {
                            case "Digivigil SaleTagScan Entry":
                                if (moduleMessage.messageData.saleTagScanEntry) {
                                    this._module.addDigivigilWWWSaleTagScanEntry(moduleMessage.messageData.saleTagScanEntry);
                                } else {
                                    console.log("SaleTagScan Entry Format Error", moduleMessage);
                                }
                                break;
                            case "SaleTagScan Entries":
                                this.sendSaleTagScanEntries(wssConnection);
                                break;
                            case "Remove Entries":
                                this._module.removeEntries();
                                break;
                            default:
                                this.inherited(arguments);

                               // console.log("Not a valid request", moduleMessage);
                        }
                    }
                } else {
                    console.log("received Module message with incorrect instanceKey", moduleMessage.instanceKey, this._instanceKey)
                }
            },
            sendSaleTagScanEntries: function (wssConnection) {
                this._module.getDigivigilWWWSaleTagScanEntries(lang.hitch(this, function (saleTagScanEntries) {
                    topic.publish("sendBalekProtocolMessage", wssConnection, {
                        moduleMessage: {
                            instanceKey: this._instanceKey,
                            messageData: {saleTagScanData: saleTagScanEntries}
                        }
                    });
                }));
            },
            _end: function () {
                return new Promise(lang.hitch(this, function(Resolve, Reject){
                    console.log("destroying saleTagScan Module Interface ");
                    Resolve({success: "Unloaded Instance"});
                }));
            }
        });
    }
);


