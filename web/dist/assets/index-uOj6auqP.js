(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const f of l)if(f.type==="childList")for(const h of f.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const f={};return l.integrity&&(f.integrity=l.integrity),l.referrerPolicy&&(f.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?f.credentials="include":l.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function r(l){if(l.ep)return;l.ep=!0;const f=i(l);fetch(l.href,f)}})();function Ax(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var od={exports:{}},il={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var rv;function gE(){if(rv)return il;rv=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(r,l,f){var h=null;if(f!==void 0&&(h=""+f),l.key!==void 0&&(h=""+l.key),"key"in l){f={};for(var d in l)d!=="key"&&(f[d]=l[d])}else f=l;return l=f.ref,{$$typeof:o,type:r,key:h,ref:l!==void 0?l:null,props:f}}return il.Fragment=e,il.jsx=i,il.jsxs=i,il}var ov;function _E(){return ov||(ov=1,od.exports=gE()),od.exports}var R=_E(),ld={exports:{}},fe={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var lv;function vE(){if(lv)return fe;lv=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),f=Symbol.for("react.consumer"),h=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),g=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),x=Symbol.for("react.lazy"),m=Symbol.for("react.activity"),y=Symbol.for("react.view_transition"),M=Symbol.iterator;function E(U){return U===null||typeof U!="object"?null:(U=M&&U[M]||U["@@iterator"],typeof U=="function"?U:null)}var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},S=Object.assign,v={};function P(U,tt,G){this.props=U,this.context=tt,this.refs=v,this.updater=G||A}P.prototype.isReactComponent={},P.prototype.setState=function(U,tt){if(typeof U!="object"&&typeof U!="function"&&U!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,U,tt,"setState")},P.prototype.forceUpdate=function(U){this.updater.enqueueForceUpdate(this,U,"forceUpdate")};function O(){}O.prototype=P.prototype;function L(U,tt,G){this.props=U,this.context=tt,this.refs=v,this.updater=G||A}var V=L.prototype=new O;V.constructor=L,S(V,P.prototype),V.isPureReactComponent=!0;var H=Array.isArray;function B(){}var q={H:null,A:null,T:null,S:null},N=Object.prototype.hasOwnProperty;function D(U,tt,G){var F=G.ref;return{$$typeof:o,type:U,key:tt,ref:F!==void 0?F:null,props:G}}function X(U,tt){return D(U.type,tt,U.props)}function lt(U){return typeof U=="object"&&U!==null&&U.$$typeof===o}function gt(U){var tt={"=":"=0",":":"=2"};return"$"+U.replace(/[=:]/g,function(G){return tt[G]})}var Mt=/\/+/g;function mt(U,tt){return typeof U=="object"&&U!==null&&U.key!=null?gt(""+U.key):tt.toString(36)}function Z(U){switch(U.status){case"fulfilled":return U.value;case"rejected":throw U.reason;default:switch(typeof U.status=="string"?U.then(B,B):(U.status="pending",U.then(function(tt){U.status==="pending"&&(U.status="fulfilled",U.value=tt)},function(tt){U.status==="pending"&&(U.status="rejected",U.reason=tt)})),U.status){case"fulfilled":return U.value;case"rejected":throw U.reason}}throw U}function ct(U,tt,G,F,pt){var St=typeof U;(St==="undefined"||St==="boolean")&&(U=null);var Et=!1;if(U===null)Et=!0;else switch(St){case"bigint":case"string":case"number":Et=!0;break;case"object":switch(U.$$typeof){case o:case e:Et=!0;break;case x:return Et=U._init,ct(Et(U._payload),tt,G,F,pt)}}if(Et)return pt=pt(U),Et=F===""?"."+mt(U,0):F,H(pt)?(G="",Et!=null&&(G=Et.replace(Mt,"$&/")+"/"),ct(pt,tt,G,"",function(z){return z})):pt!=null&&(lt(pt)&&(pt=X(pt,G+(pt.key==null||U&&U.key===pt.key?"":(""+pt.key).replace(Mt,"$&/")+"/")+Et)),tt.push(pt)),1;Et=0;var ut=F===""?".":F+":";if(H(U))for(var Ot=0;Ot<U.length;Ot++)F=U[Ot],St=ut+mt(F,Ot),Et+=ct(F,tt,G,St,pt);else if(Ot=E(U),typeof Ot=="function")for(U=Ot.call(U),Ot=0;!(F=U.next()).done;)F=F.value,St=ut+mt(F,Ot++),Et+=ct(F,tt,G,St,pt);else if(St==="object"){if(typeof U.then=="function")return ct(Z(U),tt,G,F,pt);throw tt=String(U),Error("Objects are not valid as a React child (found: "+(tt==="[object Object]"?"object with keys {"+Object.keys(U).join(", ")+"}":tt)+"). If you meant to render a collection of children, use an array instead.")}return Et}function Q(U,tt,G){if(U==null)return U;var F=[],pt=0;return ct(U,F,"","",function(St){return tt.call(G,St,pt++)}),F}function Tt(U){if(U._status===-1){var tt=U._result,G=tt();G.then(function(F){(U._status===0||U._status===-1)&&(U._status=1,U._result=F,G.status===void 0&&(G.status="fulfilled",G.value=F))},function(F){(U._status===0||U._status===-1)&&(U._status=2,U._result=F,G.status===void 0&&(G.status="rejected",G.reason=F))}),U._status===-1&&(U._status=0,U._result=G)}if(U._status===1)return U._result.default;throw U._result}var At=typeof reportError=="function"?reportError:function(U){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var tt=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof U=="object"&&U!==null&&typeof U.message=="string"?String(U.message):String(U),error:U});if(!window.dispatchEvent(tt))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",U);return}console.error(U)};function Yt(U){var tt=q.T,G={};G.types=tt!==null?tt.types:null,q.T=G;try{var F=U(),pt=q.S;pt!==null&&pt(G,F),typeof F=="object"&&F!==null&&typeof F.then=="function"&&F.then(B,At)}catch(St){At(St)}finally{tt!==null&&G.types!==null&&(tt.types=G.types),q.T=tt}}function oe(U){var tt=q.T;if(tt!==null){var G=tt.types;G===null?tt.types=[U]:G.indexOf(U)===-1&&G.push(U)}else Yt(oe.bind(null,U))}var Ct={map:Q,forEach:function(U,tt,G){Q(U,function(){tt.apply(this,arguments)},G)},count:function(U){var tt=0;return Q(U,function(){tt++}),tt},toArray:function(U){return Q(U,function(tt){return tt})||[]},only:function(U){if(!lt(U))throw Error("React.Children.only expected to receive a single React element child.");return U}};return fe.Activity=m,fe.Children=Ct,fe.Component=P,fe.Fragment=i,fe.Profiler=l,fe.PureComponent=L,fe.StrictMode=r,fe.Suspense=g,fe.ViewTransition=y,fe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=q,fe.__COMPILER_RUNTIME={__proto__:null,c:function(U){return q.H.useMemoCache(U)}},fe.addTransitionType=oe,fe.cache=function(U){return function(){return U.apply(null,arguments)}},fe.cacheSignal=function(){return null},fe.cloneElement=function(U,tt,G){if(U==null)throw Error("The argument must be a React element, but you passed "+U+".");var F=S({},U.props),pt=U.key;if(tt!=null)for(St in tt.key!==void 0&&(pt=""+tt.key),tt)!N.call(tt,St)||St==="key"||St==="__self"||St==="__source"||St==="ref"&&tt.ref===void 0||(F[St]=tt[St]);var St=arguments.length-2;if(St===1)F.children=G;else if(1<St){for(var Et=Array(St),ut=0;ut<St;ut++)Et[ut]=arguments[ut+2];F.children=Et}return D(U.type,pt,F)},fe.createContext=function(U){return U={$$typeof:h,_currentValue:U,_currentValue2:U,_threadCount:0,Provider:null,Consumer:null},U.Provider=U,U.Consumer={$$typeof:f,_context:U},U},fe.createElement=function(U,tt,G){var F,pt={},St=null;if(tt!=null)for(F in tt.key!==void 0&&(St=""+tt.key),tt)N.call(tt,F)&&F!=="key"&&F!=="__self"&&F!=="__source"&&(pt[F]=tt[F]);var Et=arguments.length-2;if(Et===1)pt.children=G;else if(1<Et){for(var ut=Array(Et),Ot=0;Ot<Et;Ot++)ut[Ot]=arguments[Ot+2];pt.children=ut}if(U&&U.defaultProps)for(F in Et=U.defaultProps,Et)pt[F]===void 0&&(pt[F]=Et[F]);return D(U,St,pt)},fe.createRef=function(){return{current:null}},fe.forwardRef=function(U){return{$$typeof:d,render:U}},fe.isValidElement=lt,fe.lazy=function(U){return{$$typeof:x,_payload:{_status:-1,_result:U},_init:Tt}},fe.memo=function(U,tt){return{$$typeof:p,type:U,compare:tt===void 0?null:tt}},fe.startTransition=Yt,fe.unstable_useCacheRefresh=function(){return q.H.useCacheRefresh()},fe.use=function(U){return q.H.use(U)},fe.useActionState=function(U,tt,G){return q.H.useActionState(U,tt,G)},fe.useCallback=function(U,tt){return q.H.useCallback(U,tt)},fe.useContext=function(U){return q.H.useContext(U)},fe.useDebugValue=function(){},fe.useDeferredValue=function(U,tt){return q.H.useDeferredValue(U,tt)},fe.useEffect=function(U,tt){return q.H.useEffect(U,tt)},fe.useEffectEvent=function(U){return q.H.useEffectEvent(U)},fe.useId=function(){return q.H.useId()},fe.useImperativeHandle=function(U,tt,G){return q.H.useImperativeHandle(U,tt,G)},fe.useInsertionEffect=function(U,tt){return q.H.useInsertionEffect(U,tt)},fe.useLayoutEffect=function(U,tt){return q.H.useLayoutEffect(U,tt)},fe.useMemo=function(U,tt){return q.H.useMemo(U,tt)},fe.useOptimistic=function(U,tt){return q.H.useOptimistic(U,tt)},fe.useReducer=function(U,tt,G){return q.H.useReducer(U,tt,G)},fe.useRef=function(U){return q.H.useRef(U)},fe.useState=function(U){return q.H.useState(U)},fe.useSyncExternalStore=function(U,tt,G){return q.H.useSyncExternalStore(U,tt,G)},fe.useTransition=function(){return q.H.useTransition()},fe.version="19.3.1",fe}var cv;function Hp(){return cv||(cv=1,ld.exports=vE()),ld.exports}var Ft=Hp();const xE=Ax(Ft);var cd={exports:{}},al={},ud={exports:{}},fd={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var uv;function yE(){return uv||(uv=1,(function(o){function e(Z,ct){var Q=Z.length;Z.push(ct);t:for(;0<Q;){var Tt=Q-1>>>1,At=Z[Tt];if(0<l(At,ct))Z[Tt]=ct,Z[Q]=At,Q=Tt;else break t}}function i(Z){return Z.length===0?null:Z[0]}function r(Z){if(Z.length===0)return null;var ct=Z[0],Q=Z.pop();if(Q!==ct){Z[0]=Q;t:for(var Tt=0,At=Z.length,Yt=At>>>1;Tt<Yt;){var oe=2*(Tt+1)-1,Ct=Z[oe],U=oe+1,tt=Z[U];if(0>l(Ct,Q))U<At&&0>l(tt,Ct)?(Z[Tt]=tt,Z[U]=Q,Tt=U):(Z[Tt]=Ct,Z[oe]=Q,Tt=oe);else if(U<At&&0>l(tt,Q))Z[Tt]=tt,Z[U]=Q,Tt=U;else break t}}return ct}function l(Z,ct){var Q=Z.sortIndex-ct.sortIndex;return Q!==0?Q:Z.id-ct.id}if(o.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var f=performance;o.unstable_now=function(){return f.now()}}else{var h=Date,d=h.now();o.unstable_now=function(){return h.now()-d}}var g=[],p=[],x=1,m=null,y=3,M=!1,E=!1,A=!1,S=!1,v=typeof setTimeout=="function"?setTimeout:null,P=typeof clearTimeout=="function"?clearTimeout:null,O=typeof setImmediate<"u"?setImmediate:null;function L(Z){for(var ct=i(p);ct!==null;){if(ct.callback===null)r(p);else if(ct.startTime<=Z)r(p),ct.sortIndex=ct.expirationTime,e(g,ct);else break;ct=i(p)}}function V(Z){if(A=!1,L(Z),!E)if(i(g)!==null)E=!0,H||(H=!0,lt());else{var ct=i(p);ct!==null&&mt(V,ct.startTime-Z)}}var H=!1,B=-1,q=5,N=-1;function D(){return S?!0:!(o.unstable_now()-N<q)}function X(){if(S=!1,H){var Z=o.unstable_now();N=Z;var ct=!0;try{t:{E=!1,A&&(A=!1,P(B),B=-1),M=!0;var Q=y;try{e:{for(L(Z),m=i(g);m!==null&&!(m.expirationTime>Z&&D());){var Tt=m.callback;if(typeof Tt=="function"){m.callback=null,y=m.priorityLevel;var At=Tt(m.expirationTime<=Z);if(Z=o.unstable_now(),typeof At=="function"){m.callback=At,L(Z),ct=!0;break e}m===i(g)&&r(g),L(Z)}else r(g);m=i(g)}if(m!==null)ct=!0;else{var Yt=i(p);Yt!==null&&mt(V,Yt.startTime-Z),ct=!1}}break t}finally{m=null,y=Q,M=!1}ct=void 0}}finally{ct?lt():H=!1}}}var lt;if(typeof O=="function")lt=function(){O(X)};else if(typeof MessageChannel<"u"){var gt=new MessageChannel,Mt=gt.port2;gt.port1.onmessage=X,lt=function(){Mt.postMessage(null)}}else lt=function(){v(X,0)};function mt(Z,ct){B=v(function(){Z(o.unstable_now())},ct)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(Z){Z.callback=null},o.unstable_forceFrameRate=function(Z){0>Z||125<Z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):q=0<Z?Math.floor(1e3/Z):5},o.unstable_getCurrentPriorityLevel=function(){return y},o.unstable_next=function(Z){switch(y){case 1:case 2:case 3:var ct=3;break;default:ct=y}var Q=y;y=ct;try{return Z()}finally{y=Q}},o.unstable_requestPaint=function(){S=!0},o.unstable_runWithPriority=function(Z,ct){switch(Z){case 1:case 2:case 3:case 4:case 5:break;default:Z=3}var Q=y;y=Z;try{return ct()}finally{y=Q}},o.unstable_scheduleCallback=function(Z,ct,Q){var Tt=o.unstable_now();switch(typeof Q=="object"&&Q!==null?(Q=Q.delay,Q=typeof Q=="number"&&0<Q?Tt+Q:Tt):Q=Tt,Z){case 1:var At=-1;break;case 2:At=250;break;case 5:At=1073741823;break;case 4:At=1e4;break;default:At=5e3}return At=Q+At,Z={id:x++,callback:ct,priorityLevel:Z,startTime:Q,expirationTime:At,sortIndex:-1},Q>Tt?(Z.sortIndex=Q,e(p,Z),i(g)===null&&Z===i(p)&&(A?(P(B),B=-1):A=!0,mt(V,Q-Tt))):(Z.sortIndex=At,e(g,Z),E||M||(E=!0,H||(H=!0,lt()))),Z},o.unstable_shouldYield=D,o.unstable_wrapCallback=function(Z){var ct=y;return function(){var Q=y;y=ct;try{return Z.apply(this,arguments)}finally{y=Q}}}})(fd)),fd}var fv;function SE(){return fv||(fv=1,ud.exports=yE()),ud.exports}var hd={exports:{}},Nn={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var hv;function ME(){if(hv)return Nn;hv=1;var o=Hp();function e(x){var m="https://react.dev/errors/"+x;if(1<arguments.length){m+="?args[]="+encodeURIComponent(arguments[1]);for(var y=2;y<arguments.length;y++)m+="&args[]="+encodeURIComponent(arguments[y])}return"Minified React error #"+x+"; visit "+m+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var r={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal"),f=Symbol.for("react.recoverable"),h=Symbol.for("react.optimistic_key");function d(x,m,y){var M=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:M==null?null:M===h?h:""+M,children:x,containerInfo:m,implementation:y}}var g=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function p(x,m){if(x==="font")return"";if(typeof m=="string")return m==="use-credentials"?m:""}return Nn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,Nn.browser=function(x){return{$$typeof:f,_reason:x}},Nn.createPortal=function(x,m){var y=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!m||m.nodeType!==1&&m.nodeType!==9&&m.nodeType!==11)throw Error(e(299));return d(x,m,null,y)},Nn.flushSync=function(x){var m=g.T,y=r.p;try{if(g.T=null,r.p=2,x)return x()}finally{g.T=m,r.p=y,r.d.f()}},Nn.preconnect=function(x,m){typeof x=="string"&&(m?(m=m.crossOrigin,m=typeof m=="string"?m==="use-credentials"?m:"":void 0):m=null,r.d.C(x,m))},Nn.prefetchDNS=function(x){typeof x=="string"&&r.d.D(x)},Nn.preinit=function(x,m){if(typeof x=="string"&&m&&typeof m.as=="string"){var y=m.as,M=p(y,m.crossOrigin),E=typeof m.integrity=="string"?m.integrity:void 0,A=typeof m.fetchPriority=="string"?m.fetchPriority:void 0;y==="style"?r.d.S(x,typeof m.precedence=="string"?m.precedence:void 0,{crossOrigin:M,integrity:E,fetchPriority:A}):y==="script"&&r.d.X(x,{crossOrigin:M,integrity:E,fetchPriority:A,nonce:typeof m.nonce=="string"?m.nonce:void 0})}},Nn.preinitModule=function(x,m){if(typeof x=="string")if(typeof m=="object"&&m!==null){if(m.as==null||m.as==="script"){var y=p(m.as,m.crossOrigin);r.d.M(x,{crossOrigin:y,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0})}}else m==null&&r.d.M(x)},Nn.preload=function(x,m){if(typeof x=="string"&&typeof m=="object"&&m!==null&&typeof m.as=="string"){var y=m.as,M=p(y,m.crossOrigin);r.d.L(x,y,{crossOrigin:M,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,type:typeof m.type=="string"?m.type:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0,referrerPolicy:typeof m.referrerPolicy=="string"?m.referrerPolicy:void 0,imageSrcSet:typeof m.imageSrcSet=="string"?m.imageSrcSet:void 0,imageSizes:typeof m.imageSizes=="string"?m.imageSizes:void 0,media:typeof m.media=="string"?m.media:void 0})}},Nn.preloadModule=function(x,m){if(typeof x=="string")if(m){var y=p(m.as,m.crossOrigin);r.d.m(x,{as:typeof m.as=="string"&&m.as!=="script"?m.as:void 0,crossOrigin:y,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0})}else r.d.m(x)},Nn.requestFormReset=function(x){r.d.r(x)},Nn.unstable_batchedUpdates=function(x,m){return x(m)},Nn.useFormState=function(x,m,y){return g.H.useFormState(x,m,y)},Nn.useFormStatus=function(){return g.H.useHostTransitionStatus()},Nn.version="19.3.1",Nn}var dv;function EE(){if(dv)return hd.exports;dv=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),hd.exports=ME(),hd.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var pv;function bE(){if(pv)return al;pv=1;var o=SE(),e=Hp(),i=EE();function r(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function f(t){for(var n=t,a=n;a&&!a.alternate;)n=a,(n.flags&4098)!==0&&(t=n.return),a=n.return;for(;n.return;)n=n.return;return n.tag===3?t:null}function h(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function d(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function g(t){if(f(t)!==t)throw Error(r(188))}function p(t){var n=t.alternate;if(!n){if(n=f(t),n===null)throw Error(r(188));return n!==t?null:t}for(var a=t,s=n;;){var c=a.return;if(c===null)break;var u=c.alternate;if(u===null){if(s=c.return,s!==null){a=s;continue}break}if(c.child===u.child){for(u=c.child;u;){if(u===a)return g(c),t;if(u===s)return g(c),n;u=u.sibling}throw Error(r(188))}if(a.return!==s.return)a=c,s=u;else{for(var _=!1,T=c.child;T;){if(T===a){_=!0,a=c,s=u;break}if(T===s){_=!0,s=c,a=u;break}T=T.sibling}if(!_){for(T=u.child;T;){if(T===a){_=!0,a=u,s=c;break}if(T===s){_=!0,s=u,a=c;break}T=T.sibling}if(!_)throw Error(r(189))}}if(a.alternate!==s)throw Error(r(190))}if(a.tag!==3)throw Error(r(188));return a.stateNode.current===a?t:n}function x(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=x(t),n!==null)return n;t=t.sibling}return null}function m(t,n,a,s,c,u){for(;t!==null;){if((t.tag===5||t.tag===27||t.tag===6)&&a(t,s,c,u)||(t.tag!==22||t.memoizedState===null)&&(n||t.tag!==5&&t.tag!==27)&&m(t.child,n,a,s,c,u))return!0;t=t.sibling}return!1}function y(t){for(t=t.return;t!==null;){if(t.tag===3||t.tag===5||t.tag===27)return t;t=t.return}return null}function M(t){var n=!1;for(t=t.return;t!==null&&(t.tag===4&&(n=!0),!(t.tag===3||t.tag===5||t.tag===27));)t=t.return;return n}function E(t){var n=[null,null],a=y(t);return a===null||A(n,t,a.child,{foundSelf:!1}),n}function A(t,n,a,s){for(;a!==null;){if(a===n)s.foundSelf=!0;else if(a.tag===5||a.tag===27||a.tag===6){if(s.foundSelf)return t[1]=a,!0;t[0]=a}else if((a.tag!==22||a.memoizedState===null)&&A(t,n,a.child,s))return!0;a=a.sibling}return!1}function S(t){switch(t.tag){case 5:case 27:case 6:return t.stateNode;case 3:return t.stateNode.containerInfo;default:throw Error(r(559))}}var v=null,P=null;function O(t,n,a){return t===a?!0:t===n?(v=t,!0):!1}function L(t,n,a){return t===a?(P=t,!1):t===n?(P!==null&&(v=t),!0):!1}function V(t){if(t===null)return null;do t=t===null?null:t.return;while(t&&t.tag!==5&&t.tag!==27&&t.tag!==3);return t||null}function H(t,n,a){for(var s=0,c=t;c;c=a(c))s++;c=0;for(var u=n;u;u=a(u))c++;for(;0<s-c;)t=a(t),s--;for(;0<c-s;)n=a(n),c--;for(;s--;){if(t===n||n!==null&&t===n.alternate)return t;t=a(t),n=a(n)}return null}var B=Object.assign,q=Symbol.for("react.element"),N=Symbol.for("react.transitional.element"),D=Symbol.for("react.portal"),X=Symbol.for("react.fragment"),lt=Symbol.for("react.strict_mode"),gt=Symbol.for("react.profiler"),Mt=Symbol.for("react.consumer"),mt=Symbol.for("react.context"),Z=Symbol.for("react.forward_ref"),ct=Symbol.for("react.suspense"),Q=Symbol.for("react.suspense_list"),Tt=Symbol.for("react.memo"),At=Symbol.for("react.lazy"),Yt=Symbol.for("react.activity"),oe=Symbol.for("react.legacy_hidden"),Ct=Symbol.for("react.memo_cache_sentinel"),U=Symbol.for("react.view_transition"),tt=Symbol.for("react.recoverable"),G=Symbol.iterator;function F(t){return t===null||typeof t!="object"?null:(t=G&&t[G]||t["@@iterator"],typeof t=="function"?t:null)}var pt=Symbol.for("react.client.reference");function St(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===pt?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case X:return"Fragment";case gt:return"Profiler";case lt:return"StrictMode";case ct:return"Suspense";case Q:return"SuspenseList";case Yt:return"Activity";case U:return"ViewTransition"}if(typeof t=="object")switch(t.$$typeof){case D:return"Portal";case mt:return t.displayName||"Context";case Mt:return(t._context.displayName||"Context")+".Consumer";case Z:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Tt:return n=t.displayName||null,n!==null?n:St(t.type)||"Memo";case At:n=t._payload,t=t._init;try{return St(t(n))}catch{}}return null}var Et=Array.isArray,ut=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Ot=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,z={pending:!1,data:null,method:null,action:null},ne=[],qt=-1;function Nt(t){return{current:t}}function yt(t){0>qt||(t.current=ne[qt],ne[qt]=null,qt--)}function It(t,n){qt++,ne[qt]=t.current,t.current=n}var Rt=Nt(null),Zt=Nt(null),me=Nt(null),he=Nt(null);function w(t,n){switch(It(me,n),It(Zt,t),It(Rt,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?m_(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=m_(n),t=g_(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}yt(Rt),It(Rt,t)}function b(){yt(Rt),yt(Zt),yt(me)}function Y(t){var n=t.memoizedState;n!==null&&(Ir._currentValue=n.memoizedState,It(he,t)),n=Rt.current;var a=g_(n,t.type);n!==a&&(It(Zt,t),It(Rt,a))}function $(t){Zt.current===t&&(yt(Rt),yt(Zt)),he.current===t&&(yt(he),Ir._currentValue=z)}var ht,ot;function Ht(t){if(ht===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);ht=n&&n[1]||"",ot=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+ht+t+ot}var _t=!1;function Xt(t,n){if(!t||_t)return"";_t=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var s={DetermineComponentFrameRoot:function(){try{if(n){var xt=function(){throw Error()};if(Object.defineProperty(xt.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(xt,[])}catch(Bt){var W=Bt}Reflect.construct(t,[],xt)}else{try{xt.call()}catch(Bt){W=Bt}xt=!1;try{var at=Object.getOwnPropertyDescriptor(t.prototype,"props");Object.defineProperty(t.prototype,"props",{configurable:!0,set:function(){throw Error()}}),xt=!0,new t}finally{xt&&(at!==void 0?Object.defineProperty(t.prototype,"props",at):delete t.prototype.props)}}}else{try{throw Error()}catch(Bt){W=Bt}(xt=t())&&typeof xt.catch=="function"&&xt.catch(function(){})}}catch(Bt){if(Bt&&W&&typeof Bt.stack=="string")return[Bt.stack,W.stack]}return[null,null]}};s.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(s.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var u=s.DetermineComponentFrameRoot(),_=u[0],T=u[1];if(_&&T){var I=_.split(`
`),J=T.split(`
`);for(c=s=0;s<I.length&&!I[s].includes("DetermineComponentFrameRoot");)s++;for(;c<J.length&&!J[c].includes("DetermineComponentFrameRoot");)c++;if(s===I.length||c===J.length)for(s=I.length-1,c=J.length-1;1<=s&&0<=c&&I[s]!==J[c];)c--;for(;1<=s&&0<=c;s--,c--)if(I[s]!==J[c]){if(s!==1||c!==1)do if(s--,c--,0>c||I[s]!==J[c]){var rt=`
`+I[s].replace(" at new "," at ");return t.displayName&&rt.includes("<anonymous>")&&(rt=rt.replace("<anonymous>",t.displayName)),rt}while(1<=s&&0<=c);break}}}finally{_t=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?Ht(a):""}function ee(t,n){switch(t.tag){case 26:case 27:case 5:return Ht(t.type);case 16:return Ht("Lazy");case 13:return t.child!==n&&n!==null?Ht("Suspense Fallback"):Ht("Suspense");case 19:return Ht("SuspenseList");case 0:case 15:return Xt(t.type,!1);case 11:return Xt(t.type.render,!1);case 1:return Xt(t.type,!0);case 31:return Ht("Activity");case 30:return Ht("ViewTransition");default:return""}}function Dt(t){try{var n="",a=null;do n+=ee(t,a),a=t,t=t.return;while(t);return n}catch(s){return`
Error generating stack: `+s.message+`
`+s.stack}}var Gt=Object.prototype.hasOwnProperty,ce=o.unstable_scheduleCallback,ie=o.unstable_cancelCallback,Vt=o.unstable_shouldYield,ge=o.unstable_requestPaint,j=o.unstable_now,Lt=o.unstable_getCurrentPriorityLevel,zt=o.unstable_ImmediatePriority,Qt=o.unstable_UserBlockingPriority,wt=o.unstable_NormalPriority,bt=o.unstable_LowPriority,te=o.unstable_IdlePriority,de=o.log,je=o.unstable_setDisableYieldValue,Ce=null,en=null;function gn(t){if(typeof de=="function"&&je(t),en&&typeof en.setStrictMode=="function")try{en.setStrictMode(Ce,t)}catch{}}var Ln=Math.clz32?Math.clz32:Sl,na=Math.log,ho=Math.LN2;function Sl(t){return t>>>=0,t===0?32:31-(na(t)/ho|0)|0}var ds=256,ia=262144,ps=4194304;function fi(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&-t;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function ms(t,n,a){var s=t.pendingLanes;if(s===0)return 0;var c=0,u=t.suspendedLanes,_=t.pingedLanes;t=t.warmLanes;var T=s&134217727;return T!==0?(s=T&~u,s!==0?c=fi(s):(_&=T,_!==0?c=fi(_):a||(a=T&~t,a!==0&&(c=fi(a))))):(T=s&~u,T!==0?c=fi(T):_!==0?c=fi(_):a||(a=s&~t,a!==0&&(c=fi(a)))),c===0?0:n!==0&&n!==c&&(n&u)===0&&(u=c&-c,a=n&-n,u>=a||u===32&&(a&4194048)!==0)?n:c}function Ra(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Ml(t,n){(n&8)!==0&&(n|=n&32);var a=t.entangledLanes;if(a!==0)for(t=t.entanglements,a&=n;0<a;){var s=31-Ln(a),c=1<<s;n|=t[s],a&=~c}return n}function Ou(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function El(){var t=ps;return ps<<=1,(ps&62914560)===0&&(ps=4194304),t}function po(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function gs(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Pu(t,n,a,s,c,u){var _=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var T=t.entanglements,I=t.expirationTimes,J=t.hiddenUpdates;for(a=_&~a;0<a;){var rt=31-Ln(a),xt=1<<rt;T[rt]=0,I[rt]=-1;var W=J[rt];if(W!==null)for(J[rt]=null,rt=0;rt<W.length;rt++){var at=W[rt];at!==null&&(at.lane&=-536870913)}a&=~xt}s!==0&&C(t,s,0),u!==0&&c===0&&t.tag!==0&&(t.suspendedLanes|=u&~(_&~n))}function C(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var s=31-Ln(n);t.entangledLanes|=n,t.entanglements[s]=t.entanglements[s]|1073741824|a&261930}function et(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var s=31-Ln(a),c=1<<s;c&n|t[s]&n&&(t[s]|=n),a&=~c}}function ft(t,n){var a=n&-n;return a=(a&42)!==0?1:dt(a),(a&(t.suspendedLanes|n))!==0?0:a}function dt(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function nt(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function Ut(){var t=Ot.p;return t!==0?t:(t=window.event,t===void 0?32:$_(t.type))}function kt(t,n){var a=Ot.p;try{return Ot.p=t,n()}finally{Ot.p=a}}var Wt=Math.random().toString(36).slice(2),Pt="__reactFiber$"+Wt,Jt="__reactProps$"+Wt,le="__reactContainer$"+Wt,se="__reactEvents$"+Wt,Ee="__reactListeners$"+Wt,Fe="__reactHandles$"+Wt,Je="__reactResources$"+Wt,ze="__reactMarker$"+Wt,Ue="__reactLoad$"+Wt;function re(t){delete t[Pt],delete t[Jt],delete t[Ee],delete t[Fe]}function Ie(t){var n;if(n=t[Pt])return n;for(var a=t.parentNode;a;){if(n=a[le]||a[Pt]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=L_(t);t!==null;){if(a=t[Pt])return a;t=L_(t)}return n}t=a,a=t.parentNode}return null}function Se(t){if(t=t[Pt]||t[le]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function _n(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(r(33))}function ti(t){var n=t[Je];return n||(n=t[Je]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function Le(t){t[ze]=!0}function Ca(t){t[Ue]=void 0}var Ze=new Set,Bn={};function un(t,n){sn(t,n),sn(t+"Capture",n)}function sn(t,n){for(Bn[t]=n,t=0;t<n.length;t++)Ze.add(n[t])}var On=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),tr={},Bi={};function Py(t){return Gt.call(Bi,t)?!0:Gt.call(tr,t)?!1:On.test(t)?Bi[t]=!0:(tr[t]=!0,!1)}var Oe=!1;function em(){var t=Oe;return Oe=!1,t}function bl(t,n,a){if(Py(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var s=n.toLowerCase().slice(0,5);if(s!=="data-"&&s!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,a)}}function Tl(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,a)}}function aa(t,n,a,s){if(s===null)t.removeAttribute(a);else{switch(typeof s){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,s)}}function ei(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function nm(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function zy(t,n,a){var s=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof s<"u"&&typeof s.get=="function"&&typeof s.set=="function"){var c=s.get,u=s.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return c.call(this)},set:function(_){a=""+_,u.call(this,_)}}),Object.defineProperty(t,n,{enumerable:s.enumerable}),{getValue:function(){return a},setValue:function(_){a=""+_},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function zu(t){if(!t._valueTracker){var n=nm(t)?"checked":"value";t._valueTracker=zy(t,n,""+t[n])}}function im(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),s="";return t&&(s=nm(t)?t.checked?"true":"false":t.value),t=s,t!==a?(n.setValue(t),!0):!1}var Iy=/[\n"\\]/g;function hi(t){return t.replace(Iy,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Iu(t,n,a,s,c,u,_,T){t.name="",_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"?t.type=_:t.removeAttribute("type"),n!=null?_==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+ei(n)):t.value!==""+ei(n)&&(t.value=""+ei(n)):_!=="submit"&&_!=="reset"||t.removeAttribute("value"),n!=null?_==="number"&&t.value==n?Bu(t,ei(t.value)):Bu(t,ei(n)):a!=null?Bu(t,ei(a)):s!=null&&t.removeAttribute("value"),c==null&&u!=null&&(t.defaultChecked=!!u),c!=null&&(t.checked=c&&typeof c!="function"&&typeof c!="symbol"),T!=null&&typeof T!="function"&&typeof T!="symbol"&&typeof T!="boolean"?t.name=""+ei(T):t.removeAttribute("name")}function am(t,n,a,s,c,u,_,T){if(u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(t.type=u),n!=null||a!=null){if(!(u!=="submit"&&u!=="reset"||n!=null)){zu(t);return}a=a!=null?""+ei(a):"",n=n!=null?""+ei(n):a,T||n===t.value||(t.value=n),t.defaultValue=n}s=s??c,s=typeof s!="function"&&typeof s!="symbol"&&!!s,t.checked=T?t.checked:!!s,t.defaultChecked=!!s,_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"&&(t.name=_),zu(t)}function Bu(t,n){t.defaultValue!==""+n&&(t.defaultValue=""+n)}function er(t,n,a,s){if(t=t.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<t.length;a++)c=n.hasOwnProperty("$"+t[a].value),t[a].selected!==c&&(t[a].selected=c),c&&s&&(t[a].defaultSelected=!0)}else{for(a=""+ei(a),n=null,c=0;c<t.length;c++){if(t[c].value===a){t[c].selected=!0,s&&(t[c].defaultSelected=!0);return}n!==null||t[c].disabled||(n=t[c])}n!==null&&(n.selected=!0)}}function sm(t,n,a){if(n!=null&&(n=""+ei(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+ei(a):""}function rm(t,n,a,s){if(n==null){if(s!=null){if(a!=null)throw Error(r(92));if(Et(s)){if(1<s.length)throw Error(r(93));s=s[0]}a=s}a==null&&(a=""),n=a}a=ei(n),t.defaultValue=a,s=t.textContent,s===a&&s!==""&&s!==null&&(t.value=s),zu(t)}function nr(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var By=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function om(t,n,a){var s=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?s?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":s?t.setProperty(n,a):typeof a!="number"||a===0||By.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function lm(t,n,a){if(n!=null&&typeof n!="object")throw Error(r(62));if(t=t.style,a!=null){for(var s in a)!a.hasOwnProperty(s)||n!=null&&n.hasOwnProperty(s)||(s.indexOf("--")===0?t.setProperty(s,""):s==="float"?t.cssFloat="":t[s]="",Oe=!0);for(var c in n)s=n[c],n.hasOwnProperty(c)&&a[c]!==s&&(om(t,c,s),Oe=!0)}else for(var u in n)n.hasOwnProperty(u)&&om(t,u,n[u])}function Fu(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Fy=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["maskType","mask-type"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Hy=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Al(t){return Hy.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function Fi(){}var Hu=null;function Gu(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var ir=null,ar=null;function cm(t){var n=Se(t);if(n&&(t=n.stateNode)){var a=t[Jt]||null;t:switch(t=n.stateNode,n.type){case"input":if(Iu(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+hi(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var s=a[n];if(s!==t&&s.form===t.form){var c=s[Jt]||null;if(!c)throw Error(r(90));Iu(s,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)s=a[n],s.form===t.form&&im(s)}break t;case"textarea":sm(t,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&er(t,!!a.multiple,n,!1)}}}var Vu=!1;function um(t,n,a){if(Vu)return t(n,a);Vu=!0;try{var s=t(n);return s}finally{if(Vu=!1,(ir!==null||ar!==null)&&(Ac(),ir&&(n=ir,t=ar,ar=ir=null,cm(n),t)))for(n=0;n<t.length;n++)cm(t[n])}}function mo(t,n){var a=t.stateNode;if(a===null)return null;var s=a[Jt]||null;if(s===null)return null;a=s[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(t=t.type,s=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!s;break t;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(r(231,n,typeof a));return a}var sa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ku=!1;if(sa)try{var go={};Object.defineProperty(go,"passive",{get:function(){ku=!0}}),window.addEventListener("test",go,go),window.removeEventListener("test",go,go)}catch{ku=!1}var wa=null,ju=null,Rl=null;function fm(){if(Rl)return Rl;var t,n=ju,a=n.length,s,c="value"in wa?wa.value:wa.textContent,u=c.length;for(t=0;t<a&&n[t]===c[t];t++);var _=a-t;for(s=1;s<=_&&n[a-s]===c[u-s];s++);return Rl=c.slice(t,1<s?1-s:void 0)}function Cl(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function wl(){return!0}function hm(){return!1}function Fn(t){function n(a,s,c,u,_){this._reactName=a,this._targetInst=c,this.type=s,this.nativeEvent=u,this.target=_,this.currentTarget=null;for(var T in t)t.hasOwnProperty(T)&&(a=t[T],this[T]=a?a(u):u[T]);return this.isDefaultPrevented=(u.defaultPrevented!=null?u.defaultPrevented:u.returnValue===!1)?wl:hm,this.isPropagationStopped=hm,this}return B(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=wl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=wl)},persist:function(){},isPersistent:wl}),n}var Da={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Dl=Fn(Da),_o=B({},Da,{view:0,detail:0}),Gy=Fn(_o),Xu,Yu,vo,Nl=B({},_o,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Wu,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==vo&&(vo&&t.type==="mousemove"?(Xu=t.screenX-vo.screenX,Yu=t.screenY-vo.screenY):Yu=Xu=0,vo=t),Xu)},movementY:function(t){return"movementY"in t?t.movementY:Yu}}),dm=Fn(Nl),Vy=B({},Nl,{dataTransfer:0}),ky=Fn(Vy),jy=B({},_o,{relatedTarget:0}),qu=Fn(jy),Xy=B({},Da,{animationName:0,elapsedTime:0,pseudoElement:0}),Yy=Fn(Xy),qy=B({},Da,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Wy=Fn(qy),Zy=B({},Da,{data:0}),pm=Fn(Zy),Ky={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Qy={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Jy={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function $y(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=Jy[t])?!!n[t]:!1}function Wu(){return $y}var tS=B({},_o,{key:function(t){if(t.key){var n=Ky[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=Cl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Qy[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Wu,charCode:function(t){return t.type==="keypress"?Cl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Cl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),eS=Fn(tS),nS=B({},Nl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),mm=Fn(nS),iS=B({},Da,{submitter:0}),aS=Fn(iS),sS=B({},_o,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Wu}),rS=Fn(sS),oS=B({},Da,{propertyName:0,elapsedTime:0,pseudoElement:0}),lS=Fn(oS),cS=B({},Nl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),uS=Fn(cS),fS=B({},Da,{newState:0,oldState:0,source:0}),hS=Fn(fS),dS=[9,13,27,32],Zu=sa&&"CompositionEvent"in window,xo=null;sa&&"documentMode"in document&&(xo=document.documentMode);var pS=sa&&"TextEvent"in window&&!xo,gm=sa&&(!Zu||xo&&8<xo&&11>=xo),_m=" ",vm=!1;function xm(t,n){switch(t){case"keyup":return dS.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ym(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var sr=!1;function mS(t,n){switch(t){case"compositionend":return ym(n);case"keypress":return n.which!==32?null:(vm=!0,_m);case"textInput":return t=n.data,t===_m&&vm?null:t;default:return null}}function gS(t,n){if(sr)return t==="compositionend"||!Zu&&xm(t,n)?(t=fm(),Rl=ju=wa=null,sr=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return gm&&n.locale!=="ko"?null:n.data;default:return null}}var _S={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Sm(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!_S[t.type]:n==="textarea"}function Mm(t,n,a,s){ir?ar?ar.push(s):ar=[s]:ir=s,n=Uc(n,"onChange"),0<n.length&&(a=new Dl("onChange","change",null,a,s),t.push({event:a,listeners:n}))}var yo=null,So=null;function vS(t){c_(t,0)}function Ul(t){var n=_n(t);if(im(n))return t}function Em(t,n){if(t==="change")return n}var bm=!1;if(sa){var Ku;if(sa){var Qu="oninput"in document;if(!Qu){var Tm=document.createElement("div");Tm.setAttribute("oninput","return;"),Qu=typeof Tm.oninput=="function"}Ku=Qu}else Ku=!1;bm=Ku&&(!document.documentMode||9<document.documentMode)}function Am(){yo&&(yo.detachEvent("onpropertychange",Rm),So=yo=null)}function Rm(t){if(t.propertyName==="value"&&Ul(So)){var n=[];Mm(n,So,t,Gu(t)),um(vS,n)}}function xS(t,n,a){t==="focusin"?(Am(),yo=n,So=a,yo.attachEvent("onpropertychange",Rm)):t==="focusout"&&Am()}function yS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Ul(So)}function SS(t,n){if(t==="click")return Ul(n)}function MS(t,n){if(t==="input"||t==="change")return Ul(n)}function ES(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var ni=typeof Object.is=="function"?Object.is:ES;function Mo(t,n){if(ni(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),s=Object.keys(n);if(a.length!==s.length)return!1;for(s=0;s<a.length;s++){var c=a[s];if(!Gt.call(n,c)||!ni(t[c],n[c]))return!1}return!0}function Ju(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Cm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function wm(t,n){var a=Cm(t);t=0;for(var s;a;){if(a.nodeType===3){if(s=t+a.textContent.length,t<=n&&s>=n)return{node:a,offset:n-t};t=s}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=Cm(a)}}function Dm(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?Dm(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function Nm(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=Ju(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=Ju(t.document)}return n}function $u(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var bS=sa&&"documentMode"in document&&11>=document.documentMode,rr=null,tf=null,Eo=null,ef=!1;function Um(t,n,a){var s=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;ef||rr==null||rr!==Ju(s)||(s=rr,"selectionStart"in s&&$u(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),Eo&&Mo(Eo,s)||(Eo=s,s=Uc(tf,"onSelect"),0<s.length&&(n=new Dl("onSelect","select",null,n,a),t.push({event:n,listeners:s}),n.target=rr)))}function _s(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var or={animationend:_s("Animation","AnimationEnd"),animationiteration:_s("Animation","AnimationIteration"),animationstart:_s("Animation","AnimationStart"),transitionrun:_s("Transition","TransitionRun"),transitionstart:_s("Transition","TransitionStart"),transitioncancel:_s("Transition","TransitionCancel"),transitionend:_s("Transition","TransitionEnd")},nf={},Lm={};sa&&(Lm=document.createElement("div").style,"AnimationEvent"in window||(delete or.animationend.animation,delete or.animationiteration.animation,delete or.animationstart.animation),"TransitionEvent"in window||delete or.transitionend.transition);function vs(t){if(nf[t])return nf[t];if(!or[t])return t;var n=or[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in Lm)return nf[t]=n[a];return t}var Om=vs("animationend"),Pm=vs("animationiteration"),zm=vs("animationstart"),TS=vs("transitionrun"),AS=vs("transitionstart"),RS=vs("transitioncancel"),Im=vs("transitionend"),Bm=new Map,af="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");af.push("scrollEnd");function Ti(t,n){Bm.set(t,n),un(n,[t])}var CS=0;function ra(t,n){if(t.name!=null&&t.name!=="auto")return t.name;if(n.autoName!==null)return n.autoName;t=wi.identifierPrefix;var a=CS++;return t="_"+t+"t_"+a.toString(32)+"_",n.autoName=t}function Fm(t){if(t==null||typeof t=="string")return t;var n=null,a=Rr;if(a!==null)for(var s=0;s<a.length;s++){var c=t[a[s]];if(c!=null){if(c==="none")return"none";n=n==null?c:n+(" "+c)}}return n??t.default}function oa(t,n){return t=Fm(t),n=Fm(n),n==null?t==="auto"?null:t:n==="auto"?null:n}var Ll=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},di=[],lr=0,sf=0;function Ol(){for(var t=lr,n=sf=lr=0;n<t;){var a=di[n];di[n++]=null;var s=di[n];di[n++]=null;var c=di[n];di[n++]=null;var u=di[n];if(di[n++]=null,s!==null&&c!==null){var _=s.pending;_===null?c.next=c:(c.next=_.next,_.next=c),s.pending=c}u!==0&&Hm(a,c,u)}}function Pl(t,n,a,s){di[lr++]=t,di[lr++]=n,di[lr++]=a,di[lr++]=s,sf|=s,t.lanes|=s,t=t.alternate,t!==null&&(t.lanes|=s)}function rf(t,n,a,s){return Pl(t,n,a,s),zl(t)}function xs(t,n){return Pl(t,null,null,n),zl(t)}function Hm(t,n,a){t.lanes|=a;var s=t.alternate;s!==null&&(s.lanes|=a);for(var c=!1,u=t.return;u!==null;)u.childLanes|=a,s=u.alternate,s!==null&&(s.childLanes|=a),u.tag===22&&(t=u.stateNode,t===null||t._visibility&1||(c=!0)),t=u,u=u.return;return t.tag===3?(u=t.stateNode,c&&n!==null&&(c=31-Ln(a),t=u.hiddenUpdates,s=t[c],s===null?t[c]=[n]:s.push(n),n.lane=a|536870912),u):null}function zl(t){if(50<Xo)throw Xo=0,Tc=null,Error(r(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var cr={};function wS(t,n,a,s){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Xn(t,n,a,s){return new wS(t,n,a,s)}function of(t){return t=t.prototype,!(!t||!t.isReactComponent)}function la(t,n){var a=t.alternate;return a===null?(a=Xn(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&1206910976,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function Gm(t,n){t.flags&=1206910978;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function Il(t,n,a,s,c,u){var _=0;if(s=t,typeof s=="function")of(s)&&(_=1);else if(typeof s=="string")_=iE(t,a,Rt.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(s){case Yt:return t=Xn(31,a,n,c),t.elementType=Yt,t.lanes=u,t;case X:return ys(a.children,c,u,n);case lt:_=8,c|=24;break;case gt:return t=Xn(12,a,n,c|2),t.elementType=gt,t.lanes=u,t;case ct:return t=Xn(13,a,n,c),t.elementType=ct,t.lanes=u,t;case Q:return t=Xn(19,a,n,c),t.elementType=Q,t.lanes=u,t;case oe:case U:return t=c|32,t=Xn(30,a,n,t),t.elementType=U,t.lanes=u,t.stateNode={autoName:null,paired:null,clones:null,ref:null},t;default:if(typeof s=="object"&&s!==null)switch(s.$$typeof){case mt:_=10;break t;case Mt:_=9;break t;case Z:_=11;break t;case Tt:_=14;break t;case At:_=16,s=null;break t}_=29,a=Error(r(130,t===null?"null":typeof t,"")),s=null}return n=Xn(_,a,n,c),n.elementType=t,n.type=s,n.lanes=u,n}function ys(t,n,a,s){return t=Xn(7,t,s,n),t.lanes=a,t}function lf(t,n,a){return t=Xn(6,t,null,n),t.lanes=a,t}function Vm(t){var n=Xn(18,null,null,0);return n.stateNode=t,n}function cf(t,n,a){return n=Xn(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var km=new WeakMap;function pi(t,n){if(typeof t=="object"&&t!==null){var a=km.get(t);return a!==void 0?a:(n={value:t,source:n,stack:Dt(n)},km.set(t,n),n)}return{value:t,source:n,stack:Dt(n)}}var ur=[],fr=0,Bl=null,bo=0,mi=[],gi=0,Na=null,Hi=1,Gi="";function ca(t,n){ur[fr++]=bo,ur[fr++]=Bl,Bl=t,bo=n}function jm(t,n,a){mi[gi++]=Hi,mi[gi++]=Gi,mi[gi++]=Na,Na=t;var s=Hi;t=Gi;var c=32-Ln(s)-1;s&=~(1<<c),a+=1;var u=32-Ln(n)+c;if(30<u){var _=c-c%5;u=(s&(1<<_)-1).toString(32),s>>=_,c-=_,Hi=1<<32-Ln(n)+c|a<<c|s,Gi=u+t}else Hi=1<<u|a<<c|s,Gi=t}function Fl(t){t.return!==null&&(ca(t,1),jm(t,1,0))}function uf(t){for(;t===Bl;)Bl=ur[--fr],ur[fr]=null,bo=ur[--fr],ur[fr]=null;for(;t===Na;)Na=mi[--gi],mi[gi]=null,Gi=mi[--gi],mi[gi]=null,Hi=mi[--gi],mi[gi]=null}function Xm(t,n){mi[gi++]=Hi,mi[gi++]=Gi,mi[gi++]=Na,Hi=n.id,Gi=n.overflow,Na=t}var Mn=null,Ke=null,Me=!1,Ua=null,_i=!1,ff=Error(r(519));function La(t){var n=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw To(pi(n,t)),ff}function Ym(t){var n=t.stateNode,a=t.type,s=t.memoizedProps;switch(n[Pt]=t,n[Jt]=s,a){case"dialog":Ae("cancel",n),Ae("close",n);break;case"iframe":case"object":case"embed":Ae("load",n);break;case"video":case"audio":for(a=0;a<qo.length;a++)Ae(qo[a],n);break;case"source":Ae("error",n);break;case"img":case"image":case"link":Ae("error",n),Ae("load",n);break;case"details":Ae("toggle",n);break;case"input":Ae("invalid",n),am(n,s.value,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name,!0);break;case"select":Ae("invalid",n);break;case"textarea":Ae("invalid",n),rm(n,s.value,s.defaultValue,s.children)}a=s.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||s.suppressHydrationWarning===!0||d_(n.textContent,a)?(s.popover!=null&&(Ae("beforetoggle",n),Ae("toggle",n)),s.onScroll!=null&&Ae("scroll",n),s.onScrollEnd!=null&&Ae("scrollend",n),s.onClick!=null&&(n.onclick=Fi),n=!0):n=!1,n||La(t,!0)}function Hl(t){for(Mn=t.return;Mn;)switch(Mn.tag){case 5:case 31:case 13:_i=!1;return;case 27:case 3:_i=!0;return;default:Mn=Mn.return}}function hr(t){if(t!==Mn)return!1;if(!Me)return Hl(t),Me=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||Gh(t.type,t.memoizedProps)),a=!a),a&&Ke&&La(t),Hl(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Ke=U_(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Ke=U_(t)}else n===27?(n=Ke,Za(t.type)?(t=Kh,Kh=null,Ke=t):Ke=n):Ke=Mn?xi(t.stateNode.nextSibling):null;return!0}function Ss(){Ke=Mn=null,Me=!1}function hf(){var t=Ua;return t!==null&&(Wn===null?Wn=t:Wn.push.apply(Wn,t),Ua=null),t}function To(t){Ua===null?Ua=[t]:Ua.push(t)}var df=Nt(null),Ms=null,ua=null;function Oa(t,n,a){It(df,n._currentValue),n._currentValue=a}function fa(t){t._currentValue=df.current,yt(df)}function Gl(t,n,a){for(;t!==null;){var s=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,s!==null&&(s.childLanes|=n)):s!==null&&(s.childLanes&n)!==n&&(s.childLanes|=n),t===a)break;t=t.return}}function pf(t,n,a,s){var c=t.child;for(c!==null&&(c.return=t);c!==null;){var u=c.dependencies;if(u!==null){var _=c.child;u=u.firstContext;t:for(;u!==null;){var T=u;u=c;for(var I=0;I<n.length;I++)if(T.context===n[I]){u.lanes|=a,T=u.alternate,T!==null&&(T.lanes|=a),Gl(u.return,a,t),s||(_=null);break t}u=T.next}}else if(c.tag===18){if(_=c.return,_===null)throw Error(r(341));_.lanes|=a,u=_.alternate,u!==null&&(u.lanes|=a),Gl(_,a,t),_=null}else c.tag===13&&c.memoizedState!==null&&c.memoizedState.dehydrated===null?(c.lanes|=a,_=c.alternate,_!==null&&(_.lanes|=a),Gl(c.return,a,t),_=c.child,_=_!==null?_.sibling:null):_=c.child;if(_!==null)_.return=c;else for(_=c;_!==null;){if(_===t){_=null;break}if(c=_.sibling,c!==null){c.return=_.return,_=c;break}_=_.return}c=_}}function Es(t,n,a,s){t=null;for(var c=n,u=!1;c!==null;){if(!u){if((c.flags&524288)!==0)u=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var _=c.alternate;if(_===null)throw Error(r(387));if(_=_.memoizedProps,_!==null){var T=c.type;ni(c.pendingProps.value,_.value)||(t!==null?t.push(T):t=[T])}}else if(c===he.current){if(_=c.alternate,_===null)throw Error(r(387));_.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(t!==null?t.push(Ir):t=[Ir])}c=c.return}return t!==null&&pf(n,t,a,s),n.flags|=262144,t!==null}function Vl(t){for(t=t.firstContext;t!==null;){if(!ni(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function bs(t){Ms=t,ua=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function An(t){return qm(Ms,t)}function kl(t,n){return Ms===null&&bs(t),qm(t,n)}function qm(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},ua===null){if(t===null)throw Error(r(308));ua=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else ua=ua.next=n;return a}var DS=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,s){t.push(s)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},NS=o.unstable_scheduleCallback,US=o.unstable_NormalPriority,fn={$$typeof:mt,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function mf(){return{controller:new DS,data:new Map,refCount:0}}function Ao(t){t.refCount--,t.refCount===0&&NS(US,function(){t.controller.abort()})}function Wm(t,n){if((t.pendingLanes&4194048)!==0){var a=t.transitionTypes;for(a===null&&(a=t.transitionTypes=[]),t=0;t<n.length;t++){var s=n[t];a.indexOf(s)===-1&&a.push(s)}}}var Ro=null;function LS(t){var n=t.transitionTypes;return t.transitionTypes=null,n}var Co=null,gf=0,Ts=0,dr=null;function OS(t,n){if(Co===null){var a=Co=[];gf=0,Ts=Uh(),dr={status:"pending",value:void 0,then:function(s){a.push(s)}}}return gf++,n.then(Zm,Zm),n}function Zm(){if(--gf===0&&(Ro=null,Co!==null)){dr!==null&&(dr.status="fulfilled");var t=Co;Co=null,Ts=0,dr=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function PS(t,n){var a=[],s={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return t.then(function(){s.status="fulfilled",s.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(s.status="rejected",s.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),s}var Km=ut.S;ut.S=function(t,n){if(Vg=j(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&OS(t,n),Ro!==null)for(var a=Nr;a!==null;)Wm(a,Ro),a=a.next;if(a=t.types,a!==null){for(var s=Nr;s!==null;)Wm(s,a),s=s.next;if(Ts!==0){s=Ro,s===null&&(s=Ro=[]);for(var c=0;c<a.length;c++){var u=a[c];s.indexOf(u)===-1&&s.push(u)}}}Km!==null&&Km(t,n)};var As=Nt(null);function _f(){var t=As.current;return t!==null?t:We.pooledCache}function jl(t,n){n===null?It(As,As.current):It(As,n.pool)}function Qm(){var t=_f();return t===null?null:{parent:fn._currentValue,pool:t}}var pr=Error(r(460)),vf=Error(r(474)),Xl=Error(r(542)),Yl={then:function(){}};function Jm(t){return t=t.status,t==="fulfilled"||t==="rejected"}function $m(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(Fi,Fi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,e0(t),t===void 0&&!("reason"in n)?Error(r(600)):t;default:if(typeof n.status=="string")n.then(Fi,Fi);else{if(t=We,t!==null&&100<t.shellSuspendCounter)throw Error(r(482));t=n,t.status="pending",t.then(function(s){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=s}},function(s){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=s}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,e0(t),t}throw Cs=n,pr}}function Rs(t){try{var n=t._init;return n(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(Cs=a,pr):a}}var Cs=null;function t0(){if(Cs===null)throw Error(r(459));var t=Cs;return Cs=null,t}function e0(t){if(t===pr||t===Xl)throw Error(r(483))}var mr=null,wo=0;function ql(t){var n=wo;return wo+=1,mr===null&&(mr=[]),$m(mr,t,n)}function Pa(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function Wl(t,n){throw n.$$typeof===q?Error(r(525)):(t=Object.prototype.toString.call(n),Error(r(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function n0(t){function n(K,k){if(t){var it=K.deletions;it===null?(K.deletions=[k],K.flags|=16):it.push(k)}}function a(K,k){if(!t)return null;for(;k!==null;)n(K,k),k=k.sibling;return null}function s(K){for(var k=new Map;K!==null;)K.key===null?k.set(K.index,K):k.set(K.key,K),K=K.sibling;return k}function c(K,k){return K=la(K,k),K.index=0,K.sibling=null,K}function u(K,k,it){return K.index=it,t?(it=K.alternate,it!==null?(it=it.index,it<k?(K.flags|=2,k):it):(K.flags|=134217730,k)):(K.flags|=1048576,k)}function _(K){return t&&K.alternate===null&&(K.flags|=134217730),K}function T(K,k,it,vt){return k===null||k.tag!==6?(k=lf(it,K.mode,vt),k.return=K,k):(k=c(k,it),k.return=K,k)}function I(K,k,it,vt){var Kt=it.type;return Kt===X?(K=rt(K,k,it.props.children,vt,it.key),Pa(K,it),K):k!==null&&(k.elementType===Kt||typeof Kt=="object"&&Kt!==null&&Kt.$$typeof===At&&Rs(Kt)===k.type)?(k=c(k,it.props),Pa(k,it),k.return=K,k):(k=Il(it.type,it.key,it.props,null,K.mode,vt),Pa(k,it),k.return=K,k)}function J(K,k,it,vt){return k===null||k.tag!==4||k.stateNode.containerInfo!==it.containerInfo||k.stateNode.implementation!==it.implementation?(k=cf(it,K.mode,vt),k.return=K,k):(k=c(k,it.children||[]),k.return=K,k)}function rt(K,k,it,vt,Kt){return k===null||k.tag!==7?(k=ys(it,K.mode,vt,Kt),k.return=K,k):(k=c(k,it),k.return=K,k)}function xt(K,k,it){if(typeof k=="string"&&k!==""||typeof k=="number"||typeof k=="bigint")return k=lf(""+k,K.mode,it),k.return=K,k;if(typeof k=="object"&&k!==null){switch(k.$$typeof){case N:return it=Il(k.type,k.key,k.props,null,K.mode,it),Pa(it,k),it.return=K,it;case D:return k=cf(k,K.mode,it),k.return=K,k;case At:return k=Rs(k),xt(K,k,it)}if(Et(k)||F(k))return k=ys(k,K.mode,it,null),k.return=K,k;if(typeof k.then=="function")return xt(K,ql(k),it);if(k.$$typeof===mt)return xt(K,kl(K,k),it);Wl(K,k)}return null}function W(K,k,it,vt){var Kt=k!==null?k.key:null;if(typeof it=="string"&&it!==""||typeof it=="number"||typeof it=="bigint")return Kt!==null?null:T(K,k,""+it,vt);if(typeof it=="object"&&it!==null){switch(it.$$typeof){case N:return it.key===Kt?I(K,k,it,vt):null;case D:return it.key===Kt?J(K,k,it,vt):null;case At:return it=Rs(it),W(K,k,it,vt)}if(Et(it)||F(it))return Kt!==null?null:rt(K,k,it,vt,null);if(typeof it.then=="function")return W(K,k,ql(it),vt);if(it.$$typeof===mt)return W(K,k,kl(K,it),vt);Wl(K,it)}return null}function at(K,k,it,vt,Kt){if(typeof vt=="string"&&vt!==""||typeof vt=="number"||typeof vt=="bigint")return K=K.get(it)||null,T(k,K,""+vt,Kt);if(typeof vt=="object"&&vt!==null){switch(vt.$$typeof){case N:return K=K.get(vt.key===null?it:vt.key)||null,I(k,K,vt,Kt);case D:return K=K.get(vt.key===null?it:vt.key)||null,J(k,K,vt,Kt);case At:return vt=Rs(vt),at(K,k,it,vt,Kt)}if(Et(vt)||F(vt))return K=K.get(it)||null,rt(k,K,vt,Kt,null);if(typeof vt.then=="function")return at(K,k,it,ql(vt),Kt);if(vt.$$typeof===mt)return at(K,k,it,kl(k,vt),Kt);Wl(k,vt)}return null}function Bt(K,k,it,vt){for(var Kt=null,De=null,ae=k,ue=k=0,pn=null;ae!==null&&ue<it.length;ue++){ae.index>ue?(pn=ae,ae=null):pn=ae.sibling;var Ne=W(K,ae,it[ue],vt);if(Ne===null){ae===null&&(ae=pn);break}t&&ae&&Ne.alternate===null&&n(K,ae),k=u(Ne,k,ue),De===null?Kt=Ne:De.sibling=Ne,De=Ne,ae=pn}if(ue===it.length)return a(K,ae),Me&&ca(K,ue),Kt;if(ae===null){for(;ue<it.length;ue++)ae=xt(K,it[ue],vt),ae!==null&&(k=u(ae,k,ue),De===null?Kt=ae:De.sibling=ae,De=ae);return Me&&ca(K,ue),Kt}for(ae=s(ae);ue<it.length;ue++)pn=at(ae,K,ue,it[ue],vt),pn!==null&&(t&&(Ne=pn.alternate,Ne!==null&&ae.delete(Ne.key===null?ue:Ne.key)),k=u(pn,k,ue),De===null?Kt=pn:De.sibling=pn,De=pn);return t&&ae.forEach(function(ts){return n(K,ts)}),Me&&ca(K,ue),Kt}function $t(K,k,it,vt){if(it==null)throw Error(r(151));for(var Kt=null,De=null,ae=k,ue=k=0,pn=null,Ne=it.next();ae!==null&&!Ne.done;ue++,Ne=it.next()){ae.index>ue?(pn=ae,ae=null):pn=ae.sibling;var ts=W(K,ae,Ne.value,vt);if(ts===null){ae===null&&(ae=pn);break}t&&ae&&ts.alternate===null&&n(K,ae),k=u(ts,k,ue),De===null?Kt=ts:De.sibling=ts,De=ts,ae=pn}if(Ne.done)return a(K,ae),Me&&ca(K,ue),Kt;if(ae===null){for(;!Ne.done;ue++,Ne=it.next())Ne=xt(K,Ne.value,vt),Ne!==null&&(k=u(Ne,k,ue),De===null?Kt=Ne:De.sibling=Ne,De=Ne);return Me&&ca(K,ue),Kt}for(ae=s(ae);!Ne.done;ue++,Ne=it.next())Ne=at(ae,K,ue,Ne.value,vt),Ne!==null&&(t&&(pn=Ne.alternate,pn!==null&&ae.delete(pn.key===null?ue:pn.key)),k=u(Ne,k,ue),De===null?Kt=Ne:De.sibling=Ne,De=Ne);return t&&ae.forEach(function(mE){return n(K,mE)}),Me&&ca(K,ue),Kt}function ve(K,k,it,vt){if(typeof it=="object"&&it!==null&&it.type===X&&it.key===null&&it.props.ref===void 0&&(it=it.props.children),typeof it=="object"&&it!==null){switch(it.$$typeof){case N:t:{for(var Kt=it.key;k!==null;){if(k.key===Kt){if(Kt=it.type,Kt===X){if(k.tag===7){a(K,k.sibling),vt=c(k,it.props.children),Pa(vt,it),vt.return=K,K=vt;break t}}else if(k.elementType===Kt||typeof Kt=="object"&&Kt!==null&&Kt.$$typeof===At&&Rs(Kt)===k.type){a(K,k.sibling),vt=c(k,it.props),Pa(vt,it),vt.return=K,K=vt;break t}a(K,k);break}else n(K,k);k=k.sibling}it.type===X?(vt=ys(it.props.children,K.mode,vt,it.key),Pa(vt,it),vt.return=K,K=vt):(vt=Il(it.type,it.key,it.props,null,K.mode,vt),Pa(vt,it),vt.return=K,K=vt)}return _(K);case D:t:{for(Kt=it.key;k!==null;){if(k.key===Kt)if(k.tag===4&&k.stateNode.containerInfo===it.containerInfo&&k.stateNode.implementation===it.implementation){a(K,k.sibling),vt=c(k,it.children||[]),vt.return=K,K=vt;break t}else{a(K,k);break}else n(K,k);k=k.sibling}vt=cf(it,K.mode,vt),vt.return=K,K=vt}return _(K);case At:return it=Rs(it),ve(K,k,it,vt)}if(Et(it))return Bt(K,k,it,vt);if(F(it)){if(Kt=F(it),typeof Kt!="function")throw Error(r(150));return it=Kt.call(it),$t(K,k,it,vt)}if(typeof it.then=="function")return ve(K,k,ql(it),vt);if(it.$$typeof===mt)return ve(K,k,kl(K,it),vt);Wl(K,it)}return typeof it=="string"&&it!==""||typeof it=="number"||typeof it=="bigint"?(it=""+it,k!==null&&k.tag===6?(a(K,k.sibling),vt=c(k,it),vt.return=K,K=vt):(a(K,k),vt=lf(it,K.mode,vt),vt.return=K,K=vt),_(K)):a(K,k)}return function(K,k,it,vt){try{wo=0;var Kt=ve(K,k,it,vt);return mr=null,Kt}catch(ae){if(ae===pr||ae===Xl)throw ae;var De=Xn(29,ae,null,K.mode);return De.lanes=vt,De.return=K,De}finally{}}}var ws=n0(!0),i0=n0(!1),za=!1;function xf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function yf(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Ia(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Ba(t,n,a){var s=t.updateQueue;if(s===null)return null;if(s=s.shared,(Be&2)!==0){var c=s.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),s.pending=n,n=zl(t),Hm(t,null,a),n}return Pl(t,s,n,a),zl(t)}function Do(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,et(t,a)}}function Sf(t,n){var a=t.updateQueue,s=t.alternate;if(s!==null&&(s=s.updateQueue,a===s)){var c=null,u=null;if(a=a.firstBaseUpdate,a!==null){do{var _={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};u===null?c=u=_:u=u.next=_,a=a.next}while(a!==null);u===null?c=u=n:u=u.next=n}else c=u=n;a={baseState:s.baseState,firstBaseUpdate:c,lastBaseUpdate:u,shared:s.shared,callbacks:s.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var Mf=!1;function No(){if(Mf){var t=dr;if(t!==null)throw t}}function Uo(t,n,a,s){Mf=!1;var c=t.updateQueue;za=!1;var u=c.firstBaseUpdate,_=c.lastBaseUpdate,T=c.shared.pending;if(T!==null){c.shared.pending=null;var I=T,J=I.next;I.next=null,_===null?u=J:_.next=J,_=I;var rt=t.alternate;rt!==null&&(rt=rt.updateQueue,T=rt.lastBaseUpdate,T!==_&&(T===null?rt.firstBaseUpdate=J:T.next=J,rt.lastBaseUpdate=I))}if(u!==null){var xt=c.baseState;_=0,rt=J=I=null,T=u;do{var W=T.lane&-536870913,at=W!==T.lane;if(at?(we&W)===W:(s&W)===W){W!==0&&W===Ts&&(Mf=!0),rt!==null&&(rt=rt.next={lane:0,tag:T.tag,payload:T.payload,callback:null,next:null});t:{var Bt=t,$t=T;W=n;var ve=a;switch($t.tag){case 1:if(Bt=$t.payload,typeof Bt=="function"){xt=Bt.call(ve,xt,W);break t}xt=Bt;break t;case 3:Bt.flags=Bt.flags&-65537|128;case 0:if(Bt=$t.payload,W=typeof Bt=="function"?Bt.call(ve,xt,W):Bt,W==null)break t;xt=B({},xt,W);break t;case 2:za=!0}}W=T.callback,W!==null&&(t.flags|=64,at&&(t.flags|=8192),at=c.callbacks,at===null?c.callbacks=[W]:at.push(W))}else at={lane:W,tag:T.tag,payload:T.payload,callback:T.callback,next:null},rt===null?(J=rt=at,I=xt):rt=rt.next=at,_|=W;if(T=T.next,T===null){if(T=c.shared.pending,T===null)break;at=T,T=at.next,at.next=null,c.lastBaseUpdate=at,c.shared.pending=null}}while(!0);rt===null&&(I=xt),c.baseState=I,c.firstBaseUpdate=J,c.lastBaseUpdate=rt,u===null&&(c.shared.lanes=0),Xa|=_,t.lanes=_,t.memoizedState=xt}}function a0(t,n){if(typeof t!="function")throw Error(r(191,t));t.call(n)}function s0(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)a0(a[t],n)}var Fa=Nt(null),Zl=Nt(0);function r0(t,n){t=ga,It(Zl,t),It(Fa,n),ga=t|n.baseLanes}function Ef(){It(Zl,ga),It(Fa,Fa.current)}function bf(){ga=Zl.current,yt(Fa),yt(Zl)}var Rn=Nt(null),Pn=null;function Ha(t){var n=t.alternate;It(Cn,Cn.current&1),It(Rn,t),Pn===null&&(n===null||Fa.current!==null||n.memoizedState!==null)&&(Pn=t)}function Tf(t){It(Cn,Cn.current),It(Rn,t),Pn===null&&(Pn=t)}function o0(t){t.tag===22?(It(Cn,Cn.current),It(Rn,t),Pn===null&&(Pn=t)):Ga()}function Ga(){It(Cn,Cn.current),It(Rn,Rn.current)}function ii(t){yt(Rn),Pn===t&&(Pn=null),yt(Cn)}var Cn=Nt(0);function Lo(t,n){It(Rn,Rn.current),It(Cn,n)}function Af(t){yt(Cn),yt(Rn),Pn===t&&(Pn=null)}function Kl(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||Wh(a)||Zh(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!=="independent"){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var ha=0,_e=null,Xe=null,hn=null,Ql=!1,gr=!1,Ds=!1,Jl=0,Oo=0,_r=null,zS=0;function rn(){throw Error(r(321))}function Rf(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!ni(t[a],n[a]))return!1;return!0}function Cf(t,n,a,s,c,u){return ha=u,_e=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,ut.H=t===null||t.memoizedState===null?j0:X0,Ds=!1,u=a(s,c),Ds=!1,gr&&(u=c0(n,a,s,c)),l0(t),u}function l0(t){ut.H=sc;var n=Xe!==null&&Xe.next!==null;if(ha=0,hn=Xe=_e=null,Ql=!1,Oo=0,_r=null,n)throw Error(r(300));t===null||dn||(t=t.dependencies,t!==null&&Vl(t)&&(dn=!0))}function c0(t,n,a,s){_e=t;var c=0;do{if(gr&&(_r=null),Oo=0,gr=!1,25<=c)throw Error(r(301));if(c+=1,hn=Xe=null,t.updateQueue!=null){var u=t.updateQueue;u.lastEffect=null,u.events=null,u.stores=null,u.memoCache!=null&&(u.memoCache.index=0)}ut.H=jS,u=n(a,s)}while(gr);return u}function IS(){var t=ut.H,n=t.useState()[0];return n=typeof n.then=="function"?Po(n):n,t=t.useState()[0],(Xe!==null?Xe.memoizedState:null)!==t&&(_e.flags|=1024),n}function wf(){var t=Jl!==0;return Jl=0,t}function Df(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function Nf(t){if(Ql){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}Ql=!1}ha=0,hn=Xe=_e=null,gr=!1,Oo=Jl=0,_r=null}function Hn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return hn===null?_e.memoizedState=hn=t:hn=hn.next=t,hn}function cn(){if(Xe===null){var t=_e.alternate;t=t!==null?t.memoizedState:null}else t=Xe.next;var n=hn===null?_e.memoizedState:hn.next;if(n!==null)hn=n,Xe=t;else{if(t===null)throw _e.alternate===null?Error(r(467)):Error(r(310));Xe=t,t={memoizedState:Xe.memoizedState,baseState:Xe.baseState,baseQueue:Xe.baseQueue,queue:Xe.queue,next:null},hn===null?_e.memoizedState=hn=t:hn=hn.next=t}return hn}function $l(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Po(t){var n=Oo;return Oo+=1,_r===null&&(_r=[]),t=$m(_r,t,n),n=_e,(hn===null?n.memoizedState:hn.next)===null&&(n=n.alternate,ut.H=n===null||n.memoizedState===null?j0:X0),t}function tc(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Po(t);if(t.$$typeof===tt)return;if(t.$$typeof===mt)return An(t)}throw Error(r(438,String(t)))}function Uf(t){var n=null,a=_e.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var s=_e.alternate;s!==null&&(s=s.updateQueue,s!==null&&(s=s.memoCache,s!=null&&(n={data:s.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=$l(),_e.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),s=0;s<t;s++)a[s]=Ct;return n.index++,a}function da(t,n){return typeof n=="function"?n(t):n}function ec(t){var n=cn();return Lf(n,Xe,t)}function Lf(t,n,a){var s=t.queue;if(s===null)throw Error(r(311));s.lastRenderedReducer=a;var c=t.baseQueue,u=s.pending;if(u!==null){if(c!==null){var _=c.next;c.next=u.next,u.next=_}n.baseQueue=c=u,s.pending=null}if(u=t.baseState,c===null)t.memoizedState=u;else{n=c.next;var T=_=null,I=null,J=n,rt=!1;do{var xt=J.lane&-536870913;if(xt!==J.lane?(we&xt)===xt:(ha&xt)===xt){var W=J.revertLane;if(W===0)I!==null&&(I=I.next={lane:0,revertLane:0,gesture:null,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null}),xt===Ts&&(rt=!0);else if((ha&W)===W){J=J.next,W===Ts&&(rt=!0);continue}else xt={lane:0,revertLane:J.revertLane,gesture:null,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null},I===null?(T=I=xt,_=u):I=I.next=xt,_e.lanes|=W,Xa|=W;xt=J.action,Ds&&a(u,xt),u=J.hasEagerState?J.eagerState:a(u,xt)}else W={lane:xt,revertLane:J.revertLane,gesture:J.gesture,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null},I===null?(T=I=W,_=u):I=I.next=W,_e.lanes|=xt,Xa|=xt;J=J.next}while(J!==null&&J!==n);if(I===null?_=u:I.next=T,!ni(u,t.memoizedState)&&(dn=!0,rt&&(a=dr,a!==null)))throw a;t.memoizedState=u,t.baseState=_,t.baseQueue=I,s.lastRenderedState=u}return c===null&&(s.lanes=0),[t.memoizedState,s.dispatch]}function Of(t){var n=cn(),a=n.queue;if(a===null)throw Error(r(311));a.lastRenderedReducer=t;var s=a.dispatch,c=a.pending,u=n.memoizedState;if(c!==null){a.pending=null;var _=c=c.next;do u=t(u,_.action),_=_.next;while(_!==c);ni(u,n.memoizedState)||(dn=!0),n.memoizedState=u,n.baseQueue===null&&(n.baseState=u),a.lastRenderedState=u}return[u,s]}function u0(t,n,a){var s=_e,c=cn(),u=Me;if(u){if(a===void 0)throw Error(r(407));a=a()}else a=n();var _=!ni((Xe||c).memoizedState,a);if(_&&(c.memoizedState=a,dn=!0),c=c.queue,If(d0.bind(null,s,c,t),[t]),t=c.getSnapshot!==n||_||hn!==null&&(hn.memoizedState.tag&1)!==0,vr(t?9:8,{destroy:void 0},h0.bind(null,s,c,a,n),null),t){if(s.flags|=2048,We===null)throw Error(r(349));u||(ha&127)!==0||f0(s,n,a)}return a}function f0(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=_e.updateQueue,n===null?(n=$l(),_e.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function h0(t,n,a,s){n.value=a,n.getSnapshot=s,p0(n)&&m0(t)}function d0(t,n,a){return a(function(){p0(n)&&m0(t)})}function p0(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!ni(t,a)}catch{return!0}}function m0(t){var n=xs(t,2);n!==null&&Zn(n,t,2)}function Pf(t){var n=Hn();if(typeof t=="function"){var a=t;if(t=a(),Ds){gn(!0);try{a()}finally{gn(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:da,lastRenderedState:t},n}function g0(t,n,a,s){return t.baseState=a,Lf(t,Xe,typeof s=="function"?s:da)}function BS(t,n,a,s,c){if(ac(t))throw Error(r(485));if(t=n.action,t!==null){var u={payload:c,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(_){u.listeners.push(_)}};ut.T!==null?a(!0):u.isTransition=!1,s(u),a=n.pending,a===null?(u.next=n.pending=u,_0(n,u)):(u.next=a.next,n.pending=a.next=u)}}function _0(t,n){var a=n.action,s=n.payload,c=t.state;if(n.isTransition){var u=ut.T,_={};_.types=u!==null?u.types:null,ut.T=_;try{var T=a(c,s),I=ut.S;I!==null&&I(_,T),v0(t,n,T)}catch(J){zf(t,n,J)}finally{u!==null&&_.types!==null&&(u.types=_.types),ut.T=u}}else try{u=a(c,s),v0(t,n,u)}catch(J){zf(t,n,J)}}function v0(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(s){x0(t,n,s)},function(s){return zf(t,n,s)}):x0(t,n,a)}function x0(t,n,a){n.status="fulfilled",n.value=a,y0(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,_0(t,a)))}function zf(t,n,a){var s=t.pending;if(t.pending=null,s!==null){s=s.next;do n.status="rejected",n.reason=a,y0(n),n=n.next;while(n!==s)}t.action=null}function y0(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function S0(t,n){return n}function M0(t,n){if(Me){var a=We.formState;if(a!==null){t:{var s=_e;if(Me){if(Ke){e:{for(var c=Ke,u=_i;c.nodeType!==8;){if(!u){c=null;break e}if(c=xi(c.nextSibling),c===null){c=null;break e}}u=c.data,c=u==="F!"||u==="F"?c:null}if(c){Ke=xi(c.nextSibling),s=c.data==="F!";break t}}La(s)}s=!1}s&&(n=a[0])}}return a=Hn(),a.memoizedState=a.baseState=n,s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:S0,lastRenderedState:n},a.queue=s,a=G0.bind(null,_e,s),s.dispatch=a,s=Pf(!1),u=Vf.bind(null,_e,!1,s.queue),s=Hn(),c={state:n,dispatch:null,action:t,pending:null},s.queue=c,a=BS.bind(null,_e,c,u,a),c.dispatch=a,s.memoizedState=t,[n,a,!1]}function E0(t){var n=cn();return b0(n,Xe,t)}function b0(t,n,a){if(n=Lf(t,n,S0)[0],t=ec(da)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var s=Po(n)}catch(_){throw _===pr?Xl:_}else s=n;n=cn();var c=n.queue,u=c.dispatch;return a!==n.memoizedState&&(_e.flags|=2048,vr(9,{destroy:void 0},FS.bind(null,c,a),null)),[s,u,t]}function FS(t,n){t.action=n}function T0(t){var n=cn(),a=Xe;if(a!==null)return b0(n,a,t);cn(),n=n.memoizedState,a=cn();var s=a.queue.dispatch;return a.memoizedState=t,[n,s,!1]}function vr(t,n,a,s){return t={tag:t,create:a,deps:s,inst:n,next:null},n=_e.updateQueue,n===null&&(n=$l(),_e.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(s=a.next,a.next=t,t.next=s,n.lastEffect=t),t}function A0(){return cn().memoizedState}function nc(t,n,a,s){var c=Hn();_e.flags|=t,c.memoizedState=vr(1|n,{destroy:void 0},a,s===void 0?null:s)}function ic(t,n,a,s){var c=cn();s=s===void 0?null:s;var u=c.memoizedState.inst;Xe!==null&&s!==null&&Rf(s,Xe.memoizedState.deps)?c.memoizedState=vr(n,u,a,s):(_e.flags|=t,c.memoizedState=vr(1|n,u,a,s))}function R0(t,n){nc(8390656,8,t,n)}function If(t,n){ic(2048,8,t,n)}function HS(t){_e.flags|=4;var n=_e.updateQueue;if(n===null)n=$l(),_e.updateQueue=n,n.events=[t];else{var a=n.events;a===null?n.events=[t]:a.push(t)}}function C0(t){var n=cn().memoizedState;return HS({ref:n,nextImpl:t}),function(){if((Be&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}function w0(t,n){return ic(4,2,t,n)}function D0(t,n){return ic(4,4,t,n)}function N0(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function U0(t,n,a){a=a!=null?a.concat([t]):null,ic(4,4,N0.bind(null,n,t),a)}function Bf(){}function L0(t,n){var a=cn();n=n===void 0?null:n;var s=a.memoizedState;return n!==null&&Rf(n,s[1])?s[0]:(a.memoizedState=[t,n],t)}function O0(t,n){var a=cn();n=n===void 0?null:n;var s=a.memoizedState;if(n!==null&&Rf(n,s[1]))return s[0];if(s=t(),Ds){gn(!0);try{t()}finally{gn(!1)}}return a.memoizedState=[s,n],s}function Ff(t,n,a){return a===void 0||(ha&1073741824)!==0&&(we&261930)===0?t.memoizedState=n:(t.memoizedState=a,t=jg(),_e.lanes|=t,Xa|=t,a)}function P0(t,n,a,s){return ni(a,n)?a:Fa.current!==null?(t=Ff(t,a,s),ni(t,n)||(dn=!0),t):(ha&106)===0||(ha&1073741824)!==0&&(we&261930)===0?(dn=!0,t.memoizedState=a):(t=jg(),_e.lanes|=t,Xa|=t,n)}function z0(t,n,a,s,c){var u=Ot.p;Ot.p=u!==0&&8>u?u:8;var _=ut.T,T={};T.types=_!==null?_.types:null,ut.T=T,Vf(t,!1,n,a);try{var I=c(),J=ut.S;if(J!==null&&J(T,I),I!==null&&typeof I=="object"&&typeof I.then=="function"){var rt=PS(I,s);zo(t,n,rt,oi(t))}else zo(t,n,s,oi(t))}catch(xt){zo(t,n,{then:function(){},status:"rejected",reason:xt},oi())}finally{Ot.p=u,_!==null&&T.types!==null&&(_.types=T.types),ut.T=_}}function GS(){}function Hf(t,n,a,s){if(t.tag!==5)throw Error(r(476));var c=I0(t).queue;z0(t,c,n,z,a===null?GS:function(){return B0(t),a(s)})}function I0(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:z,baseState:z,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:da,lastRenderedState:z},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:da,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function B0(t){var n=I0(t);n.next===null&&(n=t.alternate.memoizedState),zo(t,n.next.queue,{},oi())}function Gf(){return An(Ir)}function F0(){return cn().memoizedState}function H0(){return cn().memoizedState}function VS(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=oi();t=Ia(a);var s=Ba(n,t,a);s!==null&&(Zn(s,n,a),Do(s,n,a)),n={cache:mf()},t.payload=n;return}n=n.return}}function kS(t,n,a){var s=oi();a={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},ac(t)?V0(n,a):(a=rf(t,n,a,s),a!==null&&(Zn(a,t,s),k0(a,n,s)))}function G0(t,n,a){var s=oi();zo(t,n,a,s)}function zo(t,n,a,s){var c={lane:s,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(ac(t))V0(n,c);else{var u=t.alternate;if(t.lanes===0&&(u===null||u.lanes===0)&&(u=n.lastRenderedReducer,u!==null))try{var _=n.lastRenderedState,T=u(_,a);if(c.hasEagerState=!0,c.eagerState=T,ni(T,_))return Pl(t,n,c,0),We===null&&Ol(),!1}catch{}finally{}if(a=rf(t,n,c,s),a!==null)return Zn(a,t,s),k0(a,n,s),!0}return!1}function Vf(t,n,a,s){if(s={lane:2,revertLane:Uh(),gesture:null,action:s,hasEagerState:!1,eagerState:null,next:null},ac(t)){if(n)throw Error(r(479))}else n=rf(t,a,s,2),n!==null&&Zn(n,t,2)}function ac(t){var n=t.alternate;return t===_e||n!==null&&n===_e}function V0(t,n){gr=Ql=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function k0(t,n,a){if((a&4194048)!==0){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,et(t,a)}}var sc={readContext:An,use:tc,useCallback:rn,useContext:rn,useEffect:rn,useImperativeHandle:rn,useLayoutEffect:rn,useInsertionEffect:rn,useMemo:rn,useReducer:rn,useRef:rn,useState:rn,useDebugValue:rn,useDeferredValue:rn,useTransition:rn,useSyncExternalStore:rn,useId:rn,useHostTransitionStatus:rn,useFormState:rn,useActionState:rn,useOptimistic:rn,useMemoCache:rn,useCacheRefresh:rn,useEffectEvent:rn},j0={readContext:An,use:tc,useCallback:function(t,n){return Hn().memoizedState=[t,n===void 0?null:n],t},useContext:An,useEffect:R0,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,nc(4194308,4,N0.bind(null,n,t),a)},useLayoutEffect:function(t,n){return nc(4194308,4,t,n)},useInsertionEffect:function(t,n){nc(4,2,t,n)},useMemo:function(t,n){var a=Hn();n=n===void 0?null:n;var s=t();if(Ds){gn(!0);try{t()}finally{gn(!1)}}return a.memoizedState=[s,n],s},useReducer:function(t,n,a){var s=Hn();if(a!==void 0){var c=a(n);if(Ds){gn(!0);try{a(n)}finally{gn(!1)}}}else c=n;return s.memoizedState=s.baseState=c,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:c},s.queue=t,t=t.dispatch=kS.bind(null,_e,t),[s.memoizedState,t]},useRef:function(t){var n=Hn();return t={current:t},n.memoizedState=t},useState:function(t){t=Pf(t);var n=t.queue,a=G0.bind(null,_e,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:Bf,useDeferredValue:function(t,n){var a=Hn();return Ff(a,t,n)},useTransition:function(){var t=Pf(!1);return t=z0.bind(null,_e,t.queue,!0,!1),Hn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var s=_e,c=Hn();if(Me){if(a===void 0)throw Error(r(407));a=a()}else{if(a=n(),We===null)throw Error(r(349));(we&127)!==0||f0(s,n,a)}c.memoizedState=a;var u={value:a,getSnapshot:n};return c.queue=u,R0(d0.bind(null,s,u,t),[t]),s.flags|=2048,vr(9,{destroy:void 0},h0.bind(null,s,u,a,n),null),a},useId:function(){var t=Hn(),n=We.identifierPrefix;if(Me){var a=Gi,s=Hi;a=(s&~(1<<32-Ln(s)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Jl++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=zS++,n="_"+n+"r_"+a.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:Gf,useFormState:M0,useActionState:M0,useOptimistic:function(t){var n=Hn();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=Vf.bind(null,_e,!0,a),a.dispatch=n,[t,n]},useMemoCache:Uf,useCacheRefresh:function(){return Hn().memoizedState=VS.bind(null,_e)},useEffectEvent:function(t){var n=Hn(),a={impl:t};return n.memoizedState=a,function(){if((Be&2)!==0)throw Error(r(440));return a.impl.apply(void 0,arguments)}}},X0={readContext:An,use:tc,useCallback:L0,useContext:An,useEffect:If,useImperativeHandle:U0,useInsertionEffect:w0,useLayoutEffect:D0,useMemo:O0,useReducer:ec,useRef:A0,useState:function(){return ec(da)},useDebugValue:Bf,useDeferredValue:function(t,n){var a=cn();return P0(a,Xe.memoizedState,t,n)},useTransition:function(){var t=ec(da)[0],n=cn().memoizedState;return[typeof t=="boolean"?t:Po(t),n]},useSyncExternalStore:u0,useId:F0,useHostTransitionStatus:Gf,useFormState:E0,useActionState:E0,useOptimistic:function(t,n){var a=cn();return g0(a,Xe,t,n)},useMemoCache:Uf,useCacheRefresh:H0,useEffectEvent:C0},jS={readContext:An,use:tc,useCallback:L0,useContext:An,useEffect:If,useImperativeHandle:U0,useInsertionEffect:w0,useLayoutEffect:D0,useMemo:O0,useReducer:Of,useRef:A0,useState:function(){return Of(da)},useDebugValue:Bf,useDeferredValue:function(t,n){var a=cn();return Xe===null?Ff(a,t,n):P0(a,Xe.memoizedState,t,n)},useTransition:function(){var t=Of(da)[0],n=cn().memoizedState;return[typeof t=="boolean"?t:Po(t),n]},useSyncExternalStore:u0,useId:F0,useHostTransitionStatus:Gf,useFormState:T0,useActionState:T0,useOptimistic:function(t,n){var a=cn();return Xe!==null?g0(a,Xe,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:Uf,useCacheRefresh:H0,useEffectEvent:C0};function kf(t,n,a,s){n=t.memoizedState,a=a(s,n),a=a==null?n:B({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var jf={enqueueSetState:function(t,n,a){t=t._reactInternals;var s=oi(),c=Ia(s);c.payload=n,a!=null&&(c.callback=a),n=Ba(t,c,s),n!==null&&(Zn(n,t,s),Do(n,t,s))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var s=oi(),c=Ia(s);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=Ba(t,c,s),n!==null&&(Zn(n,t,s),Do(n,t,s))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=oi(),s=Ia(a);s.tag=2,n!=null&&(s.callback=n),n=Ba(t,s,a),n!==null&&(Zn(n,t,a),Do(n,t,a))}};function Y0(t,n,a,s,c,u,_){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(s,u,_):n.prototype&&n.prototype.isPureReactComponent?!Mo(a,s)||!Mo(c,u):!0}function q0(t,n,a,s){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,s),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,s),n.state!==t&&jf.enqueueReplaceState(n,n.state,null)}function Ns(t,n){var a=n;if("ref"in n){a={};for(var s in n)s!=="ref"&&(a[s]=n[s])}if(t=t.defaultProps){a===n&&(a=B({},a));for(var c in t)a[c]===void 0&&(a[c]=t[c])}return a}function W0(t){Ll(t)}function Z0(t){console.error(t)}function K0(t){Ll(t)}function rc(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(s){setTimeout(function(){throw s})}}function Q0(t,n,a){try{var s=t.onCaughtError;s(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function Xf(t,n,a){return a=Ia(a),a.tag=3,a.payload={element:null},a.callback=function(){rc(t,n)},a}function J0(t){return t=Ia(t),t.tag=3,t}function $0(t,n,a,s){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var u=s.value;t.payload=function(){return c(u)},t.callback=function(){Q0(n,a,s)}}var _=a.stateNode;_!==null&&typeof _.componentDidCatch=="function"&&(t.callback=function(){Q0(n,a,s),typeof c!="function"&&(Ya===null?Ya=new Set([this]):Ya.add(this));var T=s.stack;this.componentDidCatch(s.value,{componentStack:T!==null?T:""})})}function XS(t,n,a,s,c){if(a.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){if(n=a.alternate,n!==null&&Es(n,a,c,!0),a=Rn.current,a!==null){switch(a.tag){case 31:case 13:case 19:return Pn===null?Rc():a.alternate===null&&on===0&&(on=3),a.flags&=-257,a.flags|=65536,a.lanes=c,s===Yl?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([s]):n.add(s),wh(t,s,c)),!1;case 22:return a.flags|=65536,s===Yl?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([s])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([s]):a.add(s)),wh(t,s,c)),!1}throw Error(r(435,a.tag))}return wh(t,s,c),Rc(),!1}if(Me)return n=Rn.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,s!==ff&&(t=Error(r(422),{cause:s}),To(pi(t,a)))):(s!==ff&&(n=Error(r(423),{cause:s}),To(pi(n,a))),t=t.current.alternate,t.flags|=65536,c&=-c,t.lanes|=c,s=pi(s,a),c=Xf(t.stateNode,s,c),Sf(t,c),on!==4&&(on=2)),!1;var u=Error(r(520),{cause:s});if(u=pi(u,a),jo===null?jo=[u]:jo.push(u),on!==4&&(on=2),n===null)return!0;s=pi(s,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=c&-c,a.lanes|=t,t=Xf(a.stateNode,s,t),Sf(a,t),!1;case 1:if(n=a.type,u=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||u!==null&&typeof u.componentDidCatch=="function"&&(Ya===null||!Ya.has(u))))return a.flags|=65536,c&=-c,a.lanes|=c,c=J0(c),$0(c,t,a,s),Sf(a,c),!1;break;case 22:if(a.memoizedState!==null)return a.flags|=65536,!1}a=a.return}while(a!==null);return!1}var Yf=Error(r(461)),dn=!1;function vn(t,n,a,s){n.child=t===null?i0(n,null,a,s):ws(n,t.child,a,s)}function tg(t,n,a,s,c){a=a.render;var u=n.ref;if("ref"in s){var _={};for(var T in s)T!=="ref"&&(_[T]=s[T])}else _=s;return bs(n),s=Cf(t,n,a,_,u,c),T=wf(),t!==null&&!dn?(Df(t,n,c),pa(t,n,c)):(Me&&T&&Fl(n),n.flags|=1,vn(t,n,s,c),n.child)}function eg(t,n,a,s,c){if(t===null){var u=a.type;return typeof u=="function"&&!of(u)&&u.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=u,ng(t,n,u,s,c)):(t=Il(a.type,null,s,n,n.mode,c),t.ref=n.ref,t.return=n,n.child=t)}if(u=t.child,!th(t,c)){var _=u.memoizedProps;if(a=a.compare,a=a!==null?a:Mo,a(_,s)&&t.ref===n.ref)return pa(t,n,c)}return n.flags|=1,t=la(u,s),t.ref=n.ref,t.return=n,n.child=t}function ng(t,n,a,s,c){if(t!==null){var u=t.memoizedProps;if(Mo(u,s)&&t.ref===n.ref)if(dn=!1,n.pendingProps=s=u,th(t,c))(t.flags&131072)!==0&&(dn=!0);else return n.lanes=t.lanes,pa(t,n,c)}return qf(t,n,a,s,c)}function ig(t,n,a,s){var c=s.children,u=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),s.mode==="hidden"){if((n.flags&128)!==0){if(u=u!==null?u.baseLanes|a:a,t!==null){for(s=n.child=t.child,c=0;s!==null;)c=c|s.lanes|s.childLanes,s=s.sibling;s=c&~u}else s=0,n.child=null;return ag(t,n,u,a,s)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&jl(n,u!==null?u.cachePool:null),u!==null?r0(n,u):Ef(),o0(n);else return s=n.lanes=536870912,ag(t,n,u!==null?u.baseLanes|a:a,a,s)}else u!==null?(jl(n,u.cachePool),r0(n,u),Ga(),n.memoizedState=null):(t!==null&&jl(n,null),Ef(),Ga());return vn(t,n,c,a),n.child}function Io(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function ag(t,n,a,s,c){var u=_f();return u=u===null?null:{parent:fn._currentValue,pool:u},n.memoizedState={baseLanes:a,cachePool:u},t!==null&&jl(n,null),Ef(),o0(n),t!==null&&Es(t,n,s,!0),n.childLanes=c,null}function oc(t,n){return n=lc({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function sg(t,n,a){return ws(n,t.child,null,a),t=oc(n,n.pendingProps),t.flags|=2,ii(n),n.memoizedState=null,t}function YS(t,n,a){var s=n.pendingProps,c=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(Me){if(s.mode==="hidden")return t=oc(n,s),n.lanes=536870912,t.memoizedState={baseLanes:0,cachePool:null},Io(null,t);if(Tf(n),(t=Ke)?(t=N_(t,_i),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Na!==null?{id:Hi,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},a=Vm(t),a.return=n,n.child=a,Mn=n,Ke=null)):t=null,t===null)throw La(n);return n.lanes=536870912,null}return oc(n,s)}var u=t.memoizedState;if(u!==null){var _=u.dehydrated;if(Tf(n),c)if(n.flags&256)n.flags&=-257,n=sg(t,n,a);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(r(558));else if(dn||Es(t,n,a,!1),c=(a&t.childLanes)!==0,dn||c){if(Fa.current===null){if(s=We,s!==null&&(_=ft(s,a),_!==0&&_!==u.retryLane))throw u.retryLane=_,xs(t,_),Zn(s,t,_),Yf;Rc()}n=sg(t,n,a)}else t=u.treeContext,Ke=xi(_.nextSibling),Mn=n,Me=!0,Ua=null,_i=!1,t!==null&&Xm(n,t),n=oc(n,s),n.flags|=134221824;return n}return t=la(t.child,{mode:s.mode,children:s.children}),t.ref=n.ref,n.child=t,t.return=n,t}function xr(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(r(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function qf(t,n,a,s,c){return bs(n),a=Cf(t,n,a,s,void 0,c),s=wf(),t!==null&&!dn?(Df(t,n,c),pa(t,n,c)):(Me&&s&&Fl(n),n.flags|=1,vn(t,n,a,c),n.child)}function rg(t,n,a,s,c,u){return bs(n),n.updateQueue=null,a=c0(n,s,a,c),l0(t),s=wf(),t!==null&&!dn?(Df(t,n,u),pa(t,n,u)):(Me&&s&&Fl(n),n.flags|=1,vn(t,n,a,u),n.child)}function og(t,n,a,s,c){if(bs(n),n.stateNode===null){var u=cr,_=a.contextType;typeof _=="object"&&_!==null&&(u=An(_)),u=new a(s,u),n.memoizedState=u.state!==null&&u.state!==void 0?u.state:null,u.updater=jf,n.stateNode=u,u._reactInternals=n,u=n.stateNode,u.props=s,u.state=n.memoizedState,u.refs={},xf(n),_=a.contextType,u.context=typeof _=="object"&&_!==null?An(_):cr,u.state=n.memoizedState,_=a.getDerivedStateFromProps,typeof _=="function"&&(kf(n,a,_,s),u.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof u.getSnapshotBeforeUpdate=="function"||typeof u.UNSAFE_componentWillMount!="function"&&typeof u.componentWillMount!="function"||(_=u.state,typeof u.componentWillMount=="function"&&u.componentWillMount(),typeof u.UNSAFE_componentWillMount=="function"&&u.UNSAFE_componentWillMount(),_!==u.state&&jf.enqueueReplaceState(u,u.state,null),Uo(n,s,u,c),No(),u.state=n.memoizedState),typeof u.componentDidMount=="function"&&(n.flags|=4194308),s=!0}else if(t===null){u=n.stateNode;var T=n.memoizedProps,I=Ns(a,T);u.props=I;var J=u.context,rt=a.contextType;_=cr,typeof rt=="object"&&rt!==null&&(_=An(rt));var xt=a.getDerivedStateFromProps;rt=typeof xt=="function"||typeof u.getSnapshotBeforeUpdate=="function",T=n.pendingProps!==T,rt||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(T||J!==_)&&q0(n,u,s,_),za=!1;var W=n.memoizedState;u.state=W,Uo(n,s,u,c),No(),J=n.memoizedState,T||W!==J||za?(typeof xt=="function"&&(kf(n,a,xt,s),J=n.memoizedState),(I=za||Y0(n,a,I,s,W,J,_))?(rt||typeof u.UNSAFE_componentWillMount!="function"&&typeof u.componentWillMount!="function"||(typeof u.componentWillMount=="function"&&u.componentWillMount(),typeof u.UNSAFE_componentWillMount=="function"&&u.UNSAFE_componentWillMount()),typeof u.componentDidMount=="function"&&(n.flags|=4194308)):(typeof u.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=s,n.memoizedState=J),u.props=s,u.state=J,u.context=_,s=I):(typeof u.componentDidMount=="function"&&(n.flags|=4194308),s=!1)}else{u=n.stateNode,yf(t,n),_=n.memoizedProps,rt=Ns(a,_),u.props=rt,xt=n.pendingProps,W=u.context,J=a.contextType,I=cr,typeof J=="object"&&J!==null&&(I=An(J)),T=a.getDerivedStateFromProps,(J=typeof T=="function"||typeof u.getSnapshotBeforeUpdate=="function")||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(_!==xt||W!==I)&&q0(n,u,s,I),za=!1,W=n.memoizedState,u.state=W,Uo(n,s,u,c),No();var at=n.memoizedState;_!==xt||W!==at||za||t!==null&&t.dependencies!==null&&Vl(t.dependencies)?(typeof T=="function"&&(kf(n,a,T,s),at=n.memoizedState),(rt=za||Y0(n,a,rt,s,W,at,I)||t!==null&&t.dependencies!==null&&Vl(t.dependencies))?(J||typeof u.UNSAFE_componentWillUpdate!="function"&&typeof u.componentWillUpdate!="function"||(typeof u.componentWillUpdate=="function"&&u.componentWillUpdate(s,at,I),typeof u.UNSAFE_componentWillUpdate=="function"&&u.UNSAFE_componentWillUpdate(s,at,I)),typeof u.componentDidUpdate=="function"&&(n.flags|=4),typeof u.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof u.componentDidUpdate!="function"||_===t.memoizedProps&&W===t.memoizedState||(n.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||_===t.memoizedProps&&W===t.memoizedState||(n.flags|=1024),n.memoizedProps=s,n.memoizedState=at),u.props=s,u.state=at,u.context=I,s=rt):(typeof u.componentDidUpdate!="function"||_===t.memoizedProps&&W===t.memoizedState||(n.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||_===t.memoizedProps&&W===t.memoizedState||(n.flags|=1024),s=!1)}return u=s,xr(t,n),s=(n.flags&128)!==0,u||s?(u=n.stateNode,a=s&&typeof a.getDerivedStateFromError!="function"?null:u.render(),n.flags|=1,t!==null&&s?(n.child=ws(n,t.child,null,c),n.child=ws(n,null,a,c)):vn(t,n,a,c),n.memoizedState=u.state,t=n.child):t=pa(t,n,c),t}function lg(t,n,a,s){return Ss(),n.flags|=256,vn(t,n,a,s),n.child}var Wf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Zf(t){return{baseLanes:t,cachePool:Qm()}}function Kf(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=ri),t}function cg(t,n,a){var s=n.pendingProps,c=!1,u=(n.flags&128)!==0,_;if((_=u)||(_=t!==null&&t.memoizedState===null?!1:(Cn.current&2)!==0),_&&(c=!0,n.flags&=-129),_=(n.flags&32)!==0,n.flags&=-33,t===null){if(Me){if(c?Ha(n):Ga(),(t=Ke)?(t=N_(t,_i),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Na!==null?{id:Hi,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},a=Vm(t),a.return=n,n.child=a,Mn=n,Ke=null)):t=null,t===null)throw La(n);return Zh(t)?n.lanes=32:n.lanes=536870912,null}return u=s.children,s=s.fallback,c?(Ga(),c=n.mode,u=lc({mode:"hidden",children:u},c),s=ys(s,c,a,null),u.return=n,s.return=n,u.sibling=s,n.child=u,s=n.child,s.memoizedState=Zf(a),s.childLanes=Kf(t,_,a),n.memoizedState=Wf,Io(null,s)):(Ha(n),Qf(n,u))}var T=t.memoizedState;if(T!==null){var I=T.dehydrated;if(I!==null)return qS(t,n,u,_,s,I,T,a)}return c?(Ga(),c=s.fallback,u=n.mode,T=t.child,I=T.sibling,s=la(T,{mode:"hidden",children:s.children}),s.subtreeFlags=T.subtreeFlags&1206910976,I!==null?c=la(I,c):(c=ys(c,u,a,null),c.flags|=2),c.return=n,s.return=n,s.sibling=c,n.child=s,Io(null,s),s=n.child,c=t.child.memoizedState,c===null?c=Zf(a):(u=c.cachePool,u!==null?(T=fn._currentValue,u=u.parent!==T?{parent:T,pool:T}:u):u=Qm(),c={baseLanes:c.baseLanes|a,cachePool:u}),s.memoizedState=c,s.childLanes=Kf(t,_,a),n.memoizedState=Wf,Io(t.child,s)):(Ha(n),a=t.child,t=a.sibling,a=la(a,{mode:"visible",children:s.children}),a.return=n,a.sibling=null,t!==null&&(_=n.deletions,_===null?(n.deletions=[t],n.flags|=16):_.push(t)),n.child=a,n.memoizedState=null,a)}function Qf(t,n){return n=lc({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function lc(t,n){return t=Xn(22,t,null,n),t.lanes=0,t}function cc(t,n,a){return ws(n,t.child,null,a),t=Qf(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function qS(t,n,a,s,c,u,_,T){if(a)return n.flags&256?(Ha(n),n.flags&=-257,cc(t,n,T)):n.memoizedState!==null?(Ga(),n.child=t.child,n.flags|=128,null):(Ga(),u=c.fallback,_=n.mode,c=lc({mode:"visible",children:c.children},_),u=ys(u,_,T,null),u.flags|=2,c.return=n,u.return=n,c.sibling=u,n.child=c,ws(n,t.child,null,T),c=n.child,c.memoizedState=Zf(T),c.childLanes=Kf(t,s,T),n.memoizedState=Wf,Io(null,c));if(Ha(n),Zh(u)){if(s=u.nextSibling&&u.nextSibling.dataset,s)var I=s.dgst;return s=I,s!==""&&(c=Error(r(419)),c.stack="",c.digest=s,To({value:c,source:null,stack:null})),cc(t,n,T)}if(dn||Es(t,n,T,!1),s=(T&t.childLanes)!==0,dn||s){if(Fa.current!==null)return cc(t,n,T);if(s=We,s!==null&&(c=ft(s,T),c!==0&&c!==_.retryLane))throw _.retryLane=c,xs(t,c),Zn(s,t,c),Yf;return Wh(u)||Rc(),cc(t,n,T)}return Wh(u)?(n.flags|=192,n.child=t.child,null):(t=_.treeContext,Ke=xi(u.nextSibling),Mn=n,Me=!0,Ua=null,_i=!1,t!==null&&Xm(n,t),n=Qf(n,c.children),n.flags|=134221824,n)}function ug(t,n,a){t.lanes|=n;var s=t.alternate;s!==null&&(s.lanes|=n),Gl(t.return,n,a)}function fg(t){for(var n=null;t!==null;){var a=t.alternate;a!==null&&Kl(a)===null&&(n=t),t=t.sibling}return n}function uc(t,n,a,s,c,u){var _=t.memoizedState;_===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:s,tail:a,tailMode:c,treeForkCount:u}:(_.isBackwards=n,_.rendering=null,_.renderingStartTime=0,_.last=s,_.tail=a,_.tailMode=c,_.treeForkCount=u)}function Jf(t){var n=t.child;for(t.child=null;n!==null;){var a=n.sibling;n.sibling=t.child,t.child=n,n=a}}function $f(t,n,a){var s=n.pendingProps,c=s.revealOrder,u=s.tail;s=s.children;var _=Cn.current;if(n.flags&128)return Lo(n,_),null;var T=(_&2)!==0;if(T?(_=_&1|2,n.flags|=128):_&=1,Lo(n,_),c==="backwards"&&t!==null?(Jf(t),vn(t,n,s,a),Jf(t)):vn(t,n,s,a),s=Me?bo:0,!T&&t!==null&&(t.flags&128)!==0)t:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&ug(t,a,n);else if(t.tag===19)ug(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break t;for(;t.sibling===null;){if(t.return===null||t.return===n)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(c){case"backwards":a=fg(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null,Jf(n)),uc(n,!0,c,null,u,s);break;case"unstable_legacy-backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(t=c.alternate,t!==null&&Kl(t)===null){n.child=c;break}t=c.sibling,c.sibling=a,a=c,c=t}uc(n,!0,a,null,u,s);break;case"together":uc(n,!1,null,null,void 0,s);break;case"independent":n.memoizedState=null;break;default:a=fg(n.child),a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),uc(n,!1,c,a,u,s)}return n.child}function hg(t,n,a){var s=n.pendingProps;return Oa(n,n.type,s.value),vn(t,n,s.children,a),n.child}function pa(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),Xa|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(Es(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(r(153));if(n.child!==null){for(t=n.child,a=la(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=la(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function th(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&Vl(t)))}function WS(t,n,a){switch(n.tag){case 3:w(n,n.stateNode.containerInfo),Oa(n,fn,t.memoizedState.cache),Ss();break;case 27:case 5:Y(n);break;case 4:w(n,n.stateNode.containerInfo);break;case 10:Oa(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,Tf(n),null;break;case 13:var s=n.memoizedState;if(s!==null){if(s.dehydrated!==null)return Ha(n),n.flags|=128,null;s=Es(t,n,a,!1);var c=n.child.childLanes;return s||(a&c)!==0?cg(t,n,a):(Ha(n),t=pa(t,n,a),t!==null?t.sibling:null)}Ha(n);break;case 19:if(n.flags&128)return $f(t,n,a);if(c=(t.flags&128)!==0,s=(a&n.childLanes)!==0,s||(Es(t,n,a,!1),s=(a&n.childLanes)!==0),c){if(s)return $f(t,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),Lo(n,Cn.current),s)break;return null;case 22:return n.lanes=0,ig(t,n,a,n.pendingProps);case 24:Oa(n,fn,t.memoizedState.cache)}return pa(t,n,a)}function dg(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)dn=!0;else{if(!th(t,a)&&(n.flags&128)===0)return dn=!1,WS(t,n,a);dn=(t.flags&131072)!==0}else dn=!1,Me&&(n.flags&1048576)!==0&&jm(n,bo,n.index);switch(n.lanes=0,n.tag){case 16:t:{var s=n.pendingProps;if(t=Rs(n.elementType),n.type=t,typeof t=="function")of(t)?(s=Ns(t,s),n.tag=1,n=og(null,n,t,s,a)):(n.tag=0,n=qf(null,n,t,s,a));else{if(t!=null){var c=t.$$typeof;if(c===Z){n.tag=11,n=tg(null,n,t,s,a);break t}else if(c===Tt){n.tag=14,n=eg(null,n,t,s,a);break t}else if(c===mt){n.tag=10,n.type=t,n=hg(null,n,a);break t}}throw n=St(t)||t,Error(r(306,n,""))}}return n;case 0:return qf(t,n,n.type,n.pendingProps,a);case 1:return s=n.type,c=Ns(s,n.pendingProps),og(t,n,s,c,a);case 3:t:{if(w(n,n.stateNode.containerInfo),t===null)throw Error(r(387));s=n.pendingProps;var u=n.memoizedState;c=u.element,yf(t,n),Uo(n,s,null,a);var _=n.memoizedState;if(s=_.cache,Oa(n,fn,s),s!==u.cache&&pf(n,[fn],a,!0),No(),s=_.element,u.isDehydrated)if(u={element:s,isDehydrated:!1,cache:_.cache},n.updateQueue.baseState=u,n.memoizedState=u,n.flags&256){n=lg(t,n,s,a);break t}else if(s!==c){c=pi(Error(r(424)),n),To(c),n=lg(t,n,s,a);break t}else{switch(t=n.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(Ke=xi(t.firstChild),Mn=n,Me=!0,Ua=null,_i=!0,a=i0(n,null,s,a),n.child=a;a;)a.flags=a.flags&-3|134221824,a=a.sibling}else{if(Ss(),s===c){n=pa(t,n,a);break t}vn(t,n,s,a)}n=n.child}return n;case 26:return xr(t,n),t===null?(a=B_(n.type,null,n.pendingProps,null))?n.memoizedState=a:Me||(n.stateNode=__(n.type,n.pendingProps,me.current,n)):n.memoizedState=B_(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return Y(n),t===null&&Me&&(s=n.stateNode=O_(n.type,n.pendingProps,me.current),Mn=n,_i=!0,c=Ke,Za(n.type)?(Kh=c,Ke=xi(s.firstChild)):Ke=c),vn(t,n,n.pendingProps.children,a),xr(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&Me&&((c=s=Ke)&&(s=VM(s,n.type,n.pendingProps,_i),s!==null?(n.stateNode=s,Mn=n,Ke=xi(s.firstChild),_i=!1,c=!0):c=!1),c||La(n)),Y(n),c=n.type,u=n.pendingProps,_=t!==null?t.memoizedProps:null,s=u.children,Gh(c,u)?s=null:_!==null&&Gh(c,_)&&(n.flags|=32),n.memoizedState!==null&&(c=Cf(t,n,IS,null,null,a),Ir._currentValue=c),xr(t,n),vn(t,n,s,a),n.child;case 6:return t===null&&Me&&((t=a=Ke)&&(a=kM(a,n.pendingProps,_i),a!==null?(n.stateNode=a,Mn=n,Ke=null,t=!0):t=!1),t||La(n)),null;case 13:return cg(t,n,a);case 4:return w(n,n.stateNode.containerInfo),s=n.pendingProps,t===null?n.child=ws(n,null,s,a):vn(t,n,s,a),n.child;case 11:return tg(t,n,n.type,n.pendingProps,a);case 7:return s=n.pendingProps,xr(t,n),vn(t,n,s,a),n.child;case 8:return vn(t,n,n.pendingProps.children,a),n.child;case 12:return vn(t,n,n.pendingProps.children,a),n.child;case 10:return hg(t,n,a);case 9:return c=n.type._context,s=n.pendingProps.children,bs(n),c=An(c),s=s(c),n.flags|=1,vn(t,n,s,a),n.child;case 14:return eg(t,n,n.type,n.pendingProps,a);case 15:return ng(t,n,n.type,n.pendingProps,a);case 19:return $f(t,n,a);case 31:return YS(t,n,a);case 22:return ig(t,n,a,n.pendingProps);case 24:return bs(n),s=An(fn),t===null?(c=_f(),c===null&&(c=We,u=mf(),c.pooledCache=u,u.refCount++,u!==null&&(c.pooledCacheLanes|=a),c=u),n.memoizedState={parent:s,cache:c},xf(n),Oa(n,fn,c)):((t.lanes&a)!==0&&(yf(t,n),Uo(n,null,null,a),No()),c=t.memoizedState,u=n.memoizedState,c.parent!==s?(c={parent:s,cache:s},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),Oa(n,fn,s)):(s=u.cache,Oa(n,fn,s),s!==c.cache&&pf(n,[fn],a,!0))),vn(t,n,n.pendingProps.children,a),n.child;case 30:return n.stateNode===null&&(n.stateNode={autoName:null,paired:null,clones:null,ref:null}),s=n.pendingProps,s.name!=null&&s.name!=="auto"?n.flags|=t===null?18882560:18874368:Me&&Fl(n),t!==null&&t.memoizedProps.name!==s.name?n.flags|=4194816:xr(t,n),vn(t,n,s.children,a),n.child;case 29:throw n.pendingProps}throw Error(r(156,n.tag))}function ma(t){t.flags|=4}function eh(t,n,a,s,c){var u;if((u=(t.mode&32)!==0)&&(u=a===null?V_(n,s):V_(n,s)&&(s.src!==a.src||s.srcSet!==a.srcSet)),u){if(t.flags|=16777216,(c&335544128)===c)if(t.stateNode.complete)t.flags|=8192;else if(Wg())t.flags|=8192;else throw Cs=Yl,vf}else t.flags&=-16777217}function pg(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!k_(n))if(Wg())t.flags|=8192;else throw Cs=Yl,vf}function fc(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?El():536870912,t.lanes|=n,br|=n)}function Bo(t,n){if(!Me)switch(t.tailMode){case"visible":break;case"collapsed":for(var a=t.tail,s=null;a!==null;)a.alternate!==null&&(s=a),a=a.sibling;s===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:s.sibling=null;break;default:for(n=t.tail,a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null}}function Qe(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,s=0;if(n)for(var c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags&1206910976,s|=c.flags&1206910976,c.return=t,c=c.sibling;else for(c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags,s|=c.flags,c.return=t,c=c.sibling;return t.subtreeFlags|=s,t.childLanes=a,n}function ZS(t,n,a){var s=n.pendingProps;switch(uf(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qe(n),null;case 1:return Qe(n),null;case 3:return a=n.stateNode,s=null,t!==null&&(s=t.memoizedState.cache),n.memoizedState.cache!==s&&(n.flags|=2048),fa(fn),b(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(hr(n)?ma(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,hf())),Qe(n),null;case 26:var c=n.type,u=n.memoizedState;return t===null?(ma(n),u!==null?(Qe(n),pg(n,u)):(Qe(n),eh(n,c,null,s,a))):u?u!==t.memoizedState?(ma(n),Qe(n),pg(n,u)):(Qe(n),n.flags&=-16777217):(t=t.memoizedProps,t!==s&&ma(n),Qe(n),eh(n,c,t,s,a)),null;case 27:if($(n),a=me.current,c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==s&&ma(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Qe(n),n.subtreeFlags&=-33554433,null}t=Rt.current,hr(n)?Ym(n):(t=O_(c,s,a),n.stateNode=t,ma(n))}return Qe(n),n.subtreeFlags&=-33554433,null;case 5:if($(n),c=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==s&&ma(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Qe(n),n.subtreeFlags&=-33554433,null}if(u=Rt.current,hr(n))Ym(n);else{var _=Zo(me.current);switch(u){case 1:u=_.createElementNS("http://www.w3.org/2000/svg",c);break;case 2:u=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;default:switch(c){case"svg":u=_.createElementNS("http://www.w3.org/2000/svg",c);break;case"math":u=_.createElementNS("http://www.w3.org/1998/Math/MathML",c);break;case"script":u=_.createElement("div"),u.innerHTML="<script><\/script>",u=u.removeChild(u.firstChild);break;case"select":u=typeof s.is=="string"?_.createElement("select",{is:s.is}):_.createElement("select"),s.multiple?u.multiple=!0:s.size&&(u.size=s.size);break;default:u=typeof s.is=="string"?_.createElement(c,{is:s.is}):_.createElement(c)}}u[Pt]=n,u[Jt]=s;t:for(_=n.child;_!==null;){if(_.tag===5||_.tag===6)u.appendChild(_.stateNode);else if(_.tag!==4&&_.tag!==27&&_.child!==null){_.child.return=_,_=_.child;continue}if(_===n)break t;for(;_.sibling===null;){if(_.return===null||_.return===n)break t;_=_.return}_.sibling.return=_.return,_=_.sibling}n.stateNode=u;t:switch(Dn(u,c,s),c){case"button":case"input":case"select":case"textarea":s=!!s.autoFocus;break t;case"img":s=!0;break t;default:s=!1}s&&ma(n)}}return Qe(n),n.subtreeFlags&=-33554433,eh(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,a),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==s&&ma(n);else{if(typeof s!="string"&&n.stateNode===null)throw Error(r(166));if(t=me.current,hr(n)){if(t=n.stateNode,a=n.memoizedProps,s=null,c=Mn,c!==null)switch(c.tag){case 27:case 5:s=c.memoizedProps}t[Pt]=n,t=!!(t.nodeValue===a||s!==null&&s.suppressHydrationWarning===!0||d_(t.nodeValue,a)),t||La(n,!0)}else t=Zo(t).createTextNode(s),t[Pt]=n,n.stateNode=t}return Qe(n),null;case 31:if(a=n.memoizedState,t===null||t.memoizedState!==null){if(s=hr(n),a!==null){if(t===null){if(!s)throw Error(r(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(557));t[Pt]=n}else Ss(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Qe(n),t=!1}else a=hf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return n.flags&256?(ii(n),n):(ii(n),null);if((n.flags&128)!==0)throw Error(r(558))}return Qe(n),null;case 13:if(s=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(c=hr(n),s!==null&&s.dehydrated!==null){if(t===null){if(!c)throw Error(r(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(r(317));c[Pt]=n}else Ss(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Qe(n),c=!1}else c=hf(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(ii(n),n):(ii(n),null)}return ii(n),(n.flags&128)!==0?(n.lanes=a,n):(a=s!==null,t=t!==null&&t.memoizedState!==null,a&&(s=n.child,c=null,s.alternate!==null&&s.alternate.memoizedState!==null&&s.alternate.memoizedState.cachePool!==null&&(c=s.alternate.memoizedState.cachePool.pool),u=null,s.memoizedState!==null&&s.memoizedState.cachePool!==null&&(u=s.memoizedState.cachePool.pool),u!==c&&(s.flags|=2048)),a!==t&&a&&(n.child.flags|=8192),fc(n,n.updateQueue),Qe(n),null);case 4:return b(),t===null&&zh(n.stateNode.containerInfo),n.flags|=67108864,Qe(n),null;case 10:return fa(n.type),Qe(n),null;case 19:if(Af(n),s=n.memoizedState,s===null)return Qe(n),null;if(c=(n.flags&128)!==0,u=s.rendering,u===null)if(c)Bo(s,!1);else{if(on!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(u=Kl(t),u!==null){for(n.flags|=128,Bo(s,!1),t=u.updateQueue,n.updateQueue=t,fc(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)Gm(a,t),a=a.sibling;return Lo(n,Cn.current&1|2),Me&&ca(n,s.treeForkCount),n.child}t=t.sibling}s.tail!==null&&j()>Ec&&(n.flags|=128,c=!0,Bo(s,!1),n.lanes=4194304)}else{if(!c)if(t=Kl(u),t!==null){if(n.flags|=128,c=!0,t=t.updateQueue,n.updateQueue=t,fc(n,t),Bo(s,!0),s.tail===null&&s.tailMode!=="collapsed"&&s.tailMode!=="visible"&&!u.alternate&&!Me)return Qe(n),null}else 2*j()-s.renderingStartTime>Ec&&a!==536870912&&(n.flags|=128,c=!0,Bo(s,!1),n.lanes=4194304);s.isBackwards?(u.sibling=n.child,n.child=u):(t=s.last,t!==null?t.sibling=u:n.child=u,s.last=u)}if(s.tail!==null){t=s.tail;t:{for(a=t;a!==null;){if(a.alternate!==null){a=!1;break t}a=a.sibling}a=!0}return s.rendering=t,s.tail=t.sibling,s.renderingStartTime=j(),t.sibling=null,u=Cn.current,u=c?u&1|2:u&1,s.tailMode==="visible"||s.tailMode==="collapsed"||!a||Me?Lo(n,u):(a=u,It(Rn,n),It(Cn,a),Pn===null&&(Pn=n)),Me&&ca(n,s.treeForkCount),t}return Qe(n),null;case 22:case 23:return ii(n),bf(),s=n.memoizedState!==null,t!==null?t.memoizedState!==null!==s&&(n.flags|=8192):s&&(n.flags|=8192),s?(a&536870912)!==0&&(n.flags&128)===0&&(Qe(n),n.subtreeFlags&6&&(n.flags|=8192)):Qe(n),a=n.updateQueue,a!==null&&fc(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),s=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(s=n.memoizedState.cachePool.pool),s!==a&&(n.flags|=2048),t!==null&&yt(As),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),fa(fn),Qe(n),null;case 25:return null;case 30:return n.flags|=33554432,Qe(n),null}throw Error(r(156,n.tag))}function KS(t,n){switch(uf(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return fa(fn),b(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return $(n),null;case 31:if(n.memoizedState!==null){if(ii(n),n.alternate===null)throw Error(r(340));Ss()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(ii(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(r(340));Ss()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return Af(n),t=n.flags,t&65536?(n.flags=t&-65537|128,t=n.memoizedState,t!==null&&(t.rendering=null,t.tail=null),n.flags|=4,n):null;case 4:return b(),null;case 10:return fa(n.type),null;case 22:case 23:return ii(n),bf(),t!==null&&yt(As),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return fa(fn),null;case 25:return null;default:return null}}function mg(t,n){switch(uf(n),n.tag){case 3:fa(fn),b();break;case 26:case 27:case 5:$(n);break;case 4:b();break;case 31:n.memoizedState!==null&&ii(n);break;case 13:ii(n);break;case 19:Af(n);break;case 10:fa(n.type);break;case 22:case 23:ii(n),bf(),t!==null&&yt(As);break;case 24:fa(fn)}}function Fo(t,n){try{var a=n.updateQueue,s=a!==null?a.lastEffect:null;if(s!==null){var c=s.next;a=c;do{if((a.tag&t)===t){s=void 0;var u=a.create,_=a.inst;s=u(),_.destroy=s}a=a.next}while(a!==c)}}catch(T){Ve(n,n.return,T)}}function Va(t,n,a){try{var s=n.updateQueue,c=s!==null?s.lastEffect:null;if(c!==null){var u=c.next;s=u;do{if((s.tag&t)===t){var _=s.inst,T=_.destroy;if(T!==void 0){_.destroy=void 0,c=n;var I=a,J=T;try{J()}catch(rt){Ve(c,I,rt)}}}s=s.next}while(s!==u)}}catch(rt){Ve(n,n.return,rt)}}function gg(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{s0(n,a)}catch(s){Ve(t,t.return,s)}}}function _g(t,n,a){a.props=Ns(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(s){Ve(t,n,s)}}function Vi(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var s=t.stateNode;break;case 30:var c=t.stateNode,u=ra(t.memoizedProps,c);(c.ref===null||c.ref.name!==u)&&(c.ref=b_(u)),s=c.ref;break;case 7:if(t.stateNode===null){var _=new li(t);m(t.child,!1,HM,_,void 0,void 0),t.stateNode=_}s=t.stateNode;break;default:s=t.stateNode}typeof a=="function"?t.refCleanup=a(s):a.current=s}}catch(T){Ve(t,n,T)}}function wn(t,n){var a=t.ref,s=t.refCleanup;if(a!==null)if(typeof s=="function")try{s()}catch(c){Ve(t,n,c)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){Ve(t,n,c)}else a.current=null}function hc(t,n){if((t.tag===5||t.tag===27||t.tag===6)&&t.alternate===null&&n!==null)for(var a=0;a<n.length;a++)D_(t.stateNode,n[a])}function vg(t){for(var n=t.return;n!==null&&(ih(n)&&D_(t.stateNode,n.stateNode),!nh(n));)n=n.return}function Ho(t){for(var n=t.return;n!==null&&(ih(n)&&GM(t.stateNode,n.stateNode),!nh(n));)n=n.return}function nh(t){return t.tag===5||t.tag===3||t.tag===27}function ih(t){return t&&t.tag===7&&t.stateNode!==null}function ah(t){var n=t.type,a=t.memoizedProps,s=t.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&s.focus();break t;case"img":a.src?s.src=a.src:a.srcSet&&(s.srcset=a.srcSet)}}catch(c){Ve(t,t.return,c)}}function sh(t,n,a){try{var s=t.stateNode;MM(s,t.type,a,n),s[Jt]=n}catch(c){Ve(t,t.return,c)}}function xg(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Za(t.type)||t.tag===4}function rh(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||xg(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Za(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function oh(t,n,a,s){var c=t.tag;if(c===5||c===6)c=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(c,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(c),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Fi)),hc(t,s),Oe=!0;else if(c!==4&&(c===27&&(hc(t,s),s=null,Za(t.type)&&(a=t.stateNode,n=null)),t=t.child,t!==null))for(oh(t,n,a,s),t=t.sibling;t!==null;)oh(t,n,a,s),t=t.sibling}function dc(t,n,a,s){var c=t.tag;if(c===5||c===6)c=t.stateNode,n?a.insertBefore(c,n):a.appendChild(c),hc(t,s),Oe=!0;else if(c!==4&&(c===27&&(hc(t,s),s=null,Za(t.type)&&(a=t.stateNode)),t=t.child,t!==null))for(dc(t,n,a,s),t=t.sibling;t!==null;)dc(t,n,a,s),t=t.sibling}function yg(t){var n=t.stateNode,a=t.memoizedProps;try{for(var s=t.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);Dn(n,s,a),n[Pt]=t,n[Jt]=a}catch(u){Ve(t,t.return,u)}}var pc=!1,ai=null;function Sg(t){(t.tag===30||(t.subtreeFlags&33554432)!==0)&&(pc=!0)}var ki=null;function Mg(){var t=ki;return ki=null,t}var Yn=0;function yr(t,n,a,s,c){return Yn=0,Eg(t.child,n,a,s,c)}function Eg(t,n,a,s,c){for(var u=!1;t!==null;){if(t.tag===5){var _=t.stateNode;if(s!==null){var T=jh(_);s.push(T),T.view&&(u=!0)}else u||jh(_).view&&(u=!0);pc=!0,M_(_,Yn===0?n:n+"_"+Yn,a),Yn++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&c||Eg(t.child,n,a,s,c)&&(u=!0));t=t.sibling}return u}function ji(t,n){for(;t!==null;)t.tag===5?E_(t.stateNode,t.memoizedProps):(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&n||ji(t.child,n)),t=t.sibling}function mc(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if((t.tag!==22||t.memoizedState===null)&&(mc(t),t.tag===30&&(t.flags&18874368)!==0&&t.stateNode.paired)){var n=t.memoizedProps;if(n.name==null||n.name==="auto")throw Error(r(544));var a=n.name;n=oa(n.default,n.share),n!=="none"&&(yr(t,a,n,null,!1)||ji(t.child,!1))}t=t.sibling}}function lh(t,n){if(t.tag===30){var a=t.stateNode,s=t.memoizedProps,c=ra(s,a),u=oa(s.default,a.paired?s.share:s.enter);u!=="none"?yr(t,c,u,null,!1)?(mc(t),a.paired||n||Cr(t,s.onEnter)):ji(t.child,!1):mc(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)lh(t,n),t=t.sibling;else mc(t)}function ch(t){if(ai!==null&&ai.size!==0){var n=ai;if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var a=t.memoizedProps,s=a.name;if(s!=null&&s!=="auto"){var c=n.get(s);if(c!==void 0){var u=oa(a.default,a.share);if(u!=="none"&&(yr(t,s,u,null,!1)?(u=t.stateNode,c.paired=u,u.paired=c,Cr(t,a.onShare)):ji(t.child,!1)),n.delete(s),n.size===0)break}}}ch(t)}t=t.sibling}}}function uh(t){if(t.tag===30){var n=t.memoizedProps,a=ra(n,t.stateNode),s=ai!==null?ai.get(a):void 0,c=oa(n.default,s!==void 0?n.share:n.exit);c!=="none"&&(yr(t,a,c,null,!1)?s!==void 0?(c=t.stateNode,s.paired=c,c.paired=s,ai.delete(a),Cr(t,n.onShare)):Cr(t,n.onExit):ji(t.child,!1)),ai!==null&&ch(t)}else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)uh(t),t=t.sibling;else ai!==null&&ch(t)}function bg(t){for(t=t.child;t!==null;){if(t.tag===30){var n=t.memoizedProps,a=ra(n,t.stateNode);n=oa(n.default,n.update),t.flags&=-5,n!=="none"&&yr(t,a,n,t.memoizedState=[],!1)}else(t.subtreeFlags&33554432)!==0&&bg(t);t=t.sibling}}function fh(t){if((t.subtreeFlags&18874368)!==0)for(t=t.child;t!==null;){if(t.tag!==22||t.memoizedState===null){if(t.tag===30&&(t.flags&18874368)!==0){var n=t.stateNode;n.paired!==null&&(n.paired=null,ji(t.child,!1))}fh(t)}t=t.sibling}}function gc(t){if(t.tag===30)t.stateNode.paired=null,ji(t.child,!1),fh(t);else if((t.subtreeFlags&33554432)!==0)for(t=t.child;t!==null;)gc(t),t=t.sibling;else fh(t)}function Tg(t){for(t=t.child;t!==null;)t.tag===30?ji(t.child,!1):(t.subtreeFlags&33554432)!==0&&Tg(t),t=t.sibling}function hh(t,n,a,s,c,u,_){for(var T=!1;n!==null;){if(n.tag===5){var I=n.stateNode;if(u!==null&&Yn<u.length){var J=u[Yn],rt=jh(I);(J.view||rt.view)&&(T=!0);var xt;if(xt=(t.flags&4)===0)if(rt.clip)xt=!0;else{xt=J.rect;var W=rt.rect;xt=xt.y!==W.y||xt.x!==W.x||xt.height!==W.height||xt.width!==W.width}xt&&(t.flags|=4),rt.abs?rt=!J.abs:(J=J.rect,rt=rt.rect,rt=J.height!==rt.height||J.width!==rt.width),rt&&(t.flags|=32)}else t.flags|=32;(t.flags&4)!==0&&M_(I,Yn===0?a:a+"_"+Yn,c),T&&(t.flags&4)!==0||(ki===null&&(ki=[]),ki.push(I,Yn===0?s:s+"_"+Yn,n.memoizedProps)),Yn++}else(n.tag!==22||n.memoizedState===null)&&(n.tag===30&&_?t.flags|=n.flags&32:hh(t,n.child,a,s,c,u,_)&&(T=!0));n=n.sibling}return T}function Ag(t,n){for(t=t.child;t!==null;){if(t.tag===30){var a=t.memoizedProps,s=t.stateNode,c=ra(a,s),u=oa(a.default,a.update),_;_=t.memoizedState,t.memoizedState=null,s=t;var T=t.child;Yn=0,c=hh(s,T,c,c,u,_,!1),(t.flags&4)!==0&&c&&Cr(t,a.onUpdate)}else(t.subtreeFlags&33554432)!==0&&Ag(t);t=t.sibling}}var En=!1,He=!1,Xi=!1,dh=!1,Rg=typeof WeakSet=="function"?WeakSet:Set,bn=null,Yi=!1,Go=!1,_c=!1,ph=!1;function QS(t,n,a){if(t=t.containerInfo,Fh=Br,t=Nm(t),$u(t)){if("selectionStart"in t)var s={start:t.selectionStart,end:t.selectionEnd};else t:{s=(s=t.ownerDocument)&&s.defaultView||window;var c=s.getSelection&&s.getSelection();if(c&&c.rangeCount!==0){s=c.anchorNode;var u=c.anchorOffset,_=c.focusNode;c=c.focusOffset;try{s.nodeType,_.nodeType}catch{s=null;break t}var T=0,I=-1,J=-1,rt=0,xt=0,W=t,at=null;e:for(;;){for(var Bt;W!==s||u!==0&&W.nodeType!==3||(I=T+u),W!==_||c!==0&&W.nodeType!==3||(J=T+c),W.nodeType===3&&(T+=W.nodeValue.length),(Bt=W.firstChild)!==null;)at=W,W=Bt;for(;;){if(W===t)break e;if(at===s&&++rt===u&&(I=T),at===_&&++xt===c&&(J=T),(Bt=W.nextSibling)!==null)break;W=at,at=W.parentNode}W=Bt}s=I===-1||J===-1?null:{start:I,end:J}}else s=null}s=s||{start:0,end:0}}else s=null;for(Hh={focusedElem:t,selectionRange:s},Br=!1,a=(a&335544064)===a,bn=n,n=a?9270:1024;bn!==null;){if(t=bn,a&&(s=t.deletions,s!==null))for(u=0;u<s.length;u++)a&&uh(s[u]);if(t.alternate===null&&(t.flags&2)!==0)a&&Sg(t),vc(a);else{if(t.tag===22){if(s=t.alternate,t.memoizedState!==null){s!==null&&s.memoizedState===null&&a&&uh(s),vc(a);continue}else if(s!==null&&s.memoizedState!==null){a&&Sg(t),vc(a);continue}}s=t.child,(t.subtreeFlags&n)!==0&&s!==null?(s.return=t,bn=s):(a&&bg(t),vc(a))}}ai=null}function vc(t){for(;bn!==null;){var n=bn,a=t,s=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 15:break;case 1:if((c&1024)!==0&&s!==null){a=void 0,c=s.memoizedProps,s=s.memoizedState;var u=n.stateNode;try{var _=Ns(n.type,c);a=u.getSnapshotBeforeUpdate(_,s),u.__reactInternalSnapshotBeforeUpdate=a}catch(T){Ve(n,n.return,T)}}break;case 3:if((c&1024)!==0){if(s=n.stateNode.containerInfo,a=s.nodeType,a===9)qh(s);else if(a===1)switch(s.nodeName){case"HEAD":case"HTML":case"BODY":qh(s);break;default:s.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:a&&s!==null&&(a=ra(s.memoizedProps,s.stateNode),c=n.memoizedProps,c=oa(c.default,c.update),c!=="none"&&yr(s,a,c,s.memoizedState=[],!0));break;default:if((c&1024)!==0)throw Error(r(163))}if(s=n.sibling,s!==null){s.return=n.return,bn=s;break}bn=n.return}}function Cg(t,n,a){var s=a.flags;switch(a.tag){case 0:case 11:case 15:qi(t,a),s&4&&Fo(5,a);break;case 1:if(qi(t,a),s&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(_){Ve(a,a.return,_)}else{var c=Ns(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(c,n,t.__reactInternalSnapshotBeforeUpdate)}catch(_){Ve(a,a.return,_)}}s&64&&gg(a),s&512&&Vi(a,a.return);break;case 3:if(qi(t,a),s&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{s0(t,n)}catch(_){Ve(a,a.return,_)}}break;case 27:n===null&&s&4&&yg(a);case 26:case 5:qi(t,a),n===null&&s&4&&ah(a),s&512&&Vi(a,a.return);break;case 12:qi(t,a);break;case 31:qi(t,a),s&4&&Ug(t,a);break;case 13:qi(t,a),s&4&&Lg(t,a),s&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=cM.bind(null,a),jM(t,a))));break;case 22:if(s=a.memoizedState!==null||En,!s){var u=n!==null&&n.memoizedState!==null||He;n=En,c=He,En=s,(He=u)&&!c?(s=2,(a.subtreeFlags&8772)!==0&&(s|=1),Ci(t,a,s)):qi(t,a),En=n,He=c}break;case 30:qi(t,a),s&512&&Vi(a,a.return);break;case 7:s&512&&Vi(a,a.return);default:qi(t,a)}}function mh(t,n){for(t=t.child;t!==null;)wg(t,n),t=t.sibling}function wg(t,n){switch(t.tag){case 5:case 26:try{var a=t.stateNode;if(n){var s=a.style;typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"}else{var c=t.stateNode,u=t.memoizedProps.style,_=u!=null&&u.hasOwnProperty("display")?u.display:null;c.style.display=_==null||typeof _=="boolean"?"":(""+_).trim()}}catch(I){Ve(t,t.return,I)}gh(t,n);break;case 6:try{t.stateNode.nodeValue=n?"":t.memoizedProps,Oe=!0}catch(I){Ve(t,t.return,I)}break;case 18:try{var T=t.stateNode;n?S_(T,!0):S_(t.stateNode,!1)}catch(I){Ve(t,t.return,I)}break;case 22:case 23:t.memoizedState===null&&mh(t,n);break;default:mh(t,n)}}function gh(t,n){if(t.subtreeFlags&67108864)for(t=t.child;t!==null;){t:{var a=t,s=n;switch(a.tag){case 4:wg(a,s);break t;case 22:a.memoizedState===null&&gh(a,s);break t;default:gh(a,s)}}t=t.sibling}}function Dg(t){var n=t.alternate;n!==null&&(t.alternate=null,Dg(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&re(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var $e=null,qn=!1;function Ai(t,n,a){for(a=a.child;a!==null;)Ng(t,n,a),a=a.sibling}function Ng(t,n,a){if(en&&typeof en.onCommitFiberUnmount=="function")try{en.onCommitFiberUnmount(Ce,a)}catch{}switch(a.tag){case 26:He||wn(a,n),Ai(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&!He&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:He||wn(a,n),Ho(a);var s=$e,c=qn;Za(a.type)&&($e=a.stateNode,qn=!1),Ai(t,n,a),P_(a.stateNode,a.type,a.memoizedProps),$e=s,qn=c;break;case 5:He||wn(a,n),Ho(a);case 6:if(a.tag===6&&Ho(a),s=$e,c=qn,$e=null,Ai(t,n,a),$e=s,qn=c,$e!==null)if(qn)try{($e.nodeType===9?$e.body:$e.nodeName==="HTML"?$e.ownerDocument.body:$e).removeChild(a.stateNode),Oe=!0}catch(u){Ve(a,n,u)}else try{$e.removeChild(a.stateNode),Oe=!0}catch(u){Ve(a,n,u)}break;case 18:$e!==null&&(qn?(t=$e,y_(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),Fr(t)):y_($e,a.stateNode));break;case 4:s=$e,c=qn,$e=a.stateNode.containerInfo,qn=!0,Ai(t,n,a),$e=s,qn=c;break;case 0:case 11:case 14:case 15:Va(2,a,n),He||Va(4,a,n),Ai(t,n,a);break;case 1:He||(wn(a,n),s=a.stateNode,typeof s.componentWillUnmount=="function"&&_g(a,n,s)),Ai(t,n,a);break;case 21:Ai(t,n,a);break;case 22:He=(s=He)||a.memoizedState!==null,Ai(t,n,a),He=s;break;case 30:wn(a,n),Ai(t,n,a);break;case 7:He||wn(a,n),Ai(t,n,a);break;default:Ai(t,n,a)}}function Ug(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Fr(t)}catch(a){Ve(n,n.return,a)}}}function Lg(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Fr(t)}catch(a){Ve(n,n.return,a)}}function JS(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new Rg),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new Rg),n;default:throw Error(r(435,t.tag))}}function xc(t,n){var a=JS(t);n.forEach(function(s){if(!a.has(s)){a.add(s);var c=uM.bind(null,t,s);s.then(c,c)}})}function Gn(t,n,a){var s=n.deletions;if(s!==null)for(var c=0;c<s.length;c++){var u=s[c],_=t,T=n,I=T;t:for(;I!==null;){switch(I.tag){case 27:if(Za(I.type)){$e=I.stateNode,qn=!1;break t}break;case 5:$e=I.stateNode,qn=!1;break t;case 3:case 4:$e=I.stateNode.containerInfo,qn=!0;break t}I=I.return}if($e===null)throw Error(r(160));Ng(_,T,u),$e=null,qn=!1,_=u.alternate,_!==null&&(_.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)Og(n,t,a),n=n.sibling}var Ri=null;function Og(t,n,a){var s=t.alternate,c=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(c&4&&(s=t.updateQueue,s=s!==null?s.events:null,s!==null))for(var u=0;u<s.length;u++){var _=s[u];_.ref.impl=_.nextImpl}Gn(n,t,a),Vn(t),c&4&&(Va(3,t,t.return),Fo(3,t),Va(5,t,t.return));break;case 1:Gn(n,t,a),Vn(t),c&512&&(He||s===null||wn(s,s.return)),c&64&&En&&(t=t.updateQueue,t!==null&&(n=t.callbacks,n!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?n:a.concat(n))));break;case 26:if(u=Ri,Gn(n,t,a),Vn(t),c&512&&(He||s===null||wn(s,s.return)),c&4)if(c=s!==null?s.memoizedState:null,a=t.memoizedState,s===null)if(a===null)if(t.stateNode===null)if(En)t.stateNode=__(t.type,t.memoizedProps,n.containerInfo,t);else{t:{n=t.type,a=t.memoizedProps,c=u.ownerDocument||u;e:switch(n){case"title":s=c.getElementsByTagName("title")[0],(!s||s[ze]||s[Pt]||s.namespaceURI==="http://www.w3.org/2000/svg"||s.hasAttribute("itemprop"))&&(s=c.createElement(n),c.head.insertBefore(s,c.querySelector("head > title"))),Dn(s,n,a),s[Pt]=t,Le(s),n=s;break t;case"link":if(u=G_("link","href",c).get(n+(a.href||""))){for(_=0;_<u.length;_++)if(s=u[_],s.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&s.getAttribute("rel")===(a.rel==null?null:a.rel)&&s.getAttribute("title")===(a.title==null?null:a.title)&&s.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){u.splice(_,1);break e}}s=c.createElement(n),Dn(s,n,a),c.head.appendChild(s);break;case"meta":if(u=G_("meta","content",c).get(n+(a.content||""))){for(_=0;_<u.length;_++)if(s=u[_],s.getAttribute("content")===(a.content==null?null:""+a.content)&&s.getAttribute("name")===(a.name==null?null:a.name)&&s.getAttribute("property")===(a.property==null?null:a.property)&&s.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&s.getAttribute("charset")===(a.charSet==null?null:a.charSet)){u.splice(_,1);break e}}s=c.createElement(n),Dn(s,n,a),c.head.appendChild(s);break;default:throw Error(r(468,n))}s[Pt]=t,Le(s),n=s}t.stateNode=n}else En||td(u,t.type,t.stateNode);else t.stateNode=H_(u,a,t.memoizedProps);else c!==a?(c===null?(n=s.stateNode,n===null||He||n.parentNode.removeChild(n)):c.count--,a===null?En||td(u,t.type,t.stateNode):H_(u,a,t.memoizedProps)):a===null&&t.stateNode!==null&&sh(t,t.memoizedProps,s.memoizedProps);break;case 27:Gn(n,t,a),Vn(t),c&512&&(He||s===null||wn(s,s.return)),s!==null&&c&4&&sh(t,t.memoizedProps,s.memoizedProps);break;case 5:if(u=Xi,Xi=!1,Gn(n,t,a),Xi=u,Vn(t),c&512&&(He||s===null||wn(s,s.return)),t.flags&32){n=t.stateNode;try{nr(n,""),Oe=!0}catch(rt){Ve(t,t.return,rt)}}c&4&&t.stateNode!=null&&(n=t.memoizedProps,sh(t,n,s!==null?s.memoizedProps:n)),c&1024&&(dh=!0);break;case 6:if(Gn(n,t,a),Vn(t),c&4){if(t.stateNode===null)throw Error(r(162));n=t.memoizedProps,a=t.stateNode;try{a.nodeValue=n,Oe=!0}catch(rt){Ve(t,t.return,rt)}}break;case 3:if(Oe=!1,Oc=null,u=Ri,Ri=Ko(n.containerInfo),Gn(n,t,a),Ri=u,Vn(t),c&4&&s!==null&&s.memoizedState.isDehydrated)try{Fr(n.containerInfo)}catch(rt){Ve(t,t.return,rt)}dh&&(dh=!1,Pg(t)),Oe=!1;break;case 4:c=Xi,Xi=En,s=em(),u=Ri,Ri=Ko(t.stateNode.containerInfo),Gn(n,t,a),Vn(t),Ri=u,Oe&&Go&&(_c=!0),Oe=s,Xi=c;break;case 12:Gn(n,t,a),Vn(t);break;case 31:Gn(n,t,a),Vn(t),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,xc(t,n)));break;case 13:Gn(n,t,a),Vn(t),t.child.flags&8192&&t.memoizedState!==null!=(s!==null&&s.memoizedState!==null)&&(Mc=j()),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,xc(t,n)));break;case 22:u=t.memoizedState!==null,_=s!==null&&s.memoizedState!==null;var T=En,I=He,J=Xi;En=T||u,Xi=J||u,He=I||_,Gn(n,t,a),He=I,Xi=J,En=T,Vn(t),c&8192&&(n=t.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,!u||s===null||_||En||He||(n=_||He,a=En,s=He,En=u||En,He=n,ka(t,2),En=a,He=s),!u&&Xi||mh(t,u)),c&4&&(n=t.updateQueue,n!==null&&(a=n.retryQueue,a!==null&&(n.retryQueue=null,xc(t,a))));break;case 19:Gn(n,t,a),Vn(t),c&4&&(n=t.updateQueue,n!==null&&(t.updateQueue=null,xc(t,n)));break;case 30:c&512&&(He||s===null||wn(s,s.return)),c=em(),u=Go,_=(a&335544064)===a,T=t.memoizedProps,Go=_&&oa(T.default,T.update)!=="none",Gn(n,t,a),Vn(t),_&&s!==null&&Oe&&(t.flags|=4),Go=u,Oe=c;break;case 21:break;case 7:c&512&&(He||s===null||wn(s,s.return)),s&&s.stateNode!==null&&(s.stateNode._fragmentFiber=t);default:Gn(n,t,a),Vn(t)}}function Vn(t){var n=t.flags;if(n&2){try{for(var a,s=t.return;s!==null;){if(xg(s)){a=s;break}s=s.return}s=null;for(var c=t.return;c!==null;){if(ih(c)){var u=c.stateNode;s===null?s=[u]:s.push(u)}if(nh(c))break;c=c.return}var _=s;if(a==null)throw Error(r(160));switch(a.tag){case 27:var T=a.stateNode,I=rh(t);dc(t,I,T,_);break;case 5:var J=a.stateNode;a.flags&32&&(nr(J,""),a.flags&=-33);var rt=rh(t);dc(t,rt,J,_);break;case 3:case 4:var xt=a.stateNode.containerInfo,W=rh(t);oh(t,W,xt,_);break;default:throw Error(r(161))}}catch(at){Ve(t,t.return,at)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function Pg(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;Pg(n),n.tag===5&&n.flags&1024&&(n=n.stateNode,Br=!0,n.reset(),Br=!1),t=t.sibling}}function Sr(t,n){if(n.subtreeFlags&9270)for(n=n.child;n!==null;)zg(n,t),n=n.sibling;else Ag(n)}function zg(t,n){var a=t.alternate;if(a===null)lh(t,!1);else switch(t.tag){case 3:if(ph=Yi=!1,Mg(),Sr(n,t),!Yi&&!_c){if(t=ki,t!==null)for(var s=0;s<t.length;s+=3){a=t[s];var c=t[s+1];E_(a,t[s+2]),a=a.ownerDocument.documentElement,a!==null&&a.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group("+c+")"})}t=n.containerInfo,t=t.nodeType===9?t.documentElement:t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName===""&&(t.style.viewTransitionName="none",t.animate({opacity:[0,0],pointerEvents:["none","none"]},{duration:0,fill:"forwards",pseudoElement:"::view-transition-group(root)"}),t.animate({width:[0,0],height:[0,0]},{duration:0,fill:"forwards",pseudoElement:"::view-transition"})),ph=!0}ki=null;break;case 5:Sr(n,t);break;case 4:s=Yi,Yi=!1,Sr(n,t),Yi&&(_c=!0),Yi=s;break;case 22:t.memoizedState===null&&(a.memoizedState!==null?lh(t,!1):Sr(n,t));break;case 30:s=Yi,c=Mg(),Yi=!1,Sr(n,t),Yi&&(t.flags|=4);var u=t.memoizedProps,_=t.stateNode;n=ra(u,_),_=ra(a.memoizedProps,_);var T=oa(u.default,u.update);T==="none"?n=!1:(u=a.memoizedState,a.memoizedState=null,a=t.child,Yn=0,n=hh(t,a,n,_,T,u,!0),Yn!==(u===null?0:u.length)&&(t.flags|=32)),(t.flags&4)!==0&&n?(Cr(t,t.memoizedProps.onUpdate),ki=c):c!==null&&(c.push.apply(c,ki),ki=c),Yi=(t.flags&32)!==0?!0:s;break;default:Sr(n,t)}}function qi(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)Cg(t,n.alternate,n),n=n.sibling}function ka(t,n){for(t=t.child;t!==null;){var a=t,s=n;switch(a.tag){case 0:case 11:case 14:case 15:Va(4,a,a.return),ka(a,s);break;case 1:wn(a,a.return);var c=a.stateNode;typeof c.componentWillUnmount=="function"&&_g(a,a.return,c),ka(a,s);break;case 27:(s&2)!==0&&P_(a.stateNode,a.type,a.memoizedProps);case 5:wn(a,a.return),a.tag!==5&&a.tag!==27||Ho(a),ka(a,s);break;case 6:Ho(a);break;case 26:wn(a,a.return),c=a.stateNode,a.memoizedState!==null||c===null||He||c.parentNode.removeChild(c),ka(a,s);break;case 22:a.memoizedState===null&&ka(a,s);break;case 30:wn(a,a.return),ka(a,s);break;case 7:wn(a,a.return);default:ka(a,s)}t=t.sibling}}function Ci(t,n,a){for(a=(n.subtreeFlags&8772)!==0?a:a&-2,n=n.child;n!==null;){var s=n.alternate,c=t,u=n,_=u.flags,T=(a&1)!==0;switch(u.tag){case 0:case 11:case 15:Ci(c,u,a),Fo(4,u);break;case 1:if(Ci(c,u,a),s=u,c=s.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(rt){Ve(s,s.return,rt)}if(s=u,c=s.updateQueue,c!==null){var I=s.stateNode;try{var J=c.shared.hiddenCallbacks;if(J!==null)for(c.shared.hiddenCallbacks=null,c=0;c<J.length;c++)a0(J[c],I)}catch(rt){Ve(s,s.return,rt)}}T&&_&64&&gg(u),Vi(u,u.return);break;case 27:(a&2)!==0&&yg(u);case 5:u.tag!==5&&u.tag!==27||vg(u),Ci(c,u,a),T&&s===null&&_&4&&ah(u),Vi(u,u.return);break;case 6:vg(u);break;case 26:I=u.stateNode,u.memoizedState!==null||I===null||En||td(Ko(I.ownerDocument),u.type,I),Ci(c,u,a),T&&s===null&&_&4&&ah(u),Vi(u,u.return);break;case 12:Ci(c,u,a);break;case 31:Ci(c,u,a),T&&_&4&&Ug(c,u);break;case 13:Ci(c,u,a),T&&_&4&&Lg(c,u);break;case 22:u.memoizedState===null&&Ci(c,u,a),Vi(u,u.return);break;case 30:Ci(c,u,a),Vi(u,u.return);break;case 7:Vi(u,u.return);default:Ci(c,u,a)}n=n.sibling}}function _h(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&Ao(a))}function vh(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&Ao(t))}function vi(t,n,a,s){var c=(a&335544064)===a;if(n.subtreeFlags&(c?10262:10256))for(n=n.child;n!==null;)Ig(t,n,a,s),n=n.sibling;else c&&Tg(n)}function Ig(t,n,a,s){var c=(a&335544064)===a;c&&n.alternate===null&&n.return!==null&&n.return.alternate!==null&&gc(n);var u=n.flags;switch(n.tag){case 0:case 11:case 15:vi(t,n,a,s),u&2048&&Fo(9,n);break;case 1:vi(t,n,a,s);break;case 3:vi(t,n,a,s),c&&ph&&(t=t.containerInfo,t=t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,t.style.viewTransitionName==="root"&&(t.style.viewTransitionName=""),t=t.ownerDocument.documentElement,t!==null&&t.style.viewTransitionName==="none"&&(t.style.viewTransitionName="")),u&2048&&(u=null,n.alternate!==null&&(u=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==u&&(n.refCount++,u!=null&&Ao(u)));break;case 12:if(u&2048){vi(t,n,a,s),u=n.stateNode;try{var _=n.memoizedProps,T=_.id,I=_.onPostCommit;typeof I=="function"&&I(T,n.alternate===null?"mount":"update",u.passiveEffectDuration,-0)}catch(J){Ve(n,n.return,J)}}else vi(t,n,a,s);break;case 31:vi(t,n,a,s);break;case 13:vi(t,n,a,s);break;case 23:break;case 22:_=n.stateNode,T=n.alternate,n.memoizedState!==null?(c&&T!==null&&T.memoizedState===null&&gc(T),_._visibility&2?vi(t,n,a,s):Vo(t,n)):(c&&T!==null&&T.memoizedState!==null&&gc(n),_._visibility&2?vi(t,n,a,s):(_._visibility|=2,Mr(t,n,a,s,(n.subtreeFlags&10256)!==0||!1))),u&2048&&_h(T,n);break;case 24:vi(t,n,a,s),u&2048&&vh(n.alternate,n);break;case 30:c&&(u=n.alternate,u!==null&&(ji(u.child,!0),ji(n.child,!0))),vi(t,n,a,s);break;default:vi(t,n,a,s)}}function Mr(t,n,a,s,c){for(c=c&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var u=t,_=n,T=a,I=s,J=_.flags;switch(_.tag){case 0:case 11:case 15:Mr(u,_,T,I,c),Fo(8,_);break;case 23:break;case 22:var rt=_.stateNode;_.memoizedState!==null?rt._visibility&2?Mr(u,_,T,I,c):Vo(u,_):(rt._visibility|=2,Mr(u,_,T,I,c)),c&&J&2048&&_h(_.alternate,_);break;case 24:Mr(u,_,T,I,c),c&&J&2048&&vh(_.alternate,_);break;default:Mr(u,_,T,I,c)}n=n.sibling}}function Vo(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,s=n,c=s.flags;switch(s.tag){case 22:Vo(a,s),c&2048&&_h(s.alternate,s);break;case 24:Vo(a,s),c&2048&&vh(s.alternate,s);break;default:Vo(a,s)}n=n.sibling}}var Us=8192;function Ls(t,n,a){if(t.subtreeFlags&Us)for(t=t.child;t!==null;)Bg(t,n,a),t=t.sibling}function Bg(t,n,a){switch(t.tag){case 26:Ls(t,n,a),t.flags&Us&&(t.memoizedState!==null?aE(a,Ri,t.memoizedState,t.memoizedProps):(t=t.stateNode,(n&335544128)===n&&X_(a,t)));break;case 5:Ls(t,n,a),t.flags&Us&&(t=t.stateNode,(n&335544128)===n&&X_(a,t));break;case 3:case 4:var s=Ri;Ri=Ko(t.stateNode.containerInfo),Ls(t,n,a),Ri=s;break;case 22:t.memoizedState===null&&(s=t.alternate,s!==null&&s.memoizedState!==null?(s=Us,Us=16777216,Ls(t,n,a),Us=s):Ls(t,n,a));break;case 30:if((t.flags&Us)!==0&&(s=t.memoizedProps.name,s!=null&&s!=="auto")){var c=t.stateNode;c.paired=null,ai===null&&(ai=new Map),ai.set(s,c)}Ls(t,n,a);break;default:Ls(t,n,a)}}function Fg(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function ko(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];bn=s,Gg(s,t)}Fg(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Hg(t),t=t.sibling}function Hg(t){switch(t.tag){case 0:case 11:case 15:ko(t),t.flags&2048&&Va(9,t,t.return);break;case 3:ko(t);break;case 12:ko(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,yc(t)):ko(t);break;default:ko(t)}}function yc(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];bn=s,Gg(s,t)}Fg(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:Va(8,n,n.return),yc(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,yc(n));break;default:yc(n)}t=t.sibling}}function Gg(t,n){for(;bn!==null;){var a=bn;switch(a.tag){case 0:case 11:case 15:Va(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var s=a.memoizedState.cachePool.pool;s!=null&&s.refCount++}break;case 24:Ao(a.memoizedState.cache)}if(s=a.child,s!==null)s.return=a,bn=s;else t:for(a=t;bn!==null;){s=bn;var c=s.sibling,u=s.return;if(Dg(s),s===a){bn=null;break t}if(c!==null){c.return=u,bn=c;break t}bn=u}}}var $S={getCacheForType:function(t){var n=An(fn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a},cacheSignal:function(){return An(fn).controller.signal}},tM=typeof WeakMap=="function"?WeakMap:Map,Be=0,We=null,Te=null,we=0,Ge=0,si=null,ja=!1,Er=!1,xh=!1,ga=0,on=0,Xa=0,Os=0,Sc=0,ri=0,br=0,jo=null,Wn=null,yh=!1,Mc=0,Vg=0,Ec=1/0,bc=null,Ya=null,nn=0,wi=null,Ps=null,Wi=0,Sh=0,Mh=null,kg=null,Tr=null,Ar=null,Rr=null,Xo=0,Tc=null;function oi(){return(Be&2)!==0&&we!==0?we&-we:ut.T!==null?Uh():Ut()}function jg(){if(ri===0)if((we&536870912)===0||Me){var t=ia;ia<<=1,(ia&3932160)===0&&(ia=262144),ri=t}else ri=536870912;return t=Rn.current,t!==null&&(t.flags|=32),ri}function Cr(t,n){if(n!=null){var a=t.stateNode,s=a.ref;s===null&&(s=a.ref=b_(ra(t.memoizedProps,a))),Ar===null&&(Ar=[]),Ar.push(n.bind(null,s))}}function Zn(t,n,a){(t===We&&(Ge===2||Ge===9)||t.cancelPendingCommit!==null)&&(wr(t,0),qa(t,we,ri,!1)),gs(t,a),((Be&2)===0||t!==We)&&(t===We&&((Be&2)===0&&(Os|=a),on===4&&qa(t,we,ri,!1)),Zi(t))}function Xg(t,n,a){if((Be&6)!==0)throw Error(r(327));var s=!a&&(n&127)===0&&(n&t.expiredLanes)===0||Ra(t,n),c=s?iM(t,n):bh(t,n,!0),u=s;do{if(c===0){Er&&!s&&qa(t,n,0,!1);break}else{if(a=t.current.alternate,u&&!eM(a)){c=bh(t,n,!1),u=!1;continue}if(c===2){if(u=n,t.errorRecoveryDisabledLanes&u)var _=0;else _=t.pendingLanes&-536870913,_=_!==0?_:_&536870912?536870912:0;if(_!==0){n=_;t:{var T=t;c=jo;var I=T.current.memoizedState.isDehydrated;if(I&&(wr(T,_).flags|=256),_=bh(T,_,!1),_!==2&&_!==6){if(xh&&!I){T.errorRecoveryDisabledLanes|=u,Os|=u,c=4;break t}u=Wn,Wn=c,u!==null&&(Wn===null?Wn=u:Wn.push.apply(Wn,u))}c=_}if(u=!1,c!==2)continue}}if(c===1){wr(t,0),qa(t,n,0,!0);break}t:{switch(s=t,u=c,u){case 0:case 1:throw Error(r(345));case 4:if((n&4194048)!==n&&(n&62914560)!==n)break;case 6:qa(s,n,ri,!ja);break t;case 2:Wn=null;break;case 3:case 5:break;default:throw Error(r(329))}if((n&62914560)===n&&(c=Mc+300-j(),10<c)){if(qa(s,n,ri,!ja),ms(s,0,!0)!==0)break t;Wi=n,s.timeoutHandle=kh(Yg.bind(null,s,a,Wn,bc,yh,n,ri,Os,br,ja,u,"Throttled",-0,0),c);break t}Yg(s,a,Wn,bc,yh,n,ri,Os,br,ja,u,null,-0,0)}}break}while(!0);Zi(t)}function Yg(t,n,a,s,c,u,_,T,I,J,rt,xt,W,at){t.timeoutHandle=-1;var Bt=n.subtreeFlags,$t=(u&335544064)===u;if(xt=null,($t||Bt&8192||(Bt&16785408)===16785408)&&(xt={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Fi},ai=null,Bg(n,u,xt),$t&&(Bt=xt,$t=t.containerInfo,$t=($t.nodeType===9?$t:$t.ownerDocument).__reactViewTransition,$t!=null&&(Bt.count++,Bt.waitingForViewTransition=!0,Bt=$o.bind(Bt),$t.finished.then(Bt,Bt))),Bt=(u&62914560)===u?Mc-j():(u&4194048)===u?Vg-j():0,Bt=sE(xt,Bt),Bt!==null)){Wi=u,t.cancelPendingCommit=Bt(t_.bind(null,t,n,u,a,s,c,_,T,I,J,rt,xt,null,W,at)),qa(t,u,_,!J);return}t_(t,n,u,a,s,c,_,T,I,J,rt,xt)}function eM(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var s=0;s<a.length;s++){var c=a[s],u=c.getSnapshot;c=c.value;try{if(!ni(u(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function qa(t,n,a,s){n=Ml(t,n),n&=~Sc,n&=~Os,t.suspendedLanes|=n,t.pingedLanes&=~n,s&&(t.warmLanes|=n),s=t.expirationTimes;for(var c=n;0<c;){var u=31-Ln(c),_=1<<u;s[u]=-1,c&=~_}a!==0&&C(t,a,n)}function Ac(){return(Be&6)===0?(Yo(0),!1):!0}function Eh(){if(Te!==null){if(Ge===0)var t=Te.return;else t=Te,ua=Ms=null,Nf(t),mr=null,wo=0,t=Te;for(;t!==null;)mg(t.alternate,t),t=t.return;Te=null}}function wr(t,n){var a=t.timeoutHandle;return a!==-1&&(t.timeoutHandle=-1,TM(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),Wi=0,Eh(),We=t,Te=a=la(t.current,null),we=n,Ge=0,si=null,ja=!1,Er=Ra(t,n),xh=!1,br=ri=Sc=Os=Xa=on=0,Wn=jo=null,yh=!1,ga=Ml(t,n),Ol(),a}function qg(t,n){_e=null,ut.H=sc,n===pr||n===Xl?(n=t0(),Ge=3):n===vf?(n=t0(),Ge=4):Ge=n===Yf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,si=n,Te===null&&(on=1,rc(t,pi(n,t.current)))}function Wg(){var t=Rn.current;return t===null?!0:(we&4194048)===we?Pn===null:(we&62914560)===we||(we&536870912)!==0?t===Pn:!1}function Zg(){var t=ut.H;return ut.H=sc,t===null?sc:t}function Kg(){var t=ut.A;return ut.A=$S,t}function Rc(){on=4,ja||(we&4194048)!==we&&Rn.current!==null||(Er=!0),(Xa&134217727)===0&&(Os&134217727)===0||We===null||qa(We,we,ri,!1)}function bh(t,n,a){var s=Be;Be|=2;var c=Zg(),u=Kg();(We!==t||we!==n)&&(bc=null,wr(t,n)),n=!1;var _=on;t:do try{if(Ge!==0&&Te!==null){var T=Te,I=si;switch(Ge){case 8:Eh(),_=6;break t;case 3:case 2:case 9:case 6:Rn.current===null&&(n=!0);var J=Ge;if(Ge=0,si=null,Dr(t,T,I,J),a&&Er){_=0;break t}break;default:J=Ge,Ge=0,si=null,Dr(t,T,I,J)}}nM(),_=on;break}catch(rt){qg(t,rt)}while(!0);return n&&t.shellSuspendCounter++,ua=Ms=null,Be=s,ut.H=c,ut.A=u,Te===null&&(We=null,we=0,Ol()),_}function nM(){for(;Te!==null;)Qg(Te)}function iM(t,n){var a=Be;Be|=2;var s=Zg(),c=Kg();We!==t||we!==n?(bc=null,Ec=j()+500,wr(t,n)):Er=Ra(t,n);t:do try{if(Ge!==0&&Te!==null){n=Te;var u=si;e:switch(Ge){case 1:Ge=0,si=null,Dr(t,n,u,1);break;case 2:case 9:if(Jm(u)){Ge=0,si=null,Jg(n);break}n=function(){Ge!==2&&Ge!==9||We!==t||(Ge=7),Zi(t)},u.then(n,n);break t;case 3:Ge=7;break t;case 4:Ge=5;break t;case 7:Jm(u)?(Ge=0,si=null,Jg(n)):(Ge=0,si=null,Dr(t,n,u,7));break;case 5:var _=null;switch(Te.tag){case 26:_=Te.memoizedState;case 5:case 27:var T=Te;if(_?k_(_):T.stateNode.complete){Ge=0,si=null;var I=T.sibling;if(I!==null)Te=I;else{var J=T.return;J!==null?(Te=J,Cc(J)):Te=null}break e}}Ge=0,si=null,Dr(t,n,u,5);break;case 6:Ge=0,si=null,Dr(t,n,u,6);break;case 8:Eh(),on=6;break t;default:throw Error(r(462))}}aM();break}catch(rt){qg(t,rt)}while(!0);return ua=Ms=null,ut.H=s,ut.A=c,Be=a,Te!==null?0:(We=null,we=0,Ol(),on)}function aM(){for(;Te!==null&&!Vt();)Qg(Te)}function Qg(t){var n=dg(t.alternate,t,ga);t.memoizedProps=t.pendingProps,n===null?Cc(t):Te=n}function Jg(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=rg(a,n,n.pendingProps,n.type,void 0,we);break;case 11:n=rg(a,n,n.pendingProps,n.type.render,n.ref,we);break;case 5:Nf(n);var s=n;s===Mn&&(Me?(Hl(s),s.tag===5&&s.stateNode!=null&&(Ke=s.stateNode)):(Hl(s),Me=!0));default:mg(a,n),n=Te=Gm(n,ga),n=dg(a,n,ga)}t.memoizedProps=t.pendingProps,n===null?Cc(t):Te=n}function Dr(t,n,a,s){ua=Ms=null,Nf(n),mr=null,wo=0;var c=n.return;try{if(XS(t,c,n,a,we)){on=1,rc(t,pi(a,t.current)),Te=null;return}}catch(u){if(c!==null)throw Te=c,u;on=1,rc(t,pi(a,t.current)),Te=null;return}n.flags&32768?(Me||s===1?t=!0:Er||(we&536870912)!==0?t=!1:(ja=t=!0,(s===2||s===9||s===3||s===6)&&(s=Rn.current,s!==null&&s.tag===13&&(s.flags|=16384))),$g(n,t)):Cc(n)}function Cc(t){var n=t;do{if((n.flags&32768)!==0){$g(n,ja);return}t=n.return;var a=ZS(n.alternate,n,ga);if(a!==null){Te=a;return}if(n=n.sibling,n!==null){Te=n;return}Te=n=t}while(n!==null);on===0&&(on=5)}function $g(t,n){do{var a=KS(t.alternate,t);if(a!==null){a.flags&=32767,Te=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){Te=t;return}Te=t=a}while(t!==null);on=6,Te=null}function t_(t,n,a,s,c,u,_,T,I,J,rt,xt){t.cancelPendingCommit=null;do wc();while(nn!==0);if((Be&6)!==0)throw Error(r(327));if(n!==null){if(n===t.current)throw Error(r(177));t===We&&(Te=We=null,we=0),Ps=n,wi=t,Wi=a,Mh=c,kg=s,sM(t,n,a,_,T,I,xt)}}function sM(t,n,a,s,c,u,_){var T=n.lanes|n.childLanes;if(Sh=T,T|=sf,Pu(t,a,T,s,c,u),Ar=null,(a&335544064)===a?(Rr=LS(t),s=10262):(Rr=null,s=10256),(n.subtreeFlags&s)!==0||(n.flags&s)!==0?(t.callbackNode=null,t.callbackPriority=0,fM(wt,function(){return Ch(),null})):(t.callbackNode=null,t.callbackPriority=0),pc=!1,s=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||s){s=ut.T,ut.T=null,c=Ot.p,Ot.p=2,u=Be,Be|=4;try{QS(t,n,a)}finally{Be=u,Ot.p=c,ut.T=s}}nn=1,pc?Tr=NM(_,t.containerInfo,Rr,Th,Ah,oM,Rh,Ch,rM):(Th(),Ah(),Rh())}function rM(t){if(nn!==0){var n=wi.onRecoverableError;n(t,{componentStack:null})}}function oM(){nn===3&&(nn=0,zg(Ps,wi),nn=4)}function Th(){if(nn===1){nn=0;var t=wi,n=Ps,a=Wi,s=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||s){s=ut.T,ut.T=null;var c=Ot.p;Ot.p=2;var u=Be;Be|=4;try{Go=_c=!1,Og(n,t,a),a=Hh;var _=Nm(t.containerInfo),T=a.focusedElem,I=a.selectionRange;if(_!==T&&T&&T.ownerDocument&&Dm(T.ownerDocument.documentElement,T)){if(I!==null&&$u(T)){var J=I.start,rt=I.end;if(rt===void 0&&(rt=J),"selectionStart"in T)T.selectionStart=J,T.selectionEnd=Math.min(rt,T.value.length);else{var xt=T.ownerDocument||document,W=xt&&xt.defaultView||window;if(W.getSelection){var at=W.getSelection(),Bt=T.textContent.length,$t=Math.min(I.start,Bt),ve=I.end===void 0?$t:Math.min(I.end,Bt);!at.extend&&$t>ve&&(_=ve,ve=$t,$t=_);var K=wm(T,$t),k=wm(T,ve);if(K&&k&&(at.rangeCount!==1||at.anchorNode!==K.node||at.anchorOffset!==K.offset||at.focusNode!==k.node||at.focusOffset!==k.offset)){var it=xt.createRange();it.setStart(K.node,K.offset),at.removeAllRanges(),$t>ve?(at.addRange(it),at.extend(k.node,k.offset)):(it.setEnd(k.node,k.offset),at.addRange(it))}}}}for(xt=[],at=T;at=at.parentNode;)at.nodeType===1&&xt.push({element:at,left:at.scrollLeft,top:at.scrollTop});for(typeof T.focus=="function"&&T.focus(),T=0;T<xt.length;T++){var vt=xt[T];vt.element.scrollLeft=vt.left,vt.element.scrollTop=vt.top}}Br=!!Fh,Hh=Fh=null}finally{Be=u,Ot.p=c,ut.T=s}}t.current=n,nn=2}}function Ah(){if(nn===2){nn=0;var t=wi,n=Ps,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=ut.T,ut.T=null;var s=Ot.p;Ot.p=2;var c=Be;Be|=4;try{Cg(t,n.alternate,n)}finally{Be=c,Ot.p=s,ut.T=a}}nn=3}}function Rh(){if(nn===4||nn===3){nn=0;var t=Tr;Tr=null,ge();var n=wi,a=Ps,s=Wi,c=kg,u=(s&335544064)===s?10262:10256;if((a.subtreeFlags&u)!==0||(a.flags&u)!==0?nn=5:(nn=0,Ps=wi=null,e_(n,n.pendingLanes)),u=n.pendingLanes,u===0&&(Ya=null),nt(s),a=a.stateNode,en&&typeof en.onCommitFiberRoot=="function")try{en.onCommitFiberRoot(Ce,a,void 0,(a.current.flags&128)===128)}catch{}if(c!==null){a=ut.T,u=Ot.p,Ot.p=2,ut.T=null;try{for(var _=n.onRecoverableError,T=0;T<c.length;T++){var I=c[T];_(I.value,{componentStack:I.stack})}}finally{ut.T=a,Ot.p=u}}if(c=Ar,_=Rr,Rr=null,c!==null&&(Ar=null,_===null&&(_=[]),t!==null))for(I=0;I<c.length;I++)a=(0,c[I])(_),a!==void 0&&t.finished.finally(a);(Wi&3)!==0&&wc(),Zi(n),u=n.pendingLanes,(s&261930)!==0&&(u&42)!==0?n===Tc?Xo++:(Xo=0,Tc=n):(Xo=0,Tc=null),Yo(0)}}function e_(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,Ao(n)))}function wc(){return Tr!==null&&(Tr.skipTransition(),Tr=null),Th(),Ah(),Rh(),Ch()}function Ch(){if(nn!==5)return!1;var t=wi,n=Sh;Sh=0;var a=nt(Wi),s=ut.T,c=Ot.p;try{Ot.p=32>a?32:a,ut.T=null,a=Mh,Mh=null;var u=wi,_=Wi;if(nn=0,Ps=wi=null,Wi=0,(Be&6)!==0)throw Error(r(331));var T=Be;if(Be|=4,Hg(u.current),Ig(u,u.current,_,a),Be=T,Yo(0,!1),en&&typeof en.onPostCommitFiberRoot=="function")try{en.onPostCommitFiberRoot(Ce,u)}catch{}return!0}finally{Ot.p=c,ut.T=s,e_(t,n)}}function n_(t,n,a){n=pi(a,n),n=Xf(t.stateNode,n,2),t=Ba(t,n,2),t!==null&&(gs(t,2),Zi(t))}function Ve(t,n,a){if(t.tag===3)n_(t,t,a);else for(;n!==null;){if(n.tag===3){n_(n,t,a);break}else if(n.tag===1){var s=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(Ya===null||!Ya.has(s))){t=pi(a,t),a=J0(2),s=Ba(n,a,2),s!==null&&($0(a,s,n,t),gs(s,2),Zi(s));break}}n=n.return}}function wh(t,n,a){var s=t.pingCache;if(s===null){s=t.pingCache=new tM;var c=new Set;s.set(n,c)}else c=s.get(n),c===void 0&&(c=new Set,s.set(n,c));c.has(a)||(xh=!0,c.add(a),t=lM.bind(null,t,n,a),n.then(t,t))}function lM(t,n,a){var s=t.pingCache;s!==null&&s.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,We===t&&(we&a)===a&&((on===4||on===3&&(we&62914560)===we&&300>j()-Mc)&&(Be&2)===0?wr(t,0):Sc|=a,br===we&&(br=0)),Zi(t)}function i_(t,n){n===0&&(n=El()),t=xs(t,n),t!==null&&(gs(t,n),Zi(t))}function cM(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),i_(t,a)}function uM(t,n){var a=0;switch(t.tag){case 31:case 13:var s=t.stateNode,c=t.memoizedState;c!==null&&(a=c.retryLane);break;case 19:s=t.stateNode;break;case 22:s=t.stateNode._retryCache;break;default:throw Error(r(314))}s!==null&&s.delete(n),i_(t,a)}function fM(t,n){return ce(t,n)}var Nr=null,Ur=null,Dh=!1,Dc=!1,Nh=!1,Wa=0;function Zi(t){t!==Ur&&t.next===null&&(Ur===null?Nr=Ur=t:Ur=Ur.next=t),Dc=!0,Dh||(Dh=!0,dM())}function Yo(t,n){if(!Nh&&Dc){Nh=!0;do for(var a=!1,s=Nr;s!==null;){if(t!==0){var c=s.pendingLanes;if(c===0)var u=0;else{var _=s.suspendedLanes,T=s.pingedLanes;u=(1<<31-Ln(42|t)+1)-1,u&=c&~(_&~T),u=u&201326741?u&201326741|1:u?u|2:0}u!==0&&(a=!0,o_(s,u))}else u=we,u=ms(s,s===We?u:0,s.cancelPendingCommit!==null||s.timeoutHandle!==-1),(u&3)===0||Ra(s,u)||(a=!0,o_(s,u));s=s.next}while(a);Nh=!1}}function hM(){a_()}function a_(){Dc=Dh=!1;var t=0;Wa!==0&&bM()&&(t=Wa);for(var n=j(),a=null,s=Nr;s!==null;){var c=s.next,u=s_(s,n);u===0?(s.next=null,a===null?Nr=c:a.next=c,c===null&&(Ur=a)):(a=s,(t!==0||(u&3)!==0)&&(Dc=!0)),s=c}nn!==0&&nn!==5||Yo(t),Wa!==0&&(Wa=0)}function s_(t,n){for(var a=t.suspendedLanes,s=t.pingedLanes,c=t.expirationTimes,u=t.pendingLanes&-62914561;0<u;){var _=31-Ln(u),T=1<<_,I=c[_];I===-1?((T&a)===0||(T&s)!==0)&&(c[_]=Ou(T,n)):I<=n&&(t.expiredLanes|=T),u&=~T}if(n=We,a=we,a=ms(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s=t.callbackNode,a===0||t===n&&(Ge===2||Ge===9)||t.cancelPendingCommit!==null)return s!==null&&s!==null&&ie(s),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||Ra(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(s!==null&&ie(s),nt(a)){case 2:case 8:a=Qt;break;case 32:a=wt;break;case 268435456:a=te;break;default:a=wt}return s=r_.bind(null,t),a=ce(a,s),t.callbackPriority=n,t.callbackNode=a,n}return s!==null&&s!==null&&ie(s),t.callbackPriority=2,t.callbackNode=null,2}function r_(t,n){if(nn!==0&&nn!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(wc()&&t.callbackNode!==a)return null;var s=we;return s=ms(t,t===We?s:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s===0?null:(Xg(t,s,n),s_(t,j()),t.callbackNode!=null&&t.callbackNode===a?r_.bind(null,t):null)}function o_(t,n){if(wc())return null;Xg(t,n,!0)}function dM(){AM(function(){(Be&6)!==0?ce(zt,hM):a_()})}function Uh(){if(Wa===0){var t=Ts;t===0&&(t=ds,ds<<=1,(ds&261888)===0&&(ds=256)),Wa=t}return Wa}function l_(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Al(t)}function pM(t,n,a,s,c){if(n==="submit"&&a&&a.stateNode===c){var u=l_((c[Jt]||null).action),_=s.submitter;_&&(n=(n=_[Jt]||null)?l_(n.formAction):_.getAttribute("formAction"),n!==null&&(u=n,_=null));var T=new Dl("action","action",null,s,c);t.push({event:T,listeners:[{instance:null,listener:function(){if(s.defaultPrevented){if(Wa!==0){var I=new FormData(c,_);Hf(a,{pending:!0,data:I,method:c.method,action:u},null,I)}}else typeof u=="function"&&(T.preventDefault(),I=new FormData(c,_),Hf(a,{pending:!0,data:I,method:c.method,action:u},u,I))},currentTarget:c}]})}}for(var Lh=0;Lh<af.length;Lh++){var Oh=af[Lh],mM=Oh.toLowerCase(),gM=Oh[0].toUpperCase()+Oh.slice(1);Ti(mM,"on"+gM)}Ti(Om,"onAnimationEnd"),Ti(Pm,"onAnimationIteration"),Ti(zm,"onAnimationStart"),Ti("dblclick","onDoubleClick"),Ti("focusin","onFocus"),Ti("focusout","onBlur"),Ti(TS,"onTransitionRun"),Ti(AS,"onTransitionStart"),Ti(RS,"onTransitionCancel"),Ti(Im,"onTransitionEnd"),sn("onMouseEnter",["mouseout","mouseover"]),sn("onMouseLeave",["mouseout","mouseover"]),sn("onPointerEnter",["pointerout","pointerover"]),sn("onPointerLeave",["pointerout","pointerover"]),un("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),un("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),un("onBeforeInput",["compositionend","keypress","textInput","paste"]),un("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),un("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),un("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var qo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),_M=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(qo));function c_(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var s=t[a],c=s.event;s=s.listeners;t:{var u=void 0;if(n)for(var _=s.length-1;0<=_;_--){var T=s[_],I=T.instance,J=T.currentTarget;if(T=T.listener,I!==u&&c.isPropagationStopped())break t;u=T,c.currentTarget=J;try{u(c)}catch(rt){Ll(rt)}c.currentTarget=null,u=I}else for(_=0;_<s.length;_++){if(T=s[_],I=T.instance,J=T.currentTarget,T=T.listener,I!==u&&c.isPropagationStopped())break t;u=T,c.currentTarget=J;try{u(c)}catch(rt){Ll(rt)}c.currentTarget=null,u=I}}}}function Ae(t,n){var a=n[se];a===void 0&&(a=n[se]=new Set);var s=t+"__bubble";a.has(s)||(u_(n,t,2,!1),a.add(s))}function Ph(t,n,a){var s=0;n&&(s|=4),u_(a,t,s,n)}var Nc="_reactListening"+Math.random().toString(36).slice(2);function zh(t){if(!t[Nc]){t[Nc]=!0,Ze.forEach(function(a){a!=="selectionchange"&&(_M.has(a)||Ph(a,!1,t),Ph(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[Nc]||(n[Nc]=!0,Ph("selectionchange",!1,n))}}function u_(t,n,a,s){switch($_(n)){case 2:var c=cE;break;case 8:c=uE;break;default:c=nd}a=c.bind(null,n,a,t),c=void 0,!ku||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),s?c!==void 0?t.addEventListener(n,a,{capture:!0,passive:c}):t.addEventListener(n,a,!0):c!==void 0?t.addEventListener(n,a,{passive:c}):t.addEventListener(n,a,!1)}function Ih(t,n,a,s,c){var u=s;if((n&1)===0&&(n&2)===0&&s!==null)t:for(;;){if(s===null)return;var _=s.tag;if(_===3||_===4){var T=s.stateNode.containerInfo;if(T===c)break;if(_===4)for(_=s.return;_!==null;){var I=_.tag;if((I===3||I===4)&&_.stateNode.containerInfo===c)return;_=_.return}for(;T!==null;){if(_=Ie(T),_===null)return;if(I=_.tag,I===5||I===6||I===26||I===27){s=u=_;continue t}T=T.parentNode}}s=s.return}um(function(){var J=u,rt=Gu(a),xt=[];t:{var W=Bm.get(t);if(W!==void 0){var at=Dl,Bt=t;switch(t){case"keypress":if(Cl(a)===0)break t;case"keydown":case"keyup":at=eS;break;case"focusin":Bt="focus",at=qu;break;case"focusout":Bt="blur",at=qu;break;case"beforeblur":case"afterblur":at=qu;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":at=dm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":at=ky;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":at=rS;break;case Om:case Pm:case zm:at=Yy;break;case Im:at=lS;break;case"scroll":case"scrollend":at=Gy;break;case"wheel":at=uS;break;case"copy":case"cut":case"paste":at=Wy;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":at=mm;break;case"submit":at=aS;break;case"toggle":case"beforetoggle":at=hS}var $t=(n&4)!==0,ve=!$t&&(t==="scroll"||t==="scrollend"),K=$t?W!==null?W+"Capture":null:W;$t=[];for(var k=J,it;k!==null;){var vt=k;if(it=vt.stateNode,vt=vt.tag,vt!==5&&vt!==26&&vt!==27||it===null||K===null||(vt=mo(k,K),vt!=null&&$t.push(Wo(k,vt,it))),ve)break;k=k.return}0<$t.length&&(W=new at(W,Bt,null,a,rt),xt.push({event:W,listeners:$t}))}}if((n&7)===0){t:{if(at=t==="mouseover"||t==="pointerover",W=t==="mouseout"||t==="pointerout",at&&a!==Hu&&(Bt=a.relatedTarget||a.fromElement)&&(Ie(Bt)||Bt[le]))break t;(W||at)&&(Bt=rt.window===rt?rt:(at=rt.ownerDocument)?at.defaultView||at.parentWindow:window,W?(at=a.relatedTarget||a.toElement,W=J,at=at?Ie(at):null,at!==null&&(ve=f(at),$t=at.tag,at!==ve||$t!==5&&$t!==27&&$t!==6)&&(at=null)):(W=null,at=J),W!==at&&($t=dm,vt="onMouseLeave",K="onMouseEnter",k="mouse",(t==="pointerout"||t==="pointerover")&&($t=mm,vt="onPointerLeave",K="onPointerEnter",k="pointer"),ve=W==null?Bt:_n(W),it=at==null?Bt:_n(at),Bt=new $t(vt,k+"leave",W,a,rt),Bt.target=ve,Bt.relatedTarget=it,vt=null,Ie(rt)===J&&($t=new $t(K,k+"enter",at,a,rt),$t.target=it,$t.relatedTarget=ve,vt=$t),ve=vt,$t=W&&at?H(W,at,vM):null,W!==null&&f_(xt,Bt,W,$t,!1),at!==null&&ve!==null&&f_(xt,ve,at,$t,!0)))}t:{if(W=J?_n(J):window,at=W.nodeName&&W.nodeName.toLowerCase(),at==="select"||at==="input"&&W.type==="file")var Kt=Em;else if(Sm(W))if(bm)Kt=MS;else{Kt=yS;var De=xS}else at=W.nodeName,!at||at.toLowerCase()!=="input"||W.type!=="checkbox"&&W.type!=="radio"?J&&Fu(J.elementType)&&(Kt=Em):Kt=SS;if(Kt&&(Kt=Kt(t,J))){Mm(xt,Kt,a,rt);break t}De&&De(t,W,J)}switch(De=J?_n(J):window,t){case"focusin":(Sm(De)||De.contentEditable==="true")&&(rr=De,tf=J,Eo=null);break;case"focusout":Eo=tf=rr=null;break;case"mousedown":ef=!0;break;case"contextmenu":case"mouseup":case"dragend":ef=!1,Um(xt,a,rt);break;case"selectionchange":if(bS)break;case"keydown":case"keyup":Um(xt,a,rt)}var ae;if(Zu)t:{switch(t){case"compositionstart":var ue="onCompositionStart";break t;case"compositionend":ue="onCompositionEnd";break t;case"compositionupdate":ue="onCompositionUpdate";break t}ue=void 0}else sr?xm(t,a)&&(ue="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(ue="onCompositionStart");ue&&(gm&&a.locale!=="ko"&&(sr||ue!=="onCompositionStart"?ue==="onCompositionEnd"&&sr&&(ae=fm()):(wa=rt,ju="value"in wa?wa.value:wa.textContent,sr=!0)),De=Uc(J,ue),0<De.length&&(ue=new pm(ue,t,null,a,rt),xt.push({event:ue,listeners:De}),ae?ue.data=ae:(ae=ym(a),ae!==null&&(ue.data=ae)))),(ae=pS?mS(t,a):gS(t,a))&&(ue=Uc(J,"onBeforeInput"),0<ue.length&&(De=new pm("onBeforeInput","beforeinput",null,a,rt),xt.push({event:De,listeners:ue}),De.data=ae)),pM(xt,t,J,a,rt)}c_(xt,n)})}function Wo(t,n,a){return{instance:t,listener:n,currentTarget:a}}function Uc(t,n){for(var a=n+"Capture",s=[];t!==null;){var c=t,u=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||u===null||(c=mo(t,a),c!=null&&s.unshift(Wo(t,c,u)),c=mo(t,n),c!=null&&s.push(Wo(t,c,u))),t.tag===3)return s;t=t.return}return[]}function vM(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function f_(t,n,a,s,c){for(var u=n._reactName,_=[];a!==null&&a!==s;){var T=a,I=T.alternate,J=T.stateNode;if(T=T.tag,I!==null&&I===s)break;T!==5&&T!==26&&T!==27||J===null||(I=J,c?(J=mo(a,u),J!=null&&_.unshift(Wo(a,J,I))):c||(J=mo(a,u),J!=null&&_.push(Wo(a,J,I)))),a=a.return}_.length!==0&&t.push({event:n,listeners:_})}var xM=/\r\n?/g,yM=/\u0000|\uFFFD/g;function h_(t){return(typeof t=="string"?t:""+t).replace(xM,`
`).replace(yM,"")}function d_(t,n){return n=h_(n),h_(t)===n}function ke(t,n,a,s,c,u){switch(a){case"children":if(typeof s=="string")n==="body"||n==="textarea"&&s===""||nr(t,s);else if(typeof s=="number"||typeof s=="bigint")n!=="body"&&nr(t,""+s);else return;break;case"className":Tl(t,"class",s);break;case"tabIndex":Tl(t,"tabindex",s);break;case"dir":case"role":case"viewBox":case"width":case"height":Tl(t,a,s);break;case"style":lm(t,s,u);return;case"data":if(n!=="object"){Tl(t,"data",s);break}case"src":case"href":if(s===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(s==null||typeof s=="function"||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Al(s),t.setAttribute(a,s);break;case"action":case"formAction":if(typeof s=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof u=="function"&&(a==="formAction"?(n!=="input"&&ke(t,n,"name",c.name,c,null),ke(t,n,"formEncType",c.formEncType,c,null),ke(t,n,"formMethod",c.formMethod,c,null),ke(t,n,"formTarget",c.formTarget,c,null)):(ke(t,n,"encType",c.encType,c,null),ke(t,n,"method",c.method,c,null),ke(t,n,"target",c.target,c,null)));if(s==null||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Al(s),t.setAttribute(a,s);break;case"onClick":s!=null&&(t.onclick=Fi);return;case"onScroll":s!=null&&Ae("scroll",t);return;case"onScrollEnd":s!=null&&Ae("scrollend",t);return;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));(u!=null?u.__html:void 0)!==a&&(t.innerHTML=a)}}break;case"multiple":t.multiple=s&&typeof s!="function"&&typeof s!="symbol";break;case"muted":t.muted=s&&typeof s!="function"&&typeof s!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(s==null||typeof s=="function"||typeof s=="boolean"||typeof s=="symbol"){t.removeAttribute("xlink:href");break}a=Al(s),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,s):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"credentialless":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":s&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":s===!0?t.setAttribute(a,""):s!==!1&&s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,s):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":s!=null&&typeof s!="function"&&typeof s!="symbol"&&!isNaN(s)&&1<=s?t.setAttribute(a,s):t.removeAttribute(a);break;case"rowSpan":case"start":s==null||typeof s=="function"||typeof s=="symbol"||isNaN(s)?t.removeAttribute(a):t.setAttribute(a,s);break;case"popover":Ae("beforetoggle",t),Ae("toggle",t),bl(t,"popover",s);break;case"xlinkActuate":aa(t,"http://www.w3.org/1999/xlink","xlink:actuate",s);break;case"xlinkArcrole":aa(t,"http://www.w3.org/1999/xlink","xlink:arcrole",s);break;case"xlinkRole":aa(t,"http://www.w3.org/1999/xlink","xlink:role",s);break;case"xlinkShow":aa(t,"http://www.w3.org/1999/xlink","xlink:show",s);break;case"xlinkTitle":aa(t,"http://www.w3.org/1999/xlink","xlink:title",s);break;case"xlinkType":aa(t,"http://www.w3.org/1999/xlink","xlink:type",s);break;case"xmlBase":aa(t,"http://www.w3.org/XML/1998/namespace","xml:base",s);break;case"xmlLang":aa(t,"http://www.w3.org/XML/1998/namespace","xml:lang",s);break;case"xmlSpace":aa(t,"http://www.w3.org/XML/1998/namespace","xml:space",s);break;case"is":bl(t,"is",s);break;case"innerText":case"textContent":return;default:if(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")a=Fy.get(a)||a,bl(t,a,s);else return}Oe=!0}function Bh(t,n,a,s,c,u){switch(a){case"style":lm(t,s,u);return;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));(u!=null?u.__html:void 0)!==a&&(t.innerHTML=a)}}break;case"children":if(typeof s=="string")nr(t,s);else if(typeof s=="number"||typeof s=="bigint")nr(t,""+s);else return;break;case"onScroll":s!=null&&Ae("scroll",t);return;case"onScrollEnd":s!=null&&Ae("scrollend",t);return;case"onClick":s!=null&&(t.onclick=Fi);return;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":return;case"innerText":case"textContent":return;default:if(!Bn.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),u=a.slice(2,c?a.length-7:void 0),n=t[Jt]||null,n=n!=null?n[a]:null,typeof n=="function"&&t.removeEventListener(u,n,c),typeof s=="function")){typeof n!="function"&&n!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(u,s,c);break t}Oe=!0,a in t?t[a]=s:s===!0?t.setAttribute(a,""):bl(t,a,s)}return}Oe=!0}function Dn(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Ae("error",t),Ae("load",t);var s=!1,c=!1,u;for(u in a)if(a.hasOwnProperty(u)){var _=a[u];if(_!=null)switch(u){case"src":s=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:ke(t,n,u,_,a,null)}}c&&ke(t,n,"srcSet",a.srcSet,a,null),s&&ke(t,n,"src",a.src,a,null);return;case"input":Ae("invalid",t);var T=u=_=c=null,I=null,J=null;for(s in a)if(a.hasOwnProperty(s)){var rt=a[s];if(rt!=null)switch(s){case"name":c=rt;break;case"type":_=rt;break;case"checked":I=rt;break;case"defaultChecked":J=rt;break;case"value":u=rt;break;case"defaultValue":T=rt;break;case"children":case"dangerouslySetInnerHTML":if(rt!=null)throw Error(r(137,n));break;default:ke(t,n,s,rt,a,null)}}am(t,u,T,I,J,_,c,!1);return;case"select":Ae("invalid",t),s=_=u=null;for(c in a)if(a.hasOwnProperty(c)&&(T=a[c],T!=null))switch(c){case"value":u=T;break;case"defaultValue":_=T;break;case"multiple":s=T;default:ke(t,n,c,T,a,null)}n=u,a=_,t.multiple=!!s,n!=null?er(t,!!s,n,!1):a!=null&&er(t,!!s,a,!0);return;case"textarea":Ae("invalid",t),u=c=s=null;for(_ in a)if(a.hasOwnProperty(_)&&(T=a[_],T!=null))switch(_){case"value":s=T;break;case"defaultValue":c=T;break;case"children":u=T;break;case"dangerouslySetInnerHTML":if(T!=null)throw Error(r(91));break;default:ke(t,n,_,T,a,null)}rm(t,s,c,u);return;case"option":for(I in a)if(a.hasOwnProperty(I)&&(s=a[I],s!=null))switch(I){case"selected":t.selected=s&&typeof s!="function"&&typeof s!="symbol";break;default:ke(t,n,I,s,a,null)}return;case"dialog":Ae("beforetoggle",t),Ae("toggle",t),Ae("cancel",t),Ae("close",t);break;case"iframe":case"object":Ae("load",t);break;case"video":case"audio":for(s=0;s<qo.length;s++)Ae(qo[s],t);break;case"image":Ae("error",t),Ae("load",t);break;case"details":Ae("toggle",t);break;case"embed":case"source":case"link":Ae("error",t),Ae("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(J in a)if(a.hasOwnProperty(J)&&(s=a[J],s!=null))switch(J){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:ke(t,n,J,s,a,null)}return;default:if(Fu(n)){for(rt in a)a.hasOwnProperty(rt)&&(s=a[rt],s!==void 0&&Bh(t,n,rt,s,a,void 0));return}}for(T in a)a.hasOwnProperty(T)&&(s=a[T],s!=null&&ke(t,n,T,s,a,null))}var SM={};function MM(t,n,a,s){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,u=null,_=null,T=null,I=null,J=null,rt=null;for(at in a){var xt=a[at];if(a.hasOwnProperty(at)&&xt!=null)switch(at){case"checked":break;case"value":break;case"defaultValue":I=xt;default:s.hasOwnProperty(at)||ke(t,n,at,null,s,xt)}}for(var W in s){var at=s[W];if(xt=a[W],s.hasOwnProperty(W)&&(at!=null||xt!=null))switch(W){case"type":at!==xt&&(Oe=!0),u=at;break;case"name":at!==xt&&(Oe=!0),c=at;break;case"checked":at!==xt&&(Oe=!0),J=at;break;case"defaultChecked":at!==xt&&(Oe=!0),rt=at;break;case"value":at!==xt&&(Oe=!0),_=at;break;case"defaultValue":at!==xt&&(Oe=!0),T=at;break;case"children":case"dangerouslySetInnerHTML":if(at!=null)throw Error(r(137,n));break;default:at!==xt&&ke(t,n,W,at,s,xt)}}Iu(t,_,T,I,J,rt,u,c);return;case"select":at=_=T=W=null;for(u in a)if(I=a[u],a.hasOwnProperty(u)&&I!=null)switch(u){case"value":break;case"multiple":at=I;default:s.hasOwnProperty(u)||ke(t,n,u,null,s,I)}for(c in s)if(u=s[c],I=a[c],s.hasOwnProperty(c)&&(u!=null||I!=null))switch(c){case"value":u!==I&&(Oe=!0),W=u;break;case"defaultValue":u!==I&&(Oe=!0),T=u;break;case"multiple":u!==I&&(Oe=!0),_=u;default:u!==I&&ke(t,n,c,u,s,I)}n=T,a=_,s=at,W!=null?er(t,!!a,W,!1):!!s!=!!a&&(n!=null?er(t,!!a,n,!0):er(t,!!a,a?[]:"",!1));return;case"textarea":at=W=null;for(T in a)if(c=a[T],a.hasOwnProperty(T)&&c!=null&&!s.hasOwnProperty(T))switch(T){case"value":break;case"children":break;default:ke(t,n,T,null,s,c)}for(_ in s)if(c=s[_],u=a[_],s.hasOwnProperty(_)&&(c!=null||u!=null))switch(_){case"value":c!==u&&(Oe=!0),W=c;break;case"defaultValue":c!==u&&(Oe=!0),at=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(r(91));break;default:c!==u&&ke(t,n,_,c,s,u)}sm(t,W,at);return;case"option":for(var Bt in a)if(W=a[Bt],a.hasOwnProperty(Bt)&&W!=null&&!s.hasOwnProperty(Bt))switch(Bt){case"selected":t.selected=!1;break;default:ke(t,n,Bt,null,s,W)}for(I in s)if(W=s[I],at=a[I],s.hasOwnProperty(I)&&W!==at&&(W!=null||at!=null))switch(I){case"selected":W!==at&&(Oe=!0),t.selected=W&&typeof W!="function"&&typeof W!="symbol";break;default:ke(t,n,I,W,s,at)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var $t in a)W=a[$t],a.hasOwnProperty($t)&&W!=null&&!s.hasOwnProperty($t)&&ke(t,n,$t,null,s,W);for(J in s)if(W=s[J],at=a[J],s.hasOwnProperty(J)&&W!==at&&(W!=null||at!=null))switch(J){case"children":case"dangerouslySetInnerHTML":if(W!=null)throw Error(r(137,n));break;default:ke(t,n,J,W,s,at)}return;default:if(Fu(n)){for(var ve in a)W=a[ve],a.hasOwnProperty(ve)&&W!==void 0&&!s.hasOwnProperty(ve)&&Bh(t,n,ve,void 0,s,W);for(rt in s)W=s[rt],at=a[rt],!s.hasOwnProperty(rt)||W===at||W===void 0&&at===void 0||Bh(t,n,rt,W,s,at);return}}for(var K in a)W=a[K],a.hasOwnProperty(K)&&W!=null&&!s.hasOwnProperty(K)&&ke(t,n,K,null,s,W);for(xt in s)W=s[xt],at=a[xt],!s.hasOwnProperty(xt)||W===at||W==null&&at==null||ke(t,n,xt,W,s,at)}function p_(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function EM(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,a=performance.getEntriesByType("resource"),s=0;s<a.length;s++){var c=a[s],u=c.transferSize,_=c.initiatorType,T=c.duration;if(u&&T&&p_(_)){for(_=0,T=c.responseEnd,s+=1;s<a.length;s++){var I=a[s],J=I.startTime;if(J>T)break;var rt=I.transferSize,xt=I.initiatorType;rt&&p_(xt)&&(I=I.responseEnd,_+=rt*(I<T?1:(T-J)/(I-J)))}if(--s,n+=8*(u+_)/(c.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var Fh=null,Hh=null;function Zo(t){return t.nodeType===9?t:t.ownerDocument}function m_(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function g_(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function __(t,n,a,s){return a=Zo(a).createElement(t),a[Pt]=s,a[Jt]=n,Dn(a,t,n),Le(a),a}function Gh(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var Vh=null;function bM(){var t=window.event;return t&&t.type==="popstate"?t===Vh?!1:(Vh=t,!0):(Vh=null,!1)}var kh=typeof setTimeout=="function"?setTimeout:void 0,TM=typeof clearTimeout=="function"?clearTimeout:void 0,v_=typeof Promise=="function"?Promise:void 0,x_=typeof requestAnimationFrame=="function"?requestAnimationFrame:kh,AM=typeof queueMicrotask=="function"?queueMicrotask:typeof v_<"u"?function(t){return v_.resolve(null).then(t).catch(RM)}:kh;function RM(t){setTimeout(function(){throw t})}function Za(t){return t==="head"}function y_(t,n){var a=n,s=0;do{var c=a.nextSibling;if(t.removeChild(a),c&&c.nodeType===8)if(a=c.data,a==="/$"||a==="/&"){if(s===0){t.removeChild(c),Fr(n);return}s--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")s++;else if(a==="html")Qh(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,Qh(a);for(var u=a.firstChild;u;){var _=u.nextSibling,T=u.nodeName;u[ze]||T==="SCRIPT"||T==="STYLE"||T==="LINK"&&u.rel.toLowerCase()==="stylesheet"||a.removeChild(u),u=_}}else a==="body"&&Qh(t.ownerDocument.body);a=c}while(a);Fr(n)}function S_(t,n){var a=t;t=0;do{var s=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),s&&s.nodeType===8)if(a=s.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=s}while(a)}function M_(t,n,a){if(n=CSS.escape(n)!==n?"r-"+btoa(n).replace(/=/g,""):n,t.style.viewTransitionName=n,a!=null&&(t.style.viewTransitionClass=a),a=getComputedStyle(t),a.display==="inline"){if(n=t.getClientRects(),n.length===1)var s=1;else for(var c=s=0;c<n.length;c++){var u=n[c];0<u.width&&0<u.height&&s++}s===1&&(t=t.style,t.display=n.length===1?"inline-block":"block",t.marginTop="-"+a.paddingTop,t.marginBottom="-"+a.paddingBottom)}}function E_(t,n){t=t.style,n=n.style;var a=n!=null?n.hasOwnProperty("viewTransitionName")?n.viewTransitionName:n.hasOwnProperty("view-transition-name")?n["view-transition-name"]:null:null;t.viewTransitionName=a==null||typeof a=="boolean"?"":(""+a).trim(),a=n!=null?n.hasOwnProperty("viewTransitionClass")?n.viewTransitionClass:n.hasOwnProperty("view-transition-class")?n["view-transition-class"]:null:null,t.viewTransitionClass=a==null||typeof a=="boolean"?"":(""+a).trim(),t.display==="inline-block"&&(n==null?t.display=t.margin="":(a=n.display,t.display=a==null||typeof a=="boolean"?"":a,a=n.margin,a!=null?t.margin=a:(a=n.hasOwnProperty("marginTop")?n.marginTop:n["margin-top"],t.marginTop=a==null||typeof a=="boolean"?"":a,n=n.hasOwnProperty("marginBottom")?n.marginBottom:n["margin-bottom"],t.marginBottom=n==null||typeof n=="boolean"?"":n)))}function CM(t,n,a){return a=a.ownerDocument.defaultView,{rect:t,abs:n.position==="absolute"||n.position==="fixed",clip:n.clipPath!=="none"||n.overflow!=="visible"||n.filter!=="none"||n.mask!=="none"||n.mask!=="none"||n.borderRadius!=="0px",view:0<=t.bottom&&0<=t.right&&t.top<=a.innerHeight&&t.left<=a.innerWidth}}function jh(t){var n=t.getBoundingClientRect(),a=getComputedStyle(t);return CM(n,a,t)}function wM(t){return t.documentElement.clientHeight}function DM(t){this.addEventListener("load",t),this.addEventListener("error",t)}function NM(t,n,a,s,c,u,_,T,I){var J=n.nodeType===9?n:n.ownerDocument;try{var rt=J.startViewTransition({update:function(){var W=J.defaultView,at=W.navigation&&W.navigation.transition,Bt=J.fonts.status;s();var $t=[];if(Bt==="loaded"&&(wM(J),J.fonts.status==="loading"&&$t.push(J.fonts.ready)),Bt=$t.length,t!==null)for(var ve=t.suspenseyImages,K=0,k=0;k<ve.length;k++){var it=ve[k];if(!it.complete){var vt=it.getBoundingClientRect();if(0<vt.bottom&&0<vt.right&&vt.top<W.innerHeight&&vt.left<W.innerWidth){if(K+=j_(it),K>Pc){$t.length=Bt;break}it=new Promise(DM.bind(it)),$t.push(it)}}}if(0<$t.length)return W=Promise.race([Promise.all($t),new Promise(function(Kt){return setTimeout(Kt,500)})]).then(c,c),(at?Promise.allSettled([at.finished,W]):W).then(u,u);if(c(),at)return at.finished.then(u,u);u()},types:a});J.__reactViewTransition=rt;var xt=[];return rt.ready.then(function(){for(var W=J.documentElement.getAnimations({subtree:!0}),at=0;at<W.length;at++){var Bt=W[at],$t=Bt.effect,ve=$t.pseudoElement;if(ve!=null&&ve.startsWith("::view-transition")){xt.push(Bt),Bt=$t.getKeyframes();for(var K=ve=void 0,k=!0,it=0;it<Bt.length;it++){var vt=Bt[it],Kt=vt.width;if(ve===void 0)ve=Kt;else if(ve!==Kt){k=!1;break}if(Kt=vt.height,K===void 0)K=Kt;else if(K!==Kt){k=!1;break}delete vt.width,delete vt.height,vt.transform==="none"&&delete vt.transform}k&&ve!==void 0&&K!==void 0&&($t.setKeyframes(Bt),k=getComputedStyle($t.target,$t.pseudoElement),k.width!==ve||k.height!==K)&&(k=Bt[0],k.width=ve,k.height=K,k=Bt[Bt.length-1],k.width=ve,k.height=K,$t.setKeyframes(Bt))}}_()},function(W){J.__reactViewTransition===rt&&(J.__reactViewTransition=null);try{if(typeof W=="object"&&W!==null)switch(W.name){case"InvalidStateError":(W.message==="View transition was skipped because document visibility state is hidden."||W.message==="Skipping view transition because document visibility state has become hidden."||W.message==="Skipping view transition because viewport size changed."||W.message==="Transition was aborted because of invalid state")&&(W=null)}W!==null&&I(W)}finally{s(),c(),_()}}),rt.finished.finally(function(){for(var W=0;W<xt.length;W++)xt[W].cancel();J.__reactViewTransition===rt&&(J.__reactViewTransition=null),T()}),rt}catch{return s(),c(),_(),null}}function zs(t,n){this._scope=document.documentElement,this._selector="::view-transition-"+t+"("+n+")"}zs.prototype.animate=function(t,n){return n=typeof n=="number"?{duration:n}:B({},n),n.pseudoElement=this._selector,this._scope.animate(t,n)},zs.prototype.getAnimations=function(){for(var t=this._scope,n=this._selector,a=t.getAnimations({subtree:!0}),s=[],c=0;c<a.length;c++){var u=a[c].effect;u!==null&&u.target===t&&u.pseudoElement===n&&s.push(a[c])}return s},zs.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function b_(t){return{name:t,group:new zs("group",t),imagePair:new zs("image-pair",t),old:new zs("old",t),new:new zs("new",t)}}function li(t){this._fragmentFiber=t,this._observers=this._eventListeners=null}li.prototype.addEventListener=function(t,n,a){var s=null,c=null;if(!(a!=null&&typeof a!="boolean"&&(s=a.signal||null,s!==null&&s.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var u=this._eventListeners;if(A_(u,t,n,a)===-1){var _=this,T=n;a!=null&&typeof a!="boolean"&&a.once===!0&&(T=function(I){_.removeEventListener(t,n,a),typeof n=="function"?n.call(this,I):n.handleEvent(I)}),s!==null&&(c=_.removeEventListener.bind(_,t,n,a),s.addEventListener("abort",c,{once:!0}),c=s.removeEventListener.bind(s,"abort",c)),s=Lr(a),u.push({type:t,listener:n,optionsOrUseCapture:a,attachedListener:T,cleanup:c}),m(this._fragmentFiber.child,!1,UM,t,T,s)}this._eventListeners=u}};function UM(t,n,a,s){return S(t).addEventListener(n,a,s),!1}li.prototype.removeEventListener=function(t,n,a){var s=this._eventListeners;if(s!==null&&(n=A_(s,t,n,a),n!==-1)){var c=s[n];a=c.attachedListener;var u=c.cleanup;c=Lr(c.optionsOrUseCapture),m(this._fragmentFiber.child,!1,LM,t,a,c),s.splice(n,1),u!==null&&u()}};function LM(t,n,a,s){return S(t).removeEventListener(n,a,s),!1}function Lr(t){return t!=null&&typeof t!="boolean"&&(t.once===!0||t.signal instanceof AbortSignal)?{capture:t.capture,passive:t.passive}:t}function T_(t){return t==null?"c=0":typeof t=="boolean"?"c="+(t?"1":"0"):"c="+(t.capture?"1":"0")}function A_(t,n,a,s){if(t.length===0)return-1;s=T_(s);for(var c=0;c<t.length;c++){var u=t[c];if(u.type===n&&u.listener===a&&T_(u.optionsOrUseCapture)===s)return c}return-1}li.prototype.dispatchEvent=function(t){var n=y(this._fragmentFiber);if(n===null)return!0;n=S(n);var a=this._eventListeners;if(a!==null&&0<a.length||!t.bubbles){var s=n.nodeType===9?n.createComment(""):document.createTextNode("");if(a)for(var c=0;c<a.length;c++){var u=a[c];s.addEventListener(u.type,u.attachedListener,Lr(u.optionsOrUseCapture))}if(n.appendChild(s),t=s.dispatchEvent(t),a)for(c=0;c<a.length;c++)u=a[c],s.removeEventListener(u.type,u.attachedListener,Lr(u.optionsOrUseCapture));return n.removeChild(s),t}return n.dispatchEvent(t)},li.prototype.focus=function(t){m(this._fragmentFiber.child,!0,R_,t,void 0,void 0)};function R_(t,n){return t.tag===6?!1:(t=S(t),XM(t,n))}li.prototype.focusLast=function(t){var n=[];m(this._fragmentFiber.child,!0,Xh,n,void 0,void 0);for(var a=n.length-1;0<=a&&!R_(n[a],t);a--);};function Xh(t,n){return n.push(t),!1}li.prototype.blur=function(){var t=y(this._fragmentFiber);t!==null&&(t=S(t),t=Zo(t).activeElement,t!==null&&m(this._fragmentFiber.child,!1,OM,t,void 0,void 0))};function OM(t,n){return t.tag===6?!1:(t=S(t),t===n||t.contains(n)?(n.blur(),!0):!1)}li.prototype.observeUsing=function(t){this._observers===null&&(this._observers=new Set),this._observers.add(t),m(this._fragmentFiber.child,!1,PM,t,void 0,void 0)};function PM(t,n){return t.tag===6||(t=S(t),n.observe(t)),!1}li.prototype.unobserveUsing=function(t){var n=this._observers;if(n!==null&&n.has(t)){n.delete(t),m(this._fragmentFiber.child,!1,zM,t,void 0,void 0);for(var a=n=0;a<Di.length;a++){var s=Di[a];s.fragmentInstance===this&&s.observer===t?t.unobserve(s.instance):Di[n++]=s}Di.length=n}};function zM(t,n){return t.tag===6||(t=S(t),n.unobserve(t)),!1}var Di=[],Yh=!1;function IM(t,n,a){Di.push({fragmentInstance:t,observer:n,instance:a}),Yh||(Yh=!0,YM(function(){Yh=!1;var s=Di;Di=[];for(var c=0;c<s.length;c++){var u=s[c];u.observer.unobserve(u.instance)}}))}li.prototype.getClientRects=function(){var t=[];return m(this._fragmentFiber.child,!1,BM,t,void 0,void 0),t};function BM(t,n){if(t.tag===6){t=t.stateNode;var a=t.ownerDocument.createRange();a.selectNodeContents(t),n.push.apply(n,a.getClientRects())}else t=S(t),n.push.apply(n,t.getClientRects());return!1}li.prototype.getRootNode=function(t){var n=y(this._fragmentFiber);return n===null?this:S(n).getRootNode(t)},li.prototype.compareDocumentPosition=function(t){var n=y(this._fragmentFiber);if(n===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var a=[];m(this._fragmentFiber.child,!1,Xh,a,void 0,void 0);var s=S(n);if(a.length===0){if(a=s,M(this._fragmentFiber)){t:{for(n=this._fragmentFiber.return;n!==null;){if(n.tag===4){n=n.stateNode.containerInfo;break t}if(n.tag===3||n.tag===5||n.tag===27)break;n=n.return}n=null}n!=null&&(a=n)}n=this._fragmentFiber;var c=s=a.compareDocumentPosition(t);return a===t?c=Node.DOCUMENT_POSITION_CONTAINS:s&Node.DOCUMENT_POSITION_CONTAINED_BY&&(a=E(n)[1],a===null?c=Node.DOCUMENT_POSITION_PRECEDING:(t=S(a).compareDocumentPosition(t),c=t===0||t&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),c|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}n=S(a[0]),c=S(a[a.length-1]);var u=M(this._fragmentFiber)?n.parentElement:s;if(u==null)return Node.DOCUMENT_POSITION_DISCONNECTED;s=u.compareDocumentPosition(n)&Node.DOCUMENT_POSITION_CONTAINED_BY,u=u.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_CONTAINED_BY;var _=n.compareDocumentPosition(t),T=c.compareDocumentPosition(t),I=_&Node.DOCUMENT_POSITION_CONTAINED_BY||T&Node.DOCUMENT_POSITION_CONTAINED_BY;return T=s&&u&&_&Node.DOCUMENT_POSITION_FOLLOWING&&T&Node.DOCUMENT_POSITION_PRECEDING,n=s&&n===t||u&&c===t||I||T?Node.DOCUMENT_POSITION_CONTAINED_BY:!s&&n===t||!u&&c===t?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:_,n&Node.DOCUMENT_POSITION_DISCONNECTED||n&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||FM(n,this._fragmentFiber,a[0],a[a.length-1],t)?n:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function FM(t,n,a,s,c){var u=Ie(c);if(t&Node.DOCUMENT_POSITION_CONTAINED_BY){if(a=!!u)t:{for(;u!==null;){if(u.tag===7&&(u===n||u.alternate===n)){a=!0;break t}u=u.return}a=!1}return a}if(t&Node.DOCUMENT_POSITION_CONTAINS){if(u===null)return u=c.ownerDocument,c===u||c===u.documentElement||c===u.body;t:{for(u=n,n=y(n);u!==null;){if(!(u.tag!==5&&u.tag!==3&&u.tag!==27||u!==n&&u.alternate!==n)){u=!0;break t}u=u.return}u=!1}return u}return t&Node.DOCUMENT_POSITION_PRECEDING?((n=!!u)&&!(n=u===a)&&(n=H(a,u,V),n===null?n=!1:(m(n,!0,O,u,a),u=v,v=null,n=u!==null)),n):t&Node.DOCUMENT_POSITION_FOLLOWING?((n=!!u)&&!(n=u===s)&&(n=H(s,u,V),n===null?n=!1:(m(n,!0,L,u,s),u=v,P=v=null,n=u!==null)),n):!1}function C_(t,n){var a=t.ownerDocument.createRange();a.selectNodeContents(t),t=a.getBoundingClientRect(),window.scrollTo(window.scrollX+t.left,n?window.scrollY+t.top:window.scrollY+t.bottom-window.innerHeight)}li.prototype.scrollIntoView=function(t){if(typeof t=="object")throw Error(r(566));var n=[];m(this._fragmentFiber.child,!1,Xh,n,void 0,void 0);var a=t!==!1;if(n.length===0){var s=E(this._fragmentFiber);if(s=a?s[1]||s[0]||y(this._fragmentFiber):s[0]||s[1],s===null)return;if(s.tag===6){t=S(s),C_(t,a);return}if(s=S(s),s.nodeType!==9){if(s.nodeType===11){a="host"in s?s.host:null,a!==null&&a.scrollIntoView(t);return}s.scrollIntoView(t)}}for(s=a?n.length-1:0;s!==(a?-1:n.length);){var c=n[s];c.tag===6?(c=S(c),C_(c,a)):S(c).scrollIntoView(t),s+=a?-1:1}};function HM(t,n){return t=S(t),w_(t,n),!1}function w_(t,n){t.reactFragments==null&&(t.reactFragments=new Set),t.reactFragments.add(n)}function D_(t,n){var a=n._eventListeners;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s];t.addEventListener(c.type,c.attachedListener,Lr(c.optionsOrUseCapture))}t.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(u){for(var _=0,T=0;T<Di.length;T++){var I=Di[T];(I.fragmentInstance!==n||I.observer!==u||I.instance!==t)&&(Di[_++]=I)}Di.length=_,u.observe(t)}),w_(t,n))}function GM(t,n){var a=n._eventListeners;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s];t.removeEventListener(c.type,c.attachedListener,Lr(c.optionsOrUseCapture))}t.nodeType!==3&&(a=n._observers,a!==null&&a.forEach(function(u){typeof u.rootMargin=="string"?IM(n,u,t):u.unobserve(t)}),t.reactFragments!=null&&t.reactFragments.delete(n))}function qh(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":qh(a),re(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function VM(t,n,a,s){for(;t.nodeType===1;){var c=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!s&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(s){if(!t[ze])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(u=t.getAttribute("rel"),u==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(u!==c.rel||t.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||t.getAttribute("title")!==(c.title==null?null:c.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(u=t.getAttribute("src"),(u!==(c.src==null?null:c.src)||t.getAttribute("type")!==(c.type==null?null:c.type)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&u&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var u=c.name==null?null:""+c.name;if(c.type==="hidden"&&t.getAttribute("name")===u)return t}else return t;if(t=xi(t.nextSibling),t===null)break}return null}function kM(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=xi(t.nextSibling),t===null))return null;return t}function N_(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=xi(t.nextSibling),t===null))return null;return t}function Wh(t){return t.data==="$?"||t.data==="$~"}function Zh(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function jM(t,n){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||a.readyState!=="loading")n();else{var s=function(){n(),a.removeEventListener("DOMContentLoaded",s)};a.addEventListener("DOMContentLoaded",s),t._reactRetry=s}}function xi(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var Kh=null;function U_(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(n===0)return xi(t.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}t=t.nextSibling}return null}function L_(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return t;n--}else a!=="/$"&&a!=="/&"||n++}t=t.previousSibling}return null}function XM(t,n){function a(){s=!0}if(t.ownerDocument.activeElement===t)return!0;var s=!1;try{t.ownerDocument.addEventListener("focus",a,!0),(t.focus||HTMLElement.prototype.focus).call(t,n)}finally{t.ownerDocument.removeEventListener("focus",a,!0)}return s}function YM(t){x_(function(){x_(function(n){return t(n)})})}function O_(t,n,a){switch(n=Zo(a),t){case"html":if(t=n.documentElement,!t)throw Error(r(452));return t;case"head":if(t=n.head,!t)throw Error(r(453));return t;case"body":if(t=n.body,!t)throw Error(r(454));return t;default:throw Error(r(451))}}function P_(t,n,a){for(var s in a){var c=a[s];a.hasOwnProperty(s)&&c!=null&&ke(t,n,s,null,SM,c)}a.dangerouslySetInnerHTML!=null&&(t.textContent=""),t.onclick===Fi&&(t.onclick=null),re(t)}function Qh(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);re(t)}var yi=new Map,z_=new Set;function Ko(t){if(typeof t.getRootNode=="function"){var n=t.getRootNode();if(n.nodeType===9||n.nodeType===11)return n}return t.nodeType===9?t:t.ownerDocument}var _a=Ot.d;Ot.d={f:qM,r:WM,D:ZM,C:KM,L:QM,m:JM,X:tE,S:$M,M:eE};function qM(){var t=_a.f(),n=Ac();return t||n}function WM(t){var n=Se(t);n!==null&&n.tag===5&&n.type==="form"?B0(n):_a.r(t)}var Or=typeof document>"u"?null:document;function I_(t,n,a){var s=Or;if(s&&typeof n=="string"&&n){var c=hi(n);c='link[rel="'+t+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),z_.has(c)||(z_.add(c),t={rel:t,crossOrigin:a,href:n},s.querySelector(c)===null&&(n=s.createElement("link"),Dn(n,"link",t),Le(n),s.head.appendChild(n)))}}function ZM(t){_a.D(t),I_("dns-prefetch",t,null)}function KM(t,n){_a.C(t,n),I_("preconnect",t,n)}function QM(t,n,a){_a.L(t,n,a);var s=Or;if(s&&t&&n){var c='link[rel="preload"][as="'+hi(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+hi(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+hi(a.imageSizes)+'"]')):c+='[href="'+hi(t)+'"]';var u=c;switch(n){case"style":u=Pr(t);break;case"script":u=zr(t)}if(!(yi.has(u)||(t=B({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),yi.set(u,t),s.querySelector(c)!==null||n==="style"&&s.querySelector(Qo(u))||n==="script"&&s.querySelector(Jo(u))))){var _=s.createElement("link");Dn(_,"link",t),n==="style"&&(_[Ue]=!0,_.onload=_.onerror=function(){Ca(_)}),Le(_),s.head.appendChild(_)}}}function JM(t,n){_a.m(t,n);var a=Or;if(a&&t){var s=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+hi(s)+'"][href="'+hi(t)+'"]',u=c;switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":u=zr(t)}if(!yi.has(u)&&(t=B({rel:"modulepreload",href:t},n),yi.set(u,t),a.querySelector(c)===null)){switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Jo(u)))return}s=a.createElement("link"),Dn(s,"link",t),Le(s),a.head.appendChild(s)}}}function $M(t,n,a){_a.S(t,n,a);var s=Or;if(s&&t){var c=ti(s).hoistableStyles,u=Pr(t);n=n||"default";var _=c.get(u);if(!_){var T={loading:0,preload:null};if(_=s.querySelector(Qo(u)))T.loading=5;else{t=B({rel:"stylesheet",href:t,"data-precedence":n},a),(a=yi.get(u))&&Jh(t,a);var I=_=s.createElement("link");Le(I),Dn(I,"link",t),I._p=new Promise(function(J,rt){I.onload=J,I.onerror=rt}),I.addEventListener("load",function(){T.loading|=1}),I.addEventListener("error",function(){T.loading|=2}),T.loading|=4,Lc(_,n,s)}_={type:"stylesheet",instance:_,count:1,state:T},c.set(u,_)}}}function tE(t,n){_a.X(t,n);var a=Or;if(a&&t){var s=ti(a).hoistableScripts,c=zr(t),u=s.get(c);u||(u=a.querySelector(Jo(c)),u||(t=B({src:t,async:!0},n),(n=yi.get(c))&&$h(t,n),u=a.createElement("script"),Le(u),Dn(u,"link",t),a.head.appendChild(u)),u={type:"script",instance:u,count:1,state:null},s.set(c,u))}}function eE(t,n){_a.M(t,n);var a=Or;if(a&&t){var s=ti(a).hoistableScripts,c=zr(t),u=s.get(c);u||(u=a.querySelector(Jo(c)),u||(t=B({src:t,async:!0,type:"module"},n),(n=yi.get(c))&&$h(t,n),u=a.createElement("script"),Le(u),Dn(u,"link",t),a.head.appendChild(u)),u={type:"script",instance:u,count:1,state:null},s.set(c,u))}}function B_(t,n,a,s){var c=(c=me.current)?Ko(c):null;if(!c)throw Error(r(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(a=Pr(a.href),n=ti(c).hoistableStyles,s=n.get(a),s||(s={type:"style",instance:null,count:0,state:null},n.set(a,s)),s):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=Pr(a.href);var u=ti(c).hoistableStyles,_=u.get(t);if(_||(c=c.ownerDocument||c,_={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},u.set(t,_),(u=c.querySelector(Qo(t)))?u._p||(_.instance=u,_.state.loading=5):(u=yi.get(t),u||(u={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},yi.set(t,u)),nE(c,t,u,_.state))),n&&s===null)throw Error(r(528,""));return _}if(n&&s!==null)throw Error(r(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(a=zr(a),n=ti(c).hoistableScripts,s=n.get(a),s||(s={type:"script",instance:null,count:0,state:null},n.set(a,s)),s):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,t))}}function Pr(t){return'href="'+hi(t)+'"'}function Qo(t){return'link[rel="stylesheet"]['+t+"]"}function F_(t){return B({},t,{"data-precedence":t.precedence,precedence:null})}function nE(t,n,a,s){if(n=t.querySelector('link[rel="preload"][as="style"]['+n+"]")){if(n[Ue]!==!0){s.loading=1;return}}else n=t.createElement("link"),n[Ue]=!0,n.onload=n.onerror=Ca.bind(null,n),Dn(n,"link",a),Le(n),t.head.appendChild(n);s.preload=n,n.addEventListener("load",function(){return s.loading|=1}),n.addEventListener("error",function(){return s.loading|=2})}function zr(t){return'[src="'+hi(t)+'"]'}function Jo(t){return"script[async]"+t}function H_(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var s=t.querySelector('style[data-href~="'+hi(a.href)+'"]');if(s)return n.instance=s,Le(s),s;var c=B({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return s=(t.ownerDocument||t).createElement("style"),Le(s),Dn(s,"style",c),Lc(s,a.precedence,t),n.instance=s;case"stylesheet":c=Pr(a.href);var u=t.querySelector(Qo(c));if(u)return n.state.loading|=4,n.instance=u,Le(u),u;s=F_(a),(c=yi.get(c))&&Jh(s,c),u=(t.ownerDocument||t).createElement("link"),Le(u);var _=u;return _._p=new Promise(function(T,I){_.onload=T,_.onerror=I}),Dn(u,"link",s),n.state.loading|=4,Lc(u,a.precedence,t),n.instance=u;case"script":return u=zr(a.src),(c=t.querySelector(Jo(u)))?(n.instance=c,Le(c),c):(s=a,(c=yi.get(u))&&(s=B({},a),$h(s,c)),t=t.ownerDocument||t,c=t.createElement("script"),Le(c),Dn(c,"link",s),t.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(r(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(s=n.instance,n.state.loading|=4,Lc(s,a.precedence,t));return n.instance}function Lc(t,n,a){for(var s=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=s.length?s[s.length-1]:null,u=c,_=0;_<s.length;_++){var T=s[_];if(T.dataset.precedence===n)u=T;else if(u!==c)break}u?u.parentNode.insertBefore(t,u.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function Jh(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function $h(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var Oc=null;function G_(t,n,a){if(Oc===null){var s=new Map,c=Oc=new Map;c.set(a,s)}else c=Oc,s=c.get(a),s||(s=new Map,c.set(a,s));if(s.has(t))return s;for(s.set(t,null),a=a.getElementsByTagName(t),c=0;c<a.length;c++){var u=a[c];if(!(u[ze]||u[Pt]||t==="link"&&u.getAttribute("rel")==="stylesheet")&&u.namespaceURI!=="http://www.w3.org/2000/svg"){var _=u.getAttribute(n)||"";_=t+_;var T=s.get(_);T?T.push(u):s.set(_,[u])}}return s}function td(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function iE(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;switch(n.rel){case"stylesheet":return t=n.disabled,typeof n.precedence=="string"&&t==null;default:return!0}case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function V_(t,n){return t==="img"&&n.src!=null&&n.src!==""&&n.onLoad==null&&n.loading!=="lazy"}function k_(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function j_(t){return(t.width||100)*(t.height||100)*(typeof devicePixelRatio=="number"?devicePixelRatio:1)*.25}function X_(t,n){typeof n.decode=="function"&&(t.imgCount++,n.complete||(t.imgBytes+=j_(n),t.suspenseyImages.push(n)),t=rE.bind(t),n.decode().then(t,t))}function aE(t,n,a,s){if(a.type==="stylesheet"&&(typeof s.media!="string"||matchMedia(s.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var c=Pr(s.href),u=n.querySelector(Qo(c));if(u){n=u._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=$o.bind(t),n.then(t,t)),a.state.loading|=4,a.instance=u,Le(u);return}u=n.ownerDocument||n,s=F_(s),(c=yi.get(c))&&Jh(s,c),u=u.createElement("link"),Le(u);var _=u;_._p=new Promise(function(T,I){_.onload=T,_.onerror=I}),Dn(u,"link",s),a.instance=u}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=$o.bind(t),n.addEventListener("load",a),n.addEventListener("error",a))}}var Pc=0;function sE(t,n){return t.stylesheets&&t.count===0&&Ic(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var s=setTimeout(function(){if(t.stylesheets&&Ic(t,t.stylesheets),t.unsuspend){var u=t.unsuspend;t.unsuspend=null,u()}},6e4+n);0<t.imgBytes&&Pc===0&&(Pc=62500*EM());var c=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&Ic(t,t.stylesheets),t.unsuspend)){var u=t.unsuspend;t.unsuspend=null,u()}},(t.imgBytes>Pc?50:800)+n);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(s),clearTimeout(c)}}:null}function Y_(t){if(t.count===0&&(t.imgCount===0||!t.waitingForImages)){if(t.stylesheets)Ic(t,t.stylesheets);else if(t.unsuspend){var n=t.unsuspend;t.unsuspend=null,n()}}}function $o(){this.count--,Y_(this)}function rE(){this.imgCount--,Y_(this)}var zc=null;function Ic(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,zc=new Map,n.forEach(oE,t),zc=null,$o.call(t))}function oE(t,n){if(!(n.state.loading&4)){var a=zc.get(t);if(a)var s=a.get(null);else{a=new Map,zc.set(t,a);for(var c=t.querySelectorAll("link[data-precedence],style[data-precedence]"),u=0;u<c.length;u++){var _=c[u];(_.nodeName==="LINK"||_.getAttribute("media")!=="not all")&&(a.set(_.dataset.precedence,_),s=_)}s&&a.set(null,s)}c=n.instance,_=c.getAttribute("data-precedence"),u=a.get(_)||s,u===s&&a.set(null,c),a.set(_,c),this.count++,s=$o.bind(this),c.addEventListener("load",s),c.addEventListener("error",s),u?u.parentNode.insertBefore(c,u.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(c,t.firstChild)),n.state.loading|=4}}var Ir={$$typeof:mt,Provider:null,Consumer:null,_currentValue:z,_currentValue2:z,_threadCount:0};function lE(t,n,a,s,c,u,_,T,I){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=po(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=po(0),this.hiddenUpdates=po(null),this.identifierPrefix=s,this.onUncaughtError=c,this.onCaughtError=u,this.onRecoverableError=_,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=I,this.transitionTypes=null,this.incompleteTransitions=new Map}function q_(t,n,a,s,c,u,_,T,I,J,rt,xt){return t=new lE(t,n,a,_,I,J,rt,xt,T),n=1,u===!0&&(n|=24),u=Xn(3,null,null,n),t.current=u,u.stateNode=t,n=mf(),n.refCount++,t.pooledCache=n,n.refCount++,u.memoizedState={element:s,isDehydrated:a,cache:n},xf(u),t}function W_(t){return t?(t=cr,t):cr}function Z_(t,n,a,s,c,u){c=W_(c),s.context===null?s.context=c:s.pendingContext=c,s=Ia(n),s.payload={element:a},u=u===void 0?null:u,u!==null&&(s.callback=u),a=Ba(t,s,n),a!==null&&(Zn(a,t,n),Do(a,t,n))}function K_(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function ed(t,n){K_(t,n),(t=t.alternate)&&K_(t,n)}function Q_(t){if(t.tag===13||t.tag===31){var n=xs(t,67108864);n!==null&&Zn(n,t,67108864),ed(t,67108864)}}function J_(t){if(t.tag===13||t.tag===31){var n=oi();n=dt(n);var a=xs(t,n);a!==null&&Zn(a,t,n),ed(t,n)}}var Br=!0;function cE(t,n,a,s){var c=ut.T;ut.T=null;var u=Ot.p;try{Ot.p=2,nd(t,n,a,s)}finally{Ot.p=u,ut.T=c}}function uE(t,n,a,s){var c=ut.T;ut.T=null;var u=Ot.p;try{Ot.p=8,nd(t,n,a,s)}finally{Ot.p=u,ut.T=c}}function nd(t,n,a,s){if(Br){var c=id(s);if(c===null)Ih(t,n,s,Bc,a),tv(t,s);else if(hE(c,t,n,a,s))s.stopPropagation();else if(tv(t,s),n&4&&-1<fE.indexOf(t)){for(;c!==null;){var u=Se(c);if(u!==null)switch(u.tag){case 3:if(u=u.stateNode,u.current.memoizedState.isDehydrated){var _=fi(u.pendingLanes);if(_!==0){var T=u;for(T.pendingLanes|=2,T.entangledLanes|=2;_;){var I=1<<31-Ln(_);T.entanglements[1]|=I,_&=~I}Zi(u),(Be&6)===0&&(Ec=j()+500,Yo(0))}}break;case 31:case 13:T=xs(u,2),T!==null&&Zn(T,u,2),Ac(),ed(u,2)}if(u=id(s),u===null&&Ih(t,n,s,Bc,a),u===c)break;c=u}c!==null&&s.stopPropagation()}else Ih(t,n,s,null,a)}}function id(t){return t=Gu(t),ad(t)}var Bc=null;function ad(t){if(Bc=null,t=Ie(t),t!==null){var n=f(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=h(n),t!==null)return t;t=null}else if(a===31){if(t=d(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return Bc=t,null}function $_(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"fullscreenerror":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"resize":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Lt()){case zt:return 2;case Qt:return 8;case wt:case bt:return 32;case te:return 268435456;default:return 32}default:return 32}}var sd=!1,Ka=null,Qa=null,Ja=null,tl=new Map,el=new Map,$a=[],fE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function tv(t,n){switch(t){case"focusin":case"focusout":Ka=null;break;case"dragenter":case"dragleave":Qa=null;break;case"mouseover":case"mouseout":Ja=null;break;case"pointerover":case"pointerout":tl.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":el.delete(n.pointerId)}}function nl(t,n,a,s,c,u){return t===null||t.nativeEvent!==u?(t={blockedOn:n,domEventName:a,eventSystemFlags:s,nativeEvent:u,targetContainers:[c]},n!==null&&(n=Se(n),n!==null&&Q_(n)),t):(t.eventSystemFlags|=s,n=t.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),t)}function hE(t,n,a,s,c){switch(n){case"focusin":return Ka=nl(Ka,t,n,a,s,c),!0;case"dragenter":return Qa=nl(Qa,t,n,a,s,c),!0;case"mouseover":return Ja=nl(Ja,t,n,a,s,c),!0;case"pointerover":var u=c.pointerId;return tl.set(u,nl(tl.get(u)||null,t,n,a,s,c)),!0;case"gotpointercapture":return u=c.pointerId,el.set(u,nl(el.get(u)||null,t,n,a,s,c)),!0}return!1}function ev(t){var n=Ie(t.target);if(n!==null){var a=f(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){t.blockedOn=n,kt(t.priority,function(){J_(a)});return}}else if(n===31){if(n=d(a),n!==null){t.blockedOn=n,kt(t.priority,function(){J_(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Fc(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=id(t.nativeEvent);if(a===null){a=t.nativeEvent;var s=new a.constructor(a.type,a);Hu=s,a.target.dispatchEvent(s),Hu=null}else return n=Se(a),n!==null&&Q_(n),t.blockedOn=a,!1;n.shift()}return!0}function nv(t,n,a){Fc(t)&&a.delete(n)}function dE(){sd=!1,Ka!==null&&Fc(Ka)&&(Ka=null),Qa!==null&&Fc(Qa)&&(Qa=null),Ja!==null&&Fc(Ja)&&(Ja=null),tl.forEach(nv),el.forEach(nv)}function Hc(t,n){t.blockedOn===n&&(t.blockedOn=null,sd||(sd=!0,o.unstable_scheduleCallback(o.unstable_NormalPriority,dE)))}var Gc=null;function iv(t){Gc!==t&&(Gc=t,o.unstable_scheduleCallback(o.unstable_NormalPriority,function(){Gc===t&&(Gc=null);for(var n=0;n<t.length;n+=3){var a=t[n],s=t[n+1],c=t[n+2];if(typeof s!="function"){if(ad(s||a)===null)continue;break}var u=Se(a);u!==null&&(t.splice(n,3),n-=3,Hf(u,{pending:!0,data:c,method:a.method,action:s},s,c))}}))}function Fr(t){function n(I){return Hc(I,t)}Ka!==null&&Hc(Ka,t),Qa!==null&&Hc(Qa,t),Ja!==null&&Hc(Ja,t),tl.forEach(n),el.forEach(n);for(var a=0;a<$a.length;a++){var s=$a[a];s.blockedOn===t&&(s.blockedOn=null)}for(;0<$a.length&&(a=$a[0],a.blockedOn===null);)ev(a),a.blockedOn===null&&$a.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(s=0;s<a.length;s+=3){var c=a[s],u=a[s+1],_=c[Jt]||null;if(typeof u=="function")_||iv(a);else if(_){var T=null;if(u&&u.hasAttribute("formAction")){if(c=u,_=u[Jt]||null)T=_.formAction;else if(ad(c)!==null)continue}else T=_.action;typeof T=="function"?a[s+1]=T:(a.splice(s,3),s-=3),iv(a)}}}function av(){function t(u){u.canIntercept&&u.info==="react-transition"&&u.intercept({handler:function(){return new Promise(function(_){return c=_})},focusReset:"manual",scroll:"manual"})}function n(){c!==null&&(c(),c=null),s||setTimeout(a,20)}function a(){if(!s&&!navigation.transition){var u=navigation.currentEntry;u&&u.url!=null&&navigation.navigate(u.url,{state:u.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var s=!1,c=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){s=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),c!==null&&(c(),c=null)}}}function rd(t){this._internalRoot=t}Vc.prototype.render=rd.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(r(409));var a=n.current,s=oi();Z_(a,s,t,n,null,null)},Vc.prototype.unmount=rd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;Z_(t.current,2,null,t,null,null),Ac(),n[le]=null}};function Vc(t){this._internalRoot=t}Vc.prototype.unstable_scheduleHydration=function(t){if(t){var n=Ut();t={blockedOn:null,target:t,priority:n};for(var a=0;a<$a.length&&n!==0&&n<$a[a].priority;a++);$a.splice(a,0,t),a===0&&ev(t)}};var sv=e.version;if(sv!=="19.3.1")throw Error(r(527,sv,"19.3.1"));Ot.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(r(188)):(t=Object.keys(t).join(","),Error(r(268,t)));return t=p(n),t=t!==null?x(t):null,t=t===null?null:t.stateNode,t};var pE={bundleType:0,version:"19.3.1",rendererPackageName:"react-dom",currentDispatcherRef:ut,reconcilerVersion:"19.3.1"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var kc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!kc.isDisabled&&kc.supportsFiber)try{Ce=kc.inject(pE),en=kc}catch{}}return al.createRoot=function(t,n){if(!l(t))throw Error(r(299));var a=!1,s="",c=W0,u=Z0,_=K0;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(u=n.onCaughtError),n.onRecoverableError!==void 0&&(_=n.onRecoverableError)),n=q_(t,1,!1,null,null,a,s,null,c,u,_,av),t[le]=n.current,zh(t),new rd(n)},al.hydrateRoot=function(t,n,a){if(!l(t))throw Error(r(299));var s=!1,c="",u=W0,_=Z0,T=K0,I=null;return a!=null&&(a.unstable_strictMode===!0&&(s=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(u=a.onUncaughtError),a.onCaughtError!==void 0&&(_=a.onCaughtError),a.onRecoverableError!==void 0&&(T=a.onRecoverableError),a.formState!==void 0&&(I=a.formState)),n=q_(t,1,!0,n,a??null,s,c,I,u,_,T,av),n.context=W_(null),a=n.current,s=oi(),s=dt(s),c=Ia(s),c.callback=null,Ba(a,c,s),a=s,n.current.lanes=a,gs(n,a),Zi(n),t[le]=n.current,zh(t),new Vc(n)},al.version="19.3.1",al}var mv;function TE(){if(mv)return cd.exports;mv=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),cd.exports=bE(),cd.exports}var AE=TE();const RE=Ax(AE);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CE=o=>o==null?void 0:o.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function wE(o,e,i=[]){if(e==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:CE(o),size:24,node:e,...i.length>0?{aliases:i}:{}}}/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const DE=o=>{let e="",i=!1;for(const r of o){if(r==="-"||r==="_"||r<=" "){i=e.length>0;continue}e.length===0?e+=r.toLowerCase():e+=i?r.toUpperCase():r,i=!1}return e};/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const NE=o=>{const e=DE(o);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wd=(...o)=>o.filter((e,i,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===i).join(" ").trim();/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Is={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function dd(o){return o!=null}function UE(o,e={}){var y,M;const i=e.attributeNames??{},r=E=>i[E]??E,l=o.size??o.width??Is.width,f=o.size??o.height??Is.height,h=((y=o.aliases)==null?void 0:y.filter(E=>typeof E=="string"&&E.trim()!=="").map(E=>`lucide-${E}`))??[],d=[...o.name?[`lucide-${o.name}`]:[],...h],g=((M=e.className)==null?void 0:M.split(" ").filter(Boolean))??[],p=e.includeDefaultClasses===!1?Wd(...g):Wd("lucide",...d,...g),x=e.absoluteStrokeWidth?Number(e.strokeWidth??Is["stroke-width"])*Number(o.size??o.width??Is.width)/Number(e.size??e.width??Is.width):e.strokeWidth??Is["stroke-width"];return["svg",{...Object.entries(Is).reduce((E,[A,S])=>(E[r(A)]=S,E),{}),..."color"in e&&e.color&&{[r("stroke")]:e.color},..."size"in e&&dd(e.size)&&{[r("width")]:e.size,[r("height")]:e.size},..."width"in e&&dd(e.width)&&{[r("width")]:e.width},..."height"in e&&dd(e.height)&&{[r("height")]:e.height},[r("stroke-width")]:x,...p&&{[r("class")]:p},[r("viewBox")]:`0 0 ${l} ${f}`,...e.hasA11yProp===!1?{[r("aria-hidden")]:"true"}:{},..."attributes"in e&&e.attributes},o.node.map(E=>{const[A,S,v]=E,P=e.nonScalingStroke?{[r("vector-effect")]:"non-scaling-stroke",...S}:S;return v?[A,P,v]:[A,P]})]}/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function LE(o,e={}){return UE(o,{...e,attributeNames:{...e.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const OE=o=>{for(const e in o)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},PE=Ft.createContext({}),zE=()=>Ft.useContext(PE),IE=Ft.forwardRef(({color:o,size:e,width:i,height:r,strokeWidth:l,absoluteStrokeWidth:f,nonScalingStroke:h,className:d="",children:g,iconNode:p=[],icon:x={node:p,aliases:[],size:24},...m},y)=>{const{size:M=24,strokeWidth:E=2,absoluteStrokeWidth:A=!1,nonScalingStroke:S=!1,color:v="currentColor",className:P=""}=zE()??{},O=!!g||OE(m),[L,V,H=[]]=LE(x,{color:o??v,width:i??e??M,height:r??e??M,strokeWidth:l??E,absoluteStrokeWidth:f??A,nonScalingStroke:h??S,className:Wd(P,d),hasA11yProp:O,attributes:m});return Ft.createElement(L,{ref:y,...V},[...H.map(([B,q])=>Ft.createElement(B,q)),...Array.isArray(g)?g:[g]])});/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function tn(o,e=[],i=[]){const r=typeof o=="string"?wE(o,e,i):o,l=Ft.forwardRef(({className:f,...h},d)=>Ft.createElement(IE,{ref:d,icon:r,className:f,...h}));return r.name&&(l.displayName=NE(r.name)),l}/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rx={name:"box",size:24,node:[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]};Rx.node;const BE=tn(Rx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cx={name:"check",size:24,node:[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]};Cx.node;const FE=tn(Cx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wx={name:"circle-alert",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],aliases:["alert-circle"]};wx.node;const HE=tn(wx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dx={name:"cpu",size:24,node:[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]]};Dx.node;const Nx=tn(Dx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ux={name:"eye-off",size:24,node:[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]};Ux.node;const GE=tn(Ux);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lx={name:"eye",size:24,node:[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]};Lx.node;const VE=tn(Lx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ox={name:"flame",size:24,node:[["path",{d:"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",key:"1slcih"}]]};Ox.node;const kE=tn(Ox);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Px={name:"folder-open",size:24,node:[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]};Px.node;const jE=tn(Px);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zx={name:"globe",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]};zx.node;const gv=tn(zx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ix={name:"layers",size:24,node:[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],aliases:["layers-3"]};Ix.node;const XE=tn(Ix);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bx={name:"layout-grid",size:24,node:[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]};Bx.node;const YE=tn(Bx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fx={name:"pause",size:24,node:[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]]};Fx.node;const qE=tn(Fx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hx={name:"play",size:24,node:[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]]};Hx.node;const Gx=tn(Hx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vx={name:"rotate-ccw",size:24,node:[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]};Vx.node;const kx=tn(Vx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jx={name:"save",size:24,node:[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]};jx.node;const WE=tn(jx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xx={name:"shield-alert",size:24,node:[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]]};Xx.node;const Yx=tn(Xx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qx={name:"skip-forward",size:24,node:[["path",{d:"M21 4v16",key:"7j8fe9"}],["path",{d:"M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",key:"zs4d6"}]]};qx.node;const ZE=tn(qx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wx={name:"sliders-vertical",size:24,node:[["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M12 21v-9",key:"17s77i"}],["path",{d:"M12 8V3",key:"13r4qs"}],["path",{d:"M17 16h4",key:"h1uq16"}],["path",{d:"M19 12V3",key:"o1uvq1"}],["path",{d:"M19 21v-5",key:"qua636"}],["path",{d:"M3 14h4",key:"bcjad9"}],["path",{d:"M5 10V3",key:"cb8scm"}],["path",{d:"M5 21v-7",key:"1w1uti"}]],aliases:["sliders"]};Wx.node;const Zx=tn(Wx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kx={name:"sparkles",size:24,node:[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],aliases:["stars"]};Kx.node;const KE=tn(Kx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qx={name:"square",size:24,node:[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]]};Qx.node;const QE=tn(Qx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jx={name:"star",size:24,node:[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]};Jx.node;const JE=tn(Jx);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $x={name:"terminal",size:24,node:[["path",{d:"M12 19h8",key:"baeox8"}],["path",{d:"m4 17 6-6-6-6",key:"1yngyt"}]]};$x.node;const $E=tn($x);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ty={name:"x",size:24,node:[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]};ty.node;const Gp=tn(ty);/**
 * @license lucide-react v1.66.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ey={name:"zap",size:24,node:[["path",{d:"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",key:"1v7up4"}]]};ey.node;const ny=tn(ey),tb=({isRunning:o,innerStep:e,fps:i,currentAgent:r,isEvolving:l=!1,onPlay:f,onPause:h,onStep:d,onReset:g,onSetFps:p,onLoadLatest:x,onOpenFilePicker:m,onOpenConfig:y,onOpenEvolution:M})=>{var S;const E=r?((S=r.split("/").pop())==null?void 0:S.split("\\").pop())||r:"未選択",A=r==null?void 0:r.includes("latest_best.npz");return R.jsxs("header",{className:"h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shadow-md z-20",children:[R.jsxs("div",{className:"flex items-center space-x-2",children:[R.jsx("div",{className:"w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-bold",children:"🧠"}),R.jsxs("div",{children:[R.jsxs("h1",{className:"text-sm font-bold tracking-wide text-slate-100 flex items-center gap-1.5",children:["VoxelBrain ",R.jsx("span",{className:"text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded font-mono",children:"KO Studio"})]}),R.jsx("p",{className:"text-[10px] text-slate-400",children:"Slang GPU 3D Neural Circuit Simulator"})]})]}),R.jsxs("div",{className:"flex items-center space-x-2",children:[R.jsxs("div",{className:"flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800 text-xs px-2.5 py-1.5 rounded-xl max-w-xs",title:`現在ロード中: ${r||"なし"}`,children:[R.jsx(Nx,{className:"w-3.5 h-3.5 text-sky-400 flex-shrink-0"}),R.jsx("span",{className:"text-slate-300 font-mono text-[11px] truncate max-w-[150px]",children:E}),A&&R.jsx("span",{className:"text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono flex-shrink-0",children:"Latest"})]}),R.jsxs("button",{onClick:x,className:`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-xl border transition font-medium ${A?"bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm":"bg-slate-800 hover:bg-slate-750 text-amber-300 border-slate-700 hover:border-amber-500/40"}`,title:"最新ベスト個体 (latest_best.npz) をロード",children:[R.jsx(JE,{className:"w-3.5 h-3.5 text-amber-400 fill-amber-400/20"}),R.jsx("span",{children:"最新エリート"})]}),R.jsxs("button",{onClick:m,className:"flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded-xl transition font-medium shadow-sm",title:"エクスプローラーから .npz ファイルを選択（デフォルト: backups/）",children:[R.jsx(jE,{className:"w-3.5 h-3.5"}),R.jsx("span",{children:"ファイル選択 (.npz)"})]}),R.jsx("div",{className:"h-4 w-px bg-slate-800 mx-1"}),R.jsxs("button",{onClick:y,className:"flex items-center space-x-1 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs px-2.5 py-1.5 rounded-xl transition",title:"sim_config.py 編集",children:[R.jsx(Zx,{className:"w-3.5 h-3.5 text-sky-400"}),R.jsx("span",{children:"設定"})]}),R.jsxs("button",{onClick:M,className:`flex items-center space-x-1 border text-xs px-2.5 py-1.5 rounded-xl transition font-medium ${l?"bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse":"bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700"}`,title:"voxelBrain.py GPU 進化計算",children:[R.jsx(kE,{className:`w-3.5 h-3.5 ${l?"text-emerald-400":"text-amber-400"}`}),R.jsx("span",{children:"GPU進化"})]})]}),R.jsxs("div",{className:"flex items-center space-x-2 bg-slate-950/60 border border-slate-800 rounded-lg p-1",children:[o?R.jsxs("button",{onClick:v=>{v.currentTarget.blur(),h()},className:"flex items-center space-x-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs px-3 py-1 rounded-md transition font-medium",title:"一時停止 (Space)",children:[R.jsx(qE,{className:"w-3.5 h-3.5 fill-current"}),R.jsx("span",{children:"一時停止"})]}):R.jsxs("button",{onClick:v=>{v.currentTarget.blur(),f()},className:"flex items-center space-x-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1 rounded-md transition font-medium",title:"再生 (Space)",children:[R.jsx(Gx,{className:"w-3.5 h-3.5 fill-current"}),R.jsx("span",{children:"再生"})]}),R.jsxs("button",{onClick:v=>{v.currentTarget.blur(),d()},disabled:o,className:"flex items-center space-x-1 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs px-2.5 py-1 rounded-md transition disabled:opacity-40",title:"1ステップ進む (→)",children:[R.jsx(ZE,{className:"w-3.5 h-3.5"}),R.jsx("span",{children:"Step"})]}),R.jsxs("button",{onClick:v=>{v.currentTarget.blur(),g()},className:"flex items-center space-x-1 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs px-2 py-1 rounded-md transition",title:"シミュレーション初期化 (R)",children:[R.jsx(kx,{className:"w-3.5 h-3.5"}),R.jsx("span",{children:"リセット"})]}),R.jsx("div",{className:"h-4 w-px bg-slate-800 mx-1"}),R.jsxs("div",{className:"text-xs font-mono px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300 flex items-center gap-1.5",children:[R.jsx("span",{className:"text-[10px] text-slate-500 font-sans",children:"STEP"}),R.jsx("span",{className:"font-bold text-sky-400",children:e.toString().padStart(4,"0")}),R.jsx("span",{className:"text-[10px] text-slate-500",children:"/ 1000"})]}),R.jsxs("div",{className:"flex items-center space-x-1 pl-1",children:[R.jsx("span",{className:"text-[10px] text-slate-400",children:"FPS:"}),R.jsxs("select",{value:i,onChange:v=>p(Number(v.target.value)),className:"bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-sky-500 font-mono",children:[R.jsx("option",{value:10,children:"10"}),R.jsx("option",{value:30,children:"30"}),R.jsx("option",{value:60,children:"60"}),R.jsx("option",{value:120,children:"120"})]})]})]})]})};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Vp="180",no={ROTATE:0,DOLLY:1,PAN:2},to={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},eb=0,_v=1,nb=2,iy=1,ib=2,Ea=3,fs=0,Jn=1,ba=2,cs=0,io=1,vv=2,xv=3,yv=4,ab=5,Xs=100,sb=101,rb=102,ob=103,lb=104,cb=200,ub=201,fb=202,hb=203,Zd=204,Kd=205,db=206,pb=207,mb=208,gb=209,_b=210,vb=211,xb=212,yb=213,Sb=214,Qd=0,Jd=1,$d=2,so=3,tp=4,ep=5,np=6,ip=7,ay=0,Mb=1,Eb=2,us=0,bb=1,Tb=2,Ab=3,Rb=4,Cb=5,wb=6,Db=7,sy=300,ro=301,oo=302,ap=303,sp=304,wu=306,rp=1e3,qs=1001,op=1002,zi=1003,Nb=1004,jc=1005,Qi=1006,pd=1007,Ws=1008,ta=1009,ry=1010,oy=1011,dl=1012,kp=1013,Zs=1014,Ta=1015,vl=1016,jp=1017,Xp=1018,pl=1020,ly=35902,cy=35899,uy=1021,fy=1022,Oi=1023,ml=1026,gl=1027,hy=1028,Yp=1029,dy=1030,qp=1031,Wp=1033,vu=33776,xu=33777,yu=33778,Su=33779,lp=35840,cp=35841,up=35842,fp=35843,hp=36196,dp=37492,pp=37496,mp=37808,gp=37809,_p=37810,vp=37811,xp=37812,yp=37813,Sp=37814,Mp=37815,Ep=37816,bp=37817,Tp=37818,Ap=37819,Rp=37820,Cp=37821,wp=36492,Dp=36494,Np=36495,Up=36283,Lp=36284,Op=36285,Pp=36286,Ub=3200,Lb=3201,py=0,Ob=1,ls="",Mi="srgb",lo="srgb-linear",Eu="linear",Ye="srgb",Hr=7680,Sv=519,Pb=512,zb=513,Ib=514,my=515,Bb=516,Fb=517,Hb=518,Gb=519,Mv=35044,Ev="300 es",Ji=2e3,bu=2001;class $s{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(i)===-1&&r[e].push(i)}hasEventListener(e,i){const r=this._listeners;return r===void 0?!1:r[e]!==void 0&&r[e].indexOf(i)!==-1}removeEventListener(e,i){const r=this._listeners;if(r===void 0)return;const l=r[e];if(l!==void 0){const f=l.indexOf(i);f!==-1&&l.splice(f,1)}}dispatchEvent(e){const i=this._listeners;if(i===void 0)return;const r=i[e.type];if(r!==void 0){e.target=this;const l=r.slice(0);for(let f=0,h=l.length;f<h;f++)l[f].call(this,e);e.target=null}}}const zn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],hl=Math.PI/180,zp=180/Math.PI;function xl(){const o=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(zn[o&255]+zn[o>>8&255]+zn[o>>16&255]+zn[o>>24&255]+"-"+zn[e&255]+zn[e>>8&255]+"-"+zn[e>>16&15|64]+zn[e>>24&255]+"-"+zn[i&63|128]+zn[i>>8&255]+"-"+zn[i>>16&255]+zn[i>>24&255]+zn[r&255]+zn[r>>8&255]+zn[r>>16&255]+zn[r>>24&255]).toLowerCase()}function Re(o,e,i){return Math.max(e,Math.min(i,o))}function Vb(o,e){return(o%e+e)%e}function md(o,e,i){return(1-i)*o+i*e}function sl(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function Kn(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}const kb={DEG2RAD:hl};class pe{constructor(e=0,i=0){pe.prototype.isVector2=!0,this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,r=this.y,l=e.elements;return this.x=l[0]*i+l[3]*r+l[6],this.y=l[1]*i+l[4]*r+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=Re(this.x,e.x,i.x),this.y=Re(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=Re(this.x,e,i),this.y=Re(this.y,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Re(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(Re(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y;return i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const r=Math.cos(i),l=Math.sin(i),f=this.x-e.x,h=this.y-e.y;return this.x=f*r-h*l+e.x,this.y=f*l+h*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ks{constructor(e=0,i=0,r=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=r,this._w=l}static slerpFlat(e,i,r,l,f,h,d){let g=r[l+0],p=r[l+1],x=r[l+2],m=r[l+3];const y=f[h+0],M=f[h+1],E=f[h+2],A=f[h+3];if(d===0){e[i+0]=g,e[i+1]=p,e[i+2]=x,e[i+3]=m;return}if(d===1){e[i+0]=y,e[i+1]=M,e[i+2]=E,e[i+3]=A;return}if(m!==A||g!==y||p!==M||x!==E){let S=1-d;const v=g*y+p*M+x*E+m*A,P=v>=0?1:-1,O=1-v*v;if(O>Number.EPSILON){const V=Math.sqrt(O),H=Math.atan2(V,v*P);S=Math.sin(S*H)/V,d=Math.sin(d*H)/V}const L=d*P;if(g=g*S+y*L,p=p*S+M*L,x=x*S+E*L,m=m*S+A*L,S===1-d){const V=1/Math.sqrt(g*g+p*p+x*x+m*m);g*=V,p*=V,x*=V,m*=V}}e[i]=g,e[i+1]=p,e[i+2]=x,e[i+3]=m}static multiplyQuaternionsFlat(e,i,r,l,f,h){const d=r[l],g=r[l+1],p=r[l+2],x=r[l+3],m=f[h],y=f[h+1],M=f[h+2],E=f[h+3];return e[i]=d*E+x*m+g*M-p*y,e[i+1]=g*E+x*y+p*m-d*M,e[i+2]=p*E+x*M+d*y-g*m,e[i+3]=x*E-d*m-g*y-p*M,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,r,l){return this._x=e,this._y=i,this._z=r,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const r=e._x,l=e._y,f=e._z,h=e._order,d=Math.cos,g=Math.sin,p=d(r/2),x=d(l/2),m=d(f/2),y=g(r/2),M=g(l/2),E=g(f/2);switch(h){case"XYZ":this._x=y*x*m+p*M*E,this._y=p*M*m-y*x*E,this._z=p*x*E+y*M*m,this._w=p*x*m-y*M*E;break;case"YXZ":this._x=y*x*m+p*M*E,this._y=p*M*m-y*x*E,this._z=p*x*E-y*M*m,this._w=p*x*m+y*M*E;break;case"ZXY":this._x=y*x*m-p*M*E,this._y=p*M*m+y*x*E,this._z=p*x*E+y*M*m,this._w=p*x*m-y*M*E;break;case"ZYX":this._x=y*x*m-p*M*E,this._y=p*M*m+y*x*E,this._z=p*x*E-y*M*m,this._w=p*x*m+y*M*E;break;case"YZX":this._x=y*x*m+p*M*E,this._y=p*M*m+y*x*E,this._z=p*x*E-y*M*m,this._w=p*x*m-y*M*E;break;case"XZY":this._x=y*x*m-p*M*E,this._y=p*M*m-y*x*E,this._z=p*x*E+y*M*m,this._w=p*x*m+y*M*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const r=i/2,l=Math.sin(r);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,r=i[0],l=i[4],f=i[8],h=i[1],d=i[5],g=i[9],p=i[2],x=i[6],m=i[10],y=r+d+m;if(y>0){const M=.5/Math.sqrt(y+1);this._w=.25/M,this._x=(x-g)*M,this._y=(f-p)*M,this._z=(h-l)*M}else if(r>d&&r>m){const M=2*Math.sqrt(1+r-d-m);this._w=(x-g)/M,this._x=.25*M,this._y=(l+h)/M,this._z=(f+p)/M}else if(d>m){const M=2*Math.sqrt(1+d-r-m);this._w=(f-p)/M,this._x=(l+h)/M,this._y=.25*M,this._z=(g+x)/M}else{const M=2*Math.sqrt(1+m-r-d);this._w=(h-l)/M,this._x=(f+p)/M,this._y=(g+x)/M,this._z=.25*M}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let r=e.dot(i)+1;return r<1e-8?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Re(this.dot(e),-1,1)))}rotateTowards(e,i){const r=this.angleTo(e);if(r===0)return this;const l=Math.min(1,i/r);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const r=e._x,l=e._y,f=e._z,h=e._w,d=i._x,g=i._y,p=i._z,x=i._w;return this._x=r*x+h*d+l*p-f*g,this._y=l*x+h*g+f*d-r*p,this._z=f*x+h*p+r*g-l*d,this._w=h*x-r*d-l*g-f*p,this._onChangeCallback(),this}slerp(e,i){if(i===0)return this;if(i===1)return this.copy(e);const r=this._x,l=this._y,f=this._z,h=this._w;let d=h*e._w+r*e._x+l*e._y+f*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=h,this._x=r,this._y=l,this._z=f,this;const g=1-d*d;if(g<=Number.EPSILON){const M=1-i;return this._w=M*h+i*this._w,this._x=M*r+i*this._x,this._y=M*l+i*this._y,this._z=M*f+i*this._z,this.normalize(),this}const p=Math.sqrt(g),x=Math.atan2(p,d),m=Math.sin((1-i)*x)/p,y=Math.sin(i*x)/p;return this._w=h*m+this._w*y,this._x=r*m+this._x*y,this._y=l*m+this._y*y,this._z=f*m+this._z*y,this._onChangeCallback(),this}slerpQuaternions(e,i,r){return this.copy(e).slerp(i,r)}random(){const e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),r=Math.random(),l=Math.sqrt(1-r),f=Math.sqrt(r);return this.set(l*Math.sin(e),l*Math.cos(e),f*Math.sin(i),f*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class st{constructor(e=0,i=0,r=0){st.prototype.isVector3=!0,this.x=e,this.y=i,this.z=r}set(e,i,r){return r===void 0&&(r=this.z),this.x=e,this.y=i,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(bv.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(bv.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,r=this.y,l=this.z,f=e.elements;return this.x=f[0]*i+f[3]*r+f[6]*l,this.y=f[1]*i+f[4]*r+f[7]*l,this.z=f[2]*i+f[5]*r+f[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,f=e.elements,h=1/(f[3]*i+f[7]*r+f[11]*l+f[15]);return this.x=(f[0]*i+f[4]*r+f[8]*l+f[12])*h,this.y=(f[1]*i+f[5]*r+f[9]*l+f[13])*h,this.z=(f[2]*i+f[6]*r+f[10]*l+f[14])*h,this}applyQuaternion(e){const i=this.x,r=this.y,l=this.z,f=e.x,h=e.y,d=e.z,g=e.w,p=2*(h*l-d*r),x=2*(d*i-f*l),m=2*(f*r-h*i);return this.x=i+g*p+h*m-d*x,this.y=r+g*x+d*p-f*m,this.z=l+g*m+f*x-h*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,r=this.y,l=this.z,f=e.elements;return this.x=f[0]*i+f[4]*r+f[8]*l,this.y=f[1]*i+f[5]*r+f[9]*l,this.z=f[2]*i+f[6]*r+f[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=Re(this.x,e.x,i.x),this.y=Re(this.y,e.y,i.y),this.z=Re(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=Re(this.x,e,i),this.y=Re(this.y,e,i),this.z=Re(this.z,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Re(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const r=e.x,l=e.y,f=e.z,h=i.x,d=i.y,g=i.z;return this.x=l*g-f*d,this.y=f*h-r*g,this.z=r*d-l*h,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const r=e.dot(this)/i;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return gd.copy(this).projectOnVector(e),this.sub(gd)}reflect(e){return this.sub(gd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(Re(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y,l=this.z-e.z;return i*i+r*r+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,r){const l=Math.sin(i)*e;return this.x=l*Math.sin(r),this.y=Math.cos(i)*e,this.z=l*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,r){return this.x=e*Math.sin(i),this.y=r,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=r,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,i=Math.random()*2-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(e),this.y=i,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const gd=new st,bv=new Ks;class xe{constructor(e,i,r,l,f,h,d,g,p){xe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,r,l,f,h,d,g,p)}set(e,i,r,l,f,h,d,g,p){const x=this.elements;return x[0]=e,x[1]=l,x[2]=d,x[3]=i,x[4]=f,x[5]=g,x[6]=r,x[7]=h,x[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(e,i,r){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,f=this.elements,h=r[0],d=r[3],g=r[6],p=r[1],x=r[4],m=r[7],y=r[2],M=r[5],E=r[8],A=l[0],S=l[3],v=l[6],P=l[1],O=l[4],L=l[7],V=l[2],H=l[5],B=l[8];return f[0]=h*A+d*P+g*V,f[3]=h*S+d*O+g*H,f[6]=h*v+d*L+g*B,f[1]=p*A+x*P+m*V,f[4]=p*S+x*O+m*H,f[7]=p*v+x*L+m*B,f[2]=y*A+M*P+E*V,f[5]=y*S+M*O+E*H,f[8]=y*v+M*L+E*B,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[1],l=e[2],f=e[3],h=e[4],d=e[5],g=e[6],p=e[7],x=e[8];return i*h*x-i*d*p-r*f*x+r*d*g+l*f*p-l*h*g}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],f=e[3],h=e[4],d=e[5],g=e[6],p=e[7],x=e[8],m=x*h-d*p,y=d*g-x*f,M=p*f-h*g,E=i*m+r*y+l*M;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const A=1/E;return e[0]=m*A,e[1]=(l*p-x*r)*A,e[2]=(d*r-l*h)*A,e[3]=y*A,e[4]=(x*i-l*g)*A,e[5]=(l*f-d*i)*A,e[6]=M*A,e[7]=(r*g-p*i)*A,e[8]=(h*i-r*f)*A,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,r,l,f,h,d){const g=Math.cos(f),p=Math.sin(f);return this.set(r*g,r*p,-r*(g*h+p*d)+h+e,-l*p,l*g,-l*(-p*h+g*d)+d+i,0,0,1),this}scale(e,i){return this.premultiply(_d.makeScale(e,i)),this}rotate(e){return this.premultiply(_d.makeRotation(-e)),this}translate(e,i){return this.premultiply(_d.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<9;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<9;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const _d=new xe;function gy(o){for(let e=o.length-1;e>=0;--e)if(o[e]>=65535)return!0;return!1}function Tu(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function jb(){const o=Tu("canvas");return o.style.display="block",o}const Tv={};function _l(o){o in Tv||(Tv[o]=!0,console.warn(o))}function Xb(o,e,i){return new Promise(function(r,l){function f(){switch(o.clientWaitSync(e,o.SYNC_FLUSH_COMMANDS_BIT,0)){case o.WAIT_FAILED:l();break;case o.TIMEOUT_EXPIRED:setTimeout(f,i);break;default:r()}}setTimeout(f,i)})}const Av=new xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Rv=new xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Yb(){const o={enabled:!0,workingColorSpace:lo,spaces:{},convert:function(l,f,h){return this.enabled===!1||f===h||!f||!h||(this.spaces[f].transfer===Ye&&(l.r=Aa(l.r),l.g=Aa(l.g),l.b=Aa(l.b)),this.spaces[f].primaries!==this.spaces[h].primaries&&(l.applyMatrix3(this.spaces[f].toXYZ),l.applyMatrix3(this.spaces[h].fromXYZ)),this.spaces[h].transfer===Ye&&(l.r=ao(l.r),l.g=ao(l.g),l.b=ao(l.b))),l},workingToColorSpace:function(l,f){return this.convert(l,this.workingColorSpace,f)},colorSpaceToWorking:function(l,f){return this.convert(l,f,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===ls?Eu:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,f=this.workingColorSpace){return l.fromArray(this.spaces[f].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,f,h){return l.copy(this.spaces[f].toXYZ).multiply(this.spaces[h].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,f){return _l("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),o.workingToColorSpace(l,f)},toWorkingColorSpace:function(l,f){return _l("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),o.colorSpaceToWorking(l,f)}},e=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],r=[.3127,.329];return o.define({[lo]:{primaries:e,whitePoint:r,transfer:Eu,toXYZ:Av,fromXYZ:Rv,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:Mi},outputColorSpaceConfig:{drawingBufferColorSpace:Mi}},[Mi]:{primaries:e,whitePoint:r,transfer:Ye,toXYZ:Av,fromXYZ:Rv,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:Mi}}}),o}const Pe=Yb();function Aa(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function ao(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let Gr;class qb{static getDataURL(e,i="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let r;if(e instanceof HTMLCanvasElement)r=e;else{Gr===void 0&&(Gr=Tu("canvas")),Gr.width=e.width,Gr.height=e.height;const l=Gr.getContext("2d");e instanceof ImageData?l.putImageData(e,0,0):l.drawImage(e,0,0,e.width,e.height),r=Gr}return r.toDataURL(i)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=Tu("canvas");i.width=e.width,i.height=e.height;const r=i.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const l=r.getImageData(0,0,e.width,e.height),f=l.data;for(let h=0;h<f.length;h++)f[h]=Aa(f[h]/255)*255;return r.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let r=0;r<i.length;r++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[r]=Math.floor(Aa(i[r]/255)*255):i[r]=Aa(i[r]);return{data:i,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Wb=0;class Zp{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wb++}),this.uuid=xl(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?e.set(i.videoWidth,i.videoHeight,0):i instanceof VideoFrame?e.set(i.displayHeight,i.displayWidth,0):i!==null?e.set(i.width,i.height,i.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},l=this.data;if(l!==null){let f;if(Array.isArray(l)){f=[];for(let h=0,d=l.length;h<d;h++)l[h].isDataTexture?f.push(vd(l[h].image)):f.push(vd(l[h]))}else f=vd(l);r.url=f}return i||(e.images[this.uuid]=r),r}}function vd(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?qb.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Zb=0;const xd=new st;class $n extends $s{constructor(e=$n.DEFAULT_IMAGE,i=$n.DEFAULT_MAPPING,r=qs,l=qs,f=Qi,h=Ws,d=Oi,g=ta,p=$n.DEFAULT_ANISOTROPY,x=ls){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zb++}),this.uuid=xl(),this.name="",this.source=new Zp(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=l,this.magFilter=f,this.minFilter=h,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=g,this.offset=new pe(0,0),this.repeat=new pe(1,1),this.center=new pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=x,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(xd).x}get height(){return this.source.getSize(xd).y}get depth(){return this.source.getSize(xd).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const i in e){const r=e[i];if(r===void 0){console.warn(`THREE.Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Texture.setValues(): property '${i}' does not exist.`);continue}l&&r&&l.isVector2&&r.isVector2||l&&r&&l.isVector3&&r.isVector3||l&&r&&l.isMatrix3&&r.isMatrix3?l.copy(r):this[i]=r}}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==sy)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rp:e.x=e.x-Math.floor(e.x);break;case qs:e.x=e.x<0?0:1;break;case op:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rp:e.y=e.y-Math.floor(e.y);break;case qs:e.y=e.y<0?0:1;break;case op:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}$n.DEFAULT_IMAGE=null;$n.DEFAULT_MAPPING=sy;$n.DEFAULT_ANISOTROPY=1;class ln{constructor(e=0,i=0,r=0,l=1){ln.prototype.isVector4=!0,this.x=e,this.y=i,this.z=r,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,r,l){return this.x=e,this.y=i,this.z=r,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,f=this.w,h=e.elements;return this.x=h[0]*i+h[4]*r+h[8]*l+h[12]*f,this.y=h[1]*i+h[5]*r+h[9]*l+h[13]*f,this.z=h[2]*i+h[6]*r+h[10]*l+h[14]*f,this.w=h[3]*i+h[7]*r+h[11]*l+h[15]*f,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,r,l,f;const g=e.elements,p=g[0],x=g[4],m=g[8],y=g[1],M=g[5],E=g[9],A=g[2],S=g[6],v=g[10];if(Math.abs(x-y)<.01&&Math.abs(m-A)<.01&&Math.abs(E-S)<.01){if(Math.abs(x+y)<.1&&Math.abs(m+A)<.1&&Math.abs(E+S)<.1&&Math.abs(p+M+v-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const O=(p+1)/2,L=(M+1)/2,V=(v+1)/2,H=(x+y)/4,B=(m+A)/4,q=(E+S)/4;return O>L&&O>V?O<.01?(r=0,l=.707106781,f=.707106781):(r=Math.sqrt(O),l=H/r,f=B/r):L>V?L<.01?(r=.707106781,l=0,f=.707106781):(l=Math.sqrt(L),r=H/l,f=q/l):V<.01?(r=.707106781,l=.707106781,f=0):(f=Math.sqrt(V),r=B/f,l=q/f),this.set(r,l,f,i),this}let P=Math.sqrt((S-E)*(S-E)+(m-A)*(m-A)+(y-x)*(y-x));return Math.abs(P)<.001&&(P=1),this.x=(S-E)/P,this.y=(m-A)/P,this.z=(y-x)/P,this.w=Math.acos((p+M+v-1)/2),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=Re(this.x,e.x,i.x),this.y=Re(this.y,e.y,i.y),this.z=Re(this.z,e.z,i.z),this.w=Re(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=Re(this.x,e,i),this.y=Re(this.y,e,i),this.z=Re(this.z,e,i),this.w=Re(this.w,e,i),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Re(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this.w=e.w+(i.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Kb extends $s{constructor(e=1,i=1,r={}){super(),r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},r),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=r.depth,this.scissor=new ln(0,0,e,i),this.scissorTest=!1,this.viewport=new ln(0,0,e,i);const l={width:e,height:i,depth:r.depth},f=new $n(l);this.textures=[];const h=r.count;for(let d=0;d<h;d++)this.textures[d]=f.clone(),this.textures[d].isRenderTargetTexture=!0,this.textures[d].renderTarget=this;this._setTextureOptions(r),this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples,this.multiview=r.multiview}_setTextureOptions(e={}){const i={minFilter:Qi,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(i.mapping=e.mapping),e.wrapS!==void 0&&(i.wrapS=e.wrapS),e.wrapT!==void 0&&(i.wrapT=e.wrapT),e.wrapR!==void 0&&(i.wrapR=e.wrapR),e.magFilter!==void 0&&(i.magFilter=e.magFilter),e.minFilter!==void 0&&(i.minFilter=e.minFilter),e.format!==void 0&&(i.format=e.format),e.type!==void 0&&(i.type=e.type),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(i.colorSpace=e.colorSpace),e.flipY!==void 0&&(i.flipY=e.flipY),e.generateMipmaps!==void 0&&(i.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(i.internalFormat=e.internalFormat);for(let r=0;r<this.textures.length;r++)this.textures[r].setValues(i)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,i,r=1){if(this.width!==e||this.height!==i||this.depth!==r){this.width=e,this.height=i,this.depth=r;for(let l=0,f=this.textures.length;l<f;l++)this.textures[l].image.width=e,this.textures[l].image.height=i,this.textures[l].image.depth=r,this.textures[l].isArrayTexture=this.textures[l].image.depth>1;this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++){this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},e.textures[i].image);this.textures[i].source=new Zp(l)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qs extends Kb{constructor(e=1,i=1,r={}){super(e,i,r),this.isWebGLRenderTarget=!0}}class _y extends $n{constructor(e=null,i=1,r=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=zi,this.minFilter=zi,this.wrapR=qs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Qb extends $n{constructor(e=null,i=1,r=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=zi,this.minFilter=zi,this.wrapR=qs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class yl{constructor(e=new st(1/0,1/0,1/0),i=new st(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i+=3)this.expandByPoint(Ni.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,r=e.count;i<r;i++)this.expandByPoint(Ni.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const r=Ni.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const f=r.getAttribute("position");if(i===!0&&f!==void 0&&e.isInstancedMesh!==!0)for(let h=0,d=f.count;h<d;h++)e.isMesh===!0?e.getVertexPosition(h,Ni):Ni.fromBufferAttribute(f,h),Ni.applyMatrix4(e.matrixWorld),this.expandByPoint(Ni);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xc.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Xc.copy(r.boundingBox)),Xc.applyMatrix4(e.matrixWorld),this.union(Xc)}const l=e.children;for(let f=0,h=l.length;f<h;f++)this.expandByObject(l[f],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ni),Ni.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,r;return e.normal.x>0?(i=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),i<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rl),Yc.subVectors(this.max,rl),Vr.subVectors(e.a,rl),kr.subVectors(e.b,rl),jr.subVectors(e.c,rl),es.subVectors(kr,Vr),ns.subVectors(jr,kr),Bs.subVectors(Vr,jr);let i=[0,-es.z,es.y,0,-ns.z,ns.y,0,-Bs.z,Bs.y,es.z,0,-es.x,ns.z,0,-ns.x,Bs.z,0,-Bs.x,-es.y,es.x,0,-ns.y,ns.x,0,-Bs.y,Bs.x,0];return!yd(i,Vr,kr,jr,Yc)||(i=[1,0,0,0,1,0,0,0,1],!yd(i,Vr,kr,jr,Yc))?!1:(qc.crossVectors(es,ns),i=[qc.x,qc.y,qc.z],yd(i,Vr,kr,jr,Yc))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ni).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ni).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(va[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),va[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),va[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),va[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),va[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),va[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),va[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),va[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(va),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const va=[new st,new st,new st,new st,new st,new st,new st,new st],Ni=new st,Xc=new yl,Vr=new st,kr=new st,jr=new st,es=new st,ns=new st,Bs=new st,rl=new st,Yc=new st,qc=new st,Fs=new st;function yd(o,e,i,r,l){for(let f=0,h=o.length-3;f<=h;f+=3){Fs.fromArray(o,f);const d=l.x*Math.abs(Fs.x)+l.y*Math.abs(Fs.y)+l.z*Math.abs(Fs.z),g=e.dot(Fs),p=i.dot(Fs),x=r.dot(Fs);if(Math.max(-Math.max(g,p,x),Math.min(g,p,x))>d)return!1}return!0}const Jb=new yl,ol=new st,Sd=new st;class Du{constructor(e=new st,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const r=this.center;i!==void 0?r.copy(i):Jb.setFromPoints(e).getCenter(r);let l=0;for(let f=0,h=e.length;f<h;f++)l=Math.max(l,r.distanceToSquared(e[f]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const r=this.center.distanceToSquared(e);return i.copy(e),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ol.subVectors(e,this.center);const i=ol.lengthSq();if(i>this.radius*this.radius){const r=Math.sqrt(i),l=(r-this.radius)*.5;this.center.addScaledVector(ol,l/r),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Sd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ol.copy(e.center).add(Sd)),this.expandByPoint(ol.copy(e.center).sub(Sd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const xa=new st,Md=new st,Wc=new st,is=new st,Ed=new st,Zc=new st,bd=new st;class Nu{constructor(e=new st,i=new st(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xa)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const r=i.dot(this.direction);return r<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=xa.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(xa.copy(this.origin).addScaledVector(this.direction,i),xa.distanceToSquared(e))}distanceSqToSegment(e,i,r,l){Md.copy(e).add(i).multiplyScalar(.5),Wc.copy(i).sub(e).normalize(),is.copy(this.origin).sub(Md);const f=e.distanceTo(i)*.5,h=-this.direction.dot(Wc),d=is.dot(this.direction),g=-is.dot(Wc),p=is.lengthSq(),x=Math.abs(1-h*h);let m,y,M,E;if(x>0)if(m=h*g-d,y=h*d-g,E=f*x,m>=0)if(y>=-E)if(y<=E){const A=1/x;m*=A,y*=A,M=m*(m+h*y+2*d)+y*(h*m+y+2*g)+p}else y=f,m=Math.max(0,-(h*y+d)),M=-m*m+y*(y+2*g)+p;else y=-f,m=Math.max(0,-(h*y+d)),M=-m*m+y*(y+2*g)+p;else y<=-E?(m=Math.max(0,-(-h*f+d)),y=m>0?-f:Math.min(Math.max(-f,-g),f),M=-m*m+y*(y+2*g)+p):y<=E?(m=0,y=Math.min(Math.max(-f,-g),f),M=y*(y+2*g)+p):(m=Math.max(0,-(h*f+d)),y=m>0?f:Math.min(Math.max(-f,-g),f),M=-m*m+y*(y+2*g)+p);else y=h>0?-f:f,m=Math.max(0,-(h*y+d)),M=-m*m+y*(y+2*g)+p;return r&&r.copy(this.origin).addScaledVector(this.direction,m),l&&l.copy(Md).addScaledVector(Wc,y),M}intersectSphere(e,i){xa.subVectors(e.center,this.origin);const r=xa.dot(this.direction),l=xa.dot(xa)-r*r,f=e.radius*e.radius;if(l>f)return null;const h=Math.sqrt(f-l),d=r-h,g=r+h;return g<0?null:d<0?this.at(g,i):this.at(d,i)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/i;return r>=0?r:null}intersectPlane(e,i){const r=this.distanceToPlane(e);return r===null?null:this.at(r,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let r,l,f,h,d,g;const p=1/this.direction.x,x=1/this.direction.y,m=1/this.direction.z,y=this.origin;return p>=0?(r=(e.min.x-y.x)*p,l=(e.max.x-y.x)*p):(r=(e.max.x-y.x)*p,l=(e.min.x-y.x)*p),x>=0?(f=(e.min.y-y.y)*x,h=(e.max.y-y.y)*x):(f=(e.max.y-y.y)*x,h=(e.min.y-y.y)*x),r>h||f>l||((f>r||isNaN(r))&&(r=f),(h<l||isNaN(l))&&(l=h),m>=0?(d=(e.min.z-y.z)*m,g=(e.max.z-y.z)*m):(d=(e.max.z-y.z)*m,g=(e.min.z-y.z)*m),r>g||d>l)||((d>r||r!==r)&&(r=d),(g<l||l!==l)&&(l=g),l<0)?null:this.at(r>=0?r:l,i)}intersectsBox(e){return this.intersectBox(e,xa)!==null}intersectTriangle(e,i,r,l,f){Ed.subVectors(i,e),Zc.subVectors(r,e),bd.crossVectors(Ed,Zc);let h=this.direction.dot(bd),d;if(h>0){if(l)return null;d=1}else if(h<0)d=-1,h=-h;else return null;is.subVectors(this.origin,e);const g=d*this.direction.dot(Zc.crossVectors(is,Zc));if(g<0)return null;const p=d*this.direction.dot(Ed.cross(is));if(p<0||g+p>h)return null;const x=-d*is.dot(bd);return x<0?null:this.at(x/h,f)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class an{constructor(e,i,r,l,f,h,d,g,p,x,m,y,M,E,A,S){an.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,r,l,f,h,d,g,p,x,m,y,M,E,A,S)}set(e,i,r,l,f,h,d,g,p,x,m,y,M,E,A,S){const v=this.elements;return v[0]=e,v[4]=i,v[8]=r,v[12]=l,v[1]=f,v[5]=h,v[9]=d,v[13]=g,v[2]=p,v[6]=x,v[10]=m,v[14]=y,v[3]=M,v[7]=E,v[11]=A,v[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new an().fromArray(this.elements)}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(e){const i=this.elements,r=e.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,r){return e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,i,r){return this.set(e.x,i.x,r.x,0,e.y,i.y,r.y,0,e.z,i.z,r.z,0,0,0,0,1),this}extractRotation(e){const i=this.elements,r=e.elements,l=1/Xr.setFromMatrixColumn(e,0).length(),f=1/Xr.setFromMatrixColumn(e,1).length(),h=1/Xr.setFromMatrixColumn(e,2).length();return i[0]=r[0]*l,i[1]=r[1]*l,i[2]=r[2]*l,i[3]=0,i[4]=r[4]*f,i[5]=r[5]*f,i[6]=r[6]*f,i[7]=0,i[8]=r[8]*h,i[9]=r[9]*h,i[10]=r[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,r=e.x,l=e.y,f=e.z,h=Math.cos(r),d=Math.sin(r),g=Math.cos(l),p=Math.sin(l),x=Math.cos(f),m=Math.sin(f);if(e.order==="XYZ"){const y=h*x,M=h*m,E=d*x,A=d*m;i[0]=g*x,i[4]=-g*m,i[8]=p,i[1]=M+E*p,i[5]=y-A*p,i[9]=-d*g,i[2]=A-y*p,i[6]=E+M*p,i[10]=h*g}else if(e.order==="YXZ"){const y=g*x,M=g*m,E=p*x,A=p*m;i[0]=y+A*d,i[4]=E*d-M,i[8]=h*p,i[1]=h*m,i[5]=h*x,i[9]=-d,i[2]=M*d-E,i[6]=A+y*d,i[10]=h*g}else if(e.order==="ZXY"){const y=g*x,M=g*m,E=p*x,A=p*m;i[0]=y-A*d,i[4]=-h*m,i[8]=E+M*d,i[1]=M+E*d,i[5]=h*x,i[9]=A-y*d,i[2]=-h*p,i[6]=d,i[10]=h*g}else if(e.order==="ZYX"){const y=h*x,M=h*m,E=d*x,A=d*m;i[0]=g*x,i[4]=E*p-M,i[8]=y*p+A,i[1]=g*m,i[5]=A*p+y,i[9]=M*p-E,i[2]=-p,i[6]=d*g,i[10]=h*g}else if(e.order==="YZX"){const y=h*g,M=h*p,E=d*g,A=d*p;i[0]=g*x,i[4]=A-y*m,i[8]=E*m+M,i[1]=m,i[5]=h*x,i[9]=-d*x,i[2]=-p*x,i[6]=M*m+E,i[10]=y-A*m}else if(e.order==="XZY"){const y=h*g,M=h*p,E=d*g,A=d*p;i[0]=g*x,i[4]=-m,i[8]=p*x,i[1]=y*m+A,i[5]=h*x,i[9]=M*m-E,i[2]=E*m-M,i[6]=d*x,i[10]=A*m+y}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose($b,e,t1)}lookAt(e,i,r){const l=this.elements;return ci.subVectors(e,i),ci.lengthSq()===0&&(ci.z=1),ci.normalize(),as.crossVectors(r,ci),as.lengthSq()===0&&(Math.abs(r.z)===1?ci.x+=1e-4:ci.z+=1e-4,ci.normalize(),as.crossVectors(r,ci)),as.normalize(),Kc.crossVectors(ci,as),l[0]=as.x,l[4]=Kc.x,l[8]=ci.x,l[1]=as.y,l[5]=Kc.y,l[9]=ci.y,l[2]=as.z,l[6]=Kc.z,l[10]=ci.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,f=this.elements,h=r[0],d=r[4],g=r[8],p=r[12],x=r[1],m=r[5],y=r[9],M=r[13],E=r[2],A=r[6],S=r[10],v=r[14],P=r[3],O=r[7],L=r[11],V=r[15],H=l[0],B=l[4],q=l[8],N=l[12],D=l[1],X=l[5],lt=l[9],gt=l[13],Mt=l[2],mt=l[6],Z=l[10],ct=l[14],Q=l[3],Tt=l[7],At=l[11],Yt=l[15];return f[0]=h*H+d*D+g*Mt+p*Q,f[4]=h*B+d*X+g*mt+p*Tt,f[8]=h*q+d*lt+g*Z+p*At,f[12]=h*N+d*gt+g*ct+p*Yt,f[1]=x*H+m*D+y*Mt+M*Q,f[5]=x*B+m*X+y*mt+M*Tt,f[9]=x*q+m*lt+y*Z+M*At,f[13]=x*N+m*gt+y*ct+M*Yt,f[2]=E*H+A*D+S*Mt+v*Q,f[6]=E*B+A*X+S*mt+v*Tt,f[10]=E*q+A*lt+S*Z+v*At,f[14]=E*N+A*gt+S*ct+v*Yt,f[3]=P*H+O*D+L*Mt+V*Q,f[7]=P*B+O*X+L*mt+V*Tt,f[11]=P*q+O*lt+L*Z+V*At,f[15]=P*N+O*gt+L*ct+V*Yt,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[4],l=e[8],f=e[12],h=e[1],d=e[5],g=e[9],p=e[13],x=e[2],m=e[6],y=e[10],M=e[14],E=e[3],A=e[7],S=e[11],v=e[15];return E*(+f*g*m-l*p*m-f*d*y+r*p*y+l*d*M-r*g*M)+A*(+i*g*M-i*p*y+f*h*y-l*h*M+l*p*x-f*g*x)+S*(+i*p*m-i*d*M-f*h*m+r*h*M+f*d*x-r*p*x)+v*(-l*d*x-i*g*m+i*d*y+l*h*m-r*h*y+r*g*x)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,r){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=r),this}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],f=e[3],h=e[4],d=e[5],g=e[6],p=e[7],x=e[8],m=e[9],y=e[10],M=e[11],E=e[12],A=e[13],S=e[14],v=e[15],P=m*S*p-A*y*p+A*g*M-d*S*M-m*g*v+d*y*v,O=E*y*p-x*S*p-E*g*M+h*S*M+x*g*v-h*y*v,L=x*A*p-E*m*p+E*d*M-h*A*M-x*d*v+h*m*v,V=E*m*g-x*A*g-E*d*y+h*A*y+x*d*S-h*m*S,H=i*P+r*O+l*L+f*V;if(H===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/H;return e[0]=P*B,e[1]=(A*y*f-m*S*f-A*l*M+r*S*M+m*l*v-r*y*v)*B,e[2]=(d*S*f-A*g*f+A*l*p-r*S*p-d*l*v+r*g*v)*B,e[3]=(m*g*f-d*y*f-m*l*p+r*y*p+d*l*M-r*g*M)*B,e[4]=O*B,e[5]=(x*S*f-E*y*f+E*l*M-i*S*M-x*l*v+i*y*v)*B,e[6]=(E*g*f-h*S*f-E*l*p+i*S*p+h*l*v-i*g*v)*B,e[7]=(h*y*f-x*g*f+x*l*p-i*y*p-h*l*M+i*g*M)*B,e[8]=L*B,e[9]=(E*m*f-x*A*f-E*r*M+i*A*M+x*r*v-i*m*v)*B,e[10]=(h*A*f-E*d*f+E*r*p-i*A*p-h*r*v+i*d*v)*B,e[11]=(x*d*f-h*m*f-x*r*p+i*m*p+h*r*M-i*d*M)*B,e[12]=V*B,e[13]=(x*A*l-E*m*l+E*r*y-i*A*y-x*r*S+i*m*S)*B,e[14]=(E*d*l-h*A*l-E*r*g+i*A*g+h*r*S-i*d*S)*B,e[15]=(h*m*l-x*d*l+x*r*g-i*m*g-h*r*y+i*d*y)*B,this}scale(e){const i=this.elements,r=e.x,l=e.y,f=e.z;return i[0]*=r,i[4]*=l,i[8]*=f,i[1]*=r,i[5]*=l,i[9]*=f,i[2]*=r,i[6]*=l,i[10]*=f,i[3]*=r,i[7]*=l,i[11]*=f,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,r,l))}makeTranslation(e,i,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const r=Math.cos(i),l=Math.sin(i),f=1-r,h=e.x,d=e.y,g=e.z,p=f*h,x=f*d;return this.set(p*h+r,p*d-l*g,p*g+l*d,0,p*d+l*g,x*d+r,x*g-l*h,0,p*g-l*d,x*g+l*h,f*g*g+r,0,0,0,0,1),this}makeScale(e,i,r){return this.set(e,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,i,r,l,f,h){return this.set(1,r,f,0,e,1,h,0,i,l,1,0,0,0,0,1),this}compose(e,i,r){const l=this.elements,f=i._x,h=i._y,d=i._z,g=i._w,p=f+f,x=h+h,m=d+d,y=f*p,M=f*x,E=f*m,A=h*x,S=h*m,v=d*m,P=g*p,O=g*x,L=g*m,V=r.x,H=r.y,B=r.z;return l[0]=(1-(A+v))*V,l[1]=(M+L)*V,l[2]=(E-O)*V,l[3]=0,l[4]=(M-L)*H,l[5]=(1-(y+v))*H,l[6]=(S+P)*H,l[7]=0,l[8]=(E+O)*B,l[9]=(S-P)*B,l[10]=(1-(y+A))*B,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,r){const l=this.elements;let f=Xr.set(l[0],l[1],l[2]).length();const h=Xr.set(l[4],l[5],l[6]).length(),d=Xr.set(l[8],l[9],l[10]).length();this.determinant()<0&&(f=-f),e.x=l[12],e.y=l[13],e.z=l[14],Ui.copy(this);const p=1/f,x=1/h,m=1/d;return Ui.elements[0]*=p,Ui.elements[1]*=p,Ui.elements[2]*=p,Ui.elements[4]*=x,Ui.elements[5]*=x,Ui.elements[6]*=x,Ui.elements[8]*=m,Ui.elements[9]*=m,Ui.elements[10]*=m,i.setFromRotationMatrix(Ui),r.x=f,r.y=h,r.z=d,this}makePerspective(e,i,r,l,f,h,d=Ji,g=!1){const p=this.elements,x=2*f/(i-e),m=2*f/(r-l),y=(i+e)/(i-e),M=(r+l)/(r-l);let E,A;if(g)E=f/(h-f),A=h*f/(h-f);else if(d===Ji)E=-(h+f)/(h-f),A=-2*h*f/(h-f);else if(d===bu)E=-h/(h-f),A=-h*f/(h-f);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return p[0]=x,p[4]=0,p[8]=y,p[12]=0,p[1]=0,p[5]=m,p[9]=M,p[13]=0,p[2]=0,p[6]=0,p[10]=E,p[14]=A,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(e,i,r,l,f,h,d=Ji,g=!1){const p=this.elements,x=2/(i-e),m=2/(r-l),y=-(i+e)/(i-e),M=-(r+l)/(r-l);let E,A;if(g)E=1/(h-f),A=h/(h-f);else if(d===Ji)E=-2/(h-f),A=-(h+f)/(h-f);else if(d===bu)E=-1/(h-f),A=-f/(h-f);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return p[0]=x,p[4]=0,p[8]=0,p[12]=y,p[1]=0,p[5]=m,p[9]=0,p[13]=M,p[2]=0,p[6]=0,p[10]=E,p[14]=A,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<16;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<16;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e[i+9]=r[9],e[i+10]=r[10],e[i+11]=r[11],e[i+12]=r[12],e[i+13]=r[13],e[i+14]=r[14],e[i+15]=r[15],e}}const Xr=new st,Ui=new an,$b=new st(0,0,0),t1=new st(1,1,1),as=new st,Kc=new st,ci=new st,Cv=new an,wv=new Ks;class ea{constructor(e=0,i=0,r=0,l=ea.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=r,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,r,l=this._order){return this._x=e,this._y=i,this._z=r,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,r=!0){const l=e.elements,f=l[0],h=l[4],d=l[8],g=l[1],p=l[5],x=l[9],m=l[2],y=l[6],M=l[10];switch(i){case"XYZ":this._y=Math.asin(Re(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-x,M),this._z=Math.atan2(-h,f)):(this._x=Math.atan2(y,p),this._z=0);break;case"YXZ":this._x=Math.asin(-Re(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(d,M),this._z=Math.atan2(g,p)):(this._y=Math.atan2(-m,f),this._z=0);break;case"ZXY":this._x=Math.asin(Re(y,-1,1)),Math.abs(y)<.9999999?(this._y=Math.atan2(-m,M),this._z=Math.atan2(-h,p)):(this._y=0,this._z=Math.atan2(g,f));break;case"ZYX":this._y=Math.asin(-Re(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(y,M),this._z=Math.atan2(g,f)):(this._x=0,this._z=Math.atan2(-h,p));break;case"YZX":this._z=Math.asin(Re(g,-1,1)),Math.abs(g)<.9999999?(this._x=Math.atan2(-x,p),this._y=Math.atan2(-m,f)):(this._x=0,this._y=Math.atan2(d,M));break;case"XZY":this._z=Math.asin(-Re(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(y,p),this._y=Math.atan2(d,f)):(this._x=Math.atan2(-x,M),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,r){return Cv.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Cv,i,r)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return wv.setFromEuler(this),this.setFromQuaternion(wv,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ea.DEFAULT_ORDER="XYZ";class Kp{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let e1=0;const Dv=new st,Yr=new Ks,ya=new an,Qc=new st,ll=new st,n1=new st,i1=new Ks,Nv=new st(1,0,0),Uv=new st(0,1,0),Lv=new st(0,0,1),Ov={type:"added"},a1={type:"removed"},qr={type:"childadded",child:null},Td={type:"childremoved",child:null};class Un extends $s{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:e1++}),this.uuid=xl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Un.DEFAULT_UP.clone();const e=new st,i=new ea,r=new Ks,l=new st(1,1,1);function f(){r.setFromEuler(i,!1)}function h(){i.setFromQuaternion(r,void 0,!1)}i._onChange(f),r._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new an},normalMatrix:{value:new xe}}),this.matrix=new an,this.matrixWorld=new an,this.matrixAutoUpdate=Un.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Kp,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return Yr.setFromAxisAngle(e,i),this.quaternion.multiply(Yr),this}rotateOnWorldAxis(e,i){return Yr.setFromAxisAngle(e,i),this.quaternion.premultiply(Yr),this}rotateX(e){return this.rotateOnAxis(Nv,e)}rotateY(e){return this.rotateOnAxis(Uv,e)}rotateZ(e){return this.rotateOnAxis(Lv,e)}translateOnAxis(e,i){return Dv.copy(e).applyQuaternion(this.quaternion),this.position.add(Dv.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(Nv,e)}translateY(e){return this.translateOnAxis(Uv,e)}translateZ(e){return this.translateOnAxis(Lv,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ya.copy(this.matrixWorld).invert())}lookAt(e,i,r){e.isVector3?Qc.copy(e):Qc.set(e,i,r);const l=this.parent;this.updateWorldMatrix(!0,!1),ll.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ya.lookAt(ll,Qc,this.up):ya.lookAt(Qc,ll,this.up),this.quaternion.setFromRotationMatrix(ya),l&&(ya.extractRotation(l.matrixWorld),Yr.setFromRotationMatrix(ya),this.quaternion.premultiply(Yr.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ov),qr.child=e,this.dispatchEvent(qr),qr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(a1),Td.child=e,this.dispatchEvent(Td),Td.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ya.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ya.multiply(e.parent.matrixWorld)),e.applyMatrix4(ya),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ov),qr.child=e,this.dispatchEvent(qr),qr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let r=0,l=this.children.length;r<l;r++){const h=this.children[r].getObjectByProperty(e,i);if(h!==void 0)return h}}getObjectsByProperty(e,i,r=[]){this[e]===i&&r.push(this);const l=this.children;for(let f=0,h=l.length;f<h;f++)l[f].getObjectsByProperty(e,i,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ll,e,n1),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ll,i1,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].updateMatrixWorld(e)}updateWorldMatrix(e,i){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),i===!0){const l=this.children;for(let f=0,h=l.length;f<h;f++)l[f].updateWorldMatrix(!1,!0)}}toJSON(e){const i=e===void 0||typeof e=="string",r={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(d=>({...d,boundingBox:d.boundingBox?d.boundingBox.toJSON():void 0,boundingSphere:d.boundingSphere?d.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(d=>({...d})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(e),l.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function f(d,g){return d[g.uuid]===void 0&&(d[g.uuid]=g.toJSON(e)),g.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=f(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const g=d.shapes;if(Array.isArray(g))for(let p=0,x=g.length;p<x;p++){const m=g[p];f(e.shapes,m)}else f(e.shapes,g)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(f(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let g=0,p=this.material.length;g<p;g++)d.push(f(e.materials,this.material[g]));l.material=d}else l.material=f(e.materials,this.material);if(this.children.length>0){l.children=[];for(let d=0;d<this.children.length;d++)l.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let d=0;d<this.animations.length;d++){const g=this.animations[d];l.animations.push(f(e.animations,g))}}if(i){const d=h(e.geometries),g=h(e.materials),p=h(e.textures),x=h(e.images),m=h(e.shapes),y=h(e.skeletons),M=h(e.animations),E=h(e.nodes);d.length>0&&(r.geometries=d),g.length>0&&(r.materials=g),p.length>0&&(r.textures=p),x.length>0&&(r.images=x),m.length>0&&(r.shapes=m),y.length>0&&(r.skeletons=y),M.length>0&&(r.animations=M),E.length>0&&(r.nodes=E)}return r.object=l,r;function h(d){const g=[];for(const p in d){const x=d[p];delete x.metadata,g.push(x)}return g}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let r=0;r<e.children.length;r++){const l=e.children[r];this.add(l.clone())}return this}}Un.DEFAULT_UP=new st(0,1,0);Un.DEFAULT_MATRIX_AUTO_UPDATE=!0;Un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Li=new st,Sa=new st,Ad=new st,Ma=new st,Wr=new st,Zr=new st,Pv=new st,Rd=new st,Cd=new st,wd=new st,Dd=new ln,Nd=new ln,Ud=new ln;class bi{constructor(e=new st,i=new st,r=new st){this.a=e,this.b=i,this.c=r}static getNormal(e,i,r,l){l.subVectors(r,i),Li.subVectors(e,i),l.cross(Li);const f=l.lengthSq();return f>0?l.multiplyScalar(1/Math.sqrt(f)):l.set(0,0,0)}static getBarycoord(e,i,r,l,f){Li.subVectors(l,i),Sa.subVectors(r,i),Ad.subVectors(e,i);const h=Li.dot(Li),d=Li.dot(Sa),g=Li.dot(Ad),p=Sa.dot(Sa),x=Sa.dot(Ad),m=h*p-d*d;if(m===0)return f.set(0,0,0),null;const y=1/m,M=(p*g-d*x)*y,E=(h*x-d*g)*y;return f.set(1-M-E,E,M)}static containsPoint(e,i,r,l){return this.getBarycoord(e,i,r,l,Ma)===null?!1:Ma.x>=0&&Ma.y>=0&&Ma.x+Ma.y<=1}static getInterpolation(e,i,r,l,f,h,d,g){return this.getBarycoord(e,i,r,l,Ma)===null?(g.x=0,g.y=0,"z"in g&&(g.z=0),"w"in g&&(g.w=0),null):(g.setScalar(0),g.addScaledVector(f,Ma.x),g.addScaledVector(h,Ma.y),g.addScaledVector(d,Ma.z),g)}static getInterpolatedAttribute(e,i,r,l,f,h){return Dd.setScalar(0),Nd.setScalar(0),Ud.setScalar(0),Dd.fromBufferAttribute(e,i),Nd.fromBufferAttribute(e,r),Ud.fromBufferAttribute(e,l),h.setScalar(0),h.addScaledVector(Dd,f.x),h.addScaledVector(Nd,f.y),h.addScaledVector(Ud,f.z),h}static isFrontFacing(e,i,r,l){return Li.subVectors(r,i),Sa.subVectors(e,i),Li.cross(Sa).dot(l)<0}set(e,i,r){return this.a.copy(e),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(e,i,r,l){return this.a.copy(e[i]),this.b.copy(e[r]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,r,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Li.subVectors(this.c,this.b),Sa.subVectors(this.a,this.b),Li.cross(Sa).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return bi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return bi.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,r,l,f){return bi.getInterpolation(e,this.a,this.b,this.c,i,r,l,f)}containsPoint(e){return bi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return bi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const r=this.a,l=this.b,f=this.c;let h,d;Wr.subVectors(l,r),Zr.subVectors(f,r),Rd.subVectors(e,r);const g=Wr.dot(Rd),p=Zr.dot(Rd);if(g<=0&&p<=0)return i.copy(r);Cd.subVectors(e,l);const x=Wr.dot(Cd),m=Zr.dot(Cd);if(x>=0&&m<=x)return i.copy(l);const y=g*m-x*p;if(y<=0&&g>=0&&x<=0)return h=g/(g-x),i.copy(r).addScaledVector(Wr,h);wd.subVectors(e,f);const M=Wr.dot(wd),E=Zr.dot(wd);if(E>=0&&M<=E)return i.copy(f);const A=M*p-g*E;if(A<=0&&p>=0&&E<=0)return d=p/(p-E),i.copy(r).addScaledVector(Zr,d);const S=x*E-M*m;if(S<=0&&m-x>=0&&M-E>=0)return Pv.subVectors(f,l),d=(m-x)/(m-x+(M-E)),i.copy(l).addScaledVector(Pv,d);const v=1/(S+A+y);return h=A*v,d=y*v,i.copy(r).addScaledVector(Wr,h).addScaledVector(Zr,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const vy={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ss={h:0,s:0,l:0},Jc={h:0,s:0,l:0};function Ld(o,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?o+(e-o)*6*i:i<1/2?e:i<2/3?o+(e-o)*6*(2/3-i):o}class be{constructor(e,i,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,r)}set(e,i,r){if(i===void 0&&r===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=Mi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Pe.colorSpaceToWorking(this,i),this}setRGB(e,i,r,l=Pe.workingColorSpace){return this.r=e,this.g=i,this.b=r,Pe.colorSpaceToWorking(this,l),this}setHSL(e,i,r,l=Pe.workingColorSpace){if(e=Vb(e,1),i=Re(i,0,1),r=Re(r,0,1),i===0)this.r=this.g=this.b=r;else{const f=r<=.5?r*(1+i):r+i-r*i,h=2*r-f;this.r=Ld(h,f,e+1/3),this.g=Ld(h,f,e),this.b=Ld(h,f,e-1/3)}return Pe.colorSpaceToWorking(this,l),this}setStyle(e,i=Mi){function r(f){f!==void 0&&parseFloat(f)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let f;const h=l[1],d=l[2];switch(h){case"rgb":case"rgba":if(f=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(f[4]),this.setRGB(Math.min(255,parseInt(f[1],10))/255,Math.min(255,parseInt(f[2],10))/255,Math.min(255,parseInt(f[3],10))/255,i);if(f=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(f[4]),this.setRGB(Math.min(100,parseInt(f[1],10))/100,Math.min(100,parseInt(f[2],10))/100,Math.min(100,parseInt(f[3],10))/100,i);break;case"hsl":case"hsla":if(f=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(f[4]),this.setHSL(parseFloat(f[1])/360,parseFloat(f[2])/100,parseFloat(f[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const f=l[1],h=f.length;if(h===3)return this.setRGB(parseInt(f.charAt(0),16)/15,parseInt(f.charAt(1),16)/15,parseInt(f.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(f,16),i);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=Mi){const r=vy[e.toLowerCase()];return r!==void 0?this.setHex(r,i):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Aa(e.r),this.g=Aa(e.g),this.b=Aa(e.b),this}copyLinearToSRGB(e){return this.r=ao(e.r),this.g=ao(e.g),this.b=ao(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mi){return Pe.workingToColorSpace(In.copy(this),e),Math.round(Re(In.r*255,0,255))*65536+Math.round(Re(In.g*255,0,255))*256+Math.round(Re(In.b*255,0,255))}getHexString(e=Mi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Pe.workingColorSpace){Pe.workingToColorSpace(In.copy(this),i);const r=In.r,l=In.g,f=In.b,h=Math.max(r,l,f),d=Math.min(r,l,f);let g,p;const x=(d+h)/2;if(d===h)g=0,p=0;else{const m=h-d;switch(p=x<=.5?m/(h+d):m/(2-h-d),h){case r:g=(l-f)/m+(l<f?6:0);break;case l:g=(f-r)/m+2;break;case f:g=(r-l)/m+4;break}g/=6}return e.h=g,e.s=p,e.l=x,e}getRGB(e,i=Pe.workingColorSpace){return Pe.workingToColorSpace(In.copy(this),i),e.r=In.r,e.g=In.g,e.b=In.b,e}getStyle(e=Mi){Pe.workingToColorSpace(In.copy(this),e);const i=In.r,r=In.g,l=In.b;return e!==Mi?`color(${e} ${i.toFixed(3)} ${r.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(r*255)},${Math.round(l*255)})`}offsetHSL(e,i,r){return this.getHSL(ss),this.setHSL(ss.h+e,ss.s+i,ss.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,r){return this.r=e.r+(i.r-e.r)*r,this.g=e.g+(i.g-e.g)*r,this.b=e.b+(i.b-e.b)*r,this}lerpHSL(e,i){this.getHSL(ss),e.getHSL(Jc);const r=md(ss.h,Jc.h,i),l=md(ss.s,Jc.s,i),f=md(ss.l,Jc.l,i);return this.setHSL(r,l,f),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,r=this.g,l=this.b,f=e.elements;return this.r=f[0]*i+f[3]*r+f[6]*l,this.g=f[1]*i+f[4]*r+f[7]*l,this.b=f[2]*i+f[5]*r+f[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const In=new be;be.NAMES=vy;let s1=0;class uo extends $s{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:s1++}),this.uuid=xl(),this.name="",this.type="Material",this.blending=io,this.side=fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Zd,this.blendDst=Kd,this.blendEquation=Xs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new be(0,0,0),this.blendAlpha=0,this.depthFunc=so,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sv,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Hr,this.stencilZFail=Hr,this.stencilZPass=Hr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const r=e[i];if(r===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(r):l&&l.isVector3&&r&&r.isVector3?l.copy(r):this[i]=r}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const r={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(r.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(r.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==io&&(r.blending=this.blending),this.side!==fs&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Zd&&(r.blendSrc=this.blendSrc),this.blendDst!==Kd&&(r.blendDst=this.blendDst),this.blendEquation!==Xs&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==so&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Sv&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Hr&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Hr&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Hr&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function l(f){const h=[];for(const d in f){const g=f[d];delete g.metadata,h.push(g)}return h}if(i){const f=l(e.textures),h=l(e.images);f.length>0&&(r.textures=f),h.length>0&&(r.images=h)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let r=null;if(i!==null){const l=i.length;r=new Array(l);for(let f=0;f!==l;++f)r[f]=i[f].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class xy extends uo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ea,this.combine=ay,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mn=new st,$c=new pe;let r1=0;class $i{constructor(e,i,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:r1++}),this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=r,this.usage=Mv,this.updateRanges=[],this.gpuType=Ta,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,r){e*=this.itemSize,r*=i.itemSize;for(let l=0,f=this.itemSize;l<f;l++)this.array[e+l]=i.array[r+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,r=this.count;i<r;i++)$c.fromBufferAttribute(this,i),$c.applyMatrix3(e),this.setXY(i,$c.x,$c.y);else if(this.itemSize===3)for(let i=0,r=this.count;i<r;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix3(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyMatrix4(e){for(let i=0,r=this.count;i<r;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix4(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)mn.fromBufferAttribute(this,i),mn.applyNormalMatrix(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)mn.fromBufferAttribute(this,i),mn.transformDirection(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let r=this.array[e*this.itemSize+i];return this.normalized&&(r=sl(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=Kn(r,this.array)),this.array[e*this.itemSize+i]=r,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=sl(i,this.array)),i}setX(e,i){return this.normalized&&(i=Kn(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=sl(i,this.array)),i}setY(e,i){return this.normalized&&(i=Kn(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=sl(i,this.array)),i}setZ(e,i){return this.normalized&&(i=Kn(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=sl(i,this.array)),i}setW(e,i){return this.normalized&&(i=Kn(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,r){return e*=this.itemSize,this.normalized&&(i=Kn(i,this.array),r=Kn(r,this.array)),this.array[e+0]=i,this.array[e+1]=r,this}setXYZ(e,i,r,l){return e*=this.itemSize,this.normalized&&(i=Kn(i,this.array),r=Kn(r,this.array),l=Kn(l,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this}setXYZW(e,i,r,l,f){return e*=this.itemSize,this.normalized&&(i=Kn(i,this.array),r=Kn(r,this.array),l=Kn(l,this.array),f=Kn(f,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this.array[e+3]=f,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Mv&&(e.usage=this.usage),e}}class yy extends $i{constructor(e,i,r){super(new Uint16Array(e),i,r)}}class Sy extends $i{constructor(e,i,r){super(new Uint32Array(e),i,r)}}class jn extends $i{constructor(e,i,r){super(new Float32Array(e),i,r)}}let o1=0;const Si=new an,Od=new Un,Kr=new st,ui=new yl,cl=new yl,Tn=new st;class Ii extends $s{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:o1++}),this.uuid=xl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(gy(e)?Sy:yy)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,r=0){this.groups.push({start:e,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const f=new xe().getNormalMatrix(e);r.applyNormalMatrix(f),r.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Si.makeRotationFromQuaternion(e),this.applyMatrix4(Si),this}rotateX(e){return Si.makeRotationX(e),this.applyMatrix4(Si),this}rotateY(e){return Si.makeRotationY(e),this.applyMatrix4(Si),this}rotateZ(e){return Si.makeRotationZ(e),this.applyMatrix4(Si),this}translate(e,i,r){return Si.makeTranslation(e,i,r),this.applyMatrix4(Si),this}scale(e,i,r){return Si.makeScale(e,i,r),this.applyMatrix4(Si),this}lookAt(e){return Od.lookAt(e),Od.updateMatrix(),this.applyMatrix4(Od.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Kr).negate(),this.translate(Kr.x,Kr.y,Kr.z),this}setFromPoints(e){const i=this.getAttribute("position");if(i===void 0){const r=[];for(let l=0,f=e.length;l<f;l++){const h=e[l];r.push(h.x,h.y,h.z||0)}this.setAttribute("position",new jn(r,3))}else{const r=Math.min(e.length,i.count);for(let l=0;l<r;l++){const f=e[l];i.setXYZ(l,f.x,f.y,f.z||0)}e.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yl);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new st(-1/0,-1/0,-1/0),new st(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let r=0,l=i.length;r<l;r++){const f=i[r];ui.setFromBufferAttribute(f),this.morphTargetsRelative?(Tn.addVectors(this.boundingBox.min,ui.min),this.boundingBox.expandByPoint(Tn),Tn.addVectors(this.boundingBox.max,ui.max),this.boundingBox.expandByPoint(Tn)):(this.boundingBox.expandByPoint(ui.min),this.boundingBox.expandByPoint(ui.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Du);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new st,1/0);return}if(e){const r=this.boundingSphere.center;if(ui.setFromBufferAttribute(e),i)for(let f=0,h=i.length;f<h;f++){const d=i[f];cl.setFromBufferAttribute(d),this.morphTargetsRelative?(Tn.addVectors(ui.min,cl.min),ui.expandByPoint(Tn),Tn.addVectors(ui.max,cl.max),ui.expandByPoint(Tn)):(ui.expandByPoint(cl.min),ui.expandByPoint(cl.max))}ui.getCenter(r);let l=0;for(let f=0,h=e.count;f<h;f++)Tn.fromBufferAttribute(e,f),l=Math.max(l,r.distanceToSquared(Tn));if(i)for(let f=0,h=i.length;f<h;f++){const d=i[f],g=this.morphTargetsRelative;for(let p=0,x=d.count;p<x;p++)Tn.fromBufferAttribute(d,p),g&&(Kr.fromBufferAttribute(e,p),Tn.add(Kr)),l=Math.max(l,r.distanceToSquared(Tn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=i.position,l=i.normal,f=i.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $i(new Float32Array(4*r.count),4));const h=this.getAttribute("tangent"),d=[],g=[];for(let q=0;q<r.count;q++)d[q]=new st,g[q]=new st;const p=new st,x=new st,m=new st,y=new pe,M=new pe,E=new pe,A=new st,S=new st;function v(q,N,D){p.fromBufferAttribute(r,q),x.fromBufferAttribute(r,N),m.fromBufferAttribute(r,D),y.fromBufferAttribute(f,q),M.fromBufferAttribute(f,N),E.fromBufferAttribute(f,D),x.sub(p),m.sub(p),M.sub(y),E.sub(y);const X=1/(M.x*E.y-E.x*M.y);isFinite(X)&&(A.copy(x).multiplyScalar(E.y).addScaledVector(m,-M.y).multiplyScalar(X),S.copy(m).multiplyScalar(M.x).addScaledVector(x,-E.x).multiplyScalar(X),d[q].add(A),d[N].add(A),d[D].add(A),g[q].add(S),g[N].add(S),g[D].add(S))}let P=this.groups;P.length===0&&(P=[{start:0,count:e.count}]);for(let q=0,N=P.length;q<N;++q){const D=P[q],X=D.start,lt=D.count;for(let gt=X,Mt=X+lt;gt<Mt;gt+=3)v(e.getX(gt+0),e.getX(gt+1),e.getX(gt+2))}const O=new st,L=new st,V=new st,H=new st;function B(q){V.fromBufferAttribute(l,q),H.copy(V);const N=d[q];O.copy(N),O.sub(V.multiplyScalar(V.dot(N))).normalize(),L.crossVectors(H,N);const X=L.dot(g[q])<0?-1:1;h.setXYZW(q,O.x,O.y,O.z,X)}for(let q=0,N=P.length;q<N;++q){const D=P[q],X=D.start,lt=D.count;for(let gt=X,Mt=X+lt;gt<Mt;gt+=3)B(e.getX(gt+0)),B(e.getX(gt+1)),B(e.getX(gt+2))}}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new $i(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let y=0,M=r.count;y<M;y++)r.setXYZ(y,0,0,0);const l=new st,f=new st,h=new st,d=new st,g=new st,p=new st,x=new st,m=new st;if(e)for(let y=0,M=e.count;y<M;y+=3){const E=e.getX(y+0),A=e.getX(y+1),S=e.getX(y+2);l.fromBufferAttribute(i,E),f.fromBufferAttribute(i,A),h.fromBufferAttribute(i,S),x.subVectors(h,f),m.subVectors(l,f),x.cross(m),d.fromBufferAttribute(r,E),g.fromBufferAttribute(r,A),p.fromBufferAttribute(r,S),d.add(x),g.add(x),p.add(x),r.setXYZ(E,d.x,d.y,d.z),r.setXYZ(A,g.x,g.y,g.z),r.setXYZ(S,p.x,p.y,p.z)}else for(let y=0,M=i.count;y<M;y+=3)l.fromBufferAttribute(i,y+0),f.fromBufferAttribute(i,y+1),h.fromBufferAttribute(i,y+2),x.subVectors(h,f),m.subVectors(l,f),x.cross(m),r.setXYZ(y+0,x.x,x.y,x.z),r.setXYZ(y+1,x.x,x.y,x.z),r.setXYZ(y+2,x.x,x.y,x.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,r=e.count;i<r;i++)Tn.fromBufferAttribute(e,i),Tn.normalize(),e.setXYZ(i,Tn.x,Tn.y,Tn.z)}toNonIndexed(){function e(d,g){const p=d.array,x=d.itemSize,m=d.normalized,y=new p.constructor(g.length*x);let M=0,E=0;for(let A=0,S=g.length;A<S;A++){d.isInterleavedBufferAttribute?M=g[A]*d.data.stride+d.offset:M=g[A]*x;for(let v=0;v<x;v++)y[E++]=p[M++]}return new $i(y,x,m)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new Ii,r=this.index.array,l=this.attributes;for(const d in l){const g=l[d],p=e(g,r);i.setAttribute(d,p)}const f=this.morphAttributes;for(const d in f){const g=[],p=f[d];for(let x=0,m=p.length;x<m;x++){const y=p[x],M=e(y,r);g.push(M)}i.morphAttributes[d]=g}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let d=0,g=h.length;d<g;d++){const p=h[d];i.addGroup(p.start,p.count,p.materialIndex)}return i}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const g=this.parameters;for(const p in g)g[p]!==void 0&&(e[p]=g[p]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const r=this.attributes;for(const g in r){const p=r[g];e.data.attributes[g]=p.toJSON(e.data)}const l={};let f=!1;for(const g in this.morphAttributes){const p=this.morphAttributes[g],x=[];for(let m=0,y=p.length;m<y;m++){const M=p[m];x.push(M.toJSON(e.data))}x.length>0&&(l[g]=x,f=!0)}f&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(e.data.groups=JSON.parse(JSON.stringify(h)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere=d.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone());const l=e.attributes;for(const p in l){const x=l[p];this.setAttribute(p,x.clone(i))}const f=e.morphAttributes;for(const p in f){const x=[],m=f[p];for(let y=0,M=m.length;y<M;y++)x.push(m[y].clone(i));this.morphAttributes[p]=x}this.morphTargetsRelative=e.morphTargetsRelative;const h=e.groups;for(let p=0,x=h.length;p<x;p++){const m=h[p];this.addGroup(m.start,m.count,m.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const g=e.boundingSphere;return g!==null&&(this.boundingSphere=g.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zv=new an,Hs=new Nu,tu=new Du,Iv=new st,eu=new st,nu=new st,iu=new st,Pd=new st,au=new st,Bv=new st,su=new st;class Pi extends Un{constructor(e=new Ii,i=new xy){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let f=0,h=l.length;f<h;f++){const d=l[f].name||String(f);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=f}}}}getVertexPosition(e,i){const r=this.geometry,l=r.attributes.position,f=r.morphAttributes.position,h=r.morphTargetsRelative;i.fromBufferAttribute(l,e);const d=this.morphTargetInfluences;if(f&&d){au.set(0,0,0);for(let g=0,p=f.length;g<p;g++){const x=d[g],m=f[g];x!==0&&(Pd.fromBufferAttribute(m,e),h?au.addScaledVector(Pd,x):au.addScaledVector(Pd.sub(i),x))}i.add(au)}return i}raycast(e,i){const r=this.geometry,l=this.material,f=this.matrixWorld;l!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),tu.copy(r.boundingSphere),tu.applyMatrix4(f),Hs.copy(e.ray).recast(e.near),!(tu.containsPoint(Hs.origin)===!1&&(Hs.intersectSphere(tu,Iv)===null||Hs.origin.distanceToSquared(Iv)>(e.far-e.near)**2))&&(zv.copy(f).invert(),Hs.copy(e.ray).applyMatrix4(zv),!(r.boundingBox!==null&&Hs.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,i,Hs)))}_computeIntersections(e,i,r){let l;const f=this.geometry,h=this.material,d=f.index,g=f.attributes.position,p=f.attributes.uv,x=f.attributes.uv1,m=f.attributes.normal,y=f.groups,M=f.drawRange;if(d!==null)if(Array.isArray(h))for(let E=0,A=y.length;E<A;E++){const S=y[E],v=h[S.materialIndex],P=Math.max(S.start,M.start),O=Math.min(d.count,Math.min(S.start+S.count,M.start+M.count));for(let L=P,V=O;L<V;L+=3){const H=d.getX(L),B=d.getX(L+1),q=d.getX(L+2);l=ru(this,v,e,r,p,x,m,H,B,q),l&&(l.faceIndex=Math.floor(L/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const E=Math.max(0,M.start),A=Math.min(d.count,M.start+M.count);for(let S=E,v=A;S<v;S+=3){const P=d.getX(S),O=d.getX(S+1),L=d.getX(S+2);l=ru(this,h,e,r,p,x,m,P,O,L),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}else if(g!==void 0)if(Array.isArray(h))for(let E=0,A=y.length;E<A;E++){const S=y[E],v=h[S.materialIndex],P=Math.max(S.start,M.start),O=Math.min(g.count,Math.min(S.start+S.count,M.start+M.count));for(let L=P,V=O;L<V;L+=3){const H=L,B=L+1,q=L+2;l=ru(this,v,e,r,p,x,m,H,B,q),l&&(l.faceIndex=Math.floor(L/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const E=Math.max(0,M.start),A=Math.min(g.count,M.start+M.count);for(let S=E,v=A;S<v;S+=3){const P=S,O=S+1,L=S+2;l=ru(this,h,e,r,p,x,m,P,O,L),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}}}function l1(o,e,i,r,l,f,h,d){let g;if(e.side===Jn?g=r.intersectTriangle(h,f,l,!0,d):g=r.intersectTriangle(l,f,h,e.side===fs,d),g===null)return null;su.copy(d),su.applyMatrix4(o.matrixWorld);const p=i.ray.origin.distanceTo(su);return p<i.near||p>i.far?null:{distance:p,point:su.clone(),object:o}}function ru(o,e,i,r,l,f,h,d,g,p){o.getVertexPosition(d,eu),o.getVertexPosition(g,nu),o.getVertexPosition(p,iu);const x=l1(o,e,i,r,eu,nu,iu,Bv);if(x){const m=new st;bi.getBarycoord(Bv,eu,nu,iu,m),l&&(x.uv=bi.getInterpolatedAttribute(l,d,g,p,m,new pe)),f&&(x.uv1=bi.getInterpolatedAttribute(f,d,g,p,m,new pe)),h&&(x.normal=bi.getInterpolatedAttribute(h,d,g,p,m,new st),x.normal.dot(r.direction)>0&&x.normal.multiplyScalar(-1));const y={a:d,b:g,c:p,normal:new st,materialIndex:0};bi.getNormal(eu,nu,iu,y.normal),x.face=y,x.barycoord=m}return x}class Js extends Ii{constructor(e=1,i=1,r=1,l=1,f=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:r,widthSegments:l,heightSegments:f,depthSegments:h};const d=this;l=Math.floor(l),f=Math.floor(f),h=Math.floor(h);const g=[],p=[],x=[],m=[];let y=0,M=0;E("z","y","x",-1,-1,r,i,e,h,f,0),E("z","y","x",1,-1,r,i,-e,h,f,1),E("x","z","y",1,1,e,r,i,l,h,2),E("x","z","y",1,-1,e,r,-i,l,h,3),E("x","y","z",1,-1,e,i,r,l,f,4),E("x","y","z",-1,-1,e,i,-r,l,f,5),this.setIndex(g),this.setAttribute("position",new jn(p,3)),this.setAttribute("normal",new jn(x,3)),this.setAttribute("uv",new jn(m,2));function E(A,S,v,P,O,L,V,H,B,q,N){const D=L/B,X=V/q,lt=L/2,gt=V/2,Mt=H/2,mt=B+1,Z=q+1;let ct=0,Q=0;const Tt=new st;for(let At=0;At<Z;At++){const Yt=At*X-gt;for(let oe=0;oe<mt;oe++){const Ct=oe*D-lt;Tt[A]=Ct*P,Tt[S]=Yt*O,Tt[v]=Mt,p.push(Tt.x,Tt.y,Tt.z),Tt[A]=0,Tt[S]=0,Tt[v]=H>0?1:-1,x.push(Tt.x,Tt.y,Tt.z),m.push(oe/B),m.push(1-At/q),ct+=1}}for(let At=0;At<q;At++)for(let Yt=0;Yt<B;Yt++){const oe=y+Yt+mt*At,Ct=y+Yt+mt*(At+1),U=y+(Yt+1)+mt*(At+1),tt=y+(Yt+1)+mt*At;g.push(oe,Ct,tt),g.push(Ct,U,tt),Q+=6}d.addGroup(M,Q,N),M+=Q,y+=ct}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Js(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function co(o){const e={};for(const i in o){e[i]={};for(const r in o[i]){const l=o[i][r];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][r]=null):e[i][r]=l.clone():Array.isArray(l)?e[i][r]=l.slice():e[i][r]=l}}return e}function kn(o){const e={};for(let i=0;i<o.length;i++){const r=co(o[i]);for(const l in r)e[l]=r[l]}return e}function c1(o){const e=[];for(let i=0;i<o.length;i++)e.push(o[i].clone());return e}function My(o){const e=o.getRenderTarget();return e===null?o.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Pe.workingColorSpace}const u1={clone:co,merge:kn};var f1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,h1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hs extends uo{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=f1,this.fragmentShader=h1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=co(e.uniforms),this.uniformsGroups=c1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(e).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const r={};for(const l in this.extensions)this.extensions[l]===!0&&(r[l]=!0);return Object.keys(r).length>0&&(i.extensions=r),i}}class Ey extends Un{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new an,this.projectionMatrix=new an,this.projectionMatrixInverse=new an,this.coordinateSystem=Ji,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const rs=new st,Fv=new pe,Hv=new pe;class Ei extends Ey{constructor(e=50,i=1,r=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=zp*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(hl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zp*2*Math.atan(Math.tan(hl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,r){rs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(rs.x,rs.y).multiplyScalar(-e/rs.z),rs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(rs.x,rs.y).multiplyScalar(-e/rs.z)}getViewSize(e,i){return this.getViewBounds(e,Fv,Hv),i.subVectors(Hv,Fv)}setViewOffset(e,i,r,l,f,h){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=f,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(hl*.5*this.fov)/this.zoom,r=2*i,l=this.aspect*r,f=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const g=h.fullWidth,p=h.fullHeight;f+=h.offsetX*l/g,i-=h.offsetY*r/p,l*=h.width/g,r*=h.height/p}const d=this.filmOffset;d!==0&&(f+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(f,f+l,i,i-r,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const Qr=-90,Jr=1;class d1 extends Un{constructor(e,i,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new Ei(Qr,Jr,e,i);l.layers=this.layers,this.add(l);const f=new Ei(Qr,Jr,e,i);f.layers=this.layers,this.add(f);const h=new Ei(Qr,Jr,e,i);h.layers=this.layers,this.add(h);const d=new Ei(Qr,Jr,e,i);d.layers=this.layers,this.add(d);const g=new Ei(Qr,Jr,e,i);g.layers=this.layers,this.add(g);const p=new Ei(Qr,Jr,e,i);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[r,l,f,h,d,g]=i;for(const p of i)this.remove(p);if(e===Ji)r.up.set(0,1,0),r.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),f.up.set(0,0,-1),f.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),g.up.set(0,1,0),g.lookAt(0,0,-1);else if(e===bu)r.up.set(0,-1,0),r.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),f.up.set(0,0,1),f.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),g.up.set(0,-1,0),g.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of i)this.add(p),p.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[f,h,d,g,p,x]=this.children,m=e.getRenderTarget(),y=e.getActiveCubeFace(),M=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const A=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,l),e.render(i,f),e.setRenderTarget(r,1,l),e.render(i,h),e.setRenderTarget(r,2,l),e.render(i,d),e.setRenderTarget(r,3,l),e.render(i,g),e.setRenderTarget(r,4,l),e.render(i,p),r.texture.generateMipmaps=A,e.setRenderTarget(r,5,l),e.render(i,x),e.setRenderTarget(m,y,M),e.xr.enabled=E,r.texture.needsPMREMUpdate=!0}}class by extends $n{constructor(e=[],i=ro,r,l,f,h,d,g,p,x){super(e,i,r,l,f,h,d,g,p,x),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class p1 extends Qs{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},l=[r,r,r,r,r,r];this.texture=new by(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new Js(5,5,5),f=new hs({name:"CubemapFromEquirect",uniforms:co(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Jn,blending:cs});f.uniforms.tEquirect.value=i;const h=new Pi(l,f),d=i.minFilter;return i.minFilter===Ws&&(i.minFilter=Qi),new d1(1,10,this).update(e,h),i.minFilter=d,h.geometry.dispose(),h.material.dispose(),this}clear(e,i=!0,r=!0,l=!0){const f=e.getRenderTarget();for(let h=0;h<6;h++)e.setRenderTarget(this,h),e.clear(i,r,l);e.setRenderTarget(f)}}class ou extends Un{constructor(){super(),this.isGroup=!0,this.type="Group"}}const m1={type:"move"};class zd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ou,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ou,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new st,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new st),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ou,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new st,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new st),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const r of e.hand.values())this._getHandJoint(i,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,r){let l=null,f=null,h=null;const d=this._targetRay,g=this._grip,p=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(p&&e.hand){h=!0;for(const A of e.hand.values()){const S=i.getJointPose(A,r),v=this._getHandJoint(p,A);S!==null&&(v.matrix.fromArray(S.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=S.radius),v.visible=S!==null}const x=p.joints["index-finger-tip"],m=p.joints["thumb-tip"],y=x.position.distanceTo(m.position),M=.02,E=.005;p.inputState.pinching&&y>M+E?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&y<=M-E&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else g!==null&&e.gripSpace&&(f=i.getPose(e.gripSpace,r),f!==null&&(g.matrix.fromArray(f.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,f.linearVelocity?(g.hasLinearVelocity=!0,g.linearVelocity.copy(f.linearVelocity)):g.hasLinearVelocity=!1,f.angularVelocity?(g.hasAngularVelocity=!0,g.angularVelocity.copy(f.angularVelocity)):g.hasAngularVelocity=!1));d!==null&&(l=i.getPose(e.targetRaySpace,r),l===null&&f!==null&&(l=f),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(m1)))}return d!==null&&(d.visible=l!==null),g!==null&&(g.visible=f!==null),p!==null&&(p.visible=h!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const r=new ou;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[i.jointName]=r,e.add(r)}return e.joints[i.jointName]}}class g1 extends Un{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ea,this.environmentIntensity=1,this.environmentRotation=new ea,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}const Id=new st,_1=new st,v1=new xe;class os{constructor(e=new st(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,r,l){return this.normal.set(e,i,r),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,r){const l=Id.subVectors(r,i).cross(_1.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i){const r=e.delta(Id),l=this.normal.dot(r);if(l===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const f=-(e.start.dot(this.normal)+this.constant)/l;return f<0||f>1?null:i.copy(e.start).addScaledVector(r,f)}intersectsLine(e){const i=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return i<0&&r>0||r<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const r=i||v1.getNormalMatrix(e),l=this.coplanarPoint(Id).applyMatrix4(e),f=this.normal.applyMatrix3(r).normalize();return this.constant=-l.dot(f),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gs=new Du,x1=new pe(.5,.5),lu=new st;class Qp{constructor(e=new os,i=new os,r=new os,l=new os,f=new os,h=new os){this.planes=[e,i,r,l,f,h]}set(e,i,r,l,f,h){const d=this.planes;return d[0].copy(e),d[1].copy(i),d[2].copy(r),d[3].copy(l),d[4].copy(f),d[5].copy(h),this}copy(e){const i=this.planes;for(let r=0;r<6;r++)i[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,i=Ji,r=!1){const l=this.planes,f=e.elements,h=f[0],d=f[1],g=f[2],p=f[3],x=f[4],m=f[5],y=f[6],M=f[7],E=f[8],A=f[9],S=f[10],v=f[11],P=f[12],O=f[13],L=f[14],V=f[15];if(l[0].setComponents(p-h,M-x,v-E,V-P).normalize(),l[1].setComponents(p+h,M+x,v+E,V+P).normalize(),l[2].setComponents(p+d,M+m,v+A,V+O).normalize(),l[3].setComponents(p-d,M-m,v-A,V-O).normalize(),r)l[4].setComponents(g,y,S,L).normalize(),l[5].setComponents(p-g,M-y,v-S,V-L).normalize();else if(l[4].setComponents(p-g,M-y,v-S,V-L).normalize(),i===Ji)l[5].setComponents(p+g,M+y,v+S,V+L).normalize();else if(i===bu)l[5].setComponents(g,y,S,L).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Gs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Gs.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Gs)}intersectsSprite(e){Gs.center.set(0,0,0);const i=x1.distanceTo(e.center);return Gs.radius=.7071067811865476+i,Gs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gs)}intersectsSphere(e){const i=this.planes,r=e.center,l=-e.radius;for(let f=0;f<6;f++)if(i[f].distanceToPoint(r)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let r=0;r<6;r++){const l=i[r];if(lu.x=l.normal.x>0?e.max.x:e.min.x,lu.y=l.normal.y>0?e.max.y:e.min.y,lu.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(lu)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let r=0;r<6;r++)if(i[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Au extends uo{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new be(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ru=new st,Cu=new st,Gv=new an,ul=new Nu,cu=new Du,Bd=new st,Vv=new st;class y1 extends Un{constructor(e=new Ii,i=new Au){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[0];for(let l=1,f=i.count;l<f;l++)Ru.fromBufferAttribute(i,l-1),Cu.fromBufferAttribute(i,l),r[l]=r[l-1],r[l]+=Ru.distanceTo(Cu);e.setAttribute("lineDistance",new jn(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,i){const r=this.geometry,l=this.matrixWorld,f=e.params.Line.threshold,h=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),cu.copy(r.boundingSphere),cu.applyMatrix4(l),cu.radius+=f,e.ray.intersectsSphere(cu)===!1)return;Gv.copy(l).invert(),ul.copy(e.ray).applyMatrix4(Gv);const d=f/((this.scale.x+this.scale.y+this.scale.z)/3),g=d*d,p=this.isLineSegments?2:1,x=r.index,y=r.attributes.position;if(x!==null){const M=Math.max(0,h.start),E=Math.min(x.count,h.start+h.count);for(let A=M,S=E-1;A<S;A+=p){const v=x.getX(A),P=x.getX(A+1),O=uu(this,e,ul,g,v,P,A);O&&i.push(O)}if(this.isLineLoop){const A=x.getX(E-1),S=x.getX(M),v=uu(this,e,ul,g,A,S,E-1);v&&i.push(v)}}else{const M=Math.max(0,h.start),E=Math.min(y.count,h.start+h.count);for(let A=M,S=E-1;A<S;A+=p){const v=uu(this,e,ul,g,A,A+1,A);v&&i.push(v)}if(this.isLineLoop){const A=uu(this,e,ul,g,E-1,M,E-1);A&&i.push(A)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let f=0,h=l.length;f<h;f++){const d=l[f].name||String(f);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=f}}}}}function uu(o,e,i,r,l,f,h){const d=o.geometry.attributes.position;if(Ru.fromBufferAttribute(d,l),Cu.fromBufferAttribute(d,f),i.distanceSqToSegment(Ru,Cu,Bd,Vv)>r)return;Bd.applyMatrix4(o.matrixWorld);const p=e.ray.origin.distanceTo(Bd);if(!(p<e.near||p>e.far))return{distance:p,point:Vv.clone().applyMatrix4(o.matrixWorld),index:h,face:null,faceIndex:null,barycoord:null,object:o}}const kv=new st,jv=new st;class Ip extends y1{constructor(e,i){super(e,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,r=[];for(let l=0,f=i.count;l<f;l+=2)kv.fromBufferAttribute(i,l),jv.fromBufferAttribute(i,l+1),r[l]=l===0?0:r[l-1],r[l+1]=r[l]+kv.distanceTo(jv);e.setAttribute("lineDistance",new jn(r,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ty extends $n{constructor(e,i,r=Zs,l,f,h,d=zi,g=zi,p,x=ml,m=1){if(x!==ml&&x!==gl)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const y={width:e,height:i,depth:m};super(y,l,f,h,d,g,x,r,p),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Zp(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}class Ay extends $n{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}const fu=new st,hu=new st,Fd=new st,du=new bi;class Xv extends Ii{constructor(e=null,i=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:i},e!==null){const l=Math.pow(10,4),f=Math.cos(hl*i),h=e.getIndex(),d=e.getAttribute("position"),g=h?h.count:d.count,p=[0,0,0],x=["a","b","c"],m=new Array(3),y={},M=[];for(let E=0;E<g;E+=3){h?(p[0]=h.getX(E),p[1]=h.getX(E+1),p[2]=h.getX(E+2)):(p[0]=E,p[1]=E+1,p[2]=E+2);const{a:A,b:S,c:v}=du;if(A.fromBufferAttribute(d,p[0]),S.fromBufferAttribute(d,p[1]),v.fromBufferAttribute(d,p[2]),du.getNormal(Fd),m[0]=`${Math.round(A.x*l)},${Math.round(A.y*l)},${Math.round(A.z*l)}`,m[1]=`${Math.round(S.x*l)},${Math.round(S.y*l)},${Math.round(S.z*l)}`,m[2]=`${Math.round(v.x*l)},${Math.round(v.y*l)},${Math.round(v.z*l)}`,!(m[0]===m[1]||m[1]===m[2]||m[2]===m[0]))for(let P=0;P<3;P++){const O=(P+1)%3,L=m[P],V=m[O],H=du[x[P]],B=du[x[O]],q=`${L}_${V}`,N=`${V}_${L}`;N in y&&y[N]?(Fd.dot(y[N].normal)<=f&&(M.push(H.x,H.y,H.z),M.push(B.x,B.y,B.z)),y[N]=null):q in y||(y[q]={index0:p[P],index1:p[O],normal:Fd.clone()})}}for(const E in y)if(y[E]){const{index0:A,index1:S}=y[E];fu.fromBufferAttribute(d,A),hu.fromBufferAttribute(d,S),M.push(fu.x,fu.y,fu.z),M.push(hu.x,hu.y,hu.z)}this.setAttribute("position",new jn(M,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Uu extends Ii{constructor(e=1,i=1,r=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:r,heightSegments:l};const f=e/2,h=i/2,d=Math.floor(r),g=Math.floor(l),p=d+1,x=g+1,m=e/d,y=i/g,M=[],E=[],A=[],S=[];for(let v=0;v<x;v++){const P=v*y-h;for(let O=0;O<p;O++){const L=O*m-f;E.push(L,-P,0),A.push(0,0,1),S.push(O/d),S.push(1-v/g)}}for(let v=0;v<g;v++)for(let P=0;P<d;P++){const O=P+p*v,L=P+p*(v+1),V=P+1+p*(v+1),H=P+1+p*v;M.push(O,L,H),M.push(L,V,H)}this.setIndex(M),this.setAttribute("position",new jn(E,3)),this.setAttribute("normal",new jn(A,3)),this.setAttribute("uv",new jn(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Uu(e.width,e.height,e.widthSegments,e.heightSegments)}}class Jp extends Ii{constructor(e=1,i=32,r=16,l=0,f=Math.PI*2,h=0,d=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:i,heightSegments:r,phiStart:l,phiLength:f,thetaStart:h,thetaLength:d},i=Math.max(3,Math.floor(i)),r=Math.max(2,Math.floor(r));const g=Math.min(h+d,Math.PI);let p=0;const x=[],m=new st,y=new st,M=[],E=[],A=[],S=[];for(let v=0;v<=r;v++){const P=[],O=v/r;let L=0;v===0&&h===0?L=.5/i:v===r&&g===Math.PI&&(L=-.5/i);for(let V=0;V<=i;V++){const H=V/i;m.x=-e*Math.cos(l+H*f)*Math.sin(h+O*d),m.y=e*Math.cos(h+O*d),m.z=e*Math.sin(l+H*f)*Math.sin(h+O*d),E.push(m.x,m.y,m.z),y.copy(m).normalize(),A.push(y.x,y.y,y.z),S.push(H+L,1-O),P.push(p++)}x.push(P)}for(let v=0;v<r;v++)for(let P=0;P<i;P++){const O=x[v][P+1],L=x[v][P],V=x[v+1][P],H=x[v+1][P+1];(v!==0||h>0)&&M.push(O,L,H),(v!==r-1||g<Math.PI)&&M.push(L,V,H)}this.setIndex(M),this.setAttribute("position",new jn(E,3)),this.setAttribute("normal",new jn(A,3)),this.setAttribute("uv",new jn(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jp(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Yv extends uo{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new be(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=py,this.normalScale=new pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ea,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class S1 extends uo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ub,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class M1 extends uo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ry extends Un{constructor(e,i=1){super(),this.isLight=!0,this.type="Light",this.color=new be(e),this.intensity=i}dispose(){}copy(e,i){return super.copy(e,i),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const i=super.toJSON(e);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,this.groundColor!==void 0&&(i.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(i.object.distance=this.distance),this.angle!==void 0&&(i.object.angle=this.angle),this.decay!==void 0&&(i.object.decay=this.decay),this.penumbra!==void 0&&(i.object.penumbra=this.penumbra),this.shadow!==void 0&&(i.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(i.object.target=this.target.uuid),i}}const Hd=new an,qv=new st,Wv=new st;class E1{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pe(512,512),this.mapType=ta,this.map=null,this.mapPass=null,this.matrix=new an,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Qp,this._frameExtents=new pe(1,1),this._viewportCount=1,this._viewports=[new ln(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const i=this.camera,r=this.matrix;qv.setFromMatrixPosition(e.matrixWorld),i.position.copy(qv),Wv.setFromMatrixPosition(e.target.matrixWorld),i.lookAt(Wv),i.updateMatrixWorld(),Hd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Hd,i.coordinateSystem,i.reversedDepth),i.reversedDepth?r.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(Hd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Cy extends Ey{constructor(e=-1,i=1,r=1,l=-1,f=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=r,this.bottom=l,this.near=f,this.far=h,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,r,l,f,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=f,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let f=r-e,h=r+e,d=l+i,g=l-i;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,x=(this.top-this.bottom)/this.view.fullHeight/this.zoom;f+=p*this.view.offsetX,h=f+p*this.view.width,d-=x*this.view.offsetY,g=d-x*this.view.height}this.projectionMatrix.makeOrthographic(f,h,d,g,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class b1 extends E1{constructor(){super(new Cy(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Zv extends Ry{constructor(e,i){super(e,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Un.DEFAULT_UP),this.updateMatrix(),this.target=new Un,this.shadow=new b1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class T1 extends Ry{constructor(e,i){super(e,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class A1 extends Ei{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Kv=new an;class R1{constructor(e,i,r=0,l=1/0){this.ray=new Nu(e,i),this.near=r,this.far=l,this.camera=null,this.layers=new Kp,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,i){this.ray.set(e,i)}setFromCamera(e,i){i.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(i.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(i).sub(this.ray.origin).normalize(),this.camera=i):i.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(i.near+i.far)/(i.near-i.far)).unproject(i),this.ray.direction.set(0,0,-1).transformDirection(i.matrixWorld),this.camera=i):console.error("THREE.Raycaster: Unsupported camera type: "+i.type)}setFromXRController(e){return Kv.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Kv),this}intersectObject(e,i=!0,r=[]){return Bp(e,this,r,i),r.sort(Qv),r}intersectObjects(e,i=!0,r=[]){for(let l=0,f=e.length;l<f;l++)Bp(e[l],this,r,i);return r.sort(Qv),r}}function Qv(o,e){return o.distance-e.distance}function Bp(o,e,i,r){let l=!0;if(o.layers.test(e.layers)&&o.raycast(e,i)===!1&&(l=!1),l===!0&&r===!0){const f=o.children;for(let h=0,d=f.length;h<d;h++)Bp(f[h],e,i,!0)}}class Jv{constructor(e=1,i=0,r=0){this.radius=e,this.phi=i,this.theta=r}set(e,i,r){return this.radius=e,this.phi=i,this.theta=r,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Re(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,i,r){return this.radius=Math.sqrt(e*e+i*i+r*r),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,r),this.phi=Math.acos(Re(i/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class C1 extends Ip{constructor(e=10,i=10,r=4473924,l=8947848){r=new be(r),l=new be(l);const f=i/2,h=e/i,d=e/2,g=[],p=[];for(let y=0,M=0,E=-d;y<=i;y++,E+=h){g.push(-d,0,E,d,0,E),g.push(E,0,-d,E,0,d);const A=y===f?r:l;A.toArray(p,M),M+=3,A.toArray(p,M),M+=3,A.toArray(p,M),M+=3,A.toArray(p,M),M+=3}const x=new Ii;x.setAttribute("position",new jn(g,3)),x.setAttribute("color",new jn(p,3));const m=new Au({vertexColors:!0,toneMapped:!1});super(x,m),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class w1 extends $s{constructor(e,i=null){super(),this.object=e,this.domElement=i,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function $v(o,e,i,r){const l=D1(r);switch(i){case uy:return o*e;case hy:return o*e/l.components*l.byteLength;case Yp:return o*e/l.components*l.byteLength;case dy:return o*e*2/l.components*l.byteLength;case qp:return o*e*2/l.components*l.byteLength;case fy:return o*e*3/l.components*l.byteLength;case Oi:return o*e*4/l.components*l.byteLength;case Wp:return o*e*4/l.components*l.byteLength;case vu:case xu:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case yu:case Su:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case cp:case fp:return Math.max(o,16)*Math.max(e,8)/4;case lp:case up:return Math.max(o,8)*Math.max(e,8)/2;case hp:case dp:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*8;case pp:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case mp:return Math.floor((o+3)/4)*Math.floor((e+3)/4)*16;case gp:return Math.floor((o+4)/5)*Math.floor((e+3)/4)*16;case _p:return Math.floor((o+4)/5)*Math.floor((e+4)/5)*16;case vp:return Math.floor((o+5)/6)*Math.floor((e+4)/5)*16;case xp:return Math.floor((o+5)/6)*Math.floor((e+5)/6)*16;case yp:return Math.floor((o+7)/8)*Math.floor((e+4)/5)*16;case Sp:return Math.floor((o+7)/8)*Math.floor((e+5)/6)*16;case Mp:return Math.floor((o+7)/8)*Math.floor((e+7)/8)*16;case Ep:return Math.floor((o+9)/10)*Math.floor((e+4)/5)*16;case bp:return Math.floor((o+9)/10)*Math.floor((e+5)/6)*16;case Tp:return Math.floor((o+9)/10)*Math.floor((e+7)/8)*16;case Ap:return Math.floor((o+9)/10)*Math.floor((e+9)/10)*16;case Rp:return Math.floor((o+11)/12)*Math.floor((e+9)/10)*16;case Cp:return Math.floor((o+11)/12)*Math.floor((e+11)/12)*16;case wp:case Dp:case Np:return Math.ceil(o/4)*Math.ceil(e/4)*16;case Up:case Lp:return Math.ceil(o/4)*Math.ceil(e/4)*8;case Op:case Pp:return Math.ceil(o/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function D1(o){switch(o){case ta:case ry:return{byteLength:1,components:1};case dl:case oy:case vl:return{byteLength:2,components:1};case jp:case Xp:return{byteLength:2,components:4};case Zs:case kp:case Ta:return{byteLength:4,components:1};case ly:case cy:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${o}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Vp}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Vp);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function wy(){let o=null,e=!1,i=null,r=null;function l(f,h){i(f,h),r=o.requestAnimationFrame(l)}return{start:function(){e!==!0&&i!==null&&(r=o.requestAnimationFrame(l),e=!0)},stop:function(){o.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(f){i=f},setContext:function(f){o=f}}}function N1(o){const e=new WeakMap;function i(d,g){const p=d.array,x=d.usage,m=p.byteLength,y=o.createBuffer();o.bindBuffer(g,y),o.bufferData(g,p,x),d.onUploadCallback();let M;if(p instanceof Float32Array)M=o.FLOAT;else if(typeof Float16Array<"u"&&p instanceof Float16Array)M=o.HALF_FLOAT;else if(p instanceof Uint16Array)d.isFloat16BufferAttribute?M=o.HALF_FLOAT:M=o.UNSIGNED_SHORT;else if(p instanceof Int16Array)M=o.SHORT;else if(p instanceof Uint32Array)M=o.UNSIGNED_INT;else if(p instanceof Int32Array)M=o.INT;else if(p instanceof Int8Array)M=o.BYTE;else if(p instanceof Uint8Array)M=o.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)M=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:y,type:M,bytesPerElement:p.BYTES_PER_ELEMENT,version:d.version,size:m}}function r(d,g,p){const x=g.array,m=g.updateRanges;if(o.bindBuffer(p,d),m.length===0)o.bufferSubData(p,0,x);else{m.sort((M,E)=>M.start-E.start);let y=0;for(let M=1;M<m.length;M++){const E=m[y],A=m[M];A.start<=E.start+E.count+1?E.count=Math.max(E.count,A.start+A.count-E.start):(++y,m[y]=A)}m.length=y+1;for(let M=0,E=m.length;M<E;M++){const A=m[M];o.bufferSubData(p,A.start*x.BYTES_PER_ELEMENT,x,A.start,A.count)}g.clearUpdateRanges()}g.onUploadCallback()}function l(d){return d.isInterleavedBufferAttribute&&(d=d.data),e.get(d)}function f(d){d.isInterleavedBufferAttribute&&(d=d.data);const g=e.get(d);g&&(o.deleteBuffer(g.buffer),e.delete(d))}function h(d,g){if(d.isInterleavedBufferAttribute&&(d=d.data),d.isGLBufferAttribute){const x=e.get(d);(!x||x.version<d.version)&&e.set(d,{buffer:d.buffer,type:d.type,bytesPerElement:d.elementSize,version:d.version});return}const p=e.get(d);if(p===void 0)e.set(d,i(d,g));else if(p.version<d.version){if(p.size!==d.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(p.buffer,d,g),p.version=d.version}}return{get:l,remove:f,update:h}}var U1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,L1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,O1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,P1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,z1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,I1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,B1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,F1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,H1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,G1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,V1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,k1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,j1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,X1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Y1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,q1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,W1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Z1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,K1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Q1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,J1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,$1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,tT=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,eT=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,nT=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,iT=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,aT=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sT=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rT=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,oT=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lT="gl_FragColor = linearToOutputTexel( gl_FragColor );",cT=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,uT=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,fT=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,hT=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,dT=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pT=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,mT=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gT=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_T=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vT=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xT=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,yT=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ST=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,MT=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ET=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,bT=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,TT=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,AT=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,RT=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,CT=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wT=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,DT=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,NT=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,UT=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,LT=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,OT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,PT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,IT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,BT=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,FT=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,HT=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,GT=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,VT=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,kT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jT=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,XT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,YT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qT=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,WT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ZT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,KT=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,QT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,JT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$T=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,tA=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,eA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,nA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,iA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,aA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rA=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,oA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,uA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,fA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dA=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,pA=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,mA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,gA=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,_A=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,vA=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,xA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yA=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,SA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,MA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,EA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bA=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,TA=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,AA=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,RA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,CA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,DA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const NA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,UA=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,LA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,OA=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,IA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,BA=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,FA=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,HA=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,GA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,VA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kA=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jA=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,XA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,YA=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qA=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,WA=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ZA=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,KA=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,QA=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,JA=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,$A=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,t2=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e2=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,n2=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,i2=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,a2=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,r2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,o2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,l2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,c2=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,u2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ye={alphahash_fragment:U1,alphahash_pars_fragment:L1,alphamap_fragment:O1,alphamap_pars_fragment:P1,alphatest_fragment:z1,alphatest_pars_fragment:I1,aomap_fragment:B1,aomap_pars_fragment:F1,batching_pars_vertex:H1,batching_vertex:G1,begin_vertex:V1,beginnormal_vertex:k1,bsdfs:j1,iridescence_fragment:X1,bumpmap_pars_fragment:Y1,clipping_planes_fragment:q1,clipping_planes_pars_fragment:W1,clipping_planes_pars_vertex:Z1,clipping_planes_vertex:K1,color_fragment:Q1,color_pars_fragment:J1,color_pars_vertex:$1,color_vertex:tT,common:eT,cube_uv_reflection_fragment:nT,defaultnormal_vertex:iT,displacementmap_pars_vertex:aT,displacementmap_vertex:sT,emissivemap_fragment:rT,emissivemap_pars_fragment:oT,colorspace_fragment:lT,colorspace_pars_fragment:cT,envmap_fragment:uT,envmap_common_pars_fragment:fT,envmap_pars_fragment:hT,envmap_pars_vertex:dT,envmap_physical_pars_fragment:bT,envmap_vertex:pT,fog_vertex:mT,fog_pars_vertex:gT,fog_fragment:_T,fog_pars_fragment:vT,gradientmap_pars_fragment:xT,lightmap_pars_fragment:yT,lights_lambert_fragment:ST,lights_lambert_pars_fragment:MT,lights_pars_begin:ET,lights_toon_fragment:TT,lights_toon_pars_fragment:AT,lights_phong_fragment:RT,lights_phong_pars_fragment:CT,lights_physical_fragment:wT,lights_physical_pars_fragment:DT,lights_fragment_begin:NT,lights_fragment_maps:UT,lights_fragment_end:LT,logdepthbuf_fragment:OT,logdepthbuf_pars_fragment:PT,logdepthbuf_pars_vertex:zT,logdepthbuf_vertex:IT,map_fragment:BT,map_pars_fragment:FT,map_particle_fragment:HT,map_particle_pars_fragment:GT,metalnessmap_fragment:VT,metalnessmap_pars_fragment:kT,morphinstance_vertex:jT,morphcolor_vertex:XT,morphnormal_vertex:YT,morphtarget_pars_vertex:qT,morphtarget_vertex:WT,normal_fragment_begin:ZT,normal_fragment_maps:KT,normal_pars_fragment:QT,normal_pars_vertex:JT,normal_vertex:$T,normalmap_pars_fragment:tA,clearcoat_normal_fragment_begin:eA,clearcoat_normal_fragment_maps:nA,clearcoat_pars_fragment:iA,iridescence_pars_fragment:aA,opaque_fragment:sA,packing:rA,premultiplied_alpha_fragment:oA,project_vertex:lA,dithering_fragment:cA,dithering_pars_fragment:uA,roughnessmap_fragment:fA,roughnessmap_pars_fragment:hA,shadowmap_pars_fragment:dA,shadowmap_pars_vertex:pA,shadowmap_vertex:mA,shadowmask_pars_fragment:gA,skinbase_vertex:_A,skinning_pars_vertex:vA,skinning_vertex:xA,skinnormal_vertex:yA,specularmap_fragment:SA,specularmap_pars_fragment:MA,tonemapping_fragment:EA,tonemapping_pars_fragment:bA,transmission_fragment:TA,transmission_pars_fragment:AA,uv_pars_fragment:RA,uv_pars_vertex:CA,uv_vertex:wA,worldpos_vertex:DA,background_vert:NA,background_frag:UA,backgroundCube_vert:LA,backgroundCube_frag:OA,cube_vert:PA,cube_frag:zA,depth_vert:IA,depth_frag:BA,distanceRGBA_vert:FA,distanceRGBA_frag:HA,equirect_vert:GA,equirect_frag:VA,linedashed_vert:kA,linedashed_frag:jA,meshbasic_vert:XA,meshbasic_frag:YA,meshlambert_vert:qA,meshlambert_frag:WA,meshmatcap_vert:ZA,meshmatcap_frag:KA,meshnormal_vert:QA,meshnormal_frag:JA,meshphong_vert:$A,meshphong_frag:t2,meshphysical_vert:e2,meshphysical_frag:n2,meshtoon_vert:i2,meshtoon_frag:a2,points_vert:s2,points_frag:r2,shadow_vert:o2,shadow_frag:l2,sprite_vert:c2,sprite_frag:u2},jt={common:{diffuse:{value:new be(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new xe},alphaMap:{value:null},alphaMapTransform:{value:new xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new xe}},envmap:{envMap:{value:null},envMapRotation:{value:new xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new xe},normalScale:{value:new pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new xe},alphaTest:{value:0},uvTransform:{value:new xe}},sprite:{diffuse:{value:new be(16777215)},opacity:{value:1},center:{value:new pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new xe},alphaMap:{value:null},alphaMapTransform:{value:new xe},alphaTest:{value:0}}},Ki={basic:{uniforms:kn([jt.common,jt.specularmap,jt.envmap,jt.aomap,jt.lightmap,jt.fog]),vertexShader:ye.meshbasic_vert,fragmentShader:ye.meshbasic_frag},lambert:{uniforms:kn([jt.common,jt.specularmap,jt.envmap,jt.aomap,jt.lightmap,jt.emissivemap,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.fog,jt.lights,{emissive:{value:new be(0)}}]),vertexShader:ye.meshlambert_vert,fragmentShader:ye.meshlambert_frag},phong:{uniforms:kn([jt.common,jt.specularmap,jt.envmap,jt.aomap,jt.lightmap,jt.emissivemap,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.fog,jt.lights,{emissive:{value:new be(0)},specular:{value:new be(1118481)},shininess:{value:30}}]),vertexShader:ye.meshphong_vert,fragmentShader:ye.meshphong_frag},standard:{uniforms:kn([jt.common,jt.envmap,jt.aomap,jt.lightmap,jt.emissivemap,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.roughnessmap,jt.metalnessmap,jt.fog,jt.lights,{emissive:{value:new be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag},toon:{uniforms:kn([jt.common,jt.aomap,jt.lightmap,jt.emissivemap,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.gradientmap,jt.fog,jt.lights,{emissive:{value:new be(0)}}]),vertexShader:ye.meshtoon_vert,fragmentShader:ye.meshtoon_frag},matcap:{uniforms:kn([jt.common,jt.bumpmap,jt.normalmap,jt.displacementmap,jt.fog,{matcap:{value:null}}]),vertexShader:ye.meshmatcap_vert,fragmentShader:ye.meshmatcap_frag},points:{uniforms:kn([jt.points,jt.fog]),vertexShader:ye.points_vert,fragmentShader:ye.points_frag},dashed:{uniforms:kn([jt.common,jt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ye.linedashed_vert,fragmentShader:ye.linedashed_frag},depth:{uniforms:kn([jt.common,jt.displacementmap]),vertexShader:ye.depth_vert,fragmentShader:ye.depth_frag},normal:{uniforms:kn([jt.common,jt.bumpmap,jt.normalmap,jt.displacementmap,{opacity:{value:1}}]),vertexShader:ye.meshnormal_vert,fragmentShader:ye.meshnormal_frag},sprite:{uniforms:kn([jt.sprite,jt.fog]),vertexShader:ye.sprite_vert,fragmentShader:ye.sprite_frag},background:{uniforms:{uvTransform:{value:new xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ye.background_vert,fragmentShader:ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new xe}},vertexShader:ye.backgroundCube_vert,fragmentShader:ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ye.cube_vert,fragmentShader:ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ye.equirect_vert,fragmentShader:ye.equirect_frag},distanceRGBA:{uniforms:kn([jt.common,jt.displacementmap,{referencePosition:{value:new st},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ye.distanceRGBA_vert,fragmentShader:ye.distanceRGBA_frag},shadow:{uniforms:kn([jt.lights,jt.fog,{color:{value:new be(0)},opacity:{value:1}}]),vertexShader:ye.shadow_vert,fragmentShader:ye.shadow_frag}};Ki.physical={uniforms:kn([Ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new xe},clearcoatNormalScale:{value:new pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new xe},sheen:{value:0},sheenColor:{value:new be(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new xe},transmissionSamplerSize:{value:new pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new xe},attenuationDistance:{value:0},attenuationColor:{value:new be(0)},specularColor:{value:new be(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new xe},anisotropyVector:{value:new pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new xe}}]),vertexShader:ye.meshphysical_vert,fragmentShader:ye.meshphysical_frag};const pu={r:0,b:0,g:0},Vs=new ea,f2=new an;function h2(o,e,i,r,l,f,h){const d=new be(0);let g=f===!0?0:1,p,x,m=null,y=0,M=null;function E(O){let L=O.isScene===!0?O.background:null;return L&&L.isTexture&&(L=(O.backgroundBlurriness>0?i:e).get(L)),L}function A(O){let L=!1;const V=E(O);V===null?v(d,g):V&&V.isColor&&(v(V,1),L=!0);const H=o.xr.getEnvironmentBlendMode();H==="additive"?r.buffers.color.setClear(0,0,0,1,h):H==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,h),(o.autoClear||L)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil))}function S(O,L){const V=E(L);V&&(V.isCubeTexture||V.mapping===wu)?(x===void 0&&(x=new Pi(new Js(1,1,1),new hs({name:"BackgroundCubeMaterial",uniforms:co(Ki.backgroundCube.uniforms),vertexShader:Ki.backgroundCube.vertexShader,fragmentShader:Ki.backgroundCube.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),x.geometry.deleteAttribute("normal"),x.geometry.deleteAttribute("uv"),x.onBeforeRender=function(H,B,q){this.matrixWorld.copyPosition(q.matrixWorld)},Object.defineProperty(x.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(x)),Vs.copy(L.backgroundRotation),Vs.x*=-1,Vs.y*=-1,Vs.z*=-1,V.isCubeTexture&&V.isRenderTargetTexture===!1&&(Vs.y*=-1,Vs.z*=-1),x.material.uniforms.envMap.value=V,x.material.uniforms.flipEnvMap.value=V.isCubeTexture&&V.isRenderTargetTexture===!1?-1:1,x.material.uniforms.backgroundBlurriness.value=L.backgroundBlurriness,x.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,x.material.uniforms.backgroundRotation.value.setFromMatrix4(f2.makeRotationFromEuler(Vs)),x.material.toneMapped=Pe.getTransfer(V.colorSpace)!==Ye,(m!==V||y!==V.version||M!==o.toneMapping)&&(x.material.needsUpdate=!0,m=V,y=V.version,M=o.toneMapping),x.layers.enableAll(),O.unshift(x,x.geometry,x.material,0,0,null)):V&&V.isTexture&&(p===void 0&&(p=new Pi(new Uu(2,2),new hs({name:"BackgroundMaterial",uniforms:co(Ki.background.uniforms),vertexShader:Ki.background.vertexShader,fragmentShader:Ki.background.fragmentShader,side:fs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(p)),p.material.uniforms.t2D.value=V,p.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,p.material.toneMapped=Pe.getTransfer(V.colorSpace)!==Ye,V.matrixAutoUpdate===!0&&V.updateMatrix(),p.material.uniforms.uvTransform.value.copy(V.matrix),(m!==V||y!==V.version||M!==o.toneMapping)&&(p.material.needsUpdate=!0,m=V,y=V.version,M=o.toneMapping),p.layers.enableAll(),O.unshift(p,p.geometry,p.material,0,0,null))}function v(O,L){O.getRGB(pu,My(o)),r.buffers.color.setClear(pu.r,pu.g,pu.b,L,h)}function P(){x!==void 0&&(x.geometry.dispose(),x.material.dispose(),x=void 0),p!==void 0&&(p.geometry.dispose(),p.material.dispose(),p=void 0)}return{getClearColor:function(){return d},setClearColor:function(O,L=1){d.set(O),g=L,v(d,g)},getClearAlpha:function(){return g},setClearAlpha:function(O){g=O,v(d,g)},render:A,addToRenderList:S,dispose:P}}function d2(o,e){const i=o.getParameter(o.MAX_VERTEX_ATTRIBS),r={},l=y(null);let f=l,h=!1;function d(D,X,lt,gt,Mt){let mt=!1;const Z=m(gt,lt,X);f!==Z&&(f=Z,p(f.object)),mt=M(D,gt,lt,Mt),mt&&E(D,gt,lt,Mt),Mt!==null&&e.update(Mt,o.ELEMENT_ARRAY_BUFFER),(mt||h)&&(h=!1,L(D,X,lt,gt),Mt!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e.get(Mt).buffer))}function g(){return o.createVertexArray()}function p(D){return o.bindVertexArray(D)}function x(D){return o.deleteVertexArray(D)}function m(D,X,lt){const gt=lt.wireframe===!0;let Mt=r[D.id];Mt===void 0&&(Mt={},r[D.id]=Mt);let mt=Mt[X.id];mt===void 0&&(mt={},Mt[X.id]=mt);let Z=mt[gt];return Z===void 0&&(Z=y(g()),mt[gt]=Z),Z}function y(D){const X=[],lt=[],gt=[];for(let Mt=0;Mt<i;Mt++)X[Mt]=0,lt[Mt]=0,gt[Mt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:X,enabledAttributes:lt,attributeDivisors:gt,object:D,attributes:{},index:null}}function M(D,X,lt,gt){const Mt=f.attributes,mt=X.attributes;let Z=0;const ct=lt.getAttributes();for(const Q in ct)if(ct[Q].location>=0){const At=Mt[Q];let Yt=mt[Q];if(Yt===void 0&&(Q==="instanceMatrix"&&D.instanceMatrix&&(Yt=D.instanceMatrix),Q==="instanceColor"&&D.instanceColor&&(Yt=D.instanceColor)),At===void 0||At.attribute!==Yt||Yt&&At.data!==Yt.data)return!0;Z++}return f.attributesNum!==Z||f.index!==gt}function E(D,X,lt,gt){const Mt={},mt=X.attributes;let Z=0;const ct=lt.getAttributes();for(const Q in ct)if(ct[Q].location>=0){let At=mt[Q];At===void 0&&(Q==="instanceMatrix"&&D.instanceMatrix&&(At=D.instanceMatrix),Q==="instanceColor"&&D.instanceColor&&(At=D.instanceColor));const Yt={};Yt.attribute=At,At&&At.data&&(Yt.data=At.data),Mt[Q]=Yt,Z++}f.attributes=Mt,f.attributesNum=Z,f.index=gt}function A(){const D=f.newAttributes;for(let X=0,lt=D.length;X<lt;X++)D[X]=0}function S(D){v(D,0)}function v(D,X){const lt=f.newAttributes,gt=f.enabledAttributes,Mt=f.attributeDivisors;lt[D]=1,gt[D]===0&&(o.enableVertexAttribArray(D),gt[D]=1),Mt[D]!==X&&(o.vertexAttribDivisor(D,X),Mt[D]=X)}function P(){const D=f.newAttributes,X=f.enabledAttributes;for(let lt=0,gt=X.length;lt<gt;lt++)X[lt]!==D[lt]&&(o.disableVertexAttribArray(lt),X[lt]=0)}function O(D,X,lt,gt,Mt,mt,Z){Z===!0?o.vertexAttribIPointer(D,X,lt,Mt,mt):o.vertexAttribPointer(D,X,lt,gt,Mt,mt)}function L(D,X,lt,gt){A();const Mt=gt.attributes,mt=lt.getAttributes(),Z=X.defaultAttributeValues;for(const ct in mt){const Q=mt[ct];if(Q.location>=0){let Tt=Mt[ct];if(Tt===void 0&&(ct==="instanceMatrix"&&D.instanceMatrix&&(Tt=D.instanceMatrix),ct==="instanceColor"&&D.instanceColor&&(Tt=D.instanceColor)),Tt!==void 0){const At=Tt.normalized,Yt=Tt.itemSize,oe=e.get(Tt);if(oe===void 0)continue;const Ct=oe.buffer,U=oe.type,tt=oe.bytesPerElement,G=U===o.INT||U===o.UNSIGNED_INT||Tt.gpuType===kp;if(Tt.isInterleavedBufferAttribute){const F=Tt.data,pt=F.stride,St=Tt.offset;if(F.isInstancedInterleavedBuffer){for(let Et=0;Et<Q.locationSize;Et++)v(Q.location+Et,F.meshPerAttribute);D.isInstancedMesh!==!0&&gt._maxInstanceCount===void 0&&(gt._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let Et=0;Et<Q.locationSize;Et++)S(Q.location+Et);o.bindBuffer(o.ARRAY_BUFFER,Ct);for(let Et=0;Et<Q.locationSize;Et++)O(Q.location+Et,Yt/Q.locationSize,U,At,pt*tt,(St+Yt/Q.locationSize*Et)*tt,G)}else{if(Tt.isInstancedBufferAttribute){for(let F=0;F<Q.locationSize;F++)v(Q.location+F,Tt.meshPerAttribute);D.isInstancedMesh!==!0&&gt._maxInstanceCount===void 0&&(gt._maxInstanceCount=Tt.meshPerAttribute*Tt.count)}else for(let F=0;F<Q.locationSize;F++)S(Q.location+F);o.bindBuffer(o.ARRAY_BUFFER,Ct);for(let F=0;F<Q.locationSize;F++)O(Q.location+F,Yt/Q.locationSize,U,At,Yt*tt,Yt/Q.locationSize*F*tt,G)}}else if(Z!==void 0){const At=Z[ct];if(At!==void 0)switch(At.length){case 2:o.vertexAttrib2fv(Q.location,At);break;case 3:o.vertexAttrib3fv(Q.location,At);break;case 4:o.vertexAttrib4fv(Q.location,At);break;default:o.vertexAttrib1fv(Q.location,At)}}}}P()}function V(){q();for(const D in r){const X=r[D];for(const lt in X){const gt=X[lt];for(const Mt in gt)x(gt[Mt].object),delete gt[Mt];delete X[lt]}delete r[D]}}function H(D){if(r[D.id]===void 0)return;const X=r[D.id];for(const lt in X){const gt=X[lt];for(const Mt in gt)x(gt[Mt].object),delete gt[Mt];delete X[lt]}delete r[D.id]}function B(D){for(const X in r){const lt=r[X];if(lt[D.id]===void 0)continue;const gt=lt[D.id];for(const Mt in gt)x(gt[Mt].object),delete gt[Mt];delete lt[D.id]}}function q(){N(),h=!0,f!==l&&(f=l,p(f.object))}function N(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:q,resetDefaultState:N,dispose:V,releaseStatesOfGeometry:H,releaseStatesOfProgram:B,initAttributes:A,enableAttribute:S,disableUnusedAttributes:P}}function p2(o,e,i){let r;function l(p){r=p}function f(p,x){o.drawArrays(r,p,x),i.update(x,r,1)}function h(p,x,m){m!==0&&(o.drawArraysInstanced(r,p,x,m),i.update(x,r,m))}function d(p,x,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,p,0,x,0,m);let M=0;for(let E=0;E<m;E++)M+=x[E];i.update(M,r,1)}function g(p,x,m,y){if(m===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let E=0;E<p.length;E++)h(p[E],x[E],y[E]);else{M.multiDrawArraysInstancedWEBGL(r,p,0,x,0,y,0,m);let E=0;for(let A=0;A<m;A++)E+=x[A]*y[A];i.update(E,r,1)}}this.setMode=l,this.render=f,this.renderInstances=h,this.renderMultiDraw=d,this.renderMultiDrawInstances=g}function m2(o,e,i,r){let l;function f(){if(l!==void 0)return l;if(e.has("EXT_texture_filter_anisotropic")===!0){const B=e.get("EXT_texture_filter_anisotropic");l=o.getParameter(B.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function h(B){return!(B!==Oi&&r.convert(B)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_FORMAT))}function d(B){const q=B===vl&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(B!==ta&&r.convert(B)!==o.getParameter(o.IMPLEMENTATION_COLOR_READ_TYPE)&&B!==Ta&&!q)}function g(B){if(B==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";B="mediump"}return B==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=i.precision!==void 0?i.precision:"highp";const x=g(p);x!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",x,"instead."),p=x);const m=i.logarithmicDepthBuffer===!0,y=i.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),M=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),E=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),A=o.getParameter(o.MAX_TEXTURE_SIZE),S=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),v=o.getParameter(o.MAX_VERTEX_ATTRIBS),P=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),O=o.getParameter(o.MAX_VARYING_VECTORS),L=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),V=E>0,H=o.getParameter(o.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:f,getMaxPrecision:g,textureFormatReadable:h,textureTypeReadable:d,precision:p,logarithmicDepthBuffer:m,reversedDepthBuffer:y,maxTextures:M,maxVertexTextures:E,maxTextureSize:A,maxCubemapSize:S,maxAttributes:v,maxVertexUniforms:P,maxVaryings:O,maxFragmentUniforms:L,vertexTextures:V,maxSamples:H}}function g2(o){const e=this;let i=null,r=0,l=!1,f=!1;const h=new os,d=new xe,g={value:null,needsUpdate:!1};this.uniform=g,this.numPlanes=0,this.numIntersection=0,this.init=function(m,y){const M=m.length!==0||y||r!==0||l;return l=y,r=m.length,M},this.beginShadows=function(){f=!0,x(null)},this.endShadows=function(){f=!1},this.setGlobalState=function(m,y){i=x(m,y,0)},this.setState=function(m,y,M){const E=m.clippingPlanes,A=m.clipIntersection,S=m.clipShadows,v=o.get(m);if(!l||E===null||E.length===0||f&&!S)f?x(null):p();else{const P=f?0:r,O=P*4;let L=v.clippingState||null;g.value=L,L=x(E,y,O,M);for(let V=0;V!==O;++V)L[V]=i[V];v.clippingState=L,this.numIntersection=A?this.numPlanes:0,this.numPlanes+=P}};function p(){g.value!==i&&(g.value=i,g.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function x(m,y,M,E){const A=m!==null?m.length:0;let S=null;if(A!==0){if(S=g.value,E!==!0||S===null){const v=M+A*4,P=y.matrixWorldInverse;d.getNormalMatrix(P),(S===null||S.length<v)&&(S=new Float32Array(v));for(let O=0,L=M;O!==A;++O,L+=4)h.copy(m[O]).applyMatrix4(P,d),h.normal.toArray(S,L),S[L+3]=h.constant}g.value=S,g.needsUpdate=!0}return e.numPlanes=A,e.numIntersection=0,S}}function _2(o){let e=new WeakMap;function i(h,d){return d===ap?h.mapping=ro:d===sp&&(h.mapping=oo),h}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===ap||d===sp)if(e.has(h)){const g=e.get(h).texture;return i(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const p=new p1(g.height);return p.fromEquirectangularTexture(o,h),e.set(h,p),h.addEventListener("dispose",l),i(p.texture,h.mapping)}else return null}}return h}function l(h){const d=h.target;d.removeEventListener("dispose",l);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function f(){e=new WeakMap}return{get:r,dispose:f}}const eo=4,tx=[.125,.215,.35,.446,.526,.582],Ys=20,Gd=new Cy,ex=new be;let Vd=null,kd=0,jd=0,Xd=!1;const js=(1+Math.sqrt(5))/2,$r=1/js,nx=[new st(-js,$r,0),new st(js,$r,0),new st(-$r,0,js),new st($r,0,js),new st(0,js,-$r),new st(0,js,$r),new st(-1,1,-1),new st(1,1,-1),new st(-1,1,1),new st(1,1,1)],v2=new st;class ix{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,i=0,r=.1,l=100,f={}){const{size:h=256,position:d=v2}=f;Vd=this._renderer.getRenderTarget(),kd=this._renderer.getActiveCubeFace(),jd=this._renderer.getActiveMipmapLevel(),Xd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(h);const g=this._allocateTargets();return g.depthBuffer=!0,this._sceneToCubeUV(e,r,l,g,d),i>0&&this._blur(g,0,0,i),this._applyPMREM(g),this._cleanup(g),g}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rx(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sx(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Vd,kd,jd),this._renderer.xr.enabled=Xd,e.scissorTest=!1,mu(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===ro||e.mapping===oo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Vd=this._renderer.getRenderTarget(),kd=this._renderer.getActiveCubeFace(),jd=this._renderer.getActiveMipmapLevel(),Xd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=i||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,r={magFilter:Qi,minFilter:Qi,generateMipmaps:!1,type:vl,format:Oi,colorSpace:lo,depthBuffer:!1},l=ax(e,i,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ax(e,i,r);const{_lodMax:f}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=x2(f)),this._blurMaterial=y2(f,e,i)}return l}_compileMaterial(e){const i=new Pi(this._lodPlanes[0],e);this._renderer.compile(i,Gd)}_sceneToCubeUV(e,i,r,l,f){const g=new Ei(90,1,i,r),p=[1,-1,1,1,1,1],x=[1,1,1,-1,-1,-1],m=this._renderer,y=m.autoClear,M=m.toneMapping;m.getClearColor(ex),m.toneMapping=us,m.autoClear=!1,m.state.buffers.depth.getReversed()&&(m.setRenderTarget(l),m.clearDepth(),m.setRenderTarget(null));const A=new xy({name:"PMREM.Background",side:Jn,depthWrite:!1,depthTest:!1}),S=new Pi(new Js,A);let v=!1;const P=e.background;P?P.isColor&&(A.color.copy(P),e.background=null,v=!0):(A.color.copy(ex),v=!0);for(let O=0;O<6;O++){const L=O%3;L===0?(g.up.set(0,p[O],0),g.position.set(f.x,f.y,f.z),g.lookAt(f.x+x[O],f.y,f.z)):L===1?(g.up.set(0,0,p[O]),g.position.set(f.x,f.y,f.z),g.lookAt(f.x,f.y+x[O],f.z)):(g.up.set(0,p[O],0),g.position.set(f.x,f.y,f.z),g.lookAt(f.x,f.y,f.z+x[O]));const V=this._cubeSize;mu(l,L*V,O>2?V:0,V,V),m.setRenderTarget(l),v&&m.render(S,g),m.render(e,g)}S.geometry.dispose(),S.material.dispose(),m.toneMapping=M,m.autoClear=y,e.background=P}_textureToCubeUV(e,i){const r=this._renderer,l=e.mapping===ro||e.mapping===oo;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=rx()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sx());const f=l?this._cubemapMaterial:this._equirectMaterial,h=new Pi(this._lodPlanes[0],f),d=f.uniforms;d.envMap.value=e;const g=this._cubeSize;mu(i,0,0,3*g,2*g),r.setRenderTarget(i),r.render(h,Gd)}_applyPMREM(e){const i=this._renderer,r=i.autoClear;i.autoClear=!1;const l=this._lodPlanes.length;for(let f=1;f<l;f++){const h=Math.sqrt(this._sigmas[f]*this._sigmas[f]-this._sigmas[f-1]*this._sigmas[f-1]),d=nx[(l-f-1)%nx.length];this._blur(e,f-1,f,h,d)}i.autoClear=r}_blur(e,i,r,l,f){const h=this._pingPongRenderTarget;this._halfBlur(e,h,i,r,l,"latitudinal",f),this._halfBlur(h,e,r,r,l,"longitudinal",f)}_halfBlur(e,i,r,l,f,h,d){const g=this._renderer,p=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const x=3,m=new Pi(this._lodPlanes[l],p),y=p.uniforms,M=this._sizeLods[r]-1,E=isFinite(f)?Math.PI/(2*M):2*Math.PI/(2*Ys-1),A=f/E,S=isFinite(f)?1+Math.floor(x*A):Ys;S>Ys&&console.warn(`sigmaRadians, ${f}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${Ys}`);const v=[];let P=0;for(let B=0;B<Ys;++B){const q=B/A,N=Math.exp(-q*q/2);v.push(N),B===0?P+=N:B<S&&(P+=2*N)}for(let B=0;B<v.length;B++)v[B]=v[B]/P;y.envMap.value=e.texture,y.samples.value=S,y.weights.value=v,y.latitudinal.value=h==="latitudinal",d&&(y.poleAxis.value=d);const{_lodMax:O}=this;y.dTheta.value=E,y.mipInt.value=O-r;const L=this._sizeLods[l],V=3*L*(l>O-eo?l-O+eo:0),H=4*(this._cubeSize-L);mu(i,V,H,3*L,2*L),g.setRenderTarget(i),g.render(m,Gd)}}function x2(o){const e=[],i=[],r=[];let l=o;const f=o-eo+1+tx.length;for(let h=0;h<f;h++){const d=Math.pow(2,l);i.push(d);let g=1/d;h>o-eo?g=tx[h-o+eo-1]:h===0&&(g=0),r.push(g);const p=1/(d-2),x=-p,m=1+p,y=[x,x,m,x,m,m,x,x,m,m,x,m],M=6,E=6,A=3,S=2,v=1,P=new Float32Array(A*E*M),O=new Float32Array(S*E*M),L=new Float32Array(v*E*M);for(let H=0;H<M;H++){const B=H%3*2/3-1,q=H>2?0:-1,N=[B,q,0,B+2/3,q,0,B+2/3,q+1,0,B,q,0,B+2/3,q+1,0,B,q+1,0];P.set(N,A*E*H),O.set(y,S*E*H);const D=[H,H,H,H,H,H];L.set(D,v*E*H)}const V=new Ii;V.setAttribute("position",new $i(P,A)),V.setAttribute("uv",new $i(O,S)),V.setAttribute("faceIndex",new $i(L,v)),e.push(V),l>eo&&l--}return{lodPlanes:e,sizeLods:i,sigmas:r}}function ax(o,e,i){const r=new Qs(o,e,i);return r.texture.mapping=wu,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function mu(o,e,i,r,l){o.viewport.set(e,i,r,l),o.scissor.set(e,i,r,l)}function y2(o,e,i){const r=new Float32Array(Ys),l=new st(0,1,0);return new hs({name:"SphericalGaussianBlur",defines:{n:Ys,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:$p(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:cs,depthTest:!1,depthWrite:!1})}function sx(){return new hs({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:$p(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:cs,depthTest:!1,depthWrite:!1})}function rx(){return new hs({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:$p(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:cs,depthTest:!1,depthWrite:!1})}function $p(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function S2(o){let e=new WeakMap,i=null;function r(d){if(d&&d.isTexture){const g=d.mapping,p=g===ap||g===sp,x=g===ro||g===oo;if(p||x){let m=e.get(d);const y=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==y)return i===null&&(i=new ix(o)),m=p?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),m.texture;if(m!==void 0)return m.texture;{const M=d.image;return p&&M&&M.height>0||x&&M&&l(M)?(i===null&&(i=new ix(o)),m=p?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,e.set(d,m),d.addEventListener("dispose",f),m.texture):null}}}return d}function l(d){let g=0;const p=6;for(let x=0;x<p;x++)d[x]!==void 0&&g++;return g===p}function f(d){const g=d.target;g.removeEventListener("dispose",f);const p=e.get(g);p!==void 0&&(e.delete(g),p.dispose())}function h(){e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function M2(o){const e={};function i(r){if(e[r]!==void 0)return e[r];let l;switch(r){case"WEBGL_depth_texture":l=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=o.getExtension(r)}return e[r]=l,l}return{has:function(r){return i(r)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(r){const l=i(r);return l===null&&_l("THREE.WebGLRenderer: "+r+" extension not supported."),l}}}function E2(o,e,i,r){const l={},f=new WeakMap;function h(m){const y=m.target;y.index!==null&&e.remove(y.index);for(const E in y.attributes)e.remove(y.attributes[E]);y.removeEventListener("dispose",h),delete l[y.id];const M=f.get(y);M&&(e.remove(M),f.delete(y)),r.releaseStatesOfGeometry(y),y.isInstancedBufferGeometry===!0&&delete y._maxInstanceCount,i.memory.geometries--}function d(m,y){return l[y.id]===!0||(y.addEventListener("dispose",h),l[y.id]=!0,i.memory.geometries++),y}function g(m){const y=m.attributes;for(const M in y)e.update(y[M],o.ARRAY_BUFFER)}function p(m){const y=[],M=m.index,E=m.attributes.position;let A=0;if(M!==null){const P=M.array;A=M.version;for(let O=0,L=P.length;O<L;O+=3){const V=P[O+0],H=P[O+1],B=P[O+2];y.push(V,H,H,B,B,V)}}else if(E!==void 0){const P=E.array;A=E.version;for(let O=0,L=P.length/3-1;O<L;O+=3){const V=O+0,H=O+1,B=O+2;y.push(V,H,H,B,B,V)}}else return;const S=new(gy(y)?Sy:yy)(y,1);S.version=A;const v=f.get(m);v&&e.remove(v),f.set(m,S)}function x(m){const y=f.get(m);if(y){const M=m.index;M!==null&&y.version<M.version&&p(m)}else p(m);return f.get(m)}return{get:d,update:g,getWireframeAttribute:x}}function b2(o,e,i){let r;function l(y){r=y}let f,h;function d(y){f=y.type,h=y.bytesPerElement}function g(y,M){o.drawElements(r,M,f,y*h),i.update(M,r,1)}function p(y,M,E){E!==0&&(o.drawElementsInstanced(r,M,f,y*h,E),i.update(M,r,E))}function x(y,M,E){if(E===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,M,0,f,y,0,E);let S=0;for(let v=0;v<E;v++)S+=M[v];i.update(S,r,1)}function m(y,M,E,A){if(E===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let v=0;v<y.length;v++)p(y[v]/h,M[v],A[v]);else{S.multiDrawElementsInstancedWEBGL(r,M,0,f,y,0,A,0,E);let v=0;for(let P=0;P<E;P++)v+=M[P]*A[P];i.update(v,r,1)}}this.setMode=l,this.setIndex=d,this.render=g,this.renderInstances=p,this.renderMultiDraw=x,this.renderMultiDrawInstances=m}function T2(o){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(f,h,d){switch(i.calls++,h){case o.TRIANGLES:i.triangles+=d*(f/3);break;case o.LINES:i.lines+=d*(f/2);break;case o.LINE_STRIP:i.lines+=d*(f-1);break;case o.LINE_LOOP:i.lines+=d*f;break;case o.POINTS:i.points+=d*f;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:r}}function A2(o,e,i){const r=new WeakMap,l=new ln;function f(h,d,g){const p=h.morphTargetInfluences,x=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,m=x!==void 0?x.length:0;let y=r.get(d);if(y===void 0||y.count!==m){let D=function(){q.dispose(),r.delete(d),d.removeEventListener("dispose",D)};var M=D;y!==void 0&&y.texture.dispose();const E=d.morphAttributes.position!==void 0,A=d.morphAttributes.normal!==void 0,S=d.morphAttributes.color!==void 0,v=d.morphAttributes.position||[],P=d.morphAttributes.normal||[],O=d.morphAttributes.color||[];let L=0;E===!0&&(L=1),A===!0&&(L=2),S===!0&&(L=3);let V=d.attributes.position.count*L,H=1;V>e.maxTextureSize&&(H=Math.ceil(V/e.maxTextureSize),V=e.maxTextureSize);const B=new Float32Array(V*H*4*m),q=new _y(B,V,H,m);q.type=Ta,q.needsUpdate=!0;const N=L*4;for(let X=0;X<m;X++){const lt=v[X],gt=P[X],Mt=O[X],mt=V*H*4*X;for(let Z=0;Z<lt.count;Z++){const ct=Z*N;E===!0&&(l.fromBufferAttribute(lt,Z),B[mt+ct+0]=l.x,B[mt+ct+1]=l.y,B[mt+ct+2]=l.z,B[mt+ct+3]=0),A===!0&&(l.fromBufferAttribute(gt,Z),B[mt+ct+4]=l.x,B[mt+ct+5]=l.y,B[mt+ct+6]=l.z,B[mt+ct+7]=0),S===!0&&(l.fromBufferAttribute(Mt,Z),B[mt+ct+8]=l.x,B[mt+ct+9]=l.y,B[mt+ct+10]=l.z,B[mt+ct+11]=Mt.itemSize===4?l.w:1)}}y={count:m,texture:q,size:new pe(V,H)},r.set(d,y),d.addEventListener("dispose",D)}if(h.isInstancedMesh===!0&&h.morphTexture!==null)g.getUniforms().setValue(o,"morphTexture",h.morphTexture,i);else{let E=0;for(let S=0;S<p.length;S++)E+=p[S];const A=d.morphTargetsRelative?1:1-E;g.getUniforms().setValue(o,"morphTargetBaseInfluence",A),g.getUniforms().setValue(o,"morphTargetInfluences",p)}g.getUniforms().setValue(o,"morphTargetsTexture",y.texture,i),g.getUniforms().setValue(o,"morphTargetsTextureSize",y.size)}return{update:f}}function R2(o,e,i,r){let l=new WeakMap;function f(g){const p=r.render.frame,x=g.geometry,m=e.get(g,x);if(l.get(m)!==p&&(e.update(m),l.set(m,p)),g.isInstancedMesh&&(g.hasEventListener("dispose",d)===!1&&g.addEventListener("dispose",d),l.get(g)!==p&&(i.update(g.instanceMatrix,o.ARRAY_BUFFER),g.instanceColor!==null&&i.update(g.instanceColor,o.ARRAY_BUFFER),l.set(g,p))),g.isSkinnedMesh){const y=g.skeleton;l.get(y)!==p&&(y.update(),l.set(y,p))}return m}function h(){l=new WeakMap}function d(g){const p=g.target;p.removeEventListener("dispose",d),i.remove(p.instanceMatrix),p.instanceColor!==null&&i.remove(p.instanceColor)}return{update:f,dispose:h}}const Dy=new $n,ox=new Ty(1,1),Ny=new _y,Uy=new Qb,Ly=new by,lx=[],cx=[],ux=new Float32Array(16),fx=new Float32Array(9),hx=new Float32Array(4);function fo(o,e,i){const r=o[0];if(r<=0||r>0)return o;const l=e*i;let f=lx[l];if(f===void 0&&(f=new Float32Array(l),lx[l]=f),e!==0){r.toArray(f,0);for(let h=1,d=0;h!==e;++h)d+=i,o[h].toArray(f,d)}return f}function yn(o,e){if(o.length!==e.length)return!1;for(let i=0,r=o.length;i<r;i++)if(o[i]!==e[i])return!1;return!0}function Sn(o,e){for(let i=0,r=e.length;i<r;i++)o[i]=e[i]}function Lu(o,e){let i=cx[e];i===void 0&&(i=new Int32Array(e),cx[e]=i);for(let r=0;r!==e;++r)i[r]=o.allocateTextureUnit();return i}function C2(o,e){const i=this.cache;i[0]!==e&&(o.uniform1f(this.addr,e),i[0]=e)}function w2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(yn(i,e))return;o.uniform2fv(this.addr,e),Sn(i,e)}}function D2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(o.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(yn(i,e))return;o.uniform3fv(this.addr,e),Sn(i,e)}}function N2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(yn(i,e))return;o.uniform4fv(this.addr,e),Sn(i,e)}}function U2(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(yn(i,e))return;o.uniformMatrix2fv(this.addr,!1,e),Sn(i,e)}else{if(yn(i,r))return;hx.set(r),o.uniformMatrix2fv(this.addr,!1,hx),Sn(i,r)}}function L2(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(yn(i,e))return;o.uniformMatrix3fv(this.addr,!1,e),Sn(i,e)}else{if(yn(i,r))return;fx.set(r),o.uniformMatrix3fv(this.addr,!1,fx),Sn(i,r)}}function O2(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(yn(i,e))return;o.uniformMatrix4fv(this.addr,!1,e),Sn(i,e)}else{if(yn(i,r))return;ux.set(r),o.uniformMatrix4fv(this.addr,!1,ux),Sn(i,r)}}function P2(o,e){const i=this.cache;i[0]!==e&&(o.uniform1i(this.addr,e),i[0]=e)}function z2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(yn(i,e))return;o.uniform2iv(this.addr,e),Sn(i,e)}}function I2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(yn(i,e))return;o.uniform3iv(this.addr,e),Sn(i,e)}}function B2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(yn(i,e))return;o.uniform4iv(this.addr,e),Sn(i,e)}}function F2(o,e){const i=this.cache;i[0]!==e&&(o.uniform1ui(this.addr,e),i[0]=e)}function H2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(yn(i,e))return;o.uniform2uiv(this.addr,e),Sn(i,e)}}function G2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(yn(i,e))return;o.uniform3uiv(this.addr,e),Sn(i,e)}}function V2(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(yn(i,e))return;o.uniform4uiv(this.addr,e),Sn(i,e)}}function k2(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l);let f;this.type===o.SAMPLER_2D_SHADOW?(ox.compareFunction=my,f=ox):f=Dy,i.setTexture2D(e||f,l)}function j2(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture3D(e||Uy,l)}function X2(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTextureCube(e||Ly,l)}function Y2(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture2DArray(e||Ny,l)}function q2(o){switch(o){case 5126:return C2;case 35664:return w2;case 35665:return D2;case 35666:return N2;case 35674:return U2;case 35675:return L2;case 35676:return O2;case 5124:case 35670:return P2;case 35667:case 35671:return z2;case 35668:case 35672:return I2;case 35669:case 35673:return B2;case 5125:return F2;case 36294:return H2;case 36295:return G2;case 36296:return V2;case 35678:case 36198:case 36298:case 36306:case 35682:return k2;case 35679:case 36299:case 36307:return j2;case 35680:case 36300:case 36308:case 36293:return X2;case 36289:case 36303:case 36311:case 36292:return Y2}}function W2(o,e){o.uniform1fv(this.addr,e)}function Z2(o,e){const i=fo(e,this.size,2);o.uniform2fv(this.addr,i)}function K2(o,e){const i=fo(e,this.size,3);o.uniform3fv(this.addr,i)}function Q2(o,e){const i=fo(e,this.size,4);o.uniform4fv(this.addr,i)}function J2(o,e){const i=fo(e,this.size,4);o.uniformMatrix2fv(this.addr,!1,i)}function $2(o,e){const i=fo(e,this.size,9);o.uniformMatrix3fv(this.addr,!1,i)}function tR(o,e){const i=fo(e,this.size,16);o.uniformMatrix4fv(this.addr,!1,i)}function eR(o,e){o.uniform1iv(this.addr,e)}function nR(o,e){o.uniform2iv(this.addr,e)}function iR(o,e){o.uniform3iv(this.addr,e)}function aR(o,e){o.uniform4iv(this.addr,e)}function sR(o,e){o.uniform1uiv(this.addr,e)}function rR(o,e){o.uniform2uiv(this.addr,e)}function oR(o,e){o.uniform3uiv(this.addr,e)}function lR(o,e){o.uniform4uiv(this.addr,e)}function cR(o,e,i){const r=this.cache,l=e.length,f=Lu(i,l);yn(r,f)||(o.uniform1iv(this.addr,f),Sn(r,f));for(let h=0;h!==l;++h)i.setTexture2D(e[h]||Dy,f[h])}function uR(o,e,i){const r=this.cache,l=e.length,f=Lu(i,l);yn(r,f)||(o.uniform1iv(this.addr,f),Sn(r,f));for(let h=0;h!==l;++h)i.setTexture3D(e[h]||Uy,f[h])}function fR(o,e,i){const r=this.cache,l=e.length,f=Lu(i,l);yn(r,f)||(o.uniform1iv(this.addr,f),Sn(r,f));for(let h=0;h!==l;++h)i.setTextureCube(e[h]||Ly,f[h])}function hR(o,e,i){const r=this.cache,l=e.length,f=Lu(i,l);yn(r,f)||(o.uniform1iv(this.addr,f),Sn(r,f));for(let h=0;h!==l;++h)i.setTexture2DArray(e[h]||Ny,f[h])}function dR(o){switch(o){case 5126:return W2;case 35664:return Z2;case 35665:return K2;case 35666:return Q2;case 35674:return J2;case 35675:return $2;case 35676:return tR;case 5124:case 35670:return eR;case 35667:case 35671:return nR;case 35668:case 35672:return iR;case 35669:case 35673:return aR;case 5125:return sR;case 36294:return rR;case 36295:return oR;case 36296:return lR;case 35678:case 36198:case 36298:case 36306:case 35682:return cR;case 35679:case 36299:case 36307:return uR;case 35680:case 36300:case 36308:case 36293:return fR;case 36289:case 36303:case 36311:case 36292:return hR}}class pR{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.setValue=q2(i.type)}}class mR{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=dR(i.type)}}class gR{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,r){const l=this.seq;for(let f=0,h=l.length;f!==h;++f){const d=l[f];d.setValue(e,i[d.id],r)}}}const Yd=/(\w+)(\])?(\[|\.)?/g;function dx(o,e){o.seq.push(e),o.map[e.id]=e}function _R(o,e,i){const r=o.name,l=r.length;for(Yd.lastIndex=0;;){const f=Yd.exec(r),h=Yd.lastIndex;let d=f[1];const g=f[2]==="]",p=f[3];if(g&&(d=d|0),p===void 0||p==="["&&h+2===l){dx(i,p===void 0?new pR(d,o,e):new mR(d,o,e));break}else{let m=i.map[d];m===void 0&&(m=new gR(d),dx(i,m)),i=m}}}class Mu{constructor(e,i){this.seq=[],this.map={};const r=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let l=0;l<r;++l){const f=e.getActiveUniform(i,l),h=e.getUniformLocation(i,f.name);_R(f,h,this)}}setValue(e,i,r,l){const f=this.map[i];f!==void 0&&f.setValue(e,r,l)}setOptional(e,i,r){const l=i[r];l!==void 0&&this.setValue(e,r,l)}static upload(e,i,r,l){for(let f=0,h=i.length;f!==h;++f){const d=i[f],g=r[d.id];g.needsUpdate!==!1&&d.setValue(e,g.value,l)}}static seqWithValue(e,i){const r=[];for(let l=0,f=e.length;l!==f;++l){const h=e[l];h.id in i&&r.push(h)}return r}}function px(o,e,i){const r=o.createShader(e);return o.shaderSource(r,i),o.compileShader(r),r}const vR=37297;let xR=0;function yR(o,e){const i=o.split(`
`),r=[],l=Math.max(e-6,0),f=Math.min(e+6,i.length);for(let h=l;h<f;h++){const d=h+1;r.push(`${d===e?">":" "} ${d}: ${i[h]}`)}return r.join(`
`)}const mx=new xe;function SR(o){Pe._getMatrix(mx,Pe.workingColorSpace,o);const e=`mat3( ${mx.elements.map(i=>i.toFixed(4))} )`;switch(Pe.getTransfer(o)){case Eu:return[e,"LinearTransferOETF"];case Ye:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",o),[e,"LinearTransferOETF"]}}function gx(o,e,i){const r=o.getShaderParameter(e,o.COMPILE_STATUS),f=(o.getShaderInfoLog(e)||"").trim();if(r&&f==="")return"";const h=/ERROR: 0:(\d+)/.exec(f);if(h){const d=parseInt(h[1]);return i.toUpperCase()+`

`+f+`

`+yR(o.getShaderSource(e),d)}else return f}function MR(o,e){const i=SR(e);return[`vec4 ${o}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}function ER(o,e){let i;switch(e){case bb:i="Linear";break;case Tb:i="Reinhard";break;case Ab:i="Cineon";break;case Rb:i="ACESFilmic";break;case wb:i="AgX";break;case Db:i="Neutral";break;case Cb:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),i="Linear"}return"vec3 "+o+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const gu=new st;function bR(){Pe.getLuminanceCoefficients(gu);const o=gu.x.toFixed(4),e=gu.y.toFixed(4),i=gu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${o}, ${e}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function TR(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",o.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fl).join(`
`)}function AR(o){const e=[];for(const i in o){const r=o[i];r!==!1&&e.push("#define "+i+" "+r)}return e.join(`
`)}function RR(o,e){const i={},r=o.getProgramParameter(e,o.ACTIVE_ATTRIBUTES);for(let l=0;l<r;l++){const f=o.getActiveAttrib(e,l),h=f.name;let d=1;f.type===o.FLOAT_MAT2&&(d=2),f.type===o.FLOAT_MAT3&&(d=3),f.type===o.FLOAT_MAT4&&(d=4),i[h]={type:f.type,location:o.getAttribLocation(e,h),locationSize:d}}return i}function fl(o){return o!==""}function _x(o,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function vx(o,e){return o.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const CR=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fp(o){return o.replace(CR,DR)}const wR=new Map;function DR(o,e){let i=ye[e];if(i===void 0){const r=wR.get(e);if(r!==void 0)i=ye[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return Fp(i)}const NR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xx(o){return o.replace(NR,UR)}function UR(o,e,i,r){let l="";for(let f=parseInt(e);f<parseInt(i);f++)l+=r.replace(/\[\s*i\s*\]/g,"[ "+f+" ]").replace(/UNROLLED_LOOP_INDEX/g,f);return l}function yx(o){let e=`precision ${o.precision} float;
	precision ${o.precision} int;
	precision ${o.precision} sampler2D;
	precision ${o.precision} samplerCube;
	precision ${o.precision} sampler3D;
	precision ${o.precision} sampler2DArray;
	precision ${o.precision} sampler2DShadow;
	precision ${o.precision} samplerCubeShadow;
	precision ${o.precision} sampler2DArrayShadow;
	precision ${o.precision} isampler2D;
	precision ${o.precision} isampler3D;
	precision ${o.precision} isamplerCube;
	precision ${o.precision} isampler2DArray;
	precision ${o.precision} usampler2D;
	precision ${o.precision} usampler3D;
	precision ${o.precision} usamplerCube;
	precision ${o.precision} usampler2DArray;
	`;return o.precision==="highp"?e+=`
#define HIGH_PRECISION`:o.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function LR(o){let e="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===iy?e="SHADOWMAP_TYPE_PCF":o.shadowMapType===ib?e="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===Ea&&(e="SHADOWMAP_TYPE_VSM"),e}function OR(o){let e="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case ro:case oo:e="ENVMAP_TYPE_CUBE";break;case wu:e="ENVMAP_TYPE_CUBE_UV";break}return e}function PR(o){let e="ENVMAP_MODE_REFLECTION";if(o.envMap)switch(o.envMapMode){case oo:e="ENVMAP_MODE_REFRACTION";break}return e}function zR(o){let e="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case ay:e="ENVMAP_BLENDING_MULTIPLY";break;case Mb:e="ENVMAP_BLENDING_MIX";break;case Eb:e="ENVMAP_BLENDING_ADD";break}return e}function IR(o){const e=o.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:r,maxMip:i}}function BR(o,e,i,r){const l=o.getContext(),f=i.defines;let h=i.vertexShader,d=i.fragmentShader;const g=LR(i),p=OR(i),x=PR(i),m=zR(i),y=IR(i),M=TR(i),E=AR(f),A=l.createProgram();let S,v,P=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(S=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E].filter(fl).join(`
`),S.length>0&&(S+=`
`),v=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E].filter(fl).join(`
`),v.length>0&&(v+=`
`)):(S=[yx(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+x:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+g:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fl).join(`
`),v=[yx(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,E,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+p:"",i.envMap?"#define "+x:"",i.envMap?"#define "+m:"",y?"#define CUBEUV_TEXEL_WIDTH "+y.texelWidth:"",y?"#define CUBEUV_TEXEL_HEIGHT "+y.texelHeight:"",y?"#define CUBEUV_MAX_MIP "+y.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor||i.batchingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+g:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==us?"#define TONE_MAPPING":"",i.toneMapping!==us?ye.tonemapping_pars_fragment:"",i.toneMapping!==us?ER("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",ye.colorspace_pars_fragment,MR("linearToOutputTexel",i.outputColorSpace),bR(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(fl).join(`
`)),h=Fp(h),h=_x(h,i),h=vx(h,i),d=Fp(d),d=_x(d,i),d=vx(d,i),h=xx(h),d=xx(d),i.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,S=[M,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,v=["#define varying in",i.glslVersion===Ev?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===Ev?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const O=P+S+h,L=P+v+d,V=px(l,l.VERTEX_SHADER,O),H=px(l,l.FRAGMENT_SHADER,L);l.attachShader(A,V),l.attachShader(A,H),i.index0AttributeName!==void 0?l.bindAttribLocation(A,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(A,0,"position"),l.linkProgram(A);function B(X){if(o.debug.checkShaderErrors){const lt=l.getProgramInfoLog(A)||"",gt=l.getShaderInfoLog(V)||"",Mt=l.getShaderInfoLog(H)||"",mt=lt.trim(),Z=gt.trim(),ct=Mt.trim();let Q=!0,Tt=!0;if(l.getProgramParameter(A,l.LINK_STATUS)===!1)if(Q=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(l,A,V,H);else{const At=gx(l,V,"vertex"),Yt=gx(l,H,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(A,l.VALIDATE_STATUS)+`

Material Name: `+X.name+`
Material Type: `+X.type+`

Program Info Log: `+mt+`
`+At+`
`+Yt)}else mt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",mt):(Z===""||ct==="")&&(Tt=!1);Tt&&(X.diagnostics={runnable:Q,programLog:mt,vertexShader:{log:Z,prefix:S},fragmentShader:{log:ct,prefix:v}})}l.deleteShader(V),l.deleteShader(H),q=new Mu(l,A),N=RR(l,A)}let q;this.getUniforms=function(){return q===void 0&&B(this),q};let N;this.getAttributes=function(){return N===void 0&&B(this),N};let D=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=l.getProgramParameter(A,vR)),D},this.destroy=function(){r.releaseStatesOfProgram(this),l.deleteProgram(A),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=xR++,this.cacheKey=e,this.usedTimes=1,this.program=A,this.vertexShader=V,this.fragmentShader=H,this}let FR=0;class HR{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const i=e.vertexShader,r=e.fragmentShader,l=this._getShaderStage(i),f=this._getShaderStage(r),h=this._getShaderCacheForMaterial(e);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(f)===!1&&(h.add(f),f.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const r of i)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let r=i.get(e);return r===void 0&&(r=new Set,i.set(e,r)),r}_getShaderStage(e){const i=this.shaderCache;let r=i.get(e);return r===void 0&&(r=new GR(e),i.set(e,r)),r}}class GR{constructor(e){this.id=FR++,this.code=e,this.usedTimes=0}}function VR(o,e,i,r,l,f,h){const d=new Kp,g=new HR,p=new Set,x=[],m=l.logarithmicDepthBuffer,y=l.vertexTextures;let M=l.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function A(N){return p.add(N),N===0?"uv":`uv${N}`}function S(N,D,X,lt,gt){const Mt=lt.fog,mt=gt.geometry,Z=N.isMeshStandardMaterial?lt.environment:null,ct=(N.isMeshStandardMaterial?i:e).get(N.envMap||Z),Q=ct&&ct.mapping===wu?ct.image.height:null,Tt=E[N.type];N.precision!==null&&(M=l.getMaxPrecision(N.precision),M!==N.precision&&console.warn("THREE.WebGLProgram.getParameters:",N.precision,"not supported, using",M,"instead."));const At=mt.morphAttributes.position||mt.morphAttributes.normal||mt.morphAttributes.color,Yt=At!==void 0?At.length:0;let oe=0;mt.morphAttributes.position!==void 0&&(oe=1),mt.morphAttributes.normal!==void 0&&(oe=2),mt.morphAttributes.color!==void 0&&(oe=3);let Ct,U,tt,G;if(Tt){const Ce=Ki[Tt];Ct=Ce.vertexShader,U=Ce.fragmentShader}else Ct=N.vertexShader,U=N.fragmentShader,g.update(N),tt=g.getVertexShaderID(N),G=g.getFragmentShaderID(N);const F=o.getRenderTarget(),pt=o.state.buffers.depth.getReversed(),St=gt.isInstancedMesh===!0,Et=gt.isBatchedMesh===!0,ut=!!N.map,Ot=!!N.matcap,z=!!ct,ne=!!N.aoMap,qt=!!N.lightMap,Nt=!!N.bumpMap,yt=!!N.normalMap,It=!!N.displacementMap,Rt=!!N.emissiveMap,Zt=!!N.metalnessMap,me=!!N.roughnessMap,he=N.anisotropy>0,w=N.clearcoat>0,b=N.dispersion>0,Y=N.iridescence>0,$=N.sheen>0,ht=N.transmission>0,ot=he&&!!N.anisotropyMap,Ht=w&&!!N.clearcoatMap,_t=w&&!!N.clearcoatNormalMap,Xt=w&&!!N.clearcoatRoughnessMap,ee=Y&&!!N.iridescenceMap,Dt=Y&&!!N.iridescenceThicknessMap,Gt=$&&!!N.sheenColorMap,ce=$&&!!N.sheenRoughnessMap,ie=!!N.specularMap,Vt=!!N.specularColorMap,ge=!!N.specularIntensityMap,j=ht&&!!N.transmissionMap,Lt=ht&&!!N.thicknessMap,zt=!!N.gradientMap,Qt=!!N.alphaMap,wt=N.alphaTest>0,bt=!!N.alphaHash,te=!!N.extensions;let de=us;N.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(de=o.toneMapping);const je={shaderID:Tt,shaderType:N.type,shaderName:N.name,vertexShader:Ct,fragmentShader:U,defines:N.defines,customVertexShaderID:tt,customFragmentShaderID:G,isRawShaderMaterial:N.isRawShaderMaterial===!0,glslVersion:N.glslVersion,precision:M,batching:Et,batchingColor:Et&&gt._colorsTexture!==null,instancing:St,instancingColor:St&&gt.instanceColor!==null,instancingMorph:St&&gt.morphTexture!==null,supportsVertexTextures:y,outputColorSpace:F===null?o.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:lo,alphaToCoverage:!!N.alphaToCoverage,map:ut,matcap:Ot,envMap:z,envMapMode:z&&ct.mapping,envMapCubeUVHeight:Q,aoMap:ne,lightMap:qt,bumpMap:Nt,normalMap:yt,displacementMap:y&&It,emissiveMap:Rt,normalMapObjectSpace:yt&&N.normalMapType===Ob,normalMapTangentSpace:yt&&N.normalMapType===py,metalnessMap:Zt,roughnessMap:me,anisotropy:he,anisotropyMap:ot,clearcoat:w,clearcoatMap:Ht,clearcoatNormalMap:_t,clearcoatRoughnessMap:Xt,dispersion:b,iridescence:Y,iridescenceMap:ee,iridescenceThicknessMap:Dt,sheen:$,sheenColorMap:Gt,sheenRoughnessMap:ce,specularMap:ie,specularColorMap:Vt,specularIntensityMap:ge,transmission:ht,transmissionMap:j,thicknessMap:Lt,gradientMap:zt,opaque:N.transparent===!1&&N.blending===io&&N.alphaToCoverage===!1,alphaMap:Qt,alphaTest:wt,alphaHash:bt,combine:N.combine,mapUv:ut&&A(N.map.channel),aoMapUv:ne&&A(N.aoMap.channel),lightMapUv:qt&&A(N.lightMap.channel),bumpMapUv:Nt&&A(N.bumpMap.channel),normalMapUv:yt&&A(N.normalMap.channel),displacementMapUv:It&&A(N.displacementMap.channel),emissiveMapUv:Rt&&A(N.emissiveMap.channel),metalnessMapUv:Zt&&A(N.metalnessMap.channel),roughnessMapUv:me&&A(N.roughnessMap.channel),anisotropyMapUv:ot&&A(N.anisotropyMap.channel),clearcoatMapUv:Ht&&A(N.clearcoatMap.channel),clearcoatNormalMapUv:_t&&A(N.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Xt&&A(N.clearcoatRoughnessMap.channel),iridescenceMapUv:ee&&A(N.iridescenceMap.channel),iridescenceThicknessMapUv:Dt&&A(N.iridescenceThicknessMap.channel),sheenColorMapUv:Gt&&A(N.sheenColorMap.channel),sheenRoughnessMapUv:ce&&A(N.sheenRoughnessMap.channel),specularMapUv:ie&&A(N.specularMap.channel),specularColorMapUv:Vt&&A(N.specularColorMap.channel),specularIntensityMapUv:ge&&A(N.specularIntensityMap.channel),transmissionMapUv:j&&A(N.transmissionMap.channel),thicknessMapUv:Lt&&A(N.thicknessMap.channel),alphaMapUv:Qt&&A(N.alphaMap.channel),vertexTangents:!!mt.attributes.tangent&&(yt||he),vertexColors:N.vertexColors,vertexAlphas:N.vertexColors===!0&&!!mt.attributes.color&&mt.attributes.color.itemSize===4,pointsUvs:gt.isPoints===!0&&!!mt.attributes.uv&&(ut||Qt),fog:!!Mt,useFog:N.fog===!0,fogExp2:!!Mt&&Mt.isFogExp2,flatShading:N.flatShading===!0&&N.wireframe===!1,sizeAttenuation:N.sizeAttenuation===!0,logarithmicDepthBuffer:m,reversedDepthBuffer:pt,skinning:gt.isSkinnedMesh===!0,morphTargets:mt.morphAttributes.position!==void 0,morphNormals:mt.morphAttributes.normal!==void 0,morphColors:mt.morphAttributes.color!==void 0,morphTargetsCount:Yt,morphTextureStride:oe,numDirLights:D.directional.length,numPointLights:D.point.length,numSpotLights:D.spot.length,numSpotLightMaps:D.spotLightMap.length,numRectAreaLights:D.rectArea.length,numHemiLights:D.hemi.length,numDirLightShadows:D.directionalShadowMap.length,numPointLightShadows:D.pointShadowMap.length,numSpotLightShadows:D.spotShadowMap.length,numSpotLightShadowsWithMaps:D.numSpotLightShadowsWithMaps,numLightProbes:D.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:N.dithering,shadowMapEnabled:o.shadowMap.enabled&&X.length>0,shadowMapType:o.shadowMap.type,toneMapping:de,decodeVideoTexture:ut&&N.map.isVideoTexture===!0&&Pe.getTransfer(N.map.colorSpace)===Ye,decodeVideoTextureEmissive:Rt&&N.emissiveMap.isVideoTexture===!0&&Pe.getTransfer(N.emissiveMap.colorSpace)===Ye,premultipliedAlpha:N.premultipliedAlpha,doubleSided:N.side===ba,flipSided:N.side===Jn,useDepthPacking:N.depthPacking>=0,depthPacking:N.depthPacking||0,index0AttributeName:N.index0AttributeName,extensionClipCullDistance:te&&N.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(te&&N.extensions.multiDraw===!0||Et)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:N.customProgramCacheKey()};return je.vertexUv1s=p.has(1),je.vertexUv2s=p.has(2),je.vertexUv3s=p.has(3),p.clear(),je}function v(N){const D=[];if(N.shaderID?D.push(N.shaderID):(D.push(N.customVertexShaderID),D.push(N.customFragmentShaderID)),N.defines!==void 0)for(const X in N.defines)D.push(X),D.push(N.defines[X]);return N.isRawShaderMaterial===!1&&(P(D,N),O(D,N),D.push(o.outputColorSpace)),D.push(N.customProgramCacheKey),D.join()}function P(N,D){N.push(D.precision),N.push(D.outputColorSpace),N.push(D.envMapMode),N.push(D.envMapCubeUVHeight),N.push(D.mapUv),N.push(D.alphaMapUv),N.push(D.lightMapUv),N.push(D.aoMapUv),N.push(D.bumpMapUv),N.push(D.normalMapUv),N.push(D.displacementMapUv),N.push(D.emissiveMapUv),N.push(D.metalnessMapUv),N.push(D.roughnessMapUv),N.push(D.anisotropyMapUv),N.push(D.clearcoatMapUv),N.push(D.clearcoatNormalMapUv),N.push(D.clearcoatRoughnessMapUv),N.push(D.iridescenceMapUv),N.push(D.iridescenceThicknessMapUv),N.push(D.sheenColorMapUv),N.push(D.sheenRoughnessMapUv),N.push(D.specularMapUv),N.push(D.specularColorMapUv),N.push(D.specularIntensityMapUv),N.push(D.transmissionMapUv),N.push(D.thicknessMapUv),N.push(D.combine),N.push(D.fogExp2),N.push(D.sizeAttenuation),N.push(D.morphTargetsCount),N.push(D.morphAttributeCount),N.push(D.numDirLights),N.push(D.numPointLights),N.push(D.numSpotLights),N.push(D.numSpotLightMaps),N.push(D.numHemiLights),N.push(D.numRectAreaLights),N.push(D.numDirLightShadows),N.push(D.numPointLightShadows),N.push(D.numSpotLightShadows),N.push(D.numSpotLightShadowsWithMaps),N.push(D.numLightProbes),N.push(D.shadowMapType),N.push(D.toneMapping),N.push(D.numClippingPlanes),N.push(D.numClipIntersection),N.push(D.depthPacking)}function O(N,D){d.disableAll(),D.supportsVertexTextures&&d.enable(0),D.instancing&&d.enable(1),D.instancingColor&&d.enable(2),D.instancingMorph&&d.enable(3),D.matcap&&d.enable(4),D.envMap&&d.enable(5),D.normalMapObjectSpace&&d.enable(6),D.normalMapTangentSpace&&d.enable(7),D.clearcoat&&d.enable(8),D.iridescence&&d.enable(9),D.alphaTest&&d.enable(10),D.vertexColors&&d.enable(11),D.vertexAlphas&&d.enable(12),D.vertexUv1s&&d.enable(13),D.vertexUv2s&&d.enable(14),D.vertexUv3s&&d.enable(15),D.vertexTangents&&d.enable(16),D.anisotropy&&d.enable(17),D.alphaHash&&d.enable(18),D.batching&&d.enable(19),D.dispersion&&d.enable(20),D.batchingColor&&d.enable(21),D.gradientMap&&d.enable(22),N.push(d.mask),d.disableAll(),D.fog&&d.enable(0),D.useFog&&d.enable(1),D.flatShading&&d.enable(2),D.logarithmicDepthBuffer&&d.enable(3),D.reversedDepthBuffer&&d.enable(4),D.skinning&&d.enable(5),D.morphTargets&&d.enable(6),D.morphNormals&&d.enable(7),D.morphColors&&d.enable(8),D.premultipliedAlpha&&d.enable(9),D.shadowMapEnabled&&d.enable(10),D.doubleSided&&d.enable(11),D.flipSided&&d.enable(12),D.useDepthPacking&&d.enable(13),D.dithering&&d.enable(14),D.transmission&&d.enable(15),D.sheen&&d.enable(16),D.opaque&&d.enable(17),D.pointsUvs&&d.enable(18),D.decodeVideoTexture&&d.enable(19),D.decodeVideoTextureEmissive&&d.enable(20),D.alphaToCoverage&&d.enable(21),N.push(d.mask)}function L(N){const D=E[N.type];let X;if(D){const lt=Ki[D];X=u1.clone(lt.uniforms)}else X=N.uniforms;return X}function V(N,D){let X;for(let lt=0,gt=x.length;lt<gt;lt++){const Mt=x[lt];if(Mt.cacheKey===D){X=Mt,++X.usedTimes;break}}return X===void 0&&(X=new BR(o,D,N,f),x.push(X)),X}function H(N){if(--N.usedTimes===0){const D=x.indexOf(N);x[D]=x[x.length-1],x.pop(),N.destroy()}}function B(N){g.remove(N)}function q(){g.dispose()}return{getParameters:S,getProgramCacheKey:v,getUniforms:L,acquireProgram:V,releaseProgram:H,releaseShaderCache:B,programs:x,dispose:q}}function kR(){let o=new WeakMap;function e(h){return o.has(h)}function i(h){let d=o.get(h);return d===void 0&&(d={},o.set(h,d)),d}function r(h){o.delete(h)}function l(h,d,g){o.get(h)[d]=g}function f(){o=new WeakMap}return{has:e,get:i,remove:r,update:l,dispose:f}}function jR(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.material.id!==e.material.id?o.material.id-e.material.id:o.z!==e.z?o.z-e.z:o.id-e.id}function Sx(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.z!==e.z?e.z-o.z:o.id-e.id}function Mx(){const o=[];let e=0;const i=[],r=[],l=[];function f(){e=0,i.length=0,r.length=0,l.length=0}function h(m,y,M,E,A,S){let v=o[e];return v===void 0?(v={id:m.id,object:m,geometry:y,material:M,groupOrder:E,renderOrder:m.renderOrder,z:A,group:S},o[e]=v):(v.id=m.id,v.object=m,v.geometry=y,v.material=M,v.groupOrder=E,v.renderOrder=m.renderOrder,v.z=A,v.group=S),e++,v}function d(m,y,M,E,A,S){const v=h(m,y,M,E,A,S);M.transmission>0?r.push(v):M.transparent===!0?l.push(v):i.push(v)}function g(m,y,M,E,A,S){const v=h(m,y,M,E,A,S);M.transmission>0?r.unshift(v):M.transparent===!0?l.unshift(v):i.unshift(v)}function p(m,y){i.length>1&&i.sort(m||jR),r.length>1&&r.sort(y||Sx),l.length>1&&l.sort(y||Sx)}function x(){for(let m=e,y=o.length;m<y;m++){const M=o[m];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:i,transmissive:r,transparent:l,init:f,push:d,unshift:g,finish:x,sort:p}}function XR(){let o=new WeakMap;function e(r,l){const f=o.get(r);let h;return f===void 0?(h=new Mx,o.set(r,[h])):l>=f.length?(h=new Mx,f.push(h)):h=f[l],h}function i(){o=new WeakMap}return{get:e,dispose:i}}function YR(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={direction:new st,color:new be};break;case"SpotLight":i={position:new st,direction:new st,color:new be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new st,color:new be,distance:0,decay:0};break;case"HemisphereLight":i={direction:new st,skyColor:new be,groundColor:new be};break;case"RectAreaLight":i={color:new be,position:new st,halfWidth:new st,halfHeight:new st};break}return o[e.id]=i,i}}}function qR(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[e.id]=i,i}}}let WR=0;function ZR(o,e){return(e.castShadow?2:0)-(o.castShadow?2:0)+(e.map?1:0)-(o.map?1:0)}function KR(o){const e=new YR,i=qR(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)r.probe.push(new st);const l=new st,f=new an,h=new an;function d(p){let x=0,m=0,y=0;for(let N=0;N<9;N++)r.probe[N].set(0,0,0);let M=0,E=0,A=0,S=0,v=0,P=0,O=0,L=0,V=0,H=0,B=0;p.sort(ZR);for(let N=0,D=p.length;N<D;N++){const X=p[N],lt=X.color,gt=X.intensity,Mt=X.distance,mt=X.shadow&&X.shadow.map?X.shadow.map.texture:null;if(X.isAmbientLight)x+=lt.r*gt,m+=lt.g*gt,y+=lt.b*gt;else if(X.isLightProbe){for(let Z=0;Z<9;Z++)r.probe[Z].addScaledVector(X.sh.coefficients[Z],gt);B++}else if(X.isDirectionalLight){const Z=e.get(X);if(Z.color.copy(X.color).multiplyScalar(X.intensity),X.castShadow){const ct=X.shadow,Q=i.get(X);Q.shadowIntensity=ct.intensity,Q.shadowBias=ct.bias,Q.shadowNormalBias=ct.normalBias,Q.shadowRadius=ct.radius,Q.shadowMapSize=ct.mapSize,r.directionalShadow[M]=Q,r.directionalShadowMap[M]=mt,r.directionalShadowMatrix[M]=X.shadow.matrix,P++}r.directional[M]=Z,M++}else if(X.isSpotLight){const Z=e.get(X);Z.position.setFromMatrixPosition(X.matrixWorld),Z.color.copy(lt).multiplyScalar(gt),Z.distance=Mt,Z.coneCos=Math.cos(X.angle),Z.penumbraCos=Math.cos(X.angle*(1-X.penumbra)),Z.decay=X.decay,r.spot[A]=Z;const ct=X.shadow;if(X.map&&(r.spotLightMap[V]=X.map,V++,ct.updateMatrices(X),X.castShadow&&H++),r.spotLightMatrix[A]=ct.matrix,X.castShadow){const Q=i.get(X);Q.shadowIntensity=ct.intensity,Q.shadowBias=ct.bias,Q.shadowNormalBias=ct.normalBias,Q.shadowRadius=ct.radius,Q.shadowMapSize=ct.mapSize,r.spotShadow[A]=Q,r.spotShadowMap[A]=mt,L++}A++}else if(X.isRectAreaLight){const Z=e.get(X);Z.color.copy(lt).multiplyScalar(gt),Z.halfWidth.set(X.width*.5,0,0),Z.halfHeight.set(0,X.height*.5,0),r.rectArea[S]=Z,S++}else if(X.isPointLight){const Z=e.get(X);if(Z.color.copy(X.color).multiplyScalar(X.intensity),Z.distance=X.distance,Z.decay=X.decay,X.castShadow){const ct=X.shadow,Q=i.get(X);Q.shadowIntensity=ct.intensity,Q.shadowBias=ct.bias,Q.shadowNormalBias=ct.normalBias,Q.shadowRadius=ct.radius,Q.shadowMapSize=ct.mapSize,Q.shadowCameraNear=ct.camera.near,Q.shadowCameraFar=ct.camera.far,r.pointShadow[E]=Q,r.pointShadowMap[E]=mt,r.pointShadowMatrix[E]=X.shadow.matrix,O++}r.point[E]=Z,E++}else if(X.isHemisphereLight){const Z=e.get(X);Z.skyColor.copy(X.color).multiplyScalar(gt),Z.groundColor.copy(X.groundColor).multiplyScalar(gt),r.hemi[v]=Z,v++}}S>0&&(o.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=jt.LTC_FLOAT_1,r.rectAreaLTC2=jt.LTC_FLOAT_2):(r.rectAreaLTC1=jt.LTC_HALF_1,r.rectAreaLTC2=jt.LTC_HALF_2)),r.ambient[0]=x,r.ambient[1]=m,r.ambient[2]=y;const q=r.hash;(q.directionalLength!==M||q.pointLength!==E||q.spotLength!==A||q.rectAreaLength!==S||q.hemiLength!==v||q.numDirectionalShadows!==P||q.numPointShadows!==O||q.numSpotShadows!==L||q.numSpotMaps!==V||q.numLightProbes!==B)&&(r.directional.length=M,r.spot.length=A,r.rectArea.length=S,r.point.length=E,r.hemi.length=v,r.directionalShadow.length=P,r.directionalShadowMap.length=P,r.pointShadow.length=O,r.pointShadowMap.length=O,r.spotShadow.length=L,r.spotShadowMap.length=L,r.directionalShadowMatrix.length=P,r.pointShadowMatrix.length=O,r.spotLightMatrix.length=L+V-H,r.spotLightMap.length=V,r.numSpotLightShadowsWithMaps=H,r.numLightProbes=B,q.directionalLength=M,q.pointLength=E,q.spotLength=A,q.rectAreaLength=S,q.hemiLength=v,q.numDirectionalShadows=P,q.numPointShadows=O,q.numSpotShadows=L,q.numSpotMaps=V,q.numLightProbes=B,r.version=WR++)}function g(p,x){let m=0,y=0,M=0,E=0,A=0;const S=x.matrixWorldInverse;for(let v=0,P=p.length;v<P;v++){const O=p[v];if(O.isDirectionalLight){const L=r.directional[m];L.direction.setFromMatrixPosition(O.matrixWorld),l.setFromMatrixPosition(O.target.matrixWorld),L.direction.sub(l),L.direction.transformDirection(S),m++}else if(O.isSpotLight){const L=r.spot[M];L.position.setFromMatrixPosition(O.matrixWorld),L.position.applyMatrix4(S),L.direction.setFromMatrixPosition(O.matrixWorld),l.setFromMatrixPosition(O.target.matrixWorld),L.direction.sub(l),L.direction.transformDirection(S),M++}else if(O.isRectAreaLight){const L=r.rectArea[E];L.position.setFromMatrixPosition(O.matrixWorld),L.position.applyMatrix4(S),h.identity(),f.copy(O.matrixWorld),f.premultiply(S),h.extractRotation(f),L.halfWidth.set(O.width*.5,0,0),L.halfHeight.set(0,O.height*.5,0),L.halfWidth.applyMatrix4(h),L.halfHeight.applyMatrix4(h),E++}else if(O.isPointLight){const L=r.point[y];L.position.setFromMatrixPosition(O.matrixWorld),L.position.applyMatrix4(S),y++}else if(O.isHemisphereLight){const L=r.hemi[A];L.direction.setFromMatrixPosition(O.matrixWorld),L.direction.transformDirection(S),A++}}}return{setup:d,setupView:g,state:r}}function Ex(o){const e=new KR(o),i=[],r=[];function l(x){p.camera=x,i.length=0,r.length=0}function f(x){i.push(x)}function h(x){r.push(x)}function d(){e.setup(i)}function g(x){e.setupView(i,x)}const p={lightsArray:i,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:l,state:p,setupLights:d,setupLightsView:g,pushLight:f,pushShadow:h}}function QR(o){let e=new WeakMap;function i(l,f=0){const h=e.get(l);let d;return h===void 0?(d=new Ex(o),e.set(l,[d])):f>=h.length?(d=new Ex(o),h.push(d)):d=h[f],d}function r(){e=new WeakMap}return{get:i,dispose:r}}const JR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$R=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function tC(o,e,i){let r=new Qp;const l=new pe,f=new pe,h=new ln,d=new S1({depthPacking:Lb}),g=new M1,p={},x=i.maxTextureSize,m={[fs]:Jn,[Jn]:fs,[ba]:ba},y=new hs({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pe},radius:{value:4}},vertexShader:JR,fragmentShader:$R}),M=y.clone();M.defines.HORIZONTAL_PASS=1;const E=new Ii;E.setAttribute("position",new $i(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const A=new Pi(E,y),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=iy;let v=this.type;this.render=function(H,B,q){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||H.length===0)return;const N=o.getRenderTarget(),D=o.getActiveCubeFace(),X=o.getActiveMipmapLevel(),lt=o.state;lt.setBlending(cs),lt.buffers.depth.getReversed()===!0?lt.buffers.color.setClear(0,0,0,0):lt.buffers.color.setClear(1,1,1,1),lt.buffers.depth.setTest(!0),lt.setScissorTest(!1);const gt=v!==Ea&&this.type===Ea,Mt=v===Ea&&this.type!==Ea;for(let mt=0,Z=H.length;mt<Z;mt++){const ct=H[mt],Q=ct.shadow;if(Q===void 0){console.warn("THREE.WebGLShadowMap:",ct,"has no shadow.");continue}if(Q.autoUpdate===!1&&Q.needsUpdate===!1)continue;l.copy(Q.mapSize);const Tt=Q.getFrameExtents();if(l.multiply(Tt),f.copy(Q.mapSize),(l.x>x||l.y>x)&&(l.x>x&&(f.x=Math.floor(x/Tt.x),l.x=f.x*Tt.x,Q.mapSize.x=f.x),l.y>x&&(f.y=Math.floor(x/Tt.y),l.y=f.y*Tt.y,Q.mapSize.y=f.y)),Q.map===null||gt===!0||Mt===!0){const Yt=this.type!==Ea?{minFilter:zi,magFilter:zi}:{};Q.map!==null&&Q.map.dispose(),Q.map=new Qs(l.x,l.y,Yt),Q.map.texture.name=ct.name+".shadowMap",Q.camera.updateProjectionMatrix()}o.setRenderTarget(Q.map),o.clear();const At=Q.getViewportCount();for(let Yt=0;Yt<At;Yt++){const oe=Q.getViewport(Yt);h.set(f.x*oe.x,f.y*oe.y,f.x*oe.z,f.y*oe.w),lt.viewport(h),Q.updateMatrices(ct,Yt),r=Q.getFrustum(),L(B,q,Q.camera,ct,this.type)}Q.isPointLightShadow!==!0&&this.type===Ea&&P(Q,q),Q.needsUpdate=!1}v=this.type,S.needsUpdate=!1,o.setRenderTarget(N,D,X)};function P(H,B){const q=e.update(A);y.defines.VSM_SAMPLES!==H.blurSamples&&(y.defines.VSM_SAMPLES=H.blurSamples,M.defines.VSM_SAMPLES=H.blurSamples,y.needsUpdate=!0,M.needsUpdate=!0),H.mapPass===null&&(H.mapPass=new Qs(l.x,l.y)),y.uniforms.shadow_pass.value=H.map.texture,y.uniforms.resolution.value=H.mapSize,y.uniforms.radius.value=H.radius,o.setRenderTarget(H.mapPass),o.clear(),o.renderBufferDirect(B,null,q,y,A,null),M.uniforms.shadow_pass.value=H.mapPass.texture,M.uniforms.resolution.value=H.mapSize,M.uniforms.radius.value=H.radius,o.setRenderTarget(H.map),o.clear(),o.renderBufferDirect(B,null,q,M,A,null)}function O(H,B,q,N){let D=null;const X=q.isPointLight===!0?H.customDistanceMaterial:H.customDepthMaterial;if(X!==void 0)D=X;else if(D=q.isPointLight===!0?g:d,o.localClippingEnabled&&B.clipShadows===!0&&Array.isArray(B.clippingPlanes)&&B.clippingPlanes.length!==0||B.displacementMap&&B.displacementScale!==0||B.alphaMap&&B.alphaTest>0||B.map&&B.alphaTest>0||B.alphaToCoverage===!0){const lt=D.uuid,gt=B.uuid;let Mt=p[lt];Mt===void 0&&(Mt={},p[lt]=Mt);let mt=Mt[gt];mt===void 0&&(mt=D.clone(),Mt[gt]=mt,B.addEventListener("dispose",V)),D=mt}if(D.visible=B.visible,D.wireframe=B.wireframe,N===Ea?D.side=B.shadowSide!==null?B.shadowSide:B.side:D.side=B.shadowSide!==null?B.shadowSide:m[B.side],D.alphaMap=B.alphaMap,D.alphaTest=B.alphaToCoverage===!0?.5:B.alphaTest,D.map=B.map,D.clipShadows=B.clipShadows,D.clippingPlanes=B.clippingPlanes,D.clipIntersection=B.clipIntersection,D.displacementMap=B.displacementMap,D.displacementScale=B.displacementScale,D.displacementBias=B.displacementBias,D.wireframeLinewidth=B.wireframeLinewidth,D.linewidth=B.linewidth,q.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const lt=o.properties.get(D);lt.light=q}return D}function L(H,B,q,N,D){if(H.visible===!1)return;if(H.layers.test(B.layers)&&(H.isMesh||H.isLine||H.isPoints)&&(H.castShadow||H.receiveShadow&&D===Ea)&&(!H.frustumCulled||r.intersectsObject(H))){H.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,H.matrixWorld);const gt=e.update(H),Mt=H.material;if(Array.isArray(Mt)){const mt=gt.groups;for(let Z=0,ct=mt.length;Z<ct;Z++){const Q=mt[Z],Tt=Mt[Q.materialIndex];if(Tt&&Tt.visible){const At=O(H,Tt,N,D);H.onBeforeShadow(o,H,B,q,gt,At,Q),o.renderBufferDirect(q,null,gt,At,H,Q),H.onAfterShadow(o,H,B,q,gt,At,Q)}}}else if(Mt.visible){const mt=O(H,Mt,N,D);H.onBeforeShadow(o,H,B,q,gt,mt,null),o.renderBufferDirect(q,null,gt,mt,H,null),H.onAfterShadow(o,H,B,q,gt,mt,null)}}const lt=H.children;for(let gt=0,Mt=lt.length;gt<Mt;gt++)L(lt[gt],B,q,N,D)}function V(H){H.target.removeEventListener("dispose",V);for(const q in p){const N=p[q],D=H.target.uuid;D in N&&(N[D].dispose(),delete N[D])}}}const eC={[Qd]:Jd,[$d]:np,[tp]:ip,[so]:ep,[Jd]:Qd,[np]:$d,[ip]:tp,[ep]:so};function nC(o,e){function i(){let j=!1;const Lt=new ln;let zt=null;const Qt=new ln(0,0,0,0);return{setMask:function(wt){zt!==wt&&!j&&(o.colorMask(wt,wt,wt,wt),zt=wt)},setLocked:function(wt){j=wt},setClear:function(wt,bt,te,de,je){je===!0&&(wt*=de,bt*=de,te*=de),Lt.set(wt,bt,te,de),Qt.equals(Lt)===!1&&(o.clearColor(wt,bt,te,de),Qt.copy(Lt))},reset:function(){j=!1,zt=null,Qt.set(-1,0,0,0)}}}function r(){let j=!1,Lt=!1,zt=null,Qt=null,wt=null;return{setReversed:function(bt){if(Lt!==bt){const te=e.get("EXT_clip_control");bt?te.clipControlEXT(te.LOWER_LEFT_EXT,te.ZERO_TO_ONE_EXT):te.clipControlEXT(te.LOWER_LEFT_EXT,te.NEGATIVE_ONE_TO_ONE_EXT),Lt=bt;const de=wt;wt=null,this.setClear(de)}},getReversed:function(){return Lt},setTest:function(bt){bt?F(o.DEPTH_TEST):pt(o.DEPTH_TEST)},setMask:function(bt){zt!==bt&&!j&&(o.depthMask(bt),zt=bt)},setFunc:function(bt){if(Lt&&(bt=eC[bt]),Qt!==bt){switch(bt){case Qd:o.depthFunc(o.NEVER);break;case Jd:o.depthFunc(o.ALWAYS);break;case $d:o.depthFunc(o.LESS);break;case so:o.depthFunc(o.LEQUAL);break;case tp:o.depthFunc(o.EQUAL);break;case ep:o.depthFunc(o.GEQUAL);break;case np:o.depthFunc(o.GREATER);break;case ip:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}Qt=bt}},setLocked:function(bt){j=bt},setClear:function(bt){wt!==bt&&(Lt&&(bt=1-bt),o.clearDepth(bt),wt=bt)},reset:function(){j=!1,zt=null,Qt=null,wt=null,Lt=!1}}}function l(){let j=!1,Lt=null,zt=null,Qt=null,wt=null,bt=null,te=null,de=null,je=null;return{setTest:function(Ce){j||(Ce?F(o.STENCIL_TEST):pt(o.STENCIL_TEST))},setMask:function(Ce){Lt!==Ce&&!j&&(o.stencilMask(Ce),Lt=Ce)},setFunc:function(Ce,en,gn){(zt!==Ce||Qt!==en||wt!==gn)&&(o.stencilFunc(Ce,en,gn),zt=Ce,Qt=en,wt=gn)},setOp:function(Ce,en,gn){(bt!==Ce||te!==en||de!==gn)&&(o.stencilOp(Ce,en,gn),bt=Ce,te=en,de=gn)},setLocked:function(Ce){j=Ce},setClear:function(Ce){je!==Ce&&(o.clearStencil(Ce),je=Ce)},reset:function(){j=!1,Lt=null,zt=null,Qt=null,wt=null,bt=null,te=null,de=null,je=null}}}const f=new i,h=new r,d=new l,g=new WeakMap,p=new WeakMap;let x={},m={},y=new WeakMap,M=[],E=null,A=!1,S=null,v=null,P=null,O=null,L=null,V=null,H=null,B=new be(0,0,0),q=0,N=!1,D=null,X=null,lt=null,gt=null,Mt=null;const mt=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,ct=0;const Q=o.getParameter(o.VERSION);Q.indexOf("WebGL")!==-1?(ct=parseFloat(/^WebGL (\d)/.exec(Q)[1]),Z=ct>=1):Q.indexOf("OpenGL ES")!==-1&&(ct=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),Z=ct>=2);let Tt=null,At={};const Yt=o.getParameter(o.SCISSOR_BOX),oe=o.getParameter(o.VIEWPORT),Ct=new ln().fromArray(Yt),U=new ln().fromArray(oe);function tt(j,Lt,zt,Qt){const wt=new Uint8Array(4),bt=o.createTexture();o.bindTexture(j,bt),o.texParameteri(j,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(j,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let te=0;te<zt;te++)j===o.TEXTURE_3D||j===o.TEXTURE_2D_ARRAY?o.texImage3D(Lt,0,o.RGBA,1,1,Qt,0,o.RGBA,o.UNSIGNED_BYTE,wt):o.texImage2D(Lt+te,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,wt);return bt}const G={};G[o.TEXTURE_2D]=tt(o.TEXTURE_2D,o.TEXTURE_2D,1),G[o.TEXTURE_CUBE_MAP]=tt(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),G[o.TEXTURE_2D_ARRAY]=tt(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),G[o.TEXTURE_3D]=tt(o.TEXTURE_3D,o.TEXTURE_3D,1,1),f.setClear(0,0,0,1),h.setClear(1),d.setClear(0),F(o.DEPTH_TEST),h.setFunc(so),Nt(!1),yt(_v),F(o.CULL_FACE),ne(cs);function F(j){x[j]!==!0&&(o.enable(j),x[j]=!0)}function pt(j){x[j]!==!1&&(o.disable(j),x[j]=!1)}function St(j,Lt){return m[j]!==Lt?(o.bindFramebuffer(j,Lt),m[j]=Lt,j===o.DRAW_FRAMEBUFFER&&(m[o.FRAMEBUFFER]=Lt),j===o.FRAMEBUFFER&&(m[o.DRAW_FRAMEBUFFER]=Lt),!0):!1}function Et(j,Lt){let zt=M,Qt=!1;if(j){zt=y.get(Lt),zt===void 0&&(zt=[],y.set(Lt,zt));const wt=j.textures;if(zt.length!==wt.length||zt[0]!==o.COLOR_ATTACHMENT0){for(let bt=0,te=wt.length;bt<te;bt++)zt[bt]=o.COLOR_ATTACHMENT0+bt;zt.length=wt.length,Qt=!0}}else zt[0]!==o.BACK&&(zt[0]=o.BACK,Qt=!0);Qt&&o.drawBuffers(zt)}function ut(j){return E!==j?(o.useProgram(j),E=j,!0):!1}const Ot={[Xs]:o.FUNC_ADD,[sb]:o.FUNC_SUBTRACT,[rb]:o.FUNC_REVERSE_SUBTRACT};Ot[ob]=o.MIN,Ot[lb]=o.MAX;const z={[cb]:o.ZERO,[ub]:o.ONE,[fb]:o.SRC_COLOR,[Zd]:o.SRC_ALPHA,[_b]:o.SRC_ALPHA_SATURATE,[mb]:o.DST_COLOR,[db]:o.DST_ALPHA,[hb]:o.ONE_MINUS_SRC_COLOR,[Kd]:o.ONE_MINUS_SRC_ALPHA,[gb]:o.ONE_MINUS_DST_COLOR,[pb]:o.ONE_MINUS_DST_ALPHA,[vb]:o.CONSTANT_COLOR,[xb]:o.ONE_MINUS_CONSTANT_COLOR,[yb]:o.CONSTANT_ALPHA,[Sb]:o.ONE_MINUS_CONSTANT_ALPHA};function ne(j,Lt,zt,Qt,wt,bt,te,de,je,Ce){if(j===cs){A===!0&&(pt(o.BLEND),A=!1);return}if(A===!1&&(F(o.BLEND),A=!0),j!==ab){if(j!==S||Ce!==N){if((v!==Xs||L!==Xs)&&(o.blendEquation(o.FUNC_ADD),v=Xs,L=Xs),Ce)switch(j){case io:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case vv:o.blendFunc(o.ONE,o.ONE);break;case xv:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case yv:o.blendFuncSeparate(o.DST_COLOR,o.ONE_MINUS_SRC_ALPHA,o.ZERO,o.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}else switch(j){case io:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case vv:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE,o.ONE,o.ONE);break;case xv:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case yv:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",j);break}P=null,O=null,V=null,H=null,B.set(0,0,0),q=0,S=j,N=Ce}return}wt=wt||Lt,bt=bt||zt,te=te||Qt,(Lt!==v||wt!==L)&&(o.blendEquationSeparate(Ot[Lt],Ot[wt]),v=Lt,L=wt),(zt!==P||Qt!==O||bt!==V||te!==H)&&(o.blendFuncSeparate(z[zt],z[Qt],z[bt],z[te]),P=zt,O=Qt,V=bt,H=te),(de.equals(B)===!1||je!==q)&&(o.blendColor(de.r,de.g,de.b,je),B.copy(de),q=je),S=j,N=!1}function qt(j,Lt){j.side===ba?pt(o.CULL_FACE):F(o.CULL_FACE);let zt=j.side===Jn;Lt&&(zt=!zt),Nt(zt),j.blending===io&&j.transparent===!1?ne(cs):ne(j.blending,j.blendEquation,j.blendSrc,j.blendDst,j.blendEquationAlpha,j.blendSrcAlpha,j.blendDstAlpha,j.blendColor,j.blendAlpha,j.premultipliedAlpha),h.setFunc(j.depthFunc),h.setTest(j.depthTest),h.setMask(j.depthWrite),f.setMask(j.colorWrite);const Qt=j.stencilWrite;d.setTest(Qt),Qt&&(d.setMask(j.stencilWriteMask),d.setFunc(j.stencilFunc,j.stencilRef,j.stencilFuncMask),d.setOp(j.stencilFail,j.stencilZFail,j.stencilZPass)),Rt(j.polygonOffset,j.polygonOffsetFactor,j.polygonOffsetUnits),j.alphaToCoverage===!0?F(o.SAMPLE_ALPHA_TO_COVERAGE):pt(o.SAMPLE_ALPHA_TO_COVERAGE)}function Nt(j){D!==j&&(j?o.frontFace(o.CW):o.frontFace(o.CCW),D=j)}function yt(j){j!==eb?(F(o.CULL_FACE),j!==X&&(j===_v?o.cullFace(o.BACK):j===nb?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):pt(o.CULL_FACE),X=j}function It(j){j!==lt&&(Z&&o.lineWidth(j),lt=j)}function Rt(j,Lt,zt){j?(F(o.POLYGON_OFFSET_FILL),(gt!==Lt||Mt!==zt)&&(o.polygonOffset(Lt,zt),gt=Lt,Mt=zt)):pt(o.POLYGON_OFFSET_FILL)}function Zt(j){j?F(o.SCISSOR_TEST):pt(o.SCISSOR_TEST)}function me(j){j===void 0&&(j=o.TEXTURE0+mt-1),Tt!==j&&(o.activeTexture(j),Tt=j)}function he(j,Lt,zt){zt===void 0&&(Tt===null?zt=o.TEXTURE0+mt-1:zt=Tt);let Qt=At[zt];Qt===void 0&&(Qt={type:void 0,texture:void 0},At[zt]=Qt),(Qt.type!==j||Qt.texture!==Lt)&&(Tt!==zt&&(o.activeTexture(zt),Tt=zt),o.bindTexture(j,Lt||G[j]),Qt.type=j,Qt.texture=Lt)}function w(){const j=At[Tt];j!==void 0&&j.type!==void 0&&(o.bindTexture(j.type,null),j.type=void 0,j.texture=void 0)}function b(){try{o.compressedTexImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Y(){try{o.compressedTexImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function $(){try{o.texSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ht(){try{o.texSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ot(){try{o.compressedTexSubImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Ht(){try{o.compressedTexSubImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function _t(){try{o.texStorage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Xt(){try{o.texStorage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function ee(){try{o.texImage2D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Dt(){try{o.texImage3D(...arguments)}catch(j){console.error("THREE.WebGLState:",j)}}function Gt(j){Ct.equals(j)===!1&&(o.scissor(j.x,j.y,j.z,j.w),Ct.copy(j))}function ce(j){U.equals(j)===!1&&(o.viewport(j.x,j.y,j.z,j.w),U.copy(j))}function ie(j,Lt){let zt=p.get(Lt);zt===void 0&&(zt=new WeakMap,p.set(Lt,zt));let Qt=zt.get(j);Qt===void 0&&(Qt=o.getUniformBlockIndex(Lt,j.name),zt.set(j,Qt))}function Vt(j,Lt){const Qt=p.get(Lt).get(j);g.get(Lt)!==Qt&&(o.uniformBlockBinding(Lt,Qt,j.__bindingPointIndex),g.set(Lt,Qt))}function ge(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),h.setReversed(!1),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),x={},Tt=null,At={},m={},y=new WeakMap,M=[],E=null,A=!1,S=null,v=null,P=null,O=null,L=null,V=null,H=null,B=new be(0,0,0),q=0,N=!1,D=null,X=null,lt=null,gt=null,Mt=null,Ct.set(0,0,o.canvas.width,o.canvas.height),U.set(0,0,o.canvas.width,o.canvas.height),f.reset(),h.reset(),d.reset()}return{buffers:{color:f,depth:h,stencil:d},enable:F,disable:pt,bindFramebuffer:St,drawBuffers:Et,useProgram:ut,setBlending:ne,setMaterial:qt,setFlipSided:Nt,setCullFace:yt,setLineWidth:It,setPolygonOffset:Rt,setScissorTest:Zt,activeTexture:me,bindTexture:he,unbindTexture:w,compressedTexImage2D:b,compressedTexImage3D:Y,texImage2D:ee,texImage3D:Dt,updateUBOMapping:ie,uniformBlockBinding:Vt,texStorage2D:_t,texStorage3D:Xt,texSubImage2D:$,texSubImage3D:ht,compressedTexSubImage2D:ot,compressedTexSubImage3D:Ht,scissor:Gt,viewport:ce,reset:ge}}function iC(o,e,i,r,l,f,h){const d=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,g=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new pe,x=new WeakMap;let m;const y=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(w,b){return M?new OffscreenCanvas(w,b):Tu("canvas")}function A(w,b,Y){let $=1;const ht=he(w);if((ht.width>Y||ht.height>Y)&&($=Y/Math.max(ht.width,ht.height)),$<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ot=Math.floor($*ht.width),Ht=Math.floor($*ht.height);m===void 0&&(m=E(ot,Ht));const _t=b?E(ot,Ht):m;return _t.width=ot,_t.height=Ht,_t.getContext("2d").drawImage(w,0,0,ot,Ht),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ht.width+"x"+ht.height+") to ("+ot+"x"+Ht+")."),_t}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ht.width+"x"+ht.height+")."),w;return w}function S(w){return w.generateMipmaps}function v(w){o.generateMipmap(w)}function P(w){return w.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?o.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?o.TEXTURE_2D_ARRAY:o.TEXTURE_2D}function O(w,b,Y,$,ht=!1){if(w!==null){if(o[w]!==void 0)return o[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ot=b;if(b===o.RED&&(Y===o.FLOAT&&(ot=o.R32F),Y===o.HALF_FLOAT&&(ot=o.R16F),Y===o.UNSIGNED_BYTE&&(ot=o.R8)),b===o.RED_INTEGER&&(Y===o.UNSIGNED_BYTE&&(ot=o.R8UI),Y===o.UNSIGNED_SHORT&&(ot=o.R16UI),Y===o.UNSIGNED_INT&&(ot=o.R32UI),Y===o.BYTE&&(ot=o.R8I),Y===o.SHORT&&(ot=o.R16I),Y===o.INT&&(ot=o.R32I)),b===o.RG&&(Y===o.FLOAT&&(ot=o.RG32F),Y===o.HALF_FLOAT&&(ot=o.RG16F),Y===o.UNSIGNED_BYTE&&(ot=o.RG8)),b===o.RG_INTEGER&&(Y===o.UNSIGNED_BYTE&&(ot=o.RG8UI),Y===o.UNSIGNED_SHORT&&(ot=o.RG16UI),Y===o.UNSIGNED_INT&&(ot=o.RG32UI),Y===o.BYTE&&(ot=o.RG8I),Y===o.SHORT&&(ot=o.RG16I),Y===o.INT&&(ot=o.RG32I)),b===o.RGB_INTEGER&&(Y===o.UNSIGNED_BYTE&&(ot=o.RGB8UI),Y===o.UNSIGNED_SHORT&&(ot=o.RGB16UI),Y===o.UNSIGNED_INT&&(ot=o.RGB32UI),Y===o.BYTE&&(ot=o.RGB8I),Y===o.SHORT&&(ot=o.RGB16I),Y===o.INT&&(ot=o.RGB32I)),b===o.RGBA_INTEGER&&(Y===o.UNSIGNED_BYTE&&(ot=o.RGBA8UI),Y===o.UNSIGNED_SHORT&&(ot=o.RGBA16UI),Y===o.UNSIGNED_INT&&(ot=o.RGBA32UI),Y===o.BYTE&&(ot=o.RGBA8I),Y===o.SHORT&&(ot=o.RGBA16I),Y===o.INT&&(ot=o.RGBA32I)),b===o.RGB&&(Y===o.UNSIGNED_INT_5_9_9_9_REV&&(ot=o.RGB9_E5),Y===o.UNSIGNED_INT_10F_11F_11F_REV&&(ot=o.R11F_G11F_B10F)),b===o.RGBA){const Ht=ht?Eu:Pe.getTransfer($);Y===o.FLOAT&&(ot=o.RGBA32F),Y===o.HALF_FLOAT&&(ot=o.RGBA16F),Y===o.UNSIGNED_BYTE&&(ot=Ht===Ye?o.SRGB8_ALPHA8:o.RGBA8),Y===o.UNSIGNED_SHORT_4_4_4_4&&(ot=o.RGBA4),Y===o.UNSIGNED_SHORT_5_5_5_1&&(ot=o.RGB5_A1)}return(ot===o.R16F||ot===o.R32F||ot===o.RG16F||ot===o.RG32F||ot===o.RGBA16F||ot===o.RGBA32F)&&e.get("EXT_color_buffer_float"),ot}function L(w,b){let Y;return w?b===null||b===Zs||b===pl?Y=o.DEPTH24_STENCIL8:b===Ta?Y=o.DEPTH32F_STENCIL8:b===dl&&(Y=o.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Zs||b===pl?Y=o.DEPTH_COMPONENT24:b===Ta?Y=o.DEPTH_COMPONENT32F:b===dl&&(Y=o.DEPTH_COMPONENT16),Y}function V(w,b){return S(w)===!0||w.isFramebufferTexture&&w.minFilter!==zi&&w.minFilter!==Qi?Math.log2(Math.max(b.width,b.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?b.mipmaps.length:1}function H(w){const b=w.target;b.removeEventListener("dispose",H),q(b),b.isVideoTexture&&x.delete(b)}function B(w){const b=w.target;b.removeEventListener("dispose",B),D(b)}function q(w){const b=r.get(w);if(b.__webglInit===void 0)return;const Y=w.source,$=y.get(Y);if($){const ht=$[b.__cacheKey];ht.usedTimes--,ht.usedTimes===0&&N(w),Object.keys($).length===0&&y.delete(Y)}r.remove(w)}function N(w){const b=r.get(w);o.deleteTexture(b.__webglTexture);const Y=w.source,$=y.get(Y);delete $[b.__cacheKey],h.memory.textures--}function D(w){const b=r.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),r.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(b.__webglFramebuffer[$]))for(let ht=0;ht<b.__webglFramebuffer[$].length;ht++)o.deleteFramebuffer(b.__webglFramebuffer[$][ht]);else o.deleteFramebuffer(b.__webglFramebuffer[$]);b.__webglDepthbuffer&&o.deleteRenderbuffer(b.__webglDepthbuffer[$])}else{if(Array.isArray(b.__webglFramebuffer))for(let $=0;$<b.__webglFramebuffer.length;$++)o.deleteFramebuffer(b.__webglFramebuffer[$]);else o.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&o.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&o.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let $=0;$<b.__webglColorRenderbuffer.length;$++)b.__webglColorRenderbuffer[$]&&o.deleteRenderbuffer(b.__webglColorRenderbuffer[$]);b.__webglDepthRenderbuffer&&o.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const Y=w.textures;for(let $=0,ht=Y.length;$<ht;$++){const ot=r.get(Y[$]);ot.__webglTexture&&(o.deleteTexture(ot.__webglTexture),h.memory.textures--),r.remove(Y[$])}r.remove(w)}let X=0;function lt(){X=0}function gt(){const w=X;return w>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+l.maxTextures),X+=1,w}function Mt(w){const b=[];return b.push(w.wrapS),b.push(w.wrapT),b.push(w.wrapR||0),b.push(w.magFilter),b.push(w.minFilter),b.push(w.anisotropy),b.push(w.internalFormat),b.push(w.format),b.push(w.type),b.push(w.generateMipmaps),b.push(w.premultiplyAlpha),b.push(w.flipY),b.push(w.unpackAlignment),b.push(w.colorSpace),b.join()}function mt(w,b){const Y=r.get(w);if(w.isVideoTexture&&Zt(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&Y.__version!==w.version){const $=w.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{G(Y,w,b);return}}else w.isExternalTexture&&(Y.__webglTexture=w.sourceTexture?w.sourceTexture:null);i.bindTexture(o.TEXTURE_2D,Y.__webglTexture,o.TEXTURE0+b)}function Z(w,b){const Y=r.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&Y.__version!==w.version){G(Y,w,b);return}i.bindTexture(o.TEXTURE_2D_ARRAY,Y.__webglTexture,o.TEXTURE0+b)}function ct(w,b){const Y=r.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&Y.__version!==w.version){G(Y,w,b);return}i.bindTexture(o.TEXTURE_3D,Y.__webglTexture,o.TEXTURE0+b)}function Q(w,b){const Y=r.get(w);if(w.version>0&&Y.__version!==w.version){F(Y,w,b);return}i.bindTexture(o.TEXTURE_CUBE_MAP,Y.__webglTexture,o.TEXTURE0+b)}const Tt={[rp]:o.REPEAT,[qs]:o.CLAMP_TO_EDGE,[op]:o.MIRRORED_REPEAT},At={[zi]:o.NEAREST,[Nb]:o.NEAREST_MIPMAP_NEAREST,[jc]:o.NEAREST_MIPMAP_LINEAR,[Qi]:o.LINEAR,[pd]:o.LINEAR_MIPMAP_NEAREST,[Ws]:o.LINEAR_MIPMAP_LINEAR},Yt={[Pb]:o.NEVER,[Gb]:o.ALWAYS,[zb]:o.LESS,[my]:o.LEQUAL,[Ib]:o.EQUAL,[Hb]:o.GEQUAL,[Bb]:o.GREATER,[Fb]:o.NOTEQUAL};function oe(w,b){if(b.type===Ta&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Qi||b.magFilter===pd||b.magFilter===jc||b.magFilter===Ws||b.minFilter===Qi||b.minFilter===pd||b.minFilter===jc||b.minFilter===Ws)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),o.texParameteri(w,o.TEXTURE_WRAP_S,Tt[b.wrapS]),o.texParameteri(w,o.TEXTURE_WRAP_T,Tt[b.wrapT]),(w===o.TEXTURE_3D||w===o.TEXTURE_2D_ARRAY)&&o.texParameteri(w,o.TEXTURE_WRAP_R,Tt[b.wrapR]),o.texParameteri(w,o.TEXTURE_MAG_FILTER,At[b.magFilter]),o.texParameteri(w,o.TEXTURE_MIN_FILTER,At[b.minFilter]),b.compareFunction&&(o.texParameteri(w,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(w,o.TEXTURE_COMPARE_FUNC,Yt[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===zi||b.minFilter!==jc&&b.minFilter!==Ws||b.type===Ta&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||r.get(b).__currentAnisotropy){const Y=e.get("EXT_texture_filter_anisotropic");o.texParameterf(w,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,l.getMaxAnisotropy())),r.get(b).__currentAnisotropy=b.anisotropy}}}function Ct(w,b){let Y=!1;w.__webglInit===void 0&&(w.__webglInit=!0,b.addEventListener("dispose",H));const $=b.source;let ht=y.get($);ht===void 0&&(ht={},y.set($,ht));const ot=Mt(b);if(ot!==w.__cacheKey){ht[ot]===void 0&&(ht[ot]={texture:o.createTexture(),usedTimes:0},h.memory.textures++,Y=!0),ht[ot].usedTimes++;const Ht=ht[w.__cacheKey];Ht!==void 0&&(ht[w.__cacheKey].usedTimes--,Ht.usedTimes===0&&N(b)),w.__cacheKey=ot,w.__webglTexture=ht[ot].texture}return Y}function U(w,b,Y){return Math.floor(Math.floor(w/Y)/b)}function tt(w,b,Y,$){const ot=w.updateRanges;if(ot.length===0)i.texSubImage2D(o.TEXTURE_2D,0,0,0,b.width,b.height,Y,$,b.data);else{ot.sort((Dt,Gt)=>Dt.start-Gt.start);let Ht=0;for(let Dt=1;Dt<ot.length;Dt++){const Gt=ot[Ht],ce=ot[Dt],ie=Gt.start+Gt.count,Vt=U(ce.start,b.width,4),ge=U(Gt.start,b.width,4);ce.start<=ie+1&&Vt===ge&&U(ce.start+ce.count-1,b.width,4)===Vt?Gt.count=Math.max(Gt.count,ce.start+ce.count-Gt.start):(++Ht,ot[Ht]=ce)}ot.length=Ht+1;const _t=o.getParameter(o.UNPACK_ROW_LENGTH),Xt=o.getParameter(o.UNPACK_SKIP_PIXELS),ee=o.getParameter(o.UNPACK_SKIP_ROWS);o.pixelStorei(o.UNPACK_ROW_LENGTH,b.width);for(let Dt=0,Gt=ot.length;Dt<Gt;Dt++){const ce=ot[Dt],ie=Math.floor(ce.start/4),Vt=Math.ceil(ce.count/4),ge=ie%b.width,j=Math.floor(ie/b.width),Lt=Vt,zt=1;o.pixelStorei(o.UNPACK_SKIP_PIXELS,ge),o.pixelStorei(o.UNPACK_SKIP_ROWS,j),i.texSubImage2D(o.TEXTURE_2D,0,ge,j,Lt,zt,Y,$,b.data)}w.clearUpdateRanges(),o.pixelStorei(o.UNPACK_ROW_LENGTH,_t),o.pixelStorei(o.UNPACK_SKIP_PIXELS,Xt),o.pixelStorei(o.UNPACK_SKIP_ROWS,ee)}}function G(w,b,Y){let $=o.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&($=o.TEXTURE_2D_ARRAY),b.isData3DTexture&&($=o.TEXTURE_3D);const ht=Ct(w,b),ot=b.source;i.bindTexture($,w.__webglTexture,o.TEXTURE0+Y);const Ht=r.get(ot);if(ot.version!==Ht.__version||ht===!0){i.activeTexture(o.TEXTURE0+Y);const _t=Pe.getPrimaries(Pe.workingColorSpace),Xt=b.colorSpace===ls?null:Pe.getPrimaries(b.colorSpace),ee=b.colorSpace===ls||_t===Xt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,b.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,b.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);let Dt=A(b.image,!1,l.maxTextureSize);Dt=me(b,Dt);const Gt=f.convert(b.format,b.colorSpace),ce=f.convert(b.type);let ie=O(b.internalFormat,Gt,ce,b.colorSpace,b.isVideoTexture);oe($,b);let Vt;const ge=b.mipmaps,j=b.isVideoTexture!==!0,Lt=Ht.__version===void 0||ht===!0,zt=ot.dataReady,Qt=V(b,Dt);if(b.isDepthTexture)ie=L(b.format===gl,b.type),Lt&&(j?i.texStorage2D(o.TEXTURE_2D,1,ie,Dt.width,Dt.height):i.texImage2D(o.TEXTURE_2D,0,ie,Dt.width,Dt.height,0,Gt,ce,null));else if(b.isDataTexture)if(ge.length>0){j&&Lt&&i.texStorage2D(o.TEXTURE_2D,Qt,ie,ge[0].width,ge[0].height);for(let wt=0,bt=ge.length;wt<bt;wt++)Vt=ge[wt],j?zt&&i.texSubImage2D(o.TEXTURE_2D,wt,0,0,Vt.width,Vt.height,Gt,ce,Vt.data):i.texImage2D(o.TEXTURE_2D,wt,ie,Vt.width,Vt.height,0,Gt,ce,Vt.data);b.generateMipmaps=!1}else j?(Lt&&i.texStorage2D(o.TEXTURE_2D,Qt,ie,Dt.width,Dt.height),zt&&tt(b,Dt,Gt,ce)):i.texImage2D(o.TEXTURE_2D,0,ie,Dt.width,Dt.height,0,Gt,ce,Dt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){j&&Lt&&i.texStorage3D(o.TEXTURE_2D_ARRAY,Qt,ie,ge[0].width,ge[0].height,Dt.depth);for(let wt=0,bt=ge.length;wt<bt;wt++)if(Vt=ge[wt],b.format!==Oi)if(Gt!==null)if(j){if(zt)if(b.layerUpdates.size>0){const te=$v(Vt.width,Vt.height,b.format,b.type);for(const de of b.layerUpdates){const je=Vt.data.subarray(de*te/Vt.data.BYTES_PER_ELEMENT,(de+1)*te/Vt.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,wt,0,0,de,Vt.width,Vt.height,1,Gt,je)}b.clearLayerUpdates()}else i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,wt,0,0,0,Vt.width,Vt.height,Dt.depth,Gt,Vt.data)}else i.compressedTexImage3D(o.TEXTURE_2D_ARRAY,wt,ie,Vt.width,Vt.height,Dt.depth,0,Vt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else j?zt&&i.texSubImage3D(o.TEXTURE_2D_ARRAY,wt,0,0,0,Vt.width,Vt.height,Dt.depth,Gt,ce,Vt.data):i.texImage3D(o.TEXTURE_2D_ARRAY,wt,ie,Vt.width,Vt.height,Dt.depth,0,Gt,ce,Vt.data)}else{j&&Lt&&i.texStorage2D(o.TEXTURE_2D,Qt,ie,ge[0].width,ge[0].height);for(let wt=0,bt=ge.length;wt<bt;wt++)Vt=ge[wt],b.format!==Oi?Gt!==null?j?zt&&i.compressedTexSubImage2D(o.TEXTURE_2D,wt,0,0,Vt.width,Vt.height,Gt,Vt.data):i.compressedTexImage2D(o.TEXTURE_2D,wt,ie,Vt.width,Vt.height,0,Vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):j?zt&&i.texSubImage2D(o.TEXTURE_2D,wt,0,0,Vt.width,Vt.height,Gt,ce,Vt.data):i.texImage2D(o.TEXTURE_2D,wt,ie,Vt.width,Vt.height,0,Gt,ce,Vt.data)}else if(b.isDataArrayTexture)if(j){if(Lt&&i.texStorage3D(o.TEXTURE_2D_ARRAY,Qt,ie,Dt.width,Dt.height,Dt.depth),zt)if(b.layerUpdates.size>0){const wt=$v(Dt.width,Dt.height,b.format,b.type);for(const bt of b.layerUpdates){const te=Dt.data.subarray(bt*wt/Dt.data.BYTES_PER_ELEMENT,(bt+1)*wt/Dt.data.BYTES_PER_ELEMENT);i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,bt,Dt.width,Dt.height,1,Gt,ce,te)}b.clearLayerUpdates()}else i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,Dt.width,Dt.height,Dt.depth,Gt,ce,Dt.data)}else i.texImage3D(o.TEXTURE_2D_ARRAY,0,ie,Dt.width,Dt.height,Dt.depth,0,Gt,ce,Dt.data);else if(b.isData3DTexture)j?(Lt&&i.texStorage3D(o.TEXTURE_3D,Qt,ie,Dt.width,Dt.height,Dt.depth),zt&&i.texSubImage3D(o.TEXTURE_3D,0,0,0,0,Dt.width,Dt.height,Dt.depth,Gt,ce,Dt.data)):i.texImage3D(o.TEXTURE_3D,0,ie,Dt.width,Dt.height,Dt.depth,0,Gt,ce,Dt.data);else if(b.isFramebufferTexture){if(Lt)if(j)i.texStorage2D(o.TEXTURE_2D,Qt,ie,Dt.width,Dt.height);else{let wt=Dt.width,bt=Dt.height;for(let te=0;te<Qt;te++)i.texImage2D(o.TEXTURE_2D,te,ie,wt,bt,0,Gt,ce,null),wt>>=1,bt>>=1}}else if(ge.length>0){if(j&&Lt){const wt=he(ge[0]);i.texStorage2D(o.TEXTURE_2D,Qt,ie,wt.width,wt.height)}for(let wt=0,bt=ge.length;wt<bt;wt++)Vt=ge[wt],j?zt&&i.texSubImage2D(o.TEXTURE_2D,wt,0,0,Gt,ce,Vt):i.texImage2D(o.TEXTURE_2D,wt,ie,Gt,ce,Vt);b.generateMipmaps=!1}else if(j){if(Lt){const wt=he(Dt);i.texStorage2D(o.TEXTURE_2D,Qt,ie,wt.width,wt.height)}zt&&i.texSubImage2D(o.TEXTURE_2D,0,0,0,Gt,ce,Dt)}else i.texImage2D(o.TEXTURE_2D,0,ie,Gt,ce,Dt);S(b)&&v($),Ht.__version=ot.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function F(w,b,Y){if(b.image.length!==6)return;const $=Ct(w,b),ht=b.source;i.bindTexture(o.TEXTURE_CUBE_MAP,w.__webglTexture,o.TEXTURE0+Y);const ot=r.get(ht);if(ht.version!==ot.__version||$===!0){i.activeTexture(o.TEXTURE0+Y);const Ht=Pe.getPrimaries(Pe.workingColorSpace),_t=b.colorSpace===ls?null:Pe.getPrimaries(b.colorSpace),Xt=b.colorSpace===ls||Ht===_t?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,b.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,b.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);const ee=b.isCompressedTexture||b.image[0].isCompressedTexture,Dt=b.image[0]&&b.image[0].isDataTexture,Gt=[];for(let bt=0;bt<6;bt++)!ee&&!Dt?Gt[bt]=A(b.image[bt],!0,l.maxCubemapSize):Gt[bt]=Dt?b.image[bt].image:b.image[bt],Gt[bt]=me(b,Gt[bt]);const ce=Gt[0],ie=f.convert(b.format,b.colorSpace),Vt=f.convert(b.type),ge=O(b.internalFormat,ie,Vt,b.colorSpace),j=b.isVideoTexture!==!0,Lt=ot.__version===void 0||$===!0,zt=ht.dataReady;let Qt=V(b,ce);oe(o.TEXTURE_CUBE_MAP,b);let wt;if(ee){j&&Lt&&i.texStorage2D(o.TEXTURE_CUBE_MAP,Qt,ge,ce.width,ce.height);for(let bt=0;bt<6;bt++){wt=Gt[bt].mipmaps;for(let te=0;te<wt.length;te++){const de=wt[te];b.format!==Oi?ie!==null?j?zt&&i.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,te,0,0,de.width,de.height,ie,de.data):i.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,te,ge,de.width,de.height,0,de.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):j?zt&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,te,0,0,de.width,de.height,ie,Vt,de.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,te,ge,de.width,de.height,0,ie,Vt,de.data)}}}else{if(wt=b.mipmaps,j&&Lt){wt.length>0&&Qt++;const bt=he(Gt[0]);i.texStorage2D(o.TEXTURE_CUBE_MAP,Qt,ge,bt.width,bt.height)}for(let bt=0;bt<6;bt++)if(Dt){j?zt&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,0,0,Gt[bt].width,Gt[bt].height,ie,Vt,Gt[bt].data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,ge,Gt[bt].width,Gt[bt].height,0,ie,Vt,Gt[bt].data);for(let te=0;te<wt.length;te++){const je=wt[te].image[bt].image;j?zt&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,te+1,0,0,je.width,je.height,ie,Vt,je.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,te+1,ge,je.width,je.height,0,ie,Vt,je.data)}}else{j?zt&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,0,0,ie,Vt,Gt[bt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,ge,ie,Vt,Gt[bt]);for(let te=0;te<wt.length;te++){const de=wt[te];j?zt&&i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,te+1,0,0,ie,Vt,de.image[bt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,te+1,ge,ie,Vt,de.image[bt])}}}S(b)&&v(o.TEXTURE_CUBE_MAP),ot.__version=ht.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function pt(w,b,Y,$,ht,ot){const Ht=f.convert(Y.format,Y.colorSpace),_t=f.convert(Y.type),Xt=O(Y.internalFormat,Ht,_t,Y.colorSpace),ee=r.get(b),Dt=r.get(Y);if(Dt.__renderTarget=b,!ee.__hasExternalTextures){const Gt=Math.max(1,b.width>>ot),ce=Math.max(1,b.height>>ot);ht===o.TEXTURE_3D||ht===o.TEXTURE_2D_ARRAY?i.texImage3D(ht,ot,Xt,Gt,ce,b.depth,0,Ht,_t,null):i.texImage2D(ht,ot,Xt,Gt,ce,0,Ht,_t,null)}i.bindFramebuffer(o.FRAMEBUFFER,w),Rt(b)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,$,ht,Dt.__webglTexture,0,It(b)):(ht===o.TEXTURE_2D||ht>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&ht<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,$,ht,Dt.__webglTexture,ot),i.bindFramebuffer(o.FRAMEBUFFER,null)}function St(w,b,Y){if(o.bindRenderbuffer(o.RENDERBUFFER,w),b.depthBuffer){const $=b.depthTexture,ht=$&&$.isDepthTexture?$.type:null,ot=L(b.stencilBuffer,ht),Ht=b.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,_t=It(b);Rt(b)?d.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,_t,ot,b.width,b.height):Y?o.renderbufferStorageMultisample(o.RENDERBUFFER,_t,ot,b.width,b.height):o.renderbufferStorage(o.RENDERBUFFER,ot,b.width,b.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,Ht,o.RENDERBUFFER,w)}else{const $=b.textures;for(let ht=0;ht<$.length;ht++){const ot=$[ht],Ht=f.convert(ot.format,ot.colorSpace),_t=f.convert(ot.type),Xt=O(ot.internalFormat,Ht,_t,ot.colorSpace),ee=It(b);Y&&Rt(b)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,ee,Xt,b.width,b.height):Rt(b)?d.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,ee,Xt,b.width,b.height):o.renderbufferStorage(o.RENDERBUFFER,Xt,b.width,b.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function Et(w,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(o.FRAMEBUFFER,w),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=r.get(b.depthTexture);$.__renderTarget=b,(!$.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),mt(b.depthTexture,0);const ht=$.__webglTexture,ot=It(b);if(b.depthTexture.format===ml)Rt(b)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,ht,0,ot):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,ht,0);else if(b.depthTexture.format===gl)Rt(b)?d.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,ht,0,ot):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,ht,0);else throw new Error("Unknown depthTexture format")}function ut(w){const b=r.get(w),Y=w.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==w.depthTexture){const $=w.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),$){const ht=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,$.removeEventListener("dispose",ht)};$.addEventListener("dispose",ht),b.__depthDisposeCallback=ht}b.__boundDepthTexture=$}if(w.depthTexture&&!b.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");const $=w.texture.mipmaps;$&&$.length>0?Et(b.__webglFramebuffer[0],w):Et(b.__webglFramebuffer,w)}else if(Y){b.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(i.bindFramebuffer(o.FRAMEBUFFER,b.__webglFramebuffer[$]),b.__webglDepthbuffer[$]===void 0)b.__webglDepthbuffer[$]=o.createRenderbuffer(),St(b.__webglDepthbuffer[$],w,!1);else{const ht=w.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ot=b.__webglDepthbuffer[$];o.bindRenderbuffer(o.RENDERBUFFER,ot),o.framebufferRenderbuffer(o.FRAMEBUFFER,ht,o.RENDERBUFFER,ot)}}else{const $=w.texture.mipmaps;if($&&$.length>0?i.bindFramebuffer(o.FRAMEBUFFER,b.__webglFramebuffer[0]):i.bindFramebuffer(o.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=o.createRenderbuffer(),St(b.__webglDepthbuffer,w,!1);else{const ht=w.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,ot=b.__webglDepthbuffer;o.bindRenderbuffer(o.RENDERBUFFER,ot),o.framebufferRenderbuffer(o.FRAMEBUFFER,ht,o.RENDERBUFFER,ot)}}i.bindFramebuffer(o.FRAMEBUFFER,null)}function Ot(w,b,Y){const $=r.get(w);b!==void 0&&pt($.__webglFramebuffer,w,w.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),Y!==void 0&&ut(w)}function z(w){const b=w.texture,Y=r.get(w),$=r.get(b);w.addEventListener("dispose",B);const ht=w.textures,ot=w.isWebGLCubeRenderTarget===!0,Ht=ht.length>1;if(Ht||($.__webglTexture===void 0&&($.__webglTexture=o.createTexture()),$.__version=b.version,h.memory.textures++),ot){Y.__webglFramebuffer=[];for(let _t=0;_t<6;_t++)if(b.mipmaps&&b.mipmaps.length>0){Y.__webglFramebuffer[_t]=[];for(let Xt=0;Xt<b.mipmaps.length;Xt++)Y.__webglFramebuffer[_t][Xt]=o.createFramebuffer()}else Y.__webglFramebuffer[_t]=o.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){Y.__webglFramebuffer=[];for(let _t=0;_t<b.mipmaps.length;_t++)Y.__webglFramebuffer[_t]=o.createFramebuffer()}else Y.__webglFramebuffer=o.createFramebuffer();if(Ht)for(let _t=0,Xt=ht.length;_t<Xt;_t++){const ee=r.get(ht[_t]);ee.__webglTexture===void 0&&(ee.__webglTexture=o.createTexture(),h.memory.textures++)}if(w.samples>0&&Rt(w)===!1){Y.__webglMultisampledFramebuffer=o.createFramebuffer(),Y.__webglColorRenderbuffer=[],i.bindFramebuffer(o.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let _t=0;_t<ht.length;_t++){const Xt=ht[_t];Y.__webglColorRenderbuffer[_t]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,Y.__webglColorRenderbuffer[_t]);const ee=f.convert(Xt.format,Xt.colorSpace),Dt=f.convert(Xt.type),Gt=O(Xt.internalFormat,ee,Dt,Xt.colorSpace,w.isXRRenderTarget===!0),ce=It(w);o.renderbufferStorageMultisample(o.RENDERBUFFER,ce,Gt,w.width,w.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+_t,o.RENDERBUFFER,Y.__webglColorRenderbuffer[_t])}o.bindRenderbuffer(o.RENDERBUFFER,null),w.depthBuffer&&(Y.__webglDepthRenderbuffer=o.createRenderbuffer(),St(Y.__webglDepthRenderbuffer,w,!0)),i.bindFramebuffer(o.FRAMEBUFFER,null)}}if(ot){i.bindTexture(o.TEXTURE_CUBE_MAP,$.__webglTexture),oe(o.TEXTURE_CUBE_MAP,b);for(let _t=0;_t<6;_t++)if(b.mipmaps&&b.mipmaps.length>0)for(let Xt=0;Xt<b.mipmaps.length;Xt++)pt(Y.__webglFramebuffer[_t][Xt],w,b,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+_t,Xt);else pt(Y.__webglFramebuffer[_t],w,b,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0);S(b)&&v(o.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Ht){for(let _t=0,Xt=ht.length;_t<Xt;_t++){const ee=ht[_t],Dt=r.get(ee);let Gt=o.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Gt=w.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),i.bindTexture(Gt,Dt.__webglTexture),oe(Gt,ee),pt(Y.__webglFramebuffer,w,ee,o.COLOR_ATTACHMENT0+_t,Gt,0),S(ee)&&v(Gt)}i.unbindTexture()}else{let _t=o.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(_t=w.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY),i.bindTexture(_t,$.__webglTexture),oe(_t,b),b.mipmaps&&b.mipmaps.length>0)for(let Xt=0;Xt<b.mipmaps.length;Xt++)pt(Y.__webglFramebuffer[Xt],w,b,o.COLOR_ATTACHMENT0,_t,Xt);else pt(Y.__webglFramebuffer,w,b,o.COLOR_ATTACHMENT0,_t,0);S(b)&&v(_t),i.unbindTexture()}w.depthBuffer&&ut(w)}function ne(w){const b=w.textures;for(let Y=0,$=b.length;Y<$;Y++){const ht=b[Y];if(S(ht)){const ot=P(w),Ht=r.get(ht).__webglTexture;i.bindTexture(ot,Ht),v(ot),i.unbindTexture()}}}const qt=[],Nt=[];function yt(w){if(w.samples>0){if(Rt(w)===!1){const b=w.textures,Y=w.width,$=w.height;let ht=o.COLOR_BUFFER_BIT;const ot=w.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Ht=r.get(w),_t=b.length>1;if(_t)for(let ee=0;ee<b.length;ee++)i.bindFramebuffer(o.FRAMEBUFFER,Ht.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+ee,o.RENDERBUFFER,null),i.bindFramebuffer(o.FRAMEBUFFER,Ht.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+ee,o.TEXTURE_2D,null,0);i.bindFramebuffer(o.READ_FRAMEBUFFER,Ht.__webglMultisampledFramebuffer);const Xt=w.texture.mipmaps;Xt&&Xt.length>0?i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Ht.__webglFramebuffer[0]):i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Ht.__webglFramebuffer);for(let ee=0;ee<b.length;ee++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(ht|=o.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(ht|=o.STENCIL_BUFFER_BIT)),_t){o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,Ht.__webglColorRenderbuffer[ee]);const Dt=r.get(b[ee]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,Dt,0)}o.blitFramebuffer(0,0,Y,$,0,0,Y,$,ht,o.NEAREST),g===!0&&(qt.length=0,Nt.length=0,qt.push(o.COLOR_ATTACHMENT0+ee),w.depthBuffer&&w.resolveDepthBuffer===!1&&(qt.push(ot),Nt.push(ot),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,Nt)),o.invalidateFramebuffer(o.READ_FRAMEBUFFER,qt))}if(i.bindFramebuffer(o.READ_FRAMEBUFFER,null),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),_t)for(let ee=0;ee<b.length;ee++){i.bindFramebuffer(o.FRAMEBUFFER,Ht.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+ee,o.RENDERBUFFER,Ht.__webglColorRenderbuffer[ee]);const Dt=r.get(b[ee]).__webglTexture;i.bindFramebuffer(o.FRAMEBUFFER,Ht.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+ee,o.TEXTURE_2D,Dt,0)}i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Ht.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&g){const b=w.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT;o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[b])}}}function It(w){return Math.min(l.maxSamples,w.samples)}function Rt(w){const b=r.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Zt(w){const b=h.render.frame;x.get(w)!==b&&(x.set(w,b),w.update())}function me(w,b){const Y=w.colorSpace,$=w.format,ht=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||Y!==lo&&Y!==ls&&(Pe.getTransfer(Y)===Ye?($!==Oi||ht!==ta)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),b}function he(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(p.width=w.naturalWidth||w.width,p.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(p.width=w.displayWidth,p.height=w.displayHeight):(p.width=w.width,p.height=w.height),p}this.allocateTextureUnit=gt,this.resetTextureUnits=lt,this.setTexture2D=mt,this.setTexture2DArray=Z,this.setTexture3D=ct,this.setTextureCube=Q,this.rebindTextures=Ot,this.setupRenderTarget=z,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=yt,this.setupDepthRenderbuffer=ut,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=Rt}function aC(o,e){function i(r,l=ls){let f;const h=Pe.getTransfer(l);if(r===ta)return o.UNSIGNED_BYTE;if(r===jp)return o.UNSIGNED_SHORT_4_4_4_4;if(r===Xp)return o.UNSIGNED_SHORT_5_5_5_1;if(r===ly)return o.UNSIGNED_INT_5_9_9_9_REV;if(r===cy)return o.UNSIGNED_INT_10F_11F_11F_REV;if(r===ry)return o.BYTE;if(r===oy)return o.SHORT;if(r===dl)return o.UNSIGNED_SHORT;if(r===kp)return o.INT;if(r===Zs)return o.UNSIGNED_INT;if(r===Ta)return o.FLOAT;if(r===vl)return o.HALF_FLOAT;if(r===uy)return o.ALPHA;if(r===fy)return o.RGB;if(r===Oi)return o.RGBA;if(r===ml)return o.DEPTH_COMPONENT;if(r===gl)return o.DEPTH_STENCIL;if(r===hy)return o.RED;if(r===Yp)return o.RED_INTEGER;if(r===dy)return o.RG;if(r===qp)return o.RG_INTEGER;if(r===Wp)return o.RGBA_INTEGER;if(r===vu||r===xu||r===yu||r===Su)if(h===Ye)if(f=e.get("WEBGL_compressed_texture_s3tc_srgb"),f!==null){if(r===vu)return f.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===xu)return f.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===yu)return f.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Su)return f.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(f=e.get("WEBGL_compressed_texture_s3tc"),f!==null){if(r===vu)return f.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===xu)return f.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===yu)return f.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Su)return f.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===lp||r===cp||r===up||r===fp)if(f=e.get("WEBGL_compressed_texture_pvrtc"),f!==null){if(r===lp)return f.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===cp)return f.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===up)return f.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===fp)return f.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===hp||r===dp||r===pp)if(f=e.get("WEBGL_compressed_texture_etc"),f!==null){if(r===hp||r===dp)return h===Ye?f.COMPRESSED_SRGB8_ETC2:f.COMPRESSED_RGB8_ETC2;if(r===pp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:f.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===mp||r===gp||r===_p||r===vp||r===xp||r===yp||r===Sp||r===Mp||r===Ep||r===bp||r===Tp||r===Ap||r===Rp||r===Cp)if(f=e.get("WEBGL_compressed_texture_astc"),f!==null){if(r===mp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:f.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===gp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:f.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===_p)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:f.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===vp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:f.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===xp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:f.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===yp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:f.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Sp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:f.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Mp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:f.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Ep)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:f.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===bp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:f.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Tp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:f.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ap)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:f.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Rp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:f.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Cp)return h===Ye?f.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:f.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===wp||r===Dp||r===Np)if(f=e.get("EXT_texture_compression_bptc"),f!==null){if(r===wp)return h===Ye?f.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:f.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Dp)return f.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Np)return f.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Up||r===Lp||r===Op||r===Pp)if(f=e.get("EXT_texture_compression_rgtc"),f!==null){if(r===Up)return f.COMPRESSED_RED_RGTC1_EXT;if(r===Lp)return f.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Op)return f.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Pp)return f.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===pl?o.UNSIGNED_INT_24_8:o[r]!==void 0?o[r]:null}return{convert:i}}const sC=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rC=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class oC{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i){if(this.texture===null){const r=new Ay(e.texture);(e.depthNear!==i.depthNear||e.depthFar!==i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const i=e.cameras[0].viewport,r=new hs({vertexShader:sC,fragmentShader:rC,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Pi(new Uu(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lC extends $s{constructor(e,i){super();const r=this;let l=null,f=1,h=null,d="local-floor",g=1,p=null,x=null,m=null,y=null,M=null,E=null;const A=typeof XRWebGLBinding<"u",S=new oC,v={},P=i.getContextAttributes();let O=null,L=null;const V=[],H=[],B=new pe;let q=null;const N=new Ei;N.viewport=new ln;const D=new Ei;D.viewport=new ln;const X=[N,D],lt=new A1;let gt=null,Mt=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let F=V[G];return F===void 0&&(F=new zd,V[G]=F),F.getTargetRaySpace()},this.getControllerGrip=function(G){let F=V[G];return F===void 0&&(F=new zd,V[G]=F),F.getGripSpace()},this.getHand=function(G){let F=V[G];return F===void 0&&(F=new zd,V[G]=F),F.getHandSpace()};function mt(G){const F=H.indexOf(G.inputSource);if(F===-1)return;const pt=V[F];pt!==void 0&&(pt.update(G.inputSource,G.frame,p||h),pt.dispatchEvent({type:G.type,data:G.inputSource}))}function Z(){l.removeEventListener("select",mt),l.removeEventListener("selectstart",mt),l.removeEventListener("selectend",mt),l.removeEventListener("squeeze",mt),l.removeEventListener("squeezestart",mt),l.removeEventListener("squeezeend",mt),l.removeEventListener("end",Z),l.removeEventListener("inputsourceschange",ct);for(let G=0;G<V.length;G++){const F=H[G];F!==null&&(H[G]=null,V[G].disconnect(F))}gt=null,Mt=null,S.reset();for(const G in v)delete v[G];e.setRenderTarget(O),M=null,y=null,m=null,l=null,L=null,tt.stop(),r.isPresenting=!1,e.setPixelRatio(q),e.setSize(B.width,B.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){f=G,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){d=G,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||h},this.setReferenceSpace=function(G){p=G},this.getBaseLayer=function(){return y!==null?y:M},this.getBinding=function(){return m===null&&A&&(m=new XRWebGLBinding(l,i)),m},this.getFrame=function(){return E},this.getSession=function(){return l},this.setSession=async function(G){if(l=G,l!==null){if(O=e.getRenderTarget(),l.addEventListener("select",mt),l.addEventListener("selectstart",mt),l.addEventListener("selectend",mt),l.addEventListener("squeeze",mt),l.addEventListener("squeezestart",mt),l.addEventListener("squeezeend",mt),l.addEventListener("end",Z),l.addEventListener("inputsourceschange",ct),P.xrCompatible!==!0&&await i.makeXRCompatible(),q=e.getPixelRatio(),e.getSize(B),A&&"createProjectionLayer"in XRWebGLBinding.prototype){let pt=null,St=null,Et=null;P.depth&&(Et=P.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,pt=P.stencil?gl:ml,St=P.stencil?pl:Zs);const ut={colorFormat:i.RGBA8,depthFormat:Et,scaleFactor:f};m=this.getBinding(),y=m.createProjectionLayer(ut),l.updateRenderState({layers:[y]}),e.setPixelRatio(1),e.setSize(y.textureWidth,y.textureHeight,!1),L=new Qs(y.textureWidth,y.textureHeight,{format:Oi,type:ta,depthTexture:new Ty(y.textureWidth,y.textureHeight,St,void 0,void 0,void 0,void 0,void 0,void 0,pt),stencilBuffer:P.stencil,colorSpace:e.outputColorSpace,samples:P.antialias?4:0,resolveDepthBuffer:y.ignoreDepthValues===!1,resolveStencilBuffer:y.ignoreDepthValues===!1})}else{const pt={antialias:P.antialias,alpha:!0,depth:P.depth,stencil:P.stencil,framebufferScaleFactor:f};M=new XRWebGLLayer(l,i,pt),l.updateRenderState({baseLayer:M}),e.setPixelRatio(1),e.setSize(M.framebufferWidth,M.framebufferHeight,!1),L=new Qs(M.framebufferWidth,M.framebufferHeight,{format:Oi,type:ta,colorSpace:e.outputColorSpace,stencilBuffer:P.stencil,resolveDepthBuffer:M.ignoreDepthValues===!1,resolveStencilBuffer:M.ignoreDepthValues===!1})}L.isXRRenderTarget=!0,this.setFoveation(g),p=null,h=await l.requestReferenceSpace(d),tt.setContext(l),tt.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function ct(G){for(let F=0;F<G.removed.length;F++){const pt=G.removed[F],St=H.indexOf(pt);St>=0&&(H[St]=null,V[St].disconnect(pt))}for(let F=0;F<G.added.length;F++){const pt=G.added[F];let St=H.indexOf(pt);if(St===-1){for(let ut=0;ut<V.length;ut++)if(ut>=H.length){H.push(pt),St=ut;break}else if(H[ut]===null){H[ut]=pt,St=ut;break}if(St===-1)break}const Et=V[St];Et&&Et.connect(pt)}}const Q=new st,Tt=new st;function At(G,F,pt){Q.setFromMatrixPosition(F.matrixWorld),Tt.setFromMatrixPosition(pt.matrixWorld);const St=Q.distanceTo(Tt),Et=F.projectionMatrix.elements,ut=pt.projectionMatrix.elements,Ot=Et[14]/(Et[10]-1),z=Et[14]/(Et[10]+1),ne=(Et[9]+1)/Et[5],qt=(Et[9]-1)/Et[5],Nt=(Et[8]-1)/Et[0],yt=(ut[8]+1)/ut[0],It=Ot*Nt,Rt=Ot*yt,Zt=St/(-Nt+yt),me=Zt*-Nt;if(F.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(me),G.translateZ(Zt),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),Et[10]===-1)G.projectionMatrix.copy(F.projectionMatrix),G.projectionMatrixInverse.copy(F.projectionMatrixInverse);else{const he=Ot+Zt,w=z+Zt,b=It-me,Y=Rt+(St-me),$=ne*z/w*he,ht=qt*z/w*he;G.projectionMatrix.makePerspective(b,Y,$,ht,he,w),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function Yt(G,F){F===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(F.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(l===null)return;let F=G.near,pt=G.far;S.texture!==null&&(S.depthNear>0&&(F=S.depthNear),S.depthFar>0&&(pt=S.depthFar)),lt.near=D.near=N.near=F,lt.far=D.far=N.far=pt,(gt!==lt.near||Mt!==lt.far)&&(l.updateRenderState({depthNear:lt.near,depthFar:lt.far}),gt=lt.near,Mt=lt.far),lt.layers.mask=G.layers.mask|6,N.layers.mask=lt.layers.mask&3,D.layers.mask=lt.layers.mask&5;const St=G.parent,Et=lt.cameras;Yt(lt,St);for(let ut=0;ut<Et.length;ut++)Yt(Et[ut],St);Et.length===2?At(lt,N,D):lt.projectionMatrix.copy(N.projectionMatrix),oe(G,lt,St)};function oe(G,F,pt){pt===null?G.matrix.copy(F.matrixWorld):(G.matrix.copy(pt.matrixWorld),G.matrix.invert(),G.matrix.multiply(F.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(F.projectionMatrix),G.projectionMatrixInverse.copy(F.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=zp*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return lt},this.getFoveation=function(){if(!(y===null&&M===null))return g},this.setFoveation=function(G){g=G,y!==null&&(y.fixedFoveation=G),M!==null&&M.fixedFoveation!==void 0&&(M.fixedFoveation=G)},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh(lt)},this.getCameraTexture=function(G){return v[G]};let Ct=null;function U(G,F){if(x=F.getViewerPose(p||h),E=F,x!==null){const pt=x.views;M!==null&&(e.setRenderTargetFramebuffer(L,M.framebuffer),e.setRenderTarget(L));let St=!1;pt.length!==lt.cameras.length&&(lt.cameras.length=0,St=!0);for(let z=0;z<pt.length;z++){const ne=pt[z];let qt=null;if(M!==null)qt=M.getViewport(ne);else{const yt=m.getViewSubImage(y,ne);qt=yt.viewport,z===0&&(e.setRenderTargetTextures(L,yt.colorTexture,yt.depthStencilTexture),e.setRenderTarget(L))}let Nt=X[z];Nt===void 0&&(Nt=new Ei,Nt.layers.enable(z),Nt.viewport=new ln,X[z]=Nt),Nt.matrix.fromArray(ne.transform.matrix),Nt.matrix.decompose(Nt.position,Nt.quaternion,Nt.scale),Nt.projectionMatrix.fromArray(ne.projectionMatrix),Nt.projectionMatrixInverse.copy(Nt.projectionMatrix).invert(),Nt.viewport.set(qt.x,qt.y,qt.width,qt.height),z===0&&(lt.matrix.copy(Nt.matrix),lt.matrix.decompose(lt.position,lt.quaternion,lt.scale)),St===!0&&lt.cameras.push(Nt)}const Et=l.enabledFeatures;if(Et&&Et.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&A){m=r.getBinding();const z=m.getDepthInformation(pt[0]);z&&z.isValid&&z.texture&&S.init(z,l.renderState)}if(Et&&Et.includes("camera-access")&&A){e.state.unbindTexture(),m=r.getBinding();for(let z=0;z<pt.length;z++){const ne=pt[z].camera;if(ne){let qt=v[ne];qt||(qt=new Ay,v[ne]=qt);const Nt=m.getCameraImage(ne);qt.sourceTexture=Nt}}}}for(let pt=0;pt<V.length;pt++){const St=H[pt],Et=V[pt];St!==null&&Et!==void 0&&Et.update(St,F,p||h)}Ct&&Ct(G,F),F.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:F}),E=null}const tt=new wy;tt.setAnimationLoop(U),this.setAnimationLoop=function(G){Ct=G},this.dispose=function(){}}}const ks=new ea,cC=new an;function uC(o,e){function i(S,v){S.matrixAutoUpdate===!0&&S.updateMatrix(),v.value.copy(S.matrix)}function r(S,v){v.color.getRGB(S.fogColor.value,My(o)),v.isFog?(S.fogNear.value=v.near,S.fogFar.value=v.far):v.isFogExp2&&(S.fogDensity.value=v.density)}function l(S,v,P,O,L){v.isMeshBasicMaterial||v.isMeshLambertMaterial?f(S,v):v.isMeshToonMaterial?(f(S,v),m(S,v)):v.isMeshPhongMaterial?(f(S,v),x(S,v)):v.isMeshStandardMaterial?(f(S,v),y(S,v),v.isMeshPhysicalMaterial&&M(S,v,L)):v.isMeshMatcapMaterial?(f(S,v),E(S,v)):v.isMeshDepthMaterial?f(S,v):v.isMeshDistanceMaterial?(f(S,v),A(S,v)):v.isMeshNormalMaterial?f(S,v):v.isLineBasicMaterial?(h(S,v),v.isLineDashedMaterial&&d(S,v)):v.isPointsMaterial?g(S,v,P,O):v.isSpriteMaterial?p(S,v):v.isShadowMaterial?(S.color.value.copy(v.color),S.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function f(S,v){S.opacity.value=v.opacity,v.color&&S.diffuse.value.copy(v.color),v.emissive&&S.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(S.map.value=v.map,i(v.map,S.mapTransform)),v.alphaMap&&(S.alphaMap.value=v.alphaMap,i(v.alphaMap,S.alphaMapTransform)),v.bumpMap&&(S.bumpMap.value=v.bumpMap,i(v.bumpMap,S.bumpMapTransform),S.bumpScale.value=v.bumpScale,v.side===Jn&&(S.bumpScale.value*=-1)),v.normalMap&&(S.normalMap.value=v.normalMap,i(v.normalMap,S.normalMapTransform),S.normalScale.value.copy(v.normalScale),v.side===Jn&&S.normalScale.value.negate()),v.displacementMap&&(S.displacementMap.value=v.displacementMap,i(v.displacementMap,S.displacementMapTransform),S.displacementScale.value=v.displacementScale,S.displacementBias.value=v.displacementBias),v.emissiveMap&&(S.emissiveMap.value=v.emissiveMap,i(v.emissiveMap,S.emissiveMapTransform)),v.specularMap&&(S.specularMap.value=v.specularMap,i(v.specularMap,S.specularMapTransform)),v.alphaTest>0&&(S.alphaTest.value=v.alphaTest);const P=e.get(v),O=P.envMap,L=P.envMapRotation;O&&(S.envMap.value=O,ks.copy(L),ks.x*=-1,ks.y*=-1,ks.z*=-1,O.isCubeTexture&&O.isRenderTargetTexture===!1&&(ks.y*=-1,ks.z*=-1),S.envMapRotation.value.setFromMatrix4(cC.makeRotationFromEuler(ks)),S.flipEnvMap.value=O.isCubeTexture&&O.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=v.reflectivity,S.ior.value=v.ior,S.refractionRatio.value=v.refractionRatio),v.lightMap&&(S.lightMap.value=v.lightMap,S.lightMapIntensity.value=v.lightMapIntensity,i(v.lightMap,S.lightMapTransform)),v.aoMap&&(S.aoMap.value=v.aoMap,S.aoMapIntensity.value=v.aoMapIntensity,i(v.aoMap,S.aoMapTransform))}function h(S,v){S.diffuse.value.copy(v.color),S.opacity.value=v.opacity,v.map&&(S.map.value=v.map,i(v.map,S.mapTransform))}function d(S,v){S.dashSize.value=v.dashSize,S.totalSize.value=v.dashSize+v.gapSize,S.scale.value=v.scale}function g(S,v,P,O){S.diffuse.value.copy(v.color),S.opacity.value=v.opacity,S.size.value=v.size*P,S.scale.value=O*.5,v.map&&(S.map.value=v.map,i(v.map,S.uvTransform)),v.alphaMap&&(S.alphaMap.value=v.alphaMap,i(v.alphaMap,S.alphaMapTransform)),v.alphaTest>0&&(S.alphaTest.value=v.alphaTest)}function p(S,v){S.diffuse.value.copy(v.color),S.opacity.value=v.opacity,S.rotation.value=v.rotation,v.map&&(S.map.value=v.map,i(v.map,S.mapTransform)),v.alphaMap&&(S.alphaMap.value=v.alphaMap,i(v.alphaMap,S.alphaMapTransform)),v.alphaTest>0&&(S.alphaTest.value=v.alphaTest)}function x(S,v){S.specular.value.copy(v.specular),S.shininess.value=Math.max(v.shininess,1e-4)}function m(S,v){v.gradientMap&&(S.gradientMap.value=v.gradientMap)}function y(S,v){S.metalness.value=v.metalness,v.metalnessMap&&(S.metalnessMap.value=v.metalnessMap,i(v.metalnessMap,S.metalnessMapTransform)),S.roughness.value=v.roughness,v.roughnessMap&&(S.roughnessMap.value=v.roughnessMap,i(v.roughnessMap,S.roughnessMapTransform)),v.envMap&&(S.envMapIntensity.value=v.envMapIntensity)}function M(S,v,P){S.ior.value=v.ior,v.sheen>0&&(S.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),S.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(S.sheenColorMap.value=v.sheenColorMap,i(v.sheenColorMap,S.sheenColorMapTransform)),v.sheenRoughnessMap&&(S.sheenRoughnessMap.value=v.sheenRoughnessMap,i(v.sheenRoughnessMap,S.sheenRoughnessMapTransform))),v.clearcoat>0&&(S.clearcoat.value=v.clearcoat,S.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(S.clearcoatMap.value=v.clearcoatMap,i(v.clearcoatMap,S.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,i(v.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(S.clearcoatNormalMap.value=v.clearcoatNormalMap,i(v.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Jn&&S.clearcoatNormalScale.value.negate())),v.dispersion>0&&(S.dispersion.value=v.dispersion),v.iridescence>0&&(S.iridescence.value=v.iridescence,S.iridescenceIOR.value=v.iridescenceIOR,S.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(S.iridescenceMap.value=v.iridescenceMap,i(v.iridescenceMap,S.iridescenceMapTransform)),v.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=v.iridescenceThicknessMap,i(v.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),v.transmission>0&&(S.transmission.value=v.transmission,S.transmissionSamplerMap.value=P.texture,S.transmissionSamplerSize.value.set(P.width,P.height),v.transmissionMap&&(S.transmissionMap.value=v.transmissionMap,i(v.transmissionMap,S.transmissionMapTransform)),S.thickness.value=v.thickness,v.thicknessMap&&(S.thicknessMap.value=v.thicknessMap,i(v.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=v.attenuationDistance,S.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(S.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(S.anisotropyMap.value=v.anisotropyMap,i(v.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=v.specularIntensity,S.specularColor.value.copy(v.specularColor),v.specularColorMap&&(S.specularColorMap.value=v.specularColorMap,i(v.specularColorMap,S.specularColorMapTransform)),v.specularIntensityMap&&(S.specularIntensityMap.value=v.specularIntensityMap,i(v.specularIntensityMap,S.specularIntensityMapTransform))}function E(S,v){v.matcap&&(S.matcap.value=v.matcap)}function A(S,v){const P=e.get(v).light;S.referencePosition.value.setFromMatrixPosition(P.matrixWorld),S.nearDistance.value=P.shadow.camera.near,S.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:l}}function fC(o,e,i,r){let l={},f={},h=[];const d=o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS);function g(P,O){const L=O.program;r.uniformBlockBinding(P,L)}function p(P,O){let L=l[P.id];L===void 0&&(E(P),L=x(P),l[P.id]=L,P.addEventListener("dispose",S));const V=O.program;r.updateUBOMapping(P,V);const H=e.render.frame;f[P.id]!==H&&(y(P),f[P.id]=H)}function x(P){const O=m();P.__bindingPointIndex=O;const L=o.createBuffer(),V=P.__size,H=P.usage;return o.bindBuffer(o.UNIFORM_BUFFER,L),o.bufferData(o.UNIFORM_BUFFER,V,H),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,O,L),L}function m(){for(let P=0;P<d;P++)if(h.indexOf(P)===-1)return h.push(P),P;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function y(P){const O=l[P.id],L=P.uniforms,V=P.__cache;o.bindBuffer(o.UNIFORM_BUFFER,O);for(let H=0,B=L.length;H<B;H++){const q=Array.isArray(L[H])?L[H]:[L[H]];for(let N=0,D=q.length;N<D;N++){const X=q[N];if(M(X,H,N,V)===!0){const lt=X.__offset,gt=Array.isArray(X.value)?X.value:[X.value];let Mt=0;for(let mt=0;mt<gt.length;mt++){const Z=gt[mt],ct=A(Z);typeof Z=="number"||typeof Z=="boolean"?(X.__data[0]=Z,o.bufferSubData(o.UNIFORM_BUFFER,lt+Mt,X.__data)):Z.isMatrix3?(X.__data[0]=Z.elements[0],X.__data[1]=Z.elements[1],X.__data[2]=Z.elements[2],X.__data[3]=0,X.__data[4]=Z.elements[3],X.__data[5]=Z.elements[4],X.__data[6]=Z.elements[5],X.__data[7]=0,X.__data[8]=Z.elements[6],X.__data[9]=Z.elements[7],X.__data[10]=Z.elements[8],X.__data[11]=0):(Z.toArray(X.__data,Mt),Mt+=ct.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,lt,X.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function M(P,O,L,V){const H=P.value,B=O+"_"+L;if(V[B]===void 0)return typeof H=="number"||typeof H=="boolean"?V[B]=H:V[B]=H.clone(),!0;{const q=V[B];if(typeof H=="number"||typeof H=="boolean"){if(q!==H)return V[B]=H,!0}else if(q.equals(H)===!1)return q.copy(H),!0}return!1}function E(P){const O=P.uniforms;let L=0;const V=16;for(let B=0,q=O.length;B<q;B++){const N=Array.isArray(O[B])?O[B]:[O[B]];for(let D=0,X=N.length;D<X;D++){const lt=N[D],gt=Array.isArray(lt.value)?lt.value:[lt.value];for(let Mt=0,mt=gt.length;Mt<mt;Mt++){const Z=gt[Mt],ct=A(Z),Q=L%V,Tt=Q%ct.boundary,At=Q+Tt;L+=Tt,At!==0&&V-At<ct.storage&&(L+=V-At),lt.__data=new Float32Array(ct.storage/Float32Array.BYTES_PER_ELEMENT),lt.__offset=L,L+=ct.storage}}}const H=L%V;return H>0&&(L+=V-H),P.__size=L,P.__cache={},this}function A(P){const O={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(O.boundary=4,O.storage=4):P.isVector2?(O.boundary=8,O.storage=8):P.isVector3||P.isColor?(O.boundary=16,O.storage=12):P.isVector4?(O.boundary=16,O.storage=16):P.isMatrix3?(O.boundary=48,O.storage=48):P.isMatrix4?(O.boundary=64,O.storage=64):P.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",P),O}function S(P){const O=P.target;O.removeEventListener("dispose",S);const L=h.indexOf(O.__bindingPointIndex);h.splice(L,1),o.deleteBuffer(l[O.id]),delete l[O.id],delete f[O.id]}function v(){for(const P in l)o.deleteBuffer(l[P]);h=[],l={},f={}}return{bind:g,update:p,dispose:v}}class hC{constructor(e={}){const{canvas:i=jb(),context:r=null,depth:l=!0,stencil:f=!1,alpha:h=!1,antialias:d=!1,premultipliedAlpha:g=!0,preserveDrawingBuffer:p=!1,powerPreference:x="default",failIfMajorPerformanceCaveat:m=!1,reversedDepthBuffer:y=!1}=e;this.isWebGLRenderer=!0;let M;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=r.getContextAttributes().alpha}else M=h;const E=new Uint32Array(4),A=new Int32Array(4);let S=null,v=null;const P=[],O=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=us,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const L=this;let V=!1;this._outputColorSpace=Mi;let H=0,B=0,q=null,N=-1,D=null;const X=new ln,lt=new ln;let gt=null;const Mt=new be(0);let mt=0,Z=i.width,ct=i.height,Q=1,Tt=null,At=null;const Yt=new ln(0,0,Z,ct),oe=new ln(0,0,Z,ct);let Ct=!1;const U=new Qp;let tt=!1,G=!1;const F=new an,pt=new st,St=new ln,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ut=!1;function Ot(){return q===null?Q:1}let z=r;function ne(C,et){return i.getContext(C,et)}try{const C={alpha:!0,depth:l,stencil:f,antialias:d,premultipliedAlpha:g,preserveDrawingBuffer:p,powerPreference:x,failIfMajorPerformanceCaveat:m};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Vp}`),i.addEventListener("webglcontextlost",zt,!1),i.addEventListener("webglcontextrestored",Qt,!1),i.addEventListener("webglcontextcreationerror",wt,!1),z===null){const et="webgl2";if(z=ne(et,C),z===null)throw ne(et)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let qt,Nt,yt,It,Rt,Zt,me,he,w,b,Y,$,ht,ot,Ht,_t,Xt,ee,Dt,Gt,ce,ie,Vt,ge;function j(){qt=new M2(z),qt.init(),ie=new aC(z,qt),Nt=new m2(z,qt,e,ie),yt=new nC(z,qt),Nt.reversedDepthBuffer&&y&&yt.buffers.depth.setReversed(!0),It=new T2(z),Rt=new kR,Zt=new iC(z,qt,yt,Rt,Nt,ie,It),me=new _2(L),he=new S2(L),w=new N1(z),Vt=new d2(z,w),b=new E2(z,w,It,Vt),Y=new R2(z,b,w,It),Dt=new A2(z,Nt,Zt),_t=new g2(Rt),$=new VR(L,me,he,qt,Nt,Vt,_t),ht=new uC(L,Rt),ot=new XR,Ht=new QR(qt),ee=new h2(L,me,he,yt,Y,M,g),Xt=new tC(L,Y,Nt),ge=new fC(z,It,Nt,yt),Gt=new p2(z,qt,It),ce=new b2(z,qt,It),It.programs=$.programs,L.capabilities=Nt,L.extensions=qt,L.properties=Rt,L.renderLists=ot,L.shadowMap=Xt,L.state=yt,L.info=It}j();const Lt=new lC(L,z);this.xr=Lt,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const C=qt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=qt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(C){C!==void 0&&(Q=C,this.setSize(Z,ct,!1))},this.getSize=function(C){return C.set(Z,ct)},this.setSize=function(C,et,ft=!0){if(Lt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=C,ct=et,i.width=Math.floor(C*Q),i.height=Math.floor(et*Q),ft===!0&&(i.style.width=C+"px",i.style.height=et+"px"),this.setViewport(0,0,C,et)},this.getDrawingBufferSize=function(C){return C.set(Z*Q,ct*Q).floor()},this.setDrawingBufferSize=function(C,et,ft){Z=C,ct=et,Q=ft,i.width=Math.floor(C*ft),i.height=Math.floor(et*ft),this.setViewport(0,0,C,et)},this.getCurrentViewport=function(C){return C.copy(X)},this.getViewport=function(C){return C.copy(Yt)},this.setViewport=function(C,et,ft,dt){C.isVector4?Yt.set(C.x,C.y,C.z,C.w):Yt.set(C,et,ft,dt),yt.viewport(X.copy(Yt).multiplyScalar(Q).round())},this.getScissor=function(C){return C.copy(oe)},this.setScissor=function(C,et,ft,dt){C.isVector4?oe.set(C.x,C.y,C.z,C.w):oe.set(C,et,ft,dt),yt.scissor(lt.copy(oe).multiplyScalar(Q).round())},this.getScissorTest=function(){return Ct},this.setScissorTest=function(C){yt.setScissorTest(Ct=C)},this.setOpaqueSort=function(C){Tt=C},this.setTransparentSort=function(C){At=C},this.getClearColor=function(C){return C.copy(ee.getClearColor())},this.setClearColor=function(){ee.setClearColor(...arguments)},this.getClearAlpha=function(){return ee.getClearAlpha()},this.setClearAlpha=function(){ee.setClearAlpha(...arguments)},this.clear=function(C=!0,et=!0,ft=!0){let dt=0;if(C){let nt=!1;if(q!==null){const Ut=q.texture.format;nt=Ut===Wp||Ut===qp||Ut===Yp}if(nt){const Ut=q.texture.type,kt=Ut===ta||Ut===Zs||Ut===dl||Ut===pl||Ut===jp||Ut===Xp,Wt=ee.getClearColor(),Pt=ee.getClearAlpha(),Jt=Wt.r,le=Wt.g,se=Wt.b;kt?(E[0]=Jt,E[1]=le,E[2]=se,E[3]=Pt,z.clearBufferuiv(z.COLOR,0,E)):(A[0]=Jt,A[1]=le,A[2]=se,A[3]=Pt,z.clearBufferiv(z.COLOR,0,A))}else dt|=z.COLOR_BUFFER_BIT}et&&(dt|=z.DEPTH_BUFFER_BIT),ft&&(dt|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(dt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",zt,!1),i.removeEventListener("webglcontextrestored",Qt,!1),i.removeEventListener("webglcontextcreationerror",wt,!1),ee.dispose(),ot.dispose(),Ht.dispose(),Rt.dispose(),me.dispose(),he.dispose(),Y.dispose(),Vt.dispose(),ge.dispose(),$.dispose(),Lt.dispose(),Lt.removeEventListener("sessionstart",gn),Lt.removeEventListener("sessionend",Ln),na.stop()};function zt(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),V=!0}function Qt(){console.log("THREE.WebGLRenderer: Context Restored."),V=!1;const C=It.autoReset,et=Xt.enabled,ft=Xt.autoUpdate,dt=Xt.needsUpdate,nt=Xt.type;j(),It.autoReset=C,Xt.enabled=et,Xt.autoUpdate=ft,Xt.needsUpdate=dt,Xt.type=nt}function wt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function bt(C){const et=C.target;et.removeEventListener("dispose",bt),te(et)}function te(C){de(C),Rt.remove(C)}function de(C){const et=Rt.get(C).programs;et!==void 0&&(et.forEach(function(ft){$.releaseProgram(ft)}),C.isShaderMaterial&&$.releaseShaderCache(C))}this.renderBufferDirect=function(C,et,ft,dt,nt,Ut){et===null&&(et=Et);const kt=nt.isMesh&&nt.matrixWorld.determinant()<0,Wt=Ml(C,et,ft,dt,nt);yt.setMaterial(dt,kt);let Pt=ft.index,Jt=1;if(dt.wireframe===!0){if(Pt=b.getWireframeAttribute(ft),Pt===void 0)return;Jt=2}const le=ft.drawRange,se=ft.attributes.position;let Ee=le.start*Jt,Fe=(le.start+le.count)*Jt;Ut!==null&&(Ee=Math.max(Ee,Ut.start*Jt),Fe=Math.min(Fe,(Ut.start+Ut.count)*Jt)),Pt!==null?(Ee=Math.max(Ee,0),Fe=Math.min(Fe,Pt.count)):se!=null&&(Ee=Math.max(Ee,0),Fe=Math.min(Fe,se.count));const Je=Fe-Ee;if(Je<0||Je===1/0)return;Vt.setup(nt,dt,Wt,ft,Pt);let ze,Ue=Gt;if(Pt!==null&&(ze=w.get(Pt),Ue=ce,Ue.setIndex(ze)),nt.isMesh)dt.wireframe===!0?(yt.setLineWidth(dt.wireframeLinewidth*Ot()),Ue.setMode(z.LINES)):Ue.setMode(z.TRIANGLES);else if(nt.isLine){let re=dt.linewidth;re===void 0&&(re=1),yt.setLineWidth(re*Ot()),nt.isLineSegments?Ue.setMode(z.LINES):nt.isLineLoop?Ue.setMode(z.LINE_LOOP):Ue.setMode(z.LINE_STRIP)}else nt.isPoints?Ue.setMode(z.POINTS):nt.isSprite&&Ue.setMode(z.TRIANGLES);if(nt.isBatchedMesh)if(nt._multiDrawInstances!==null)_l("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ue.renderMultiDrawInstances(nt._multiDrawStarts,nt._multiDrawCounts,nt._multiDrawCount,nt._multiDrawInstances);else if(qt.get("WEBGL_multi_draw"))Ue.renderMultiDraw(nt._multiDrawStarts,nt._multiDrawCounts,nt._multiDrawCount);else{const re=nt._multiDrawStarts,Ie=nt._multiDrawCounts,Se=nt._multiDrawCount,_n=Pt?w.get(Pt).bytesPerElement:1,ti=Rt.get(dt).currentProgram.getUniforms();for(let Le=0;Le<Se;Le++)ti.setValue(z,"_gl_DrawID",Le),Ue.render(re[Le]/_n,Ie[Le])}else if(nt.isInstancedMesh)Ue.renderInstances(Ee,Je,nt.count);else if(ft.isInstancedBufferGeometry){const re=ft._maxInstanceCount!==void 0?ft._maxInstanceCount:1/0,Ie=Math.min(ft.instanceCount,re);Ue.renderInstances(Ee,Je,Ie)}else Ue.render(Ee,Je)};function je(C,et,ft){C.transparent===!0&&C.side===ba&&C.forceSinglePass===!1?(C.side=Jn,C.needsUpdate=!0,fi(C,et,ft),C.side=fs,C.needsUpdate=!0,fi(C,et,ft),C.side=ba):fi(C,et,ft)}this.compile=function(C,et,ft=null){ft===null&&(ft=C),v=Ht.get(ft),v.init(et),O.push(v),ft.traverseVisible(function(nt){nt.isLight&&nt.layers.test(et.layers)&&(v.pushLight(nt),nt.castShadow&&v.pushShadow(nt))}),C!==ft&&C.traverseVisible(function(nt){nt.isLight&&nt.layers.test(et.layers)&&(v.pushLight(nt),nt.castShadow&&v.pushShadow(nt))}),v.setupLights();const dt=new Set;return C.traverse(function(nt){if(!(nt.isMesh||nt.isPoints||nt.isLine||nt.isSprite))return;const Ut=nt.material;if(Ut)if(Array.isArray(Ut))for(let kt=0;kt<Ut.length;kt++){const Wt=Ut[kt];je(Wt,ft,nt),dt.add(Wt)}else je(Ut,ft,nt),dt.add(Ut)}),v=O.pop(),dt},this.compileAsync=function(C,et,ft=null){const dt=this.compile(C,et,ft);return new Promise(nt=>{function Ut(){if(dt.forEach(function(kt){Rt.get(kt).currentProgram.isReady()&&dt.delete(kt)}),dt.size===0){nt(C);return}setTimeout(Ut,10)}qt.get("KHR_parallel_shader_compile")!==null?Ut():setTimeout(Ut,10)})};let Ce=null;function en(C){Ce&&Ce(C)}function gn(){na.stop()}function Ln(){na.start()}const na=new wy;na.setAnimationLoop(en),typeof self<"u"&&na.setContext(self),this.setAnimationLoop=function(C){Ce=C,Lt.setAnimationLoop(C),C===null?na.stop():na.start()},Lt.addEventListener("sessionstart",gn),Lt.addEventListener("sessionend",Ln),this.render=function(C,et){if(et!==void 0&&et.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),et.parent===null&&et.matrixWorldAutoUpdate===!0&&et.updateMatrixWorld(),Lt.enabled===!0&&Lt.isPresenting===!0&&(Lt.cameraAutoUpdate===!0&&Lt.updateCamera(et),et=Lt.getCamera()),C.isScene===!0&&C.onBeforeRender(L,C,et,q),v=Ht.get(C,O.length),v.init(et),O.push(v),F.multiplyMatrices(et.projectionMatrix,et.matrixWorldInverse),U.setFromProjectionMatrix(F,Ji,et.reversedDepth),G=this.localClippingEnabled,tt=_t.init(this.clippingPlanes,G),S=ot.get(C,P.length),S.init(),P.push(S),Lt.enabled===!0&&Lt.isPresenting===!0){const Ut=L.xr.getDepthSensingMesh();Ut!==null&&ho(Ut,et,-1/0,L.sortObjects)}ho(C,et,0,L.sortObjects),S.finish(),L.sortObjects===!0&&S.sort(Tt,At),ut=Lt.enabled===!1||Lt.isPresenting===!1||Lt.hasDepthSensing()===!1,ut&&ee.addToRenderList(S,C),this.info.render.frame++,tt===!0&&_t.beginShadows();const ft=v.state.shadowsArray;Xt.render(ft,C,et),tt===!0&&_t.endShadows(),this.info.autoReset===!0&&this.info.reset();const dt=S.opaque,nt=S.transmissive;if(v.setupLights(),et.isArrayCamera){const Ut=et.cameras;if(nt.length>0)for(let kt=0,Wt=Ut.length;kt<Wt;kt++){const Pt=Ut[kt];ds(dt,nt,C,Pt)}ut&&ee.render(C);for(let kt=0,Wt=Ut.length;kt<Wt;kt++){const Pt=Ut[kt];Sl(S,C,Pt,Pt.viewport)}}else nt.length>0&&ds(dt,nt,C,et),ut&&ee.render(C),Sl(S,C,et);q!==null&&B===0&&(Zt.updateMultisampleRenderTarget(q),Zt.updateRenderTargetMipmap(q)),C.isScene===!0&&C.onAfterRender(L,C,et),Vt.resetDefaultState(),N=-1,D=null,O.pop(),O.length>0?(v=O[O.length-1],tt===!0&&_t.setGlobalState(L.clippingPlanes,v.state.camera)):v=null,P.pop(),P.length>0?S=P[P.length-1]:S=null};function ho(C,et,ft,dt){if(C.visible===!1)return;if(C.layers.test(et.layers)){if(C.isGroup)ft=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(et);else if(C.isLight)v.pushLight(C),C.castShadow&&v.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||U.intersectsSprite(C)){dt&&St.setFromMatrixPosition(C.matrixWorld).applyMatrix4(F);const kt=Y.update(C),Wt=C.material;Wt.visible&&S.push(C,kt,Wt,ft,St.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||U.intersectsObject(C))){const kt=Y.update(C),Wt=C.material;if(dt&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),St.copy(C.boundingSphere.center)):(kt.boundingSphere===null&&kt.computeBoundingSphere(),St.copy(kt.boundingSphere.center)),St.applyMatrix4(C.matrixWorld).applyMatrix4(F)),Array.isArray(Wt)){const Pt=kt.groups;for(let Jt=0,le=Pt.length;Jt<le;Jt++){const se=Pt[Jt],Ee=Wt[se.materialIndex];Ee&&Ee.visible&&S.push(C,kt,Ee,ft,St.z,se)}}else Wt.visible&&S.push(C,kt,Wt,ft,St.z,null)}}const Ut=C.children;for(let kt=0,Wt=Ut.length;kt<Wt;kt++)ho(Ut[kt],et,ft,dt)}function Sl(C,et,ft,dt){const nt=C.opaque,Ut=C.transmissive,kt=C.transparent;v.setupLightsView(ft),tt===!0&&_t.setGlobalState(L.clippingPlanes,ft),dt&&yt.viewport(X.copy(dt)),nt.length>0&&ia(nt,et,ft),Ut.length>0&&ia(Ut,et,ft),kt.length>0&&ia(kt,et,ft),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function ds(C,et,ft,dt){if((ft.isScene===!0?ft.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[dt.id]===void 0&&(v.state.transmissionRenderTarget[dt.id]=new Qs(1,1,{generateMipmaps:!0,type:qt.has("EXT_color_buffer_half_float")||qt.has("EXT_color_buffer_float")?vl:ta,minFilter:Ws,samples:4,stencilBuffer:f,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Pe.workingColorSpace}));const Ut=v.state.transmissionRenderTarget[dt.id],kt=dt.viewport||X;Ut.setSize(kt.z*L.transmissionResolutionScale,kt.w*L.transmissionResolutionScale);const Wt=L.getRenderTarget(),Pt=L.getActiveCubeFace(),Jt=L.getActiveMipmapLevel();L.setRenderTarget(Ut),L.getClearColor(Mt),mt=L.getClearAlpha(),mt<1&&L.setClearColor(16777215,.5),L.clear(),ut&&ee.render(ft);const le=L.toneMapping;L.toneMapping=us;const se=dt.viewport;if(dt.viewport!==void 0&&(dt.viewport=void 0),v.setupLightsView(dt),tt===!0&&_t.setGlobalState(L.clippingPlanes,dt),ia(C,ft,dt),Zt.updateMultisampleRenderTarget(Ut),Zt.updateRenderTargetMipmap(Ut),qt.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let Fe=0,Je=et.length;Fe<Je;Fe++){const ze=et[Fe],Ue=ze.object,re=ze.geometry,Ie=ze.material,Se=ze.group;if(Ie.side===ba&&Ue.layers.test(dt.layers)){const _n=Ie.side;Ie.side=Jn,Ie.needsUpdate=!0,ps(Ue,ft,dt,re,Ie,Se),Ie.side=_n,Ie.needsUpdate=!0,Ee=!0}}Ee===!0&&(Zt.updateMultisampleRenderTarget(Ut),Zt.updateRenderTargetMipmap(Ut))}L.setRenderTarget(Wt,Pt,Jt),L.setClearColor(Mt,mt),se!==void 0&&(dt.viewport=se),L.toneMapping=le}function ia(C,et,ft){const dt=et.isScene===!0?et.overrideMaterial:null;for(let nt=0,Ut=C.length;nt<Ut;nt++){const kt=C[nt],Wt=kt.object,Pt=kt.geometry,Jt=kt.group;let le=kt.material;le.allowOverride===!0&&dt!==null&&(le=dt),Wt.layers.test(ft.layers)&&ps(Wt,et,ft,Pt,le,Jt)}}function ps(C,et,ft,dt,nt,Ut){C.onBeforeRender(L,et,ft,dt,nt,Ut),C.modelViewMatrix.multiplyMatrices(ft.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),nt.onBeforeRender(L,et,ft,dt,C,Ut),nt.transparent===!0&&nt.side===ba&&nt.forceSinglePass===!1?(nt.side=Jn,nt.needsUpdate=!0,L.renderBufferDirect(ft,et,dt,nt,C,Ut),nt.side=fs,nt.needsUpdate=!0,L.renderBufferDirect(ft,et,dt,nt,C,Ut),nt.side=ba):L.renderBufferDirect(ft,et,dt,nt,C,Ut),C.onAfterRender(L,et,ft,dt,nt,Ut)}function fi(C,et,ft){et.isScene!==!0&&(et=Et);const dt=Rt.get(C),nt=v.state.lights,Ut=v.state.shadowsArray,kt=nt.state.version,Wt=$.getParameters(C,nt.state,Ut,et,ft),Pt=$.getProgramCacheKey(Wt);let Jt=dt.programs;dt.environment=C.isMeshStandardMaterial?et.environment:null,dt.fog=et.fog,dt.envMap=(C.isMeshStandardMaterial?he:me).get(C.envMap||dt.environment),dt.envMapRotation=dt.environment!==null&&C.envMap===null?et.environmentRotation:C.envMapRotation,Jt===void 0&&(C.addEventListener("dispose",bt),Jt=new Map,dt.programs=Jt);let le=Jt.get(Pt);if(le!==void 0){if(dt.currentProgram===le&&dt.lightsStateVersion===kt)return Ra(C,Wt),le}else Wt.uniforms=$.getUniforms(C),C.onBeforeCompile(Wt,L),le=$.acquireProgram(Wt,Pt),Jt.set(Pt,le),dt.uniforms=Wt.uniforms;const se=dt.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(se.clippingPlanes=_t.uniform),Ra(C,Wt),dt.needsLights=El(C),dt.lightsStateVersion=kt,dt.needsLights&&(se.ambientLightColor.value=nt.state.ambient,se.lightProbe.value=nt.state.probe,se.directionalLights.value=nt.state.directional,se.directionalLightShadows.value=nt.state.directionalShadow,se.spotLights.value=nt.state.spot,se.spotLightShadows.value=nt.state.spotShadow,se.rectAreaLights.value=nt.state.rectArea,se.ltc_1.value=nt.state.rectAreaLTC1,se.ltc_2.value=nt.state.rectAreaLTC2,se.pointLights.value=nt.state.point,se.pointLightShadows.value=nt.state.pointShadow,se.hemisphereLights.value=nt.state.hemi,se.directionalShadowMap.value=nt.state.directionalShadowMap,se.directionalShadowMatrix.value=nt.state.directionalShadowMatrix,se.spotShadowMap.value=nt.state.spotShadowMap,se.spotLightMatrix.value=nt.state.spotLightMatrix,se.spotLightMap.value=nt.state.spotLightMap,se.pointShadowMap.value=nt.state.pointShadowMap,se.pointShadowMatrix.value=nt.state.pointShadowMatrix),dt.currentProgram=le,dt.uniformsList=null,le}function ms(C){if(C.uniformsList===null){const et=C.currentProgram.getUniforms();C.uniformsList=Mu.seqWithValue(et.seq,C.uniforms)}return C.uniformsList}function Ra(C,et){const ft=Rt.get(C);ft.outputColorSpace=et.outputColorSpace,ft.batching=et.batching,ft.batchingColor=et.batchingColor,ft.instancing=et.instancing,ft.instancingColor=et.instancingColor,ft.instancingMorph=et.instancingMorph,ft.skinning=et.skinning,ft.morphTargets=et.morphTargets,ft.morphNormals=et.morphNormals,ft.morphColors=et.morphColors,ft.morphTargetsCount=et.morphTargetsCount,ft.numClippingPlanes=et.numClippingPlanes,ft.numIntersection=et.numClipIntersection,ft.vertexAlphas=et.vertexAlphas,ft.vertexTangents=et.vertexTangents,ft.toneMapping=et.toneMapping}function Ml(C,et,ft,dt,nt){et.isScene!==!0&&(et=Et),Zt.resetTextureUnits();const Ut=et.fog,kt=dt.isMeshStandardMaterial?et.environment:null,Wt=q===null?L.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:lo,Pt=(dt.isMeshStandardMaterial?he:me).get(dt.envMap||kt),Jt=dt.vertexColors===!0&&!!ft.attributes.color&&ft.attributes.color.itemSize===4,le=!!ft.attributes.tangent&&(!!dt.normalMap||dt.anisotropy>0),se=!!ft.morphAttributes.position,Ee=!!ft.morphAttributes.normal,Fe=!!ft.morphAttributes.color;let Je=us;dt.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(Je=L.toneMapping);const ze=ft.morphAttributes.position||ft.morphAttributes.normal||ft.morphAttributes.color,Ue=ze!==void 0?ze.length:0,re=Rt.get(dt),Ie=v.state.lights;if(tt===!0&&(G===!0||C!==D)){const sn=C===D&&dt.id===N;_t.setState(dt,C,sn)}let Se=!1;dt.version===re.__version?(re.needsLights&&re.lightsStateVersion!==Ie.state.version||re.outputColorSpace!==Wt||nt.isBatchedMesh&&re.batching===!1||!nt.isBatchedMesh&&re.batching===!0||nt.isBatchedMesh&&re.batchingColor===!0&&nt.colorTexture===null||nt.isBatchedMesh&&re.batchingColor===!1&&nt.colorTexture!==null||nt.isInstancedMesh&&re.instancing===!1||!nt.isInstancedMesh&&re.instancing===!0||nt.isSkinnedMesh&&re.skinning===!1||!nt.isSkinnedMesh&&re.skinning===!0||nt.isInstancedMesh&&re.instancingColor===!0&&nt.instanceColor===null||nt.isInstancedMesh&&re.instancingColor===!1&&nt.instanceColor!==null||nt.isInstancedMesh&&re.instancingMorph===!0&&nt.morphTexture===null||nt.isInstancedMesh&&re.instancingMorph===!1&&nt.morphTexture!==null||re.envMap!==Pt||dt.fog===!0&&re.fog!==Ut||re.numClippingPlanes!==void 0&&(re.numClippingPlanes!==_t.numPlanes||re.numIntersection!==_t.numIntersection)||re.vertexAlphas!==Jt||re.vertexTangents!==le||re.morphTargets!==se||re.morphNormals!==Ee||re.morphColors!==Fe||re.toneMapping!==Je||re.morphTargetsCount!==Ue)&&(Se=!0):(Se=!0,re.__version=dt.version);let _n=re.currentProgram;Se===!0&&(_n=fi(dt,et,nt));let ti=!1,Le=!1,Ca=!1;const Ze=_n.getUniforms(),Bn=re.uniforms;if(yt.useProgram(_n.program)&&(ti=!0,Le=!0,Ca=!0),dt.id!==N&&(N=dt.id,Le=!0),ti||D!==C){yt.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ze.setValue(z,"projectionMatrix",C.projectionMatrix),Ze.setValue(z,"viewMatrix",C.matrixWorldInverse);const On=Ze.map.cameraPosition;On!==void 0&&On.setValue(z,pt.setFromMatrixPosition(C.matrixWorld)),Nt.logarithmicDepthBuffer&&Ze.setValue(z,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(dt.isMeshPhongMaterial||dt.isMeshToonMaterial||dt.isMeshLambertMaterial||dt.isMeshBasicMaterial||dt.isMeshStandardMaterial||dt.isShaderMaterial)&&Ze.setValue(z,"isOrthographic",C.isOrthographicCamera===!0),D!==C&&(D=C,Le=!0,Ca=!0)}if(nt.isSkinnedMesh){Ze.setOptional(z,nt,"bindMatrix"),Ze.setOptional(z,nt,"bindMatrixInverse");const sn=nt.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),Ze.setValue(z,"boneTexture",sn.boneTexture,Zt))}nt.isBatchedMesh&&(Ze.setOptional(z,nt,"batchingTexture"),Ze.setValue(z,"batchingTexture",nt._matricesTexture,Zt),Ze.setOptional(z,nt,"batchingIdTexture"),Ze.setValue(z,"batchingIdTexture",nt._indirectTexture,Zt),Ze.setOptional(z,nt,"batchingColorTexture"),nt._colorsTexture!==null&&Ze.setValue(z,"batchingColorTexture",nt._colorsTexture,Zt));const un=ft.morphAttributes;if((un.position!==void 0||un.normal!==void 0||un.color!==void 0)&&Dt.update(nt,ft,_n),(Le||re.receiveShadow!==nt.receiveShadow)&&(re.receiveShadow=nt.receiveShadow,Ze.setValue(z,"receiveShadow",nt.receiveShadow)),dt.isMeshGouraudMaterial&&dt.envMap!==null&&(Bn.envMap.value=Pt,Bn.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),dt.isMeshStandardMaterial&&dt.envMap===null&&et.environment!==null&&(Bn.envMapIntensity.value=et.environmentIntensity),Le&&(Ze.setValue(z,"toneMappingExposure",L.toneMappingExposure),re.needsLights&&Ou(Bn,Ca),Ut&&dt.fog===!0&&ht.refreshFogUniforms(Bn,Ut),ht.refreshMaterialUniforms(Bn,dt,Q,ct,v.state.transmissionRenderTarget[C.id]),Mu.upload(z,ms(re),Bn,Zt)),dt.isShaderMaterial&&dt.uniformsNeedUpdate===!0&&(Mu.upload(z,ms(re),Bn,Zt),dt.uniformsNeedUpdate=!1),dt.isSpriteMaterial&&Ze.setValue(z,"center",nt.center),Ze.setValue(z,"modelViewMatrix",nt.modelViewMatrix),Ze.setValue(z,"normalMatrix",nt.normalMatrix),Ze.setValue(z,"modelMatrix",nt.matrixWorld),dt.isShaderMaterial||dt.isRawShaderMaterial){const sn=dt.uniformsGroups;for(let On=0,tr=sn.length;On<tr;On++){const Bi=sn[On];ge.update(Bi,_n),ge.bind(Bi,_n)}}return _n}function Ou(C,et){C.ambientLightColor.needsUpdate=et,C.lightProbe.needsUpdate=et,C.directionalLights.needsUpdate=et,C.directionalLightShadows.needsUpdate=et,C.pointLights.needsUpdate=et,C.pointLightShadows.needsUpdate=et,C.spotLights.needsUpdate=et,C.spotLightShadows.needsUpdate=et,C.rectAreaLights.needsUpdate=et,C.hemisphereLights.needsUpdate=et}function El(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(C,et,ft){const dt=Rt.get(C);dt.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,dt.__autoAllocateDepthBuffer===!1&&(dt.__useRenderToTexture=!1),Rt.get(C.texture).__webglTexture=et,Rt.get(C.depthTexture).__webglTexture=dt.__autoAllocateDepthBuffer?void 0:ft,dt.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,et){const ft=Rt.get(C);ft.__webglFramebuffer=et,ft.__useDefaultFramebuffer=et===void 0};const po=z.createFramebuffer();this.setRenderTarget=function(C,et=0,ft=0){q=C,H=et,B=ft;let dt=!0,nt=null,Ut=!1,kt=!1;if(C){const Pt=Rt.get(C);if(Pt.__useDefaultFramebuffer!==void 0)yt.bindFramebuffer(z.FRAMEBUFFER,null),dt=!1;else if(Pt.__webglFramebuffer===void 0)Zt.setupRenderTarget(C);else if(Pt.__hasExternalTextures)Zt.rebindTextures(C,Rt.get(C.texture).__webglTexture,Rt.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const se=C.depthTexture;if(Pt.__boundDepthTexture!==se){if(se!==null&&Rt.has(se)&&(C.width!==se.image.width||C.height!==se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Zt.setupDepthRenderbuffer(C)}}const Jt=C.texture;(Jt.isData3DTexture||Jt.isDataArrayTexture||Jt.isCompressedArrayTexture)&&(kt=!0);const le=Rt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(le[et])?nt=le[et][ft]:nt=le[et],Ut=!0):C.samples>0&&Zt.useMultisampledRTT(C)===!1?nt=Rt.get(C).__webglMultisampledFramebuffer:Array.isArray(le)?nt=le[ft]:nt=le,X.copy(C.viewport),lt.copy(C.scissor),gt=C.scissorTest}else X.copy(Yt).multiplyScalar(Q).floor(),lt.copy(oe).multiplyScalar(Q).floor(),gt=Ct;if(ft!==0&&(nt=po),yt.bindFramebuffer(z.FRAMEBUFFER,nt)&&dt&&yt.drawBuffers(C,nt),yt.viewport(X),yt.scissor(lt),yt.setScissorTest(gt),Ut){const Pt=Rt.get(C.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+et,Pt.__webglTexture,ft)}else if(kt){const Pt=et;for(let Jt=0;Jt<C.textures.length;Jt++){const le=Rt.get(C.textures[Jt]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+Jt,le.__webglTexture,ft,Pt)}}else if(C!==null&&ft!==0){const Pt=Rt.get(C.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Pt.__webglTexture,ft)}N=-1},this.readRenderTargetPixels=function(C,et,ft,dt,nt,Ut,kt,Wt=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=Rt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&kt!==void 0&&(Pt=Pt[kt]),Pt){yt.bindFramebuffer(z.FRAMEBUFFER,Pt);try{const Jt=C.textures[Wt],le=Jt.format,se=Jt.type;if(!Nt.textureFormatReadable(le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Nt.textureTypeReadable(se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}et>=0&&et<=C.width-dt&&ft>=0&&ft<=C.height-nt&&(C.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+Wt),z.readPixels(et,ft,dt,nt,ie.convert(le),ie.convert(se),Ut))}finally{const Jt=q!==null?Rt.get(q).__webglFramebuffer:null;yt.bindFramebuffer(z.FRAMEBUFFER,Jt)}}},this.readRenderTargetPixelsAsync=async function(C,et,ft,dt,nt,Ut,kt,Wt=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=Rt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&kt!==void 0&&(Pt=Pt[kt]),Pt)if(et>=0&&et<=C.width-dt&&ft>=0&&ft<=C.height-nt){yt.bindFramebuffer(z.FRAMEBUFFER,Pt);const Jt=C.textures[Wt],le=Jt.format,se=Jt.type;if(!Nt.textureFormatReadable(le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Nt.textureTypeReadable(se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ee=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,Ee),z.bufferData(z.PIXEL_PACK_BUFFER,Ut.byteLength,z.STREAM_READ),C.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+Wt),z.readPixels(et,ft,dt,nt,ie.convert(le),ie.convert(se),0);const Fe=q!==null?Rt.get(q).__webglFramebuffer:null;yt.bindFramebuffer(z.FRAMEBUFFER,Fe);const Je=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Xb(z,Je,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,Ee),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,Ut),z.deleteBuffer(Ee),z.deleteSync(Je),Ut}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,et=null,ft=0){const dt=Math.pow(2,-ft),nt=Math.floor(C.image.width*dt),Ut=Math.floor(C.image.height*dt),kt=et!==null?et.x:0,Wt=et!==null?et.y:0;Zt.setTexture2D(C,0),z.copyTexSubImage2D(z.TEXTURE_2D,ft,0,0,kt,Wt,nt,Ut),yt.unbindTexture()};const gs=z.createFramebuffer(),Pu=z.createFramebuffer();this.copyTextureToTexture=function(C,et,ft=null,dt=null,nt=0,Ut=null){Ut===null&&(nt!==0?(_l("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Ut=nt,nt=0):Ut=0);let kt,Wt,Pt,Jt,le,se,Ee,Fe,Je;const ze=C.isCompressedTexture?C.mipmaps[Ut]:C.image;if(ft!==null)kt=ft.max.x-ft.min.x,Wt=ft.max.y-ft.min.y,Pt=ft.isBox3?ft.max.z-ft.min.z:1,Jt=ft.min.x,le=ft.min.y,se=ft.isBox3?ft.min.z:0;else{const un=Math.pow(2,-nt);kt=Math.floor(ze.width*un),Wt=Math.floor(ze.height*un),C.isDataArrayTexture?Pt=ze.depth:C.isData3DTexture?Pt=Math.floor(ze.depth*un):Pt=1,Jt=0,le=0,se=0}dt!==null?(Ee=dt.x,Fe=dt.y,Je=dt.z):(Ee=0,Fe=0,Je=0);const Ue=ie.convert(et.format),re=ie.convert(et.type);let Ie;et.isData3DTexture?(Zt.setTexture3D(et,0),Ie=z.TEXTURE_3D):et.isDataArrayTexture||et.isCompressedArrayTexture?(Zt.setTexture2DArray(et,0),Ie=z.TEXTURE_2D_ARRAY):(Zt.setTexture2D(et,0),Ie=z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,et.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,et.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,et.unpackAlignment);const Se=z.getParameter(z.UNPACK_ROW_LENGTH),_n=z.getParameter(z.UNPACK_IMAGE_HEIGHT),ti=z.getParameter(z.UNPACK_SKIP_PIXELS),Le=z.getParameter(z.UNPACK_SKIP_ROWS),Ca=z.getParameter(z.UNPACK_SKIP_IMAGES);z.pixelStorei(z.UNPACK_ROW_LENGTH,ze.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,ze.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,Jt),z.pixelStorei(z.UNPACK_SKIP_ROWS,le),z.pixelStorei(z.UNPACK_SKIP_IMAGES,se);const Ze=C.isDataArrayTexture||C.isData3DTexture,Bn=et.isDataArrayTexture||et.isData3DTexture;if(C.isDepthTexture){const un=Rt.get(C),sn=Rt.get(et),On=Rt.get(un.__renderTarget),tr=Rt.get(sn.__renderTarget);yt.bindFramebuffer(z.READ_FRAMEBUFFER,On.__webglFramebuffer),yt.bindFramebuffer(z.DRAW_FRAMEBUFFER,tr.__webglFramebuffer);for(let Bi=0;Bi<Pt;Bi++)Ze&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Rt.get(C).__webglTexture,nt,se+Bi),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Rt.get(et).__webglTexture,Ut,Je+Bi)),z.blitFramebuffer(Jt,le,kt,Wt,Ee,Fe,kt,Wt,z.DEPTH_BUFFER_BIT,z.NEAREST);yt.bindFramebuffer(z.READ_FRAMEBUFFER,null),yt.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(nt!==0||C.isRenderTargetTexture||Rt.has(C)){const un=Rt.get(C),sn=Rt.get(et);yt.bindFramebuffer(z.READ_FRAMEBUFFER,gs),yt.bindFramebuffer(z.DRAW_FRAMEBUFFER,Pu);for(let On=0;On<Pt;On++)Ze?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,un.__webglTexture,nt,se+On):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,un.__webglTexture,nt),Bn?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,sn.__webglTexture,Ut,Je+On):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,sn.__webglTexture,Ut),nt!==0?z.blitFramebuffer(Jt,le,kt,Wt,Ee,Fe,kt,Wt,z.COLOR_BUFFER_BIT,z.NEAREST):Bn?z.copyTexSubImage3D(Ie,Ut,Ee,Fe,Je+On,Jt,le,kt,Wt):z.copyTexSubImage2D(Ie,Ut,Ee,Fe,Jt,le,kt,Wt);yt.bindFramebuffer(z.READ_FRAMEBUFFER,null),yt.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else Bn?C.isDataTexture||C.isData3DTexture?z.texSubImage3D(Ie,Ut,Ee,Fe,Je,kt,Wt,Pt,Ue,re,ze.data):et.isCompressedArrayTexture?z.compressedTexSubImage3D(Ie,Ut,Ee,Fe,Je,kt,Wt,Pt,Ue,ze.data):z.texSubImage3D(Ie,Ut,Ee,Fe,Je,kt,Wt,Pt,Ue,re,ze):C.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,Ut,Ee,Fe,kt,Wt,Ue,re,ze.data):C.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,Ut,Ee,Fe,ze.width,ze.height,Ue,ze.data):z.texSubImage2D(z.TEXTURE_2D,Ut,Ee,Fe,kt,Wt,Ue,re,ze);z.pixelStorei(z.UNPACK_ROW_LENGTH,Se),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,_n),z.pixelStorei(z.UNPACK_SKIP_PIXELS,ti),z.pixelStorei(z.UNPACK_SKIP_ROWS,Le),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Ca),Ut===0&&et.generateMipmaps&&z.generateMipmap(Ie),yt.unbindTexture()},this.initRenderTarget=function(C){Rt.get(C).__webglFramebuffer===void 0&&Zt.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?Zt.setTextureCube(C,0):C.isData3DTexture?Zt.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?Zt.setTexture2DArray(C,0):Zt.setTexture2D(C,0),yt.unbindTexture()},this.resetState=function(){H=0,B=0,q=null,yt.reset(),Vt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorSpace=Pe._getDrawingBufferColorSpace(e),i.unpackColorSpace=Pe._getUnpackColorSpace()}}const bx={type:"change"},tm={type:"start"},Oy={type:"end"},_u=new Nu,Tx=new os,dC=Math.cos(70*kb.DEG2RAD),xn=new st,Qn=2*Math.PI,qe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},qd=1e-6;class pC extends w1{constructor(e,i=null){super(e,i),this.state=qe.NONE,this.target=new st,this.cursor=new st,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:no.ROTATE,MIDDLE:no.DOLLY,RIGHT:no.PAN},this.touches={ONE:to.ROTATE,TWO:to.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new st,this._lastQuaternion=new Ks,this._lastTargetPosition=new st,this._quat=new Ks().setFromUnitVectors(e.up,new st(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Jv,this._sphericalDelta=new Jv,this._scale=1,this._panOffset=new st,this._rotateStart=new pe,this._rotateEnd=new pe,this._rotateDelta=new pe,this._panStart=new pe,this._panEnd=new pe,this._panDelta=new pe,this._dollyStart=new pe,this._dollyEnd=new pe,this._dollyDelta=new pe,this._dollyDirection=new st,this._mouse=new pe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=gC.bind(this),this._onPointerDown=mC.bind(this),this._onPointerUp=_C.bind(this),this._onContextMenu=bC.bind(this),this._onMouseWheel=yC.bind(this),this._onKeyDown=SC.bind(this),this._onTouchStart=MC.bind(this),this._onTouchMove=EC.bind(this),this._onMouseDown=vC.bind(this),this._onMouseMove=xC.bind(this),this._interceptControlDown=TC.bind(this),this._interceptControlUp=AC.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(bx),this.update(),this.state=qe.NONE}update(e=null){const i=this.object.position;xn.copy(i).sub(this.target),xn.applyQuaternion(this._quat),this._spherical.setFromVector3(xn),this.autoRotate&&this.state===qe.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let r=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(r)&&isFinite(l)&&(r<-Math.PI?r+=Qn:r>Math.PI&&(r-=Qn),l<-Math.PI?l+=Qn:l>Math.PI&&(l-=Qn),r<=l?this._spherical.theta=Math.max(r,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(r+l)/2?Math.max(r,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let f=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const h=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),f=h!=this._spherical.radius}if(xn.setFromSpherical(this._spherical),xn.applyQuaternion(this._quatInverse),i.copy(this.target).add(xn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let h=null;if(this.object.isPerspectiveCamera){const d=xn.length();h=this._clampDistance(d*this._scale);const g=d-h;this.object.position.addScaledVector(this._dollyDirection,g),this.object.updateMatrixWorld(),f=!!g}else if(this.object.isOrthographicCamera){const d=new st(this._mouse.x,this._mouse.y,0);d.unproject(this.object);const g=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),f=g!==this.object.zoom;const p=new st(this._mouse.x,this._mouse.y,0);p.unproject(this.object),this.object.position.sub(p).add(d),this.object.updateMatrixWorld(),h=xn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;h!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(h).add(this.object.position):(_u.origin.copy(this.object.position),_u.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(_u.direction))<dC?this.object.lookAt(this.target):(Tx.setFromNormalAndCoplanarPoint(this.object.up,this.target),_u.intersectPlane(Tx,this.target))))}else if(this.object.isOrthographicCamera){const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),h!==this.object.zoom&&(this.object.updateProjectionMatrix(),f=!0)}return this._scale=1,this._performCursorZoom=!1,f||this._lastPosition.distanceToSquared(this.object.position)>qd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>qd||this._lastTargetPosition.distanceToSquared(this.target)>qd?(this.dispatchEvent(bx),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Qn/60*this.autoRotateSpeed*e:Qn/60/60*this.autoRotateSpeed}_getZoomScale(e){const i=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*i)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,i){xn.setFromMatrixColumn(i,0),xn.multiplyScalar(-e),this._panOffset.add(xn)}_panUp(e,i){this.screenSpacePanning===!0?xn.setFromMatrixColumn(i,1):(xn.setFromMatrixColumn(i,0),xn.crossVectors(this.object.up,xn)),xn.multiplyScalar(e),this._panOffset.add(xn)}_pan(e,i){const r=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;xn.copy(l).sub(this.target);let f=xn.length();f*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*f/r.clientHeight,this.object.matrix),this._panUp(2*i*f/r.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/r.clientWidth,this.object.matrix),this._panUp(i*(this.object.top-this.object.bottom)/this.object.zoom/r.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,i){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const r=this.domElement.getBoundingClientRect(),l=e-r.left,f=i-r.top,h=r.width,d=r.height;this._mouse.x=l/h*2-1,this._mouse.y=-(f/d)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(Qn*this._rotateDelta.x/i.clientHeight),this._rotateUp(Qn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let i=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),i=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),i=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),i=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Qn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),i=!0;break}i&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._rotateStart.set(r,l)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panStart.set(r,l)}}_handleTouchStartDolly(e){const i=this._getSecondPointerPosition(e),r=e.pageX-i.x,l=e.pageY-i.y,f=Math.sqrt(r*r+l*l);this._dollyStart.set(0,f)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const r=this._getSecondPointerPosition(e),l=.5*(e.pageX+r.x),f=.5*(e.pageY+r.y);this._rotateEnd.set(l,f)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const i=this.domElement;this._rotateLeft(Qn*this._rotateDelta.x/i.clientHeight),this._rotateUp(Qn*this._rotateDelta.y/i.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),l=.5*(e.pageY+i.y);this._panEnd.set(r,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const i=this._getSecondPointerPosition(e),r=e.pageX-i.x,l=e.pageY-i.y,f=Math.sqrt(r*r+l*l);this._dollyEnd.set(0,f),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const h=(e.pageX+i.x)*.5,d=(e.pageY+i.y)*.5;this._updateZoomParameters(h,d)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId){this._pointers.splice(i,1);return}}_isTrackingPointer(e){for(let i=0;i<this._pointers.length;i++)if(this._pointers[i]==e.pointerId)return!0;return!1}_trackPointer(e){let i=this._pointerPositions[e.pointerId];i===void 0&&(i=new pe,this._pointerPositions[e.pointerId]=i),i.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const i=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[i]}_customWheelEvent(e){const i=e.deltaMode,r={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(i){case 1:r.deltaY*=16;break;case 2:r.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(r.deltaY*=10),r}}function mC(o){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(o.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(o)&&(this._addPointer(o),o.pointerType==="touch"?this._onTouchStart(o):this._onMouseDown(o)))}function gC(o){this.enabled!==!1&&(o.pointerType==="touch"?this._onTouchMove(o):this._onMouseMove(o))}function _C(o){switch(this._removePointer(o),this._pointers.length){case 0:this.domElement.releasePointerCapture(o.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Oy),this.state=qe.NONE;break;case 1:const e=this._pointers[0],i=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:i.x,pageY:i.y});break}}function vC(o){let e;switch(o.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case no.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(o),this.state=qe.DOLLY;break;case no.ROTATE:if(o.ctrlKey||o.metaKey||o.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(o),this.state=qe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(o),this.state=qe.ROTATE}break;case no.PAN:if(o.ctrlKey||o.metaKey||o.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(o),this.state=qe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(o),this.state=qe.PAN}break;default:this.state=qe.NONE}this.state!==qe.NONE&&this.dispatchEvent(tm)}function xC(o){switch(this.state){case qe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(o);break;case qe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(o);break;case qe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(o);break}}function yC(o){this.enabled===!1||this.enableZoom===!1||this.state!==qe.NONE||(o.preventDefault(),this.dispatchEvent(tm),this._handleMouseWheel(this._customWheelEvent(o)),this.dispatchEvent(Oy))}function SC(o){this.enabled!==!1&&this._handleKeyDown(o)}function MC(o){switch(this._trackPointer(o),this._pointers.length){case 1:switch(this.touches.ONE){case to.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(o),this.state=qe.TOUCH_ROTATE;break;case to.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(o),this.state=qe.TOUCH_PAN;break;default:this.state=qe.NONE}break;case 2:switch(this.touches.TWO){case to.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(o),this.state=qe.TOUCH_DOLLY_PAN;break;case to.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(o),this.state=qe.TOUCH_DOLLY_ROTATE;break;default:this.state=qe.NONE}break;default:this.state=qe.NONE}this.state!==qe.NONE&&this.dispatchEvent(tm)}function EC(o){switch(this._trackPointer(o),this.state){case qe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(o),this.update();break;case qe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(o),this.update();break;case qe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(o),this.update();break;case qe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(o),this.update();break;default:this.state=qe.NONE}}function bC(o){this.enabled!==!1&&o.preventDefault()}function TC(o){o.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function AC(o){o.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const RC=({N:o,internalOutputs:e,membraneOutputs:i,koList:r,importanceMap:l,inPortsFi:f,outPortsFi:h,onToggleKo:d,showImportance:g=!1})=>{const p=Ft.useRef(null),[x,m]=Ft.useState("SLICES"),[y,M]=Ft.useState("ALL"),[E,A]=Ft.useState(!1),[S,v]=Ft.useState(!0),[P,O]=Ft.useState(null),L=Ft.useRef(null),V=Ft.useRef(null),H=Ft.useRef(null),B=Ft.useRef(null),q=Ft.useRef(new Map),N=Ft.useRef(new Map),D=Ft.useRef(new R1);Ft.useRef(new pe);const X=new Set(r.map(Ct=>`${Ct.x},${Ct.y},${Ct.z}`)),lt=(Ct,U,tt,G)=>{const F=Math.max(0,Math.min(G-1,Math.round(U))),pt=Math.max(0,Math.min(G-1,Math.round(tt)));switch(Math.max(0,Math.min(5,Math.round(Ct)))){case 0:return{x:0,y:F,z:pt};case 1:return{x:G-1,y:F,z:pt};case 2:return{x:F,y:0,z:pt};case 3:return{x:F,y:G-1,z:pt};case 4:return{x:F,y:pt,z:0};case 5:return{x:F,y:pt,z:G-1};default:return{x:0,y:F,z:pt}}},gt=(Ct,U,tt,G,F)=>{const pt=Math.max(-1,Math.min(G,Math.round(U))),St=Math.max(-1,Math.min(G,Math.round(tt)));switch(Math.max(0,Math.min(5,Math.round(Ct)))){case 0:return{px:0,py:pt+1,pz:St+1};case 1:return{px:F-1,py:pt+1,pz:St+1};case 2:return{px:pt+1,py:0,pz:St+1};case 3:return{px:pt+1,py:F-1,pz:St+1};case 4:return{px:pt+1,py:St+1,pz:0};case 5:return{px:pt+1,py:St+1,pz:F-1};default:return{px:0,py:pt+1,pz:St+1}}},Mt=Ft.useMemo(()=>{if(!h||h.length===0)return[];const Ct=[{name:"⚡ 発電(+) 出力",shortName:"発電(+)",colorHex:3718648,colorStr:"#38bdf8"},{name:"⚡ 発電(-) 出力",shortName:"発電(-)",colorHex:16007006,colorStr:"#f43f5e"},{name:"🏃 推進速度 出力",shortName:"推進速度",colorHex:11032055,colorStr:"#a855f7"},{name:"🔄 旋回 出力",shortName:"旋回",colorHex:15381256,colorStr:"#eab308"}];return h.slice(0,4).map((U,tt)=>{const G=lt(U[0],U[1],U[2],o),F=Ct[tt]||{name:`出力 #${tt}`,shortName:`OUT${tt}`,colorHex:440020,colorStr:"#06b6d4"};return{index:tt,key:`${G.x},${G.y},${G.z}`,x:G.x,y:G.y,z:G.z,name:F.name,shortName:F.shortName,colorHex:F.colorHex,colorStr:F.colorStr}})},[h,o]),mt=Ft.useMemo(()=>{const Ct=new Map;return Mt.forEach(U=>Ct.set(U.key,U)),Ct},[Mt]),Z=Ft.useMemo(()=>{if(!f||f.length===0)return[];const Ct=o+2,U=[{name:"☀️ 太陽光入力",shortName:"太陽光",colorStr:"#f59e0b",icon:"☀️"},{name:"🔋 バッテリー入力",shortName:"バッテリー",colorStr:"#10b981",icon:"🔋"}];return f.slice(0,2).map((tt,G)=>{const F=gt(tt[0],tt[1],tt[2],o,Ct),pt=U[G]||{name:`入力 #${G}`,shortName:`IN${G}`,colorStr:"#38bdf8",icon:"⚡"};return{index:G,face:tt[0],u:tt[1],v:tt[2],px:F.px,py:F.py,pz:F.pz,name:pt.name,shortName:pt.shortName,colorStr:pt.colorStr,icon:pt.icon}})},[f,o]),ct=(Ct,U,tt,G,F)=>{if(U)return{backgroundColor:"rgba(153, 27, 27, 0.55)",borderColor:"#ef4444",boxShadow:"inset 0 0 10px rgba(239, 68, 68, 0.4)",color:"#fca5a5"};if(G&&tt!==void 0){const St=Math.max(0,Math.min(1,tt/.8)),Et=(1-St)*240;return{backgroundColor:`hsla(${Et}, 85%, 25%, 0.85)`,borderColor:`hsla(${Et}, 100%, 55%, 0.9)`,boxShadow:St>.4?`0 0 8px hsla(${Et}, 100%, 50%, 0.4)`:"none",color:"#ffffff"}}const pt=Math.max(-1,Math.min(1,Ct));if(Math.abs(pt)<.01)return{backgroundColor:"rgba(30, 41, 59, 0.65)",borderColor:F?F.colorStr:"rgba(51, 65, 85, 0.8)",boxShadow:F?`0 0 10px ${F.colorStr}44`:"none",color:"#94a3b8"};if(pt>0){const St=180-pt*40,Et=22+pt*25,ut=Math.min(12,pt*12);return{backgroundColor:`hsla(${St}, 85%, ${Et}%, 0.85)`,borderColor:F?F.colorStr:`hsla(${St}, 95%, 65%, 0.8)`,boxShadow:F?`0 0 12px ${F.colorStr}88`:`0 0 ${ut}px hsla(${St}, 100%, 50%, ${pt*.45})`,color:"#f8fafc"}}else{const St=-pt,Et=280,ut=18+St*20;return{backgroundColor:`hsla(${Et}, 75%, ${ut}%, 0.85)`,borderColor:F?F.colorStr:`hsla(${Et}, 85%, 60%, 0.7)`,boxShadow:F?`0 0 12px ${F.colorStr}88`:`0 0 ${St*8}px hsla(${Et}, 90%, 50%, ${St*.35})`,color:"#f1f5f9"}}};Ft.useEffect(()=>{if(!p.current)return;const Ct=p.current.clientWidth,U=p.current.clientHeight,tt=new g1;tt.background=new be(922399),L.current=tt;const G=new Ei(45,Ct/U,.1,100);G.position.set(o*2.2,o*1.8,o*2.5),H.current=G;const F=new hC({antialias:!0});F.setSize(Ct,U),F.setPixelRatio(window.devicePixelRatio),p.current.appendChild(F.domElement),V.current=F;const pt=new pC(G,F.domElement);pt.enableDamping=!0,pt.dampingFactor=.05,pt.target.set(0,0,0),B.current=pt;const St=new T1(16777215,.7);tt.add(St);const Et=new Zv(16777215,.8);Et.position.set(10,15,10),tt.add(Et);const ut=new Zv(3718648,.4);ut.position.set(-10,-5,-10),tt.add(ut);const Ot=new C1(o*1.5,o,1976635,988970);Ot.position.y=-o*.65,tt.add(Ot);const z=new Map,ne=1.15,qt=(o-1)*ne/2,Nt=new Js(.85,.85,.85),yt=new Js(.92,.92,.92),It=new Xv(yt);for(let $=0;$<o;$++)for(let ht=0;ht<o;ht++)for(let ot=0;ot<o;ot++){const Ht=new Yv({color:3359061,roughness:.3,metalness:.1,transparent:!0,opacity:.85}),_t=new Pi(Nt,Ht);_t.position.set(ot*ne-qt,ht*ne-qt,$*ne-qt),_t.userData={x:ot,y:ht,z:$};const Xt=new Xv(Nt),ee=new Ip(Xt,new Au({color:4674921,linewidth:1}));ee.name="normalEdge",_t.add(ee);const Dt=new Ip(It,new Au({color:16777215,transparent:!0,opacity:.9,linewidth:2}));Dt.name="outPortAccent",Dt.visible=!1,_t.add(Dt),tt.add(_t),z.set(`${ot},${ht},${$}`,_t)}q.current=z;const Rt=o+2,Zt=(Rt-1)*ne/2,me=new Jp(.18,16,16),he=new Map;for(let $=0;$<Rt;$++)for(let ht=0;ht<Rt;ht++)for(let ot=0;ot<Rt;ot++){if(ot>=1&&ot<=o&&ht>=1&&ht<=o&&$>=1&&$<=o)continue;const _t=new Yv({color:1976635,roughness:.3,metalness:.1,transparent:!0,opacity:.35}),Xt=new Pi(me,_t);Xt.position.set(ot*ne-Zt,ht*ne-Zt,$*ne-Zt),Xt.userData={isMembrane:!0,px:ot,py:ht,pz:$,x:ot-1,y:ht-1,z:$-1},tt.add(Xt),he.set(`${ot},${ht},${$}`,Xt)}N.current=he;let w;const b=()=>{w=requestAnimationFrame(b),pt.update(),F.render(tt,G)};b();const Y=()=>{if(!p.current||!F||!G)return;const $=p.current.clientWidth,ht=p.current.clientHeight;G.aspect=$/ht,G.updateProjectionMatrix(),F.setSize($,ht)};return window.addEventListener("resize",Y),()=>{cancelAnimationFrame(w),window.removeEventListener("resize",Y),F.dispose(),p.current&&F.domElement&&p.current.removeChild(F.domElement)}},[o]),Ft.useEffect(()=>{if(x==="3D"){const Ct=setTimeout(()=>{if(!p.current||!V.current||!H.current)return;const U=p.current.clientWidth,tt=p.current.clientHeight;U>0&&tt>0&&(H.current.aspect=U/tt,H.current.updateProjectionMatrix(),V.current.setSize(U,tt))},50);return()=>clearTimeout(Ct)}},[x]),Ft.useEffect(()=>{var F,pt,St,Et;const Ct=q.current;if(Ct.size===0)return;for(let ut=0;ut<o;ut++){const Ot=y==="ALL"||y===ut;for(let z=0;z<o;z++)for(let ne=0;ne<o;ne++){const qt=`${ne},${z},${ut}`,Nt=Ct.get(qt);if(!Nt)continue;const yt=mt.get(qt),It=Nt.getObjectByName("normalEdge"),Rt=Nt.getObjectByName("outPortAccent");if(!Ot)if(E){Nt.visible=!0;const Y=Nt.material;if(Y.transparent=!0,Y.opacity=.05,Y.emissiveIntensity=0,It&&It.material.color.setHex(1976635),Rt)if(yt){Rt.visible=!0;const $=Rt.material;$.color.setHex(yt.colorHex),$.opacity=.25}else Rt.visible=!1;continue}else{Nt.visible=!1,Rt&&(Rt.visible=!1);continue}Nt.visible=!0;const Zt=X.has(qt),me=e?((pt=(F=e[ut])==null?void 0:F[z])==null?void 0:pt[ne])??0:0,he=l?((Et=(St=l[ut])==null?void 0:St[z])==null?void 0:Et[ne])??0:0,w=Nt.material,b=It?It.material:null;if(yt&&Rt){Rt.visible=!0;const Y=Rt.material;Y.color.setHex(yt.colorHex),Y.opacity=.95,Nt.userData.outputPort=yt}else Rt&&(Rt.visible=!1),Nt.userData.outputPort=void 0;if(Zt)w.color.setHex(15680580),w.emissive.setHex(10033947),w.emissiveIntensity=.7,w.opacity=y==="ALL"?.45:.8,b&&b.color.setHex(16711680);else if(g&&l){const Y=Math.max(0,Math.min(1,he/.8)),$=new be;$.setHSL(.66*(1-Y),1,.4+.2*Y),w.color.copy($),w.emissive.copy($),w.emissiveIntensity=Y*.8,w.opacity=.9,b&&b.color.setHex(yt?yt.colorHex:6583435)}else{const Y=Math.max(-1,Math.min(1,me)),$=new be;if(Y>=0){const ht=.5-Y*.35,ot=.25+Y*.45;$.setHSL(ht,.9,ot),w.emissive.setHSL(ht,1,Y*.5),w.emissiveIntensity=Y*.7}else{const ht=-Y;$.setHSL(.8,.7,.2+ht*.3),w.emissive.setHSL(.8,.8,ht*.4),w.emissiveIntensity=ht*.5}if(yt){const ht=new be(yt.colorHex);w.emissive.lerp(ht,.4),w.emissiveIntensity=Math.max(.25,w.emissiveIntensity),b&&b.color.setHex(yt.colorHex)}else b&&b.color.setHex(y==="ALL"?4674921:3718648);w.color.copy($),w.opacity=y==="ALL"?.85:.95}}}const U=o+2,tt=new Map;if(f&&f.length>=1){const ut=gt(f[0][0],f[0][1],f[0][2],o,U);tt.set(`${ut.px},${ut.py},${ut.pz}`,{name:"☀️ 太陽光入力",color:16096779})}if(f&&f.length>=2){const ut=gt(f[1][0],f[1][1],f[1][2],o,U);tt.set(`${ut.px},${ut.py},${ut.pz}`,{name:"🔋 バッテリー入力",color:1096065})}const G=N.current;G&&G.size>0&&G.forEach((ut,Ot)=>{var Zt,me;if(!S){ut.visible=!1;return}const{px:z,py:ne,pz:qt}=ut.userData;if(!(y==="ALL"||qt===(typeof y=="number"?y+1:-1)))if(E){ut.visible=!0;const he=ut.material;he.opacity=.04,he.emissiveIntensity=0;return}else{ut.visible=!1;return}ut.visible=!0;const yt=ut.material,It=tt.get(Ot),Rt=((me=(Zt=i==null?void 0:i[qt])==null?void 0:Zt[ne])==null?void 0:me[z])??0;if(It){const he=Math.abs(Rt);yt.color.setHex(It.color),yt.emissive.setHex(It.color),yt.emissiveIntensity=.15+Math.min(1,he*1.5)*.85,yt.opacity=.6+Math.min(.4,he*.4),ut.userData.portName=It.name}else{if(Math.abs(Rt)<.005)yt.color.setHex(1976635),yt.emissive.setHex(0),yt.emissiveIntensity=0,yt.opacity=y==="ALL"?.3:.5;else if(Rt>0){const w=Math.min(1,Rt),b=.55-w*.1,Y=.3+w*.4;yt.color.setHSL(b,.9,Y),yt.emissive.setHSL(b,1,w*.6),yt.emissiveIntensity=Math.min(1,w*1.2),yt.opacity=.5+w*.45}else{const w=Math.min(1,-Rt);yt.color.setHSL(.78,.7,.2+w*.2),yt.emissive.setHSL(.78,.9,w*.4),yt.emissiveIntensity=Math.min(1,w*.8),yt.opacity=.4+w*.4}ut.userData.portName=void 0}})},[e,i,f,mt,r,l,g,o,y,E,S]);const Q=Ft.useRef(null),Tt=Ct=>{let U=Ct;for(;U;){if(U.userData&&typeof U.userData.x=="number")return{x:U.userData.x,y:U.userData.y,z:U.userData.z,outputPort:U.userData.outputPort};U=U.parent}return null},At=Ct=>{Ct.button===0&&(Q.current={x:Ct.clientX,y:Ct.clientY})},Yt=Ct=>{if(Ct.button!==0||!Q.current)return;const U=Math.abs(Ct.clientX-Q.current.x),tt=Math.abs(Ct.clientY-Q.current.y);if(Q.current=null,U>5||tt>5||!p.current||!H.current||!L.current)return;const G=p.current.getBoundingClientRect(),F=(Ct.clientX-G.left)/G.width*2-1,pt=-((Ct.clientY-G.top)/G.height)*2+1;D.current.setFromCamera(new pe(F,pt),H.current);const St=Array.from(q.current.values()).filter(ut=>ut.visible),Et=D.current.intersectObjects(St,!1);if(Et.length>0){const ut=Tt(Et[0].object);ut&&d(ut.x,ut.y,ut.z)}},oe=Ct=>{var ut,Ot,z,ne,qt,Nt;if(!p.current||!H.current||!L.current)return;const U=p.current.getBoundingClientRect(),tt=(Ct.clientX-U.left)/U.width*2-1,G=-((Ct.clientY-U.top)/U.height)*2+1;D.current.setFromCamera(new pe(tt,G),H.current);const F=Array.from(q.current.values()).filter(yt=>yt.visible),pt=S?Array.from(N.current.values()).filter(yt=>yt.visible):[],St=[...F,...pt],Et=D.current.intersectObjects(St,!1);if(Et.length>0){const yt=Et[0].object,It=yt.userData;if(It&&It.isMembrane){const Zt=((Ot=(ut=i==null?void 0:i[It.pz])==null?void 0:ut[It.py])==null?void 0:Ot[It.px])??0;O({x:It.x,y:It.y,z:It.z,val:Zt,isKo:!1,isMembrane:!0,portName:It.portName,portColor:"#f59e0b"});return}const Rt=Tt(yt);if(Rt){const{x:Zt,y:me,z:he}=Rt,w=`${Zt},${me},${he}`,b=e?((ne=(z=e[he])==null?void 0:z[me])==null?void 0:ne[Zt])??0:0,Y=l?(Nt=(qt=l[he])==null?void 0:qt[me])==null?void 0:Nt[Zt]:void 0,$=mt.get(w);O({x:Zt,y:me,z:he,val:b,isKo:X.has(w),importance:Y,isMembrane:!1,portName:$?$.name:void 0,portColor:$?$.colorStr:void 0});return}}O(null)};return R.jsxs("div",{className:"relative w-full h-full select-none flex flex-col",children:[R.jsx("div",{ref:p,className:"w-full h-full cursor-pointer",style:{display:x==="3D"?"block":"none"},onPointerDown:At,onPointerUp:Yt,onPointerMove:oe}),x==="SLICES"&&R.jsx("div",{className:"w-full h-full p-4 overflow-y-auto flex flex-col items-center justify-center bg-[#0a0d14]",children:R.jsx("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl w-full my-auto",children:Array.from({length:o},(Ct,U)=>{const tt=Mt.filter(F=>F.z===U),G=Z.filter(F=>F.pz===U+1);return R.jsxs("div",{className:"bg-slate-900/85 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex flex-col items-center relative group hover:border-slate-600 transition",children:[R.jsxs("div",{className:"flex items-center justify-between w-full pb-2 mb-2.5 border-b border-slate-800",children:[R.jsxs("div",{className:"flex items-center gap-2",children:[R.jsxs("span",{className:"font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm",children:["Z = ",U]}),R.jsx("span",{className:"text-[11px] text-slate-400 font-medium",children:U===0?"底面 (Bottom)":U===o-1?"天面 (Top)":`中間層 Z=${U}`})]}),R.jsxs("div",{className:"flex items-center gap-1",children:[G.map(F=>R.jsxs("span",{className:"text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5",style:{color:F.colorStr,borderColor:`${F.colorStr}55`,backgroundColor:`${F.colorStr}18`},title:`${F.name} がこのZ=${U}層の外周に接続`,children:[F.icon," ",F.shortName]},F.index)),tt.map(F=>R.jsx("span",{className:"text-[9px] font-bold px-1.5 py-0.5 rounded border",style:{color:F.colorStr,borderColor:`${F.colorStr}66`,backgroundColor:`${F.colorStr}22`},title:F.name,children:F.shortName},F.index))]})]}),R.jsx("div",{className:"flex flex-col gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80",children:Array.from({length:o},(F,pt)=>{const St=o-1-pt;return R.jsx("div",{className:"flex gap-1.5 justify-center",children:Array.from({length:o},(Et,ut)=>{var It,Rt,Zt,me;const Ot=`${ut},${St},${U}`,z=e?((Rt=(It=e[U])==null?void 0:It[St])==null?void 0:Rt[ut])??0:0,ne=l?(me=(Zt=l[U])==null?void 0:Zt[St])==null?void 0:me[ut]:void 0,qt=X.has(Ot),Nt=mt.get(Ot),yt=ct(z,qt,ne,g,Nt);return R.jsxs("button",{onClick:()=>d(ut,St,U),onMouseEnter:()=>O({x:ut,y:St,z:U,val:z,isKo:qt,importance:ne,isMembrane:!1,portName:Nt?Nt.name:void 0,portColor:Nt?Nt.colorStr:void 0}),onMouseLeave:()=>O(null),className:`relative flex flex-col items-center justify-between p-1 rounded-lg border transition-all transform active:scale-95 hover:scale-105 cursor-pointer aspect-square w-12 h-12 md:w-14 md:h-14 select-none ${Nt?"ring-2 ring-offset-1 ring-offset-slate-900 shadow-lg":""}`,style:{...yt,ringColor:Nt?Nt.colorStr:void 0},title:`[x:${ut}, y:${St}, z:${U}] 電位: ${z.toFixed(3)}${Nt?` (${Nt.name})`:""} - クリックでKO切替`,children:[R.jsxs("div",{className:"flex items-center justify-between w-full text-[9px] font-mono leading-none",children:[R.jsxs("span",{className:"opacity-60",children:[ut,",",St]}),Nt&&R.jsx("span",{className:"font-bold text-[8px] px-1 rounded",style:{backgroundColor:`${Nt.colorStr}33`,color:Nt.colorStr},children:Nt.shortName})]}),R.jsx("div",{className:"font-mono font-bold text-xs tracking-tight",children:qt?R.jsx("span",{className:"text-rose-400 flex items-center justify-center font-bold text-base leading-none",children:"✕"}):R.jsx("span",{children:z>=0?`+${z.toFixed(2)}`:z.toFixed(2)})}),R.jsx("div",{className:"w-full text-center text-[8px] leading-none opacity-50 font-mono",children:qt?"KO":""})]},Ot)})},St)})}),R.jsxs("div",{className:"flex items-center justify-between w-full mt-2 text-[10px] text-slate-500 font-mono px-1",children:[R.jsx("span",{children:"↑ +Y (y=3)"}),R.jsx("span",{children:"X: 0 → 3 →"})]})]},U)})})}),R.jsxs("div",{className:"absolute top-4 right-4 flex items-center space-x-2 z-20",children:[R.jsxs("div",{className:"bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-xl p-1 flex items-center space-x-1 shadow-xl text-xs",children:[R.jsxs("button",{onClick:()=>m("SLICES"),className:`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition text-xs ${x==="SLICES"?"bg-sky-500 text-white shadow-sm":"text-slate-300 hover:bg-slate-800"}`,title:"Z=0〜3の4つの層を平面マトリックスとしてまとめて同時表示",children:[R.jsx(YE,{className:"w-3.5 h-3.5"}),R.jsx("span",{children:"⊞ 4スライス平面"})]}),R.jsxs("button",{onClick:()=>m("3D"),className:`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition text-xs ${x==="3D"?"bg-sky-500 text-white shadow-sm":"text-slate-300 hover:bg-slate-800"}`,title:"3D空間内でボクセルキューブを立体表示",children:[R.jsx(BE,{className:"w-3.5 h-3.5"}),R.jsx("span",{children:"🧊 3D 立体"})]})]}),x==="3D"&&R.jsxs("div",{className:"bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-xl p-1.5 flex items-center space-x-1.5 shadow-xl text-xs",children:[R.jsxs("div",{className:"flex items-center space-x-1 px-2 py-0.5 text-slate-400 font-medium border-r border-slate-800",children:[R.jsx(XE,{className:"w-3.5 h-3.5 text-sky-400"}),R.jsx("span",{children:"層:"})]}),R.jsx("button",{onClick:()=>M("ALL"),className:`px-2 py-1 rounded-lg font-medium transition text-xs ${y==="ALL"?"bg-sky-500 text-white shadow-sm font-semibold":"text-slate-300 hover:bg-slate-800"}`,title:"全層を3D表示",children:"全層"}),Array.from({length:o},(Ct,U)=>R.jsxs("button",{onClick:()=>M(U),className:`px-2 py-1 rounded-lg font-mono font-medium transition text-xs ${y===U?"bg-sky-500 text-white shadow-sm font-bold ring-1 ring-sky-300/50":"text-slate-300 hover:bg-slate-800"}`,title:`Z = ${U} 層のみ3Dスライス表示`,children:["Z=",U]},U)),y!=="ALL"&&R.jsxs("button",{onClick:()=>A(!E),className:`flex items-center space-x-1 px-2 py-1 rounded-lg transition ml-1 text-xs border ${E?"bg-slate-800 text-sky-300 border-sky-500/40 shadow-sm":"bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300"}`,title:E?"他層を完全に非表示にする":"他層をうっすら半透明で残す（ゴースト表示）",children:[E?R.jsx(VE,{className:"w-3.5 h-3.5 text-sky-400"}):R.jsx(GE,{className:"w-3.5 h-3.5 text-slate-500"}),R.jsx("span",{className:"text-[11px]",children:"ゴースト"})]}),R.jsx("div",{className:"h-4 w-px bg-slate-800 mx-1"}),R.jsxs("button",{onClick:()=>v(!S),className:`flex items-center space-x-1 px-2 py-1 rounded-lg transition text-xs border font-medium ${S?"bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm":"bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"}`,title:"外周膜（入力ポート・球体）の表示/非表示を切り替え",children:[R.jsx(gv,{className:`w-3.5 h-3.5 ${S?"text-sky-400":"text-slate-500"}`}),R.jsx("span",{children:"膜"})]})]})]}),P&&R.jsxs("div",{className:"absolute top-4 left-4 bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none z-30 max-w-[280px]",children:[R.jsxs("div",{className:"font-semibold flex items-center justify-between gap-1.5",children:[P.isMembrane?R.jsxs("span",{className:"text-sky-300 flex items-center gap-1",children:[R.jsx(gv,{className:"w-3.5 h-3.5 text-sky-400"}),"外周膜 [",P.x,", ",P.y,", ",P.z,"]"]}):R.jsxs("span",{className:"text-sky-400 flex items-center gap-1",children:["ニューロン [",P.x,", ",P.y,", ",P.z,"]"]}),P.portName&&R.jsx("span",{className:"text-[10px] px-1.5 py-0.5 rounded font-sans font-bold border",style:{backgroundColor:`${P.portColor||"#38bdf8"}22`,color:P.portColor||"#38bdf8",borderColor:`${P.portColor||"#38bdf8"}66`},children:P.portName})]}),R.jsxs("div",{className:"text-slate-300 mt-1",children:["電位・出力値: ",R.jsx("span",{className:"font-mono text-emerald-400 font-bold",children:P.val.toFixed(3)})]}),!P.isMembrane&&P.importance!==void 0&&R.jsxs("div",{className:"text-slate-300",children:["KO影響度: ",R.jsxs("span",{className:"font-mono text-rose-400 font-bold",children:["-",P.importance.toFixed(4)]})]}),!P.isMembrane&&R.jsx("div",{className:"mt-1",children:P.isKo?R.jsxs("span",{className:"text-rose-400 font-bold bg-rose-950/60 border border-rose-800 px-1.5 py-0.5 rounded flex items-center gap-1",children:[R.jsx(Yx,{className:"w-3 h-3"})," KO (無効化中) - クリックで復帰"]}):R.jsxs("span",{className:"text-slate-400",children:["クリックで ",R.jsx("span",{className:"text-rose-400 font-semibold",children:"KO無効化"})]})})]}),Mt.length>0&&R.jsxs("div",{className:"absolute bottom-10 left-4 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-xl p-2.5 shadow-xl z-20 text-xs flex flex-col gap-1.5 min-w-[210px]",children:[R.jsxs("div",{className:"text-[11px] font-semibold text-slate-400 flex items-center justify-between border-b border-slate-800 pb-1",children:[R.jsxs("span",{className:"flex items-center gap-1 text-slate-300",children:[R.jsx(ny,{className:"w-3.5 h-3.5 text-amber-400"}),"表面出力ニューロン (4ポート)"]}),R.jsx("span",{className:"text-[10px] text-slate-500 font-mono",children:"二重枠で強調"})]}),R.jsx("div",{className:"grid grid-cols-2 gap-1.5",children:Mt.map(Ct=>{var G,F;const U=((F=(G=e==null?void 0:e[Ct.z])==null?void 0:G[Ct.y])==null?void 0:F[Ct.x])??0,tt=y==="ALL"||y===Ct.z;return R.jsxs("button",{onClick:()=>{x==="3D"&&M(Ct.z)},className:`flex flex-col text-left p-1.5 rounded-lg border transition ${x==="SLICES"||tt?"bg-slate-800/80 hover:bg-slate-700/80":"bg-slate-900/60 opacity-60 hover:opacity-100 hover:bg-slate-800/50"}`,style:{borderColor:Ct.colorStr?`${Ct.colorStr}66`:"#334155"},title:`出力ポート: ${Ct.name} (座標: [${Ct.x}, ${Ct.y}, ${Ct.z}])`,children:[R.jsxs("div",{className:"flex items-center justify-between w-full",children:[R.jsx("span",{className:"text-[10px] font-bold",style:{color:Ct.colorStr},children:Ct.shortName}),R.jsxs("span",{className:"text-[9px] font-mono text-slate-400",children:["[",Ct.x,",",Ct.y,",",Ct.z,"]"]})]}),R.jsxs("div",{className:"flex items-center justify-between mt-0.5",children:[R.jsxs("span",{className:"text-[9px] text-slate-400",children:["Z=",Ct.z]}),R.jsx("span",{className:"text-[10px] font-mono font-bold text-slate-200",children:U.toFixed(2)})]})]},Ct.index)})})]}),R.jsx("div",{className:"absolute bottom-2 left-4 text-[11px] text-slate-500 pointer-events-none z-20",children:x==="3D"?"左ドラッグ: 回転 ｜ 右ドラッグ: パン ｜ ホイール: ズーム ｜ 左クリック: セルKO切替":"各セルをクリック: KO切替 (無効化/復帰) ｜ ホバー: 電位・ポート詳細"})]})},CC=({sunlight:o,generatorPower:e,energy:i,innerStep:r})=>{const l=Ft.useRef(null),f=Ft.useRef({step:[],sun:[],gen:[],energy:[]}),h=250;return Ft.useEffect(()=>{const d=f.current;d.step.push(r),d.sun.push(o),d.gen.push(e),d.energy.push(i),d.step.length>h&&(d.step.shift(),d.sun.shift(),d.gen.shift(),d.energy.shift())},[r,o,e,i]),Ft.useEffect(()=>{const d=l.current;if(!d)return;const g=d.getContext("2d");if(!g)return;let p;const x=()=>{const m=d.width,y=d.height,M=f.current,E=M.step.length;g.clearRect(0,0,m,y),g.strokeStyle="#1e293b",g.lineWidth=1,g.beginPath();for(let S=.25;S<1;S+=.25){const v=y*S;g.moveTo(0,v),g.lineTo(m,v)}if(g.stroke(),E<2){p=requestAnimationFrame(x);return}const A=(S,v,P)=>{g.beginPath(),g.strokeStyle=v,g.lineWidth=2;for(let O=0;O<E;O++){const L=O/(h-1)*m,V=y-S[O]*(y-10)-5;O===0?g.moveTo(L,V):g.lineTo(L,V)}if(g.stroke(),P){g.lineTo((E-1)/(h-1)*m,y),g.lineTo(0,y),g.closePath();const O=g.createLinearGradient(0,0,0,y);O.addColorStop(0,v.replace(")",", 0.25)").replace("rgb","rgba")),O.addColorStop(1,"rgba(0,0,0,0)"),g.fillStyle=O,g.fill()}};A(M.sun,"#eab308"),A(M.gen,"#10b981",!0),A(M.energy,"#38bdf8"),p=requestAnimationFrame(x)};return x(),()=>cancelAnimationFrame(p)},[]),R.jsxs("div",{className:"flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl p-3 shadow-lg",children:[R.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-slate-800 mb-2",children:[R.jsx("span",{className:"text-xs font-semibold text-slate-300",children:"📊 リアルタイム波形モニター"}),R.jsxs("div",{className:"flex items-center space-x-3 text-[11px] font-mono",children:[R.jsxs("span",{className:"flex items-center text-yellow-400",children:[R.jsx("span",{className:"w-2 h-2 rounded-full bg-yellow-400 inline-block mr-1"}),"☀️ 太陽光: ",o.toFixed(2)]}),R.jsxs("span",{className:"flex items-center text-emerald-400",children:[R.jsx("span",{className:"w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1"}),"⚡ 発電量: ",e.toFixed(2)]}),R.jsxs("span",{className:"flex items-center text-sky-400 font-bold",children:[R.jsx("span",{className:"w-2 h-2 rounded-full bg-sky-400 inline-block mr-1"}),"🔋 バッテリー: ",(i*100).toFixed(1),"%"]})]})]}),R.jsx("div",{className:"flex-1 w-full relative min-h-[110px]",children:R.jsx("canvas",{ref:l,width:600,height:160,className:"w-full h-full block"})})]})},wC=({pos:o,angle:e,obj:i})=>{const r=Ft.useRef(null);return Ft.useEffect(()=>{const l=r.current;if(!l)return;const f=l.getContext("2d");if(!f)return;const h=l.width,d=l.height,g=h/2,p=d/2,x=h/5;f.clearRect(0,0,h,d),f.strokeStyle="#1e293b",f.lineWidth=1,[.5,1,1.5,2].forEach(A=>{f.beginPath(),f.arc(g,p,A*x,0,Math.PI*2),f.stroke()}),f.beginPath(),f.moveTo(g,0),f.lineTo(g,d),f.moveTo(0,p),f.lineTo(h,p),f.stroke();const m=g+i[0]*x,y=p-i[1]*x;f.fillStyle="#f43f5e",f.beginPath(),f.arc(m,y,5,0,Math.PI*2),f.fill(),f.strokeStyle="#fda4af",f.lineWidth=1.5,f.stroke();const M=g+o[0]*x,E=p-o[1]*x;f.save(),f.translate(M,E),f.rotate(-e),f.fillStyle="#38bdf8",f.beginPath(),f.moveTo(8,0),f.lineTo(-6,-5),f.lineTo(-4,0),f.lineTo(-6,5),f.closePath(),f.fill(),f.strokeStyle="#bae6fd",f.lineWidth=1.5,f.stroke(),f.restore()},[o,e,i]),R.jsxs("div",{className:"flex flex-col items-center justify-center p-2 bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg",children:[R.jsx("div",{className:"text-[11px] font-semibold text-slate-400 mb-1 w-full text-left",children:"🧭 アリーナ (Pos & Obj)"}),R.jsx("div",{className:"relative",children:R.jsx("canvas",{ref:r,width:130,height:130,className:"rounded-full bg-slate-950/60 border border-slate-800/80"})}),R.jsxs("div",{className:"flex justify-between w-full mt-1 px-1 font-mono text-[10px] text-slate-400",children:[R.jsxs("span",{children:["P: (",o[0].toFixed(2),", ",o[1].toFixed(2),")"]}),R.jsxs("span",{className:"text-rose-400",children:["Obj: (",i[0].toFixed(2),", ",i[1].toFixed(2),")"]})]})]})},DC=({koList:o,onToggleKo:e,onClearKo:i,onRunScan:r,isScanning:l,scanProgress:f,scanResult:h,showImportance:d,onToggleShowImportance:g})=>R.jsxs("div",{className:"flex flex-col h-full bg-slate-900 border-l border-slate-800 p-4 w-80 text-xs shadow-xl select-none",children:[R.jsxs("div",{className:"flex items-center justify-between pb-3 border-b border-slate-800",children:[R.jsxs("div",{className:"flex items-center space-x-2",children:[R.jsx(Yx,{className:"w-4 h-4 text-rose-400"}),R.jsx("h2",{className:"font-bold text-slate-100 text-sm",children:"KO (ノックアウト) 実験"})]}),o.length>0&&R.jsx("button",{onClick:i,className:"text-[11px] text-rose-400 hover:text-rose-300 font-medium transition",children:"全解除"})]}),R.jsxs("div",{className:"my-3",children:[R.jsx("div",{className:"text-[11px] text-slate-400 font-semibold mb-1.5 flex items-center justify-between",children:R.jsxs("span",{children:["無効化中のニューロン (",o.length,")"]})}),o.length===0?R.jsxs("div",{className:"text-slate-500 bg-slate-950/40 border border-slate-800/80 rounded-lg p-2.5 text-center text-[11px]",children:["KO中のセルはありません。",R.jsx("br",{}),"3D脳のセルをクリックして無効化できます。"]}):R.jsx("div",{className:"flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-950/40 border border-slate-800/80 rounded-lg",children:o.map(p=>R.jsxs("span",{className:"inline-flex items-center space-x-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono text-[10px]",children:[R.jsxs("span",{children:["[",p.x,",",p.y,",",p.z,"]"]}),R.jsx("button",{onClick:()=>e(p.x,p.y,p.z),className:"hover:text-white",children:R.jsx(Gp,{className:"w-3 h-3"})})]},`${p.x},${p.y},${p.z}`))})]}),R.jsxs("div",{className:"pt-2 border-t border-slate-800 flex-1 flex flex-col min-h-0",children:[R.jsx("div",{className:"flex items-center justify-between mb-2",children:R.jsxs("span",{className:"font-semibold text-slate-200 flex items-center gap-1",children:[R.jsx(ny,{className:"w-3.5 h-3.5 text-amber-400"}),"全セル重要度診断スキャン"]})}),R.jsxs("button",{onClick:r,disabled:l,className:"w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white font-medium py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition shadow",children:[R.jsx(KE,{className:"w-4 h-4"}),R.jsx("span",{children:l?"全探索スキャン実行中...":"全セル自動KOスキャン実行"})]}),l&&f&&R.jsxs("div",{className:"mt-2.5 bg-slate-950 border border-slate-800 p-2.5 rounded-lg",children:[R.jsxs("div",{className:"flex justify-between text-[11px] text-slate-300 mb-1",children:[R.jsxs("span",{children:["進捗: ",f.current," / ",f.total," セル"]}),R.jsxs("span",{className:"font-mono",children:[Math.round(f.current/f.total*100),"%"]})]}),R.jsx("div",{className:"w-full bg-slate-800 h-1.5 rounded-full overflow-hidden",children:R.jsx("div",{className:"bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-150",style:{width:`${f.current/f.total*100}%`}})})]}),h&&!l&&R.jsxs("div",{className:"mt-3 flex-1 flex flex-col min-h-0",children:[R.jsxs("div",{className:"flex items-center justify-between pb-1.5 text-[11px]",children:[R.jsxs("span",{className:"text-slate-400",children:["基準E: ",R.jsx("span",{className:"text-sky-400 font-mono font-bold",children:h.base_energy.toFixed(3)})]}),R.jsxs("label",{className:"flex items-center space-x-1 cursor-pointer",children:[R.jsx("input",{type:"checkbox",checked:d,onChange:p=>g(p.target.checked),className:"accent-rose-500 rounded"}),R.jsx("span",{className:"text-slate-300 text-[10px]",children:"3Dヒートマップ"})]})]}),R.jsx("div",{className:"flex-1 overflow-y-auto bg-slate-950/60 border border-slate-800 rounded-lg",children:R.jsxs("table",{className:"w-full text-left border-collapse",children:[R.jsx("thead",{className:"bg-slate-900/90 sticky top-0 text-[10px] text-slate-400 border-b border-slate-800",children:R.jsxs("tr",{children:[R.jsx("th",{className:"py-1.5 px-2",children:"順位"}),R.jsx("th",{className:"py-1.5 px-2",children:"セル [X,Y,Z]"}),R.jsx("th",{className:"py-1.5 px-2 text-right",children:"低下度 (Drop)"}),R.jsx("th",{className:"py-1.5 px-2 text-right",children:"KO後E"})]})}),R.jsx("tbody",{className:"divide-y divide-slate-800/60 font-mono text-[11px]",children:h.rankings.slice(0,15).map(p=>{const x=p.drop>.1;return R.jsxs("tr",{onClick:()=>e(p.x,p.y,p.z),className:"hover:bg-slate-800/50 cursor-pointer transition",children:[R.jsx("td",{className:"py-1.5 px-2 font-bold text-slate-400",children:p.rank<=3?R.jsxs("span",{className:"text-amber-400",children:["#",p.rank]}):`#${p.rank}`}),R.jsxs("td",{className:"py-1.5 px-2 text-slate-200",children:["[",p.x,",",p.y,",",p.z,"]"]}),R.jsxs("td",{className:`py-1.5 px-2 text-right font-bold ${x?"text-rose-400":"text-slate-400"}`,children:["-",p.drop.toFixed(3)]}),R.jsx("td",{className:"py-1.5 px-2 text-right text-slate-400",children:p.ko_energy.toFixed(3)})]},`${p.x},${p.y},${p.z}`)})})]})}),R.jsx("div",{className:"text-[10px] text-slate-500 mt-1 text-center",children:"リストをクリックするとそのセルを KO/復帰 できます"})]})]})]}),NC=({isOpen:o,onClose:e,onConfigSaved:i})=>{const[r,l]=Ft.useState(null),[f,h]=Ft.useState(!1),[d,g]=Ft.useState(!1),[p,x]=Ft.useState(null);Ft.useEffect(()=>{o&&(m(),g(!1),x(null))},[o]);const m=async()=>{h(!0);try{const E=window.location.host.includes(":3000")?"http://localhost:8000":"",A=await fetch(`${E}/api/config`);if(A.ok){const S=await A.json();l(S)}else x("設定の取得に失敗しました。")}catch(E){x(E.message||"通信エラー")}finally{h(!1)}},y=async()=>{if(r){h(!0),x(null);try{const E=window.location.host.includes(":3000")?"http://localhost:8000":"";(await fetch(`${E}/api/config`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).ok?(g(!0),i&&i(),setTimeout(()=>g(!1),2500)):x("設定の保存に失敗しました。")}catch(E){x(E.message||"通信エラー")}finally{h(!1)}}},M=(E,A)=>{r&&l({...r,[E]:A})};return o?R.jsx("div",{className:"fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4",children:R.jsxs("div",{className:"bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",children:[R.jsxs("div",{className:"px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90",children:[R.jsxs("div",{className:"flex items-center space-x-2",children:[R.jsx(Zx,{className:"w-5 h-5 text-sky-400"}),R.jsx("h2",{className:"text-base font-bold text-slate-100",children:"sim_config.py 編集"})]}),R.jsx("button",{onClick:e,className:"text-slate-400 hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-800",children:R.jsx(Gp,{className:"w-5 h-5"})})]}),R.jsxs("div",{className:"p-5 overflow-y-auto space-y-4 flex-1 text-xs",children:[p&&R.jsxs("div",{className:"flex items-center space-x-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-lg",children:[R.jsx(HE,{className:"w-4 h-4 flex-shrink-0"}),R.jsx("span",{children:p})]}),d&&R.jsxs("div",{className:"flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-lg",children:[R.jsx(FE,{className:"w-4 h-4 flex-shrink-0"}),R.jsx("span",{children:"設定を sim_config.py に保存し、即時適用しました！"})]}),r?R.jsxs("div",{className:"space-y-4",children:[R.jsxs("div",{className:"bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3",children:[R.jsx("div",{className:"font-semibold text-slate-300 border-b border-slate-800 pb-1",children:"🔌 入出力ポート数 (固定長スロット)"}),R.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[R.jsxs("div",{children:[R.jsx("label",{className:"text-slate-400 block mb-1",children:"NUM_IN_PORTS (入力)"}),R.jsx("input",{type:"number",min:"1",max:"6",value:r.NUM_IN_PORTS,onChange:E=>M("NUM_IN_PORTS",parseInt(E.target.value)||2),className:"w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-slate-200"})]}),R.jsxs("div",{children:[R.jsx("label",{className:"text-slate-400 block mb-1",children:"NUM_OUT_PORTS (出力)"}),R.jsx("input",{type:"number",min:"1",max:"6",value:r.NUM_OUT_PORTS,onChange:E=>M("NUM_OUT_PORTS",parseInt(E.target.value)||4),className:"w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-slate-200"})]})]})]}),R.jsxs("div",{className:"bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3",children:[R.jsx("div",{className:"font-semibold text-slate-300 border-b border-slate-800 pb-1",children:"☀️ 太陽光・代謝・エネルギー収支"}),R.jsxs("div",{children:[R.jsxs("div",{className:"flex justify-between text-slate-400 mb-1",children:[R.jsx("span",{children:"INITIAL_ENERGY (初期エネルギー)"}),R.jsx("span",{className:"font-mono text-sky-400 font-bold",children:r.INITIAL_ENERGY.toFixed(3)})]}),R.jsx("input",{type:"range",min:"0.05",max:"1.0",step:"0.05",value:r.INITIAL_ENERGY,onChange:E=>M("INITIAL_ENERGY",parseFloat(E.target.value)),className:"w-full accent-sky-500"})]}),R.jsxs("div",{children:[R.jsxs("div",{className:"flex justify-between text-slate-400 mb-1",children:[R.jsx("span",{children:"METABOLIC_COST (毎tickの基礎代謝)"}),R.jsx("span",{className:"font-mono text-rose-400 font-bold",children:r.METABOLIC_COST.toFixed(5)})]}),R.jsx("input",{type:"range",min:"0.0001",max:"0.005",step:"0.0001",value:r.METABOLIC_COST,onChange:E=>M("METABOLIC_COST",parseFloat(E.target.value)),className:"w-full accent-rose-500"})]}),R.jsxs("div",{children:[R.jsxs("div",{className:"flex justify-between text-slate-400 mb-1",children:[R.jsx("span",{children:"GEN_COST_RATE (発電稼働コスト係数)"}),R.jsx("span",{className:"font-mono text-amber-400 font-bold",children:r.GEN_COST_RATE.toFixed(4)})]}),R.jsx("input",{type:"range",min:"0.001",max:"0.02",step:"0.001",value:r.GEN_COST_RATE,onChange:E=>M("GEN_COST_RATE",parseFloat(E.target.value)),className:"w-full accent-amber-500"})]}),R.jsxs("div",{children:[R.jsxs("div",{className:"flex justify-between text-slate-400 mb-1",children:[R.jsx("span",{children:"SOLAR_GAIN_RATE (太陽光発電ゲイン)"}),R.jsx("span",{className:"font-mono text-emerald-400 font-bold",children:r.SOLAR_GAIN_RATE.toFixed(4)})]}),R.jsx("input",{type:"range",min:"0.002",max:"0.05",step:"0.001",value:r.SOLAR_GAIN_RATE,onChange:E=>M("SOLAR_GAIN_RATE",parseFloat(E.target.value)),className:"w-full accent-emerald-500"})]}),R.jsxs("div",{children:[R.jsxs("div",{className:"flex justify-between text-slate-400 mb-1",children:[R.jsx("span",{children:"SUN_CYCLE_PERIOD (昼夜半周期 tick)"}),R.jsxs("span",{className:"font-mono text-yellow-400 font-bold",children:[r.SUN_CYCLE_PERIOD.toFixed(0)," tick"]})]}),R.jsx("input",{type:"range",min:"10",max:"200",step:"5",value:r.SUN_CYCLE_PERIOD,onChange:E=>M("SUN_CYCLE_PERIOD",parseFloat(E.target.value)),className:"w-full accent-yellow-500"})]})]}),R.jsxs("div",{className:"bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3",children:[R.jsx("div",{className:"font-semibold text-slate-300 border-b border-slate-800 pb-1",children:"🧭 身体運動ゲイン"}),R.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[R.jsxs("div",{children:[R.jsx("label",{className:"text-slate-400 block mb-1",children:"SPEED_GAIN (速度)"}),R.jsx("input",{type:"number",step:"0.01",value:r.SPEED_GAIN,onChange:E=>M("SPEED_GAIN",parseFloat(E.target.value)||.05),className:"w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-slate-200"})]}),R.jsxs("div",{children:[R.jsx("label",{className:"text-slate-400 block mb-1",children:"ROTATE_GAIN (旋回)"}),R.jsx("input",{type:"number",step:"0.01",value:r.ROTATE_GAIN,onChange:E=>M("ROTATE_GAIN",parseFloat(E.target.value)||.1),className:"w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-slate-200"})]})]})]})]}):R.jsx("div",{className:"text-center py-8 text-slate-500",children:"読み込み中..."})]}),R.jsxs("div",{className:"px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end space-x-2",children:[R.jsx("button",{onClick:e,className:"px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition",children:"閉じる"}),R.jsxs("button",{onClick:y,disabled:f||!r,className:"px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition flex items-center space-x-1.5 shadow",children:[R.jsx(WE,{className:"w-4 h-4"}),R.jsx("span",{children:"保存して適用"})]})]})]})}):null},UC=({isOpen:o,onClose:e,onRefreshAgents:i})=>{const[r,l]=Ft.useState(!1),[f,h]=Ft.useState(5e4),[d,g]=Ft.useState(!1),[p,x]=Ft.useState([]),[m,y]=Ft.useState(""),M=Ft.useRef(null);Ft.useEffect(()=>{o&&E()},[o]);const E=async()=>{try{const v=window.location.host.includes(":3000")?"http://localhost:8000":"",P=await fetch(`${v}/api/evolution/status`);if(P.ok){const O=await P.json();l(O.is_running),O.logs&&O.logs.length>0&&x(O.logs)}}catch(v){console.error("進化ステータスの取得に失敗:",v)}};Ft.useEffect(()=>{M.current&&(M.current.scrollTop=M.current.scrollHeight)},[p]),Ft.useEffect(()=>{const v=P=>{const O=P.detail;O.type==="evolution_log"?(x(L=>[...L.slice(-300),O.log]),l(O.is_running)):O.type==="evolution_status"&&(l(O.is_running),y(O.message||""),O.is_running||i())};return window.addEventListener("voxelbrain-ws-msg",v),()=>window.removeEventListener("voxelbrain-ws-msg",v)},[i]);const A=async()=>{try{const v=window.location.host.includes(":3000")?"http://localhost:8000":"",O=await(await fetch(`${v}/api/evolution/start`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({total_steps:f,wait_interval:1,load_elites:d})})).json();y(O.message),O.success&&l(!0)}catch(v){y(`起動エラー: ${v.message}`)}},S=async()=>{try{const v=window.location.host.includes(":3000")?"http://localhost:8000":"",O=await(await fetch(`${v}/api/evolution/stop`,{method:"POST"})).json();y(O.message)}catch(v){y(`停止エラー: ${v.message}`)}};return o?R.jsx("div",{className:"fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4",children:R.jsxs("div",{className:"bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]",children:[R.jsxs("div",{className:"px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90",children:[R.jsxs("div",{className:"flex items-center space-x-2",children:[R.jsx(Nx,{className:"w-5 h-5 text-emerald-400"}),R.jsx("div",{children:R.jsxs("h2",{className:"text-base font-bold text-slate-100 flex items-center gap-2",children:["GPU 進化計算ランチャー ",R.jsx("span",{className:"text-xs font-mono text-slate-400",children:"voxelBrain.py"})]})})]}),R.jsxs("div",{className:"flex items-center space-x-3",children:[r?R.jsxs("span",{className:"flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse",children:[R.jsx("span",{className:"w-2 h-2 rounded-full bg-emerald-400"}),R.jsx("span",{children:"GPU計算中"})]}):R.jsxs("span",{className:"flex items-center space-x-1.5 bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full text-xs font-medium",children:[R.jsx("span",{className:"w-2 h-2 rounded-full bg-slate-500"}),R.jsx("span",{children:"停止中"})]}),R.jsx("button",{onClick:e,className:"text-slate-400 hover:text-slate-200 transition p-1 rounded-lg hover:bg-slate-800",children:R.jsx(Gp,{className:"w-5 h-5"})})]})]}),R.jsxs("div",{className:"p-4 bg-slate-950/50 border-b border-slate-800 grid grid-cols-3 gap-3 text-xs items-center",children:[R.jsxs("div",{children:[R.jsx("label",{className:"text-slate-400 block mb-1",children:"総世代数 (TOTAL_STEPS)"}),R.jsx("input",{type:"number",step:"1000",min:"10",max:"200000",value:f,disabled:r,onChange:v=>h(parseInt(v.target.value)||5e4),className:"w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-200 disabled:opacity-50"})]}),R.jsxs("div",{className:"flex items-center space-x-2 pt-4",children:[R.jsx("input",{type:"checkbox",id:"loadElites",checked:d,disabled:r,onChange:v=>g(v.target.checked),className:"accent-emerald-500 rounded cursor-pointer"}),R.jsx("label",{htmlFor:"loadElites",className:"text-slate-300 cursor-pointer",children:"既存エリートを読込再開"})]}),R.jsx("div",{className:"flex justify-end space-x-2 pt-3",children:r?R.jsxs("button",{onClick:S,className:"px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-medium transition flex items-center space-x-1.5 shadow",children:[R.jsx(QE,{className:"w-3.5 h-3.5"}),R.jsx("span",{children:"安全停止"})]}):R.jsxs("button",{onClick:A,className:"px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition flex items-center space-x-1.5 shadow",children:[R.jsx(Gx,{className:"w-3.5 h-3.5"}),R.jsx("span",{children:"進化開始"})]})})]}),m&&R.jsx("div",{className:"px-4 py-1.5 bg-slate-800/80 text-[11px] text-slate-300 border-b border-slate-800",children:m}),R.jsxs("div",{className:"flex-1 flex flex-col p-4 min-h-0 bg-slate-950",children:[R.jsxs("div",{className:"flex items-center justify-between pb-2 text-[11px] text-slate-400",children:[R.jsxs("span",{className:"flex items-center space-x-1 font-semibold",children:[R.jsx($E,{className:"w-3.5 h-3.5 text-slate-400"}),R.jsx("span",{children:"標準出力ログ (voxelBrain.py stdout)"})]}),R.jsx("button",{onClick:()=>x([]),className:"text-slate-500 hover:text-slate-300 transition text-[10px]",children:"ログクリア"})]}),R.jsx("div",{ref:M,className:"flex-1 overflow-y-auto font-mono text-[11px] p-3 rounded-lg bg-black/80 border border-slate-800/80 text-slate-300 leading-relaxed select-text space-y-0.5",children:p.length===0?R.jsx("span",{className:"text-slate-600",children:"ログはまだありません。「進化開始」を押すと出力が表示されます。"}):p.map((v,P)=>R.jsx("div",{className:v.includes("Max:")?"text-emerald-400":v.includes("エラー")||v.includes("Error")?"text-rose-400":v.includes("★")||v.includes("[+]")?"text-sky-300":"text-slate-300",children:v},P))})]}),R.jsxs("div",{className:"px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs",children:[R.jsxs("button",{onClick:()=>{E(),i()},className:"text-slate-400 hover:text-slate-200 transition flex items-center space-x-1",children:[R.jsx(kx,{className:"w-3.5 h-3.5"}),R.jsx("span",{children:"最新エリート一覧更新"})]}),R.jsx("button",{onClick:e,className:"px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition",children:"閉じる"})]})]})}):null},LC=()=>{const[o,e]=Ft.useState(!1),[i,r]=Ft.useState(!1),[l,f]=Ft.useState(30),[h,d]=Ft.useState(0),[g,p]=Ft.useState(.2),[x,m]=Ft.useState([0,0]),[y,M]=Ft.useState(0),[E,A]=Ft.useState([0,0]),[S,v]=Ft.useState(0),[P,O]=Ft.useState(0),[L,V]=Ft.useState(),[H,B]=Ft.useState(),[q,N]=Ft.useState([]),[D,X]=Ft.useState(4),[lt,gt]=Ft.useState([]),[Mt,mt]=Ft.useState([]),[Z,ct]=Ft.useState(null),[Q,Tt]=Ft.useState(!1),[At,Yt]=Ft.useState(null),[oe,Ct]=Ft.useState(null),[U,tt]=Ft.useState(!1),[G,F]=Ft.useState(!1),[pt,St]=Ft.useState(!1),[Et,ut]=Ft.useState(!1),Ot=Ft.useRef(null),z=Ft.useCallback(()=>{const Y=window.location.protocol==="https:"?"wss:":"ws:",$=window.location.host,ht=$.includes(":3000")?"ws://localhost:8000/ws":`${Y}//${$}/ws`,ot=new WebSocket(ht);Ot.current=ot,ot.onopen=()=>{console.log("[+] WebSocket 接続成功"),e(!0)},ot.onclose=()=>{console.log("[!] WebSocket 切断。再接続を試行します..."),e(!1),setTimeout(z,2e3)},ot.onerror=Ht=>{console.error("[!] WebSocket エラー:",Ht),ot.close()},ot.onmessage=Ht=>{try{const _t=JSON.parse(Ht.data);window.dispatchEvent(new CustomEvent("voxelbrain-ws-msg",{detail:_t})),_t.type==="state"?(d(_t.inner_step),p(_t.energy),m(_t.pos),M(_t.angle),A(_t.obj),v(_t.sunlight),O(_t.generator_power),V(_t.internal_outputs),B(_t.membrane_outputs),N(_t.ko_list),r(_t.is_running),f(_t.target_fps),ct(_t.current_agent),X(_t.N),gt(_t.in_ports_fi),mt(_t.out_ports_fi)):_t.type==="scan_progress"?(Tt(!0),Yt({current:_t.current,total:_t.total})):_t.type==="scan_result"?(Tt(!1),Yt(null),Ct(_t.result),tt(!0)):(_t.type==="evolution_status"||_t.type==="evolution_log")&&ut(!!_t.is_running)}catch(_t){console.error("メッセージ解析エラー:",_t)}}},[]);Ft.useEffect(()=>(z(),()=>{Ot.current&&Ot.current.close()}),[z]);const ne=(Y,$={})=>{Ot.current&&Ot.current.readyState===WebSocket.OPEN&&Ot.current.send(JSON.stringify({action:Y,...$}))},qt=()=>{r(!0),ne("play")},Nt=()=>{r(!1),ne("pause")},yt=()=>{r(!1),ne("step")},It=()=>{r(!1),ne("reset")},Rt=Y=>{f(Y),ne("set_fps",{fps:Y})},Zt=(Y,$,ht)=>{ne("toggle_ko",{x:Y,y:$,z:ht})},me=()=>ne("clear_ko"),he=()=>{ne("load_agent",{path:"backups/latest_best.npz"})},w=async()=>{const Y=window.location.host.includes(":3000")?"http://localhost:8000":"";try{const $=await fetch(`${Y}/api/agents/choose_file`,{method:"POST"}),ht=await $.json();if(!$.ok)throw new Error(ht.message||"ファイルダイアログの起動に失敗しました。");if(ht.canceled)return;console.log("[+] ロード成功:",ht.path)}catch($){console.error("ファイル選択エラー:",$);const ht=document.createElement("input");ht.type="file",ht.accept=".npz",ht.onchange=async ot=>{var _t;const Ht=(_t=ot.target.files)==null?void 0:_t[0];if(Ht){const Xt=new FormData;Xt.append("file",Ht),await fetch(`${Y}/api/agents/upload`,{method:"POST",body:Xt})}},ht.click()}},b=()=>{Tt(!0),ne("run_ko_scan")};return Ft.useEffect(()=>{const Y=$=>{$.target instanceof HTMLInputElement||$.target instanceof HTMLSelectElement||($.code==="Space"?($.preventDefault(),document.activeElement instanceof HTMLElement&&document.activeElement.blur(),i?Nt():qt()):$.code==="ArrowRight"?($.preventDefault(),document.activeElement instanceof HTMLElement&&document.activeElement.blur(),yt()):$.code==="KeyR"&&($.preventDefault(),document.activeElement instanceof HTMLElement&&document.activeElement.blur(),It()))};return window.addEventListener("keydown",Y),()=>window.removeEventListener("keydown",Y)},[i]),R.jsxs("div",{className:"flex flex-col h-screen w-screen bg-[#0a0d14] overflow-hidden",children:[R.jsx(tb,{isRunning:i,innerStep:h,fps:l,currentAgent:Z,isEvolving:Et,onPlay:qt,onPause:Nt,onStep:yt,onReset:It,onSetFps:Rt,onLoadLatest:he,onOpenFilePicker:w,onOpenConfig:()=>F(!0),onOpenEvolution:()=>St(!0)}),R.jsxs("div",{className:"flex-1 flex min-h-0 relative",children:[R.jsxs("div",{className:"flex-1 flex flex-col min-w-0",children:[R.jsxs("div",{className:"flex-1 relative min-h-0 bg-[#0e131f]",children:[R.jsx(RC,{N:D,internalOutputs:L,membraneOutputs:H,koList:q,importanceMap:oe==null?void 0:oe.importance_map,inPortsFi:lt,outPortsFi:Mt,onToggleKo:Zt,showImportance:U}),!o&&R.jsx("div",{className:"absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-30",children:R.jsxs("div",{className:"bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl text-center",children:[R.jsx("div",{className:"animate-spin text-sky-400 text-2xl mb-2",children:"🔄"}),R.jsx("div",{className:"text-sm font-semibold text-slate-200",children:"バックエンドサーバーに接続中..."}),R.jsx("div",{className:"text-xs text-slate-400 mt-1",children:"python server.py が起動しているか確認してください"})]})})]}),R.jsxs("div",{className:"h-48 border-t border-slate-800 p-2 flex gap-2 bg-slate-950/40",children:[R.jsx("div",{className:"flex-1 min-w-0",children:R.jsx(CC,{sunlight:S,generatorPower:P,energy:g,innerStep:h})}),R.jsx("div",{className:"w-44 flex-shrink-0",children:R.jsx(wC,{pos:x,angle:y,obj:E})})]})]}),R.jsx(DC,{koList:q,onToggleKo:Zt,onClearKo:me,onRunScan:b,isScanning:Q,scanProgress:At,scanResult:oe,showImportance:U,onToggleShowImportance:tt})]}),R.jsx(NC,{isOpen:G,onClose:()=>F(!1),onConfigSaved:()=>{It()}}),R.jsx(UC,{isOpen:pt,onClose:()=>St(!1),onRefreshAgents:()=>{}})]})};RE.createRoot(document.getElementById("root")).render(R.jsx(xE.StrictMode,{children:R.jsx(LC,{})}));
