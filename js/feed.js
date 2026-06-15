const API = 'https://gossip-girl-api-production.up.railway.app';
let currentSort = 'hot';
let currentPage = 0;
let isLoading = false;
let hasMore = true;

// --- Sort toggle ---
const sortBtn = document.getElementById('sortBtn');
const sortDropdown = document.getElementById('sortDropdown');

sortBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sortDropdown.classList.toggle('open');
});

document.addEventListener('click', () => sortDropdown.classList.remove('open'));

document.querySelectorAll('.sort-option').forEach(opt => {
    opt.addEventListener('click', () => {
        const sort = opt.dataset.sort;
        if (sort === currentSort) { sortDropdown.classList.remove('open'); return; }
        currentSort = sort;
        sortBtn.textContent = sort === 'hot' ? '🔥' : '✨';
        document.querySelectorAll('.sort-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        sortDropdown.classList.remove('open');
        resetFeed();
    });
});

// --- Feed ---
function resetFeed() {
    currentPage = 0;
    hasMore = true;
    document.getElementById('feedCards').innerHTML = '<div class="feed-loading" id="feedLoading">loading gossip...</div>';
    loadPosts();
}

async function loadPosts() {
    if (isLoading || !hasMore) return;
    isLoading = true;

    try {
        const res = await fetch(`${API}/posts/feed?page=${currentPage}`, {
            headers: { 'X-Sort': currentSort }
        });
        const data = await res.json();
        const loading = document.getElementById('feedLoading');
        if (loading) loading.remove();

        if (data.content.length === 0 && currentPage === 0) {
            document.getElementById('feedCards').innerHTML = `
                <div class="feed-empty">
                    <p>no gossip yet.</p>
                    <span>be the first to spill the tea. xoxo</span>
                </div>`;
            hasMore = false;
            return;
        }

        data.content.forEach(post => {
            document.getElementById('feedCards').appendChild(createCard(post));
        });

        hasMore = !data.last;
        currentPage++;
    } catch (err) {
        console.error(err);
        const loading = document.getElementById('feedLoading');
        if (loading) loading.textContent = 'something went wrong. xoxo';
    } finally {
        isLoading = false;
    }
}

function createCard(post) {
    const card = document.createElement('div');
    card.className = 'blast-card';

    const time = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    card.innerHTML = `
        <div class="blast-header">
            <span class="blast-number">e-blast #${post.id}</span>
            <span class="blast-time">${time}</span>
        </div>
        <div class="blast-text">
            <div class="blast-headline">${escapeHtml(post.headline)}</div>
            ${escapeHtml(post.gossipText)}
        </div>
        <img class="blast-photo" src="${post.photoUrl}" alt="${escapeHtml(post.headline)}" loading="lazy" />
        <div class="blast-footer">
            <button class="blast-footer-btn comment-btn" onclick="window.location.href='post.html?id=${post.id}'">
                💬 ${post.commentCount} comment${post.commentCount !== 1 ? 's' : ''}
            </button>
        </div>
    `;

    return card;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// --- Infinite scroll ---
const sentinel = document.getElementById('scroll-sentinel');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadPosts();
}, { threshold: 0.1 });
observer.observe(sentinel);

// --- Init ---
loadPosts();