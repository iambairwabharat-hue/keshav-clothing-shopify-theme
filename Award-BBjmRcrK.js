import{r as e,j as t}from"./vendor-react-BpTY7yiE.js";import{S as r,g as n}from"./vendor-gsap-sLndfopB.js";import{g as s}from"./vendor-styled-C627iCzh.js";import{b as i,u as a,t as o}from"./index-DLsuJKUZ.js";import"./vendor-three-vk0p53NZ.js";n.registerPlugin(r);const c=s.div`
  position: relative;
  width: 100vw;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 64px 16px;
  padding-bottom: 180px;
`,u=s.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`,l=s.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`,d=s.div`
  position: relative;
  ${o.Hero_Intro}
  color: var(--text-color-black);
  white-space: nowrap;
  z-index: 2;
`,f=s.div`
  opacity: 0;
  &:first-of-type {
    opacity: 1;
  }
`;s.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 52px;
`;const x=e.forwardRef(({symbolRef:s,symbolContainerRef:o},x)=>{const m=e.useRef(),p=e.useRef(!1),y=e.useRef(!1),h=e.useRef(!1),g=e.useRef(!1),j=e.useRef();e.useRef();const b=e.useRef([]);i();const{isMobileOrTablet:v}=a(),[w,R]=e.useState(""),A=e=>{const t=`[Award] ${e}<br />${(new Date).toLocaleTimeString()}`;R(t);const r=document.querySelector("#debug");r&&(r.innerHTML+=`<br />${t}`)},N=()=>{if(p.current||y.current)return;p.current=!0,A("인트로 시작");const e=j.current;m.current=n.context(()=>{const e=n.timeline({onComplete:()=>{y.current=!0,A("인트로 완료")}}),t=n.utils.toArray(".sub-title").filter((e,t)=>t>0),[r,s]=[[t[0],t[1]],[t[2],t[3],t[4]]],i=.15;t.forEach(e=>{const{x:t=100,y:r=100}=e.dataset;n.set(e,{x:t,y:r})}),e.addLabel("start"),e.set(j.current,{autoAlpha:1},"start"),e.to(r,{autoAlpha:1,duration:1.2,stagger:i,ease:"expo.out"},"start").to(r,{x:0,y:0,duration:1.2,stagger:i,ease:"expo.out"},"start");const a="start+=0.5";e.to(s,{autoAlpha:1,duration:1.2,stagger:i,ease:"expo.out"},a).to(s,{x:0,y:0,duration:1.2,stagger:i,ease:"expo.out"},a)},e)};return e.useEffect(()=>{if(!document.querySelector('[data-section="history"]'))return;p.current=!1,y.current=!1,h.current=!1,g.current=!1;const e=setTimeout(()=>{b.current.forEach(e=>{e.kill()}),b.current=[];const e=v?document.querySelector("#smooth-wrapper")||document.body:void 0,t=r.create({trigger:j.current,start:"top 50%",end:"bottom 20%",once:!0,refreshOnResize:!0,...e&&{scroller:e,pinType:"fixed"},onEnter:()=>{N()},id:"award-0"});b.current.push(t)},100);return()=>{clearTimeout(e),m.current&&m.current.revert(),b.current.forEach(e=>{e.kill()}),b.current=[]}},[]),e.useEffect(()=>{if(document.querySelector('[data-section="history"]'))return()=>{}},[s]),e.useImperativeHandle(x,()=>({executeIntroAnimation:()=>{y.current||p.current||N()},executeOutroAnimation:()=>{y.current&&!h.current&&(()=>{if(h.current||g.current)return;h.current=!0,A("아웃트로 시작");const e=j.current;m.current=n.context(()=>{},e)})()}}),[]),t.jsx(c,{ref:j,children:t.jsxs(u,{children:[t.jsx(l,{style:{justifyContent:"flex-start"},children:t.jsx(d,{className:"main-title",children:t.jsx(f,{className:"sub-title","data-x":"30","data-y":"100%",children:"SELECTED"})})}),t.jsx(l,{children:t.jsx(d,{className:"main-title",children:t.jsx(f,{className:"sub-title","data-x":"30","data-y":"40",children:"AWARDS"})})}),t.jsx(l,{style:{justifyContent:"flex-end",gap:"33px"},children:t.jsx(d,{className:"main-title",children:t.jsx(f,{className:"sub-title","data-x":"-100","data-y":"40",children:"AND"})})}),t.jsx(l,{style:{justifyContent:"flex-end"},children:t.jsx(d,{className:"main-title",children:t.jsx(f,{className:"sub-title","data-x":"200","data-y":"40",children:"HONORS"})})})]})})});export{x as default};
