const dataset = new Map();

Promise.all([
  d3.json('./data/CNTR_RG_10M_2016_4326.geojson'),
  d3.csv(
    './data/eurostat_data_2.csv',
    (d) => {
      dataset.set(d.geo, d.life_expectancy_total);
    },
    d3.autoType,
  ),
])
  .then((data) => {
    const colorScale = d3
      .scaleThreshold()
      .domain([65, 70, 75, 80, 85, 90])
      .range(d3.schemeGreens[6]);

    // Add color legend
    const legendWidth = 50;
    const labels = [65, 70, 75, 80, 85, 90];
    const legendSize = legendWidth * labels.length;

    const legend = d3
      .legendColor()
      .labels((d) => labels[d.i])
      .shapePadding(0)
      .orient('horizontal')
      .shapeWidth(legendWidth)
      .scale(colorScale)
      .labelAlign('start');

    // const colorScale = d3.scaleQuantize().domain([70, 85]).range(d3.schemeGreens[9]);

    const geoData = data[0];
    const margin = {
      t: 40,
      r: 60,
      b: 40,
      l: 60,
    };
    const width = 600;
    const height = 500;

    // append the svg object to the div with id #a3_task1
    const svg = d3
      .select('#chart1')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .attr('class', 'cursor-pointer')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    // group data by 'year'
    const dataByYear = d3.group(data[1], (d) => d.time_period);

    //

    function updateChart1(year) {
      svg.selectAll('*').remove();

      const dataBySelectedYear = dataByYear.get(year) ?? 0;
      // group data by 'geo'
      const dataByGeo = d3.group(dataBySelectedYear, (d) => d.geo);
      // console.log(geoData.features);
      // console.log(dataByGeo.get('IT')[0].life_expectancy_total);

      // List of subgroups
      const euCountries = [...dataByGeo.keys()];
      // console.log(euCountries);

      const filteredEuFeatures = geoData.features.filter((feature) =>
        euCountries.includes(feature.id),
      );

      const filteredNotEuFeatures = geoData.features.filter(
        (feature) => !euCountries.includes(feature.id),
      );

      const finalMap = [...filteredNotEuFeatures, ...filteredEuFeatures];

      // console.log('Final', finalMap);

      const projection = d3
        .geoTransverseMercator()
        .center([15, 50])
        .scale(700)
        .translate([width / 2, height / 2]);

      const pathGenerator = d3.geoPath().projection(projection);

      const tooltip = d3.select('#chart1').append('div').attr('class', 'tooltip');

      const mouseover = function () {
        if (this.getAttribute('fill') !== '#e0dfdf' && this.getAttribute('fill') !== 'gray') {
          tooltip.style('z-index', 1);
          tooltip.transition().style('opacity', 0.9);
          d3.select(this).transition().attr('fill', 'gold');
        }
        if (this.getAttribute('fill') === 'gray') {
          tooltip.style('z-index', 1);
          tooltip.transition().style('opacity', 0.9);
        }
      };

      const mouseout = function (event, d) {
        tooltip.style('z-index', -1);
        tooltip.transition().style('opacity', 0);
        if (this.getAttribute('fill') !== '#e0dfdf' && this.getAttribute('fill') !== 'gray') {
          d3.select(this)
            .transition()
            .attr('fill', colorScale(dataByGeo.get(d.id)[0].life_expectancy_total));
        }
      };

      // const f = d3.format('.2f');
      const mousemove = function (event, d) {
        if (this.getAttribute('fill') !== '#e0dfdf' && this.getAttribute('fill') !== 'gray') {
          const countryData = dataByGeo.get(d.id)[0];
          tooltip
            .html(
              `<b>${countryData.country}</b><br>
           Life expectancy = <b>${countryData.life_expectancy_total} years</b>`,
            )
            .style('top', `${event.pageY}px`)
            .style('left', `${event.pageX + 20}px`);
        }
        if (this.getAttribute('fill') === 'gray') {
          const countryData = dataByGeo.get(d.id)[0];
          tooltip
            .html(
              `<b>${countryData.country}</b><br>
           No data available fo this year`,
            )
            .style('top', `${event.pageY}px`)
            .style('left', `${event.pageX + 20}px`);
        }
      };

      svg
        .append('path')
        .attr('d', pathGenerator({ type: 'Sphere' }))
        .attr('fill', 'lightcyan');

      const g = svg.append('g');

      const states = g
        .selectAll('path')
        .data(finalMap)
        .join('path')
        .attr('d', pathGenerator)
        .attr('fill', (d) => {
          if (euCountries.includes(d.id)) {
            d.lifeExp = dataByGeo.get(d.id)[0].life_expectancy_total;
            d.gdp = dataByGeo.get(d.id)[0].gdp;
            return d.lifeExp ? colorScale(d.lifeExp) : 'gray';
          }
          return '#e0dfdf';
        })
        .style('stroke', (d) => {
          if (euCountries.includes(d.id)) return 'white';
          return 'none';
        })
        .style('stroke-width', '0.5px')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove);

      function zoomed(event) {
        const { transform } = event;
        g.attr('transform', transform);
        g.attr('stroke-width', 1 / transform.k);
      }

      // Redraw the map with the updated projection
      g.selectAll('path').attr('d', pathGenerator);

      const zoom = d3.zoom().scaleExtent([1, 3]).on('zoom', zoomed);

      svg.call(zoom).on('wheel.zoom', null);

      function reset() {
        states.transition().style('fill', null);
        svg
          .transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2]),
          );
      }

      function clicked(event, d) {
        if (this.getAttribute('fill') !== '#e0dfdf') {
          const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
          let year = document.getElementById('timelineRange');
          year = parseInt(year.value, 10);
          event.stopPropagation();
          states.transition().style('fill', null);
          // console.log(d3.select(this).data()[0].properties.NAME_ENGL);
          if (this.getAttribute('fill') === 'gray') {
            d3.select('#countryValue').text(d3.select(this).data()[0].properties.NAME_ENGL);
            d3.select('#lifeExpValue').text('No data');
            d3.select('#gdpValue').text(d3.select(this).data()[0].gdp);
          } else {
            d3.select('#countryValue').text(d3.select(this).data()[0].properties.NAME_ENGL);
            d3.select('#lifeExpValue').text(`${d3.select(this).data()[0].lifeExp} years`);
            d3.select('#gdpValue').text(d3.select(this).data()[0].gdp);
            d3.select(this).transition().style('fill', 'gold');
            drawChart2(d3.select(this).data()[0].properties.ISO3_CODE);
            drawChart4(d3.select(this).data()[0].properties.CNTR_ID);
            updateChart5(d3.select(this).data()[0].properties.NAME_ENGL, year);
            updateChart9(d3.select(this).data()[0].properties.NAME_ENGL, year);
          }
          svg
            .transition()
            .duration(750)
            .call(
              zoom.transform,
              d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(3, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
              d3.pointer(event, svg.node()),
            );
        }
      }

      g.selectAll('path').on('click', clicked);
      svg.on('click', reset);

      svg
        .append('g')
        .attr('class', 'legendThreshold')
        .attr('font-family', 'Fira Sans, sans-serif')
        .attr('font-size', '12px')
        .attr(
          'transform',
          `translate(${(width - legendSize - (margin.l - margin.r)) / 2},
                                  ${height})`,
        );

      svg
        .select('.legendThreshold')
        .append('text')
        .attr('class', 'caption')
        .attr('x', legendWidth)
        .attr('y', -10)
        .style('font-family', 'Fira Sans, sans-serif')
        .style('font-size', '14px')
        .attr('text-anchor', 'middle')
        .text('Life Expectancy');

      svg.select('.legendThreshold').call(legend);
    }

    window.updateChart1 = updateChart1;
    updateChart1(2012);
  })
  .catch((e) => {
    console.log(e);
  });
