// Data
d3.csv('../data/education.csv', d3.autoType)
  .then((data) => {
    const margin = {
      t: 50,
      r: 20,
      b: 30,
      l: 20,
    };
    const sideLength = 400;

    // List of subgroups
    const subgroups = [...d3.group(data, (d) => d.isced11).keys()];

    [
      '#4e79a7',
      '#f28e2c',
      '#e15759',
      '#76b7b2',
      '#59a14f',
      '#edc949',
      '#af7aa1',
      '#ff9da7',
      '#9c755f',
      '#bab0ab',
    ];
    // Build color scale
    const color = ['#59a14f', '#f28e2c', '#4e79a7'];

    // const country = 'IT';
    // const year = 2011;

    const svg = [];

    for (let i = 0; i < 4; i += 1) {
      svg[i] = d3
        .select('#chart5')
        .append('svg')
        .attr('viewBox', [0, 0, sideLength + margin.l + margin.r, sideLength + margin.t + margin.b])
        .attr('style', 'max-width: 40%; height: auto; max-height: 40vh;')
        .append('g')
        .attr('transform', `translate(${margin.l},${margin.t})`);
    }

    // console.log(svg);

    // Labels of row and columns
    const waffleX = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10'];
    const waffleY = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'];

    const waffleUnits = waffleX.length * waffleY.length;

    // group data by 'geo'
    const dataByGeo = d3.group(
      data,
      (d) => d.geo,
      (d) => d.time_period,
    );

    function waffleData(countryCode, year) {
      const query = dataByGeo.get(countryCode)?.get(year) ?? [];

      if (query.length === 0) {
        return [];
      }
      const tot = d3.sum(query, (d) => d.obs_value);

      const waffleSquares = [];
      let currX = 0;

      subgroups.forEach((subgroup, subgroupIdx) => {
        const squareValue = tot / waffleUnits;
        const subgroupObs = query[subgroupIdx]?.obs_value || 0;
        const cellsNeeded = Math.ceil(subgroupObs / squareValue);
        const rowsNeeded = Math.ceil(cellsNeeded / waffleX.length);

        for (
          let row = Math.floor(currX / 10), cellsPlaced = 0;
          row < row + rowsNeeded && cellsPlaced < cellsNeeded && waffleSquares.length < waffleUnits;
          row += 1
        ) {
          for (
            let col = currX % 10;
            col < waffleX.length && cellsPlaced < cellsNeeded && waffleSquares.length < waffleUnits;
            col += 1
          ) {
            waffleSquares.push([waffleX[col], waffleY[row], subgroupIdx]);
            cellsPlaced += 1;
            currX += 1;
          }
        }
      });
      return waffleSquares;
    }

    // console.log(dataByGeo.get('CC').get(2015));
    // console.log(selection);

    // Build X scales and axis:
    const x = d3.scaleBand().range([0, sideLength]).domain(waffleX).padding(0.08);

    // Build X scales and axis:
    const y = d3.scaleBand().range([sideLength, 0]).domain(waffleY).padding(0.08);

    // A function that updates the chart
    function updateChart(svg, country, year) {
      svg.selectAll('*').remove();

      const selection = waffleData(country, year);

      const rect = svg
        .selectAll()
        .data(selection, (d) => `${d[0]}:${d[1]}`)
        .join('rect')
        .attr('x', (d) => x(d[0]) + 1)
        .attr('y', (d) => y(d[1]))
        .attr('rx', 6)
        .attr('ry', 6)
        .attr('class', (d) => `group${d[2]}`)
        .style('stroke-width', 2)
        .style('stroke', 'none')
        .style('opacity', 0)
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', (d) => color[d[2]]);

      rect.transition().duration(400).style('opacity', 1);

      // add title
      svg
        .append('text')
        .attr('x', sideLength / 2)
        .attr('y', 10 - margin.t / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '40px')
        .text(country);

      // // add the legend
      // const legend = svg.append('g').attr('class', 'legend');
      // // .attr('transform', `translate(${-margin.left},${margin.top})`);
      //
      // legend
      //   .append('rect')
      //   .attr('fill', 'white')
      //   .attr('stroke', 'black')
      //   .attr('stroke-width', 1)
      //   .attr('width', 120)
      //   .attr('height', 100)
      //   .attr('rx', 6)
      //   .attr('ry', 6)
      //   .attr('x', -margin.l + 10)
      //   .attr('y', 5);
      //
      // legend
      //   .append('text')
      //   .attr('x', -margin.l + 20)
      //   .attr('y', 30)
      //   .text('Legend');
      //
      // legend
      //   .append('text')
      //   .attr('x', -margin.l + 20)
      //   .attr('y', 50)
      //   .text('Primary')
      //   .attr('fill', color[0]);
      //
      // legend
      //   .append('text')
      //   .attr('x', -margin.l + 20)
      //   .attr('y', 70)
      //   .text('Secondary')
      //   .attr('fill', color[1]);
      //
      // legend
      //   .append('text')
      //   .attr('x', -margin.l + 20)
      //   .attr('y', 90)
      //   .text('Tertiary')
      //   .attr('fill', color[2]);
    }

    // const country = 'IT';
    const year = 2015;
    updateChart(svg[0], 'IT', year);
    updateChart(svg[1], 'FR', year);
    updateChart(svg[2], 'DE', year);
    updateChart(svg[3], 'ES', year);
  })
  .catch((e) => {
    console.log(e);
  });
