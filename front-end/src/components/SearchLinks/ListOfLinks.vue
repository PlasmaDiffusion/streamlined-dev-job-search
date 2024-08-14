<script setup lang="ts">
import { ref } from "vue";
import { JobBoardLink } from "../../services/DataToSave";
import LinkForm from "./LinkForm.vue";
import CustomLink from "./CustomLink.vue";
import { removeLinkById } from "../../services/DataToSave";
import { setCookie } from "../../services/CookieManager";
const props = defineProps({
  fetchedLinks: {type: Object as () => JobBoardLink[], required: true },
  showHelp: { type: Boolean, required: true },
  listIsForCompanySiteLinks: { type: Boolean },
});

const links = ref<JobBoardLink[]>(props.fetchedLinks);
const editing = ref<JobBoardLink>();
const addingNewLink = ref(false);
let currentCategory = "";

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
    <h2 v-if="!editing && !addingNewLink">
      {{
        `Quick ${
          listIsForCompanySiteLinks ? "Company Site" : "Job Board"
        } Links`
      }}
    </h2>
    <div v-for="(link, index) in links" :key="link.id">
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
              links = removeLinkById(link.id);
            }
          "
          @onLinkClicked="
            () => {
              linkClicked(index);
            }
          "
        />
      </div>
    </div>

    <button
      :onClick="
        () => {
          addingNewLink = true;
          editing = undefined;
        }
      "
    >
      + New Link
    </button>
    <LinkForm
      v-if="editing || addingNewLink"
      :showHelp="showHelp"
      :linkToEdit="editing"
      :isForCompanySite="listIsForCompanySiteLinks"
      @closed="
        () => {
          addingNewLink = false;
          editing = undefined;
        }
      "
    />
  </section>
</template>
