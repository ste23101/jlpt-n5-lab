// Geometric practice feedback, entirely local; not OCR or an official score.
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
export function resample(points,count=24){
 const p=points.filter(v=>Array.isArray(v)&&v.length===2&&v.every(Number.isFinite));if(p.length<2)return [];
 const lengths=[0];for(let i=1;i<p.length;i++)lengths.push(lengths.at(-1)+distance(p[i-1],p[i]));const total=lengths.at(-1);if(total<.01)return [];
 let at=1;return Array.from({length:count},(_,i)=>{const target=total*i/(count-1);while(at<lengths.length-1&&lengths[at]<target)at++;const span=lengths[at]-lengths[at-1],t=span?(target-lengths[at-1])/span:0;return[p[at-1][0]+(p[at][0]-p[at-1][0])*t,p[at-1][1]+(p[at][1]-p[at-1][1])*t];});
}
export function normalize(strokes){
 const valid=strokes.map(s=>resample(s)).filter(s=>s.length);if(!valid.length)return [];
 const points=valid.flat(),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),span=Math.max(x1-x0,y1-y0);if(span<.01)return [];
 return valid.map(s=>s.map(([x,y])=>[(x-(x0+x1)/2)*90/span+54.5,(y-(y0+y1)/2)*90/span+54.5]));
}
const average=a=>a.reduce((s,x)=>s+x,0)/a.length;
const chamfer=(a,b)=>average(a.map(p=>Math.min(...b.map(q=>distance(p,q)))));
export function compareWriting(input,model){
 const a=normalize(input),b=normalize(model);if(!a.length||!b.length)return {score:0,shape:0,sequence:0,count:false,directions:[],empty:true};
 const shapeDistance=(chamfer(a.flat(),b.flat())+chamfer(b.flat(),a.flat()))/2;
 const shape=Math.max(0,Math.round(100-shapeDistance*3.3));const count=a.length===b.length;
 const perStroke=a.slice(0,b.length).map((s,i)=>average(s.map((p,j)=>distance(p,b[i][j]))));
 const sequence=perStroke.length?Math.max(0,Math.round(100-average(perStroke)*2.1)):0;
 const directions=a.slice(0,b.length).map((s,i)=>{const forward=distance(s[0],b[i][0])+distance(s.at(-1),b[i].at(-1));const reverse=distance(s[0],b[i].at(-1))+distance(s.at(-1),b[i][0]);return reverse+8<forward?i+1:null;}).filter(Boolean);
 return {score:Math.round((shape*.7+sequence*.3)*(count?1:Math.max(.35,1-Math.abs(a.length-b.length)*.16))),shape,sequence,count,directions,empty:false};
}
export function assessWriting(input,models,expected){
 const valid=input.filter(s=>resample(s).length);if(!valid.length)return {empty:true,message:'Disegna prima un kanji con almeno un tratto.'};
 const points=valid.flat(),span=Math.max(Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1])));
 if(span<12)return {empty:true,message:'Il segno è troppo piccolo: usa una parte più ampia del riquadro.'};
 const ranked=Object.entries(models).map(([word,strokes])=>({word,...compareWriting(valid,strokes)})).sort((a,b)=>b.score-a.score);
 const target=ranked.find(r=>r.word===expected);if(!target)return {empty:true,message:'Modello non disponibile per questo carattere.'};
 const coherent=target.score>=76&&target.shape>=78&&target.count&&target.sequence>=65&&!target.directions.length;
 return {empty:false,target,coherent,suggestions:ranked.slice(0,3),confident:ranked[0]?.score>=78&&ranked[0].score-(ranked[1]?.score||0)>=7,strokes:valid.length,expectedStrokes:models[expected].length};
}
