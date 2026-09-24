(function () {
  'use strict';

  /* Menu no celular */
  var botao = document.querySelector('.abrir-menu');
  var menu = document.getElementById('menu');
  if (botao && menu) {
    var rotuloAberto = document.documentElement.lang === 'en' ? 'Close' : 'Fechar';
    var rotuloFechado = botao.textContent;
    function fechar() {
      menu.classList.remove('aberto');
      botao.setAttribute('aria-expanded', 'false');
      botao.textContent = rotuloFechado;
    }
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.textContent = aberto ? rotuloAberto : rotuloFechado;
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') fechar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
  }

  /* O único movimento da página: os sistemas do painel entram no ar, um por um */
  var linhas = document.querySelectorAll('.linha-status');
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(linhas, function (linha, i) {
    if (semMovimento) { linha.classList.add('aceso'); return; }
    setTimeout(function () { linha.classList.add('aceso'); }, 350 + i * 180);
  });

  /* Marca no menu a seção visível */
  var links = document.querySelectorAll('.menu a[href^="#"]');
  var secoes = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window && links.length) {
    var espiao = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        Array.prototype.forEach.call(links, function (l) {
          l.classList.toggle('ativo', l.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Array.prototype.forEach.call(secoes, function (s) { espiao.observe(s); });
  }
})();

/* Botão de tema: alterna claro/escuro e guarda a escolha */
(function () {
  'use strict';
  var botao = document.querySelector('.tema');
  if (!botao) return;
  var raiz = document.documentElement;
  var sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');
  function atual() {
    var t = raiz.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return sistemaEscuro.matches ? 'dark' : 'light';
  }
  function rotular() {
    var escuro = atual() === 'dark';
    botao.textContent = escuro ? botao.getAttribute('data-light') : botao.getAttribute('data-dark');
  }
  botao.addEventListener('click', function () {
    var novo = atual() === 'dark' ? 'light' : 'dark';
    raiz.setAttribute('data-theme', novo);
    try { localStorage.setItem('tema', novo); } catch (e) {}
    rotular();
  });
  if (sistemaEscuro.addEventListener) sistemaEscuro.addEventListener('change', rotular);
  rotular();
})();
