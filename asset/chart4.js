// Data
d3.csv('./data/healthExpenditure2.csv', d3.autoType)
  .then((data) => {
    const margin = {
      t: 20,
      r: 40,
      b: 40,
      l: 60,
    };
    const width = 400;
    const height = 300;

    const svg = d3
      .select('#chart4')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto;')
      .append('g')
      .attr('transform', `translate(${margin.l},${margin.t})`);

    // console.log('Data chart4', data);

    // group data by 'geo'
    const dataByGeo = d3.group(data, (d) => d.geo);
    // console.log(dataByYear.get(2009));

    const test = dataByGeo.get('IT');
    // console.log(test);

    const padding = 0.1; // 10% padding
    const [minX, maxX] = d3.extent(test, (d) => d.obs_value);
    const rangeX = maxX - minX;

    // Add X axis --> it is a date format
    const x = d3
      .scaleLinear()
      .domain([minX - rangeX * padding, maxX + rangeX * padding])
      .range([0, width])
      .nice();
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    const [minY, maxY] = d3.extent(test, (d) => d.life);
    const rangeY = maxY - minY;

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([minY - rangeY * padding, maxY + rangeY * padding])
      .range([height, 0])
      .nice();
    svg.append('g').call(d3.axisLeft(y));

    // Add the line
    const path = svg
      .append('path')
      .datum(test)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveCatmullRom)
          .x((d) => x(d.obs_value))
          .y((d) => y(d.life)),
      );

    const length = path.node().getTotalLength(); // Get line length
    path
      .attr('stroke-dasharray', `${length} ${length}`)
      .attr('stroke-dashoffset', length)
      .transition()
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
      .delay(1000)
      .duration(3000);
    // Add the points
    svg
      .append('g')
      .selectAll('dot')
      .data(test)
      .join('circle')
      .attr('cx', (d) => x(d.obs_value))
      .attr('cy', (d) => y(d.life))
      .attr('r', 3)
      .attr('fill', 'white')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5);

    // LABELS
    const label = svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(test)
      .join('g')
      .attr('transform', (d) => `translate(${x(d.obs_value)},${y(d.life)})`);

    label
      .append('text')
      .text((d) => d.time_period)
      .each(function () {
        const t = d3.select(this);
        t.attr('text-anchor', 'middle').attr('dy', '1.4em');
      })
      .call((text) => text.clone(true))
      .attr('fill', 'none')
      .attr('stroke', '#fff')
      .attr('stroke-width', 6);

    // xAxis name
    svg
      .append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.b})`)
      .attr('class', 'axis-name')
      .text('PPS');

    // yAxis name
    svg
      .append('text')
      .attr('transform', `translate(${-margin.l / 1.5}, ${height / 2 - 60}) rotate(-90)`)
      .attr('class', 'axis-name')
      .text('Life Expectancy');
  })
  .catch((e) => {
    console.log(e);
  });
