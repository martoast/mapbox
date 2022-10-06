<template>
    <b-container>
       <div class="p-6 mt-2">
          <h1 class="pb-2">Mapbox testing</h1>
          <b-form
             id="event-type-form"
             autocomplete="off"
             @submit.prevent="onSubmit"
             >
             <b-form-group
                label="Address"
                label-for="address"
                label-class="font-size-14"
                >
                <b-form-input autocomplete="shipping address-line1" placeholder="Enter address..." v-model="form.address" class="mb-3" style="postion:absolute;"></b-form-input>
             </b-form-group>
          </b-form>
          <pre>{{filtered_feature}}</pre>
          <div id="map" style="width: 100%; height: 500px; position: relative; overflow: hidden;">
          </div>
       </div>
    </b-container>
 </template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
      return {
          access_token:
              "pk.eyJ1IjoiZWxnZXJhcmRvIiwiYSI6ImNsOG90NjFtMzFucG0zeWw1YWRheTV5ZmYifQ.87BCgCSXpjLIHkqGsWUW7g",
          map: {},
          coordinates: {
            lng: null,
            lat: null,
          },

          polygon_coordinates: [
        [
        [-67.13734, 45.13745],
        [-66.96466, 44.8097],
        [-68.03252, 44.3252],
        [-69.06, 43.98],
        [-70.11617, 43.68405],
        [-70.64573, 43.09008],
        [-70.75102, 43.08003],
        [-70.79761, 43.21973],
        [-70.98176, 43.36789],
        [-70.94416, 43.46633],
        [-71.08482, 45.30524],
        [-70.66002, 45.46022],
        [-70.30495, 45.91479],
        [-70.00014, 46.69317],
        [-69.23708, 47.44777],
        [-68.90478, 47.18479],
        [-68.2343, 47.35462],
        [-67.79035, 47.06624],
        [-67.79141, 45.70258],
        [-67.13734, 45.13745]
        ]
        ],
          
          marker: null,
          form: {
            address: null,
          },
          search: null
      };
  },

  mounted() {
      this.init();
  },

  computed: {
        ...mapGetters({
            items: "geocode/items"
        }),

        filtered_feature() {
            if (!this.items.features.length) {
                return;

            }
            else {
                this.form.address = this.items.features[0].place_name;
            }
            

        }
    },

  methods: {
      init() {
          this.coordinates.lat = 32.715736;
          this.coordinates.lng =  -117.161087;

          this.search = this.$search.autofill({
                accessToken: this.access_token,
                options: { country: "us" },
            });

          this.createMap();
          this.setMarker(this.coordinates.lat, this.coordinates.lng);
          this.mapboxTriggers();
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

              center: [this.coordinates.lng, this.coordinates.lat],
              projection: "globe", // display the map as a 3D globe,
              attributionControl: false,
          });

          this.map.on('load', () => {
            this.drawPolygon()
          })

          
      },

      mapboxTriggers() {
          this.search.addEventListener("retrieve", (event) => {
                this.coordinates.lat =
                    event.detail.features[0].geometry.coordinates[1];
                this.coordinates.lng =
                    event.detail.features[0].geometry.coordinates[0];
                this.map.easeTo({
                        center: event.detail.features[0].geometry.coordinates,
                        zoom: 15,
                        speed: 3,
                        duration: 2500,
                        curve: 2,
                        });
                if (this.marker) {
                    this.onMoveMarker(this.coordinates.lat, this.coordinates.lng )
                }
                else {
                    this.setMarker(this.coordinates.lat, this.coordinates.lng )
                }
                
            });

            this.marker.on("dragend", (event) => {
                this.coordinates.lat = this.marker.getLngLat().lat;
                this.coordinates.lng = this.marker.getLngLat().lng;
                this.map.easeTo({
                        center: [this.marker.getLngLat().lng, this.marker.getLngLat().lat],
                        zoom: 15,
                        speed: 3,
                        duration: 2500,
                        curve: 2,
                        });
                this.onMoveMarker(this.coordinates.lat, this.coordinates.lng );
                this.$store.dispatch("geocode/reverse_geocode", this.coordinates)
            })


      },

      drawPolygon() {
       this.map.addSource('maine', {
        'type': 'geojson',
        'data': {
        'type': 'Feature',
        'geometry': {
        'type': 'Polygon',
        // These coordinates outline Maine.
        'coordinates': this.polygon_coordinates
        }}
       });

       // Add a new layer to visualize the polygon.
        this.map.addLayer({
        'id': 'maine',
        'type': 'fill',
        'source': 'maine', // reference the data source
        'layout': {},
        'paint': {
        'fill-color': '#0080ff', // blue color fill
        'fill-opacity': 0.5
        }
        });

       this.map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'maine',
        'layout': {},
        'paint': {
        'line-color': '#000',
        'line-width': 3
        }
        });

    

      },

      onMoveMarker(lat, lng) {
        this.marker.setLngLat([lng, lat]);
      },

      setMarker(lat, lng) {
        this.marker = new this.$mapboxgl.Marker({
              color: "#4E04AF",
              draggable: true,
          })
              .setLngLat([lng, lat])
              .addTo(this.map);
      },
  },
};
</script>