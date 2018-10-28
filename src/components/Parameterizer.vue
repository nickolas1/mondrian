<template>
    <v-container fluid grid-list-xs>
        <v-layout row wrap>
            <v-flex xs12>
                <v-slider v-model="linesInterface"
                          min="1"
                          max="15"
                          :label="`lines ${linesBase}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="colorInterface"
                          :label="`color % ${colorPercentage}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="blueInterface"
                          :label="`blue % ${bluePercentage}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="redInterface"
                          :label="`red % ${redPercentage}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="yellowInterface"
                          :label="`yellow % ${yellowPercentage}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="mutedInterface"
                          :label="`muted % ${mutedPercentage}`"></v-slider>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
  name: "Paramaterizer",
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
    rngInterface: {
      get() {
        return this.rngSeed;
      },
      set(val) {
        this.$emit("set-param", val);
      }
    },
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
    }
  }
};
</script>
