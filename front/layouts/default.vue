<template>
  <div class="nuxt-page">
    <b-navbar type="is-dark">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Les Fontaines
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item href="/workers/">
          Workers
        </b-navbar-item>
      </template>
    </b-navbar>

    <section class="main-content">
      <div class="container is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' },
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' },
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.main-content {
  background: url('~assets/desk.jpg') no-repeat top center fixed;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  backdrop-filter: blur(5px);
}
</style>
