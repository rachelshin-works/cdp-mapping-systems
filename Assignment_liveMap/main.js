var map = new maplibregl.Map({
  container: "map", // container id
  style: "style.json", // style URL for basemap
  center: [-73.97144, 40.70491], // starting position [lng, lat]
  zoom: 6, // starting zoom
});

map.addControl(new maplibregl.NavigationControl());

//https://maps.geo.eu-west-1.amazonaws.com/v2/tiles/vector.basemap/{z}/{x}/{y}?key=v1.public.eyJqdGkiOiJiOTNkYjBlZi04OWUzLTQxMGUtODFhMC0zYjZjZjVmZWZmMDgifYtukap0NBaJpcrS6Vit9j03GJgK9Bn-RSu5UCe3jkdSql2kKp3IEgLPtyLssbmKUdVO11sXddjK3ZOZy8V6QG0olv0K_1tOxyMIe4DAO3IV6H4VzHWiaXlbSakGiEgFLuHBdcfLDeMotye7N6rSRxuZb0CN9ytH9VjLly6-NEBRZezO_qPQyvdTFdeZsARIpL0f9YVpxPxPVvUcAWYCk5LpaPseRCDPrY5SlCdA1ZKqUA4F9RzxSTxB73Fel_SoNDkCNaux1VposBu791-uUpDzUpr7leKckrPXrpZ2hwnFbafVxFV9vq4fLTpB5KoBksuLfGNIwAx1RLLxWuMhE4c.ZGQzZDY2OGQtMWQxMy00ZTEwLWIyZGUtOGVjYzUzMjU3OGE4

map.on("load", () => {
  fetch("https://data.cityofnewyork.us/resource/43nn-pn8j.geojson?$limit=50000")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.features.forEach((feature) => {
        feature.geometry = {
          type: "Point",
          coordinates: [feature.properties.longitude, feature.properties.latitude],
        };
      });
      map.addSource("restaurants", {
        type: "geojson",
        data: data,
      });

      map.addLayer({
        id: "restaurants-layer",
        type: "circle",
        source: "restaurants",
        paint: {
          "circle-radius": 4,
          "circle-color": ["match", ["get", "cuisine_description"], "Pizza", "#F54927", "#000000"],
          // "circle-stroke-width": 1,
          // "circle-stroke-color": "#27D3F5",
        },
      });

      map.on("click", "restaurants-layer", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.dba;
        const score = e.features[0].properties.score;

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<strong>${description}</strong>`)
          .addTo(map);
      });
    });
});
