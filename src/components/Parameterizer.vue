<template>
    <v-container fluid grid-list-xs class="parameterizer">
        <v-layout row>
            <v-flex xs12 d-flex justify-center class="parameters-title pt-4">
                Variations on this composition
            </v-flex>
        </v-layout>
        <v-layout row d-flex align-center>
            <v-flex xs3 d-flex justify-end>
                Approximate No. of lines
            </v-flex>
            <v-flex xs6>
                <v-slider v-model="linesInterface"
                          min="1"
                          max="15"
                          :label="`${linesBase}`"></v-slider>
            </v-flex>
            <v-flex xs3 class="parameter-description">
                Based on the fraction of the whole of the moon
            </v-flex>
        </v-layout>

        <v-layout row d-flex align-center>
            <v-flex xs3 d-flex justify-end>
                Chance a region is colorful
            </v-flex>
            <v-flex xs6>
                <v-slider v-model="colorInterface"
                          :label="`${colorPercentage}`"></v-slider>
            </v-flex>
            <v-flex xs3 class="parameter-description">
                Recent snow reduces the chance
            </v-flex>
        </v-layout>

        <v-layout row d-flex align-center>
            <v-flex xs3 d-flex justify-end>
                Chances of blue
            </v-flex>
            <v-flex xs6>
                <v-slider v-model="blueInterface"
                          :label="`${bluePercentage}`"></v-slider>
            </v-flex>
            <v-flex xs3 class="parameter-description">
                Active precipitation increases the blue
            </v-flex>
        </v-layout>

        <v-layout row d-flex align-center>
            <v-flex xs3 d-flex justify-end>
                Chances of red
            </v-flex>
            <v-flex xs6>
                <v-slider v-model="redInterface"
                          :label="`${redPercentage}`"></v-slider>
            </v-flex>
            <v-flex xs3 class="parameter-description">
                Modified by the temperature difference to 75F; hotter means more red
            </v-flex>
        </v-layout>

        <v-layout row d-flex align-center>
            <v-flex xs3 d-flex justify-end>
                Chances of yellow
            </v-flex>
            <v-flex xs6>
                <v-slider v-model="yellowInterface"
                          :label="`${yellowPercentage}`"></v-slider>
            </v-flex>
            <v-flex xs3 class="parameter-description">
                Cloudy means less yellow
            </v-flex>
        </v-layout>

        <v-layout row d-flex align-center>
            <v-flex xs3 d-flex justify-end>
                Random number generator seed
            </v-flex>
            <v-flex xs6>
                <v-text-field type="number" v-model="rngInterface"></v-text-field>
            </v-flex>
            <v-flex xs3 class="parameter-description">
                Now, in epoch milliseconds
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import VTextField from "vuetify/lib/components/VTextField/VTextField";
export default {
  name: "Paramaterizer",
  components: { VTextField },
  props: {
    rngSeed: Number,
    linesBase: Number,
    colorPercentage: Number,
    redPercentage: Number,
    bluePercentage: Number,
    yellowPercentage: Number,
    mutedPercentage: Number
  },
  computed: {
    linesInterface: {
      get() {
        return this.linesBase;
      },
      set(val) {
        this.$emit("set-param", { property: "linesBase", value: val });
      }
    },
    colorInterface: {
      get() {
        return this.colorPercentage;
      },
      set(val) {
        this.$emit("set-param", { property: "colorPercentage", value: val });
      }
    },
    redInterface: {
      get() {
        return this.redPercentage;
      },
      set(val) {
        this.$emit("set-param", { property: "redPercentage", value: val });
      }
    },
    blueInterface: {
      get() {
        return this.bluePercentage;
      },
      set(val) {
        this.$emit("set-param", { property: "bluePercentage", value: val });
      }
    },
    yellowInterface: {
      get() {
        return this.yellowPercentage;
      },
      set(val) {
        this.$emit("set-param", { property: "yellowPercentage", value: val });
      }
    },
    mutedInterface: {
      get() {
        return this.mutedPercentage;
      },
      set(val) {
        this.$emit("set-param", { property: "mutedPercentage", value: val });
      }
    },
    rngInterface: {
      get() {
        return this.rngSeed;
      },
      set(val) {
        this.$emit("set-param", { property: "rngSeed", value: +val });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.parameterizer {
  font-size: 0.9em;
  font-family: "Helvetica Neue", Helvetica, "Roboto", Arial, sans-serif;
}
.parameters-title {
  font-size: 1.25em;
}
.parameter-description {
  font-style: italic;
}
</style>
