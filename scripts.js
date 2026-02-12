let allData = [];
let map = null;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('links.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
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
    const isHull = item.group === 'HULL';
    
    let gridClasses = 'min-h-[280px]';
    
    if (isHull) {
        if (item.title === 'P84-LQ-ALL') {
            gridClasses = 'lg:col-start-1 lg:row-start-1 lg:col-span-1 min-h-[300px] hull-card connector-down';
        } else if (item.title === 'P84-AFT-ALL') {
            gridClasses = 'lg:col-start-1 lg:row-start-2 lg:col-span-1 min-h-[300px] hull-card connector-right';
        } else if (item.title === 'P84-MID-ALL') {
            gridClasses = 'lg:col-start-2 lg:row-start-2 lg:col-span-2 min-h-[300px] hull-card connector-right';
        } else if (item.title === 'P84-FWD-ALL') {
            gridClasses = 'lg:col-start-4 lg:row-start-2 lg:col-span-1 min-h-[300px] hull-card';
        } else {
            gridClasses = 'md:col-span-2 lg:col-span-2 min-h-[400px]';
        }
    }

    // Remove overflow-hidden for Hull cards with connectors so the connector can be visible
    const overflowClass = (isHull && gridClasses.includes('connector')) ? 'overflow-visible' : 'overflow-hidden';
    div.className = `model-card glass-card rounded-2xl ${overflowClass} group relative flex flex-col ${gridClasses}`;
    
    const imagePath = item.filename ? `images/${item.filename}` : `images/${item.image || 'Hull.png'}`;

    div.innerHTML = `
        <!-- Image Container -->
        <div class="relative ${isHull ? 'h-56' : 'h-48'} w-full overflow-hidden bg-slate-800 cursor-pointer rounded-t-2xl" onclick="openModal('${item.title}')">
            <img src="${imagePath}" alt="${item.title}" 
                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                 onerror="handleImageError(this)">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            
            <!-- Share Button -->
            <button onclick="handleShare(event, '${item.title}')" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-brand-500 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20">
                <i class="fa-solid fa-share-nodes text-xs"></i>
            </button>
        </div>

        <!-- Content -->
        <div class="p-6 flex flex-col flex-grow cursor-pointer" onclick="openModal('${item.title}')">
            <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold text-white group-hover:text-brand-400 transition-colors leading-tight">
                    ${item.title}
                </h3>
                <span class="text-brand-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </span>
            </div>
            
            <p class="text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">
                ${item.description || '3D visualization and technical information for the offshore module.'}
            </p>

            <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <div class="flex flex-col gap-1">
                    <span class="text-slate-500 uppercase tracking-wider">${item.group}</span>
                    <span class="text-slate-600 text-[9px] uppercase">${item.projects?.P84?.city || ''} / ${item.projects?.P85?.city || ''}</span>
                </div>
                <button onclick="handleView(event, '${item.title}')" class="px-2 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500 hover:text-white transition-colors duration-300">VIEW</button>
            </div>
        </div>

        <!-- Hover Glow Effect -->
        <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/10 blur-2xl rounded-full group-hover:bg-brand-500/20 transition-all duration-500 pointer-events-none"></div>
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

function openModal(title) {
    const item = allData.find(d => d.title === title);
    if (!item) return;

    modal.classList.remove('hidden');
    
    // Animate in
    setTimeout(() => {
        modalBackdrop.classList.add('modal-show-backdrop');
        modalPanel.classList.add('modal-show-panel');
    }, 10);

    modalTitle.innerText = item.title;
    
    const imagePath = item.filename ? `images/${item.filename}` : `images/${item.image || 'Hull.png'}`;
    const p84Loc = item.projects?.P84 ? `${item.projects.P84.city}, ${item.projects.P84.country}` : 'N/A';
    const p85Loc = item.projects?.P85 ? `${item.projects.P85.city}, ${item.projects.P85.country}` : 'N/A';

    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="aspect-video w-full bg-slate-900 rounded-xl border border-white/10 overflow-hidden relative shadow-inner group">
                <img src="${imagePath}" class="w-full h-full object-cover opacity-60" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="hidden absolute inset-0 items-center justify-center bg-slate-900/50">
                     <i class="fa-solid fa-cube text-6xl text-slate-800"></i>
                </div>
                
                <!-- 3D VIEWER READY OVERLAY -->
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
                    <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
                        3D Viewer Ready
                    </div>
                    <button onclick="window.open('${item.options?.[0]?.url || '#'}', '_blank')" class="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-2xl shadow-brand-500/40 hover:scale-110 active:scale-95 transition-all duration-300">
                        <i class="fa-solid fa-play text-xl ml-1"></i>
                    </button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span class="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Technical Description</span>
                    <p class="text-sm text-slate-300 leading-relaxed">
                        ${item.description || '3D visualization and technical information.'}
                        <span class="block mt-2 text-slate-500 italic">
                            Constructed at: ${p84Loc} (P84) / ${p85Loc} (P85)
                        </span>
                    </p>
                </div>
                <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span class="block text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Construction Sites</span>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3">
                            <div class="w-7 h-7 rounded bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20 text-[10px] font-bold">P84</div>
                            <div class="text-xs">
                                <span class="text-slate-500 block">Location</span>
                                <span class="text-white">${p84Loc}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-7 h-7 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">P85</div>
                            <div class="text-xs">
                                <span class="text-slate-500 block">Location</span>
                                <span class="text-white">${p85Loc}</span>
                            </div>
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
                </div>
            </div>
        </div>
    `;

    let buttonsHtml = '';
    if (item.options && item.options.length > 0) {
        item.options.forEach(opt => {
            buttonsHtml += `
                <a href="${opt.url}" target="_blank" class="inline-flex w-full justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-500 sm:ml-3 sm:w-auto transition-all active:scale-95 uppercase tracking-wide">
                    ${opt.label === 'Fusion 360' ? '<i class="fa-solid fa-play mr-2 mt-0.5"></i> Play 3D' : opt.label}
                </a>
            `;
        });
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

// TAB SWITCHING
function switchTab(tab) {
    const modelsView = document.getElementById('view-models');
    const sitesView = document.getElementById('view-sites');
    const tabModels = document.getElementById('tab-models');
    const tabSites = document.getElementById('tab-sites');

    if (tab === 'models') {
        modelsView.classList.remove('hidden');
        sitesView.classList.add('hidden');
        tabModels.className = "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 bg-brand-500 text-white shadow-lg";
        tabSites.className = "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5";
    } else {
        modelsView.classList.add('hidden');
        sitesView.classList.remove('hidden');
        tabSites.className = "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 bg-brand-500 text-white shadow-lg";
        tabModels.className = "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 text-slate-400 hover:text-white hover:bg-white/5";
        
        // Initialize map if not already done
        if (!map) {
            initMap();
        } else {
            // Force leaflet to recalculate size because container was hidden
            setTimeout(() => map.invalidateSize(), 100);
        }
    }
}

// MAP LOGIC
const CITY_COORDINATES = {
    'TUAS': [1.2944, 103.6358],
    'Angra': [-23.0067, -44.3189],
    'Aracruz': [-19.8203, -40.2733],
    'Batam': [1.1283, 104.0531],
    'Nantong': [31.9802, 120.8943],
    'Haiyang': [36.7767, 121.1594],
    'Yantai': [37.5333, 121.4000]
};

let currentMapGroup = 'ALL';

function initMap() {
    if (typeof L === 'undefined') {
        console.error('Leaflet not loaded');
        setTimeout(initMap, 500);
        return;
    }

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    document.getElementById('map-loader').style.opacity = '1';
    
    const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));

    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        zoomControl: false
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
        maxZoom: 8,
        noWrap: true,
        bounds: bounds
    }).addTo(map);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Create markers
    renderMarkers();

    setTimeout(() => {
        document.getElementById('map-loader').style.opacity = '0';
        map.invalidateSize();
    }, 500);
}

function renderMarkers() {
    // Clear existing markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const cityGroups = {};
    const seen = new Set();
    allData.forEach(item => {
        if (!item.projects) return;
        if (currentMapGroup !== 'ALL' && item.group !== currentMapGroup) return;
        
        ['P84', 'P85'].forEach(projKey => {
            const city = item.projects[projKey]?.city;
            const country = item.projects[projKey]?.country;
            if (city && CITY_COORDINATES[city]) {
                if (!cityGroups[city]) cityGroups[city] = { name: city, country: country, modules: [] };

                const uniqueKey = `${city}|${item.title}|${projKey}`;
                if (!seen.has(uniqueKey)) {
                    seen.add(uniqueKey);
                    cityGroups[city].modules.push({ ...item, project: projKey });
                }
            }
        });
    });

    Object.keys(cityGroups).forEach(cityName => {
        const group = cityGroups[cityName];
        const coords = CITY_COORDINATES[cityName];
        
        const isHullSite = group.modules.some(m => m.group === 'HULL');
        
        // Custom Marker Style - Black and Larger
        const markerHtml = `
            <div class="relative flex items-center justify-center">
                <div class="w-7 h-7 rounded-full bg-black border-2 border-white shadow-2xl flex items-center justify-center">
                    <i class="fa-solid fa-location-dot text-white text-[10px]"></i>
                </div>
                ${isHullSite ? '<div class="absolute -inset-1 rounded-full border-2 border-black animate-ping opacity-40"></div>' : ''}
            </div>
        `;
        
        const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-marker',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
        
        const marker = L.marker(coords, { icon: customIcon }).addTo(map);
        marker.on('click', () => showSiteInfo(group));
        markers.push(marker);
    });
}

function filterMap(group) {
    currentMapGroup = group;
    
    // Update UI buttons
    document.querySelectorAll('.map-filter-btn').forEach(btn => {
        if (btn.dataset.group === group) {
            btn.classList.add('bg-brand-500', 'text-white');
            btn.classList.remove('text-slate-400');
        } else {
            btn.classList.remove('bg-brand-500', 'text-white');
            btn.classList.add('text-slate-400');
        }
    });

    renderMarkers();
    
    // Reset site info
    const siteInfo = document.getElementById('site-info');
    siteInfo.innerHTML = `
        <div class="text-center py-10 text-slate-500 italic">
            <i class="fa-solid fa-map-pin text-3xl mb-3 opacity-20 block"></i>
            Click on a map marker
        </div>
    `;
}

function showSiteInfo(group) {
    const siteInfo = document.getElementById('site-info');
    
    // Separate modules by group
    const topsideModules = group.modules.filter(m => m.group === 'TOPSIDE').sort((a,b) => a.title.localeCompare(b.title));
    const hullModules = group.modules.filter(m => m.group === 'HULL').sort((a,b) => a.title.localeCompare(b.title));
    
    let modulesHtml = '';
    
    if (hullModules.length > 0) {
        modulesHtml += `<h5 class="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-4 mb-2">Hull Scope</h5>`;
        hullModules.forEach(m => {
            modulesHtml += `
                <div class="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer group mb-3 shadow-lg shadow-amber-500/5" onclick="openModal('${m.title}')">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-base font-bold text-white group-hover:text-amber-400">${m.title}</span>
                        <div class="flex gap-1">
                             <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">P84</span>
                             <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">P85</span>
                        </div>
                    </div>
                    <p class="text-xs text-slate-300 mb-2 leading-relaxed">${m.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] uppercase tracking-tighter text-amber-500/70 font-mono font-bold">Large Module Access</span>
                        <span class="text-[10px] text-amber-400 font-bold">OPEN HUB <i class="fa-solid fa-chevron-right ml-1"></i></span>
                    </div>
                </div>
            `;
        });
    }

    if (topsideModules.length > 0) {
        modulesHtml += `<h5 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6 mb-2">Topside Modules</h5>`;
        topsideModules.forEach(m => {
            modulesHtml += `
                <div class="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-brand-500/50 transition-colors cursor-pointer group mb-2" onclick="openModal('${m.title}')">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-bold text-white group-hover:text-brand-400">${m.title}</span>
                        <span class="text-[9px] px-1.5 py-0.5 rounded ${m.project === 'P84' ? 'bg-brand-500/20 text-brand-400' : 'bg-indigo-500/20 text-indigo-400'} font-bold">${m.project}</span>
                    </div>
                    <span class="text-[10px] text-slate-500 line-clamp-1">${m.description}</span>
                </div>
            `;
        });
    }

    siteInfo.innerHTML = `
        <div class="animate-fade-in-up">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                    <i class="fa-solid fa-industry"></i>
                </div>
                <div>
                    <h4 class="text-lg font-bold text-white leading-none">${group.name}</h4>
                    <span class="text-xs text-slate-500 uppercase tracking-widest">${group.country}</span>
                </div>
            </div>
            
            <div class="space-y-2">
                <h5 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Allocated Modules</h5>
                <div class="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    ${modulesHtml}
                </div>
            </div>
        </div>
    `;
    
    map.flyTo(CITY_COORDINATES[group.name], 5);
}

function handleView(event, title) {
    event.stopPropagation();
    openModal(title);
}

// SHARE LOGIC
function handleShare(event, title) {
    event.stopPropagation();
    const shareUrl = window.location.origin + window.location.pathname + '#' + encodeURIComponent(title);
    
    if (navigator.share) {
        navigator.share({
            title: '3D Model - ' + title,
            url: shareUrl
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}
