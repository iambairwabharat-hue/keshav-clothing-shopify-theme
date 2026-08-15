import{r as t,j as e}from"./vendor-react-BpTY7yiE.js";import{g as o}from"./vendor-styled-C627iCzh.js";import{g as i,S as a,u as s}from"./vendor-gsap-sLndfopB.js";import"./index-DLsuJKUZ.js";import"./vendor-three-vk0p53NZ.js";i.registerPlugin(a,s);const r=({src:o,aspectRatio:i="1920/1080",style:a,full:s=!1,sectionName:r,backgroundColor:c="transparent",noScrub:p=!1,lineColor:d="#000"})=>{const g=t.useRef(null),m=t.useRef(null),f=t.useRef(null);return e.jsx(e.Fragment,{children:e.jsxs(l,{$aspectRatio:"3366/506",$full:s,ref:g,style:{...a,margin:"30dvh 0","--lineColor":d},children:[e.jsx(n,{ref:f,style:{background:"linear-gradient(180deg, black, rgba(255,255,255,0))"}}),e.jsx("img",{src:"/assets/bx/bx_HFashion_FullScreen_pc.png",alt:"",loading:"lazy",className:"is-pc",ref:m,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",willChange:"transform",zIndex:1}}),e.jsx("img",{src:"/assets/bx/bx_HFashion_FullScreen_mo.jpg",alt:"",loading:"lazy",ref:m,className:"is-mobile",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",willChange:"transform",zIndex:1}})]})})};o.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--gap8);
  padding: 16px 0 0 16px;
  margin-bottom: var(--gap500);
`;const n=o.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
`,l=o.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  width: 100vw;
  aspect-ratio: ${t=>t.$aspectRatio};

  overflow: hidden;
  transform: scale(1.01) !important;
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
  @media (max-width: 1024px) {
    aspect-ratio: 564/167;
  }
`;export{r as default};
