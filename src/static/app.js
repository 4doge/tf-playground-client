const app = new Vue({
  el: "#app",
  data: {
    imgToPredict: null,
    imgToPredictName: null,
    imgToPredictPreview: null,
    loading: true,
    model: null,
    predictions: [],
    webcam: null,
    classesCount: 0,
  },
  async mounted() {
    this.model = await tmImage.load("model/model.json", "model/metadata.json");
    this.webcam = new tmImage.Webcam(224, 224, true);
    this.classesCount = this.model.getTotalClasses(),
    this.loading = false;
  },
  methods: {
    async predict() {
      if (this.imgToPredict) {
        let prediction = await this.model.predict(this.$refs.preview);
        this.showPredictions(prediction);
      }
    },
    handleImage(e) {
      if (e.target.files && e.target.files[0]) {
        this.imgToPredict = e.target.files[0];
        this.imgToPredictName = this.imgToPredict.name;
        const reader = new FileReader();
        reader.onload = e => {
          this.imgToPredictPreview = e.target.result;
        };
        reader.readAsDataURL(this.imgToPredict);
      }
    },
    async enableCamera() {
      await this.webcam.setup().then(msg => alert(JSON.stringify(msg))).catch(msg => alert(JSON.stringify(msg)));
      this.webcam.play();
      window.requestAnimationFrame(this.loop);
      document
        .getElementById("webcam-container")
        .appendChild(this.webcam.canvas);

    },
    async loop() {
      this.webcam.update();
      await this.predictFromCamera();
      window.requestAnimationFrame(this.loop);
    },
    async predictFromCamera() {
      const prediction = await this.model.predict(this.webcam.canvas);
      this.showPredictions(prediction);

    },
    showPredictions(prediction) {
      this.predictions = [];
      for (let i = 0; i < this.classesCount; i++) {
        this.predictions.push({
          className: prediction[i].className,
          probability: prediction[i].probability.toFixed(5)
        });
      }
    }
  }
});
