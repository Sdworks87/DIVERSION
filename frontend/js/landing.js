(function () {


  const ticker = document.getElementById('ticker');
  const rateGrid = document.getElementById('rate-grid');
  const barChart = document.getElementById('bar-chart');

  async function loadMaterials() {
    try {
      const res = await fetch('/api/materials');
      if (res.ok) {
        const materials = await res.json();
        renderTicker(materials);
        if (rateGrid) renderRateGrid(materials);
      }
    } catch (e) {
      console.warn('Materials API unavailable, using fallback');
      useFallback();
    }
  }

  async function loadImpact() {
    try {
      const res = await fetch('/api/impact');
      if (res.ok && barChart) {
        const stats = await res.json();
        renderBarChart(stats);
      }
    } catch (e) {
      if (barChart) renderBarChart({ bar_metal: 82, bar_ewaste: 61, bar_plastic: 44, bar_paper: 35 });
    }
  }

  function renderTicker(materials) {
    let html = '';
    for (let i = 0; i < 2; i++) {
      materials.forEach((m) => {
        const price = `₹${m.pricePerKg || 0}/kg`;
        const change = m.change || '+₹0';
        const up = m.changeUp !== false;
        html += `<span class="ticker-item">${(m.name || '').toUpperCase()} <strong>${price}</strong> <span class="change ${up ? 'up' : 'dn'}">${change}</span> <span class="ticker-sep">|</span></span>`;
      });
    }
    ticker.innerHTML = html;
  }

  function renderRateGrid(materials) {
    const top = materials.slice(0, 4);
    rateGrid.innerHTML = top
      .map(
        (m) =>
          `<div class="rate-card">
            <div class="rate-material">${m.name}</div>
            <div class="rate-price">₹${m.pricePerKg || 0}/kg</div>
            <div class="rate-change ${m.changeUp !== false ? 'up' : 'dn'}">${m.changeUp !== false ? '▲' : '▼'} ${m.change || '+₹0'} today</div>
          </div>`
      )
      .join('');
  }

  function renderBarChart(stats) {
    const bars = [
      { label: 'Metal', key: 'bar_metal', default: 82 },
      { label: 'E-Waste', key: 'bar_ewaste', default: 61 },
      { label: 'Plastic', key: 'bar_plastic', default: 44 },
      { label: 'Paper', key: 'bar_paper', default: 35 },
    ];
    barChart.innerHTML = bars
      .map((b) => {
        const v = stats[b.key] ?? b.default;
        return `<div class="bar-row">
          <div class="bar-label">${b.label}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${v}%"></div></div>
          <div class="bar-val">${v}%</div>
        </div>`;
      })
      .join('');
  }

  const fallbackMaterials = [
    { name: 'Iron Scrap', pricePerKg: 28, change: '+₹1.5', changeUp: true },
    { name: 'Copper Wire', pricePerKg: 420, change: '+₹12', changeUp: true },
    { name: 'PET Plastic', pricePerKg: 12, change: '-₹0.5', changeUp: false },
    { name: 'E-Waste (PCB)', pricePerKg: 650, change: '+₹40', changeUp: true },
    { name: 'Aluminium', pricePerKg: 105, change: '+₹3', changeUp: true },
    { name: 'HDPE Plastic', pricePerKg: 18, change: '+₹1', changeUp: true },
    { name: 'Old Newspaper', pricePerKg: 8, change: '-₹0.2', changeUp: false },
    { name: 'Cardboard', pricePerKg: 5.5, change: '+₹0.3', changeUp: true },
    { name: 'Brass', pricePerKg: 310, change: '+₹8', changeUp: true },
    { name: 'Stainless Steel', pricePerKg: 45, change: '+₹2', changeUp: true },
  ];

  function useFallback() {
    renderTicker(fallbackMaterials);
    if (rateGrid) renderRateGrid(fallbackMaterials.slice(0, 4));
    if (barChart) renderBarChart({ bar_metal: 82, bar_ewaste: 61, bar_plastic: 44, bar_paper: 35 });
  }

  loadMaterials();
  loadImpact();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

  document.querySelectorAll('.feature-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      document.querySelectorAll('.feature-item').forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
    });
  });


})();
