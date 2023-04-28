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

    <v-app-bar flat class="tbar1" style="padding: 0">
      <div class="d-flex align-center" style="margin: auto">
        <div
          class="d-flex align-center justify-center"
          style="margin-right: auto"
        >
          <v-img
            :src="require('@/assets/images/logo.png')"
            class="logo"
            alt="jrv-car-rental-logo"
            @click="$router.push({ path: '/car-rental-seremban' })"
          />
        </div>
      </div>
    </v-app-bar>
    <v-app-bar flat class="tbar2">
      <div class="d-flex align-center" style="margin: auto">
        <v-btn
          v-if="showAdminButton"
          style="margin-right: 5%"
          dark
          @click="$router.push({ path: '/home' })"
          ><v-icon class="icn1"> mdi-home-circle-outline mdi-18px </v-icon
          >Admin</v-btn
        >
        <div
          class="d-flex align-center justify-center"
          style="margin-right: auto"
        >
          <v-toolbar-title class="username" v-if="userProfile.name">
            {{ userProfile.name }}
          </v-toolbar-title>

          <v-btn icon @click="account()" v-if="userProfile.name">
            <v-icon class="icn1">mdi-account-circle-outline</v-icon>
          </v-btn>

          <v-btn icon @click="logout()" v-if="userProfile.name">
            <v-icon class="icn1">mdi-logout-variant</v-icon>
          </v-btn>

          <div v-else>
            <v-btn dark @click="$router.push({ path: '/login' })">
              <v-icon class="icn1">mdi-login-variant</v-icon> Login / Register
            </v-btn>
          </div>
        </div>
      </div>
    </v-app-bar>
    <v-container class="container">
      <v-hover v-slot="{ hover }" open-delay="200">
        <v-card
          width="95%"
          class="grid"
          shaped
          :class="{ 'on-hover': hover }"
          :elevation="hover ? 12 : 16"
          color="transparent"
        >
          <v-tabs color="#80ff00 " grow dark>
            <v-tab>Cars</v-tab>
            <v-tab>About Us</v-tab>
            <v-tab>Reviews</v-tab>
            <v-tab>Contact Us</v-tab>
            <v-tab-item>
              <v-card-text
                class="text-center mx-auto header"
                v-if="userProfile.name"
                >Welcome Mr/Ms {{ userProfile.name }} to JRV Car Rental
                Seremban, you may view our cars below and connect with us on
                whatsapp to make reservations.</v-card-text
              >
              <v-card-text class="text-center mx-auto header" v-else
                >Welcome to JRV Car Rental Seremban, you may view our cars below
                and connect with us on whatsapp to make
                reservations.</v-card-text
              >
              <v-card
                v-if="userProfile.isActive == true"
                shaped
                style="margin-top: 1% !important"
                color="#000000a1"
              >
                <v-tabs color="#80ff00 " grow dark>
                  <v-tab
                    v-for="(categoryCars, categoryName) in groupedCars"
                    :key="categoryName"
                  >
                    {{ categoryName }}
                  </v-tab>
                  <v-tab-item
                    v-for="(categoryCars, categoryName) in groupedCars"
                    :key="categoryName"
                    shaped
                  >
                    <v-row>
                      <v-col
                        :cols="3"
                        v-for="car in categoryCars.slice(0, 10)"
                        :key="car._id"
                        class="colclass"
                      >
                        <v-carousel
                          :cycle="false"
                          height="fit-content"
                          hide-delimiter-background
                          class="custom-carousel"
                          v-model="activeSlide"
                          hide-delimiters
                          shaped
                          ><v-carousel-item
                            v-for="image in car.imageUrl"
                            :key="image._id"
                          >
                            <v-card
                              height="300px"
                              width="300px"
                              class="mx-auto"
                              style="
                                box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0),
                                  0px 2px 2px 0px rgba(0, 0, 0, 0),
                                  0px 1px 5px 0px rgba(0, 0, 0, 0);
                              "
                              color="#FFF0"
                              shaped
                            >
                              <v-dropdown :distance="1">
                                <!-- This will be the popover reference (for the events and position) -->
                                <v-btn
                                  dark
                                  class="justify-end btnWa"
                                  style="
                                    position: absolute;
                                    z-index: 1000;
                                    right: 4px;
                                    height: 12%;
                                    width: 40%;
                                    font-size: 0.65rem !important;
                                  "
                                  ><v-icon
                                    color="#80ff00"
                                    alt="WhatsApp icon"
                                    aria-label="Contact JRV-Car-Rental-Seremban on WhatsApp"
                                    >mdi-whatsapp</v-icon
                                  >Book Now</v-btn
                                >
                                <template #popper>
                                  <v-card class="grid" dark>
                                    <v-form>
                                      <v-row justify="center" align="center">
                                        <v-card-text
                                          style="color: #fff !important"
                                          >Enter booking start date</v-card-text
                                        >
                                        <v-text-field
                                          v-model="bookingDate"
                                          type="date"
                                          required
                                          :rules="[rules.required]"
                                          dense
                                          solo
                                          class="text"
                                          dark
                                        ></v-text-field> </v-row
                                      ><v-row justify="center" align="center">
                                        <v-card-text
                                          style="color: #fff !important"
                                          >Enter booking end date</v-card-text
                                        >
                                        <v-text-field
                                          v-model="returnDate"
                                          type="date"
                                          required
                                          :rules="[rules.required]"
                                          dense
                                          solo
                                          class="text"
                                          dark
                                        ></v-text-field>
                                      </v-row>

                                      <v-row justify="center" align="center">
                                        <v-btn
                                          class="btnWa text-decoration-none"
                                          style="margin-bottom: 2% !important"
                                          :href="`https://wa.me/138845477?text=I'm%20interested%20in%20your%20${car.make}%20${car.model}%20for%20rental%20from%20${bookingDate}%20to%20${returnDate}`"
                                          target="_blank"
                                          @click="trackButtonClick"
                                          :disabled="submitDisabled"
                                          >Submit</v-btn
                                        ></v-row
                                      >
                                    </v-form>
                                  </v-card>
                                </template>
                              </v-dropdown>
                              <v-img
                                :src="image.url"
                                class="grid3"
                                height="290px"
                                width="290px"
                                contain
                                alt="Preloaded image"
                                style="object-fit: cover"
                              >
                                >
                              </v-img>
                            </v-card>

                            <v-card-text
                              class="d-flex align-center justify-center text3"
                              >{{ car.make }} {{ car.model }}
                            </v-card-text>
                            <v-card-text
                              class="d-flex align-center justify-center price"
                            >
                              <textra
                                :data="car.pricePerDay"
                                :timer="1"
                                filter="press"
                                infinite
                              />
                            </v-card-text>
                            <div
                              class="d-flex align-items-center justify-content-center"
                            >
                              <div class="text-center mx-auto text4">
                                {{ car.desc }}
                              </div>
                            </div>
                          </v-carousel-item>
                        </v-carousel>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                </v-tabs>
              </v-card>
              <v-card
                v-if="!userProfile.name || userProfile.isActive == false"
                shaped
                style="margin-top: 1% !important"
                color="#000000a1"
              >
                <v-tabs color="#80ff00 " grow dark>
                  <v-tab
                    v-for="(categoryCars, categoryName) in groupedCars"
                    :key="categoryName"
                  >
                    {{ categoryName }}
                  </v-tab>
                  <v-tab-item
                    v-for="(categoryCars, categoryName) in groupedCars"
                    :key="categoryName"
                    shaped
                  >
                    <v-row>
                      <v-col
                        :cols="3"
                        v-for="car in categoryCars.slice(0, 10)"
                        :key="car._id"
                        class="colclass"
                      >
                        <v-carousel
                          :cycle="false"
                          height="fit-content"
                          hide-delimiter-background
                          class="custom-carousel"
                          v-model="activeSlide"
                          hide-delimiters
                          shaped
                          ><v-carousel-item
                            v-for="image in car.imageUrl"
                            :key="image._id"
                          >
                            <v-card
                              height="300px"
                              width="300px"
                              class="mx-auto"
                              style="
                                box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0),
                                  0px 2px 2px 0px rgba(0, 0, 0, 0),
                                  0px 1px 5px 0px rgba(0, 0, 0, 0);
                              "
                              color="#FFF0"
                              shaped
                            >
                              <v-dropdown :distance="1">
                                <!-- This will be the popover reference (for the events and position) -->
                                <v-btn
                                  class="justify-end btnWa"
                                  style="
                                    position: absolute;
                                    z-index: 1000;
                                    right: 4px;
                                    height: 12%;
                                    width: 40%;
                                    font-size: 0.65rem !important;
                                  "
                                  dark
                                  ><v-icon
                                    color="#80ff00"
                                    alt="WhatsApp icon"
                                    aria-label="Contact JRV-Car-Rental-Seremban on WhatsApp"
                                    >mdi-whatsapp</v-icon
                                  >Book Now</v-btn
                                >
                                <template #popper>
                                  <v-card class="grid" dark>
                                    <v-form>
                                      <v-row justify="center" align="center">
                                        <v-card-text
                                          style="color: #fff !important"
                                          >Enter booking start date</v-card-text
                                        >
                                        <v-text-field
                                          v-model="bookingDate"
                                          type="date"
                                          required
                                          :rules="[rules.required]"
                                          dense
                                          solo
                                          class="text"
                                          dark
                                        ></v-text-field> </v-row
                                      ><v-row justify="center" align="center">
                                        <v-card-text
                                          style="color: #fff !important"
                                          >Enter booking end date</v-card-text
                                        >
                                        <v-text-field
                                          v-model="returnDate"
                                          type="date"
                                          required
                                          :rules="[rules.required]"
                                          dense
                                          solo
                                          class="text"
                                          dark
                                        ></v-text-field>
                                      </v-row>
                                      <v-row justify="center" align="center">
                                        <v-btn
                                          style="margin-bottom: 2% !important"
                                          class="btnWa text-decoration-none"
                                          :href="`https://wa.me/138845477?text=I'm%20interested%20in%20your%20${car.make}%20${car.model}%20for%20rental%20from%20${bookingDate}%20to%20${returnDate}`"
                                          target="_blank"
                                          @click="trackButtonClick"
                                          :disabled="submitDisabled"
                                          >Submit</v-btn
                                        ></v-row
                                      >
                                    </v-form>
                                  </v-card>
                                </template>
                              </v-dropdown>
                              <v-img
                                :src="image.url"
                                class="grid3"
                                height="290px"
                                width="290px"
                                contain
                                alt="Preloaded image"
                                style="object-fit: cover"
                              >
                                >
                              </v-img>
                            </v-card>

                            <v-card-text
                              class="d-flex align-center justify-center text3"
                              >{{ car.make }} {{ car.model }}
                            </v-card-text>
                            <v-card-text
                              class="d-flex align-center justify-center price"
                            >
                              <textra
                                :data="car.pricePerDay"
                                :timer="1"
                                filter="press"
                                infinite
                              />
                            </v-card-text>
                            <div
                              class="d-flex align-items-center justify-content-center"
                            >
                              <div class="text-center mx-auto text4">
                                {{ car.desc }}
                              </div>
                            </div>
                          </v-carousel-item>
                        </v-carousel>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                </v-tabs>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card
                shaped
                style="
                  margin-top: 1% !important ;
                  background-color: transparent !important;
                "
              >
                <v-card-text class="d-flex align-center justify-center about"
                  >About Us</v-card-text
                >

                <v-card-text class="text-center mx-auto text2">
                  JRV Car Rental Seremban is a reliable and affordable car
                  rental company serving the Seremban area, as well as other
                  parts of Malaysia including KL, Melaka, JB, Selangor, and
                  Perak. Our goal is to provide our customers with the best
                  rental experience possible, and we take pride in our
                  commitment to exceptional customer service. We offer a wide
                  range of vehicles to suit your needs, including some of the
                  top rented car models in Malaysia such as the Perodua Axia,
                  Toyota Vios, Honda City, and Proton Saga. Our rental process
                  is straightforward and hassle-free, and we always strive to
                  provide competitive pricing and flexible rental terms. At JRV
                  Services, we understand that our customers have busy schedules
                  and require a convenient and efficient rental experience.
                  That's why we offer delivery and pickup services within our
                  service areas, as well as 24/7 customer support to ensure that
                  you have everything you need throughout your rental period. We
                  are dedicated to providing our customers with a safe and
                  reliable rental experience, and we work hard to maintain our
                  fleet of well-maintained vehicles. Whether you need a car for
                  a weekend getaway or a long-term rental, we have you covered.
                  Contact us today to learn more about our services or to make a
                  reservation. Our friendly and knowledgeable staff are always
                  here to help you with your car rental needs.
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <!-- Content for the "Reviews" tab goes here -->

              <v-form ref="form" @submit.prevent="submitReview">
                <v-card shaped style="background-color: transparent !important">
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-header>
                        <v-card-text
                          class="d-flex align-center justify-center about"
                          >Submit A Review</v-card-text
                        ></v-expansion-panel-header
                      >
                      <v-expansion-panel-content>
                        <v-container>
                          <v-row>
                            <v-col cols="12" md="4">
                              <v-card-text
                                class="d-flex align-center justify-center text2"
                                >Name</v-card-text
                              >
                              <v-text-field
                                dark
                                v-model="review.name"
                                :rules="[rules.required]"
                                required
                                class="text"
                                dense
                                solo
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-card-text
                                class="d-flex align-center justify-center text2"
                                >Car Rented</v-card-text
                              >
                              <v-select
                                required
                                v-model="review.car"
                                :items="generateCombinedModels"
                                dense
                                dark
                                solo
                              ></v-select>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-card-text
                                class="d-flex align-center justify-center text2"
                                >Rating 1-5</v-card-text
                              >
                              <v-rating
                                v-model="review.rating"
                                hover
                                style="background-color: #0000003d !important"
                                :value="3"
                                color="#80ff00 "
                                :rules="[rules.required]"
                                half-increments
                                requiree
                                dark
                                class="text-center mx-auto"
                              ></v-rating>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" md="4">
                              <v-card-text
                                class="d-flex align-center justify-center text2"
                                >Review (maximum 150 words)</v-card-text
                              >
                              <v-textarea
                                v-model="review.text"
                                :rules="reviewRules"
                                :counter="150"
                                required
                                dark
                                class="text"
                                dense
                                solo
                              ></v-textarea>
                            </v-col>
                          </v-row>
                          <v-row class="justify-center align-center" no-gutters>
                            <v-btn class="button" dark type="submit">
                              <v-icon color="#fff"> mdi-send mdi-18px </v-icon>
                              Submit
                            </v-btn>
                          </v-row>
                        </v-container>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
                <v-container>
                  <v-card-text class="d-flex align-center justify-center about"
                    >Reviews By Our Customers</v-card-text
                  >
                  <v-row>
                    <v-col
                      v-for="(review, index) in currentReviews"
                      :key="index"
                      cols="12/3"
                      md="4"
                    >
                      <v-card shaped class="my-card">
                        <v-rating
                          :value="review.rating"
                          readonly
                          :color="'#80ff00 !important'"
                          half-increments
                          class="text-center mx-auto"
                        ></v-rating>
                        <v-card-text class="text-center mx-auto text5">{{
                          review.name
                        }}</v-card-text>
                        <v-card-text class="text-center mx-auto text6"
                          >"{{ review.text }}"</v-card-text
                        >
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-pagination
                    dark
                    v-model="currentPage"
                    :total-visible="5"
                    :length="totalPages"
                    @input="pageChanged"
                    :disabled="disabled"
                  />
                </v-container>
              </v-form>
            </v-tab-item>

            <v-tab-item>
              <v-card
                style="
                  margin-top: 1% !important;
                  background-color: transparent !important;
                "
                shaped
              >
                <!-- Content for the "Contact Us" tab goes here -->
                <v-card-text class="d-flex align-center justify-center about"
                  >Contact Us</v-card-text
                >
                <v-card-text class="text-center text2">
                  <div class="pa-2">
                    <a
                      href="tel:+60193393600"
                      target="_blank"
                      class="text2 text-decoration-none"
                    >
                      <v-icon size="24">mdi-phone</v-icon>
                      <span class="pl-2">+60 19-339 3600</span>
                    </a>
                  </div>

                  <div class="pa-2">
                    <a
                      href="tel:+60138845477"
                      target="_blank"
                      class="text2 text-decoration-none"
                    >
                      <v-icon size="24">mdi-cellphone</v-icon>
                      <span class="pl-2">+60 13-884 5477</span>
                    </a>
                  </div>
                  <div class="pa-2">
                    <a
                      href="mailto:jas.rentalservices@gmail.com"
                      target="_blank"
                      class="text2 text-decoration-none"
                    >
                      <v-icon size="24">mdi-gmail</v-icon>
                      <span class="pl-2">jas.rentalservices@gmail.com</span>
                    </a>
                  </div>
                  <div class="pa-2">
                    <v-icon size="24">mdi-map-marker</v-icon>
                    <span class="pl-2"
                      >Uptown Avenue, Seremban 2, Negeri Sembilan</span
                    >
                  </div>
                </v-card-text>
                <div class="d-flex align-center justify-center">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.4031343929146!2d101.90688327472374!3d2.6957252557730724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cde94c7dd2d7f1%3A0xd8e6033569306cdd!2sJRV%20Car%20Rental%20Seremban!5e0!3m2!1sen!2smy!4v1681574786256!5m2!1sen!2smy"
                    frameborder="0"
                    style="
                      width: 300px;
                      height: 300px;
                      max-width: 100%;
                      margin-bottom: 1%;
                    "
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-hover>
    </v-container>

    <v-footer padless class="footer" color="transparent">
      <v-card-text class="d-flex flex-column align-top footer">
        <div class="footer-top mb-3">
          <v-row align="center">
            <v-col>
              <v-img
                :src="require('@/assets/images/logo.png')"
                height="200"
                contain
              ></v-img>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col>
              <span
                class="mr-3 d-grid align-center justify-center"
                style="text-align: justify"
              >
                <a
                  href="https://jrvservices.co/car-rental-seremban"
                  target="_blank"
                  class="text2 text-decoration-none"
                >
                  <v-card-text class="d-flex align-center justify-center"
                    >JRV Car Rental Services, Located at Seremban and provided
                    as well at KL, Selangor, Melaka, JB, and throughout all
                    states in Malaysia.</v-card-text
                  >
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
          style="margin-top: 1% !important ; margin-bottom: 1% !important"
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
import store from "./../app.store";

export default {
  data() {
    return {
      // name : this.$store.state.userProfile.name
      showAdminButton: false,
      bookingDate: null,
      returnDate: null,
      user: [],
      userProfile: [],
      cars: [],
      reviews: [],
      reviewRules: [
        (value) => {
          if (value) return true;

          return "Review is requred.";
        },
        (value) => {
          if (value?.length <= 150) return true;

          return "Review must be less than 150 characters.";
        },
      ],
      currentCarIndex: 0,
      activeSlide: 0,
      review: {
        car: "",
        name: "",
        rating: 0,
        text: "",
      },
      ratings: [1, 2, 3, 4, 5],
      rules: {
        required: (value) => !!value || "This field is required.",
      },
      currentPage: 1,
      itemsPerPage: 3,
      disabled: false,
    };
  },

  mounted: function () {
    this.getUser();
    this.getCars();
    this.getReviews();
    setInterval(() => {
      this.nextSlide();
    }, 20000);
  },

  computed: {
    submitDisabled() {
      return !this.bookingDate || !this.returnDate;
    },
    generateCombinedModels() {
      let CombinedModels = this.cars.map((car) => car.make + " " + car.model);
      return CombinedModels;
    },
    groupedCars() {
      return this.cars.reduce((grouped, car) => {
        let c = car.category.toUpperCase();
        if (!grouped[c]) {
          grouped[c] = [];
        }

        grouped[c].push(car);
        return grouped;
      }, {});
    },
    chunkedReviews() {
      const chunkedArray = [];
      const reviewsCopy = [...this.reviews];
      while (reviewsCopy.length > 0) {
        chunkedArray.push(reviewsCopy.splice(0, this.itemsPerPage));
      }
      return chunkedArray;
    },
    currentReviews() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.reviews.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.reviews.length / this.itemsPerPage);
    },
  },

  methods: {
    trackButtonClick(a) {
      this.$gtag.event("Button_clicks", {
        event_category: a,
        event_label: "User clicked on icon",
      });
    },

    async getUser() {
      this.$setLoader();
      window.$cookies.set("posToken", window.$cookies.get("posToken"));
      if (window.$cookies.get("posToken") !== "null") {
        store.state.loader = true;
        dataService
          .whoAmI()
          .then((res) => {
            this.user = res.data.localUser;
            if (this.user.roles[0] == "admin") {
              this.showAdminButton = true;
            }
            this.userProfile = res.data.user;
            store.state.loader = false;
          })
          .catch(() => {
            window.location.reload();
          });
      } else {
        store.state.loader = false;
      }
    },

    async getCars() {
      this.$setLoader();
      await dataService.getCars().then((res) => {
        this.cars = res.data.cars;
        for (let car of this.cars) {
          car.pricePerDay = ["RM " + car.pricePerDay.toString() + " / DAY"];
        }
      });

      this.$disableLoader();
    },

    async getReviews() {
      this.$setLoader();
      await dataService.getReviews().then((res) => {
        this.reviews = res.data.reviews;
      });

      this.$disableLoader();
    },

    pageChanged(pageNumber) {
      this.currentPage = pageNumber;
    },

    nextSlide() {
      const currentCar = this.cars[this.currentCarIndex];
      this.activeSlide = (this.activeSlide + 1) % currentCar.imageUrl.length;

      // If we reached the end of the current car's images, move to the next car
      if (this.activeSlide === 0) {
        this.currentCarIndex = (this.currentCarIndex + 1) % this.cars.length;
      }
    },

    shuffle(array) {
      let currentIndex = array.length;
      let temporaryValue, randomIndex;

      // While there remain elements to shuffle
      while (currentIndex !== 0) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    },

    async submitReview() {
      this.$setLoader();
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        await dataService.addReview(this.review).then((res) => {
          console.log(res);
          this.$refs.form.reset();
          window.location.reload();
        });

        this.$disableLoader();
      } else {
        alert("Please fill out all required fields");
        this.$disableLoader();
      }
    },

    account() {
      this.$router.push({ path: `/edit` });
    },

    logout() {
      window.getApp.$emit("APP_LOGOUT");
    },
  },
};
</script>
<style scoped lang="css">
.container {
  /* margin-top: 5%; */
  height: fit-content !important;
}
.v-toolbar__content {
  height: auto !important;
  display: inherit !important;
}
.colclass {
  margin-left: auto !important;
  margin-right: auto !important;
  flex-grow: 0 !important;
  flex: 0 0 25%;
  max-width: inherit !important;
  margin-top: 1% !important;
  /* padding-right: 8px !important; */
  padding-bottom: 8px !important;
  /* padding-left: 8px !important; */
}

.my-card {
  height: 240px !important;
}

.not-clickable {
  pointer-events: none;
  opacity: 0.7; /* Optional: Add some opacity to visually indicate the content is not clickable */
}

.button {
  margin-bottom: 2% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.custom-carousel {
  padding: 20px; /* Adjust the padding value as needed */
}
.v-btn > .v-btn__content .v-icon {
  color: #f8f8f8;
  margin-right: 5px;
}
.icn1 {
  color: #80ff00 !important;
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
