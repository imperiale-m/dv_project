function expandCard(card, open, close) {
  d3.selectAll('#blur').classed('hidden', false);
  d3.select(card).classed('active', true);
  d3.select(open).classed('hidden', true);
  d3.select(close).classed('hidden', false);
}

function closeCard(card, open, close) {
  d3.selectAll('#blur').classed('hidden', true);
  d3.select(card).classed('active', false);
  d3.select(open).classed('hidden', false);
  d3.select(close).classed('hidden', true);
}
