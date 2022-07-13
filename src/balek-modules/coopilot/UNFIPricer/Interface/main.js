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

        'balek-modules/components/syncedCommander/Interface',
        'balek-client/session/workspace/container/containable',

        'dojo/text!balek-modules/coopilot/UNFIPricer/resources/html/main.html',
        'dojo/text!balek-modules/coopilot/UNFIPricer/resources/css/main.css'
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

              _SyncedCommanderInterface,
              _BalekWorkspaceContainerContainable,

              interfaceHTMLFile,
              interfaceCSSFile

              ) {

        return declare("moduleDigivigilWWWSaleTagScanInterface", [_WidgetBase,_TemplatedMixin,_SyncedCommanderInterface,_BalekWorkspaceContainerContainable], {


            baseClass: "coopilotUNFIPricerInterface",

            templateCssString: interfaceCSSFile,
            templateString: interfaceHTMLFile,

            importCompleteCallback: null,

            _autoTrimPane: null,
            _previewPane: null,
            _outputPane: null,
            _outputPreviewPane: null,
            _dropZone: null,

           // values: null,

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

                        this.refreshInfo()
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
            _autoTrimMouseDown: function(mouseEvent){
                this.autoTrim = !this.autoTrim
                this.headerStart = 0;
                this.footerStart = 0;
                this.parseTabSeperatedString(this.fileData)
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
                    this.linesByItemID[valuesToSaveArray[10]] = valuesToSaveArray

                }
                if(!this.autoTrim && this.footerStart == 0)
                {
                    this.footerStart = this.lines.length - 1
                }
                //this.refreshInfo()
                this.refreshUI()
            },
            refreshLookup: function(){
                if(this.linesByItemID[this._dataInput.value] ){

                    let eachPrice = this.linesByItemID[this._dataInput.value][8].toString()
                    let casePrice = this.linesByItemID[this._dataInput.value][9].toString()
                    let productName = this.linesByItemID[this._dataInput.value][7].toString()
                    let productBrand = this.linesByItemID[this._dataInput.value][1].toString()

                    this._previewPane.innerHTML = this.linesByItemID[this._dataInput.value].toString() +
                        "<br />" + "Brand:" + productBrand +
                        "<br />" + "Name:" + productName +
                        "<br />" + "Each Price:" + eachPrice +
                        "<br />" + "Case Price:" + casePrice;

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

                let infoString = this.fileName + " " + this.fileSize + " [ Lines:" + this.lines.length + " | Columns: " + this.mostValuesInLine + " ]"
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



