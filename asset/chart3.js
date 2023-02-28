// Data
d3.csv('data/eurostat_data_2.csv', d3.autoType)
  .then((data) => {
    // console.log(data);

    // List of groups (here I have one group per column)
    const allGroup = ['Alcohol', 'Tobacco', 'Working Hours', 'Measles', 'HEPB', 'DPT', 'BCG'];
    const xAxisLabels = [
      'Alcohol (liters of pure alcohol per capita)',
      'Tobacco (age-standardized % of current tobacco use)',
      'Working Hours (hours/year)',
      'Measles (% of children ages 12-23 months)',
      'HEPB (% of children ages 12-23 months)',
      'DPT (% of children ages 12-23 months)',
      'BCG (% of children ages 12-23 months)',
    ];

    const chart = d3.select('#chart3');

    const tooltip = d3.select('body').append('div').attr('class', 'tooltip');

    // add the options to the button
    d3.select('#selectButtonScatter')
      .selectAll('myOptions')
      .data(allGroup)
      .join('option')
      .text((d) => d) // text showed in the menu
      .attr('value', (d) => d); // corresponding value returned by the button

    const params = ['alcohol', 'tobacco', 'working_hours', 'measles', 'hepb', 'dpt', 'bcg'];

    function drawChart(filteredData, x, y) {
      const margin = {
        t: 30,
        r: 80,
        b: 80,
        l: 80,
      };
      const width = 400;
      const height = 300;

      d3.select('#scatterVariable').html(allGroup[x]);

      // xAxis
      const xDomain = d3.extent(
        filteredData.filter((d) => d[params[x]] !== 0),
        (d) => d[params[x]],
      );
      const xRange = [10, width - 10];
      const xScale = d3.scaleLinear(xDomain, xRange).nice();
      const xAxis = d3.axisBottom(xScale);

      // yAxis
      const yDomain = d3.extent(
        filteredData.filter((d) => d[y] !== 0),
        (d) => d[y],
      );
      const yRange = [height - 10, 10];
      const yScale = d3.scaleLinear(yDomain, yRange).nice();
      const yAxis = d3.axisLeft(yScale);

      const svg = chart
        .append('svg')
        .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
        .attr('style', 'max-width: 100%; height: auto;')
        .append('g')
        .attr('transform', `translate(${margin.l}, ${margin.t})`);

      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .transition()
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'middle');

      // plot the y-axis
      svg.append('g').call(yAxis);

      const mouseover = function () {
        tooltip.style('display', 'block');
        tooltip.style('opacity', 0.9);
        d3.select(this).transition().style('opacity', 1).attr('r', 6);
      };

      const mouseout = function () {
        tooltip.style('opacity', 0).style('display', 'none');
        d3.select(this).transition().style('opacity', 0.8).attr('r', 4);
      };

      const mousemove = function (event, d) {
        tooltip
          .html(
            `Country = <b>${d.country}</b><br>
           Life expectancy = <b>${Number.parseFloat(d[y]).toFixed(2)} years (${d.time_period})</b>
                    <br>${xAxisLabels[x]} = <b>${d[params[x]]}</b>`,
          )
          .style('top', `${event.pageY}px`)
          .style('left', `${event.pageX + 20}px`);
      };

      const selectedCountry = d3.select('#countryValue').text();

      svg
        .append('g')
        .selectAll('dot')
        .data(filteredData.filter((d) => d[params[x]] !== 0))
        .join('circle')
        .attr('id', (d) => `${d.country}`)
        .attr('class', (d) => `dot ${d.country}`)
        .attr('cx', (d) => xScale(d[params[x]]))
        .attr('cy', (d) => yScale(d[y]))
        .attr('r', 4)
        .attr('stroke', 'none')
        .style('stroke-width', 'px')
        .style('fill', (d) => (d.country === selectedCountry ? 'steelblue' : 'gray'))
        .style('opacity', (d) => (d.country === selectedCountry ? 1 : 0.8))
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove);

      // x-axis name
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${width / 2}, ${height + margin.b / 2})`)
        .attr('class', 'axis-name')
        .text(xAxisLabels[x]);

      // y-axis name
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${-margin.l / 2},${margin.t + 50})rotate(-90)`)
        .attr('class', 'axis-name')
        .text('Life expectancy (years)');
    }

    function updateChart3(selectedGroup, year) {
      chart.selectAll('*').remove();

      d3.select('#scatterYear').html(year);

      // group data by 'time_period'
      const dataByYear = d3.group(data, (d) => d.time_period);

      // console.log(dataByYear.get(2009));
      const filteredData = dataByYear.get(year) ?? 0;

      // const group = d3.group(filteredData, (d) => d[allGroup[selectedGroup]]);
      const group = filteredData.filter((d) => d[params[selectedGroup]] !== 0);

      if (group.length !== 0) {
        drawChart(filteredData, selectedGroup, 'life_expectancy_total', 'gdp');
      } else {
        chart.selectAll('*').remove();
        chart
          .attr('class', 'h-[70%]')
          .append('div')
          .attr(
            'class',
            'inset-0 flex items-center justify-center rounded-2xl h-full text-xl text-neutral-400',
          )
          .html('No data for selected year!');
      }
    }

    // When the button is changed, run the updateChart function
    d3.select('#selectButtonScatter').on('change', function () {
      // recover the option that has been chosen
      const selectedOption = d3.select(this).property('selectedIndex');

      const el = document.querySelector('#timelineRange');

      // run the updateChart function with this selected option
      updateChart3(selectedOption, parseInt(el.value, 10));
    });
    window.updateChart3 = updateChart3;
    updateChart3(0, 2012);
  })
  .catch((e) => {
    console.log(e);
  });
