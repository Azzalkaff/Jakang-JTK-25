import { supabase } from '../../lib/supabase';
import { isAdmin, getMyOotds, addMyOotd } from '../../lib/auth';

export function initOotdFeature() {
    const ootdForm = document.getElementById('upload-form') as HTMLFormElement;
    const ootdNameInput = document.getElementById('ootd-name') as HTMLInputElement;
    const ootdFileInput = document.getElementById('ootd-file') as HTMLInputElement;
    const ootdCommentInput = document.getElementById('ootd-comment') as HTMLTextAreaElement;
    const uploadSpinner = document.getElementById('upload-spinner');
    const uploadSubmitBtn = document.getElementById('upload-submit-btn') as HTMLButtonElement;
    const ootdGrid = document.getElementById('ootd-grid');
    const loadMoreContainer = document.getElementById('load-more-container');
    const loadMoreBtn = document.getElementById('load-more-btn');

    let ootdPage = 0;
    const OOTD_PAGE_SIZE = 12;
    let isLoadingOotd = false;

    async function fetchOotdPosts(append = false) {
        if (!supabase) return;
        if (isLoadingOotd) return;
        isLoadingOotd = true;

        if (loadMoreBtn && append) {
            const icon = loadMoreBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-circle-notch', 'fa-spin');
            }
        }

        const from = ootdPage * OOTD_PAGE_SIZE;
        const to = from + OOTD_PAGE_SIZE - 1;

        const { data, error, count } = await supabase
            .from('ootd_posts')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        isLoadingOotd = false;

        if (loadMoreBtn && append) {
            const icon = loadMoreBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-circle-notch', 'fa-spin');
                icon.classList.add('fa-chevron-down');
            }
        }

        if (error) {
            console.error('Error fetching OOTD:', error);
            if (ootdGrid && !append) ootdGrid.innerHTML = `<p class="text-red-500 col-span-full text-center">Gagal memuat data dari server: ${error.message}</p>`;
            return;
        }

        if (ootdGrid) {
            if (!append) {
                ootdGrid.innerHTML = ''; // clear loading
                (window as any).currentOotdImages = [];
            }
            
            if (data && data.length > 0) {
                const myOotds = getMyOotds();
                const likedPosts = JSON.parse(localStorage.getItem('jtk25_liked') || '[]');

                data.forEach((post: any) => {
                    const index = (window as any).currentOotdImages.length;
                    (window as any).currentOotdImages.push({ src: post.image_url, caption: post.name || 'OOTD' });

                    const isOwner = isAdmin || myOotds.includes(post.id);
                    const deleteBtnHtml = isOwner ? 
                        `<button onclick="window.deleteOotd('${post.id}', '${post.image_url}')" class="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full shadow-lg flex justify-center items-center hover:bg-red-600 transition z-10" title="Hapus Foto">
                            <i class="fa-solid fa-trash text-sm"></i>
                        </button>` : '';

                    const commentHtml = post.comment ? `<p class="text-sm text-gray-600 mt-2 italic break-words line-clamp-2">"${post.comment}"</p>` : '';

                    const isLiked = likedPosts.includes(post.id);
                    const likeBtnClass = isLiked ? 'text-red-500 opacity-80 cursor-default' : 'text-gray-500 hover:text-red-500 transition-colors';
                    const likeOnClick = isLiked ? '' : `onclick="window.likeOotd('${post.id}')"`;

                    const card = document.createElement('div');
                    card.className = 'bg-white rounded-[24px] shadow-lg overflow-hidden flex flex-col group relative';
                    card.innerHTML = `
                        ${deleteBtnHtml}
                        <div class="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 cursor-zoom-in ootd-img-container">
                            <img src="${post.image_url}" alt="${post.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                        <div class="p-4 flex flex-col justify-between">
                            <div class="flex justify-between items-start">
                                <p class="font-bold text-[#001D36] truncate flex-1">${post.name}</p>
                                <div class="flex items-center gap-3 shrink-0 ml-2">
                                    <button onclick="window.openCommentModal('${post.id}')" class="flex items-center gap-1.5 text-gray-500 hover:text-[#0072CE] transition-colors">
                                        <i class="fa-regular fa-comment"></i>
                                    </button>
                                    <button ${likeOnClick} class="flex items-center gap-1.5 ${likeBtnClass}">
                                        <i class="fa-solid fa-heart"></i>
                                        <span id="like-count-${post.id}" class="font-mono text-sm">${post.likes || 0}</span>
                                    </button>
                                </div>
                            </div>
                            ${commentHtml}
                        </div>
                    `;
                    ootdGrid.appendChild(card);
                    
                    const imgContainer = card.querySelector('.ootd-img-container');
                    if (imgContainer) {
                        imgContainer.addEventListener('click', () => {
                            if ((window as any).openLightbox) (window as any).openLightbox((window as any).currentOotdImages, index);
                        });
                    }
                });

                if (loadMoreContainer) {
                    if (count && count > to) {
                        loadMoreContainer.classList.remove('hidden');
                    } else {
                        loadMoreContainer.classList.add('hidden');
                    }
                }
            } else if (!append) {
                ootdGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 font-mono py-12">Belum ada data OOTD. Jadilah yang pertama!</p>`;
                if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
            }
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            ootdPage++;
            fetchOotdPosts(true);
        });
    }

    if (ootdForm) {
        ootdForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const file = ootdFileInput.files?.[0];
            const name = ootdNameInput.value.trim();
            const comment = ootdCommentInput ? ootdCommentInput.value.trim() : null;

            if (!file || !name) {
                alert("Mohon isi nama dan pilih foto!");
                return;
            }

            if (!supabase) {
                alert("Database tidak terhubung.");
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
                const { data: insertData, error: dbError } = await supabase
                    .from('ootd_posts')
                    .insert([{ name, image_url: imageUrl, likes: 0, comment }])
                    .select();

                if (dbError) throw dbError;
                
                if (insertData && insertData[0]) {
                    addMyOotd(insertData[0].id);
                }

                alert("OOTD berhasil di-upload! 🔥");
                
                ootdForm.reset();
                document.getElementById('file-name-display')!.innerText = 'Klik untuk memilih foto';
                const modal = document.getElementById('upload-modal');
                if (modal) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }

                ootdPage = 0;
                fetchOotdPosts(false);

            } catch (err: any) {
                console.error("Upload error:", err);
                alert(`Gagal upload: ${err.message}`);
            } finally {
                uploadSubmitBtn.disabled = false;
                uploadSpinner?.classList.add('hidden');
            }
        });
    }

    // Comment Logic
    const commentModal = document.getElementById('comment-modal');
    const commentModalContent = document.getElementById('comment-modal-content');
    const commentsWrapper = document.getElementById('comments-wrapper');
    const commentLoader = document.getElementById('comment-loader');
    const commentForm = document.getElementById('comment-form') as HTMLFormElement;
    const commentPostIdInput = document.getElementById('comment-post-id') as HTMLInputElement;
    const commentNameInput = document.getElementById('comment-name') as HTMLInputElement;
    const commentTextInput = document.getElementById('comment-text') as HTMLInputElement;
    const commentSubmitBtn = document.getElementById('comment-submit-btn') as HTMLButtonElement;
    const commentSubmitIcon = document.getElementById('comment-submit-icon');
    const commentSubmitSpinner = document.getElementById('comment-submit-spinner');

    (window as any).openCommentModal = async (postId: string) => {
        if (!commentModal || !commentModalContent || !commentsWrapper || !commentLoader) return;
        
        commentPostIdInput.value = postId;
        commentsWrapper.innerHTML = '';
        commentLoader.classList.remove('hidden');
        
        commentModal.classList.remove('hidden');
        commentModal.classList.add('flex');
        
        setTimeout(() => {
            commentModal.classList.remove('opacity-0');
            commentModalContent.classList.remove('translate-y-full');
        }, 10);

        if (!supabase) return;

        const { data, error } = await supabase
            .from('ootd_comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: false })
            .limit(30);

        commentLoader.classList.add('hidden');

        if (error) {
            commentsWrapper.innerHTML = `<p class="text-red-500 text-center text-sm">Gagal memuat komentar: ${error.message}</p>`;
            return;
        }

        if (data && data.length > 0) {
            data.forEach((c: any) => {
                const div = document.createElement('div');
                div.className = 'bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1';
                div.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-sm text-[#001D36]">${c.name}</span>
                        <span class="text-[10px] text-gray-400 font-mono">${new Date(c.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p class="text-sm text-gray-600 break-words">${c.text}</p>
                `;
                commentsWrapper.appendChild(div);
            });
        } else {
            commentsWrapper.innerHTML = `<p class="text-center text-gray-400 text-sm italic py-8">Belum ada komentar. Jadilah yang pertama!</p>`;
        }
    };

    (window as any).closeCommentModal = () => {
        if (!commentModal || !commentModalContent) return;
        
        commentModal.classList.add('opacity-0');
        commentModalContent.classList.add('translate-y-full');
        
        setTimeout(() => {
            commentModal.classList.add('hidden');
            commentModal.classList.remove('flex');
        }, 300);
    };

    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const postId = commentPostIdInput.value;
            const name = commentNameInput.value.trim();
            const text = commentTextInput.value.trim();

            if (!postId || !name || !text || !supabase) return;

            try {
                commentSubmitBtn.disabled = true;
                commentSubmitIcon?.classList.add('hidden');
                commentSubmitSpinner?.classList.remove('hidden');

                const { data, error } = await supabase
                    .from('ootd_comments')
                    .insert([{ post_id: postId, name, text }])
                    .select();

                if (error) throw error;

                commentTextInput.value = '';
                
                if (data && data[0] && commentsWrapper) {
                    const noCommentMsg = commentsWrapper.querySelector('.italic');
                    if (noCommentMsg) noCommentMsg.remove();

                    const div = document.createElement('div');
                    div.className = 'bg-blue-50 p-4 rounded-2xl shadow-sm border border-blue-100 flex flex-col gap-1';
                    div.innerHTML = `
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-sm text-[#0072CE]">${data[0].name}</span>
                            <span class="text-[10px] text-[#0072CE]/60 font-mono">Baru saja</span>
                        </div>
                        <p class="text-sm text-gray-700 break-words">${data[0].text}</p>
                    `;
                    commentsWrapper.prepend(div);
                    commentsWrapper.scrollTop = 0;
                }
            } catch (err: any) {
                alert(`Gagal mengirim komentar: ${err.message}`);
            } finally {
                commentSubmitBtn.disabled = false;
                commentSubmitIcon?.classList.remove('hidden');
                commentSubmitSpinner?.classList.add('hidden');
            }
        });
    }

    (window as any).likeOotd = async (id: string) => {
        if (!supabase) return;
        
        const likedPosts = JSON.parse(localStorage.getItem('jtk25_liked') || '[]');
        if (likedPosts.includes(id)) return;
    
        const countSpan = document.getElementById(`like-count-${id}`);
        if (countSpan) {
            let currentLikes = parseInt(countSpan.innerText);
            countSpan.innerText = (currentLikes + 1).toString();
            
            const btn = countSpan.parentElement!;
            btn.className = 'flex items-center gap-1.5 text-red-500 opacity-80 cursor-default';
            btn.onclick = null;
        }
    
        likedPosts.push(id);
        localStorage.setItem('jtk25_liked', JSON.stringify(likedPosts));
    
        try {
            const { data } = await supabase.from('ootd_posts').select('likes').eq('id', id).single();
            if (data) {
                await supabase.from('ootd_posts').update({ likes: data.likes + 1 }).eq('id', id);
            }
        } catch (err) {
            console.error("Gagal mengirim like", err);
        }
    };

    (window as any).deleteOotd = async (id: string, imageUrl: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus foto OOTD ini?")) return;
        
        if (supabase) {
            const { error } = await supabase.from('ootd_posts').delete().eq('id', id);
            if (error) {
                alert(`Gagal menghapus: ${error.message}`);
                return;
            }
            try {
                const fileName = imageUrl.split('/').pop();
                if (fileName) {
                    await supabase.storage.from('ootd_images').remove([`public/${fileName}`]);
                }
            } catch (e) {
                console.warn("Could not delete image file", e);
            }
    
            alert("Foto berhasil dihapus!");
            fetchOotdPosts();
        }
    };

    // Initialize fetch
    fetchOotdPosts();
    (window as any).fetchOotdPosts = fetchOotdPosts;
}
