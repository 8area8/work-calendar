<template>
  <div id="app" class="main-content">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
export default {
  components: { Navbar }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-content {
  background: url("./assets/desk.jpg") no-repeat top center fixed;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  backdrop-filter: blur(5px);
}
</style>
