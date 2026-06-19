import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    // Material Drawer Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-btn')!;
    const menu = document.getElementById('mobile-menu')!;
    const icon = btn.querySelector('i')!;
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
            // Small delay to allow display:block to apply before animating opacity/transform
            setTimeout(() => {
                menu.classList.add('opacity-100', 'scale-y-100');
                menu.classList.remove('opacity-0', 'scale-y-0');
            }, 10);
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            menu.classList.add('opacity-0', 'scale-y-0');
            menu.classList.remove('opacity-100', 'scale-y-100');
            setTimeout(() => {
                menu.classList.add('hidden');
            }, 300); // Wait for transition to finish
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }

    // Initialize drawer state
    menu.classList.add('opacity-0', 'scale-y-0');

    btn.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!menu.classList.contains('hidden')) {
                toggleMenu();
            }
        });
    });

    // Material Top App Bar Scroll Effect (Elevation Change)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('shadow-md-2', 'bg-[#0072CE]/95', 'backdrop-blur-md');
                navbar.classList.remove('bg-[#0072CE]');
            } else {
                navbar.classList.remove('shadow-md-2', 'bg-[#0072CE]/95', 'backdrop-blur-md');
                navbar.classList.add('bg-[#0072CE]');
            }
        });
    }

    // --- NEW MVP FEATURES ---

    // 1. LIGHTBOX LOGIC
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

    function openLightbox(images: {src: string, caption: string}[], index: number) {
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
                    openLightbox(images, index);
                });
            }
        });
    }
    // 2. Scroll Animations (IntersectionObserver)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // 3. Easter Egg Keylogger
    let keys = '';
    const secret = 'jtk25';
    window.addEventListener('keydown', (e) => {
        keys += e.key.toLowerCase();
        if (keys.length > secret.length) {
            keys = keys.slice(1);
        }
        if (keys === secret) {
            const modal = document.getElementById('matrix-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
            keys = ''; // reset
        }
    });

    // 4. OOTD Logic (Supabase)
    const ootdForm = document.getElementById('upload-form') as HTMLFormElement;
    const ootdNameInput = document.getElementById('ootd-name') as HTMLInputElement;
    const ootdFileInput = document.getElementById('ootd-file') as HTMLInputElement;
    const uploadSpinner = document.getElementById('upload-spinner');
    const uploadSubmitBtn = document.getElementById('upload-submit-btn') as HTMLButtonElement;
    const ootdGrid = document.getElementById('ootd-grid');

    async function fetchOotdPosts() {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('ootd_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching OOTD:', error);
            if (ootdGrid) ootdGrid.innerHTML = `<p class="text-red-500 col-span-full text-center">Gagal memuat data dari server: ${error.message}</p>`;
            return;
        }

        if (ootdGrid) {
            ootdGrid.innerHTML = ''; // clear loading
            if (data && data.length > 0) {
                const ootdImages = data.map((p: any) => ({ src: p.image_url, caption: p.name || 'OOTD' }));

                data.forEach((post: any, index: number) => {
                    const card = document.createElement('div');
                    card.className = 'bg-white rounded-[24px] shadow-lg overflow-hidden flex flex-col group';
                    card.innerHTML = `
                        <div class="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 cursor-zoom-in ootd-img-container">
                            <img src="${post.image_url}" alt="${post.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                        <div class="p-4 flex justify-between items-center">
                            <p class="font-bold text-[#001D36] truncate flex-1">${post.name}</p>
                            <button onclick="window.likeOotd('${post.id}')" class="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors ml-4 shrink-0">
                                <i class="fa-solid fa-heart"></i>
                                <span id="like-count-${post.id}" class="font-mono text-sm">${post.likes || 0}</span>
                            </button>
                        </div>
                    `;
                    ootdGrid.appendChild(card);
                    
                    const imgContainer = card.querySelector('.ootd-img-container');
                    if (imgContainer) {
                        imgContainer.addEventListener('click', () => {
                            openLightbox(ootdImages, index);
                        });
                    }
                });
            } else {
                ootdGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 font-mono py-12">Belum ada data OOTD. Jadilah yang pertama!</p>`;
            }
        }
    }

    if (ootdForm) {
        ootdForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const file = ootdFileInput.files?.[0];
            const name = ootdNameInput.value.trim();

            if (!file || !name) {
                alert("Mohon isi nama dan pilih foto!");
                return;
            }

            try {
                uploadSubmitBtn.disabled = true;
                uploadSpinner?.classList.remove('hidden');

                // Upload Image
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `public/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('ootd_images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: publicUrlData } = supabase.storage
                    .from('ootd_images')
                    .getPublicUrl(filePath);

                const imageUrl = publicUrlData.publicUrl;

                // Insert into DB
                const { error: dbError } = await supabase
                    .from('ootd_posts')
                    .insert([{ name, image_url: imageUrl, likes: 0 }]);

                if (dbError) throw dbError;

                alert("OOTD berhasil di-upload! 🔥");
                
                ootdForm.reset();
                document.getElementById('file-name-display')!.innerText = 'Klik untuk memilih foto';
                const modal = document.getElementById('upload-modal');
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }

                fetchOotdPosts();

            } catch (err: any) {
                console.error("Upload error:", err);
                alert(`Gagal upload: ${err.message}`);
            } finally {
                uploadSubmitBtn.disabled = false;
                uploadSpinner?.classList.add('hidden');
            }
        });
    }

    // Initialize fetch
    fetchOotdPosts();

    // 5. Size Exchange Logic (Supabase)
    const excForm = document.getElementById('exchange-form') as HTMLFormElement;
    const excName = document.getElementById('exc-name') as HTMLInputElement;
    const excHave = document.getElementById('exc-have') as HTMLSelectElement;
    const excWant = document.getElementById('exc-want') as HTMLSelectElement;
    const excContact = document.getElementById('exc-contact') as HTMLInputElement;
    const excSubmitBtn = document.getElementById('exc-submit-btn') as HTMLButtonElement;
    const excSpinner = document.getElementById('exc-spinner');
    const excList = document.getElementById('exchange-list');

    async function fetchExchanges() {
        if (!supabase || !excList) return;
        const { data, error } = await supabase
            .from('size_exchanges')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            excList.innerHTML = `<p class="text-red-500 text-center py-4">Gagal memuat bursa: ${error.message}</p>`;
            return;
        }

        excList.innerHTML = '';
        if (data && data.length > 0) {
            data.forEach((item: any) => {
                const div = document.createElement('div');
                div.className = 'bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#0072CE] transition-colors';
                div.innerHTML = `
                    <div class="flex-1">
                        <p class="font-bold text-[#001D36] text-lg">${item.name}</p>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">Punya: ${item.have_size}</span>
                            <i class="fa-solid fa-arrow-right text-gray-400 text-xs"></i>
                            <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Cari: ${item.want_size}</span>
                        </div>
                    </div>
                    <a href="https://wa.me/${item.contact.replace(/[^0-9]/g, '')}" target="_blank" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center shrink-0 transition-colors">
                        <i class="fa-brands fa-whatsapp mr-2"></i> Hubungi
                    </a>
                `;
                excList.appendChild(div);
            });
        } else {
            excList.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-400 py-12"><i class="fa-solid fa-box-open text-4xl mb-4"></i><p>Belum ada yang ingin bertukar ukuran.</p></div>`;
        }
    }

    if (excForm) {
        excForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (excHave.value === excWant.value) {
                alert('Ukuran yang dimiliki dan dicari tidak boleh sama!');
                return;
            }

            try {
                excSubmitBtn.disabled = true;
                excSpinner?.classList.remove('hidden');

                const { error } = await supabase.from('size_exchanges').insert([{
                    name: excName.value.trim(),
                    have_size: excHave.value,
                    want_size: excWant.value,
                    contact: excContact.value.trim()
                }]);

                if (error) throw error;

                alert('Berhasil didaftarkan ke Bursa Tukar!');
                excForm.reset();
                fetchExchanges();
            } catch (err: any) {
                console.error('Error insert exchange:', err);
                alert(`Gagal mengirim: ${err.message}`);
            } finally {
                excSubmitBtn.disabled = false;
                excSpinner?.classList.add('hidden');
            }
        });
    }

    // Initialize fetch
    fetchExchanges();
});

// 6. Care Guide & Like Functions (Exposed to global window)
declare global {
    interface Window {
        checkWashing: () => void;
        checkIron: () => void;
        likeOotd: (id: string) => void;
    }
}

window.likeOotd = async (id: string) => {
    // Optimistic UI update
    const countSpan = document.getElementById(`like-count-${id}`);
    if (countSpan) {
        let currentLikes = parseInt(countSpan.innerText);
        countSpan.innerText = (currentLikes + 1).toString();
        countSpan.parentElement!.classList.add('text-red-500');
        countSpan.parentElement!.classList.remove('text-gray-500');
    }

    // Increment in DB
    const { data } = await supabase.from('ootd_posts').select('likes').eq('id', id).single();
    if (data) {
        await supabase.from('ootd_posts').update({ likes: data.likes + 1 }).eq('id', id);
    }
};

window.checkWashing = () => {
    const errorMsg = document.getElementById('wash-error');
    if (errorMsg) errorMsg.classList.remove('hidden');
};

window.checkIron = () => {
    const errorMsg = document.getElementById('iron-error');
    if (errorMsg) errorMsg.classList.remove('hidden');
};
