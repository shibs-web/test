/* عيادة الدكتور عبد الحليم الطبشي — main.js | تصميم وتطوير: شِبس */
(() => {
  const WA = '963944883002';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sticky nav shadow */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    const close = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* Year */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* The eye: pupil follows the pointer, blinks on click */
  const eye = document.querySelector('.eye');
  if (eye) {
    const look = eye.querySelector('.look');
    const svg = eye.querySelector('svg');
    let raf = null, tx = 0, ty = 0;

    if (!reduce && look && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('pointermove', e => {
        const r = svg.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 420);
        tx = (dx / d) * 46 * k;
        ty = (dy / d) * 22 * k;
        if (!raf) raf = requestAnimationFrame(() => {
          look.style.transform = `translate(${tx}px, ${ty}px)`;
          raf = null;
        });
      }, { passive: true });
      document.addEventListener('pointerleave', () => { look.style.transform = ''; });
    }

    const blink = () => {
      if (reduce) return;
      eye.classList.remove('blink'); void eye.offsetWidth; eye.classList.add('blink');
    };
    eye.addEventListener('click', blink);
    eye.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blink(); } });
    eye.addEventListener('animationend', e => { if (e.animationName === 'blink') eye.classList.remove('blink'); });

    /* pupil reacts to "light": constricts while pointer is over the hero buttons */
    document.querySelectorAll('.hero .btn').forEach(b => {
      b.addEventListener('pointerenter', () => eye.classList.add('bright'));
      b.addEventListener('pointerleave', () => eye.classList.remove('bright'));
    });
  }

  /* Forms -> WhatsApp prefilled message */
  document.querySelectorAll('form[data-wa]').forEach(form => {
    const err = form.querySelector('.form-err');
    const date = form.elements.date;
    if (date) date.min = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', e => {
      e.preventDefault();
      const f = form.elements;
      [...form.querySelectorAll('[aria-invalid]')].forEach(i => i.removeAttribute('aria-invalid'));
      const fail = (field, msg) => { err.textContent = msg; field.setAttribute('aria-invalid', 'true'); field.focus(); };

      const name = f.name.value.trim();
      const phone = f.phone.value.trim();
      if (name.length < 2) return fail(f.name, 'أدخل اسمك الكامل.');
      if (phone.replace(/\D/g, '').length < 7) return fail(f.phone, 'أدخل رقم هاتف صحيح لنتواصل معك.');
      if (f.message && f.message.required && !f.message.value.trim()) return fail(f.message, 'اكتب رسالتك.');
      err.textContent = '';

      const title = form.dataset.wa === 'contact'
        ? 'مرحبًا، لدي استفسار لعيادة د. عبد الحليم الطبشي'
        : 'مرحبًا، أريد حجز موعد في عيادة د. عبد الحليم الطبشي';
      const lines = [
        title,
        'الاسم: ' + name,
        'الهاتف: ' + phone,
        f.service ? 'الخدمة: ' + f.service.value : '',
        f.date && f.date.value ? 'التاريخ المفضل: ' + f.date.value : '',
        f.time && f.time.value ? 'الفترة المفضلة: ' + f.time.value : '',
        f.message && f.message.value.trim() ? 'الرسالة: ' + f.message.value.trim() : ''
      ].filter(Boolean).join('\n');

      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener');
    });
  });
})();
