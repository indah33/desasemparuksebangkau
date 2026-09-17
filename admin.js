const token = sessionStorage.getItem("adminToken");
const rows = document.getElementById("rows");
const msg = document.getElementById("adminMsg");

if (!token) location.href = "login-admin.html";

const escAdmin = s => String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

async function api(action, extra={}) {
  const d = new URLSearchParams();
  d.append("action", action); d.append("token", token);
  Object.entries(extra).forEach(([k,v]) => d.append(k,v));
  const r = await fetch(API_URL,{method:"POST",body:d});
  return r.json();
}

async function loadData(){
  msg.textContent="Memuat data...";
  try{
    const x=await api("list");
    if(x.status!=="success"){
      if(x.message==="Sesi tidak valid."){sessionStorage.clear();location.href="login-admin.html";return;}
      msg.textContent=x.message||"Gagal memuat data."; return;
    }
    const data=x.data||[];
    document.getElementById("total").textContent=data.length;
    document.getElementById("waiting").textContent=data.filter(a=>a.status==="Menunggu").length;
    document.getElementById("done").textContent=data.filter(a=>a.status==="Ditanggapi").length;
    rows.innerHTML="";
    if(!data.length){rows.innerHTML='<tr><td colspan="7" class="empty">Belum ada pengaduan.</td></tr>';msg.textContent="";return;}
    data.forEach(a=>{
      const tr=document.createElement("tr");
      tr.innerHTML=`<td><b>${escAdmin(a.id)}</b></td><td>${escAdmin(a.tanggal)}</td><td>${escAdmin(a.nama)}<br><small>${escAdmin(a.kontak||"")}</small></td><td>${escAdmin(a.kategori)}</td><td>${escAdmin(a.pengaduan)}</td>
      <td><span class="status-admin ${escAdmin(a.status)}">${escAdmin(a.status)}</span></td>
      <td class="action-box">${a.tanggapan?`<div><small>Tanggapan:</small><br>${escAdmin(a.tanggapan)}</div>`:""}
      <textarea id="reply-${escAdmin(a.id)}" placeholder="Tulis tanggapan admin..."></textarea>
      <button class="btn-response" onclick="updateStatus('${encodeURIComponent(a.id)}','Ditanggapi')">Tanggapi</button>
      <button class="btn-reject" onclick="updateStatus('${encodeURIComponent(a.id)}','Ditolak')">Tolak</button></td>`;
      rows.appendChild(tr);
    });
    msg.textContent="";
  }catch(e){msg.textContent="Gagal terhubung ke Google Apps Script."}
}

async function updateStatus(encodedId,status){
  const id=decodeURIComponent(encodedId);
  const ta=document.getElementById("reply-"+id);
  const tanggapan=ta ? ta.value.trim() : "";
  if(status==="Ditanggapi" && !tanggapan){alert("Isi tanggapan admin terlebih dahulu.");return;}
  msg.textContent="Menyimpan...";
  try{
    const x=await api("update",{id,status,tanggapan});
    msg.textContent=x.status==="success"?"Perubahan berhasil disimpan.":(x.message||"Gagal menyimpan.");
    if(x.status==="success") loadData();
  }catch(e){msg.textContent="Gagal menyimpan perubahan."}
}

document.getElementById("refresh").addEventListener("click",loadData);
document.getElementById("logout").addEventListener("click",()=>{sessionStorage.clear();location.href="login-admin.html";});
loadData();
