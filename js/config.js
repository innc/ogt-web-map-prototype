const config = {
    getAllOgtData: {
        onlySelectedProperties: false,
        selectedProperties: [
            'itemAltLabels',    // fixed name
            'itemDescription',  // fixed name
            'P31',              // https://www.wikidata.org/wiki/Property:P31 instance of
            'P625',             // https://www.wikidata.org/wiki/Property:P625 coordinate location
            'P131',             // https://www.wikidata.org/wiki/Property:P131 located in the administrative territorial entity
            'P17',              // https://www.wikidata.org/wiki/Property:P17 country
        ],
    },
    map: null,
    sparqlQuerys: {
        getGestapoTerrorPlaces: `
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
        getAllOgtData: `
            SELECT
                ?item
                ?itemLabel
                ?itemDescription
                ?itemAltLabel
                ?prop
                ?propLabel
                ?propValueLabel
                ?qualifier
                ?qualifierLabel
                ?qualifierValueLabel
                # preparation for getting date precision
                # ?propValueTimeprecision
            WHERE {
                # some default items
                # VALUES ?item {wd:Q106600727 wd:Q1800285 wd:Q106109048}
                ?item wdt:P31 wd:Q106996250;
                    ?p ?statement.
                ?statement ?ps ?propValue.
                ?prop wikibase:claim ?p;
                    wikibase:statementProperty ?ps.

                # (wip) preparation for getting date precision
                # OPTIONAL {
                #   ?statement ?psv ?propStatementValue.
                #   ?propStatementValue wikibase:timePrecision ?propValueTimeprecision
                # }

                OPTIONAL {
                    ?statement ?pq ?qualifierValue.
                    ?qualifier wikibase:qualifier ?pq.
                }
                SERVICE wikibase:label { bd:serviceParam wikibase:language "de". }
            }
            ORDER BY ?item ?prop ?statement ?propValue`,
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