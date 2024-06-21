<script>
import JobPostingForm from './JobPostingForm.vue';

export default {
  name: "MainPage",
  components: { JobPostingForm },
  props: {
    msg: String,
  },
};
</script>

<template>
  <div>
    <h1>Streamlined Dev Job Searcher</h1>
    <JobPostingForm />
    <h2>Jobs Entered</h2>
  </div>
</template>