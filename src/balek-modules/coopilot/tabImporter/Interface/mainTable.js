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
        'dojo/text!balek-modules/coopilot/tabImporter/resources/html/mainTable.html',
        'dojo/text!balek-modules/coopilot/tabImporter/resources/css/table.css',
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
        interfaceCSSFile
    ) {
        return declare("moduleCoopilotTabImporterMainTableInterface",
            [_WidgetBase,_TemplatedMixin], {
            //Widget Variables:---------
            baseClass: "coopilotTabImporterMainTableInterface",
            templateString: interfaceHTMLFile,
            templateCssString: interfaceCSSFile,
            //---------------------------
            //Build Variables:-----------
            buildPromise: null,
            buildPromiseResolve: null,
            buildPromiseReject: null,
            nextBuildTimeout: null,
            tableBuilt: false,
            tableBuilding: false,
            buildPosition: 0,
            headerRow : 0,
            footerRow : 0,
            displayCount: 500,
            //----------------------------
            //Dom Node Elements:----------
            _tableDiv: null,
            _tableStatusDiv: null,
            _rowDoms: null,
            _domHiddenTable : null,
            _domDisplayTable : null,
            //----------------------------
            //Table Model:----------------
            tableModel: null,
            tableModelState: null,
            tableModelStateWatchHandle: null,
                
            constructor: function (args) {

                this.rowDoms = {}
                declare.safeMixin(this, args);
                domConstruct.place(domConstruct.toDom("<style>" + this.templateCssString + "</style>"), win.body());
                if(this.tableModel != null)
                {
                    this.tableModelState = this.tableModel.getModelState()
                    this.tableModelStateWatchHandle = this.tableModelState.watch(lang.hitch(this, this.onTableStateChange))
                }else {
                    console.log("🤖🤖No Table Nodel")
                }

                this._domHiddenTable = this.createTable()
                this._domDisplayTable = this.createTable()

            },
            postCreate: function(){
                domConstruct.place(this._domDisplayTable, this._tableDiv, "only")
                let dataProcessedWhen = this.tableModel.getDataProcessedWhen()
                if(dataProcessedWhen != 0)
                {
                    this.reloadTable()
                }else {
                    console.log("🤖🤖ERRORRRR DONNNNNE", Error)
                }

            },
            reloadTable(){
                this.stopBuild()
                console.log("🤖🤖reloadTable")
                this.tableBuilt = false
                this.buildPosition = 0

                this.rowDoms = {}
                this.buildTable().then(
                    lang.hitch(this, this.onTableBuilt)
                ).catch(lang.hitch(this, function(Error){
                    console.log("ERRORRRR 🤖🤖reloadTable", Error)
                    this.stopBuild()
                    this.buildPromise = null
                    this.buildPromiseResolve = null
                    this.buildPromiseReject = null
                }))
            },

            onTableStateChange: function(name, oldState, newState){
                console.log("💌 TableModelStateChange in mainTable onTableStateChange()", name, oldState, newState)

              if(name=="dataProcessedWhen"){
                  this.reloadTable()
              }

              if(name=="headerStart" )
              {
                  console.log("Header Start Changed",name, oldState, newState)
                  this.adjustHeader(parseInt(oldState), parseInt(newState))
              }
              if(name=="footerStart" ){
                  console.log("Footer Start Changed",name, oldState, newState)
                  this.adjustFooter(parseInt(oldState), parseInt(newState))
              }

            },
            adjustHeader: function(oldHeaderValue, newHeaderValue){
                if(newHeaderValue > oldHeaderValue){
                    this.removeHeaderRows(oldHeaderValue,newHeaderValue - oldHeaderValue)
                }else if(newHeaderValue < oldHeaderValue){
                    console.log(`☎️⏰oldHeaderValue:${oldHeaderValue} | newHeaderValue${newHeaderValue}`);
                    this.addHeaderRows(oldHeaderValue,oldHeaderValue - newHeaderValue)
                } else {
                    console.log("📝 Header Row change No Change",name, oldHeaderValue, newHeaderValue)
                }
            },
            adjustFooter: function(oldFooterValue, newFooterValue){
                if(newFooterValue > oldFooterValue){
                    console.log(`☎️⏰oldHeaderValue:${oldFooterValue} | newHeaderValue${newFooterValue}`);
                    this.addFooterRows(oldFooterValue,newFooterValue - oldFooterValue)
                }else if(newFooterValue < oldFooterValue){
                    console.log(`☎️⏰oldHeaderValue:${oldFooterValue} | newHeaderValue${newFooterValue}`);
                    this.removeFooterRows(newFooterValue,oldFooterValue - newFooterValue)
                } else {
                    console.log("No Change",name, oldFooterValue, newFooterValue)
                }
            },
            addFooterRows: function(startAt, rowsToAdd){
                console.log(`🧭FooterrowstoAdd: ${rowsToAdd}  startAt:${startAt}`);

                for ( i = parseInt(startAt+1)  ; i <= parseInt(startAt+rowsToAdd)  ; ++i) {
                    console.log(`🧭Footer i: ${i} rowstoAdd: ${rowsToAdd}  startAt:${startAt}`);

                    let rowToAdd = this.getTableRow(i)
                    let rowToMoveAfter = this.getTableRow(i-1)
                    console.log(`🧭AddFooterPosition:${i}`, rowToAdd, rowToMoveAfter, this.rowDoms);
                    console.log(`🧭rowstomove: ${rowToAdd} rowsToRemove:${rowsToAdd} startAt:${startAt}`);
                    domConstruct.place(rowToAdd, rowToMoveAfter, "after")
                }
                console.log(`🧭Footer i: ${i} rowstoAdd: ${rowsToAdd}  startAt:${startAt}`);

            },
            removeFooterRows: function(startAt, rowsToRemove){
                console.log(`🧭🪫Footer rowsToRemove: ${rowsToRemove}  startAt:${startAt}`);

                for ( i = parseInt(startAt+1)  ; i <= parseInt(startAt+rowsToRemove)  ; ++i) {
                    console.log(`🧭🪫Footer i: ${i} rowsToRemove: ${rowsToRemove}  startAt:${startAt}`);

                    let rowToRemove = this.getTableRow(i)

                    console.log(`🧭🪫removeFooterRows Position:${i}`, rowToRemove,  this.rowDoms);
                    console.log(`🧭🪫rowToRemove: ${rowToRemove} rowsToRemove:${rowsToRemove} startAt:${startAt}`);
                    domConstruct.place(rowToRemove, this._domHiddenTable, "last")
                }
                console.log(`🧭🪫Footer i: ${i} rowsToRemove: ${rowsToRemove}  startAt:${startAt}`);

            },
            removeHeaderRows: function(startAt, rowsToRemove)
            {
                for ( i = parseInt(startAt+rowsToRemove-1)  ; i >= parseInt(startAt)  ; --i) {
                    let rowToMove = this.getTableRow(i)
                    console.log(`☎️removePosition:${i}`, rowToMove, this.rowDoms);
                    console.log(`☎️rowstomove: ${rowToMove} rowsToRemove:${rowsToRemove} startAt:${startAt}`);
                    domConstruct.place(rowToMove, this._domHiddenTable.firstChild, "after")
                }
            },
            addHeaderRows: function(startAt, rowsToAdd)
            {
                console.log(`☎️⏰startAt:${startAt} | rowsToAdd${rowsToAdd}`);

                for ( i = parseInt(startAt-1)  ; i >= parseInt(startAt-rowsToAdd)  ; --i) {
                    console.log(`☎️⏰i:${i} | Until${parseInt(startAt-rowsToAdd)}`);
                    let rowToMove = this.getTableRow(i)
                    let rowToMoveBefore = this.getTableRow(i+1)
                    console.log(`☎️⏰addosition:${i}`, rowToMove, this.rowDoms);
                    console.log(`☎️⏰️rowstomove: ${rowToMove} rowsToMovebefore:${rowToMoveBefore} startAt:${startAt}`);
                    domConstruct.place(rowToMove, rowToMoveBefore, "before")
                }
            },
            getTableRow: function(rowNumber){
                if(this.rowDoms[String(rowNumber)]){
                    return this.rowDoms[String(rowNumber)]
                }else {
                    let row = this.buildRow(rowNumber)
                    this.rowDoms[String(rowNumber)] = row
                    return row
                }
            },
            onTableBuilt: function(){
                console.log("DONNNNNE")
                this.tableBuilt = true
            },

            setBuildParameters: function(){
                this._built = false
                this.headerRow = this.tableModel.getHeaderRow()
                this.footerRow = this.tableModel.getFooterRow()

            },
            stopBuild: function(){
                if (this.nextBuildTimeout != null){
                    clearTimeout(this.nextBuildTimeout)
                }
                this.nextBuildTimeout = null

                if(this.buildPromise != null && this.buildPromiseReject != null)
                {
                    this.buildPromiseReject({reason: "stopBuild Stopped"})
                    this.buildPromise = null
                    this.buildPromiseResolve = null
                    this.buildPromiseReject = null
                }
            },
            createTable(){
                let table = domConstruct.create("table");
                let tableClassString = this.baseClass+"Table"
                domClass.add(table, tableClassString)
                let headerRow = domConstruct.create("tr")
                let headerCount = 0;
                do {
                    let colHead = domConstruct.create("th")
                    let headerClassString = this.getColumnClass(headerCount-1)
                    domClass.add(colHead, headerClassString)
                    colHead.innerHTML = headerCount;
                    domConstruct.place(colHead, headerRow)
                    this.setColumnHeaderActions(colHead, headerCount-1)
                    headerCount++
                }while(this.tableModel.getMostValuesInAnyLine() >= headerCount)
                let tableHead = domConstruct.create("thead")
                domConstruct.place(headerRow, tableHead)
                domConstruct.place(tableHead, table)

                return table

            },
            startBuild: function(){
                //stop any other timeout Build calls
                clearTimeout(this.nextBuildTimeout)
                domConstruct.empty(this._domHiddenTable)
                domConstruct.empty(this._domDisplayTable)
                this._domHiddenTable = this.createTable()
                this._domDisplayTable = this.createTable()
                require(["dojo/domReady!"], lang.hitch(this, function(){
                    domConstruct.place(this._domDisplayTable, this._tableDiv, "only")
                }));

                this.rowDoms = {}


                this.buildPosition = parseInt(this.tableModel.getHeaderRow())
                this._tableStatusDiv.innerHTML=`Building Table ${this.tableModel.getLines().length} lines`


                this.keepBuilding()

            },
            keepBuilding: function(){
                let footerRow = parseInt(this.tableModel.getFooterRow())
                let headerRow = parseInt(this.tableModel.getHeaderRow())
                let lines = this.tableModel.getLines()
                let totalLines = lines.length
                let chunksize = 1000; //How many rows to build before releasing process to event queue
                let displayCount = this.displayCount ; //How Many table rows to display
                let count = (footerRow+1) - parseInt(this.buildPosition)
                let end = Math.min(chunksize, count)

                if(this.buildPromiseResolve == null ) {
                    debugger;
                    console.log("📝 Attempt to Keep building after promise return")
                    return null
                }

                if(!(footerRow < totalLines
                    && footerRow >= headerRow && this.buildPosition <= footerRow )) {
                    console.log("📝 Adjust Footer Rows to make sense")
                    this.stopBuild()
                    return null
                }





                //  console.log(`📥buildPosition: ${this.buildPosition} headerStar:${this.headerRow} FooterStart:${this.footerRow}`);

                  // let lines = this.tableModel.getLines()

                   // let chunksize = 1000;
                   // let count = (this.footerRow+1) - this.buildPosition
                   // let end = Math.min(chunksize, count)

                   // console.log(`Count: ${count} End: ${end} headerStar:${this.headerRow} FooterStart:${this.footerRow}`);

                    for ( i = 0 ; i < end ; ++i)
                    {
                        let currentLineNumber = this.buildPosition
                        if(currentLineNumber >= headerRow && currentLineNumber <= footerRow)
                        {
                            let row = this.getTableRow(currentLineNumber)
                            this.rowDoms[this.buildPosition] = row

                            if(this.buildPosition<=displayCount){
                                domConstruct.place(row, this._domDisplayTable)
                            }else{
                                domConstruct.place(row, this._domHiddenTable)
                            }
                            console.log(`🔋I: ${i} Count: ${count} End: ${end} headerStar:${headerRow} FooterStart:${footerRow} BuildPosition ${this.buildPosition}`);

                            this.buildPosition++
                        }else {

                            console.log(`I: ${i} Count: ${count} End: ${end} headerStar:${headerRow} FooterStart:${footerRow} BuildPosition ${this.buildPosition}`);
                        }


                    }
                    if(count != end){

                        clearTimeout(this.nextBuildTimeout)
                        require(["dojo/domReady!"], lang.hitch(this, function(){
                            this.nextBuildTimeout =   setTimeout(lang.hitch(this, this.keepBuilding), 0)
                            this._tableStatusDiv.innerHTML =`Building Table ${this.tableModel.getLines().length - this.buildPosition}/${this.tableModel.getLines().length} lines`
                        }));


                    }else {

                        if(this.buildPosition>displayCount){
                        domConstruct.place(this.buildShowTableButton(), this._tableStatusDiv, "only")
                        }
                        let buildResolve = this.buildPromiseResolve
                        buildResolve(true);
                        this.stopBuild()
                    }

            },
            buildTable: function(){
              if(this.buildPromise != null ){
                  this.buildPromiseReject({Status: "New Build Requested"})
                  console.log(`🥊 Build Promise:${this.buildPromise} | Reject`, this.buildPromiseReject);
                  this.stopBuild()
              }
              this.buildPromise = new Promise(lang.hitch(this, function(Resolve, Reject) {
                  this.buildPromiseResolve = Resolve
                  this.buildPromiseReject = Reject
                  this.setBuildParameters()
                  this.startBuild()
              }));
              return this.buildPromise

          },
            buildShowTableButton(){
                let button = domConstruct.create("div")
               button.innerHTML=`Double Click to Show Table with ${this.tableModel.getFooterRow() - this.tableModel.getHeaderRow() } Items`
                this.setShowTableButtonActions(button)
                return button;
            },

            buildRow(lineNumber){
                let lines = this.tableModel.getLines()
                let line = lines[parseInt(lineNumber)]
                if(Array.isArray(line))
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
                    domConstruct.place(`<img src='balek-modules/coopilot/tabImporter/resources/images/triangleUp.svg' class='${this.baseClass}SetDivImage' alt="Set Header" />`, setHeaderDiv)
                    domClass.add(setHeaderDiv, this.baseClass+"SetHeaderDiv")

                    on(setHeaderDiv, "mousedown", lang.hitch(this, function (linePosition, mouseEvent ){
                        //query(String("." + tableClassString)).style("backgroundColor", "orange");
                        console.log("mousedown Header",mouseEvent)
                        this.tableModel.setHeaderRow(linePosition)
                    }, lang.clone(lineNumber) ))

                    let lineNumberDiv = domConstruct.create("span")
                    lineNumberDiv.innerHTML = lineNumber.toString()
                    domClass.add(lineNumberDiv, this.baseClass+"FileNumberSpan")

                    let setFooterDiv = domConstruct.create("div")
                    domClass.add(setFooterDiv, this.baseClass+"SetFooterDiv")
                    domConstruct.place(`<img src='balek-modules/coopilot/tabImporter/resources/images/triangleDown.svg' class='${this.baseClass}SetDivImage' alt="Set Footer" />`, setFooterDiv)



                    on(setFooterDiv, "mousedown", lang.hitch(this, function (linePosition, mouseEvent ){
                        //query(String("." + tableClassString)).style("backgroundColor", "orange");
                        console.log("mousedown Header",mouseEvent)

                        this.tableModel.setFooterRow(linePosition)
                    }, lineNumber.valueOf()  ))



                    domConstruct.place(setHeaderDiv, setSpan)

                    domConstruct.place(setFooterDiv, setSpan)

                    domConstruct.place(setSpan, firstTableData)

                    domConstruct.place(lineNumberDiv, firstTableData)

                    domConstruct.place(firstTableData, row)


                    for( const value of line)
                    {
                        let tableData = domConstruct.create("td")


                        domClass.add(tableData, this.getColumnClass(valuePosition))

                        valuePosition++;
                        tableData.innerHTML = value;
                        domConstruct.place(tableData, row)
                    }
                    return row
                }else {
                    console.log(`🥊 Line not array in buildRow:${line} | no Reject`, line);
                }

            },
            getColumnClass: function(headerPosition){
                return this.baseClass+"TableRowIdentityCell" + headerPosition.toString()
            },
            setShowTableButtonActions: function(buttonNode)
            {
                on(buttonNode, "dblclick", lang.hitch(this, function (mouseEvent){
                        if (this.tableBuilt){
                             this._tableStatusDiv.innerHTML = "Please Wait"
                            setTimeout(lang.hitch(this, function(){

                                require(["dojo/domReady!"], lang.hitch(this, function(){
                                    console.log("ready")

                                    for( node in this._domHiddenTable.children){
                                        domConstruct.place(node, this._domDisplayTable, "last")                                    }

                                    this._tableStatusDiv.innerHTML = "Table Displayed"

                                }));


                            }), 0)
                        }

                }))
            },

            setColumnHeaderActions: function(headerNode, valuePosition){
                let tableClassString = this.getColumnClass(valuePosition)
                on(headerNode, "mouseenter", function (mouseEvent){
                    //query(String("." + tableClassString)).style("backgroundColor", "orange");
                    let nodeList = query(String("." + tableClassString), this._tableDiv);

                    for ( const node of nodeList)
                    {
                        domStyle.set(node,"backgroundColor", "rgba(123, 178, 91, 0.8)" )
                        domStyle.set(node,"cursor", "pointer" )

                    }
                })

                on(headerNode, "mouseleave", function (mouseEvent){
                    //query(String("." + tableClassString)).style("backgroundColor", "orange");
                    let nodeList = query(String("." + tableClassString), this._tableDiv);

                    for ( const node of nodeList)
                    {
                        domStyle.set(node,"backgroundColor", "unset" )
                        domStyle.set(node,"cursor", "unset" )

                    }
                })

                on(headerNode, "click", function (mouseEvent){
                    let nodeList = query(String("." + tableClassString), this._tableDiv);

                    if (mouseEvent.shiftKey && !mouseEvent.altKey ){
                        let nodeList = query(String("." + tableClassString), this._tableDiv);

                        for ( const node of nodeList)
                        {
                            domStyle.set(node,"visibility", "collapse" )
                        }
                      //Chose COlumn for output selection
                    }

                    if (mouseEvent.altKey && mouseEvent.shiftKey ){
                     //   alert("unchose:" + valuePosition)
                        //remove from output selection
                    }


                })


                let currentColumn = valuePosition.valueOf()
                on(headerNode, "dblclick", lang.hitch(this, function (mouseEvent){
                    if (mouseEvent.altKey && mouseEvent.shiftKey ){
                        alert("remove:" + valuePosition)
                        //remove from output selection
                    }else {
                        //query(String("." + tableClassString)).style("backgroundColor", "orange");
                        let nodeList = query(String("." + tableClassString), this._tableDiv);

                        let currentColumnValueArray = this.tableModel.getColumnValueArray(currentColumn)

                        console.log("Get currentColumnValueArray:", currentColumnValueArray);

                        this.outputPreviewPane.innerHTML = currentColumnValueArray.join(",")
                        for ( const node of nodeList)
                        {
                            domStyle.set(node,"backgroundColor", "unset" )
                            domStyle.set(node,"cursor", "unset" )

                        }
                    }


                }))

            },
            unload: function () {
                this.destroy();
            }
        });
    }
);



