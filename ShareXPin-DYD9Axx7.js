import{r as e,j as s}from"./vendor-react-BpTY7yiE.js";import{u as r,g as i,S as a}from"./vendor-gsap-sLndfopB.js";import{g as t}from"./vendor-styled-C627iCzh.js";import{u as n}from"./index-DLsuJKUZ.js";import"./vendor-three-vk0p53NZ.js";i.registerPlugin(a,r);const o=()=>{const t=e.useRef(null);e.useRef(null),e.useRef(null);const o=e.useRef([]),{isMobileOrTablet:h}=n();return r(()=>{const e=h?document.querySelector("#smooth-wrapper"):void 0;o.current.forEach(e=>{e.kill()}),o.current=[];return t.current.querySelectorAll(".pin-content").forEach((s,r)=>{i.timeline({scrollTrigger:{trigger:s,start:()=>"top-=10% bottom",end:()=>"bottom top-=2%",scrub:!0,id:`shareXPin-${4+r}`,invalidateOnRefresh:!0,immediateRender:!1,...e&&{scroller:e}}}).to(s.querySelector(".image-inner"),{scale:1}),i.timeline({scrollTrigger:{trigger:s,pin:s,pinSpacing:!1,start:"top top",invalidateOnRefresh:!0,immediateRender:!1,...e&&{scroller:e},end:()=>{},id:`shareXPin-${r}`,scrub:!0,pinType:h&&"fixed",anticipatePin:1}});const t=a.getById(`shareXPin-${4+r}`),n=a.getById(`shareXPin-${r}`);t&&o.current.push(t),n&&o.current.push(n)}),()=>{o.current.forEach(e=>{e.kill()}),o.current=[]}},{scope:t}),s.jsxs(c,{ref:t,children:[s.jsx(m,{className:"pin-content",children:s.jsxs(l,{className:"image-inner",children:[s.jsx("img",{className:"is-pc",src:"/assets/sharex/share_pin_image_01_pc.jpg",alt:"sharex"}),s.jsx("img",{className:"is-mobile",src:"/assets/sharex/share_pin_image_01_mo.jpg",alt:"sharex"})]})}),s.jsx(m,{className:"pin-content",children:s.jsxs(l,{className:"image-inner",children:[s.jsx("img",{className:"is-pc",src:"/assets/sharex/share_pin_image_02_pc.jpg",alt:"sharex"}),s.jsx("img",{className:"is-mobile",src:"/assets/sharex/share_pin_image_02_mo.jpg",alt:"sharex"})]})}),s.jsx(m,{className:"pin-content",children:s.jsxs(l,{className:"image-inner",children:[s.jsx("img",{className:"is-pc",src:"/assets/sharex/share_pin_image_03_pc.jpg",alt:"sharex"}),s.jsx("img",{className:"is-mobile",src:"/assets/sharex/share_pin_image_03_mo.jpg",alt:"sharex"})]})}),s.jsx(m,{className:"pin-content",children:s.jsxs(l,{className:"image-inner",children:[s.jsx("img",{className:"is-pc",src:"/assets/sharex/share_pin_image_04_pc.jpg",alt:"sharex"}),s.jsx("img",{className:"is-mobile",src:"/assets/sharex/share_pin_image_04_mo.jpg",alt:"sharex"})]})})]})},c=t.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`,l=t.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
`,m=t.div`
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  will-change: transform;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;

    @media (max-width: 1024px) {
        width: 100vw;
      height: 100dvh;
      object-fit: cover;
      object-position: center;
      transform-origin: center;
      transform-box: fill-box;
      transform-origin: center;
    }
`;export{o as default};
