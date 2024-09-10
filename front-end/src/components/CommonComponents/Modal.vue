<script setup lang="ts">
const emit = defineEmits([
  "onClickLeftOption",
  "onClickRightOption",
  "onClickDefaultOption",
]);
import "./Modal.scss";

defineProps({
  title: { type: String, required: false },
  message: { type: String, required: true },
  leftOption: { type: String, required: false },
  rightOption: { type: String, required: false },
  defaultOption: { type: String, required: false },
  absolutePosition: { type: Boolean, required: false },
});
</script>

<template>
  <section class="modal" v-bind:class="{ absolute: absolutePosition }">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <div v-if="!leftOption && !rightOption">
      <button>Okay</button>
    </div>
    <div v-if="leftOption && rightOption" class="buttonRow">
      <button
        :onclick="
          () => {
            emit('onClickLeftOption');
          }
        "
      >
        {{ leftOption }}
      </button>
      <button
        :onclick="
          () => {
            if (!rightOption) {
              emit('onClickDefaultOption');
            } else {
              emit('onClickRightOption');
            }
          }
        "
      >
        {{ rightOption }}
      </button>
    </div>
  </section>
</template>
