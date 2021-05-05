const tileLayerProviders = {
    "OSM default": {
        "urlTemplate": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "options": {
            "attribution": "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
        },
    },
    "CyclOSM": {
        "urlTemplate": "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
        "options": {
            "attribution":
                "<a href='https://github.com/cyclosm/cyclosm-cartocss-style/releases' " +
                "title='CyclOSM - Open Bicycle render'>CyclOSM</a> | Map data: {attribution.OpenStreetMap}",
        },
    },
    "Humanitarian": {
        "urlTemplate": 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        "options": {
            "attribution":
                "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, " +
                "Tiles style by <a href='https://www.hotosm.org/' target='_blank'>Humanitarian OpenStreetMap Team</a> " +
                "hosted by <a href='https://openstreetmap.fr/' target='_blank'>OpenStreetMap France</a>",
        },
    },
};

window.onload = function () {
    let [map, layers] = setupLeafletMap();

    displayGestapoMarkers(map, layers);
};

/**
 * Setup initial Leaflet map, add scale & tile layer controls.
 *
 * @returns array(L.Map L.Control.Layers) [map layers]
 */
function setupLeafletMap() {
    let baseLayers = {};

    for (const [providerName, providerData] of Object.entries(tileLayerProviders)) {
        let tileLayer = L.tileLayer(providerData.urlTemplate, providerData.options);
        baseLayers[providerName] = tileLayer;
    }

    // initialize the map on the "leafletMapId" div
    let map = L.map('leafletMapId', {
        center: [52.377132041829874, 9.727402178803096],
        zoom: 8,
        layers: [baseLayers['OSM default']],
    });

    // add layers control to switch between different base layers and switch overlays on/off
    let layers = L.control.layers(baseLayers).addTo(map);

    // add scale control using metric system
    L.control.scale({
        imperial: false,
    }).addTo(map);

    return [map, layers];
};

/**
 * Request Wikidata "Places of Gestapo terror in present-day Lower Saxony" and
 * create map markers and their popup content.
 *
 * @param {L.Map} map
 * @param {L.Control.Layers} layers
 */
function displayGestapoMarkers(map, layers) {
    const sparqlQuery = `
        SELECT
            ?item
            ?itemLabel
            ?itemDescription
            (GROUP_CONCAT(DISTINCT ?itemInstanceLabel ; separator=", ") as ?itemInstanceLabelConcat)
            (SAMPLE(?lat) AS ?lat)
            (SAMPLE(?lng) AS ?lng)
        WHERE {
            ?item wdt:P195 wd:Q106571749;
                wdt:P31 ?itemInstance;
                p:P625 ?itemGeo.
            ?itemGeo psv:P625 ?geoNode.
            ?geoNode wikibase:geoLatitude ?lat;
                wikibase:geoLongitude ?lng.
            SERVICE wikibase:label {
                bd:serviceParam wikibase:language "de".
                ?item rdfs:label ?itemLabel.
                ?item schema:description ?itemDescription.
                ?itemInstance rdfs:label ?itemInstanceLabel.
            }
        }
        GROUP BY ?item ?itemLabel ?itemDescription
        ORDER BY ?item`;

    const queryDispatcher = new SparqlQueryDispatcher(sparqlQuery);

    queryDispatcher.query(sparqlQuery)
        .then((response) => {
            let gestapoPlacesLayerGroup = L.layerGroup();

            response.results.bindings.forEach(place => {
                let marker = L.marker([place.lat.value, place.lng.value], {
                    title: place.itemLabel.value
                });

                let markerPopUpHtmlTemplate = `
                    <div class="popUpTopic">
                        <a href="${ place.item.value }" target="_blank">
                            ${ place.itemLabel.value }
                        </a>
                    </div>
                    <div class="popUpTopicCategory">
                        ${ place.itemInstanceLabelConcat.value }
                    </div>
                    <br>
                    ${ place.itemDescription.value }`;

                marker.bindPopup(markerPopUpHtmlTemplate);

                gestapoPlacesLayerGroup.addLayer(marker);
            });

            layers.addOverlay(gestapoPlacesLayerGroup, 'OGT-places');
            gestapoPlacesLayerGroup.addTo(map);
        });
};