[![GNU GPLv3](https://img.shields.io/badge/license-GNU%20GPLv3-<COLOR>?style=flat "GNU GPLv3 license")](LICENSE)

# Table of contents
- [Table of contents](#table-of-contents)
- [About the prototype](#about-the-prototype)
- [Preview](#preview)
- [Built with](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [License](#license)
- [Contact](#contact)
- [Related links](#related-links)

# About the prototype
This repository is a code-sandbox for the planned OGT project, places of Gestapo terror in present-day at Lower Saxony.

As a first prototype, a simple HTML/JS/CSS/SPARQL website will be implemented without including a web server, a frontend framework, a backend framework or a [Wikibase](https://wikiba.se/) instance. The website shall visualize an [OpenStreetMap](https://www.openstreetmap.de/) and information from [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page) on it.

The prototype will be used to test/evaluate the following:
- [ ] Comparison of (open source) web map frameworks APIs:
    - [ ] [Leaflet](https://leafletjs.com/) ([repository](https://github.com/Leaflet/Leaflet)), an open-source JavaScript library for mobile-friendly interactive maps,
    - [ ] [MapLibre GL](https://github.com/maplibre/maplibre-gl-js), a community led fork derived from [mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js) prior to their switch to a non-OSS license,
    - [ ] [OpenLayers](https://openlayers.org/) ([repository](https://github.com/openlayers/openlayers)), a high-performance, feature-packed library for all your mapping needs.
    - [ ] [MapBox](https://www.mapbox.com/) ([repository](https://github.com/mapbox/mapbox-gl-js)), a non-OSS JavaScript library for interactive, customizable vector maps on the web
- [ ] The Wikidata API & SPARQL by displaying Wikidata information on the map.
- [ ] An option to retrieve geo-coordinates for multiple German addresses at once.
- [ ] A historical (geo-referenced) map as overlay

# Preview
<!--
# TODO: Add webpage screenshot(s)
-->

# Built with
* [npm](https://www.npmjs.com/) ([repository](https://github.com/npm/cli)), a package manager for JavaScript.
* [Leaflet](https://leafletjs.com/) ([repository](https://github.com/Leaflet/Leaflet)), version ^1.7.1

# Getting Started
Instructions for setting up project locally.
To get a local copy up and running follow these simple steps.

## Prerequisites
Software you need to use the prototype and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

## Installation
1. Clone the repo
   ```sh
   git clone https://git.tib.eu/nfdi4culture/ogt/ogt-prototype-simple-webpage.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
# License
Distributed under the GNU GPLv3 License. See [`LICENSE`](LICENSE) for more information.

# Contact
Nils Casties -  [:mailbox_with_mail:](nils.casties@tib.eu)

# Related links
* [OpenStreetMap Frameworks](https://wiki.openstreetmap.org/wiki/Frameworks)
