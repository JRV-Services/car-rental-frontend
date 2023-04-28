<template>
  <v-app>
    <particles-bg
      type="lines"
      :canvas="{ backgroundColor: '#000' }"
      :bg="true"
      :particles-number="100"
      :config="{
        line_linked: {
          enable: true,
          distance: 100,
          width: 1,
        },
        move: {
          speed: 0.5,
        },
      }"
      :style="{ zIndex: 0 }"
    />
    <v-container class="container">
      <v-card class="grid2" shaped>
        <v-card-title class="text-center justify-center about">
          Welcome {{ name }}
        </v-card-title>
        <v-card-title class="text-center justify-center about">
          Total Sales till date {{ currentDate }} is RM {{ totalSales }}
        </v-card-title>
        <v-hover v-slot="{ hover }" open-delay="200">
          <v-card
            width="95%"
            class="grid"
            shaped
            :class="{ 'on-hover': hover }"
            :elevation="hover ? 12 : 16"
            dark
            color="transparent"
          >
            <!-- <v-responsive :aspect-ratio="4/3"> -->
            <v-tabs bg-color="#FFFFFFC9" color="#80ff00 " grow>
              <v-tab @click="loadTab('Users')"> Users </v-tab>
              <v-tab @click="loadTab('Cars')"> Cars </v-tab>
              <v-tab @click="loadTab('Bookings')"> Bookings </v-tab>
              <v-tab @click="loadTab('Expenses')"> Expenses </v-tab>
            </v-tabs>
            <!-- </v-responsive> -->
            <div v-if="showUsers">
              <v-card class="grid3" color="transparent">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field
              ></v-card>
              <v-data-table
                :headers="userHeaders"
                :items="users"
                :search="search"
              >
                <template v-slot:item.isActive="{ item }">
                  <v-simple-checkbox
                    v-model="item.isActive"
                    :disabled="item.isActive"
                    @click="activateUser(item._id)"
                  ></v-simple-checkbox>
                </template>
                <template v-slot:item.edit="{ item }">
                  <v-icon small class="mr-2" @click="editUser(item._id)">
                    mdi-pencil
                  </v-icon>
                </template>
              </v-data-table>
            </div>
            <div v-if="showCars">
              <v-card class="grid3" color="transparent">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                >
                </v-text-field
              ></v-card>
              <v-row class="justify-center align-center" no-gutters
                ><v-btn class="button" dark @click="addCar">
                  <v-icon color="#fff"> mdi-card-plus-outline mdi-18px </v-icon>
                  Add Car
                </v-btn></v-row
              >
              <v-data-table
                :headers="carHeaders"
                :items="cars"
                :search="search"
                :footer-props="{
                  'items-per-page-options': [15, 30, 45, 60, 75],
                }"
                :items-per-page="15"
              >
                <template v-slot:item.edit="{ item }">
                  <v-icon small class="mr-2" @click="select(item._id)">
                    mdi-pencil
                  </v-icon>
                </template>
              </v-data-table>
            </div>
            <div v-if="showBookings">
              <v-card class="grid3" color="transparent">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
                <v-row class="justify-center align-center" no-gutters
                  ><v-btn class="button" dark @click="addBooking">
                    <v-icon color="#fff">
                      mdi-card-plus-outline mdi-18px
                    </v-icon>
                    Add Booking
                  </v-btn></v-row
                ></v-card
              >
              <v-data-table
                :headers="bookingHeaders"
                :items="bookings"
                :search="search"
              >
                <template #item.reservationDateStart="{ item }">
                  {{ formatDate(item.reservationDateStart) }}
                </template>
                <template #item.reservationDateEnd="{ item }">
                  {{ formatDate(item.reservationDateEnd) }}
                </template>
                <template v-slot:item.edit="{ item }">
                  <v-icon small class="mr-2" @click="editBooking(item._id)">
                    mdi-pencil
                  </v-icon>
                </template>
              </v-data-table>
            </div>
            <div v-if="showExpenses">
              <v-card-text class="text">
                <label for="filterDate">Filter by Date:</label></v-card-text
              >
              <v-card-text class="text"
                ><input type="date" v-model="filterDate" id="filterDate"
              /></v-card-text>
              <v-card-text class="text"
                >Total expense on selected date: {{ totalExpense }}</v-card-text>
                <v-card-text class="text"
                >
              <ul>
                <li v-for="expense in filteredExpenses" :key="expense.id">
                  {{ formatDate(expense.startDate) }} - {{ expense.totalPrice }} -
                  {{ expense.name }} - {{ expense.creator }}
                </li>
              </ul>
              </v-card-text>
              <v-card class="grid3" color="transparent">
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card>
              <v-data-table
                :headers="expensesHeaders"
                :items="expenses"
                :search="search"
              >
                <template #item.startDate="{ item }">
                  {{ formatDate(item.startDate) }}
                </template>
                <template v-slot:item.edit="{ item }">
                  <v-icon small class="mr-2" @click="editExpenses(item._id)">
                    mdi-pencil
                  </v-icon>
                </template>
              </v-data-table>
              <v-row class="justify-center align-center" no-gutters>
                <v-btn class="button" dark @click="addExpenses = true">
                  <v-icon class="icn1">
                    mdi-account-plus-outline mdi-18px
                  </v-icon>
                  Add Expense
                </v-btn>
              </v-row>
              <div v-if="addExpenses">
                <v-card shaped dark>
                  <v-card-text class="d-flex align-center justify-center about"
                    >Expense Logger</v-card-text
                  >
                  <form @submit.prevent="addExpense">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-card-text class="text">Car Details</v-card-text>
                        <v-select
                          dark
                          v-model="expense.carId"
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
                        <v-card-text class="text">Expense Date</v-card-text>
                        <v-text-field
                          v-model="expense.startDate"
                          solo
                          required
                          :rules="[rules.required]"
                          outlined
                          dense
                        ></v-text-field>
                        <v-date-picker
                          v-model="expense.startDate"
                          @input="setStartDate"
                          dense
                          solo
                          width="90%"
                          height="20%"
                        ></v-date-picker>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-card-text class="text">Price Paid (RM)</v-card-text>
                        <v-text-field
                          v-model="expense.totalPrice"
                          solo
                          required
                          :rules="[rules.required]"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-card-text class="text"
                          >Expense Details (eg : Petrol)</v-card-text
                        >
                        <v-text-field
                          v-model="expense.name"
                          solo
                          :rules="[rules.required]"
                          required
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="justify-center align-center" no-gutters>
                      <v-btn class="button" dark type="submit">
                        <v-icon class="icn1">
                          mdi-account-plus-outline mdi-18px
                        </v-icon>
                        Submit
                      </v-btn>
                    </v-row>
                  </form>
                </v-card>
              </div>
            </div>
          </v-card>
        </v-hover>

        <!-- <v-window>
          <v-window-item v-for="item in items" :key="item" :value="item">
            <v-card color="#fff" flat v-if="item = 'Users'">
              <v-card-text>{{ name }}</v-card-text>
            </v-card>
          </v-window-item>
        </v-window> -->
      </v-card>
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
        <div class="footer-bottom text2" style="margin-top: 1% !important">
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
      name: this.$store.state.userProfile.name,
      // tab: 'web',
      showUsers: true,
      users: [],
      currentDate: null,
      userHeaders: [
        {
          text: "Name",
          align: "center",
          sortable: false,
          value: "name",
        },
        { text: "Email", value: "email", sortable: false, align: "center" },
        {
          text: "Contact Number",
          value: "mobileNumber",
          sortable: false,
          align: "center",
        },
        {
          text: "Identification / Passport Number",
          value: "primaryIdentificationNum",
          sortable: false,
          align: "center",
        },
        {
          text: "Active User?",
          value: "isActive",
          align: "center",
          filterable: false,
        },
        {
          text: "Edit",
          value: "edit",
          align: "center",
          filterable: false,
          sortable: false,
        },
      ],
      search: "",
      showCars: false,
      cars: [],
      carHeaders: [
        {
          text: "Number Plate",
          align: "center",
          sortable: false,
          value: "plateNumber",
        },
        { text: "Status", align: "center", value: "rentStatus" },
        {
          text: "Make",
          align: "center",
          value: "make",
        },
        {
          text: "Model",
          sortable: false,
          align: "center",
          value: "model",
        },
        {
          text: "Price Per Day",
          align: "center",
          filterable: false,
          value: "pricePerDay",
        },
        {
          text: "Price 3 Days",
          align: "center",
          filterable: false,
          value: "pricePer3days",
        },
        {
          text: "Price Per Week",
          align: "center",
          filterable: false,
          value: "pricePerWeek",
        },
        {
          text: "Edit",
          value: "edit",
          align: "center",
          filterable: false,
          sortable: false,
        },
      ],
      extended: false,
      showBookings: false,
      bookings: [],
      bookingHeaders: [
        {
          text: "Number Plate",
          align: "center",
          sortable: false,
          value: "plateNumber",
        },
        {
          text: "Start Date",
          align: "center",
          value: "reservationDateStart",
        },
        {
          text: "End Date",
          sortable: false,
          align: "center",
          value: "reservationDateEnd",
        },
        {
          text: "Net Price (RM)",
          align: "center",
          filterable: false,
          value: "totalPrice",
        },
        {
          text: "Agent Name",
          align: "center",
          filterable: false,
          value: "agentName",
        },
        {
          text: "Agent Commisions",
          align: "center",
          filterable: false,
          value: "agentCommisions",
        },
        {
          text: "Extended Booking?",
          align: "center",
          filterable: false,
          value: "extensionEndDate",
        },
        {
          text: "Edit",
          value: "edit",
          align: "center",
          filterable: false,
          sortable: false,
        },
      ],
      expensesHeaders: [
        {
          text: "Number Plate",
          align: "center",
          sortable: false,
          value: "plateNumber",
        },
        {
          text: "Start Date",
          align: "center",
          value: "startDate",
        },
        {
          text: "Expense Amount",
          sortable: false,
          align: "center",
          value: "totalPrice",
        },
        {
          text: "Expense Name",
          align: "center",
          filterable: false,
          value: "name",
        },
        {
          text: "Admin Email",
          align: "center",
          filterable: false,
          value: "creator",
        },
      ],
      expenses: [],
      totalSales: 0,
      showExpenses: false,
      expense: {
        startDate: null,
      },
      filterDate: "",
      startDate: null,
      addExpenses: false,
      rules: {
        required: (value) => !!value || "This field is required.",
      },
    };
  },
  mounted: function () {
    this.getUsers();
    this.currentDate = new Date().toISOString().substr(0, 10);
  },
  computed: {
    filteredExpenses() {
      if (this.filterDate) {
        return this.expenses.filter((expense) => {
          return expense.startDate.substr(0, 10) === this.filterDate;
        });
      } else {
        return [];
      }
    },
    totalExpense() {
      return this.filteredExpenses.reduce((total, expense) => {
        return total + Number(expense.totalPrice);
      }, 0);
    },
  },

  methods: {
    loadTab(a) {
      if (a == "Users") {
        this.showUsers = true;
        this.showCars = false;
        this.showBookings = false;
        this.showExpenses = false;
      } else if (a == "Cars") {
        this.showUsers = false;
        this.showCars = true;
        this.showBookings = false;
        this.showExpenses = false;
      } else if (a == "Bookings") {
        this.showUsers = false;
        this.showCars = false;
        this.showBookings = true;
        this.showExpenses = false;
      } else if (a == "Expenses") {
        this.showUsers = false;
        this.showCars = false;
        this.showBookings = false;
        this.showExpenses = true;
      }
    },
    async getUsers() {
      if (this.$store.state.user.roles[0] == "admin") {
        this.$setLoader();
        await dataService.fetchUsers().then((res) => {
          this.users = res.data.users;
        });
        this.getCars();
        this.getBookings();
        this.getExpenses();
        this.$disableLoader();
      } else {
        alert("USER NOT AUTHORIZED TO VIEW THIS PAGE");
        this.$router.push({ path: `/car-rental-seremban` });
      }
    },

    async getCars() {
      this.$setLoader();
      await dataService.getAllCars().then((res) => {
        this.cars = res.data.cars;
      });

      this.$disableLoader();
    },

    async getBookings() {
      this.$setLoader();
      await dataService.getBookings().then((res) => {
        this.bookings = res.data.getBookings;
        for (let booking of this.bookings) {
          this.totalSales += Number(booking.totalPrice);
          if (
            booking.extensionEndDate != undefined ||
            booking.extensionEndDate != null
          ) {
            booking.extensionEndDate = true;
          } else {
            booking.extensionEndDate = false;
          }
        }
      });

      this.$disableLoader();
    },

    async getExpenses() {
      this.$setLoader();
      await dataService.getExpenses().then((res) => {
        this.expenses = res.data.expenses;
      });

      this.$disableLoader();
    },

    async addExpense() {
      this.$setLoader();
      for (let car of this.cars) {
        if (this.expense.carId == car._id) {
          this.expense.plateNumber = car.plateNumber;
        }
      }
      this.expense.creator = this.$store.state.userProfile.email;
      await dataService.addExpenses(this.expense).then((res) => {
        console.log(res);
        window.location.reload();
      });

      this.$disableLoader();
    },

    formatDate(dateString) {
      // const date = new Date(dateString);
      // const options = { timeZone: 'UTC' };
      // return date.toLocaleString('en-US', options);
      if (dateString != null) {
        const newDate = dateString;
        const date = newDate.slice(0, 10);
        return date;
      } else {
        return null;
      }
    },

    async activateUser(id) {
      this.$setLoader();
      await dataService.activateUser({ _id: id }).then(() => {
        this.getUsers();
      });

      this.$disableLoader();
    },

    addCar() {
      this.$setLoader();
      this.$router.push({ path: `/addCar` });
      this.$disableLoader();
    },

    addBooking() {
      this.$setLoader();
      this.$router.push({ path: `/addBooking` });
      this.$disableLoader();
    },

    select(cardId) {
      this.$setLoader();
      this.$router.push({ path: `/car/${cardId}` });
      this.$disableLoader();
    },

    editUser(cardId) {
      this.$setLoader();
      this.$router.push({ path: `/editUser/${cardId}` });
      this.$disableLoader();
    },

    editBooking(cardId) {
      this.$setLoader();
      this.$router.push({ path: `/editBooking/${cardId}` });
      this.$disableLoader();
    },

    setStartDate(newValue) {
      this.startDate = newValue;
      this.expense.startDate = newValue;
    },
  },
};
</script>

<style scoped lang="css">
.container {
  /* margin-top: 5%; */
  max-width: none !important;
}

/* .button {
  margin-bottom: 2% !important;
  margin-left: auto !important;
  margin-right: auto !important;
} */
/* .logo {
  height: 50%;
  width: 50%;
  margin-bottom: 15px;
  background-color: #fffafa00;
  box-shadow: none;
} */

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

.button {
  margin-top: 1% !important;
  margin-right: auto !important;
  margin-left: auto !important;
  place-items: center;
}

.grid {
  margin-top: 2% !important;
  margin-right: auto !important;
  margin-left: auto !important;
  width: 95%;
  place-items: center;
}

.grid2 {
  background-color: transparent;
  margin-right: auto !important;
  margin-left: auto !important;
  padding-bottom: 20px !important;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0),
    0px 2px 2px 0px rgba(0, 0, 0, 0), 0px 1px 5px 0px rgba(0, 0, 0, 0) !important;
}
.grid3 {
  margin-right: auto !important;
  margin-left: auto !important;
  place-items: center;
  display: grid !important;
}
.footer {
  font-size: 12px;
  font-weight: 600;
  color: #000;
  line-height: 1.25;
  text-align: center;
  background-color: #fff0;
  margin-top: 1%;
  width: 100% !important;
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
