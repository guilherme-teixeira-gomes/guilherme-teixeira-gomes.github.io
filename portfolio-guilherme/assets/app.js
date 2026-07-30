(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Menu mobile ---- */
  var botao = document.querySelector('.abrir-menu');
  var menu = document.querySelector('.menu');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.textContent = aberto ? 'Fechar' : 'Menu';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('aberto');
        botao.textContent = 'Menu';
      }
    });
  }

  /* ---- Malha de luminárias do hero ----
     Cada ponto é uma luminária num traçado de ruas. Elas acendem
     em sequência, como um parque de iluminação entrando em operação
     ao anoitecer. Uma delas fica em falha (ciano) — porque sempre fica. */
  var malha = document.querySelector('.malha');
  if (malha) {
    var largura = malha.offsetWidth;
    var altura = malha.offsetHeight;
    var passo = 68;
    var pontos = [];

    for (var y = passo; y < altura - 10; y += passo) {
      for (var x = passo; x < largura - 10; x += passo) {
        // deixa buracos: nem toda esquina tem poste
        if (Math.random() < 0.34) continue;
        pontos.push({
          x: x + (Math.random() * 10 - 5),
          y: y + (Math.random() * 10 - 5)
        });
      }
    }

    var fragmento = document.createDocumentFragment();
    var nos = [];
    pontos.forEach(function (p) {
      var no = document.createElement('span');
      no.className = 'luz';
      no.style.left = p.x + 'px';
      no.style.top = p.y + 'px';
      fragmento.appendChild(no);
      nos.push({ el: no, x: p.x, y: p.y });
    });
    malha.appendChild(fragmento);

    if (semMovimento) {
      nos.forEach(function (n) { n.el.classList.add('acesa'); });
    } else {
      // acende em onda, da esquerda inferior para a direita superior
      nos.sort(function (a, b) { return (a.x - a.y) - (b.x - b.y); });
      nos.forEach(function (n, i) {
        setTimeout(function () { n.el.classList.add('acesa'); }, 260 + i * 26);
      });
      // duas falhas intermitentes depois que o parque estabiliza
      setTimeout(function () {
        [0.31, 0.72].forEach(function (frac) {
          var alvo = nos[Math.floor(nos.length * frac)];
          if (!alvo) return;
          setInterval(function () {
            alvo.el.classList.toggle('acesa');
            alvo.el.classList.toggle('falha');
          }, 3400);
        });
      }, 260 + nos.length * 26 + 900);
    }
  }

  /* ---- Revelação no scroll ---- */
  var alvos = document.querySelectorAll('.reveal');
  if (alvos.length && 'IntersectionObserver' in window && !semMovimento) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visivel');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    alvos.forEach(function (a) { obs.observe(a); });
  } else {
    alvos.forEach(function (a) { a.classList.add('visivel'); });
  }

  /* ---- Marca a seção ativa no menu ---- */
  var secoes = document.querySelectorAll('main section[id]');
  var links = document.querySelectorAll('.menu a[href^="#"]');
  if (secoes.length && links.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('ativo', l.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(function (s) { spy.observe(s); });
  }
})();
