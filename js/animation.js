document.addEventListener('DOMContentLoaded', function() {

    const heroBg = document.querySelector('.hero-bg');
    const heroEl = document.querySelector('.hero');
    if (heroBg && heroEl && window.matchMedia('(min-width: 900px)').matches) {
        const blobs = heroBg.querySelectorAll('.blob');
        heroEl.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            blobs.forEach(function(blob, i) {
                const strength = (i + 1) * 14;
                blob.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
            });
        });
    }

    // Scroll-driven parallax on the hero
    const heroForParallax = document.querySelector('.hero');
    if (heroForParallax) {
        const parallaxVisual = heroForParallax.querySelector('.hero-visual');
        const parallaxText = heroForParallax.querySelector('.hero-text');
        window.addEventListener('scroll', function() {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                if (parallaxVisual) parallaxVisual.style.transform = 'translateY(' + (y * 0.18) + 'px)';
                if (parallaxText) parallaxText.style.transform = 'translateY(' + (y * 0.08) + 'px)';
            }
        });
    }

    const particleField = document.querySelector('.particle-field');
    if (particleField) {
        for (let i = 0; i < 38; i++) {
            const p = document.createElement('span');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animation = 'drift ' + (6 + Math.random() * 8) + 's linear infinite';
            p.style.animationDelay = (Math.random() * 8) + 's';
            particleField.appendChild(p);
        }
    }

    // AUTO-ANIMATE: grab all text, cards, buttons, and footer content on the site
    // and give each one an entrance animation, except elements inside the Hero
    // section (which already have their own load animations).
    const autoAnimateElements = document.querySelectorAll('h2, h3, p, .btn, .value-card, .why-card, .service-card, .review-card, .team-card, .about-photo-frame, .footer-logo, .footer-grid > div, .social-row, .footer-bottom');
    autoAnimateElements.forEach(function(el) {
        if (!el.closest('.hero') && !el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    // CASCADING SCROLL REVEAL
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        let delayCounter = 0;
        let delayResetTimeout;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {

                    // Adds a staggered 100ms delay to each item so they pop up one after another
                    setTimeout(function() {
                        entry.target.classList.add('in-view');
                    }, delayCounter * 100);

                    delayCounter++; // Increase delay for the next item

                    // Reset the cascade delay when scrolling stops
                    clearTimeout(delayResetTimeout);
                    delayResetTimeout = setTimeout(function() { delayCounter = 0; }, 300);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(function(el) { observer.observe(el); });
    } else {
        revealEls.forEach(function(el) { el.classList.add('in-view'); });
    }

    // Fail-safe: if anything above fails silently on a slow/older browser,
    // force every section visible after 1.5s so content is never stuck hidden.
    setTimeout(function() {
        document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('in-view'); });
    }, 1500);

    document.querySelectorAll('.text-reveal').forEach(function(el) {
        const words = el.textContent.trim().split(' ');
        el.innerHTML = words.map(function(w, i) {
            return '<span style="opacity:0;animation:fade-up 0.6s ease forwards;animation-delay:' + (i * 0.05) + 's">' + w + '&nbsp;</span>';
        }).join('');
    });

    // Robot head cursor tracking — the 3D visual turns toward the pointer
    const heroVisualStage = document.getElementById('hero3d');
    const heroVisualImg = document.getElementById('hero3dImg');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (heroVisualStage && heroVisualImg && !prefersReducedMotion && window.matchMedia('(min-width: 900px)').matches) {
        let targetX = 0,
            targetY = 0,
            curX = 0,
            curY = 0;
        const maxTilt = 16;
        window.addEventListener('mousemove', function(e) {
            const rect = heroVisualStage.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (window.innerWidth / 2);
            const dy = (e.clientY - cy) / (window.innerHeight / 2);
            targetX = Math.max(-1, Math.min(1, dx));
            targetY = Math.max(-1, Math.min(1, dy));
        });
        (function animateHead() {
            curX += (targetX - curX) * 0.07;
            curY += (targetY - curY) * 0.07;
            const rotY = curX * maxTilt;
            const rotX = -curY * maxTilt * 0.6;
            heroVisualImg.style.transform = 'perspective(900px) rotateY(' + rotY.toFixed(2) + 'deg) rotateX(' + rotX.toFixed(2) + 'deg)';
            requestAnimationFrame(animateHead);
        })();
    }

    // Count-up stat numbers when they scroll into view
    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;
        const duration = 1300;
        const start = performance.now();

        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    const countObserverCallback = function(entries, observerRef) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const isHeroStat = entry.target.closest('.hero-stat');
                const delay = isHeroStat ? 950 : 0;
                setTimeout(function() { animateCount(entry.target); }, delay);
                observerRef.unobserve(entry.target);
            }
        });
    };
    const countEls = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window) {
        const countObserver = new IntersectionObserver(countObserverCallback, { threshold: 0.6 });
        countEls.forEach(function(el) { countObserver.observe(el); });
    } else {
        countEls.forEach(animateCount);
    }

    // Magnetic pull on primary hero buttons
    if (!prefersReducedMotion && window.matchMedia('(min-width: 900px)').matches) {
        document.querySelectorAll('.magnetic').forEach(function(btn) {
            btn.addEventListener('mousemove', function(e) {
                const r = btn.getBoundingClientRect();
                const mx = (e.clientX - r.left - r.width / 2) * 0.28;
                const my = (e.clientY - r.top - r.height / 2) * 0.35;
                btn.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px)';
            });
            btn.addEventListener('mouseleave', function() { btn.style.transform = ''; });
        });

        // Soft ambient glow that trails the cursor across the whole site
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);
        let gx = window.innerWidth / 2,
            gy = window.innerHeight / 2,
            tx = gx,
            ty = gy;
        window.addEventListener('mousemove', function(e) {
            tx = e.clientX;
            ty = e.clientY;
        });
        (function glowLoop() {
            gx += (tx - gx) * 0.1;
            gy += (ty - gy) * 0.1;
            glow.style.transform = 'translate(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px) translate(-50%,-50%)';
            requestAnimationFrame(glowLoop);
        })();
    }

});