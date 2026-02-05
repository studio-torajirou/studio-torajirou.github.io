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

    // 4. お問い合わせフォームの設定（追加）
    setupContactForm();
});


/* --- 関数: クラス情報の取得と表示 --- */
async function fetchClassData() {
    const container = document.getElementById('dynamic-class-list');
    
    try {
        // キャッシュ（古いデータ）が残らないように時間をパラメータにつける
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        
        if (!response.ok) {
            container.innerHTML = '<p>現在クラス紹介の準備中です。</p>';
            return;
        }

        const dataList = await response.json();

        if (dataList.length === 0) {
            container.innerHTML = '<p>現在クラス紹介の準備中です。</p>';
            return;
        }

        container.innerHTML = '';

        dataList.forEach((item) => {
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

    if (menuToggle && navOverlay) {
        menuToggle.addEventListener('click', () => {
            navOverlay.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navOverlay.classList.remove('active');
            });
        });
    }
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


/* --- 関数: お問い合わせフォームの制御（追加） --- */
function setupContactForm() {
    const contactModal = document.getElementById('contactModal');
    const successModal = document.getElementById('contactSuccessModal');
    const btnOpen = document.getElementById('btn-open-contact-form');
    const btnClose = document.getElementById('btn-close-contact');
    const btnSend = document.getElementById('btn-send-contact');
    const btnOk = document.getElementById('btn-close-contact-success');

    // 1. フォームを開く
    if (btnOpen && contactModal) {
        btnOpen.addEventListener('click', () => {
            // 以前に入力した情報の読み込み（もしあれば）
            try {
                const saved = localStorage.getItem("torajiro_user_info");
                if (saved) {
                    const u = JSON.parse(saved);
                    const elName = document.getElementById('contact-name');
                    const elPhone = document.getElementById('contact-phone');
                    const elEmail = document.getElementById('contact-email');
                    
                    if (u.name && elName && !elName.value) elName.value = u.name;
                    if (u.phone && elPhone && !elPhone.value) elPhone.value = u.phone;
                    if (u.email && elEmail && !elEmail.value) elEmail.value = u.email;
                }
            } catch (e) {}

            contactModal.classList.add('open');
        });
    }

    // 2. フォームを閉じる
    if (btnClose && contactModal) {
        btnClose.addEventListener('click', () => {
            contactModal.classList.remove('open');
        });
    }

    // モーダルの背景クリックで閉じる
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('open');
            }
        });
    }

    // 3. 送信処理
    if (btnSend) {
        btnSend.addEventListener('click', () => {
            const elName = document.getElementById('contact-name');
            const elPhone = document.getElementById('contact-phone');
            const elEmail = document.getElementById('contact-email');
            const elSubject = document.getElementById('contact-subject');
            const elBody = document.getElementById('contact-body');

            const name = elName ? elName.value.trim() : "";
            const phone = elPhone ? elPhone.value.trim() : "";
            const email = elEmail ? elEmail.value.trim() : "";
            const subject = elSubject ? elSubject.value : "";
            const body = elBody ? elBody.value.trim() : "";

            // 必須チェック
            if (!name || !email || !subject || !body) {
                alert("必須項目（お名前・メール・ご用件・内容）を入力してください。");
                return;
            }

            // ボタン無効化
            btnSend.disabled = true;
            btnSend.textContent = "送信中...";

            // 送信データ
            const payload = { 
                name: name, 
                phone: phone, 
                email: email, 
                subject: subject,
                body: body 
            };

            // api.js の gas 関数を呼び出し
            if (typeof gas === 'function') {
                gas("apiSendContact", JSON.stringify(payload)).then(res => {
                    btnSend.disabled = false;
                    btnSend.textContent = "送信する";
                    
                    let result;
                    try {
                        result = JSON.parse(res);
                    } catch (e) {
                        result = { success: false, error: "レスポンスの解析に失敗しました" };
                    }

                    if (result.success) {
                        // 成功時
                        if (contactModal) contactModal.classList.remove('open');
                        if (elBody) elBody.value = ""; // 本文のみクリア
                        if (successModal) successModal.classList.add('open');
                        
                        // 次回用に情報を保存
                        try {
                            localStorage.setItem("torajiro_user_info", JSON.stringify({ name, phone, email }));
                        } catch (e) {}

                    } else {
                        alert("送信に失敗しました。\n" + (result.error || ""));
                    }
                }).catch((err) => {
                    btnSend.disabled = false;
                    btnSend.textContent = "送信する";
                    alert("通信エラーが発生しました: " + err);
                });
            } else {
                alert("システムエラー: api.js が読み込まれていません。");
                btnSend.disabled = false;
                btnSend.textContent = "送信する";
            }
        });
    }

    // 4. 送信完了モーダルを閉じる
    if (successModal) {
        if (btnOk) {
            btnOk.addEventListener('click', () => {
                successModal.classList.remove('open');
            });
        }
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('open');
            }
        });
    }
}