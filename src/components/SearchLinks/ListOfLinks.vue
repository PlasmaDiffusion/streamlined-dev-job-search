<script setup lang="ts">
import { ref } from "vue";
import { JobBoardLink, loadLinks } from "../../services/DataToSave";
import { sortLinksByCategory } from "../../services/Sorting";
import LinkForm from "./LinkForm.vue";
import { removeLinkAtIndex } from "../../services/DataToSave";
defineProps({
  showHelp: { type: Boolean, required: true },
  forCompanySiteLinks: { type: Boolean },
});

const links = ref<JobBoardLink[]>(sortLinksByCategory(loadLinks()));
const editing = ref(-1);
const addingNewLink = ref(false);
let currentCategory = "";

function checkIfNewCategory(category: string) {
  if (currentCategory !== category) {
    currentCategory = category;
    return true;
  }
  return false;
}
</script>

<template>
  <section>
    <h2 v-if="editing === -1 && !addingNewLink">
      {{ `Quick ${forCompanySiteLinks ? "Company Site" : "Job Board"} Links` }}
    </h2>
    <div v-for="(link, index) in links" :key="link.id">
      <div
        v-if="editing === -1 && checkIfNewCategory(link.category)"
        class="category"
        :style="{ color: link.colour }"
      >
        {{ link.category }}:
      </div>
      <div
        v-if="editing === -1 && !addingNewLink"
        class="linkSection"
        :style="{ color: link.colour }"
      >
        <div>
          <span class="linkIcon">➤ </span>
          <a class="link" :href="link.link">{{ link.displayName }}</a>
          <span class="timesClicked"> (0 clicks) </span>
          <span
            class="edit"
            :onclick="
              () => {
                editing = link.id;
              }
            "
            >✎</span
          >
          <span
            class="delete"
            :onclick="
              () => {
                links = removeLinkAtIndex(index);
              }
            "
            >🗑</span
          >
        </div>
      </div>
      <LinkForm
        v-if="editing === link.id"
        :showHelp="showHelp"
        :linkToEdit="link"
        @closed="
          () => {
            editing = -1;
          }
        "
      />
    </div>

    <button
      :onClick="
        () => {
          addingNewLink = true;
        }
      "
    >
      + New Link
    </button>
    <LinkForm
      v-if="editing === -1 && addingNewLink"
      :showHelp="showHelp"
      @closed="
        () => {
          addingNewLink = false;
        }
      "
    />
  </section>
</template>
