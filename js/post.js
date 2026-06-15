const API = 'https://gossip-girl-api-production.up.railway.app';

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

async function loadPost() {
    if (!postId) {
        document.getElementById('postContainer').innerHTML = '<p style="color:rgba(255,255,255,0.4);padding:40px;text-align:center;">post not found. xoxo</p>';
        return;
    }

    try {
        const res = await fetch(`${API}/posts/${postId}`);
        const post = await res.json();

        const time = new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });

        document.title = `e-blast #${post.id} — Gossip Girl`;

        document.getElementById('postContainer').innerHTML = `
            <div class="blast-card" style="max-width:640px;margin:0 auto 0 0;">
                <div class="blast-header">
                    <span class="blast-number">e-blast #${post.id}</span>
                    <span class="blast-time">${time}</span>
                </div>
                <div class="blast-text">
                    <div class="blast-headline">${escapeHtml(post.headline)}</div>
                    ${escapeHtml(post.gossipText)}
                </div>
                <img class="blast-photo" src="${post.photoUrl}" alt="${escapeHtml(post.headline)}" />
            </div>
        `;

        loadComments();
    } catch (err) {
        console.error(err);
    }
}

async function loadComments() {
    try {
        const res = await fetch(`${API}/posts/${postId}/comments`);
        const data = await res.json();
        const list = document.getElementById('commentsList');

        if (data.content.length === 0) {
            list.innerHTML = '<p class="comments-empty">no comments yet. be the first. xoxo</p>';
            return;
        }

        list.innerHTML = '';
        data.content.forEach(comment => {
            const time = new Date(comment.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            const div = document.createElement('div');
            div.className = 'comment-item';
            div.innerHTML = `
                ${escapeHtml(comment.text)}
                <div class="comment-time">${time}</div>
            `;
            list.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('commentSubmit').addEventListener('click', async () => {
    const text = document.getElementById('commentInput').value.trim();
    if (!text) return;

    try {
        const res = await fetch(`${API}/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (res.ok) {
            document.getElementById('commentInput').value = '';
            loadComments();
        }
    } catch (err) {
        console.error(err);
    }
});

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

loadPost();