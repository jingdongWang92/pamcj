const cartogramCollection = require('./xbk_demo.json');


const ratio = 125;

const _cartogramCollection = Object.assign({}, cartogramCollection, {
  floors: cartogramCollection.floors.map(floor => Object.assign({}, floor, {
    length: toInt(floor.length * ratio),
    width: toInt(floor.width * ratio),
    height: toInt(floor.height * ratio),
    scale: Number.parseFloat((1 / ratio).toFixed(3)),
    layers: floor.layers.map(layer => Object.assign({}, layer, {
      features: layer.features.map(feature => Object.assign({}, feature, {
        x: toInt(feature.x * ratio),
        y: toInt(feature.y * ratio),
        coords: feature.geoType === 'Point' ? scaleCoord(ratio)(feature.coords) : feature.coords.map(scaleCoord(ratio)),
      })),
    })),
  })),
});


function scaleCoord(scale) {
  return coord => coord.map(n => toInt(n * scale));
}


function toInt(n) {
  return Number.parseInt(n, 10);
}


(function () {
  console.log(JSON.stringify(_cartogramCollection, null, 2));
}());
