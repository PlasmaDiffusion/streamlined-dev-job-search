<script setup lang="ts">
import axios from "axios";

defineProps({
  msg: String,
});

import JobPostingForm from "./JobPostingsAndApplications/JobPostingForm.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import ListOfLinks from "./SearchLinks/ListOfLinks.vue";
import TestGraph from "./Analytics/TestGraph.vue";
import { FetchedLinksResponse } from "../services/API_Calls.ts";
import "./MainPage.scss";

const route = useRoute();
const helpChecked = ref(false);
const loading = ref(true);
const fetchedLinks = ref<FetchedLinksResponse>({
  companySiteLinks: [],
  jobBoardLinks: [],
});

// watch the params of the route to fetch the data again
watch(() => route, fetchData, { immediate: true });

function fetchData() {
  axios.get(`${import.meta.env.VITE_API_URL}`).then((response) => {
    fetchedLinks.value = response.data;
    loading.value = false;
  });
}
</script>

<template>
  <div>
    <div class="mainContainer">
      <div class="linksSection">
        <ListOfLinks
          v-if="!loading"
          :showHelp="helpChecked"
          :fetched-links="fetchedLinks.companySiteLinks"
          listIsForCompanySiteLinks
        />
        <p v-if="loading">Loading...</p>
      </div>

      <div id="jobApplicationSection">
        <h1>Streamlined Dev Job Searcher</h1>
        <JobPostingForm :showHelp="helpChecked" />
        <h2>Jobs Entered</h2>
      </div>

      <div class="linksSection">
        <ListOfLinks
          v-if="!loading"
          :showHelp="helpChecked"
          :fetched-links="fetchedLinks.jobBoardLinks"
        />
        <p v-if="loading">Loading...</p>
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
