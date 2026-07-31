window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    const heroElements = document.querySelectorAll('.hero-word, .pop-in, .hero-visual-stage, .hero-sweep, .btn');

    if (preloader) {
        setTimeout(function() {
            preloader.classList.add('hidden');

            heroElements.forEach(function(el) {
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = null;
            });
        }, 350);
    } else {
        heroElements.forEach(function(el) {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = null;
        });
    }
});

setTimeout(function() {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
}, 2500);

document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.querySelector('.navbar');
    const onScroll = function() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll);

    const hamburger = document.querySelector('.hamburger');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.drawer-overlay');

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('open');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger && drawer && overlay) {
        hamburger.addEventListener('click', function() {
            drawer.classList.contains('open') ? closeDrawer() : openDrawer();
        });
        overlay.addEventListener('click', closeDrawer);
    }

    document.querySelectorAll('.mobile-drawer a').forEach(function(link) {
        link.addEventListener('click', closeDrawer);
    });

    document.querySelectorAll('.btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            const diameter = Math.max(btn.clientWidth, btn.clientHeight);
            const rect = btn.getBoundingClientRect();
            circle.style.width = circle.style.height = diameter + 'px';
            circle.style.left = (e.clientX - rect.left - diameter / 2) + 'px';
            circle.style.top = (e.clientY - rect.top - diameter / 2) + 'px';
            circle.classList.add('ripple');
            const oldRipple = btn.querySelector('.ripple');
            if (oldRipple) oldRipple.remove();
            btn.appendChild(circle);
        });
    });

    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.querySelector('#cf-name').value.trim();
            const email = document.querySelector('#cf-email').value.trim();
            const phoneCode = document.querySelector('#cf-phone-code').value;
            const phone = document.querySelector('#cf-phone').value.trim();
            const company = document.querySelector('#cf-company').value.trim();
            const service = document.querySelector('#cf-service').value;
            const message = document.querySelector('#cf-message').value.trim();

            const text =
                'Hello CraftSolve,\n\n' +
                'Name:\n' + name + '\n\n' +
                'Email:\n' + email + '\n\n' +
                'Phone:\n' + phoneCode + ' ' + phone + '\n\n' +
                'Company:\n' + (company || 'N/A') + '\n\n' +
                'Interested Service:\n' + service + '\n\n' +
                'Project Details:\n' + message + '\n\n' +
                'I would like to discuss my project.\n\n' +
                'Thank you.';

            const whatsappNumber = '923354673607';
            const url = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(text);
            window.open(url, '_blank');
        });
    }

});
