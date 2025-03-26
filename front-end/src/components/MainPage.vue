<script setup lang="ts">
//Handles fetching of links and applications, as well as settings like help
import { ref, watch } from "vue";
import ListOfLinks from "./SearchLinks/ListOfLinks.vue";
import ApplicationsSentGraph from "./Analytics/ApplicationsSentGraph.vue";
import {
  FetchedLinksResponse,
  fetchLinks,
} from "../services/API/JobSearchLinksApiCalls.ts";
import "./MainPage.scss";
import Loading from "./CommonComponents/Loading.vue";
import { ApplicationFetchMethod, JobApplication } from "../Interfaces.ts";
import { fetchApplications } from "../services/API/JobSearchApplicationsApiCalls.ts";
import ListOfJobApplications from "./JobPostingsAndApplications/ListOfJobApplications.vue";
import JobApplicationForm from "./JobPostingsAndApplications/JobApplicationForm.vue";
import TagsGraph from "./Analytics/TagsGraph.vue";

const helpChecked = ref(false);
const loading = ref(true);
const linkError = ref(false);
const applicationError = ref(false);
const applicationFetchMethod = ref(ApplicationFetchMethod.THIS_MONTH);

const fetchedLinks = ref<FetchedLinksResponse>({
  companySiteLinks: [],
  jobBoardLinks: [],
});
const fetchedApplications = ref<JobApplication[]>([]);

// Watch fetch settings to fetch with different parameters if needed
watch(() => applicationFetchMethod, fetchData, { immediate: true, deep: true });

async function fetchData() {
  //Fetch links to click on the sidebars
  const responseForLinks = await fetchLinks();
  if (!responseForLinks) {
    linkError.value = true;
  }
  fetchedLinks.value = responseForLinks?.data || {};

  //Fetch table of job applications
  const responseForApplications = await fetchApplications(
    applicationFetchMethod.value
  );
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
        <JobApplicationForm
          :previous-applications="fetchedApplications"
          :show-help="helpChecked"
        />
      </div>

      <div class="linksSection">
        <ListOfLinks
          v-if="!loading"
          :showHelp="helpChecked"
          :fetched-links="fetchedLinks.jobBoardLinks"
          showProgressBar
        />
        <Loading :loading="loading" :error="linkError" error-message="" />
      </div>
    </div>

    <div class="settings">
      <p>Show Help</p>
      <input
        type="checkbox"
        @change="
          () => {
            helpChecked = !helpChecked;
          }
        "
        :value="helpChecked"
      />
    </div>

    <div class="settings">
      <p class="smallText">Show Applications From</p>
      <button
        :onclick="
          () => (applicationFetchMethod = ApplicationFetchMethod.THIS_MONTH)
        "
      >
        This Month
      </button>
      <button
        :onclick="
          () => (applicationFetchMethod = ApplicationFetchMethod.THIS_YEAR)
        "
      >
        This Year
      </button>
      <button
        :onclick="
          () => (applicationFetchMethod = ApplicationFetchMethod.ALL_TIME)
        "
      >
        All Time
      </button>
    </div>

    <ListOfJobApplications
      :showHelp="helpChecked"
      :fetchedApplications="fetchedApplications"
      :fetchMethod="applicationFetchMethod"
    />
    <ApplicationsSentGraph
      v-if="fetchedApplications.length > 0"
      :applications="fetchedApplications"
    />
    <TagsGraph
      v-if="fetchedApplications.length > 0"
      :applications="fetchedApplications"
    />

    <div class="settings">
      <a href="https://www.hnhiringtrends.com/">Hacker News Hiring Trends</a>
      <a href="https://layoffs.fyi/">Layoff Graph</a>
    </div>
  </div>
</template>
