<script setup lang="ts">

defineProps({
  loading: { type: Boolean, required: true },
  error: { type: Boolean, required: true },
  loadingMessage: { type: String, default: "Fetching..." },
  errorMessage: { type: String, default : "Couldn't Fetch. Server might be down." },
});
</script>

<template>
  <p v-if="loading">{{ error ? errorMessage : loadingMessage }}</p>
</template>
