// script.js

let ativo = false;
let intervaloAnimacao;
let intervaloFotos;

function criarElementoAnimado(tipo, x, y, opacidade = 1) {
  const el = document.createElement('div');
  el.className = tipo;
  document.body.appendChild(el);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.opacity = opacidade;

  const angulo = Math.random() * 2 * Math.PI;
  const distancia = 250 + Math.random() * 450;
  const endX = x + Math.cos(angulo) * distancia;
  const endY = y + Math.sin(angulo) * distancia;
  const curvaX = x + Math.cos(angulo + Math.PI/2) * (distancia / 2);
  const curvaY = y + Math.sin(angulo + Math.PI/2) * (distancia / 2);

  el.animate([
    { transform: 'translate(0, 0)', opacity: opacidade },
    { transform: `translate(${curvaX - x}px, ${curvaY - y}px)` },
    { transform: `translate(${endX - x}px, ${endY - y}px)`, opacity: 0 }
  ], {
    duration: 4000 + Math.random() * 2000,
    easing: 'ease-in-out',
    fill: 'forwards'
  }).onfinish = () => el.remove();
}

function animarParticulas(x, y) {
  for (let i = 0; i < 30; i++) {
    criarElementoAnimado('heart', x, y, 0.6);
    criarElementoAnimado('butterfly', x, y, 0.4);
  }
}

function animarFotos() {
  const fotos = document.querySelectorAll('.fotos img');
  fotos.forEach(foto => {
    foto.style.opacity = 1;
  });

  intervaloFotos = setInterval(() => {
    fotos.forEach(foto => {
      const x = Math.random() * 80 - 40;
      const y = Math.random() * 60 - 30;
      foto.style.transform = `translate(${x}vw, ${y}vh)`;
    });
  }, 3000);
}

function pararFotos() {
  clearInterval(intervaloFotos);
  const fotos = document.querySelectorAll('.fotos img');
  fotos.forEach(foto => {
    foto.style.opacity = 0;
  });
}

function abrirEnvelope(el) {
  const musica = document.getElementById('musica');
  const mensagem = document.getElementById('mensagem');
  const fotosContainer = document.getElementById('fotos');
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  if (!ativo) {
    el.classList.add('aberto');
    ativo = true;

    musica.volume = 0;
    musica.play();
    const fadeIn = setInterval(() => {
      if (musica.volume < 0.2) {
        musica.volume = Math.min(0.2, musica.volume + 0.02);
      } else {
        clearInterval(fadeIn);
      }
    }, 150);

    animarParticulas(x, y);
    intervaloAnimacao = setInterval(() => animarParticulas(x, y), 3000);

    mensagem.style.opacity = 1;
    fotosContainer.style.opacity = 1;
    animarFotos();

  } else {
    el.classList.remove('aberto');
    ativo = false;

    const fadeOut = setInterval(() => {
      if (musica.volume > 0) {
        musica.volume = Math.max(0, musica.volume - 0.02);
      } else {
        musica.pause();
        musica.currentTime = 0;
        clearInterval(fadeOut);
      }
    }, 100);

    clearInterval(intervaloAnimacao);
    pararFotos();
    mensagem.style.opacity = 0;
    fotosContainer.style.opacity = 0;
  }
}
