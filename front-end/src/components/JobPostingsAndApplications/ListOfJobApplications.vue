<script setup lang="ts">
import { ref } from "vue";
import { ApplicationFetchMethod, JobApplication } from "../../Interfaces";
import JobApplicationForm from "./JobApplicationForm.vue";
import { removeApplicationById } from "../../services/API/JobSearchApplicationsApiCalls";
import ApplicationRow from "./ApplicationTable/ApplicationRow.vue";
import ApplicationHeader from "./ApplicationTable/ApplicationHeader.vue";

const props = defineProps({
  fetchedApplications: {
    type: Object as () => JobApplication[],
    required: true,
  },
  showHelp: { type: Boolean, required: true },
  fetchMethod: { type: Object as () => ApplicationFetchMethod, required: true },
});

const titles = [
  "",
  "Applications - This Month",
  "Applications - This Year",
  "Applications - All Time",
];

const applications = ref<JobApplication[]>(props.fetchedApplications);
const editing = ref<JobApplication>();
const currentTitle = titles[props.fetchMethod];

async function deleteClicked(application: JobApplication) {
  if (window.confirm(`Delete application to ${application.company}?`)) {
    const updatedLinkArray = await removeApplicationById(
      applications.value,
      application.dateApplied || ""
    );
    if (updatedLinkArray) {
      applications.value = [...updatedLinkArray];
    }
  }
}
</script>

<template>
  <JobApplicationForm v-if="editing" :showHelp="showHelp" :applicationToEdit="editing" />
  <section>
    <h2 v-if="props.fetchMethod > 0">
      {{ currentTitle }}
    </h2>
    <div class="applicationTable">
    <table >
      <ApplicationHeader/>
      <tr
        v-for="application in fetchedApplications"
        :key="application.dateApplied"
      >
        <ApplicationRow :application="application" />
        <!-- <CustomLink
          v-if="!editing && !addingNewLink"
          :link="link"
          @onEditClicked="
            () => {
              editing = link;
            }
          "
          @onDeleteClicked="
            () => {
              deleteClicked(link);
            }
          "
          @onLinkClicked="
            () => {
              linkClicked(link);
            }
          "
        /> -->
      </tr>
    </table>
  </div>
  </section>
</template>
