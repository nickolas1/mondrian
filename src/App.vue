<template>
  <v-app>
    <v-content>
      <v-layout row justify-center>
        <v-flex xs10>
          <HelloWorld/>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      //
    };
  }
};
</script>
