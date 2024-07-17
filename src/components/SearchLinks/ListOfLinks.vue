<script setup lang="ts">
import { ref } from "vue";
import { JobBoardLink, loadLinks } from "../../services/DataToSave";
import { sortLinksByCategory } from "../../services/Sorting";
import LinkForm from "./LinkForm.vue";
import { removeLinkAtIndex } from "../../services/DataToSave";
import { setCookie } from "../../services/CookieManager";
defineProps({
  showHelp: { type: Boolean, required: true },
  listIsForCompanySiteLinks: { type: Boolean },
});

const links = ref<JobBoardLink[]>(sortLinksByCategory(loadLinks()));
const editing = ref(-1);
const addingNewLink = ref(false);
let currentCategory = "";

const currentDate = new Date();
const currentDay = currentDate.getDay();
const currentMonth = currentDate.getMonth();

function checkIfNewCategory(category: string) {
  if (currentCategory !== category) {
    currentCategory = category;
    return true;
  }
  return false;
}

function linkClicked(indexOfLinkClicked: number) {
  const linksToUpdate: JobBoardLink[] = links.value;

  linksToUpdate[indexOfLinkClicked].timesClicked++;
  const date = new Date();
  linksToUpdate[indexOfLinkClicked].lastClicked = {
    day: date.getDay(),
    month: date.getMonth(),
    year: date.getFullYear(),
  };

  links.value = [...linksToUpdate];
  setCookie("Links", JSON.stringify(linksToUpdate));
}
</script>

<template>
  <section>
    <h2 v-if="editing === -1 && !addingNewLink">
      {{
        `Quick ${
          listIsForCompanySiteLinks ? "Company Site" : "Job Board"
        } Links`
      }}
    </h2>
    <div v-for="(link, index) in links" :key="link.id">
      <div v-if="link.isCompanySite === listIsForCompanySiteLinks">
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
            <span class="linkIcon" :title="`Id: ${link.id}`">➤ </span>
            <a
              class="link"
              target="_blank"
              noopener
              noreferrer
              :onclick="
                () => {
                  linkClicked(index);
                }
              "
              :href="link.link"
              >{{ link.displayName }}</a
            >
            <span
              v-if="
                link.lastClicked &&
                link.lastClicked.day === currentDay &&
                link.lastClicked.month === currentMonth
              "
            >
              ✔</span
            >
            <span class="timesClicked"> ({{ link.timesClicked }} clicks) </span>
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
