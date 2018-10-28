<template>
    <div>
    <div class="description-title">
        Composition {{description.id}}
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
    descriptionString() {
      try {
        let conditionString = this.description.description.join(",");
        return `Generated in beautiful St Paul, Minnesota at ${
          this.description.time
        } under a ${this.description.lunar} moon. ${
          this.description.temperature
        } degrees Fahrenheit with ${conditionString}.`;
      } catch (e) {
        return "";
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
.description-body {
  font-family: Garamond, "EB Garamond", serif;
  font-size: 1.1em;
}
</style>
