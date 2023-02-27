// Data
d3.csv('data/eurostat_data_2.csv', d3.autoType)
  .then((data) => {
    // List of groups
    const allGroup = ['CO2', 'Nitrous oxide', 'PM2.5', 'PM10'];
    const xAxisLabels = [
      'CO2 (metric tons per capita)',
      'Nitrous oxide (thousand metric tons of CO2 equivalent)',
      'PM2.5 (µg/m3)',
      'PM10 (µg/m3)',
    ];

    // Add the options to the button
    d3.select('#selectButtonBubble')
      .selectAll('myOptions')
      .data(allGroup)
      .join('option')
      .text((d) => d) // text showed in the menu
      .attr('value', (d) => d); // corresponding value returned by the button

    const params = ['co2_metric_tons_per_capita', 'nitrous_oxide_metric_tons', 'pm2_5', 'pm10'];

    function drawChart(filteredData, x, y, z) {
      d3.select('#chart8Variable').html(allGroup[x]);

      const margin = {
        t: 80,
        r: 40,
        b: 100,
        l: 100,
      };
      const width = 600;
      const height = 400;

      const svg = d3
        .select('#chart8')
        .append('svg')
        .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
        .attr('style', 'max-width: 100%; height: auto')
        .append('g')
        .attr('transform', `translate(${margin.l}, ${margin.t})`);

      const dataX = filteredData.filter((d) => d[params[x]] !== 0);
      const dataY = filteredData.filter((d) => d[y] !== 0);

      // xAxis
      const xDomain = d3.extent(dataX, (d) => d[params[x]]);
      const xRange = [20, width - 20];
      const xScale = d3.scaleLinear(xDomain, xRange).nice();
      const xAxis = d3.axisBottom(xScale);

      // yAxis
      const yDomain = d3.extent(dataY, (d) => d[y]);
      const yRange = [height - 20, 20];
      const yScale = d3.scaleLinear(yDomain, yRange).nice();
      const yAxis = d3.axisLeft(yScale);

      // Add a scale for bubble size
      const zDomain = d3.extent(filteredData, (d) => d[z]);
      const zRange = [2, 16];
      const zScale = d3.scaleLinear(zDomain, zRange);

      // plot the xAxis
      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .transition()
        .duration(750)
        .call(xAxis)
        .style('text-anchor', 'end')
        .selectAll('text');

      // plot the yAxis
      svg.append('g').transition().duration(750).call(yAxis);

      const tooltip = d3.select('#chart8').append('div').attr('class', 'tooltip');

      const mouseover = function () {
        tooltip.style('z-index', 40);
        tooltip.transition().style('opacity', 0.9);
        d3.select(this).transition().style('fill', 'steelblue');
      };

      const mouseout = function () {
        tooltip.style('z-index', -1);
        tooltip.transition().style('opacity', 0);
        d3.select(this).transition().style('fill', 'gray');
      };

      const mousemove = function (event, d) {
        tooltip
          .html(
            `<b>${d.country}</b><br>GDP = <b>${d[z]}</b>
                <br>${xAxisLabels[x]} = <b>${Number.parseFloat(d[params[x]]).toFixed(2)}</b>
                <br>Life Expectancy = <b>${Number.parseFloat(d[y]).toFixed(2)} 
                years (${d.time_period})</b>`,
          )
          .style('top', `${event.pageY}px`)
          .style('left', `${event.pageX + 20}px`);
      };

      const bubble = svg
        .append('g')
        .selectAll('dot')
        .data(filteredData.filter((d) => d[params[x]] !== 0))
        .join('circle')
        .attr('cx', (d) => xScale(d[params[x]]))
        .attr('cy', (d) => yScale(d[y]))
        .attr('r', (d) => zScale(d[z]))
        .style('fill', 'gray')
        .style('opacity', 0.8)
        .attr('stroke', 'black')
        .style('stroke-width', '1px')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove);

      bubble
        .attr('r', zRange[0])
        .transition()
        .duration(500)
        .attr('r', (d) => zScale(d[z]))
        .delay((_, i) => i * 10);

      /// TEST
      const meanLifeExp = d3.mean(filteredData, (d) => d[y]);

      svg
        .append('g')
        .attr('transform', `translate(0, ${yScale(meanLifeExp)})`)
        .append('line')
        .attr('x1', 20)
        .attr('x2', width - 20)
        .style('stroke', 'steelblue')
        .style('stroke-width', '1px')
        .style('stroke-dasharray', '6, 6')
        .style('opacity', 1);

      svg
        .append('text')
        .attr('transform', `translate(${width - 140}, ${yScale(meanLifeExp) - 5})`)
        .text('EU Average life expectancy')
        .style('fill', 'steelblue')
        .style('font-size', '10px')
        .style('opacity', 1);
      /// END TEST

      // xAxis name
      svg
        .append('text')
        .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
        .attr('transform', `translate(${width / 2}, ${height + margin.b / 2})`)
        .attr('class', 'axis-name')
        .text(xAxisLabels[x]);

      // yAxis name
      svg
        .append('text')
        .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
        .attr('transform', `translate(${margin.l / 2 - margin.l},${height / 2})rotate(-90)`) // text is drawn off the screen top left, move down and out and rotate
        .attr('class', 'axis-name')
        .text('Life expectancy (years)');

      // Add title
      // svg
      //   .append('text')
      //   .attr('x', width / 2)
      //   .attr('y', 10 - margin.t / 2)
      //   .attr('text-anchor', 'middle')
      //   .style('font-size', '20px')
      //   .text('Title');
    }

    function updateChart8(selectedGroup, year) {
      d3.selectAll('#chart8 > svg').remove();
      d3.select('#chart8Year').html(year);

      // group data by 'time_period'
      const dataByYear = d3.group(data, (d) => d.time_period);

      // console.log(dataByYear.get(2009));
      const filteredData = dataByYear.get(year) ?? 0;

      drawChart(filteredData, selectedGroup, 'life_expectancy_total', 'gdp');
    }

    // When the button is changed, run the updateChart function
    d3.select('#selectButtonBubble').on('change', function () {
      // recover the option that has been chosen
      const selectedOption = d3.select(this).property('selectedIndex');

      const el = document.querySelector('#yearValue');
      console.log(parseInt(el.value, 10));
      // run the updateChart function with this selected option
      updateChart8(selectedOption, parseInt(el.value, 10));
    });
    window.updateChart8 = updateChart8;
    updateChart8(0, 2012);
  })
  .catch((e) => {
    console.log(e);
  });
