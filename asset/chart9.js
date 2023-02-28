// Assignment 5
function wrap(text, width2) {
  text.each(function () {
    const text2 = d3.select(this);
    const words = text2.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const lineHeight = 1.1; // ems
    const y = text2.attr('y');
    const x = text2.attr('x');
    const dy = parseFloat(text2.attr('dy'));
    let tspan = text2.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', `${dy}em`);
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width2) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text2
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word);
      }
    }
  });
}

// Parse the Data
d3.csv('./data/death_causes.csv', d3.autoType).then((data) => {
  const margin = {
    t: 60,
    r: 40,
    b: 40,
    l: 180,
  };
  const width = 500;
  const height = 450;

  // group data by 'year'
  const dataByYear = d3.group(data, (d) => d.time_period);

  const chart = d3.select('#chart9');

  function updateChart9(country, year) {
    chart.selectAll('*').remove();

    const svg = chart
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    d3.select('#chart9Country').html(country);
    d3.select('#chart9Year').html(year);

    const dataBySelectedYear = dataByYear.get(year) ?? 0;
    // console.log(dataBySelectedYear);

    if (dataBySelectedYear !== 0) {
      // group data by 'geo'
      const dataByGeo = d3.group(dataBySelectedYear, (d) => d.geo);

      console.log(country);

      const dataBySelectedCountry = dataByGeo.get(country) ?? 0;

      // console.log(dataByGeo);
      // console.log(dataBySelectedCountry.sort((a, b) => d3.descending(a.value, b.value)));

      const top10 = dataBySelectedCountry
        .sort((a, b) => d3.descending(a.value, b.value))
        .slice(1, 11);
      // console.log(top10);

      // Add X axis
      const x = d3
        .scaleLinear()
        .domain([0, d3.max(top10.map((d) => d.value))])
        .range([0, width])
        .nice();
      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('.2s')))
        .selectAll('text')
        .style('text-anchor', 'end');

      // Y axis
      const y = d3
        .scaleBand()
        .range([0, height])
        .domain(top10.map((d) => d.icd10))
        .padding(0.1);
      svg.append('g').call(d3.axisLeft(y)).selectAll('.tick text').call(wrap, 150);

      // Bars
      svg
        .selectAll('myRect')
        .data(top10)
        .join('rect')
        .attr('x', x(0))
        .attr('y', (d) => y(d.icd10))
        .attr('width', (d) => x(d.value))
        .attr('height', y.bandwidth())
        .attr('fill', 'steelblue');

      // Bars
      // svg
      //   .selectAll('rect')
      //   .data(top10)
      //   .join('text')
      //   .attr('x', x(0))
      //   .attr('y', (d) => y(d.icd10))
      //   .text('prova');

      svg
        .selectAll('myRect')
        .data(top10)
        .join('text')
        .attr('x', (d) => x(d.value) - 50)
        .attr('y', (d) => y(d.icd10) + 22)
        .text((d) => d.value)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '14px')
        .attr('fill', 'white');
    } else {
      chart.selectAll('*').remove();
      chart
        .attr('class', 'h-[200px] md:h-[600px]')
        .append('div')
        .attr(
          'class',
          'inset-0 flex items-center justify-center rounded-2xl h-full text-3xl text-neutral-400',
        )
        .html('No data for selected year!');
    }
  }

  window.updateChart9 = updateChart9;
  updateChart9('Italy', 2012);
});
