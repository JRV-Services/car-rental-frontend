<template>
  <v-app>
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
          <v-form ref="form" @submit.prevent="register">
            <v-card-text class="d-flex align-center justify-center about"
              >Login or Signup</v-card-text
            >

            <v-container>
              <v-row class="d-flex align-center justify-center">
                <v-col cols="12" md="4">
                  <v-card-text class="text">Email</v-card-text>
                  <v-text-field
                    dark
                    class="text"
                    prepend-icon="mdi-email-outline"
                    color="#80ff00"
                    v-model="email"
                    :rules="emailRules"
                    dense
                    solo
                    data-vv-name="email"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row class="d-flex align-center justify-center about">
                <v-col cols="12" md="4">
                  <v-card-text class="text">Password</v-card-text>
                  <v-text-field
                    dark
                    class="text"
                    prepend-icon="mdi-lock-outline"
                    color="#80ff00"
                    v-model="password"
                    :rules="[rules.required]"
                    maxlength="20"
                    dense
                    solo
                    data-vv-name="password"
                    :append-icon="value ? 'visibility' : 'visibility_off'"
                    @click:append="() => (value = !value)"
                    :type="value ? 'password' : 'text'"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row class="d-flex align-center justify-center">
                <v-col cols="12" md="4">
                  <v-card-text
                    style="
                      color: #80ff00;
                      font-weight: 900 !important ;
                      margin-bottom: 3% !important;
                      padding-top: 0 !important;
                    "
                    @click="$router.push({ path: '/reset' })"
                    >Forgot Password?</v-card-text
                  >
                </v-col>
              </v-row>
            </v-container>
            <v-row class="justify-center align-center" no-gutters>
              <v-btn
                class="button"
                color="#fff"
                @click="login"
                :disabled="!canSubmit"
              >
                <v-icon color="#fff"> mdi-login mdi-18px </v-icon>
                Login
              </v-btn>
            </v-row>
            <v-row class="justify-center align-center" no-gutters>
              <v-btn class="button" color="#fff" @click="register">
                <v-icon color="#fff">
                  mdi-account-plus-outline mdi-18px
                </v-icon>
                First Time User?
              </v-btn>
            </v-row>
          </v-form>
        </v-card></v-hover
      >
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
      email: null,
      password: null,
      value: String,
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

    async register() {
      this.$router.push({ path: `/register` });
    },
    async login() {
      try {
        this.$setLoader();
        let loginDto = {
          email: this.email.toLowerCase(),
          password: this.password,
        };
        await dataService.login(loginDto).then((res) => {
          this.$store.state.user = res.data.user;
          window.$cookies.set("posToken", res.data.token);
          let role = res.data.user.roles;
          let superAdmin = role.find((element) => element == "admin");
          console.log(superAdmin);
          if (superAdmin == "admin") {
            this.$store.state.loggedInAs = "ADMIN";
            this.$router.push({ path: `/home` });
          } else {
            this.$store.state.loggedInAs = "USER";
            this.$router.push({ path: `/car-rental-seremban` });
          }
        });
        this.$disableLoader();
      } catch (error) {
        // alert("Error 1000 - Page does not exists!")
      }
      // this.$setLoader();
      // this.$router.push({ path: `/home` });
      // this.$disableLoader();
    },
  },
};
</script>

<style scoped lang="css">
.container {
  margin-top: 5%;
  max-width: none !important;
}

.button {
  margin-bottom: 2% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
.logo2 {
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
  height: 60%;
  place-items: center;
  background-color: #00c3ff14 !important;
}

.text {
  color: #ffffff !important;
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
