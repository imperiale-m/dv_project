// Dot-plot
d3.csv('./data/eurostat_data_2.csv', d3.autoType)
  .then((data) => {
    // set the dimensions and margins of the graph
    const margin = {
      t: 20,
      r: 80,
      b: 100,
      l: 120,
    };
    const width = 600;
    const height = 500;

    // append the svg object to the body of the page
    const svg = d3
      .select('#chart6')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto;')
      .append('g')
      .attr('transform', `translate(${margin.l},${margin.t})`);

    const dataByYear = d3.group(
      data.filter((d) => d.life_expectancy_male !== 0),
      (d) => d.time_period,
    );
    // console.log(dataByYear);

    function updateChart6(year) {
      svg.selectAll('*').remove();
      d3.select('#chart6Year').html(year);

      const filteredData =
        dataByYear
          .get(year)
          .sort((a, b) =>
            d3.descending(
              Math.abs(a.life_expectancy_male - a.life_expectancy_female),
              Math.abs(b.life_expectancy_male - b.life_expectancy_female),
            ),
          ) ?? 0;

      const m = d3.extent(filteredData, (d) => d.life_expectancy_male);
      const f = d3.extent(filteredData, (d) => d.life_expectancy_female);

      const [minY, maxY] = d3.extent([...m, ...f]);

      /// Add X axis
      const xAxis = d3
        .scaleLinear()
        .domain([minY - 2, maxY + 2])
        .rangeRound([0, width])
        .nice();

      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .transition()
        .duration(750)
        .call(d3.axisBottom(xAxis))
        .selectAll('text')
        .style('text-anchor', 'middle');

      // Add Y axis
      const yAxis = d3
        .scaleBand()
        .domain(d3.map(filteredData, (d) => d.country))
        .rangeRound([height, 0])
        .padding(1);
      svg
        .append('g')
        .call(d3.axisLeft(yAxis).tickPadding(10))
        .call((g) => g.selectAll('.domain').remove());

      // Lines
      svg
        .selectAll('.line')
        .data(filteredData)
        .join('line')
        .attr('class', 'line')
        .attr('x1', (d) => xAxis(d.life_expectancy_male))
        .attr('x2', (d) => xAxis(d.life_expectancy_female))
        .attr('y1', (d) => yAxis(d.country))
        .attr('y2', (d) => yAxis(d.country))
        .attr('stroke', 'grey')
        .attr('stroke-width', '1px');

      // grid lines
      svg
        .selectAll('.grid')
        .data(filteredData)
        .join('line')
        .attr('class', 'gridline')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => yAxis(d.country))
        .attr('y2', (d) => yAxis(d.country));

      svg
        .selectAll('myrect')
        .data(filteredData)
        .join('text')
        .attr('x', (d) => xAxis(d.life_expectancy_total))
        .attr('y', (d) => yAxis(d.country))
        .text((d) => `+ ${d3.format('.1f')(d.life_expectancy_female - d.life_expectancy_male)}`)
        .attr('stroke-linejoin', 'round')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('fill', 'black')
        .call((text) => text.clone(true))
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', '6px');

      svg
        .append('text')
        .attr('x', xAxis(filteredData[filteredData.length - 1].life_expectancy_total) + 3)
        .attr('text-anchor', 'middle')
        .attr('y', yAxis(filteredData[filteredData.length - 1].geo))
        .text('GAP')
        .attr('font-size', '10px')
        .attr('fill', 'black');

      // Male
      svg
        .selectAll('mycircle')
        .data(filteredData)
        .join('circle')
        .attr('class', (d) => d.country.replaceAll(' ', '_'))
        .attr('cx', (d) => xAxis(d.life_expectancy_male))
        .attr('cy', (d) => yAxis(d.country))
        .attr('r', '4px')
        .style('fill', 'steelblue');

      svg
        .selectAll('mycircle')
        .data(filteredData)
        .join('text')
        .attr('x', (d) => xAxis(d.life_expectancy_male) - 26)
        .attr('y', (d) => yAxis(d.country))
        .text((d) => `${d.life_expectancy_male}`)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('fill', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .call((text) => text.clone(true))
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', '6px');

      svg
        .append('text')
        .attr('x', xAxis(filteredData[filteredData.length - 1].life_expectancy_male))
        .attr('text-anchor', 'middle')
        .attr('y', yAxis(filteredData[filteredData.length - 1].geo))
        .text('Male')
        .attr('font-size', '10px')
        .attr('fill', 'steelblue');

      // Female
      svg
        .selectAll('mycircle')
        .data(filteredData)
        .join('circle')
        .attr('cx', (d) => xAxis(d.life_expectancy_female))
        .attr('cy', (d) => yAxis(d.country))
        .attr('r', '4px')
        .style('fill', 'firebrick');

      svg
        .selectAll('mycircle')
        .data(filteredData)
        .join('text')
        .attr('x', (d) => xAxis(d.life_expectancy_female) + 10)
        .attr('y', (d) => yAxis(d.country))
        .text((d) => `${d.life_expectancy_female}`)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('fill', 'firebrick')
        .attr('stroke-linejoin', 'round')
        .call((text) => text.clone(true))
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', '6px');

      svg
        .append('text')
        .attr('x', xAxis(filteredData[filteredData.length - 1].life_expectancy_female))
        .attr('text-anchor', 'middle')
        .attr('y', yAxis(filteredData[filteredData.length - 1].geo))
        .text('Female')
        .attr('font-size', '10px')
        .attr('fill', 'firebrick');

      // xAxis name
      svg
        .append('text')
        .attr('transform', `translate(${width / 2 - 100}, ${height + margin.b - 50})`)
        .attr('class', 'axis-name')
        .text('Life expectancy at birth, female and male (years)');

      // yAxis name
      svg
        .append('text')
        .attr('transform', `translate(${-margin.l + 20}, ${height / 2}) rotate(-90)`)
        .attr('class', 'axis-name')
        .text('Country');
    }

    window.updateChart6 = updateChart6;
    updateChart6(2012);
  })
  .catch((e) => {
    console.log(e);
  });
