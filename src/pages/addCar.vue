<template>
  <v-app>
    <particles-bg
      type="lines"
      :canvas="{ backgroundColor: '#000' }"
      :bg="true"
      :num="100"
      :config="{
        line_linked: {
          enable: true,
          distance: 20,
          width: 0.1,
        },
        move: {
          speed: 0,
        },
      }"
      :style="{ zIndex: 0 }"
    />
    <v-container class="container">
      <v-hover v-slot="{ hover }" open-delay="200">
        <v-card
          dark
          class="grid"
          width="85%"
          height="fit-content"
          shaped
          :class="{ 'on-hover': hover }"
          :elevation="hover ? 12 : 8"
        >
          <v-form ref="form" v-model="valid" :lazy-validation="lazy">
            <v-card class="grid2" width="95%" shaped>
              <v-select
                v-model="category"
                :items="categories"
                :rules="[(v) => !!v || 'Category is required']"
                label="Car Category"
                required
                solo
                outlined
                chips
                dense
              ></v-select>
              <v-select
                v-model="make"
                :items="makes"
                :rules="[(v) => !!v || 'Make is required']"
                label="Car Make"
                required
                small-chips
                outlined
                solo
                dense
                @change="loadModels"
              ></v-select>

              <v-select
                v-model="model"
                :items="models"
                :rules="[(v) => !!v || 'Model is required']"
                label="Car Model"
                required
                small-chips
                outlined
                solo
                dense
              ></v-select>

              <v-select
                v-model="year"
                :items="years"
                :rules="[(v) => !!v || 'Manufactured year is required']"
                label="Car Manufactured Year"
                required
                small-chips
                outlined
                solo
                dense
              ></v-select>

              <v-text-field
                v-model="color"
                :rules="globalRules"
                label="Car Color"
                required
                solo
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="plateNumber"
                :rules="globalRules"
                label="Car Number Plate"
                required
                solo
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="pricePerDay"
                :rules="globalRules"
                label="Price Per Day (RM)"
                required
                solo
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="pricePer3days"
                :rules="globalRules"
                label="Price Per 3 Days (RM)"
                required
                solo
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="pricePerWeek"
                :rules="globalRules"
                label="Price Per Week (RM)"
                required
                solo
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="desc"
                label="Description"
                solo
                outlined
                dense
              ></v-text-field>

              <v-col :cols="12" md="4">
                <v-card-text class="text">Upload car images</v-card-text>
                <v-file-input
                  prepend-icon="mdi-image-outline"
                  accept="image/*"
                  @change="uploadImage"
              /></v-col>
              <div v-if="imageUrl">
                <v-row>
                  <v-col v-for="url in imageUrl" :key="url.id">
                    <v-card class="grid3" width="300px" height="300px">
                      <v-btn
                        class="rounded-btn"
                        color="primary"
                        @click="removeUrl(url)"
                      >
                        x
                      </v-btn>

                      <v-img
                        :src="url.url"
                        max-height="250px"
                        max-width="250px"
                      >
                      </v-img
                    ></v-card>
                  </v-col>
                </v-row>
              </div>

              <v-row class="justify-center align-center" no-gutters>
                <v-btn :disabled="!valid" dark class="button" @click="validate">
                  Validate
                </v-btn>

                <v-btn class="button" @click="reset" dark> Reset </v-btn>
              </v-row>
            </v-card>
          </v-form>
        </v-card>
      </v-hover>
    </v-container>
  </v-app>
</template>

<script>
import DataService from "../services/dataService.js";
const dataService = new DataService();

export default {
  data() {
    return {
      valid: true,
      globalRules: [(v) => !!v || "Field is required"],
      categories: [
        "SuperCar",
        "2 Door Sports Coupe",
        "Luxury Sedan",
        "Local",
        "4WD Drive Vehicles",
        "MPV & Van",
        "SUV",
      ],
      list: [],
      category: {},
      makes: [],
      make: "",
      models: [],
      model: "",
      years: [],
      year: "",
      pricePerDay: "",
      pricePer3days: "",
      pricePerWeek: "",
      plateNumber: "",
      color: "",
      desc: "",
      imageUrl: [],
      lazy: false,
    };
  },

  mounted() {
    this.getCarData();
  },

  created() {
    this.generateYears();
  },

  methods: {
    trackButtonClick(a) {
      console.log(a);
      this.$gtag.event("Button_clicks", {
        event_category: a,
        event_label: "User clicked on icon",
      });
    },
    async getCarData() {
      if (this.$store.state.user.roles[0] == "admin") {
        this.$setLoader();
        await dataService.getCarData().then((res) => {
          this.list = res.data.getCarData;
          this.getMakes();
        });

        this.$disableLoader();
      } else {
        alert("USER NOT AUTHORIZED TO VIEW THIS PAGE");
        this.$router.push({ path: `/car-rental-seremban` });
      }
    },

    async validate() {
      if (this.$refs.form.validate()) {
        this.$setLoader();
        let car = {
          category: this.category,
          make: this.make,
          model: this.model,
          year: this.year,
          pricePerDay: this.pricePerDay,
          pricePer3days: this.pricePer3days,
          pricePerWeek: this.pricePerWeek,
          plateNumber: this.plateNumber,
          color: this.color,
          desc: this.desc,
          imageUrl: this.imageUrl,
        };
        await dataService.addCar(car).then((res) => {
          console.log(res);
          window.location.reload();
        });

        this.$disableLoader();
      }
    },

    removeUrl(url) {
      const index = this.imageUrl.findIndex((item) => item.id === url.id);
      if (index !== -1) {
        this.imageUrl.splice(index, 1);
      }
    },

    generateYears() {
      const currentYear = new Date().getFullYear();
      for (let i = currentYear; i > currentYear - 10; i--) {
        this.years.push(i);
      }
    },

    reset() {
      this.$refs.form.reset();
    },

    getMakes() {
      this.$setLoader();
      for (let m of this.list) {
        this.makes.push(m.make);
      }
      this.$disableLoader();
    },

    loadModels() {
      this.$setLoader();
      this.models = [];

      for (let m of this.list) {
        if (m.make == this.make) {
          // this.models.push(m.models);
          for (let c of m.models) {
            this.models.push(c);
          }
        }
      }
      this.$disableLoader();
    },
    // async getProduct() {
    //   this.$setLoader();
    //   await dataService
    //     .getProduct({ _id: this.$route.params.cardId })
    //     .then((res) => {
    //       this.product = res.data.product[0];
    //     });

    //   this.$disableLoader();
    // },

    cancelUpload() {
      if (confirm("Cancel Upload?")) {
        this.showUpload = false;
        this.preview = null;
      }
    },

    uploadImage(file) {
      if (file) {
        let maxId = 0;
        this.$setLoader();
        for (let image of this.imageUrl) {
          if (image.id > maxId) {
            maxId = image.id;
          }
        }
        let newId = maxId + 1; // Increment the maximum id for the new image
        file.resource_type = "image";
        file.url = process.env.VUE_APP_CLOUDINARY_URL_IMAGE;
        this.uploadFileToCloudinary(file).then((fileResponse) => {
          // Build the Cloudinary URL with transformation parameters
          const url = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,f_auto,q_auto/${fileResponse.public_id}.${fileResponse.format}`;

          this.imageUrl.push({ url: url, id: newId });
          this.$disableLoader();
        });
      }
    },

    uploadFileToCloudinary(file) {
      return new Promise(function (resolve, reject) {
        let formData = new FormData();
        formData.append(
          "upload_preset",
          process.env.VUE_APP_CLOUDINARY_PRESET1
        );
        formData.append("resource_type", file.resource_type);
        formData.append("file", file);
        let request = new XMLHttpRequest();
        request.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}/upload`,
          true
        );
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        request.onreadystatechange = () => {
          if (request.readyState === 4 && request.status === 200) {
            let response = JSON.parse(request.responseText);
            resolve(response);
          }
          if (request.status !== 200) {
            let response = JSON.parse(request.responseText);
            let error = response.error.message;
            this.errorText = "error uploading files " + error;
            this.isError = true;
            reject(error);
          }
        };
        request.onerror = (err) => {
          alert("error: " + err);
          reject(err);
        };
        request.send(formData);
      });
    },
  },
};
</script>

<style scoped lang="css">
.container {
  /* margin-top: 5%; */
  max-width: none !important;
}
.logo {
  height: 50%;
  width: 50%;
  margin-bottom: 15px;
  background-color: #fffafa00;
  box-shadow: none;
}

.company-link {
  color: #000 !important;
  text-decoration: none;
}

.v-sheet.v-card.v-sheet--shaped {
  border-radius: 24px 4px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
}

.button {
  margin-top: 2% !important;
  /* /* margin-right: auto !important; */
  margin-left: 1% !important;
  /* place-items: center; */
}

.button2 {
  margin-top: 1% !important;
  margin-bottom: 1% !important;
  margin-right: auto !important;
  margin-left: auto !important;
  place-items: center;
  height: 50%;
}

.grid {
  margin-top: 2% !important;
  margin-right: auto !important;
  margin-left: auto !important;
  width: 95%;
  place-items: center;
  padding-top: 20px !important;
  padding-bottom: 20px !important;
}

.grid2 {
  margin-right: auto !important;
  margin-left: auto !important;
  place-items: center;
  padding: 20px;
}
.grid3 {
  margin-right: auto !important;
  margin-left: auto !important;
  place-items: center;
  display: grid !important;
}

.text {
  color: #ffffff !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
.v-btn > .v-btn__content .v-icon {
  color: #f8f8f8;
  margin-right: 5px;
}

.v-application .elevation-8 {
  box-shadow: 0px 5px 5px -3px rgba(240, 7, 7, 0.2),
    0px 8px 10px 1px rgba(240, 7, 7, 0.2), 0px 3px 14px 2px rgba(240, 7, 7, 0.2) !important;
}

.v-application .elevation-12 {
  box-shadow: 0px 5px 5px -3px #000, 0px 8px 10px 1px #000,
    0px 3px 14px 2px #000 !important;
}
</style>
