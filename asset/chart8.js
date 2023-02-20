// Task 5
// Data
d3.csv('data/eurostat_data_2.csv', d3.autoType)
  .then((data) => {
    // console.log(data);

    // List of groups (here I have one group per column)
    const allGroup = ['CO2', 'Nitrous oxide', 'PM2.5', 'PM10'];

    // add the options to the button
    d3.select('#selectButtonBubble')
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text((d) => d) // text showed in the menu
      .attr('value', (d) => d); // corresponding value returned by the button

    const convertName = (label) => {
      switch (label) {
        case 'co2_metric_tons_per_capita':
          return 'CO2';
        case 'nitrous_oxide_metric_tons':
          return 'Nitrous oxide';
        case 'pm2_5':
          return 'PM2.5';
        case 'pm10':
          return 'PM10';
        case 'life_expectancy_total':
          return 'Life expectancy';
        default:
          return 'Error';
      }
    };

    function drawChart(filtData, x, y, z) {
      const margin = {
        t: 45,
        r: 40,
        b: 100,
        l: 100,
      };
      const width = 600;
      const height = 400;

      const yDomain = [0, d3.max(filtData, (d) => d[y])];
      const yRange = [height, 0];

      const zDomain = d3.extent(filtData, (d) => d[z]);
      const zRange = [1, 16];

      // Domain excluding zeroes
      const dom = d3.extent(
        filtData.filter((d) => d[x] !== 0),
        (d) => d[x],
      );

      // Construct scales and axes.
      const xScale = d3.scaleLinear().domain(dom).nice().range([0, width]);
      const yScale = d3.scaleLinear(yDomain, yRange).nice();
      // Add a scale for bubble size
      const zScale = d3.scaleLinear(zDomain, zRange);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      const names = filtData.map((d) => d.country);
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
        const xLabel = convertName(x);
        const yLabel = convertName(y);
        tooltip
          .html(
            `Country = <b>${d.country}</b><br>${xLabel} = <b>${d[x]}</b>
                    <br>${yLabel} = <b>${d[y]}</b>
                    <br>${z} = <b>${d[z]}</b>`,
          )
          .style('top', `${event.pageY}px`)
          .style('left', `${event.pageX + 20}px`);
      };

      svg
        .append('g')
        .selectAll('dot')
        .data(filtData.filter((d) => d[x] !== 0))
        .join('circle')
        .attr('cx', (d) => xScale(d[x]))
        .attr('cy', (d) => yScale(d[y]))
        .attr('r', (d) => zScale(d[z]))
        .style('fill', (d) => color(d.country))
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
        .text(convertName(x));
      // y-axis name
      svg
        .append('text')
        .attr('text-anchor', 'middle') // this makes it easy to centre the text as the transform is applied to the anchor
        .attr('transform', `translate(${margin.l / 2 - padding},${height / 2})rotate(-90)`) // text is drawn off the screen top left, move down and out and rotate
        .attr('class', 'axis-name')
        .text('Life expectancy (years)');
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

      // group data by 'time_period'
      const dataByYear = d3.group(data, (d) => d.time_period);
      // console.log(dataByYear.get(2009));

      const filtData = dataByYear.get(period);

      drawChart(filtData, selectedGroup, 'life_expectancy_total', 'gdp');
    }

    // When the button is changed, run the updateChart function
    d3.select('#selectButtonBubble').on('change', function () {
      // recover the option that has been chosen
      let selectedOption = d3.select(this).property('value');

      switch (selectedOption) {
        case 'CO2':
          selectedOption = 'co2_metric_tons_per_capita';
          break;
        case 'Nitrous oxide':
          selectedOption = 'nitrous_oxide_metric_tons';
          break;
        case 'PM2.5':
          selectedOption = 'pm2_5';
          break;
        case 'PM10':
          selectedOption = 'pm10';
          break;
        default:
          break;
      }
      console.log(selectedOption);
      // run the updateChart function with this selected option
      update(selectedOption, 2015);
    });
    update('co2_metric_tons_per_capita', 2015);
  })
  .catch((e) => {
    console.log(e);
  });
