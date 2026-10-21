import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {Presentation, PresentationFile} from '@oai/artifact-tool';

const workspaceDir='/Users/yousiffares/Desktop/smart-tourism-platform';
const TMP_DIR=path.join(workspaceDir,'.presentation-3d-build');
const SKILL_DIR='/Users/yousiffares/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations';
const RUNTIME_PYTHON='/Users/yousiffares/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
process.env.RUNTIME_NODE_MODULES='/Users/yousiffares/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const rev=process.argv[2]||'v1';
const FINAL_PPTX=path.join(workspaceDir,'outputs',`Travora_3D_Liquid_Glass_${rev}.pptx`);
const renderDir=path.join(TMP_DIR,'renders',rev);
const C={navy:'#071D38',blue:'#0099FF',teal:'#00C8A8',orange:'#FF8A00',white:'#FFFFFF',pale:'#D6ECF7',ink:'#09264A'};
const p=Presentation.create({slideSize:{width:1280,height:720}});
p.theme.defaultFont='Avenir Next';
p.theme.colorScheme={name:'Travora Liquid Glass',themeColors:{accent1:C.blue,accent2:C.teal,accent3:C.orange,accent4:'#469CC9',accent5:'#ADCBE2',accent6:'#9FDBD1',bg1:C.navy,bg2:'#13365B',tx1:C.white,tx2:C.pale,dk1:'#000000',dk2:C.navy,lt1:C.white,lt2:C.pale,hlink:C.blue,folHlink:C.teal}};
await fs.mkdir(renderDir,{recursive:true});
await fs.mkdir(path.dirname(FINAL_PPTX),{recursive:true});
const backdrop=await fs.readFile(path.join(TMP_DIR,'assets/glass-backdrop.png'));

function shape(s,name,x,y,w,h,fill,opts={}){
 return s.shapes.add({name,geometry:opts.geometry||'rect',position:{left:x,top:y,width:w,height:h},fill,line:{style:'solid',fill:opts.line||'none',width:opts.line?1.2:0},...(opts.radius?{borderRadius:opts.radius}:{}),...(opts.shadow?{shadow:opts.shadow}:{})});
}
function txt(s,t,x,y,w,h,size=26,color=C.white,bold=false,opts={}){
 const z=shape(s,opts.name||'Text',x,y,w,h,'none',{geometry:'textbox'});
 z.text=t;z.text.style={typeface:'Avenir Next',fontSize:size,bold,color,autoFit:'none',wrap:'square',insets:0,verticalAlignment:'top',lineSpacing:1.08,...opts};return z;
}
function glass(s,name,x,y,w,h,tint=18,radius=36){
 return shape(s,name,x,y,w,h,{type:'gradient',gradientKind:'linear',angleDeg:135,stops:[{offset:0,color:`#FFFFFF/${tint+4}`},{offset:37000,color:`#FFFFFF/${Math.max(tint-8,5)}`},{offset:100000,color:`#96EFFF/${tint}`}]},{radius,line:'#FFFFFF/38',shadow:'0px 16px 34px #000000/25'});
}
function shine(s,name,x,y,w){shape(s,name,x,y,w,2,'#FFFFFF/31',{radius:1});}
const sections=['GRADUATION PROJECT','SUPERVISORS','TEAM MEMBERS','ABSTRACT','INTRODUCTION','PROBLEM DEFINITION','SOLUTION APPROACH','TOOLS'];
function base(n,stage={x:64,y:144,w:1152,h:496}){
 const s=p.slides.add();
 s.background.fill={type:'gradient',gradientKind:'linear',angleDeg:12,stops:[{offset:0,color:'#06172D'},{offset:48000,color:'#0A325B'},{offset:100000,color:'#0B596B'}]};
 s.images.add({blob:backdrop,contentType:'image/png',fit:'cover',position:{left:0,top:0,width:1280,height:720},alt:'Soft blue and turquoise backdrop'});
 shape(s,'Backdrop shade',0,0,1280,720,{type:'gradient',gradientKind:'linear',angleDeg:0,stops:[{offset:0,color:'#06172D/26'},{offset:100000,color:'#0A2854/16'}]});
 glass(s,'!!glass-nav',64,42,1152,62,19,31);
 txt(s,'TRAVORA',93,55,300,38,25,C.white,true,{name:'!!wordmark'});
 txt(s,sections[n-1],566,63,504,30,17,'#DFF5FC',true,{alignment:'right'});
 txt(s,`${String(n).padStart(2,'0')} / 08`,1096,59,91,35,21,C.teal,true,{alignment:'right',name:'!!page-count'});
 glass(s,'!!glass-stage',stage.x,stage.y,stage.w,stage.h,13,42);
 shine(s,'!!glass-reflection',stage.x+42,stage.y+2,stage.w-84);
 return s;
}
async function img(s,file,x,y,w,h,alt,opts={}){
 const bytes=await fs.readFile(path.join(TMP_DIR,'assets',file));
 const config={blob:bytes,contentType:file.endsWith('.png')?'image/png':'image/jpeg',position:{left:x,top:y,width:w,height:h},fit:opts.fit||'contain',alt};
 if(opts.radius){config.geometry='roundRect';config.borderRadius=opts.radius;}
 const im=s.images.add(config);return im;
}
async function anchor(s,x,y,size){return img(s,'brand-3d-travel.png',x,y,size,size,'Travel suitcase');}
function headline(s,t,x=108,y=174,w=1000,size=47){txt(s,t,x,y,w,68,size,C.white,true);}
function divider(s,x,y,w){shape(s,'Divider',x,y,w,1,'#FFFFFF/17');}
function nativeTable(s,values,x,y,w,h,widths,size=26){
 const t=s.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
 t.styleOptions={headerRow:true,bandedRows:false};t.borders.assign({style:'solid',fill:'#FFFFFF/13',width:0.6});
 for(let r=0;r<values.length;r++){
  t.rows[r].height=h/values.length;
  for(let c=0;c<values[0].length;c++){
   const ce=t.getCell(r,c);ce.fill=r===0?'#FFFFFF/13':r%2?'#FFFFFF/3':'#FFFFFF/7';
   ce.text.style={typeface:'Avenir Next',fontSize:r===0?20:size,color:r===0?C.teal:c===1?'#E5F5FF':C.white,bold:r===0||c===1,autoFit:'none',wrap:'square',verticalAlignment:'middle',insets:{left:18,right:14,top:6,bottom:6}};
  }
 }
 return t;
}

// 1. Brand and 3D Egypt cover.
{
 const s=base(1,{x:64,y:140,w:1152,h:516});
 txt(s,'TRAVORA',105,222,660,123,92,C.white,true);
 txt(s,'Smart Tourism and\nPersonalized Trip Planning',110,371,664,131,38,'#ECF9FF',true);
 txt(s,'Web platform and Flutter mobile application',112,541,619,82,25,C.pale);
 glass(s,'Egypt illustration frame',779,194,401,401,30,40);
 await img(s,'hero-egypt-diorama.jpg',790,205,379,379,'Isometric Egyptian pyramid and Sphinx illustration',{fit:'cover',radius:31});
 await anchor(s,1051,485,143);
}
// 2. Supervisors.
{
 const s=base(2,{x:64,y:149,w:1152,h:489});
 headline(s,'Supervisors');
 txt(s,'Dr. Lamia Hassaan',109,286,778,70,43,C.white,true);
 txt(s,'Project Supervisor',112,358,722,40,26,C.pale);
 divider(s,112,429,717);
 txt(s,'Eng. Mohamed Hassan',109,475,780,67,39,C.white,true);
 txt(s,'Supporting Academic Staff',112,545,733,45,25,C.pale);
 await img(s,'3d-bulb-dynamic-color.png',922,279,237,237,'3D light bulb');
 await anchor(s,1086,512,94);
}
// 3. Editable team roster.
{
 const s=base(3,{x:64,y:145,w:1152,h:493});
 headline(s,'Team members & roles');
 nativeTable(s,[['TEAM MEMBER','ROLE'],['Yousef Mohamed El Sayed Fares','Backend'],['Haneen Mohamed Ahmed Atta Mohamed','Frontend'],['Wesam Khaled Farouk Ahmed','Flutter'],['Mostafa Emad Hendawy','AI'],['Youssef Mohamed Shahhat Salem Awad','AI']],107,264,944,337,[749,195],26);
 await img(s,'brand-3d-puzzle.png',1057,314,133,133,'3D puzzle piece');
 await anchor(s,1082,504,101);
}
// 4. Abstract.
{
 const s=base(4,{x:64,y:150,w:1152,h:489});
 headline(s,'Abstract');
 txt(s,'Personalized tourism\nthrough a connected\nweb and mobile experience.',110,275,735,157,34,C.white,true);
 txt(s,'Travora will use AI to plan trips around interests, budget, and available time, while connecting travelers to local services.',113,460,694,113,25,C.pale);
 txt(s,'Itineraries, bookings, budgets, and trip documents.',114,586,819,35,23,'#C5F5EE');
 await img(s,'brand-3d-mobile.png',905,266,230,276,'3D mobile phone');
 txt(s,'Web + Flutter',861,548,300,37,24,C.white,true,{alignment:'center'});
 await anchor(s,1120,560,68);
}
// 5. Introduction with a destination illustration.
{
 const s=base(5,{x:64,y:143,w:1152,h:497});
 headline(s,'Introduction');
 glass(s,'Destination frame',104,266,333,333,30,34);
 await img(s,'hero-egypt-diorama.jpg',113,275,315,315,'Isometric Egyptian destination illustration',{fit:'cover',radius:25});
 await img(s,'brand-3d-map-pin.png',337,224,109,109,'3D destination pin');
 txt(s,'Planning travel in Egypt',475,276,686,94,37,C.white,true);
 txt(s,'Travelers coordinate places to visit, accommodation, transport, activities, and spending within a limited schedule.',478,389,674,110,26,C.pale);
 txt(s,'The web platform and Flutter app will share backend services for planning before departure and accessing trip details during travel.',478,511,669,115,24,C.pale);
 await anchor(s,124,540,95);
}
// 6. Problem definition.
{
 const s=base(6,{x:64,y:145,w:1152,h:494});
 headline(s,'Problem definition');
 const items=[['01','Fragmented information','Travel details are spread across multiple services.'],['02','Limited personalization','Plans must fit interests, budgets, and schedules.'],['03','Changing conditions','Delays, weather, and availability can disrupt a plan.'],['04','Service coordination','Travelers, providers, and drivers need consistent information.']];
 items.forEach((v,i)=>{const y=263+i*82;txt(s,v[0],109,y,69,57,35,i===2?C.orange:C.teal,true);txt(s,v[1],186,y,745,36,27,C.white,true);txt(s,v[2],189,y+39,733,43,23,C.pale);if(i<3)divider(s,189,y+73,709);});
 await img(s,'brand-3d-calender.png',986,275,177,177,'3D calendar');
 await img(s,'3d-wallet-dynamic-color.png',957,478,113,113,'3D wallet');
 await anchor(s,1094,505,88);
}
// 7. Four stages of the proposed solution.
{
 const s=base(7,{x:64,y:145,w:1152,h:497});
 headline(s,'Solution approach');
 const cells=[{x:104,y:262,n:'01',title:'Know the traveler',body:'Set destination, dates, budget, and interests.'},{x:652,y:262,n:'02',title:'Build the itinerary',body:'Generate a personalized daily itinerary using AI.'},{x:104,y:442,n:'03',title:'Connect services',body:'Connect accommodation, activities, dining, guides, and transport.'},{x:652,y:442,n:'04',title:'Support the journey',body:'Keep trip records together and adapt plans as conditions change.'}];
 for(const a of cells){glass(s,`Workflow ${a.n}`,a.x,a.y,518,156,10,29);txt(s,a.n,a.x+24,a.y+23,57,51,31,a.n==='03'?C.orange:C.teal,true);txt(s,a.title,a.x+83,a.y+24,409,42,26,C.white,true);txt(s,a.body,a.x+85,a.y+76,402,74,23,C.pale);}
 await anchor(s,1131,595,57);
}
// 8. Shared technology choices.
{
 const s=base(8,{x:64,y:147,w:1152,h:493});
 headline(s,'Tools');
 nativeTable(s,[['AREA','TECHNOLOGY'],['Design','Figma'],['Web','React, Vite, React Router, Tailwind CSS'],['Mobile','Flutter, Dart'],['Backend','Node.js, Express.js'],['Database','PostgreSQL, node-postgres'],['Authentication','Argon2id, cookie sessions'],['Testing','node:test, ESLint'],['Version control','Git']],108,257,797,364,[228,569],23);
 await img(s,'3d-computer-dynamic-color.png',943,284,235,235,'3D desktop computer');
 await img(s,'3d-sheild-dynamic-color.png',951,512,107,107,'3D security shield');
 await anchor(s,1118,543,80);
}

const rawCandidate=path.join(TMP_DIR,`raw-${rev}.pptx`);
await (await PresentationFile.exportPptx(p)).save(rawCandidate);
for(let i=0;i<8;i++){
 const im=await p.render({slide:i,scale:1});
 await fs.writeFile(path.join(renderDir,`slide-${i+1}.png`),new Uint8Array(await im.arrayBuffer()));
 await fs.writeFile(path.join(renderDir,`slide-${i+1}.layout.json`),new Uint8Array(await im.layout.arrayBuffer()));
 console.log(`Rendered slide ${i+1}`);
}
const montage=await p.render({montage:{columns:2,slideWidth:640,gap:16,padding:16}});
await fs.writeFile(path.join(renderDir,'montage.png'),new Uint8Array(await montage.arrayBuffer()));
const candidatePath=path.join(TMP_DIR,`candidate-${rev}.pptx`);
execFileSync(RUNTIME_PYTHON,[path.join(TMP_DIR,'apply-morph.py'),rawCandidate,candidatePath],{stdio:'inherit'});
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL_DIR,'container_tools/artifact_tool_utils.mjs')).href);
const result=await finalizePresentation({workspaceDir,candidatePath,finalPath:FINAL_PPTX,pythonExecutable:RUNTIME_PYTHON,integrityValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_layout_geometry.py'),explicitTotalSlideCount:8,requiredNativeTableOwnerSlides:[3,8],requiredNativeChartOwnerSlides:[],fontPolicy:{basis:'design',families:['Avenir Next']},layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit','--require-native-table-slide','3','--require-native-table-slide','8'],verifyArtifactToolImport:true,receiptPath:path.join(TMP_DIR,`validation-${rev}.json`)});
console.log(JSON.stringify({finalPath:result.finalPath,byteCount:result.byteCount,integrity:result.packageIntegrity.status,layout:result.presentationLayout.exitCode,firstPartyImport:result.firstPartyImport.passed}));
