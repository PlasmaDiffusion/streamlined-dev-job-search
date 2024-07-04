<script lang="ts">
export default {
  name: "LinkForm",
  props: {
    showHelp: Boolean,
  },
  mounted() {
    loadLinks();
  },
};
</script>
<script setup lang="ts">
import "./ListOfLinks.scss";
import { ref } from "vue";
import { JobBoardLink, loadLinks } from "../../services/DataToSave";
import { setCookie } from "../../services/CookieManager";

const colour = ref("");
const link = ref("");
const displayName = ref("");
const category = ref("");
const isCompanySite = ref(false);

function submit(event: any) {
  event.preventDefault();
  const newLink: JobBoardLink = {
    link: link.value,
    displayName: displayName.value,
    category: category.value,
    colour: colour.value || "blue",
    isCompanySite: isCompanySite.value,
    timesClicked: 0,
  };

  console.log(newLink);

  const links = loadLinks();
  links.push(newLink);

  setCookie("Links", JSON.stringify(links));
  location.reload();
}
</script>

<template>
  <section>
    <h2>Enter A Common Search Link</h2>

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
