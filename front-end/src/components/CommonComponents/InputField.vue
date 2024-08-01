<script setup lang="ts">
const emit = defineEmits(["onUpdated"]);

defineProps({
  value: { type: String, required: true },
  showHelp: { type: Boolean, required: false },
  placeholder: { type: String, required: false },
  label: { type: String, required: true },
  helpText: { type: String, required: false },
});
</script>

<template>
  <label
    ><b>{{ label }}</b></label
  >
  <input
    :value="value"
    :onchange="(event:any)=>{emit('onUpdated',event)}"
    :placeholder="placeholder"
  />
  <label class="help" v-if="showHelp && helpText">{{ helpText }}</label>

  <br />
</template>
