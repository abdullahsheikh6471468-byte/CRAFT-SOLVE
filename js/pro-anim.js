document.addEventListener('DOMContentLoaded', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* Smooth page-leave transition for internal links */
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) document.body.classList.remove('is-leaving');
    });
    if (!reduce) {
        document.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[href]');
            if (!a || e.defaultPrevented || e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
            var url;
            try { url = new URL(a.href, location.href); } catch (err) { return; }
            if (url.protocol !== location.protocol || url.host !== location.host) return;
            if (url.pathname === location.pathname && url.search === location.search) return;
            e.preventDefault();
            document.body.classList.add('is-leaving');
            setTimeout(function () { location.href = a.href; }, 240);
        });
    }

    /* Extra scroll-reveal (list items, stat blocks) with a small stagger */
    var extra = document.querySelectorAll('main li, .stat-strip > div');
    extra.forEach(function (el, i) {
        if (el.closest('.hero') || el.closest('.page-header')) return;
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(sibs, 6) * 60 + 'ms';
    });
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
            });
        }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });
        extra.forEach(function (el) { if (!el.classList.contains('in-view')) io.observe(el); });
    } else {
        extra.forEach(function (el) { el.classList.add('in-view'); });
    }

    /* Contact form: stagger index for fields */
    document.querySelectorAll('.contact-form').forEach(function (form) {
        form.querySelectorAll('.form-group, button[type="submit"]').forEach(function (el, i) {
            el.style.setProperty('--fi', i);
        });
    });

    if (reduce) return;

    /* Inner-page header: gentle parallax + fade on scroll */
    var ph = document.querySelector('.page-header');
    if (ph) {
        var bg = ph.querySelector('.hero-bg');
        var inner = ph.querySelector('.container');
        var ticking = false;
        var run = function () {
            var y = window.pageYOffset || 0;
            var h = ph.offsetHeight;
            if (y <= h) {
                if (bg) bg.style.transform = 'translate3d(0,' + (y * 0.25).toFixed(1) + 'px,0)';
                if (inner) {
                    inner.style.transform = 'translate3d(0,' + (y * -0.08).toFixed(1) + 'px,0)';
                    inner.style.opacity = Math.max(0, 1 - y / (h * 0.9)).toFixed(3);
                }
            }
            ticking = false;
        };
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(run); }
        }, { passive: true });
    }

    if (!finePointer) return;

    /* 3D tilt for team / value / contact cards */
    document.querySelectorAll('.team-card, .value-card, .contact-info-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            if (!card.classList.contains('in-view')) return;
            var r = card.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width;
            var py = (e.clientY - r.top) / r.height;
            card.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
            card.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
            card.classList.add('tilt-live');
        });
        card.addEventListener('mouseleave', function () {
            card.classList.remove('tilt-live');
        });
    });
});
