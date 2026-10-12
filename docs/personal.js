// Personal portfolio follows the restored IP project.
const personalCover=document.getElementById('yenai-home');
personalCover.querySelector('.cover-ticket').addEventListener('click',()=>goToPage(10));
personalCover.querySelector('.cover-mini').addEventListener('click',()=>goToPage(11));
const lookFilters=Array.from(document.querySelectorAll('[data-look-filter]'));
lookFilters.forEach(button=>button.addEventListener('click',()=>{
 lookFilters.forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
 let count=0;document.querySelectorAll('.look-card').forEach(card=>{card.hidden=button.dataset.lookFilter!=='all'&&card.dataset.category!==button.dataset.lookFilter;if(!card.hidden)count++;});
 document.getElementById('look-count').textContent=(button.dataset.lookFilter==='all'?'全部':button.textContent)+' '+count+' 套穿搭';
}));
const notes={
 idea:['01 / THE IDEA','好看，也要穿得出去。','从“想穿得更有质感，又怕买来只穿一次”的困扰出发。选衣服时，把上身效果和真实的生活场景放在一起考虑。',['能和衣柜里的衣服搭起来','上班、赴约，都有机会穿','给每一份推荐一个具体理由']],
 detail:['02 / THE DETAILS','质感，藏在细节里。','把“显贵”讲得具体一点：肩线、领口、纽扣和面料的垂坠感，都值得放大看。',['肩线合身，整体轮廓利落','领口留一点呼吸感','腰位与长度，让比例更舒展']],
 story:['03 / THE STORY','让分享有理由，也有画面。','计划以口播搭配上身展示和店铺画面，把推荐理由讲清楚。先说穿衣困扰，再逐家分享，最后给出清晰的清单。',['开场：一个具体的穿衣困扰','中间：选款理由与上身细节','结尾：便于回看的店铺清单']]
};
const tabs=Array.from(document.querySelectorAll('[data-note]'));
function selectNote(button){tabs.forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;});const n=notes[button.dataset.note];const panel=document.getElementById('journal-panel');panel.setAttribute('aria-labelledby',button.id);panel.querySelector('.index').textContent=n[0];panel.querySelector('h3').textContent=n[1];panel.querySelector('p').textContent=n[2];const list=panel.querySelector('ul');list.replaceChildren(...n[3].map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));if(!reduceMotion.matches)panel.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:230});}
tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectNote(b));b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();selectNote(tabs[next]);}});});
const viewer=document.getElementById('photo-viewer');const media=viewer.querySelector('.viewer-media');
function showPhoto(node,title){media.replaceChildren(node);viewer.querySelector('.viewer-caption').textContent=title;viewer.showModal();}
document.querySelectorAll('.look-photo').forEach(button=>button.addEventListener('click',()=>{const crop=document.createElement('div');crop.className='look-photo viewer-crop';crop.setAttribute('style',button.getAttribute('style'));crop.append(button.querySelector('img').cloneNode());showPhoto(crop,button.dataset.photoTitle);}));
document.querySelectorAll('[data-enlarge],#yenai-home .cover-photo-window>img').forEach(img=>{img.classList.add('zoomable-image');img.setAttribute('role','button');img.tabIndex=0;img.setAttribute('aria-label','放大查看：'+img.alt);const open=()=>{const photo=img.cloneNode();photo.removeAttribute('role');photo.removeAttribute('tabindex');photo.className='viewer-portrait';showPhoto(photo,img.alt);};img.addEventListener('click',open);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
viewer.querySelector('.close-photo').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});
document.querySelector('.copy-handle').addEventListener('click',async()=>{const status=document.querySelector('.copy-status');try{await navigator.clipboard.writeText('椰奶没喝饱_');status.textContent='已复制，去平台搜索就能找到我。';}catch{status.textContent='账号名：椰奶没喝饱_（可选中文字复制）';}});
