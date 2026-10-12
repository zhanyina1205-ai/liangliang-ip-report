// Keep every section at exactly 16:9, including narrow screens.
const reportMain=document.querySelector('main');
const reportSections=Array.from(reportMain.children).filter(el=>el.tagName==='SECTION');
const endNote=reportMain.querySelector('footer');
reportSections[reportSections.length-1].append(endNote);
reportSections.forEach((section,index)=>{
 const frame=document.createElement('div');frame.className='report-page';
 section.before(frame);frame.append(section);
 const counter=document.createElement('span');counter.className='page-counter';counter.textContent=String(index+1).padStart(2,'0')+' / '+String(reportSections.length).padStart(2,'0');section.append(counter);
 const resize=()=>{frame.style.setProperty('--page-scale',String(frame.clientWidth/1208));};
 new ResizeObserver(resize).observe(frame);resize();
});
// Presentation navigation and subtle motion, respecting reduced-motion preferences.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const pages=Array.from(document.querySelectorAll('.report-page'));
const chapterNames=['首页','关于我','穿搭作品','创作手记','找到我'];
const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('role','progressbar');progress.setAttribute('aria-label','网站浏览进度');progress.setAttribute('aria-valuemin','1');progress.setAttribute('aria-valuemax',String(pages.length));const progressFill=document.createElement('span');progress.append(progressFill);document.body.append(progress);
const reader=document.createElement('div');reader.className='reader-controls';reader.setAttribute('aria-label','网站翻页');
reader.innerHTML='<button class="reader-prev" aria-label="上一页">←</button><button class="chapter-toggle" aria-expanded="false" aria-controls="chapter-menu"><span class="reader-number">01 / '+String(pages.length).padStart(2,'0')+'</span><span class="reader-title">首页</span><span class="reader-chevron">⌃</span></button><button class="reader-next" aria-label="下一页">→</button><div id="chapter-menu" class="chapter-menu" hidden></div>';
document.body.append(reader);
const menu=reader.querySelector('.chapter-menu');
chapterNames.forEach((name,index)=>{const button=document.createElement('button');button.type='button';button.textContent=String(index+1).padStart(2,'0')+'  '+name;button.dataset.chapter=String(index);button.addEventListener('click',()=>{closeMenu();goToPage(index);});menu.append(button);});
let activePage=0;
function closeMenu(){menu.hidden=true;reader.querySelector('.chapter-toggle').setAttribute('aria-expanded','false');}
function goToPage(index){const target=Math.max(0,Math.min(pages.length-1,index));pages[target].scrollIntoView({behavior:reduceMotion.matches?'instant':'smooth',block:'start'});}
reader.querySelector('.reader-prev').addEventListener('click',()=>goToPage(activePage-1));
reader.querySelector('.reader-next').addEventListener('click',()=>goToPage(activePage+1));
reader.querySelector('.chapter-toggle').addEventListener('click',()=>{menu.hidden=!menu.hidden;reader.querySelector('.chapter-toggle').setAttribute('aria-expanded',String(!menu.hidden));});
document.addEventListener('click',event=>{if(!reader.contains(event.target))closeMenu();});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&!menu.hidden){closeMenu();reader.querySelector('.chapter-toggle').focus();return;}
 if(document.querySelector('dialog[open]')||event.target.closest('input,textarea,select,summary,[contenteditable="true"],button,a'))return;
 if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();goToPage(activePage+(event.key==='ArrowRight'?1:-1));}
});
let scrollQueued=false;
function updateReader(){
 scrollQueued=false;let closest=Infinity;
 pages.forEach((page,index)=>{const r=page.getBoundingClientRect();const distance=Math.abs(r.top+r.height/2-innerHeight/2);if(distance<closest){closest=distance;activePage=index;}});
 reader.querySelector('.reader-number').textContent=String(activePage+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');reader.querySelector('.reader-title').textContent=chapterNames[activePage];
 reader.querySelector('.reader-prev').disabled=activePage===0;reader.querySelector('.reader-next').disabled=activePage===pages.length-1;
 menu.querySelectorAll('button').forEach((button,index)=>{button.classList.toggle('current',index===activePage);if(index===activePage)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
 progressFill.style.width=String((activePage+1)/pages.length*100)+'%';progress.setAttribute('aria-valuenow',String(activePage+1));
 document.querySelectorAll('.site-header nav a').forEach(link=>{link.classList.toggle('nav-current',pages[activePage].querySelector('section').id===link.hash.slice(1));});
}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateReader);}},{passive:true});window.addEventListener('resize',updateReader);updateReader();
if(!reduceMotion.matches&&'IntersectionObserver' in window){
 const reveal=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');reveal.unobserve(entry.target);}});},{threshold:0.08});
 pages.forEach(page=>{page.classList.add('motion-page');Array.from(page.querySelector('section').children).filter(el=>!el.classList.contains('page-counter')).slice(0,7).forEach((el,index)=>{el.classList.add('motion-piece');el.style.setProperty('--entry-delay',String(index*45)+'ms');});reveal.observe(page);});
 reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches)pages.forEach(page=>page.classList.add('is-revealed'));});
}

const cover=document.querySelector('.cover-collage');
cover.querySelector('.cover-ticket').addEventListener('click',()=>goToPage(1));
cover.querySelector('.cover-mini').addEventListener('click',()=>goToPage(2));
let coverPointerFrame=0;
function resetCoverDepth(){
 ['--cover-move-x','--cover-move-y','--cover-tilt-x','--cover-tilt-y'].forEach(name=>cover.style.removeProperty(name));
}
cover.addEventListener('pointermove',event=>{
 if(reduceMotion.matches||event.pointerType!=='mouse')return;
 cancelAnimationFrame(coverPointerFrame);
 const r=cover.getBoundingClientRect();const x=(event.clientX-r.left)/r.width-.5;const y=(event.clientY-r.top)/r.height-.5;
 coverPointerFrame=requestAnimationFrame(()=>{
  cover.style.setProperty('--cover-move-x',(x*12).toFixed(2)+'px');cover.style.setProperty('--cover-move-y',(y*9).toFixed(2)+'px');
  cover.style.setProperty('--cover-tilt-x',(-y*3).toFixed(2)+'deg');cover.style.setProperty('--cover-tilt-y',(x*4).toFixed(2)+'deg');
 });
},{passive:true});
cover.addEventListener('pointerleave',()=>{cancelAnimationFrame(coverPointerFrame);resetCoverDepth();});
reduceMotion.addEventListener('change',resetCoverDepth);

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
document.querySelectorAll('[data-enlarge],.cover-photo-window>img').forEach(img=>{img.classList.add('zoomable-image');img.setAttribute('role','button');img.tabIndex=0;img.setAttribute('aria-label','放大查看：'+img.alt);const open=()=>{const photo=img.cloneNode();photo.removeAttribute('role');photo.removeAttribute('tabindex');photo.className='viewer-portrait';showPhoto(photo,img.alt);};img.addEventListener('click',open);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
viewer.querySelector('.close-photo').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close();});
document.querySelector('.copy-handle').addEventListener('click',async()=>{const status=document.querySelector('.copy-status');try{await navigator.clipboard.writeText('椰奶没喝饱_');status.textContent='已复制，去平台搜索就能找到我。';}catch{status.textContent='账号名：椰奶没喝饱_（可选中文字复制）';}});
