<template>
    <v-container fluid grid-list-sm>
        <v-layout row wrap>
            <v-flex xs12>
                <v-slider v-model="linesBase"
                          min="1"
                          max="15"
                          :label="`lines ${linesBase}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="colorProbability"
                          :label="`color % ${colorProbability}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="blueProbability"
                          :label="`blue % ${blueProbability}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="redProbability"
                          :label="`red % ${redProbability}`"></v-slider>
            </v-flex>

            <v-flex xs12>
                <v-slider v-model="mutedProbability"
                          :label="`muted % ${mutedProbability}`"></v-slider>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
  data() {
    return {
      linesBase: 6,
      colorProbability: 20,
      blueProbability: 33,
      redProbability: 33,
      mutedProbability: 20
    };
  }
};
</script>
