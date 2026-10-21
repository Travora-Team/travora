import fs from 'node:fs/promises';
import path from 'node:path';
import {PresentationFile, FileBlob} from '@oai/artifact-tool';
const base='/Users/yousiffares/Desktop/smart-tourism-platform';
const source=path.join(base,'outputs/Travora_Graduation_Presentation_v2.pptx');
const out=path.join(base,'.presentation-build/renders/final');
await fs.mkdir(out,{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load(source));
for(let i=0;i<8;i++) {
 const im=await p.render({slide:i,scale:1});
 await fs.writeFile(path.join(out,`slide-${i+1}.png`),new Uint8Array(await im.arrayBuffer()));
 console.log(`Reviewed file render ${i+1}`);
}
