import{r as e,j as t}from"./vendor-react-BpTY7yiE.js";import{g as r,S as i,u as a}from"./vendor-gsap-sLndfopB.js";import{g as n}from"./vendor-styled-C627iCzh.js";import{a as s,b as o,B as l,t as d}from"./index-DLsuJKUZ.js";import"./ProjectManifesto-8QtnQhba.js";import"./vendor-three-vk0p53NZ.js";import"./useCountingAnimation-BcRsqbCU.js";r.registerPlugin(i,a);const c=n.div`
  position: relative;
  width: 100vw;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 280px 0;
  margin-bottom: 280px;
  @media screen and (max-width: 1024px) {
    margin-bottom: var(--gap360);
  }
`;n.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`,n.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;const h=n.div`
  ${d.Header_Medium};
  color: var(--text-color-white);
  width: var(--grid-5);
  height: max-content;
  flex-direction: column;
  align-items: center;
  padding: 0;
  z-index: 2;
  text-align: center;
  overflow: hidden;
  @media (max-width: 1024px) {
    flex-direction: column;
    width: 100%;
  }
`,m=n.div`
  position: relative;
  display: flex;
  flex-direction: column;
  ${d.Header_Medium};
  overflow: hidden;
  line-height: 1.2;
`,x=n.div`
  ${d.Header_Medium}
  line-height: 1.2;

  @media (max-width: 1024px) {
    width: 100%;
    text-align: center;
    margin: 0 auto;
    font-size: 8vw;
  }
`,g=n.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-30%, -50%);
  width: max-content;
  margin: auto;
  @media (max-width: 1024px) {
    left: 50%;
    transform: translate(-50%, -130%);
  }

  &.share-wrap-right {
    left: auto;
    right: 0;
    transform: translateX(30%);
    @media (max-width: 1024px) {
      right: unset;
      left: 50%;
      transform: translate(-50%, 10%);
    }
    .share-container-right {
      // transform: scaleX(0);
      transform-origin: right center;
    }

    .share-line-right {
      position: absolute;
      width: 0;
      right: 0;
      width: 100%;
      height: 100%;
      margin: auto;
      transform: translate(20%, -50%) scaleX(1.4);
      background-color: transparent;
      transform-origin: center center;
      @media (max-width: 1024px) {
        right: auto;
        left: 50%;
        transform: translate(-50%, 25%) scaleX(1.4);
      }
      &::before {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        content: '';
        position: absolute;
        width: 100%;
        height: 12px;
        background-color: var(--text-color-white);
        margin: auto;
        @media (max-width: 1024px) {
          height: 8px;
        }
      }
    }
  }
`,f=n.div`
  width: var(--grid-6);
  height: var(--grid-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-right: auto;
  @media (max-width: 1024px) {
    width: 99vw;
    height: 99vw;
  }
`,u=n.div`
  width: clamp(7rem, 7.9vw, 15rem);
  height: clamp(7rem, 7.9vw, 15rem);
  border-radius: 50%;
  border: 12px solid var(--text-color-white);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-200%);
  &.circle-top {
    transform: translateY(200%);
  }
  @media (max-width: 1024px) {
    border-width: 8px;
  }
`,p=n.div`
  width: 85%;
  height: 12px;
  background-color: var(--text-color-white);
  // transform: scaleX(0);
  transform-origin: left center;
  will-change: transform;
  @media (max-width: 1024px) {
    height: 8px;
    width: 99vw;
  }
`,w=e.forwardRef(({symbolRef:a,symbolContainerRef:n},d)=>{const w=e.useRef(),b=e.useRef(),j=e.useRef(),{containerRef:v}=s({enableDeviceFiltering:!0}),{containerRef:y}=s({enableDeviceFiltering:!0});e.useRef(!1),e.useRef(!1);const R=e.useRef();e.useRef();const N=e.useRef(),S=e.useRef();e.useRef([]),o();const[k,M]=e.useState("");return e.useEffect(()=>{const e=()=>{r.to(w.current,{autoAlpha:1,y:0,duration:1,ease:"expo.out"}),r.to(b.current,{autoAlpha:1,y:0,duration:1,ease:"expo.out"})},t=()=>{r.to(N.current,{rotate:"45deg",duration:1,ease:"expo.out",delay:.15}),r.to(S.current,{rotate:"-45deg",duration:1,ease:"expo.out",delay:.15})},a=r.matchMedia();a.add("(min-width: 1025px)",()=>{i.create({trigger:R.current.querySelector(".share-line"),start:"top+=100px bottom",end:"bottom bottom",onEnter:()=>{window.innerWidth>1024&&(e(),t())}})}),a.add("(max-width: 1024px)",()=>{i.create({trigger:R.current.querySelector(".share-line"),start:"top+=60px bottom",end:"bottom bottom",once:!0,markers:!0,id:"is-mobile-1",onEnter:()=>{var t;e(),null==(t=i.getById("project-list-scroll"))||t.refresh()}}),i.create({trigger:R.current.querySelector(".share-container-right"),start:"80%+=40px bottom",end:"bottom bottom",once:!0,id:"is-mobile",markers:!0,onEnter:()=>{t()}})})},[]),t.jsxs(c,{ref:R,children:[t.jsx(g,{children:t.jsxs(f,{children:[t.jsx(u,{ref:w,className:"circle-top"}),t.jsx(p,{ref:j,className:"share-line"}),t.jsx(u,{ref:b})]})}),t.jsx(g,{className:"share-wrap-right",children:t.jsxs(f,{className:"share-container-right",children:[t.jsx(p,{ref:N,className:"share-line-right"}),t.jsx(p,{ref:S,className:"share-line-right"})]})}),t.jsx(l,{text:"We grow stronger and faster",theme:"black",enableScrollTrigger:!0}),t.jsx(l,{text:"when we share together.",fill:"true",enableScrollTrigger:!0}),t.jsxs(h,{className:"is-pc",ref:v,style:{display:"none !important"},children:[t.jsx(m,{children:t.jsx(x,{className:"sub-title",children:"We grow stronger and faster"})}),t.jsx(m,{children:t.jsx(x,{className:"sub-title",children:"when we share together."})})]}),t.jsxs(h,{className:"is-mobile",ref:y,children:[t.jsx(m,{children:t.jsx(x,{className:"sub-title",children:"We grow stronger"})}),t.jsx(m,{children:t.jsx(x,{className:"sub-title",children:"and faster"})}),t.jsx(m,{children:t.jsx(x,{className:"sub-title",children:"when we share "})})," ",t.jsx(m,{children:t.jsx(x,{className:"sub-title",children:" together. "})})]})]})});export{w as default};
