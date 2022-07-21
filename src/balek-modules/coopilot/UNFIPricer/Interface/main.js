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

            lines: null,
            linesByItemID: {},
            headerStart: 0,
            footerStart: 0,
            autoTrim: false,
            valueSeparator: "\t",

            fileData: "",
            fileSize: 0,
            fileDateString: "",
            fileName: "",

            inputType: "",


            mostValuesInLine: 0,

            constructor: function (args) {
                this.values = Array()
                this.lines = Array()
                this.linesByItemID = {}
                this.infoNodes = {}
                declare.safeMixin(this, args);
                domConstruct.place(domConstruct.toDom("<style>" + this.templateCssString + "</style>"), win.body());

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
                    let reader = new FileReader();
                    reader.onload = lang.hitch(this, function (onLoadEvent) {
                        let fileDate = new Date(file.lastModified)
                        this.fileDateString = fileDate.toLocaleDateString("en-US")
                        this.fileSize = Math.round(file.size/1024) +"kb"
                        this.fileName = file.name

                        this.inputType="file"

                       // this.refreshInfo()
                        this.parseTabSeperatedString( onLoadEvent.target.result)
                    });
                    // Read in the image file as a data URL.
                    reader.readAsText(file);
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

            parseTabSeperatedString: function(stringToParse)
            {
                this.setUILoading()

                this.fileData = stringToParse;

                this.mostValuesInLine = 0;
                this.lines = []
                let linesArray = stringToParse.split("\n");

                for (const line of linesArray)
                {

                    let valuesArray = line.split(this.valueSeparator);
                    let valuesToSaveArray = [];

                    if (this.mostValuesInLine < valuesArray.length){
                        this.mostValuesInLine = valuesArray.length
                        if(this.autoTrim)
                        {
                            this.headerStart = this.lines.length
                        }
                    }

                    if (this.mostValuesInLine > valuesArray.length){
                        if(this.autoTrim)
                        {
                            this.footerStart = this.lines.length - 1
                        }

                    }

                    for (const value of valuesArray) {
                       let valueWithoutQuotes = value.replace(/^["'](.+(?=["']$))["']$/, '$1');
                        //regex removes quotes around value
                        valuesToSaveArray.push(valueWithoutQuotes);

                    }
                    this.lines.push(valuesToSaveArray)
                    if(valuesToSaveArray[10] && valuesToSaveArray[10].replace){
                        let normalizedItemID = valuesToSaveArray[10].replace(/-/g, "")
                        this.linesByItemID[normalizedItemID] = valuesToSaveArray
                    }else {
                        console.log("unknow line...", valuesToSaveArray)
                    }


                }
                if(!this.autoTrim && this.footerStart == 0)
                {
                    this.footerStart = this.lines.length - 1
                }
                //this.refreshInfo()

                this._outputStatusPane.innerHTML = `${this.fileName} Loaded`
                this.refreshUI()
            },
            setUILoading: function(){
                this._dataInfoPane.innerHTML="Loading Dropped File";
                this._previewPane.innerHTML ="";
                this._outputStatusPane.innerHTML ="Loading Dropped File";

            },
            refreshLookup: function(){
                let inputValue = this._dataInput.value;
                if(this.linesByItemID[inputValue] ){

                    let eachPrice = this.linesByItemID[inputValue][8].toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
                    let casePrice = this.linesByItemID[inputValue][9].toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
                    let productName = this.linesByItemID[inputValue][7].toString()
                    let productBrand = this.linesByItemID[inputValue][1].toString()



                    if (!this.infoNodes[inputValue]){
                        this.infoNodes[inputValue]= new ItemInfo({
                            eachPrice : eachPrice,
                            casePrice : casePrice,
                            productName : productName,
                            productBrand : productBrand,
                        });
                    }
                    let itemInfoNode = this.infoNodes[inputValue];






                    domConstruct.place(itemInfoNode.domNode, this._previewPane, "first")



                }else
                {
                    this._previewPane.innerHTML = "No Match"
                }
            },
            refreshUI: function(){
                this.refreshInfo()
                this.refreshLookup()
            },
            refreshInfo: function(){
                this._dataInfoPane.innerHTML="";
                this._dataInfoPane.innerHTML += " Header: "+ this.headerStart;
                this._dataInfoPane.innerHTML += " Footer: "+ this.footerStart;

                let infoString = this.fileDateString + " : " + this.fileName + " " + this.fileSize + " [ Lines:" + this.lines.length + " | Columns: " + this.mostValuesInLine + " ]"
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
                this.destroy();
            }
        });
    }
);



