import{r as e,j as i}from"./vendor-react-BpTY7yiE.js";import{u as r,S as t,g as s}from"./vendor-gsap-sLndfopB.js";import{g as n}from"./vendor-styled-C627iCzh.js";import{t as a}from"./index-DLsuJKUZ.js";import"./vendor-three-vk0p53NZ.js";s.registerPlugin(t);const l=({symbolRef:n,symbolContainerRef:a})=>{e.useRef();const l=e.useRef([]),f=e.useRef();return r(()=>{const e=f.current.querySelectorAll(".left"),i=f.current.querySelectorAll(".right"),r=t.create({trigger:f.current.querySelector("[data-start]"),start:"bottom bottom",id:"line-draw",onLeaveBack:()=>{e.forEach(e=>{e.classList.remove("animate")}),i.forEach(e=>{e.classList.remove("animate")})},onEnter:()=>{e.forEach((e,i)=>{s.delayedCall(.15*i,()=>{e.classList.add("animate")})}),i.forEach((e,i)=>{s.delayedCall(.15*i,()=>{e.classList.add("animate")})})}});return l.current.push(r),()=>{l.current.forEach(e=>{e.kill()}),l.current=[]}},{scope:f}),i.jsx(o,{ref:f,children:i.jsxs(c,{children:[i.jsxs(d,{style:{width:"var(--grid-5)",textAlign:"left"},"data-start":!0,children:[i.jsxs(h,{className:"is-pc",children:[i.jsxs(m,{children:[i.jsx(j,{children:"we don’t aim for"}),i.jsx(x,{className:"line-inner left",children:"we don’t aim for"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"what seems great"}),i.jsx(x,{className:"line-inner left",children:"what seems great"})]})]}),i.jsxs(h,{className:"is-mobile",children:[i.jsxs(m,{children:[i.jsx(j,{children:"we don’t"}),i.jsx(x,{className:"line-inner left",children:"we don’t"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"aim for"}),i.jsx(x,{className:"line-inner left",children:"aim for"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"what"}),i.jsx(x,{className:"line-inner left",children:"what"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"seems"}),i.jsx(x,{className:"line-inner left",children:"seems"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"great"}),i.jsx(x,{className:"line-inner left",children:"great"})]})]})]}),i.jsxs(d,{style:{width:"var(--grid-5)"},className:"align-right",children:[i.jsxs(h,{className:"is-pc",style:{justifyContent:"flex-end"},children:[i.jsxs(m,{children:[i.jsx(j,{children:"we strive to create"}),i.jsx(x,{className:"line-inner right",children:"we strive to create"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"what truly is"}),i.jsx(x,{className:"line-inner right",children:"what truly is"})]})]}),i.jsxs(h,{className:"is-mobile",children:[i.jsxs(m,{children:[i.jsx(j,{children:"we "}),i.jsx(x,{className:"line-inner right",children:"we"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"strive"}),i.jsx(x,{className:"line-inner right",children:"strive"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"to create"}),i.jsx(x,{className:"line-inner right",children:"to create"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"what truly"}),i.jsx(x,{className:"line-inner right",children:"what truly"})]}),i.jsxs(m,{children:[i.jsx(j,{children:"is"}),i.jsx(x,{className:"line-inner right",children:"is"})]})]})]})]})})},c=n.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 45dvh calc(var(--grid-1) + calc(var(--grid-gap) * 2));
  max-width: 100vw;
  min-width: max-content;
  white-space: nowrap;
  @media (max-width: 1024px) {
    padding: 0;
    flex-direction: column;
    gap: var(--gap140);
  }
`,d=n.div`
  ${a.Header_Large}
  color: var(--text-color-black);
  z-index: 2;
  // text-align: center;
  overflow: hidden;
  @media (max-width: 1024px) {
    width: var(--grid-4) !important;
    &.align-right {
      text-align: right;
      width: max-content !important;
      margin-right: 0 !important;
      margin-left: auto !important;
      justify-content: flex-end !important;
      align-items: flex-end !important;
    }
    font-size: 14vw;
    letter-spacing: -0.03em;
  }
`,o=n.div`
  width: 100vw;
  padding: var(--gap120) 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 1024px) {
    padding: 0 16px;
  }
`,h=n.div`
  position: relative;
  display: flex;
  flex-direction: column;
`,m=n.div`
  position: relative;
  overflow: hidden;
`,x=n.div`
  position: absolute;
  top: 0;
  left: 0;
  width: max-content;
  height: 100%;
  transition: transform 1s var(--expoOut);
  &.animate.right {
    transform: translateX(calc(var(--grid-5) - 100%));
  }
  &.left {
    transform: translateX(calc(var(--grid-5) - 100%));
  }
  &.left.animate {
    transform: translateX(0);
  }
`,j=n.div`
  position: relative;
  opacity: 0;
`;export{l as default};
