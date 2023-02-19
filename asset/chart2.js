// Read the data
d3.csv('data/preprocessedData.csv').then(
  // Now I can use this dataset:
  (data) => {
    console.log(data);

    function drawChart(filtData, x, y) {
      const margin = {
        t: 90,
        r: 40,
        b: 100,
        l: 100,
      };
      const width = 600;
      const height = 550;

      // append the svg object to the body of the page
      const svg = d3
        .select('#chart2')
        .append('svg')
        .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
        .attr('style', 'max-width: 100%; height: auto')
        .append('g')
        .attr('transform', `translate(${margin.l},${margin.t})`);

      // Add X axis --> it is a date format
      const xAxis = d3
        .scaleBand()
        .domain(d3.map(filtData, (d) => d[x]))
        .range([0, width]);
      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xAxis))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');
      // Add Y axis
      const yAxis = d3
        .scaleLinear()
        .domain([d3.min(filtData, (d) => d[y]) - 5, d3.max(filtData, (d) => d[y])])
        .range([height, 0]);
      svg.append('g').call(d3.axisLeft(yAxis));

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

      const medianLifeExp = d3.mean(data, (d) => d[y]);
      console.log(medianLifeExp);

      // Add the line
      svg
        .append('path')
        .datum(filtData)
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .style('stroke-dasharray', '3, 3')
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3
            .line()
            .x((d) => xAxis(d[x]))
            .y(yAxis(medianLifeExp)),
        );

      // x-axis name
      svg
        .append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.b / 2})`)
        .attr('class', 'axis-name')
        .text('Year');

      // y-axis name
      svg
        .append('text')
        .attr('transform', `translate(${-margin.l + 40}, ${height / 2 + 150}) rotate(-90)`)
        .attr('class', 'axis-name')
        .text(y);
      // add title
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 10 - margin.t / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '20px')
        .text('Title');
    }

    const filtData = data.filter((d) => d.Location === 'Italy');

    drawChart(filtData, 'Period', 'Life expectancy at birth, total (years)');
  },
);
