/* 풀어쓰는 사회학 정보부 — 공통 JS (플랫 구조) */
const App = (() => {
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];

  async function loadJSON(filename) {
    try {
      const res = await fetch(filename);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) { console.warn('JSON 로드 실패:', filename, e); return null; }
  }

  function renderBreadcrumb(crumbs) {
    const el = $('#breadcrumb');
    if (!el) return;
    const items = [{ label: '🏠 홈', href: 'index.html' }, ...crumbs];
    el.innerHTML = items.map((c, i) => {
      if (i === items.length - 1) return `<span class="current">${c.label}</span>`;
      return `<a href="${c.href}">${c.label}</a><span class="sep">›</span>`;
    }).join('');
  }

  function renderCategoryCards(categories, container) {
    container.innerHTML = categories.map(cat => `
      <a href="${cat.link}" class="card" ${cat.link === '#' ? 'onclick="event.preventDefault();App.toast(\'준비 중입니다\')"' : ''}>
        <div class="card-icon" style="background:${cat.color}10;font-size:2rem;">${cat.icon}</div>
        <div class="card-title">${cat.title}</div>
        <div class="card-desc">${cat.desc}</div>
        <span class="card-arrow">→</span>
      </a>`).join('');
  }

  function renderUnitCards(units, container) {
    if (!units || !units.length) { container.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>등록된 단원이 없습니다.</p></div>'; return; }
    container.innerHTML = units.map(u => `
      <a href="hub-unit-${u.slug}.html" class="card" data-tags="${u.tags.join(' ')}" data-title="${u.title}">
        <div class="card-icon" style="font-size:1.5rem;background:var(--primary-lt);">${u.code}</div>
        <div class="card-title">${u.title}</div>
        <div class="card-desc">${u.subtitle}</div>
        <div class="card-meta">${u.tags.map(t => `<span class="tag">${t}</span>`).join('')}<span class="tag code">콘텐츠 ${u.contentCount}개</span></div>
        <span class="card-arrow">→</span>
      </a>`).join('');
  }

  function renderContentCards(contents, container) {
    if (!contents || !contents.length) { container.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>등록된 콘텐츠가 없습니다.</p></div>'; return; }
    const icons = { '수업자료':'📐', '학습지':'📝', '활동지':'✏️', '문항':'❓', '교사용':'👩‍🏫' };
    container.innerHTML = contents.map(c => `
      <a href="${c.file}" class="card" data-tags="${c.tags.join(' ')}" data-title="${c.title}" data-type="${c.type}">
        <div class="card-icon">${icons[c.type]||'📄'}</div>
        <div class="card-title">${c.title}</div>
        <div class="card-desc">${c.desc}</div>
        <div class="card-meta"><span class="tag type">${c.type}</span><span class="tag diff">${c.difficulty}</span><span class="tag time">⏱ ${c.duration}</span></div>
        <span class="card-arrow">→</span>
      </a>`).join('');
  }

  function initSearch(inputSel, containerSel) {
    const input = $(inputSel), container = $(containerSel);
    if (!input || !container) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      $$('.card', container).forEach(card => {
        const t = (card.dataset.title||'').toLowerCase();
        const tags = (card.dataset.tags||'').toLowerCase();
        const type = (card.dataset.type||'').toLowerCase();
        card.style.display = (!q || t.includes(q) || tags.includes(q) || type.includes(q)) ? '' : 'none';
      });
    });
  }

  function initTagFilter(btnSel, cardSel) {
    const btns = $$(btnSel + ' .tag-btn'), container = $(cardSel);
    if (!btns.length || !container) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const was = btn.classList.contains('active');
        btns.forEach(b => b.classList.remove('active'));
        if (!was) btn.classList.add('active');
        const tag = was ? '' : btn.dataset.tag.toLowerCase();
        $$('.card', container).forEach(card => {
          if (!tag) { card.style.display = ''; return; }
          const tags = (card.dataset.tags||'').toLowerCase();
          const type = (card.dataset.type||'').toLowerCase();
          card.style.display = (tags.includes(tag) || type.includes(tag)) ? '' : 'none';
        });
      });
    });
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => toast('링크가 복사되었습니다 ✓')).catch(() => {
      const t = document.createElement('textarea'); t.value = window.location.href;
      document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
      toast('링크가 복사되었습니다 ✓');
    });
  }
  function printPage() { window.print(); }
  function goFullscreen() { document.documentElement.requestFullscreen().catch(()=>{}); }
  function toast(msg) {
    let el = $('#toast-el');
    if (!el) { el = document.createElement('div'); el.id='toast-el'; el.className='toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2200);
  }

  return { $, $$, loadJSON, renderBreadcrumb, renderCategoryCards, renderUnitCards, renderContentCards, initSearch, initTagFilter, copyLink, printPage, goFullscreen, toast };
})();
