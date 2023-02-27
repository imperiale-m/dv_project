function zoom(card, button) {
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

function inc(element) {
  const el = document.querySelector(`#${element}`);
  if (parseInt(el.value, 10) < 2021) {
    el.value = parseInt(el.value, 10) + 1;
    updateChart6(parseInt(el.value, 10));
    updateChart1(parseInt(el.value, 10));
    updateChart5(parseInt(el.value, 10));
    updateChart7(parseInt(el.value, 10));
    updateChart3(0, parseInt(el.value, 10));
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
    updateChart3(0, parseInt(el.value, 10));
  }
}
