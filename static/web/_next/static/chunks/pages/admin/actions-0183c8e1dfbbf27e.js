(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5685],{48689:function(e,t,n){"use strict";n.d(t,{Z:function(){return c}});var r=n(1413),o=n(67294),i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"}}]},name:"delete",theme:"outlined"},a=n(42135),l=function(e,t){return o.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:i}))};l.displayName="DeleteOutlined";var c=o.forwardRef(l)},27561:function(e,t,n){var r=n(67990),o=/^\s+/;e.exports=function(e){return e?e.slice(0,r(e)+1).replace(o,""):e}},67990:function(e){var t=/\s/;e.exports=function(e){for(var n=e.length;n--&&t.test(e.charAt(n)););return n}},23279:function(e,t,n){var r=n(13218),o=n(7771),i=n(14841),a=Math.max,l=Math.min;e.exports=function(e,t,n){var c,u,s,d,h,f,p=0,x=!1,v=!1,m=!0;if("function"!=typeof e)throw TypeError("Expected a function");function y(t){var n=c,r=u;return c=u=void 0,p=t,d=e.apply(r,n)}function j(e){var n=e-f,r=e-p;return void 0===f||n>=t||n<0||v&&r>=s}function g(){var e,n,r,i=o();if(j(i))return w(i);h=setTimeout(g,(e=i-f,n=i-p,r=t-e,v?l(r,s-n):r))}function w(e){return(h=void 0,m&&c)?y(e):(c=u=void 0,d)}function k(){var e,n=o(),r=j(n);if(c=arguments,u=this,f=n,r){if(void 0===h)return p=e=f,h=setTimeout(g,t),x?y(e):d;if(v)return clearTimeout(h),h=setTimeout(g,t),y(f)}return void 0===h&&(h=setTimeout(g,t)),d}return t=i(t)||0,r(n)&&(x=!!n.leading,s=(v="maxWait"in n)?a(i(n.maxWait)||0,t):s,m="trailing"in n?!!n.trailing:m),k.cancel=function(){void 0!==h&&clearTimeout(h),p=0,c=f=u=h=void 0},k.flush=function(){return void 0===h?d:w(o())},k}},33448:function(e,t,n){var r=n(44239),o=n(37005);e.exports=function(e){return"symbol"==typeof e||o(e)&&"[object Symbol]"==r(e)}},7771:function(e,t,n){var r=n(55639);e.exports=function(){return r.Date.now()}},14841:function(e,t,n){var r=n(27561),o=n(13218),i=n(33448),a=0/0,l=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,u=/^0o[0-7]+$/i,s=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(i(e))return a;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=r(e);var n=c.test(e);return n||u.test(e)?s(e.slice(2),n?2:8):l.test(e)?a:+e}},54005:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin/actions",function(){return n(2075)}])},2075:function(e,t,n){"use strict";n.r(t);var r=n(85893),o=n(48689),i=n(86548),a=n(84485),l=n(85402),c=n(18119),u=n(69677),s=n(32808),d=n(26713),h=n(71577),f=n(52206),p=n(96486),x=n.n(p),v=n(67294),m=n(39664),y=n(90745),j=n(41983),g=n(99519),w=n(37174);let{Title:k,Paragraph:Z}=a.Z,b=e=>{let{onOk:t,onCancel:n,open:o,action:i}=e,[a,d]=(0,v.useState)(""),[h,f]=(0,v.useState)(""),[p,x]=(0,v.useState)(""),[m,y]=(0,v.useState)(""),[j,g]=(0,v.useState)(""),[k,Z]=(0,v.useState)(!1);(0,v.useEffect)(()=>{d((null==i?void 0:i.url)||""),f((null==i?void 0:i.title)||""),x((null==i?void 0:i.description)||""),y((null==i?void 0:i.icon)||""),g((null==i?void 0:i.color)||""),Z((null==i?void 0:i.openExternally)||!1)},[i]);let b={disabled:!function(){try{let e=new URL(a);if("https:"!==e.protocol)return!1}catch(t){return!1}return(0,w.jv)(a)&&""!==h}()},C=e=>{Z(e.target.checked)};return(0,r.jsx)(l.Z,{destroyOnClose:!0,title:null==i?"Create New Action":"Edit Action",open:o,onOk:function(){t(i,a,h,p,m,j,k),d(""),f(""),x(""),y(""),g(""),Z(!1)},onCancel:n,okButtonProps:b,children:(0,r.jsxs)(c.Z,{initialValues:i,children:["Add the URL for the external action you want to present."," ",(0,r.jsx)("strong",{children:"Only HTTPS urls are supported."}),(0,r.jsx)("p",{children:(0,r.jsx)("a",{href:"https://owncast.online/thirdparty/actions/",target:"_blank",rel:"noopener noreferrer",children:"Read more about external actions."})}),(0,r.jsx)(c.Z.Item,{name:"url",children:(0,r.jsx)(u.Z,{required:!0,placeholder:"https://myserver.com/action (required)",onChange:e=>d(e.currentTarget.value.trim()),type:"url",pattern:w.ax})}),(0,r.jsx)(c.Z.Item,{name:"title",children:(0,r.jsx)(u.Z,{value:h,required:!0,placeholder:"Your action title (required)",onChange:e=>f(e.currentTarget.value)})}),(0,r.jsx)(c.Z.Item,{name:"description",children:(0,r.jsx)(u.Z,{value:p,placeholder:"Optional description",onChange:e=>x(e.currentTarget.value)})}),(0,r.jsx)(c.Z.Item,{name:"icon",children:(0,r.jsx)(u.Z,{value:m,placeholder:"https://myserver.com/action/icon.png (optional)",onChange:e=>y(e.currentTarget.value)})}),(0,r.jsxs)("div",{children:[(0,r.jsx)(c.Z.Item,{name:"color",style:{marginBottom:"0px"},children:(0,r.jsx)(u.Z,{type:"color",value:j,onChange:e=>g(e.currentTarget.value)})}),"Optional background color of the action button."]}),(0,r.jsx)(c.Z.Item,{name:"openExternally",children:(0,r.jsx)(s.Z,{checked:k,defaultChecked:k,onChange:C,children:"Open in a new tab instead of within your page."})})]})})},C=()=>{let e=(0,v.useContext)(g.aC),{serverConfig:t,setFieldInConfigState:n}=e||{},{externalActions:a}=t,[l,c]=(0,v.useState)(null),[u,s]=(0,v.useState)(!1),[p,w]=(0,v.useState)(null),[C,I]=(0,v.useState)(null),E=()=>{w(null),clearTimeout(null)};async function T(e){await (0,y.Si)({apiPath:y.os,data:{value:e},onSuccess(){n({fieldName:"externalActions",value:e,path:""}),w((0,j.kg)(j.zv,"Updated.")),setTimeout(E,y.sI)},onError(e){console.log(e),w((0,j.kg)(j.Un,e)),setTimeout(E,y.sI)}})}async function S(e){let t=[...l],n=l.findIndex(t=>t.url===e.url);t.splice(n,1);try{c(t),T(t)}catch(r){console.error(r)}}async function O(e,t,n,r,o,i,a){try{let u=[...l],s={url:t,title:n,description:r,icon:o,color:i,openExternally:a},d=e?l.findIndex(t=>x().isEqual(t,e)):-1;d>=0?u[d]=s:u.push(s),c(u),await T(u)}catch(h){console.error(h)}}async function _(e){I(e),s(!0)}(0,v.useEffect)(()=>{c(a||[])},[a]);let N=()=>{I(null),s(!0)},A=(e,t,n,r,o,i,a)=>{s(!1),O(e,t,n,r,o,i,a),I(null)},R=()=>{s(!1)};return(0,r.jsxs)("div",{children:[(0,r.jsx)(k,{children:"External Actions"}),(0,r.jsx)(Z,{children:"External action URLs are 3rd party UI you can display, embedded, into your Owncast page when a user clicks on a button to launch your action."}),(0,r.jsxs)(Z,{children:["Read more about how to use actions, with examples, at"," ",(0,r.jsx)("a",{href:"https://owncast.online/thirdparty/?source=admin",target:"_blank",rel:"noopener noreferrer",children:"our documentation"}),"."]}),(0,r.jsx)(f.Z,{rowKey:e=>"".concat(e.title,"-").concat(e.url),columns:[{title:"",key:"delete-edit",render:(e,t)=>(0,r.jsxs)(d.Z,{size:"middle",children:[(0,r.jsx)(h.Z,{onClick:()=>S(t),icon:(0,r.jsx)(o.Z,{})}),(0,r.jsx)(h.Z,{onClick:()=>_(t),icon:(0,r.jsx)(i.Z,{})})]})},{title:"Name",dataIndex:"title",key:"title"},{title:"Description",dataIndex:"description",key:"description"},{title:"URL",dataIndex:"url",key:"url"},{title:"Icon",dataIndex:"icon",key:"icon",render:e=>e?(0,r.jsx)("img",{style:{width:"2vw"},src:e,alt:""}):null},{title:"Color",dataIndex:"color",key:"color",render:e=>e?(0,r.jsx)("div",{style:{backgroundColor:e,height:"30px"},children:e}):null},{title:"Opens",dataIndex:"openExternally",key:"openExternally",render:e=>e?"In a new tab":"In a modal"}],dataSource:l,pagination:!1}),(0,r.jsx)("br",{}),(0,r.jsx)(h.Z,{type:"primary",onClick:N,children:"Create New Action"}),(0,r.jsx)(m.E,{status:p}),(0,r.jsx)(b,{action:C,open:u,onOk:A,onCancel:R})]})};t.default=C}},function(e){e.O(0,[3662,8909,3903,4267,2206,8119,9774,2888,179],function(){return e(e.s=54005)}),_N_E=e.O()}]);