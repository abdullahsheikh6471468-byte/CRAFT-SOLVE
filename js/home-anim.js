document.addEventListener('DOMContentLoaded', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* hero particles (filled by animation.js via .particle-field) are already in the HTML */

    if (reduce) return;

    /* Scroll progress bar + hero parallax (one rAF loop) */
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var hero = document.querySelector('.hero');
    var heroBg = document.querySelector('.hero .hero-bg');
    var heroContent = document.querySelector('.hero .hero-content');
    var ticking = false;

    function update() {
        var y = window.pageYOffset || document.documentElement.scrollTop;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';

        if (hero) {
            var h = hero.offsetHeight;
            if (y <= h) {
                if (heroBg) heroBg.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0)';
                if (heroContent) {
                    heroContent.style.transform = 'translate3d(0,' + (y * -0.1).toFixed(1) + 'px,0)';
                    heroContent.style.opacity = Math.max(0, 1 - y / (h * 0.65)).toFixed(3);
                }
            }
        }
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();

    if (!finePointer) return;

    /* 3D tilt + glare on service cards */
    document.querySelectorAll('.grad-border-card').forEach(function (card) {
        var inner = card.querySelector('.grad-border-inner');
        if (!inner) return;
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width;
            var py = (e.clientY - r.top) / r.height;
            inner.classList.add('is-tilting');
            inner.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 8).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 10).toFixed(2) + 'deg) translateY(-6px)';
            inner.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
            inner.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        });
        card.addEventListener('mouseleave', function () {
            inner.classList.remove('is-tilting');
            inner.style.transform = '';
        });
    });

    /* Cursor spotlight on "why us" cards */
    document.querySelectorAll('.why-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });
});
