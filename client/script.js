function getNodeUrls() {
   // Danh sach cac node duoc hardcode co dinh
   return [
      'http://localhost:5001',
      'http://localhost:5002',
      'http://localhost:5003'
   ];
}

//ham hien response
function showResponse(elementId, data, isError = false) {
   const el = document.getElementById(elementId);
   el.className = 'response-area show';
   el.style.borderColor = isError ? 'var(--error)' : 'var(--success)';
   el.textContent = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
}

//ham fetch with failover
async function fetchWithFailover(path, options = {}) {
   const urls = getNodeUrls();
   if (urls.length === 0) {
      throw new Error("Vui lòng cung cấp ít nhất một Node URL");
   }

   let lastError = null;

   for (let i = 0; i < urls.length; i++) {
      const nodeUrl = urls[i];
      try {
         const res = await fetch(`${nodeUrl}${path}`, options);
         return { res, urlUsed: nodeUrl };
      } catch (err) {
         lastError = err;
      }
   }

   throw new Error(`Tất cả các node đều không phản hồi. Lỗi cuối cùng: ${lastError.message}`);
}

//ham post data
async function postData() {
   const key = document.getElementById('post-key').value.trim();
   const value = document.getElementById('post-value').value.trim();

   if (!key || !value) {
      showResponse('post-response', 'Vui lòng nhập cả Key và Value', true);
      return;
   }

   try {
      showResponse('post-response', 'Đang xử lý...');
      const { res, urlUsed } = await fetchWithFailover('/put', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ key, value })
      });
      const data = await res.json();
      showResponse('post-response', `[Thành công qua ${urlUsed}]\n\n${JSON.stringify(data, null, 2)}`, !res.ok);
   } catch (err) {
      showResponse('post-response', `Lỗi kết nối: ${err.message}`, true);
   }
}

//ham get data
async function getData() {
   const key = document.getElementById('get-key').value.trim();

   if (!key) {
      showResponse('get-response', 'Vui lòng nhập Key', true);
      return;
   }

   try {
      showResponse('get-response', 'Đang xử lý...');
      const { res, urlUsed } = await fetchWithFailover(`/get/${encodeURIComponent(key)}`);
      const data = await res.json();
      showResponse('get-response', `[Thành công qua ${urlUsed}]\n\n${JSON.stringify(data, null, 2)}`, !res.ok);
   } catch (err) {
      showResponse('get-response', `Lỗi kết nối: ${err.message}`, true);
   }
}

//ham delete data
async function deleteData() {
   const key = document.getElementById('delete-key').value.trim();

   if (!key) {
      showResponse('delete-response', 'Vui lòng nhập Key', true);
      return;
   }

   try {
      showResponse('delete-response', 'Đang xử lý...');
      const { res, urlUsed } = await fetchWithFailover(`/delete/${encodeURIComponent(key)}`, {
         method: 'DELETE'
      });
      const data = await res.json();
      showResponse('delete-response', `[Thành công qua ${urlUsed}]\n\n${JSON.stringify(data, null, 2)}`, !res.ok);
   } catch (err) {
      showResponse('delete-response', `Lỗi kết nối: ${err.message}`, true);
   }
}

//ham get snapshot
async function getSnapshot() {
   try {
      showResponse('snapshot-response', 'Đang xử lý...');
      const { res, urlUsed } = await fetchWithFailover('/snapshot');
      const data = await res.json();
      showResponse('snapshot-response', `[Thành công qua ${urlUsed}]\n\n${JSON.stringify(data, null, 2)}`, !res.ok);
   } catch (err) {
      showResponse('snapshot-response', `Lỗi kết nối: ${err.message}`, true);
   }
}