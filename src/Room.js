import * as THREE from 'three'
import {F,N,WALLS,FLOORS,LIGHTS,bo} from './data.js'
function makeTex(base,v,kind){const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d'),b=new THREE.Color(base);
 for(let i=0;i<16;i++)for(let j=0;j<16;j++){let k=1+(Math.random()-.5)*v;if(kind==='plank'&&(j%8===0||i===(j<8?3:11)))k*=.78;if(kind==='tile'&&(i===0||j===0))k*=.8;if(kind==='stone'&&Math.random()<.1)k*=.8;x.fillStyle='rgb('+[b.r,b.g,b.b].map(q=>Math.min(255,q*255*k|0)).join(',')+')';x.fillRect(i,j,1,1)}
 const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}

export class Room{
constructor(cv){const T=THREE;this.cv=cv;this.mode='home';this.uid=0;this.items=[];this.heroItems=[];this.cb={};this.keys={};this.mc={};this.gc={};this.sel=null;this.moveMode=false;this.muted=false;this.lampI=.1;this.wm=[];
 this.rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const rd=this.rd=new T.WebGLRenderer({canvas:cv,antialias:true});rd.setPixelRatio(Math.min(devicePixelRatio,2));rd.shadowMap.enabled=true;rd.shadowMap.type=T.PCFSoftShadowMap;
 const s=this.s=new T.Scene();this.cam=new T.PerspectiveCamera(40,1,.1,200);
 this.amb=new T.AmbientLight(0xffffff,.8);s.add(this.amb);
 const sun=this.sun=new T.DirectionalLight(0xffffff,.8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=sc.bottom=-13;sc.right=sc.top=13;sc.near=1;sc.far=60;sun.shadow.bias=-.0006;s.add(sun,sun.target);sun.target.position.set(5,0,5);
 this.ceil=new T.PointLight(0xffd9a0,.2,24);this.ceil.position.set(5,3.3,5);s.add(this.ceil);
 this.nz=makeTex('#ffffff',.2,'flat');this.nzW=makeTex('#f4f4f4',.12,'flat');
 this.rc=new T.Raycaster();this.plane=new T.Plane(new T.Vector3(0,1,0),0);this.v=new T.Vector3();
 this.ft={};for(const k in FLOORS){const t=makeTex(FLOORS[k][0],.16,FLOORS[k][1]);t.repeat.set(N,N);this.ft[k]=t}
 this.floorM=new T.MeshLambertMaterial({map:this.ft['Oak wood']});
 const fl=new T.Mesh(new T.BoxGeometry(N,.3,N),this.floorM);fl.position.set(N/2,-.15,N/2);fl.receiveShadow=true;s.add(fl);
 const gt=makeTex('#5fa84a',.3,'flat');gt.repeat.set(60,60);const gr=new T.Mesh(new T.PlaneGeometry(120,120),new T.MeshLambertMaterial({map:gt}));gr.rotation.x=-Math.PI/2;gr.position.set(5,-.31,5);gr.receiveShadow=true;s.add(gr);
 const blk=(back,a0,a1,y0,y1,dep,c,m,cast)=>{const w=a1-a0,h=y1-y0,me=new T.Mesh(new T.BoxGeometry(back?w:dep,h,back?dep:w),m);me.position.set(back?a0+w/2:c,y0+h/2,back?c:a0+w/2);me.castShadow=cast;me.receiveShadow=true;s.add(me);return me};
 const white=new T.MeshLambertMaterial({color:0xffffff}),glass=new T.MeshBasicMaterial({color:0xbfe6ff,transparent:true,opacity:.22,depthWrite:false});
 [true,false].forEach(back=>{const pc=(a0,a1,y0,y1)=>{const t=this.nzW.clone();t.needsUpdate=true;t.repeat.set((a1-a0)*1.5,(y1-y0)*1.5);const m=new T.MeshLambertMaterial({map:t});this.wm.push(m);blk(back,a0,a1,y0,y1,.4,-.2,m,true)};
  pc(0,6,0,4);pc(9,N,0,4);pc(6,9,0,1.2);pc(6,9,3.1,4);
  [[5.9,9.1,1.1,1.2],[5.9,9.1,3.1,3.2],[5.9,6,1.2,3.1],[9,9.1,1.2,3.1],[7.46,7.54,1.2,3.1],[6,9,2.1,2.18]].forEach(b=>blk(back,b[0],b[1],b[2],b[3],.5,-.2,white,false));
  blk(back,6,9,1.2,3.1,.05,-.2,glass,false)});
 for(let i=0;i<3;i++){const m=new T.Mesh(new T.BoxGeometry(N,.3,.3),new T.MeshLambertMaterial({color:0x6b4a2b,map:this.nz}));m.position.set(5,3.95,2+i*3);m.castShadow=true;s.add(m)}
 const cord=new T.Mesh(new T.BoxGeometry(.05,.5,.05),new T.MeshBasicMaterial({color:0x222222}));cord.position.set(5,3.6,5);s.add(cord);
 const pend=new T.Mesh(new T.BoxGeometry(.6,.3,.6),new T.MeshBasicMaterial({color:0xffe08a}));pend.position.set(5,3.25,5);s.add(pend);
 [[2,-7],[8,-9],[13,-6],[-6,3],[-8,9],[14,6]].forEach(p=>{const g=new T.Group();[[.5,2,.5,0,1,'#6b4a2b'],[2,2,2,0,3,'#3f8f3a'],[1.2,1.2,1.2,0,4.3,'#4fa84a']].forEach(a=>{const m=new T.Mesh(this.geo(a[0],a[1],a[2]),this.mat(a[5]));m.position.set(a[3],a[4],0);m.castShadow=true;g.add(m)});g.position.set(p[0],0,p[1]);s.add(g)});
 this.orb=new T.Mesh(new T.BoxGeometry(3,3,.5),new T.MeshBasicMaterial({color:0xfff6a0}));this.orb.position.set(6,11,-22);s.add(this.orb);
 this.grid=new T.GridHelper(N,N,0x000000,0x000000);this.grid.position.set(N/2,.02,N/2);this.grid.material.transparent=true;this.grid.material.opacity=.28;s.add(this.grid);
 this.ind=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:0x5be37d,transparent:true,opacity:.5,depthWrite:false}));this.ind.rotation.x=-Math.PI/2;this.ind.visible=false;s.add(this.ind);
 this.bh=new T.BoxHelper(new T.Object3D(),0xffdb00);this.bh.visible=false;s.add(this.bh);
 this.root=new T.Group();this.hero=new T.Group();s.add(this.root,this.hero);
 this.pt=[];const pc=['#ffdb00','#0058a3','#ffffff','#5d8f35','#e8504a'];for(let i=0;i<46;i++){const z=.1+Math.random()*.16,m=new T.Mesh(new T.BoxGeometry(z,z,z),new T.MeshBasicMaterial({color:pc[i%5],transparent:true,opacity:.75}));m.position.set(Math.random()*16-3,Math.random()*7,Math.random()*16-3);m.userData={sp:.15+Math.random()*.4,ph:Math.random()*6};s.add(m);this.pt.push(m)}
 const ch=this.ch=new T.Group(),bx=(g,x,y,z,w,h,d,c)=>{const m=new T.Mesh(this.geo(w,h,d),this.mat(c));m.position.set(x,y,z);m.castShadow=true;g.add(m)};
 bx(ch,-.14,.4,0,.26,.8,.28,'#3b4a9c');bx(ch,.14,.4,0,.26,.8,.28,'#3b4a9c');bx(ch,0,1.15,0,.56,.7,.3,'#00a7b5');
 this.arms=[-1,1].map(k=>{const a=new T.Group();a.position.set(k*.4,1.45,0);bx(a,0,-.33,0,.22,.7,.24,'#c68e63');ch.add(a);return a});
 const hd=this.head=new T.Group();hd.position.set(0,1.5,0);bx(hd,0,.25,0,.5,.5,.5,'#c68e63');bx(hd,0,.52,0,.52,.12,.52,'#4a2c17');[-.12,.12].forEach(x=>{bx(hd,x,.28,.255,.1,.1,.02,'#fff');bx(hd,x,.28,.265,.05,.08,.02,'#2a3a8c')});ch.add(hd);
 ch.position.set(8.5,0,8.5);ch.rotation.y=-Math.PI*.75;s.add(ch);this.blk={cx:8,cz:8,rot:0,s:{w:1,d:1}};
 this.setLight('Daylight');
 [['bed',1,0,0],['nightstand',3,0,0],['wardrobe',0,3,1],['bookshelf',4,0,0],['desk',6,0,0],['chair',7,1,0],['computer',7,0,0],['desklamp',6,0,0],['floorlamp',9,0,0],['plant',9,3,0],['plant',0,6,0],['rug',3,4,0],['art',1,0,0],['clock',3,0,0]].forEach(a=>this.mk(a[0],null,a[1],a[2],a[3],true));
 this.thumbs=this.mkThumbs();
 this.az=this.taz=.5;this.el=this.tel=.52;this.rad=this.trad=19;this.tg=new T.Vector3(5,1.2,5);this.ho=.17;
 cv.addEventListener('pointerdown',e=>this.down(e));addEventListener('pointermove',e=>this.move(e));addEventListener('pointerup',e=>this.up(e));
 cv.addEventListener('wheel',e=>{if(this.mode==='build'){e.preventDefault();this.trad=Math.max(7,Math.min(30,this.trad*(1+e.deltaY*.001)))}},{passive:false});
 cv.addEventListener('contextmenu',e=>e.preventDefault());
 addEventListener('keydown',e=>this.kd(e));addEventListener('keyup',e=>{this.keys[e.key.toLowerCase()]=0});
 this.onR=()=>{rd.setSize(innerWidth,innerHeight,false);this.cam.aspect=innerWidth/innerHeight;this.cam.updateProjectionMatrix()};addEventListener('resize',this.onR);this.onR()}
geo(w,h,d){const k=[w,h,d].join();return this.gc[k]||(this.gc[k]=new THREE.BoxGeometry(w,h,d))}
mat(c){return this.mc[c]||(this.mc[c]=c[0]==='*'?new THREE.MeshBasicMaterial({color:c.slice(1)}):new THREE.MeshLambertMaterial({color:c,map:this.nz}))}
build(s,col,it){const g=new THREE.Group();for(const[x,y,z,w,h,d,c]of s.p){const m=new THREE.Mesh(this.geo(w,h,d),this.mat(c==='m'?col:c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;m.userData.item=it;g.add(m)}
 if(s.light){const pl=new THREE.PointLight(0xffd9a0,this.lampI,7);pl.position.set(0,s.ly||1.8,0);g.add(pl);g.userData.pl=pl}return g}
mkThumbs(){const T=THREE,R=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});R.setSize(168,168);R.setPixelRatio(1);R.setClearColor(0xe6eef7,1);const sc=new T.Scene();sc.add(new T.AmbientLight(0xffffff,.85));const dl=new T.DirectionalLight(0xffffff,.7);dl.position.set(4,8,6);sc.add(dl);const cm=new T.PerspectiveCamera(32,1,.1,50),o={};
 for(const id in F){const g=this.build(F[id],F[id].c,{});sc.add(g);const b=new T.Box3().setFromObject(g),c=b.getCenter(new T.Vector3()),z=b.getSize(new T.Vector3()).length();cm.position.copy(c).add(new T.Vector3(.8,.7,1.1).normalize().multiplyScalar(z*1.55));cm.lookAt(c);R.render(sc,cm);o[id]=R.domElement.toDataURL();sc.remove(g)}
 R.dispose();R.forceContextLoss&&R.forceContextLoss();return o}
setWall(n){this.wm.forEach(m=>m.color.set(WALLS[n]))}
setFloor(n){this.floorM.map=this.ft[n];this.floorM.needsUpdate=true}
setLight(n){const L=LIGHTS[n];this.s.background=new THREE.Color(L.bg);this.amb.color.set(L.amb[0]);this.amb.intensity=L.amb[1];this.sun.color.set(L.sun[0]);this.sun.intensity=L.sun[1];this.sun.position.set(...L.sun[2]);this.ceil.intensity=L.ceil;this.lampI=L.lamp;this.orb.material.color.set(L.orb[0]);this.orb.position.y=L.orb[1];
 this.items.concat(this.heroItems).forEach(i=>{if(i.g.userData.pl)i.g.userData.pl.intensity=L.lamp})}
fp(it){const s=it.s;return s.wall?[1,0]:it.rot%2?[s.d,s.w]:[s.w,s.d]}
ov(a,b){const[aw,ad]=this.fp(a),[bw,bd]=this.fp(b);return a.cx<b.cx+bw&&b.cx<a.cx+aw&&a.cz<b.cz+bd&&b.cz<a.cz+ad}
surf(it){if(!it.s.onTop)return 0;let y=0;for(const o of it.L)if(o!==it&&o.s.top&&!o.s.onTop&&this.ov(it,o))y=Math.max(y,o.s.top);return y}
clamp(it){const[w,d]=this.fp(it);it.cx=Math.max(0,Math.min(N-(it.s.wall?1:w),it.cx));if(!it.s.wall)it.cz=Math.max(0,Math.min(N-d,it.cz))}
place(it){const[w,d]=this.fp(it),g=it.g;if(it.s.wall){const b=it.rot%2===0;g.position.set(b?it.cx+.5:.06,2.7,b?.06:it.cx+.5);g.rotation.y=b?0:Math.PI/2;it.by=2.7}else{g.position.set(it.cx+w/2,0,it.cz+d/2);g.rotation.y=it.rot*Math.PI/2;it.by=this.surf(it)}g.position.y=it.by+(it.off||0)}
refresh(){this.items.forEach(i=>this.place(i))}
mk(id,col,cx,cz,rot,hero){const s=F[id],it={uid:++this.uid,id,s,color:col||s.c,cx,cz,rot,off:0,L:hero?this.heroItems:this.items,P:hero?this.hero:this.root};it.g=this.build(s,it.color,it);it.P.add(it.g);it.L.push(it);this.place(it);return it}
emit(){this.cb.list&&this.cb.list(this.items.map(i=>({uid:i.uid,id:i.id,color:i.color})))}
pop(it){it.bt=performance.now()}
spot(it){const[w,d]=this.fp(it),cells=[];for(let x=0;x<=N-w;x++)for(let z=0;z<=N-d;z++)cells.push([x,z]);
 const k=c=>it.s.flat?Math.hypot(c[0]+w/2-5,c[1]+d/2-5):c[0]+c[1];cells.sort((a,b)=>k(a)-k(b));
 for(const[x,z]of cells){it.cx=x;it.cz=z;if(it.s.flat||!this.items.concat([this.blk]).some(o=>o!==it&&!o.s.wall&&!o.s.onTop&&!o.s.flat&&this.ov(it,o)))return}it.cx=cells[0][0];it.cz=cells[0][1]}
add(id){const it=this.mk(id,null,0,0,0);const s=it.s;
 if(s.wall){const u=new Set(this.items.filter(o=>o!==it&&o.s.wall&&o.rot%2===0).map(o=>o.cx));let a=0;while(u.has(a)&&a<N-1)a++;it.cx=a}
 else if(s.onTop){let sp=null;for(const o of this.items){if(!o.s.top||o.s.onTop)continue;const[fw,fd]=this.fp(o);for(let i=0;i<fw&&!sp;i++)for(let j=0;j<fd&&!sp;j++){const c={cx:o.cx+i,cz:o.cz+j};if(!this.items.some(q=>q!==it&&q.s.onTop&&q.cx===c.cx&&q.cz===c.cz))sp=c}if(sp)break}
  if(sp){it.cx=sp.cx;it.cz=sp.cz}else this.spot(it)}
 else this.spot(it);
 this.refresh();this.pop(it);this.emit();this.beep(520,.12,'square',880);return it}
remove(it){this.root.remove(it.g);this.items.splice(this.items.indexOf(it),1);if(this.sel===it){this.sel=null;this.cb.sel&&this.cb.sel(null)}this.refresh();this.emit();this.beep(220,.18,'sawtooth',60)}
del(){this.sel&&this.remove(this.sel)}
removeOne(id){const l=this.items.filter(i=>i.id===id);l.length&&this.remove(l[l.length-1])}
clear(){this.items.slice().forEach(i=>this.root.remove(i.g));this.items.length=0;this.sel=null;this.cb.sel&&this.cb.sel(null);this.emit();this.beep(200,.25,'triangle',90)}
rot(){const it=this.sel;if(!it)return;it.rot=it.s.wall?(it.rot+1)%2:(it.rot+1)%4;this.clamp(it);this.refresh();this.beep(330,.07,'square',440)}
recolor(c){const it=this.sel;if(!it)return;it.color=c;this.root.remove(it.g);it.g=this.build(it.s,c,it);this.root.add(it.g);this.refresh();this.emit();this.beep(700,.08,'square',900)}
random(){const k=Object.keys(F);this.add(k[Math.random()*k.length|0])}
ser(){return this.items.map(i=>[i.id,i.color,i.cx,i.cz,i.rot])}
load(a){this.clear();a.forEach(x=>{this.pop(this.mk(x[0],x[1],x[2],x[3],x[4]))});this.refresh();this.emit()}
select(it){this.sel=it;this.cb.sel&&this.cb.sel(it?it.uid:null);it&&this.beep(440,.05,'square')}
beep(f,d,ty,f2){if(this.muted)return;try{const a=this.ac||(this.ac=new(window.AudioContext||window.webkitAudioContext)()),o=a.createOscillator(),g=a.createGain(),t=a.currentTime;o.type=ty||'square';o.frequency.setValueAtTime(f,t);f2&&o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(a.destination);o.start();o.stop(t+d)}catch(e){}}
ndc(e){const b=this.cv.getBoundingClientRect();return new THREE.Vector2((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1)}
pick(e){this.rc.setFromCamera(this.ndc(e),this.cam);const h=this.rc.intersectObjects(this.root.children,true)[0];return h?h.object.userData.item:null}
floorPt(e){this.rc.setFromCamera(this.ndc(e),this.cam);return this.rc.ray.intersectPlane(this.plane,new THREE.Vector3())}
moveTo(it,x,z){const[w,d]=this.fp(it);if(it.s.wall)it.cx=Math.round((it.rot%2?z:x)-.5);else{it.cx=Math.round(x-w/2);it.cz=Math.round(z-d/2)}this.clamp(it);this.refresh()}
down(e){if(this.mode!=='build')return;const h=e.button===0?this.pick(e):null;
 if(h){this.select(h);const p=this.floorPt(e),[w,d]=this.fp(h);this.drag={t:'i',ox:p?h.cx+w/2-p.x:0,oz:p?h.cz+d/2-p.z:0,mv:0}}else this.drag={t:'o',x:e.clientX,y:e.clientY,mv:0}}
move(e){const D=this.drag;if(!D)return;if(D.t==='o'){const dx=e.clientX-D.x,dy=e.clientY-D.y;D.x=e.clientX;D.y=e.clientY;D.mv+=Math.abs(dx)+Math.abs(dy);this.taz-=dx*.006;this.tel=Math.max(.15,Math.min(1.3,this.tel+dy*.005))}else{const p=this.floorPt(e);if(p&&this.sel)this.moveTo(this.sel,p.x+D.ox,p.z+D.oz)}}
up(e){const D=this.drag;this.drag=null;if(!D||this.mode!=='build'||D.t!=='o'||D.mv>5)return;
 if(this.moveMode&&this.sel){const p=this.floorPt(e);if(p){this.moveTo(this.sel,p.x,p.z);this.moveMode=false;this.cb.mv&&this.cb.mv(false);this.beep(500,.06)}}else this.select(null)}
kd(e){if(this.mode!=='build'||/INPUT|TEXTAREA/.test(e.target.tagName))return;const k=e.key.toLowerCase();this.keys[k]=1;const it=this.sel;
 if(k==='r')this.rot();else if(k==='delete'||k==='backspace')this.del();else if(k==='escape')this.select(null);
 else if(it&&k.startsWith('arrow')){e.preventDefault();const d={arrowleft:[-1,0],arrowright:[1,0],arrowup:[0,-1],arrowdown:[0,1]}[k];if(d){it.cx+=d[0];if(!it.s.wall)it.cz+=d[1];this.clamp(it);this.refresh()}}}
setMode(m){const prev=this.mode;this.mode=m;this.hero.visible=m==='home';this.root.visible=m!=='home';this.grid.visible=m==='build';if(m!=='build')this.select(null);
 if(m==='home'){this.trad=19;this.tel=.52}else if(prev==='home'){this.taz=.78;this.tel=.62;this.trad=16.5}}
start(){this.on=true;this.clock=new THREE.Clock();this.frame()}
stop(){this.on=false}
frame(){if(!this.on)return;requestAnimationFrame(()=>this.frame());const dt=Math.min(this.clock.getDelta(),.05),t=this.clock.elapsedTime,k=Math.min(1,dt*4),m=this.mode,T=THREE;
 if(m==='home'&&!this.rm)this.taz=.5+Math.sin(t*.15)*.22;else if(m!=='build'&&!this.rm)this.taz+=dt*.05;
 if(m==='build'){const f=(this.keys.w||this.keys.arrowup&&!this.sel?1:0)-(this.keys.s||this.keys.arrowdown&&!this.sel?1:0),r=(this.keys.d||this.keys.arrowright&&!this.sel?1:0)-(this.keys.a||this.keys.arrowleft&&!this.sel?1:0);
  if(f||r){const sp=6*dt;this.tg.x+=(-Math.sin(this.az)*f+Math.cos(this.az)*r)*sp;this.tg.z+=(-Math.cos(this.az)*f-Math.sin(this.az)*r)*sp;this.tg.x=Math.max(-1,Math.min(N+1,this.tg.x));this.tg.z=Math.max(-1,Math.min(N+1,this.tg.z))}}
 else{this.tg.x+=(5-this.tg.x)*k;this.tg.z+=(5-this.tg.z)*k}
 this.az+=(this.taz-this.az)*k;this.el+=(this.tel-this.el)*k;this.rad+=(this.trad-this.rad)*Math.min(1,dt*3);
 const c=Math.cos(this.el),W=innerWidth,H=innerHeight;this.cam.position.set(this.tg.x+this.rad*Math.sin(this.az)*c,this.tg.y+this.rad*Math.sin(this.el),this.tg.z+this.rad*Math.cos(this.az)*c);this.cam.lookAt(this.tg);
 this.ho+=((m==='home'?.17:0)-this.ho)*k;if(this.ho>.002)this.cam.setViewOffset(W,H,-W*this.ho,0,W,H);else this.cam.clearViewOffset();
 const now=performance.now();for(const it of this.items)if(it.bt){const q=(now-it.bt)/900;if(q>=1){it.bt=0;it.off=0}else it.off=2.6*(1-bo(q));it.g.position.y=it.by+it.off}
 if(!this.rm)this.pt.forEach(p=>{p.position.y+=p.userData.sp*dt;p.position.x+=Math.sin(t+p.userData.ph)*.003;p.rotation.y+=dt;if(p.position.y>7)p.position.y=-.3});
 this.arms.forEach((a,i)=>a.rotation.x=Math.sin(t*2+i*3)*.08);this.head.rotation.y=Math.sin(t*.8)*.4;this.ch.position.y=Math.abs(Math.sin(t*1.6))*.03;
 const s=this.sel;this.ind.visible=!!s&&!s.s.wall&&m==='build';this.bh.visible=!!s&&m==='build';
 if(s&&m==='build'){const[w,d]=this.fp(s);this.ind.scale.set(w||1,d||1,1);this.ind.position.set(s.cx+w/2,.03,s.cz+d/2);this.bh.setFromObject(s.g);
  const b=new T.Box3().setFromObject(s.g);this.v.set((b.min.x+b.max.x)/2,b.max.y+.2,(b.min.z+b.max.z)/2).project(this.cam);this.cb.proj&&this.cb.proj((this.v.x*.5+.5)*W,(-this.v.y*.5+.5)*H,this.v.z<1)}
 else this.cb.proj&&this.cb.proj(0,0,false);
 this.rd.render(this.s,this.cam)}}

