<script lang="ts">
import "./Analytics.scss";
import * as d3 from "d3";
import { JobApplication } from "../../Interfaces";
import { getShortNameOfMonthFromNumber } from "../../services/DateManager";
export default {
  data() {
    return {};
  },
  props: {
    applications: {
      type: Object as () => JobApplication[],
      required: true,
    },
  },
  mounted() {
    const width = 1140; //1920 * 0.75
    const height = 810; //1080 * 0.75
    let data = [{ date: "26-Apr-07", amount: 3, actualDatabaseDate: "" }];

    data = [];

    //Todo: Use a Set to add onto days with multiple applications

    this.applications.forEach((application) => {
      //Check if date already has been entered here
      const existingIndex = data.findIndex(
        (e) => e.actualDatabaseDate === application.dateApplied?.split(" ")[0]
      );

      if (existingIndex > -1) {
        data[existingIndex] = {
          date: data[existingIndex].date,
          amount: data[existingIndex].amount + 1,
          actualDatabaseDate: data[existingIndex].actualDatabaseDate,
        };
      } else {
        //Convert date to a date string that will work in d3.js
        const dateAndYear = application.dateApplied?.split(" ");
        const date = dateAndYear ? dateAndYear[0] : "";

        const day = date.split("-")[2];
        let month = date.split("-")[1];
        const year = date.split("-")[0];

        month = getShortNameOfMonthFromNumber(parseInt(month));

        data.push({
          date: `${day}-${month}-${year.substring(2)}`,
          amount: 1,
          actualDatabaseDate: application.dateApplied?.split(" ")[0] || "",
        });
      }
    });

    const svg = d3.select("svg").attr("width", width).attr("height", height);
    const g = svg.append("g").attr("transform", `translate(20,-5)`);

    //2. Parse the dates
    const parseTime = d3.timeParse("%d-%b-%y");

    //3. Creating the Chart Axes
    const x = d3
      .scaleTime()
      .domain(
        //@ts-expect-error
        d3.extent(data, function (d) {
          return parseTime(d.date);
        })
      )
      .rangeRound([0, width - 25]);

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
        //@ts-expect-error
        return x(parseTime(d.date));
      })
      //@ts-expect-error
      .y(function (d: { amount: any }) {
        return y(d.amount);
      });

    //5. Appending the Axes to the Chart

    //x axis label
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(d3.timeDay.every(1)))
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
      //@ts-expect-error
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
      //@ts-expect-error
      .attr("cx", line.x())
      //@ts-expect-error
      .attr("cy", line.y())
      .attr("r", 3.5);
  },
};
</script>

<template>
  <div class="analyticsContainer">
    <h2>Applications Per Day</h2>
    <svg ></svg>
  </div>
</template>
