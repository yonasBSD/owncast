(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4311],{86045:function(e,s,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin/config-public-details",function(){return a(53459)}])},87652:function(e,s,a){"use strict";a.d(s,{h:function(){return w}});var l=a(85893),t=a(67294),n=a(84485),i=a(71577),r=a(69677),o=a(52206),c=a(85402),d=a(10010),u=a(39398),m=a(48689),h=a(38939),p=a(90745);let x=e=>{let{iconList:s,selectedOption:a,onSelected:t}=e,n=e=>{t&&t(e)},i=""===a?null:a;return(0,l.jsxs)("div",{className:"social-dropdown-container",children:[(0,l.jsx)("p",{className:"description",children:"If you are looking for a platform name not on this list, please select Other and type in your own name. A logo will not be provided."}),(0,l.jsxs)("div",{className:"formfield-container",children:[(0,l.jsx)("div",{className:"label-side",children:(0,l.jsx)("span",{className:"formfield-label",children:"Social Platform"})}),(0,l.jsx)("div",{className:"input-side",children:(0,l.jsxs)(h.Z,{style:{width:240},className:"social-dropdown",placeholder:"Social platform...",defaultValue:i,value:i,onSelect:n,children:[s.map(e=>{let{platform:s,icon:a,key:t}=e;return(0,l.jsxs)(h.Z.Option,{className:"social-option",value:t,children:[(0,l.jsx)("span",{className:"option-icon",children:(0,l.jsx)("img",{src:a,alt:"",className:"option-icon"})}),(0,l.jsx)("span",{className:"option-label",children:s})]},"platform-".concat(t))}),(0,l.jsx)(h.Z.Option,{className:"social-option",value:p.z_,children:"Other..."},"platform-".concat(p.z_))]})})]})]})};var f=a(64777),j=a(99519),g=a(37174),v=a(40117),N=a(41983),k=a(39664);let{Title:y}=n.Z,w=()=>{var e,s;let[a,n]=(0,t.useState)([]),[h,w]=(0,t.useState)([]),[b,C]=(0,t.useState)(!1),[S,Z]=(0,t.useState)(!1),[T,E]=(0,t.useState)(!1),[_,P]=(0,t.useState)(-1),[L,U]=(0,t.useState)(p.wC),[z,O]=(0,t.useState)(null),I=(0,t.useContext)(j.aC),{serverConfig:A,setFieldInConfigState:V}=I||{},{instanceDetails:M}=A,{socialHandles:D}=M,R=async()=>{try{let e=await (0,f.rQ)(f.$i,{auth:!1}),s=Object.keys(e).map(s=>({key:s,...e[s]}));n(s)}catch(a){console.log(a)}},F=e=>a.find(s=>s.key===e)||!1,H=""!==L.platform&&!a.find(e=>e.key===L.platform);(0,t.useEffect)(()=>{R()},[]),(0,t.useEffect)(()=>{M.socialHandles&&w(D)},[M]);let J=()=>{O(null),clearTimeout(null)},$=()=>{C(!1),P(-1),Z(!1),E(!1),U({...p.wC})},Q=()=>{$()},Y=(e,s)=>{U({...L,[e]:s})},G=e=>{e===p.z_?(Z(!0),Y("platform","")):(Z(!1),Y("platform",e))},X=e=>{let{value:s}=e.target;Y("platform",s)},B=e=>{let{value:s}=e;Y("url",s)},K=async e=>{await (0,p.Si)({apiPath:p.c9,data:{value:e},onSuccess(){V({fieldName:"socialHandles",value:e,path:"instanceDetails"}),E(!1),Q(),O((0,N.kg)(N.zv)),setTimeout(J,p.sI)},onError(e){O((0,N.kg)(N.Un,"There was an error: ".concat(e))),E(!1),setTimeout(J,p.sI)}})},q=()=>{E(!0);let e=h.length?[...h]:[];-1===_?e.push(L):e.splice(_,1,L),K(e)},W=e=>{let s=[...h];s.splice(e,1),K(s)},ee=e=>{if(e<=0||e>=h.length)return;let s=[...h],a=s[e-1];s[e-1]=s[e],s[e]=a,K(s)},es=e=>{if(e<0||e>=h.length-1)return;let s=[...h],a=s[e+1];s[e+1]=s[e],s[e]=a,K(s)},ea={disabled:(e=L.url,"xmpp"===(s=L.platform)?!(0,g.Kf)(e,"xmpp"):"matrix"===s?!(0,g.bu)(e):!(0,g.jv)(e))},el=(0,l.jsxs)("div",{className:"other-field-container formfield-container",children:[(0,l.jsx)("div",{className:"label-side"}),(0,l.jsx)("div",{className:"input-side",children:(0,l.jsx)(r.Z,{placeholder:"Other platform name",defaultValue:L.platform,onChange:X})})]});return(0,l.jsxs)("div",{className:"social-links-edit-container",children:[(0,l.jsx)(y,{level:3,className:"section-title",children:"Your Social Handles"}),(0,l.jsx)("p",{className:"description",children:"Add all your social media handles and links to your other profiles here."}),(0,l.jsx)(k.E,{status:z}),(0,l.jsx)(o.Z,{className:"social-handles-table",pagination:!1,size:"small",rowKey:e=>"".concat(e.platform,"-").concat(e.url),columns:[{title:"Social Link",dataIndex:"",key:"combo",render(e,s){let{platform:a,url:t}=s,n=F(a);if(!n)return(0,l.jsx)("div",{className:"social-handle-cell",children:(0,l.jsxs)("p",{className:"option-label",children:[(0,l.jsx)("strong",{children:a}),(0,l.jsx)("span",{className:"handle-url",title:t,children:t})]})});let{icon:i,platform:r}=n;return(0,l.jsxs)("div",{className:"social-handle-cell",children:[(0,l.jsx)("span",{className:"option-icon",children:(0,l.jsx)("img",{src:i,alt:"",className:"option-icon"})}),(0,l.jsxs)("p",{className:"option-label",children:[(0,l.jsx)("strong",{children:r}),(0,l.jsx)("span",{className:"handle-url",title:t,children:t})]})]})}},{title:"",dataIndex:"",key:"edit",render:(e,s,a)=>(0,l.jsxs)("div",{className:"actions",children:[(0,l.jsx)(i.Z,{size:"small",onClick(){let e=h[a];P(a),U({...e}),C(!0),F(e.platform)||Z(!0)},children:"Edit"}),(0,l.jsx)(i.Z,{icon:(0,l.jsx)(d.Z,{}),size:"small",hidden:0===a,onClick:()=>ee(a)}),(0,l.jsx)(i.Z,{icon:(0,l.jsx)(u.Z,{}),size:"small",hidden:a===h.length-1,onClick:()=>es(a)}),(0,l.jsx)(i.Z,{className:"delete-button",icon:(0,l.jsx)(m.Z,{}),size:"small",onClick:()=>W(a)})]})}],dataSource:h}),(0,l.jsx)(c.Z,{title:"Edit Social Handle",open:b,onOk:q,onCancel:Q,confirmLoading:T,okButtonProps:ea,children:(0,l.jsxs)("div",{className:"social-handle-modal-content",children:[(0,l.jsx)(x,{iconList:a,selectedOption:H?p.z_:L.platform,onSelected:G}),S&&el,(0,l.jsx)("br",{}),(0,l.jsx)(v.nv,{fieldName:"social-url",label:"URL",placeholder:{mastodon:"https://mastodon.social/@username",twitter:"https://twitter.com/username"}[L.platform]||"Url to page",value:L.url,onChange:B,useTrim:!0,type:"url",pattern:g.ax}),(0,l.jsx)(k.E,{status:z})]})}),(0,l.jsx)("br",{}),(0,l.jsx)(i.Z,{type:"primary",onClick(){$(),C(!0)},children:"Add a new social link"})]})}},80894:function(e,s,a){"use strict";a.d(s,{Q:function(){return d},Y:function(){return u}});var l=a(85893),t=a(67294),n=a(84485),i=a(20550),r=a(40117),o=a(39664);let{Title:c}=n.Z,d="#5a67d8",u=e=>{let{title:s,description:a,placeholder:n,maxLength:u,values:m,handleDeleteIndex:h,handleCreateString:p,submitStatus:x,continuousStatusMessage:f}=e,[j,g]=(0,t.useState)(""),v=e=>{let{value:s}=e;g(s)},N=()=>{let e=j.trim();p(e),g("")};return(0,l.jsxs)("div",{className:"edit-string-array-container",children:[(0,l.jsx)(c,{level:3,className:"section-title",children:s}),(0,l.jsx)("p",{className:"description",children:a}),(0,l.jsx)("div",{className:"edit-current-strings",children:null==m?void 0:m.map((e,s)=>{let a=()=>{h(s)};return(0,l.jsx)(i.Z,{closable:!0,onClose:a,color:d,children:e},"tag-".concat(e,"-").concat(s))})}),f&&(0,l.jsx)("div",{className:"continuous-status-section",children:(0,l.jsx)(o.E,{status:f})}),(0,l.jsx)("div",{className:"add-new-string-section",children:(0,l.jsx)(r.nv,{fieldName:"string-input",value:j,onChange:v,onPressEnter:N,maxLength:u,placeholder:n,status:x})})]})};u.defaultProps={maxLength:50,description:null,submitStatus:null,continuousStatusMessage:null}},73706:function(e,s,a){"use strict";a.d(s,{Z:function(){return d}});var l=a(85893),t=a(67294),n=a(94594),i=a(41983),r=a(39664),o=a(90745),c=a(99519);let d=e=>{let{apiPath:s,checked:a,reversed:d=!1,configPath:u="",disabled:m=!1,fieldName:h,label:p,tip:x,useSubmit:f,onChange:j}=e,[g,v]=(0,t.useState)(null),N=null,k=(0,t.useContext)(c.aC),{setFieldInConfigState:y}=k||{},w=()=>{v(null),clearTimeout(N),N=null},b=async e=>{if(f){v((0,i.kg)(i.Jk));let a=d?!e:e;await (0,o.Si)({apiPath:s,data:{value:a},onSuccess(){y({fieldName:h,value:a,path:u}),v((0,i.kg)(i.zv))},onError(e){v((0,i.kg)(i.Un,"There was an error: ".concat(e)))}}),N=setTimeout(w,o.sI)}j&&j(e)},C=null!==g&&g.type===i.Jk;return(0,l.jsxs)("div",{className:"formfield-container toggleswitch-container",children:[p&&(0,l.jsx)("div",{className:"label-side",children:(0,l.jsx)("span",{className:"formfield-label",children:p})}),(0,l.jsxs)("div",{className:"input-side",children:[(0,l.jsxs)("div",{className:"input-group",children:[(0,l.jsx)(n.Z,{className:"switch field-".concat(h),loading:C,onChange:b,defaultChecked:a,checked:a,checkedChildren:"ON",unCheckedChildren:"OFF",disabled:m}),(0,l.jsx)(r.E,{status:g})]}),(0,l.jsx)("p",{className:"field-tip",children:x})]})]})};d.defaultProps={apiPath:"",checked:!1,reversed:!1,configPath:"",disabled:!1,label:"",tip:"",useSubmit:!1,onChange:null}},53459:function(e,s,a){"use strict";a.r(s),a.d(s,{default:function(){return z}});var l=a(85893),t=a(67294),n=a(84485),i=a(10135),r=a(99519),o=a(90745),c=a(73706),d=a(77916),u=a(71577),m=a(50888),h=a(88484),p=a(39664),x=a(41983),f=a(64777),j=a(60956);let g=()=>{var e;let[s,a]=(0,t.useState)(null),[n,i]=(0,t.useState)(!1),[c,g]=(0,t.useState)(0),v=(0,t.useContext)(r.aC),{setFieldInConfigState:N,serverConfig:k}=v||{},y=null==k?void 0:null===(e=k.instanceDetails)||void 0===e?void 0:e.logo,[w,b]=(0,t.useState)(null),C=null,{apiPath:S,tip:Z}=o.ZQ,T=()=>{b(null),clearTimeout(C),C=null},E=e=>(i(!0),new Promise((s,l)=>{if(!j.d.includes(e.type)){let t="File type is not supported: ".concat(e.type);return b((0,x.kg)(x.Un,"There was an error: ".concat(t))),C=setTimeout(T,o.sI),i(!1),l()}(0,j.y)(e,e=>(a(e),s()))})),_=async()=>{s!==y&&(b((0,x.kg)(x.Jk)),await (0,o.Si)({apiPath:S,data:{value:s},onSuccess(){N({fieldName:"logo",value:s,path:""}),b((0,x.kg)(x.zv)),i(!1),g(Math.floor(100*Math.random()))},onError(e){b((0,x.kg)(x.Un,"There was an error: ".concat(e))),i(!1)}}),C=setTimeout(T,o.sI))},P="".concat(f.WB,"logo?random=").concat(c);return(0,l.jsxs)("div",{className:"formfield-container logo-upload-container",children:[(0,l.jsx)("div",{className:"label-side",children:(0,l.jsx)("span",{className:"formfield-label",children:"Logo"})}),(0,l.jsxs)("div",{className:"input-side",children:[(0,l.jsxs)("div",{className:"input-group",children:[(0,l.jsx)("img",{src:P,alt:"avatar",className:"logo-preview"}),(0,l.jsx)(d.Z,{name:"logo",listType:"picture",className:"avatar-uploader",showUploadList:!1,accept:j.d.join(","),beforeUpload:E,customRequest:_,disabled:n,children:n?(0,l.jsx)(m.Z,{style:{color:"white"}}):(0,l.jsx)(u.Z,{icon:(0,l.jsx)(h.Z,{})})})]}),(0,l.jsx)(p.E,{status:w}),(0,l.jsx)("p",{className:"field-tip",children:Z})]})]})},{Title:v}=n.Z,N=()=>{let[e,s]=(0,t.useState)(null),a=(0,t.useContext)(r.aC),{serverConfig:n}=a||{},{instanceDetails:d,yp:u}=n,{instanceUrl:m}=u;if((0,t.useEffect)(()=>{s({...d,...u})},[d,u]),!e)return null;let h=()=>{""===e.instanceUrl&&!0===u.enabled&&(0,o.Si)({apiPath:o.AP,data:{value:!1}})},p=a=>{let{fieldName:l,value:t}=a;s({...e,[l]:t})},x=""!==m;return(0,l.jsxs)("div",{className:"edit-general-settings",children:[(0,l.jsx)(v,{level:3,className:"section-title",children:"Configure Instance Details"}),(0,l.jsx)("br",{}),(0,l.jsx)(i.$7,{fieldName:"name",...o.RE,value:e.name,initialValue:d.name,onChange:p}),(0,l.jsx)(i.$7,{fieldName:"instanceUrl",...o.cj,value:e.instanceUrl,initialValue:u.instanceUrl,type:i.xA,onChange:p,onSubmit:h}),(0,l.jsx)(i.$7,{fieldName:"summary",...o.rs,type:i.Sk,value:e.summary,initialValue:d.summary,onChange:p}),(0,l.jsx)(i.$7,{fieldName:"offlineMessage",...o.rd,type:i.Sk,value:e.offlineMessage,initialValue:d.offlineMessage,onChange:p}),(0,l.jsx)(g,{}),(0,l.jsx)(c.Z,{fieldName:"hideViewerCount",useSubmit:!0,...o._X,checked:e.hideViewerCount,onChange:function(e){p({fieldName:"hideViewerCount",value:e})}}),(0,l.jsx)("br",{}),(0,l.jsxs)("p",{className:"description",children:["Increase your audience by appearing in the"," ",(0,l.jsx)("a",{href:"https://directory.owncast.online",target:"_blank",rel:"noreferrer",children:(0,l.jsx)("strong",{children:"Owncast Directory"})}),". This is an external service run by the Owncast project."," ",(0,l.jsx)("a",{href:"https://owncast.online/docs/directory/?source=admin",target:"_blank",rel:"noopener noreferrer",children:"Learn more"}),"."]}),!u.instanceUrl&&(0,l.jsxs)("p",{className:"description",children:["You must set your ",(0,l.jsx)("strong",{children:"Server URL"})," above to enable the directory."]}),(0,l.jsxs)("div",{className:"config-yp-container",children:[(0,l.jsx)(c.Z,{fieldName:"enabled",useSubmit:!0,...o.P,checked:e.enabled,disabled:!x}),(0,l.jsx)(c.Z,{fieldName:"nsfw",useSubmit:!0,...o.EY,checked:e.nsfw,disabled:!x})]})]})};var k=a(20550),y=a(40117),w=a(80894);let{Title:b}=n.Z,C=()=>{let[e,s]=(0,t.useState)(""),[a,n]=(0,t.useState)(null),i=(0,t.useContext)(r.aC),{serverConfig:c,setFieldInConfigState:d}=i||{},{instanceDetails:u}=c,{tags:m=[]}=u,{apiPath:h,maxLength:p,placeholder:f,configPath:j}=o.y_,g=null;(0,t.useEffect)(()=>()=>{clearTimeout(g)},[]);let v=()=>{n(null),clearTimeout(g=null)},N=async e=>{n((0,x.kg)(x.Jk)),await (0,o.Si)({apiPath:h,data:{value:e},onSuccess(){d({fieldName:"tags",value:e,path:j}),n((0,x.kg)(x.zv,"Tags updated.")),s(""),g=setTimeout(v,o.sI)},onError(e){n((0,x.kg)(x.Un,e)),g=setTimeout(v,o.sI)}})},C=e=>{let{value:l}=e;a||n(null),s(l)},S=()=>{v();let s=e.trim();if(""===s){n((0,x.kg)(x.dG,"Please enter a tag"));return}if(m.some(e=>e.toLowerCase()===s.toLowerCase())){n((0,x.kg)(x.dG,"This tag is already used!"));return}let a=[...m,s];N(a)},Z=e=>{v();let s=[...m];s.splice(e,1),N(s)};return(0,l.jsxs)("div",{className:"tag-editor-container",children:[(0,l.jsx)(b,{level:3,className:"section-title",children:"Add Tags"}),(0,l.jsx)("p",{className:"description",children:"This is a great way to categorize your Owncast server on the Directory!"}),(0,l.jsx)("div",{className:"edit-current-strings",children:m.map((e,s)=>{let a=()=>{Z(s)};return(0,l.jsx)(k.Z,{closable:!0,onClose:a,color:w.Q,children:e},"tag-".concat(e,"-").concat(s))})}),(0,l.jsx)("div",{className:"add-new-string-section",children:(0,l.jsx)(y.nv,{fieldName:"tag-input",value:e,className:"new-tag-input",onChange:C,onPressEnter:S,maxLength:p,placeholder:f,status:a})})]})};var S=a(87652),Z=a(87685),T=a(58909),E=a(48825),_=a(76538);let{Title:P}=n.Z,L=()=>{let[e,s]=(0,t.useState)(""),[a,n]=(0,t.useState)(null),[i,c]=(0,t.useState)(!1),d=(0,t.useContext)(r.aC),{serverConfig:m,setFieldInConfigState:h}=d||{},{instanceDetails:f}=m,{extraPageContent:j}=f,g=null,v=()=>{n(null),c(!1),clearTimeout(g),g=null};async function N(){n((0,x.kg)(x.Jk)),await (0,o.Si)({apiPath:o.AA,data:{value:e},onSuccess(s){h({fieldName:"extraPageContent",value:e,path:"instanceDetails"}),n((0,x.kg)(x.zv,s))},onError(e){n((0,x.kg)(x.Un,e))}}),g=setTimeout(v,o.sI)}return(0,t.useEffect)(()=>{s(j)},[f]),(0,l.jsxs)("div",{className:"edit-page-content",children:[(0,l.jsx)(P,{level:3,className:"section-title",children:"Custom Page Content"}),(0,l.jsxs)("p",{className:"description",children:["Edit the content of your page by using simple"," ",(0,l.jsx)("a",{href:"https://www.markdownguide.org/basic-syntax/",target:"_blank",rel:"noopener noreferrer",children:"Markdown syntax"}),"."]}),(0,l.jsx)(Z.ZP,{value:e,placeholder:"Enter your custom page content here...",theme:T.F,onChange:function(e){s(e),e===j||i?e===j&&i&&c(!1):c(!0)},extensions:[(0,E.markdown)({base:E.markdownLanguage,codeLanguages:_.M})]}),(0,l.jsx)("br",{}),(0,l.jsxs)("div",{className:"page-content-actions",children:[i&&(0,l.jsx)(u.Z,{type:"primary",onClick:N,children:"Save"}),(0,l.jsx)(p.E,{status:a})]})]})},{Title:U}=n.Z;function z(){return(0,l.jsxs)("div",{className:"config-public-details-page",children:[(0,l.jsx)(U,{children:"General Settings"}),(0,l.jsxs)("p",{className:"description",children:["The following are displayed on your site to describe your stream and its content."," ",(0,l.jsx)("a",{href:"https://owncast.online/docs/website/?source=admin",target:"_blank",rel:"noopener noreferrer",children:"Learn more."})]}),(0,l.jsxs)("div",{className:"top-container",children:[(0,l.jsx)("div",{className:"form-module instance-details-container",children:(0,l.jsx)(N,{})}),(0,l.jsxs)("div",{className:"form-module social-items-container ",children:[(0,l.jsx)("div",{className:"form-module tags-module",children:(0,l.jsx)(C,{})}),(0,l.jsx)("div",{className:"form-module social-handles-container",children:(0,l.jsx)(S.h,{})})]})]}),(0,l.jsx)("div",{className:"form-module page-content-module",children:(0,l.jsx)(L,{})})]})}},60956:function(e,s,a){"use strict";a.d(s,{d:function(){return l},y:function(){return t}});let l=["image/png","image/jpeg","image/gif"];function t(e,s){let a=new FileReader;a.addEventListener("load",()=>s(a.result)),a.readAsDataURL(e)}}},function(e){e.O(0,[5762,8909,3903,4267,2206,5577,1943,2938,7022,9774,2888,179],function(){return e(e.s=86045)}),_N_E=e.O()}]);