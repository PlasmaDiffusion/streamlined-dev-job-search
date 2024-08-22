<script setup lang="ts">
const emit = defineEmits(["onClickLeftOption", "onClickRightOption"]);

defineProps({
  title: { type: String, required: false },
  message: { type: String, required: true },
  leftOption: { type: String, required: false },
  rightOption: { type: String, required: false },
});
</script>

<template>
  <section>
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <div v-if="!leftOption && !rightOption">
      <button>Okay</button>
    </div>
    <div v-if="leftOption && rightOption">
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
            emit('onClickRightOption');
          }
        "
      >
        {{ rightOption }}
      </button>
    </div>
  </section>
</template>
