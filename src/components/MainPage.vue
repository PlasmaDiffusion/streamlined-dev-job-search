<script>
export default {
  name: "MainPage",
  components: { JobPostingForm, LinkForm, ListOfLinks },
  props: {
    msg: String,
  },
};
</script>

<script setup>
import JobPostingForm from "./JobPostingForm.vue";
import { ref } from "vue";
import LinkForm from "./SearchLinks/LinkForm.vue";
import ListOfLinks from "./SearchLinks/ListOfLinks.vue";
const helpChecked = ref(false);
</script>

<template>
  <div>
    <h1>Streamlined Dev Job Searcher</h1>
    <JobPostingForm :showHelp="helpChecked" />
    <h2>Jobs Entered</h2>

    <h2>Search Links</h2>
    <LinkForm :showHelp="helpChecked" />
    <ListOfLinks />

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
