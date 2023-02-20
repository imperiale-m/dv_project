// Read the data
d3.csv('data/preprocessedData.csv', d3.autoType).then(
  // Now I can use this dataset:
  (data) => {
    // console.log(data);

    function drawChart(filtData) {
      const margin = {
        t: 40,
        r: 60,
        b: 45,
        l: 60,
      };
      const width = 400;
      const height = 300;

      // append the svg object to the body of the page
      const svg = d3
        .select('#chart2')
        .append('svg')
        .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
        .attr('style', 'max-width: 100%; height: auto; height:intrinsic;')
        .append('g')
        .attr('transform', `translate(${margin.l},${margin.t})`);

      // Add X axis --> it is a date format
      const xAxis = d3
        .scaleBand()
        .domain(d3.map(filtData, (d) => d.time_period))
        .range([0, width])
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
      const f2 = d3.extent(filtData, (d) => d.life_expectancy_total);

      const padding = 0.05; // 5% padding
      const [minY, maxY] = d3.extent([...f1, ...f2]);
      const rangeY = maxY - minY;

      // Add Y axis
      const yAxis = d3
        .scaleLinear()
        .domain([minY - rangeY * padding, maxY + rangeY * padding])
        .range([height, 0])
        .nice();

      // Add the line
      const path = svg
        .append('path')
        .datum(filtData)
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

      const length = path.node().getTotalLength(); // Get line length
      path
        .attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
        .delay(100)
        .duration(2000);

      // add the label to the end of the line
      const lastDataPoint = filtData[filtData.length - 1];
      svg
        .append('text')
        .attr('x', xAxis(lastDataPoint.time_period) + 5)
        .attr('y', yAxis(lastDataPoint.life_expectancy_total))
        .transition()
        .text(`${lastDataPoint.country}`)
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('fill', 'steelblue')
        .duration(2000)
        .delay(2100);

      // Add the line
      svg
        .append('path')
        .datum(meanData)
        .attr('fill', 'none')
        .attr('stroke', 'gray')
        .style('stroke-dasharray', '3, 3')
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3
            .line()
            .x((d) => xAxis(d.key))
            .y((d) => yAxis(d.value)),
        );

      // add the label to the end of the line
      const lastDataPoint2 = meanData[meanData.length - 1];
      svg
        .append('text')
        .attr('x', xAxis(lastDataPoint2.key) + 5)
        .attr('y', yAxis(lastDataPoint2.value))
        .text('Average EU')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('fill', 'gray');

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
        .attr('transform', `translate(${width / 2}, ${height + margin.b})`)
        .attr('class', 'axis-name')
        .text('Year');

      // yAxis name
      svg
        .append('text')
        .attr('transform', `translate(${-margin.l / 1.75}, ${margin.t + 160}) rotate(-90)`)
        .attr('class', 'axis-name')
        .text('Life expectancy at birth, total (years)');
    }

    const filtData = data.filter((d) => d.country === 'Italy');

    drawChart(filtData);
  },
);
