<template>
  <div class="back-image back-image--full">
    <section class="section">
      <Calendar />
    </section>
  </div>
</template>

<script>
import Calendar from "../components/Calendar";

export default {
  name: "HomePage",

  components: {
    Calendar,
  },
};
</script>
