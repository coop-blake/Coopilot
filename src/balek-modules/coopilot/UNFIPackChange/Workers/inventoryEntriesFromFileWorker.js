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


       let  entry = entryFromValueArray(valuesToSaveArray)
        entries.push(entry)
        entry = {}

    }


    postMessage({parseTabSeperatedString: {entries: entries }});

}

entryFromValueArray = function (valueArray){


    let entry = {}

    entry.scanCode = valueArray[0]
    entry.brand = valueArray[1]
    entry.name = valueArray[2]
    entry.size = valueArray[3]
    entry.receiptAlias = valueArray[4]
    entry.invDiscontinued = valueArray[5]
    entry.subdepartment = valueArray[6]
    entry.storeNumber = valueArray[7]
    entry.department = valueArray[8]
    entry.supplierUnitID = valueArray[9]
    entry.basePrice = valueArray[10]
    entry.quantity = valueArray[11]
    entry.lastCost = valueArray[12]
    entry.averageCost = valueArray[13]
    entry.idealMargin = valueArray[14]
    entry.defaultSupplier = valueArray[15]
    entry.unit = valueArray[16]
    entry.southLastSoldDate = valueArray[17]


    entry.valuesArray = valueArray


    return entry
}


