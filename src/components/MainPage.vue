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
import JobPostingForm from "./JobPostingsAndApplications/JobPostingForm.vue";
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