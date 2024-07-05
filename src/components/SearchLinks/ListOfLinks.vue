<script setup lang="ts">
import { ref } from "vue";
import { JobBoardLink, loadLinks } from "../../services/DataToSave";
import LinkForm from "./LinkForm.vue";
import { removeLinkAtIndex } from "../../services/DataToSave";

const links = ref<JobBoardLink[]>(loadLinks());
const editing = ref(-1);
</script>

<template>
  <section>
    <h2 v-if="editing === -1">Quick Search Links</h2>
    <div v-for="(link, index) in links" :key="link.id">
      <div
        v-if="editing === -1"
        class="category"
        :style="{ backgroundColor: link.colour }"
      >
        {{ link.category }}:
      </div>
      <div
        v-if="editing === -1"
        class="linkSection"
        :style="{ backgroundColor: link.colour }"
      >
        <span class="link">{{ link.displayName }}</span>
        <span class="timesClicked">(0 clicks) </span>
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
      <LinkForm
        v-if="editing === link.id"
        :showHelp="false"
        :linkToEdit="link"
        @closed="
          () => {
            editing = -1;
          }
        "
      />
    </div>
  </section>
</template>
