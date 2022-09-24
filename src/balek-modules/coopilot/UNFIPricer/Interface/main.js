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

        'balek-modules/coopilot/UNFIPricer/Interface/itemInfo',


        'balek-modules/components/syncedCommander/Interface',
        'balek-client/session/workspace/container/containable',

        'balek-modules/coopilot/models/inventory',
        'balek-modules/coopilot/models/file',
        'balek-modules/coopilot/models/pricebook',


        'dojo/text!balek-modules/coopilot/UNFIPricer/resources/html/main.html',
        'dojo/text!balek-modules/coopilot/UNFIPricer/resources/css/main.css',

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

              ItemInfo,

              _SyncedCommanderInterface,
              _BalekWorkspaceContainerContainable,

              InventoryModel,
              FileModel,
              PricebookModel,

              interfaceHTMLFile,
              interfaceCSSFile
              ) {

        return declare("moduleCoopilotUNFIPricerMainInterface", [_WidgetBase,_TemplatedMixin,_SyncedCommanderInterface,_BalekWorkspaceContainerContainable], {


            baseClass: "coopilotUNFIPricerInterface",

            templateCssString: interfaceCSSFile,
            templateString: interfaceHTMLFile,

            importCompleteCallback: null,

            _autoTrimPane: null,
            _previewPane: null,
            _outputPane: null,
            _outputStatusPane: null,
            _dropZone: null,

           // values: null,

            infoNodes: null,


            inputType: "",


            inventoryFileModel: null,
            inventoryFileModelState: null,
            inventoryFileModelStateWatchHandle: null,

            inventoryModel: null,
            inventoryModelState: null,
            inventoryModelStateWatchHandle: null,

            pricebookFileModel: null,
            pricebookFileModelState: null,
            pricebookFileModelStateWatchHandle: null,

            constructor: function (args) {

                this.infoNodes = {}
                declare.safeMixin(this, args);
                domConstruct.place(domConstruct.toDom("<style>" + this.templateCssString + "</style>"), win.body());


                this.inventoryModel = new InventoryModel({})
                this.inventoryModelState = this.inventoryModel.getModelState()
                this.inventoryModelStateWatchHandle = this.inventoryModelState.watch(lang.hitch(this, this.onInventoryModelStateChange))

                //File Model and State Handels
                this.inventoryFileModel = new FileModel({});
                this.inventoryFileModelState = this.inventoryFileModel.getModelState()
                this.inventoryFileModelStateWatchHandle = this.inventoryFileModelState.watch(lang.hitch(this, this.onInventoryFileModelStateChange))


                this.pricebookFileModel = new FileModel({});
                this.pricebookFileModelState = this.pricebookFileModel.getModelState()
                this.pricebookFileModelStateWatchHandle = this.pricebookFileModelState.watch(lang.hitch(this, this.onPricebookFileModelStateChange))

                this.pricebookModel = new PricebookModel({})
                this.pricebookModelState = this.pricebookModel.getModelState()
                this.pricebookModelStateWatchHandle = this.pricebookModelState.watch(lang.hitch(this, this.onPricebookModelStateChange))


                this.setContainerName("📟 - UNFI Pricer");

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
            onPricebookFileModelStateChange: function(name, oldState, newState) {
                if(name == "fileDataStringWhen"){
                    console.log(name)
                    let newData= this.pricebookFileModel.getFileDataString()
                    this.pricebookModel.setDataString(newData)
                }else {
                    console.log(name)
                }
            },
            onPricebookModelStateChange: function(name, oldState, newState) {
                console.log("💌 onPricebookModelStateChange in main ⚡️", name, oldState, newState)
                if(name == "dataProcessedWhen"){
                    this.refreshUI()
                }
                console.log(this.pricebookModel)

            },
            onInventoryFileModelStateChange: function(name, oldState, newState) {
                if(name == "fileDataStringWhen"){
                    let newData= this.inventoryFileModel.getFileDataString()
                    this.inventoryModel.setDataString(newData)
                }
            },
            onInventoryModelStateChange: function(name, oldState, newState) {
                console.log("💌 onInventoryModelStateChange in main ⚡️", name, oldState, newState)
                if(name == "dataProcessedWhen"){
                    this.refreshUI()

                }


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
            _onInputChange: function(){
             console.log(this.linesByItemID)
                console.log("refreshing on change")
              this.refreshLookup()
            },
            _onDropped: function(dropEvent){
                dropEvent.preventDefault()
                dropEvent.stopPropagation()

                let dataTransfer = dropEvent.dataTransfer
                let files = dataTransfer.files

                let file = files[0];


                if (file.type.match('text.*')) {

                    if(file.name.startsWith("pb"))
                    {
                        //Price Book File
                        this.pricebookFileModel.readFile(file)
                    } else if (file.name.startsWith("Mas"))
                    {
                        // process the inventory here
                        this.inventoryFileModel.readFile(file)
                    }else {
                        alert("Not named as a pack change or inventory file")
                    }


                } else {
                    alert("Not a Text File!");
                }




              //  this._textFile.files = files
                console.log("Dropped",files)
            },

            _onDragEnter: function(dragEvent){
                dragEvent.preventDefault()
                dragEvent.stopPropagation()
                console.log("In",dragEvent)
            },
            _onDragLeave: function(dragEvent){
                dragEvent.preventDefault()
                dragEvent.stopPropagation()
                console.log("Out",dragEvent)
            },


            setUILoading: function(){
                this._dataInfoPane.innerHTML="Loading Dropped File";
                this._previewPane.innerHTML ="";
                this._outputStatusPane.innerHTML ="Loading Dropped File";

            },
            refreshLookup: function(){
                let inputValue = this._dataInput.value;
                let pricebookEntry = this.pricebookModel.getEntryByScanCode(inputValue)
                if(pricebookEntry ){

                    let eachPrice = String(pricebookEntry.eachPrice).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
                    let casePrice = String(pricebookEntry.casePrice).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
                    let productName = pricebookEntry.description.toString()
                    let productBrand = pricebookEntry.brand.toString()



                    if (!this.infoNodes[inputValue]){
                        this.infoNodes[inputValue]= new ItemInfo({
                            eachPrice : eachPrice,
                            casePrice : casePrice,
                            productName : productName,
                            productBrand : productBrand,
                            scanCode: inputValue,
                            pricebookModel: this.pricebookModel,
                            inventoryModel: this.inventoryModel
                        });
                    }
                    let itemInfoNode = this.infoNodes[inputValue];



                    domConstruct.place(itemInfoNode.domNode, this._previewPane, "first")



                }else
                {
                    console.log()
                   // this._previewPane.innerHTML = "No Match"
                }
            },
            refreshUI: function(){
                this.refreshInfo()
                this.refreshLookup()
            },
            refreshInfo: function(){
                let fileDate = new Date(this.pricebookFileModel.getFileDate())
                let fileDateString = fileDate.toLocaleDateString("en-US")
                let fileSize = Math.round(this.pricebookFileModel.getFileSize()/1024) +"kb"
                let fileName = this.pricebookFileModel.getFileName()

                let infoString = fileDateString + " : " + fileName + " " + fileSize + "  " + this.pricebookModel.getNumberOfEntries() +" Pricebook Entries | "+ this.inventoryModel.getNumberOfEntries() + " Inventory Entries |"  ;
                this._dataInfoPane.innerHTML = infoString;
                    this.setContainerName("📟 - UNFI Pricebook "+ infoString);
            },
            getColumnValueArray(columnIndex){
                let returnIndex = []
                let linePosition = 0
                for( const line of this.lines)
                {
                    if( linePosition >= this.headerStart && linePosition < this.footerStart+1) {

                        returnIndex.push(line[columnIndex])
                    }
                        linePosition++
                }
                return returnIndex
            },
            getWorkspaceDomNode: function () {
                return this.domNode;
            },
            unload: function () {
                this.inventoryFileModelStateWatchHandle.unwatch()
                this.inventoryFileModelStateWatchHandle.remove()
                this.inventoryModelStateWatchHandle.unwatch()
                this.inventoryModelStateWatchHandle.remove()
                this.pricebookModelStateWatchHandle.unwatch()
                this.pricebookModelStateWatchHandle.remove()
                this.pricebookFileModelStateWatchHandle.unwatch()
                this.pricebookFileModelStateWatchHandle.remove()
                this.destroy();
            }
        });
    }
);



