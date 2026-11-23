import {useState,useEffect,useRef} from 'react'
import {html} from 'htm/react'
import {motion} from 'framer-motion'
import {Move,RotateCw,Palette,Trash2,Shuffle,RotateCcw,FolderOpen,Volume2,VolumeX} from 'lucide-react'
import {Room} from './Room.js'
import {F,CATS,WALLS,FLOORS,LIGHTS,THEMES,SW,CHECK,INR} from './data.js'

function Card({id,th,onAdd}){const s=F[id];return html`<div className="card"><img src=${th[id]} alt=${s.n}/><div className="font-extrabold" style=${{fontSize:12,lineHeight:1.2}}>${s.n}</div><div style=${{color:'var(--mut)',fontSize:12}}>${INR(s.pr)}</div><button className="btn s" onClick=${()=>onAdd(id)}>ADD TO ROOM</button></div>`}

export default function App(){
 const cv=useRef(),tb=useRef(),S=useRef(),tm=useRef();
 const[view,setView]=useState('home'),[list,setList]=useState([]),[sel,setSel]=useState(null),[cat,setCat]=useState('Bedroom'),[tab,setTab]=useState('shop'),[wall,setWall]=useState('White'),[floor,setFloor]=useState('Oak wood'),[light,setLight]=useState('Daylight'),[theme,setTheme]=useState(''),[muted,setMuted]=useState(false),[toast,setToast]=useState(''),[buy,setBuy]=useState(0),[mv,setMv]=useState(false),[col,setCol]=useState(false),[th,setTh]=useState(null),[sc,setSc]=useState('All');
 const flash=m=>{setToast(m);clearTimeout(tm.current);tm.current=setTimeout(()=>setToast(''),2200)};
 useEffect(()=>{const R=new Room(document.getElementById('cv'));S.current=R;
  R.cb={list:setList,sel:u=>{setSel(u);setCol(false);setMv(false);R.moveMode=false},mv:setMv,proj:(x,y,v)=>{const e=tb.current;if(e){e.style.visibility=v?'visible':'hidden';e.style.transform='translate('+x+'px,'+y+'px) translate(-50%,-100%)'}}};
  setTh(R.thumbs);R.start();return()=>R.stop()},[]);
 useEffect(()=>{S.current&&S.current.setMode(view==='build'?'build':view==='home'?'home':'other')},[view]);
 useEffect(()=>{S.current&&S.current.setWall(wall)},[wall]);
 useEffect(()=>{S.current&&S.current.setFloor(floor)},[floor]);
 useEffect(()=>{S.current&&S.current.setLight(light)},[light]);
 useEffect(()=>{S.current&&(S.current.moveMode=mv)},[mv]);
 useEffect(()=>{S.current&&(S.current.muted=muted)},[muted]);
 if(!th)return html`<div className="fixed inset-0 grid place-items-center px" style=${{color:'#fff',zIndex:50}}>Loading blocks…</div>`;
 const R=S.current,go=v=>{setView(v);R&&R.beep(600,.05)},add=id=>{R.add(id);flash(F[id].n+' dropped into your room')};
 const g={};list.forEach(i=>{g[i.id]=(g[i.id]||0)+1});const rows=Object.keys(g),total=list.reduce((a,i)=>a+F[i.id].pr,0),have=new Set(list.map(i=>i.id)),pct=Math.round(CHECK.filter(c=>c.some(x=>have.has(x))).length/CHECK.length*100),LIM=50000;
 const status=!list.length?'Add pieces to start':total>LIM?'Over budget by '+INR(total-LIM):pct===100?'Challenge complete!':INR(LIM-total)+' left to spend';
 const applyTheme=n=>{const t=THEMES[n];setWall(t[0]);setFloor(t[1]);setLight(t[2]);setTheme(n);flash(n+' applied')};
 const selItem=list.find(i=>i.uid===sel);
 const save=()=>{try{localStorage.setItem('ikea-mc-room',JSON.stringify({it:R.ser(),wall,floor,light}));flash('Room saved on this device');R.beep(660,.15,'triangle',990)}catch(e){flash('Saving is blocked in this browser')}};
 const load=()=>{try{const d=JSON.parse(localStorage.getItem('ikea-mc-room'));if(!d)return flash('No saved room yet');setWall(d.wall);setFloor(d.floor);setLight(d.light);R.load(d.it);flash('Saved room loaded')}catch(e){flash('No saved room yet')}};
 const cartBox=html`<div className="flex flex-col h-full"><div className="ttl">MY DREAM ROOM</div><div style=${{flex:1,overflow:'auto',margin:'8px 0'}}>${rows.length?rows.map(id=>html`<div className="ln" key=${id}><span>${F[id].n}${g[id]>1?' ×'+g[id]:''}</span><b>${INR(F[id].pr*g[id])}</b></div>`):html`<p style=${{color:'var(--mut)'}}>Your room is empty. Pick a piece from the shop and it drops right in.</p>`}</div>
  <div className="ln" style=${{border:0,fontSize:17}}><b>TOTAL</b><b>${INR(total)}</b></div>
  <div className="flex gap-2 mt-2"><button className="btn s flex-1 g" onClick=${save}>SAVE MY ROOM</button><button className="btn s flex-1" onClick=${()=>{if(!list.length)return flash('Add something first');setBuy(1)}}>BUY MY ROOM</button></div>
  <div style=${{color:'var(--mut)',fontSize:11,marginTop:8}}>Fictional collaboration. All prices are demo prices, not live IKEA prices.</div></div>`;
 return html`<div>
 <div className="nav"><button className="logo" onClick=${()=>go('home')}><i>IKEA</i><u>×</u><b>MINECRAFT</b></button>
  ${[['home','Home'],['build','Build Your Room'],['worlds','Explore Worlds'],['shop','Furniture Shop'],['cart','My Cart'+(list.length?' ('+list.length+')':'')]].map(a=>html`<button key=${a[0]} className=${'nb'+(view===a[0]?' on':'')} onClick=${()=>go(a[0])}>${a[1]}</button>`)}</div>

 ${view==='home'&&html`<div className="hero fixed" style=${{left:'5vw',top:'50%',transform:'translateY(-50%)',maxWidth:640,zIndex:10}}>
  <h1>YOUR WORLD.<br/>YOUR RULES.<br/>YOUR HOME.</h1>
  <p style=${{color:'#fff',fontSize:19,fontWeight:800,margin:'22px 0 28px',maxWidth:470,textShadow:'0 2px 8px #0008'}}>What if your Minecraft world came with real furniture? Build your dream space with IKEA.</p>
  <div className="flex gap-3 flex-wrap"><button className="btn" style=${{fontSize:15,padding:'15px 24px'}} onClick=${()=>go('build')}>ENTER YOUR WORLD</button><button className="btn g" style=${{fontSize:15,padding:'15px 24px'}} onClick=${()=>go('shop')}>EXPLORE FURNITURE</button></div>
  <p style=${{color:'#ffffffcc',fontSize:12,marginTop:22}}>A fan-made concept. Not affiliated with IKEA or Mojang. Demo prices only.</p></div>`}

 ${view==='build'&&html`<div className="fixed inset-0 pointer-events-none" style=${{zIndex:15}}>
  <div className="panel pointer-events-auto absolute flex flex-col" style=${{left:16,top:72,bottom:16,width:310,padding:14}}>
   <div className="flex gap-2 mb-3">${[['shop','Furniture'],['style','Room style']].map(a=>html`<button key=${a[0]} className=${'chip'+(tab===a[0]?' on':'')} onClick=${()=>setTab(a[0])}>${a[1]}</button>`)}</div>
   ${tab==='shop'?html`<div className="flex gap-1 flex-wrap mb-3">${Object.keys(CATS).map(c=>html`<button key=${c} className=${'chip'+(cat===c?' on':'')} onClick=${()=>setCat(c)}>${c}</button>`)}</div>
    <div className="grid grid-cols-2 gap-2 overflow-auto pr-1" style=${{flex:1,alignContent:'start'}}>${CATS[cat].map(id=>html`<${Card} key=${id} id=${id} th=${th} onAdd=${add}/>`)}</div>`
   :html`<div className="overflow-auto pr-1" style=${{flex:1}}>
    <div className="ttl mb-2">WALL COLOURS</div><div className="flex gap-2 mb-4">${Object.keys(WALLS).map(n=>html`<button key=${n} title=${n} className=${'sw'+(wall===n?' on':'')} style=${{background:WALLS[n]}} onClick=${()=>{setWall(n);setTheme('')}}/>`)}</div>
    <div className="ttl mb-2">FLOORING</div><div className="flex gap-1 flex-wrap mb-4">${Object.keys(FLOORS).map(n=>html`<button key=${n} className=${'chip'+(floor===n?' on':'')} onClick=${()=>{setFloor(n);setTheme('')}}>${n}</button>`)}</div>
    <div className="ttl mb-2">LIGHTING</div><div className="flex gap-1 flex-wrap mb-4">${Object.keys(LIGHTS).map(n=>html`<button key=${n} className=${'chip'+(light===n?' on':'')} onClick=${()=>{setLight(n);setTheme('')}}>${n}</button>`)}</div>
    <div className="ttl mb-2">THEMES</div><div className="flex flex-col gap-2">${Object.keys(THEMES).map(n=>html`<button key=${n} className=${'chip'+(theme===n?' on':'')} style=${{textAlign:'left',borderRadius:12,padding:'9px 12px'}} onClick=${()=>applyTheme(n)}>${n}</button>`)}</div></div>`}
  </div>
  <div className="panel pointer-events-auto absolute" style=${{right:16,top:72,bottom:16,width:300,padding:16}}>${cartBox}</div>
  <div className="panel pointer-events-auto absolute flex items-center gap-4" style=${{left:'50%',bottom:16,transform:'translateX(-50%)',padding:'10px 16px',maxWidth:'calc(100vw - 700px)',minWidth:520}}>
   <div style=${{flex:1}}><div className="flex justify-between"><span className="ttl">ROOM COMPLETION</span><b>${pct}%</b></div><div className="bar"><i style=${{width:pct+'%'}}/></div></div>
   <div style=${{flex:1.3}}><div className="flex justify-between"><span className="ttl">UNDER ₹50,000</span><b style=${{color:total>LIM?'#d93a2f':'inherit'}}>${INR(total)}</b></div><div className="bar"><i style=${{width:Math.min(100,total/LIM*100)+'%',background:total>LIM?'#d93a2f':pct===100?'#3f9d4a':'var(--blue)'}}/></div><div style=${{fontSize:11,color:'var(--mut)'}}>${status}</div></div>
   <div className="flex gap-2"><button className="btn s b" onClick=${()=>R.random()}><${Shuffle} size=${14}/> RANDOM</button><button className="btn s g" onClick=${()=>R.clear()}><${RotateCcw} size=${14}/> RESET</button><button className="btn s g" onClick=${load}><${FolderOpen} size=${14}/> LOAD</button><button className="btn s g" onClick=${()=>setMuted(!muted)}>${muted?html`<${VolumeX} size=${14}/>`:html`<${Volume2} size=${14}/>`}${muted?' SOUND OFF':' SOUND ON'}</button></div></div>
  <div className="absolute px" style=${{top:74,left:'50%',transform:'translateX(-50%)',color:'#fff',fontSize:11,textShadow:'0 1px 6px #000a',textAlign:'center',whiteSpace:'nowrap'}}>Drag furniture to place it. Drag empty space to orbit. Scroll to zoom. WASD to walk. R rotates.</div>
 </div>`}
 <div className="tb" ref=${tb}>${view==='build'&&sel&&html`<div className="panel pop" style=${{padding:8,borderRadius:14}}><div className="flex gap-1"><button className=${'btn s'+(mv?' b':' g')} onClick=${()=>setMv(!mv)}><${Move} size=${14}/> MOVE</button><button className="btn s g" onClick=${()=>R.rot()}><${RotateCw} size=${14}/> ROTATE</button><button className="btn s g" onClick=${()=>setCol(!col)}><${Palette} size=${14}/> CHANGE COLOUR</button><button className="btn s" style=${{background:'#e8504a',color:'#fff',boxShadow:'0 4px 0 #9b2a24'}} onClick=${()=>R.del()}><${Trash2} size=${14}/> DELETE</button></div>
  ${col&&html`<div className="flex gap-1 mt-2 justify-center">${SW.map(c=>html`<button key=${c} className=${'sw'+(selItem&&selItem.color===c?' on':'')} style=${{background:c}} onClick=${()=>R.recolor(c)}/>`)}</div>`}
  ${mv&&html`<div style=${{fontSize:11,color:'var(--mut)',textAlign:'center',marginTop:6}}>Click the floor to move it here</div>`}</div>`}</div>

 ${view==='worlds'&&html`<div className="page"><h2 className="px" style=${{color:'#fff',fontSize:30,margin:'0 0 6px'}}>Explore Worlds</h2><p style=${{color:'#fff',margin:'0 0 22px'}}>Pick a world. It sets the walls, floor and light, then drops you into the builder.</p>
  <div className="grid gap-4" style=${{gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))'}}>${Object.keys(THEMES).map(n=>{const t=THEMES[n];return html`<div key=${n} className="panel" style=${{padding:14}}>
   <div style=${{height:130,borderRadius:14,background:'linear-gradient(180deg,'+LIGHTS[t[2]].bg+' 0%,'+WALLS[t[0]]+' 38%,'+FLOORS[t[1]][0]+' 38%)',boxShadow:'inset 0 0 0 3px #0002'}}/>
   <div className="px" style=${{margin:'12px 0 4px',color:'var(--blue)',fontSize:13}}>${n}</div><div style=${{color:'var(--mut)',marginBottom:10}}>${t[3]}</div><div style=${{fontSize:12,marginBottom:10}}>${t[0]} walls · ${t[1]} · ${t[2]}</div>
   <button className="btn s" onClick=${()=>{applyTheme(n);go('build')}}>ENTER WORLD</button></div>`})}</div></div>`}

 ${view==='shop'&&html`<div className="page"><h2 className="px" style=${{color:'#fff',fontSize:30,margin:'0 0 6px'}}>Furniture Shop</h2><p style=${{color:'#fff',margin:'0 0 14px'}}>Everything here is built from blocks. Prices are demo prices.</p>
  <div className="flex gap-2 flex-wrap mb-4">${['All',...Object.keys(CATS)].map(c=>html`<button key=${c} className=${'chip'+(sc===c?' on':'')} onClick=${()=>setSc(c)}>${c}</button>`)}</div>
  <div className="grid gap-3" style=${{gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))'}}>${(sc==='All'?Object.keys(F):CATS[sc]).map(id=>html`<div key=${id} className="panel" style=${{padding:8}}><${Card} id=${id} th=${th} onAdd=${add}/></div>`)}</div></div>`}

 ${view==='cart'&&html`<div className="page"><div className="panel mx-auto" style=${{maxWidth:640,padding:22}}><h2 className="px" style=${{color:'var(--blue)',fontSize:22,margin:'0 0 12px'}}>My Cart</h2>
  ${rows.length?rows.map(id=>html`<div className="ln items-center" key=${id}><span style=${{flex:1}}>${F[id].n}</span><span className="flex items-center gap-2"><button className="chip" onClick=${()=>R.removeOne(id)}>−</button><b>${g[id]}</b><button className="chip" onClick=${()=>R.add(id)}>+</button></span><b style=${{width:90,textAlign:'right'}}>${INR(F[id].pr*g[id])}</b></div>`):html`<p style=${{color:'var(--mut)'}}>Nothing here yet. Build a room or browse the shop.</p>`}
  <div className="ln" style=${{fontSize:18,border:0,marginTop:8}}><b>TOTAL</b><b>${INR(total)}</b></div>
  <div className="flex gap-2 mt-3"><button className="btn g" onClick=${()=>go('build')}>BACK TO ROOM</button><button className="btn" onClick=${()=>{if(!list.length)return flash('Add something first');setBuy(1)}}>BUY MY ROOM</button></div></div></div>`}

 ${buy>0&&html`<div className="fixed inset-0 grid place-items-center" style=${{zIndex:60,background:'#0b1a2ecc',backdropFilter:'blur(6px)'}}><div className="panel pop" style=${{width:'min(560px,92vw)',padding:24,maxHeight:'88vh',overflow:'auto'}}>
  ${buy===1?html`<div className="ttl" style=${{fontSize:16,marginBottom:10}}>CHECKOUT</div><p style=${{margin:'0 0 12px',color:'var(--mut)'}}>Your dream room, ready to ship. Demo only: no payment is taken.</p>
   ${rows.map(id=>html`<div className="ln" key=${id}><span>${F[id].n} ×${g[id]}</span><b>${INR(F[id].pr*g[id])}</b></div>`)}
   <div className="ln"><span>Delivery to Mumbai</span><b style=${{color:'#3f9d4a'}}>Free</b></div><div className="ln" style=${{fontSize:19,border:0}}><b>TOTAL</b><b>${INR(total)}</b></div>
   <div className="grid grid-cols-2 gap-2 my-3"><input placeholder="Full name" style=${{padding:10,borderRadius:10,border:'2px solid var(--line)',background:'var(--soft)',color:'var(--ink)'}}/><input placeholder="Pincode" style=${{padding:10,borderRadius:10,border:'2px solid var(--line)',background:'var(--soft)',color:'var(--ink)'}}/></div>
   <div className="flex gap-2"><button className="btn g" onClick=${()=>setBuy(0)}>KEEP BUILDING</button><button className="btn" onClick=${()=>{setBuy(2);R.beep(660,.3,'triangle',1320)}}>PLACE ORDER</button></div>`
  :html`<div style=${{textAlign:'center'}}><div className="px" style=${{fontSize:26,color:'var(--blue)'}}>ORDER CONFIRMED</div><p style=${{margin:'12px 0 18px'}}>Your ${list.length} pieces worth ${INR(total)} are on their way. Not really! This is a demo, so nothing was ordered.</p><button className="btn" onClick=${()=>setBuy(0)}>BACK TO MY ROOM</button></div>`}</div></div>`}

 ${toast&&html`<${motion.div} initial=${{opacity:0,y:20,x:'-50%'}} animate=${{opacity:1,y:0,x:'-50%'}} className="px" style=${{position:'fixed',bottom:view==='build'?100:30,left:'50%',zIndex:70,background:'var(--blue)',color:'#fff',padding:'10px 16px',borderRadius:12,fontSize:12,boxShadow:'0 4px 0 #003b73'}}>${toast}<//>`}
 </div>`}
