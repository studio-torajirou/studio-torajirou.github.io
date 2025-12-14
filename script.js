/* =========================================
   設定：GitHub連携情報
   ========================================= */
const GITHUB_USER = "studio-torajirou"; 
const GITHUB_REPO = "studio-torajirou.github.io"; 
const JSON_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/classData.json`;


document.addEventListener('DOMContentLoaded', () => {
    
    // 1. クラス紹介データの読み込みと表示
    fetchClassData();

    // 2. メニューのふわっと開閉処理
    setupMenu();

    // 3. スクロール連動アニメーション（初期読み込み用）
    setupScrollAnimation();
});


/* --- 関数: クラス情報の取得と表示 --- */
async function fetchClassData() {
    const container = document.getElementById('dynamic-class-list');
    
    try {
        // キャッシュ（古いデータ）が残らないように時間をパラメータにつける
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        
        if (!response.ok) {
            // まだデータがない場合などはここに来る
            container.innerHTML = '<p>現在クラス紹介の準備中です。</p>';
            return;
        }

        const dataList = await response.json();

        // データが空の場合
        if (dataList.length === 0) {
            container.innerHTML = '<p>現在クラス紹介の準備中です。</p>';
            return;
        }

        // 中身をクリア
        container.innerHTML = '';

        // データごとにHTMLを作る
        dataList.forEach((item) => {
            // 画像の更新がすぐ反映されるように時間を付与
            const imagePath = `${item.image}?t=${new Date().getTime()}`;
            
            const html = `
                <div class="class-item fade-in-scroll generated-item">
                    <div class="img-wrapper">
                        <img src="${imagePath}" alt="${item.title}" class="class-img">
                    </div>
                    <h3>${item.title}</h3>
                    <p>${item.text.replace(/\n/g, '<br>')}</p>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        // 生成された要素に対してアニメーション監視をセット
        setTimeout(() => {
            setupScrollAnimation('.generated-item');
        }, 100);

    } catch (error) {
        console.log("データの取得に失敗、またはデータがまだありません:", error);
        container.innerHTML = '<p>現在情報を更新中です。</p>';
    }
}


/* --- 関数: メニュー開閉 --- */
function setupMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-list a');

    menuToggle.addEventListener('click', () => {
        navOverlay.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navOverlay.classList.remove('active');
        });
    });
}


/* --- 関数: スクロールアニメーション --- */
function setupScrollAnimation(selector = '.fade-in-scroll') {
    const fadeElements = document.querySelectorAll(selector);

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    fadeElements.forEach(el => {
        scrollObserver.observe(el);
    });
}