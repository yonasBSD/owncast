(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7095],{62433:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/admin/chat/messages",function(){return s(93628)}])},78021:function(e,t,s){"use strict";var a=s(78235);t.Z=a.Z},65765:function(e,t,s){"use strict";var a=s(61185),l=s(59408),i=a.ZP;i.Header=a.h4,i.Footer=a.$_,i.Content=a.VY,i.Sider=l.Z,i._InternalSiderContext=l.D,t.default=i},10227:function(e,t,s){"use strict";var a=s(79338);t.Z=a.Z},93628:function(e,t,s){"use strict";s.r(t),s.d(t,{OUTCOME_TIMEOUT:function(){return T},default:function(){return _}});var a=s(85893),l=s(67294),i=s(23657),n=s(56469),r=s(27043),d=s(93967),o=s.n(d),c=s(12642),u=s(5152),h=s.n(u),m=s(37039),p=s(11992),g=s(74040),b=s(8968);let x=h()(()=>Promise.all([s.e(3247),s.e(2870)]).then(s.t.bind(s,92870,23)),{loadableGenerated:{webpack:()=>[92870]},ssr:!1}),w=h()(()=>Promise.all([s.e(3247),s.e(112)]).then(s.t.bind(s,80112,23)),{loadableGenerated:{webpack:()=>[80112]},ssr:!1}),f=h()(()=>Promise.all([s.e(3247),s.e(1031)]).then(s.t.bind(s,91031,23)),{loadableGenerated:{webpack:()=>[91031]},ssr:!1}),y=h()(()=>Promise.all([s.e(3247),s.e(1570)]).then(s.t.bind(s,31570,23)),{loadableGenerated:{webpack:()=>[31570]},ssr:!1}),v=e=>{let{isVisible:t,message:s,setMessage:i}=e;if(!s||(0,g.Qr)(s))return null;let r=null,[d,o]=(0,l.useState)(0),{id:c}=s||{},u=()=>{r=setTimeout(()=>{o(0)},3e3)};(0,l.useEffect)(()=>()=>{clearTimeout(r)});let h=async()=>{clearTimeout(r),o(0);let e=await (0,p.rQ)(p.hn,{auth:!0,method:"POST",data:{visible:!t,idArray:[c]}});e.success&&"changed"===e.message?(i({...s,visible:!t}),o(1)):(i({...s,visible:t}),o(-1)),u()},m=(0,a.jsx)(f,{style:{color:"transparent"}});d&&(m=d>0?(0,a.jsx)(f,{style:{color:"var(--ant-success)"}}):(0,a.jsx)(y,{style:{color:"var(--ant-warning)"}}));let v="Click to ".concat(t?"hide":"show"," this message");return(0,a.jsxs)("div",{className:"toggle-switch ".concat(t?"":"hidden"),children:[(0,a.jsx)("span",{className:"outcome-icon",children:m}),(0,a.jsx)(b.Z,{title:v,placement:"topRight",children:(0,a.jsx)(n.Z,{shape:"circle",size:"small",type:"text",icon:t?(0,a.jsx)(x,{}):(0,a.jsx)(w,{}),onClick:h})})]})};var j=s(78754),N=s(25889);let{Title:k}=i.default,C=h()(()=>Promise.all([s.e(3247),s.e(1031)]).then(s.t.bind(s,91031,23)),{loadableGenerated:{webpack:()=>[91031]},ssr:!1}),S=h()(()=>Promise.all([s.e(3247),s.e(1570)]).then(s.t.bind(s,31570,23)),{loadableGenerated:{webpack:()=>[31570]},ssr:!1}),T=3e3;function _(){let[e,t]=(0,l.useState)([]),[s,i]=(0,l.useState)([]),[d,u]=(0,l.useState)(!1),[h,b]=(0,l.useState)(null),[x,w]=(0,l.useState)(""),{t:f}=(0,m.$G)(),y=null,N=null,_=async()=>{try{let e=await (0,p.rQ)(p.WE,{auth:!0});(0,g.Qr)(e)?t([]):t(e)}catch(e){console.log("==== error",e)}};(0,l.useEffect)(()=>(_(),N=setInterval(()=>{_()},p.NE),()=>{clearTimeout(y),clearTimeout(N)}),[]);let P=e.reduce((e,t)=>{let s=t.user.id;return e.some(e=>e.text===s)||e.push({text:s,value:s}),e},[]).sort((e,t)=>{let s=e.text.toUpperCase(),a=t.text.toUpperCase();return s<a?-1:s>a?1:0}),Z=s=>{let a=e.findIndex(e=>e.id===s.id);e.splice(a,1,s),t([...e])},E=()=>{y=setTimeout(()=>{b(null),w("")},T)},I=async l=>{u(!0);let n=await (0,p.rQ)(p.hn,{auth:!0,method:"POST",data:{visible:l,idArray:s}});if(n.success&&"changed"===n.message){b((0,a.jsx)(C,{})),E();let n=[...e];s.map(t=>{let s=n.findIndex(e=>e.id===t),a={...e[s],visible:l};return n.splice(s,1,a),null}),t(n),i([])}else b((0,a.jsx)(S,{})),E();u(!1)},O=[{title:f("Time"),dataIndex:"timestamp",key:"timestamp",className:"timestamp-col",defaultSortOrder:"descend",render:e=>{let t=new Date(e);return(0,c.WU)(t,"PP pp")},sorter:(e,t)=>new Date(e.timestamp).getTime()-new Date(t.timestamp).getTime(),width:90},{title:f("User"),dataIndex:"user",key:"user",className:"name-col",filters:P,onFilter:(e,t)=>t.user.id===e,sorter:(e,t)=>e.user.displayName.localeCompare(t.user.displayName),sortDirections:["ascend","descend"],ellipsis:!0,render:e=>{let{displayName:t}=e;return(0,a.jsx)(j.Z,{user:e,children:t})},width:110},{title:f("Message"),dataIndex:"body",key:"body",className:"message-col",width:320,render:e=>(0,a.jsx)("div",{className:"message-contents",dangerouslySetInnerHTML:{__html:e}})},{title:"",dataIndex:"hiddenAt",key:"hiddenAt",className:"toggle-col",filters:[{text:f("Visible messages"),value:!0},{text:f("Hidden messages"),value:!1}],onFilter:(e,t)=>t.visible===e,render:(e,t)=>(0,a.jsx)(v,{isVisible:!e,message:t,setMessage:Z}),width:30}],G=o()({"bulk-editor":!0,active:s.length});return(0,a.jsxs)("div",{className:"chat-messages",children:[(0,a.jsx)(k,{children:f("Chat Messages")}),(0,a.jsx)("p",{children:f("Manage the messages from viewers that show up on your stream.")}),(0,a.jsxs)("div",{className:G,children:[(0,a.jsxs)("span",{className:"label",children:[f("Check multiple messages to change their visibility to:")," "]}),(0,a.jsx)(n.Z,{type:"primary",size:"small",shape:"round",className:"button",loading:"show"===x&&d,icon:"show"===x&&h,disabled:!s.length||x&&"show"!==x,onClick:()=>{w("show"),I(!0)},children:f("Show")}),(0,a.jsx)(n.Z,{type:"primary",size:"small",shape:"round",className:"button",loading:"hide"===x&&d,icon:"hide"===x&&h,disabled:!s.length||x&&"hide"!==x,onClick:()=>{w("hide"),I(!1)},children:f("Hide")})]}),(0,a.jsx)(r.Z,{size:"small",className:"table-container",pagination:{defaultPageSize:100,showSizeChanger:!0},scroll:{y:540},rowClassName:e=>e.hiddenAt?"hidden":"",dataSource:e,columns:O,rowKey:e=>e.id,rowSelection:{selectedRowKeys:s,onChange:e=>{i(e)}}})]})}_.getLayout=function(e){return(0,a.jsx)(N.l,{page:e})}}},function(e){e.O(0,[83,1287,3800,7786,443,9904,3657,1175,2502,7528,9532,449,7043,4065,2642,7039,1913,5889,3064,1236,2888,9774,179],function(){return e(e.s=62433)}),_N_E=e.O()}]);