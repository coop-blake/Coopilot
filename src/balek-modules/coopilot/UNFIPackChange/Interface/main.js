define([//------------------------------|
        // Base Includes:---------------|
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
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


        'balek-modules/components/syncedCommander/Interface',
        'balek-client/session/workspace/container/containable',

        'balek-modules/coopilot/UNFIPackChange/Interface/entriesGrid.js',
        'balek-modules/coopilot/UNFIPackChange/Model/packChanges.js',
        'balek-modules/coopilot/UNFIPackChange/Model/file.js',


        'dojo/text!balek-modules/coopilot/UNFIPackChange/resources/html/main.html',
        'dojo/text!balek-modules/coopilot/UNFIPackChange/resources/css/main.css',
    ],
    function (declare,
              lang,
              topic,
              on,
              query,

              domConstruct,
              domStyle,
              domClass,
              domAttr,
              win,

              dojoKeys,

              _WidgetBase,
              _TemplatedMixin,


              _SyncedCommanderInterface,
              _BalekWorkspaceContainerContainable,

              EntriesGrid,
              PackChangeModel,
              FileModel,

              interfaceHTMLFile,
              interfaceCSSFile

              ) {

        return declare("moduleCoopilotUNFIPackChangeMainInterface", [_WidgetBase,_TemplatedMixin,_SyncedCommanderInterface,_BalekWorkspaceContainerContainable], {


            baseClass: "coopilotUNFIPackChangeInterface",

            templateCssString: interfaceCSSFile,
            templateString: interfaceHTMLFile,

            importCompleteCallback: null,

            EntriesGrid: null,



            _previewPane: null,

            _outputPane: null,
            _outputPreviewPane: null,
            _dropZone: null,






            packChangeModel: null,
            packChangeModelState: null,
            packChangeModelStateWatchHandle: null,

            fileModel: null,
            fileModelState: null,
            fileModelStateWatchHandle: null,

            constructor: function (args) {


                declare.safeMixin(this, args);
                domConstruct.place(domConstruct.toDom("<style>" + this.templateCssString + "</style>"), win.body());

                //Main Table model and state
                this.packChangeModel = new PackChangeModel({
                    mostValuesInAnyLine: this.mostValuesInALine,
                    headerStart : this.headerStart,
                    footerStart : this.footerStart,
                    valueSeparator: this.valueSeparator
                });
                this.packChangeModelState = this.packChangeModel.getModelState()
                this.packChangeModelStateWatchHandle = this.packChangeModelState.watch(lang.hitch(this, this.onEntryModelStateChange))

                //File Model and State Handels
                this.fileModel = new FileModel({});
                this.FileModelState = this.fileModel.getModelState()
                this.FileModelStateWatchHandle = this.FileModelState.watch(lang.hitch(this, this.onFileModelStateChange))

                //Set Balek Container Name
                this.setContainerName("📥 - Importer");



            },
            //#####################################################
            //###   On Model State Changes
            onFileModelStateChange: function(name, oldState, newState) {
                if(name == "fileDataStringWhen"){
                    let newData= this.fileModel.getFileDataString()
                    this.packChangeModel.setDataString(newData)
                }
            },
            onEntryModelStateChange: function(name, oldState, newState) {
                console.log("💌 TableModelStateChange in main ⚡️", name, oldState, newState)
                if(name == "dataProcessedWhen"){
                   this.refreshGrid()
                    this.refreshInfo()
                }else if( name== "valueSeparator"){
                    this.refreshValueSeperatorStatus()
                }else if ( name == "headerStart" ||  name == "footerStart")
                {
                    this.refreshInfo()
                }
            },
            postCreate: function(){
                this.initializeContainable();
                on(this._dropZone, ["dragenter, dragstart, dragend, dragleave, dragover, drag, drop"], function (e) {
                       e.preventDefault()
                    e.stopPropagation()});

            },
            startupContainable: function(){
                console.log("startupContainable Tab Importer containable");
            },
            _onFocus: function(){

            },
            _onKeyUp: function (keyUpEvent) {
                switch (keyUpEvent.keyCode) {
                    case dojoKeys.ENTER:
                        keyUpEvent.preventDefault();
                        break;
                    case dojoKeys.ESCAPE:
                        keyUpEvent.preventDefault();
                        keyUpEvent.stopPropagation();
                        this.unload();
                        break;

                }
            },
            _onKeyDown: function (keyUpEvent) {
                switch (keyUpEvent.keyCode) {
                    case dojoKeys.ENTER:
                        keyUpEvent.preventDefault();

                        break;
                    case dojoKeys.ESCAPE:
                        keyUpEvent.preventDefault();
                        keyUpEvent.stopPropagation();
                        this.unload();
                        break;

                }
            },
            _onDropped: function(dropEvent){
                dropEvent.preventDefault()
                dropEvent.stopPropagation()

                let dataTransfer = dropEvent.dataTransfer
                let files = dataTransfer.files

                let file = files[0];
                if (file.type.match('text.*')) {
                    if(file.name.startsWith("pkc"))
                    {
                        //Pack Change File
                        this.fileModel.readFile(file)
                    } else if (file.name.startsWith("Mas"))
                    {
                       // process the inventory here
                    }else {
                        alert("Not named as a pack change or inventory file")
                    }
                } else {
                    alert("Not a Text File!");
                }

            },
            _onDragEnter: function(dragEvent){
                dragEvent.preventDefault()
                dragEvent.stopPropagation()
            },
            _onDragLeave: function(dragEvent){
                dragEvent.preventDefault()
                dragEvent.stopPropagation()
            },

            refreshUI: function(){
                this.refreshInfo()
                this.refreshGrid()
            },
            refreshInfo: function(){
                this._fileInfoDiv.innerHTML = this.fileModel.getFileName() + " " + Math.round(this.fileModel.getFileSize()/1024) + "Kb [ Entries:" + this.packChangeModel.getEntries().length + "  ]"
                let infoString = this.fileModel.getFileName() + " " + Math.round(this.fileModel.getFileSize()/1024) + "Kb [ Entries:" + this.packChangeModel.getEntries().length + " ]"
                this.setContainerName("📥 - Importing "+ infoString);
            },
            refreshGrid: function(){
                if(this.EntriesGrid == null)
                {
                    this.EntriesGrid = EntriesGrid({entryModel: this.packChangeModel,
                                                domStatusDiv: this._previewStatusDiv,
                                                outputPreviewPane: this._outputPreviewPane
                    })
                    domConstruct.place(this.EntriesGrid.domNode, this._previewPane, 'only')
                }else{
                    console.log("EntriesGrid already exists", this.EntriesGrid)
                    this.EntriesGrid.reloadEntries()
                }
            },

            getWorkspaceDomNode: function () {
                return this.domNode;
            },
            unload: function () {
                //unwatch states
                this.packChangeModelStateWatchHandle.unwatch()
                this.packChangeModelStateWatchHandle.remove()
                this.FileModelStateWatchHandle.unwatch()
                this.FileModelStateWatchHandle.remove()
                //call destroy function
                this.destroy();
            }
        });
    }
);



