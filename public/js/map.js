
mapToken = mapToken
console.log(mapToken)
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: live_coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(live_coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3><b>${listing.title}</b></h3><p>Exact location provided after booking :)</p>`))
    .addTo(map);