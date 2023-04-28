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
          width="80%"
          class="grid"
          shaped
          :class="{ 'on-hover': hover }"
          :elevation="hover ? 12 : 16"
        >
          <v-form v-model="valid">
            <v-row>
              <v-col cols="12" md="4">
                <v-card-text class="text">Full Name</v-card-text>
                <v-text-field
                  dark
                  v-model="user.name"
                  :rules="nameRules"
                  :counter="20"
                  label="Full Name"
                  required
                  class="text"
                  dense
                  solo
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-card-text class="text">Email Address</v-card-text>
                <v-text-field
                  dark
                  v-model="user.email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                  dense
                  solo
                  class="text"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col :cols="12" md="4">
                <v-card-text class="text"
                  >Identification / Passport Number</v-card-text
                >
                <v-text-field
                  dark
                  v-model="user.primaryIdentificationNum"
                  label="IC / Passport Number"
                  required
                  dense
                  class="text"
                  solo
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="12" md="6">
                <v-card-text class="text">Address</v-card-text>
                <v-text-field
                  dark
                  v-model="user.address"
                  label="Address"
                  required
                  dense
                  class="text"
                  solo
                ></v-text-field>
              </v-col>

              <v-col :cols="12" md="6">
                <v-card-text class="text">Mobile Number</v-card-text>
                <vue-phone-number-input
                  v-model="user.mobileNumber"
                  required
                  dense
                  solo
                  dark
                  default-country-code="MY"
                  @update="results = $event"
                  :success="results?.isValid"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="12" md="4">
                <v-card-text class="text"
                  >Upload your utility bill (eg : TNB)</v-card-text
                >
                <v-file-input
                  :rules="[rules.required]"
                  dark
                  prepend-icon="mdi-image-outline"
                  accept="image/*"
                  @change="utilityImage" />
                <div v-if="user.utilityImageUrl">
                  <v-card class="grid3" width="250px" height="300px">
                    <v-row
                      justify="center"
                      align="center"
                      style="height: 61px !important"
                    >
                      <v-btn
                        class="rounded-btn"
                        dark
                        @click="removeUrl('utility')"
                      >
                        x
                      </v-btn>
                    </v-row>
                    
                      <v-img
                        :src="user.utilityImageUrl"
                        max-height="240px"
                        max-width="240px"
                        contain
                      >
                      </v-img>
                  </v-card></div
              ></v-col>
              <v-col :cols="12" md="4">
                <v-card-text class="text"
                  >Uploaded Primary Document</v-card-text
                >
                <v-file-input
                  dark
                  prepend-icon="mdi-image-outline"
                  accept="image/*"
                  @change="primaryImage" />

                <div v-if="user.primaryIdentificationUrl">
                  <v-card class="grid3" width="250px" height="300px">
                    <v-row
                      justify="center"
                      align="center"
                      style="height: 61px !important"
                    >
                      <v-btn
                        class="rounded-btn"
                        dark
                        @click="removeUrl('primary')"
                      >
                        x
                      </v-btn>
                    </v-row>
                    <v-img
                      :src="user.primaryIdentificationUrl"
                      max-height="240px"
                      max-width="240px"
                      contain
                    >
                    </v-img
                  ></v-card></div
              ></v-col>
              <v-col :cols="12" md="4">
                <v-card-text class="text"
                  >Uploaded Secondary Document</v-card-text
                >
                <v-file-input
                  dark
                  prepend-icon="mdi-image-outline"
                  accept="image/*"
                  @change="secondaryImage" />
                <div v-if="user.secondaryIdentificationUrl">
                  <v-card class="grid3" width="250px" height="300px" dark>
                    <v-row
                      justify="center"
                      align="center"
                      style="height: 61px !important"
                    >
                      <v-btn
                        class="rounded-btn"
                        dark
                        @click="removeUrl('secondary')"
                      >
                        x
                      </v-btn>
                    </v-row>
                    <v-img
                      :src="user.secondaryIdentificationUrl"
                      max-height="240px"
                      max-width="240px"
                      contain
                    >
                    </v-img
                  ></v-card></div
              ></v-col>
            </v-row>
            <v-row class="justify-center align-center" no-gutters style="margin-top: 2% !important;">
              <v-btn class="button" dark @click="changePassword = true">
                <v-icon color="#fff">
                  mdi-lock-reset mdi-18px
                </v-icon>
                Change Password?
              </v-btn>
            </v-row>
            <v-row v-if="changePassword">
              <v-col :cols="12" md="4">
                <v-card-text class="text">Current Password</v-card-text>
                <v-text-field
                  dark
                  v-model="password.currentPassword"
                  required
                  dense
                  class="text"
                  solo
                  :append-icon="value ? 'visibility' : 'visibility_off'"
                  @click:append="() => (value = !value)"
                  :type="value ? 'password' : 'text'"
                ></v-text-field>
              </v-col>
              <v-col :cols="12" md="4">
                <v-card-text class="text">New Password</v-card-text>
                <v-text-field
                  dark
                  v-model="password.newPassword"
                  required
                  dense
                  class="text"
                  solo
                  :append-icon="value2 ? 'visibility' : 'visibility_off'"
                  @click:append="() => (value2 = !value2)"
                  :type="value2 ? 'password' : 'text'"
                ></v-text-field>
              </v-col>
              <v-col :cols="12" md="4">
                <v-card-text class="text">Confirm New Password</v-card-text>
                <v-text-field
                  dark
                  v-model="password.confirmNewPassword"
                  required
                  dense
                  class="text"
                  solo
                  :append-icon="value2 ? 'visibility' : 'visibility_off'"
                  @click:append="() => (value2 = !value2)"
                  :type="value2 ? 'password' : 'text'"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="justify-center align-center" no-gutters>
              <v-btn class="button" dark @click="update()">
                <v-icon color="#fff">
                  mdi-account-plus-outline mdi-18px
                </v-icon>
                Update
              </v-btn>
            </v-row>
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
      user: this.$store.state.userProfile,
      password: {},
      changePassword: false,
      isValid: false,
      // user: {
      //   mobileNumber: "",
      //   email: "",
      //   password: "",
      //   name: "",
      //   address: "",
      //   primaryIdentificationNum: "",
      // },
      results: [],
      nameRules: [
        (value) => {
          if (value) return true;

          return "Name is requred.";
        },
        (value) => {
          if (value?.length <= 20) return true;

          return "Name must be less than 20 characters.";
        },
      ],
      value: String,
      value2: String,
      valid: true,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => (v && v.length >= 8) || "Min 8 characters",
      },
      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      errorMessage: false,
    };
  },
  mounted: function () {},

  computed: {},

  methods: {
    async update() {
      try {
        delete this.user.password;
        this.$setLoader();
        this.user.countryCode = this.results.countryCode;
        this.user.mobileNumber = this.results.formattedNumber;
        this.user.userId = this.user._id;
        await dataService
          .update({ user: this.user, password: this.password, admin: false })
          .then(() => {
            window.location.reload();
          });
        this.$disableLoader();
      } catch (error) {
        // alert("Error 1000 - Page does not exists!")
      }
      //   this.$router.push({ path: `/register` });
    },

    removeUrl(name) {
      if (name == "utility") {
        this.user.utilityImageUrl = null;
      }
      if (name == "primary") {
        this.user.primaryIdentificationUrl = null;
      }
      if (name == "secondary") {
        this.user.secondaryIdentificationUrl = null;
      }
    },

    utilityImage(file) {
      if (file) {
        this.$setLoader();
        file.resource_type = "image";
        file.url = process.env.VUE_APP_CLOUDINARY_URL_IMAGE;
        this.uploadFileToCloudinary(file).then((fileResponse) => {
          // Build the Cloudinary URL with transformation parameters
          this.user.utilityImageUrl = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,f_auto,q_auto/${fileResponse.public_id}.${fileResponse.format}`;

          this.$disableLoader();
        });
      }
    },

    primaryImage(file) {
      if (file) {
        this.$setLoader();
        file.resource_type = "image";
        file.url = process.env.VUE_APP_CLOUDINARY_URL_IMAGE;
        this.uploadFileToCloudinary(file).then((fileResponse) => {
          this.user.primaryIdentificationUrl = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,f_auto,q_auto/${fileResponse.public_id}.${fileResponse.format}`;
          this.user.isActive = false;
          //   this.product.productImageUrl = this.preview;
          this.$disableLoader();
        });
      }
    },

    secondaryImage(file) {
      if (file) {
        this.$setLoader();
        file.resource_type = "image";
        file.url = process.env.VUE_APP_CLOUDINARY_URL_IMAGE;
        this.uploadFileToCloudinary(file).then((fileResponse) => {
          this.user.secondaryIdentificationUrl = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,f_auto,q_auto/${fileResponse.public_id}.${fileResponse.format}`;
          this.user.isActive = false;
          //   this.product.productImageUrl = this.preview;
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

.button {
  margin-bottom: 2% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
.logo {
  height: 50%;
  width: 50%;
  margin-bottom: 15px;
  background-color: #fffafa00;
  box-shadow: none;
}

.company-link {
  color: #80ff00;
  text-decoration: none;
}

.v-sheet.v-card.v-sheet--shaped {
  border-radius: 24px 4px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
}

.grid {
  margin-top: 2% !important;
  margin-right: auto !important;
  margin-left: auto !important;
  place-items: center;
  background-color: #00c3ff14 !important;
  margin-bottom: 2% !important;
}

.grid3 {
  margin-right: auto !important;
  margin-left: auto !important;
  place-items: center;
  display: grid !important;
  background-color: #00c3ff14 !important;
  margin-bottom: 2% !important;
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
