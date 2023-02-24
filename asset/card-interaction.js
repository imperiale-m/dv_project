function expandCard(card, open, close) {
  d3.selectAll('#modal').classed('hidden', false);
  d3.select(card).classed('active', true);
  d3.select(open).classed('hidden', true);
  d3.select(close).classed('hidden', false);
  document.documentElement.requestFullscreen();
}

function closeCard(card, open, close) {
  d3.selectAll('#modal').classed('hidden', true);
  d3.select(card).classed('active', false);
  d3.select(open).classed('hidden', false);
  d3.select(close).classed('hidden', true);
  document.exitFullscreen();
}
