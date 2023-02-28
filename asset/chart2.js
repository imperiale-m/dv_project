// Read the data
d3.csv('./data/preprocessedData.csv', d3.autoType)
  .then(
    // Now I can use this dataset:
    (data) => {
      // console.log(data);

      const margin = {
        t: 40,
        r: 60,
        b: 60,
        l: 60,
      };
      const width = 400;
      const height = 350;

      // append the svg object to the body of the page
      const svg = d3
        .select('#chart2')
        .append('svg')
        .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
        .attr('style', 'max-width: 100%; max-height: 70vh;')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${margin.l},${margin.t})`);

      function drawChart2(countryName) {
        svg.selectAll('*').remove();

        const filteredData = data.filter((d) => d.LocCode === countryName);
        d3.select('#chart2Country').html(filteredData[0].country);

        // Add X axis --> it is a date format
        const xAxis = d3
          .scaleBand()
          .domain(d3.map(filteredData, (d) => d.time_period))
          .rangeRound([0, width])
          .padding(1);

        // group data by key and calculate mean of value for each group
        const groupedData = d3.group(data, (d) => d.time_period); // group data by key
        const meanData = Array.from(groupedData, ([key, values]) => ({
          // calculate mean for each group
          key,
          value: d3.mean(values, (d) => d.life_expectancy_total),
        }));

        // console.log(meanData);

        const f1 = d3.extent(meanData, (d) => d.value);
        const f2 = d3.extent(filteredData, (d) => d.life_expectancy_total);

        const padding = 0.05; // 5% padding
        const [minY, maxY] = d3.extent([...f1, ...f2]);
        const rangeY = maxY - minY;

        // Add Y axis
        const yAxis = d3
          .scaleLinear()
          .domain([minY - rangeY * padding, maxY + rangeY * padding])
          .rangeRound([height, 0])
          .nice();

        // Add the line
        const line = svg
          .append('path')
          .datum(filteredData)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 1.5)
          .attr(
            'd',
            d3
              .line()
              .x((d) => xAxis(d.time_period))
              .y((d) => yAxis(d.life_expectancy_total)),
          );

        const length = line.node().getTotalLength(); // Get line length
        line
          .attr('stroke-dasharray', `${length} ${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .delay(100)
          .duration(2000);

        // add the label to the end of the line
        const lastDataPoint = filteredData[filteredData.length - 1];
        svg
          .append('text')
          .attr('x', xAxis(lastDataPoint.time_period) + 5)
          .attr('y', yAxis(lastDataPoint.life_expectancy_total))
          .text(`${lastDataPoint.country}`)
          .attr('alignment-baseline', 'middle')
          .attr('font-size', '12px')
          .attr('fill', 'steelblue')
          .attr('fill-opacity', 0)
          .transition()
          .delay(1900)
          .duration(500)
          .attr('fill-opacity', 1);

        // Add the line
        const path = svg
          .append('path')
          .datum(meanData)
          .attr('fill', 'none')
          .attr('stroke', 'gray')
          .attr('stroke-width', 1.5)
          .attr(
            'd',
            d3
              .line()
              .x((d) => xAxis(d.key))
              .y((d) => yAxis(d.value)),
          );

        // Get the total length of the path
        const totalLength = path.node().getTotalLength();

        // console.log(totalLength);

        /// //// Create the required stroke-dasharray to animate a dashed pattern ///////

        // Create a (random) dash pattern
        // The first number specifies the length of the visible part, the dash
        // The second number specifies the length of the invisible part
        const dashing = '3, 3';

        // This returns the length of adding all the numbers in dashing
        // (the length of one pattern in essence),
        // So for "6,6", for example, that would return 6+6 = 12
        const dashLength = dashing
          .split(/[\s,]/)
          .map((a) => parseFloat(a) || 0)
          .reduce((a, b) => a + b);

        // How many of these dash patterns will fit inside the entire path?
        const dashCount = Math.ceil(totalLength / dashLength);

        // Create an array that holds the pattern as often
        // so it will fill the entire path
        const newDashes = new Array(dashCount).join(`${dashing} `);
        // Then add one more dash pattern, namely with a visible part
        // of length 0 (so nothing) and a white part
        // that is the same length as the entire path
        const dashArray = `${newDashes} 0, ${totalLength}`;

        /// //// END ///////

        // Now offset the entire dash pattern, so only the last white section is
        // visible and then decrease this offset in a transition to show the dashes
        path
          .attr('stroke-dashoffset', totalLength)
          // This is where it differs with the solid line example
          .attr('stroke-dasharray', dashArray)
          .transition()
          .ease(d3.easeLinear)
          .delay(100)
          .duration(2000)

          // .ease('linear')
          .attr('stroke-dashoffset', 0);

        /// ///////////////////////////////

        // add the label to the end of the line
        const lastDataPoint2 = meanData[meanData.length - 1];
        svg
          .append('text')
          .attr('x', xAxis(lastDataPoint2.key) + 5)
          .attr('y', yAxis(lastDataPoint2.value))
          .text('Average EU')
          .attr('alignment-baseline', 'middle')
          .attr('font-size', '12px')
          .attr('fill', 'gray')
          .attr('fill-opacity', 0)
          .transition()
          .delay(1900)
          .duration(500)
          .attr('fill-opacity', 1);

        // xAxis
        svg
          .append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xAxis))
          .selectAll('text')
          .style('text-anchor', 'center')
          .attr('dx', '-.90em')
          .attr('dy', '.60em')
          .attr('transform', 'rotate(-35)');

        // yAxis
        svg.append('g').call(d3.axisLeft(yAxis));

        // xAxis name
        svg
          .append('text')
          .attr('transform', `translate(${width / 2}, ${height + 45})`)
          .attr('class', 'axis-name')
          .text('Year');

        // yAxis name
        svg
          .append('text')
          .attr('transform', `translate(${-margin.l / 1.75}, ${margin.t + 160}) rotate(-90)`)
          .attr('class', 'axis-name')
          .text('Life expectancy at birth, total (years)');
      }

      window.drawChart2 = drawChart2;
      drawChart2('ITA');
    },
  )
  .catch((e) => {
    console.log(e);
  });
