<script setup lang="ts">
import { ref } from "vue";
import { JobBoardLink } from "../../Interfaces";
import LinkForm from "./LinkForm.vue";
import CustomLink from "./CustomLink.vue";
import {
  createOrUpdateLink,
  markLinkAsClicked,
  removeLinkById,
} from "../../services/API/JobSearchLinksApiCalls";
import Modal from "../CommonComponents/Modal.vue";

const props = defineProps({
  fetchedLinks: { type: Object as () => JobBoardLink[], required: true },
  showHelp: { type: Boolean, required: true },
  listIsForCompanySiteLinks: { type: Boolean },
});

const links = ref<JobBoardLink[]>(props.fetchedLinks);
const editing = ref<JobBoardLink>();
const addingNewLink = ref(false);
const linkRecentlyClicked = ref<JobBoardLink>();

let currentCategory = "";

function checkIfNewCategory(category: string) {
  if (currentCategory !== category) {
    currentCategory = category;
    return true;
  }
  return false;
}

function linkClicked(link: JobBoardLink) {
  linkRecentlyClicked.value = link;
  createOrUpdateLink(link, true);
}

async function deleteClicked(link: JobBoardLink) {
  if (window.confirm(`Delete ${link.displayName}?`)) {
    const updatedLinkArray = await removeLinkById(links.value, link.id);
    if (updatedLinkArray) {
      links.value = [...updatedLinkArray];
    }
  }
}
</script>

<template>
  <section>
    <h2 v-if="!editing && !addingNewLink" class="linkHeading">
      {{
        `${
          listIsForCompanySiteLinks ? "Company Site" : "Job Board"
        } Links`
      }}
    </h2>
    <Modal
      v-if="linkRecentlyClicked"
      :title="`${linkRecentlyClicked?.displayName} (${linkRecentlyClicked.category})`"
      message="Did you find and apply to roles to after clicking the link? (This will give the link +1 clicks, making it more likely to appear first on the list)"
      leftOption="No"
      rightOption="Yes"
      @on-click-left-option="
        () => {
          linkRecentlyClicked = undefined;
        }
      "
      @on-click-right-option="
        async () => {
          if (linkRecentlyClicked) {
            await markLinkAsClicked(linkRecentlyClicked);
            linkRecentlyClicked = undefined;
          }
        }
      "
    />
    <div class="overflow">
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
