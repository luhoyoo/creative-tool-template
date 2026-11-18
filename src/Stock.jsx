import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import './stock.css';

import { translations } from './config/copy.js';
import { toolConfig } from './config/tool.js';

const asset = (n) => `/assets/stock/0-${n}`;
function Logo({src, zoom=1, background='transparent', alt=''}) {
 return <div className="stock-logo-glass"><div className="stock-logo-crop" style={{backgroundColor:background}}><img src={src} alt={alt} width="113" height="113" style={{transform:`scale(${zoom})`}} /></div></div>;
}
function FittedTitle({ text }) {
 const containerRef=useRef(null), textRef=useRef(null);
 useLayoutEffect(()=>{
  let cancelled=false;
  const fit=()=>{
   const container=containerRef.current, node=textRef.current;
   if(cancelled || !container || !node) return;
   const available=container.clientWidth;
   if(!available) return;
   let low=0, high=140;
   node.style.fontSize='140px';
   if(node.scrollWidth>available){
    for(let i=0;i<20;i++){
     const middle=(low+high)/2;
     node.style.fontSize=`${middle}px`;
     if(node.scrollWidth<=available) low=middle; else high=middle;
    }
    node.style.fontSize=`${Math.max(0.01,low-0.1)}px`;
   }
  };
  fit();
  document.fonts.ready.then(fit);
  return ()=>{cancelled=true};
 },[text]);
 return <div className="stock-title" ref={containerRef}><span ref={textRef} translate="no">{text}</span></div>;
}
function Poster({symbols, images, logoSettings, locale, copy}, ref) {
 const rtl = ['ar-AE','fa-IR'].includes(locale); const index=3-symbols.length;
 const samples = symbols.length===1 ? ['/assets/stock/2-img1.png'] : symbols.length===2 ? ['/assets/stock/1-img1.png','/assets/stock/1-img2.png'] : ['/assets/stock/0-img7.png','/assets/stock/0-img9.png','/assets/stock/0-imgEllipse44512349.png'];
 return <div className={'stock-poster'+(rtl?' rtl':'')} ref={ref} dir={rtl?'rtl':'ltr'}>
  <img className="stock-background" src={asset('imgImage17917867811261.png')} alt="" width="939" height="939" />
  <div className="stock-brand"><img src={asset('imgLogo.svg')} alt="" width="49" height="36"/><span translate="no">MEXC</span></div><div className="stock-tag">{copy[0]}</div>
  <FittedTitle text={symbols.join(', ')} />
  <div className="stock-benefits">{copy.slice(1).map((text,i)=><div className="stock-benefit" key={i}><img src={asset(['imgLeaderboardLight.svg','imgLeverageApexLight.svg','imgPremarketLight.svg'][i])} alt="" width="60" height="60"/><span>{text}</span></div>)}</div>
  {symbols.map((s,i)=><div className={'stock-token token-'+i} key={i}><Logo src={images[i] || samples[i]} zoom={logoSettings[i]?.zoom} background={logoSettings[i]?.background} alt={s}/></div>)}
 </div>;
}
const ForwardPoster=React.forwardRef(Poster);
function Preview({children}) { const host=useRef(); const [scale,setScale]=useState(0.5); useEffect(()=>{const update=()=>setScale(host.current.clientWidth/1200); update(); const observer=new ResizeObserver(update); observer.observe(host.current); return ()=>observer.disconnect()},[]); return <div className="stock-preview-scale" ref={host}><div style={{transform:`scale(${scale})`,transformOrigin:'top left'}}>{children}</div></div> }
export default function Stock() {
 const [count,setCount]=useState(1), [symbols,setSymbols]=useState(toolConfig.initialSymbols), [images,setImages]=useState([]), [logoSettings,setLogoSettings]=useState([]), [locale,setLocale]=useState('en-US'), [copies,setCopies]=useState(translations), [busy,setBusy]=useState(false), [error,setError]=useState(''); const ref=useRef();
 useEffect(()=>{document.title=toolConfig.name},[]);
 const activeSymbols=symbols.slice(0,count);
 const changeCount=(n)=>setCount(n);
 const updateSymbol=(i,value)=>{setError('');setSymbols(a=>a.map((x,j)=>j===i?value.toUpperCase():x))};
 const upload=(i,file)=>{if(!file)return; const reader=new FileReader(); reader.onload=()=>{setImages(a=>{let b=[...a];b[i]=reader.result;return b});updateLogo(i,{zoom:1})};reader.readAsDataURL(file)};
 const updateLogo=(i,patch)=>setLogoSettings(a=>{const b=[...a];b[i]={zoom:1,background:'transparent',...b[i],...patch};return b});
 const copy=copies[locale];
 const render=async(code)=>{setLocale(code);await new Promise(r=>setTimeout(r,120));await document.fonts.ready;return toPng(ref.current,{pixelRatio:1,cacheBust:false});};
 const download=async(all)=>{if(activeSymbols.some(s=>!s.trim())){setError('请填写所有标的代码后再导出。');document.getElementById(`symbol-${activeSymbols.findIndex(s=>!s.trim())}`)?.focus();return} setError('');setBusy(true);const old=locale;try{if(all){const zip=new JSZip();for(const code of Object.keys(copies)){const png=await render(code);zip.file(`${code}.png`,png.split(',')[1],{base64:true})}const url=URL.createObjectURL(await zip.generateAsync({type:'blob'}));const a=document.createElement('a');a.href=url;a.download=`${activeSymbols.join('-')}.zip`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}else{const a=document.createElement('a');a.href=await render(locale);a.download=`${activeSymbols.join('-')}-${locale}.png`;a.click()}}catch(e){setError('导出失败：'+e.message+'。请重试。')}finally{setLocale(old);setBusy(false)}};
 return (
  <>
   <a className="skip-link" href="#stock-preview">跳转到海报预览</a>
   <main className="stock-app">
    <header className="studio-bar">
     <div className="studio-identity"><span className="studio-brand-mark" aria-hidden="true"><img src={asset('imgLogo.svg')} alt="" width="25" height="19"/></span><div><span className="studio-brand-name">MEXC <span>CREATIVE TOOLS</span></span><span className="studio-brand-sub">创意素材工作台</span></div></div>
     <div className="studio-bar-right"><span className="studio-bar-divider" aria-hidden="true"/><span className="studio-bar-context">{toolConfig.shortName}</span><span className="studio-status"><span aria-hidden="true"/> 工作台</span></div>
    </header>
    <div className="studio-content">
     <div className="studio-page-heading"><div><div className="studio-eyebrow"><span>CREATIVE STUDIO</span><i aria-hidden="true"/> 海报生成</div><h1>{toolConfig.shortName}</h1><p>{toolConfig.description}</p></div><div className="studio-heading-meta"><span className="studio-meta-dot" aria-hidden="true"/> 本地实时预览</div></div>
     <div className="stock-workspace">
      <section className="stock-panel" aria-labelledby="editor-heading">
       <div className="studio-panel-heading"><div><span className="studio-kicker">POSTER SETTINGS</span><h2 id="editor-heading">海报设置</h2><p>编辑内容后，右侧将实时更新。</p></div><span className="studio-panel-number">01</span></div>
       <fieldset className="studio-editor-fields" disabled={busy} aria-label="海报编辑设置">
       <div className="studio-section">
        <div className="studio-section-heading"><div><h3>标的配置</h3><p>选择海报中展示的标的数量</p></div><span className="studio-section-index">01</span></div>
        <span className="stock-field-label" id="stock-count-label">标的数量</span>
        <div className="stock-count" role="group" aria-labelledby="stock-count-label">{[1,2,3].map(n=><button type="button" aria-pressed={count===n} className={count===n?'active':''} onClick={()=>changeCount(n)} key={n}>{n} 个标的</button>)}</div>
        {activeSymbols.map((symbol,i)=><div className="stock-field" key={i}>
         <div className="studio-field-heading"><label htmlFor={`symbol-${i}`}>标的 {String(i+1).padStart(2,'0')}</label><span>STOCK SYMBOL</span></div>
         <input id={`symbol-${i}`} name={`symbol-${i}`} autoComplete="off" spellCheck={false} aria-invalid={Boolean(error && !symbol.trim())} aria-describedby={error && !symbol.trim() ? `symbol-error-${i}` : undefined} value={symbol} onChange={e=>updateSymbol(i,e.target.value)} placeholder="例如 TLN…"/>
         {error && !symbol.trim() && <p id={`symbol-error-${i}`} className="studio-field-error">请填写标的代码。</p>}
         <label className="stock-upload"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M12 15V4m0 0L8 8m4-4 4 4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg><span>{images[i] ? '更换标的图标' : '上传标的图标'}</span><small>{images[i] ? '已上传' : 'PNG / JPG'}</small><input type="file" name={`logo-${i}`} accept="image/*" onChange={e=>upload(i,e.target.files[0])}/></label>
         {images[i] && <div className="stock-logo-editor"><div className="stock-logo-editor-preview"><Logo src={images[i]} zoom={logoSettings[i]?.zoom} background={logoSettings[i]?.background} alt={`标的 ${i+1} 图标裁切预览`}/></div><div className="stock-logo-controls"><label htmlFor={`zoom-${i}`}>缩放范围 <span>{Math.round((logoSettings[i]?.zoom ?? 1)*100)}%</span></label><input id={`zoom-${i}`} name={`zoom-${i}`} type="range" min="0.5" max="3" step="0.01" value={logoSettings[i]?.zoom ?? 1} onChange={e=>updateLogo(i,{zoom:Number(e.target.value)})}/><label htmlFor={`background-${i}`}>图标底色</label><select id={`background-${i}`} name={`background-${i}`} value={logoSettings[i]?.background ?? 'transparent'} onChange={e=>updateLogo(i,{background:e.target.value})}><option value="transparent">透明</option><option value="#ffffff">白色</option><option value="#000000">黑色</option></select></div></div>}
        </div>)}
        <p className="studio-hint">未上传时使用示例图标。上传后可调整裁切范围及底色。</p>
       </div>
       <div className="studio-section studio-section-copy">
        <div className="studio-section-heading"><div><h3>语言与文案</h3><p>按语言预览并编辑海报内容</p></div><span className="studio-section-index">02</span></div>
        <label className="studio-select-label" htmlFor="stock-locale">预览语言</label>
        <select id="stock-locale" name="locale" value={locale} onChange={e=>setLocale(e.target.value)}>{Object.keys(copies).map(c=><option key={c}>{c}</option>)}</select>
        <details className="stock-copy"><summary className="studio-copy-heading"><span className="studio-copy-title">编辑当前语言文案</span><span className="studio-copy-locale">{locale}</span><svg className="studio-copy-chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></summary><div className="studio-copy-fields">{copy.map((line,i)=><label className="stock-copy-field" key={i}><span>{['顶部标签','权益文案 1','权益文案 2','权益文案 3'][i]}</span><input name={`copy-${i}`} autoComplete="off" value={line} onChange={e=>setCopies(a=>({...a,[locale]:a[locale].map((v,j)=>j===i?e.target.value:v)}))}/></label>)}</div></details>
       </div>
       </fieldset>
       <div className="studio-export"><div className="studio-export-heading"><div><h3>导出海报</h3><p>PNG · 1200 × 1200 px</p></div><span>03</span></div><p id="stock-error-message" className="stock-error" role="status" aria-live="polite">{error}</p><p className="stock-export-status" role="status" aria-live="polite">{busy ? '正在生成海报，请稍候…' : ''}</p><button type="button" className="stock-primary" disabled={busy} onClick={()=>download(true)}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0 4-4m-4 4-4-4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>{busy?'正在生成…':'下载全部语言 ZIP'}</button><button type="button" className="stock-secondary" disabled={busy} onClick={()=>download(false)}>下载当前海报 PNG</button><p className="studio-export-note">全部导出包含 {Object.keys(copies).length} 种语言</p></div>
      </section>
      <section className="stock-preview" id="stock-preview" aria-labelledby="stock-preview-heading" tabIndex={-1}>
       <div className="studio-preview-top"><div><span className="studio-kicker">LIVE PREVIEW</span><h2 id="stock-preview-heading">实时预览</h2><p>内容修改将同步显示在画布中</p></div><div className="studio-preview-badges"><span><i aria-hidden="true"/> 实时</span><span>1 : 1</span></div></div>
       <div className="stock-preview-frame"><div className="studio-artboard"><Preview><ForwardPoster ref={ref} symbols={activeSymbols} images={images} logoSettings={logoSettings} locale={locale} copy={copy}/></Preview></div></div>
       <div className="studio-preview-footer"><div><span className="studio-preview-file">{toolConfig.shortName}</span><span className="studio-preview-separator" aria-hidden="true"/> <span>1200 × 1200 px</span></div><span className="studio-locale-tag">{locale}</span></div>
      </section>
     </div>
     <footer className="studio-footer"><span>MEXC CREATIVE TOOLS</span><span>为每一次发布做好准备</span></footer>
    </div>
   </main>
  </>
 );
}
