<template>
  <v-app>
    <v-content>
      <v-layout row justify-center>
        <v-flex xs10>
          <div class="mondrian-container">
            <Mondrian
              :rng-seed="rngSeed"
              :lines-base="linesBase"
              :color-percentage="colorPercentage"
              :blue-percentage="bluePercentage"
              :red-percentage="redPercentage"
              :yellow-percentage="yellowPercentage"
              :muted-percentage="mutedPercentage"></Mondrian>
          </div>
        </v-flex>
      </v-layout>
      <v-layout>
        <Describer v-bind:description="description"></Describer>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs10>
          <Parameterizer
            :lines-base="linesBase"
            :color-percentage="colorPercentage"
            :blue-percentage="bluePercentage"
            :red-percentage="redPercentage"
            :yellow-percentage="yellowPercentage"
            :muted-percentage="mutedPercentage"
            v-on:set-param="setProperty($event)"></Parameterizer>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import Mondrian from "./components/Mondrian";
import Parameterizer from "./components/Parameterizer";
import Describer from "./components/Describer";
import WeatherParameterizer from "./weather-parameterizer";
import * as limits from "./parameter-limits";

export default {
  name: "App",
  components: {
    Mondrian,
    Parameterizer,
    Describer
  },
  data() {
    return {
      rngSeed: 1,
      linesBase: limits.lineBase.base,
      colorPercentage: limits.colorPercentage.base,
      bluePercentage: limits.bluePercentage.base,
      redPercentage: limits.redPercentage.base,
      yellowPercentage: limits.yellowPercentage.base,
      mutedPercentage: limits.mutedPercentage.base,
      description: {}
    };
  },
  async mounted() {
    const weatherParameterizer = new WeatherParameterizer();
    const params = await weatherParameterizer.getParams();
    this.rngSeed = params.rngSeed;
    this.linesBase = params.linesBase;
    this.colorPercentage = params.colorPercentage;
    this.bluePercentage = params.bluePercentage;
    this.redPercentage = params.redPercentage;
    this.yellowPercentage = params.yellowPercentage;
    this.description = params.description;
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
