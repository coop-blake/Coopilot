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

                }
                if(!this.autoTrim && this.footerStart == 0)
                {
                    this.footerStart = this.lines.length - 1
                }

                this.refreshUI()
            },
            _onSeparatorChoiceDown: function() {
                if (this.valueSeparator == "\t")
                {
                    this.valueSeparator = ","
                    this._separatorChoicePane.innerHTML = "Comma"

                }else
                {
                    this.valueSeparator = "\t"
                    this._separatorChoicePane.innerHTML = "Tab"

                }
                this.parseTabSeperatedString(this.fileData)
            },
            setColumnHeaderActions: function(headerNode, valuePosition){
                let tableClassString = this.getColumnClass(valuePosition)
                on(headerNode, "mouseenter", function (mouseEvent){
                    //query(String("." + tableClassString)).style("backgroundColor", "orange");
                    let nodeList = query(String("." + tableClassString), this._previewPane);

                    for ( const node of nodeList)
                    {
                        domStyle.set(node,"backgroundColor", "rgba(123, 178, 91, 0.8)" )
                        domStyle.set(node,"cursor", "pointer" )

                    }
                })

                on(headerNode, "mouseleave", function (mouseEvent){
                    //query(String("." + tableClassString)).style("backgroundColor", "orange");
                    let nodeList = query(String("." + tableClassString), this._previewPane);

                    for ( const node of nodeList)
                    {
                        domStyle.set(node,"backgroundColor", "unset" )
                        domStyle.set(node,"cursor", "unset" )

                    }
                })


                let currentColumn = valuePosition.valueOf()
                on(headerNode, "dblclick", lang.hitch(this, function (mouseEvent){

                    //query(String("." + tableClassString)).style("backgroundColor", "orange");
                    let nodeList = query(String("." + tableClassString), this._previewPane);

                    let currentColumnValueArray = this.getColumnValueArray(currentColumn)

                    console.log("Get currentColumnValueArray:", currentColumnValueArray);

                    this._outputPreviewPane.innerHTML = currentColumnValueArray.join(",")
                    for ( const node of nodeList)
                    {
                        domStyle.set(node,"backgroundColor", "unset" )
                        domStyle.set(node,"cursor", "unset" )

                    }
                }))




            },
            getColumnClass: function(headerPosition){
                return this.baseClass+"TableRowIdentityCell" + headerPosition.toString()
            },
            refreshUI: function(){
                this.refreshInfo()
                this.refreshTable()
            },
            refreshInfo: function(){
                this._dataInfoPane.innerHTML="";
                this._dataInfoPane.innerHTML += " Header: "+ this.headerStart;
                this._dataInfoPane.innerHTML += " Footer: "+ this.footerStart;

                let infoString = this.fileName + " " + this.fileSize + " [ Lines:" + this.lines.length + " | Columns: " + this.mostValuesInLine + " ]"

                    this.setContainerName("📥 - Importing "+ infoString);
            },
            refreshTable: function(){


                let linePosition = 0


                let table = domConstruct.create("table");
                let tableClassString = this.baseClass+"Table"
                domClass.add(table, tableClassString)
                let headerRow = domConstruct.create("tr")
                let headerCount = 0;
                do {
                    let colHead = domConstruct.create("th")
                    colHead.innerHTML = headerCount;
                    domConstruct.place(colHead, headerRow)

                    this.setColumnHeaderActions(colHead, headerCount-1)
                    headerCount++
                }while(this.mostValuesInLine >= headerCount)

                let tableHead = domConstruct.create("thead")

                domConstruct.place(headerRow, tableHead)

                domConstruct.place(tableHead, table)
                let row = domConstruct.create("tr")

                for (const line of this.lines)
                {
                    if( linePosition >= this.headerStart && linePosition < this.footerStart+1)
                    {
                        let row = domConstruct.create("tr")
                        let rowClassString = this.baseClass+"TableRow"
                        let valuePosition = 0
                        let firstTableData = domConstruct.create("td")
                        let tableClassString = this.baseClass+"TableRowIdentityCell"


                        domClass.add(row, rowClassString)
                        domClass.add(firstTableData, tableClassString)

                        //Create First Column Row Cell With Import Line Number and Head/Foot Set

                        let setSpan = domConstruct.create("span")
                        domClass.add(setSpan, this.baseClass+"SetSpan")

                        let setHeaderDiv = domConstruct.create("div")
                        domConstruct.place(`<img src='balek-modules/coopilot/UNFIPricer/resources/images/triangleUp.svg' class='${this.baseClass}SetDivImage' alt="Set Header" />`, setHeaderDiv)
                        domClass.add(setHeaderDiv, this.baseClass+"SetHeaderDiv")

                        on(setHeaderDiv, "mousedown", lang.hitch(this, function (linePosition, mouseEvent ){
                            //query(String("." + tableClassString)).style("backgroundColor", "orange");
                            this.setHeaderRow(linePosition)
                        }, linePosition.valueOf() ))

                        let lineNumberDiv = domConstruct.create("span")
                        lineNumberDiv.innerHTML = linePosition.toString()
                        domClass.add(lineNumberDiv, this.baseClass+"FileNumberSpan")

                        let setFooterDiv = domConstruct.create("div")
                        domClass.add(setFooterDiv, this.baseClass+"SetFooterDiv")
                        domConstruct.place(`<img src='balek-modules/coopilot/UNFIPricer/resources/images/triangleDown.svg' class='${this.baseClass}SetDivImage' alt="Set Footer" />`, setFooterDiv)



                        on(setFooterDiv, "mousedown", lang.hitch(this, function (linePosition, mouseEvent ){
                            //query(String("." + tableClassString)).style("backgroundColor", "orange");
                            this.setFooterRow(linePosition)
                        }, linePosition.valueOf()  ))


                        domConstruct.place(setHeaderDiv, setSpan)

                        domConstruct.place(setFooterDiv, setSpan)

                        domConstruct.place(setSpan, firstTableData)

                        domConstruct.place(lineNumberDiv, firstTableData)

                        domConstruct.place(firstTableData, row)


                        for( const value of line)
                        {
                            let tableData = domConstruct.create("td")


                            domClass.add(tableData, this.getColumnClass(valuePosition))


                            tableData.innerHTML = value;
                            domConstruct.place(tableData, row)
                            valuePosition++
                        }

                        domConstruct.place(row, table)
                    }

                    linePosition++
                }

                this._previewPane.innerHTML = ""
                domConstruct.place(table, this._previewPane)


            },
            setHeaderRow: function(headerRow){
                 if((headerRow <= this.lines.length) && (headerRow >= 0)){
                    this.headerStart = headerRow
                    this.refreshUI()
                }else {
                    console.log("Out of Bounds: Not Setting Header to", headerRow)
                }
            },
            setFooterRow: function(footerRow){
                if((footerRow <= this.lines.length) && (footerRow >= 0)){
                    this.footerStart = footerRow
                    this.refreshUI()
                }else {
                    console.log("Out Of Bounds: Not Setting Footer to", headerRow)

                }
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



