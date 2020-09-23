<template>
  <div id="auth">
    <div class="hero auth-hero is-medium">
      <div class="hero-body back-image">
        <div class="container">
          <h1 class="title has-text-light">Authentification</h1>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <b-message
          v-if="authError"
          title="Problème"
          type="is-warning"
          aria-close-label="Close message"
        >
          Le nom d'utilisateur et/ou le mot de passe est invalide.
        </b-message>

        <form @keyup.enter="authenticate">
          <b-field label="Nom d'utilisateur">
            <b-input id="username" v-model="username"></b-input>
          </b-field>
          <b-field label="Mot de passe">
            <b-input id="password" password-reveal v-model="password"></b-input>
          </b-field>
          <b-button
            id="authenticate"
            type="is-warning"
            value="Submit"
            expanded
            @click="authenticate"
          >
            Authentifier
          </b-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { auth } from "../clean_architecture/services/auth";

@Component
export default class Calendar extends Vue {
  username = "";
  password = "";
  authError = false;
  auth = auth;

  async authenticate() {
    this.authError = false;
    const result = await this.auth.authenticate(this.username, this.password);
    if (result) {
      this.$router.push({ name: "Home" });
    } else {
      this.authError = true;
    }
  }
}
</script>

<style lang="scss"></style>
