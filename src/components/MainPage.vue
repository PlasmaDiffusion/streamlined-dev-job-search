<script>
export default {
  name: "MainPage",
  components: { JobPostingForm, LinkForm, ListOfLinks, TestGraph },
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
import TestGraph from "./Analytics/TestGraph.vue";
import "./MainPage.scss";
const helpChecked = ref(false);
</script>

<template>
  <div>
    <div class="mainContainer">
      <div class="linksSection">
        <ListOfLinks :showHelp="helpChecked" listIsForCompanySiteLinks />
      </div>

      <div id="jobApplicationSection">
        <h1>Streamlined Dev Job Searcher</h1>
        <JobPostingForm :showHelp="helpChecked" />
        <h2>Jobs Entered</h2>
      </div>

      <div class="linksSection">
        <ListOfLinks :showHelp="helpChecked" />
      </div>
    </div>

    <div class="settings">
      <p>Show Help</p>
      <input
        type="checkbox"
        @change="
          (event) => {
            console.log(helpChecked);
            helpChecked = !helpChecked;
          }
        "
        :value="helpChecked"
      />
    </div>
    <TestGraph />
    <a href="https://www.hnhiringtrends.com/">Hacker News Hiring Trends</a>
    <a href="https://layoffs.fyi/">Layoff Graph</a>
  </div>
</template>
