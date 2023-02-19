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
      .range([height, 0])
      .padding(1);

    const xScale = d3.scaleLinear().domain(dom).nice().range([0, width]);

    // Add y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g').call(yAxis);

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);

    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlBu) // set the color scale
      .domain(dom); // set the data domain

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
  })
  .catch((e) => {
    console.log(e);
  });
