<script lang="ts">
import { ref } from "vue";
import { JobBoardLink, loadLinks } from "../../services/DataToSave";

export default {
  name: "ListOfLinks",
  setup() {
    const links = loadLinks();
    return { links };
  },
};

const links = ref<JobBoardLink[]>([]);

</script>

<template>
  <section>
    <h2>Quick Search Links</h2>
    <div v-for="link in links" :key="link.link">
      <div class="category" :style="{ backgroundColor: link.colour }">
        {{ link.category }}:
      </div>
      <div class="linkSection" :style="{ backgroundColor: link.colour }">
        {{ link.displayName }} <span class="timesClicked">(0 clicks)</span>
      </div>
    </div>
  </section>
</template>
