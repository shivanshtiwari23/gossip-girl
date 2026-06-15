const API = 'https://gossip-girl-api-production.up.railway.app';
let currentPage = 0;
let isLoading = false;
let hasMore = true;

// --- Load party feed ---
async function loadParties() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
        const res = await fetch(`${API}/posts/feed?page=${currentPage}`, {
            headers: { 'X-Sort': 'new' }
        });
        const data = await res.json();

        const loading = document.getElementById('partyLoading');
        if (loading) loading.remove();

        const partyPosts = data.content.filter(p => p.postType === 'PARTY');

        if (partyPosts.length === 0 && currentPage === 0) {
            document.getElementById('partyCards').innerHTML = `
                <div class="feed-empty">
                    <p>no parties yet.</p>
                    <span>be the first to host. xoxo</span>
                </div>`;
            hasMore = false;
            return;
        }

        partyPosts.forEach(post => {
            document.getElementById('partyCards').appendChild(createPartyCard(post));
        });

        hasMore = !data.last;
        currentPage++;
    } catch (err) {
        console.error(err);
        const loading = document.getElementById('partyLoading');
        if (loading) loading.textContent = 'something went wrong. xoxo';
    } finally {
        isLoading = false;
    }
}

function createPartyCard(post) {
    const card = document.createElement('div');
    card.className = 'party-card';

    const time = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const meta = post.gossipText ? parsePartyMeta(post.gossipText) : {};

    card.innerHTML = `
        <div class="party-card-header">
            <span class="party-card-number">party #${post.id}</span>
            <span class="party-card-date">${time}</span>
        </div>
        ${post.photoUrl ? `<img src="${post.photoUrl}" alt="${escapeHtml(post.headline)}" loading="lazy" />` : ''}
        <div class="party-card-body">
            <div class="party-card-headline">${escapeHtml(post.headline)}</div>
            <div class="party-card-text">${escapeHtml(meta.text || post.gossipText)}</div>
            <div class="party-card-meta">
                ${meta.location ? `📍 ${escapeHtml(meta.location)}` : ''}
                ${meta.date ? `📅 ${escapeHtml(meta.date)}` : ''}
                ${meta.time ? `🕐 ${escapeHtml(meta.time)}` : ''}
            </div>
        </div>
        <div class="party-card-footer" onclick="window.location.href='post.html?id=${post.id}'">
            💬 ${post.commentCount} comment${post.commentCount !== 1 ? 's' : ''}
        </div>
    `;

    return card;
}

function parsePartyMeta(text) {
    const lines = text.split('\n');
    const meta = {};
    const textLines = [];

    lines.forEach(line => {
        if (line.startsWith('LOCATION:')) meta.location = line.replace('LOCATION:', '').trim();
        else if (line.startsWith('DATE:')) meta.date = line.replace('DATE:', '').trim();
        else if (line.startsWith('TIME:')) meta.time = line.replace('TIME:', '').trim();
        else textLines.push(line);
    });

    meta.text = textLines.join('\n').trim();
    return meta;
}

// --- Infinite scroll ---
const sentinel = document.getElementById('party-sentinel');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadParties();
}, { threshold: 0.1 });
observer.observe(sentinel);

// --- Image preview ---
document.getElementById('partyImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('partyImageName').textContent = file.name;
    const reader = new FileReader();
    reader.onload = (ev) => {
        document.getElementById('partyPreviewImg').src = ev.target.result;
        document.getElementById('partyPreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
});

document.getElementById('partyImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) document.getElementById('partyImageName').textContent = file.name;
});

// --- Submit party ---
document.getElementById('partySubmit').addEventListener('click', async () => {
    const headline = document.getElementById('partyHeadline').value.trim();
    const text = document.getElementById('partyText').value.trim();
    const location = document.getElementById('partyLocation').value.trim();
    const date = document.getElementById('partyDate').value;
    const time = document.getElementById('partyTime').value;
    const imageFile = document.getElementById('partyImage').files[0];
    const status = document.getElementById('partyStatus');

    if (!headline) { status.textContent = 'add a headline. xoxo'; return; }
    if (!imageFile) { status.textContent = 'add a photo. xoxo'; return; }

    status.textContent = 'posting...';

    const gossipText = [
        text,
        location ? `LOCATION:${location}` : '',
        date ? `DATE:${date}` : '',
        time ? `TIME:${time}` : ''
    ].filter(Boolean).join('\n');

    try {
        const compressed = await compressImage(imageFile);
        const formData = new FormData();
        formData.append('image', compressed, 'party.jpg');
        formData.append('headline', headline);
        formData.append('gossipText', gossipText);
        formData.append('postType', 'PARTY');

        const res = await fetch(`${API}/posts/upload`, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            status.textContent = 'your party is live. see you there. xoxo 💋';
            document.getElementById('partyHeadline').value = '';
            document.getElementById('partyText').value = '';
            document.getElementById('partyLocation').value = '';
            document.getElementById('partyDate').value = '';
            document.getElementById('partyTime').value = '';
            document.getElementById('partyImageName').textContent = 'no file chosen';
            document.getElementById('partyPreview').style.display = 'none';
            currentPage = 0;
            hasMore = true;
            document.getElementById('partyCards').innerHTML = '<div class="feed-loading" id="partyLoading">loading parties...</div>';
            loadParties();
        } else {
            status.textContent = 'something went wrong. try again. xoxo';
        }
    } catch (err) {
        console.error(err);
        status.textContent = 'something went wrong. xoxo';
    }
});

async function compressImage(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 800;
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(resolve, 'image/jpeg', 0.7);
        };
        img.src = URL.createObjectURL(file);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadParties();