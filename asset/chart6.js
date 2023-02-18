// Parse the Data
d3.csv('data/preprocessedData.csv').then((data) => {
  // set the dimensions and margins of the graph
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
    .select('#chart6')
    .append('svg')
    .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
    .attr('style', 'max-width: 100%; height: auto')
    .append('g')
    .attr('transform', `translate(${margin.l},${margin.t})`);

  const filtData = data.filter((d) => d.Location === 'Italy');

  /// Add X axis --> it is a date format
  const xAxis = d3
    .scaleBand()
    .domain(d3.map(filtData, (d) => d.Period))
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
    .domain([d3.min(filtData, (d) => d['Life expectancy at birth, male (years)']) - 5, d3.max(filtData, (d) => d['Life expectancy at birth, female (years)'])])
    .range([height, 0]);
  svg.append('g').call(d3.axisLeft(yAxis));

  // Lines
  svg.selectAll('myline')
    .data(filtData)
    .join('line')
    .attr('x1', (d) => xAxis(d.Period))
    .attr('x2', (d) => xAxis(d.Period))
    .attr('y1', (d) => yAxis(d['Life expectancy at birth, male (years)']))
    .attr('y2', (d) => yAxis(d['Life expectancy at birth, female (years)']))
    .attr('stroke', 'grey')
    .attr('stroke-width', '1px');

  // Circles of variable 1
  svg.selectAll('mycircle')
    .data(filtData)
    .join('circle')
    .attr('cx', (d) => xAxis(d.Period))
    .attr('cy', (d) => yAxis(d['Life expectancy at birth, male (years)']))
    .attr('r', '6')
    .style('fill', '#031bb7');

  // Circles of variable 2
  svg.selectAll('mycircle')
    .data(filtData)
    .join('circle')
    .attr('cx', (d) => xAxis(d.Period))
    .attr('cy', (d) => yAxis(d['Life expectancy at birth, female (years)']))
    .attr('r', '6')
    .style('fill', '#730160');

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
    .text('Life expectancy at birth, female and male (years)');
  // add title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 10 - margin.t / 2)
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .text('Title');
});
