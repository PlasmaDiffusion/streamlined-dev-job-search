<script setup lang="ts">
const props = defineProps({
  showHelp: { type: Boolean, required: true },
  applicationToEdit: { type: Object as () => JobApplication, required: false },
  previousApplications: {
    type: Object as () => JobApplication[],
    required: true,
  },
});
import "./JobApplicationForm.scss";
import { parseJobPostingTags } from "../../services/ParseJobPosting";
import { parseJobPostingWithAI } from "../../services/API/ParseJobPostingApiCalls";
import { ref } from "vue";
import { JobApplication } from "../../Interfaces";
import { createOrUpdateApplication } from "../../services/API/JobSearchApplicationsApiCalls";
import InputField from "../CommonComponents/InputField.vue";
const jobDescription = ref("");
const link = ref("");
const jobTitle = ref("");
const company = ref("");
const tags = ref("");
const applied = ref(true);
const timesAlreadyApplied = ref(0);
const parsingAI = ref(false);
let parseRequestId = 0;

//Detect tags as the user types or pastes in the job description
function onJobDescriptionKeyup() {
  if (!tags.value) tags.value = parseJobPostingTags(jobDescription.value);
}

//Detect job title and company when the user finishes pasting in the job description, but only if those fields aren't already filled out.
//Use parseRequestId to ensure that if the user quickly changes and on focuses the job description text area multiple times, we only update the title and company based on the most recent version.
async function onJobDescriptionBlur() {
  const text = jobDescription.value.trim();
  if (!text || (jobTitle.value && company.value)) return;

  const requestId = ++parseRequestId;
  parsingAI.value = true;
  const parsed = await parseJobPostingWithAI(text);

  if (requestId !== parseRequestId) return;
  parsingAI.value = false;

  if (parsed) {
    if (!jobTitle.value) jobTitle.value = parsed.jobTitle;
    if (!company.value) {
      company.value = parsed.company;
      updateTimesPreviouslyAppliedToSameCompany(parsed.company, props.previousApplications);
    }
  }
}

function submit(event: Event) {
  event.preventDefault();

  const application: JobApplication = {
    user: "guest",
    dateApplied: "",
    company: company.value,
    jobTitle: jobTitle.value,
    linkToPosting: link.value,
    jobDescription: jobDescription.value,
    tags: [],
    applied: applied.value,
  };

  application.tags = tags.value.split(", ");

  createOrUpdateApplication(application);
}

function updateTimesPreviouslyAppliedToSameCompany(
  company: string,
  previousApplications: JobApplication[]
) {
  if (company === "") return;
  timesAlreadyApplied.value =
    previousApplications?.filter((app) => app.company === company).length || 0;
}
</script>

<template>
  <section>
    <h2>Enter A Job Posting / Application To Record</h2>

    <form @submit="submit">
      <b>Job Description</b>
      <textarea
        v-model="jobDescription"
        name="posting"
        @keyup="onJobDescriptionKeyup"
        @blur="onJobDescriptionBlur"
      ></textarea>
      <p v-if="parsingAI" class="loadingText">Detecting job title and company...</p>
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
        :value="company"
        @onUpdated="(e : any) => { company = e.target.value; updateTimesPreviouslyAppliedToSameCompany(e.target.value, previousApplications); }"
      />
      <p class="warning" v-if="timesAlreadyApplied > 0">
        (You've applied to this company at least {{ timesAlreadyApplied }} time{{timesAlreadyApplied !== 1 ? "s" : ""}} previously.)
      </p>

      <InputField
        label="Tags"
        :showHelp="showHelp"
        :value="tags"
        helpText="^ Add tags for filtering later. You could enter 'React, Tailwind' if the job involves that. Make sure to use commas
        and spaces to split them up."
        @onUpdated="(e : any) => { tags = e.target.value; }"
        placeholder="Tag1, Tag2"
      />

      <b>Applied</b>
      <input type="checkbox" v-model="applied" />

      <input type="submit" />
    </form>
  </section>
</template>
