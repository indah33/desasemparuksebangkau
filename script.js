document.addEventListener("DOMContentLoaded", () => {

    /* Tahun otomatis */
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* Menu mobile */

    const toggle =
        document.querySelector(".menu-toggle");

    const nav =
        document.querySelector(".nav");


    if (toggle && nav) {

        toggle.addEventListener("click", () => {

            nav.classList.toggle("open");

        });

    }


    /* Animasi ketika scroll */

    const reveals =
        document.querySelectorAll(".reveal");


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    reveals.forEach(element => {

        observer.observe(element);

    });


    /* GALERI LIGHTBOX */

    const lightbox =
        document.querySelector(".lightbox");

    const lightboxImg =
        lightbox?.querySelector("img");

    const lightboxText =
        lightbox?.querySelector("p");


    document
        .querySelectorAll(".gallery-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    if (!lightbox) return;


                    const image =
                        item.querySelector("img");


                    lightboxImg.src =
                        image.src;


                    lightboxImg.alt =
                        image.alt;


                    lightboxText.textContent =
                        item.querySelector(
                            "figcaption"
                        )?.textContent || "";


                    lightbox.classList.add(
                        "open"
                    );


                    lightbox.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                }
            );

        });


    function closeLightbox() {

        if (!lightbox) return;


        lightbox.classList.remove(
            "open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document
        .querySelector(".close-lightbox")
        ?.addEventListener(
            "click",
            closeLightbox
        );


    lightbox?.addEventListener(
        "click",
        event => {

            if (event.target === lightbox) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeLightbox();

            }

        }
    );


    /* FORM KONTAK */

    const form =
        document.getElementById(
            "contactForm"
        );


    form?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const message =
                form.querySelector(
                    ".form-message"
                );


            message.textContent =
                "Terima kasih! Pesan Anda sudah diterima sebagai demo.";


            form.reset();

        }
    );

});