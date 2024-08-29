<script setup lang="ts">
import { ref } from "vue";
import { ApplicationFetchMethod, JobApplication } from "../../Interfaces";
import JobApplicationForm from "./JobApplicationForm.vue";
import { removeApplicationById } from "../../services/API/JobApplicationsApiCalls";

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
const addingNewLink = ref(false);
const currentTitle = titles[props.fetchMethod];

async function deleteClicked(application: JobApplication) {
  if (window.confirm(`Delete application to ${application.company}?`)) {
    const updatedLinkArray = await removeApplicationById(
      applications.value,
      application.id
    );
    if (updatedLinkArray) {
      applications.value = [...updatedLinkArray];
    }
  }
}
</script>

<template>
  <JobApplicationForm :showHelp="showHelp" :applicationToEdit="editing" />
  <section>
    <h2 v-if="props.fetchMethod > 0">
      {{ currentTitle }}
    </h2>
    <div v-for="link in links" :key="link.id">
      <div v-if="link.isCompanySite === listIsForCompanySiteLinks">
        <div
          v-if="!editing && checkIfNewCategory(link.category)"
          class="category"
          :style="{ color: link.colour }"
        >
          {{ link.category }}:
        </div>
        <CustomLink
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
        />
      </div>
    </div>
  </section>
</template>
