(function() {
    const preloader = document.getElementById('preloader');
    const heroElements = document.querySelectorAll('.hero-word, .pop-in, .hero-visual-stage, .hero-sweep, .btn');

    function replayHeroAnimations() {
        heroElements.forEach(function(el) {
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = null;
        });
    }

    if (!preloader) {
        replayHeroAnimations();
        return;
    }

    const MIN_DISPLAY_TIME = 300;  // preloader kam se kam itni der screen par rahy (flash na ho)
    const startTime = Date.now();
    let hidden = false;

    function hidePreloader() {
        if (hidden) return;
        hidden = true;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

        setTimeout(function() {
            preloader.classList.add('hidden');
            replayHeroAnimations();
        }, remaining);
    }

    // Preloader ab sirf DOM ready hony ka intezar karta hai — page ki tamam
    // images/videos ka wait nahi karta, taky site fast feel ho. Off-screen
    // images khud lazy-load ho jati hain jab user unky qareeb scroll kare.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hidePreloader);
    } else {
        hidePreloader();
    }
})();

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

    const drawerClose = document.querySelector('.drawer-close');

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('open');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (drawerClose) drawerClose.focus();
    }

    function closeDrawer() {
        const wasOpen = drawer.classList.contains('open');
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (wasOpen && document.activeElement && drawer.contains(document.activeElement)) hamburger.focus();
    }

    if (hamburger && drawer && overlay) {
        hamburger.addEventListener('click', function() {
            drawer.classList.contains('open') ? closeDrawer() : openDrawer();
        });
        overlay.addEventListener('click', closeDrawer);
        if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
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

    const modalOverlay = document.querySelector('#modalOverlay');
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    let activeModal = null;

    function openProjectModal(modal) {
        if (!modal) return;
        activeModal = modal;
        // Lazy-load this modal's images/video only now, on first open
        modal.querySelectorAll('.lazy-media').forEach(function(el) {
            if (el.tagName === 'IMG' && el.dataset.src) {
                el.src = el.dataset.src;
                el.removeAttribute('data-src');
            } else if (el.tagName === 'VIDEO') {
                if (el.dataset.poster) {
                    el.poster = el.dataset.poster;
                    el.removeAttribute('data-poster');
                }
                if (el.dataset.src) {
                    el.src = el.dataset.src;
                    el.preload = 'metadata';
                    el.removeAttribute('data-src');
                }
            }
        });
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!activeModal) return;
        activeModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        const video = activeModal.querySelector('video');
        if (video) video.pause();
        activeModal = null;
    }

    modalTriggers.forEach(function(trigger) {
        const targetId = trigger.getAttribute('data-modal-target');
        const modal = document.getElementById(targetId);
        if (!modal) return;

        trigger.addEventListener('click', function() {
            openProjectModal(modal);
        });
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(modal);
            }
        });

        const closeBtn = modal.querySelector('.project-modal-close');
        if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
    });

    if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
            if (drawer && drawer.classList.contains('open')) closeDrawer();
        }
    });

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
