// GASのウェブアプリURL
const API_URL = "https://script.google.com/macros/s/AKfycbxwtuAjHyEmwrzp9ThVt_RI_LHb9KCf7jX0bwNri2RDt2UXCVyulr1_YJopFVW53b2MBA/exec";

/**
 * google.script.run の代わりになる通信関数
 * script.js のロジックを変えないため、Promiseを返し、文字列のJSONを解決します。
 */
async function gas(fnName, ...args) {
  // 送信データの構築
  let payload = { action: mapActionName(fnName) };
  
  // 引数のマッピング（元の関数の引数形式に合わせてデータを格納）
  if (args.length > 0) {
    const arg = args[0];
    if (fnName === 'apiSendAuthCode') {
      payload.email = arg;
    } else if (fnName === 'apiCancelReservation') {
      payload.id = arg;
    } else if (typeof arg === 'string') {
      // JSON文字列で渡されるもの (apiReserve, apiVerifyAuthCode, apiSendContact)
      try {
        const obj = JSON.parse(arg);
        payload = { ...payload, ...obj };
      } catch (e) {
        payload.data = arg;
      }
    }
  }

  // GETかPOSTかの判定 (apiGetInitのみGET)
  const isGet = (fnName === 'apiGetInit');
  const method = isGet ? 'GET' : 'POST';
  
  let url = API_URL;
  let options = { method: method };

  if (isGet) {
    url += "?action=init";
  } else {
    // POSTの場合
    // GASのdoPostは特殊で、text/plainとして送るとCORSプリフライトを回避しやすい
    options.body = JSON.stringify(payload);
    options.headers = { "Content-Type": "text/plain;charset=utf-8" };
  }

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    
    // 元のコードが JSON.parse(responseString) を前提としているため、
    // ここでは一度オブジェクトになったものを再度文字列化して返すことで互換性を保つ
    return JSON.stringify(json);

  } catch (err) {
    console.error("API Error:", err);
    // エラー時もJSON文字列形式で返す
    return JSON.stringify({ success: false, error: err.toString() });
  }
}

// 内部マッピング用: 元の関数名 -> GAS側のaction名
function mapActionName(fnName) {
  const map = {
    'apiGetInit': 'init',
    'apiSendAuthCode': 'sendAuthCode',
    'apiVerifyAuthCode': 'verifyAuthCode',
    'apiReserve': 'reserve',
    'apiCancelReservation': 'cancel',
    'apiSendContact': 'contact'
  };
  return map[fnName] || fnName;
}