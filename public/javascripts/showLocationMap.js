mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: location2.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});


new mapboxgl.Marker()
    .setLngLat(location2.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
          .setHTML(
              `<h3>${location2.name}</h3><p>${location2.street}</p>`
          )
    )
    .addTo(map)

