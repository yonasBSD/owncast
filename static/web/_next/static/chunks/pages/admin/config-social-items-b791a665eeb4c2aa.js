(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[30],{48689:function(e,t,n){"use strict";n.d(t,{Z:function(){return r}});var a=n(1413),l=n(67294),s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"}}]},name:"delete",theme:"outlined"},i=n(42135),o=function(e,t){return l.createElement(i.Z,(0,a.Z)((0,a.Z)({},e),{},{ref:t,icon:s}))};o.displayName="DeleteOutlined";var r=l.forwardRef(o)},27561:function(e,t,n){var a=n(67990),l=/^\s+/;e.exports=function(e){return e?e.slice(0,a(e)+1).replace(l,""):e}},67990:function(e){var t=/\s/;e.exports=function(e){for(var n=e.length;n--&&t.test(e.charAt(n)););return n}},23279:function(e,t,n){var a=n(13218),l=n(7771),s=n(14841),i=Math.max,o=Math.min;e.exports=function(e,t,n){var r,c,u,d,f,m,p=0,h=!1,x=!1,v=!0;if("function"!=typeof e)throw TypeError("Expected a function");function j(t){var n=r,a=c;return r=c=void 0,p=t,d=e.apply(a,n)}function N(e){var n=e-m,a=e-p;return void 0===m||n>=t||n<0||x&&a>=u}function g(){var e,n,a,s=l();if(N(s))return y(s);f=setTimeout(g,(e=s-m,n=s-p,a=t-e,x?o(a,u-n):a))}function y(e){return(f=void 0,v&&r)?j(e):(r=c=void 0,d)}function b(){var e,n=l(),a=N(n);if(r=arguments,c=this,m=n,a){if(void 0===f)return p=e=m,f=setTimeout(g,t),h?j(e):d;if(x)return clearTimeout(f),f=setTimeout(g,t),j(m)}return void 0===f&&(f=setTimeout(g,t)),d}return t=s(t)||0,a(n)&&(h=!!n.leading,u=(x="maxWait"in n)?i(s(n.maxWait)||0,t):u,v="trailing"in n?!!n.trailing:v),b.cancel=function(){void 0!==f&&clearTimeout(f),p=0,r=m=c=f=void 0},b.flush=function(){return void 0===f?d:y(l())},b}},33448:function(e,t,n){var a=n(44239),l=n(37005);e.exports=function(e){return"symbol"==typeof e||l(e)&&"[object Symbol]"==a(e)}},7771:function(e,t,n){var a=n(55639);e.exports=function(){return a.Date.now()}},14841:function(e,t,n){var a=n(27561),l=n(13218),s=n(33448),i=0/0,o=/^[-+]0x[0-9a-f]+$/i,r=/^0b[01]+$/i,c=/^0o[0-7]+$/i,u=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(s(e))return i;if(l(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=l(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=a(e);var n=r.test(e);return n||c.test(e)?u(e.slice(2),n?2:8):o.test(e)?i:+e}},81009:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin/config-social-items",function(){return n(87945)}])},87652:function(e,t,n){"use strict";n.d(t,{h:function(){return k}});var a=n(85893),l=n(67294),s=n(84485),i=n(71577),o=n(69677),r=n(52206),c=n(85402),u=n(10010),d=n(39398),f=n(48689),m=n(38939),p=n(90745);let h=e=>{let{iconList:t,selectedOption:n,onSelected:l}=e,s=e=>{l&&l(e)},i=""===n?null:n;return(0,a.jsxs)("div",{className:"social-dropdown-container",children:[(0,a.jsx)("p",{className:"description",children:"If you are looking for a platform name not on this list, please select Other and type in your own name. A logo will not be provided."}),(0,a.jsxs)("div",{className:"formfield-container",children:[(0,a.jsx)("div",{className:"label-side",children:(0,a.jsx)("span",{className:"formfield-label",children:"Social Platform"})}),(0,a.jsx)("div",{className:"input-side",children:(0,a.jsxs)(m.Z,{style:{width:240},className:"social-dropdown",placeholder:"Social platform...",defaultValue:i,value:i,onSelect:s,children:[t.map(e=>{let{platform:t,icon:n,key:l}=e;return(0,a.jsxs)(m.Z.Option,{className:"social-option",value:l,children:[(0,a.jsx)("span",{className:"option-icon",children:(0,a.jsx)("img",{src:n,alt:"",className:"option-icon"})}),(0,a.jsx)("span",{className:"option-label",children:t})]},"platform-".concat(l))}),(0,a.jsx)(m.Z.Option,{className:"social-option",value:p.z_,children:"Other..."},"platform-".concat(p.z_))]})})]})]})};var x=n(64777),v=n(99519),j=n(37174),N=n(40117),g=n(41983),y=n(39664);let{Title:b}=s.Z,k=()=>{var e,t;let[n,s]=(0,l.useState)([]),[m,k]=(0,l.useState)([]),[w,S]=(0,l.useState)(!1),[Z,_]=(0,l.useState)(!1),[E,C]=(0,l.useState)(!1),[T,z]=(0,l.useState)(-1),[O,H]=(0,l.useState)(p.wC),[I,P]=(0,l.useState)(null),A=(0,l.useContext)(v.aC),{serverConfig:L,setFieldInConfigState:M}=A||{},{instanceDetails:$}=L,{socialHandles:D}=$,U=async()=>{try{let e=await (0,x.rQ)(x.$i,{auth:!1}),t=Object.keys(e).map(t=>({key:t,...e[t]}));s(t)}catch(n){console.log(n)}},B=e=>n.find(t=>t.key===e)||!1,K=""!==O.platform&&!n.find(e=>e.key===O.platform);(0,l.useEffect)(()=>{U()},[]),(0,l.useEffect)(()=>{$.socialHandles&&k(D)},[$]);let R=()=>{P(null),clearTimeout(null)},V=()=>{S(!1),z(-1),_(!1),C(!1),H({...p.wC})},W=()=>{V()},X=(e,t)=>{H({...O,[e]:t})},Q=e=>{e===p.z_?(_(!0),X("platform","")):(_(!1),X("platform",e))},Y=e=>{let{value:t}=e.target;X("platform",t)},q=e=>{let{value:t}=e;X("url",t)},F=async e=>{await (0,p.Si)({apiPath:p.c9,data:{value:e},onSuccess(){M({fieldName:"socialHandles",value:e,path:"instanceDetails"}),C(!1),W(),P((0,g.kg)(g.zv)),setTimeout(R,p.sI)},onError(e){P((0,g.kg)(g.Un,"There was an error: ".concat(e))),C(!1),setTimeout(R,p.sI)}})},G=()=>{C(!0);let e=m.length?[...m]:[];-1===T?e.push(O):e.splice(T,1,O),F(e)},J=e=>{let t=[...m];t.splice(e,1),F(t)},ee=e=>{if(e<=0||e>=m.length)return;let t=[...m],n=t[e-1];t[e-1]=t[e],t[e]=n,F(t)},et=e=>{if(e<0||e>=m.length-1)return;let t=[...m],n=t[e+1];t[e+1]=t[e],t[e]=n,F(t)},en={disabled:(e=O.url,"xmpp"===(t=O.platform)?!(0,j.Kf)(e,"xmpp"):"matrix"===t?!(0,j.bu)(e):!(0,j.jv)(e))},ea=(0,a.jsxs)("div",{className:"other-field-container formfield-container",children:[(0,a.jsx)("div",{className:"label-side"}),(0,a.jsx)("div",{className:"input-side",children:(0,a.jsx)(o.Z,{placeholder:"Other platform name",defaultValue:O.platform,onChange:Y})})]});return(0,a.jsxs)("div",{className:"social-links-edit-container",children:[(0,a.jsx)(b,{level:3,className:"section-title",children:"Your Social Handles"}),(0,a.jsx)("p",{className:"description",children:"Add all your social media handles and links to your other profiles here."}),(0,a.jsx)(y.E,{status:I}),(0,a.jsx)(r.Z,{className:"social-handles-table",pagination:!1,size:"small",rowKey:e=>"".concat(e.platform,"-").concat(e.url),columns:[{title:"Social Link",dataIndex:"",key:"combo",render(e,t){let{platform:n,url:l}=t,s=B(n);if(!s)return(0,a.jsx)("div",{className:"social-handle-cell",children:(0,a.jsxs)("p",{className:"option-label",children:[(0,a.jsx)("strong",{children:n}),(0,a.jsx)("span",{className:"handle-url",title:l,children:l})]})});let{icon:i,platform:o}=s;return(0,a.jsxs)("div",{className:"social-handle-cell",children:[(0,a.jsx)("span",{className:"option-icon",children:(0,a.jsx)("img",{src:i,alt:"",className:"option-icon"})}),(0,a.jsxs)("p",{className:"option-label",children:[(0,a.jsx)("strong",{children:o}),(0,a.jsx)("span",{className:"handle-url",title:l,children:l})]})]})}},{title:"",dataIndex:"",key:"edit",render:(e,t,n)=>(0,a.jsxs)("div",{className:"actions",children:[(0,a.jsx)(i.Z,{size:"small",onClick(){let e=m[n];z(n),H({...e}),S(!0),B(e.platform)||_(!0)},children:"Edit"}),(0,a.jsx)(i.Z,{icon:(0,a.jsx)(u.Z,{}),size:"small",hidden:0===n,onClick:()=>ee(n)}),(0,a.jsx)(i.Z,{icon:(0,a.jsx)(d.Z,{}),size:"small",hidden:n===m.length-1,onClick:()=>et(n)}),(0,a.jsx)(i.Z,{className:"delete-button",icon:(0,a.jsx)(f.Z,{}),size:"small",onClick:()=>J(n)})]})}],dataSource:m}),(0,a.jsx)(c.Z,{title:"Edit Social Handle",open:w,onOk:G,onCancel:W,confirmLoading:E,okButtonProps:en,children:(0,a.jsxs)("div",{className:"social-handle-modal-content",children:[(0,a.jsx)(h,{iconList:n,selectedOption:K?p.z_:O.platform,onSelected:Q}),Z&&ea,(0,a.jsx)("br",{}),(0,a.jsx)(N.nv,{fieldName:"social-url",label:"URL",placeholder:{mastodon:"https://mastodon.social/@username",twitter:"https://twitter.com/username"}[O.platform]||"Url to page",value:O.url,onChange:q,useTrim:!0,type:"url",pattern:j.ax}),(0,a.jsx)(y.E,{status:I})]})}),(0,a.jsx)("br",{}),(0,a.jsx)(i.Z,{type:"primary",onClick(){V(),S(!0)},children:"Add a new social link"})]})}},87945:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return o}});var a=n(85893);n(67294);var l=n(84485),s=n(87652);let{Title:i}=l.Z;function o(){return(0,a.jsxs)("div",{className:"config-social-items",children:[(0,a.jsx)(i,{children:"Social Items"}),(0,a.jsx)(s.h,{})]})}}},function(e){e.O(0,[8909,3903,4267,2206,9774,2888,179],function(){return e(e.s=81009)}),_N_E=e.O()}]);