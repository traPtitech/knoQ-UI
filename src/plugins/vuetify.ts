import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.teal.base,
        secondary: colors.blueGrey.lighten1,
        accent: colors.brown.base,
        success: colors.green.lighten1,
        info: colors.blue.lighten2,
        warning: colors.amber.darken1,
        error: colors.red.lighten1,
        pending: colors.amber.darken1,
        background: '#f4f7f9',
        calendarToday: '#08645c',
      },
    },
  },
})
