<template>
  <div>
    <v-toolbar class="sticky-sub-toolbar">
      <v-toolbar-title>
        QM Powerpoint Checker
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="open" class="mx-3" color="cctOrange" outlined >Open all</v-btn>
      <v-btn @click="close" color="cctOrange" outlined >Close all</v-btn>
    </v-toolbar>
    <template>
      <v-file-input
        show-size
        v-on:change="onFileChange"
        label="File input"
        accept=".pptx"
        ref="fileInput"
        type="file"
        v-model="files"
      ></v-file-input>
    </template>
    <v-container class="grey lighten-5" v-if="slidelist.length > 0">
      <v-expansion-panels
        v-model="panel"
        multiple
      >
        <template v-for=" (chapter, index) of slidelist" >
          <h6 class="text-overline mb-1" :key="chapter.name + index">{{chapter.name}}</h6>
          <v-expansion-panel
            v-for="(slide, index) in chapter.slds"
            :key="index + slide.name"
            class="padding5">
            <v-expansion-panel-header><div>{{slide.name}}({{ slide.type}}) </div></v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" lg="8">
                  <slideguides :guides="slide.guides" :sideobjects="slide.objects" :shrink="shrink" :sizes="sizes"></slideguides>
                </v-col>
                <v-col cols="12" lg="4">
                  <h6 class="text-overline mb-1" >Action Title</h6>
                  <div v-if="slide.title.text">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Linksbündig
                          </span>

                          <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" >
                            <v-icon v-if="slide.title.correctAlignment" color="cctGreen" >mdi-check-decagram</v-icon>
                            <v-icon color="red" v-else>mdi-alert-decagram</v-icon>
                          </span>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Kein Satztschlusszeichen
                          </span>

                          <span  class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1">
                            <v-icon v-if="slide.title.noEndChar" color="cctGreen" >mdi-check-decagram</v-icon>
                            <v-icon color="red" v-else>mdi-alert-decagram</v-icon>
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
                  <div class="text-center" v-else>
                    <p style="font-weight: 300; font-size: 0.9rem;">Kein Action Title gefunden <v-icon color="red">mdi-alert-decagram</v-icon></p>
                  </div>
                  <h6 class="text-overline mb-1" >Überschrift</h6>
                  <div v-if="slide.text.hastext && slide.subtitle.text">
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Textgröße
                          </span>

                          <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" >
                            {{slide.subtitle.size}}
                          </span>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Großbuchstaben
                          </span>

                          <span  class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1">
                            <v-icon v-if="slide.subtitle.allcaps" color="cctGreen" >mdi-check-decagram</v-icon>
                            <v-icon color="red" v-else>mdi-alert-decagram</v-icon>
                          </span>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Farbe Korrekt
                          </span>

                          <span  class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1">
                            <v-icon v-if="slide.subtitle.color == 'tx2'" color="cctGreen" >mdi-check-decagram</v-icon>
                            <v-icon color="red" v-else>mdi-alert-decagram</v-icon>
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
              
                  </div>
                  <div class="text-center" v-else>
                    <p style="font-weight: 300; font-size: 0.9rem;">Keine Überschrift gefunden <v-icon color="red">mdi-alert-decagram</v-icon></p>
                  </div>
                  <h6 class="text-overline mb-1" >Schrift</h6>
                  <div v-if="slide.text.hastext">
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-8 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            ⌀-größe
                          </span>

                          <span class="col-xs-12 col-md-6 col-lg-4 col-xl-4 my-0 py-1" >
                            {{Math.round(slide.text.average_sz)/100}}
                          </span>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-8 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Uniformität(%)
                          </span>

                          <span  class="col-xs-12 col-md-6 col-lg-4 col-xl-4 my-0 py-1">
                            {{Math.round(slide.text.std_div)}}
                          </span>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Kein Text zu klein
                          </span>

                          <span  class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1">
                            <v-icon  color="cctGreen" v-if="slide.text.toosmall.length === 0">mdi-check-decagram</v-icon>
                            <v-icon color="red" v-else>mdi-alert-decagram</v-icon>
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row class="my-3">
                      <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                        Zukleiner Text
                      </span>

                      <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1 textrestricktor">
                        {{slide.text.toosmall.map(obj => obj['text']).join(";   ")}}
                      </span>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Alles Arial
                          </span>

                          <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" >
                            <v-icon color="cctGreen" v-if="slide.text.wrongfont.length === 0">mdi-check-decagram</v-icon>
                            <v-icon color="red" v-else>mdi-alert-decagram</v-icon>
                          </span>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Richtige Stichpunktzeichen
                          </span>

                          <span  class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1">
                            <v-icon color="cctGreen" v-if="slide.text.wrongbuchars.length === 0">mdi-check-decagram</v-icon>
                            <v-icon color="red" v-else>mdi-alert-decagram</v-icon>
                          </span>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-row class="my-3">
                          <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                            Keine Doppelte Leerzeichen
                          </span>

                          <span  class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1">
                            <v-icon color="cctGreen" v-if="slide.text.nodoublespaces.length === 0">mdi-check-decagram</v-icon>
                            <v-icon color="red" v-else>mdi-alert-decagram</v-icon>
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                        Text ohne Arial
                      </span>

                      <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1 textrestricktor">
                        {{slide.text.wrongfont.map(obj => obj['text']).join(";   ")}}
                      </span>
                    </v-row>
                    <v-row>
                      <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
                        Doppelte Leerzeichen(Text)
                      </span>

                      <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1 textrestricktor">
                        {{slide.text.nodoublespaces.map(obj => obj['text']).join(";   ")}}
                        <span v-if="!slide.title.doublespaces">
                          {{slide.title.text}}
                        </span>
                      </span>
                    </v-row>

                  </div>
                  <div class="text-center" v-else>
                    <p style="font-weight: 300; font-size: 0.9rem;">Kein Text gefunden <v-icon color="red">mdi-alert-decagram</v-icon></p>
                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </template>
      </v-expansion-panels>
    </v-container>
    <v-container
      class="d-flex justify-center align-center"
      style="height: 70vh;"
      v-else
    >
      <span v-if="!loading">No Presetation is Selected</span>
      <v-progress-circular
        v-else
        indeterminate
        color="primary"
        size="100"
      ></v-progress-circular>
    </v-container>
  </div>  
  
</template>

<script lang="ts">
import { Vue, Component,  } from 'vue-property-decorator'
import  JSZip  from 'jszip';
import { xml2json } from 'xml-js';
import Slideguides from  '../components/Slideguides.vue'

@Component({
  components:{Slideguides}
})
export default class QmsaView extends Vue {
  private files: File| null = null;
  public sizes:any ={};
  public guides:any[] = [];
  public slidelist:any[] = [];
  public shrink = 30000;
  public panel:any = [];
  public mastersz = 0;
  public masterfont = ''
  public loading = false


  public close(){
    this.panel = []
  }
  public open(){
    this.panel = [...this.slidelist.keys()].map((k, i) => i)
  }
  // Handle File Selection
  private async onFileChange(event:any): Promise<any> {
    if (this.files ) {
      this.loading = true
      const file = this.files
      const zip = new JSZip();
      const zipData = await file.arrayBuffer();
      const zipContents =  zip.load(zipData)
      this.parsepres(zipContents.files)
      //this.parseslides(zipContents.files)
      this.loading = false
    }
    else{
      this.slidelist = []
    }
    
  }

  public lineStyle(pos,orient) {
    if (orient === 'horizontal') {
      return {
        top: `${(pos/this.sizes['cy']) * 100}%`
      };
    } else {
      return {
        left: `${(pos/this.sizes['cx']) * 100}%`
      };
    }
  }
  public boxStyle(possize){
    let deg=0;
    if(possize['deg']){
      deg = possize['deg']
    }
    return {
      height: `${(possize['ext']['cy']/this.sizes['cy']) * 100}%`,
      width: `${(possize['ext']['cx']/this.sizes['cx']) * 100}%`,
      top: `${(possize['pos']['y']/this.sizes['cy']) * 100}%`,
      left: `${(possize['pos']['x']/this.sizes['cx']) * 100}%`,
      transform: `rotate(${deg}deg)`,
    };
  }
  public getrealposition(groupsp,group){
    if(group['p:grpSpPr']?.['a:xfrm']?.['a:chOff']){
      const groupX = group['p:grpSpPr']['a:xfrm']['a:off']['_attributes']['x']
      const groupY = group['p:grpSpPr']['a:xfrm']['a:off']['_attributes']['y']
      const Xfactor = group['p:grpSpPr']['a:xfrm']['a:ext']['_attributes']['cx']/group['p:grpSpPr']['a:xfrm']['a:chExt']['_attributes']['cx']
      const Yfactor = group['p:grpSpPr']['a:xfrm']['a:ext']['_attributes']['cy']/group['p:grpSpPr']['a:xfrm']['a:chExt']['_attributes']['cy']
      const choffx = group['p:grpSpPr']['a:xfrm']['a:chOff']['_attributes']['x']
      const choffy = group['p:grpSpPr']['a:xfrm']['a:chOff']['_attributes']['y']
          
      for(const sp in groupsp){
        if(groupsp[sp]){
          const childX =  groupsp[sp]['p:spPr']['a:xfrm']['a:off']['_attributes']['x']
          const childY =  groupsp[sp]['p:spPr']['a:xfrm']['a:off']['_attributes']['y']
          const childcX = groupsp[sp]['p:spPr']['a:xfrm']['a:ext']['_attributes']['cx']
          const childcY = groupsp[sp]['p:spPr']['a:xfrm']['a:ext']['_attributes']['cy']
          groupsp[sp]['p:spPr']['a:xfrm']['a:off']['_attributes']['x'] = Math.round (parseInt(groupX) + ((childX - choffx) * Xfactor))
          groupsp[sp]['p:spPr']['a:xfrm']['a:off']['_attributes']['y'] = Math.round (parseInt(groupY) + ((childY - choffy) * Yfactor))
          groupsp[sp]['p:spPr']['a:xfrm']['a:ext']['_attributes']['cx'] = Math.round (childcX * Xfactor)
          groupsp[sp]['p:spPr']['a:xfrm']['a:ext']['_attributes']['cy'] = Math.round (childcY * Yfactor)
        }
      }
    }
    return groupsp
  }

  public getgrouprecursive(group):any[]{
    if(group['p:grpSp']){
      if(Array.isArray(group['p:grpSp'])){
        let cursp:any[] = []
        for(const i of group['p:grpSp']){
          cursp = [...cursp,...this.getgrouprecursive(i)]
        }

        if(Array.isArray(group['p:sp'])){
          return [...this.getrealposition(group['p:sp'],group),...cursp]
        }
        else{
          return [...this.getrealposition([group['p:sp']],group),...cursp]
        }
      }
      else{
        if(Array.isArray(group['p:sp'])){
          return [...this.getrealposition(group['p:sp'],group),...this.getgrouprecursive(group['p:grpSp'])]
        }
        else{
          return [...this.getrealposition([group['p:sp']],group),...this.getgrouprecursive(group['p:grpSp'])]
        }
      }
    }
    else{
      if(Array.isArray(group['p:sp'])){
        
        return this.getrealposition(group['p:sp'],group)
      }
      else{
        return this.getrealposition([group['p:sp']],group)
      }
    }
  }
  public gettableboxes(graphics):any[]{
    const output:any[] = []
    for(const graphic of graphics){
      if(graphic['a:graphic']?.['a:graphicData']?.['a:tbl']){
        let lastheight = 0
        const basex = parseInt(graphic['p:xfrm']['a:off']['_attributes']['x'])
        const basey = parseInt(graphic['p:xfrm']['a:off']['_attributes']['y'])
        const table = graphic['a:graphic']?.['a:graphicData']?.['a:tbl']
        const tablegrid = Array.isArray(table['a:tblGrid']?.['a:gridCol'])? table['a:tblGrid']?.['a:gridCol']: [table['a:tblGrid']?.['a:gridCol']]
        const columnwidths = tablegrid.map(a => parseInt(a['_attributes']?.['w']))
        const tablerows = Array.isArray(table['a:tr'])?table['a:tr'] : [table['a:tr']]
        try{
          for(const row of tablerows){
            const curheight =  parseInt(row['_attributes']?.['h'])
            let x = basex
            for(let i = 0; i < columnwidths.length; i++){
              if(i !== 0){
                x = x + columnwidths[i-1]
              }
              output.push({'a:off':{
                             '_attributes':{
                               'x': x,
                               'y': basey + lastheight
                             }
                           },
                           'a:ext':{
                             '_attributes':{
                               'cx': columnwidths[i],
                               'cy': curheight
                             }
                           }
              })
            }

            lastheight = lastheight + curheight
          }
        }
        catch{
          console.log('Failed to render Tableboxes')
        }
      }
      
    }
    return output
  }

  private async parsepres(zipFiles) {
    const pres_json_string = xml2json(zipFiles['ppt/presentation.xml'].asText(), { compact: true, spaces: 2 });
    const pres_json = JSON.parse(pres_json_string)

    const pres_rels_json_string = xml2json(zipFiles['ppt/_rels/presentation.xml.rels'].asText(), { compact: true, spaces: 2 });
    const pres_rels_json = JSON.parse(pres_rels_json_string)
    const xmlmapping = pres_rels_json['Relationships']['Relationship'].map(x => {
      const obj = {}
      obj[x['_attributes']['Id']] = x['_attributes']['Target']
      return obj
    }
    ).reduce((acc, obj) => ({ ...acc, ...obj }), {})
    this.sizes= pres_json['p:presentation']['p:sldSz']['_attributes']

    const ridmapping = pres_json['p:presentation']['p:sldIdLst']['p:sldId'].map(x => {
      const obj = {}
      obj[x['_attributes']['id']] = x['_attributes']['r:id']
      return obj
    }).reduce((acc, obj) => ({ ...acc, ...obj }), {});

    const slidelist = await this.parseslides(zipFiles)
    
    if(Array.isArray(pres_json['p:presentation']?.['p:extLst']?.['p:ext'].find(a => Object.keys(a).includes('p14:sectionLst'))?.['p14:sectionLst']['p14:section'])){
      this.slidelist = pres_json['p:presentation']?.['p:extLst']?.['p:ext'].find(a => Object.keys(a).includes('p14:sectionLst'))?.['p14:sectionLst']['p14:section'].map((x) => { 
        const slideids = Array.isArray(x['p14:sldIdLst']['p14:sldId'])? x['p14:sldIdLst']['p14:sldId'].map(y => y['_attributes']['id']) : [x['p14:sldIdLst']['p14:sldId']].map(y => y['_attributes']['id'])
        return {'name': x['_attributes']['name'],
                'slds': slidelist.filter( y => slideids.map(z => ridmapping[z]).map(z => xmlmapping[z]).includes(y.xmlname)),
        }
      })
    }
    else{
      this.slidelist = [{'name':'Standardabschnitt','slds':slidelist}]
    }
    

  }

  private async parseslides(zipFiles){
    const slidelist_local:any[] =[]
    const slide_paths =Object.keys(zipFiles).filter(name => name.includes('ppt/slides') && !name.includes('_rels/'))
    for(const filepath of slide_paths){
      const json_string = xml2json(zipFiles[filepath].asText(), { compact: true, spaces: 2 });
      const slide_json = JSON.parse(json_string);
      let slidetype = ''
      let subtitle = {};
      let text ={};

      
      let sldobjects = Array.isArray(slide_json['p:sld']['p:cSld']['p:spTree']['p:sp'])? slide_json['p:sld']['p:cSld']['p:spTree']['p:sp']:[slide_json['p:sld']['p:cSld']['p:spTree']['p:sp']]
      let slideguides =this.guides
      if(slide_json['p:sld']['p:cSld']['p:spTree']['p:grpSp']){
        if(Array.isArray(slide_json['p:sld']['p:cSld']['p:spTree']['p:grpSp'])){
          let cursp:any[] = []
          for(const i of slide_json['p:sld']['p:cSld']['p:spTree']['p:grpSp']){
            cursp = [...cursp,...this.getgrouprecursive(i)]
          }
          sldobjects = [...sldobjects,...cursp]
        }
        else{
          sldobjects = [...sldobjects,...this.getgrouprecursive(slide_json['p:sld']['p:cSld']['p:spTree']['p:grpSp'])]
        }
        
      }
      if(slide_json['p:sld']['p:cSld']['p:spTree']['p:pic']){
        if(Array.isArray(slide_json['p:sld']['p:cSld']['p:spTree']['p:pic'])){
          sldobjects = [...sldobjects,...slide_json['p:sld']['p:cSld']['p:spTree']['p:pic']]
        }
        else{
          sldobjects = [slide_json['p:sld']['p:cSld']['p:spTree']['p:pic'],...sldobjects]
        }
      }
      let sldgraphics:any[] = [];
      if(slide_json['p:sld']['p:cSld']['p:spTree']['p:graphicFrame']){
        if(Array.isArray(slide_json['p:sld']['p:cSld']['p:spTree']['p:graphicFrame'])){
          sldgraphics = slide_json['p:sld']['p:cSld']['p:spTree']['p:graphicFrame']
        }
        else{
          sldgraphics = [slide_json['p:sld']['p:cSld']['p:spTree']['p:graphicFrame']]
        }
      }
      sldgraphics = sldgraphics.filter(object  => !object['p:nvGraphicFramePr']?.['p:cNvPr']?.['_attributes']?.['hidden'])
      sldobjects = sldobjects.filter(object => object);
      let sldobjectsidx = sldobjects.filter(object => !object['p:spPr']?.['a:xfrm']).map(sldobject => sldobject['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes'])

      const relsPath = filepath.replace('ppt/slides/', 'ppt/slides/_rels/') + '.rels';

      if (zipFiles[relsPath]) {
        const relsJsonStr = xml2json(zipFiles[relsPath].asText(), { compact: true, spaces: 2 });
        const relsJson = JSON.parse(relsJsonStr);

        const relationships = relsJson?.['Relationships']?.['Relationship'];
        const layoutRel = (Array.isArray(relationships) ? relationships : [relationships])
          .find(rel => rel?._attributes?.Type?.includes('slideLayout'));

        const layoutPath = layoutRel?._attributes?.Target;

        const layoutrelsPath = layoutPath.replace('..', 'ppt').replace('ppt/slideLayouts/', 'ppt/slideLayouts/_rels/') + '.rels';
        let mastersp:any[] =[]
        if(zipFiles[layoutrelsPath]){
          const layoutrelsJsonStr = xml2json(zipFiles[layoutrelsPath].asText(), { compact: true, spaces: 2 });
          const layoutrelsJson = JSON.parse(layoutrelsJsonStr);

          const relationships = layoutrelsJson ?.['Relationships']?.['Relationship'];
          const masterRel = (Array.isArray(relationships) ? relationships : [relationships])
            .find(rel => rel?._attributes?.Type?.includes('slideMaster'));

          const masterpath = masterRel?._attributes?.Target;

          const json_string = xml2json(zipFiles[masterpath.replace('..', 'ppt')].asText(), { compact: true, spaces: 2 });
          const master_json = JSON.parse(json_string);
          if(master_json['p:sldMaster']['p:extLst']){
            this.guides = master_json['p:sldMaster']['p:extLst']['p:ext']['p15:sldGuideLst']['p15:guide'].map( object =>object['_attributes']).map((guide) => {return{...guide,'pos':guide.pos*(this.sizes['cx']/7680)  }})
          }
          else{
            this.guides = [{'orient':'horz','pos': this.sizes['cy']/2},{'pos': this.sizes['cx']/2}]
          }
          this.mastersz = master_json['p:sldMaster']['p:txStyles']['p:bodyStyle']['a:lvl1pPr']['a:defRPr']['_attributes']['sz']
          this.masterfont = master_json['p:sldMaster']['p:txStyles']['p:bodyStyle']['a:lvl1pPr']['a:defRPr']['a:latin']['_attributes']['typeface']
          mastersp = master_json['p:sldMaster']['p:cSld']['p:spTree']['p:sp']
          
        }
        slideguides = [...this.guides]
        if(layoutPath){
          const layoutJsonStr = xml2json(zipFiles[layoutPath.replace('..', 'ppt')].asText(), { compact: true, spaces: 2 });
          const layoutJson = JSON.parse(layoutJsonStr);
          
          
          slidetype = layoutJson['p:sldLayout']['p:cSld']['_attributes']['name']
          
          const layoutsp = Array.isArray(layoutJson['p:sldLayout']['p:cSld']['p:spTree']['p:sp'])? layoutJson['p:sldLayout']['p:cSld']['p:spTree']['p:sp']:[layoutJson['p:sldLayout']['p:cSld']['p:spTree']['p:sp']]
          let layoutguides = layoutJson['p:sldLayout']?.['p:extLst']?.['p:ext']?.['p15:sldGuideLst']?.['p15:guide']
          subtitle = this.extracttitles(slide_json,layoutJson)
          if(layoutguides){
            if(Array.isArray(layoutguides)){
              layoutguides = layoutguides.map( object =>object['_attributes']).map((guide) => {return{...guide,'pos':guide.pos*(this.sizes['cx']/7680)  }})
            }
            else{
              layoutguides = [layoutguides].map( object =>object['_attributes']).map((guide) => {return{...guide,'pos':guide.pos*(this.sizes['cx']/7680)  }})
            }
            slideguides= [...slideguides,...layoutguides]
          }
          
          sldobjectsidx = sldobjectsidx.filter(a => a).map( ph => layoutsp.find(object => object['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['type'] === ph.type && object['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['idx'] === ph.idx ))
          const mastersps:any[] =[]
          for ( const x of sldobjectsidx){
            if(!x['p:spPr']?.['a:xfrm']){
              mastersps.push(mastersp.find(object => object['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['type'] === x['p:nvSpPr']['p:nvPr']['p:ph']['_attributes'].type))
            }
          }
          text = this.extraktTextandsizes(sldobjects,sldgraphics,layoutsp)
          sldobjects = [...sldobjects,...sldobjectsidx,...mastersps]
        }
      }
      
      sldobjects = [...sldobjects.map(object => object['p:spPr']['a:xfrm']),...sldgraphics.map(a => a['p:xfrm']),...this.gettableboxes(sldgraphics)].filter(object => object);
      sldobjects = sldobjects.map((sldobject)  => {return{'pos':{'x': sldobject['a:off']['_attributes']['x'],'y': sldobject['a:off']['_attributes']['y']},
                                                          'ext':{'cy':sldobject['a:ext']['_attributes']['cy'],'cx':sldobject['a:ext']['_attributes']['cx']},
                                                          'deg': sldobject['_attributes']?.['rot']? sldobject['_attributes']?.['rot']/60000 : 0  }})
      slidelist_local.push({'xmlname':filepath.replace('ppt/', ''),'name':'Folie' + filepath.replace('ppt/slides/slide', '').replace('.xml', ''), 'objects':sldobjects,'guides':slideguides,'type':slidetype,'title': this.analyseActiontitle(slide_json),'subtitle':subtitle,'text':text})
    }
    slidelist_local.sort((a,b)=> parseInt(a['name'].replace('Folie', '')) - parseInt(b['name'].replace('Folie', '')))
    return slidelist_local;

  }

  private analyseActiontitle(slide_json){
    const actiotitle_object = {'hasTitle':false,'correctAlignment':false,'noEndChar':false,'text':'','doublespaces':false,id:'','iscorrect':false}
    const slidesp = Array.isArray(slide_json['p:sld']['p:cSld']['p:spTree']['p:sp'])? slide_json['p:sld']['p:cSld']['p:spTree']['p:sp']:[slide_json['p:sld']['p:cSld']['p:spTree']['p:sp']]
    const action_title =slidesp.find((slideobject) => slideobject?.['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['type'] === 'title')
    let action_title_text ='';
    let action_title_object =action_title?.['p:txBody']?.['a:p']?.['a:r']
    if(Array.isArray(action_title?.['p:txBody']?.['a:p'])){
      action_title_object = action_title?.['p:txBody']?.['a:p'].find(a => Object.keys(a).includes('a:r'))['a:r']
    }
    if(Array.isArray(action_title_object)){
      action_title_text = action_title_object.map(objekt => objekt?.['a:t']?.['_text']).reduce((a,b) => a+(b||' '),'')
    }
    else{
      action_title_text = action_title_object?.['a:t']?.['_text']
    }
    
    const action_title_algn = action_title?.['p:txBody']?.['a:p']?.['a:pPr']?.['_attributes']?.['algn']
    if(action_title_text){
      actiotitle_object['id'] = action_title['p:nvSpPr']['p:cNvPr']['_attributes']['id']
      actiotitle_object['hasTitle'] = true;
      actiotitle_object['noEndChar'] = !this.hatSatzschlusszeichen(action_title_text);
      actiotitle_object['text'] = action_title_text;
      actiotitle_object['doublespaces'] = !action_title_text.includes('  ');
      
    }
    if(!action_title_algn){
      if(action_title_text){
        actiotitle_object['correctAlignment'] = true;
      }
    }
    actiotitle_object['iscorrect'] = actiotitle_object['correctAlignment'] && actiotitle_object['doublespaces'] && actiotitle_object['noEndChar']
    return actiotitle_object;
      
  }

  private extracttitles(slide_json,layoutJson){
    const subtitle = {'id':'','text':'','size':0,'color':'','correct':false,'allcaps':false}
    let ph = null;
    const layoutsp = Array.isArray(layoutJson['p:sldLayout']['p:cSld']['p:spTree']['p:sp'])? layoutJson['p:sldLayout']['p:cSld']['p:spTree']['p:sp']:[layoutJson['p:sldLayout']['p:cSld']['p:spTree']['p:sp']]
    if(layoutsp){
      ph = layoutsp?.find((slideobject) => (slideobject?.['p:txBody']?.['a:p']?.['a:r']?.['a:t']?.['_text'] === 'Überschrift')||(slideobject?.['p:txBody']?.['a:p']?.['a:r']?.['a:t']?.['_text'] === 'PROJEKTBESETZUNG'));
    }
    let sldsp = Array.isArray(slide_json['p:sld']['p:cSld']['p:spTree']['p:sp'])? slide_json['p:sld']['p:cSld']['p:spTree']['p:sp']:[slide_json['p:sld']['p:cSld']['p:spTree']['p:sp']]
    sldsp = sldsp.filter(a => a)
    if(ph){
      const subtitle_object = sldsp.find(object => object?.['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['type'] === ph?.['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['type']  && object?.['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['idx'] === ph?.['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['idx']  )
      if(!subtitle_object){
        return subtitle;
      }
      const text = Array.isArray(subtitle_object['p:txBody']?.['a:p']?.['a:r'])? subtitle_object['p:txBody']?.['a:p']?.['a:r'].map( a => a['a:t']?.['_text']).reduce((a,b) => a + b ,''):subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:t']?.['_text']
      if(text){
        subtitle['id']= subtitle_object['p:nvSpPr']['p:cNvPr']['_attributes']['id'];
        subtitle['text'] = text;
        subtitle['size'] = subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['_attributes']?.['sz']?parseInt(subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['_attributes']?.['sz'])/100 : (parseInt(ph['p:txBody']?.['a:lstStyle']?.['a:lvl1pPr']?.['a:defRPr']?.['_attributes']?.['sz'])/100 || this.mastersz/100);
        subtitle['color']= subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['a:solidFill']?.['a:schemeClr']?.['_attributes']?.['val'] ? subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['a:solidFill']?.['a:schemeClr']?.['_attributes']?.['val'] : (ph['p:txBody']?.['a:lstStyle']?.['a:lvl1pPr']?.['a:defRPr']?.['a:solidFill']?.['a:schemeClr']?.['_attributes']?.['val'] )
        subtitle['correct'] = subtitle['size'] === 14 && subtitle['allcaps'] && subtitle['color'] === 'tx2'
        subtitle['allcaps'] = subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['_attributes']?.['cap'] ? subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['_attributes']?.['cap'] === 'all' : ph['p:txBody']?.['a:lstStyle']?.['a:lvl1pPr']?.['a:defRPr']?.['_attributes']?.['cap'] === 'all'
      }

    }
    else{
      const subtitle_object = sldsp.find(object => (680000 <= parseInt(object?.['p:spPr']?.['a:xfrm']?.['a:off']?.['_attributes']?.['x']))  && (parseInt(object?.['p:spPr']?.['a:xfrm']?.['a:off']?.['_attributes']?.['x']) <= 780000 ) && (1230000 <= parseInt(object['p:spPr']?.['a:xfrm']?.['a:off']?.['_attributes']?.['y']))  && (parseInt(object['p:spPr']?.['a:xfrm']?.['a:off']?.['_attributes']?.['x']) <= 1330000 ))
      if(!subtitle_object){
        return subtitle;
      }
      const text = Array.isArray(subtitle_object['p:txBody']?.['a:p']?.['a:r'])? subtitle_object['p:txBody']?.['a:p']?.['a:r'].map( a => a['a:t']?.['_text']).reduce((a,b) => a + b ,''):subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:t']?.['_text']
      if(text){
        subtitle['id']= subtitle_object['p:nvSpPr']['p:cNvPr']['_attributes']['id'];
        subtitle['text'] = text
        subtitle['color']= subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['a:solidFill']?.['a:schemeClr']?.['_attributes']?.['val']
        subtitle['allcaps'] = subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['_attributes']?.['cap'] === 'all'
        subtitle['size'] = subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['_attributes']?.['sz']? parseInt(subtitle_object['p:txBody']?.['a:p']?.['a:r']?.['a:rPr']?.['_attributes']?.['sz'])/100 : this.mastersz/100
        subtitle['correct'] = subtitle['size'] === 14 && subtitle['allcaps'] && subtitle['color'] === 'tx2'
      }
    }
    return subtitle;
  
  }

  private hatSatzschlusszeichen(text) {
    const satzschlusszeichen = /[.!?]$/;
    return satzschlusszeichen.test(text.trim());
  }

  public layoutobject(slideobject,layoutsp){
    const ph = slideobject['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']
    if(ph){
      return layoutsp.find(object => object?.['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['type'] === ph.type && object?.['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['idx'] === ph.idx )
    }
    return {}
    
  }

  public extraktTextandsizes(slideobjects,slidegraphics,layoutsp){
    slideobjects = [...slideobjects.filter((slideobject) => slideobject?.['p:nvSpPr']?.['p:nvPr']?.['p:ph']?.['_attributes']?.['type'] === 'body'),...slideobjects.filter((slideobject) => !slideobject?.['p:nvSpPr']?.['p:nvPr']?.['p:ph'])]
    const slidegraphicsobjects = slidegraphics.map(a => a?.['a:graphic']?.['a:graphicData']?.['a:tbl'])
      .filter(a => a?.['a:tr'])
      .map(obj => Array.isArray(obj['a:tr'])?obj['a:tr']:[obj['a:tr']])
      .reduce((a,b) => [...a,...b],[])
      .map(obj => Array.isArray(obj['a:tc'])?obj['a:tc']:[obj['a:tc']])
      .reduce((a,b) => [...a,...b],[]).map((object) => object['a:txBody'])
    slideobjects =[...slideobjects,...slidegraphicsobjects]
    const wrongbuchars = slideobjects.filter(a => a)
      .map((slideobject) => slideobject?.['p:txBody'])
      .filter(a => a)
      .map(obj => Array.isArray(obj['a:p'])?obj['a:p']:[obj['a:p']])
      .reduce((a,b) => [...a,...b],[]).filter(a => a['a:pPr']?.['a:buChar']?.['_attributes']?.['char'])
      .filter(a => a['a:pPr']?.['a:buChar']?.['_attributes']?.['char'] !== '§')
    slideobjects = slideobjects.filter(a => a)
      .map((slideobject) => [slideobject?.['p:txBody'],slideobject])
      .filter(([a,b]) => a)
      .map(([a,b]) => {
        const pragraphs = Array.isArray(a['a:p'])?a['a:p']:[a['a:p']]
        return pragraphs.map((r) => {return [r,b]})
      })
      .reduce((a,b) => [...a,...b],[])
      .filter(([a,b]) => a['a:r'])
      .map(([a,b]) => {
        const pragraphs = Array.isArray(a['a:r'])?a['a:r']:[a['a:r']]
        return pragraphs.map((r) => {return [r,b]})
      })
      .reduce((a,b) => [...a,...b],[])
      .filter(([a,b]) => a?.['a:t']?.['_text'])
      .map(([a,b]) => {return{
        'text':a['a:t']['_text'],
        'size': a['a:rPr']?.['_attributes']?.['sz'] ? a['a:rPr']?.['_attributes']?.['sz']: this.layoutobject(b,layoutsp)['p:txBody']?.['a:lstStyle']?.['a:lvl1pPr']?.['a:defRPr']?.['_attributes']?.['sz'] || this.mastersz ,
        'font': a['a:rPr']?.['a:latin']?.['_attributes']?.['typeface']?a ['a:rPr']?.['a:latin']?.['_attributes']?.['typeface'] : this.layoutobject(b,layoutsp)['p:txBody']?.['a:lstStyle']?.['a:lvl1pPr']?.['a:defRPr']?.['a:latin']?.['_attributes']?.['typeface'] || this.masterfont,'obj' : this.layoutobject(b,layoutsp)
      }})
    if(slideobjects.length > 0){
      const average_sz =slideobjects.reduce((a,b) => a + parseInt(b['size']),0)/slideobjects.length
      const slideojectunique = slideobjects.map(b => parseInt(b['size'])).filter((value, index, self) => self.indexOf(value) === index)
      let std_div = 0
      if(slideobjects.length === 1){
        std_div = 100
      }
      else{
        std_div =((slideobjects.length - slideojectunique.length)/(slideobjects.length-1))*100
      }
      
      const toosmall = slideobjects.filter( a => parseInt(a['size']) <= 899)
      const wrongfont = slideobjects.filter( a => a['font'] !== 'Arial')
      const nodoublespaces = slideobjects.filter( a => a['text'].includes('  '))
      const iscorrect = (toosmall.length === 0) && (wrongfont.length === 0) && (nodoublespaces.length === 0) && (wrongbuchars.length === 0)
      return{'hastext':true,'average_sz':average_sz,'std_div':std_div,'toosmall':toosmall,'wrongfont':wrongfont,'nodoublespaces':nodoublespaces,'wrongbuchars':wrongbuchars,'iscorrect':iscorrect}
    }

    return{'hastext':false , 'iscorrect': false}
    
    
  }

  
}
</script>

<style scoped>
.padding5{
  padding: 20px;
  margin-bottom: 10px;
}
.textrestricktor{
  max-height:100px;
  overflow:hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;      /* Number of lines */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.sticky-sub-toolbar {
  position: sticky;
  top: 64px; /* Adjust to height of the main toolbar (default is 64px on desktop) */
  z-index: 9; /* Slightly less than the fixed one if necessary */
}
</style>