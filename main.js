import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Fill, Stroke, Style, Text, Circle} from 'ol/style';
import comunas from './comunas_rm.geojson'; //importar el archivo con los límites de comuna
import pedidos from './pedidos_rm.geojson'; //importar el archivo con los puntos aleatorios de pedidos
import * as turf from '@turf/helpers';
import pointsWithinPolygon from '@turf/points-within-polygon';


//estilo de la capa de pedidos
var pedidosStyle = new Style({
  image: new Circle({
   fill: new Fill({color: 'green'}),
   stroke: new Stroke({color: 'green', width: 1}),
   radius: 2
 }),
});

//estilo de la capa de límite de comunas
var comunasStyle = new Style({
   fill: new Fill({color: 'transparent'}),
   stroke: new Stroke({color: 'black', width: 1})
});

//estilo de la capa de isodistancias de Geoapify
var isodistanciaStyle = new Style({
   fill: new Fill({color: 'transparent'}),
   stroke: new Stroke({color: 'red', width: 1})
});

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: new GeoJSON().readFeatures(comunas, {featureProjection: 'EPSG:3857'})}),
  style: comunasStyle,
  opacity: 0.8
  });

const pointLayer = new VectorLayer({
  source: new VectorSource({
    features: new GeoJSON().readFeatures(pedidos, {featureProjection: 'EPSG:3857'})}),
  style: pedidosStyle,
  });

const pointLayerSource = new VectorSource({
  features: new GeoJSON().readFeatures(pedidos, {featureProjection: 'EPSG:3857'}),
  type: 'FeatureCollection'
});

//importar la capa de isodistancia a través de la API (Key = propia API key obtenida del sitio)
var isodistanciaLayer = new VectorLayer({
    source: new VectorSource({
      url: 'https://api.geoapify.com/v1/isoline?lat=-33.43693230282199&lon=-70.63277476189695&type=distance&mode=drive&range=15000&apiKey=28c42f8c2c414ef680a4379faa52dec7',
      format: new GeoJSON()}),
    style: isodistanciaStyle
    });

const isoLayerSource = new VectorSource({
  url: 'https://api.geoapify.com/v1/isoline?lat=-33.43693230282199&lon=-70.63277476189695&type=distance&mode=drive&range=15000&apiKey=28c42f8c2c414ef680a4379faa52dec7',
  format: new GeoJSON()});


var map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM()
          }), vectorLayer, isodistanciaLayer, pointLayer //agregar las 3 capas al mapa
        ],
        view: new View({
          center: [-7891799,-3969156], //centrar en Santiago
          zoom: 10 //zoom inicial
        })
      });


var ptsWithin = pointsWithinPolygon(pointLayer, isodistanciaLayer);
