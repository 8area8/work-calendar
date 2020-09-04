<template>
  <div class="main-content">
    <Navbar />
    <section class="section">
      <Calendar />
    </section>
  </div>
</template>

<script>
import Calendar from "../components/Calendar";
import Navbar from "../components/Navbar";

export default {
  name: "HomePage",

  components: {
    Calendar,
    NavBar
  }
};
</script>

<style lang="scss">
.main-content {
  background: url("../assets/desk.jpg") no-repeat top center fixed;
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  backdrop-filter: blur(5px);
}
</style>
