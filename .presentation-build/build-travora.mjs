import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const workspaceDir = '/Users/yousiffares/Desktop/smart-tourism-platform';
const TMP_DIR = path.join(workspaceDir, '.presentation-build');
const SKILL_DIR = '/Users/yousiffares/.codex/plugins/cache/openai-primary-runtime/presentations/26.1011.11113/skills/presentations';
const RUNTIME_PYTHON = '/Users/yousiffares/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
process.env.RUNTIME_NODE_MODULES = '/Users/yousiffares/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const revision = process.argv[2] || 'v1';
const FINAL_PPTX = path.join(workspaceDir, 'outputs', `Travora_Graduation_Presentation_${revision}.pptx`);
const fontPolicy = {basis: 'design', families: ['Avenir Next', 'Arial']};
const C = { navy:'#0A2854', ink:'#0F172A', blue:'#0099FF', teal:'#00C8A8', orange:'#FF8A00', gray:'#526275', light:'#F8FAFC', white:'#FFFFFF', pale:'#EAF5FF' };
const presentation = Presentation.create({slideSize:{width:1280,height:720}});
presentation.theme.defaultFont = 'Arial';
presentation.theme.colorScheme = {name:'Travora', themeColors:{accent1:C.blue,accent2:C.teal,accent3:C.orange,accent4:'#3777A4',accent5:'#4E617B',accent6:'#9BDDD4',bg1:C.white,bg2:C.light,tx1:C.ink,tx2:C.gray,dk1:'#000000',dk2:C.navy,lt1:C.white,lt2:'#E2E8F0',hlink:C.blue,folHlink:C.teal}};
await fs.mkdir(path.join(TMP_DIR, 'renders', revision),{recursive:true});
await fs.mkdir(path.dirname(FINAL_PPTX),{recursive:true});
const rawManifest = JSON.parse(await fs.readFile(path.join(TMP_DIR,'assets/internet-images.json'),'utf8'));
const photos = Array.isArray(rawManifest) ? rawManifest : rawManifest.images;
const findPhoto = (pattern) => photos.find(p => pattern.test(`${p.subject} ${p.file}`));
const pyramids = findPhoto(/panoram/i) || findPhoto(/giza|pyramid/i);
const luxor = findPhoto(/luxor/i);
const nile = findPhoto(/nile|cairo/i);
const beach = findPhoto(/sharm|beach/i);
const desert = photos.find(p=>p!==pyramids && /giza|pyramid|desert/i.test(`${p.subject} ${p.file}`));
if (![pyramids,luxor,nile,beach,desert].every(Boolean)) throw new Error('Need five source photos: Giza panorama, Giza desert, Luxor, Nile, Sharm.');

function text(slide, content, x,y,w,h,size=26,color=C.ink,bold=false,extra={}) {
  const shape = slide.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0,style:'solid'}});
  shape.text = content;
  shape.text.style = {typeface:'Arial',fontSize:size,color,bold,wrap:'square',autoFit:'none',insets:0,verticalAlignment:'top',lineSpacing:1.12,...extra};
  return shape;
}
function rect(slide,x,y,w,h,fill) {
  return slide.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:'none',width:0,style:'solid'}});
}
function rule(slide,x,y,w,color='#DCE5EE') {rect(slide,x,y,w,1,color);}
function title(slide,label,dark=false) {text(slide,label,72,89,1110,66,48,dark?C.white:C.navy,true,{typeface:'Avenir Next'});}
function footer(slide,n,dark=false) {
  const color = dark?'#B9CDDF':C.gray;
  text(slide,'TRAVORA',72,659,150,26,18,color,true,{typeface:'Avenir Next'});
  text(slide,'GRADUATION PROJECT',246,661,470,25,16,color);
  text(slide,String(n).padStart(2,'0'),1158,655,50,30,22,dark?C.teal:C.blue,true,{alignment:'right'});
}
function eyebrow(slide,label,x=72,y=45,color=C.blue) {text(slide,label,x,y,1100,30,18,color,true);}
async function photo(slide,p,x,y,w,h) {
  const fullPath = path.isAbsolute(p.file) ? p.file : path.join(TMP_DIR,'assets',p.file);
  const bytes=await fs.readFile(fullPath);
  slide.images.add({blob:bytes,contentType:'image/jpeg',alt:p.subject,fit:'cover',position:{left:x,top:y,width:w,height:h}});
}
function photoCitation(p) {return `Photo: ${p.subject}. ${p.photographer || ''}. License: ${p.license || ''}, ${p.licenseUrl || ''}. Source: ${p.sourcePage}. Download: ${p.directUrl}. Cropped for slide layout.`}
function notes() {}
function table(slide,values,x,y,width,height,columnWidths,{dark=false,size=26,header=true}={}) {
  const t=slide.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width,height,columnWidths,values});
  t.styleOptions={headerRow:header,bandedRows:false};
  t.borders.assign({style:'solid',fill:dark?'#244567':'#DEE8F0',width:0.5});
  for(let r=0;r<values.length;r++) {
    t.rows[r].height = height/values.length;
    for(let c=0;c<values[0].length;c++) {
      const cell=t.getCell(r,c);
      cell.fill = r===0&&header ? (dark?'#134775':C.pale) : dark?(r%2?'#103259':'#0D2D51'):(r%2?C.white:'#F6FAFD');
      cell.text.style={typeface:'Arial',fontSize:r===0&&header?22:size,color:r===0&&header?(dark?C.teal:C.navy):(c===1?(dark?'#A8DFEF':'#0872B8'):(dark?C.white:C.ink)),bold:(r===0&&header)||c===1,verticalAlignment:'middle',alignment:'left',autoFit:'none',wrap:'square',insets:{left:22,right:16,top:10,bottom:10}};
    }
  }
  return t;
}

// 1. Photographic cover with an editable wordmark and title.
{
 const s=presentation.slides.add();
 await photo(s,pyramids,0,0,1280,720);
 rect(s,0,0,1280,720,{type:'gradient',gradientKind:'linear',angleDeg:0,stops:[{offset:0,color:'#061D3B/96'},{offset:57000,color:'#082746/80'},{offset:100000,color:'#0A2854/10'}]});
 text(s,'TRAVORA',74,170,1000,133,104,C.white,true,{typeface:'Avenir Next'});
 text(s,'Smart Tourism and\nPersonalized Trip Planning',78,326,780,145,45,C.white,true,{typeface:'Avenir Next'});
 text(s,'Web platform and Flutter mobile application',80,504,730,70,25,'#DBE9F4');
 eyebrow(s,'GRADUATION PROJECT',80,85,C.teal);
 rect(s,80,593,72,5,C.orange);
 text(s,'EGYPT',1053,645,150,33,22,C.white,true,{alignment:'right'});
 notes(s,'Introduce Travora as a proposed smart tourism graduation project focused initially on Egyptian destinations. The team will develop a Flutter mobile application alongside the web platform.',[pyramids]);
}
// 2. Supervisors.
{
 const s=presentation.slides.add();s.background.fill=C.white;
 eyebrow(s,'ACADEMIC GUIDANCE');title(s,'Supervisors');
 await photo(s,luxor,826,0,454,720);
 rect(s,826,0,454,720,'#0A2854/14');
 text(s,'Dr. Lamia Hassaan',72,234,700,73,46,C.navy,true,{typeface:'Avenir Next'});
 text(s,'Project Supervisor',74,318,670,40,26,C.gray);
 rule(s,74,395,648);
 text(s,'Eng. Mohamed Hassan',72,446,700,75,42,C.navy,true,{typeface:'Avenir Next'});
 text(s,'Supporting Academic Staff',74,529,670,42,26,C.gray);
 footer(s,2);
 notes(s,'Supervisors are taken from the project form supplied by the user. English transliterations: Dr. Lamia Hassaan, Eng. Mohamed Hassan.',[luxor]);
}
// 3. Editable roster table.
{
 const s=presentation.slides.add();s.background.fill=C.navy;
 eyebrow(s,'THE PROJECT TEAM',72,45,C.teal);title(s,'Team members & roles',true);
 table(s,[['TEAM MEMBER','ROLE'],['Yousef Mohamed El Sayed Fares','Backend'],['Haneen Mohamed Ahmed Atta Mohamed','Frontend'],['Wesam Khaled Farouk Ahmed','Flutter'],['Mostafa Emad Hendawy','AI'],['Youssef Mohamed Shahhat Salem Awad','AI']],72,190,1136,414,[842,294],{dark:true,size:27});
 footer(s,3,true);
 notes(s,'The roster follows the user-requested order: Yousef first, Haneen and Wesam next, then the remaining members. Roles are user-confirmed. All names are English.');
}
// 4. Abstract.
{
 const s=presentation.slides.add();s.background.fill=C.white;
 eyebrow(s,'PROJECT OVERVIEW');title(s,'Abstract');
 text(s,'A tourism platform for\npersonalized trip planning\nand service coordination.',72,195,700,178,38,C.navy,true,{typeface:'Avenir Next'});
 text(s,'The proposed web and mobile experience combines AI itineraries with bookings, budgets, and trip documents.',74,397,668,98,26,C.gray);
 text(s,'Its scope includes traveler, provider, driver, and administration workspaces.',74,524,672,80,25,C.gray);
 await photo(s,nile,831,183,377,421);
 footer(s,4);
 notes(s,'Travora proposes personalized tourism planning and service coordination through web and Flutter mobile clients. The project scope includes traveler, provider, driver and administration workspaces. Discuss the project concept and intended capabilities.',[nile]);
}
// 5. Introduction.
{
 const s=presentation.slides.add();s.background.fill=C.light;
 eyebrow(s,'TRAVEL CONTEXT');title(s,'Introduction');
 await photo(s,beach,675,176,533,428);
 text(s,'Egypt first',72,194,530,57,36,C.blue,true,{typeface:'Avenir Next'});
 text(s,'Travelers coordinate destinations, accommodation, transport, activities, and spending within a limited schedule.',74,273,539,173,29,C.navy);
 text(s,'A React web platform and a Flutter app will share backend services for planning before departure and accessing trip details during travel.',74,466,538,140,25,C.gray);
 footer(s,5);
 notes(s,'Egypt is the initial geographic focus. The proposed React web platform and Flutter mobile application will share backend services. This travel context is the project premise, not a statistical user-research claim.',[beach]);
}
// 6. Four clear problems.
{
 const s=presentation.slides.add();s.background.fill=C.navy;
 eyebrow(s,'WHY TRAVORA',72,45,C.teal);title(s,'Problem definition',true);
 await photo(s,desert,962,179,246,425);
 const problems=[['01','Fragmented information','Travel details are spread across multiple services.',C.blue],['02','Limited personalization','Plans must fit individual interests, budgets, and schedules.',C.teal],['03','Changing conditions','Delays, weather, and availability can disrupt a fixed plan.',C.orange],['04','Service coordination','Travelers, providers, and drivers need consistent information.',C.blue]];
 problems.forEach((p,i)=>{const y=181+i*108;text(s,p[0],72,y+1,82,55,40,p[3],true,{typeface:'Avenir Next'});text(s,p[1],172,y,742,36,27,C.white,true);text(s,p[2],174,y+42,732,54,23,'#C1D4E5');if(i<3)rule(s,174,y+93,729,'#28486C');});
 footer(s,6,true);
 notes(s,'These are the planning and coordination problems the project addresses. Discuss them as project requirements and motivation.',[desert]);
}
// 7. Proposed workflow and coordinated workspaces.
{
 const s=presentation.slides.add();s.background.fill=C.white;
 eyebrow(s,'PROPOSED WORKFLOW');title(s,'Solution approach');
 const steps=[['01','Know the traveler','Collect destination, dates, budget, and interests.'],['02','Build the itinerary','Use AI to generate a personalized daily plan.'],['03','Connect services','Connect travel services and booking workflows.'],['04','Support the journey','Organize bookings, expenses, and documents. Replan when travel conditions change.']];
 steps.forEach((p,i)=>{const y=181+i*108;text(s,p[0],72,y,78,55,40,i===2?C.orange:C.blue,true,{typeface:'Avenir Next'});text(s,p[1],169,y,590,37,28,C.navy,true);text(s,p[2],171,y+43,581,60,23,C.gray);if(i<3)rule(s,171,y+96,581);});
 rect(s,830,182,378,422,C.navy);
 text(s,'Connected workspaces',858,211,326,73,28,C.teal,true,{typeface:'Avenir Next'});
 text(s,'Travelers',860,289,320,39,27,C.white,true);
 text(s,'Plan and manage each trip',860,333,320,37,22,'#C1D4E5');
 rule(s,860,386,319,'#375272');
 text(s,'Providers & drivers',860,408,320,41,27,C.white,true);
 text(s,'Coordinate travel services',860,450,320,37,22,'#C1D4E5');
 text(s,'Administrators',860,503,320,39,27,C.orange,true);
 text(s,'Oversee platform operations',860,545,320,35,22,'#C1D4E5');
 footer(s,7);
 notes(s,'Explain the proposed traveler journey. AI will use trip preferences to generate itineraries, connect them with services and adapt them as conditions change. Provider, driver and administration portals will support service coordination. Do not add an implementation progress section.');
}
// 8. Native technology table.
{
 const s=presentation.slides.add();s.background.fill=C.white;
 eyebrow(s,'TECHNOLOGY');title(s,'Tools');
 text(s,'Shared services for web and mobile clients.',74,165,1127,38,25,C.gray);
 table(s,[['AREA','TECHNOLOGY'],['Design','Figma'],['Web','React, Vite, React Router, Tailwind CSS'],['Mobile','Flutter, Dart'],['Backend','Node.js, Express.js'],['Database','PostgreSQL, node-postgres'],['Authentication','Argon2id, cookie sessions'],['Testing','node:test, ESLint'],['Version control','Git']],72,225,1136,381,[342,794],{size:23});
 footer(s,8);
 notes(s,'Present the project technology choices, including the user-confirmed Flutter/Dart mobile app. No specific AI framework is listed because the team has not confirmed one. node-postgres (pg) is the database client.');
}

const candidatePath=path.join(TMP_DIR,`candidate-${revision}.pptx`);
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);
console.log(`Exported ${candidatePath}`);
const renderDir=path.join(TMP_DIR,'renders',revision);
for(let i=0;i<8;i++) {
 const preview=await presentation.render({slide:i,scale:1});
 await fs.writeFile(path.join(renderDir,`slide-${i+1}.png`),new Uint8Array(await preview.arrayBuffer()));
 await fs.writeFile(path.join(renderDir,`slide-${i+1}.layout.json`),new Uint8Array(await preview.layout.arrayBuffer()));
 console.log(`Rendered slide ${i+1}`);
}
const montage=await presentation.render({montage:{columns:2,slideWidth:640,gap:16,padding:16},scale:1});
await fs.writeFile(path.join(renderDir,'montage.png'),new Uint8Array(await montage.arrayBuffer()));
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL_DIR,'container_tools/artifact_tool_utils.mjs')).href);
const result=await finalizePresentation({workspaceDir,candidatePath,finalPath:FINAL_PPTX,pythonExecutable:RUNTIME_PYTHON,integrityValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_layout_geometry.py'),explicitTotalSlideCount:8,layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','3','--require-native-table-slide','8'],requiredNativeTableOwnerSlides:[3,8],requiredNativeChartOwnerSlides:[],fontPolicy,verifyArtifactToolImport:true,receiptPath:path.join(TMP_DIR,`validation-${revision}.json`)});
console.log(JSON.stringify(result,null,2));
