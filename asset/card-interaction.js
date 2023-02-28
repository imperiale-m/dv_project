function zoom(card, button, info) {
  info.classList.toggle('hidden');
  const modal = document.getElementById('modal');
  modal.classList.toggle('hidden');
  if (modal.classList.contains('hidden')) {
    card.classList.toggle('active');
    document.body.style.overflow = 'auto';
    document.exitFullscreen();
    button.innerHTML = 'Zoom';
  } else {
    card.classList.toggle('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.requestFullscreen();
    button.innerHTML = 'Exit Zoom';
  }
}

function InfoCard(cardFront, cardBack, info) {
  cardFront.classList.toggle('z-[2]');
  cardBack.classList.toggle('z-[1]');
  info.classList.toggle('text-white');
  if (cardFront.classList.contains('z-[2]')) {
    info.innerHTML = 'Info';
  } else {
    info.innerHTML = 'Close Info';
  }
  if (cardFront.classList.contains('active')) {
    cardBack.classList.toggle('active');
  }
}

function closeInitialPopup() {
  document.getElementById('initialPopup').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function changeYear(el) {
  // console.log(el.value);
  const country = document.getElementById('countryValue').textContent;
  const year = parseInt(el.value, 10);
  updateChart1(year, country);
  updateChart3(0, year);
  updateChart5(country, year);
  updateChart6(year);
  updateChart7(year);
  updateChart8(0, year);
  updateChart9(country, year);
}
