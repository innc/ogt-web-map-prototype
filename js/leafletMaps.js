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
    let map = setUpLeafletMap();

    displayGestapoMarkers(map);
};

function setUpLeafletMap() {
    // initialize the map on the "leafletMapId" div
    let map = L.map('leafletMapId', {
        center: [52.377132041829874, 9.727402178803096],
        zoom: 8,
    });

    // add layers control to switch between different base layers and switch overlays on/off
    let layersControl = L.control.layers().addTo(map);

    for (const [providerName, providerData] of Object.entries(tileLayerProviders)) {
        // load and display tile layers on the map
        let tileLayer = L.tileLayer(providerData.urlTemplate, providerData.options);
        map.addLayer(tileLayer);
        layersControl.addBaseLayer(tileLayer, providerName);
    }

    // add scale control using metric system
    L.control.scale({
        imperial: false,
    }).addTo(map);

    return map;
};

function displayGestapoMarkers(map) {
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
            response.results.bindings.forEach(place => {
                const marker = L.marker([place.lat.value, place.lng.value], {
                    title: place.itemLabel.value
                }).addTo(map);

                let markerPopUpHtmlTemplate = `
                    <div class="popUpTopic">${ place.itemLabel.value }</div>
                    <div class="popUpTopicCategory">${ place.itemInstanceLabelConcat.value }</div><br>
                    ${ place.itemDescription.value }.`;

                marker.bindPopup(markerPopUpHtmlTemplate);
            });
        });
};