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
import { fetchCurrentMonthApplications, FetchedLinksResponse, fetchLinks } from "../services/API_Calls.ts";
import "./MainPage.scss";
import Loading from "./CommonComponents/Loading.vue";
import { JobApplication } from "../services/DataToSave.ts";

const route = useRoute();
const helpChecked = ref(false);
const loading = ref(true);
const error = ref(false);
const fetchedLinks = ref<FetchedLinksResponse>({
  companySiteLinks: [],
  jobBoardLinks: [],
});
const fetchedApplications = ref<JobApplication>([]);

// watch the params of the route to fetch the data again
watch(() => route, fetchData, { immediate: true });

async function fetchData() {
  try {
    const response = await fetchLinks();
    fetchedLinks.value = response.data;
    const responseApplications = await fetchCurrentMonthApplications();
    fetchedApplications.value = responseApplications.data;
    loading.value = false;
 } catch (e) {
    error.value = true;
    console.warn(e);
  }
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
        <Loading :loading=loading :error=error error-message="Couldn't fetch links. Server might be down." />
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
        <Loading :loading=loading :error=error error-message="" />
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
