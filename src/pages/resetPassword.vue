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
          <v-container fluid fill-height v-if="showPhone">
            <v-row>
              <v-col md="6" cols="12">
                <v-card-text class="text">Mobile Number</v-card-text>
                <vue-phone-number-input
                  v-model="mobileNumber"
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
                  <v-btn class="btn" @click="sendVerificationCode"
                    >Send Verification Code
                  </v-btn></v-row
                >
              </v-col>
              <v-col cols="12" md="6" v-if="showInputOTP">
                <v-card-text class="text"
                  >Input OTP sent on Whatsapp</v-card-text
                >
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
                  <v-btn @click="verifyVerificationCode">Verify OTP</v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
          <div class="ma-4" v-if="changePasswordForm">
            <v-card-text class="text"
              >Welcome {{ name }} , complete the steps below to reset your
              password.</v-card-text
            >
            <v-stepper v-model="step">
              <v-stepper-header>
                <v-stepper-step :complete="step > 1" step="1">
                  Step 1
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="step > 2" step="2">
                  Step 2
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card
                    class="grid"
                    height="fit-content"
                    shaped
                    style="background-color: #00c3ff3d !important"
                  >
                    <v-card-text class="text"
                      >Enter your IC/Passport Number for
                      verification</v-card-text
                    >
                    <v-text-field
                      style="width: 80%"
                      dark
                      v-model="inputId"
                      required
                      :rules="[rules.required]"
                      dense
                      class="text"
                      solo
                    ></v-text-field
                  ></v-card>
                  <v-row class="justify-center align-center" no-gutters>
                    <v-btn dark @click="verifyID" class="btn"> Continue </v-btn>
                  </v-row>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card
                    class="grid"
                    height="fit-content"
                    shaped
                    style="background-color: #00c3ff3d !important"
                  >
                    <v-row>
                      <v-col :cols="12" md="4">
                        <v-card-text class="text">New Password</v-card-text>
                        <v-text-field
                          dark
                          v-model="password.newPassword"
                          required
                          dense
                          class="text"
                          solo
                          :append-icon="
                            value ? 'visibility' : 'visibility_off'
                          "
                          @click:append="() => (value = !value)"
                          :type="value ? 'password' : 'text'"
                        ></v-text-field>
                      </v-col>
                      <v-col :cols="12" md="4">
                        <v-card-text class="text"
                          >Confirm New Password</v-card-text
                        >
                        <v-text-field
                          dark
                          v-model="password.confirmNewPassword"
                          required
                          dense
                          class="text"
                          solo
                          :append-icon="
                            value ? 'visibility' : 'visibility_off'
                          "
                          @click:append="() => (value = !value)"
                          :type="value ? 'password' : 'text'"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card>
                  <v-row class="justify-center align-center" no-gutters>
                    <v-btn dark @click="changePassword">
                      Change Password
                    </v-btn>
                  </v-row>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </div>
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
      showPhone: true,
      rules: {
        required: (value) => !!value || "This field is required.",
      },
      results: [],
      showInputOTP: false,
      otp: "",
      changePasswordForm: false,
      mobileNumber: "",
      step: 1,
      name: "",
      id: "",
      inputId: "",
      userId: "",
      password: {},
      value: String,
    };
  },

  methods: {
    async sendVerificationCode() {
      try {
        this.$setLoader();
        await dataService
          .sendVerificationCode({
            mobileNumber: this.results.formattedNumber,
            reset: true,
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
          reset: true,
        })
        .then((res) => {
          console.log(res.data.verify);
          if (res.data.verify) {
            if (res.data.verify.status == "approved") {
              alert("You may enter a new password below.");
              this.changePasswordForm = true;
              this.showPhone = false;
              this.name = res.data.verify.name;
              this.id = res.data.verify.id;
              this.userId = res.data.verify._id;
            } else {
              alert("Wrong OTP, retry or change number.");
            }
          } else {
            alert("Wrong OTP, retry or change number.");
          }
        });
    },

    verifyID() {
      if (this.inputId) {
        if (this.inputId == this.id) {
          this.step = 2;
        } else {
          alert("Wrong ID entered, please retry");
        }
      }
    },

    async changePassword(){
        try {
        this.$setLoader();
        await dataService
          .resetPassword({
            _id : this.userId,
            password : this.password,
          })
          .then((res) => {
            if (res.data.reset == 'Success') {
                alert('Password changed successfully')
                this.$router.push({ name: "login" });
            }
            else{
                alert('Password change failed, please retry')
                window.location.reload()
            }
          });
        this.$disableLoader();
      } catch (error) {
        // alert("Error 1000 - Page does not exists!")
        this.$disableLoader();
      }
    }
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
