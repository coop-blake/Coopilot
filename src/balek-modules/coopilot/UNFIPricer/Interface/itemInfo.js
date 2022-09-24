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

        'dojo/text!balek-modules/coopilot/UNFIPricer/resources/html/itemInfo.html',
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

        return declare("moduleCoopilotUNFIPricerItemInfoInterface", [_WidgetBase,_TemplatedMixin], {


            baseClass: "coopilotUNFIPricerItemInfoInterface",
            eachPrice : "",
            casePrice : "",
            productName : "",
            productBrand : "",

            templateString: interfaceHTMLFile,





            constructor: function (args) {

                declare.safeMixin(this, args);


            },

            postCreate: function(){



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
                this.refreshUI()
            },
            setUILoading: function(){
                this._dataInfoPane.innerHTML="Loading Dropped File";
                this._previewPane.innerHTML ="Loading Dropped File";
            },
            refreshLookup: function(){
                if(this.linesByItemID[this._dataInput.value] ){

                    let eachPrice = this.linesByItemID[this._dataInput.value][8].toString()
                    let casePrice = this.linesByItemID[this._dataInput.value][9].toString()
                    let productName = this.linesByItemID[this._dataInput.value][7].toString()
                    let productBrand = this.linesByItemID[this._dataInput.value][1].toString()

                    let replacementText = `<br/>
<b>Brand:</b> ${productBrand} <br/>
<b>Name:</b> ${productName} <br/>
<b>Each Price:</b> $${eachPrice.match(/^-?\d+(?:\.\d{0,2})?/)[0]} <br/>
<b>Case Price:</b> $${casePrice.match(/^-?\d+(?:\.\d{0,2})?/)[0]} <br/>
<br/>
${itemInfoTemplate}`

domConstruct.place()
                    this._previewPane.innerHTML = replacementText
                    /*this.linesByItemID[this._dataInput.value].toString() +
                        "<br />" + "Brand:" + productBrand +
                        "<br />" + "Name:" + productName +
                        "<br />" + "Each Price:" + eachPrice +
                        "<br />" + "Case Price:" + casePrice;
*/
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



