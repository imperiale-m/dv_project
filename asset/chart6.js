// Parse the Data
d3.csv('data/eurostat_data_2.csv', d3.autoType).then((data) => {
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

  let filtData = data.filter((d) => d.time_period === 2018);
  filtData = filtData.filter((d) => d.life_expectancy_male !== 0);

  /// Add X axis --> it is a date format
  const xAxis = d3
    .scaleLinear()
    .domain([
      d3.min(filtData, (d) => d.life_expectancy_male - 5),
      d3.max(filtData, (d) => d.life_expectancy_female),
    ])
    .nice()
    .range([0, width]);
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xAxis))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '.5em')
    .attr('dy', '.60em');
  // .attr('transform', 'rotate(-45)');
  // Add Y axis
  const yAxis = d3
    .scaleBand()
    .domain(d3.map(filtData, (d) => d.country))
    .range([height, 0]);
  svg.append('g').call(d3.axisLeft(yAxis));

  // Lines
  svg
    .selectAll('myline')
    .data(filtData)
    .join('line')
    .attr('x1', (d) => xAxis(d.life_expectancy_male))
    .attr('x2', (d) => xAxis(d.life_expectancy_female))
    .attr('y1', (d) => yAxis(d.country))
    .attr('y2', (d) => yAxis(d.country))
    .attr('stroke', 'grey')
    .attr('stroke-width', '1px');

  svg
    .selectAll('myrect')
    .data(filtData)
    .join('rect')
    .attr('class', (d) => d.country.replaceAll(' ', '_'))
    .attr('width', 30)
    .attr('height', 15)
    .attr(
      'x',
      (d) =>
        xAxis(d.life_expectancy_male) +
        (xAxis(d.life_expectancy_female) - xAxis(d.life_expectancy_male)) / 2 -
        10,
    )
    .attr('y', (d) => yAxis(d.country) - 10)
    .style('fill', 'white');

  console.log(filtData);

  svg
    .selectAll('myrect')
    .data(filtData)
    .join('text')
    .attr(
      'x',
      (d) =>
        xAxis(d.life_expectancy_male) +
        (xAxis(d.life_expectancy_female) - xAxis(d.life_expectancy_male)) / 2 -
        10,
    )
    .attr('y', (d) => yAxis(d.country))
    .text(
      (d) => `+ ${Number.parseFloat(d.life_expectancy_female - d.life_expectancy_male).toFixed(2)}`,
    )
    .attr('alignment-baseline', 'middle')
    .attr('background-color', 'white')
    .attr('font-size', '10px')
    .attr('fill', 'grey');

  svg
    .selectAll('myrect')
    .data(filtData.filter((d) => d.geo === 'UK'))
    .join('text')
    .attr(
      'x',
      (d) =>
        xAxis(d.life_expectancy_male) +
        (xAxis(d.life_expectancy_female) - xAxis(d.life_expectancy_male)) / 2 -
        5,
    )
    .attr('y', (d) => yAxis(d.country) - 15)
    .text('Gap')
    .attr('alignment-baseline', 'top')
    .attr('font-size', '10px')
    .attr('fill', 'grey');

  // Circles of variable 1
  svg
    .selectAll('mycircle')
    .data(filtData)
    .join('circle')
    .attr('class', (d) => d.country.replaceAll(' ', '_'))
    .attr('cx', (d) => xAxis(d.life_expectancy_male))
    .attr('cy', (d) => yAxis(d.country))
    .attr('r', '6')
    .style('fill', '#031bb7');

  svg
    .selectAll('mycircle')
    .data(filtData)
    .join('text')
    .attr('x', (d) => xAxis(d.life_expectancy_male) - 26)
    .attr('y', (d) => yAxis(d.country))
    .text((d) => `${d.life_expectancy_male}`)
    .attr('alignment-baseline', 'middle')
    .attr('font-size', '10px')
    .attr('fill', '#031bb7');

  svg
    .selectAll('mycircle')
    .data(filtData.filter((d) => d.geo === 'UK'))
    .join('text')
    .attr('x', (d) => xAxis(d.life_expectancy_male) - 10)
    .attr('y', (d) => yAxis(d.country) - 15)
    .text('Male')
    .attr('alignment-baseline', 'top')
    .attr('font-size', '10px')
    .attr('fill', '#031bb7');

  // Circles of variable 2
  svg
    .selectAll('mycircle')
    .data(filtData)
    .join('circle')
    .attr('cx', (d) => xAxis(d.life_expectancy_female))
    .attr('cy', (d) => yAxis(d.country))
    .attr('r', '6')
    .style('fill', '#730160');

  svg
    .selectAll('mycircle')
    .data(filtData)
    .join('text')
    .attr('x', (d) => xAxis(d.life_expectancy_female) + 10)
    .attr('y', (d) => yAxis(d.country))
    .text((d) => `${d.life_expectancy_female}`)
    .attr('alignment-baseline', 'middle')
    .attr('font-size', '10px')
    .attr('fill', '#730160');

  svg
    .selectAll('mycircle')
    .data(filtData.filter((d) => d.geo === 'UK'))
    .join('text')
    .attr('x', (d) => xAxis(d.life_expectancy_female) - 10)
    .attr('y', (d) => yAxis(d.country) - 15)
    .text('Female')
    .attr('alignment-baseline', 'top')
    .attr('font-size', '10px')
    .attr('fill', '#730160');

  // x-axis name
  svg
    .append('text')
    .attr('transform', `translate(${width / 2 - 100}, ${height + margin.b - 50})`)
    .attr('class', 'axis-name')
    .text('Life expectancy at birth, female and male (years)');

  // y-axis name
  svg
    .append('text')
    .attr('transform', `translate(${-margin.l + 20}, ${height / 2}) rotate(-90)`)
    .attr('class', 'axis-name')
    .text('Country');
  // add title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 10 - margin.t / 2)
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .text('Title');
});
