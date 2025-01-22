<script setup lang="ts">
import "./ApplicationTable.scss";

//Component to clean up tags and display them in a fancy way if needed
defineProps({
  tags: {
    type: Object as () => string[],
    required: true,
  },
});

function cleanUpTags(tags: string[]): string {

  let tagOutput: string = tags.toString();
  tagOutput = tagOutput.split("[").join("");
  tagOutput = tagOutput.split("]").join(" ");
  tagOutput = tagOutput.split(",").join(", ");

  return tagOutput;
}

/* Placeholder for if you wanted colour code the tags:

function colourCodeTag(tag)
{
  switch (tag)
  {
    case "React":
      return "red";
    case "Vue":
      return "green";
    case "Angular":
      return "blue";
    default:
      return "black";
  }
}

<div v-for="tag in tags" :key="tag">
  <span style={colourCodeTag(tag)}>{{ tag }}</span>
</div>
*/
</script>

<template>
  <td class="tags">
    {{ cleanUpTags(tags) }}
  </td>
</template>
