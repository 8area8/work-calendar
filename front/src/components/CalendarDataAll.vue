<template>
  <div>
    <b-icon
      :class="{
        'is-invisible': !morningWorks.length,
      }"
      class="c-day__employee-preference"
      pack="fas"
      icon="sun"
      size="is-small"
    />
    <span class="c-day__employee-number">
      {{ morningWorks.length || null }}
    </span>
    <b-icon
      :class="{
        'is-invisible': !eveningWorks.length,
      }"
      class="c-day__employee-preference"
      pack="fas"
      icon="moon"
      size="is-small"
    />
    <span class="c-day__employee-number">
      {{ eveningWorks.length || null }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    eveningWorks: Array,
    morningWorks: Array,
  },
};
</script>

<style></style>
