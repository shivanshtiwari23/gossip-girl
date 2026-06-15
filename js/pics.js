const API = 'https://gossip-girl-api-production.up.railway.app';
let currentPage = 0;
let isLoading = false;
let hasMore = true;

async function loadPics() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
        const res = await fetch(`${API}/posts/feed?page=${currentPage}`, {
            headers: { 'X-Sort': 'new' }
        });
        const data = await res.json();

        const loading = document.getElementById('picsLoading');
        if (loading) loading.remove();

        if (data.content.length === 0 && currentPage === 0) {
            document.getElementById('picsGrid').innerHTML = `
                <div class="feed-empty">
                    <p>no pics yet.</p>
                    <span>be the first to post. xoxo</span>
                </div>`;
            hasMore = false;
            return;
        }

        data.content.forEach(post => {
            const item = document.createElement('div');
            item.className = 'pic-item';
            item.onclick = () => window.location.href = `post.html?id=${post.id}`;
            item.innerHTML = `
                <img src="${post.photoUrl}" alt="${escapeHtml(post.headline)}" loading="lazy" />
                <div class="pic-overlay">e-blast #${post.id}</div>
            `;
            document.getElementById('picsGrid').appendChild(item);
        });

        hasMore = !data.last;
        currentPage++;
    } catch (err) {
        console.error(err);
        const loading = document.getElementById('picsLoading');
        if (loading) loading.textContent = 'something went wrong. xoxo';
    } finally {
        isLoading = false;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const sentinel = document.getElementById('pics-sentinel');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadPics();
}, { threshold: 0.1 });
observer.observe(sentinel);

loadPics();