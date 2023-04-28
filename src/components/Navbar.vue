<template>
  <div>
    <v-app-bar flat class="tbar3" style="padding: 0">
      <div class="d-flex align-center" style="margin: auto">
        <div
          class="d-flex align-center justify-center"
          style="margin-right: auto"
        >
          <img
            src="./../assets/images/logo.png"
            class="logo"
            alt="jrv-car-rental-logo"
            @click="$router.push({ path: '/car-rental-seremban' })"
          />
        </div>
      </div>
    </v-app-bar>
    <v-app-bar flat class="tbar4">
      <div class="d-flex align-center" style="margin: auto">
        <v-btn style="margin-right: 5%;" dark @click="$router.push({ path: '/home' })"
        ><v-icon class="icn1"> mdi-home-circle-outline mdi-18px </v-icon>Home</v-btn
      >
        <div
          class="d-flex align-center justify-center"
          style="margin-right: auto"
        >
          <v-toolbar-title class="username">
            {{ name }}
          </v-toolbar-title>

          <v-btn icon @click="account()">
            <v-icon class="icn1">mdi-account-circle-outline</v-icon>
          </v-btn>

          <v-btn icon @click="logout()">
            <v-icon class="icn1">mdi-logout-variant</v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: this.$store.state.userProfile.name,
    };
  },

  computed: {
    nameToInitials() {
      try {
        let name = this.$store.state.userProfile.name;
        return name
          .split(" ")
          .map((x) => x.charAt(0))
          .join("")
          .substr(0, 2)
          .toUpperCase();
      } catch (error) {
        return "IZ";
      }
    },
  },

  methods: {
    // checkPermission(permissionToCheck) {
    //   let user = this.$store.state.buyerUser;

    //   return user &&
    //     user.permissions &&
    //     user.permissions.includes(permissionToCheck)
    //     ? true
    //     : false;
    // },

    account() {
      if (this.$store.state.userProfile) {
        this.$router.push({ path: `/edit` });
      } else {
        this.$router.push({ path: `/login` });
      }
    },
    logout() {
      window.getApp.$emit("APP_LOGOUT");
    },
  },
};
</script>

<style scoped lang="css">
.username {
  font-size: 14px;
  color: white;
  font-weight: 900;
}
.icn1 {
  color: #80ff00 !important;
}
</style>
