// Data
d3.csv('./data/tgs.csv', d3.autoType)
  .then((data) => {
    const margin = {
      t: 20,
      r: 80,
      b: 100,
      l: 120,
    };
    const width = 600;
    const height = 500;

    // console.log(data);

    const svg = d3
      .select('#chart7')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto;')
      .append('g')
      .attr('transform', `translate(${margin.l},${margin.t})`);

    // group data by 'time_period'
    const dataByYear = d3.group(data, (d) => d.time_period);

    function updateChart7(year) {
      svg.selectAll('*').remove();

      // console.log(dataByYear.get(2009));
      const test = dataByYear.get(year) ?? 0;

      if (test !== 0) {
        // Domain excluding zeroes
        const dom = d3.extent(
          test.filter((d) => d.obs_value !== 0),
          (d) => d.obs_value,
        );
        // console.log(dom);

        // Define scales
        const yScale = d3
          .scaleBand()
          .domain(data.map((d) => d.country).sort(d3.descending))
          .rangeRound([height, 0]);

        const xScale = d3.scaleLinear().domain(dom).nice().range([0, width]);

        // Add y-axis
        const yAxis = d3.axisLeft(yScale).tickPadding(5).tickSize(0);
        svg
          .append('g')
          .call(yAxis)
          .call((g) => g.selectAll('.domain').remove());

        // Add x-axis
        const xAxis = d3.axisBottom(xScale);
        svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);

        const colorScale = d3
          .scaleSequential(d3.interpolateRdYlBu) // set the color scale
          .domain(dom); // set the data domain

        const tooltip = d3.select('#chart7').append('div').attr('class', 'tooltip');

        const mouseover = function () {
          tooltip.style('z-index', 40);
          tooltip.transition().style('opacity', 0.9);
          d3.select(this).transition().style('opacity', 1).attr('r', 6);
        };

        const mouseout = function () {
          tooltip.style('z-index', -1);
          tooltip.transition().style('opacity', 0);
          d3.select(this).transition().style('opacity', 0.8).attr('r', 4);
        };

        const mousemove = function (event, d) {
          tooltip
            .html(
              `<b>${d.geo_label}</b>
                <br>Life Expectancy = ${d.obs_value} years`,
            )
            .style('top', `${event.pageY}px`)
            .style('left', `${event.pageX + 20}px`);
        };

        // Draw dots
        svg
          .selectAll('circle')
          .data(test)
          .join('circle')
          .attr('cx', (d) => xScale(d.obs_value))
          .attr('cy', (d) => yScale(d.country) + yScale.bandwidth() / 2)
          .attr('r', 4)
          .attr('fill', (d) => colorScale(d.obs_value))
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .on('mouseover', mouseover)
          .on('mouseout', mouseout)
          .on('mousemove', mousemove);

        const names = data.map((d) => d.country);
        const countries = [...new Set(names)];

        // grid lines
        svg
          .selectAll('.grid')
          .data(countries)
          .join('line')
          .attr('class', 'gridline')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', (d) => yScale(d))
          .attr('y2', (d) => yScale(d));

        // x-axis name
        svg
          .append('text')
          .attr('transform', `translate(${width / 2 - 100}, ${height + margin.b - 50})`)
          .attr('class', 'axis-name')
          .text('Life expectancy at birth (years)');

        // y-axis name
        svg
          .append('text')
          .attr('transform', `translate(${-margin.l + 20}, ${height / 2}) rotate(-90)`)
          .attr('class', 'axis-name')
          .text('Country');
      } else {
        svg
          .append('text')
          .attr('x', width / 2 - 80)
          .attr('y', height / 2 - margin.b)
          .attr('text-anchor', 'middle')
          .style('font-size', 'xxx-large')
          .attr('alignment-baseline', 'middle')
          .text('No Data for selected year')
          .attr('fill', '#CCCCCC');
      }
    }
    window.updateChart7 = updateChart7;
    updateChart7(2010);
  })
  .catch((e) => {
    console.log(e);
  });
