<template>
  <div></div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Logout',
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
    this.logout()
  },
  methods: {
    logout () {
      axios.post(this.$apiURI + '/logout', {}, {
        headers: {},
      })
        .then(response => {
          // console.log(response)
        })
        .catch(e => {
          // console.log(e)
        })
        .finally(r => {
          delete axios.defaults.headers.common.Authorization
          localStorage.removeItem('user-token')
          this.$router.push({ name: 'Login' })
        })
    },
  },
}
</script>

<style lang="scss">
</style>
