define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/Stateful'], function (declare, lang, Stateful){
    return declare("tabImporterTableModel", null, {
        lineArray: null,

        dataString: null,
        //State Variables
        mostValuesInAnyLine: null,
        headerStart : 0,
        footerStart : 0,
        dataProcessedWhen: 0,
        valueSeparator: "\t",

        modelState: null,
        parseWorker: null,

        constructor: function(args){
            this.lineArray = []
            declare.safeMixin(this, args);
            console.log("tabImporterTableModel")



            //Create the Model State
            let ModelState = declare([Stateful], {

            });

            this.modelState = new ModelState({
                headerStart: lang.clone(this.headerStart),
                footerStart: lang.clone(this.footerStart),
                mostValuesInAnyLine: lang.clone(this.mostValuesInAnyLine),
                dataProcessedWhen: lang.clone(this.dataProcessedWhen),
                valueSeparator: lang.clone(this.valueSeparator)

            });

            //Create the worker for reading string passed to table
            if (window.Worker) {
                this.parseWorker = new Worker(new URL('balek-modules/coopilot/tabImporter/Workers/mainWorker.js', import.meta.url));
                this.parseWorker.onmessage = lang.hitch(this, this.parseWorkerDone)

            }else {
                alert("No Web Workers!")
            }

            if(this.dataString != null){
                alert("parsing", this.dataString)

               this.parseDataString()
            }
        },

        parseWorkerDone: function(parseDataReadyEvent){
            console.log('Message received from worker', parseDataReadyEvent.data);

            if(parseDataReadyEvent.data.parseTabSeperatedString && parseDataReadyEvent.data.parseTabSeperatedString.lines){

                let lines = parseDataReadyEvent.data.parseTabSeperatedString.lines
                if(parseDataReadyEvent.data.parseReturnParameters ){
                    this.setMostValuesInAnyLine(parseDataReadyEvent.data.parseReturnParameters.mostValuesInALine)
                    this.setHeaderRow(parseDataReadyEvent.data.parseReturnParameters.headerStart)
                    this.setFooterRow(parseDataReadyEvent.data.parseReturnParameters.footerStart)
                }
                this.lineArray = parseDataReadyEvent.data.parseTabSeperatedString.lines;
                console.log("DONNNNNNNE", this.lineArray, lines)
                this.setDataProcessedWhen(Date.now())
            }
        },
        parseDataString: function(){

            this.parseWorker.postMessage({ parseTabSeperatedString: this.dataString,
                parseParameters: {  valueSeparator: this.getValueSeparator(),
                }});
        },
        setDataString: function(dataString){
            this.dataString = dataString
            this.parseDataString()

        },
        getModelState: function(){
            return this.modelState;
        },
        getColumnValueArray(columnIndex, startRow = 0 , endRow = this.lineArray.length){
            let returnIndex = []
            let linePosition = 0
            for( const line of this.lineArray)
            {
                if( linePosition >= startRow && linePosition < endRow+1) {
                    returnIndex.push(line[columnIndex])
                }
                linePosition++
            }
            return returnIndex
        },

        getLines: function(){
            return this.lineArray
        },
        getMostValuesInAnyLine: function (){
            return  this.modelState.get("mostValuesInAnyLine")
        },
        setMostValuesInAnyLine: function(mostValues){
            this.modelState.set("mostValuesInAnyLine", mostValues)
        },
        setHeaderRow: function(headerRow){
            if((headerRow <= this.lineArray.length) && (headerRow >= 0)){
                this.modelState.set("headerStart", headerRow)
            }else {
                console.log("Out of Bounds: Not Setting Header to", headerRow)
            }
        },
        getHeaderRow: function(){
            return this.modelState.get("headerStart")
        },
        setFooterRow: function(footerRow){
            if((footerRow <= this.lineArray.length) && (footerRow >= 0)){
                this.modelState.set("footerStart", footerRow)
            }else {
                console.log("Out Of Bounds: Not Setting Footer to", footerRow)
            }
        },
        getFooterRow: function(){
          return this.modelState.get("footerStart")
        },


        setDataProcessedWhen: function(setTo){
                this.modelState.set("dataProcessedWhen", setTo)

        },
        getDataProcessedWhen: function(){
            return this.modelState.get("dataProcessedWhen")
        },

        setValueSeparator: function(setTo){
            this.modelState.set("valueSeparator", setTo)
            this.parseDataString()

        },

        getValueSeparator: function(setTo){
            return this.modelState.get("valueSeparator")

        },

    })

})