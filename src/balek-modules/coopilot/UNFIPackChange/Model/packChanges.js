define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/Stateful',
        'dojo/text!balek-modules/coopilot/UNFIPackChange/Workers/packChangeEntriesFromFileWorker.js',],
    function (declare, lang, Stateful, packChangeEntriesFromFileWorkerCode){
    return declare("UNFIPackChangesModel", null, {
        entriesArray: null,
        entriesByID: null,

        _WorkerCode: packChangeEntriesFromFileWorkerCode,

        dataString: null,
        //State Variables
        dataProcessedWhen: 0,

        modelState: null,
        parseWorker: null,

        constructor: function(args){
            this.entriesArray = []
            this.entriesByID = {}
            declare.safeMixin(this, args);
            console.log("UNFIPackChangesModel")

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
                alert("parsing", this.dataString)
               this.parseDataString()
            }
        },

        parseWorkerDone: function(parseDataReadyEvent){
            console.log('👨‍🔧 Message received from worker', parseDataReadyEvent.data);

            if(parseDataReadyEvent.data.parseTabSeperatedString && parseDataReadyEvent.data.parseTabSeperatedString.entries){
                this.entriesArray = parseDataReadyEvent.data.parseTabSeperatedString.entries;

                for (entry of this.entriesArray){
                    this.entriesByID[String(entry.original.supplierID)] = entry
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
        getUpdatedSupplierID(originalSupplierID){
            let entry = this.entriesByID[String(originalSupplierID)]
            if(entry && lang.exists("instructions.entry",entry)) {
                let instructions = String(entry.instructions.entry)
                if (instructions.includes("Replaced by item")) {
                    let sliceEnd = instructions.indexOf("Replaces item")
                    if( sliceEnd == -1)
                    {
                        sliceEnd = instructions.length
                    }
                   return instructions.slice( instructions.indexOf("Replaced by item")+17, sliceEnd)
                }
            }
            return false

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