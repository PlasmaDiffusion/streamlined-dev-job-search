<script lang="ts">
export default {
  name: "JobPostingForm",
  props: {
    showHelp: Boolean,
  },
};
</script>
<script setup lang="ts">
import "./JobPostingForm.scss";
import { parseJobPosting } from "../../services/ParseJobPosting";
import { ref } from "vue";
import { Application } from "../../services/DataToSave";
import { setCookie } from "../../services/CookieManager";

const posting = ref("");
const link = ref("");

function submit(event: Event) {
  const newApplication: Application = {
    jobTitle: "",
    company: "",
    date: "",
    linkOfPosting: "",
    sitePostingCameFrom: "",
    posting: "",
    id: 0,
  };
  setCookie(
    newApplication.company + " " + newApplication.jobTitle,
    newApplication
  );
}
</script>

<template>
  <section>
    <h2>Enter A Job Posting</h2>

    <form @submit="submit">
      <label v-if="showHelp"
        >Copy and paste the job posting for it to be stored plus tagged and
        ranked for how good a fit it would be.</label
      >
      <textarea
        v-model="posting"
        name="posting"
        placeholder="Job Posting"
        @keyup="
          (event) => {
            //@ts-ignore
            console.log(parseJobPosting(event.target.value));
          }
        "
      ></textarea>
      <br />

      <label v-if="showHelp"
        >Copy and paste the link so you can find it later.</label
      >

      <input v-model="link" placeholder="Link" />

      <br />
      <input type="submit" />
    </form>
  </section>
</template>
