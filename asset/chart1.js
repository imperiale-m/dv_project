// const urls = ['file1.csv', 'file2.csv'];
//
// // Create an array of Promises for each file
// const promises = urls.map((url) => d3.csv(url));
//
// // Wait for all the Promises to complete
// Promise.all(promises)
//   .then((data) => {
//     // data will be an array of arrays, one for each CSV file
//     const data1 = data[0];
//     const data2 = data[1];
//
//     // Process the data here
//     console.log(data1);
//     console.log(data2);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const dataset = new Map();

const colorScale = d3.scaleQuantize().domain([70, 85]).range(d3.schemeGreens[9]);

Promise.all([
  d3.json('../data/CNTR_RG_10M_2016_4326.geojson'),
  d3.csv(
    'data/eurostat_data_2.csv',
    (d) => {
      dataset.set(d.geo, d.life_expectancy_total);
    },
    d3.autoType,
  ),
])
  .then((data) => {
    const geoData = data[0];
    const margin = {
      t: 40,
      r: 60,
      b: 40,
      l: 60,
    };
    const width = 600;
    const height = 400;

    // group data by 'geo'
    const dataByYear = d3.group(data[1], (d) => d.time_period);

    const dataBySelectedYear = dataByYear.get(2018) ?? 0;
    // group data by 'geo'
    const dataByGeo = d3.group(dataBySelectedYear, (d) => d.geo);
    // console.log(geoData.features);
    console.log(dataByGeo.get('IT')[0].life_expectancy_total);

    const eu_countries = [
      'ALB',
      'AUT',
      'BEL',
      'BGR',
      'CHE',
      'CYP',
      'CZE',
      'DEU',
      'DNK',
      'EST',
      'GRC',
      'ESP',
      'FIN',
      'FRA',
      'HRV',
      'HUN',
      'IRL',
      'ISL',
      'ITA',
      'LTU',
      'LUX',
      'LVA',
      'MKD',
      'MLT',
      'NLD',
      'NOR',
      'POL',
      'PRT',
      'ROU',
      'SRB',
      'SWE',
      'SVN',
      'SVK',
      'TUR',
      'GBR',
    ];

    const filteredEuFeatures = geoData.features.filter((feature) =>
      eu_countries.includes(feature.properties.ISO3_CODE),
    );

    const filteredNotEuFeatures = geoData.features.filter(
      (feature) => !eu_countries.includes(feature.properties.ISO3_CODE),
    );

    const finalMap = [...filteredNotEuFeatures, ...filteredEuFeatures];

    console.log('Final', finalMap);

    // append the svg object to the div with id #a3_task1
    const svg = d3
      .select('#chart1')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const projection = d3
      .geoTransverseMercator()
      .center([15, 50])
      .scale(700)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    svg
      .append('path')
      .attr('d', pathGenerator({ type: 'Sphere' }))
      .attr('fill', 'lightcyan');

    const g = svg.append('g');

    g.selectAll('path')
      .data(finalMap)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', (d) => {
        if (eu_countries.includes(d.properties.ISO3_CODE)) {
          d.lifeExp = dataByGeo.get(d.id)[0].life_expectancy_total;
          return colorScale(d.lifeExp);
        }
        return '#e0dfdf';
      })
      .style('stroke', (d) => {
        if (eu_countries.includes(d.properties.ISO3_CODE)) return 'black';
        return 'none';
      })
      .style('stroke-width', '0.5px');

    function zoomed(event) {
      const { transform } = event;
      g.attr('transform', transform);
      g.attr('stroke-width', 1 / transform.k);
    }

    // Redraw the map with the updated projection
    g.selectAll('path').attr('d', pathGenerator);

    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed);

    svg.call(zoom);
  })
  .catch((e) => {
    console.log(e);
  });
