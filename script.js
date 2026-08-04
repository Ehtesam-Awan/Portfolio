/* ================================================
   EHTESAM AWAN — PORTFOLIO SCRIPT
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- LOADER ---------------- */
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPct = document.getElementById('loaderPct');
  document.body.style.overflow = 'hidden';

  let pct = 0;
  function tickLoader(){
    // Ease continuously toward 100 — always moves forward, never jumps or stalls.
    pct += (100 - pct) * 0.07 + 0.35;
    if (pct >= 100) {
      pct = 100;
      loaderBar.style.width = pct + '%';
      loaderPct.textContent = 100;
      setTimeout(() => {
        loader.classList.add('loaded');
        document.body.style.overflow = '';
        playHeroIntro();
      }, 350);
      return;
    }
    loaderBar.style.width = pct + '%';
    loaderPct.textContent = Math.floor(pct);
    requestAnimationFrame(tickLoader);
  }
  requestAnimationFrame(tickLoader);

  /* ---------------- CUSTOM CURSOR ---------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing(){
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, input, textarea, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-active'));
  });

  /* ---------------- PARTICLE BACKGROUND ---------------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = ['rgba(217,168,87,', 'rgba(82,227,210,'];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function initParticles(){
    const count = window.innerWidth < 700 ? 34 : 70;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.15
    }));
  }
  initParticles();

  function drawParticles(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ---------------- NAV SCROLL STATE ---------------- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ---------------- MOBILE MENU ---------------- */
  const navBurger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  navBurger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ---------------- HERO TYPING EFFECT ---------------- */
  const typedEl = document.getElementById('typedText');
  const words = ['Digital Problem Solver', 'Graphic Designer', 'Content Creator', 'Technology Educator'];
  let wordIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = words[wordIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 70);
  }

  /* ---------------- HERO INTRO TIMELINE ---------------- */
  function playHeroIntro(){
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero .line.reveal-up', {
        opacity: 1, y: 0, duration: 1, stagger: 0.12
      })
      .to('.hero-desc.reveal-up', { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .to('.hero-ctas.reveal-up', { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .to('.hero-stats.reveal-up', { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .to('.eyebrow.reveal-up', { opacity: 1, y: 0, duration: 0.7 }, 0)
      .to('.hero-visual', { opacity: 1, duration: 1.1 }, '-=1.2')
      .add(() => {
        typeLoop();
        animateStats();
      }, '-=0.4');
  }
  gsap.set('.hero-visual', { opacity: 0 });

  /* ---------------- STAT COUNTERS (hero) ---------------- */
  function animateStats(){
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      gsap.to(el, {
        innerText: target,
        duration: 1.6,
        ease: 'power2.out',
        snap: { innerText: 1 },
        onUpdate: function(){
          el.textContent = Math.floor(el.innerText || 0);
        }
      });
    });
  }

  /* ---------------- SCROLL REVEALS ---------------- */
  const revealTargets = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');
  revealTargets.forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      }
    });
  });

  /* ---------------- SKILL BARS ---------------- */
  document.querySelectorAll('.skill-fill').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        el.style.width = el.dataset.level + '%';
      }
    });
  });

  /* ---------------- TIMELINE FILL ---------------- */
  const timelineFill = document.getElementById('timelineFill');
  if (timelineFill) {
    gsap.to(timelineFill, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: 0.6
      }
    });
  }

  /* ---------------- SCROLL CUE PROGRESS ---------------- */
  const scrollFill = document.querySelector('.scroll-cue-fill');
  if (scrollFill) {
    gsap.to(scrollFill, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3
      }
    });
  }

/* ---------------- CONTACT FORM ---------------- */

emailjs.init("F9FH8IABucZ6NIJOc");

const contactForm = document.getElementById("contactForm");
const submitLabel = document.getElementById("submitLabel");

if (contactForm) {

  contactForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill all fields.");
      return;
    }

    submitLabel.textContent = "Sending...";

    try {

      await emailjs.send(
        "service_rucvd8h",
        "template_iieaogf",
        {
          from_name: name,
          from_email: email,
          message: message
        }
      );

      submitLabel.textContent = "Message Sent ✓";
      contactForm.reset();

      setTimeout(() => {
        submitLabel.textContent = "Send Message";
      }, 2500);

    } catch (error) {

      console.error(error);

      submitLabel.textContent = "Failed";

      setTimeout(() => {
        submitLabel.textContent = "Send Message";
      }, 2500);

      alert("Failed to send message.");
    }

  });

}
  /* ---------------- BACK TO TOP ---------------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- FOOTER YEAR ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
