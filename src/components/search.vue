<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm2>
          <v-select
            v-model="nowItem"
            :items="items"
          ></v-select>
        </v-flex>
        <v-flex xs10 sm2 v-if="nowItem === '予約' || nowItem === 'グループ'">
          <v-text-field
            v-model="Condition.traQID"
            label="traQID"
            placeholder="fuji"
          ></v-text-field>
        </v-flex>
        <v-flex xs10 sm3 v-if="nowItem === '予約' || nowItem === '部屋'">
          <v-menu
            ref="menuBegin"
            v-model="menuBegin"
            :close-on-content-click="false"
            :nudge-right="0"
            :return-value.sync="Condition.dateBegin"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="Condition.dateBegin"
                label="begin"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="Condition.dateBegin" no-title>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menuBegin = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.menuBegin.save(Condition.dateBegin)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs10 sm3 v-if="nowItem === '予約' || nowItem === '部屋'">
          <v-menu
            ref="menuEnd"
            v-model="menuEnd"
            :close-on-content-click="false"
            :nudge-right="0"
            :return-value.sync="Condition.dateEnd"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="Condition.dateEnd"
                label="end"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="Condition.dateEnd" no-title>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="menuEnd = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.menuEnd.save(Condition.dateEnd)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs2 sm1>
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
    items: ['予約', 'グループ', '部屋'],
    nowItem: '予約',
    Condition: {
      traQID: '',
      dateBegin: '',
      dateEnd: ''
    },
    menuBegin: false,
    menuEnd: false
  }),
  methods: {
    submit () {
      console.log(this.Condition.traQID, this.Condition.dateBegin, this.Condition.dateEnd)
      /*
      this.$store.dispatch('getReservations', {
        traQID: this.Condition.traQID,
        dateBegin: this.Condition.dateBegin,
        dateEnd: this.Condition.dateEnd
      })
      */
    }
  }
}
</script>
