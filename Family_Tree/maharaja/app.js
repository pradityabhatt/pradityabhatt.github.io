// ======================================================
// FAMILY TREE APP — Enhanced Logic
// ======================================================

// --- Custom Dialog System ---
const dialogOverlay = document.getElementById('dialog-overlay');
const dialogContent = document.getElementById('dialog-content');
const btnDialogOk = document.getElementById('btn-dialog-ok');
const btnDialogCancel = document.getElementById('btn-dialog-cancel');

function showMessage(msg) {
    dialogContent.innerText = msg;
    btnDialogCancel.style.display = 'none';
    btnDialogOk.className = 'btn-ok';
    btnDialogOk.innerText = "OK";
    btnDialogOk.onclick = () => { dialogOverlay.style.display = 'none'; };
    dialogOverlay.style.display = 'flex';
}

function showConfirm(msg, onConfirm) {
    dialogContent.innerText = msg;
    btnDialogCancel.style.display = 'inline-block';
    btnDialogCancel.onclick = () => { dialogOverlay.style.display = 'none'; };
    btnDialogOk.className = 'btn-confirm';
    btnDialogOk.innerText = "Yes";
    btnDialogOk.onclick = () => {
        dialogOverlay.style.display = 'none';
        if (onConfirm) onConfirm();
    };
    dialogOverlay.style.display = 'flex';
}

// --- Toast System ---
function showToast(msg, duration = 2500) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// --- Theme System ---
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('btn-theme');
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        btn.innerHTML = '<span class="btn-icon">☀️</span><span class="btn-label">Light</span>';
    } else {
        body.setAttribute('data-theme', 'light');
        btn.innerHTML = '<span class="btn-icon">🌙</span><span class="btn-label">Dark</span>';
    }
    renderTree();
    updateMinimap();
}

// --- Data Structure ---
function createInitialData() {
    const storedData = localStorage.getItem('familyTreeData_v1');
    if (storedData) {
        try { return JSON.parse(storedData); }
        catch (e) { console.error("Error parsing saved data", e); }
    }
    if (typeof permanentTreeData !== 'undefined' && permanentTreeData) {
        return permanentTreeData;
    }
    return {
        id: crypto.randomUUID(),
        name: "Root Ancestor", gender: "male",
        generation: 1, spouse: null, children: []
    };
}

let treeData = createInitialData();
let selectedNodeId = null;

function saveData() {
    localStorage.setItem('familyTreeData_v1', JSON.stringify(treeData));
}

function clearData() {
    if (confirm("This will clear all tree data and start fresh. Are you sure?")) {
        const blankTree = {
            id: crypto.randomUUID(),
            name: "Root Ancestor", gender: "male",
            generation: 1, spouse: null, children: []
        };
        localStorage.setItem('familyTreeData_v1', JSON.stringify(blankTree));
        location.reload();
    }
}

// --- Export Logic ---
function showExportModal() {
    const modal = document.getElementById('export-modal-overlay');
    const textarea = document.getElementById('export-text');
    textarea.value = JSON.stringify(treeData, null, 2);
    modal.style.display = 'flex';
}
function closeExportModal() {
    document.getElementById('export-modal-overlay').style.display = 'none';
}
function copyToClipboard() {
    const textarea = document.getElementById('export-text');
    textarea.select();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textarea.value).then(() => {
            showToast("✓ Code copied to clipboard!");
        });
    } else {
        document.execCommand('copy');
        showToast("✓ Code copied to clipboard!");
    }
}

// --- Viewport State ---
let state = {
    scale: 1, panning: false,
    startX: 0, startY: 0,
    translateX: window.innerWidth / 2 - 75,
    translateY: 100
};
const NODE_WIDTH = 150;
const GAP_X = 50;
const GAP_Y = 120; // Reduced back a bit as requested

// --- Layout & Rendering ---
function calculateLayout(node) {
    let width = 0;
    if (node.children.length > 0) {
        node.children.forEach(child => child.width = calculateLayout(child));
        width = node.children.reduce((acc, c) => acc + c.width, 0) + (node.children.length - 1) * GAP_X;
    } else { width = NODE_WIDTH; }
    if (node.spouse) width = Math.max(width, NODE_WIDTH * 2 + 20);
    return width;
}

function assignCoordinates(node, x, y) {
    node.x = x; node.y = y;
    let currentX = x;
    let childrenTotalWidth = node.children.reduce((acc, c) => acc + c.width, 0) + Math.max(0, node.children.length - 1) * GAP_X;
    if (childrenTotalWidth < node.width) currentX += (node.width - childrenTotalWidth) / 2;
    node.children.forEach(child => {
        assignCoordinates(child, currentX, y + GAP_Y);
        currentX += child.width + GAP_X;
    });
}

function renderTree() {
    const container = document.getElementById('node-layer');
    const svg = document.getElementById('svg-layer');
    container.innerHTML = ''; svg.innerHTML = '';

    const lineColor = getComputedStyle(document.body).getPropertyValue('--line-color').trim();
    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim();

    // Add SVG gradient definition
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", "lineGrad");
    grad.setAttribute("gradientUnits", "userSpaceOnUse");
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%"); stop1.setAttribute("stop-color", primaryColor); stop1.setAttribute("stop-opacity", "0.6");
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%"); stop2.setAttribute("stop-color", primaryColor); stop2.setAttribute("stop-opacity", "0.25");
    grad.appendChild(stop1); grad.appendChild(stop2); defs.appendChild(grad); svg.appendChild(defs);

    treeData.width = calculateLayout(treeData);
    assignCoordinates(treeData, 0, 0);

    let animDelay = 0;
    function drawNode(node) {
        const el = document.createElement('div');
        el.className = 'node-wrapper';
        el.style.left = `${node.x}px`; el.style.top = `${node.y}px`; el.style.width = `${node.width}px`;

        const isHighlighted = searchMatches.has(node.id);
        const hlClass = isHighlighted ? ' search-highlight' : '';

        let content = `<div class="couple-wrapper">
            <div class="person-card ${node.gender}${hlClass}" data-node-id="${node.id}" onclick="openModal('${node.id}')" style="animation-delay:${animDelay * 30}ms">
                <span class="gen-badge">Gen ${node.generation}</span>
                <span class="name">${node.name}</span>
                ${!node.spouse ? '<span class="title">Single</span>' : ''}
            </div>`;

        if (node.spouse) {
            const spouseHl = searchMatches.has(node.id + '_spouse') ? ' search-highlight' : '';
            content += `<div class="person-card ${node.spouse.gender === 'male' ? 'male' : 'female'}${spouseHl}" data-node-id="${node.id}_spouse" onclick="openModal('${node.id}', true)" style="animation-delay:${animDelay * 30 + 15}ms">
                <span class="gen-badge">Gen ${node.generation}</span>
                <span class="name">${node.spouse.name}</span>
                <span class="title">Spouse</span>
            </div>`;
        }
        content += `</div>`;
        animDelay++;
        el.innerHTML = content;
        container.appendChild(el);

        if (node.children.length > 0) {
            const startX = node.x + node.width / 2;
            const startY = node.y + 75; // Bottom of parent card approx
            const midY = node.y + 98; // Midpoint in the verical gap
            node.children.forEach((child, i) => {
                const childCenterX = child.x + child.width / 2;
                // Orthogonal straight connector
                const path = `M ${startX} ${startY} V ${midY} H ${childCenterX} V ${child.y}`;
                const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
                pathEl.setAttribute("d", path);
                pathEl.setAttribute("stroke", "url(#lineGrad)");
                pathEl.setAttribute("stroke-width", "2");
                pathEl.setAttribute("fill", "none");
                // No stroke-dasharray animation to avoid disappearing line segments
                svg.appendChild(pathEl);

                // Endpoint dot
                const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute("cx", childCenterX);
                dot.setAttribute("cy", child.y);
                dot.setAttribute("r", "3");
                dot.setAttribute("fill", primaryColor);
                dot.setAttribute("opacity", "0.4");
                svg.appendChild(dot);
            });
        }
        node.children.forEach(drawNode);
    }
    drawNode(treeData);

    // Add draw-line animation style if not already present
    if (!document.getElementById('draw-line-style')) {
        const style = document.createElement('style');
        style.id = 'draw-line-style';
        style.textContent = `@keyframes drawLine { to { stroke-dashoffset: 0; } }`;
        document.head.appendChild(style);
    }

    const treeW = treeData.width;
    const treeH = 15 * GAP_Y + 200;
    svg.setAttribute('width', Math.max(treeW, window.innerWidth));
    svg.setAttribute('height', treeH);
    container.style.width = `${Math.max(treeW, window.innerWidth)}px`;
    container.style.height = `${treeH}px`;

    setTimeout(updateMinimap, 100);
}

// --- Data Helpers ---
function findNode(id, node = treeData) {
    if (node.id === id) return node;
    for (let child of node.children) {
        let found = findNode(id, child);
        if (found) return found;
    }
    return null;
}
function findParent(id, node = treeData) {
    for (let child of node.children) {
        if (child.id === id) return node;
        let found = findParent(id, child);
        if (found) return found;
    }
    return null;
}

// --- Modal & Action Logic ---
let currentMode = 'edit';
let isEditingSpouse = false;

function openModal(id, editSpouse = false) {
    selectedNodeId = id; isEditingSpouse = editSpouse; currentMode = 'edit';
    const node = findNode(id); if (!node) return;
    const modal = document.getElementById('modal-overlay');
    const nameInput = document.getElementById('input-name');
    const title = document.getElementById('modal-title');
    const spouseBtn = document.getElementById('btn-add-spouse');
    const deleteBtn = document.getElementById('btn-delete');
    const genderGroup = document.getElementById('gender-group');
    const familyActions = document.getElementById('family-actions');
    const saveBtn = document.getElementById('btn-save');

    genderGroup.style.display = 'none';
    familyActions.style.display = 'block';
    saveBtn.innerText = "Save Name";

    if (editSpouse) {
        title.innerText = "Edit Spouse";
        nameInput.value = node.spouse.name;
        spouseBtn.style.display = 'none';
        deleteBtn.innerText = "Remove Spouse";
    } else {
        title.innerText = "Edit Member";
        nameInput.value = node.name;
        spouseBtn.style.display = node.spouse ? 'none' : 'inline-block';
        deleteBtn.innerText = "Delete Member";
    }
    modal.style.display = 'flex';
    setTimeout(() => nameInput.focus(), 100);
}

function closeModal() { document.getElementById('modal-overlay').style.display = 'none'; }

function prepareAddChild() {
    currentMode = 'add-child';
    document.getElementById('modal-title').innerText = "Add New Child";
    document.getElementById('input-name').value = "";
    document.getElementById('gender-group').style.display = 'block';
    document.getElementById('family-actions').style.display = 'none';
    document.getElementById('btn-save').innerText = "Add Child";
    document.getElementById('input-gender').value = 'male';
}

function prepareAddSpouse() {
    const node = findNode(selectedNodeId);
    if (node.spouse) { showMessage("This member already has a spouse."); return; }
    currentMode = 'add-spouse';
    document.getElementById('modal-title').innerText = "Add Spouse";
    document.getElementById('input-name').value = "";
    document.getElementById('gender-group').style.display = 'block';
    document.getElementById('family-actions').style.display = 'none';
    document.getElementById('btn-save').innerText = "Add Spouse";
    document.getElementById('input-gender').value = (node.gender === 'male' ? 'female' : 'male');
}

function submitForm() {
    const name = document.getElementById('input-name').value;
    if (!name.trim()) { showMessage("Name is required"); return; }
    const gender = document.getElementById('input-gender').value;
    const node = findNode(selectedNodeId);

    if (currentMode === 'edit') {
        if (isEditingSpouse) node.spouse.name = name;
        else node.name = name;
    }
    else if (currentMode === 'add-child') {
        node.children.push({
            id: crypto.randomUUID(), name: name, gender: gender,
            generation: node.generation + 1, spouse: null, children: []
        });
    }
    else if (currentMode === 'add-spouse') {
        node.spouse = { name: name, gender: gender };
    }
    saveData(); renderTree(); closeModal();
}

function tryDeleteNode() {
    if (isEditingSpouse) {
        showConfirm("Remove this spouse?", () => {
            const node = findNode(selectedNodeId);
            if (node) { node.spouse = null; saveData(); renderTree(); closeModal(); }
        });
        return;
    }
    if (selectedNodeId === treeData.id) { showMessage("Cannot delete the root ancestor!"); return; }
    showConfirm("Are you sure? This will delete this person AND all their descendants.", () => {
        const parent = findParent(selectedNodeId);
        if (parent) {
            parent.children = parent.children.filter(c => c.id !== selectedNodeId);
            saveData(); renderTree(); closeModal();
        }
    });
}

// --- Search System ---
let searchMatches = new Set();
let searchTimeout = null;

function performSearch(query) {
    searchMatches.clear();
    if (!query.trim()) { renderTree(); return; }
    const q = query.toLowerCase();
    function searchNode(node) {
        if (node.name.toLowerCase().includes(q)) searchMatches.add(node.id);
        if (node.spouse && node.spouse.name.toLowerCase().includes(q)) {
            searchMatches.add(node.id + '_spouse');
        }
        node.children.forEach(searchNode);
    }
    searchNode(treeData);
    renderTree();

    // Auto-pan to first match
    if (searchMatches.size > 0) {
        const firstId = [...searchMatches][0].replace('_spouse', '');
        const node = findNode(firstId);
        if (node) {
            const vw = window.innerWidth / 2;
            const vh = window.innerHeight / 2;
            state.translateX = vw - (node.x + node.width / 2) * state.scale;
            state.translateY = vh - node.y * state.scale;
            updateTransform();
        }
        showToast(`Found ${searchMatches.size} match${searchMatches.size > 1 ? 'es' : ''}`);
    } else {
        showToast("No matches found");
    }
}

function onSearchInput(e) {
    const val = e.target.value;
    const clearBtn = document.getElementById('search-clear');
    clearBtn.style.display = val ? 'block' : 'none';
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(val), 300);
}

function clearSearch() {
    const input = document.getElementById('search-input');
    input.value = '';
    document.getElementById('search-clear').style.display = 'none';
    searchMatches.clear();
    renderTree();
}

// --- Pan/Zoom ---
const viewport = document.getElementById('viewport');
const treeContainer = document.getElementById('tree-container');

function updateTransform() {
    treeContainer.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
    updateMinimap();
}

// Mouse Events
viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.person-card')) return;
    state.panning = true;
    state.startX = e.clientX - state.translateX;
    state.startY = e.clientY - state.translateY;
    viewport.style.cursor = 'grabbing';
});
window.addEventListener('mousemove', (e) => {
    if (!state.panning) return;
    e.preventDefault();
    state.translateX = e.clientX - state.startX;
    state.translateY = e.clientY - state.startY;
    updateTransform();
});
window.addEventListener('mouseup', () => { state.panning = false; viewport.style.cursor = 'grab'; });

// Scroll wheel zoom
viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    const newScale = Math.max(0.1, Math.min(3, state.scale + delta));
    // Zoom toward cursor
    const rect = viewport.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const ratio = newScale / state.scale;
    state.translateX = mx - (mx - state.translateX) * ratio;
    state.translateY = my - (my - state.translateY) * ratio;
    state.scale = newScale;
    updateTransform();
}, { passive: false });

// Touch Events
let lastTouchDist = null;
viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        state.panning = true;
        state.startX = e.touches[0].clientX - state.translateX;
        state.startY = e.touches[0].clientY - state.translateY;
    } else if (e.touches.length === 2) {
        state.panning = false;
        lastTouchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && lastTouchDist !== null) {
        e.preventDefault();
        const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = dist / lastTouchDist;
        state.scale = Math.max(0.1, Math.min(3, state.scale * scale));
        lastTouchDist = dist;
        updateTransform();
        return;
    }
    if (!state.panning || e.touches.length !== 1) return;
    e.preventDefault();
    state.translateX = e.touches[0].clientX - state.startX;
    state.translateY = e.touches[0].clientY - state.startY;
    updateTransform();
}, { passive: false });

window.addEventListener('touchend', (e) => {
    state.panning = false;
    if (e.touches.length < 2) lastTouchDist = null;
});

function zoomIn() { state.scale = Math.min(3, state.scale + 0.1); updateTransform(); }
function zoomOut() { state.scale = Math.max(0.1, state.scale - 0.1); updateTransform(); }
function resetView() {
    state.scale = 1;
    state.translateX = window.innerWidth / 2 - (treeData.width / 2);
    state.translateY = 100;
    updateTransform();
}

// --- Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'Escape') {
        closeModal();
        closeExportModal();
        dialogOverlay.style.display = 'none';
    }
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-') zoomOut();
    if (e.key === 'r' || e.key === 'R') resetView();
    if (e.key === '/' || (e.ctrlKey && e.key === 'f')) {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
});

// --- Sidebar Toggle ---
function toggleSidebar() {
    const pane = document.getElementById('info-pane');
    const btn = document.getElementById('sidebar-toggle');
    pane.classList.toggle('collapsed');
    btn.classList.toggle('shifted');
    btn.innerHTML = pane.classList.contains('collapsed') ? '›' : '‹';
}

// --- Minimap ---
let minimapVisible = false;

function toggleMinimap() {
    minimapVisible = !minimapVisible;
    const container = document.getElementById('minimap-container');
    const btn = document.getElementById('minimap-toggle');
    container.classList.toggle('visible', minimapVisible);
    btn.classList.toggle('active', minimapVisible);
    if (minimapVisible) updateMinimap();
}

function updateMinimap() {
    if (!minimapVisible) return;
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const mmW = canvas.width;
    const mmH = canvas.height;

    ctx.clearRect(0, 0, mmW, mmH);

    const treeW = treeData.width || 1;
    const treeH = 15 * GAP_Y + 200;
    const scaleX = mmW / treeW;
    const scaleY = mmH / treeH;
    const s = Math.min(scaleX, scaleY) * 0.85;

    const offX = (mmW - treeW * s) / 2;
    const offY = (mmH - treeH * s) / 2;

    function drawDot(node) {
        const cx = offX + (node.x + node.width / 2) * s;
        const cy = offY + node.y * s;
        ctx.fillStyle = node.gender === 'female' ? '#e84393' : '#5dade2';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Draw lines to children
        node.children.forEach(child => {
            const ccx = offX + (child.x + child.width / 2) * s;
            const ccy = offY + child.y * s;
            ctx.strokeStyle = 'rgba(93,173,226,0.25)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(cx, cy); ctx.lineTo(ccx, ccy);
            ctx.stroke();
            drawDot(child);
        });
    }
    drawDot(treeData);

    // Viewport rectangle
    const vRect = document.getElementById('minimap-viewport');
    const vpW = window.innerWidth / state.scale;
    const vpH = window.innerHeight / state.scale;
    const vpX = -state.translateX / state.scale;
    const vpY = -state.translateY / state.scale;

    vRect.style.left = `${offX + vpX * s}px`;
    vRect.style.top = `${offY + vpY * s}px`;
    vRect.style.width = `${vpW * s}px`;
    vRect.style.height = `${vpH * s}px`;
}

// --- Minimap Interaction ---
function panToMinimapPoint(e) {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas || !minimapVisible) return;
    const rect = canvas.getBoundingClientRect();
    const mmW = canvas.width;
    const mmH = canvas.height;

    // Coordinates relative to minimap
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const treeW = treeData.width || 1;
    const treeH = 15 * GAP_Y + 200;
    const scaleX = mmW / treeW;
    const scaleY = mmH / treeH;
    const s = Math.min(scaleX, scaleY) * 0.85;

    const offX = (mmW - treeW * s) / 2;
    const offY = (mmH - treeH * s) / 2;

    const targetTreeX = (mx - offX) / s;
    const targetTreeY = (my - offY) / s;

    state.translateX = window.innerWidth / 2 - targetTreeX * state.scale;
    state.translateY = window.innerHeight / 2 - targetTreeY * state.scale;
    updateTransform();
}

const minimapEl = document.getElementById('minimap');
let isMinimapPanning = false;

minimapEl.addEventListener('mousedown', (e) => {
    isMinimapPanning = true;
    panToMinimapPoint(e);
});
window.addEventListener('mousemove', (e) => {
    if (isMinimapPanning) panToMinimapPoint(e);
});
window.addEventListener('mouseup', () => { isMinimapPanning = false; });

minimapEl.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isMinimapPanning = true;
        panToMinimapPoint(e.touches[0]);
    }
}, { passive: false });
window.addEventListener('touchmove', (e) => {
    if (isMinimapPanning && e.touches.length === 1) {
        panToMinimapPoint(e.touches[0]);
    }
}, { passive: false });
window.addEventListener('touchend', () => { isMinimapPanning = false; });

// --- Init ---
document.getElementById('modal-overlay').addEventListener('click', (e) => { if (e.target.id === 'modal-overlay') closeModal(); });
document.getElementById('export-modal-overlay').addEventListener('click', (e) => { if (e.target.id === 'export-modal-overlay') closeExportModal(); });

renderTree();
setTimeout(() => {
    state.translateX = window.innerWidth / 2 - (treeData.width / 2);
    updateTransform();
}, 100);

// Collapsibles
const coll = document.getElementsByClassName("collapsible");
for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.maxHeight) { content.style.maxHeight = null; }
        else { content.style.maxHeight = (content.scrollHeight + 15) + "px"; }
    });
}

// Window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => { renderTree(); updateMinimap(); }, 250);
});
