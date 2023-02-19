// Assignment 5
d3.csv('../data/death_causes.csv', d3.autoType)
  .then((data) => {
    const margin = {
      t: 40,
      r: 40,
      b: 40,
      l: 40,
    };
    const width = 600;
    const height = 400;

    // console.log(data);

    // Format data for Sankey diagram
    // NODES
    const col = data.columns.slice(1);
    const names = [...data.map((d) => d.icd10)];
    let nodes = [];
    for (let y = 0; y < col.length; y += 1) {
      const nodes1 = d3.map(names, (d, i) => {
        const node = i + y * 21;
        const name = `${col[y]} ${d}`;
        return { node, name };
      });
      nodes = [...nodes, ...nodes1];
    }

    // console.log('Nodes', nodes);

    // LINKS
    // const tot1 = d3.sum(d3.map(data, (d) => d[col[0]]));
    // const tot2 = d3.sum(d3.map(data, (d) => d[col[1]]));
    let links = [];
    for (let y = 0; y < col.length - 1; y += 1) {
      const tot = d3.sum(d3.map(data, (e) => e[col[y]]));
      // console.log(tot);
      const link1 = d3.map(data, (d, i) => {
        const source = i + y * 21;
        const target = i + (y + 1) * 21;
        const value = d[col[y]] / tot;
        return {
          source,
          target,
          value,
        };
      });
      links = [...links, ...link1];
    }
    // console.log('Links', links);

    // Append the svg object to the div with id #a5
    const svg = d3
      .select('#chart9')
      .append('svg')
      .attr('viewBox', [0, 0, width + margin.l + margin.r, height + margin.t + margin.b])
      .attr('style', 'max-width: 100%; height: auto')
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    // Set the Sankey diagram properties
    const sankey = d3
      .sankey()
      .nodeWidth(12)
      .nodePadding(4)
      .size([width, height])
      .nodeSort((a, b) => b.value - a.value)
      .linkSort((a, b) => b.value - a.value)
      .nodeAlign(d3.sankeyJustify);

    // const color = d3.scaleOrdinal(colors);

    const sankeyData = JSON.parse(JSON.stringify({ nodes, links }));
    const graph = sankey(sankeyData);

    const node = svg
      .append('g')
      .selectAll('.node')
      .data(graph.nodes)
      .join('g')
      .attr('class', 'node');
    node
      .append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      // .attr('fill', (d) => color(d.value))
      .attr('class', 'node')
      .attr('stroke', 'black')
      .attr('stroke-width', '0.5');

    // Add the links
    svg
      .append('g')
      .selectAll('.link')
      .data(graph.links)
      .join('path')
      .attr('class', 'link')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', (d) => Math.max(1, d.width))
      .attr('stroke', 'black')
      .attr('fill', 'none');

    // Add the title for the nodes
    //   node
    //     .append('text')
    //     .attr('x', (d) => d.x0 - 5)
    //     .attr('y', (d) => (d.y1 + d.y0) / 2)
    //     .attr('dy', 2)
    //     .text((d) => d.name)
    //     .attr('text-anchor', 'end')
    //     .attr('font-size', '0.6rem')
    //     .filter((d) => d.x0 < width / 2)
    //     .attr('x', (d) => d.x1 + 5)
    //     .attr('text-anchor', 'start');
  })
  .catch((e) => {
    console.log(e);
  });
