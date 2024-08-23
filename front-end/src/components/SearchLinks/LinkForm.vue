<script setup lang="ts">
const props = defineProps({
  showHelp: { type: Boolean, required: true },
  linkToEdit: { type: Object as () => JobBoardLink, required: false },
  isForCompanySite: { type: Boolean, required: false },
});

import "./ListOfLinks.scss";
import { ref } from "vue";
import { JobBoardLink } from "../../services/DataToSave";
import InputField from "../CommonComponents/InputField.vue";
import axios, { AxiosResponse } from "axios";

const emit = defineEmits(["closed"]);

const colour = ref(props.linkToEdit?.colour || "");
const link = ref(props.linkToEdit?.link || "");
const displayName = ref(props.linkToEdit?.displayName || "");
const category = ref(props.linkToEdit?.category || "");
const isCompanySite = ref(props.isForCompanySite);

async function submit(this: any, event: any) {
  event.preventDefault();

  const linkToAddOrEdit: JobBoardLink = {
    link: link.value,
    user: 'guest',
    displayName: displayName.value,
    category: category.value,
    colour: colour.value || "blue",
    isCompanySite: isCompanySite.value,
    timesClicked: props.linkToEdit?.timesClicked || 0,
    id: props.linkToEdit?.id || -1,
    lastClicked: undefined,
  };

  let response: AxiosResponse<any, any> | undefined = undefined;

  //Add a new link, or edit an old one. -1 will mean it's a new one needing an id.
  if (linkToAddOrEdit.id === -1 || linkToAddOrEdit.id === undefined) {
    linkToAddOrEdit.id = Math.floor(Date.now() / 1000);

    response = await axios.post(
      `${import.meta.env.VITE_API_URL}`,
      linkToAddOrEdit
    );
    console.log(response);
  } else if (linkToAddOrEdit.id) {
    response = await axios.patch(
      `${import.meta.env.VITE_API_URL}`,
      linkToAddOrEdit
    );
    console.log(response);
  }

  if (response?.status !== 200) {
    alert("Couldn't add or modify link");
    console.warn(response);
  }
  else {
    location.reload();
  }
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
      <InputField
        label="Link"
        :showHelp="showHelp"
        helpText="^ Add a common link you'll use that will help you with your search."
        :value="link"
        @onUpdated="(e : any) => { link = e.target.value; }"
      />

      <InputField
        label="Name Of Site"
        :showHelp="showHelp"
        helpText="^ Add a name to identify the link."
        :value="displayName"
        @onUpdated="(e : any) => { displayName = e.target.value; }"
      />

      <InputField
        label="Category"
        :showHelp="showHelp"
        helpText="^ Links that are clicked more often will show up first in their
        specific category."
        :value="category"
        @onUpdated="(e : any) => { category = e.target.value; }"
      />

      <InputField
        label="Colour"
        :value="colour"
        @onUpdated="(e : any) => { colour = e.target.value; }"
      />

      <label
        ><b>Is Company Site</b></label
      >
      <input
        type="checkbox"
        v-model="isCompanySite"
        :checked="isForCompanySite"
      />
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
      <div class="category" :style="{ color: colour }">{{ category }}:</div>
      <div class="linkSection" :style="{ color: colour }">
        <span class="linkIcon">➤ </span><a :href="link">{{ displayName }}</a>
        <span class="timesClicked"> (0 clicks)</span>
      </div>
    </div>
  </section>
</template>
