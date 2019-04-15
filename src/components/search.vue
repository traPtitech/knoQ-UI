<template>
  <v-form>
    <v-container>
      <v-layout>
        <v-flex xs12 md6>
          <v-text-field
            v-model="traQID"
            :counter="10"
            label="traQID"
            placeholder="fuji"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md6>
          <v-text-field
            v-model="dateBegin"
            :counter="10"
            label="begin"
            placeholder="2018-08-10"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md6>
          <v-text-field
            v-model="dateEnd"
            :counter="10"
            label="end"
            placeholder="2018-08-10"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md4>
          <v-btn @click="submit">submit</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  url: '/reservations',
  headers: { 'X-Showcase-User': 'fuji' },
  method: 'get'
});

export default {
  data: () => ({
    traQID: '',
    dateBegin: '',
    dateEnd: ''
  }),
  methods: {
    submit () {
      console.log(this.traQID, this.dateBegin, this.dateEnd);

      axios.get('http://localhost:3000/api/reservations',{
        headers:{ 
          'X-Showcase-User': 'fuji' 
        },
        data: {} 
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>
