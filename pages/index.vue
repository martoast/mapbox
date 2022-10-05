<template>
  <b-container>
    <div class="p-6 mt-2">
        <h1 class="pb-2">Mapbpox testing</h1>
        <b-input v-model="search" class="mb-3" style="postion:absolute;"></b-input>
        <div id="map" style="width: 100%; height: 500px; position: relative; overflow: hidden;">
        </div>
    </div>
  </b-container>
</template>

<script>

export default {
  watch: {
    search: {
        deep: true,
        handler(val) {
            console.log(val)
        },
    } 

  },
  data() {
      return {
          access_token:
              "pk.eyJ1IjoiZWxnZXJhcmRvIiwiYSI6ImNsOG90NjFtMzFucG0zeWw1YWRheTV5ZmYifQ.87BCgCSXpjLIHkqGsWUW7g",
          map: {},
          lng: null,
          lat: null,
          marker: {},
          search: null
      };
  },

  mounted() {
      this.init();
  },

  methods: {
      init() {
          this.lat = 32.715736;
          this.lng =  -117.161087;

          this.createMap();
          this.setMarker(this.lat, this.lng);
      },

      createMap() {
          this.$mapboxgl.accessToken = this.access_token;
          this.map = new this.$mapboxgl.Map({
              container: "map",
              style: "mapbox://styles/mapbox/streets-v11",
              zoom: 11,
              pitch: 45, //inclination
              bearing: -17.6, // rotation
              antialias: true,
              //                center: [coordinates.longitude, coordinates.latitute],
              center: [this.lng, this.lat],
              projection: "globe", // display the map as a 3D globe,
              attributionControl: false,
          });

          


          this.map.on("click", (event) => {
              this.lat = parseFloat(event.lngLat.lat);
              this.lng = parseFloat(event.lngLat.lng);

              this.marker.setLngLat([this.lng, this.lat]);
          });

      },

      setMarker(lat, lng) {
        this.marker = new this.$mapboxgl.Marker({
              color: "#4E04AF",
              draggable: true,
          })
              .setLngLat([lng, lat])
              .addTo(this.map);
      }
  },
};
</script>