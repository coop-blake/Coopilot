define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/Stateful',
        'dojo/text!balek-modules/coopilot/models/workers/pricebookEntriesFromFileWorker.js',],
    function (declare, lang, Stateful, packchangeEntriesFromFileWorkerCode){
        return declare("UNFIPricebookModel", null, {
            entriesArray: null,
            entriesByScanCode: null,
            entriesBySupplierID: null,
            _WorkerCode: packchangeEntriesFromFileWorkerCode,

            dataString: null,
            //State Variables
            dataProcessedWhen: 0,

            modelState: null,
            parseWorker: null,

            constructor: function(args){
                this.entriesArray = []
                this.entriesBySupplierID = {}
                this.entriesByScanCode = {}
                declare.safeMixin(this, args);

                //Create the Model State
                let ModelState = declare([Stateful], {

                });

                this.modelState = new ModelState({
                    dataProcessedWhen: lang.clone(this.dataProcessedWhen)
                });

                //Create the worker for reading string passed to table
                if (window.Worker) {
                    try{
                        // Make Blob URL from Imported Worker Code
                        let WorkerCodeBlob = new Blob([String(this._WorkerCode)], {type: 'application/javascript'})
                        // Set up Worker
                        this.parseWorker = new Worker(URL.createObjectURL(WorkerCodeBlob));
                        this.parseWorker.onmessage = lang.hitch(this, this.parseWorkerDone)
                    }
                    catch(error){
                        console.log("Error!!", error)
                    }
                }else {
                    alert("No Web Workers!")
                }

                //Parse data if passed
                if(this.dataString != null){
                    this.parseDataString()
                }
            },
            parseWorkerDone: function(parseDataReadyEvent){
                if(parseDataReadyEvent.data.parseTabSeperatedString && parseDataReadyEvent.data.parseTabSeperatedString.entries){
                    this.entriesArray = parseDataReadyEvent.data.parseTabSeperatedString.entries;
                    for (entry of this.entriesArray){
                        this.entriesBySupplierID[String(entry.supplierID)] = entry
                        this.entriesByScanCode[String(entry.UPC)] = entry
                    }
                    this.setDataProcessedWhen(Date.now())
                }
            },
            parseDataString: function(){
                this.parseWorker.postMessage({ parseTabSeperatedString: this.dataString});
            },
            setDataString: function(dataString){
                this.dataString = dataString
                this.parseDataString()

            },
            getEntryByScanCode(scanCode){
                return this.entriesByScanCode[String(scanCode)]

            },
            getNumberOfEntries: function(){
                return this.entriesArray.length
            },
            getModelState: function(){
                return this.modelState;
            },
            getEntries : function(){
                return this.entriesArray
            },
            setDataProcessedWhen: function(setTo){
                this.modelState.set("dataProcessedWhen", setTo)

            },
            getDataProcessedWhen: function(){
                return this.modelState.get("dataProcessedWhen")
            }
        })

    })