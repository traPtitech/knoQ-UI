<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 md3>
          <v-text-field
            v-model="traQID"
            label="traQID"
            placeholder="fuji"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md3>
          <v-text-field
            v-model="dateBegin"
            label="begin"
            placeholder="2018-08-10"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md3>
          <v-text-field
            v-model="dateEnd"
            label="end"
            placeholder="2018-08-10"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md3>
          <v-btn icon @click="submit">
            <v-icon>search</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    traQID: '',
    dateBegin: '',
    dateEnd: ''
  }),
  methods: {
    submit () {
      console.log(this.traQID, this.dateBegin, this.dateEnd)
      this.$store.dispatch('getReservations', {
        traQID: this.traQID,
        dateBegin: this.dateBegin,
        dateEnd: this.dateEnd
      })
    }
  }
}
</script>
