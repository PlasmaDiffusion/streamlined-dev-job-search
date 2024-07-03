<script>
export default {
  name: "JobPostingForm",
  props: {
    showHelp: Boolean,
  },
};
</script>
<script setup>
import './JobPostingForm.scss';
import { parseJobPosting } from "../services/ParseJobPosting";
import { ref } from "vue";

const posting = ref("");
const link = ref("");


// function submit(event) {
//   if (event) {
//     alert(event.target.tagName)
//   }
// }
</script>

<template>
  <h2>Enter A Job Posting</h2>

  <form>
    <label  v-if="showHelp"
      >Copy and paste the job posting for it to be stored plus tagged and ranked for how good a fit it would be.</label
    >
    <textarea
     v-model="posting"
      name="posting"
      placeholder="Job Posting"
      @keyup="(event)=>{
        console.log(parseJobPosting(event.target.value));
        }"
    ></textarea>
    <br/>

    <label v-if="showHelp"
      >Copy and paste the link so you can find it later.</label
    >

    <input
      v-model="link"
      placeholder="Link"
    />

    <br/>
    <input type="submit" >
  </form>

  <button>

  </button>
</template>
