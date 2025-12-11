<!-- FILE: app.js -->
async function deleteEvent(id){ if(!confirm('Delete this event?')) return; await simpleFetch({action:'deleteEvent', id}); await adminLoadAll(); }


// Simple edit flows - fill the form with values - backend should support updateAnnouncement/updateEvent
function editAnnouncement(id){
const row = document.querySelector(`#annTableBody tr[data-id="${id}"]`);
if(!row) return; const cells = row.children; document.getElementById('annTitle').value = cells[0].textContent; document.getElementById('annDate').value = cells[1].textContent; document.getElementById('annMessage').value = cells[2].textContent; document.getElementById('annSaveBtn').dataset.editId = id; window.scrollTo({top:0,behavior:'smooth'});
}
async function saveAnnouncementEdit(){
const id = document.getElementById('annSaveBtn').dataset.editId; if(!id) return addAnnouncementFromForm();
const t = document.getElementById('annTitle').value.trim(); const d = document.getElementById('annDate').value.trim(); const m = document.getElementById('annMessage').value.trim(); await simpleFetch({action:'updateAnnouncement', id, title:t, date:d, message:m}); delete document.getElementById('annSaveBtn').dataset.editId; await adminLoadAll();
}
function editEvent(id){
const row = document.querySelector(`#eventTableBody tr[data-id="${id}"]`); if(!row) return; const cells = row.children; document.getElementById('evtName').value = cells[0].textContent; document.getElementById('evtDate').value = cells[1].textContent; document.getElementById('evtDesc').value = cells[2].textContent; document.getElementById('evtSaveBtn').dataset.editId = id; window.scrollTo({top:0,behavior:'smooth'});
}
async function saveEventEdit(){ const id = document.getElementById('evtSaveBtn').dataset.editId; if(!id) return addEventFromForm(); const e = document.getElementById('evtName').value.trim(); const d = document.getElementById('evtDate').value.trim(); const desc = document.getElementById('evtDesc').value.trim(); await simpleFetch({action:'updateEvent', id,event:e,date:d,description:desc}); delete document.getElementById('evtSaveBtn').dataset.editId; await adminLoadAll(); }


// Notifications: Poll backend for new announcements/events and show Web Notifications
let lastAnnFingerprint=''; let lastEvtFingerprint='';
async function pollForUpdates(){
try{
const [anns,evs] = await Promise.all([fetchAnnouncements(), fetchEvents()]);
const annFP = JSON.stringify(anns.map(a=>a.id+a.date).slice(0,10));
const evtFP = JSON.stringify(evs.map(e=>e.id+e.date).slice(0,10));
if(annFP!==lastAnnFingerprint){
// find newest
const newest = anns[0]; if(newest && lastAnnFingerprint) notify(`${newest.title}`, newest.message || 'New announcement');
lastAnnFingerprint = annFP;
}
if(evtFP!==lastEvtFingerprint){ const newest = evs[0]; if(newest && lastEvtFingerprint) notify(`Event: ${newest.event}`, newest.description || 'New event'); lastEvtFingerprint = evtFP; }
}catch(e){}
}
function notify(title, body){ if(!('Notification' in window)) return; if(Notification.permission==='granted'){ new Notification(title,{body}); } }
function requestNotificationPermission(){ if(!('Notification' in window)) return; if(Notification.permission==='default') Notification.requestPermission(); }


// Dark mode
function toggleDark(){ document.body.classList.toggle('dark'); localStorage.setItem('dark', document.body.classList.contains('dark')?'1':'0'); }
function initDark(){ if(localStorage.getItem('dark')==='1') document.body.classList.add('dark'); }


// Utilities
function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }


// Init flows for pages
window.addEventListener('load', ()=>{
initDark();
const path = location.pathname.split('/').pop();
if(path==='index.html' || path===''){
requireAuth(); renderHome(); requestNotificationPermission(); setInterval(pollForUpdates,30000);
}
if(path==='admin.html'){
requireAuth('login.html'); adminLoadAll();
}
});
