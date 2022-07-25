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

        'dojo/text!balek-modules/coopilot/tabImporter/resources/html/mainTable.html'
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


              interfaceHTMLFile,


    ) {

        return declare("moduleCoopilotTabImporterMainTableInterface", [_WidgetBase,_TemplatedMixin], {


            baseClass: "coopilotTabImporterMainTableInterface",

            buildResolve: null,
            _tableBuilt: false,
            buildPosition: 0,

            templateString: interfaceHTMLFile,


            tableTemplate: "",

            domTable: null,
            domPreviewTable: null,
            domStatusDiv: null,

            tableModel: null,
            tableModelState: null,
            tableModelStateWatchHandle: null,



            constructor: function (args) {

                declare.safeMixin(this, args);

                if(this.tableModel != null)
                {
                    this.tableModelState = this.tableModel.getModelState()
                    this.tableModelStateWatchHandle = this.tableModelState.watch(lang.hitch(this, this.onTableStateChange))
                }else {
                    console.log("🤖🤖No Table Nodel")
                }

            },

            postCreate: function(){
                let dataProcessedWhen = this.tableModel.getDataProcessedWhen()
                if(dataProcessedWhen != 0)
                {
                    this.reloadTable()
                }else {
                    console.log("🤖🤖ERRORRRR DONNNNNE", Error)

                }

            },
            reloadTable(){

                this.buildResolve= null
                this._tableBuilt= false
                this.buildPosition= 0
                this.domTable = null,
                    this.domPreviewTable = null
                this.domNode.innerHTML=`Building Table<br/> ${this.tableModel.getLines().length} lines`
                this.buildTable().then(lang.hitch(this, this.onTableBuilt)).catch(function(Error){
                    console.log("ERRORRRR DONNNNNE", Error)

                })
            },

            onTableStateChange: function(name, oldState, newState){
                console.log("MainTable Interface Model State watcher: onTableStateChange()", name, oldState, newState)

                this.reloadTable()

            },
            onTableBuilt: function(){
                console.log("DONNNNNE")
                this._tableBuilt = true

            },

          buildTable: function(){
              return new Promise(lang.hitch(this, function(Resolve, Reject) {


                  if (this.buildResolve === null){
                      this.buildResolve = Resolve

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
                      }while(this.tableModel.getMostValuesInAnyLine() >= headerCount)

                      let tableHead = domConstruct.create("thead")

                      domConstruct.place(headerRow, tableHead)

                      domConstruct.place(tableHead, table)


                      this.domTable = table
                  }
                  let lines = this.tableModel.getLines()
                  let i = 0;
                  let chunksize = 1000;
                  let count = lines.length - this.buildPosition
                  let end = Math.min(chunksize, count)
                  for ( ; i < end ; ++i)
                  {
                      let row = this.buildRow(lines[this.buildPosition])
                      domConstruct.place(row, this.domTable)
                      this.buildPosition++
                      //this.tableTemplate+=`${this.buildPosition}<br/>`
                  }
                  if(lines.length > this.buildPosition){
                     // console.log("CONTINUE", this.domTable)
                      if(this.domPreviewTable === null)
                      {
                        this.domPreviewTable = lang.clone(this.domTable)
                          domConstruct.place(this.domPreviewTable, this.domNode, "only")

                      }
                      setTimeout(lang.hitch(this, this.buildTable), 25)
                      this.domStatusDiv.innerHTML=`Building Table<br/> ${this.tableModel.getLines().length - this.buildPosition} lines`

                  }else{

                      let buildResolve = this.buildResolve
                      this.buildResolve = null
                      buildResolve(true);
                      if(this.domPreviewTable === null)
                      {
                          this.domPreviewTable = lang.clone(this.domTable)
                          this.domStatusDiv.innerHTML=`Table with ${this.buildPosition-1} lines displayed`

                          domConstruct.place(this.domTable, this.domNode, "only")

                      }else {
                          domConstruct.place(this.buildShowTableButton(), this.domStatusDiv, "only")
                      }
                  }

              }));


          },
            buildShowTableButton(){
                let button = domConstruct.create("div")
                //this.domStatusDiv.innerHTML=`Building Table<br/> ${this.tableModel.getLines().length - this.buildPosition} lines`
                button.innerHTML="Click to Show Table with "
                this.setShowTableButtonActions(button)
                return button;
            },
            buildRow(line){
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
                    this.setHeaderRow(linePosition)
                }, this.buildPosition.valueOf() ))

                let lineNumberDiv = domConstruct.create("span")
                lineNumberDiv.innerHTML = this.buildPosition.toString()
                domClass.add(lineNumberDiv, this.baseClass+"FileNumberSpan")

                let setFooterDiv = domConstruct.create("div")
                domClass.add(setFooterDiv, this.baseClass+"SetFooterDiv")
                domConstruct.place(`<img src='balek-modules/coopilot/tabImporter/resources/images/triangleDown.svg' class='${this.baseClass}SetDivImage' alt="Set Footer" />`, setFooterDiv)



                on(setFooterDiv, "mousedown", lang.hitch(this, function (linePosition, mouseEvent ){
                    //query(String("." + tableClassString)).style("backgroundColor", "orange");
                    this.setFooterRow(linePosition)
                }, this.buildPosition.valueOf()  ))


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
                }
                return row
            },
            getColumnClass: function(headerPosition){
                return this.baseClass+"TableRowIdentityCell" + headerPosition.toString()
            },
            setShowTableButtonActions: function(buttonNode)
            {
                on(buttonNode, "dblclick", lang.hitch(this, function (mouseEvent){
                        if (this._tableBuilt){
                             this.domStatusDiv.innerHTML = "Please Wait"
                            setTimeout(lang.hitch(this, function(){

                                require(["dojo/domReady!"], lang.hitch(this, function(){
                                    console.log("ready")
                                       domConstruct.place(this.domTable, this.domNode, "only")
                                    this.domStatusDiv.innerHTML = "Table Displayed"

                                }));


                            }), 0)
                        }

                }))
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
            setHeaderRow: function(headerRow){
                if((headerRow <= this.lines.length) && (headerRow >= 0)){
                    this.tableModel.setHeaderRow(headerRow)
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
            unload: function () {
                this.destroy();
            }
        });
    }
);



