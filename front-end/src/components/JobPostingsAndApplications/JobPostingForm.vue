<script setup lang="ts">
const props = defineProps({
  showHelp: { type: Boolean, required: true },
  postingToEdit: { type: Object as () => JobBoardLink, required: false },
});
import "./JobPostingForm.scss";
import { parseJobPosting } from "../../services/ParseJobPosting";
import { ref } from "vue";
import {
  JobApplication,
  JobBoardLink,
  loadApplications,
} from "../../services/DataToSave";
import { setCookie } from "../../services/CookieManager";

const posting = ref("");
const link = ref("");
const sitePostingCameFrom = ref("");
const jobTitle = ref("");
const company = ref("");
const tags = ref("");

function submit(event: Event) {
  event.preventDefault();
  const applications = loadApplications();

  const newApplication: JobApplication = {
    jobTitle: "",
    company: "",
    date: "",
    linkToPosting: "",
    sitePostingCameFrom: "",
    jobDescription: "",
    id: 0,
    tags: [],
    applied: false,
  };

  newApplication.tags = tags.value.split(", ");

  //Add a new job posting, or edit an old one. -1 will be the default id that then gets updated.
  if (newApplication?.id === -1) {
    newApplication.id = Date.now();
    applications.push(newApplication);
  } else if (props.postingToEdit?.id && props.postingToEdit?.id >= 0) {
    applications[props.postingToEdit.id] = newApplication;
  } else {
    alert("Negative application id. Cannot edit.");
    return;
  }

  setCookie("Applications", JSON.stringify(applications));
  location.reload();
}
</script>

<template>
  <section>
    <h2>Enter A Job Posting / Application To Record</h2>

    <form @submit="submit">
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
      <label class="help" v-if="showHelp"
        >^ Copy and paste the job posting for it to be stored plus tagged and
        ranked for how good a fit it would be.</label
      >
      <br />

      <input v-model="link" placeholder="Link" />
      <label class="help" v-if="showHelp"
        >^ Copy and paste the link so you can find it later.</label
      >

      <br />

      <input
        v-model="sitePostingCameFrom"
        placeholder="Site Posting Came From"
      />
      <br />

      <input v-model="jobTitle" placeholder="Job Title" required />

      <br />

      <input v-model="company" placeholder="Company" required />

      <br />

      <input v-model="tags" placeholder="Tag1, Tag2" />
      <label class="help" v-if="showHelp"
        >^ Add tags for filtering later. You could enter
        <b>React, Tailwind</b> if the job involves that. Make sure to use commas
        and spaces to split them up.
      </label>

      <input type="submit" />
    </form>
  </section>
</template>
