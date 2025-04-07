  const baseUri = "https://api.dataforsyningen.dk/sogne";
  let map; // Declare the map variable outside the Vue instance

  Vue.createApp({
    data() {
      return {
        sogneListe: [],
        selectedSogn: "",
        sogn: null,
        error: null,
        bbbox: [null, null, null, null],
      };
    },
    async created() {
      try {
        const response = await axios.get(baseUri);
        this.sogneListe = response.data;
        // Do not set a default selectedSogn
        this.selectedSogn = ""; // Ensure no sogn is selected initially
      } catch (error) {
        this.error = "Fejl ved hentning af sogne.";
        console.error(this.error, error);
      }
    },
    methods: {
      async fetchSogn() {
        if (!this.selectedSogn) {
          this.error = "Vælg et sogn.";
          return;
        }
        const uri = `${baseUri}/${this.selectedSogn}`;
        console.log("Request URI:", uri);
        try {
          const response = await axios.get(uri);
          this.sogn = response.data;
          this.bbbox = response.data.bbox; // Extract and assign bbox to bbbox
          this.error = null;

          // Update the map with the new bbox
          this.updateMap();
        } catch (error) {
          this.sogn = null;
          this.bbbox = null; // Reset bbbox in case of an error
          this.error = "Ingen data fundet for dette sogn.";
          console.error(this.error, error);
        }
      },

      cleanList() {
        this.sogn = null;
        this.selectedSogn = "";
        this.error = null;
        this.bbbox = null; // Reset bbbox when cleaning the list
        if (map) {
          map.remove(); // Remove the map if it exists
          map = null;
        }
      },

      updateMap() {
        if (!this.sogn || !this.sogn.visueltcenter) {
          console.error("Invalid center data:", this.sogn);
          return;
        }
      
        const center = this.sogn.visueltcenter; // Get the center point from the JSON
        const zoomLevel = 13; // Adjust zoom level as needed
      
        if (!map) {
          // Initialize the map if it doesn't exist
          map = L.map("map").setView([center[1], center[0]], zoomLevel); // Set center and zoom level
      
          // Add a tile layer (e.g., OpenStreetMap)
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
        } else {
          // Just set the view if the bounds are not available
          map.setView([center[1], center[0]], zoomLevel); // Update the center point
        }
      },
      


      resetMapView() {
        if (map) {
          map.setView([56.2639, 9.5018], 5); // Reset to a default view (Denmark center)
        }
      },
      
    },
  }).mount("#app");