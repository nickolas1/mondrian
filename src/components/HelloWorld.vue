<template>
  <div class="mondrian-container">
    <Mondrian></Mondrian>
  </div>
</template>

<script>
import Mondrian from "./Mondrian";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  components: {
    Mondrian
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mondrian-container {
  width: 85vw;
  height: 85vh;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
