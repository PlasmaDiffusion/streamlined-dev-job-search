<script setup lang="ts">
const props = defineProps<{
  title?: string;
  amount: number;
  maxAmount: number;
  minPercentage?: number;
  fillColours?: string[];
  backgroundColour?: string;
}>();

import "./ProgressBar.scss";

function getPercentageFilled() {
  return props.amount / props.maxAmount;
}
function getWidthFilled() {
  let percentage =
    Math.max(props.minPercentage || 0.2, getPercentageFilled()) * 100;
  percentage = Math.min(percentage, 100);
  return percentage.toString() + "%";
}
function getFillColourFromPercentageFilled() {
  const colours = props.fillColours || [
    "Crimson",
    "DarkOrange",
    "GoldenRod",
    "green",
  ];

  const percentage = getPercentageFilled();
  if (percentage > 0.33 && percentage < 0.66) {
    return colours[1];
  } else if (percentage > 0.66 && percentage < 1) {
    return colours[2];
  } else if (percentage >= 1) {
    return colours[3];
  }

  return colours[0];
}
</script>

<template>
  <div
    class="bar"
    v-bind:style="{
      backgroundColor: backgroundColour,
    }"
  >
    <div
      class="filledBar"
      v-bind:style="{
        width: getWidthFilled(),
        backgroundColor: getFillColourFromPercentageFilled(),
      }"
    >
      {{ title }}: {{ amount }} / {{ maxAmount }}
      {{ amount > maxAmount ? "★" : "" }}
    </div>
  </div>
</template>
