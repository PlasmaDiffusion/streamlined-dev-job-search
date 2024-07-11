<script lang="ts">
import * as d3 from "d3";
export default {
  data() {
    return {};
  },
  mounted() {
    const width = 800;
    const height = 800;
    const data = [
      { date: "26-Apr-07", amount: 3 },
      { date: "27-Apr-07", amount: 5 },
      { date: "28-Apr-07", amount: 2 },
      { date: "29-Apr-07", amount: 4 },
      { date: "30-Apr-07", amount: 3 },
      { date: "6-May-07", amount: 1 },
      { date: "7-May-07", amount: 5 },
      { date: "8-May-07", amount: 7 },
      { date: "9-May-07", amount: 6 },
      { date: "10-May-07", amount: 4 },
      { date: "11-May-07", amount: 3 },
      { date: "12-May-07", amount: 2 },
    ];

    const svg = d3.select("svg").attr("width", width).attr("height", height);
    const g = svg.append("g").attr("transform", `translate(20,0)`);

    //2. Parse the dates
    const parseTime = d3.timeParse("%d-%b-%y");

    //3. Creating the Chart Axes
    const x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return parseTime(d.date);
        })
      )
      .rangeRound([0, width-25]);

    const y = d3
      .scaleLinear()
      .domain(
        [0, 10]
        //
        // d3.extent(data, function (d) {
        //   return d.amount;
        // })
      )
      .rangeRound([height, 10]);

    //4. Creating a Line
    const line = d3
      .line()
      .x(function (d) {
        return x(parseTime(d.date));
      })
      .y(function (d) {
        return y(d.amount);
      });

    //5. Appending the Axes to the Chart

    //x axis label
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("fill", "#000")
      .attr("x", 60)
      .attr("y", -5)
      .attr("xy", "0.71em")
      .attr("text-anchor", "end")
      .text("Day");

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("# Applied To");

    //6. Appending a path to the Chart
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    g.selectAll(".dot")
      .data(
        data.filter(function (d) {
          return d;
        })
      )
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", line.x())
      .attr("cy", line.y())
      .attr("r", 3.5);
  },
};
</script>

<template>
  <div>
    <h2>Applications Made</h2>
    <svg></svg>
  </div>
</template>
