// Task 5
// Data
d3.csv('data/preprocessedData.csv', d3.autoType)
  .then((data) => {
    // console.log(data);

    // List of groups (here I have one group per column)
    const allGroup = ['CO2', 'Nitrous oxide'];

    // add the options to the button
    d3.select('#selectButtonBubble')
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text((d) => d) // text showed in the menu
      .attr('value', (d) => d); // corresponding value returned by the button

    function drawChart(filtData, x, y, z) {
      const margin = {
        t: 45,
        r: 40,
        b: 100,
        l: 100,
      };
      const width = 600;
      const height = 400;

      const xDomain = [0, d3.max(filtData, (d) => d[x])];
      const xRange = [0, width];

      const yDomain = [0, d3.max(filtData, (d) => d[y])];
      const yRange = [height, 0];

      const zDomain = d3.extent(filtData, (d) => d[z]);
      const zRange = [1, 16];

      // Construct scales and axes.
      const xScale = d3.scaleLinear(xDomain, xRange).nice();
      const yScale = d3.scaleLinear(yDomain, yRange).nice();
      // Add a scale for bubble size
      const zScale = d3.scaleLinear(zDomain, zRange);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      const names = filtData.map((d) => d.Location);
      const species = [...new Set(names)];
      // Add a scale for bubble color
      const color = d3.scaleOrdinal().domain(species).range(d3.schemeCategory10);

      const svg = d3
        .select('#chart8')
        .append('svg')
        .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
        .attr('style', 'max-width: 100%; height: auto')
        .append('g')
        .attr('transform', `translate(${margin.l}, ${margin.t})`);

      // plot the x-axis
      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end');

      // plot the y-axis
      svg.append('g').call(yAxis);

      const tooltip = d3.select('#chart8').append('div').attr('class', 'tooltip');

      const mouseover = function () {
        tooltip.style('z-index', 1);
        tooltip.transition().style('opacity', 0.9);
        d3.select(this).style('opacity', 1);
      };

      const mouseout = function () {
        tooltip.style('z-index', -1);
        tooltip.transition().style('opacity', 0);
        d3.select(this).style('opacity', 0.8);
      };

      const mousemove = function (event, d) {
        tooltip
          .html(
            `Country = <b>${d.Location}</b><br>${x} = <b>${d[x]} years</b>
                    <br>${y} = <b>${d[y]}</b>
                    <br>${z} = <b>${d[z]}</b>`,
          )
          .style('top', `${event.pageY}px`)
          .style('left', `${event.pageX + 20}px`);
      };

      svg
        .append('g')
        .selectAll('dot')
        .data(filtData)
        .join('circle')
        .attr('cx', (d) => xScale(d[x]))
        .attr('cy', (d) => yScale(d[y]))
        .attr('r', (d) => zScale(d[z]))
        .style('fill', (d) => color(d.Location))
        .style('opacity', '0.7')
        .attr('stroke', 'black')
        .style('stroke-width', '1px')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove);

      const padding = 100;

      // x-axis name
      svg
        .append('text')
        .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
        .attr('transform', `translate(${width / 2}, ${height + margin.b / 2})`)
        .attr('class', 'axis-name')
        .text(x);
      // y-axis name
      svg
        .append('text')
        .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
        .attr('transform', `translate(${margin.l / 2 - padding},${height / 2})rotate(-90)`) // text is drawn off the screen top left, move down and out and rotate
        .attr('class', 'axis-name')
        .text(y);
      // add title
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', 10 - margin.t / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '20px')
        .text('Title');
    }

    function update(selectedGroup, period) {
      d3.selectAll('#chart8 > svg').remove();

      const filtData = data.filter(
        (d) => !isNaN(d['Life expectancy at birth, total (years)'])
          && d['Life expectancy at birth, total (years)'] !== '..'
          && d['Current health expenditure (% of GDP)'] !== '..'
          && d[selectedGroup] !== '..'
          && d.Period === period,
      );

      drawChart(
        filtData,
        'Life expectancy at birth, total (years)',
        'Current health expenditure (% of GDP)',
        selectedGroup,
      );
    }

    // When the button is changed, run the updateChart function
    d3.select('#selectButtonBubble').on('change', function () {
      // recover the option that has been chosen
      let selectedOption = d3.select(this).property('value');

      switch (selectedOption) {
        case 'CO2':
          selectedOption = 'CO2 emissions (metric tons per capita)';
          break;
        case 'SF6':
          selectedOption = 'SF6 gas emissions (thousand metric tons of CO2 equivalent)';
          break;
        case 'Nitrous oxide':
          selectedOption = 'Nitrous oxide emissions (thousand metric tons of CO2 equivalent)';
          break;
        case 'HFC':
          selectedOption = 'HFC gas emissions (thousand metric tons of CO2 equivalent)';
          break;
        default:
          break;
      }
      console.log(selectedOption);
      // run the updateChart function with this selected option
      update(selectedOption, 2015);
    });
    update('CO2 emissions (metric tons per capita)', 2015);
  })
  .catch((e) => {
    console.log(e);
  });
