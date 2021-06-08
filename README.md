[![GNU GPLv3](https://img.shields.io/badge/license-GNU%20GPLv3-<COLOR>?style=flat "GNU GPLv3 license")](LICENSE)

# Table of contents
- [Table of contents](#table-of-contents)
- [About the prototype](#about-the-prototype)
- [Preview](#preview)
- [Built with](#built-with)
- [Getting Started](#getting-started)
  - [Install by using git and package manager](#install-by-using-git-and-package-manager)
    - [Prerequisites](#prerequisites)
    - [Install](#install)
- [License](#license)
- [Contact](#contact)
- [Related links](#related-links)

# About the prototype
This repository is a code-sandbox for the planned OGT project, places of Gestapo terror in present-day at Lower Saxony.

As a first prototype, a simple HTML/JS/CSS/SPARQL website will be implemented without including a web server, a frontend framework, a backend framework or a [Wikibase](https://wikiba.se/) instance. The website shall visualize an [OpenStreetMap](https://www.openstreetmap.de/) and information from [Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page) on it.

The prototype will be used to test/evaluate the following:
- [ ] Comparison of (open source) web map frameworks APIs:
    - [x] :heavy_check_mark: [Leaflet](https://leafletjs.com/) ([repository](https://github.com/Leaflet/Leaflet)), an open-source JavaScript library for mobile-friendly interactive maps,
    - [ ] [MapLibre GL](https://github.com/maplibre/maplibre-gl-js), a community led fork derived from [mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js) prior to their switch to a non-OSS license,
    - [ ] [OpenLayers](https://openlayers.org/) ([repository](https://github.com/openlayers/openlayers)), a high-performance, feature-packed library for all your mapping needs.
    - [ ] [MapBox](https://www.mapbox.com/) ([repository](https://github.com/mapbox/mapbox-gl-js)), a non-OSS JavaScript library for interactive, customizable vector maps on the web
- Map features like
    - [x] :heavy_check_mark: Default zoom-in/out control
    - [x] :heavy_check_mark: Tile layer providers switch option
    - [x] :heavy_check_mark: Show markers that have detailed info in a popup window
    - [x] :heavy_check_mark: Marker zoom-in option
    - [x] :heavy_check_mark: Hide/Show markers option
    - [ ] Add a time slider
- [x] :heavy_check_mark: The Wikidata API & SPARQL by displaying Wikidata information on the map.
- [ ] Add Wikidata login control.
- [x] :heavy_check_mark: An option to retrieve geo-coordinates for multiple addresses at once.
- [ ] A historical (geo-referenced) map as overlay

# Preview
Leaflet map displaying Wikidata infos:
![Map preview](pics/Screenshot_2021-05-31%20Leaflet%20map.png)
Geo-search on Leaflet map:
![Map preview](pics/Screenshot%202021-06-07%20Leaflet%20GeoSearch.png)
Geo-search by address list:
![Map preview](pics/Screenshot%202021-06-07%20GeoSearch%20by%20list.png)

# Built with
* [Leaflet](https://leafletjs.com/) ([repository](https://github.com/Leaflet/Leaflet)), a JavaScript library for mobile-friendly interactive maps.
* [leaflet-geosearch](https://smeijer.github.io/leaflet-geosearch/) ([repository](https://github.com/smeijer/leaflet-geosearch)), a geocoding/address-lookup library supporting various api providers.
* [npm](https://www.npmjs.com/) ([repository](https://github.com/npm/cli)), a package manager for JavaScript.

# Getting Started
Instructions for setting up project locally.
To get a local copy up and running follow these steps.

## Install by using git and package manager
### Prerequisites
Software you need to use the prototype and how to install them for Ubuntu.
* git (not required, if you download project zip package)
  ```sh
  sudo apt update && sudo apt upgrade
  sudo apt install git
  ```

* npm
  ```sh
  npm install npm@latest -g
  ```

### Install
1. Clone the repo
   ```sh
   git clone https://git.tib.eu/nfdi4culture/ogt/ogt-prototype-simple-webpage.git
   ```
   or download zip package [from GitLab](https://git.tib.eu/nfdi4culture/ogt/ogt-prototype-simple-webpage/-/archive/master/ogt-prototype-simple-webpage-master.zip) (or [GitHub](https://github.com/NFDI4Culture/OGT-prototype-simple-webpage/archive/refs/heads/master.zip)) and unzip into a directory.

2. Install libs with NPM
   ```sh
   cd ogt-prototype-simple-webpage/
   npm install
   ```
# License
Distributed under the GNU GPLv3 License. See [`LICENSE`](LICENSE) for more information.

# Contact
Nils Casties -  [:mailbox_with_mail:](nils.casties@tib.eu)

# Related links
* [OpenStreetMap Frameworks](https://wiki.openstreetmap.org/wiki/Frameworks)
