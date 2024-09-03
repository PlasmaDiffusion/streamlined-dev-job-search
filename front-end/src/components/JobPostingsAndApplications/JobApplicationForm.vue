<script setup lang="ts">
defineProps({
  showHelp: { type: Boolean, required: true },
  applicationToEdit: { type: Object as () => JobApplication, required: false },
});
import "./JobApplicationForm.scss";
import { parseJobPosting } from "../../services/ParseJobPosting";
import { ref } from "vue";
import { JobApplication } from "../../Interfaces";
import { createOrUpdateApplication } from "../../services/API/JobSearchApplicationsApiCalls";
import InputField from "../CommonComponents/InputField.vue";
const posting = ref("");
const link = ref("");
const jobTitle = ref("");
const company = ref("");
const tags = ref("");

function submit(event: Event) {
  event.preventDefault();

  const application: JobApplication = {
    jobTitle: "",
    company: "",
    date: "",
    linkToPosting: "",
    sitePostingCameFrom: "",
    jobDescription: "",
    id: -1,
    tags: [],
    applied: false,
  };

  application.tags = tags.value.split(", ");

  createOrUpdateApplication(application);
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

      <InputField
        label="Link"
        :showHelp="showHelp"
        helpText="^ Copy and paste the link to the posting so you can find it later."
        :value="link"
        @onUpdated="(e : any) => { link = e.target.value; }"
      />

      <InputField
        label="Job Title"
        :showHelp="showHelp"
        :value="jobTitle"
        @onUpdated="(e : any) => { jobTitle = e.target.value; }"
      />

      <InputField
        label="Company"
        :showHelp="showHelp"
        :value="jobTitle"
        @onUpdated="(e : any) => { company = e.target.value; }"
      />

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
