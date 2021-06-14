const config = {
    map: null,
    sparqlQuerys: {
        // places of Gestapo terror
        getOgtData: `
            SELECT
                ?item
                ?itemLabel
                ?itemDescription
                (GROUP_CONCAT(DISTINCT ?itemInstanceLabel ; separator=", ") as ?itemInstanceLabelConcat)
                ?lat
                ?lng
            WHERE {
                ?item wdt:P31 wd:Q106996250;
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
            GROUP BY ?item ?itemLabel ?itemDescription ?lat ?lng
            ORDER BY ?item`,
    },
    tileLayerProviders: {
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
    },
};