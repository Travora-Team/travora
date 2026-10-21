import fs from 'node:fs/promises';
import path from 'node:path';
import {PresentationFile,FileBlob} from '@oai/artifact-tool';
const base='/Users/yousiffares/Desktop/smart-tourism-platform';
const rev=process.argv[2]||'v2';
const file=path.join(base,'outputs',`Travora_3D_Liquid_Glass_${rev}.pptx`);
const out=path.join(base,'.presentation-3d-build/renders',`final-${rev}`);
await fs.mkdir(out,{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load(file));
for(let i=0;i<8;i++){
 const im=await p.render({slide:i,scale:1});
 await fs.writeFile(path.join(out,`slide-${i+1}.png`),new Uint8Array(await im.arrayBuffer()));
 console.log(`Final slide ${i+1}`);
}
const montage=await p.render({montage:{columns:2,slideWidth:640,padding:16,gap:16}});
await fs.writeFile(path.join(out,'montage.png'),new Uint8Array(await montage.arrayBuffer()));
