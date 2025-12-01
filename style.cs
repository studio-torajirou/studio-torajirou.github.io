/* =========================================
   ベース設定
   ========================================= */
:root {
    /* カラーパレット */
    --primary-color: #F39800;   /* トラじろうオレンジ */
    --accent-color: #67C5B5;    /* ミントグリーン */
    --bg-color: #FAFAF8;        /* 生成り色 */
    --text-color: #554e44;      /* 優しい焦げ茶 */
    --white: #ffffff;
    
    /* フォント */
    --font-heading: 'Yomogi', cursive;
    --font-body: 'Zen Maru Gothic', sans-serif;
}

body {
    margin: 0;
    padding: 0;
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: var(--font-body);
    line-height: 1.8;
    letter-spacing: 0.05em; 
    /* body自体の背景設定は削除し、下の ::before に移動しました */
}

/* 【重要】背景画像を固定するための特殊な設定 
   PC（基本）では画面いっぱいに広げます
*/
body::before {
    content: "";
    display: block;
    position: fixed; /* 画面に固定 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh; /* 画面の高さに合わせる */
    z-index: -1;   /* コンテンツの後ろに配置 */
    
    /* 背景画像設定（白いフィルター + ロゴ画像） */
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
        url('https://orewatasi100-lang.github.io/studio_torajirou/asako_gemin-rogo.jpg');
    
    background-size: cover;      /* PCでは画面いっぱいに広げる */
    background-position: center; /* 中央合わせ */
    background-repeat: no-repeat;
}

a {
    text-decoration: none;
    color: inherit;
    transition: opacity 0.3s;
}

ul {
    list-style: none;
    padding: 0;
}

/* =========================================
   レイアウト共通
   ========================================= */
.section-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 4rem 1.5rem;
    text-align: center;
}

/* すりガラス風ボックス (.glass-box) */
.glass-box {
    background: rgba(255, 255, 255, 0.6); /* 白の透明度60% */
    backdrop-filter: blur(10px);          /* すりガラス効果 */
    -webkit-backdrop-filter: blur(10px);  /* Safari用 */
    
    border: 1px solid rgba(255, 255, 255, 0.4); /* 薄い白い枠線 */
    border-radius: 24px;
    padding: 3rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); /* 影は薄く */
    margin-bottom: 2rem;
}

/* 見出しスタイル */
h1, h2, h3 {
    font-family: var(--font-heading);
    font-weight: 400;
}

.section-title {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 2rem;
    display: inline-block;
    position: relative;
}

.section-title::after {
    content: '';
    display: block;
    width: 100%;
    height: 8px;
    background: rgba(103, 197, 181, 0.3); 
    position: absolute;
    bottom: 5px;
    left: 0;
    border-radius: 4px;
    z-index: -1;
}

/* =========================================
   ヘッダー & ナビゲーション
   ========================================= */
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    box-sizing: border-box;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.logo {
    display: flex;
    align-items: center;
}

.logo a {
    font-family: var(--font-heading);
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--primary-color);
}

.menu-toggle {
    background: none;
    border: none;
    cursor: pointer;
    z-index: 1002;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    
    transform: scale(3); /* PCでは3倍 */
    transform-origin: right center;
    margin-right: 20px;
}

.bar {
    display: block;
    width: 30px;
    height: 2px;
    background-color: var(--primary-color);
    transition: 0.3s;
    border-radius: 2px;
}

.menu-text {
    font-family: var(--font-heading);
    font-size: 0.8rem;
    color: var(--primary-color);
    display: none;
}

/* メニュー展開時のナビゲーション */
.nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease, visibility 0.5s;
    z-index: 1001;
}

.nav-overlay.active {
    opacity: 1;
    visibility: visible;
}

.nav-list li {
    margin: 1.5rem 0;
    text-align: center;
    transform: translateY(20px);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s ease;
}

.nav-list a {
    font-family: var(--font-heading);
    font-size: 1.8rem;
    color: var(--text-color);
}

.nav-overlay.active .nav-list li {
    transform: translateY(0);
    opacity: 1;
}
.nav-overlay.active .nav-list li:nth-child(1) { transition-delay: 0.1s; }
.nav-overlay.active .nav-list li:nth-child(2) { transition-delay: 0.2s; }
.nav-overlay.active .nav-list li:nth-child(3) { transition-delay: 0.3s; }
.nav-overlay.active .nav-list li:nth-child(4) { transition-delay: 0.4s; }
.nav-overlay.active .nav-list li:nth-child(5) { transition-delay: 0.5s; }
.nav-overlay.active .nav-list li:nth-child(6) { transition-delay: 0.6s; }

/* =========================================
   ヒーローエリア（トップ画像）
   ========================================= */
.hero {
    height: 100vh; /* PCでは全画面 */
    background-image: url('https://orewatasi100-lang.github.io/studio_torajirou/asako_gemin-3.png');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    text-shadow: 0 0 10px rgba(255,255,255,0.8);
}

.hero-content h1 {
    font-size: 4.5rem;
    color: var(--primary-color);
    line-height: 1.4;
    background: rgba(255,255,255,0.5);
    padding: 1rem 2rem;
    border-radius: 10px;
}

/* =========================================
   パーツ
   ========================================= */
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
}

.img-placeholder {
    width: 100%;
    height: 200px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px dashed #ccc;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #888;
    margin-bottom: 1rem;
}

.insta-placeholder {
    width: 100%;
    height: 300px;
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    color: #888;
}

.btn-reserve {
    display: inline-block;
    background: linear-gradient(135deg, var(--primary-color), #ffb347);
    color: white;
    font-family: var(--font-heading);
    font-size: 1.2rem;
    padding: 1rem 3rem;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(243, 152, 0, 0.3);
    margin-top: 1rem;
}

.btn-reserve:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(243, 152, 0, 0.4);
}

.price-list {
    text-align: left;
    margin: 2rem auto;
    max-width: 600px;
}

.price-row {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed #ddd;
    padding: 1rem 0;
    font-size: 1.2rem;
}

/* ごあいさつ用 */
.greeting-img-area {
    margin-bottom: 2rem;
}

.greeting-img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.greeting-text {
    text-align: left;
    display: inline-block;
}

.greeting-text h3 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
}

.footer {
    background-color: var(--accent-color);
    color: white;
    text-align: center;
    padding: 2rem;
    font-family: var(--font-heading);
}

/* =========================================
   アニメーション
   ========================================= */
.fade-in-up {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 1s forwards;
}

.delay {
    animation-delay: 0.5s;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* =========================================
   スマホ・タブレット用（画面幅768px以下）
   ========================================= */
@media screen and (max-width: 768px) {

    /* 1. 背景画像の調整（ここを変更しました） */
    body::before {
        /* スマホでは左右が見切れないように「全体を収める」設定に変更 */
        background-size: contain !important;
        /* 画像を繰り返し表示しない */
        background-repeat: no-repeat !important;
        /* 画面のど真ん中に配置 */
        background-position: center center !important;
    }

    /* 2. ヒーロー画像（トップ画像）の調整 */
    .hero {
        height: 65vh !important;
        background-position: center top !important; 
    }

    /* 3. タイトル文字の調整 */
    .hero-content h1 {
        font-size: 2.2rem !important; 
        padding: 0.5rem 1rem;
        width: 90%; 
        margin: 0 auto;
    }
    
    .hero-content p {
        font-size: 1rem !important;
        width: 90%;
        margin: 1rem auto 0;
    }

    /* 4. メニューボタンの調整 */
    .menu-toggle {
        transform: scale(2) !important;
        margin-right: 15px; 
    }
    
    /* 5. レイアウトの調整 */
    .section-container {
        padding: 3rem 1rem !important;
    }
    
    .glass-box {
        padding: 2rem 1.5rem !important;
    }
    
    /* 6. グリッドの調整 */
    .grid-container {
        grid-template-columns: 1fr !important;
        gap: 2rem;
    }
}