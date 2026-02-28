
  // Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX - 6 + 'px';
    cursor.style.top = mouseY - 6 + 'px';
  });
  function animateRing() {
    ringX += (mouseX - ringX - 20) * 0.12;
    ringY += (mouseY - ringY - 20) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Ticker
  const materials = [
    { name: 'IRON SCRAP', price: '₹28/kg', change: '+₹1.5', up: true },
    { name: 'COPPER WIRE', price: '₹420/kg', change: '+₹12', up: true },
    { name: 'ALUMINIUM', price: '₹105/kg', change: '+₹3', up: true },
    { name: 'PET PLASTIC', price: '₹12/kg', change: '-₹0.5', up: false },
    { name: 'HDPE PLASTIC', price: '₹18/kg', change: '+₹1', up: true },
    { name: 'E-WASTE (PCB)', price: '₹650/kg', change: '+₹40', up: true },
    { name: 'OLD NEWSPAPER', price: '₹8/kg', change: '-₹0.2', up: false },
    { name: 'CARDBOARD', price: '₹5.5/kg', change: '+₹0.3', up: true },
    { name: 'BRASS', price: '₹310/kg', change: '+₹8', up: true },
    { name: 'STAINLESS STEEL', price: '₹45/kg', change: '+₹2', up: true },
  ];
  const ticker = document.getElementById('ticker');
  let html = '';
  for (let i = 0; i < 2; i++) {
    materials.forEach(m => {
      html += `<span class="ticker-item">${m.name} <strong>${m.price}</strong> <span class="change ${m.up ? 'up' : 'dn'}">${m.change}</span> <span class="ticker-sep">|</span></span>`;
    });
  }
  ticker.innerHTML = html;

  // Intersection Observer for fade-in
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Feature item active state
  document.querySelectorAll('.feature-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.querySelectorAll('.feature-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Cursor scale on interactive elements
  document.querySelectorAll('a, button, .feature-item, .eco-card, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2.5)'; ring.style.transform = 'scale(1.5)'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; ring.style.transform = 'scale(1)'; });
  });
