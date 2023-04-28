<template>
  <v-app id="register">
    <v-container class="container">
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
      <v-hover v-slot="{ hover }" open-delay="200">
        <v-card
          class="grid"
          max-width="80%"
          height="fit-content"
          shaped
          :class="{ 'on-hover': hover }"
          :elevation="hover ? 12 : 8"
        >
          <v-btn dark @click="$router.push({ path: '/car-rental-seremban' })"
            ><v-icon class="icn1"> mdi-home-circle-outline mdi-18px </v-icon
            >Home</v-btn
          >
          <v-card-text class="d-flex flex-column align-center align-top footer">
            <v-row align="center">
              <v-col>
                <img
                  :src="require('@/assets/images/logo.png')"
                  height="250"
                  alt="Preloaded image2"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-container fluid fill-height v-if="showPhone">
            <v-row>
              <v-col md="6" cols="12">
                <v-card-text class="text">Mobile Number</v-card-text>
                <vue-phone-number-input
                  v-model="user.mobileNumber"
                  :rules="[rules.required]"
                  required
                  dense
                  solo
                  dark
                  default-country-code="MY"
                  @update="results = $event"
                  :success="results?.isValid"
                  style="height: 38px !important; margin-bottom: 5% !important"
                />
                <v-row
                  justify="center"
                  align="center"
                  style="height: 61px !important"
                >
                  <v-btn
                    dark
                    class="btn"
                    @click="sendVerificationCode"
                    :disabled="!user.mobileNumber"
                    ><v-icon class="icn1" style="color: #80ff00 !important"
                      >mdi-send-circle-outline</v-icon
                    >Send OTP
                  </v-btn></v-row
                >
              </v-col>
              <v-col cols="12" md="6" v-if="showInputOTP">
                <v-card-text class="text">Enter OTP Sent on Whatsapp</v-card-text>
                <v-text-field
                  dark
                  v-model="otp"
                  :rules="[rules.required]"
                  required
                  class="text"
                  dense
                  solo
                  style="height: 38px !important; margin-bottom: 5% !important"
                />
                <v-row
                  justify="center"
                  align="center"
                  style="height: 61px !important"
                >
                  <v-btn dark @click="verifyVerificationCode"><v-icon class="icn1" style="color: #80ff00 !important"
                      >mdi-send-check-outline</v-icon
                    >Submit</v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
          <v-form ref="form" @submit.prevent="register" v-if="registerForm">
            <v-card-text class="d-flex align-center justify-center about"
              >Register your account</v-card-text
            >

            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    dark
                    v-model="user.name"
                    :rules="[rules.required]"
                    label="Full Name"
                    required
                    class="text"
                    dense
                    solo
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    dark
                    v-model="user.email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                    dense
                    solo
                    class="text"
                  ></v-text-field>
                </v-col>

                <v-col :cols="12" md="4">
                  <v-text-field
                    dark
                    class="text"
                    prepend-icon="mdi-lock-outline"
                    color="#fff"
                    v-model="user.password"
                    :rules="[rules.required]"
                    dense
                    solo
                    data-vv-name="password"
                    :append-icon="value ? 'visibility' : 'visibility_off'"
                    @click:append="() => (value = !value)"
                    :type="value ? 'password' : 'text'"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col :cols="12" md="4">
                  <v-text-field
                    dark
                    v-model="user.address"
                    label="Address"
                    :rules="[rules.required]"
                    required
                    dense
                    class="text"
                    solo
                  ></v-text-field>
                </v-col>

                <v-col :cols="12" md="4">
                  <v-text-field
                    dark
                    v-model="user.primaryIdentificationNum"
                    label="IC / Passport Number"
                    required
                    :rules="[rules.required]"
                    dense
                    class="text"
                    solo
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col :cols="12" md="4">
                  <v-row justify="center" align="center">
                    <v-col cols="12" md="8">
                      <v-card-text class="text"
                        >Upload your utility bill (eg : TNB)</v-card-text
                      >
                    </v-col>
                    <v-col cols="12" md="4">
                      <VDropdown :distance="1">
                        <!-- This will be the popover reference (for the events and position) -->
                        <v-btn style="background-color: transparent">
                          <v-icon style="color: #80ff00 !important"
                            >mdi-information</v-icon
                          >
                        </v-btn>

                        <!-- This will be the content of the popover -->
                        <template #popper>
                          <v-card class="grid" width="250px" height="250px">
                            <v-img
                              src="https://res.cloudinary.com/de3gn7o77/image/upload/v1682590638/nw6icrfiby8djc00s7df.jpg"
                              max-height="240px"
                              max-width="240px"
                              contain
                            ></v-img>
                          </v-card>
                          <!-- You can put other components too -->
                        </template>
                      </VDropdown>
                    </v-col>
                  </v-row>
                  <br />
                  <v-file-input
                    :rules="[rules.required]"
                    dark
                    prepend-icon="mdi-image-outline"
                    accept="image/*"
                    @change="utilityImage" />
                  <div v-if="utilityImageUrl">
                    <v-card class="grid" width="250px" height="300px">
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
                        :src="utilityImageUrl"
                        max-height="240px"
                        max-width="240px"
                        contain
                      >
                      </v-img
                    ></v-card></div
                ></v-col>
                <v-col :cols="12" md="4">
                  <v-row justify="center" align="center">
                    <v-col cols="12" md="8">
                      <v-card-text class="text"
                        >Upload Your IC/Passport</v-card-text
                      >
                    </v-col>
                    <v-col cols="12" md="4">
                      <VDropdown :distance="1">
                        <!-- This will be the popover reference (for the events and position) -->
                        <v-btn style="background-color: transparent">
                          <v-icon style="color: #80ff00 !important"
                            >mdi-information</v-icon
                          >
                        </v-btn>

                        <!-- This will be the content of the popover -->
                        <template #popper>
                          <v-card class="grid" width="250px" height="250px">
                            <v-img
                              src="https://res.cloudinary.com/de3gn7o77/image/upload/v1682590810/fizmru3rswsq8f2lupow.png"
                              max-height="240px"
                              max-width="240px"
                              contain
                            ></v-img>
                          </v-card>
                          <!-- You can put other components too -->
                        </template>
                      </VDropdown>
                    </v-col>
                  </v-row>
                  <br />
                  <v-file-input
                    :rules="[rules.required]"
                    dark
                    prepend-icon="mdi-image-outline"
                    accept="image/*"
                    @change="primaryImage" />
                  <div v-if="primaryImageUrl">
                    <v-card class="grid" width="250px" height="300px">
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
                        </v-btn></v-row
                      >
                      <v-img
                        :src="primaryImageUrl"
                        max-height="240px"
                        max-width="240px"
                        contain
                      >
                      </v-img
                    ></v-card></div
                ></v-col>

                <v-col :cols="12" md="4">
                  <v-row justify="center" align="center">
                    <v-col cols="12" md="10">
                      <v-card-text class="text"
                        >Upload Your Secondary Document (eg : Driving
                        License)</v-card-text
                      >
                    </v-col>
                    <v-col cols="12" md="2">
                      <VDropdown :distance="1">
                        <!-- This will be the popover reference (for the events and position) -->
                        <v-btn style="background-color: transparent">
                          <v-icon style="color: #80ff00 !important"
                            >mdi-information</v-icon
                          >
                        </v-btn>

                        <!-- This will be the content of the popover -->
                        <template #popper>
                          <v-card class="grid" width="250px" height="250px">
                            <v-img
                              src="https://res.cloudinary.com/de3gn7o77/image/upload/v1682591121/uttbcbpgmorize5bfk3x.jpg"
                              max-height="240px"
                              max-width="240px"
                              contain
                            ></v-img>
                          </v-card>
                          <!-- You can put other components too -->
                        </template>
                      </VDropdown>
                    </v-col>
                  </v-row>
                  <v-file-input
                    :rules="[rules.required]"
                    dark
                    prepend-icon="mdi-image-outline"
                    accept="image/*"
                    @change="secondaryImage" />
                  <div v-if="secondaryImageUrl">
                    <v-card class="grid" width="250px" height="300px">
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
                        </v-btn></v-row
                      >
                      <v-img
                        :src="secondaryImageUrl"
                        max-height="240px"
                        max-width="240px"
                      >
                      </v-img
                    ></v-card></div
                ></v-col>
              </v-row>
              <v-row class="justify-center align-center" no-gutters>
                <v-btn class="button" dark type="submit">
                  <v-icon class="icn1">
                    mdi-location-enter mdi-18px
                  </v-icon>
                  Register
                </v-btn>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-hover>
    </v-container>
    <v-footer padless class="footer" color="transparent">
      <v-card-text class="d-flex flex-column align-center align-top footer">
        <div class="footer-top mb-3" style="margin-top: 2% !important">
          <v-row align="center">
            <v-col>
              <span class="mr-3">
                <a
                  href="https://jrvservices.co/car-rental=seremban"
                  target="_blank"
                  class="text2 text-decoration-none"
                >
                  JRV Car Rental Services, Located at Seremban and provided as
                  well at KL, Selangor, Melaka, JB, and throughout all states in
                  Malaysia.
                </a>
              </span>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <a
                href="https://www.facebook.com/jrvcarrentalseremban"
                target="_blank"
                @click="trackButtonClick('Facebook')"
              >
                <v-icon size="32" class="mx-2 company-link" dark
                  >mdi-facebook</v-icon
                >
              </a>
              <a
                href="https://www.instagram.com/jastransport_rentalservices/"
                target="_blank"
                @click="trackButtonClick('Instagram')"
              >
                <v-icon size="32" class="mx-2 company-link" dark
                  >mdi-instagram</v-icon
                >
              </a>
              <a
                href="https://chat.whatsapp.com/DVZXvnBiDqS0Z9jkHwL9yT"
                target="_blank"
                @click="trackButtonClick('Whatsapp')"
              >
                <v-icon size="32" class="mx-2 company-link" dark
                  >mdi-whatsapp</v-icon
                >
              </a>
              <a
                href="https://t.me/+ILGvKb39imRkMDNl"
                target="_blank"
                @click="trackButtonClick('Telegram')"
              >
                <v-icon size="32" class="mx-2 company-link" dark
                  >mdi-telegram</v-icon
                >
              </a>
            </v-col>
          </v-row>
        </div>
        <div
          class="footer-bottom text2"
          style="margin-top: 1% !important; margin-bottom: 1% !important"
        >
          Copyright {{ new Date().getFullYear() }}
          <a
            href="https://www.linkedin.com/in/rajveenz2/"
            target="_blank"
            class="company-link"
            >Fast Track Solutions</a
          >
        </div>
      </v-card-text>
    </v-footer>
  </v-app>
</template>

<script>
import DataService from "../services/dataService.js";
const dataService = new DataService();

export default {
  data() {
    return {
      showPhone: true,
      primaryImageUrl: null,
      secondaryImageUrl: null,
      utilityImageUrl: null,
      isValid: false,
      value: String,
      user: {
        mobileNumber: "",
        email: "",
        password: "",
        name: "",
        address: "",
        primaryIdentificationNum: "",
      },
      results: [],
      rules: {
        required: (value) => !!value || "This field is required.",
      },
      emailRules: [
        (v) => !!v || "Required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      errorMessage: false,
      showInputOTP: false,
      otp: "",
      registerForm: false,
    };
  },

  computed: {
    canSubmit() {
      return this.email && this.password;
    },
  },

  mounted() {
    this.errorMessage = "Failed";
  },

  methods: {
    trackButtonClick(a) {
      console.log(a);
      this.$gtag.event("Button_clicks", {
        event_category: a,
        event_label: "User clicked on icon",
      });
    },

    async sendVerificationCode() {
      try {
        this.$setLoader();
        await dataService
          .sendVerificationCode({
            mobileNumber: this.results.formattedNumber,
            reset: false,
          })
          .then((res) => {
            if (res.data.verify) {
              this.showInputOTP = true;
            }
          });
        this.$disableLoader();
      } catch (error) {
        // alert("Error 1000 - Page does not exists!")
        this.$disableLoader();
      }
    },

    async verifyVerificationCode() {
      await dataService
        .verifyVerificationCode({
          mobileNumber: this.results.formattedNumber,
          otp: this.otp,
        })
        .then((res) => {
          if (res.data.verify) {
            if (res.data.verify.status == "approved") {
              alert("Your number is approved.");
              this.registerForm = true;
              this.showPhone = false;
            } else {
              alert("Wrong OTP, retry or change number.");
            }
          } else {
            alert("Wrong OTP, retry or change number.");
          }
        });
    },

    async register() {
      try {
        this.$setLoader();
        const isValid = await this.$refs.form.validate();
        if (isValid) {
          this.user.countryCode = this.results.countryCode;
          this.user.mobileNumber = this.results.formattedNumber;
          this.user.utilityImageUrl = this.utilityImageUrl;
          this.user.primaryIdentificationUrl = this.primaryImageUrl;
          this.user.secondaryIdentificationUrl = this.secondaryImageUrl;
          this.user.isActive = false;

          await dataService.register(this.user).then((res) => {
            console.log(res.data.message);
          });
          this.$disableLoader();
          this.$router.push({ name: "login" });
        } else {
          alert("Please fill out all required fields");
          this.$disableLoader();
        }
      } catch (error) {
        // alert("Error 1000 - Page does not exists!")
        this.$disableLoader();
        this.$refs.form.reset();
        this.registerForm = false;
      }
    },

    removeUrl(name) {
      if (name == "utility") {
        this.utilityImageUrl = null;
      }
      if (name == "primary") {
        this.primaryImageUrl = null;
      }
      if (name == "secondary") {
        this.secondaryImageUrl = null;
      }
    },

    utilityImage(file) {
      if (file) {
        this.$setLoader();
        file.resource_type = "image";
        file.url = process.env.VUE_APP_CLOUDINARY_URL_IMAGE;
        this.uploadFileToCloudinary(file).then((fileResponse) => {
          // Build the Cloudinary URL with transformation parameters
          this.utilityImageUrl = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,f_auto,q_auto/${fileResponse.public_id}.${fileResponse.format}`;

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
          // Build the Cloudinary URL with transformation parameters
          this.primaryImageUrl = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,f_auto,q_auto/${fileResponse.public_id}.${fileResponse.format}`;

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
          // Build the Cloudinary URL with transformation parameters
          this.secondaryImageUrl = `https://res.cloudinary.com/${process.env.VUE_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,f_auto,q_auto/${fileResponse.public_id}.${fileResponse.format}`;

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
  max-width: none !important;
}

.button {
  margin-top: 2% !important;
  margin-bottom: 2% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
.v-sheet.v-card.v-sheet--shaped {
  border-radius: 24px 4px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
}
.text {
  color: #ffffff !important;
}

.v-application .elevation-8 {
  box-shadow: 0px 5px 5px -3px rgba(240, 7, 7, 0.2),
    0px 8px 10px 1px rgba(240, 7, 7, 0.2), 0px 3px 14px 2px rgba(240, 7, 7, 0.2) !important;
}

.v-application .elevation-12 {
  box-shadow: 0px 5px 5px -3px #000, 0px 8px 10px 1px #000,
    0px 3px 14px 2px #000 !important;
}

.grid {
  margin-top: 2% !important;
  margin-right: auto !important;
  margin-left: auto !important;
  place-items: center;
  background-color: #00c3ff14 !important;
  margin-bottom: 2% !important;
}
</style>
