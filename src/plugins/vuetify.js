import Vue from "vue";
import Vuetify, {
  VApp,
  VContainer,
  VLayout,
  VFlex,
  VSlider,
  VTextField,
  VResponsive
} from "vuetify/lib";
import { Resize } from "vuetify/lib/directives";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  components: {
    VApp,
    VContainer,
    VLayout,
    VFlex,
    VSlider,
    VTextField,
    VResponsive
  },
  directives: {
    Resize
  }
});
