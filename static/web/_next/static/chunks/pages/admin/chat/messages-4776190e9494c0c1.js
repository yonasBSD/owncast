(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7095],{62433:function(e,s,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin/chat/messages",function(){return t(93628)}])},93628:function(e,s,t){"use strict";t.r(s),t.d(s,{OUTCOME_TIMEOUT:function(){return S},default:function(){return _}});var a=t(85893),l=t(67294),i=t(23657),n=t(56469),r=t(27043),d=t(93967),o=t.n(d),c=t(12642),u=t(5152),h=t.n(u),m=t(37039),p=t(11992),g=t(74040),b=t(8968);let w=h()(()=>Promise.all([t.e(3247),t.e(2870)]).then(t.t.bind(t,92870,23)),{loadableGenerated:{webpack:()=>[92870]},ssr:!1}),x=h()(()=>Promise.all([t.e(3247),t.e(112)]).then(t.t.bind(t,80112,23)),{loadableGenerated:{webpack:()=>[80112]},ssr:!1}),y=h()(()=>Promise.all([t.e(3247),t.e(1031)]).then(t.t.bind(t,91031,23)),{loadableGenerated:{webpack:()=>[91031]},ssr:!1}),f=h()(()=>Promise.all([t.e(3247),t.e(1570)]).then(t.t.bind(t,31570,23)),{loadableGenerated:{webpack:()=>[31570]},ssr:!1}),j=e=>{let{isVisible:s,message:t,setMessage:i}=e;if(!t||(0,g.Qr)(t))return null;let r=null,[d,o]=(0,l.useState)(0),{id:c}=t||{},u=()=>{r=setTimeout(()=>{o(0)},3e3)};(0,l.useEffect)(()=>()=>{clearTimeout(r)});let h=async()=>{clearTimeout(r),o(0);let e=await (0,p.rQ)(p.hn,{auth:!0,method:"POST",data:{visible:!s,idArray:[c]}});e.success&&"changed"===e.message?(i({...t,visible:!s}),o(1)):(i({...t,visible:s}),o(-1)),u()},m=(0,a.jsx)(y,{style:{color:"transparent"}});d&&(m=d>0?(0,a.jsx)(y,{style:{color:"var(--ant-success)"}}):(0,a.jsx)(f,{style:{color:"var(--ant-warning)"}}));let j="Click to ".concat(s?"hide":"show"," this message");return(0,a.jsxs)("div",{className:"toggle-switch ".concat(s?"":"hidden"),children:[(0,a.jsx)("span",{className:"outcome-icon",children:m}),(0,a.jsx)(b.Z,{title:j,placement:"topRight",children:(0,a.jsx)(n.Z,{shape:"circle",size:"small",type:"text",icon:s?(0,a.jsx)(w,{}):(0,a.jsx)(x,{}),onClick:h})})]})};var N=t(78754),v=t(25889);let{Title:k}=i.default,T=h()(()=>Promise.all([t.e(3247),t.e(1031)]).then(t.t.bind(t,91031,23)),{loadableGenerated:{webpack:()=>[91031]},ssr:!1}),C=h()(()=>Promise.all([t.e(3247),t.e(1570)]).then(t.t.bind(t,31570,23)),{loadableGenerated:{webpack:()=>[31570]},ssr:!1}),S=3e3;function _(){let[e,s]=(0,l.useState)([]),[t,i]=(0,l.useState)([]),[d,u]=(0,l.useState)(!1),[h,b]=(0,l.useState)(null),[w,x]=(0,l.useState)(""),{t:y}=(0,m.$G)(),f=null,v=null,_=async()=>{try{let e=await (0,p.rQ)(p.WE,{auth:!0});(0,g.Qr)(e)?s([]):s(e)}catch(e){console.log("==== error",e)}};(0,l.useEffect)(()=>(_(),v=setInterval(()=>{_()},p.NE),()=>{clearTimeout(f),clearTimeout(v)}),[]);let P=e.reduce((e,s)=>{let t=s.user.id;return e.some(e=>e.text===t)||e.push({text:t,value:t}),e},[]).sort((e,s)=>{let t=e.text.toUpperCase(),a=s.text.toUpperCase();return t<a?-1:t>a?1:0}),E=t=>{let a=e.findIndex(e=>e.id===t.id);e.splice(a,1,t),s([...e])},I=()=>{f=setTimeout(()=>{b(null),x("")},S)},O=async l=>{u(!0);let n=await (0,p.rQ)(p.hn,{auth:!0,method:"POST",data:{visible:l,idArray:t}});if(n.success&&"changed"===n.message){b((0,a.jsx)(T,{})),I();let n=[...e];t.map(s=>{let t=n.findIndex(e=>e.id===s),a={...e[t],visible:l};return n.splice(t,1,a),null}),s(n),i([])}else b((0,a.jsx)(C,{})),I();u(!1)},G=[{title:y("Time"),dataIndex:"timestamp",key:"timestamp",className:"timestamp-col",defaultSortOrder:"descend",render:e=>{let s=new Date(e);return(0,c.WU)(s,"PP pp")},sorter:(e,s)=>new Date(e.timestamp).getTime()-new Date(s.timestamp).getTime(),width:90},{title:y("User"),dataIndex:"user",key:"user",className:"name-col",filters:P,onFilter:(e,s)=>s.user.id===e,sorter:(e,s)=>e.user.displayName.localeCompare(s.user.displayName),sortDirections:["ascend","descend"],ellipsis:!0,render:e=>{let{displayName:s}=e;return(0,a.jsx)(N.Z,{user:e,children:s})},width:110},{title:y("Message"),dataIndex:"body",key:"body",className:"message-col",width:320,render:e=>(0,a.jsx)("div",{className:"message-contents",dangerouslySetInnerHTML:{__html:e}})},{title:"",dataIndex:"hiddenAt",key:"hiddenAt",className:"toggle-col",filters:[{text:y("Visible messages"),value:!0},{text:y("Hidden messages"),value:!1}],onFilter:(e,s)=>s.visible===e,render:(e,s)=>(0,a.jsx)(j,{isVisible:!e,message:s,setMessage:E}),width:30}],M=o()({"bulk-editor":!0,active:t.length});return(0,a.jsxs)("div",{className:"chat-messages",children:[(0,a.jsx)(k,{children:y("Chat Messages")}),(0,a.jsx)("p",{children:y("Manage the messages from viewers that show up on your stream.")}),(0,a.jsxs)("div",{className:M,children:[(0,a.jsxs)("span",{className:"label",children:[y("Check multiple messages to change their visibility to:")," "]}),(0,a.jsx)(n.Z,{type:"primary",size:"small",shape:"round",className:"button",loading:"show"===w&&d,icon:"show"===w&&h,disabled:!t.length||w&&"show"!==w,onClick:()=>{x("show"),O(!0)},children:y("Show")}),(0,a.jsx)(n.Z,{type:"primary",size:"small",shape:"round",className:"button",loading:"hide"===w&&d,icon:"hide"===w&&h,disabled:!t.length||w&&"hide"!==w,onClick:()=>{x("hide"),O(!1)},children:y("Hide")})]}),(0,a.jsx)(r.Z,{size:"small",className:"table-container",pagination:{defaultPageSize:100,showSizeChanger:!0},scroll:{y:540},rowClassName:e=>e.hiddenAt?"hidden":"",dataSource:e,columns:G,rowKey:e=>e.id,rowSelection:{selectedRowKeys:t,onChange:e=>{i(e)}}})]})}_.getLayout=function(e){return(0,a.jsx)(v.l,{page:e})}}},function(e){e.O(0,[83,1287,3800,7786,443,9904,3657,6167,2502,7528,9532,449,7043,4065,2642,7039,1913,5889,3064,5308,2888,9774,179],function(){return e(e.s=62433)}),_N_E=e.O()}]);