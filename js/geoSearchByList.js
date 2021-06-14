const globals = {
    mapMarkers: [],
};

/**
 * Init Leaflet map and add functionality for geosearch buttons.
 */
window.onload = function () {
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    config.map = L.map('leafletMapDiv', {
        // center format is [lat, lng], here e.g. center of Hannover, Lange Laube 28
        center: [52.377132041829874, 9.727402178803096],
        layers: [tileLayer],
        zoom: 8,
    });

    const geoSearchBestButtons = document.getElementsByClassName('geoSearchButton');

    for (const geoSearchBestButton of geoSearchBestButtons) {
        geoSearchBestButton.onclick = function () {
            geoSearch(geoSearchBestButton.dataset.bestAddressConstraint);
        };
    }
};

/**
 * Geo search best fit address or all addresses.
 *
 * @param {string} bestAddressConstraint true or false
 * @returns void
 */
async function geoSearch(bestAddressConstraint) {
    const provider = getProvider();

    if (provider === null) {
        return;
    }

    const addresses = getAdresses();

    for (const searchedAddress of addresses) {
        if (searchedAddress === '') {
            addAddressesToTable(searchedAddress);
            continue;
        }

        let results = await provider.search({
            query: searchedAddress
        });

        // only use best fitting address, if exist
        if (bestAddressConstraint === 'true' && results.length > 1) {
            results = [results[0]];
        }

        addAddressesToTable(searchedAddress, results);
    }
}

/**
 * Get choosen provider.
 *
 * @returns {null|object} Provider
 */
function getProvider() {
    const providerName = document.getElementById('providersList');

    let provider = null;

    switch (providerName.value) {
        case 'algolia':
            provider = new GeoSearch.AlgoliaProvider();
            break;
        case 'esri':
            provider = new GeoSearch.EsriProvider();
            break;
        case 'openStreetMap':
            provider = new GeoSearch.OpenStreetMapProvider();
            break;
        case 'bing':
        case 'google':
        case 'here':
        case 'locationIQ':
        case 'openCage':
            window.alert('This provider is not implemented until now.');
            break;
        default:
            window.alert('Unknown provider name.');
            break;
    }

    return provider;
}

/**
 * Get trimmed addresses from textarea as array.
 *
 * @returns {array} trimmed addresses from textarea
 */
function getAdresses() {
    const addressesTextarea = document.getElementById('addressesTextarea');
    let addresses = addressesTextarea.value.split('\n');
    return addresses.map(address => address.trim());
}

/**
 * Add searched address and found address labels, latitudes and longitudes to table.
 *
 * @param {string} searchedAddress
 * @param {array} foundAddresses
 */
function addAddressesToTable(searchedAddress, foundAddresses = []) {
    // add table row, if searched address is a blank line or no adresses found
    if (foundAddresses.length == 0) {
        let addressesTable = document.getElementById('geoSearchResultsTable');
        // add new row at end of table
        let addressRow = addressesTable.insertRow(-1);
        let labelFromListCell = addressRow.insertCell(0);
        labelFromListCell.innerHTML = (searchedAddress == '') ? '-' : searchedAddress;
        addressRow.insertCell(1);
        addressRow.insertCell(2);

        return;
    }

    // add table row for each found address
    for (const foundAddress of foundAddresses) {
        let addressesTable = document.getElementById('geoSearchResultsTable');
        // add new row at end of table
        let addressRow = addressesTable.insertRow(-1);
        let labelFromListCell = addressRow.insertCell(0);
        let labelFromGeoSearchCell = addressRow.insertCell(1);
        let coordinatesCell = addressRow.insertCell(2);

        labelFromListCell.innerHTML = searchedAddress;
        labelFromGeoSearchCell.innerHTML = foundAddress.label;
        // x is longitude and y is latitude
        coordinatesCell.innerHTML = foundAddress.y + ', ' + foundAddress.x;

        addressRow.onclick = function () {
            showAddress(foundAddress.y, foundAddress.x);
        };

        addMapMarker(foundAddress.label, foundAddress.y, foundAddress.x);
    }
}

/**
 * Fly to coordinates on map.
 *
 * @param {float} lat
 * @param {float} lng
 */
function showAddress(lat, lng) {
    config.map.flyTo([lat, lng]);
}

/**
 * Add marker on map.
 *
 * @param {string} addressLabel
 * @param {float} lat
 * @param {float} lng
 */
function addMapMarker(addressLabel, lat, lng) {
    if (globals.mapMarkers.includes(addressLabel)) {
        return;
    }

    globals.mapMarkers.push(addressLabel);

    L.marker([lat, lng], {
        title: addressLabel,
    }).addTo(config.map);
}