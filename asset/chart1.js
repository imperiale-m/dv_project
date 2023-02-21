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
d3.json('../data/CNTR_RG_10M_2016_4326.geojson')
  .then((data) => {
    const margin = {
      t: 40,
      r: 60,
      b: 40,
      l: 60,
    };
    const width = 600;
    const height = 400;

    // console.log(data);
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

    const g = svg.append('g');

    g.selectAll('path')
      .data(data.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', 'lightgray')
      .style('stroke', 'black')
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
