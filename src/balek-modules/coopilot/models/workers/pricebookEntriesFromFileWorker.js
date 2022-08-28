onmessage = function(e) {
    let data = e.data

    if(data.parseTabSeperatedString ) {
        parseTabSeperatedString(data.parseTabSeperatedString)
    }

}
parseTabSeperatedString = function( stringToParse ){
    let entries = []
    let linesArray = stringToParse.split("\n")


    if(linesArray[0].split("\t")[0] == "Dept"){
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
    entry.department = valueArray[0]
    entry.brand = valueArray[1]
    entry.supplierID = valueArray[2]
    entry.size = valueArray[3]
    entry.flag1 = valueArray[4]
    entry.flag2 = valueArray[5]
    entry.flag3 = valueArray[6]
    entry.description = valueArray[7]
    entry.eachPrice = valueArray[8]
    entry.casePrice = valueArray[9]
    entry.UPC = String(valueArray[10]).replace(/-/g, "")
    entry.weight = valueArray[11]
    entry.flag4 = valueArray[12]
    entry.taxable = valueArray[13]
    entry.MSRP = valueArray[14]
    entry.SRP = valueArray[15]
    entry.margin = valueArray[16]

    //todo remove at some point
    entry.valuesArray = valueArray

    return entry
}


