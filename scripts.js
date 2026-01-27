document.addEventListener('DOMContentLoaded', () => {
    fetch('links.json')
        .then(response => response.json())
        .then(data => {
            renderSection(data, 'TOPSIDE', 'topside-section');
            renderSection(data, 'HULL', 'hull-section');
        })
        .catch(error => console.error('Error loading links:', error));
});

function renderSection(data, groupName, containerId) {
    const container = document.getElementById(containerId);
    const wrapper = document.getElementById(`${containerId}-wrapper`);
    const filteredData = data.filter(item => item.group === groupName);

    if (filteredData.length > 0) {
        wrapper.classList.remove('hidden');
        filteredData.forEach(item => {
            const card = createCard(item);
            container.appendChild(card);
        });
    }
}

function createCard(item) {
    const div = document.createElement('div');
    // Larger cards for HULL group
    const isHull = item.group === 'HULL';
    
    div.className = `model-card glass-card rounded-2xl overflow-hidden group cursor-pointer relative flex flex-col ${isHull ? 'md:col-span-1 lg:col-span-1 min-h-[320px]' : 'min-h-[280px]'}`;
    
    div.onclick = () => openModal(item);

    const imagePath = item.filename ? `images/${item.filename}` : `images/${item.image || 'Hull.png'}`;

    div.innerHTML = `
        <!-- Image Container -->
        <div class="relative h-48 w-full overflow-hidden bg-slate-800">
            <img src="${imagePath}" alt="${item.title}" 
                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                 onerror="handleImageError(this)">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>

        <!-- Content -->
        <div class="p-6 flex flex-col flex-grow">
            <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold text-white group-hover:text-brand-400 transition-colors leading-tight">
                    ${item.title}
                </h3>
                <span class="text-brand-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </span>
            </div>
            
            <p class="text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">
                ${item.description || 'View the 3D representation and technical details for this model.'}
            </p>

            <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span class="text-slate-500 uppercase tracking-wider">${item.group}</span>
                <span class="px-2 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">VIEW MODEL</span>
            </div>
        </div>

        <!-- Hover Glow Effect -->
        <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/10 blur-2xl rounded-full group-hover:bg-brand-500/20 transition-all duration-500"></div>
    `;

    return div;
}

// MODAL LOGIC
const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalPanel = document.getElementById('modal-panel');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalFooter = document.getElementById('modal-footer');

function openModal(item) {
    modal.classList.remove('hidden');
    
    // Animate in
    setTimeout(() => {
        modalBackdrop.classList.add('modal-show-backdrop');
        modalPanel.classList.add('modal-show-panel');
    }, 10);

    modalTitle.innerText = item.title;
    
    const imagePath = item.filename ? `images/${item.filename}` : `images/${item.image || 'Hull.png'}`;

    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="aspect-video w-full bg-slate-900 rounded-xl border border-white/10 overflow-hidden relative group shadow-inner">
                <img src="${imagePath}" class="w-full h-full object-cover opacity-60" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="hidden absolute inset-0 items-center justify-center bg-slate-900/50">
                     <i class="fa-solid fa-cube text-6xl text-slate-800"></i>
                </div>
                
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                    <div class="z-10 text-center animate-pulse-slow">
                        <div class="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-4 border border-brand-500/30">
                            <i class="fa-solid fa-play text-brand-400 text-xl ml-1"></i>
                        </div>
                        <span class="text-white font-display font-medium tracking-wide">3D VIEWER READY</span>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span class="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Technical Description</span>
                    <p class="text-sm text-slate-300 leading-relaxed">${item.description || '3D visualization and structural technical information for the offshore module.'}</p>
                </div>
                <div class="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-center">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <i class="fa-solid fa-shield-halved text-xs"></i>
                        </div>
                        <div>
                            <span class="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Security Status</span>
                            <span class="text-xs text-emerald-400 font-medium">Verified & Encrypted</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20">
                            <i class="fa-solid fa-clock-rotate-left text-xs"></i>
                        </div>
                        <div>
                            <span class="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Last Update</span>
                            <span class="text-xs text-slate-300 font-medium">May 2024</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-4">
                <i class="fa-solid fa-circle-info text-amber-500 mt-1"></i>
                <div>
                    <h4 class="text-sm font-bold text-amber-200 mb-1 font-display">Information & Access</h4>
                    <p class="text-xs text-amber-200/70 leading-relaxed mb-1">
                        ${item.disclaimer || 'Access may require specialized software or active platform license.'}
                    </p>
                    <p class="text-[10px] text-amber-200/40 leading-relaxed uppercase tracking-tighter">
                        Best viewed in Chrome/Edge with Hardware Acceleration enabled.
                    </p>
                </div>
            </div>
        </div>
    `;

    // Update footer buttons - Support for multiple options
    let buttonsHtml = '';
    if (item.options && item.options.length > 0) {
        item.options.forEach(opt => {
            buttonsHtml += `
                <a href="${opt.url}" target="_blank" class="inline-flex w-full justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 sm:ml-3 sm:w-auto transition-all active:scale-95 uppercase tracking-wide">
                    ${opt.label}
                </a>
            `;
        });
    } else if (item.url) {
        buttonsHtml = `
            <a href="${item.url}" target="_blank" class="inline-flex w-full justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 sm:ml-3 sm:w-auto transition-all active:scale-95 uppercase tracking-wide">
                Access Model
            </a>
        `;
    }
    
    modalFooter.innerHTML = `
        <div class="flex flex-col sm:flex-row-reverse w-full gap-2 sm:gap-0">
            ${buttonsHtml}
            <button type="button" onclick="closeModal()" class="mt-3 inline-flex w-full justify-center rounded-lg bg-white/5 px-6 py-2.5 text-sm font-bold text-slate-300 shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10 sm:mt-0 sm:w-auto transition-all uppercase tracking-wide">
                Close
            </button>
        </div>
    `;
}

function closeModal() {
    modalBackdrop.classList.remove('modal-show-backdrop');
    modalPanel.classList.remove('modal-show-panel');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Close on clicking backdrop
modalBackdrop.addEventListener('click', closeModal);

function handleImageError(img) {
    const container = img.parentElement;
    container.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-800/50">
            <i class="fa-solid fa-cube text-4xl mb-2"></i>
            <span class="text-[10px] uppercase tracking-widest opacity-50 font-bold">Preview Unavailable</span>
        </div>
    `;
}
