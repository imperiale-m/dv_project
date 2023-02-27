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
    t: 40,
    r: 40,
    b: 40,
    l: 180,
  };
  const width = 600;
  const height = 500;

  const svg = d3
    .select('#chart5')
    .append('svg')
    .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
    .attr('style', 'max-width: 100%; height: auto')
    .append('g')
    .attr('transform', `translate(${margin.l}, ${margin.t})`);

  // group data by 'year'
  const dataByYear = d3.group(data, (d) => d.time_period);

  function updateChart5(year) {
    svg.selectAll('*').remove();

    const dataBySelectedYear = dataByYear.get(year) ?? 0;
    // console.log(dataBySelectedYear);

    if (dataBySelectedYear !== 0) {
      // group data by 'geo'
      const dataByGeo = d3.group(dataBySelectedYear, (d) => d.geo);

      const dataBySelectedCountry = dataByGeo.get('Italy') ?? 0;

      // console.log(dataByGeo);
      // console.log(dataBySelectedCountry.sort((a, b) => d3.descending(a.value, b.value)));

      const top10 = dataBySelectedCountry
        .sort((a, b) => d3.descending(a.value, b.value))
        .slice(1, 10);
      // console.log(top10);

      // Add X axis
      const x = d3
        .scaleLinear()
        .domain([0, d3.max(top10.map((d) => d.value))])
        .range([0, width]);
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
      svg
        .selectAll('rect')
        .data(top10)
        .join('text')
        .attr('x', x(0))
        .attr('y', (d) => y(d.icd10))
        .text('prova');

      svg
        .selectAll('myRect')
        .data(top10)
        .join('text')
        .attr('x', (d) => x(d.value) - margin.r)
        .attr('y', (d) => y(d.icd10) + 25)
        .text((d) => d.value)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('fill', 'white');
    } else {
      svg
        .append('text')
        .attr('x', width / 2 - margin.r)
        .attr('y', height / 2 - margin.b)
        .style('font-size', 'xxx-large')
        .style('text-anchor', 'middle')
        .text('No Data for selected year');
    }
  }
  window.updateChart5 = updateChart5;
  updateChart5(2010);
});
