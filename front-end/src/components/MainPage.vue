
<script setup lang="ts">
//Handles fetching of links and applications, as well as settings like help

defineProps({
  msg: String,
});

import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import ListOfLinks from "./SearchLinks/ListOfLinks.vue";
import TestGraph from "./Analytics/TestGraph.vue";
import {
  FetchedLinksResponse,
  fetchLinks,
} from "../services/API/JobSearchLinksApiCalls.ts";
import "./MainPage.scss";
import Loading from "./CommonComponents/Loading.vue";
import { ApplicationFetchMethod, JobApplication } from "../Interfaces.ts";
import { fetchCurrentMonthApplications } from "../services/API/JobSearchApplicationsApiCalls.ts";
import ListOfJobApplications from "./JobPostingsAndApplications/ListOfJobApplications.vue";
import JobApplicationForm from "./JobPostingsAndApplications/JobApplicationForm.vue";

const route = useRoute();
const helpChecked = ref(false);
const loading = ref(true);
const linkError = ref(false);
const applicationError = ref(false);

const fetchedLinks = ref<FetchedLinksResponse>({
  companySiteLinks: [],
  jobBoardLinks: [],
});
const fetchedApplications = ref<JobApplication[]>([]);

// watch the params of the route to fetch the data again
watch(() => route, fetchData, { immediate: true });

async function fetchData() {
  const responseForLinks = await fetchLinks();
  if (!responseForLinks) {
    linkError.value = true;
  }
  fetchedLinks.value = responseForLinks?.data || {};
  const responseForApplications = await fetchCurrentMonthApplications();
  if (!responseForApplications) {
    applicationError.value = true;
  }
  fetchedApplications.value = responseForApplications?.data || [];
  loading.value = false;
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
        <Loading
          :loading="loading"
          :error="linkError"
          error-message="Couldn't fetch links. Server might be down."
        />
      </div>

      <div id="jobApplicationSection">
        <h1>Streamlined Dev Job Searcher</h1>
        <JobApplicationForm :previous-applications="fetchedApplications" :show-help="helpChecked"/>
      </div>

      <div class="linksSection">
        <ListOfLinks
          v-if="!loading"
          :showHelp="helpChecked"
          :fetched-links="fetchedLinks.jobBoardLinks"
        />
        <Loading :loading="loading" :error="linkError" error-message="" />
      </div>
    </div>

    <ListOfJobApplications :showHelp="helpChecked" :fetchedApplications="fetchedApplications" :fetchMethod="ApplicationFetchMethod.THIS_MONTH" />


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
