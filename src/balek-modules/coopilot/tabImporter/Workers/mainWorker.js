onmessage = function(e) {
    let data = e.data

    if(data.parseTabSeperatedString && data.parseParameters ) {
        console.log(' parseTabSeperatedString Message received from main script', e);

        parseTabSeperatedString(data.parseTabSeperatedString,data.parseParameters )
    }
    console.log('Message received from main script', e);
    const workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    console.log('Posting message back to main script');
    postMessage(workerResult);
}
parseTabSeperatedString = function( stringToParse, parseParameters ){
    let lines = []
    let linesArray = stringToParse.split("\n")

    let mostValuesInALine = 0
    let headerStart = 0
    let footerStart = 0


    for (const line of linesArray)
    {
        let valuesArray = line.split(parseParameters.valueSeparator)
        let valuesToSaveArray = [];

        if (mostValuesInALine < valuesArray.length){
            mostValuesInALine = valuesArray.length
            if(parseParameters.autoTrim)
            {
                headerStart = length
            }
        }

        if (this.mostValuesInLine > valuesArray.length){
            if(parseParameters.autoTrim)
            {
                footerStart = length - 1
            }

        }

        for (const value of valuesArray) {
            let valueWithoutQuotes = value.replace(/^["'](.+(?=["']$))["']$/, '$1');
            //regex removes quotes around value
            valuesToSaveArray.push(valueWithoutQuotes);

        }
        lines.push(valuesToSaveArray)

    }

    if(!parseParameters.autoTrim && footerStart == 0)
    {
        footerStart = lines.length - 1
    }

    postMessage({parseTabSeperatedString: {lines: lines }, parseReturnParameters: {
            mostValuesInALine : mostValuesInALine,
            headerStart : headerStart,
            footerStart : footerStart
        }});

}
