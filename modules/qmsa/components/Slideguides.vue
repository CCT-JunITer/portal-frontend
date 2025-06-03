<template>
  <div class="line-container">
    
    <div 
      v-for="(item, index) in sideobjects"
      :key="item.id+ 'and' + index"
      class="box"
      :style="boxStyle(item)"
      :class="{'errorbox': objektIntersect(item)}"
    ></div>
    <div
      v-for="item in guides"
      :key="item.id+ ' ' + item.pos"
    >
      <div 
        v-if="item.orient"
        class="line horizontal"
        :style="lineStyle(item.pos,'horizontal')">
      </div>
      <div 
        v-else
        class="line vertical"
        :style="lineStyle(item.pos,'vertical')">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from 'vue-property-decorator'

@Component({})
export default class SlideguidesView extends Vue {
  @Prop()
  public sideobjects:any;

  @Prop()
  public guides:any;

  @Prop()
  public shrink:any;

  @Prop()
  public sizes:any;

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


  private objektIntersect(sldobject){
    const corners = this.getSldobjetctConers(sldobject)
    const edges = [
      [corners[0], corners[1]],
      [corners[1], corners[2]],
      [corners[2], corners[3]],
      [corners[3], corners[0]]
    ];
    for(const i of this.guides){
      if(i.orient){
        if(edges.some(([p1, p2]) => this.lineIntersect(p1, p2, [0,parseFloat(i.pos)],[parseFloat(this.sizes['cx']),parseFloat(i.pos)]))){
          return true
        }
      }
      else{
        if(edges.some(([p1, p2]) => this.lineIntersect(p1, p2, [parseFloat(i.pos),0],[parseFloat(i.pos),parseFloat(this.sizes['cy'])]))){
          return true
        }
      }
      
      
    }
    return false
  }

  public getSldobjetctConers(sldobject){
    const x = parseFloat(sldobject['pos']['x'])
    const y = parseFloat(sldobject['pos']['y'])
    const cx = parseFloat(sldobject['ext']['cx'])
    const cy = parseFloat(sldobject['ext']['cy'])
    const points = [
      [x + this.shrink, y + this.shrink],
      [x + cx - this.shrink, y + this.shrink],
      [x + cx - this.shrink, y + cy - this.shrink],
      [x + this.shrink, y + cy - this.shrink]
    ];
    const angle = this.degToRad(sldobject['deg'])

    const centerX = x + cx / 2;
    const centerY = y + cy/ 2;

    return points.map(([px, py]) => this.rotatePoint(px,py,centerX,centerY,angle))
  }

  public degToRad(deg) {
    return parseFloat(deg) * Math.PI / 180;
  }

  public rotatePoint(px, py, cx, cy, angleRad) {
    const s = Math.sin(angleRad);
    const c = Math.cos(angleRad);

    px -= cx;
    py -= cy;

    const xnew = px * c - py * s;
    const ynew = px * s + py * c;

    return [xnew + cx, ynew + cy];
  }

  public lineIntersect(p1, p2, q1, q2) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [x3, y3] = q1;
    const [x4, y4] = q2;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return false;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }


}
</script>

<style scoped>
.line-container {
  position: relative;
  max-width: 100%;
  aspect-ratio: 16/9;
  margin: 5px;
  border: 5px solid rgb(133, 133, 133);
  overflow: hidden;
}

.line {
  position: absolute;
  background-color: #76225973;
}

.line.horizontal {
  height: 2px;
  width: 100%;
}

.line.vertical {
  width: 2px;
  height: 100%;
}
.box{
  position: absolute;
  border: 2px dotted #1d457c;
}
.border{
  border: 2p solid black;
}
.errorbox{
  border: 2px solid rgb(255, 0, 0,0.7) !important;
  background-color: rgba(255, 0, 0, 0.3) !important;
}
.box.test{
  top: 0%;
  left:20%;
  width: 60%;
  height: 50%;
}
.padding5{
  padding: 5px;
  margin-bottom: 10px;
}
</style>