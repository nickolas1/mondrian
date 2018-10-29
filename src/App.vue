<template>
  <v-app>
    <v-container fluid grid-list-md>
      <v-layout row justify-center align-end wrap>
        <v-flex xs12
                sm8
                md6 offset-md3
                xl8 offset-xl2>
          <v-responsive :aspect-ratio="1">
            <Mondrian
              :rng-seed="rngSeed"
              :lines-base="linesBase"
              :color-percentage="colorPercentage"
              :blue-percentage="bluePercentage"
              :red-percentage="redPercentage"
              :yellow-percentage="yellowPercentage"
              :muted-percentage="mutedPercentage"></Mondrian>
          </v-responsive>
        </v-flex>
        <v-flex xs10
                sm8
                md3 offset-md0
                xl2 offset-xl0>
          <Describer v-bind:description="description"></Describer>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs10>
          <Parameterizer
            :rng-seed="rngSeed"
            :lines-base="linesBase"
            :color-percentage="colorPercentage"
            :blue-percentage="bluePercentage"
            :red-percentage="redPercentage"
            :yellow-percentage="yellowPercentage"
            :muted-percentage="mutedPercentage"
            v-on:set-param="setProperty($event)"></Parameterizer>
        </v-flex>
      </v-layout>
    </v-container>
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
      rngSeed: undefined,
      linesBase: undefined,
      colorPercentage: undefined,
      bluePercentage: undefined,
      redPercentage: undefined,
      yellowPercentage: undefined,
      mutedPercentage: undefined,
      description: undefined
    };
  },
  async mounted() {
    const weatherParameterizer = new WeatherParameterizer();
    try {
      const params = await weatherParameterizer.getParams();
      this.rngSeed = params.rngSeed;
      this.linesBase = params.linesBase;
      this.colorPercentage = params.colorPercentage;
      this.bluePercentage = params.bluePercentage;
      this.redPercentage = params.redPercentage;
      this.yellowPercentage = params.yellowPercentage;
      this.description = params.description;
    } catch (e) {
      this.rngSeed = new Date().valueOf();
      (this.linesBase = limits.lineBase.base),
        (this.colorPercentage = limits.colorPercentage.base);
      this.bluePercentage = limits.bluePercentage.base;
      this.redPercentage = limits.redPercentage.base;
      this.yellowPercentage = limits.yellowPercentage.base;
      this.mutedPercentage = limits.mutedPercentage.base;
      this.description = {};
    }
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
.foo {
  border: 1px solid red;
  height: 100%;
  width: 100%;
}
</style>
