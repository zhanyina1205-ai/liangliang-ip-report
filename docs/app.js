const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
 filters.forEach(item => {item.classList.toggle('selected', item===button); item.setAttribute('aria-pressed', String(item===button));});
 document.querySelectorAll('.account').forEach(item => {item.hidden = button.dataset.filter!=='all' && item.dataset.platform!==button.dataset.filter;});
}));
const steps = [
 ['105','天','突破 1 万粉丝','按截图计时，在第 105 天达到 1 万粉丝。注册节点没有标注具体日期。'],
 ['163','天','从 1 万到 10 万','这一阶段增加 9 万粉丝，从起步进入持续积累。'],
 ['67','天','从 10 万到 30 万','这一阶段增加 20 万粉丝，是四个已知日期节点间用时最短的一段。'],
 ['196','天','从 30 万到 100 万','这一阶段增加 70 万粉丝；按截图计时，在第 531 天达到百万节点。'],
 ['199.44','万','报告中的粉丝规模','原成长截图未标注该节点日期；此处作为报告资料快照，不视为实时粉丝数。']
];
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('[data-step]').forEach(item => {item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
 const s=steps[Number(button.dataset.step)]; const num=document.getElementById('step-num');num.replaceChildren(document.createTextNode(s[0]));const unit=document.createElement('span');unit.textContent=s[1];num.append(unit);document.getElementById('step-title').textContent=s[2];document.getElementById('step-copy').textContent=s[3];
}));
const evidence=document.getElementById('evidence');
document.querySelectorAll('[data-evidence]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();const isDouyin=button.dataset.evidence==='dy';evidence.querySelector('img').src=isDouyin?'assets/source-1.png':'assets/source-2.png';evidence.querySelector('img').alt=isDouyin?'是亮亮抖音主页截图':'是亮亮小红书主页截图';evidence.querySelector('p').textContent='用户提供的账号主页截图';evidence.showModal();}));
evidence.querySelector('.close-dialog').addEventListener('click',()=>evidence.close());evidence.addEventListener('click',event=>{if(event.target===evidence)evidence.close();});

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
const fullDocument=document.getElementById('full-document');
document.getElementById('open-full-document').addEventListener('click',()=>fullDocument.showModal());
fullDocument.querySelector('.close-full-document').addEventListener('click',()=>fullDocument.close());
fullDocument.addEventListener('click',event=>{if(event.target===fullDocument)fullDocument.close();});

// Presentation navigation and subtle motion, respecting reduced-motion preferences.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const pages=Array.from(document.querySelectorAll('.report-page'));
const chapterNames=['封面','人物与IP','个人资料','账号矩阵','成长时间轴','代表作品','受众与表现','商业与对标','来源与全文'];
const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('role','progressbar');progress.setAttribute('aria-label','报告阅读进度');progress.setAttribute('aria-valuemin','1');progress.setAttribute('aria-valuemax',String(pages.length));const progressFill=document.createElement('span');progress.append(progressFill);document.body.append(progress);
const reader=document.createElement('div');reader.className='reader-controls';reader.setAttribute('aria-label','报告翻页');
reader.innerHTML='<button class="reader-prev" aria-label="上一页">←</button><button class="chapter-toggle" aria-expanded="false" aria-controls="chapter-menu"><span class="reader-number">01 / '+String(pages.length).padStart(2,'0')+'</span><span class="reader-title">封面</span><span class="reader-chevron">⌃</span></button><button class="reader-next" aria-label="下一页">→</button><div id="chapter-menu" class="chapter-menu" hidden></div>';
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
function animateChange(element){if(!reduceMotion.matches)element.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'});}
document.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{animateChange(document.querySelector('.timeline-detail'));if(!reduceMotion.matches)button.querySelector('.circle').animate([{transform:'scale(.96)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:340,easing:'ease-out'});}));
filters.forEach(button=>button.addEventListener('click',()=>document.querySelectorAll('.account:not([hidden])').forEach(animateChange)));
// Enlarge report images without leaving the page.
document.querySelectorAll('.hero-photo img,.work-visual img,.fashion-visual img').forEach(img=>{
 img.classList.add('zoomable-image');img.setAttribute('role','button');img.setAttribute('tabindex','0');img.setAttribute('aria-label','放大查看：'+img.alt);
 const open=()=>{evidence.querySelector('img').src=img.src;evidence.querySelector('img').alt=img.alt;evidence.querySelector('p').textContent='用户提供的报告图片';evidence.showModal();};
 img.addEventListener('click',open);img.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}});
});
