<script>
export default {
  name: "MainPage",
  components: { JobPostingForm },
  props: {
    msg: String,
  },
};
</script>

<script setup>
import JobPostingForm from "./JobPostingForm.vue";
import { ref } from "vue";
const helpChecked = ref(false);
</script>

<template>
  <div>
    <h1>Streamlined Dev Job Searcher</h1>
    <JobPostingForm :showHelp="helpChecked" />
    <h2>Jobs Entered</h2>

    <div class="settings">
      <p>Show Help</p>
      <input
        type="checkbox"
        @change="(event)=>{
        console.log(helpChecked);
        helpChecked = !helpChecked;
        }"
        :value=helpChecked
      />
    </div>
  </div>
</template>

<style scoped>
h1 {
  padding: 2rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.settings {
  padding: 4px;
  text-align: center;
  display: flex;
  align-content: center;
  outline: 1px dashed grey;
  input {
    margin-top: 16px;
    margin-bottom: 16px;
  }
}
</style>
