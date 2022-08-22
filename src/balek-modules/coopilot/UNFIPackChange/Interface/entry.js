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
            _ItemActionsSpan: null,
            _UpdateObjectDiv: null,
            _OriginalObjectDiv: null,
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
                this._OriginalObjectDiv.innerHTML = JSON.stringify(entryOriginalCopy,null, 4)

                let entryUpdateCopy = lang.clone(this.entry.update)
                delete entryUpdateCopy.valuesArray
                this._UpdateObjectDiv.innerHTML = JSON.stringify(entryUpdateCopy,null, 4)


                let originalValues = `\nsupplierID ${this.entry.original.supplierID}`
                this._OriginalObjectDiv.innerHTML +=originalValues


                let updateValues = `\nsupplierID ${this.entryModel.getUpdatedSupplierID(this.entry.original.supplierID)}`
                this._UpdateObjectDiv.innerHTML += updateValues
            },

            unload: function () {
                this.destroy();
            }
        });
    }
);



