/**
 * Register on-click handler for "Create Wikidata csv"-button
 */
window.onload = function () {
    const getDataButton = document.getElementById('createWikidataCsvButton');

    getDataButton.onclick = function () {
        requestAllOgtData();
    };
}

/**
 * Send get-all-OGT-data request to Wikidata and init response handling.
 */
function requestAllOgtData() {
    const queryDispatcher = new SparqlQueryDispatcher(config.sparqlQuerys.getAllOgtData);

    queryDispatcher.query()
        .then((response) => {
            convertArrayToCsvFile(processData(response.results.bindings));
        });
}

/**
 * Transform Wikidata response into a convenient format for OpenRefine.
 * Each value of the same property of a wikidata item is assigned to another array,
 * which later corresponds to a new csv line. e.g.
 *
 * id       label   instance of                 elevation above sea level   shares border with
 * Q1715    Hanover state capital in Germany    55 metre                    Gehrden
 * Q1715    Hanover Hanseatic city                                          Ronnenberg
 * Q1715    Hanover                                                         Garbsen
 *
 * @param {array} data Array of arrays, each containing property/qualifier values of Wikidata items
 * @returns {array}
 */
function processData(data) {
    let selectedProperties = config.getAllOgtData.selectedProperties;

    let wikidataItem = {};
    let wikidataItemId = '';
    let wikidataItems = [];
    let wikidataPropLabels = {
        itemAltLabels: 'alt-labels',
        itemDescription: 'description',
    };

    let propId = '';
    let samePropCounter = 0;

    // for each wikidata item, create an object that contains all the information from each array of a wikidata item.
    data.forEach(element => {
        // create new Wikidata object
        if (wikidataItemId !== element.item.value) {

            // last used Wikidata item id
            wikidataItemId = element.item.value;

            wikidataItem = {
                itemId: element.item.value,
                itemLabel: element.itemLabel.value,
                itemAltLabels: element.itemAltLabel ? element.itemAltLabel.value.split(', ') : [''],
                itemDescription: element.itemDescription ? [element.itemDescription.value] : [''],
                requiredRows: 1,
            };

            wikidataItem.requiredRows = wikidataItem.itemAltLabels.length;

            wikidataItems.push(wikidataItem);

            // reset same property counter
            samePropCounter = 1;
        }

        let lastSlashPos = element.prop.value.lastIndexOf('/');
        element.prop.value = element.prop.value.substring(lastSlashPos + 1);

        // ignore not wanted Wikidata properties
        if (config.getAllOgtData.onlySelectedProperties) {
            let position = selectedProperties.indexOf(element.prop.value);

            if (position === -1) {
                return;
            }
        }

        // count same Wikidata property names (having different values) of a Wikidata item
        // to know max required rows for a Wikidata item
        if (propId === element.prop.value) {
            samePropCounter += 1;

            if (samePropCounter > wikidataItem.requiredRows) {
                wikidataItem.requiredRows = samePropCounter;
            }
        } else {
            propId = element.prop.value;
            samePropCounter = 1;
        }

        // convert datetime by available precision
        /* @todo required to get really stored datetime values at Wikidata
        if (element.hasOwnProperty('propValueTimeprecision')) {
            console.log(element);
            console.log(element.propValueLabel.value);
            let datetime = new Date(element.propValueLabel.value);

            switch (element.propValueTimeprecision.value) {
                // year
                case '9':
                    element.propValueLabel.value = datetime.getFullYear();
                    break;
                // month
                case '10':
                    element.propValueLabel.value = datetime.toISOString().split('T')[0];
                    break;
                // day
                case '11':
                    element.propValueLabel.value = datetime.toISOString().split('T')[0];
                    break;
                default:
                    window.alert('unhandled time precision value (' + element.propValueTimeprecision.value + ')');
                    break;
            }

            console.log(element.propValueLabel.value);
        }
        */

        // convert Wikidata geo-coordinates format to lat, lng format
        if (propId == 'P625') {
            element.propValueLabel.value = element.propValueLabel.value.match(/[0-9.]+/g).join(', ');
        }

        // store property values as array within Wikidata object item
        if (wikidataItem.hasOwnProperty(propId)) {
            wikidataItem[propId].push({
                propValue: element.propValueLabel.value,
                qualifierLabel: element.qualifierLabel ? element.qualifierLabel.value : '',
                qualifierValue: element.qualifierValueLabel ? element.qualifierValueLabel.value : '',
            });
        } else {
            wikidataItem[propId] = [{
                propValue: element.propValueLabel.value,
                qualifierLabel: element.qualifierLabel ? element.qualifierLabel.value : '',
                qualifierValue: element.qualifierValueLabel ? element.qualifierValueLabel.value : '',
            }];
        }

        wikidataPropLabels[propId] = element.propLabel.value;
    });

    // add all found properties to pre selected properties (=> keep order of pre selected properties)
    if (!config.getAllOgtData.onlySelectedProperties) {
        for (const [key, value] of Object.entries(wikidataPropLabels)) {
            if (!selectedProperties.includes(key)) {
                selectedProperties.push(key);
            }
        }
    }

    // set column headers
    let processedWikidataItemRows = [
        ['color', 'id', 'label']
    ];
    selectedProperties.forEach(header => {
        processedWikidataItemRows[0].push('(' + header + ') ' + wikidataPropLabels[header]);

        if (header != 'itemAltLabels' && header != 'itemDescription') {
            processedWikidataItemRows[0].push('(' + header + ') qualifiers');
        }
    });

    let color = 0;

    // create arrays for Wikidata items
    wikidataItems.forEach(wikidataItem => {
        let requiredRowsForItem = [];

        // create as many arrays as the wikidata object has maximum of same wikidata properties with different values
        for (let i = 0; i < wikidataItem.requiredRows; i++) {
            requiredRowsForItem.push([
                // color (0 or 1) is a help for alternate coloring of same wikidata element rows within spreadsheet
                color,
                wikidataItem.itemLabel,
                wikidataItem.itemId,
            ]);
        }

        // fill rows with Wikidata property values
        selectedProperties.forEach(header => {
            for (let i = 0; i < requiredRowsForItem.length; i++) {

                let propValue = '';
                let qualifierValue = '';

                if (wikidataItem[header] && wikidataItem[header][i]) {
                    if (header == 'itemAltLabels' || header == 'itemDescription') {
                        propValue = wikidataItem[header][i];
                    } else {
                        propValue = wikidataItem[header][i].propValue;

                        if (wikidataItem[header][i].qualifierLabel !== '') {
                            qualifierValue = wikidataItem[header][i].qualifierLabel + ':\n' + wikidataItem[header][i].qualifierValue;
                        }
                    }
                }

                requiredRowsForItem[i].push(propValue);

                if (header.startsWith('P')) {
                    requiredRowsForItem[i].push(qualifierValue);
                }
            }
        });

        requiredRowsForItem.forEach(innerArray => processedWikidataItemRows.push(innerArray));
        color = 1 - color;
    });

    return processedWikidataItemRows;
}

/**
 * Convert array into a csv-file, which can be downloaded.
 *
 * @param {array} dataArray Array of arrays.
 */
function convertArrayToCsvFile(dataArray) {
    // join each array and quote each element within array
    let csvContent =
        dataArray.map(
            innerArray => innerArray.map(
                innerArrayElement => quote(innerArrayElement)
            ).join(',')
        ).join('\n');

    csvContent = 'data:text/csv;charset=utf-8,' + csvContent;

    let anchor = document.createElement('a');
    anchor.setAttribute('href', encodeURI(csvContent));
    anchor.setAttribute('download', 'wikidata.csv');
    anchor.click();
}

/**
 * Add a quotation mark at start and end of string.
 *
 * @param {string} string
 * @returns
 */
function quote(string) {
    return '"' + string + '"';
}