// This array contains the coordinates for all bus stops between MIT and Harvard
const busStops = [
  [-71.093729, 42.359244],
  [-71.094915, 42.360175],
  [-71.0958, 42.360698],
  [-71.099558, 42.362953],
  [-71.103476, 42.365248],
  [-71.106067, 42.366806],
  [-71.108717, 42.368355],
  [-71.110799, 42.369192],
  [-71.113095, 42.370218],
  [-71.115476, 42.372085],
  [-71.117585, 42.373016],
  [-71.118625, 42.374863],
];

// This is your own access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lhbmtibyIsImEiOiJjbDNheDZ5YXgwMHQ0M2Jxcmdyb3g3cG1xIn0._rR9fzIDNgelUOBNRxAhvg';

// This is the map instance
let map = new mapboxgl.Map({
  container: 'map',
  /* Styles: https://docs.mapbox.com/api/maps/styles/#mapbox-styles */
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-71.104081, 42.365554],
  zoom: 13.5,
});

// Adds a marker to the map at the first coordinates in the bus stop array.
var marker = new mapboxgl.Marker({color: 'red'})
  .setLngLat([-71.093729, 42.359244])
  .addTo(map);

// Counter here represents the index of the current bus stop
let counter = 0;
function move() {
    // Move the marker on the map every 1000 ms using marker.setLngLat() to update the marker's coordinates.
    setTimeout(() => {
    if (counter >= busStops.length) return;
    marker.setLngLat(busStops[counter]);
    counter++;
    move();
  }, 1000);
}

/* <<<<>>>> Pulsing Dot <<<<>>>> */
/* https://docs.mapbox.com/mapbox-gl-js/example/add-image-animated/ */

const size = 200;
 
// This implements `StyleImageInterface`
// to draw a pulsing dot icon on the map.
var pulsingDot = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),
 
  // When the layer is added to the map,
  // get the rendering context for the map canvas.
  onAdd: function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d');
  },
 
  // Call once before every frame where the icon will be used.
  render: function () {
    const duration = 1000;
    const t = (performance.now() % duration) / duration;
 
    const radius = (size / 2) * 0.3;
    const outerRadius = (size / 2) * 0.7 * t + radius;
    const context = this.context;
 
    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
      this.width / 2,
      this.height / 2,
      outerRadius,
      0,
      Math.PI * 2
    );
    context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
    context.fill();
 
    // Draw the inner circle.
    context.beginPath();
    context.arc(
      this.width / 2,
      this.height / 2,
      radius,
      0,
      Math.PI * 2
    );
    context.fillStyle = 'rgba(255, 100, 100, 1)';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();
 
    // Update this image's data with data from the canvas.
    this.data = context.getImageData(
      0,
      0,
      this.width,
      this.height
    ).data;
 
    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();
 
    // Return `true` to let the map know that the image was updated.
    return true;
  }
};
 
map.on('load', () => {
  map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
 
  map.addSource('dot-point', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [-71.118625, 42.374863] // icon position [lng, lat]
          }
        }
      ]
    }
});
map.addLayer({
    'id': 'layer-with-pulsing-dot',
    'type': 'symbol',
    'source': 'dot-point',
    'layout': {
      'icon-image': 'pulsing-dot'
    }
  });
});
