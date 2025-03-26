<script lang="ts">
import "./Analytics.scss";
import * as d3 from "d3";
import { JobApplication } from "../../Interfaces";

interface TagData {
  tag: string;
  amount: number;
}

export default {
  props: {
    applications: {
      type: Object as () => JobApplication[],
      required: true,
    },
  },
  mounted() {
    const tagsToDisplay = [
      "Remote",
      "On Site",
      "Hybrid",
      "Front End",
      "Back End",
      "Full Stack",
      "Mobile",
      "React",
      "Vue",
      "Angular",
    ];

    const width = 1140; // Chart width
    const height = 810; // Chart height
    const margin = { top: 20, right: 30, bottom: 50, left: 50 }; // Margins for axes

    let graphData: TagData[] = [];

    tagsToDisplay.forEach((tag) => {
      graphData.push({ tag, amount: 0 });
    });

    console.log(this.applications.length);
    // Populate graphData with tag frequencies
    this.applications.forEach((application) => {
      tagsToDisplay.forEach((tag) => {
        if (application.tags && application.tags.length > 0) {
          const splitTags = application.tags[0].split(",");
          console.log("*", splitTags);

          if (splitTags.includes(tag)) {
            const existingIndex = graphData.findIndex((e) => e.tag === tag);
            if (existingIndex > -1) {
              graphData[existingIndex].amount += 1;
              console.log(tag, graphData[existingIndex].amount);
            } else {
              console.log(tag);
              graphData.push({ tag, amount: 1 });
            }
          }
        }
      });
    });

    // Create the SVG container
    const svg = d3
      .select("#tags-graph")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3
      .scaleBand()
      .domain(graphData.map((d) => d.tag)) // Tags on the x-axis
      .range([0, width - margin.left - margin.right])
      .padding(0.1); // Add padding between bars

    const y = d3
      .scaleLinear()
      .domain([0, 50]) // Max value for y-axis
      .range([height - margin.top - margin.bottom, 0]);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)") // Rotate x-axis labels if needed
      .style("text-anchor", "end");

    // Add y-axis
    svg.append("g").call(d3.axisLeft(y));

    // Colourize the bars
    const colour = d3
      .scaleOrdinal()
      .domain(graphData.map((d) => d.tag)) // Use tags as the domain
      .range(d3.schemeCategory10); // Use a predefined color scheme (e.g., d3.schemeCategory10)

    // Add bars
    svg
      .selectAll(".bar")
      .data(graphData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.tag) || 0) // Position bars based on tags
      .attr("y", (d) => y(d.amount)) // Height of the bar
      .attr("width", x.bandwidth()) // Width of each bar
      .attr("height", (d) => height - margin.top - margin.bottom - y(d.amount)) // Calculate bar height
      .attr("fill", (d) => colour(d.tag) as string); // Bar color
  },
};
</script>

<template>
  <div class="analyticsContainer">
    <h2>Tag Frequency In Job Postings</h2>
    <svg id="tags-graph"></svg>
  </div>
</template>
