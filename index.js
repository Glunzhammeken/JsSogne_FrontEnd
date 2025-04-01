const baseUri = "https://api.dataforsyningen.dk/sogne";

Vue.createApp({
  data() {
    return {
      sogneListe: [],
      selectedSogn: "",
      sogn: null,
      error: null,
    };
  },
  async created() {
    try {
      const response = await axios.get(baseUri);
      this.sogneListe = response.data;
      if (this.sogneListe.length > 0) {
        this.selectedSogn = this.sogneListe[0].kode;
        this.fetchSogn();
      }
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
        this.error = null;
      } catch (error) {
        this.sogn = null;
        this.error = "Ingen data fundet for dette sogn.";
        console.error(this.error, error);
      }
    },
    cleanList() {
      this.sogn = null;
      this.selectedSogn = "";
      this.error = null;
    }
  },
}).mount("#app");