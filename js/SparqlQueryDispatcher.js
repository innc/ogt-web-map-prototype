class SparqlQueryDispatcher {
    constructor(sparqlQuery) {
        this.endpoint = 'https://query.wikidata.org/sparql';
        this.sparqlQuery = sparqlQuery;
    }

    query() {
        const fullUrl = this.endpoint + '?query=' + encodeURIComponent(this.sparqlQuery);
        const headers = {
            'Accept': 'application/sparql-results+json'
        };

        return fetch(fullUrl, {
            headers
        }).then(body => body.json());
    }
}