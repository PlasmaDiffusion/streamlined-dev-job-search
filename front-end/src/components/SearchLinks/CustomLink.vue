<script setup lang="ts">
import { JobBoardLink } from "../../Interfaces";
import {
  checkIfDateIsTodaysDate,
  getLastClickedText,
} from "../../services/DateManager";

defineProps({
  link: { type: Object as () => JobBoardLink, required: true },
  editing: Boolean,
  addingNewLink: Boolean,
});

const emit = defineEmits(["onLinkClicked", "onEditClicked", "onDeleteClicked"]);
</script>

<template>
  <div class="linkSection" :style="{ color: link.colour }">
    <div>
      <span class="linkIcon" :title="`Id: ${link.id}`">➤ </span>
      <a
        class="link"
        target="_blank"
        noopener
        noreferrer
        :onclick="
          () => {
            emit('onLinkClicked');
          }
        "
        :href="link.link"
        >{{ link.displayName }}</a
      >
    </div>
    <div>
      <span
        v-if="checkIfDateIsTodaysDate(link.lastClicked)"
        :title="getLastClickedText(link.lastClicked)"
      >
        ✔</span
      >
      <span class="timesClicked" :title="getLastClickedText(link.lastClicked)">
        ({{ link.timesClicked }} clicks)
      </span>
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
    </div>
  </div>
</template>
