<template>
  <v-app id="register">
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
          <v-form ref="form" @submit.prevent="addBooking">
            <v-card shaped>
              <v-card-text class="d-flex align-center justify-center about"
                >Enter booking details</v-card-text
              >
              <v-row>
                <v-col cols="12" md="4">
                  <v-card-text class="text">Car</v-card-text>
                  <v-select
                    dark
                    v-model="bookings.carId"
                    :rules="[rules.required]"
                    :items="cars"
                    item-text="plateNumber"
                    item-value="_id"
                    required
                    class="text"
                    dense
                    solo
                  ></v-select>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card-text class="text">Start Date</v-card-text>
                  <v-date-picker
                    v-model="startDate"
                    required
                    :rules="[rules.required]"
                    dense
                    solo
                    width="90%"
                    height="20%"
                    :value="startDate"
                    @input="setStartDate"
                  ></v-date-picker>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card-text class="text">Return Date</v-card-text>
                  <v-date-picker
                    v-model="endDate"
                    required
                    :rules="[rules.required]"
                    dense
                    solo
                    width="90%"
                    height="20%"
                    @input="setEndDate"
                  ></v-date-picker>
                  <div
                    v-if="bookingDuration > 0"
                    class="d-flex align-center justify-center"
                  >
                    {{ bookingDuration }} day(s) selected
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <v-card-text class="text">Total Booking Fee (RM)</v-card-text>
                  <v-text-field
                    v-model="bookings.totalPrice"
                    solo
                    required
                    :rules="[rules.required]"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card-text class="text">Agent Name</v-card-text>
                  <v-text-field
                    v-model="bookings.agentName"
                    solo
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card-text class="text">Agent Commisions (RM)</v-card-text>
                  <v-text-field
                    v-model="bookings.agentCommisions"
                    solo
                    required
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
               
                <v-col cols="12" md="4">
                  <v-card-text class="text">Customer Name</v-card-text>
                  <v-text-field
                    v-model="bookings.customerName"
                    label="Customer Name"
                    solo
                    required
                    :rules="[rules.required]"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card-text class="text">Extra Cost</v-card-text>
                  <v-text-field
                    v-model="bookings.extraCost"
                    label="Extra Cost (delivery fee , petrol, wash etc, ensure receipts are uploaded) (RM)"
                    solo
                    required
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-col :cols="12" md="4">
                <v-card-text class="text">Upload User Documents</v-card-text>
                <v-file-input
                  prepend-icon="mdi-image-outline"
                  accept="image/*"
                  @change="uploadUserImage"
              /></v-col>
              <div v-if="bookings.customerDocuments">
                <v-row>
                  <v-col
                    v-for="url in bookings.customerDocuments"
                    :key="url.id"
                  >
                    <v-card class="grid3" width="300px" height="300px">
                      <v-btn
                        class="rounded-btn"
                        color="primary"
                        @click="removeUserUrl(url)"
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

              <v-col :cols="12" md="4">
                <v-card-text class="text">Upload Receipts</v-card-text>
                <v-file-input
                  prepend-icon="mdi-image-outline"
                  accept="image/*"
                  @change="uploadReceipts"
              /></v-col>
              <div v-if="bookings.receipts">
                <v-row>
                  <v-col v-for="url in bookings.receipts" :key="url.id">
                    <v-card class="grid3" width="300px" height="300px">
                      <v-btn
                        class="rounded-btn"
                        color="primary"
                        @click="removeReceiptsUrl(url)"
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
              <v-row v-if="showAddExpense">
                <v-col cols="12" md="4">
                  <v-card-text class="text">Extended till</v-card-text>
                  <v-date-picker
                    v-model="extensionEndDate"
                    label="Select a date the extension ends"
                    dense
                    solo
                    width="90%"
                    height="20%"
                    @input="setextensionDate"
                  ></v-date-picker>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card-text class="text">Extended total (RM)</v-card-text>
                  <v-text-field
                    v-model="bookings.extentensionPrice"
                    label="Extended Amount (RM)"
                    solo
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
            <v-row class="justify-center align-center" no-gutters>
              <v-btn class="button" dark @click="showAddExpense = true">
                <v-icon class="icn1">
                  mdi-account-plus-outline mdi-18px
                </v-icon>
                Add Extension
              </v-btn>
              <v-btn class="button" dark type="submit">
                <v-icon class="icn1">
                  mdi-account-plus-outline mdi-18px
                </v-icon>
                Submit
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
      cars: [],
      selectedDate: null,
      startDate: null,
      endDate: null,
      extensionEndDate: null,
      bookings: {
        reservationDateStart: null,
        reservationDateEnd: null,
        plateNumber: null,
      },
      isValid: false,
      rules: {
        required: (value) => !!value || "This field is required.",
      },
      showAddExpense: false,
      customerDocuments: [],
      receipts: [],
    };
  },
  mounted: function () {
    this.getCars();
  },

  computed: {
    bookingDuration() {
      // This computed property calculates the number of days between the start and end dates.
      if (
        this.bookings.reservationDateStart &&
        this.bookings.reservationDateEnd
      ) {
        const start = new Date(this.bookings.reservationDateStart);
        const end = new Date(this.bookings.reservationDateEnd);
        const duration = (end - start) / (1000 * 60 * 60 * 24);
        return Math.round(duration);
      } else {
        return 0;
      }
    },
  },

  methods: {
    async getCars() {
      if (this.$store.state.user.roles[0] == "admin") {
        this.$setLoader();
        await dataService.getAllCars().then((res) => {
          this.cars = res.data.cars;
        });

        this.$disableLoader();
      } else {
        alert("USER NOT AUTHORIZED TO VIEW THIS PAGE");
        this.$router.push({ path: `/car-rental-seremban` });
      }
    },

    setStartDate(newValue) {
      this.startDate = newValue;
      this.bookings.reservationDateStart = newValue;
    },

    setEndDate(newValue) {
      this.endDate = newValue;
      this.bookings.reservationDateEnd = newValue;
    },

    setextensionDate(newValue) {
      this.extensionEndDate = newValue;
      this.bookings.extensionEndDate = newValue;
    },

    removeUserUrl(url) {
      const index = this.customerDocuments.findIndex(
        (item) => item.id === url.id
      );
      if (index !== -1) {
        this.customerDocuments.splice(index, 1);
      }
    },

    removeReceiptsUrl(url) {
      const index = this.receipts.findIndex((item) => item.id === url.id);
      if (index !== -1) {
        this.receipts.splice(index, 1);
      }
    },

    uploadUserImage(file) {
      if (file) {
        let maxId = 0;
        this.$setLoader();
        for (let image of this.customerDocuments) {
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

          this.customerDocuments.push({ url: url, id: newId });
          this.$disableLoader();
        });
      }
    },

    uploadReceipts(file) {
      if (file) {
        let maxId = 0;
        this.$setLoader();
        for (let image of this.receipts) {
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

          this.receipts.push({ url: url, id: newId });
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

    async addBooking() {
      for (let car of this.cars) {
        if (this.bookings.carId == car._id) {
          this.bookings.plateNumber = car.plateNumber;
        }
      }
      this.bookings.customerDocuments = this.customerDocuments;
      this.bookings.receipts = this.receipts;
      this.bookings.daysBooked = this.bookingDuration;
      console.log(this.bookings);
      this.$setLoader();
      await dataService.addBooking(this.bookings).then((res) => {
        console.log(res);
        window.location.reload();
      });

      this.$disableLoader();
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

.text {
  color: #ffffff !important;
}
.button {
  margin-top: 2% !important;
  margin-bottom: 2% !important;
  margin-left: auto !important;
  margin-right: auto !important;
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
