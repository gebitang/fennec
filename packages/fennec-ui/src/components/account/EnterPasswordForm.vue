<template>
  <v-form v-model="valid" class="form">
    <f-input
      v-model.trim="password"
      label="your password"
      type="password"
      class="text--center"
      :rules="rules.password"
      @keypress.native.enter="handleSubmit"
    />

    <f-button
      color="primary"
      class="mt-1"
      :loading="loading"
      :disabled="!valid"
      @click="handleSubmit"
    >
      {{ label }}
    </f-button>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class EnterPasswordForm extends Vue {
  @Prop() label!: string;

  loading = false;

  valid = false;

  password = "";

  get rules() {
    return {
      password: [(v) => !!v || "password is required"]
    };
  }

  handleSubmit() {
    if (this.valid) {
      this.tryUnlockKeyring();
    }
  }

  async tryUnlockKeyring() {
    this.loading = true;

    try {
      await this.$messages.tryUnlockKeyring(this.password);
      this.$emit("completed", this.password);
    } catch (error) {
      this.$emit("failed");
      this.$utils.helper.errorToast(this, error);
    }

    this.loading = false;
  }
}
export default EnterPasswordForm;
</script>

<style lang="scss" scoped>
.form {
  text-align: center;
}
</style>
