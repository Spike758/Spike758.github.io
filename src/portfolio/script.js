document.addEventListener('DOMContentLoaded', ()=>{
  const roles = ['Frontend разработчик','UI дизайнер','Студент','Web Enthusiast'];
  let i=0; const roleEl = document.getElementById('role');
  setInterval(()=>{ i=(i+1)%roles.length; roleEl.textContent=roles[i]; }, 2500);
  document.getElementById('year').textContent = new Date().getFullYear();
  const bars = document.querySelectorAll('.bar span');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target; const val = el.getAttribute('data-value')||50; el.style.width = val+'%'; obs.unobserve(el);
      }
    })
  },{threshold:0.3});
  bars.forEach(b=>obs.observe(b));
  const navLinks = document.querySelectorAll('.nav__list a');
  const sections = [...document.querySelectorAll('main section')];
  const navObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const id = entry.target.id; const link = document.querySelector('.nav__list a[href="#'+id+'"]');
      if(entry.isIntersecting){ navLinks.forEach(a=>a.classList.remove('active')); if(link) link.classList.add('active'); }
    });
  },{threshold:0.5});
  sections.forEach(s=>navObserver.observe(s));
  document.querySelectorAll('.nav__list a').forEach(a=>{ a.addEventListener('click', e=>{ e.preventDefault(); document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'}); }); });
  const form = document.getElementById('contactForm'); const msg = document.getElementById('formMessage');
  form.addEventListener('submit', e=>{ e.preventDefault(); const data = new FormData(form); if(!data.get('name')||!data.get('email')||!data.get('message')){ msg.textContent='Заполните все поля'; msg.style.color='salmon'; return; } msg.textContent='Сообщение отправлено (локально).'; msg.style.color='lightgreen'; form.reset(); });
});
