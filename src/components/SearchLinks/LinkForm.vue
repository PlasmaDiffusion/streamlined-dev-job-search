<script setup lang="ts">
const props = defineProps({
  showHelp: { type: Boolean, required: true },
  linkToEdit: { type: Object as () => JobBoardLink, required: false },
});

import "./ListOfLinks.scss";
import { ref } from "vue";
import { JobBoardLink, loadLinks } from "../../services/DataToSave";
import { setCookie } from "../../services/CookieManager";

const emit = defineEmits(["closed"]);

const colour = ref(props.linkToEdit?.colour || "");
const link = ref(props.linkToEdit?.link || "");
const displayName = ref(props.linkToEdit?.displayName || "");
const category = ref(props.linkToEdit?.category || "");
const isCompanySite = ref(props.linkToEdit?.isCompanySite || false);

function submit(this: any, event: any) {
  event.preventDefault();
  const links = loadLinks();

  const newLink: JobBoardLink = {
    link: link.value,
    displayName: displayName.value,
    category: category.value,
    colour: colour.value || "blue",
    isCompanySite: isCompanySite.value,
    timesClicked: 0,
    id: props.linkToEdit?.id || -1,
  };

  //Add a new link, or edit an old one. -1 will be the default id that then gets updated.
  if (newLink?.id === -1) {
    newLink.id = links.length;
    links.push(newLink);
  } else if (props.linkToEdit?.id && props.linkToEdit?.id >= 0) {
    links[props.linkToEdit.id] = newLink;
  } else {
    alert("Negative link id. Cannot edit.");
    return;
  }

  setCookie("Links", JSON.stringify(links));
  location.reload();
}
</script>

<template>
  <section>
    <h2 v-if="linkToEdit" :style="{ backgroundColor: colour }">
      <button
        class="cancel"
        :onclick="
          () => {
            emit('closed');
          }
        "
      >
        X
      </button>
      Edit {{ linkToEdit.displayName }} Link
    </h2>
    <h2 v-else>
      <button
        class="cancel"
        :onclick="
          () => {
            emit('closed');
          }
        "
      >
        X
      </button>
      Enter A Common Search Link
    </h2>

    <form @submit="submit">
      <label><b>Link</b></label>
      <input v-model="link" placeholder="Link" />
      <label class="help" v-if="showHelp"
        >^ Add a common link you'll use that will help you with your
        search.</label
      >
      <br />

      <label><b>Name Of Site</b></label>
      <input v-model="displayName" placeholder="Name Of Site" />
      <label class="help" v-if="showHelp"
        >^ Add a name to identity the link.</label
      >
      <br />

      <label><b>Category</b></label>
      <input v-model="category" placeholder="Category" />
      <label class="help" v-if="showHelp"
        >^ Links that are clicked more often will show up first in their
        specific category.</label
      >

      <br />

      <label><b>Colour</b></label>
      <input v-model="colour" placeholder="Colour" />

      <br />

      <label><b>Is Company Site</b></label>
      <input type="checkbox" v-model="isCompanySite" />
      <label class="help" v-if="showHelp"
        >^ Job search sites will be shown on the right of this page. Company
        sites will be on the left.</label
      >

      <br />
      <input type="submit" />
      <p class="help">{{ props.linkToEdit?.id }}</p>
    </form>

    <div>
      <p class>Preview</p>
      <div class="category" :style="{ backgroundColor: colour }">
        {{ category }}:
      </div>
      <div class="linkSection" :style="{ backgroundColor: colour }">
        {{ displayName }} <span class="timesClicked">(0 clicks)</span>
      </div>
    </div>
  </section>
</template>
