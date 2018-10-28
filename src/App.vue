<template>
  <v-app>
    <v-content>
      <v-layout row justify-center>
        <v-flex xs10>
          <div class="mondrian-container">
            <Mondrian
              :lines-base="linesBase"
              :color-probability="colorProbability"
              :blue-probability="blueProbability"
              :red-probability="redProbability"
              :muted-probability="mutedProbability"></Mondrian>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs10>
          <Parameterizer
            :lines-base="linesBase"
            :color-probability="colorProbability"
            :blue-probability="blueProbability"
            :red-probability="redProbability"
            :muted-probability="mutedProbability"
            v-on:set-param="setProperty($event)"></Parameterizer>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import Mondrian from "./components/Mondrian";
import Parameterizer from "./components/Parameterizer";

export default {
  name: "App",
  components: {
    Mondrian,
    Parameterizer
  },
  data() {
    return {
      linesBase: 6,
      colorProbability: 20,
      blueProbability: 33,
      redProbability: 33,
      mutedProbability: 20
    };
  },
  methods: {
    setProperty($event) {
      this[$event.property] = $event.value;
    }
  }
};
</script>

<style scoped lang="scss">
.mondrian-container {
  height: 85vh;
  width: 85vh;
  margin: auto;
}
</style>
