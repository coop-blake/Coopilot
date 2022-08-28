define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
        'dojo/on',
        'dojo/query',

        "dojo/dom-construct",
        'dojo/dom-style',
        "dojo/dom-class",
        "dojo/_base/window",

        "dojo/keys",


        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",

        'dojo/text!balek-modules/coopilot/UNFIPricer/resources/html/itemInfo.html',
    ],
    function (declare,
              lang,
              topic,
              on,
              query,

              domConstruct,
              domStyle,
              domClass,
              win,

              dojoKeys,

              _WidgetBase,
              _TemplatedMixin,


              interfaceHTMLFile

    ) {

        return declare("moduleCoopilotUNFIPricerItemInfoInterface", [_WidgetBase,_TemplatedMixin], {

            _inventoryInfoDiv: null,

            baseClass: "coopilotUNFIPricerItemInfoInterface",
            eachPrice : "",
            casePrice : "",
            productName : "",
            productBrand : "",
            scanCode: "",

            templateString: interfaceHTMLFile,

            inventoryModel: null,
            pricebookModel: null,


            inventoryModel: null,
            inventoryModelState: null,
            inventoryModelStateWatchHandle: null,

            pricebookModel: null,
            pricebookModelState: null,
            pricebookModelStateWatchHandle: null,


            constructor: function (args) {

                declare.safeMixin(this, args);

               if(this.pricebookModel){
                   this.pricebookModelState = this.pricebookModel.getModelState()
                   this.pricebookModelStateWatchHandle = this.pricebookModelState.watch(lang.hitch(this, this.onPricebookModelStateChange))
               }else {
                  console.log("ERROR: no pricebook model in itemInfo")
               }
               if(this.inventoryModel){
                this.inventoryModelState = this.inventoryModel.getModelState()
                this.inventoryModelStateWatchHandle = this.inventoryModelState.watch(lang.hitch(this, this.onInventoryModelStateChange))
               }else {
                    console.log("ERROR: no inventory model in itemInfo")
               }

            },

            postCreate: function(){
                this.refreshUI();

            },
            refreshUI: function(){
                let inventoryEntry = this.inventoryModel.getEntryByScanCode(String(this.scanCode))
                let pricebookEntry = this.pricebookModel.getEntryByScanCode(String(this.scanCode))

                let marginFactor = 0


                if(inventoryEntry){
                    this._inventoryInfoDiv.innerHTML = `<b> ${inventoryEntry.name} ${inventoryEntry.size}  </b><br/>
                                                        <b>Last Cost:</b> ${parseFloat(inventoryEntry.lastCost).toFixed(2) } <br/>
                                                        <b>BasePrice:</b> ${inventoryEntry.basePrice} <br/>
                                                        <b>Sub Department:</b> ${inventoryEntry.subdepartment} <br/>
                                                        <b>Ideal Margin:</b> ${inventoryEntry.idealMargin}<br/>
                                                        <b>Default Supplier:</b> ${inventoryEntry.defaultSupplier}`
                    marginFactor = 1 - parseFloat(inventoryEntry.idealMargin)/100
                }else
                {
                    this._inventoryInfoDiv.innerHTML = "No Inventory Entry"
                }

                if(pricebookEntry){
                    this._infoDiv.innerHTML = `<b>Description:</b> ${pricebookEntry.description } <br/>
                                                <b>Each Price:</b> ${parseFloat(pricebookEntry.eachPrice).toFixed(2) } <br/>  
                                                 <b>Prop SRP:</b> ${(pricebookEntry.eachPrice/marginFactor).toFixed(2)} <br/>
                                                 <b>MSRP:</b> ${pricebookEntry.MSRP}<br/><br/>
                                <a href="https://products.unfi.com/api/Images/GetByUPC?upc=${pricebookEntry.UPC}&version=3" target="_blank"   >UNFI Website Picture</a>        `
                }else
                {
                    this._infoDiv.innerHTML = "No Pricebook Entry"
                }

            },
            onPricebookModelStateChange: function(name, oldState, newState) {
                if(name == "dataProcessedWhen"){
                    this.refreshUI()
                }
            },
            onInventoryModelStateChange: function(name, oldState, newState) {
                if(name == "dataProcessedWhen"){
                    this.refreshUI()
                }
            },

            unload: function () {
                this.inventoryModelStateWatchHandle.unwatch()
                this.inventoryModelStateWatchHandle.remove()
                this.pricebookModelStateWatchHandle.unwatch()
                this.pricebookModelStateWatchHandle.remove()
                this.destroy();
            }
        });
    }
);



