(() => {

    /* =========================================================
       CORE HELPERS
       ========================================================= */

    const $ = (s, p = document) => p.querySelector(s);

    const $$ = (s, p = document) =>
        [...p.querySelectorAll(s)];

    const reduced =
        matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* =========================================================
       LENIS — SMOOTH SCROLL
       ========================================================= */

    let lenis;

    if (!reduced && window.Lenis) {

        lenis = new Lenis({
            duration: 1.15,
            smoothWheel: true,
            smoothTouch: false,
            easing: t => 1 - Math.pow(1 - t, 4)
        });

        const raf = t => {
            lenis.raf(t);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
    }


    /* =========================================================
       LOADER
       ========================================================= */

    const loader = $('#loader');

    if (!reduced) {

        const tl = gsap.timeline();

        tl
            .to(
                '.loader-line i',
                {
                    width: '100%',
                    duration: 1.15,
                    ease: 'power3.inOut'
                }
            )

            .to(
                '.loader-word span:first-child',
                {
                    y: '-110%',
                    duration: .7,
                    ease: 'power4.inOut'
                },
                '-=.25'
            )

            .to(
                '.loader-word span:last-child',
                {
                    y: 0,
                    duration: .7,
                    ease: 'power4.inOut'
                },
                '-=.55'
            )

            .to(
                loader,
                {
                    opacity: 0,
                    duration: .7,
                    delay: .45,

                    onComplete: () => {
                        loader.classList.add('hide');
                    }
                }
            );

    } else {

        loader.classList.add('hide');

    }


    /* =========================================================
       NAVIGATION
       ========================================================= */

    const topbar = $('#topbar');
    const menu = $('#menu');
    const nav = $('#nav');

    menu?.addEventListener(
        'click',
        () => {

            const open =
                nav.classList.toggle('open');

            menu.setAttribute(
                'aria-expanded',
                String(open)
            );
        }
    );

    $$('#nav a').forEach(
        a => {

            a.addEventListener(
                'click',
                () => {

                    nav.classList.remove('open');

                }
            );

        }
    );


    /* =========================================================
       SCROLL PROGRESS
       ========================================================= */

    const progress =
        $('.scroll-progress i');

    function scrollProgress() {

        const d =
            document.documentElement;

        if (progress) {

            progress.style.width =
                `${(
                    scrollY /
                    Math.max(
                        1,
                        d.scrollHeight - innerHeight
                    )
                ) * 100}%`;

        }

        topbar?.classList.toggle(
            'scrolled',
            scrollY > 40
        );
    }

    addEventListener(
        'scroll',
        scrollProgress,
        { passive: true }
    );

    scrollProgress();


    /* =========================================================
       WEBGL AMBIENT FIELD
       ========================================================= */

    if (
        !reduced &&
        window.THREE &&
        innerWidth > 700
    ) {

        const host = $('.webgl');

        if (host) {

            const scene =
                new THREE.Scene();

            const camera =
                new THREE.PerspectiveCamera(
                    55,
                    innerWidth / innerHeight,
                    .1,
                    100
                );

            camera.position.z = 5;


            const renderer =
                new THREE.WebGLRenderer({
                    alpha: true,
                    antialias: true,
                    powerPreference: 'high-performance'
                });

            renderer.setPixelRatio(
                Math.min(devicePixelRatio, 1.5)
            );

            renderer.setSize(
                innerWidth,
                innerHeight
            );

            host.appendChild(
                renderer.domElement
            );


            const n =
                Math.min(
                    1100,
                    Math.floor(innerWidth * 1.1)
                );


            const geo =
                new THREE.BufferGeometry();

            const pos =
                new Float32Array(n * 3);


            for (
                let i = 0;
                i < n;
                i++
            ) {

                pos[i * 3] =
                    (Math.random() - .5) * 12;

                pos[i * 3 + 1] =
                    (Math.random() - .5) * 7;

                pos[i * 3 + 2] =
                    (Math.random() - .5) * 8;

            }


            geo.setAttribute(
                'position',
                new THREE.BufferAttribute(
                    pos,
                    3
                )
            );


            const mat =
                new THREE.PointsMaterial({
                    color: 0xccff00,
                    size: .018,
                    transparent: true,
                    opacity: .55
                });


            const pts =
                new THREE.Points(
                    geo,
                    mat
                );

            scene.add(pts);


            let mx = 0;
            let my = 0;


            addEventListener(
                'pointermove',
                e => {

                    mx =
                        (
                            e.clientX /
                            innerWidth -
                            .5
                        ) * .5;

                    my =
                        (
                            e.clientY /
                            innerHeight -
                            .5
                        ) * .35;

                },
                { passive: true }
            );


            function render(t) {

                pts.rotation.y =
                    t * .00003 +
                    mx * .15;

                pts.rotation.x =
                    -my * .1;

                renderer.render(
                    scene,
                    camera
                );

                requestAnimationFrame(
                    render
                );
            }

            requestAnimationFrame(
                render
            );


            addEventListener(
                'resize',
                () => {

                    camera.aspect =
                        innerWidth /
                        innerHeight;

                    camera.updateProjectionMatrix();

                    renderer.setSize(
                        innerWidth,
                        innerHeight
                    );

                }
            );

        }
    }


    /* =========================================================
       GSAP + SCROLLTRIGGER
       ========================================================= */

    if (
        !reduced &&
        window.gsap &&
        window.ScrollTrigger
    ) {

        gsap.registerPlugin(
            ScrollTrigger
        );


        /* -----------------------------------------
           LENIS + SCROLLTRIGGER
           ----------------------------------------- */

        if (lenis) {

            lenis.on(
                'scroll',
                ScrollTrigger.update
            );

        }

        gsap.ticker.lagSmoothing(0);


        /* -----------------------------------------
           HERO INTRO
           ----------------------------------------- */

        gsap.from(
            '.hero-copy',
            {
                y: 70,
                opacity: 0,
                duration: 1.2,
                delay: 1.6,
                ease: 'power4.out'
            }
        );


        gsap.from(
            '.hero-meta span',
            {
                y: 20,
                opacity: 0,
                stagger: .08,
                duration: .7,
                delay: 2,
                ease: 'power3.out'
            }
        );
 

        /* -----------------------------------------
   HERO PORTRAIT — RESPONSIVE SCROLL REVEAL
   ----------------------------------------- */

const heroPortrait = document.querySelector('.hero-portrait');
const heroPortraitImage = document.querySelector('.hero-portrait-image');

if (heroPortrait && heroPortraitImage) {

    /* Desktop — cinematic zoom + fade-up */
    if (window.innerWidth > 768) {

        gsap.fromTo(
            heroPortrait,
            {
                opacity: 0,
                y: 100,
                scale: 0.72,
                filter: 'blur(14px)'
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.5,
                delay: 1.8,
                ease: 'power4.out'
            }
        );

        gsap.fromTo(
            heroPortraitImage,
            {
                scale: 1.22
            },
            {
                scale: 1,
                duration: 2,
                delay: 1.8,
                ease: 'power3.out'
            }
        );

        /* Scroll movement */
        gsap.to(
            heroPortrait,
            {
                y: -90,
                scale: 1.04,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.4
                }
            }
        );

    }

    /* Mobile — photo appears below heading */
    else {

        gsap.fromTo(
            heroPortrait,
            {
                opacity: 0,
                y: 80,
                scale: 0.82,
                filter: 'blur(10px)'
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.1,
                delay: 0.35,
                ease: 'power4.out'
            }
        );

        gsap.to(
            heroPortrait,
            {
                y: -35,
                scale: 1.02,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top 70%',
                    end: 'bottom top',
                    scrub: 1
                }
            }
        );

    }

}

        /* -----------------------------------------
           HERO PORTRAIT SCENE
           ----------------------------------------- */

        gsap.timeline({

            scrollTrigger: {
                trigger: '.portrait-scene',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2
            }

        })

        .to(
            '.portrait-frame',
            {
                y: -70,
                scale: .9,
                ease: 'none'
            },
            0
        )

        .to(
            '.portrait-frame img',
            {
                y: '-12%',
                scale: 1.14,
                ease: 'none'
            },
            0
        )

        .to(
            '.portrait-copy.left',
            {
                y: 0,
                opacity: 1
            },
            .08
        )

        .to(
            '.portrait-copy.right',
            {
                y: 0,
                opacity: 1
            },
            .55
        );


        /* -----------------------------------------
           PRINCIPLES
           ----------------------------------------- */

        gsap.from(
            '.principles article',
            {

                scrollTrigger: {
                    trigger: '.principles',
                    start: 'top 75%'
                },

                y: 40,
                opacity: 0,
                stagger: .08,
                duration: .7,
                ease: 'power3.out'

            }
        );


        /* -----------------------------------------
           THINKING GRID
           ----------------------------------------- */

        gsap.from(
            '.thinking-grid article',
            {

                scrollTrigger: {
                    trigger: '.thinking-grid',
                    start: 'top 78%'
                },

                y: 45,
                opacity: 0,
                stagger: .08,
                duration: .8,
                ease: 'power3.out'

            }
        );


        /* -----------------------------------------
           EXPERIENCE TIMELINE
           ----------------------------------------- */

        gsap.from(
            '.timeline article',
            {

                scrollTrigger: {
                    trigger: '.timeline',
                    start: 'top 80%'
                },

                x: -45,
                opacity: 0,
                stagger: .12,
                duration: .8,
                ease: 'power3.out'

            }
        );


        /* =================================================
           CINEMATIC FOOTER
           ================================================= */

        const footerPortrait =
            document.querySelector(
                '[data-footer-portrait]'
            );

        const footerImageWrap =
            document.querySelector(
                '.footer-image-wrap'
            );

        const footerName =
            document.querySelector(
                '.footer-name'
            );

        const footerGlow =
            document.querySelector(
                '.footer-image-glow'
            );


        if (
            footerPortrait &&
            footerImageWrap &&
            footerName &&
            footerGlow
        ) {


            /* -----------------------------------------
               FOOTER PORTRAIT SCROLL REVEAL
               ----------------------------------------- */

            gsap.fromTo(

                footerPortrait,

                {
                    y: 100,
                    opacity: 0
                },

                {
                    y: 0,
                    opacity: 1,

                    ease: 'power4.out',

                    scrollTrigger: {

                        trigger:
                            '.cinematic-footer',

                        start:
                            'top 92%',

                        end:
                            'top 48%',

                        scrub: 1.4

                    }

                }

            );


            /* -----------------------------------------
               FOOTER NAME REVEAL
               ----------------------------------------- */

            gsap.fromTo(

                footerName,

                {
                    y: 90,
                    scale: .82,
                    opacity: 0
                },

                {
                    y: 0,
                    scale: 1,
                    opacity: 1,

                    ease: 'power3.out',

                    scrollTrigger: {

                        trigger:
                            '.cinematic-footer',

                        start:
                            'top 78%',

                        end:
                            'top 38%',

                        scrub: 1.5

                    }

                }

            );


            /* -----------------------------------------
               IMAGE SCALE DURING SCROLL
               ----------------------------------------- */

            gsap.fromTo(

                footerImageWrap,

                {
                    scale: .82
                },

                {
                    scale: .92,

                    ease: 'none',

                    scrollTrigger: {

                        trigger:
                            '.cinematic-footer',

                        start:
                            'top 85%',

                        end:
                            'top 35%',

                        scrub: 1.5

                    }

                }

            );


            /* -----------------------------------------
               FOOTER MOUSE DEPTH
               ----------------------------------------- */

            let targetX = 0;
            let targetY = 0;


            footerPortrait.addEventListener(

                'pointermove',

                e => {

                    const rect =
                        footerPortrait
                            .getBoundingClientRect();


                    const x =
                        (
                            e.clientX -
                            rect.left
                        ) /
                        rect.width -
                        .5;


                    const y =
                        (
                            e.clientY -
                            rect.top
                        ) /
                        rect.height -
                        .5;


                    targetX =
                        x * 14;

                    targetY =
                        y * 9;

                },

                { passive: true }

            );


            footerPortrait.addEventListener(

                'pointerleave',

                () => {

                    targetX = 0;
                    targetY = 0;

                },

                { passive: true }

            );


            /* -----------------------------------------
               SMOOTH DEPTH LOOP
               ----------------------------------------- */

            function animateFooterDepth() {

                const currentX =
                    parseFloat(
                        footerImageWrap
                            .dataset
                            .x || '0'
                    );


                const currentY =
                    parseFloat(
                        footerImageWrap
                            .dataset
                            .y || '0'
                    );


                const nextX =
                    currentX +
                    (
                        targetX -
                        currentX
                    ) * .08;


                const nextY =
                    currentY +
                    (
                        targetY -
                        currentY
                    ) * .08;


                footerImageWrap.dataset.x =
                    nextX;

                footerImageWrap.dataset.y =
                    nextY;


                footerImageWrap.style.translate =
                    `${nextX}px ${nextY}px`;


                requestAnimationFrame(
                    animateFooterDepth
                );

            }


            animateFooterDepth();

        }

    }


    /* =========================================================
       PROJECT SHOWCASE
       ========================================================= */

    const panels =
        $$('.project-panel');

    const dots =
        $$('.dot');


    let active = 0;


    function activate(i) {

        active = i;


        panels.forEach(
            (p, n) => {

                p.classList.toggle(
                    'active',
                    n === i
                );

            }
        );


        dots.forEach(
            (d, n) => {

                d.classList.toggle(
                    'active',
                    n === i
                );

            }
        );

    }


    dots.forEach(
        (d, i) => {

            d.addEventListener(
                'click',
                () => activate(i)
            );

        }
    );


    if (
        !reduced &&
        window.ScrollTrigger
    ) {

        panels.forEach(
            (p, i) => {

                ScrollTrigger.create({

                    trigger: p,

                    start:
                        'top center',

                    end:
                        'bottom center',

                    onEnter:
                        () => activate(i),

                    onEnterBack:
                        () => activate(i)

                });

            }
        );

    }


    /* =========================================================
       PROJECT DATA
       ========================================================= */

    const data = {

        crownserve: {

            k:
                'CROWNSERVE / HOSPITALITY INTELLIGENCE',

            title:
                'CrownServe',

            lead:
                'A connected hospitality operating platform designed around operations, management control and business intelligence.',

            body: `
                <p>
                    CrownServe connects the guest experience to kitchen execution,
                    management visibility and intelligence instead of treating each
                    workflow as an isolated tool.
                </p>

                <ul>
                    <li>
                        Customer digital menu and ordering experience
                    </li>

                    <li>
                        Chef / kitchen operational workflow
                    </li>

                    <li>
                        Manager dashboard and operational monitoring
                    </li>

                    <li>
                        Owner / HQ and multi-property direction
                    </li>

                    <li>
                        Revenue, performance and slow-moving analysis
                    </li>

                    <li>
                        Feedback and business intelligence direction
                    </li>
                </ul>

                <p>
                    The current product is actively being expanded toward backend
                    architecture, centralized persistent data, authentication,
                    multi-tenancy, realtime services and scalable analytics.
                </p>
            `,

            status:
                'ACTIVE DEVELOPMENT · GITHUB PRIVATE'

        },


        alrafiq: {

            k:
                'AL RAFIQ / ISLAMIC KNOWLEDGE & ISLAH',

            title:
                'AL RAFIQ',

            lead:
                'Find the Daleel → Understand the Context → Reflect → Take Action.',

            body: `
                <p>
                    AL RAFIQ is designed as a source-aware Islamic knowledge and
                    Islah companion. Its core philosophy is evidence before
                    explanation, context before conclusion, reflection before
                    reaction, and action after understanding.
                </p>

                <ul>

                    <li>
                        Hadith of the Day and structured Hadith exploration
                    </li>

                    <li>
                        Reference, grading and provenance awareness
                    </li>

                    <li>
                        Context, explanation and practical reflection
                    </li>

                    <li>
                        AI-assisted search grounded in an approved knowledge layer
                    </li>

                    <li>
                        Save and text-to-speech workflows
                    </li>

                </ul>

                <p>
                    The project is currently in pre-production / quality-assurance
                    and should not be presented as fully market-ready until source
                    verification, AI grounding, security and real-device validation
                    are complete.
                </p>
            `,

            status:
                'PRIVATE · PRE-PRODUCTION / QA'

        },


        mass: {

            k:
                'MASS / AI EXECUTIVE ASSISTANT',

            title:
                'MASS',

            lead:
                'AI-powered digital workflow management with tools, permissions and verification.',

            body: `
                <p>
                    MASS is an AI Executive Assistant direction for managing
                    authorized digital work on behalf of a user.
                </p>

                <ul>

                    <li>
                        Gmail and Google Calendar workflow direction
                    </li>

                    <li>
                        Natural-language instructions
                    </li>

                    <li>
                        Email classification, summarization and drafting
                    </li>

                    <li>
                        Meeting scheduling and task automation
                    </li>

                    <li>
                        Permission and approval engine
                    </li>

                    <li>
                        AI memory, notifications and automation workflows
                    </li>

                </ul>

                <p>
                    The architecture direction includes a web dashboard,
                    FastAPI layer, tool integrations, permission controls,
                    action validation, database/audit logs and notifications.
                </p>
            `,

            status:
                'PRIVATE · IN DEVELOPMENT'

        }

    };


    /* =========================================================
       PROJECT MODAL
       ========================================================= */

    const modal =
        $('#modal');


    function openModal(key) {

        const d =
            data[key];

        if (!d || !modal) return;


        $('#modalKicker').textContent =
            d.k;

        $('#modalTitle').textContent =
            d.title;

        $('#modalLead').textContent =
            d.lead;

        $('#modalBody').innerHTML =
            d.body;

        $('#modalStatus').textContent =
            d.status;


        modal.classList.add(
            'open'
        );


        modal.setAttribute(
            'aria-hidden',
            'false'
        );


        document.body.classList.add(
            'lock'
        );


        $('.modal-close')?.focus();

    }


    function closeModal() {

        if (!modal) return;


        modal.classList.remove(
            'open'
        );


        modal.setAttribute(
            'aria-hidden',
            'true'
        );


        document.body.classList.remove(
            'lock'
        );

    }


    $$('.read-more').forEach(

        b => {

            b.addEventListener(
                'click',
                () => openModal(
                    b.dataset.modal
                )
            );

        }

    );


    $$('[data-close]').forEach(

        b => {

            b.addEventListener(
                'click',
                closeModal
            );

        }

    );


    /* =========================================================
       KEYBOARD
       ========================================================= */

    addEventListener(

        'keydown',

        e => {

            if (e.key === 'Escape') {

                closeModal();

            }

        }

    );


})();

// for certifications
/* =========================================================
   CERTIFICATIONS — CINEMATIC 01 → 05 SCROLL SEQUENCE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const section = document.querySelector(".certifications");
    const stage = document.querySelector(".cert-stage");
    const cards = gsap.utils.toArray(".cert-card");

    if (!section || !stage || cards.length === 0) return;

    if (typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined") {
        console.warn("GSAP / ScrollTrigger not loaded.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const currentCounter =
        section.querySelector(".cert-current");

    const total = cards.length;


    /* ---------------------------------------------------------
       RESET ALL CARDS
       --------------------------------------------------------- */

    cards.forEach((card, index) => {

        const left = card.querySelector(".cert-panel-left");
        const right = card.querySelector(".cert-panel-right");
        const spark = card.querySelector(".cert-spark");
        const content = card.querySelector(".cert-content");

        gsap.set(card, {
            autoAlpha: 0,
            scale: 0.94,
            zIndex: 10 + index
        });

        gsap.set(left, {
            xPercent: 0
        });

        gsap.set(right, {
            xPercent: 0
        });

        gsap.set(spark, {
            scaleY: 0.25,
            opacity: 0
        });

        gsap.set(content, {
            opacity: 0,
            scale: 0.96
        });

        card.classList.remove(
            "is-active",
            "is-open",
            "is-revealed"
        );
    });


    /* ---------------------------------------------------------
       COUNTER
       --------------------------------------------------------- */

    function updateCounter(index) {

        if (!currentCounter) return;

        currentCounter.textContent =
            String(index + 1).padStart(2, "0");
    }


    /* ---------------------------------------------------------
       MASTER TIMELINE
       --------------------------------------------------------- */

    const timeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        },

        scrollTrigger: {

            trigger: stage,

            /*
             * Page scrolls normally until the certificate
             * stage reaches the center of the viewport.
             */
            start: "center center",

            /*
             * 5 certificates = 5 viewport scroll sections.
             */
            end: () =>
                `+=${total * window.innerHeight}`,

            pin: true,

            pinSpacing: true,

            scrub: 1,

            anticipatePin: 1,

            invalidateOnRefresh: true,

            onUpdate: self => {

                let index =
                    Math.floor(self.progress * total);

                if (index >= total) {
                    index = total - 1;
                }

                updateCounter(index);
            }
        }
    });


    /* ---------------------------------------------------------
       CREATE 01 → 05 SEQUENCE
       --------------------------------------------------------- */

    cards.forEach((card, index) => {

        const left =
            card.querySelector(".cert-panel-left");

        const right =
            card.querySelector(".cert-panel-right");

        const spark =
            card.querySelector(".cert-spark");

        const content =
            card.querySelector(".cert-content");


        /*
         * Every certificate owns exactly one
         * timeline section.
         */
        const t = index;


        /* ---------------------------------------------
           CARD APPEARS
           --------------------------------------------- */

        timeline.to(card, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.12
        }, t);


        /* ---------------------------------------------
           GREEN ENERGY SEAM
           --------------------------------------------- */

        timeline.to(spark, {
            scaleY: 1,
            opacity: 1,
            duration: 0.10,
            ease: "power2.out"
        }, t + 0.08);


        /* ---------------------------------------------
           LEFT PANEL OPENS
           --------------------------------------------- */

        timeline.to(left, {
            xPercent: -100,
            duration: 0.22,
            ease: "power4.inOut"
        }, t + 0.14);


        /* ---------------------------------------------
           RIGHT PANEL OPENS
           --------------------------------------------- */

        timeline.to(right, {
            xPercent: 100,
            duration: 0.22,
            ease: "power4.inOut"
        }, t + 0.14);


        /* ---------------------------------------------
           CERTIFICATE REVEAL
           --------------------------------------------- */

        timeline.to(content, {
            opacity: 1,
            scale: 1,
            duration: 0.22,
            ease: "power3.out"
        }, t + 0.34);


        /* ---------------------------------------------
           PREMIUM HOLD
           --------------------------------------------- */

        timeline.to(card, {
            scale: 1.012,
            duration: 0.18,
            ease: "none"
        }, t + 0.58);


        timeline.to(card, {
            scale: 1,
            duration: 0.10
        }, t + 0.76);


        /* ---------------------------------------------
           CLOSE / EXIT
           --------------------------------------------- */

        if (index < total - 1) {

            timeline.to(card, {
                autoAlpha: 0,
                scale: 0.94,
                duration: 0.10,
                ease: "power2.in"
            }, t + 0.88);


            /*
             * Reset current card BEFORE next certificate.
             * This is important.
             */
            timeline.set(left, {
                xPercent: 0
            }, t + 0.99);

            timeline.set(right, {
                xPercent: 0
            }, t + 0.99);

            timeline.set(spark, {
                scaleY: 0.25,
                opacity: 0
            }, t + 0.99);

            timeline.set(content, {
                opacity: 0,
                scale: 0.96
            }, t + 0.99);
        }

    });


    /* ---------------------------------------------------------
       START COUNTER
       --------------------------------------------------------- */

    updateCounter(0);


    /* ---------------------------------------------------------
       REFRESH AFTER EVERYTHING LOADS
       --------------------------------------------------------- */

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

});