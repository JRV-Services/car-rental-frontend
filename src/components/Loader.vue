<template>
  <div v-show="this.$store.state.loader">
    <div class="loaderBackground" />
    <v-dialog v-model="this.$store.state.loader" hide-overlay persistent width="300">
      <v-card color="#000000" dark>
        <v-card-text class="pt-4">
          <center>
            <img :src="require('@/assets/images/logo.png')" class="loader-logo">
          </center>
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          <center class="pt-2">Loading</center>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "loader"
};
</script>