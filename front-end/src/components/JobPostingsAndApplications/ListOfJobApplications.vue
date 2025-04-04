<script setup lang="ts">
import { ref, toRef } from "vue";
import { JobApplication } from "../../Interfaces";
import JobApplicationForm from "./JobApplicationForm.vue";
import { removeApplicationById } from "../../services/API/JobSearchApplicationsApiCalls";
import ApplicationRow from "./ApplicationTable/ApplicationRow.vue";
import ApplicationHeader from "./ApplicationTable/ApplicationHeader.vue";
import ProgressBar from "../CommonComponents/ProgressBar.vue";

//A large table of job applications fetched from MainPage. Renders components for each table row.
const props = defineProps({
  fetchedApplications: {
    type: Object as () => JobApplication[],
    required: true,
  },
  showHelp: { type: Boolean, required: true },
  fetchMethod: { type: Number, required: true },
});

const titles = [
  "",
  "Applications - This Month",
  "Applications - This Year",
  "Applications - All Time",
];

const applications = ref<JobApplication[]>(props.fetchedApplications);
const editing = ref<JobApplication>();
const currentTitle = toRef(props, "fetchMethod");

async function deleteClicked(application: JobApplication) {
  if (
    application.dateApplied &&
    window.confirm(`Delete application to ${application.company}?`)
  ) {
    const updatedLinkArray = await removeApplicationById(
      applications.value,
      application.dateApplied
    );
    if (updatedLinkArray) {
      applications.value = [...updatedLinkArray];
    }
  }
}
</script>

<template>
  <JobApplicationForm
    v-if="editing"
    :showHelp="showHelp"
    :applicationToEdit="editing"
    :previousApplications="fetchedApplications"
  />
  <section>
    <h2 v-if="props.fetchMethod > 0">
      {{ titles[currentTitle] }}
    </h2>
    <ProgressBar
      :v-if="fetchedApplications.length > 0"
      title="Target Goal"
      :amount="fetchedApplications.length"
      :maxAmount="70"
    />
    <div class="applicationTable">
      <table>
        <ApplicationHeader />
        <tr
          v-for="application in fetchedApplications"
          :key="application.dateApplied"
        >
          <ApplicationRow
            :application="application"
            @onEditClicked="
              () => {
                editing = application;
              }
            "
            @onDeleteClicked="
              () => {
                deleteClicked(application);
              }
            "
          />
        </tr>
      </table>
    </div>
  </section>
</template>
