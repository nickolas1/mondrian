<template>
    <v-container fluid grid-list-sm>
        <v-layout row wrap>
            <v-flex xs12>
                <v-slider v-model="linesInterface"
                          min="1"
                          max="15"
                          :label="`lines ${linesBase}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="colorInterface"
                          :label="`color % ${colorProbability}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="blueInterface"
                          :label="`blue % ${blueProbability}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="redInterface"
                          :label="`red % ${redProbability}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="mutedInterface"
                          :label="`muted % ${mutedProbability}`"></v-slider>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
  props: {
    rngSeed: Number,
    linesBase: Number,
    colorProbability: Number,
    redProbability: Number,
    blueProbability: Number,
    mutedProbability: Number
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
        return this.colorProbability;
      },
      set(val) {
        this.$emit("set-param", { property: "colorProbability", value: val });
      }
    },
    redInterface: {
      get() {
        return this.redProbability;
      },
      set(val) {
        this.$emit("set-param", { property: "redProbability", value: val });
      }
    },
    blueInterface: {
      get() {
        return this.blueProbability;
      },
      set(val) {
        this.$emit("set-param", { property: "blueProbability", value: val });
      }
    },
    mutedInterface: {
      get() {
        return this.mutedProbability;
      },
      set(val) {
        this.$emit("set-param", { property: "mutedProbability", value: val });
      }
    }
  }
};
</script>
