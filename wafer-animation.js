(function () {

            // ─── PATH DATA (158 clean paths, zero stray lines) ───────────────────────
            const LOGO_PATHS = window.HF_LOGO_PATHS || []

            const LOGO_OX = 0.0, LOGO_OY = 0.005, LOGO_SCALE = 0.82;
            const N_LASERS = 3;
            const LASER_PATHS = Array.from({length: N_LASERS}, () => []);
            LOGO_PATHS.forEach((p, i) => LASER_PATHS[i % N_LASERS].push(p));

            const wrap   = document.getElementById('waferWrap');
            const canvas = document.getElementById('waferCanvas');
            const logoEl = document.getElementById('waferLogoReveal');
            if (!wrap || !canvas) return;

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setClearColor(0x000000, 0);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            const scene = new THREE.Scene();
            scene.background = null;
            const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

            function resize() {
              const w = wrap.clientWidth || 500, h = wrap.clientHeight || 500;
              renderer.setSize(w, h);
              camera.aspect = w / h;
              camera.updateProjectionMatrix();
            }
            resize();
            window.addEventListener('resize', resize);

            scene.add(new THREE.AmbientLight(0xb0b8d8, 0.6));
            const keyLight = new THREE.DirectionalLight(0xffffff, 0.55);
            keyLight.position.set(4, 12, 6);
            keyLight.castShadow = true;
            scene.add(keyLight);
            const rimLight = new THREE.DirectionalLight(0x8899cc, 0.35);
            rimLight.position.set(-6, 3, -4);
            scene.add(rimLight);
            const fillLight = new THREE.DirectionalLight(0x6688bb, 0.25);
            fillLight.position.set(0, -4, 8);
            scene.add(fillLight);

            const LASER_COLORS = [0xff3311, 0xff5500, 0xff2200];
            const laserLights = LASER_COLORS.map(c => { const l = new THREE.PointLight(c, 0, 4); scene.add(l); return l; });

            const R = 2.2, T = 0.13;
            const waferGeo = new THREE.CylinderGeometry(R, R, T, 128, 1);
            const waferMat = new THREE.MeshStandardMaterial({ color: 0x3d4a7a, metalness: 0.55, roughness: 0.30 });
            const wafer = new THREE.Mesh(waferGeo, waferMat);
            wafer.receiveShadow = true; wafer.castShadow = true;
            scene.add(wafer);

            const topMat = new THREE.MeshStandardMaterial({ color: 0x4a5a9a, metalness: 0.45, roughness: 0.22 });
            const topDisc = new THREE.Mesh(new THREE.CircleGeometry(R - 0.025, 128), topMat);
            topDisc.rotation.x = -Math.PI / 2;
            topDisc.position.y = T / 2 + 0.001;
            wafer.add(topDisc);

            const notchMat = new THREE.MeshStandardMaterial({ color: 0x2a3060, metalness: 0.4, roughness: 0.5 });
            const notchMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, T + 0.02, 12), notchMat);
            notchMesh.position.set(0, 0, R - 0.04);
            wafer.add(notchMesh);

            wafer.position.y = -9;
            wafer.rotation.x = 0.15;

            const ec = document.createElement('canvas');
            ec.width = 1024; ec.height = 1024;
            const ectx = ec.getContext('2d');
            const etchTex = new THREE.CanvasTexture(ec);
            const etchMat = new THREE.MeshBasicMaterial({ map: etchTex, transparent: true, opacity: 0, depthWrite: false });
            const etchMesh = new THREE.Mesh(new THREE.CircleGeometry(R - 0.03, 128), etchMat);
            etchMesh.rotation.x = -Math.PI / 2;
            etchMesh.position.y = T / 2 + 0.003;
            wafer.add(etchMesh);

            const bgCanvas = document.createElement('canvas');
            bgCanvas.width = 1024; bgCanvas.height = 1024;
            const bgCtx = bgCanvas.getContext('2d');
            const bgClip = () => { bgCtx.beginPath(); bgCtx.arc(512,512,500,0,Math.PI*2); bgCtx.clip(); };
            bgCtx.save(); bgClip(); bgCtx.restore();

            const laserState = Array.from({length: N_LASERS}, () => ({ pathIdx:0, drawProg:0, isJumping:true, jumpT:0, bakedUpTo:-1 }));

            function logoToCanvas(nx, ny) { const s = 1024*0.44; return [512+(nx-LOGO_OX)*s, 512+(ny-LOGO_OY)*s]; }
            function logoToLocal(nx, ny) { return new THREE.Vector3((nx-LOGO_OX)*LOGO_SCALE*R, T/2+0.004, (ny-LOGO_OY)*LOGO_SCALE*R); }

            function drawPath(ctx, pts, alpha) {
              if (pts.length < 2) return;
              ctx.beginPath();
              pts.forEach(([nx,ny],i) => { const [cx,cy]=logoToCanvas(nx,ny); i===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy); });
              ctx.shadowColor=`rgba(220,80,30,${alpha*0.85})`; ctx.shadowBlur=14;
              ctx.strokeStyle=`rgba(215,100,50,${alpha})`; ctx.lineWidth=4.5; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke();
              ctx.shadowBlur=0; ctx.strokeStyle=`rgba(175,60,20,${alpha})`; ctx.lineWidth=2.5; ctx.stroke();
            }

            function bakeLaserPaths(li, upToIdx) {
              const st = laserState[li];
              if (upToIdx <= st.bakedUpTo) return;
              bgCtx.save(); bgClip();
              for (let i = st.bakedUpTo+1; i < upToIdx; i++) drawPath(bgCtx, LASER_PATHS[li][i], 1.0);
              bgCtx.restore();
              st.bakedUpTo = upToIdx-1;
            }

            function redrawEtchCanvas(activeLasers) {
              ectx.clearRect(0,0,1024,1024);
              ectx.save();
              ectx.beginPath(); ectx.arc(512,512,500,0,Math.PI*2); ectx.clip();
              ectx.drawImage(bgCanvas,0,0);
              activeLasers.forEach(({li,pts,prog})=>{
                if(!pts||pts.length<2)return;
                const numPts=Math.max(2,Math.ceil(prog*pts.length));
                const slice=pts.slice(0,numPts);
                ectx.beginPath();
                slice.forEach(([nx,ny],i)=>{const[cx,cy]=logoToCanvas(nx,ny);i===0?ectx.moveTo(cx,cy):ectx.lineTo(cx,cy);});
                ectx.shadowColor='rgba(220,80,30,0.9)'; ectx.shadowBlur=14;
                ectx.strokeStyle='rgba(215,100,50,0.95)'; ectx.lineWidth=4.5; ectx.lineCap='round'; ectx.lineJoin='round'; ectx.stroke();
                ectx.shadowBlur=0; ectx.strokeStyle='rgba(175,60,20,1)'; ectx.lineWidth=2.5; ectx.stroke();
                const[lx,ly]=slice[slice.length-1];
                const[cx,cy]=logoToCanvas(lx,ly);
                ectx.shadowColor='rgba(255,160,60,1)'; ectx.shadowBlur=24;
                ectx.fillStyle='rgba(255,215,120,1)';
                ectx.beginPath(); ectx.arc(cx,cy,6,0,Math.PI*2); ectx.fill(); ectx.shadowBlur=0;
              });
              ectx.restore();
              etchTex.needsUpdate=true;
            }

            const LASER_BEAM_COLORS = [0xff3300, 0xff6600, 0xff1100];
            const laserBeams = LASER_BEAM_COLORS.map(c=>{
              const mat=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0});
              const mesh=new THREE.Mesh(new THREE.CylinderGeometry(0.007,0.007,5,8),mat);
              scene.add(mesh); return{mesh,mat};
            });
            const laserSpots = LASER_BEAM_COLORS.map(()=>{
              const mat=new THREE.MeshBasicMaterial({color:0xff5522,transparent:true,opacity:0,side:THREE.DoubleSide});
              const mesh=new THREE.Mesh(new THREE.CircleGeometry(0.06,16),mat);
              mesh.rotation.x=-Math.PI/2; mesh.position.y=T/2+0.006;
              wafer.add(mesh); return{mesh,mat};
            });
            const laserLocalPos = Array.from({length:N_LASERS},()=>new THREE.Vector3());

            function positionLaserBeam(li,localPt){
              laserLocalPos[li].copy(localPt);
              const wt=wafer.localToWorld(localPt.clone());
              const wo=new THREE.Vector3(wt.x,wt.y+3.8,wt.z);
              const lb=laserBeams[li];
              lb.mesh.position.copy(wo.clone().lerp(wt,0.5));
              lb.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),wo.clone().sub(wt).normalize());
              laserSpots[li].mesh.position.set(localPt.x,T/2+0.006,localPt.z);
            }

            const lerp=(a,b,t)=>a+(b-a)*t;
            const clamp=(v,lo=0,hi=1)=>Math.max(lo,Math.min(hi,v));
            const inv=(t,p0,p1)=>clamp((t-p0)/(p1-p0));
            const easeO=t=>1-Math.pow(1-t,3);
            const easeIO=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

            const PHASE_RISE=[0,2.0],PHASE_AIM=[2.0,2.9],PHASE_ETCH=[2.9,12.5],PHASE_DOWN=[12.5,13.6],PHASE_FADE=[13.6,15.2];
            const ETCH_DUR=PHASE_ETCH[1]-PHASE_ETCH[0];

            const laserTimelines=LASER_PATHS.map(paths=>{
              const totalPts=paths.reduce((s,p)=>s+p.length,0);
              let elapsed=0;
              return paths.map(path=>{
                const budget=(path.length/totalPts)*ETCH_DUR;
                const jumpDur=Math.min(budget*0.06,0.07);
                const result={t0:elapsed,tjump:elapsed+jumpDur,t1:elapsed+budget};
                elapsed+=budget; return result;
              });
            });

            let t0=null,done=false,camX=0,camY=4.5,camZ=6.8;

            function animateWafer(ts){
              if(!t0)t0=ts;
              const t=(ts-t0)/1000;
              if(t<PHASE_RISE[1]){const p=easeO(inv(t,...PHASE_RISE));wafer.position.y=lerp(-9,0,p);wafer.rotation.x=lerp(0.15,0.50,p);camY=lerp(5.5,4.5,p);camZ=lerp(5.0,6.8,p);}
              if(t>=PHASE_AIM[0]&&t<PHASE_AIM[1]){const p=easeIO(inv(t,...PHASE_AIM));wafer.rotation.x=0.50;LASER_PATHS.forEach((lp,li)=>{if(lp.length===0)return;positionLaserBeam(li,logoToLocal(lp[0][0][0],lp[0][0][1]));laserBeams[li].mat.opacity=easeO(p)*0.85;laserSpots[li].mat.opacity=0;laserLights[li].intensity=p*1.2;});}
              if(t>=PHASE_ETCH[0]&&t<PHASE_ETCH[1]){
                const localT=t-PHASE_ETCH[0];const activeTips=[];
                LASER_PATHS.forEach((lp,li)=>{
                  if(lp.length===0)return;
                  const tl=laserTimelines[li];
                  let pi=lp.length-1;
                  for(let i=0;i<tl.length;i++){if(localT<tl[i].t1){pi=i;break;}}
                  const slot=tl[pi];const isJumping=localT<slot.tjump;
                  bakeLaserPaths(li,pi);
                  if(isJumping){laserBeams[li].mat.opacity=lerp(laserBeams[li].mat.opacity,0,0.4);laserSpots[li].mat.opacity=0;laserLights[li].intensity=lerp(laserLights[li].intensity,0,0.35);positionLaserBeam(li,logoToLocal(lp[pi][0][0],lp[pi][0][1]));}
                  else{const drawP=inv(localT,slot.tjump,slot.t1);const ptCount=lp[pi].length;const ptIdx=clamp(Math.floor(drawP*ptCount),0,ptCount-1);const activePt=logoToLocal(lp[pi][ptIdx][0],lp[pi][ptIdx][1]);positionLaserBeam(li,activePt);const flicker=0.85+Math.sin(t*23+li*2.1)*0.12;laserBeams[li].mat.opacity=flicker;laserBeams[li].mat.color.setHSL(0.03+Math.sin(t*8+li)*0.01,1,0.47+Math.sin(t*30+li)*0.06);laserSpots[li].mat.opacity=0.6+Math.sin(t*18+li*1.7)*0.3;laserLights[li].intensity=1.2+Math.sin(t*15+li*2.3)*0.5;laserLights[li].position.copy(wafer.localToWorld(laserLocalPos[li].clone()));activeTips.push({li,pts:lp[pi],prog:drawP});}
                });
                redrawEtchCanvas(activeTips);etchMat.opacity=Math.min(inv(t,...PHASE_ETCH)*2.0,1);camX=Math.sin(t*0.14)*0.15;camY=4.5;camZ=6.8;
              }
              if(t>=PHASE_DOWN[0]&&t<PHASE_DOWN[1]){const p=easeIO(inv(t,...PHASE_DOWN));laserBeams.forEach(lb=>{lb.mat.opacity=lerp(lb.mat.opacity,0,p+0.05);});laserSpots.forEach(ls=>{ls.mat.opacity=lerp(ls.mat.opacity,0,p+0.05);});laserLights.forEach(ll=>{ll.intensity=lerp(ll.intensity,0,p+0.05);});wafer.rotation.x=lerp(0.50,0,p);camX=lerp(camX,0,0.08);camY=lerp(4.5,6.2,p);camZ=lerp(6.8,0.5,p);LASER_PATHS.forEach((lp,li)=>bakeLaserPaths(li,lp.length));ectx.clearRect(0,0,1024,1024);ectx.save();ectx.beginPath();ectx.arc(512,512,500,0,Math.PI*2);ectx.clip();ectx.drawImage(bgCanvas,0,0);ectx.restore();etchTex.needsUpdate=true;etchMat.opacity=1;}
              if(t>=PHASE_FADE[0]){const p=easeIO(clamp((t-PHASE_FADE[0])/1.6,0,1));waferMat.transparent=true;waferMat.opacity=lerp(1,0,p);topMat.transparent=true;topMat.opacity=lerp(1,0,p);notchMat.transparent=true;notchMat.opacity=lerp(1,0,p);etchMat.opacity=lerp(1,0,p);laserBeams.forEach(lb=>{lb.mat.opacity=0;});laserSpots.forEach(ls=>{ls.mat.opacity=0;});if(logoEl)logoEl.style.opacity=p;camY=6.2;camZ=0.5;if(p>=1&&!done){done=true;canvas.style.transition='opacity 0.5s ease';canvas.style.opacity='0';}}
              if(t>=PHASE_RISE[1]&&t<PHASE_DOWN[1]){wafer.rotation.y=Math.sin(t*0.08)*0.04;}
              camera.position.set(camX,camY,camZ);camera.lookAt(0,0,0);renderer.render(scene,camera);
              if(!done)requestAnimationFrame(animateWafer);
            }

            requestAnimationFrame(animateWafer);
            })();
