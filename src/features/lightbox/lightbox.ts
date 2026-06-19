export function initLightbox() {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement;
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentLightboxImages: {src: string, caption: string}[] = [];
    let currentLightboxIndex = 0;

    function updateLightboxImage() {
        if (!lightboxImg || !lightboxCaption) return;
        const imgData = currentLightboxImages[currentLightboxIndex];
        if (imgData) {
            lightboxImg.src = imgData.src;
            lightboxCaption.textContent = imgData.caption;
            lightboxImg.classList.remove('scale-95');
            lightboxImg.classList.add('scale-100');
        }
    }

    (window as any).openLightbox = function(images: {src: string, caption: string}[], index: number) {
        if (!lightboxModal) return;
        currentLightboxImages = images;
        currentLightboxIndex = index;
        lightboxModal.classList.remove('hidden');
        lightboxModal.classList.add('flex');
        void lightboxModal.offsetWidth; // trigger reflow
        lightboxModal.classList.remove('opacity-0');
        lightboxModal.classList.add('opacity-100');
        updateLightboxImage();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal || !lightboxImg) return;
        lightboxModal.classList.remove('opacity-100');
        lightboxModal.classList.add('opacity-0');
        lightboxImg.classList.remove('scale-100');
        lightboxImg.classList.add('scale-95');
        setTimeout(() => {
            lightboxModal.classList.remove('flex');
            lightboxModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentLightboxImages.length > 0) {
                currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
                updateLightboxImage();
            }
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentLightboxImages.length > 0) {
                currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
                updateLightboxImage();
            }
        });
    }

    // Attach to Static Gallery
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        const cards = Array.from(gallerySection.querySelectorAll('.md-image-card'));
        cards.forEach((card, index) => {
            const img = card.querySelector('img');
            if (img) {
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', () => {
                    const images = cards.map(c => ({
                        src: c.querySelector('img')?.src || '',
                        caption: c.querySelector('p')?.textContent || 'Gallery Image'
                    }));
                    (window as any).openLightbox(images, index);
                });
            }
        });
    }
}
