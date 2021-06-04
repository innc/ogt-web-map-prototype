let globals = {
    map: null,
};

/**
 * Init Leaflet map and add leaflet-geosearch control
 */
window.onload = function () {
    globals.map = L.map('leafletMapDiv', {
        // format: [lat, lng], here e.g. center of Hannover, Lange Laube 28
        center: [52.377132041829874, 9.727402178803096],
        zoom: 8,
    });

    L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(globals.map);

    const geoSearchControl = new GeoSearch.GeoSearchControl({
        // determines how many last results are kept in memory
        maxMarkers: 100,
        popupFormat: ({
            query,
            result
        }) => {
            addAddressToTable(result);
            return result.label;
        },
        provider: new GeoSearch.OpenStreetMapProvider(),
        style: 'bar',
    });

    globals.map.addControl(geoSearchControl);
};

/**
 * Add address label, latitude and longitude to table.
 *
 * @param {object} address
 */
function addAddressToTable(address) {
    let addressesTable = document.getElementById('geoSearchResultsTable');
    // add new row at end of table
    let addressRow = addressesTable.insertRow(-1);
    let labelCell = addressRow.insertCell(0);
    let coordinatesCell = addressRow.insertCell(1);
    labelCell.innerHTML = address.label;
    // x is longitude and y is latitude
    coordinatesCell.innerHTML = address.y + ', ' + address.x;

    addressRow.onclick = function () {
        showAddress(address.y, address.x);
    };
}

/**
 * Fly to coordinates on map.
 *
 * @param {float} lat
 * @param {float} lng
 */
function showAddress(lat, lng) {
    globals.map.flyTo([lat, lng]);
}