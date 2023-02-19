// Read the data
d3.csv('data/preprocessedData.csv', d3.autoType).then(
  // Now I can use this dataset:
  (data) => {
    // console.log(data);

    function drawChart(filtData, x, y) {
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
        .domain(d3.map(filtData, (d) => d[x]))
        .range([0, width])
        .padding(1);

      // group data by key and calculate mean of value for each group
      const groupedData = d3.group(data, (d) => d[x]); // group data by key
      const meanData = Array.from(groupedData, ([key, values]) => ({
        // calculate mean for each group
        key,
        value: d3.mean(values, (d) => d[y]),
      }));

      // console.log(meanData);

      const f1 = d3.extent(meanData, (d) => d.value);
      const f2 = d3.extent(filtData, (d) => d[y]);

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
      svg
        .append('path')
        .datum(filtData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3
            .line()
            .x((d) => xAxis(d[x]))
            .y((d) => yAxis(d[y])),
        );

      // add the label to the end of the line
      const lastDataPoint = filtData[filtData.length - 1];
      svg
        .append('text')
        .attr('x', xAxis(lastDataPoint[x]) + 5)
        .attr('y', yAxis(lastDataPoint[y]))
        .text(`${lastDataPoint.Location}`)
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('fill', 'steelblue');

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
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

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
        .text(y);
    }

    const filtData = data.filter((d) => d.Location === 'Italy');

    drawChart(filtData, 'Period', 'Life expectancy at birth, total (years)');
  },
);
