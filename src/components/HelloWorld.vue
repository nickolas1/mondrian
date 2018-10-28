<template>
  <div class="mondrian-container">
    <Mondrian></Mondrian>
    <Parameterizer></Parameterizer>
  </div>
</template>

<script>
import Mondrian from "./Mondrian";
import Parameterizer from "./Parameterizer";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  components: {
    Mondrian,
    Parameterizer
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
