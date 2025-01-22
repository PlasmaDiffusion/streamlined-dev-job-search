<script setup lang="ts">
import { JobApplication } from "../../../Interfaces";
import {
  addTh,
  getShortNameOfMonthFromDate,
} from "../../../services/DateManager";
import "./ApplicationTable.scss";
import { ref } from "vue";

defineProps({
  application: {
    type: Object as () => JobApplication,
    required: true,
  },
});
const emit = defineEmits(["onEditClicked", "onDeleteClicked"]);

const showFullJobDescription = ref(false);

function trimDate(date?: string) {
  if (date && date.includes("-")) {
    date = date.split(" ")[0];
    const dateSplitByDashes = date.split("-");
    if (dateSplitByDashes.length >= 2) {
      return `${getShortNameOfMonthFromDate(date)}. ${addTh(
        parseInt(dateSplitByDashes[2])
      )}`;
    }
    return date;
  }
  return "n/a";
}

function trimText(text: string, characterLimit: number, remove?: string) {
  if (remove) {
    text = text.replace(remove, "");
  }

  if (showFullJobDescription.value || text.length <= characterLimit) {
    return text;
  }

  return text.substring(0, characterLimit) + "...";
}
</script>

<template>
  <td
    class="jobDescription"
    v-bind:class="{ showLineBreaks: showFullJobDescription }"
    :onclick="
      () => {
        showFullJobDescription = !showFullJobDescription;
      }
    "
  >
    {{ trimText(application.jobDescription, 120) }}
  </td>
  <td class="small">
    <a :href="application.linkToPosting">{{
      trimText(application.linkToPosting, 25, "https://")
    }}</a>
  </td>
  <td class="shadow">{{ application.company }}</td>
  <td class="medium shadow">{{ application.jobTitle }}</td>
  <td class="small" :title="application.dateApplied">
    {{ trimDate(application.dateApplied) }}
  </td>
  <td class="tags">{{ application.tags }}</td>
  <td class="small">
    <input type="checkbox" :checked="application.applied" />
  </td>
  <td class="small">
    <span
      class="edit"
      title="Edit"
      :onclick="
        () => {
          emit('onEditClicked');
        }
      "
      >✎</span
    >
    <span
      class="delete"
      title="Delete"
      :onclick="
        () => {
          emit('onDeleteClicked');
        }
      "
      >🗑</span
    >
  </td>
</template>
