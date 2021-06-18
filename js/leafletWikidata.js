window.onload = function () {
    let layers = setupLeafletMap();

    requestGestapoMarkers(layers);
};

/**
 * Setup initial Leaflet map, add scale & tile layer controls.
 *
 * @returns L.Control.Layers
 */
function setupLeafletMap() {
    let baseLayers = {};

    for (const [providerName, providerData] of Object.entries(config.tileLayerProviders)) {
        let tileLayer = L.tileLayer(providerData.urlTemplate, providerData.options);
        baseLayers[providerName] = tileLayer;
    }

    // initialize the map on the "leafletMapId" div
    config.map = L.map('leafletMapId', {
        center: [52.377132041829874, 9.727402178803096],
        zoom: 8,
        layers: [baseLayers['OSM default']],
    });

    // add layers control to switch between different base layers and switch overlays on/off
    let layers = L.control.layers(baseLayers).addTo(config.map);

    // add scale control using metric system
    L.control.scale({
        imperial: false,
    }).addTo(config.map);

    return layers;
};

/**
 * Request Wikidata "Places of Gestapo terror in present-day Lower Saxony" and handle response.
 *
 * @param {L.Control.Layers} layers
 */
function requestGestapoMarkers(layers) {
    const queryDispatcher = new SparqlQueryDispatcher(config.sparqlQuerys.getGestapoTerrorPlaces);

    queryDispatcher.query()
        .then((response) => {
            displayGestapoMarkers(layers, response.results.bindings);
        });
};

/**
 * Create map markers, their popup content including a zoom-in-button.
 *
 * @param {L.Control.Layers} layers
 * @param {array} places
 */
function displayGestapoMarkers(layers, places) {
    let gestapoPlacesLayerGroup = L.layerGroup();

    places.forEach(place => {
        let marker = L.marker([place.lat.value, place.lng.value], {
            title: place.itemLabel.value,
        });

        let markerPopUpHtmlTemplate = `
            <div class="popUpTopic">
                <a href="${ place.item.value }" target="_blank">
                    ${ place.itemLabel.value }
                </a>
                <button class="zoomInButton">
                    &#x1f50d;
                </button>
            </div>
            <div class="popUpTopicCategory">
                ${ place.itemInstanceLabelConcat.value }
            </div>
            <br>
            ${ place.itemDescription.value }`;

        marker.bindPopup(markerPopUpHtmlTemplate, {
            minWidth: 333,
        });

        marker.on('click', event => {
            const zoomInButton = marker.getPopup().getElement().getElementsByClassName('zoomInButton')[0];

            zoomInButton.onclick = function () {
                config.map.flyTo(event.latlng, 18);
            };
        });

        gestapoPlacesLayerGroup.addLayer(marker);
    });

    layers.addOverlay(gestapoPlacesLayerGroup, 'OGT-places');
    gestapoPlacesLayerGroup.addTo(config.map);
};