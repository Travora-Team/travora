"""Add native PowerPoint Morph and remove all notes from an Artifact Tool deck."""
import sys, re, zipfile
from lxml import etree as ET

src,dst=sys.argv[1:]
P='http://schemas.openxmlformats.org/presentationml/2006/main'
MC='http://schemas.openxmlformats.org/markup-compatibility/2006'
P159='http://schemas.microsoft.com/office/powerpoint/2015/09/main'
P14='http://schemas.microsoft.com/office/powerpoint/2010/main'
NS={'p':P,'mc':MC,'p159':P159}
def xml(data):return ET.fromstring(data)
def serialize(root):return ET.tostring(root,xml_declaration=True,encoding='UTF-8',standalone=True)
def removed_part(name):return name.startswith(('ppt/notesSlides/','ppt/notesMasters/','ppt/comments/','ppt/commentAuthors'))

with zipfile.ZipFile(src) as source,zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED) as target:
 for entry in source.infolist():
  name=entry.filename
  if removed_part(name):continue
  data=source.read(name)
  if re.fullmatch(r'ppt/slides/slide\d+\.xml',name):
   root=xml(data);number=int(re.search(r'slide(\d+)',name).group(1))
   pictures=root.findall('.//p:pic',NS)
   assert pictures,number
   anchor=pictures[-1].find('p:nvPicPr/p:cNvPr',NS)
   anchor.set('name','!!journey-case')
   anchor.set('descr','Travel suitcase')
   for child in list(root):
    if child.tag==f'{{{P}}}transition' or child.tag==f'{{{MC}}}AlternateContent' and child.find('.//p:transition',NS) is not None:root.remove(child)
   if number>1:
    block=ET.Element(f'{{{MC}}}AlternateContent',nsmap={'mc':MC})
    choice=ET.SubElement(block,f'{{{MC}}}Choice',nsmap={'p159':P159},Requires='p159')
    trans=ET.SubElement(choice,f'{{{P}}}transition',nsmap={'p14':P14},spd='slow',advClick='1')
    trans.set(f'{{{P14}}}dur','1200')
    ET.SubElement(trans,f'{{{P159}}}morph',option='byObject')
    fallback=ET.SubElement(block,f'{{{MC}}}Fallback')
    fallback_trans=ET.SubElement(fallback,f'{{{P}}}transition',spd='med',advClick='1')
    ET.SubElement(fallback_trans,f'{{{P}}}fade')
   else:
    block=ET.Element(f'{{{P}}}transition',spd='med',advClick='1')
    ET.SubElement(block,f'{{{P}}}fade')
   index=len(root)
   for i,ch in enumerate(root):
    if ch.tag in (f'{{{P}}}timing',f'{{{P}}}extLst'):index=i;break
   root.insert(index,block)
   data=serialize(root)
  elif name=='ppt/presentation.xml':
   root=xml(data)
   for node in root.findall('p:notesMasterIdLst',NS):root.remove(node)
   data=serialize(root)
  elif name.endswith('.rels'):
   root=xml(data)
   for node in list(root):
    if node.get('Type','').endswith(('/notesSlide','/notesMaster','/comments','/commentAuthors')):root.remove(node)
   data=serialize(root)
  elif name=='[Content_Types].xml':
   root=xml(data)
   for node in list(root):
    if removed_part(node.get('PartName','').lstrip('/')):root.remove(node)
   data=serialize(root)
  target.writestr(entry,data)

with zipfile.ZipFile(dst) as z:
 assert not any(removed_part(n) for n in z.namelist())
 count=0
 for n in range(1,9):
  root=xml(z.read(f'ppt/slides/slide{n}.xml'))
  names=[node.get('name') for node in root.findall('.//p:cNvPr',NS)]
  assert names.count('!!glass-stage')==1 and names.count('!!journey-case')==1,(n,names)
  if n>1:
   morph=root.find('.//p159:morph',NS)
   assert morph is not None and morph.get('option')=='byObject'
   count+=1
 print({'native_morph_transitions':count,'notes_parts':0,'matched_glass_and_3d_anchor':True})
