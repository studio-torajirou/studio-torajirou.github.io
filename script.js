// DOM読み込み後に実行
document.addEventListener('DOMContentLoaded', () => {
    
    // --- メニューのふわっと開閉処理 ---
    const menuToggle = document.getElementById('menu-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-list a');

    // ボタンクリックでメニューの開閉を切り替え
    menuToggle.addEventListener('click', () => {
        navOverlay.classList.toggle('active');
    });

    // メニュー内のリンクをクリックしたら自動で閉じる
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navOverlay.classList.remove('active');
        });
    });

    // --- 【Pro版】スクロール連動アニメーション ---
    // 監視する要素を取得
    const fadeElements = document.querySelectorAll('.fade-in-scroll');

    // 監視設定
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 画面に入ったら
            if (entry.isIntersecting) {
                // 'in-view' というクラスをつける（これでCSSが発動）
                entry.target.classList.add('in-view');
                // 一度表示したら監視を止める（負荷軽減）
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px', // 画面の下から少し入ったところで発火
        threshold: 0.1 // 10%見えたら発火
    });

    // 各要素を監視スタート
    fadeElements.forEach(el => {
        scrollObserver.observe(el);
    });
});