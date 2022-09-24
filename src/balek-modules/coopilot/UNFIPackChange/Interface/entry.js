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

        'dojo/text!balek-modules/coopilot/UNFIPackChange/resources/html/entry.html',
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
        return declare("moduleCoopilotUNFIPackChangeEntryInterface", [_WidgetBase,_TemplatedMixin], {


            baseClass: "coopilotUNFIPackChangeEntryInterface",

            templateString: interfaceHTMLFile,
            _InventoryItemInfoSpan: null,
            _ItemActionsSpan: null,
            _UpdateObjectDiv: null,
            _OriginalObjectDiv: null,
            _InventoryObjectDiv: null,
            _ValuesObjectDiv: null,
            _ChangeSpan: null,
            _ReplaceSpan: null,
            entry: {
                instructions: {entry: "no entry"},
                original: {supplierID: "", unitOfSale: "", UCU: ""},
                update: {supplierID: "", unitOfSale: "", UCU: ""}

            },
            entryModel: null,
            constructor: function (args) {

                declare.safeMixin(this, args);
                console.log("Pack Change Entry widget", this.entry);

            },

            postCreate: function(){
                let entry= this.entry
                if(entry.original.descriptionChangeDate != ""){
                    this._ChangeSpan.innerHTML = " 📛"+ entry.original.descriptionChangeDate
                }else
                {
                    this._ChangeSpan.innerHTML = "📇👍"
                }
                this._ChangeSpan.innerHTML += "<br/>"

                if(entry.original.priceChangeDate != ""){
                    this._ChangeSpan.innerHTML += "     💰"+ entry.original.priceChangeDate
                }else
                {
                 //   this._ChangeSpan.innerHTML += "🤑"
                }

                if (entry.instructions.entry.includes("Replaced by item")){
                //        this._ReplaceSpan.innerHTML = "☎️"
                }
                if (entry.instructions.entry.includes("Replaces item")){
                    this._ReplaceSpan.innerHTML += "🚨️ " + entry.instructions.entry.substring(entry.instructions.entry.indexOf("Replaces item"))
                }

                let entryOriginalCopy = lang.clone(this.entry.original)
                delete entryOriginalCopy.valuesArray
              //  this._OriginalObjectDiv.innerHTML = JSON.stringify(entryOriginalCopy,null, 4)

                let entryUpdateCopy = lang.clone(this.entry.update)
                delete entryUpdateCopy.valuesArray
               // this._UpdateObjectDiv.innerHTML = JSON.stringify(entryUpdateCopy,null, 4)

                let headerValues = `Values \nSupplier ID`
                let originalValues = `Original \n ${this.entry.original.supplierID}`
                let updateValues = `Update \n ${this.entryModel.getUpdatedSupplierID(this.entry.original.supplierID)}`



                let inventoryEntry =  this.inventoryModel.getEntryByScanCode(this.entry.original.UPC)
                //should look up by supplier id and other upc


                let inventoryValues = "Inventory \n "

                if (inventoryEntry){
                    inventoryValues += `${inventoryEntry.supplierUnitID}`
                    if (this.entry.update.UPC != "")
                    {
                        headerValues += `\nUPC `
                        originalValues += `\n ${this.entry.original.UPC}`
                        updateValues  += `\n ${this.entry.update.UPC}`
                        inventoryValues += `\n ${inventoryEntry.scanCode}`
                    }

                    if (this.entry.update.unitSize != "")
                    {
                        headerValues += `\nUnit Size `

                        originalValues  += `\n ${this.entry.original.unitSize}`
                        updateValues  += `\n ${this.entry.update.unitSize}`
                        inventoryValues += `\n ${inventoryEntry.size}`
                    }

                    if (this.entry.update.unitOfSale != "")
                    {
                        headerValues += `\nUnit Of Sale `


                        originalValues  += `\n ${this.entry.original.unitOfSale}`
                        updateValues  += `\n ${this.entry.update.unitOfSale}`
                        inventoryValues += `\n ${inventoryEntry.quantity}/${inventoryEntry.size}`
                    }

                    if (this.entry.update.caseSize != "")
                    {
                        headerValues += `\nCase Size `

                        originalValues  += `\n ${this.entry.original.caseSize}`
                        updateValues  += `\n ${this.entry.update.caseSize}`
                        inventoryValues += `\n ${inventoryEntry.quantity}`

                    }

                    if (this.entry.update.casePrice != "")
                    {
                        headerValues += `\nCase Price `

                        originalValues  += `\n ${this.entry.original.casePrice}`
                        updateValues  += `\n ${this.entry.update.casePrice}`
                        inventoryValues += `\n ${inventoryEntry.lastCost*inventoryEntry.quantity}`

                    }

                    if (this.entry.update.unitPrice != "")
                    {
                        headerValues += `\nUnit Price `


                        originalValues  += `\n ${this.entry.original.unitPrice}`
                        updateValues  += `\n ${this.entry.update.unitPrice}`
                        inventoryValues += `\n ${inventoryEntry.lastCost}`

                    }
                    this._ValuesObjectDiv.innerHTML +=headerValues
                    this._OriginalObjectDiv.innerHTML +=originalValues
                    this._UpdateObjectDiv.innerHTML += updateValues
                    this._InventoryObjectDiv.innerHTML += inventoryValues
                    let allValues = JSON.stringify(inventoryEntry, null, 4)

                    this._InventoryItemInfoSpan.innerHTML += `${inventoryEntry.scanCode}  - ${inventoryEntry.brand} ${inventoryEntry.name}  ${inventoryEntry.size}`

                    domConstruct.place(this.domNode, this.placeIn)

                }else {
                    this._InventoryObjectDiv.innerHTML = "Item UPC does not match inventory scan code"
                }



            },

            unload: function () {
                this.destroy();
            }
        });
    }
);

