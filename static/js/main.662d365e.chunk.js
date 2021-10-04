(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{37:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return o}));var a=n(83),i=n(4),c=n(82),r=n(48),l=n(55),d=!e.localStorage;var o=function(){var e=new a.a({dataIdFromObject:function(e){return"Notes"===e.__typename?"__Notes__":Object(i.b)(e)}});return d||(localStorage.getItem("apollo-cache-persist")||function(e){e.restore({__Notes__:{__typename:"Notes",items:[]},ROOT_QUERY:{__typename:"Query",notes:{__ref:"__Notes__"}}})}(e),Object(r.b)({cache:e,storage:new r.a(window.localStorage),debug:!1,trigger:"write",debounce:1e3})),new c.a({cache:e,typeDefs:l.a})}()}).call(this,n(32))},55:function(e,t,n){"use strict";t.a=n.p+"static/media/schema.55a72a24.graphqls"},77:function(e,t,n){},78:function(e,t,n){"use strict";n.r(t);var a,i,c=n(99),r=n(3),l=n.n(r),d=n(52),o=n.n(d),s=n(14),u=n(62),j=n(25),v=n(101),b=n(61),f=n(45),O=n(63),x=n(53),m=n(54),p=n.n(m),h=n(37),_=h.a.cache,N=Object(v.a)(a||(a=Object(j.a)(["\n  query Notes($id: String!) {\n    note(id: $id) {\n      __typename\n      id\n      text\n      title\n      updated_at\n    }\n  }\n"]))),y=Object(v.a)(i||(i=Object(j.a)(["\n  query Notes {\n    notes {\n      items {\n        __typename\n        id\n      }\n    }\n  }\n"])));function g(e){var t=e.id||function(){var e=p()(String(Date.now())).slice(0,6);return"note:".concat(e)}(),n=Object(s.a)(Object(s.a)({},e),{},{id:t,title:e.title||"",text:e.text||"",updated_at:String(new Date),__typename:"Note"});return _.writeQuery({query:N,variables:{id:t},data:{note:n}}),function(e){var t,n=_.readQuery({query:y}).notes.items,a=null===(t=n[0])||void 0===t?void 0:t.id;if(e.id!==a){var i=n.findIndex((function(t){return e.id===t.id}));if(i>=0){var c=Array.from(n);c.splice(i,1),r(c)}else r(n)}function r(t){_.writeQuery({query:y,data:{notes:{__typename:"Notes",items:[e].concat(Object(O.a)(t))}}})}}(n),n}var w=Object(x.debounce)(g,100),S=n(100),q=n(58);S.a.addDefaultLocale(q);var C=new S.a("en-US"),k=function(e){return C.format(e)};function D(e){return e?new Date(e):null}var E=n(28),I=n(96),R=Object(E.c)(null);function $(){return Object(I.a)(R)}var F=n(59),L="tick",Q=new(n.n(F).a);setInterval((function(){Q.emit(L)}),1e4);var A,B,M=n(97),T=(n(98),{}),U=Object(v.a)(A||(A=Object(j.a)(["\n    query AllNotes {\n  notes {\n    items {\n      id\n      text\n      title\n      updated_at\n    }\n  }\n}\n    "])));function J(e){var t=Object(s.a)(Object(s.a)({},T),e);return M.a(U,t)}var P=Object(v.a)(B||(B=Object(j.a)(["\n    query Note($id: String) {\n  note(id: $id) {\n    id\n    text\n    title\n    updated_at\n  }\n}\n    "])));function V(e){var t=Object(s.a)(Object(s.a)({},T),e);return M.a(P,t)}var Y,z,G=n(8);Object(v.a)(Y||(Y=Object(j.a)(["\n  query AllNotes {\n    notes {\n      items {\n        id\n        text\n        title\n        updated_at\n      }\n    }\n  }\n"]))),Object(v.a)(z||(z=Object(j.a)(["\n  query Note($id: String) {\n    note(id: $id) {\n      id\n      text\n      title\n      updated_at\n    }\n  }\n"])));var H=function(){var e,t,n=$(),a=null===(e=V({variables:{id:n}}))||void 0===e||null===(t=e.data)||void 0===t?void 0:t.note,i=Boolean(n&&(null===a||void 0===a?void 0:a.title));return Object(G.jsxs)("div",{className:"xtoolbar",children:[Object(G.jsx)("div",{className:"font-bold mr",children:"\ud83d\udd8b My Note"}),Object(G.jsx)("span",{className:"spacer"}),Object(G.jsx)("button",{"data-tip":'Save "'.concat(null===a||void 0===a?void 0:a.title,'" and create a new note'),className:"py-1.5 px-4 rounded bg-pink-500 text-white",style:{visibility:i?"visible":"hidden"},onClick:function(e){e.preventDefault(),R(null)},children:"New note"}),Object(G.jsx)("div",{className:"rounded-full bg-white w-8 h-8"})]})},K="Untitled",W=function(e){var t=e.dateStr,n=Object(r.useMemo)((function(){return D(t)}),[t]),a=Object(r.useState)(n),i=Object(u.a)(a,2),c=i[0],l=i[1],d=Object(r.useCallback)((function(){t&&l(D(t))}),[t]);return Object(r.useEffect)((function(){var e;return e=d,Q.on(L,e),function(){!function(e){Q.off(L,e)}(d)}}),[d]),Object(G.jsx)("span",{"data-tip":t,"data-place":"bottom",children:c&&"".concat(k(c))})},X=function(){var e,t,n,a=$(),i=null===(e=V({variables:{id:a}}))||void 0===e||null===(t=e.data)||void 0===t?void 0:t.note,c=Object(r.useRef)(null),l=Object(r.useRef)(null),d=null===(n=l.current)||void 0===n?void 0:n.value;Object(r.useEffect)((function(){var e;i?(c.current.value=i.title,l.current.value=i.text):(c.current.value=K,l.current.value="",null===(e=c.current)||void 0===e||e.select())}),[i,null===i||void 0===i?void 0:i.id]);var o=Object(r.useCallback)((function(){var e={title:c.current.value,text:l.current.value};if(a)w(Object(s.a)({id:a},e));else{var t=g(e).id;R(t)}}),[a]);return Object(G.jsxs)("div",{className:"curr my-8 mx-8 flex flex-col",children:[Object(G.jsxs)("div",{className:"curr__toolbar flex mb-2 items-center",children:[Object(G.jsx)("input",{ref:c,className:"xtitle",type:"text",defaultValue:(null===i||void 0===i?void 0:i.title)||K,onChange:o}),Object(G.jsx)("span",{className:"spacer"}),Object(G.jsx)("div",{className:"text-faint",children:(null===i||void 0===i?void 0:i.updated_at)&&Object(G.jsxs)("span",{children:["Last update:"," ",Object(G.jsx)(W,{dateStr:null===i||void 0===i?void 0:i.updated_at},null===i||void 0===i?void 0:i.id)]})})]}),Object(G.jsx)(b.a,{minRows:8,maxRows:16,maxLength:2e3,ref:l,className:"xtextarea",defaultValue:(null===i||void 0===i?void 0:i.text)||void 0,onChange:o}),Object(G.jsx)("div",{className:"text-right text-faint-faint h-4 mt-1",children:d?"".concat(d.length," / 2000"):""})]})},Z=function(){var e,t=$(),n=J().data;return Object(r.useEffect)((function(){f.a.rebuild()}),[t]),Object(G.jsxs)("div",{className:"xcontainer",children:[Object(G.jsx)(H,{}),Object(G.jsx)(X,{}),Object(G.jsx)("div",{className:"xitem-container",children:null===n||void 0===n||null===(e=n.notes)||void 0===e?void 0:e.items.map((function(e){if(e.id!==t)return Object(G.jsxs)("div",{children:[Object(G.jsxs)("div",{"data-tip":'Open "'.concat(e.title,'"'),className:"xitem mb-1",onClick:function(){return R(e.id)},children:[Object(G.jsx)("div",{className:"ellipsis",children:e.title}),Object(G.jsx)("div",{className:"text-faint multi-ellipsis",children:e.text})]}),Object(G.jsx)("div",{className:"text-right text-faint-faint",children:Object(G.jsx)(W,{dateStr:e.updated_at},e.id)})]},e.id)}))}),Object(G.jsx)(f.a,{effect:"solid"})]})},ee=function(){var e,t,n=J().data,a=null===n||void 0===n||null===(e=n.notes)||void 0===e||null===(t=e.items[0])||void 0===t?void 0:t.id;return Object(r.useEffect)((function(){R(a)}),[]),Object(G.jsx)(Z,{})},te=(n(77),function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,103)).then((function(t){var n=t.getCLS,a=t.getFID,i=t.getFCP,c=t.getLCP,r=t.getTTFB;n(e),a(e),i(e),c(e),r(e)}))});o.a.render(Object(G.jsx)(l.a.StrictMode,{children:Object(G.jsx)(c.a,{client:h.a,children:Object(G.jsx)(ee,{})})}),document.getElementById("root")),te()}},[[78,1,2]]]);
//# sourceMappingURL=main.662d365e.chunk.js.map