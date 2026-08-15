/**
 * Plus X 15th Anniversary - Advanced Animation Engine
 * Incorporates Lenis Smooth Scrolling, Image Mask Curtain Entry,
 * Continuous Elliptical Curve Oscillation Physics, and Three.js 3D WebGL Background Sync.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize WebGL 3D Scene
  const webglContainer = document.getElementById('webgl-container');
  let scene3D = null;
  if (typeof PlusX3DScene !== 'undefined') {
    scene3D = new PlusX3DScene(webglContainer);
  }

  // 2. Register GSAP Plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 3. Initialize Lenis Smooth Scroll Engine
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      if (scene3D) {
        scene3D.scrollTop = e.scroll;
      }
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // 4. Preloader Animation
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.loader-progress-bar');
  const skipBtn = document.querySelector('.loader-skip-btn');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 15 + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(finishLoading, 300);
    }
    if (progressBar) progressBar.style.width = `${progress}%`;
  }, 80);

  function finishLoading() {
    clearInterval(loadInterval);
    if (preloader) preloader.classList.add('loaded');
    initAllAnimations();
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', finishLoading);
  }

  function initAllAnimations() {
    initParallaxHeadlines();
    initScrubbedManifestos();
    initImageMaskEntry();
    initCurveOscillators();
    initHorizontalPinnedCarousels();
    initFeaturePins();
    initSvgDrawings();
    initThemeTriggers();
    initProjectArchive();
    initAwardCounter();
  }

  // 5. Image Mask Entry Animations (Curtain unmasking with scale recovery)
  function initImageMaskEntry() {
    document.querySelectorAll('.mask-reveal').forEach((mask) => {
      ScrollTrigger.create({
        trigger: mask,
        start: 'top 85%',
        end: 'bottom 10%',
        onEnter: () => mask.classList.add('is-in-view'),
        onEnterBack: () => mask.classList.add('is-in-view'),
        onLeaveBack: () => mask.classList.remove('is-in-view')
      });
    });
  }

  // 6. Parallax Headlines (Left / Right scrubbed text sliding)
  function initParallaxHeadlines() {
    gsap.to('.hero-line-1', {
      x: -90,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.hero-line-2', {
      x: 90,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    document.querySelectorAll('.parallax-text-line').forEach(line => {
      const speed = parseFloat(line.getAttribute('data-speed')) || 0.5;
      const xDistance = speed * 150;
      gsap.to(line, {
        x: xDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: line,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    document.querySelectorAll('.parallax-media').forEach(media => {
      const speed = parseFloat(media.getAttribute('data-speed')) || 0.2;
      gsap.to(media, {
        x: speed * 80,
        ease: 'none',
        scrollTrigger: {
          trigger: media,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  // 7. Scrubbed Dual-Direction Manifestos (Opposing Continuous Slide)
  function initScrubbedManifestos() {
    document.querySelectorAll('.dual-manifesto-container').forEach(manifesto => {
      const trackLeft = manifesto.querySelector('.manifesto-track-left');
      const trackRight = manifesto.querySelector('.manifesto-track-right');

      if (trackLeft) {
        gsap.fromTo(trackLeft, 
          { x: -140 },
          {
            x: 80,
            ease: 'none',
            scrollTrigger: {
              trigger: manifesto,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }

      if (trackRight) {
        gsap.fromTo(trackRight, 
          { x: 140 },
          {
            x: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: manifesto,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }
    });
  }

  // 8. Elliptical Curve Card Oscillators (Continuous Left/Right Sway)
  class CardCurveOscillator {
    constructor(cardElement, index) {
      this.card = cardElement;
      this.index = index;
      this.dir = (index % 2 === 0) ? -1 : 1;
      this.randomMultiplier = (Math.random() - 0.5);
      this.ovalWidth = (window.innerWidth / 3.2) + (this.randomMultiplier * window.innerWidth * 0.05);
      this.ovalHeight = (window.innerHeight / 2) + (this.card.clientHeight || 400);
      this.ovalHeightExtend = 250;
      this.ovalPositionMove = 280;
      this.startPosition = 0;
      this.init();
    }

    init() {
      this.recalc();
    }

    recalc() {
      this.ovalWidth = (window.innerWidth / 3.2) + (this.randomMultiplier * window.innerWidth * 0.05);
      this.ovalHeight = (window.innerHeight / 2) + (this.card.clientHeight || 400);
      this.startPosition = 0;
    }

    update() {
      const rect = this.card.getBoundingClientRect();
      const cardCenterY = rect.top + rect.height / 2;
      const distFromCenter = (window.innerHeight / 2) - this.ovalPositionMove - cardCenterY;
      
      const totalH = this.ovalHeight + this.ovalHeightExtend;
      const ratio = (distFromCenter * distFromCenter) / (totalH * totalH);
      const ellipseFactor = Math.max(0, 1 - ratio);
      const xOffset = this.ovalWidth * Math.sqrt(ellipseFactor) * this.dir;

      this.card.style.transform = `translate3d(${xOffset}px, 0, 0)`;

      const maskElement = this.card.querySelector('.mask-reveal');
      if (Math.abs(cardCenterY - window.innerHeight / 2) < window.innerHeight * 0.55) {
        if (maskElement) maskElement.classList.add('is-in-view');
        this.card.classList.add('is-active');
      } else {
        if (maskElement && cardCenterY > window.innerHeight * 0.95) {
          maskElement.classList.remove('is-in-view');
        }
      }
    }
  }

  function initCurveOscillators() {
    const sections = document.querySelectorAll('.oscillating-stream-section');
    const oscillators = [];

    sections.forEach(section => {
      const cards = section.querySelectorAll('.curve-card');
      cards.forEach((card, idx) => {
        const osc = new CardCurveOscillator(card, idx);
        oscillators.push(osc);
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: () => {
          oscillators.forEach(osc => osc.update());
        }
      });
    });

    window.addEventListener('resize', () => {
      oscillators.forEach(osc => osc.recalc());
    });
  }

  // 9. Horizontal Pinned Carousels
  function initHorizontalPinnedCarousels() {
    document.querySelectorAll('.horizontal-section-pin').forEach(pinSection => {
      const track = pinSection.querySelector('.horizontal-track');
      if (!track) return;

      const totalScroll = track.scrollWidth - window.innerWidth + 80;

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: pinSection,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const cards = track.querySelectorAll('.showcase-card');
            cards.forEach((card, idx) => {
              const progressTrigger = (idx + 0.5) / cards.length;
              const mask = card.querySelector('.mask-reveal');
              if (self.progress >= progressTrigger - 0.3 && self.progress <= progressTrigger + 0.3) {
                card.classList.add('is-active');
                if (mask) mask.classList.add('is-in-view');
              } else {
                card.classList.remove('is-active');
              }
            });
          }
        }
      });
    });
  }

  // 10. Feature Pin Showcases
  function initFeaturePins() {
    document.querySelectorAll('.feature-showcase-pin').forEach(featurePin => {
      const mask = featurePin.querySelector('.mask-reveal');
      ScrollTrigger.create({
        trigger: featurePin,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => {
          featurePin.classList.add('is-active');
          if (mask) mask.classList.add('is-in-view');
        },
        onEnterBack: () => {
          featurePin.classList.add('is-active');
          if (mask) mask.classList.add('is-in-view');
        },
        onLeave: () => featurePin.classList.remove('is-active'),
        onLeaveBack: () => featurePin.classList.remove('is-active')
      });
    });
  }

  // 11. SVG Vector Drawing Trigger
  function initSvgDrawings() {
    document.querySelectorAll('.svg-unit-container').forEach(svgContainer => {
      ScrollTrigger.create({
        trigger: svgContainer,
        start: 'top 70%',
        onEnter: () => svgContainer.classList.add('is-active'),
        once: true
      });
    });
  }

  // 12. Theme Trigger Engine
  function initThemeTriggers() {
    document.querySelectorAll('[data-theme-trigger]').forEach(section => {
      const theme = section.getAttribute('data-theme-trigger');
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => applyTheme(theme),
        onEnterBack: () => applyTheme(theme)
      });
    });

    const themeToggleBtn = document.querySelector('.theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        applyTheme(next);
        themeToggleBtn.textContent = next === 'light' ? 'DARK MODE' : 'LIGHT MODE';
      });
    }
  }

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (scene3D) {
      scene3D.setTheme(theme);
    }
  }

  // 13. Project Archive Filter & Floating Thumbnail Box
  function initProjectArchive() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectRows = document.querySelectorAll('.project-row');
    const previewBox = document.getElementById('floating-preview');
    const previewImg = previewBox ? previewBox.querySelector('img') : null;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        projectRows.forEach(row => {
          if (filter === 'all' || row.getAttribute('data-cat') === filter) {
            row.style.display = 'grid';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });

    projectRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        const imgSrc = row.getAttribute('data-img');
        if (imgSrc && previewImg) {
          previewImg.src = imgSrc;
          previewBox.classList.add('visible');
        }
      });

      row.addEventListener('mousemove', (e) => {
        if (previewBox) {
          const x = e.clientX + 180;
          const y = e.clientY;
          previewBox.style.left = `${x}px`;
          previewBox.style.top = `${y}px`;
        }
      });

      row.addEventListener('mouseleave', () => {
        if (previewBox) previewBox.classList.remove('visible');
      });
    });
  }

  // 14. Awards Stat Number Counter
  function initAwardCounter() {
    const statCounter = document.getElementById('award-counter');
    if (statCounter) {
      let counted = false;
      ScrollTrigger.create({
        trigger: statCounter,
        start: 'top 85%',
        onEnter: () => {
          if (counted) return;
          counted = true;
          let startTimestamp = null;
          const duration = 2000;
          const start = 0;
          const end = 97;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const ease = 1 - Math.pow(2, -10 * progress);
            statCounter.innerHTML = Math.floor(ease * (end - start) + start) + '+';
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              statCounter.innerHTML = end + '+';
            }
          };
          window.requestAnimationFrame(step);
        }
      });
    }
  }

  // 15. Smooth anchor scroll navigation with Lenis integration
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
