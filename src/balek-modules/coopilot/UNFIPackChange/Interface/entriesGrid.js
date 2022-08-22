define([//------------------------------|
        // Base Includes:---------------|
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/on',
        'dojo/query',
        //------------------------------|
        //Dom Includes:-----------------|
        "dojo/dom-construct",
        'dojo/dom-style',
        "dojo/dom-class",
        "dojo/dom-attr",
        "dojo/_base/window",
        //------------------------------|
        //Input Includes:---------------|
        "dojo/keys",
        //------------------------------|
        //Widget Declare Mixins:--------|
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        //------------------------------|
        //Widget HTML and CSS:----------|
        'dojo/text!balek-modules/coopilot/UNFIPackChange/resources/html/entriesGrid.html',
        'dojo/text!balek-modules/coopilot/UNFIPackChange/resources/css/entriesGrid.css',
        //Entry Widget
        'balek-modules/coopilot/UNFIPackChange/Interface/entry.js'
    ],
    function (
        //------------------------------|
        //Base Modules:-----------------|
        declare,
        lang,
        on,
        query,
        //------------------------------|
        //Dom Modules:------------------|
        domConstruct,
        domStyle,
        domClass,
        domAttr,
        win,
        //------------------------------|
        //Input Modules:----------------|
        dojoKeys,
        //------------------------------|
        //Widget Declare Extenstions:---|
        _WidgetBase,
        _TemplatedMixin,
        //------------------------------|
        //Widget HTML and CSS Strings:--|
        interfaceHTMLFile,
        interfaceCSSFile,
        EntryWidget
    ) {
        return declare("moduleCoopilotUNFIPackChangeEntriesGridInterface",
            [_WidgetBase,_TemplatedMixin], {
            //Widget Variables:---------
            baseClass: "coopilotUNFIPackChangeEntriesGridInterface",
            templateString: interfaceHTMLFile,
            templateCssString: interfaceCSSFile,

            //----------------------------
            //Dom Node Elements:----------
            _statusDiv: null,
            _activeEntryDiv: null,


            //----------------------------
            //Entries Model:----------------
            entryModel: null,

            constructor: function (args) {
                declare.safeMixin(this, args);
                domConstruct.place(domConstruct.toDom("<style>" + this.templateCssString + "</style>"), win.body());
                if(this.entryModel == null)
                {
                    console.log("🤖🤖No Entry Model")
                }

            },
            postCreate: function(){

                if(this.entryModel != null)
                {
                    let dataProcessedWhen = this.entryModel.getDataProcessedWhen()
                    if(dataProcessedWhen != 0)
                    {
                        this.reloadEntries()
                    }else {
                        console.log("🤖🤖ERRORRRR DONNNNNE", Error)
                    }
                }else {
                    console.log("🤖🤖No Entry Model")
                }


            },
            //--------------------------------------|
            //View Update Functions:----------------|
            reloadEntries(){
                this._activeEntryDiv.innerHTML = ""
                let entries = this.entryModel.getEntries()
                let totalEntries = entries.length

                for ( i = 0 ; i < totalEntries ; ++i)
                {
                    let entryWidget = new EntryWidget({entry: entries[i]})
                domConstruct.place(entryWidget.domNode, this._activeEntryDiv)
                }
                this.updateStatus()
            },

             updateStatus: function(){
                this._statusDiv.innerHTML = "Done"
             },


            //---------------------------------------|
            //Deconstruction Functions:----------------|

            unload: function () {
                this.destroy();
            }
        });
    }
);



