import{r as e,j as t}from"./vendor-react-BpTY7yiE.js";import{g as o}from"./vendor-styled-C627iCzh.js";import{u as r,S as i,g as a}from"./vendor-gsap-sLndfopB.js";import{u as s,B as l}from"./index-DLsuJKUZ.js";import"./vendor-three-vk0p53NZ.js";a.registerPlugin(i,r);const n=o.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  z-index: 1;
`,c=o.div`
  position: absolute;
  top: 2px;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(0.9);
  transform-origin: 50% 100%;
  will-change: auto;
`,p=({src:o,aspectRatio:p="1920/1080",style:m,full:f=!1,sectionName:b,backgroundColor:x="transparent",noScrub:w=!1,lineColor:v="transparent"})=>{const j=e.useRef(null),y=e.useRef(null),k=e.useRef(null),R=e.useRef(null),{isMobileOrTablet:S}=s();return r(()=>{const e=S?document.querySelector("#smooth-wrapper")||document.body:void 0;i.create({trigger:j.current,start:"top bottom",scroller:e,end:"bottom top",onEnter:()=>{a.killTweensOf(R.current,"opacity"),a.killTweensOf(k.current,"filter"),a.set(R.current,{autoAlpha:0,y:"100%"})}}),i.create({trigger:j.current,start:"40% bottom",end:"bottom top",scroller:e,onEnter:()=>{a.to(R.current,{autoAlpha:1,duration:.8,ease:"power3.out"}),a.to(R.current,{y:"0%",duration:.8,ease:"power3.out"})}})},{scope:j}),t.jsxs(t.Fragment,{children:[t.jsxs(h,{$aspectRatio:"2877/1349",$full:f,ref:j,style:{...m,"--lineColor":v},children:[t.jsx(u,{ref:R,style:{willChange:"opacity",visibility:"hidden",opacity:0,transform:"translateY(100%)",background:"radial-gradient(129.1% 101.72% at 50% 100%, #FFF 0%, #000 100%)"}}),t.jsx(g,{ref:y}),t.jsxs(c,{ref:k,children:[t.jsx(n,{src:"/assets/sharex/share_FullScreen_pc.png",alt:"",loading:"lazy",className:"is-pc",style:{}}),t.jsx(n,{src:"/assets/sharex/share_FullScreen_mo.png",alt:"",loading:"lazy",className:"is-mobile"})]})]}),t.jsxs(d,{children:[t.jsx(l,{text:"GEN AI",theme:"black",enableScrollTrigger:!0,size:"small"}),t.jsx(l,{text:"2024",fill:"true",theme:"black",size:"small",enableScrollTrigger:!0})]})]})},d=o.div`
  display: flex;
  flex-direction: row;
  gap: var(--gap8);
  padding: 16px 0 0 16px;
  margin-bottom: var(--gap500);
`,u=o.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
`,g=o.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`,h=o.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  width: 100vw;
  aspect-ratio: ${e=>e.$aspectRatio};

  @media (max-width: 1024px) {
    aspect-ratio: 563/729;
  }

  overflow: hidden;

  &::before {
    position: absolute;
    content: '';
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--lineColor);
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: 50% 100%;
  }
`;export{p as default};
