onmessage = function(e) {
    let data = e.data

    if(data.parseTabSeperatedString ) {
        parseTabSeperatedString(data.parseTabSeperatedString)
    }

}
parseTabSeperatedString = function( stringToParse ){
    let entries = []
    let linesArray = stringToParse.split("\n")

    let entryLines = 0
    let entry = {}

    if(linesArray[0].split("\t")[0] == "MPW #"){
        linesArray.shift() // remove header row
    }

    for (const line of linesArray)
    {
        let valuesArray = line.split("\t")
        let valuesToSaveArray = [];

        for (const value of valuesArray) {
            let valueWithoutQuotes = value.replace(/^["'](.+(?=["']$))["']$/, '$1');
            //regex removes quotes around value
            valuesToSaveArray.push(valueWithoutQuotes);
        }

        //Put every 3 lines together

        entryLines++

        if(entryLines == 1 )
        {
            entry.original = entryFromValueArray(valuesToSaveArray)
        }else if (entryLines == 2){
            entry.update = entryFromValueArray(valuesToSaveArray)
        }else if( entryLines == 3) {
            entry.instructions = {
                entry : valuesToSaveArray[0],
                valuesArray : valuesToSaveArray
            }
            entries.push(entry)
            entryLines = 0
            entry = {}
        }
    }


    postMessage({parseTabSeperatedString: {entries: entries }});

}

entryFromValueArray = function (valueArray){

    let entry = {}
    entry.supplierID = valueArray[0]
    entry.description = valueArray[1]
    entry.descriptionChangeDate = valueArray[2]
    entry.UPC = valueArray[3]
    entry.priceChangeDate = valueArray[4]
    entry.unitOfSale = valueArray[5]
    entry.weight = valueArray[6]
    entry.length = valueArray[7]
    entry.width = valueArray[8]
    entry.height = valueArray[9]
    entry.putUp = valueArray[10]
    entry.UCU = valueArray[11]
    entry.unitSize = valueArray[12]
    entry.caseSize = valueArray[13]
    entry.casePrice = valueArray[14]
    entry.unitPrice = valueArray[15]
    entry.SRP = valueArray[16]
    entry.margin = valueArray[17] || ""

    entry.valuesArray = valueArray



    return entry
}


