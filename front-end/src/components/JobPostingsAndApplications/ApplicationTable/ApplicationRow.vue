<script setup lang="ts">
import { JobApplication } from "../../../Interfaces";
import "./ApplicationTable.scss";
import { ref } from "vue";

defineProps({
  application: {
    type: Object as () => JobApplication,
    required: true,
  },
});

const showFullJobDescription = ref(false);

function trimDate(date?: string) {
  if (date && date.includes("-")) {
    date = date.split(" ")[0];
    const dateSplitByDashes = date.split("-");
    if (dateSplitByDashes.length >= 2) {
      return `${dateSplitByDashes[1]} / ${dateSplitByDashes[2]}`;
    }
    return date;
  }
  return "n/a"
}

function trimJobDescriptionIntoPreview(jobDescription: string) {
  if (showFullJobDescription.value || jobDescription.length <= 120) {
    return jobDescription;
  }

  return jobDescription.substring(0, 120) + "...";
}
</script>

<template>
  <td
    class="jobDescription"
    :onclick="
      () => {
        showFullJobDescription = !showFullJobDescription;
      }
    "
  >
    {{ trimJobDescriptionIntoPreview(application.jobDescription) }}
  </td>
  <td>{{ application.linkToPosting }}</td>
  <td>{{ application.company }}</td>
  <td class="small" :title="application.dateApplied">{{ trimDate(application.dateApplied) }}</td>
  <td>{{ application.jobTitle }}</td>
  <td class="tags">{{ application.tags }}</td>
  <td class="small">
    <input type="checkbox" :checked="application.applied" />
  </td>
</template>
