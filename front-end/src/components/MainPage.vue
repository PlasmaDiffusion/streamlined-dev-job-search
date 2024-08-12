<script>
import axios from "axios";

export default {
  name: "MainPage",
  components: { JobPostingForm, LinkForm, ListOfLinks, TestGraph },
  props: {
    msg: String,
  },
};

import JobPostingForm from "./JobPostingsAndApplications/JobPostingForm.vue";
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import LinkForm from "./SearchLinks/LinkForm.vue";
import ListOfLinks from "./SearchLinks/ListOfLinks.vue";
import TestGraph from "./Analytics/TestGraph.vue";
import "./MainPage.scss";
const helpChecked = ref(false);

const route = useRoute();

const loading = ref(false);
const post = ref(null);
const error = ref(null);
const fetchedLinks = ref(null);

// watch the params of the route to fetch the data again
watch(() => route, fetchData, { immediate: true });

async function fetchData() {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}`);
  fetchedLinks.value = response.data;
  console.log("*", response);
}
</script>

<template>
  <div>
    <div class="mainContainer">
      <div class="linksSection">
        <ListOfLinks
          :showHelp="helpChecked"
          :fetched-links="fetchedLinks.companySiteLinks || []"
          listIsForCompanySiteLinks
        />
      </div>

      <div id="jobApplicationSection">
        <h1>Streamlined Dev Job Searcher</h1>
        <JobPostingForm :showHelp="helpChecked" />
        <h2>Jobs Entered</h2>
      </div>

      <div class="linksSection">
        <ListOfLinks
          :showHelp="helpChecked"
          :fetched-links="fetchedLinks.jobBoardLinks || []"
        />
      </div>
    </div>

    <div class="settings">
      <p>Show Help</p>
      <input
        type="checkbox"
        @change="
          (event) => {
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
