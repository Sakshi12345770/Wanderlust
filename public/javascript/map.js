console.log("MAPBOX:", typeof mapboxgl);
console.log("TOKEN:", mapToken);
console.log("COORDINATES:", coordinates);

if (!mapToken) {
  console.error("MAP_TOKEN is missing!");
}

if (!coordinates || coordinates.length !== 2) {
  console.error("Invalid coordinates:", coordinates);
} else {
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
  });

  new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .addTo(map);
}