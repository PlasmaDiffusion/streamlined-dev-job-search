<script>
export default {
  name: "JobPostingForm",
  props: {
    showHelp: Boolean,
  },
};
</script>
<script setup>
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
    <textarea
     v-model="posting"
      name="posting"
      placeholder="Copy and paste a job posting here and it will rank it for you."
      @keyup="(event)=>{
        console.log(parseJobPosting(event.target.value));
        }"
    ></textarea>

    <label v-if="showHelp"
      >Copy and paste the link so you can find it later.</label
    >

    <input
      v-model="link"
      placeholder="Copy and paste the link so you can find the posting later."
    />

    <input type="submit" >
  </form>
</template>
