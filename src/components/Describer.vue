<template>
    <div>
    <div class="description-title">
        Composition No. {{description.id}}
    </div>
    <div class="description-artist">
        {{artistString}}
    </div>
    <div class="description-body">
        {{descriptionString}}
    </div>
    </div>
</template>

<script>
export default {
  name: "Paramaterizer",
  props: {
    description: undefined
  },
  computed: {
    titleString() {
      if (this.description.id) {
        return `Composition No. ${this.description.id}`;
      } else {
        return `Composition No. ?`;
      }
    },
    descriptionString() {
      try {
        let conditionString = this.description.description.join(" and ");
        return `Generated in the vicinity of beautiful St Paul, Minnesota at ${
          this.description.time
        } under a ${
          this.description.lunar
        } moon. Atmospherically inspired by the temperature of ${
          this.description.temperature
        } degrees Fahrenheit, with ${conditionString}.`;
      } catch (e) {
        return "";
      }
    },
    artistString() {
      if (this.description.year) {
        return `Mondrianbot (${this.description.year})`;
      } else {
        return `Mondrianbot (${new Date().getFullYear()})`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.description-title {
  font-size: 1.3em;
  font-style: italic;
  font-family: "Helvetica Neue", Helvetica, "Roboto", Arial, sans-serif;
}
.description-artist {
  font-size: 0.9em;
  font-family: "Helvetica Neue", Helvetica, "Roboto", Arial, sans-serif;
}
.description-body {
  font-family: Garamond, "EB Garamond", serif;
  font-size: 1.1em;
}
</style>
