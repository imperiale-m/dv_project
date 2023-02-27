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
  const year = parseInt(el.value, 10);
  updateChart1(year);
  const country = document.getElementById('countryValue').textContent;
  updateChart3(0, year);
  // updateChart5(country, year);
  updateChart6(year);
  updateChart7(year);
  updateChart8(0, year);
  updateChart9(country, year);
}
//
// function inc(el) {
//   if (parseInt(el.value, 10) < 2021) {
//     el.value = parseInt(el.value, 10) + 1;
//     updateChart6(parseInt(el.value, 10));
//     updateChart1(parseInt(el.value, 10));
//     const country = document.getElementById('countryValue').textContent;
//     updateChart5(country, parseInt(el.value, 10));
//     updateChart9(country, parseInt(el.value, 10));
//     updateChart7(parseInt(el.value, 10));
//     updateChart3(0, parseInt(el.value, 10));
//     updateChart8(0, parseInt(el.value, 10));
//   } else {
//     el.value = 2020;
//   }
// }
//
// function dec(el) {
//   if (parseInt(el.value, 10) > 2010) {
//     el.value = parseInt(el.value, 10) - 1;
//     updateChart6(parseInt(el.value, 10));
//     updateChart1(parseInt(el.value, 10));
//     const country = document.getElementById('countryValue').textContent;
//     updateChart5(country, parseInt(el.value, 10));
//     updateChart9(country, parseInt(el.value, 10));
//     updateChart7(parseInt(el.value, 10));
//     updateChart3(0, parseInt(el.value, 10));
//     updateChart8(0, parseInt(el.value, 10));
//   } else {
//     el.value = 2010;
//   }
// }
