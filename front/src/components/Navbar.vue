<template>
  <b-navbar type="is-dark">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        {{ title }}
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item
        v-if="auth.isAdmin"
        tag="router-link"
        :to="{ name: 'Employees' }"
      >
        Employés
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { auth } from "../clean_architecture/services/auth";
export default {
  data() {
    return {
      auth: auth,
      title: process.env.VUE_APP_TITLE || "Calendar",
    };
  },
};
</script>
