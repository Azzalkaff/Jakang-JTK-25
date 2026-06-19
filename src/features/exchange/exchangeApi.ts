import { supabase } from '../../lib/supabase';
import { isAdmin, getMyExchanges, addMyExchange } from '../../lib/auth';

export function initExchangeFeature() {
    const excForm = document.getElementById('exchange-form') as HTMLFormElement;
    const excName = document.getElementById('exc-name') as HTMLInputElement;
    const excHave = document.getElementById('exc-have') as HTMLSelectElement;
    const excWant = document.getElementById('exc-want') as HTMLSelectElement;
    const excContact = document.getElementById('exc-contact') as HTMLInputElement;
    const excNotes = document.getElementById('exc-notes') as HTMLTextAreaElement;
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
            excList.innerHTML = `<p class="text-red-500 text-center py-4">Gagal memuat daftar: ${error.message}</p>`;
            return;
        }

        excList.innerHTML = '';
        if (data && data.length > 0) {
            const myExchanges = getMyExchanges();
            
            data.forEach((item: any) => {
                const isOwner = isAdmin || myExchanges.includes(item.id);
                const deleteBtnHtml = isOwner ? 
                    `<button onclick="window.deleteExchange('${item.id}')" class="bg-gray-200 hover:bg-red-500 hover:text-white text-gray-500 px-3 py-2 rounded-xl text-xs font-bold transition-colors ml-2" title="Tandai Selesai / Hapus">
                        <i class="fa-solid fa-trash"></i>
                    </button>` : '';

                const notesHtml = item.notes ? `<p class="text-sm text-gray-600 mt-2 italic break-words w-full">"${item.notes}"</p>` : '';

                const div = document.createElement('div');
                div.className = 'bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#0072CE] transition-colors';
                div.innerHTML = `
                    <div class="flex-1 w-full">
                        <p class="font-bold text-[#001D36] text-lg">${item.name}</p>
                        <div class="flex items-center gap-2 mt-1 flex-wrap">
                            <span class="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">Punya: ${item.have_size}</span>
                            <i class="fa-solid fa-arrow-right text-gray-400 text-xs"></i>
                            <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Cari: ${item.want_size}</span>
                        </div>
                        ${notesHtml}
                    </div>
                    <div class="flex shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                        <a href="https://wa.me/${item.contact.replace(/[^0-9]/g, '')}" target="_blank" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-colors flex-1 sm:flex-none justify-center">
                            <i class="fa-brands fa-whatsapp mr-2"></i> Hubungi
                        </a>
                        ${deleteBtnHtml}
                    </div>
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

            if (!supabase) {
                alert("Database tidak terhubung.");
                return;
            }

            try {
                excSubmitBtn.disabled = true;
                excSpinner?.classList.remove('hidden');

                const notesValue = excNotes && excNotes.value.trim() !== '' ? excNotes.value.trim() : null;

                const { data: insertData, error } = await supabase.from('size_exchanges').insert([{
                    name: excName.value.trim(),
                    have_size: excHave.value,
                    want_size: excWant.value,
                    contact: excContact.value.trim(),
                    notes: notesValue
                }]).select();

                if (error) throw error;
                
                if (insertData && insertData[0]) {
                    addMyExchange(insertData[0].id);
                }

                alert('Berhasil didaftarkan ke Daftar Tukar!');
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

    (window as any).deleteExchange = async (id: string) => {
        if (!confirm("Tandai selesai dan hapus dari daftar tukar?")) return;
        
        if (supabase) {
            const { error } = await supabase.from('size_exchanges').delete().eq('id', id);
            if (error) {
                alert(`Gagal menghapus: ${error.message}`);
                return;
            }
            alert("Proses tukar berhasil diselesaikan!");
            fetchExchanges();
        }
    };

    fetchExchanges();
    (window as any).fetchExchanges = fetchExchanges;
}
