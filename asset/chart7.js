// Data
d3.csv('../data/tgs.csv', d3.autoType)
  .then((data) => {
    const margin = {
      t: 40,
      r: 40,
      b: 40,
      l: 40,
    };
    const width = 400;
    const height = 600;

    // console.log(data);

    // group data by 'time_period'
    const dataByYear = d3.group(data, (d) => d.time_period);
    // console.log(dataByYear.get(2009));

    const test = dataByYear.get(2018);

    // Domain excluding zeroes
    const dom = d3.extent(
      test.filter((d) => d.obs_value !== 0),
      (d) => d.obs_value,
    );
    // console.log(dom);

    const svg = d3
      .select('#chart7')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto;')
      .append('g')
      .attr('transform', `translate(${margin.l},${margin.t})`);

    // Define scales
    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.geo_country))
      .range([0, height])
      .padding(1);

    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlBu) // set the color scale
      .domain(dom); // set the data domain

    const xScale = d3.scaleLinear().domain(dom).nice().range([0, width]);

    const yAxisGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('');

    svg.append('g').attr('class', 'y axis-grid').call(yAxisGrid);

    // Modify CSS of the y gridlines
    svg
      .selectAll('.y.axis-grid line')
      .attr('stroke', '#ccc') // Change color to gray
      .attr('stroke-width', 0.5); // Make lines thinner

    // Draw dots
    svg
      .selectAll('circle')
      .data(test)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.obs_value))
      .attr('cy', (d) => yScale(d.geo_country) + yScale.bandwidth() / 2)
      .attr('r', 4)
      .attr('fill', (d) => colorScale(d.obs_value))
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    // Add y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g').call(yAxis);

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);

    // Add chart title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Dot Strip Plot Example');
  })
  .catch((e) => {
    console.log(e);
  });
