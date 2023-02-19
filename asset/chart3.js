// Task 3
// Data
d3.csv('data/preprocessedData.csv', d3.autoType)
  .then((data) => {
    // console.log(data);

    // List of groups (here I have one group per column)
    const allGroup = ['Measles', 'HEPB', 'DPT', 'BCG'];

    // add the options to the button
    d3.select('#selectButtonScatter')
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text((d) => d) // text showed in the menu
      .attr('value', (d) => d); // corresponding value returned by the button

    function drawChart(filtData, y, x) {
      const margin = {
        t: 60,
        r: 80,
        b: 80,
        l: 80,
      };
      const width = 400;
      const height = 300;

      const xDomain = d3.extent(filtData, (d) => d[x]);
      const xRange = [0, width];

      const yDomain = d3.extent(filtData, (d) => d[y]);
      const yRange = [height, 0];

      // console.log('domain', xDomain);

      // Construct scales and axes.
      const xScale = d3.scaleLinear(xDomain, xRange).nice();
      const yScale = d3.scaleLinear(yDomain, yRange).nice();

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      const svg = d3
        .select('#chart3')
        .append('svg')
        .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
        .attr('style', 'max-width: 100%; height: auto; height:intrinsic')
        .append('g')
        .attr('transform', `translate(${margin.l}, ${margin.t})`);

      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'middle');

      // plot the y-axis
      svg.append('g').call(yAxis);

      const countries = data.map((d) => d.Location);
      const species = [...new Set(countries)];
      // Add a scale for bubble color
      const color = d3
        .scaleOrdinal()
        .domain(species)
        // .domain((d) => d.name)
        .range(d3.schemeCategory10);

      const tooltip = d3.select('#chart3').append('div').attr('class', 'tooltip');

      const mouseover = function () {
        tooltip.style('z-index', 1);
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
            `Country = <b>${d.Location}</b><br>
           Life expectancy = <b>${Number.parseFloat(d[y]).toFixed(2)} years (${d.Period})</b>
                    <br>${y} immunization = <b>${d[x]} %</b>`,
          )
          .style('top', `${event.pageY}px`)
          .style('left', `${event.pageX + 20}px`);
      };

      svg
        .append('g')
        .selectAll('dot')
        .data(filtData)
        .join('circle')
        .attr('class', (d) => `dot ${d.Location}`)
        .attr('cx', (d) => xScale(d[x]))
        .attr('cy', (d) => yScale(d[y]))
        .attr('r', 4)
        .attr('stroke', 'black')
        .style('stroke-width', 'px')
        .style('fill', (d) => color(d.Location))
        .style('opacity', 0.8)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove);

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
        .attr('transform', `translate(${-margin.l / 2},${margin.t + 50})rotate(-90)`) // text is drawn off the screen top left, move down and out and rotate
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
      d3.selectAll('#chart3 > svg').remove();

      // What the fuck is this!!
      const filtData = data.filter(
        (d) =>
          !isNaN(d['Life expectancy at birth, total (years)']) &&
          d[selectedGroup] !== '..' &&
          d.Period === period,
      );

      drawChart(filtData, 'Life expectancy at birth, total (years)', selectedGroup);
    }

    // When the button is changed, run the updateChart function
    d3.select('#selectButtonScatter').on('change', function () {
      // recover the option that has been chosen
      let selectedOption = d3.select(this).property('value');

      switch (selectedOption) {
        case 'Measles':
          selectedOption = 'Measles';
          break;
        case 'DPT':
          selectedOption = 'DPT';
          break;
        case 'BCG':
          selectedOption = 'BCGValue';
          break;
        case 'HEPB':
          selectedOption = 'HEPBValue';
          break;
        default:
          break;
      }
      // console.log(selectedOption);
      // run the updateChart function with this selected option
      update(selectedOption, 2015);
    });
    update(allGroup[0], 2015);
  })
  .catch((e) => {
    console.log(e);
  });
