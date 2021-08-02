mapboxgl.accessToken = mapBoxToken;
var map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: park.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

//drops the pin in the map
var marker = new mapboxgl.Marker()
  .setLngLat(park.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${park.title}</h4>`)
  )
  .addTo(map);
