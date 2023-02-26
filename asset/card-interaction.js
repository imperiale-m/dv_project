function expandCard(card, open, close) {
  d3.select('#modal').classed('hidden', false);
  d3.select(card).classed('active', true);
  d3.select(open).classed('hidden', true);
  d3.select(close).classed('hidden', false);
  document.body.style.overflow = 'hidden';
  document.documentElement.requestFullscreen();
}

function closeCard(card, open, close) {
  d3.select('#modal').classed('hidden', true);
  d3.select(card).classed('active', false);
  d3.select(open).classed('hidden', false);
  d3.select(close).classed('hidden', true);
  document.body.style.overflow = 'auto';
  document.exitFullscreen();
}

function inc(element) {
  const el = document.querySelector(`#${element}`);
  if (parseInt(el.value, 10) < 2021) {
    el.value = parseInt(el.value, 10) + 1;
    updateChart6(parseInt(el.value, 10));
    updateChart1(parseInt(el.value, 10));
    updateChart5(parseInt(el.value, 10));
    updateChart7(parseInt(el.value, 10));
  }
}

function dec(element) {
  const el = document.querySelector(`#${element}`);
  if (parseInt(el.value, 10) > 2010) {
    el.value = parseInt(el.value, 10) - 1;
    updateChart6(parseInt(el.value, 10));
    updateChart1(parseInt(el.value, 10));
    updateChart5(parseInt(el.value, 10));
    updateChart7(parseInt(el.value, 10));
  }
}
