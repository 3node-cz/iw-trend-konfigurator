(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const f of document.querySelectorAll('link[rel="modulepreload"]'))s(f);new MutationObserver(f=>{for(const c of f)if(c.type==="childList")for(const g of c.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&s(g)}).observe(document,{childList:!0,subtree:!0});function o(f){const c={};return f.integrity&&(c.integrity=f.integrity),f.referrerPolicy&&(c.referrerPolicy=f.referrerPolicy),f.crossOrigin==="use-credentials"?c.credentials="include":f.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(f){if(f.ep)return;f.ep=!0;const c=o(f);fetch(f.href,c)}})();function sx(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var nc={exports:{}},qa={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qm;function cx(){if(Qm)return qa;Qm=1;var n=Symbol.for("react.transitional.element"),u=Symbol.for("react.fragment");function o(s,f,c){var g=null;if(c!==void 0&&(g=""+c),f.key!==void 0&&(g=""+f.key),"key"in f){c={};for(var y in f)y!=="key"&&(c[y]=f[y])}else c=f;return f=c.ref,{$$typeof:n,type:s,key:g,ref:f!==void 0?f:null,props:c}}return qa.Fragment=u,qa.jsx=o,qa.jsxs=o,qa}var Zm;function fx(){return Zm||(Zm=1,nc.exports=cx()),nc.exports}var d=fx(),ic={exports:{}},zt={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wm;function dx(){if(Wm)return zt;Wm=1;var n=Symbol.for("react.transitional.element"),u=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),g=Symbol.for("react.context"),y=Symbol.for("react.forward_ref"),x=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),v=Symbol.for("react.lazy"),z=Symbol.iterator;function j(S){return S===null||typeof S!="object"?null:(S=z&&S[z]||S["@@iterator"],typeof S=="function"?S:null)}var H={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},tt=Object.assign,k={};function O(S,X,nt){this.props=S,this.context=X,this.refs=k,this.updater=nt||H}O.prototype.isReactComponent={},O.prototype.setState=function(S,X){if(typeof S!="object"&&typeof S!="function"&&S!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,S,X,"setState")},O.prototype.forceUpdate=function(S){this.updater.enqueueForceUpdate(this,S,"forceUpdate")};function Z(){}Z.prototype=O.prototype;function B(S,X,nt){this.props=S,this.context=X,this.refs=k,this.updater=nt||H}var L=B.prototype=new Z;L.constructor=B,tt(L,O.prototype),L.isPureReactComponent=!0;var P=Array.isArray,Q={H:null,A:null,T:null,S:null,V:null},rt=Object.prototype.hasOwnProperty;function J(S,X,nt,it,gt,jt){return nt=jt.ref,{$$typeof:n,type:S,key:X,ref:nt!==void 0?nt:null,props:jt}}function mt(S,X){return J(S.type,X,void 0,void 0,void 0,S.props)}function W(S){return typeof S=="object"&&S!==null&&S.$$typeof===n}function F(S){var X={"=":"=0",":":"=2"};return"$"+S.replace(/[=:]/g,function(nt){return X[nt]})}var K=/\/+/g;function V(S,X){return typeof S=="object"&&S!==null&&S.key!=null?F(""+S.key):X.toString(36)}function lt(){}function ct(S){switch(S.status){case"fulfilled":return S.value;case"rejected":throw S.reason;default:switch(typeof S.status=="string"?S.then(lt,lt):(S.status="pending",S.then(function(X){S.status==="pending"&&(S.status="fulfilled",S.value=X)},function(X){S.status==="pending"&&(S.status="rejected",S.reason=X)})),S.status){case"fulfilled":return S.value;case"rejected":throw S.reason}}throw S}function wt(S,X,nt,it,gt){var jt=typeof S;(jt==="undefined"||jt==="boolean")&&(S=null);var pt=!1;if(S===null)pt=!0;else switch(jt){case"bigint":case"string":case"number":pt=!0;break;case"object":switch(S.$$typeof){case n:case u:pt=!0;break;case v:return pt=S._init,wt(pt(S._payload),X,nt,it,gt)}}if(pt)return gt=gt(S),pt=it===""?"."+V(S,0):it,P(gt)?(nt="",pt!=null&&(nt=pt.replace(K,"$&/")+"/"),wt(gt,X,nt,"",function(ae){return ae})):gt!=null&&(W(gt)&&(gt=mt(gt,nt+(gt.key==null||S&&S.key===gt.key?"":(""+gt.key).replace(K,"$&/")+"/")+pt)),X.push(gt)),1;pt=0;var Pt=it===""?".":it+":";if(P(S))for(var Nt=0;Nt<S.length;Nt++)it=S[Nt],jt=Pt+V(it,Nt),pt+=wt(it,X,nt,jt,gt);else if(Nt=j(S),typeof Nt=="function")for(S=Nt.call(S),Nt=0;!(it=S.next()).done;)it=it.value,jt=Pt+V(it,Nt++),pt+=wt(it,X,nt,jt,gt);else if(jt==="object"){if(typeof S.then=="function")return wt(ct(S),X,nt,it,gt);throw X=String(S),Error("Objects are not valid as a React child (found: "+(X==="[object Object]"?"object with keys {"+Object.keys(S).join(", ")+"}":X)+"). If you meant to render a collection of children, use an array instead.")}return pt}function M(S,X,nt){if(S==null)return S;var it=[],gt=0;return wt(S,it,"","",function(jt){return X.call(nt,jt,gt++)}),it}function I(S){if(S._status===-1){var X=S._result;X=X(),X.then(function(nt){(S._status===0||S._status===-1)&&(S._status=1,S._result=nt)},function(nt){(S._status===0||S._status===-1)&&(S._status=2,S._result=nt)}),S._status===-1&&(S._status=0,S._result=X)}if(S._status===1)return S._result.default;throw S._result}var dt=typeof reportError=="function"?reportError:function(S){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var X=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof S=="object"&&S!==null&&typeof S.message=="string"?String(S.message):String(S),error:S});if(!window.dispatchEvent(X))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",S);return}console.error(S)};function Et(){}return zt.Children={map:M,forEach:function(S,X,nt){M(S,function(){X.apply(this,arguments)},nt)},count:function(S){var X=0;return M(S,function(){X++}),X},toArray:function(S){return M(S,function(X){return X})||[]},only:function(S){if(!W(S))throw Error("React.Children.only expected to receive a single React element child.");return S}},zt.Component=O,zt.Fragment=o,zt.Profiler=f,zt.PureComponent=B,zt.StrictMode=s,zt.Suspense=x,zt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Q,zt.__COMPILER_RUNTIME={__proto__:null,c:function(S){return Q.H.useMemoCache(S)}},zt.cache=function(S){return function(){return S.apply(null,arguments)}},zt.cloneElement=function(S,X,nt){if(S==null)throw Error("The argument must be a React element, but you passed "+S+".");var it=tt({},S.props),gt=S.key,jt=void 0;if(X!=null)for(pt in X.ref!==void 0&&(jt=void 0),X.key!==void 0&&(gt=""+X.key),X)!rt.call(X,pt)||pt==="key"||pt==="__self"||pt==="__source"||pt==="ref"&&X.ref===void 0||(it[pt]=X[pt]);var pt=arguments.length-2;if(pt===1)it.children=nt;else if(1<pt){for(var Pt=Array(pt),Nt=0;Nt<pt;Nt++)Pt[Nt]=arguments[Nt+2];it.children=Pt}return J(S.type,gt,void 0,void 0,jt,it)},zt.createContext=function(S){return S={$$typeof:g,_currentValue:S,_currentValue2:S,_threadCount:0,Provider:null,Consumer:null},S.Provider=S,S.Consumer={$$typeof:c,_context:S},S},zt.createElement=function(S,X,nt){var it,gt={},jt=null;if(X!=null)for(it in X.key!==void 0&&(jt=""+X.key),X)rt.call(X,it)&&it!=="key"&&it!=="__self"&&it!=="__source"&&(gt[it]=X[it]);var pt=arguments.length-2;if(pt===1)gt.children=nt;else if(1<pt){for(var Pt=Array(pt),Nt=0;Nt<pt;Nt++)Pt[Nt]=arguments[Nt+2];gt.children=Pt}if(S&&S.defaultProps)for(it in pt=S.defaultProps,pt)gt[it]===void 0&&(gt[it]=pt[it]);return J(S,jt,void 0,void 0,null,gt)},zt.createRef=function(){return{current:null}},zt.forwardRef=function(S){return{$$typeof:y,render:S}},zt.isValidElement=W,zt.lazy=function(S){return{$$typeof:v,_payload:{_status:-1,_result:S},_init:I}},zt.memo=function(S,X){return{$$typeof:p,type:S,compare:X===void 0?null:X}},zt.startTransition=function(S){var X=Q.T,nt={};Q.T=nt;try{var it=S(),gt=Q.S;gt!==null&&gt(nt,it),typeof it=="object"&&it!==null&&typeof it.then=="function"&&it.then(Et,dt)}catch(jt){dt(jt)}finally{Q.T=X}},zt.unstable_useCacheRefresh=function(){return Q.H.useCacheRefresh()},zt.use=function(S){return Q.H.use(S)},zt.useActionState=function(S,X,nt){return Q.H.useActionState(S,X,nt)},zt.useCallback=function(S,X){return Q.H.useCallback(S,X)},zt.useContext=function(S){return Q.H.useContext(S)},zt.useDebugValue=function(){},zt.useDeferredValue=function(S,X){return Q.H.useDeferredValue(S,X)},zt.useEffect=function(S,X,nt){var it=Q.H;if(typeof nt=="function")throw Error("useEffect CRUD overload is not enabled in this build of React.");return it.useEffect(S,X)},zt.useId=function(){return Q.H.useId()},zt.useImperativeHandle=function(S,X,nt){return Q.H.useImperativeHandle(S,X,nt)},zt.useInsertionEffect=function(S,X){return Q.H.useInsertionEffect(S,X)},zt.useLayoutEffect=function(S,X){return Q.H.useLayoutEffect(S,X)},zt.useMemo=function(S,X){return Q.H.useMemo(S,X)},zt.useOptimistic=function(S,X){return Q.H.useOptimistic(S,X)},zt.useReducer=function(S,X,nt){return Q.H.useReducer(S,X,nt)},zt.useRef=function(S){return Q.H.useRef(S)},zt.useState=function(S){return Q.H.useState(S)},zt.useSyncExternalStore=function(S,X,nt){return Q.H.useSyncExternalStore(S,X,nt)},zt.useTransition=function(){return Q.H.useTransition()},zt.version="19.1.0",zt}var Km;function Uc(){return Km||(Km=1,ic.exports=dx()),ic.exports}var $t=Uc();const Ht=sx($t);var ac={exports:{}},Va={},uc={exports:{}},rc={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fm;function hx(){return Fm||(Fm=1,function(n){function u(M,I){var dt=M.length;M.push(I);t:for(;0<dt;){var Et=dt-1>>>1,S=M[Et];if(0<f(S,I))M[Et]=I,M[dt]=S,dt=Et;else break t}}function o(M){return M.length===0?null:M[0]}function s(M){if(M.length===0)return null;var I=M[0],dt=M.pop();if(dt!==I){M[0]=dt;t:for(var Et=0,S=M.length,X=S>>>1;Et<X;){var nt=2*(Et+1)-1,it=M[nt],gt=nt+1,jt=M[gt];if(0>f(it,dt))gt<S&&0>f(jt,it)?(M[Et]=jt,M[gt]=dt,Et=gt):(M[Et]=it,M[nt]=dt,Et=nt);else if(gt<S&&0>f(jt,dt))M[Et]=jt,M[gt]=dt,Et=gt;else break t}}return I}function f(M,I){var dt=M.sortIndex-I.sortIndex;return dt!==0?dt:M.id-I.id}if(n.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;n.unstable_now=function(){return c.now()}}else{var g=Date,y=g.now();n.unstable_now=function(){return g.now()-y}}var x=[],p=[],v=1,z=null,j=3,H=!1,tt=!1,k=!1,O=!1,Z=typeof setTimeout=="function"?setTimeout:null,B=typeof clearTimeout=="function"?clearTimeout:null,L=typeof setImmediate<"u"?setImmediate:null;function P(M){for(var I=o(p);I!==null;){if(I.callback===null)s(p);else if(I.startTime<=M)s(p),I.sortIndex=I.expirationTime,u(x,I);else break;I=o(p)}}function Q(M){if(k=!1,P(M),!tt)if(o(x)!==null)tt=!0,rt||(rt=!0,V());else{var I=o(p);I!==null&&wt(Q,I.startTime-M)}}var rt=!1,J=-1,mt=5,W=-1;function F(){return O?!0:!(n.unstable_now()-W<mt)}function K(){if(O=!1,rt){var M=n.unstable_now();W=M;var I=!0;try{t:{tt=!1,k&&(k=!1,B(J),J=-1),H=!0;var dt=j;try{e:{for(P(M),z=o(x);z!==null&&!(z.expirationTime>M&&F());){var Et=z.callback;if(typeof Et=="function"){z.callback=null,j=z.priorityLevel;var S=Et(z.expirationTime<=M);if(M=n.unstable_now(),typeof S=="function"){z.callback=S,P(M),I=!0;break e}z===o(x)&&s(x),P(M)}else s(x);z=o(x)}if(z!==null)I=!0;else{var X=o(p);X!==null&&wt(Q,X.startTime-M),I=!1}}break t}finally{z=null,j=dt,H=!1}I=void 0}}finally{I?V():rt=!1}}}var V;if(typeof L=="function")V=function(){L(K)};else if(typeof MessageChannel<"u"){var lt=new MessageChannel,ct=lt.port2;lt.port1.onmessage=K,V=function(){ct.postMessage(null)}}else V=function(){Z(K,0)};function wt(M,I){J=Z(function(){M(n.unstable_now())},I)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(M){M.callback=null},n.unstable_forceFrameRate=function(M){0>M||125<M?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):mt=0<M?Math.floor(1e3/M):5},n.unstable_getCurrentPriorityLevel=function(){return j},n.unstable_next=function(M){switch(j){case 1:case 2:case 3:var I=3;break;default:I=j}var dt=j;j=I;try{return M()}finally{j=dt}},n.unstable_requestPaint=function(){O=!0},n.unstable_runWithPriority=function(M,I){switch(M){case 1:case 2:case 3:case 4:case 5:break;default:M=3}var dt=j;j=M;try{return I()}finally{j=dt}},n.unstable_scheduleCallback=function(M,I,dt){var Et=n.unstable_now();switch(typeof dt=="object"&&dt!==null?(dt=dt.delay,dt=typeof dt=="number"&&0<dt?Et+dt:Et):dt=Et,M){case 1:var S=-1;break;case 2:S=250;break;case 5:S=1073741823;break;case 4:S=1e4;break;default:S=5e3}return S=dt+S,M={id:v++,callback:I,priorityLevel:M,startTime:dt,expirationTime:S,sortIndex:-1},dt>Et?(M.sortIndex=dt,u(p,M),o(x)===null&&M===o(p)&&(k?(B(J),J=-1):k=!0,wt(Q,dt-Et))):(M.sortIndex=S,u(x,M),tt||H||(tt=!0,rt||(rt=!0,V()))),M},n.unstable_shouldYield=F,n.unstable_wrapCallback=function(M){var I=j;return function(){var dt=j;j=I;try{return M.apply(this,arguments)}finally{j=dt}}}}(rc)),rc}var Jm;function mx(){return Jm||(Jm=1,uc.exports=hx()),uc.exports}var oc={exports:{}},ze={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Im;function gx(){if(Im)return ze;Im=1;var n=Uc();function u(x){var p="https://react.dev/errors/"+x;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var v=2;v<arguments.length;v++)p+="&args[]="+encodeURIComponent(arguments[v])}return"Minified React error #"+x+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function o(){}var s={d:{f:o,r:function(){throw Error(u(522))},D:o,C:o,L:o,m:o,X:o,S:o,M:o},p:0,findDOMNode:null},f=Symbol.for("react.portal");function c(x,p,v){var z=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:f,key:z==null?null:""+z,children:x,containerInfo:p,implementation:v}}var g=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function y(x,p){if(x==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return ze.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,ze.createPortal=function(x,p){var v=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(u(299));return c(x,p,null,v)},ze.flushSync=function(x){var p=g.T,v=s.p;try{if(g.T=null,s.p=2,x)return x()}finally{g.T=p,s.p=v,s.d.f()}},ze.preconnect=function(x,p){typeof x=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,s.d.C(x,p))},ze.prefetchDNS=function(x){typeof x=="string"&&s.d.D(x)},ze.preinit=function(x,p){if(typeof x=="string"&&p&&typeof p.as=="string"){var v=p.as,z=y(v,p.crossOrigin),j=typeof p.integrity=="string"?p.integrity:void 0,H=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;v==="style"?s.d.S(x,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:z,integrity:j,fetchPriority:H}):v==="script"&&s.d.X(x,{crossOrigin:z,integrity:j,fetchPriority:H,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},ze.preinitModule=function(x,p){if(typeof x=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var v=y(p.as,p.crossOrigin);s.d.M(x,{crossOrigin:v,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&s.d.M(x)},ze.preload=function(x,p){if(typeof x=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var v=p.as,z=y(v,p.crossOrigin);s.d.L(x,v,{crossOrigin:z,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},ze.preloadModule=function(x,p){if(typeof x=="string")if(p){var v=y(p.as,p.crossOrigin);s.d.m(x,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:v,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else s.d.m(x)},ze.requestFormReset=function(x){s.d.r(x)},ze.unstable_batchedUpdates=function(x,p){return x(p)},ze.useFormState=function(x,p,v){return g.H.useFormState(x,p,v)},ze.useFormStatus=function(){return g.H.useHostTransitionStatus()},ze.version="19.1.0",ze}var Pm;function yx(){if(Pm)return oc.exports;Pm=1;function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(u){console.error(u)}}return n(),oc.exports=gx(),oc.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tg;function px(){if(tg)return Va;tg=1;var n=mx(),u=Uc(),o=yx();function s(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var l=2;l<arguments.length;l++)e+="&args[]="+encodeURIComponent(arguments[l])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function f(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function c(t){var e=t,l=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,(e.flags&4098)!==0&&(l=e.return),t=e.return;while(t)}return e.tag===3?l:null}function g(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function y(t){if(c(t)!==t)throw Error(s(188))}function x(t){var e=t.alternate;if(!e){if(e=c(t),e===null)throw Error(s(188));return e!==t?null:t}for(var l=t,i=e;;){var a=l.return;if(a===null)break;var r=a.alternate;if(r===null){if(i=a.return,i!==null){l=i;continue}break}if(a.child===r.child){for(r=a.child;r;){if(r===l)return y(a),t;if(r===i)return y(a),e;r=r.sibling}throw Error(s(188))}if(l.return!==i.return)l=a,i=r;else{for(var h=!1,m=a.child;m;){if(m===l){h=!0,l=a,i=r;break}if(m===i){h=!0,i=a,l=r;break}m=m.sibling}if(!h){for(m=r.child;m;){if(m===l){h=!0,l=r,i=a;break}if(m===i){h=!0,i=r,l=a;break}m=m.sibling}if(!h)throw Error(s(189))}}if(l.alternate!==i)throw Error(s(190))}if(l.tag!==3)throw Error(s(188));return l.stateNode.current===l?t:e}function p(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t;for(t=t.child;t!==null;){if(e=p(t),e!==null)return e;t=t.sibling}return null}var v=Object.assign,z=Symbol.for("react.element"),j=Symbol.for("react.transitional.element"),H=Symbol.for("react.portal"),tt=Symbol.for("react.fragment"),k=Symbol.for("react.strict_mode"),O=Symbol.for("react.profiler"),Z=Symbol.for("react.provider"),B=Symbol.for("react.consumer"),L=Symbol.for("react.context"),P=Symbol.for("react.forward_ref"),Q=Symbol.for("react.suspense"),rt=Symbol.for("react.suspense_list"),J=Symbol.for("react.memo"),mt=Symbol.for("react.lazy"),W=Symbol.for("react.activity"),F=Symbol.for("react.memo_cache_sentinel"),K=Symbol.iterator;function V(t){return t===null||typeof t!="object"?null:(t=K&&t[K]||t["@@iterator"],typeof t=="function"?t:null)}var lt=Symbol.for("react.client.reference");function ct(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===lt?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case tt:return"Fragment";case O:return"Profiler";case k:return"StrictMode";case Q:return"Suspense";case rt:return"SuspenseList";case W:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case H:return"Portal";case L:return(t.displayName||"Context")+".Provider";case B:return(t._context.displayName||"Context")+".Consumer";case P:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case J:return e=t.displayName||null,e!==null?e:ct(t.type)||"Memo";case mt:e=t._payload,t=t._init;try{return ct(t(e))}catch{}}return null}var wt=Array.isArray,M=u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,I=o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,dt={pending:!1,data:null,method:null,action:null},Et=[],S=-1;function X(t){return{current:t}}function nt(t){0>S||(t.current=Et[S],Et[S]=null,S--)}function it(t,e){S++,Et[S]=t.current,t.current=e}var gt=X(null),jt=X(null),pt=X(null),Pt=X(null);function Nt(t,e){switch(it(pt,e),it(jt,t),it(gt,null),e.nodeType){case 9:case 11:t=(t=e.documentElement)&&(t=t.namespaceURI)?vm(t):0;break;default:if(t=e.tagName,e=e.namespaceURI)e=vm(e),t=Sm(e,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}nt(gt),it(gt,t)}function ae(){nt(gt),nt(jt),nt(pt)}function il(t){t.memoizedState!==null&&it(Pt,t);var e=gt.current,l=Sm(e,t.type);e!==l&&(it(jt,t),it(gt,l))}function al(t){jt.current===t&&(nt(gt),nt(jt)),Pt.current===t&&(nt(Pt),Na._currentValue=dt)}var Ae=Object.prototype.hasOwnProperty,Gi=n.unstable_scheduleCallback,Vn=n.unstable_cancelCallback,eu=n.unstable_shouldYield,Yr=n.unstable_requestPaint,Qe=n.unstable_now,ef=n.unstable_getCurrentPriorityLevel,Xi=n.unstable_ImmediatePriority,$=n.unstable_UserBlockingPriority,_=n.unstable_NormalPriority,q=n.unstable_LowPriority,ut=n.unstable_IdlePriority,at=n.log,et=n.unstable_setDisableYieldValue,ht=null,Tt=null;function Ot(t){if(typeof at=="function"&&et(t),Tt&&typeof Tt.setStrictMode=="function")try{Tt.setStrictMode(ht,t)}catch{}}var Zt=Math.clz32?Math.clz32:Gr,Yn=Math.log,dl=Math.LN2;function Gr(t){return t>>>=0,t===0?32:31-(Yn(t)/dl|0)|0}var Gl=256,Xl=4194304;function wl(t){var e=t&42;if(e!==0)return e;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194048;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function bn(t,e,l){var i=t.pendingLanes;if(i===0)return 0;var a=0,r=t.suspendedLanes,h=t.pingedLanes;t=t.warmLanes;var m=i&134217727;return m!==0?(i=m&~r,i!==0?a=wl(i):(h&=m,h!==0?a=wl(h):l||(l=m&~t,l!==0&&(a=wl(l))))):(m=i&~r,m!==0?a=wl(m):h!==0?a=wl(h):l||(l=i&~t,l!==0&&(a=wl(l)))),a===0?0:e!==0&&e!==a&&(e&r)===0&&(r=a&-a,l=e&-e,r>=l||r===32&&(l&4194048)!==0)?e:a}function vn(t,e){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&e)===0}function lu(t,e){switch(t){case 1:case 2:case 4:case 8:case 64:return e+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function lf(){var t=Gl;return Gl<<=1,(Gl&4194048)===0&&(Gl=256),t}function nf(){var t=Xl;return Xl<<=1,(Xl&62914560)===0&&(Xl=4194304),t}function Xr(t){for(var e=[],l=0;31>l;l++)e.push(t);return e}function Qi(t,e){t.pendingLanes|=e,e!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function J0(t,e,l,i,a,r){var h=t.pendingLanes;t.pendingLanes=l,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=l,t.entangledLanes&=l,t.errorRecoveryDisabledLanes&=l,t.shellSuspendCounter=0;var m=t.entanglements,b=t.expirationTimes,C=t.hiddenUpdates;for(l=h&~l;0<l;){var U=31-Zt(l),G=1<<U;m[U]=0,b[U]=-1;var D=C[U];if(D!==null)for(C[U]=null,U=0;U<D.length;U++){var R=D[U];R!==null&&(R.lane&=-536870913)}l&=~G}i!==0&&af(t,i,0),r!==0&&a===0&&t.tag!==0&&(t.suspendedLanes|=r&~(h&~e))}function af(t,e,l){t.pendingLanes|=e,t.suspendedLanes&=~e;var i=31-Zt(e);t.entangledLanes|=e,t.entanglements[i]=t.entanglements[i]|1073741824|l&4194090}function uf(t,e){var l=t.entangledLanes|=e;for(t=t.entanglements;l;){var i=31-Zt(l),a=1<<i;a&e|t[i]&e&&(t[i]|=e),l&=~a}}function Qr(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function Zr(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function rf(){var t=I.p;return t!==0?t:(t=window.event,t===void 0?32:Hm(t.type))}function I0(t,e){var l=I.p;try{return I.p=t,e()}finally{I.p=l}}var Ql=Math.random().toString(36).slice(2),Ee="__reactFiber$"+Ql,De="__reactProps$"+Ql,Gn="__reactContainer$"+Ql,Wr="__reactEvents$"+Ql,P0="__reactListeners$"+Ql,ty="__reactHandles$"+Ql,of="__reactResources$"+Ql,Zi="__reactMarker$"+Ql;function Kr(t){delete t[Ee],delete t[De],delete t[Wr],delete t[P0],delete t[ty]}function Xn(t){var e=t[Ee];if(e)return e;for(var l=t.parentNode;l;){if(e=l[Gn]||l[Ee]){if(l=e.alternate,e.child!==null||l!==null&&l.child!==null)for(t=Tm(t);t!==null;){if(l=t[Ee])return l;t=Tm(t)}return e}t=l,l=t.parentNode}return null}function Qn(t){if(t=t[Ee]||t[Gn]){var e=t.tag;if(e===5||e===6||e===13||e===26||e===27||e===3)return t}return null}function Wi(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t.stateNode;throw Error(s(33))}function Zn(t){var e=t[of];return e||(e=t[of]={hoistableStyles:new Map,hoistableScripts:new Map}),e}function me(t){t[Zi]=!0}var sf=new Set,cf={};function Sn(t,e){Wn(t,e),Wn(t+"Capture",e)}function Wn(t,e){for(cf[t]=e,t=0;t<e.length;t++)sf.add(e[t])}var ey=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ff={},df={};function ly(t){return Ae.call(df,t)?!0:Ae.call(ff,t)?!1:ey.test(t)?df[t]=!0:(ff[t]=!0,!1)}function nu(t,e,l){if(ly(e))if(l===null)t.removeAttribute(e);else{switch(typeof l){case"undefined":case"function":case"symbol":t.removeAttribute(e);return;case"boolean":var i=e.toLowerCase().slice(0,5);if(i!=="data-"&&i!=="aria-"){t.removeAttribute(e);return}}t.setAttribute(e,""+l)}}function iu(t,e,l){if(l===null)t.removeAttribute(e);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(e);return}t.setAttribute(e,""+l)}}function El(t,e,l,i){if(i===null)t.removeAttribute(l);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(l);return}t.setAttributeNS(e,l,""+i)}}var Fr,hf;function Kn(t){if(Fr===void 0)try{throw Error()}catch(l){var e=l.stack.trim().match(/\n( *(at )?)/);Fr=e&&e[1]||"",hf=-1<l.stack.indexOf(`
    at`)?" (<anonymous>)":-1<l.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Fr+t+hf}var Jr=!1;function Ir(t,e){if(!t||Jr)return"";Jr=!0;var l=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var i={DetermineComponentFrameRoot:function(){try{if(e){var G=function(){throw Error()};if(Object.defineProperty(G.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(G,[])}catch(R){var D=R}Reflect.construct(t,[],G)}else{try{G.call()}catch(R){D=R}t.call(G.prototype)}}else{try{throw Error()}catch(R){D=R}(G=t())&&typeof G.catch=="function"&&G.catch(function(){})}}catch(R){if(R&&D&&typeof R.stack=="string")return[R.stack,D.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var r=i.DetermineComponentFrameRoot(),h=r[0],m=r[1];if(h&&m){var b=h.split(`
`),C=m.split(`
`);for(a=i=0;i<b.length&&!b[i].includes("DetermineComponentFrameRoot");)i++;for(;a<C.length&&!C[a].includes("DetermineComponentFrameRoot");)a++;if(i===b.length||a===C.length)for(i=b.length-1,a=C.length-1;1<=i&&0<=a&&b[i]!==C[a];)a--;for(;1<=i&&0<=a;i--,a--)if(b[i]!==C[a]){if(i!==1||a!==1)do if(i--,a--,0>a||b[i]!==C[a]){var U=`
`+b[i].replace(" at new "," at ");return t.displayName&&U.includes("<anonymous>")&&(U=U.replace("<anonymous>",t.displayName)),U}while(1<=i&&0<=a);break}}}finally{Jr=!1,Error.prepareStackTrace=l}return(l=t?t.displayName||t.name:"")?Kn(l):""}function ny(t){switch(t.tag){case 26:case 27:case 5:return Kn(t.type);case 16:return Kn("Lazy");case 13:return Kn("Suspense");case 19:return Kn("SuspenseList");case 0:case 15:return Ir(t.type,!1);case 11:return Ir(t.type.render,!1);case 1:return Ir(t.type,!0);case 31:return Kn("Activity");default:return""}}function mf(t){try{var e="";do e+=ny(t),t=t.return;while(t);return e}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}function Ze(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function gf(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function iy(t){var e=gf(t)?"checked":"value",l=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var a=l.get,r=l.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return a.call(this)},set:function(h){i=""+h,r.call(this,h)}}),Object.defineProperty(t,e,{enumerable:l.enumerable}),{getValue:function(){return i},setValue:function(h){i=""+h},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function au(t){t._valueTracker||(t._valueTracker=iy(t))}function yf(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var l=e.getValue(),i="";return t&&(i=gf(t)?t.checked?"true":"false":t.value),t=i,t!==l?(e.setValue(t),!0):!1}function uu(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var ay=/[\n"\\]/g;function We(t){return t.replace(ay,function(e){return"\\"+e.charCodeAt(0).toString(16)+" "})}function Pr(t,e,l,i,a,r,h,m){t.name="",h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"?t.type=h:t.removeAttribute("type"),e!=null?h==="number"?(e===0&&t.value===""||t.value!=e)&&(t.value=""+Ze(e)):t.value!==""+Ze(e)&&(t.value=""+Ze(e)):h!=="submit"&&h!=="reset"||t.removeAttribute("value"),e!=null?to(t,h,Ze(e)):l!=null?to(t,h,Ze(l)):i!=null&&t.removeAttribute("value"),a==null&&r!=null&&(t.defaultChecked=!!r),a!=null&&(t.checked=a&&typeof a!="function"&&typeof a!="symbol"),m!=null&&typeof m!="function"&&typeof m!="symbol"&&typeof m!="boolean"?t.name=""+Ze(m):t.removeAttribute("name")}function pf(t,e,l,i,a,r,h,m){if(r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"&&(t.type=r),e!=null||l!=null){if(!(r!=="submit"&&r!=="reset"||e!=null))return;l=l!=null?""+Ze(l):"",e=e!=null?""+Ze(e):l,m||e===t.value||(t.value=e),t.defaultValue=e}i=i??a,i=typeof i!="function"&&typeof i!="symbol"&&!!i,t.checked=m?t.checked:!!i,t.defaultChecked=!!i,h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"&&(t.name=h)}function to(t,e,l){e==="number"&&uu(t.ownerDocument)===t||t.defaultValue===""+l||(t.defaultValue=""+l)}function Fn(t,e,l,i){if(t=t.options,e){e={};for(var a=0;a<l.length;a++)e["$"+l[a]]=!0;for(l=0;l<t.length;l++)a=e.hasOwnProperty("$"+t[l].value),t[l].selected!==a&&(t[l].selected=a),a&&i&&(t[l].defaultSelected=!0)}else{for(l=""+Ze(l),e=null,a=0;a<t.length;a++){if(t[a].value===l){t[a].selected=!0,i&&(t[a].defaultSelected=!0);return}e!==null||t[a].disabled||(e=t[a])}e!==null&&(e.selected=!0)}}function xf(t,e,l){if(e!=null&&(e=""+Ze(e),e!==t.value&&(t.value=e),l==null)){t.defaultValue!==e&&(t.defaultValue=e);return}t.defaultValue=l!=null?""+Ze(l):""}function bf(t,e,l,i){if(e==null){if(i!=null){if(l!=null)throw Error(s(92));if(wt(i)){if(1<i.length)throw Error(s(93));i=i[0]}l=i}l==null&&(l=""),e=l}l=Ze(e),t.defaultValue=l,i=t.textContent,i===l&&i!==""&&i!==null&&(t.value=i)}function Jn(t,e){if(e){var l=t.firstChild;if(l&&l===t.lastChild&&l.nodeType===3){l.nodeValue=e;return}}t.textContent=e}var uy=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function vf(t,e,l){var i=e.indexOf("--")===0;l==null||typeof l=="boolean"||l===""?i?t.setProperty(e,""):e==="float"?t.cssFloat="":t[e]="":i?t.setProperty(e,l):typeof l!="number"||l===0||uy.has(e)?e==="float"?t.cssFloat=l:t[e]=(""+l).trim():t[e]=l+"px"}function Sf(t,e,l){if(e!=null&&typeof e!="object")throw Error(s(62));if(t=t.style,l!=null){for(var i in l)!l.hasOwnProperty(i)||e!=null&&e.hasOwnProperty(i)||(i.indexOf("--")===0?t.setProperty(i,""):i==="float"?t.cssFloat="":t[i]="");for(var a in e)i=e[a],e.hasOwnProperty(a)&&l[a]!==i&&vf(t,a,i)}else for(var r in e)e.hasOwnProperty(r)&&vf(t,r,e[r])}function eo(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ry=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),oy=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ru(t){return oy.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}var lo=null;function no(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var In=null,Pn=null;function $f(t){var e=Qn(t);if(e&&(t=e.stateNode)){var l=t[De]||null;t:switch(t=e.stateNode,e.type){case"input":if(Pr(t,l.value,l.defaultValue,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name),e=l.name,l.type==="radio"&&e!=null){for(l=t;l.parentNode;)l=l.parentNode;for(l=l.querySelectorAll('input[name="'+We(""+e)+'"][type="radio"]'),e=0;e<l.length;e++){var i=l[e];if(i!==t&&i.form===t.form){var a=i[De]||null;if(!a)throw Error(s(90));Pr(i,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(e=0;e<l.length;e++)i=l[e],i.form===t.form&&yf(i)}break t;case"textarea":xf(t,l.value,l.defaultValue);break t;case"select":e=l.value,e!=null&&Fn(t,!!l.multiple,e,!1)}}}var io=!1;function wf(t,e,l){if(io)return t(e,l);io=!0;try{var i=t(e);return i}finally{if(io=!1,(In!==null||Pn!==null)&&(Qu(),In&&(e=In,t=Pn,Pn=In=null,$f(e),t)))for(e=0;e<t.length;e++)$f(t[e])}}function Ki(t,e){var l=t.stateNode;if(l===null)return null;var i=l[De]||null;if(i===null)return null;l=i[e];t:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break t;default:t=!1}if(t)return null;if(l&&typeof l!="function")throw Error(s(231,e,typeof l));return l}var Tl=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ao=!1;if(Tl)try{var Fi={};Object.defineProperty(Fi,"passive",{get:function(){ao=!0}}),window.addEventListener("test",Fi,Fi),window.removeEventListener("test",Fi,Fi)}catch{ao=!1}var Zl=null,uo=null,ou=null;function Ef(){if(ou)return ou;var t,e=uo,l=e.length,i,a="value"in Zl?Zl.value:Zl.textContent,r=a.length;for(t=0;t<l&&e[t]===a[t];t++);var h=l-t;for(i=1;i<=h&&e[l-i]===a[r-i];i++);return ou=a.slice(t,1<i?1-i:void 0)}function su(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function cu(){return!0}function Tf(){return!1}function Me(t){function e(l,i,a,r,h){this._reactName=l,this._targetInst=a,this.type=i,this.nativeEvent=r,this.target=h,this.currentTarget=null;for(var m in t)t.hasOwnProperty(m)&&(l=t[m],this[m]=l?l(r):r[m]);return this.isDefaultPrevented=(r.defaultPrevented!=null?r.defaultPrevented:r.returnValue===!1)?cu:Tf,this.isPropagationStopped=Tf,this}return v(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var l=this.nativeEvent;l&&(l.preventDefault?l.preventDefault():typeof l.returnValue!="unknown"&&(l.returnValue=!1),this.isDefaultPrevented=cu)},stopPropagation:function(){var l=this.nativeEvent;l&&(l.stopPropagation?l.stopPropagation():typeof l.cancelBubble!="unknown"&&(l.cancelBubble=!0),this.isPropagationStopped=cu)},persist:function(){},isPersistent:cu}),e}var $n={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},fu=Me($n),Ji=v({},$n,{view:0,detail:0}),sy=Me(Ji),ro,oo,Ii,du=v({},Ji,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:co,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ii&&(Ii&&t.type==="mousemove"?(ro=t.screenX-Ii.screenX,oo=t.screenY-Ii.screenY):oo=ro=0,Ii=t),ro)},movementY:function(t){return"movementY"in t?t.movementY:oo}}),zf=Me(du),cy=v({},du,{dataTransfer:0}),fy=Me(cy),dy=v({},Ji,{relatedTarget:0}),so=Me(dy),hy=v({},$n,{animationName:0,elapsedTime:0,pseudoElement:0}),my=Me(hy),gy=v({},$n,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),yy=Me(gy),py=v({},$n,{data:0}),jf=Me(py),xy={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},by={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},vy={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Sy(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=vy[t])?!!e[t]:!1}function co(){return Sy}var $y=v({},Ji,{key:function(t){if(t.key){var e=xy[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=su(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?by[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:co,charCode:function(t){return t.type==="keypress"?su(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?su(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),wy=Me($y),Ey=v({},du,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Af=Me(Ey),Ty=v({},Ji,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:co}),zy=Me(Ty),jy=v({},$n,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ay=Me(jy),Cy=v({},du,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),_y=Me(Cy),Dy=v({},$n,{newState:0,oldState:0}),My=Me(Dy),Ry=[9,13,27,32],fo=Tl&&"CompositionEvent"in window,Pi=null;Tl&&"documentMode"in document&&(Pi=document.documentMode);var Oy=Tl&&"TextEvent"in window&&!Pi,Cf=Tl&&(!fo||Pi&&8<Pi&&11>=Pi),_f=" ",Df=!1;function Mf(t,e){switch(t){case"keyup":return Ry.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Rf(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ti=!1;function ky(t,e){switch(t){case"compositionend":return Rf(e);case"keypress":return e.which!==32?null:(Df=!0,_f);case"textInput":return t=e.data,t===_f&&Df?null:t;default:return null}}function Ny(t,e){if(ti)return t==="compositionend"||!fo&&Mf(t,e)?(t=Ef(),ou=uo=Zl=null,ti=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Cf&&e.locale!=="ko"?null:e.data;default:return null}}var By={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Of(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!By[t.type]:e==="textarea"}function kf(t,e,l,i){In?Pn?Pn.push(i):Pn=[i]:In=i,e=Iu(e,"onChange"),0<e.length&&(l=new fu("onChange","change",null,l,i),t.push({event:l,listeners:e}))}var ta=null,ea=null;function Uy(t){gm(t,0)}function hu(t){var e=Wi(t);if(yf(e))return t}function Nf(t,e){if(t==="change")return e}var Bf=!1;if(Tl){var ho;if(Tl){var mo="oninput"in document;if(!mo){var Uf=document.createElement("div");Uf.setAttribute("oninput","return;"),mo=typeof Uf.oninput=="function"}ho=mo}else ho=!1;Bf=ho&&(!document.documentMode||9<document.documentMode)}function Lf(){ta&&(ta.detachEvent("onpropertychange",Hf),ea=ta=null)}function Hf(t){if(t.propertyName==="value"&&hu(ea)){var e=[];kf(e,ea,t,no(t)),wf(Uy,e)}}function Ly(t,e,l){t==="focusin"?(Lf(),ta=e,ea=l,ta.attachEvent("onpropertychange",Hf)):t==="focusout"&&Lf()}function Hy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return hu(ea)}function qy(t,e){if(t==="click")return hu(e)}function Vy(t,e){if(t==="input"||t==="change")return hu(e)}function Yy(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Ue=typeof Object.is=="function"?Object.is:Yy;function la(t,e){if(Ue(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var l=Object.keys(t),i=Object.keys(e);if(l.length!==i.length)return!1;for(i=0;i<l.length;i++){var a=l[i];if(!Ae.call(e,a)||!Ue(t[a],e[a]))return!1}return!0}function qf(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Vf(t,e){var l=qf(t);t=0;for(var i;l;){if(l.nodeType===3){if(i=t+l.textContent.length,t<=e&&i>=e)return{node:l,offset:e-t};t=i}t:{for(;l;){if(l.nextSibling){l=l.nextSibling;break t}l=l.parentNode}l=void 0}l=qf(l)}}function Yf(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Yf(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Gf(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var e=uu(t.document);e instanceof t.HTMLIFrameElement;){try{var l=typeof e.contentWindow.location.href=="string"}catch{l=!1}if(l)t=e.contentWindow;else break;e=uu(t.document)}return e}function go(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}var Gy=Tl&&"documentMode"in document&&11>=document.documentMode,ei=null,yo=null,na=null,po=!1;function Xf(t,e,l){var i=l.window===l?l.document:l.nodeType===9?l:l.ownerDocument;po||ei==null||ei!==uu(i)||(i=ei,"selectionStart"in i&&go(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),na&&la(na,i)||(na=i,i=Iu(yo,"onSelect"),0<i.length&&(e=new fu("onSelect","select",null,e,l),t.push({event:e,listeners:i}),e.target=ei)))}function wn(t,e){var l={};return l[t.toLowerCase()]=e.toLowerCase(),l["Webkit"+t]="webkit"+e,l["Moz"+t]="moz"+e,l}var li={animationend:wn("Animation","AnimationEnd"),animationiteration:wn("Animation","AnimationIteration"),animationstart:wn("Animation","AnimationStart"),transitionrun:wn("Transition","TransitionRun"),transitionstart:wn("Transition","TransitionStart"),transitioncancel:wn("Transition","TransitionCancel"),transitionend:wn("Transition","TransitionEnd")},xo={},Qf={};Tl&&(Qf=document.createElement("div").style,"AnimationEvent"in window||(delete li.animationend.animation,delete li.animationiteration.animation,delete li.animationstart.animation),"TransitionEvent"in window||delete li.transitionend.transition);function En(t){if(xo[t])return xo[t];if(!li[t])return t;var e=li[t],l;for(l in e)if(e.hasOwnProperty(l)&&l in Qf)return xo[t]=e[l];return t}var Zf=En("animationend"),Wf=En("animationiteration"),Kf=En("animationstart"),Xy=En("transitionrun"),Qy=En("transitionstart"),Zy=En("transitioncancel"),Ff=En("transitionend"),Jf=new Map,bo="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");bo.push("scrollEnd");function ul(t,e){Jf.set(t,e),Sn(e,[t])}var If=new WeakMap;function Ke(t,e){if(typeof t=="object"&&t!==null){var l=If.get(t);return l!==void 0?l:(e={value:t,source:e,stack:mf(e)},If.set(t,e),e)}return{value:t,source:e,stack:mf(e)}}var Fe=[],ni=0,vo=0;function mu(){for(var t=ni,e=vo=ni=0;e<t;){var l=Fe[e];Fe[e++]=null;var i=Fe[e];Fe[e++]=null;var a=Fe[e];Fe[e++]=null;var r=Fe[e];if(Fe[e++]=null,i!==null&&a!==null){var h=i.pending;h===null?a.next=a:(a.next=h.next,h.next=a),i.pending=a}r!==0&&Pf(l,a,r)}}function gu(t,e,l,i){Fe[ni++]=t,Fe[ni++]=e,Fe[ni++]=l,Fe[ni++]=i,vo|=i,t.lanes|=i,t=t.alternate,t!==null&&(t.lanes|=i)}function So(t,e,l,i){return gu(t,e,l,i),yu(t)}function ii(t,e){return gu(t,null,null,e),yu(t)}function Pf(t,e,l){t.lanes|=l;var i=t.alternate;i!==null&&(i.lanes|=l);for(var a=!1,r=t.return;r!==null;)r.childLanes|=l,i=r.alternate,i!==null&&(i.childLanes|=l),r.tag===22&&(t=r.stateNode,t===null||t._visibility&1||(a=!0)),t=r,r=r.return;return t.tag===3?(r=t.stateNode,a&&e!==null&&(a=31-Zt(l),t=r.hiddenUpdates,i=t[a],i===null?t[a]=[e]:i.push(e),e.lane=l|536870912),r):null}function yu(t){if(50<Aa)throw Aa=0,js=null,Error(s(185));for(var e=t.return;e!==null;)t=e,e=t.return;return t.tag===3?t.stateNode:null}var ai={};function Wy(t,e,l,i){this.tag=t,this.key=l,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Le(t,e,l,i){return new Wy(t,e,l,i)}function $o(t){return t=t.prototype,!(!t||!t.isReactComponent)}function zl(t,e){var l=t.alternate;return l===null?(l=Le(t.tag,e,t.key,t.mode),l.elementType=t.elementType,l.type=t.type,l.stateNode=t.stateNode,l.alternate=t,t.alternate=l):(l.pendingProps=e,l.type=t.type,l.flags=0,l.subtreeFlags=0,l.deletions=null),l.flags=t.flags&65011712,l.childLanes=t.childLanes,l.lanes=t.lanes,l.child=t.child,l.memoizedProps=t.memoizedProps,l.memoizedState=t.memoizedState,l.updateQueue=t.updateQueue,e=t.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},l.sibling=t.sibling,l.index=t.index,l.ref=t.ref,l.refCleanup=t.refCleanup,l}function td(t,e){t.flags&=65011714;var l=t.alternate;return l===null?(t.childLanes=0,t.lanes=e,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=l.childLanes,t.lanes=l.lanes,t.child=l.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=l.memoizedProps,t.memoizedState=l.memoizedState,t.updateQueue=l.updateQueue,t.type=l.type,e=l.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t}function pu(t,e,l,i,a,r){var h=0;if(i=t,typeof t=="function")$o(t)&&(h=1);else if(typeof t=="string")h=Fp(t,l,gt.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(t){case W:return t=Le(31,l,e,a),t.elementType=W,t.lanes=r,t;case tt:return Tn(l.children,a,r,e);case k:h=8,a|=24;break;case O:return t=Le(12,l,e,a|2),t.elementType=O,t.lanes=r,t;case Q:return t=Le(13,l,e,a),t.elementType=Q,t.lanes=r,t;case rt:return t=Le(19,l,e,a),t.elementType=rt,t.lanes=r,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Z:case L:h=10;break t;case B:h=9;break t;case P:h=11;break t;case J:h=14;break t;case mt:h=16,i=null;break t}h=29,l=Error(s(130,t===null?"null":typeof t,"")),i=null}return e=Le(h,l,e,a),e.elementType=t,e.type=i,e.lanes=r,e}function Tn(t,e,l,i){return t=Le(7,t,i,e),t.lanes=l,t}function wo(t,e,l){return t=Le(6,t,null,e),t.lanes=l,t}function Eo(t,e,l){return e=Le(4,t.children!==null?t.children:[],t.key,e),e.lanes=l,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}var ui=[],ri=0,xu=null,bu=0,Je=[],Ie=0,zn=null,jl=1,Al="";function jn(t,e){ui[ri++]=bu,ui[ri++]=xu,xu=t,bu=e}function ed(t,e,l){Je[Ie++]=jl,Je[Ie++]=Al,Je[Ie++]=zn,zn=t;var i=jl;t=Al;var a=32-Zt(i)-1;i&=~(1<<a),l+=1;var r=32-Zt(e)+a;if(30<r){var h=a-a%5;r=(i&(1<<h)-1).toString(32),i>>=h,a-=h,jl=1<<32-Zt(e)+a|l<<a|i,Al=r+t}else jl=1<<r|l<<a|i,Al=t}function To(t){t.return!==null&&(jn(t,1),ed(t,1,0))}function zo(t){for(;t===xu;)xu=ui[--ri],ui[ri]=null,bu=ui[--ri],ui[ri]=null;for(;t===zn;)zn=Je[--Ie],Je[Ie]=null,Al=Je[--Ie],Je[Ie]=null,jl=Je[--Ie],Je[Ie]=null}var Ce=null,te=null,Ut=!1,An=null,hl=!1,jo=Error(s(519));function Cn(t){var e=Error(s(418,""));throw ua(Ke(e,t)),jo}function ld(t){var e=t.stateNode,l=t.type,i=t.memoizedProps;switch(e[Ee]=t,e[De]=i,l){case"dialog":Mt("cancel",e),Mt("close",e);break;case"iframe":case"object":case"embed":Mt("load",e);break;case"video":case"audio":for(l=0;l<_a.length;l++)Mt(_a[l],e);break;case"source":Mt("error",e);break;case"img":case"image":case"link":Mt("error",e),Mt("load",e);break;case"details":Mt("toggle",e);break;case"input":Mt("invalid",e),pf(e,i.value,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name,!0),au(e);break;case"select":Mt("invalid",e);break;case"textarea":Mt("invalid",e),bf(e,i.value,i.defaultValue,i.children),au(e)}l=i.children,typeof l!="string"&&typeof l!="number"&&typeof l!="bigint"||e.textContent===""+l||i.suppressHydrationWarning===!0||bm(e.textContent,l)?(i.popover!=null&&(Mt("beforetoggle",e),Mt("toggle",e)),i.onScroll!=null&&Mt("scroll",e),i.onScrollEnd!=null&&Mt("scrollend",e),i.onClick!=null&&(e.onclick=Pu),e=!0):e=!1,e||Cn(t)}function nd(t){for(Ce=t.return;Ce;)switch(Ce.tag){case 5:case 13:hl=!1;return;case 27:case 3:hl=!0;return;default:Ce=Ce.return}}function ia(t){if(t!==Ce)return!1;if(!Ut)return nd(t),Ut=!0,!1;var e=t.tag,l;if((l=e!==3&&e!==27)&&((l=e===5)&&(l=t.type,l=!(l!=="form"&&l!=="button")||Ys(t.type,t.memoizedProps)),l=!l),l&&te&&Cn(t),nd(t),e===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));t:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8)if(l=t.data,l==="/$"){if(e===0){te=ol(t.nextSibling);break t}e--}else l!=="$"&&l!=="$!"&&l!=="$?"||e++;t=t.nextSibling}te=null}}else e===27?(e=te,cn(t.type)?(t=Zs,Zs=null,te=t):te=e):te=Ce?ol(t.stateNode.nextSibling):null;return!0}function aa(){te=Ce=null,Ut=!1}function id(){var t=An;return t!==null&&(ke===null?ke=t:ke.push.apply(ke,t),An=null),t}function ua(t){An===null?An=[t]:An.push(t)}var Ao=X(null),_n=null,Cl=null;function Wl(t,e,l){it(Ao,e._currentValue),e._currentValue=l}function _l(t){t._currentValue=Ao.current,nt(Ao)}function Co(t,e,l){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===l)break;t=t.return}}function _o(t,e,l,i){var a=t.child;for(a!==null&&(a.return=t);a!==null;){var r=a.dependencies;if(r!==null){var h=a.child;r=r.firstContext;t:for(;r!==null;){var m=r;r=a;for(var b=0;b<e.length;b++)if(m.context===e[b]){r.lanes|=l,m=r.alternate,m!==null&&(m.lanes|=l),Co(r.return,l,t),i||(h=null);break t}r=m.next}}else if(a.tag===18){if(h=a.return,h===null)throw Error(s(341));h.lanes|=l,r=h.alternate,r!==null&&(r.lanes|=l),Co(h,l,t),h=null}else h=a.child;if(h!==null)h.return=a;else for(h=a;h!==null;){if(h===t){h=null;break}if(a=h.sibling,a!==null){a.return=h.return,h=a;break}h=h.return}a=h}}function ra(t,e,l,i){t=null;for(var a=e,r=!1;a!==null;){if(!r){if((a.flags&524288)!==0)r=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var h=a.alternate;if(h===null)throw Error(s(387));if(h=h.memoizedProps,h!==null){var m=a.type;Ue(a.pendingProps.value,h.value)||(t!==null?t.push(m):t=[m])}}else if(a===Pt.current){if(h=a.alternate,h===null)throw Error(s(387));h.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(t!==null?t.push(Na):t=[Na])}a=a.return}t!==null&&_o(e,t,l,i),e.flags|=262144}function vu(t){for(t=t.firstContext;t!==null;){if(!Ue(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function Dn(t){_n=t,Cl=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Te(t){return ad(_n,t)}function Su(t,e){return _n===null&&Dn(t),ad(t,e)}function ad(t,e){var l=e._currentValue;if(e={context:e,memoizedValue:l,next:null},Cl===null){if(t===null)throw Error(s(308));Cl=e,t.dependencies={lanes:0,firstContext:e},t.flags|=524288}else Cl=Cl.next=e;return l}var Ky=typeof AbortController<"u"?AbortController:function(){var t=[],e=this.signal={aborted:!1,addEventListener:function(l,i){t.push(i)}};this.abort=function(){e.aborted=!0,t.forEach(function(l){return l()})}},Fy=n.unstable_scheduleCallback,Jy=n.unstable_NormalPriority,ce={$$typeof:L,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Do(){return{controller:new Ky,data:new Map,refCount:0}}function oa(t){t.refCount--,t.refCount===0&&Fy(Jy,function(){t.controller.abort()})}var sa=null,Mo=0,oi=0,si=null;function Iy(t,e){if(sa===null){var l=sa=[];Mo=0,oi=Os(),si={status:"pending",value:void 0,then:function(i){l.push(i)}}}return Mo++,e.then(ud,ud),e}function ud(){if(--Mo===0&&sa!==null){si!==null&&(si.status="fulfilled");var t=sa;sa=null,oi=0,si=null;for(var e=0;e<t.length;e++)(0,t[e])()}}function Py(t,e){var l=[],i={status:"pending",value:null,reason:null,then:function(a){l.push(a)}};return t.then(function(){i.status="fulfilled",i.value=e;for(var a=0;a<l.length;a++)(0,l[a])(e)},function(a){for(i.status="rejected",i.reason=a,a=0;a<l.length;a++)(0,l[a])(void 0)}),i}var rd=M.S;M.S=function(t,e){typeof e=="object"&&e!==null&&typeof e.then=="function"&&Iy(t,e),rd!==null&&rd(t,e)};var Mn=X(null);function Ro(){var t=Mn.current;return t!==null?t:Wt.pooledCache}function $u(t,e){e===null?it(Mn,Mn.current):it(Mn,e.pool)}function od(){var t=Ro();return t===null?null:{parent:ce._currentValue,pool:t}}var ca=Error(s(460)),sd=Error(s(474)),wu=Error(s(542)),Oo={then:function(){}};function cd(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Eu(){}function fd(t,e,l){switch(l=t[l],l===void 0?t.push(e):l!==e&&(e.then(Eu,Eu),e=l),e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,hd(t),t;default:if(typeof e.status=="string")e.then(Eu,Eu);else{if(t=Wt,t!==null&&100<t.shellSuspendCounter)throw Error(s(482));t=e,t.status="pending",t.then(function(i){if(e.status==="pending"){var a=e;a.status="fulfilled",a.value=i}},function(i){if(e.status==="pending"){var a=e;a.status="rejected",a.reason=i}})}switch(e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,hd(t),t}throw fa=e,ca}}var fa=null;function dd(){if(fa===null)throw Error(s(459));var t=fa;return fa=null,t}function hd(t){if(t===ca||t===wu)throw Error(s(483))}var Kl=!1;function ko(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function No(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Fl(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Jl(t,e,l){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,(qt&2)!==0){var a=i.pending;return a===null?e.next=e:(e.next=a.next,a.next=e),i.pending=e,e=yu(t),Pf(t,null,l),e}return gu(t,i,e,l),yu(t)}function da(t,e,l){if(e=e.updateQueue,e!==null&&(e=e.shared,(l&4194048)!==0)){var i=e.lanes;i&=t.pendingLanes,l|=i,e.lanes=l,uf(t,l)}}function Bo(t,e){var l=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,l===i)){var a=null,r=null;if(l=l.firstBaseUpdate,l!==null){do{var h={lane:l.lane,tag:l.tag,payload:l.payload,callback:null,next:null};r===null?a=r=h:r=r.next=h,l=l.next}while(l!==null);r===null?a=r=e:r=r.next=e}else a=r=e;l={baseState:i.baseState,firstBaseUpdate:a,lastBaseUpdate:r,shared:i.shared,callbacks:i.callbacks},t.updateQueue=l;return}t=l.lastBaseUpdate,t===null?l.firstBaseUpdate=e:t.next=e,l.lastBaseUpdate=e}var Uo=!1;function ha(){if(Uo){var t=si;if(t!==null)throw t}}function ma(t,e,l,i){Uo=!1;var a=t.updateQueue;Kl=!1;var r=a.firstBaseUpdate,h=a.lastBaseUpdate,m=a.shared.pending;if(m!==null){a.shared.pending=null;var b=m,C=b.next;b.next=null,h===null?r=C:h.next=C,h=b;var U=t.alternate;U!==null&&(U=U.updateQueue,m=U.lastBaseUpdate,m!==h&&(m===null?U.firstBaseUpdate=C:m.next=C,U.lastBaseUpdate=b))}if(r!==null){var G=a.baseState;h=0,U=C=b=null,m=r;do{var D=m.lane&-536870913,R=D!==m.lane;if(R?(kt&D)===D:(i&D)===D){D!==0&&D===oi&&(Uo=!0),U!==null&&(U=U.next={lane:0,tag:m.tag,payload:m.payload,callback:null,next:null});t:{var St=t,xt=m;D=e;var Xt=l;switch(xt.tag){case 1:if(St=xt.payload,typeof St=="function"){G=St.call(Xt,G,D);break t}G=St;break t;case 3:St.flags=St.flags&-65537|128;case 0:if(St=xt.payload,D=typeof St=="function"?St.call(Xt,G,D):St,D==null)break t;G=v({},G,D);break t;case 2:Kl=!0}}D=m.callback,D!==null&&(t.flags|=64,R&&(t.flags|=8192),R=a.callbacks,R===null?a.callbacks=[D]:R.push(D))}else R={lane:D,tag:m.tag,payload:m.payload,callback:m.callback,next:null},U===null?(C=U=R,b=G):U=U.next=R,h|=D;if(m=m.next,m===null){if(m=a.shared.pending,m===null)break;R=m,m=R.next,R.next=null,a.lastBaseUpdate=R,a.shared.pending=null}}while(!0);U===null&&(b=G),a.baseState=b,a.firstBaseUpdate=C,a.lastBaseUpdate=U,r===null&&(a.shared.lanes=0),un|=h,t.lanes=h,t.memoizedState=G}}function md(t,e){if(typeof t!="function")throw Error(s(191,t));t.call(e)}function gd(t,e){var l=t.callbacks;if(l!==null)for(t.callbacks=null,t=0;t<l.length;t++)md(l[t],e)}var ci=X(null),Tu=X(0);function yd(t,e){t=Bl,it(Tu,t),it(ci,e),Bl=t|e.baseLanes}function Lo(){it(Tu,Bl),it(ci,ci.current)}function Ho(){Bl=Tu.current,nt(ci),nt(Tu)}var Il=0,Ct=null,Yt=null,ue=null,zu=!1,fi=!1,Rn=!1,ju=0,ga=0,di=null,tp=0;function le(){throw Error(s(321))}function qo(t,e){if(e===null)return!1;for(var l=0;l<e.length&&l<t.length;l++)if(!Ue(t[l],e[l]))return!1;return!0}function Vo(t,e,l,i,a,r){return Il=r,Ct=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,M.H=t===null||t.memoizedState===null?Pd:th,Rn=!1,r=l(i,a),Rn=!1,fi&&(r=xd(e,l,i,a)),pd(t),r}function pd(t){M.H=Ru;var e=Yt!==null&&Yt.next!==null;if(Il=0,ue=Yt=Ct=null,zu=!1,ga=0,di=null,e)throw Error(s(300));t===null||ge||(t=t.dependencies,t!==null&&vu(t)&&(ge=!0))}function xd(t,e,l,i){Ct=t;var a=0;do{if(fi&&(di=null),ga=0,fi=!1,25<=a)throw Error(s(301));if(a+=1,ue=Yt=null,t.updateQueue!=null){var r=t.updateQueue;r.lastEffect=null,r.events=null,r.stores=null,r.memoCache!=null&&(r.memoCache.index=0)}M.H=rp,r=e(l,i)}while(fi);return r}function ep(){var t=M.H,e=t.useState()[0];return e=typeof e.then=="function"?ya(e):e,t=t.useState()[0],(Yt!==null?Yt.memoizedState:null)!==t&&(Ct.flags|=1024),e}function Yo(){var t=ju!==0;return ju=0,t}function Go(t,e,l){e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~l}function Xo(t){if(zu){for(t=t.memoizedState;t!==null;){var e=t.queue;e!==null&&(e.pending=null),t=t.next}zu=!1}Il=0,ue=Yt=Ct=null,fi=!1,ga=ju=0,di=null}function Re(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ue===null?Ct.memoizedState=ue=t:ue=ue.next=t,ue}function re(){if(Yt===null){var t=Ct.alternate;t=t!==null?t.memoizedState:null}else t=Yt.next;var e=ue===null?Ct.memoizedState:ue.next;if(e!==null)ue=e,Yt=t;else{if(t===null)throw Ct.alternate===null?Error(s(467)):Error(s(310));Yt=t,t={memoizedState:Yt.memoizedState,baseState:Yt.baseState,baseQueue:Yt.baseQueue,queue:Yt.queue,next:null},ue===null?Ct.memoizedState=ue=t:ue=ue.next=t}return ue}function Qo(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ya(t){var e=ga;return ga+=1,di===null&&(di=[]),t=fd(di,t,e),e=Ct,(ue===null?e.memoizedState:ue.next)===null&&(e=e.alternate,M.H=e===null||e.memoizedState===null?Pd:th),t}function Au(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return ya(t);if(t.$$typeof===L)return Te(t)}throw Error(s(438,String(t)))}function Zo(t){var e=null,l=Ct.updateQueue;if(l!==null&&(e=l.memoCache),e==null){var i=Ct.alternate;i!==null&&(i=i.updateQueue,i!==null&&(i=i.memoCache,i!=null&&(e={data:i.data.map(function(a){return a.slice()}),index:0})))}if(e==null&&(e={data:[],index:0}),l===null&&(l=Qo(),Ct.updateQueue=l),l.memoCache=e,l=e.data[e.index],l===void 0)for(l=e.data[e.index]=Array(t),i=0;i<t;i++)l[i]=F;return e.index++,l}function Dl(t,e){return typeof e=="function"?e(t):e}function Cu(t){var e=re();return Wo(e,Yt,t)}function Wo(t,e,l){var i=t.queue;if(i===null)throw Error(s(311));i.lastRenderedReducer=l;var a=t.baseQueue,r=i.pending;if(r!==null){if(a!==null){var h=a.next;a.next=r.next,r.next=h}e.baseQueue=a=r,i.pending=null}if(r=t.baseState,a===null)t.memoizedState=r;else{e=a.next;var m=h=null,b=null,C=e,U=!1;do{var G=C.lane&-536870913;if(G!==C.lane?(kt&G)===G:(Il&G)===G){var D=C.revertLane;if(D===0)b!==null&&(b=b.next={lane:0,revertLane:0,action:C.action,hasEagerState:C.hasEagerState,eagerState:C.eagerState,next:null}),G===oi&&(U=!0);else if((Il&D)===D){C=C.next,D===oi&&(U=!0);continue}else G={lane:0,revertLane:C.revertLane,action:C.action,hasEagerState:C.hasEagerState,eagerState:C.eagerState,next:null},b===null?(m=b=G,h=r):b=b.next=G,Ct.lanes|=D,un|=D;G=C.action,Rn&&l(r,G),r=C.hasEagerState?C.eagerState:l(r,G)}else D={lane:G,revertLane:C.revertLane,action:C.action,hasEagerState:C.hasEagerState,eagerState:C.eagerState,next:null},b===null?(m=b=D,h=r):b=b.next=D,Ct.lanes|=G,un|=G;C=C.next}while(C!==null&&C!==e);if(b===null?h=r:b.next=m,!Ue(r,t.memoizedState)&&(ge=!0,U&&(l=si,l!==null)))throw l;t.memoizedState=r,t.baseState=h,t.baseQueue=b,i.lastRenderedState=r}return a===null&&(i.lanes=0),[t.memoizedState,i.dispatch]}function Ko(t){var e=re(),l=e.queue;if(l===null)throw Error(s(311));l.lastRenderedReducer=t;var i=l.dispatch,a=l.pending,r=e.memoizedState;if(a!==null){l.pending=null;var h=a=a.next;do r=t(r,h.action),h=h.next;while(h!==a);Ue(r,e.memoizedState)||(ge=!0),e.memoizedState=r,e.baseQueue===null&&(e.baseState=r),l.lastRenderedState=r}return[r,i]}function bd(t,e,l){var i=Ct,a=re(),r=Ut;if(r){if(l===void 0)throw Error(s(407));l=l()}else l=e();var h=!Ue((Yt||a).memoizedState,l);h&&(a.memoizedState=l,ge=!0),a=a.queue;var m=$d.bind(null,i,a,t);if(pa(2048,8,m,[t]),a.getSnapshot!==e||h||ue!==null&&ue.memoizedState.tag&1){if(i.flags|=2048,hi(9,_u(),Sd.bind(null,i,a,l,e),null),Wt===null)throw Error(s(349));r||(Il&124)!==0||vd(i,e,l)}return l}function vd(t,e,l){t.flags|=16384,t={getSnapshot:e,value:l},e=Ct.updateQueue,e===null?(e=Qo(),Ct.updateQueue=e,e.stores=[t]):(l=e.stores,l===null?e.stores=[t]:l.push(t))}function Sd(t,e,l,i){e.value=l,e.getSnapshot=i,wd(e)&&Ed(t)}function $d(t,e,l){return l(function(){wd(e)&&Ed(t)})}function wd(t){var e=t.getSnapshot;t=t.value;try{var l=e();return!Ue(t,l)}catch{return!0}}function Ed(t){var e=ii(t,2);e!==null&&Ge(e,t,2)}function Fo(t){var e=Re();if(typeof t=="function"){var l=t;if(t=l(),Rn){Ot(!0);try{l()}finally{Ot(!1)}}}return e.memoizedState=e.baseState=t,e.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Dl,lastRenderedState:t},e}function Td(t,e,l,i){return t.baseState=l,Wo(t,Yt,typeof i=="function"?i:Dl)}function lp(t,e,l,i,a){if(Mu(t))throw Error(s(485));if(t=e.action,t!==null){var r={payload:a,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(h){r.listeners.push(h)}};M.T!==null?l(!0):r.isTransition=!1,i(r),l=e.pending,l===null?(r.next=e.pending=r,zd(e,r)):(r.next=l.next,e.pending=l.next=r)}}function zd(t,e){var l=e.action,i=e.payload,a=t.state;if(e.isTransition){var r=M.T,h={};M.T=h;try{var m=l(a,i),b=M.S;b!==null&&b(h,m),jd(t,e,m)}catch(C){Jo(t,e,C)}finally{M.T=r}}else try{r=l(a,i),jd(t,e,r)}catch(C){Jo(t,e,C)}}function jd(t,e,l){l!==null&&typeof l=="object"&&typeof l.then=="function"?l.then(function(i){Ad(t,e,i)},function(i){return Jo(t,e,i)}):Ad(t,e,l)}function Ad(t,e,l){e.status="fulfilled",e.value=l,Cd(e),t.state=l,e=t.pending,e!==null&&(l=e.next,l===e?t.pending=null:(l=l.next,e.next=l,zd(t,l)))}function Jo(t,e,l){var i=t.pending;if(t.pending=null,i!==null){i=i.next;do e.status="rejected",e.reason=l,Cd(e),e=e.next;while(e!==i)}t.action=null}function Cd(t){t=t.listeners;for(var e=0;e<t.length;e++)(0,t[e])()}function _d(t,e){return e}function Dd(t,e){if(Ut){var l=Wt.formState;if(l!==null){t:{var i=Ct;if(Ut){if(te){e:{for(var a=te,r=hl;a.nodeType!==8;){if(!r){a=null;break e}if(a=ol(a.nextSibling),a===null){a=null;break e}}r=a.data,a=r==="F!"||r==="F"?a:null}if(a){te=ol(a.nextSibling),i=a.data==="F!";break t}}Cn(i)}i=!1}i&&(e=l[0])}}return l=Re(),l.memoizedState=l.baseState=e,i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:_d,lastRenderedState:e},l.queue=i,l=Fd.bind(null,Ct,i),i.dispatch=l,i=Fo(!1),r=ls.bind(null,Ct,!1,i.queue),i=Re(),a={state:e,dispatch:null,action:t,pending:null},i.queue=a,l=lp.bind(null,Ct,a,r,l),a.dispatch=l,i.memoizedState=t,[e,l,!1]}function Md(t){var e=re();return Rd(e,Yt,t)}function Rd(t,e,l){if(e=Wo(t,e,_d)[0],t=Cu(Dl)[0],typeof e=="object"&&e!==null&&typeof e.then=="function")try{var i=ya(e)}catch(h){throw h===ca?wu:h}else i=e;e=re();var a=e.queue,r=a.dispatch;return l!==e.memoizedState&&(Ct.flags|=2048,hi(9,_u(),np.bind(null,a,l),null)),[i,r,t]}function np(t,e){t.action=e}function Od(t){var e=re(),l=Yt;if(l!==null)return Rd(e,l,t);re(),e=e.memoizedState,l=re();var i=l.queue.dispatch;return l.memoizedState=t,[e,i,!1]}function hi(t,e,l,i){return t={tag:t,create:l,deps:i,inst:e,next:null},e=Ct.updateQueue,e===null&&(e=Qo(),Ct.updateQueue=e),l=e.lastEffect,l===null?e.lastEffect=t.next=t:(i=l.next,l.next=t,t.next=i,e.lastEffect=t),t}function _u(){return{destroy:void 0,resource:void 0}}function kd(){return re().memoizedState}function Du(t,e,l,i){var a=Re();i=i===void 0?null:i,Ct.flags|=t,a.memoizedState=hi(1|e,_u(),l,i)}function pa(t,e,l,i){var a=re();i=i===void 0?null:i;var r=a.memoizedState.inst;Yt!==null&&i!==null&&qo(i,Yt.memoizedState.deps)?a.memoizedState=hi(e,r,l,i):(Ct.flags|=t,a.memoizedState=hi(1|e,r,l,i))}function Nd(t,e){Du(8390656,8,t,e)}function Bd(t,e){pa(2048,8,t,e)}function Ud(t,e){return pa(4,2,t,e)}function Ld(t,e){return pa(4,4,t,e)}function Hd(t,e){if(typeof e=="function"){t=t();var l=e(t);return function(){typeof l=="function"?l():e(null)}}if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function qd(t,e,l){l=l!=null?l.concat([t]):null,pa(4,4,Hd.bind(null,e,t),l)}function Io(){}function Vd(t,e){var l=re();e=e===void 0?null:e;var i=l.memoizedState;return e!==null&&qo(e,i[1])?i[0]:(l.memoizedState=[t,e],t)}function Yd(t,e){var l=re();e=e===void 0?null:e;var i=l.memoizedState;if(e!==null&&qo(e,i[1]))return i[0];if(i=t(),Rn){Ot(!0);try{t()}finally{Ot(!1)}}return l.memoizedState=[i,e],i}function Po(t,e,l){return l===void 0||(Il&1073741824)!==0?t.memoizedState=e:(t.memoizedState=l,t=Qh(),Ct.lanes|=t,un|=t,l)}function Gd(t,e,l,i){return Ue(l,e)?l:ci.current!==null?(t=Po(t,l,i),Ue(t,e)||(ge=!0),t):(Il&42)===0?(ge=!0,t.memoizedState=l):(t=Qh(),Ct.lanes|=t,un|=t,e)}function Xd(t,e,l,i,a){var r=I.p;I.p=r!==0&&8>r?r:8;var h=M.T,m={};M.T=m,ls(t,!1,e,l);try{var b=a(),C=M.S;if(C!==null&&C(m,b),b!==null&&typeof b=="object"&&typeof b.then=="function"){var U=Py(b,i);xa(t,e,U,Ye(t))}else xa(t,e,i,Ye(t))}catch(G){xa(t,e,{then:function(){},status:"rejected",reason:G},Ye())}finally{I.p=r,M.T=h}}function ip(){}function ts(t,e,l,i){if(t.tag!==5)throw Error(s(476));var a=Qd(t).queue;Xd(t,a,e,dt,l===null?ip:function(){return Zd(t),l(i)})}function Qd(t){var e=t.memoizedState;if(e!==null)return e;e={memoizedState:dt,baseState:dt,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Dl,lastRenderedState:dt},next:null};var l={};return e.next={memoizedState:l,baseState:l,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Dl,lastRenderedState:l},next:null},t.memoizedState=e,t=t.alternate,t!==null&&(t.memoizedState=e),e}function Zd(t){var e=Qd(t).next.queue;xa(t,e,{},Ye())}function es(){return Te(Na)}function Wd(){return re().memoizedState}function Kd(){return re().memoizedState}function ap(t){for(var e=t.return;e!==null;){switch(e.tag){case 24:case 3:var l=Ye();t=Fl(l);var i=Jl(e,t,l);i!==null&&(Ge(i,e,l),da(i,e,l)),e={cache:Do()},t.payload=e;return}e=e.return}}function up(t,e,l){var i=Ye();l={lane:i,revertLane:0,action:l,hasEagerState:!1,eagerState:null,next:null},Mu(t)?Jd(e,l):(l=So(t,e,l,i),l!==null&&(Ge(l,t,i),Id(l,e,i)))}function Fd(t,e,l){var i=Ye();xa(t,e,l,i)}function xa(t,e,l,i){var a={lane:i,revertLane:0,action:l,hasEagerState:!1,eagerState:null,next:null};if(Mu(t))Jd(e,a);else{var r=t.alternate;if(t.lanes===0&&(r===null||r.lanes===0)&&(r=e.lastRenderedReducer,r!==null))try{var h=e.lastRenderedState,m=r(h,l);if(a.hasEagerState=!0,a.eagerState=m,Ue(m,h))return gu(t,e,a,0),Wt===null&&mu(),!1}catch{}finally{}if(l=So(t,e,a,i),l!==null)return Ge(l,t,i),Id(l,e,i),!0}return!1}function ls(t,e,l,i){if(i={lane:2,revertLane:Os(),action:i,hasEagerState:!1,eagerState:null,next:null},Mu(t)){if(e)throw Error(s(479))}else e=So(t,l,i,2),e!==null&&Ge(e,t,2)}function Mu(t){var e=t.alternate;return t===Ct||e!==null&&e===Ct}function Jd(t,e){fi=zu=!0;var l=t.pending;l===null?e.next=e:(e.next=l.next,l.next=e),t.pending=e}function Id(t,e,l){if((l&4194048)!==0){var i=e.lanes;i&=t.pendingLanes,l|=i,e.lanes=l,uf(t,l)}}var Ru={readContext:Te,use:Au,useCallback:le,useContext:le,useEffect:le,useImperativeHandle:le,useLayoutEffect:le,useInsertionEffect:le,useMemo:le,useReducer:le,useRef:le,useState:le,useDebugValue:le,useDeferredValue:le,useTransition:le,useSyncExternalStore:le,useId:le,useHostTransitionStatus:le,useFormState:le,useActionState:le,useOptimistic:le,useMemoCache:le,useCacheRefresh:le},Pd={readContext:Te,use:Au,useCallback:function(t,e){return Re().memoizedState=[t,e===void 0?null:e],t},useContext:Te,useEffect:Nd,useImperativeHandle:function(t,e,l){l=l!=null?l.concat([t]):null,Du(4194308,4,Hd.bind(null,e,t),l)},useLayoutEffect:function(t,e){return Du(4194308,4,t,e)},useInsertionEffect:function(t,e){Du(4,2,t,e)},useMemo:function(t,e){var l=Re();e=e===void 0?null:e;var i=t();if(Rn){Ot(!0);try{t()}finally{Ot(!1)}}return l.memoizedState=[i,e],i},useReducer:function(t,e,l){var i=Re();if(l!==void 0){var a=l(e);if(Rn){Ot(!0);try{l(e)}finally{Ot(!1)}}}else a=e;return i.memoizedState=i.baseState=a,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:a},i.queue=t,t=t.dispatch=up.bind(null,Ct,t),[i.memoizedState,t]},useRef:function(t){var e=Re();return t={current:t},e.memoizedState=t},useState:function(t){t=Fo(t);var e=t.queue,l=Fd.bind(null,Ct,e);return e.dispatch=l,[t.memoizedState,l]},useDebugValue:Io,useDeferredValue:function(t,e){var l=Re();return Po(l,t,e)},useTransition:function(){var t=Fo(!1);return t=Xd.bind(null,Ct,t.queue,!0,!1),Re().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,e,l){var i=Ct,a=Re();if(Ut){if(l===void 0)throw Error(s(407));l=l()}else{if(l=e(),Wt===null)throw Error(s(349));(kt&124)!==0||vd(i,e,l)}a.memoizedState=l;var r={value:l,getSnapshot:e};return a.queue=r,Nd($d.bind(null,i,r,t),[t]),i.flags|=2048,hi(9,_u(),Sd.bind(null,i,r,l,e),null),l},useId:function(){var t=Re(),e=Wt.identifierPrefix;if(Ut){var l=Al,i=jl;l=(i&~(1<<32-Zt(i)-1)).toString(32)+l,e="«"+e+"R"+l,l=ju++,0<l&&(e+="H"+l.toString(32)),e+="»"}else l=tp++,e="«"+e+"r"+l.toString(32)+"»";return t.memoizedState=e},useHostTransitionStatus:es,useFormState:Dd,useActionState:Dd,useOptimistic:function(t){var e=Re();e.memoizedState=e.baseState=t;var l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return e.queue=l,e=ls.bind(null,Ct,!0,l),l.dispatch=e,[t,e]},useMemoCache:Zo,useCacheRefresh:function(){return Re().memoizedState=ap.bind(null,Ct)}},th={readContext:Te,use:Au,useCallback:Vd,useContext:Te,useEffect:Bd,useImperativeHandle:qd,useInsertionEffect:Ud,useLayoutEffect:Ld,useMemo:Yd,useReducer:Cu,useRef:kd,useState:function(){return Cu(Dl)},useDebugValue:Io,useDeferredValue:function(t,e){var l=re();return Gd(l,Yt.memoizedState,t,e)},useTransition:function(){var t=Cu(Dl)[0],e=re().memoizedState;return[typeof t=="boolean"?t:ya(t),e]},useSyncExternalStore:bd,useId:Wd,useHostTransitionStatus:es,useFormState:Md,useActionState:Md,useOptimistic:function(t,e){var l=re();return Td(l,Yt,t,e)},useMemoCache:Zo,useCacheRefresh:Kd},rp={readContext:Te,use:Au,useCallback:Vd,useContext:Te,useEffect:Bd,useImperativeHandle:qd,useInsertionEffect:Ud,useLayoutEffect:Ld,useMemo:Yd,useReducer:Ko,useRef:kd,useState:function(){return Ko(Dl)},useDebugValue:Io,useDeferredValue:function(t,e){var l=re();return Yt===null?Po(l,t,e):Gd(l,Yt.memoizedState,t,e)},useTransition:function(){var t=Ko(Dl)[0],e=re().memoizedState;return[typeof t=="boolean"?t:ya(t),e]},useSyncExternalStore:bd,useId:Wd,useHostTransitionStatus:es,useFormState:Od,useActionState:Od,useOptimistic:function(t,e){var l=re();return Yt!==null?Td(l,Yt,t,e):(l.baseState=t,[t,l.queue.dispatch])},useMemoCache:Zo,useCacheRefresh:Kd},mi=null,ba=0;function Ou(t){var e=ba;return ba+=1,mi===null&&(mi=[]),fd(mi,t,e)}function va(t,e){e=e.props.ref,t.ref=e!==void 0?e:null}function ku(t,e){throw e.$$typeof===z?Error(s(525)):(t=Object.prototype.toString.call(e),Error(s(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)))}function eh(t){var e=t._init;return e(t._payload)}function lh(t){function e(T,w){if(t){var A=T.deletions;A===null?(T.deletions=[w],T.flags|=16):A.push(w)}}function l(T,w){if(!t)return null;for(;w!==null;)e(T,w),w=w.sibling;return null}function i(T){for(var w=new Map;T!==null;)T.key!==null?w.set(T.key,T):w.set(T.index,T),T=T.sibling;return w}function a(T,w){return T=zl(T,w),T.index=0,T.sibling=null,T}function r(T,w,A){return T.index=A,t?(A=T.alternate,A!==null?(A=A.index,A<w?(T.flags|=67108866,w):A):(T.flags|=67108866,w)):(T.flags|=1048576,w)}function h(T){return t&&T.alternate===null&&(T.flags|=67108866),T}function m(T,w,A,Y){return w===null||w.tag!==6?(w=wo(A,T.mode,Y),w.return=T,w):(w=a(w,A),w.return=T,w)}function b(T,w,A,Y){var st=A.type;return st===tt?U(T,w,A.props.children,Y,A.key):w!==null&&(w.elementType===st||typeof st=="object"&&st!==null&&st.$$typeof===mt&&eh(st)===w.type)?(w=a(w,A.props),va(w,A),w.return=T,w):(w=pu(A.type,A.key,A.props,null,T.mode,Y),va(w,A),w.return=T,w)}function C(T,w,A,Y){return w===null||w.tag!==4||w.stateNode.containerInfo!==A.containerInfo||w.stateNode.implementation!==A.implementation?(w=Eo(A,T.mode,Y),w.return=T,w):(w=a(w,A.children||[]),w.return=T,w)}function U(T,w,A,Y,st){return w===null||w.tag!==7?(w=Tn(A,T.mode,Y,st),w.return=T,w):(w=a(w,A),w.return=T,w)}function G(T,w,A){if(typeof w=="string"&&w!==""||typeof w=="number"||typeof w=="bigint")return w=wo(""+w,T.mode,A),w.return=T,w;if(typeof w=="object"&&w!==null){switch(w.$$typeof){case j:return A=pu(w.type,w.key,w.props,null,T.mode,A),va(A,w),A.return=T,A;case H:return w=Eo(w,T.mode,A),w.return=T,w;case mt:var Y=w._init;return w=Y(w._payload),G(T,w,A)}if(wt(w)||V(w))return w=Tn(w,T.mode,A,null),w.return=T,w;if(typeof w.then=="function")return G(T,Ou(w),A);if(w.$$typeof===L)return G(T,Su(T,w),A);ku(T,w)}return null}function D(T,w,A,Y){var st=w!==null?w.key:null;if(typeof A=="string"&&A!==""||typeof A=="number"||typeof A=="bigint")return st!==null?null:m(T,w,""+A,Y);if(typeof A=="object"&&A!==null){switch(A.$$typeof){case j:return A.key===st?b(T,w,A,Y):null;case H:return A.key===st?C(T,w,A,Y):null;case mt:return st=A._init,A=st(A._payload),D(T,w,A,Y)}if(wt(A)||V(A))return st!==null?null:U(T,w,A,Y,null);if(typeof A.then=="function")return D(T,w,Ou(A),Y);if(A.$$typeof===L)return D(T,w,Su(T,A),Y);ku(T,A)}return null}function R(T,w,A,Y,st){if(typeof Y=="string"&&Y!==""||typeof Y=="number"||typeof Y=="bigint")return T=T.get(A)||null,m(w,T,""+Y,st);if(typeof Y=="object"&&Y!==null){switch(Y.$$typeof){case j:return T=T.get(Y.key===null?A:Y.key)||null,b(w,T,Y,st);case H:return T=T.get(Y.key===null?A:Y.key)||null,C(w,T,Y,st);case mt:var _t=Y._init;return Y=_t(Y._payload),R(T,w,A,Y,st)}if(wt(Y)||V(Y))return T=T.get(A)||null,U(w,T,Y,st,null);if(typeof Y.then=="function")return R(T,w,A,Ou(Y),st);if(Y.$$typeof===L)return R(T,w,A,Su(w,Y),st);ku(w,Y)}return null}function St(T,w,A,Y){for(var st=null,_t=null,yt=w,bt=w=0,pe=null;yt!==null&&bt<A.length;bt++){yt.index>bt?(pe=yt,yt=null):pe=yt.sibling;var Bt=D(T,yt,A[bt],Y);if(Bt===null){yt===null&&(yt=pe);break}t&&yt&&Bt.alternate===null&&e(T,yt),w=r(Bt,w,bt),_t===null?st=Bt:_t.sibling=Bt,_t=Bt,yt=pe}if(bt===A.length)return l(T,yt),Ut&&jn(T,bt),st;if(yt===null){for(;bt<A.length;bt++)yt=G(T,A[bt],Y),yt!==null&&(w=r(yt,w,bt),_t===null?st=yt:_t.sibling=yt,_t=yt);return Ut&&jn(T,bt),st}for(yt=i(yt);bt<A.length;bt++)pe=R(yt,T,bt,A[bt],Y),pe!==null&&(t&&pe.alternate!==null&&yt.delete(pe.key===null?bt:pe.key),w=r(pe,w,bt),_t===null?st=pe:_t.sibling=pe,_t=pe);return t&&yt.forEach(function(gn){return e(T,gn)}),Ut&&jn(T,bt),st}function xt(T,w,A,Y){if(A==null)throw Error(s(151));for(var st=null,_t=null,yt=w,bt=w=0,pe=null,Bt=A.next();yt!==null&&!Bt.done;bt++,Bt=A.next()){yt.index>bt?(pe=yt,yt=null):pe=yt.sibling;var gn=D(T,yt,Bt.value,Y);if(gn===null){yt===null&&(yt=pe);break}t&&yt&&gn.alternate===null&&e(T,yt),w=r(gn,w,bt),_t===null?st=gn:_t.sibling=gn,_t=gn,yt=pe}if(Bt.done)return l(T,yt),Ut&&jn(T,bt),st;if(yt===null){for(;!Bt.done;bt++,Bt=A.next())Bt=G(T,Bt.value,Y),Bt!==null&&(w=r(Bt,w,bt),_t===null?st=Bt:_t.sibling=Bt,_t=Bt);return Ut&&jn(T,bt),st}for(yt=i(yt);!Bt.done;bt++,Bt=A.next())Bt=R(yt,T,bt,Bt.value,Y),Bt!==null&&(t&&Bt.alternate!==null&&yt.delete(Bt.key===null?bt:Bt.key),w=r(Bt,w,bt),_t===null?st=Bt:_t.sibling=Bt,_t=Bt);return t&&yt.forEach(function(ox){return e(T,ox)}),Ut&&jn(T,bt),st}function Xt(T,w,A,Y){if(typeof A=="object"&&A!==null&&A.type===tt&&A.key===null&&(A=A.props.children),typeof A=="object"&&A!==null){switch(A.$$typeof){case j:t:{for(var st=A.key;w!==null;){if(w.key===st){if(st=A.type,st===tt){if(w.tag===7){l(T,w.sibling),Y=a(w,A.props.children),Y.return=T,T=Y;break t}}else if(w.elementType===st||typeof st=="object"&&st!==null&&st.$$typeof===mt&&eh(st)===w.type){l(T,w.sibling),Y=a(w,A.props),va(Y,A),Y.return=T,T=Y;break t}l(T,w);break}else e(T,w);w=w.sibling}A.type===tt?(Y=Tn(A.props.children,T.mode,Y,A.key),Y.return=T,T=Y):(Y=pu(A.type,A.key,A.props,null,T.mode,Y),va(Y,A),Y.return=T,T=Y)}return h(T);case H:t:{for(st=A.key;w!==null;){if(w.key===st)if(w.tag===4&&w.stateNode.containerInfo===A.containerInfo&&w.stateNode.implementation===A.implementation){l(T,w.sibling),Y=a(w,A.children||[]),Y.return=T,T=Y;break t}else{l(T,w);break}else e(T,w);w=w.sibling}Y=Eo(A,T.mode,Y),Y.return=T,T=Y}return h(T);case mt:return st=A._init,A=st(A._payload),Xt(T,w,A,Y)}if(wt(A))return St(T,w,A,Y);if(V(A)){if(st=V(A),typeof st!="function")throw Error(s(150));return A=st.call(A),xt(T,w,A,Y)}if(typeof A.then=="function")return Xt(T,w,Ou(A),Y);if(A.$$typeof===L)return Xt(T,w,Su(T,A),Y);ku(T,A)}return typeof A=="string"&&A!==""||typeof A=="number"||typeof A=="bigint"?(A=""+A,w!==null&&w.tag===6?(l(T,w.sibling),Y=a(w,A),Y.return=T,T=Y):(l(T,w),Y=wo(A,T.mode,Y),Y.return=T,T=Y),h(T)):l(T,w)}return function(T,w,A,Y){try{ba=0;var st=Xt(T,w,A,Y);return mi=null,st}catch(yt){if(yt===ca||yt===wu)throw yt;var _t=Le(29,yt,null,T.mode);return _t.lanes=Y,_t.return=T,_t}finally{}}}var gi=lh(!0),nh=lh(!1),Pe=X(null),ml=null;function Pl(t){var e=t.alternate;it(fe,fe.current&1),it(Pe,t),ml===null&&(e===null||ci.current!==null||e.memoizedState!==null)&&(ml=t)}function ih(t){if(t.tag===22){if(it(fe,fe.current),it(Pe,t),ml===null){var e=t.alternate;e!==null&&e.memoizedState!==null&&(ml=t)}}else tn()}function tn(){it(fe,fe.current),it(Pe,Pe.current)}function Ml(t){nt(Pe),ml===t&&(ml=null),nt(fe)}var fe=X(0);function Nu(t){for(var e=t;e!==null;){if(e.tag===13){var l=e.memoizedState;if(l!==null&&(l=l.dehydrated,l===null||l.data==="$?"||Qs(l)))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if((e.flags&128)!==0)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}function ns(t,e,l,i){e=t.memoizedState,l=l(i,e),l=l==null?e:v({},e,l),t.memoizedState=l,t.lanes===0&&(t.updateQueue.baseState=l)}var is={enqueueSetState:function(t,e,l){t=t._reactInternals;var i=Ye(),a=Fl(i);a.payload=e,l!=null&&(a.callback=l),e=Jl(t,a,i),e!==null&&(Ge(e,t,i),da(e,t,i))},enqueueReplaceState:function(t,e,l){t=t._reactInternals;var i=Ye(),a=Fl(i);a.tag=1,a.payload=e,l!=null&&(a.callback=l),e=Jl(t,a,i),e!==null&&(Ge(e,t,i),da(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var l=Ye(),i=Fl(l);i.tag=2,e!=null&&(i.callback=e),e=Jl(t,i,l),e!==null&&(Ge(e,t,l),da(e,t,l))}};function ah(t,e,l,i,a,r,h){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,r,h):e.prototype&&e.prototype.isPureReactComponent?!la(l,i)||!la(a,r):!0}function uh(t,e,l,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(l,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(l,i),e.state!==t&&is.enqueueReplaceState(e,e.state,null)}function On(t,e){var l=e;if("ref"in e){l={};for(var i in e)i!=="ref"&&(l[i]=e[i])}if(t=t.defaultProps){l===e&&(l=v({},l));for(var a in t)l[a]===void 0&&(l[a]=t[a])}return l}var Bu=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)};function rh(t){Bu(t)}function oh(t){console.error(t)}function sh(t){Bu(t)}function Uu(t,e){try{var l=t.onUncaughtError;l(e.value,{componentStack:e.stack})}catch(i){setTimeout(function(){throw i})}}function ch(t,e,l){try{var i=t.onCaughtError;i(l.value,{componentStack:l.stack,errorBoundary:e.tag===1?e.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function as(t,e,l){return l=Fl(l),l.tag=3,l.payload={element:null},l.callback=function(){Uu(t,e)},l}function fh(t){return t=Fl(t),t.tag=3,t}function dh(t,e,l,i){var a=l.type.getDerivedStateFromError;if(typeof a=="function"){var r=i.value;t.payload=function(){return a(r)},t.callback=function(){ch(e,l,i)}}var h=l.stateNode;h!==null&&typeof h.componentDidCatch=="function"&&(t.callback=function(){ch(e,l,i),typeof a!="function"&&(rn===null?rn=new Set([this]):rn.add(this));var m=i.stack;this.componentDidCatch(i.value,{componentStack:m!==null?m:""})})}function op(t,e,l,i,a){if(l.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){if(e=l.alternate,e!==null&&ra(e,l,a,!0),l=Pe.current,l!==null){switch(l.tag){case 13:return ml===null?Cs():l.alternate===null&&ee===0&&(ee=3),l.flags&=-257,l.flags|=65536,l.lanes=a,i===Oo?l.flags|=16384:(e=l.updateQueue,e===null?l.updateQueue=new Set([i]):e.add(i),Ds(t,i,a)),!1;case 22:return l.flags|=65536,i===Oo?l.flags|=16384:(e=l.updateQueue,e===null?(e={transitions:null,markerInstances:null,retryQueue:new Set([i])},l.updateQueue=e):(l=e.retryQueue,l===null?e.retryQueue=new Set([i]):l.add(i)),Ds(t,i,a)),!1}throw Error(s(435,l.tag))}return Ds(t,i,a),Cs(),!1}if(Ut)return e=Pe.current,e!==null?((e.flags&65536)===0&&(e.flags|=256),e.flags|=65536,e.lanes=a,i!==jo&&(t=Error(s(422),{cause:i}),ua(Ke(t,l)))):(i!==jo&&(e=Error(s(423),{cause:i}),ua(Ke(e,l))),t=t.current.alternate,t.flags|=65536,a&=-a,t.lanes|=a,i=Ke(i,l),a=as(t.stateNode,i,a),Bo(t,a),ee!==4&&(ee=2)),!1;var r=Error(s(520),{cause:i});if(r=Ke(r,l),ja===null?ja=[r]:ja.push(r),ee!==4&&(ee=2),e===null)return!0;i=Ke(i,l),l=e;do{switch(l.tag){case 3:return l.flags|=65536,t=a&-a,l.lanes|=t,t=as(l.stateNode,i,t),Bo(l,t),!1;case 1:if(e=l.type,r=l.stateNode,(l.flags&128)===0&&(typeof e.getDerivedStateFromError=="function"||r!==null&&typeof r.componentDidCatch=="function"&&(rn===null||!rn.has(r))))return l.flags|=65536,a&=-a,l.lanes|=a,a=fh(a),dh(a,t,l,i),Bo(l,a),!1}l=l.return}while(l!==null);return!1}var hh=Error(s(461)),ge=!1;function Se(t,e,l,i){e.child=t===null?nh(e,null,l,i):gi(e,t.child,l,i)}function mh(t,e,l,i,a){l=l.render;var r=e.ref;if("ref"in i){var h={};for(var m in i)m!=="ref"&&(h[m]=i[m])}else h=i;return Dn(e),i=Vo(t,e,l,h,r,a),m=Yo(),t!==null&&!ge?(Go(t,e,a),Rl(t,e,a)):(Ut&&m&&To(e),e.flags|=1,Se(t,e,i,a),e.child)}function gh(t,e,l,i,a){if(t===null){var r=l.type;return typeof r=="function"&&!$o(r)&&r.defaultProps===void 0&&l.compare===null?(e.tag=15,e.type=r,yh(t,e,r,i,a)):(t=pu(l.type,null,i,e,e.mode,a),t.ref=e.ref,t.return=e,e.child=t)}if(r=t.child,!hs(t,a)){var h=r.memoizedProps;if(l=l.compare,l=l!==null?l:la,l(h,i)&&t.ref===e.ref)return Rl(t,e,a)}return e.flags|=1,t=zl(r,i),t.ref=e.ref,t.return=e,e.child=t}function yh(t,e,l,i,a){if(t!==null){var r=t.memoizedProps;if(la(r,i)&&t.ref===e.ref)if(ge=!1,e.pendingProps=i=r,hs(t,a))(t.flags&131072)!==0&&(ge=!0);else return e.lanes=t.lanes,Rl(t,e,a)}return us(t,e,l,i,a)}function ph(t,e,l){var i=e.pendingProps,a=i.children,r=t!==null?t.memoizedState:null;if(i.mode==="hidden"){if((e.flags&128)!==0){if(i=r!==null?r.baseLanes|l:l,t!==null){for(a=e.child=t.child,r=0;a!==null;)r=r|a.lanes|a.childLanes,a=a.sibling;e.childLanes=r&~i}else e.childLanes=0,e.child=null;return xh(t,e,i,l)}if((l&536870912)!==0)e.memoizedState={baseLanes:0,cachePool:null},t!==null&&$u(e,r!==null?r.cachePool:null),r!==null?yd(e,r):Lo(),ih(e);else return e.lanes=e.childLanes=536870912,xh(t,e,r!==null?r.baseLanes|l:l,l)}else r!==null?($u(e,r.cachePool),yd(e,r),tn(),e.memoizedState=null):(t!==null&&$u(e,null),Lo(),tn());return Se(t,e,a,l),e.child}function xh(t,e,l,i){var a=Ro();return a=a===null?null:{parent:ce._currentValue,pool:a},e.memoizedState={baseLanes:l,cachePool:a},t!==null&&$u(e,null),Lo(),ih(e),t!==null&&ra(t,e,i,!0),null}function Lu(t,e){var l=e.ref;if(l===null)t!==null&&t.ref!==null&&(e.flags|=4194816);else{if(typeof l!="function"&&typeof l!="object")throw Error(s(284));(t===null||t.ref!==l)&&(e.flags|=4194816)}}function us(t,e,l,i,a){return Dn(e),l=Vo(t,e,l,i,void 0,a),i=Yo(),t!==null&&!ge?(Go(t,e,a),Rl(t,e,a)):(Ut&&i&&To(e),e.flags|=1,Se(t,e,l,a),e.child)}function bh(t,e,l,i,a,r){return Dn(e),e.updateQueue=null,l=xd(e,i,l,a),pd(t),i=Yo(),t!==null&&!ge?(Go(t,e,r),Rl(t,e,r)):(Ut&&i&&To(e),e.flags|=1,Se(t,e,l,r),e.child)}function vh(t,e,l,i,a){if(Dn(e),e.stateNode===null){var r=ai,h=l.contextType;typeof h=="object"&&h!==null&&(r=Te(h)),r=new l(i,r),e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=is,e.stateNode=r,r._reactInternals=e,r=e.stateNode,r.props=i,r.state=e.memoizedState,r.refs={},ko(e),h=l.contextType,r.context=typeof h=="object"&&h!==null?Te(h):ai,r.state=e.memoizedState,h=l.getDerivedStateFromProps,typeof h=="function"&&(ns(e,l,h,i),r.state=e.memoizedState),typeof l.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(h=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),h!==r.state&&is.enqueueReplaceState(r,r.state,null),ma(e,i,r,a),ha(),r.state=e.memoizedState),typeof r.componentDidMount=="function"&&(e.flags|=4194308),i=!0}else if(t===null){r=e.stateNode;var m=e.memoizedProps,b=On(l,m);r.props=b;var C=r.context,U=l.contextType;h=ai,typeof U=="object"&&U!==null&&(h=Te(U));var G=l.getDerivedStateFromProps;U=typeof G=="function"||typeof r.getSnapshotBeforeUpdate=="function",m=e.pendingProps!==m,U||typeof r.UNSAFE_componentWillReceiveProps!="function"&&typeof r.componentWillReceiveProps!="function"||(m||C!==h)&&uh(e,r,i,h),Kl=!1;var D=e.memoizedState;r.state=D,ma(e,i,r,a),ha(),C=e.memoizedState,m||D!==C||Kl?(typeof G=="function"&&(ns(e,l,G,i),C=e.memoizedState),(b=Kl||ah(e,l,b,i,D,C,h))?(U||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount()),typeof r.componentDidMount=="function"&&(e.flags|=4194308)):(typeof r.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=C),r.props=i,r.state=C,r.context=h,i=b):(typeof r.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{r=e.stateNode,No(t,e),h=e.memoizedProps,U=On(l,h),r.props=U,G=e.pendingProps,D=r.context,C=l.contextType,b=ai,typeof C=="object"&&C!==null&&(b=Te(C)),m=l.getDerivedStateFromProps,(C=typeof m=="function"||typeof r.getSnapshotBeforeUpdate=="function")||typeof r.UNSAFE_componentWillReceiveProps!="function"&&typeof r.componentWillReceiveProps!="function"||(h!==G||D!==b)&&uh(e,r,i,b),Kl=!1,D=e.memoizedState,r.state=D,ma(e,i,r,a),ha();var R=e.memoizedState;h!==G||D!==R||Kl||t!==null&&t.dependencies!==null&&vu(t.dependencies)?(typeof m=="function"&&(ns(e,l,m,i),R=e.memoizedState),(U=Kl||ah(e,l,U,i,D,R,b)||t!==null&&t.dependencies!==null&&vu(t.dependencies))?(C||typeof r.UNSAFE_componentWillUpdate!="function"&&typeof r.componentWillUpdate!="function"||(typeof r.componentWillUpdate=="function"&&r.componentWillUpdate(i,R,b),typeof r.UNSAFE_componentWillUpdate=="function"&&r.UNSAFE_componentWillUpdate(i,R,b)),typeof r.componentDidUpdate=="function"&&(e.flags|=4),typeof r.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof r.componentDidUpdate!="function"||h===t.memoizedProps&&D===t.memoizedState||(e.flags|=4),typeof r.getSnapshotBeforeUpdate!="function"||h===t.memoizedProps&&D===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=R),r.props=i,r.state=R,r.context=b,i=U):(typeof r.componentDidUpdate!="function"||h===t.memoizedProps&&D===t.memoizedState||(e.flags|=4),typeof r.getSnapshotBeforeUpdate!="function"||h===t.memoizedProps&&D===t.memoizedState||(e.flags|=1024),i=!1)}return r=i,Lu(t,e),i=(e.flags&128)!==0,r||i?(r=e.stateNode,l=i&&typeof l.getDerivedStateFromError!="function"?null:r.render(),e.flags|=1,t!==null&&i?(e.child=gi(e,t.child,null,a),e.child=gi(e,null,l,a)):Se(t,e,l,a),e.memoizedState=r.state,t=e.child):t=Rl(t,e,a),t}function Sh(t,e,l,i){return aa(),e.flags|=256,Se(t,e,l,i),e.child}var rs={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function os(t){return{baseLanes:t,cachePool:od()}}function ss(t,e,l){return t=t!==null?t.childLanes&~l:0,e&&(t|=tl),t}function $h(t,e,l){var i=e.pendingProps,a=!1,r=(e.flags&128)!==0,h;if((h=r)||(h=t!==null&&t.memoizedState===null?!1:(fe.current&2)!==0),h&&(a=!0,e.flags&=-129),h=(e.flags&32)!==0,e.flags&=-33,t===null){if(Ut){if(a?Pl(e):tn(),Ut){var m=te,b;if(b=m){t:{for(b=m,m=hl;b.nodeType!==8;){if(!m){m=null;break t}if(b=ol(b.nextSibling),b===null){m=null;break t}}m=b}m!==null?(e.memoizedState={dehydrated:m,treeContext:zn!==null?{id:jl,overflow:Al}:null,retryLane:536870912,hydrationErrors:null},b=Le(18,null,null,0),b.stateNode=m,b.return=e,e.child=b,Ce=e,te=null,b=!0):b=!1}b||Cn(e)}if(m=e.memoizedState,m!==null&&(m=m.dehydrated,m!==null))return Qs(m)?e.lanes=32:e.lanes=536870912,null;Ml(e)}return m=i.children,i=i.fallback,a?(tn(),a=e.mode,m=Hu({mode:"hidden",children:m},a),i=Tn(i,a,l,null),m.return=e,i.return=e,m.sibling=i,e.child=m,a=e.child,a.memoizedState=os(l),a.childLanes=ss(t,h,l),e.memoizedState=rs,i):(Pl(e),cs(e,m))}if(b=t.memoizedState,b!==null&&(m=b.dehydrated,m!==null)){if(r)e.flags&256?(Pl(e),e.flags&=-257,e=fs(t,e,l)):e.memoizedState!==null?(tn(),e.child=t.child,e.flags|=128,e=null):(tn(),a=i.fallback,m=e.mode,i=Hu({mode:"visible",children:i.children},m),a=Tn(a,m,l,null),a.flags|=2,i.return=e,a.return=e,i.sibling=a,e.child=i,gi(e,t.child,null,l),i=e.child,i.memoizedState=os(l),i.childLanes=ss(t,h,l),e.memoizedState=rs,e=a);else if(Pl(e),Qs(m)){if(h=m.nextSibling&&m.nextSibling.dataset,h)var C=h.dgst;h=C,i=Error(s(419)),i.stack="",i.digest=h,ua({value:i,source:null,stack:null}),e=fs(t,e,l)}else if(ge||ra(t,e,l,!1),h=(l&t.childLanes)!==0,ge||h){if(h=Wt,h!==null&&(i=l&-l,i=(i&42)!==0?1:Qr(i),i=(i&(h.suspendedLanes|l))!==0?0:i,i!==0&&i!==b.retryLane))throw b.retryLane=i,ii(t,i),Ge(h,t,i),hh;m.data==="$?"||Cs(),e=fs(t,e,l)}else m.data==="$?"?(e.flags|=192,e.child=t.child,e=null):(t=b.treeContext,te=ol(m.nextSibling),Ce=e,Ut=!0,An=null,hl=!1,t!==null&&(Je[Ie++]=jl,Je[Ie++]=Al,Je[Ie++]=zn,jl=t.id,Al=t.overflow,zn=e),e=cs(e,i.children),e.flags|=4096);return e}return a?(tn(),a=i.fallback,m=e.mode,b=t.child,C=b.sibling,i=zl(b,{mode:"hidden",children:i.children}),i.subtreeFlags=b.subtreeFlags&65011712,C!==null?a=zl(C,a):(a=Tn(a,m,l,null),a.flags|=2),a.return=e,i.return=e,i.sibling=a,e.child=i,i=a,a=e.child,m=t.child.memoizedState,m===null?m=os(l):(b=m.cachePool,b!==null?(C=ce._currentValue,b=b.parent!==C?{parent:C,pool:C}:b):b=od(),m={baseLanes:m.baseLanes|l,cachePool:b}),a.memoizedState=m,a.childLanes=ss(t,h,l),e.memoizedState=rs,i):(Pl(e),l=t.child,t=l.sibling,l=zl(l,{mode:"visible",children:i.children}),l.return=e,l.sibling=null,t!==null&&(h=e.deletions,h===null?(e.deletions=[t],e.flags|=16):h.push(t)),e.child=l,e.memoizedState=null,l)}function cs(t,e){return e=Hu({mode:"visible",children:e},t.mode),e.return=t,t.child=e}function Hu(t,e){return t=Le(22,t,null,e),t.lanes=0,t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null},t}function fs(t,e,l){return gi(e,t.child,null,l),t=cs(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function wh(t,e,l){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Co(t.return,e,l)}function ds(t,e,l,i,a){var r=t.memoizedState;r===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:l,tailMode:a}:(r.isBackwards=e,r.rendering=null,r.renderingStartTime=0,r.last=i,r.tail=l,r.tailMode=a)}function Eh(t,e,l){var i=e.pendingProps,a=i.revealOrder,r=i.tail;if(Se(t,e,i.children,l),i=fe.current,(i&2)!==0)i=i&1|2,e.flags|=128;else{if(t!==null&&(t.flags&128)!==0)t:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&wh(t,l,e);else if(t.tag===19)wh(t,l,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}switch(it(fe,i),a){case"forwards":for(l=e.child,a=null;l!==null;)t=l.alternate,t!==null&&Nu(t)===null&&(a=l),l=l.sibling;l=a,l===null?(a=e.child,e.child=null):(a=l.sibling,l.sibling=null),ds(e,!1,a,l,r);break;case"backwards":for(l=null,a=e.child,e.child=null;a!==null;){if(t=a.alternate,t!==null&&Nu(t)===null){e.child=a;break}t=a.sibling,a.sibling=l,l=a,a=t}ds(e,!0,l,null,r);break;case"together":ds(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Rl(t,e,l){if(t!==null&&(e.dependencies=t.dependencies),un|=e.lanes,(l&e.childLanes)===0)if(t!==null){if(ra(t,e,l,!1),(l&e.childLanes)===0)return null}else return null;if(t!==null&&e.child!==t.child)throw Error(s(153));if(e.child!==null){for(t=e.child,l=zl(t,t.pendingProps),e.child=l,l.return=e;t.sibling!==null;)t=t.sibling,l=l.sibling=zl(t,t.pendingProps),l.return=e;l.sibling=null}return e.child}function hs(t,e){return(t.lanes&e)!==0?!0:(t=t.dependencies,!!(t!==null&&vu(t)))}function sp(t,e,l){switch(e.tag){case 3:Nt(e,e.stateNode.containerInfo),Wl(e,ce,t.memoizedState.cache),aa();break;case 27:case 5:il(e);break;case 4:Nt(e,e.stateNode.containerInfo);break;case 10:Wl(e,e.type,e.memoizedProps.value);break;case 13:var i=e.memoizedState;if(i!==null)return i.dehydrated!==null?(Pl(e),e.flags|=128,null):(l&e.child.childLanes)!==0?$h(t,e,l):(Pl(e),t=Rl(t,e,l),t!==null?t.sibling:null);Pl(e);break;case 19:var a=(t.flags&128)!==0;if(i=(l&e.childLanes)!==0,i||(ra(t,e,l,!1),i=(l&e.childLanes)!==0),a){if(i)return Eh(t,e,l);e.flags|=128}if(a=e.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),it(fe,fe.current),i)break;return null;case 22:case 23:return e.lanes=0,ph(t,e,l);case 24:Wl(e,ce,t.memoizedState.cache)}return Rl(t,e,l)}function Th(t,e,l){if(t!==null)if(t.memoizedProps!==e.pendingProps)ge=!0;else{if(!hs(t,l)&&(e.flags&128)===0)return ge=!1,sp(t,e,l);ge=(t.flags&131072)!==0}else ge=!1,Ut&&(e.flags&1048576)!==0&&ed(e,bu,e.index);switch(e.lanes=0,e.tag){case 16:t:{t=e.pendingProps;var i=e.elementType,a=i._init;if(i=a(i._payload),e.type=i,typeof i=="function")$o(i)?(t=On(i,t),e.tag=1,e=vh(null,e,i,t,l)):(e.tag=0,e=us(null,e,i,t,l));else{if(i!=null){if(a=i.$$typeof,a===P){e.tag=11,e=mh(null,e,i,t,l);break t}else if(a===J){e.tag=14,e=gh(null,e,i,t,l);break t}}throw e=ct(i)||i,Error(s(306,e,""))}}return e;case 0:return us(t,e,e.type,e.pendingProps,l);case 1:return i=e.type,a=On(i,e.pendingProps),vh(t,e,i,a,l);case 3:t:{if(Nt(e,e.stateNode.containerInfo),t===null)throw Error(s(387));i=e.pendingProps;var r=e.memoizedState;a=r.element,No(t,e),ma(e,i,null,l);var h=e.memoizedState;if(i=h.cache,Wl(e,ce,i),i!==r.cache&&_o(e,[ce],l,!0),ha(),i=h.element,r.isDehydrated)if(r={element:i,isDehydrated:!1,cache:h.cache},e.updateQueue.baseState=r,e.memoizedState=r,e.flags&256){e=Sh(t,e,i,l);break t}else if(i!==a){a=Ke(Error(s(424)),e),ua(a),e=Sh(t,e,i,l);break t}else{switch(t=e.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(te=ol(t.firstChild),Ce=e,Ut=!0,An=null,hl=!0,l=nh(e,null,i,l),e.child=l;l;)l.flags=l.flags&-3|4096,l=l.sibling}else{if(aa(),i===a){e=Rl(t,e,l);break t}Se(t,e,i,l)}e=e.child}return e;case 26:return Lu(t,e),t===null?(l=Cm(e.type,null,e.pendingProps,null))?e.memoizedState=l:Ut||(l=e.type,t=e.pendingProps,i=tr(pt.current).createElement(l),i[Ee]=e,i[De]=t,we(i,l,t),me(i),e.stateNode=i):e.memoizedState=Cm(e.type,t.memoizedProps,e.pendingProps,t.memoizedState),null;case 27:return il(e),t===null&&Ut&&(i=e.stateNode=zm(e.type,e.pendingProps,pt.current),Ce=e,hl=!0,a=te,cn(e.type)?(Zs=a,te=ol(i.firstChild)):te=a),Se(t,e,e.pendingProps.children,l),Lu(t,e),t===null&&(e.flags|=4194304),e.child;case 5:return t===null&&Ut&&((a=i=te)&&(i=Bp(i,e.type,e.pendingProps,hl),i!==null?(e.stateNode=i,Ce=e,te=ol(i.firstChild),hl=!1,a=!0):a=!1),a||Cn(e)),il(e),a=e.type,r=e.pendingProps,h=t!==null?t.memoizedProps:null,i=r.children,Ys(a,r)?i=null:h!==null&&Ys(a,h)&&(e.flags|=32),e.memoizedState!==null&&(a=Vo(t,e,ep,null,null,l),Na._currentValue=a),Lu(t,e),Se(t,e,i,l),e.child;case 6:return t===null&&Ut&&((t=l=te)&&(l=Up(l,e.pendingProps,hl),l!==null?(e.stateNode=l,Ce=e,te=null,t=!0):t=!1),t||Cn(e)),null;case 13:return $h(t,e,l);case 4:return Nt(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=gi(e,null,i,l):Se(t,e,i,l),e.child;case 11:return mh(t,e,e.type,e.pendingProps,l);case 7:return Se(t,e,e.pendingProps,l),e.child;case 8:return Se(t,e,e.pendingProps.children,l),e.child;case 12:return Se(t,e,e.pendingProps.children,l),e.child;case 10:return i=e.pendingProps,Wl(e,e.type,i.value),Se(t,e,i.children,l),e.child;case 9:return a=e.type._context,i=e.pendingProps.children,Dn(e),a=Te(a),i=i(a),e.flags|=1,Se(t,e,i,l),e.child;case 14:return gh(t,e,e.type,e.pendingProps,l);case 15:return yh(t,e,e.type,e.pendingProps,l);case 19:return Eh(t,e,l);case 31:return i=e.pendingProps,l=e.mode,i={mode:i.mode,children:i.children},t===null?(l=Hu(i,l),l.ref=e.ref,e.child=l,l.return=e,e=l):(l=zl(t.child,i),l.ref=e.ref,e.child=l,l.return=e,e=l),e;case 22:return ph(t,e,l);case 24:return Dn(e),i=Te(ce),t===null?(a=Ro(),a===null&&(a=Wt,r=Do(),a.pooledCache=r,r.refCount++,r!==null&&(a.pooledCacheLanes|=l),a=r),e.memoizedState={parent:i,cache:a},ko(e),Wl(e,ce,a)):((t.lanes&l)!==0&&(No(t,e),ma(e,null,null,l),ha()),a=t.memoizedState,r=e.memoizedState,a.parent!==i?(a={parent:i,cache:i},e.memoizedState=a,e.lanes===0&&(e.memoizedState=e.updateQueue.baseState=a),Wl(e,ce,i)):(i=r.cache,Wl(e,ce,i),i!==a.cache&&_o(e,[ce],l,!0))),Se(t,e,e.pendingProps.children,l),e.child;case 29:throw e.pendingProps}throw Error(s(156,e.tag))}function Ol(t){t.flags|=4}function zh(t,e){if(e.type!=="stylesheet"||(e.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!Om(e)){if(e=Pe.current,e!==null&&((kt&4194048)===kt?ml!==null:(kt&62914560)!==kt&&(kt&536870912)===0||e!==ml))throw fa=Oo,sd;t.flags|=8192}}function qu(t,e){e!==null&&(t.flags|=4),t.flags&16384&&(e=t.tag!==22?nf():536870912,t.lanes|=e,bi|=e)}function Sa(t,e){if(!Ut)switch(t.tailMode){case"hidden":e=t.tail;for(var l=null;e!==null;)e.alternate!==null&&(l=e),e=e.sibling;l===null?t.tail=null:l.sibling=null;break;case"collapsed":l=t.tail;for(var i=null;l!==null;)l.alternate!==null&&(i=l),l=l.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function It(t){var e=t.alternate!==null&&t.alternate.child===t.child,l=0,i=0;if(e)for(var a=t.child;a!==null;)l|=a.lanes|a.childLanes,i|=a.subtreeFlags&65011712,i|=a.flags&65011712,a.return=t,a=a.sibling;else for(a=t.child;a!==null;)l|=a.lanes|a.childLanes,i|=a.subtreeFlags,i|=a.flags,a.return=t,a=a.sibling;return t.subtreeFlags|=i,t.childLanes=l,e}function cp(t,e,l){var i=e.pendingProps;switch(zo(e),e.tag){case 31:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return It(e),null;case 1:return It(e),null;case 3:return l=e.stateNode,i=null,t!==null&&(i=t.memoizedState.cache),e.memoizedState.cache!==i&&(e.flags|=2048),_l(ce),ae(),l.pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),(t===null||t.child===null)&&(ia(e)?Ol(e):t===null||t.memoizedState.isDehydrated&&(e.flags&256)===0||(e.flags|=1024,id())),It(e),null;case 26:return l=e.memoizedState,t===null?(Ol(e),l!==null?(It(e),zh(e,l)):(It(e),e.flags&=-16777217)):l?l!==t.memoizedState?(Ol(e),It(e),zh(e,l)):(It(e),e.flags&=-16777217):(t.memoizedProps!==i&&Ol(e),It(e),e.flags&=-16777217),null;case 27:al(e),l=pt.current;var a=e.type;if(t!==null&&e.stateNode!=null)t.memoizedProps!==i&&Ol(e);else{if(!i){if(e.stateNode===null)throw Error(s(166));return It(e),null}t=gt.current,ia(e)?ld(e):(t=zm(a,i,l),e.stateNode=t,Ol(e))}return It(e),null;case 5:if(al(e),l=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==i&&Ol(e);else{if(!i){if(e.stateNode===null)throw Error(s(166));return It(e),null}if(t=gt.current,ia(e))ld(e);else{switch(a=tr(pt.current),t){case 1:t=a.createElementNS("http://www.w3.org/2000/svg",l);break;case 2:t=a.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;default:switch(l){case"svg":t=a.createElementNS("http://www.w3.org/2000/svg",l);break;case"math":t=a.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;case"script":t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild);break;case"select":t=typeof i.is=="string"?a.createElement("select",{is:i.is}):a.createElement("select"),i.multiple?t.multiple=!0:i.size&&(t.size=i.size);break;default:t=typeof i.is=="string"?a.createElement(l,{is:i.is}):a.createElement(l)}}t[Ee]=e,t[De]=i;t:for(a=e.child;a!==null;){if(a.tag===5||a.tag===6)t.appendChild(a.stateNode);else if(a.tag!==4&&a.tag!==27&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===e)break t;for(;a.sibling===null;){if(a.return===null||a.return===e)break t;a=a.return}a.sibling.return=a.return,a=a.sibling}e.stateNode=t;t:switch(we(t,l,i),l){case"button":case"input":case"select":case"textarea":t=!!i.autoFocus;break t;case"img":t=!0;break t;default:t=!1}t&&Ol(e)}}return It(e),e.flags&=-16777217,null;case 6:if(t&&e.stateNode!=null)t.memoizedProps!==i&&Ol(e);else{if(typeof i!="string"&&e.stateNode===null)throw Error(s(166));if(t=pt.current,ia(e)){if(t=e.stateNode,l=e.memoizedProps,i=null,a=Ce,a!==null)switch(a.tag){case 27:case 5:i=a.memoizedProps}t[Ee]=e,t=!!(t.nodeValue===l||i!==null&&i.suppressHydrationWarning===!0||bm(t.nodeValue,l)),t||Cn(e)}else t=tr(t).createTextNode(i),t[Ee]=e,e.stateNode=t}return It(e),null;case 13:if(i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(a=ia(e),i!==null&&i.dehydrated!==null){if(t===null){if(!a)throw Error(s(318));if(a=e.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(s(317));a[Ee]=e}else aa(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;It(e),a=!1}else a=id(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),a=!0;if(!a)return e.flags&256?(Ml(e),e):(Ml(e),null)}if(Ml(e),(e.flags&128)!==0)return e.lanes=l,e;if(l=i!==null,t=t!==null&&t.memoizedState!==null,l){i=e.child,a=null,i.alternate!==null&&i.alternate.memoizedState!==null&&i.alternate.memoizedState.cachePool!==null&&(a=i.alternate.memoizedState.cachePool.pool);var r=null;i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(r=i.memoizedState.cachePool.pool),r!==a&&(i.flags|=2048)}return l!==t&&l&&(e.child.flags|=8192),qu(e,e.updateQueue),It(e),null;case 4:return ae(),t===null&&Us(e.stateNode.containerInfo),It(e),null;case 10:return _l(e.type),It(e),null;case 19:if(nt(fe),a=e.memoizedState,a===null)return It(e),null;if(i=(e.flags&128)!==0,r=a.rendering,r===null)if(i)Sa(a,!1);else{if(ee!==0||t!==null&&(t.flags&128)!==0)for(t=e.child;t!==null;){if(r=Nu(t),r!==null){for(e.flags|=128,Sa(a,!1),t=r.updateQueue,e.updateQueue=t,qu(e,t),e.subtreeFlags=0,t=l,l=e.child;l!==null;)td(l,t),l=l.sibling;return it(fe,fe.current&1|2),e.child}t=t.sibling}a.tail!==null&&Qe()>Gu&&(e.flags|=128,i=!0,Sa(a,!1),e.lanes=4194304)}else{if(!i)if(t=Nu(r),t!==null){if(e.flags|=128,i=!0,t=t.updateQueue,e.updateQueue=t,qu(e,t),Sa(a,!0),a.tail===null&&a.tailMode==="hidden"&&!r.alternate&&!Ut)return It(e),null}else 2*Qe()-a.renderingStartTime>Gu&&l!==536870912&&(e.flags|=128,i=!0,Sa(a,!1),e.lanes=4194304);a.isBackwards?(r.sibling=e.child,e.child=r):(t=a.last,t!==null?t.sibling=r:e.child=r,a.last=r)}return a.tail!==null?(e=a.tail,a.rendering=e,a.tail=e.sibling,a.renderingStartTime=Qe(),e.sibling=null,t=fe.current,it(fe,i?t&1|2:t&1),e):(It(e),null);case 22:case 23:return Ml(e),Ho(),i=e.memoizedState!==null,t!==null?t.memoizedState!==null!==i&&(e.flags|=8192):i&&(e.flags|=8192),i?(l&536870912)!==0&&(e.flags&128)===0&&(It(e),e.subtreeFlags&6&&(e.flags|=8192)):It(e),l=e.updateQueue,l!==null&&qu(e,l.retryQueue),l=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),i=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(i=e.memoizedState.cachePool.pool),i!==l&&(e.flags|=2048),t!==null&&nt(Mn),null;case 24:return l=null,t!==null&&(l=t.memoizedState.cache),e.memoizedState.cache!==l&&(e.flags|=2048),_l(ce),It(e),null;case 25:return null;case 30:return null}throw Error(s(156,e.tag))}function fp(t,e){switch(zo(e),e.tag){case 1:return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return _l(ce),ae(),t=e.flags,(t&65536)!==0&&(t&128)===0?(e.flags=t&-65537|128,e):null;case 26:case 27:case 5:return al(e),null;case 13:if(Ml(e),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(s(340));aa()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return nt(fe),null;case 4:return ae(),null;case 10:return _l(e.type),null;case 22:case 23:return Ml(e),Ho(),t!==null&&nt(Mn),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 24:return _l(ce),null;case 25:return null;default:return null}}function jh(t,e){switch(zo(e),e.tag){case 3:_l(ce),ae();break;case 26:case 27:case 5:al(e);break;case 4:ae();break;case 13:Ml(e);break;case 19:nt(fe);break;case 10:_l(e.type);break;case 22:case 23:Ml(e),Ho(),t!==null&&nt(Mn);break;case 24:_l(ce)}}function $a(t,e){try{var l=e.updateQueue,i=l!==null?l.lastEffect:null;if(i!==null){var a=i.next;l=a;do{if((l.tag&t)===t){i=void 0;var r=l.create,h=l.inst;i=r(),h.destroy=i}l=l.next}while(l!==a)}}catch(m){Qt(e,e.return,m)}}function en(t,e,l){try{var i=e.updateQueue,a=i!==null?i.lastEffect:null;if(a!==null){var r=a.next;i=r;do{if((i.tag&t)===t){var h=i.inst,m=h.destroy;if(m!==void 0){h.destroy=void 0,a=e;var b=l,C=m;try{C()}catch(U){Qt(a,b,U)}}}i=i.next}while(i!==r)}}catch(U){Qt(e,e.return,U)}}function Ah(t){var e=t.updateQueue;if(e!==null){var l=t.stateNode;try{gd(e,l)}catch(i){Qt(t,t.return,i)}}}function Ch(t,e,l){l.props=On(t.type,t.memoizedProps),l.state=t.memoizedState;try{l.componentWillUnmount()}catch(i){Qt(t,e,i)}}function wa(t,e){try{var l=t.ref;if(l!==null){switch(t.tag){case 26:case 27:case 5:var i=t.stateNode;break;case 30:i=t.stateNode;break;default:i=t.stateNode}typeof l=="function"?t.refCleanup=l(i):l.current=i}}catch(a){Qt(t,e,a)}}function gl(t,e){var l=t.ref,i=t.refCleanup;if(l!==null)if(typeof i=="function")try{i()}catch(a){Qt(t,e,a)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof l=="function")try{l(null)}catch(a){Qt(t,e,a)}else l.current=null}function _h(t){var e=t.type,l=t.memoizedProps,i=t.stateNode;try{t:switch(e){case"button":case"input":case"select":case"textarea":l.autoFocus&&i.focus();break t;case"img":l.src?i.src=l.src:l.srcSet&&(i.srcset=l.srcSet)}}catch(a){Qt(t,t.return,a)}}function ms(t,e,l){try{var i=t.stateNode;Mp(i,t.type,l,e),i[De]=e}catch(a){Qt(t,t.return,a)}}function Dh(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&cn(t.type)||t.tag===4}function gs(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||Dh(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&cn(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function ys(t,e,l){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?(l.nodeType===9?l.body:l.nodeName==="HTML"?l.ownerDocument.body:l).insertBefore(t,e):(e=l.nodeType===9?l.body:l.nodeName==="HTML"?l.ownerDocument.body:l,e.appendChild(t),l=l._reactRootContainer,l!=null||e.onclick!==null||(e.onclick=Pu));else if(i!==4&&(i===27&&cn(t.type)&&(l=t.stateNode,e=null),t=t.child,t!==null))for(ys(t,e,l),t=t.sibling;t!==null;)ys(t,e,l),t=t.sibling}function Vu(t,e,l){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?l.insertBefore(t,e):l.appendChild(t);else if(i!==4&&(i===27&&cn(t.type)&&(l=t.stateNode),t=t.child,t!==null))for(Vu(t,e,l),t=t.sibling;t!==null;)Vu(t,e,l),t=t.sibling}function Mh(t){var e=t.stateNode,l=t.memoizedProps;try{for(var i=t.type,a=e.attributes;a.length;)e.removeAttributeNode(a[0]);we(e,i,l),e[Ee]=t,e[De]=l}catch(r){Qt(t,t.return,r)}}var kl=!1,ne=!1,ps=!1,Rh=typeof WeakSet=="function"?WeakSet:Set,ye=null;function dp(t,e){if(t=t.containerInfo,qs=ur,t=Gf(t),go(t)){if("selectionStart"in t)var l={start:t.selectionStart,end:t.selectionEnd};else t:{l=(l=t.ownerDocument)&&l.defaultView||window;var i=l.getSelection&&l.getSelection();if(i&&i.rangeCount!==0){l=i.anchorNode;var a=i.anchorOffset,r=i.focusNode;i=i.focusOffset;try{l.nodeType,r.nodeType}catch{l=null;break t}var h=0,m=-1,b=-1,C=0,U=0,G=t,D=null;e:for(;;){for(var R;G!==l||a!==0&&G.nodeType!==3||(m=h+a),G!==r||i!==0&&G.nodeType!==3||(b=h+i),G.nodeType===3&&(h+=G.nodeValue.length),(R=G.firstChild)!==null;)D=G,G=R;for(;;){if(G===t)break e;if(D===l&&++C===a&&(m=h),D===r&&++U===i&&(b=h),(R=G.nextSibling)!==null)break;G=D,D=G.parentNode}G=R}l=m===-1||b===-1?null:{start:m,end:b}}else l=null}l=l||{start:0,end:0}}else l=null;for(Vs={focusedElem:t,selectionRange:l},ur=!1,ye=e;ye!==null;)if(e=ye,t=e.child,(e.subtreeFlags&1024)!==0&&t!==null)t.return=e,ye=t;else for(;ye!==null;){switch(e=ye,r=e.alternate,t=e.flags,e.tag){case 0:break;case 11:case 15:break;case 1:if((t&1024)!==0&&r!==null){t=void 0,l=e,a=r.memoizedProps,r=r.memoizedState,i=l.stateNode;try{var St=On(l.type,a,l.elementType===l.type);t=i.getSnapshotBeforeUpdate(St,r),i.__reactInternalSnapshotBeforeUpdate=t}catch(xt){Qt(l,l.return,xt)}}break;case 3:if((t&1024)!==0){if(t=e.stateNode.containerInfo,l=t.nodeType,l===9)Xs(t);else if(l===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":Xs(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(s(163))}if(t=e.sibling,t!==null){t.return=e.return,ye=t;break}ye=e.return}}function Oh(t,e,l){var i=l.flags;switch(l.tag){case 0:case 11:case 15:ln(t,l),i&4&&$a(5,l);break;case 1:if(ln(t,l),i&4)if(t=l.stateNode,e===null)try{t.componentDidMount()}catch(h){Qt(l,l.return,h)}else{var a=On(l.type,e.memoizedProps);e=e.memoizedState;try{t.componentDidUpdate(a,e,t.__reactInternalSnapshotBeforeUpdate)}catch(h){Qt(l,l.return,h)}}i&64&&Ah(l),i&512&&wa(l,l.return);break;case 3:if(ln(t,l),i&64&&(t=l.updateQueue,t!==null)){if(e=null,l.child!==null)switch(l.child.tag){case 27:case 5:e=l.child.stateNode;break;case 1:e=l.child.stateNode}try{gd(t,e)}catch(h){Qt(l,l.return,h)}}break;case 27:e===null&&i&4&&Mh(l);case 26:case 5:ln(t,l),e===null&&i&4&&_h(l),i&512&&wa(l,l.return);break;case 12:ln(t,l);break;case 13:ln(t,l),i&4&&Bh(t,l),i&64&&(t=l.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(l=Sp.bind(null,l),Lp(t,l))));break;case 22:if(i=l.memoizedState!==null||kl,!i){e=e!==null&&e.memoizedState!==null||ne,a=kl;var r=ne;kl=i,(ne=e)&&!r?nn(t,l,(l.subtreeFlags&8772)!==0):ln(t,l),kl=a,ne=r}break;case 30:break;default:ln(t,l)}}function kh(t){var e=t.alternate;e!==null&&(t.alternate=null,kh(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&Kr(e)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var Jt=null,Oe=!1;function Nl(t,e,l){for(l=l.child;l!==null;)Nh(t,e,l),l=l.sibling}function Nh(t,e,l){if(Tt&&typeof Tt.onCommitFiberUnmount=="function")try{Tt.onCommitFiberUnmount(ht,l)}catch{}switch(l.tag){case 26:ne||gl(l,e),Nl(t,e,l),l.memoizedState?l.memoizedState.count--:l.stateNode&&(l=l.stateNode,l.parentNode.removeChild(l));break;case 27:ne||gl(l,e);var i=Jt,a=Oe;cn(l.type)&&(Jt=l.stateNode,Oe=!1),Nl(t,e,l),Ma(l.stateNode),Jt=i,Oe=a;break;case 5:ne||gl(l,e);case 6:if(i=Jt,a=Oe,Jt=null,Nl(t,e,l),Jt=i,Oe=a,Jt!==null)if(Oe)try{(Jt.nodeType===9?Jt.body:Jt.nodeName==="HTML"?Jt.ownerDocument.body:Jt).removeChild(l.stateNode)}catch(r){Qt(l,e,r)}else try{Jt.removeChild(l.stateNode)}catch(r){Qt(l,e,r)}break;case 18:Jt!==null&&(Oe?(t=Jt,Em(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,l.stateNode),Ha(t)):Em(Jt,l.stateNode));break;case 4:i=Jt,a=Oe,Jt=l.stateNode.containerInfo,Oe=!0,Nl(t,e,l),Jt=i,Oe=a;break;case 0:case 11:case 14:case 15:ne||en(2,l,e),ne||en(4,l,e),Nl(t,e,l);break;case 1:ne||(gl(l,e),i=l.stateNode,typeof i.componentWillUnmount=="function"&&Ch(l,e,i)),Nl(t,e,l);break;case 21:Nl(t,e,l);break;case 22:ne=(i=ne)||l.memoizedState!==null,Nl(t,e,l),ne=i;break;default:Nl(t,e,l)}}function Bh(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Ha(t)}catch(l){Qt(e,e.return,l)}}function hp(t){switch(t.tag){case 13:case 19:var e=t.stateNode;return e===null&&(e=t.stateNode=new Rh),e;case 22:return t=t.stateNode,e=t._retryCache,e===null&&(e=t._retryCache=new Rh),e;default:throw Error(s(435,t.tag))}}function xs(t,e){var l=hp(t);e.forEach(function(i){var a=$p.bind(null,t,i);l.has(i)||(l.add(i),i.then(a,a))})}function He(t,e){var l=e.deletions;if(l!==null)for(var i=0;i<l.length;i++){var a=l[i],r=t,h=e,m=h;t:for(;m!==null;){switch(m.tag){case 27:if(cn(m.type)){Jt=m.stateNode,Oe=!1;break t}break;case 5:Jt=m.stateNode,Oe=!1;break t;case 3:case 4:Jt=m.stateNode.containerInfo,Oe=!0;break t}m=m.return}if(Jt===null)throw Error(s(160));Nh(r,h,a),Jt=null,Oe=!1,r=a.alternate,r!==null&&(r.return=null),a.return=null}if(e.subtreeFlags&13878)for(e=e.child;e!==null;)Uh(e,t),e=e.sibling}var rl=null;function Uh(t,e){var l=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:He(e,t),qe(t),i&4&&(en(3,t,t.return),$a(3,t),en(5,t,t.return));break;case 1:He(e,t),qe(t),i&512&&(ne||l===null||gl(l,l.return)),i&64&&kl&&(t=t.updateQueue,t!==null&&(i=t.callbacks,i!==null&&(l=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=l===null?i:l.concat(i))));break;case 26:var a=rl;if(He(e,t),qe(t),i&512&&(ne||l===null||gl(l,l.return)),i&4){var r=l!==null?l.memoizedState:null;if(i=t.memoizedState,l===null)if(i===null)if(t.stateNode===null){t:{i=t.type,l=t.memoizedProps,a=a.ownerDocument||a;e:switch(i){case"title":r=a.getElementsByTagName("title")[0],(!r||r[Zi]||r[Ee]||r.namespaceURI==="http://www.w3.org/2000/svg"||r.hasAttribute("itemprop"))&&(r=a.createElement(i),a.head.insertBefore(r,a.querySelector("head > title"))),we(r,i,l),r[Ee]=t,me(r),i=r;break t;case"link":var h=Mm("link","href",a).get(i+(l.href||""));if(h){for(var m=0;m<h.length;m++)if(r=h[m],r.getAttribute("href")===(l.href==null||l.href===""?null:l.href)&&r.getAttribute("rel")===(l.rel==null?null:l.rel)&&r.getAttribute("title")===(l.title==null?null:l.title)&&r.getAttribute("crossorigin")===(l.crossOrigin==null?null:l.crossOrigin)){h.splice(m,1);break e}}r=a.createElement(i),we(r,i,l),a.head.appendChild(r);break;case"meta":if(h=Mm("meta","content",a).get(i+(l.content||""))){for(m=0;m<h.length;m++)if(r=h[m],r.getAttribute("content")===(l.content==null?null:""+l.content)&&r.getAttribute("name")===(l.name==null?null:l.name)&&r.getAttribute("property")===(l.property==null?null:l.property)&&r.getAttribute("http-equiv")===(l.httpEquiv==null?null:l.httpEquiv)&&r.getAttribute("charset")===(l.charSet==null?null:l.charSet)){h.splice(m,1);break e}}r=a.createElement(i),we(r,i,l),a.head.appendChild(r);break;default:throw Error(s(468,i))}r[Ee]=t,me(r),i=r}t.stateNode=i}else Rm(a,t.type,t.stateNode);else t.stateNode=Dm(a,i,t.memoizedProps);else r!==i?(r===null?l.stateNode!==null&&(l=l.stateNode,l.parentNode.removeChild(l)):r.count--,i===null?Rm(a,t.type,t.stateNode):Dm(a,i,t.memoizedProps)):i===null&&t.stateNode!==null&&ms(t,t.memoizedProps,l.memoizedProps)}break;case 27:He(e,t),qe(t),i&512&&(ne||l===null||gl(l,l.return)),l!==null&&i&4&&ms(t,t.memoizedProps,l.memoizedProps);break;case 5:if(He(e,t),qe(t),i&512&&(ne||l===null||gl(l,l.return)),t.flags&32){a=t.stateNode;try{Jn(a,"")}catch(R){Qt(t,t.return,R)}}i&4&&t.stateNode!=null&&(a=t.memoizedProps,ms(t,a,l!==null?l.memoizedProps:a)),i&1024&&(ps=!0);break;case 6:if(He(e,t),qe(t),i&4){if(t.stateNode===null)throw Error(s(162));i=t.memoizedProps,l=t.stateNode;try{l.nodeValue=i}catch(R){Qt(t,t.return,R)}}break;case 3:if(nr=null,a=rl,rl=er(e.containerInfo),He(e,t),rl=a,qe(t),i&4&&l!==null&&l.memoizedState.isDehydrated)try{Ha(e.containerInfo)}catch(R){Qt(t,t.return,R)}ps&&(ps=!1,Lh(t));break;case 4:i=rl,rl=er(t.stateNode.containerInfo),He(e,t),qe(t),rl=i;break;case 12:He(e,t),qe(t);break;case 13:He(e,t),qe(t),t.child.flags&8192&&t.memoizedState!==null!=(l!==null&&l.memoizedState!==null)&&(Es=Qe()),i&4&&(i=t.updateQueue,i!==null&&(t.updateQueue=null,xs(t,i)));break;case 22:a=t.memoizedState!==null;var b=l!==null&&l.memoizedState!==null,C=kl,U=ne;if(kl=C||a,ne=U||b,He(e,t),ne=U,kl=C,qe(t),i&8192)t:for(e=t.stateNode,e._visibility=a?e._visibility&-2:e._visibility|1,a&&(l===null||b||kl||ne||kn(t)),l=null,e=t;;){if(e.tag===5||e.tag===26){if(l===null){b=l=e;try{if(r=b.stateNode,a)h=r.style,typeof h.setProperty=="function"?h.setProperty("display","none","important"):h.display="none";else{m=b.stateNode;var G=b.memoizedProps.style,D=G!=null&&G.hasOwnProperty("display")?G.display:null;m.style.display=D==null||typeof D=="boolean"?"":(""+D).trim()}}catch(R){Qt(b,b.return,R)}}}else if(e.tag===6){if(l===null){b=e;try{b.stateNode.nodeValue=a?"":b.memoizedProps}catch(R){Qt(b,b.return,R)}}}else if((e.tag!==22&&e.tag!==23||e.memoizedState===null||e===t)&&e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;l===e&&(l=null),e=e.return}l===e&&(l=null),e.sibling.return=e.return,e=e.sibling}i&4&&(i=t.updateQueue,i!==null&&(l=i.retryQueue,l!==null&&(i.retryQueue=null,xs(t,l))));break;case 19:He(e,t),qe(t),i&4&&(i=t.updateQueue,i!==null&&(t.updateQueue=null,xs(t,i)));break;case 30:break;case 21:break;default:He(e,t),qe(t)}}function qe(t){var e=t.flags;if(e&2){try{for(var l,i=t.return;i!==null;){if(Dh(i)){l=i;break}i=i.return}if(l==null)throw Error(s(160));switch(l.tag){case 27:var a=l.stateNode,r=gs(t);Vu(t,r,a);break;case 5:var h=l.stateNode;l.flags&32&&(Jn(h,""),l.flags&=-33);var m=gs(t);Vu(t,m,h);break;case 3:case 4:var b=l.stateNode.containerInfo,C=gs(t);ys(t,C,b);break;default:throw Error(s(161))}}catch(U){Qt(t,t.return,U)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Lh(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var e=t;Lh(e),e.tag===5&&e.flags&1024&&e.stateNode.reset(),t=t.sibling}}function ln(t,e){if(e.subtreeFlags&8772)for(e=e.child;e!==null;)Oh(t,e.alternate,e),e=e.sibling}function kn(t){for(t=t.child;t!==null;){var e=t;switch(e.tag){case 0:case 11:case 14:case 15:en(4,e,e.return),kn(e);break;case 1:gl(e,e.return);var l=e.stateNode;typeof l.componentWillUnmount=="function"&&Ch(e,e.return,l),kn(e);break;case 27:Ma(e.stateNode);case 26:case 5:gl(e,e.return),kn(e);break;case 22:e.memoizedState===null&&kn(e);break;case 30:kn(e);break;default:kn(e)}t=t.sibling}}function nn(t,e,l){for(l=l&&(e.subtreeFlags&8772)!==0,e=e.child;e!==null;){var i=e.alternate,a=t,r=e,h=r.flags;switch(r.tag){case 0:case 11:case 15:nn(a,r,l),$a(4,r);break;case 1:if(nn(a,r,l),i=r,a=i.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(C){Qt(i,i.return,C)}if(i=r,a=i.updateQueue,a!==null){var m=i.stateNode;try{var b=a.shared.hiddenCallbacks;if(b!==null)for(a.shared.hiddenCallbacks=null,a=0;a<b.length;a++)md(b[a],m)}catch(C){Qt(i,i.return,C)}}l&&h&64&&Ah(r),wa(r,r.return);break;case 27:Mh(r);case 26:case 5:nn(a,r,l),l&&i===null&&h&4&&_h(r),wa(r,r.return);break;case 12:nn(a,r,l);break;case 13:nn(a,r,l),l&&h&4&&Bh(a,r);break;case 22:r.memoizedState===null&&nn(a,r,l),wa(r,r.return);break;case 30:break;default:nn(a,r,l)}e=e.sibling}}function bs(t,e){var l=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),t=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),t!==l&&(t!=null&&t.refCount++,l!=null&&oa(l))}function vs(t,e){t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&oa(t))}function yl(t,e,l,i){if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Hh(t,e,l,i),e=e.sibling}function Hh(t,e,l,i){var a=e.flags;switch(e.tag){case 0:case 11:case 15:yl(t,e,l,i),a&2048&&$a(9,e);break;case 1:yl(t,e,l,i);break;case 3:yl(t,e,l,i),a&2048&&(t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&oa(t)));break;case 12:if(a&2048){yl(t,e,l,i),t=e.stateNode;try{var r=e.memoizedProps,h=r.id,m=r.onPostCommit;typeof m=="function"&&m(h,e.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(b){Qt(e,e.return,b)}}else yl(t,e,l,i);break;case 13:yl(t,e,l,i);break;case 23:break;case 22:r=e.stateNode,h=e.alternate,e.memoizedState!==null?r._visibility&2?yl(t,e,l,i):Ea(t,e):r._visibility&2?yl(t,e,l,i):(r._visibility|=2,yi(t,e,l,i,(e.subtreeFlags&10256)!==0)),a&2048&&bs(h,e);break;case 24:yl(t,e,l,i),a&2048&&vs(e.alternate,e);break;default:yl(t,e,l,i)}}function yi(t,e,l,i,a){for(a=a&&(e.subtreeFlags&10256)!==0,e=e.child;e!==null;){var r=t,h=e,m=l,b=i,C=h.flags;switch(h.tag){case 0:case 11:case 15:yi(r,h,m,b,a),$a(8,h);break;case 23:break;case 22:var U=h.stateNode;h.memoizedState!==null?U._visibility&2?yi(r,h,m,b,a):Ea(r,h):(U._visibility|=2,yi(r,h,m,b,a)),a&&C&2048&&bs(h.alternate,h);break;case 24:yi(r,h,m,b,a),a&&C&2048&&vs(h.alternate,h);break;default:yi(r,h,m,b,a)}e=e.sibling}}function Ea(t,e){if(e.subtreeFlags&10256)for(e=e.child;e!==null;){var l=t,i=e,a=i.flags;switch(i.tag){case 22:Ea(l,i),a&2048&&bs(i.alternate,i);break;case 24:Ea(l,i),a&2048&&vs(i.alternate,i);break;default:Ea(l,i)}e=e.sibling}}var Ta=8192;function pi(t){if(t.subtreeFlags&Ta)for(t=t.child;t!==null;)qh(t),t=t.sibling}function qh(t){switch(t.tag){case 26:pi(t),t.flags&Ta&&t.memoizedState!==null&&Ip(rl,t.memoizedState,t.memoizedProps);break;case 5:pi(t);break;case 3:case 4:var e=rl;rl=er(t.stateNode.containerInfo),pi(t),rl=e;break;case 22:t.memoizedState===null&&(e=t.alternate,e!==null&&e.memoizedState!==null?(e=Ta,Ta=16777216,pi(t),Ta=e):pi(t));break;default:pi(t)}}function Vh(t){var e=t.alternate;if(e!==null&&(t=e.child,t!==null)){e.child=null;do e=t.sibling,t.sibling=null,t=e;while(t!==null)}}function za(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var l=0;l<e.length;l++){var i=e[l];ye=i,Gh(i,t)}Vh(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Yh(t),t=t.sibling}function Yh(t){switch(t.tag){case 0:case 11:case 15:za(t),t.flags&2048&&en(9,t,t.return);break;case 3:za(t);break;case 12:za(t);break;case 22:var e=t.stateNode;t.memoizedState!==null&&e._visibility&2&&(t.return===null||t.return.tag!==13)?(e._visibility&=-3,Yu(t)):za(t);break;default:za(t)}}function Yu(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var l=0;l<e.length;l++){var i=e[l];ye=i,Gh(i,t)}Vh(t)}for(t=t.child;t!==null;){switch(e=t,e.tag){case 0:case 11:case 15:en(8,e,e.return),Yu(e);break;case 22:l=e.stateNode,l._visibility&2&&(l._visibility&=-3,Yu(e));break;default:Yu(e)}t=t.sibling}}function Gh(t,e){for(;ye!==null;){var l=ye;switch(l.tag){case 0:case 11:case 15:en(8,l,e);break;case 23:case 22:if(l.memoizedState!==null&&l.memoizedState.cachePool!==null){var i=l.memoizedState.cachePool.pool;i!=null&&i.refCount++}break;case 24:oa(l.memoizedState.cache)}if(i=l.child,i!==null)i.return=l,ye=i;else t:for(l=t;ye!==null;){i=ye;var a=i.sibling,r=i.return;if(kh(i),i===l){ye=null;break t}if(a!==null){a.return=r,ye=a;break t}ye=r}}}var mp={getCacheForType:function(t){var e=Te(ce),l=e.data.get(t);return l===void 0&&(l=t(),e.data.set(t,l)),l}},gp=typeof WeakMap=="function"?WeakMap:Map,qt=0,Wt=null,Dt=null,kt=0,Vt=0,Ve=null,an=!1,xi=!1,Ss=!1,Bl=0,ee=0,un=0,Nn=0,$s=0,tl=0,bi=0,ja=null,ke=null,ws=!1,Es=0,Gu=1/0,Xu=null,rn=null,$e=0,on=null,vi=null,Si=0,Ts=0,zs=null,Xh=null,Aa=0,js=null;function Ye(){if((qt&2)!==0&&kt!==0)return kt&-kt;if(M.T!==null){var t=oi;return t!==0?t:Os()}return rf()}function Qh(){tl===0&&(tl=(kt&536870912)===0||Ut?lf():536870912);var t=Pe.current;return t!==null&&(t.flags|=32),tl}function Ge(t,e,l){(t===Wt&&(Vt===2||Vt===9)||t.cancelPendingCommit!==null)&&($i(t,0),sn(t,kt,tl,!1)),Qi(t,l),((qt&2)===0||t!==Wt)&&(t===Wt&&((qt&2)===0&&(Nn|=l),ee===4&&sn(t,kt,tl,!1)),pl(t))}function Zh(t,e,l){if((qt&6)!==0)throw Error(s(327));var i=!l&&(e&124)===0&&(e&t.expiredLanes)===0||vn(t,e),a=i?xp(t,e):_s(t,e,!0),r=i;do{if(a===0){xi&&!i&&sn(t,e,0,!1);break}else{if(l=t.current.alternate,r&&!yp(l)){a=_s(t,e,!1),r=!1;continue}if(a===2){if(r=e,t.errorRecoveryDisabledLanes&r)var h=0;else h=t.pendingLanes&-536870913,h=h!==0?h:h&536870912?536870912:0;if(h!==0){e=h;t:{var m=t;a=ja;var b=m.current.memoizedState.isDehydrated;if(b&&($i(m,h).flags|=256),h=_s(m,h,!1),h!==2){if(Ss&&!b){m.errorRecoveryDisabledLanes|=r,Nn|=r,a=4;break t}r=ke,ke=a,r!==null&&(ke===null?ke=r:ke.push.apply(ke,r))}a=h}if(r=!1,a!==2)continue}}if(a===1){$i(t,0),sn(t,e,0,!0);break}t:{switch(i=t,r=a,r){case 0:case 1:throw Error(s(345));case 4:if((e&4194048)!==e)break;case 6:sn(i,e,tl,!an);break t;case 2:ke=null;break;case 3:case 5:break;default:throw Error(s(329))}if((e&62914560)===e&&(a=Es+300-Qe(),10<a)){if(sn(i,e,tl,!an),bn(i,0,!0)!==0)break t;i.timeoutHandle=$m(Wh.bind(null,i,l,ke,Xu,ws,e,tl,Nn,bi,an,r,2,-0,0),a);break t}Wh(i,l,ke,Xu,ws,e,tl,Nn,bi,an,r,0,-0,0)}}break}while(!0);pl(t)}function Wh(t,e,l,i,a,r,h,m,b,C,U,G,D,R){if(t.timeoutHandle=-1,G=e.subtreeFlags,(G&8192||(G&16785408)===16785408)&&(ka={stylesheets:null,count:0,unsuspend:Jp},qh(e),G=Pp(),G!==null)){t.cancelPendingCommit=G(em.bind(null,t,e,r,l,i,a,h,m,b,U,1,D,R)),sn(t,r,h,!C);return}em(t,e,r,l,i,a,h,m,b)}function yp(t){for(var e=t;;){var l=e.tag;if((l===0||l===11||l===15)&&e.flags&16384&&(l=e.updateQueue,l!==null&&(l=l.stores,l!==null)))for(var i=0;i<l.length;i++){var a=l[i],r=a.getSnapshot;a=a.value;try{if(!Ue(r(),a))return!1}catch{return!1}}if(l=e.child,e.subtreeFlags&16384&&l!==null)l.return=e,e=l;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function sn(t,e,l,i){e&=~$s,e&=~Nn,t.suspendedLanes|=e,t.pingedLanes&=~e,i&&(t.warmLanes|=e),i=t.expirationTimes;for(var a=e;0<a;){var r=31-Zt(a),h=1<<r;i[r]=-1,a&=~h}l!==0&&af(t,l,e)}function Qu(){return(qt&6)===0?(Ca(0),!1):!0}function As(){if(Dt!==null){if(Vt===0)var t=Dt.return;else t=Dt,Cl=_n=null,Xo(t),mi=null,ba=0,t=Dt;for(;t!==null;)jh(t.alternate,t),t=t.return;Dt=null}}function $i(t,e){var l=t.timeoutHandle;l!==-1&&(t.timeoutHandle=-1,Op(l)),l=t.cancelPendingCommit,l!==null&&(t.cancelPendingCommit=null,l()),As(),Wt=t,Dt=l=zl(t.current,null),kt=e,Vt=0,Ve=null,an=!1,xi=vn(t,e),Ss=!1,bi=tl=$s=Nn=un=ee=0,ke=ja=null,ws=!1,(e&8)!==0&&(e|=e&32);var i=t.entangledLanes;if(i!==0)for(t=t.entanglements,i&=e;0<i;){var a=31-Zt(i),r=1<<a;e|=t[a],i&=~r}return Bl=e,mu(),l}function Kh(t,e){Ct=null,M.H=Ru,e===ca||e===wu?(e=dd(),Vt=3):e===sd?(e=dd(),Vt=4):Vt=e===hh?8:e!==null&&typeof e=="object"&&typeof e.then=="function"?6:1,Ve=e,Dt===null&&(ee=1,Uu(t,Ke(e,t.current)))}function Fh(){var t=M.H;return M.H=Ru,t===null?Ru:t}function Jh(){var t=M.A;return M.A=mp,t}function Cs(){ee=4,an||(kt&4194048)!==kt&&Pe.current!==null||(xi=!0),(un&134217727)===0&&(Nn&134217727)===0||Wt===null||sn(Wt,kt,tl,!1)}function _s(t,e,l){var i=qt;qt|=2;var a=Fh(),r=Jh();(Wt!==t||kt!==e)&&(Xu=null,$i(t,e)),e=!1;var h=ee;t:do try{if(Vt!==0&&Dt!==null){var m=Dt,b=Ve;switch(Vt){case 8:As(),h=6;break t;case 3:case 2:case 9:case 6:Pe.current===null&&(e=!0);var C=Vt;if(Vt=0,Ve=null,wi(t,m,b,C),l&&xi){h=0;break t}break;default:C=Vt,Vt=0,Ve=null,wi(t,m,b,C)}}pp(),h=ee;break}catch(U){Kh(t,U)}while(!0);return e&&t.shellSuspendCounter++,Cl=_n=null,qt=i,M.H=a,M.A=r,Dt===null&&(Wt=null,kt=0,mu()),h}function pp(){for(;Dt!==null;)Ih(Dt)}function xp(t,e){var l=qt;qt|=2;var i=Fh(),a=Jh();Wt!==t||kt!==e?(Xu=null,Gu=Qe()+500,$i(t,e)):xi=vn(t,e);t:do try{if(Vt!==0&&Dt!==null){e=Dt;var r=Ve;e:switch(Vt){case 1:Vt=0,Ve=null,wi(t,e,r,1);break;case 2:case 9:if(cd(r)){Vt=0,Ve=null,Ph(e);break}e=function(){Vt!==2&&Vt!==9||Wt!==t||(Vt=7),pl(t)},r.then(e,e);break t;case 3:Vt=7;break t;case 4:Vt=5;break t;case 7:cd(r)?(Vt=0,Ve=null,Ph(e)):(Vt=0,Ve=null,wi(t,e,r,7));break;case 5:var h=null;switch(Dt.tag){case 26:h=Dt.memoizedState;case 5:case 27:var m=Dt;if(!h||Om(h)){Vt=0,Ve=null;var b=m.sibling;if(b!==null)Dt=b;else{var C=m.return;C!==null?(Dt=C,Zu(C)):Dt=null}break e}}Vt=0,Ve=null,wi(t,e,r,5);break;case 6:Vt=0,Ve=null,wi(t,e,r,6);break;case 8:As(),ee=6;break t;default:throw Error(s(462))}}bp();break}catch(U){Kh(t,U)}while(!0);return Cl=_n=null,M.H=i,M.A=a,qt=l,Dt!==null?0:(Wt=null,kt=0,mu(),ee)}function bp(){for(;Dt!==null&&!eu();)Ih(Dt)}function Ih(t){var e=Th(t.alternate,t,Bl);t.memoizedProps=t.pendingProps,e===null?Zu(t):Dt=e}function Ph(t){var e=t,l=e.alternate;switch(e.tag){case 15:case 0:e=bh(l,e,e.pendingProps,e.type,void 0,kt);break;case 11:e=bh(l,e,e.pendingProps,e.type.render,e.ref,kt);break;case 5:Xo(e);default:jh(l,e),e=Dt=td(e,Bl),e=Th(l,e,Bl)}t.memoizedProps=t.pendingProps,e===null?Zu(t):Dt=e}function wi(t,e,l,i){Cl=_n=null,Xo(e),mi=null,ba=0;var a=e.return;try{if(op(t,a,e,l,kt)){ee=1,Uu(t,Ke(l,t.current)),Dt=null;return}}catch(r){if(a!==null)throw Dt=a,r;ee=1,Uu(t,Ke(l,t.current)),Dt=null;return}e.flags&32768?(Ut||i===1?t=!0:xi||(kt&536870912)!==0?t=!1:(an=t=!0,(i===2||i===9||i===3||i===6)&&(i=Pe.current,i!==null&&i.tag===13&&(i.flags|=16384))),tm(e,t)):Zu(e)}function Zu(t){var e=t;do{if((e.flags&32768)!==0){tm(e,an);return}t=e.return;var l=cp(e.alternate,e,Bl);if(l!==null){Dt=l;return}if(e=e.sibling,e!==null){Dt=e;return}Dt=e=t}while(e!==null);ee===0&&(ee=5)}function tm(t,e){do{var l=fp(t.alternate,t);if(l!==null){l.flags&=32767,Dt=l;return}if(l=t.return,l!==null&&(l.flags|=32768,l.subtreeFlags=0,l.deletions=null),!e&&(t=t.sibling,t!==null)){Dt=t;return}Dt=t=l}while(t!==null);ee=6,Dt=null}function em(t,e,l,i,a,r,h,m,b){t.cancelPendingCommit=null;do Wu();while($e!==0);if((qt&6)!==0)throw Error(s(327));if(e!==null){if(e===t.current)throw Error(s(177));if(r=e.lanes|e.childLanes,r|=vo,J0(t,l,r,h,m,b),t===Wt&&(Dt=Wt=null,kt=0),vi=e,on=t,Si=l,Ts=r,zs=a,Xh=i,(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,wp(_,function(){return um(),null})):(t.callbackNode=null,t.callbackPriority=0),i=(e.flags&13878)!==0,(e.subtreeFlags&13878)!==0||i){i=M.T,M.T=null,a=I.p,I.p=2,h=qt,qt|=4;try{dp(t,e,l)}finally{qt=h,I.p=a,M.T=i}}$e=1,lm(),nm(),im()}}function lm(){if($e===1){$e=0;var t=on,e=vi,l=(e.flags&13878)!==0;if((e.subtreeFlags&13878)!==0||l){l=M.T,M.T=null;var i=I.p;I.p=2;var a=qt;qt|=4;try{Uh(e,t);var r=Vs,h=Gf(t.containerInfo),m=r.focusedElem,b=r.selectionRange;if(h!==m&&m&&m.ownerDocument&&Yf(m.ownerDocument.documentElement,m)){if(b!==null&&go(m)){var C=b.start,U=b.end;if(U===void 0&&(U=C),"selectionStart"in m)m.selectionStart=C,m.selectionEnd=Math.min(U,m.value.length);else{var G=m.ownerDocument||document,D=G&&G.defaultView||window;if(D.getSelection){var R=D.getSelection(),St=m.textContent.length,xt=Math.min(b.start,St),Xt=b.end===void 0?xt:Math.min(b.end,St);!R.extend&&xt>Xt&&(h=Xt,Xt=xt,xt=h);var T=Vf(m,xt),w=Vf(m,Xt);if(T&&w&&(R.rangeCount!==1||R.anchorNode!==T.node||R.anchorOffset!==T.offset||R.focusNode!==w.node||R.focusOffset!==w.offset)){var A=G.createRange();A.setStart(T.node,T.offset),R.removeAllRanges(),xt>Xt?(R.addRange(A),R.extend(w.node,w.offset)):(A.setEnd(w.node,w.offset),R.addRange(A))}}}}for(G=[],R=m;R=R.parentNode;)R.nodeType===1&&G.push({element:R,left:R.scrollLeft,top:R.scrollTop});for(typeof m.focus=="function"&&m.focus(),m=0;m<G.length;m++){var Y=G[m];Y.element.scrollLeft=Y.left,Y.element.scrollTop=Y.top}}ur=!!qs,Vs=qs=null}finally{qt=a,I.p=i,M.T=l}}t.current=e,$e=2}}function nm(){if($e===2){$e=0;var t=on,e=vi,l=(e.flags&8772)!==0;if((e.subtreeFlags&8772)!==0||l){l=M.T,M.T=null;var i=I.p;I.p=2;var a=qt;qt|=4;try{Oh(t,e.alternate,e)}finally{qt=a,I.p=i,M.T=l}}$e=3}}function im(){if($e===4||$e===3){$e=0,Yr();var t=on,e=vi,l=Si,i=Xh;(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?$e=5:($e=0,vi=on=null,am(t,t.pendingLanes));var a=t.pendingLanes;if(a===0&&(rn=null),Zr(l),e=e.stateNode,Tt&&typeof Tt.onCommitFiberRoot=="function")try{Tt.onCommitFiberRoot(ht,e,void 0,(e.current.flags&128)===128)}catch{}if(i!==null){e=M.T,a=I.p,I.p=2,M.T=null;try{for(var r=t.onRecoverableError,h=0;h<i.length;h++){var m=i[h];r(m.value,{componentStack:m.stack})}}finally{M.T=e,I.p=a}}(Si&3)!==0&&Wu(),pl(t),a=t.pendingLanes,(l&4194090)!==0&&(a&42)!==0?t===js?Aa++:(Aa=0,js=t):Aa=0,Ca(0)}}function am(t,e){(t.pooledCacheLanes&=e)===0&&(e=t.pooledCache,e!=null&&(t.pooledCache=null,oa(e)))}function Wu(t){return lm(),nm(),im(),um()}function um(){if($e!==5)return!1;var t=on,e=Ts;Ts=0;var l=Zr(Si),i=M.T,a=I.p;try{I.p=32>l?32:l,M.T=null,l=zs,zs=null;var r=on,h=Si;if($e=0,vi=on=null,Si=0,(qt&6)!==0)throw Error(s(331));var m=qt;if(qt|=4,Yh(r.current),Hh(r,r.current,h,l),qt=m,Ca(0,!1),Tt&&typeof Tt.onPostCommitFiberRoot=="function")try{Tt.onPostCommitFiberRoot(ht,r)}catch{}return!0}finally{I.p=a,M.T=i,am(t,e)}}function rm(t,e,l){e=Ke(l,e),e=as(t.stateNode,e,2),t=Jl(t,e,2),t!==null&&(Qi(t,2),pl(t))}function Qt(t,e,l){if(t.tag===3)rm(t,t,l);else for(;e!==null;){if(e.tag===3){rm(e,t,l);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(rn===null||!rn.has(i))){t=Ke(l,t),l=fh(2),i=Jl(e,l,2),i!==null&&(dh(l,i,e,t),Qi(i,2),pl(i));break}}e=e.return}}function Ds(t,e,l){var i=t.pingCache;if(i===null){i=t.pingCache=new gp;var a=new Set;i.set(e,a)}else a=i.get(e),a===void 0&&(a=new Set,i.set(e,a));a.has(l)||(Ss=!0,a.add(l),t=vp.bind(null,t,e,l),e.then(t,t))}function vp(t,e,l){var i=t.pingCache;i!==null&&i.delete(e),t.pingedLanes|=t.suspendedLanes&l,t.warmLanes&=~l,Wt===t&&(kt&l)===l&&(ee===4||ee===3&&(kt&62914560)===kt&&300>Qe()-Es?(qt&2)===0&&$i(t,0):$s|=l,bi===kt&&(bi=0)),pl(t)}function om(t,e){e===0&&(e=nf()),t=ii(t,e),t!==null&&(Qi(t,e),pl(t))}function Sp(t){var e=t.memoizedState,l=0;e!==null&&(l=e.retryLane),om(t,l)}function $p(t,e){var l=0;switch(t.tag){case 13:var i=t.stateNode,a=t.memoizedState;a!==null&&(l=a.retryLane);break;case 19:i=t.stateNode;break;case 22:i=t.stateNode._retryCache;break;default:throw Error(s(314))}i!==null&&i.delete(e),om(t,l)}function wp(t,e){return Gi(t,e)}var Ku=null,Ei=null,Ms=!1,Fu=!1,Rs=!1,Bn=0;function pl(t){t!==Ei&&t.next===null&&(Ei===null?Ku=Ei=t:Ei=Ei.next=t),Fu=!0,Ms||(Ms=!0,Tp())}function Ca(t,e){if(!Rs&&Fu){Rs=!0;do for(var l=!1,i=Ku;i!==null;){if(t!==0){var a=i.pendingLanes;if(a===0)var r=0;else{var h=i.suspendedLanes,m=i.pingedLanes;r=(1<<31-Zt(42|t)+1)-1,r&=a&~(h&~m),r=r&201326741?r&201326741|1:r?r|2:0}r!==0&&(l=!0,dm(i,r))}else r=kt,r=bn(i,i===Wt?r:0,i.cancelPendingCommit!==null||i.timeoutHandle!==-1),(r&3)===0||vn(i,r)||(l=!0,dm(i,r));i=i.next}while(l);Rs=!1}}function Ep(){sm()}function sm(){Fu=Ms=!1;var t=0;Bn!==0&&(Rp()&&(t=Bn),Bn=0);for(var e=Qe(),l=null,i=Ku;i!==null;){var a=i.next,r=cm(i,e);r===0?(i.next=null,l===null?Ku=a:l.next=a,a===null&&(Ei=l)):(l=i,(t!==0||(r&3)!==0)&&(Fu=!0)),i=a}Ca(t)}function cm(t,e){for(var l=t.suspendedLanes,i=t.pingedLanes,a=t.expirationTimes,r=t.pendingLanes&-62914561;0<r;){var h=31-Zt(r),m=1<<h,b=a[h];b===-1?((m&l)===0||(m&i)!==0)&&(a[h]=lu(m,e)):b<=e&&(t.expiredLanes|=m),r&=~m}if(e=Wt,l=kt,l=bn(t,t===e?l:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),i=t.callbackNode,l===0||t===e&&(Vt===2||Vt===9)||t.cancelPendingCommit!==null)return i!==null&&i!==null&&Vn(i),t.callbackNode=null,t.callbackPriority=0;if((l&3)===0||vn(t,l)){if(e=l&-l,e===t.callbackPriority)return e;switch(i!==null&&Vn(i),Zr(l)){case 2:case 8:l=$;break;case 32:l=_;break;case 268435456:l=ut;break;default:l=_}return i=fm.bind(null,t),l=Gi(l,i),t.callbackPriority=e,t.callbackNode=l,e}return i!==null&&i!==null&&Vn(i),t.callbackPriority=2,t.callbackNode=null,2}function fm(t,e){if($e!==0&&$e!==5)return t.callbackNode=null,t.callbackPriority=0,null;var l=t.callbackNode;if(Wu()&&t.callbackNode!==l)return null;var i=kt;return i=bn(t,t===Wt?i:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),i===0?null:(Zh(t,i,e),cm(t,Qe()),t.callbackNode!=null&&t.callbackNode===l?fm.bind(null,t):null)}function dm(t,e){if(Wu())return null;Zh(t,e,!0)}function Tp(){kp(function(){(qt&6)!==0?Gi(Xi,Ep):sm()})}function Os(){return Bn===0&&(Bn=lf()),Bn}function hm(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:ru(""+t)}function mm(t,e){var l=e.ownerDocument.createElement("input");return l.name=e.name,l.value=e.value,t.id&&l.setAttribute("form",t.id),e.parentNode.insertBefore(l,e),t=new FormData(t),l.parentNode.removeChild(l),t}function zp(t,e,l,i,a){if(e==="submit"&&l&&l.stateNode===a){var r=hm((a[De]||null).action),h=i.submitter;h&&(e=(e=h[De]||null)?hm(e.formAction):h.getAttribute("formAction"),e!==null&&(r=e,h=null));var m=new fu("action","action",null,i,a);t.push({event:m,listeners:[{instance:null,listener:function(){if(i.defaultPrevented){if(Bn!==0){var b=h?mm(a,h):new FormData(a);ts(l,{pending:!0,data:b,method:a.method,action:r},null,b)}}else typeof r=="function"&&(m.preventDefault(),b=h?mm(a,h):new FormData(a),ts(l,{pending:!0,data:b,method:a.method,action:r},r,b))},currentTarget:a}]})}}for(var ks=0;ks<bo.length;ks++){var Ns=bo[ks],jp=Ns.toLowerCase(),Ap=Ns[0].toUpperCase()+Ns.slice(1);ul(jp,"on"+Ap)}ul(Zf,"onAnimationEnd"),ul(Wf,"onAnimationIteration"),ul(Kf,"onAnimationStart"),ul("dblclick","onDoubleClick"),ul("focusin","onFocus"),ul("focusout","onBlur"),ul(Xy,"onTransitionRun"),ul(Qy,"onTransitionStart"),ul(Zy,"onTransitionCancel"),ul(Ff,"onTransitionEnd"),Wn("onMouseEnter",["mouseout","mouseover"]),Wn("onMouseLeave",["mouseout","mouseover"]),Wn("onPointerEnter",["pointerout","pointerover"]),Wn("onPointerLeave",["pointerout","pointerover"]),Sn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Sn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Sn("onBeforeInput",["compositionend","keypress","textInput","paste"]),Sn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Sn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Sn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var _a="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Cp=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(_a));function gm(t,e){e=(e&4)!==0;for(var l=0;l<t.length;l++){var i=t[l],a=i.event;i=i.listeners;t:{var r=void 0;if(e)for(var h=i.length-1;0<=h;h--){var m=i[h],b=m.instance,C=m.currentTarget;if(m=m.listener,b!==r&&a.isPropagationStopped())break t;r=m,a.currentTarget=C;try{r(a)}catch(U){Bu(U)}a.currentTarget=null,r=b}else for(h=0;h<i.length;h++){if(m=i[h],b=m.instance,C=m.currentTarget,m=m.listener,b!==r&&a.isPropagationStopped())break t;r=m,a.currentTarget=C;try{r(a)}catch(U){Bu(U)}a.currentTarget=null,r=b}}}}function Mt(t,e){var l=e[Wr];l===void 0&&(l=e[Wr]=new Set);var i=t+"__bubble";l.has(i)||(ym(e,t,2,!1),l.add(i))}function Bs(t,e,l){var i=0;e&&(i|=4),ym(l,t,i,e)}var Ju="_reactListening"+Math.random().toString(36).slice(2);function Us(t){if(!t[Ju]){t[Ju]=!0,sf.forEach(function(l){l!=="selectionchange"&&(Cp.has(l)||Bs(l,!1,t),Bs(l,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Ju]||(e[Ju]=!0,Bs("selectionchange",!1,e))}}function ym(t,e,l,i){switch(Hm(e)){case 2:var a=lx;break;case 8:a=nx;break;default:a=Is}l=a.bind(null,e,l,t),a=void 0,!ao||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(a=!0),i?a!==void 0?t.addEventListener(e,l,{capture:!0,passive:a}):t.addEventListener(e,l,!0):a!==void 0?t.addEventListener(e,l,{passive:a}):t.addEventListener(e,l,!1)}function Ls(t,e,l,i,a){var r=i;if((e&1)===0&&(e&2)===0&&i!==null)t:for(;;){if(i===null)return;var h=i.tag;if(h===3||h===4){var m=i.stateNode.containerInfo;if(m===a)break;if(h===4)for(h=i.return;h!==null;){var b=h.tag;if((b===3||b===4)&&h.stateNode.containerInfo===a)return;h=h.return}for(;m!==null;){if(h=Xn(m),h===null)return;if(b=h.tag,b===5||b===6||b===26||b===27){i=r=h;continue t}m=m.parentNode}}i=i.return}wf(function(){var C=r,U=no(l),G=[];t:{var D=Jf.get(t);if(D!==void 0){var R=fu,St=t;switch(t){case"keypress":if(su(l)===0)break t;case"keydown":case"keyup":R=wy;break;case"focusin":St="focus",R=so;break;case"focusout":St="blur",R=so;break;case"beforeblur":case"afterblur":R=so;break;case"click":if(l.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":R=zf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":R=fy;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":R=zy;break;case Zf:case Wf:case Kf:R=my;break;case Ff:R=Ay;break;case"scroll":case"scrollend":R=sy;break;case"wheel":R=_y;break;case"copy":case"cut":case"paste":R=yy;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":R=Af;break;case"toggle":case"beforetoggle":R=My}var xt=(e&4)!==0,Xt=!xt&&(t==="scroll"||t==="scrollend"),T=xt?D!==null?D+"Capture":null:D;xt=[];for(var w=C,A;w!==null;){var Y=w;if(A=Y.stateNode,Y=Y.tag,Y!==5&&Y!==26&&Y!==27||A===null||T===null||(Y=Ki(w,T),Y!=null&&xt.push(Da(w,Y,A))),Xt)break;w=w.return}0<xt.length&&(D=new R(D,St,null,l,U),G.push({event:D,listeners:xt}))}}if((e&7)===0){t:{if(D=t==="mouseover"||t==="pointerover",R=t==="mouseout"||t==="pointerout",D&&l!==lo&&(St=l.relatedTarget||l.fromElement)&&(Xn(St)||St[Gn]))break t;if((R||D)&&(D=U.window===U?U:(D=U.ownerDocument)?D.defaultView||D.parentWindow:window,R?(St=l.relatedTarget||l.toElement,R=C,St=St?Xn(St):null,St!==null&&(Xt=c(St),xt=St.tag,St!==Xt||xt!==5&&xt!==27&&xt!==6)&&(St=null)):(R=null,St=C),R!==St)){if(xt=zf,Y="onMouseLeave",T="onMouseEnter",w="mouse",(t==="pointerout"||t==="pointerover")&&(xt=Af,Y="onPointerLeave",T="onPointerEnter",w="pointer"),Xt=R==null?D:Wi(R),A=St==null?D:Wi(St),D=new xt(Y,w+"leave",R,l,U),D.target=Xt,D.relatedTarget=A,Y=null,Xn(U)===C&&(xt=new xt(T,w+"enter",St,l,U),xt.target=A,xt.relatedTarget=Xt,Y=xt),Xt=Y,R&&St)e:{for(xt=R,T=St,w=0,A=xt;A;A=Ti(A))w++;for(A=0,Y=T;Y;Y=Ti(Y))A++;for(;0<w-A;)xt=Ti(xt),w--;for(;0<A-w;)T=Ti(T),A--;for(;w--;){if(xt===T||T!==null&&xt===T.alternate)break e;xt=Ti(xt),T=Ti(T)}xt=null}else xt=null;R!==null&&pm(G,D,R,xt,!1),St!==null&&Xt!==null&&pm(G,Xt,St,xt,!0)}}t:{if(D=C?Wi(C):window,R=D.nodeName&&D.nodeName.toLowerCase(),R==="select"||R==="input"&&D.type==="file")var st=Nf;else if(Of(D))if(Bf)st=Vy;else{st=Hy;var _t=Ly}else R=D.nodeName,!R||R.toLowerCase()!=="input"||D.type!=="checkbox"&&D.type!=="radio"?C&&eo(C.elementType)&&(st=Nf):st=qy;if(st&&(st=st(t,C))){kf(G,st,l,U);break t}_t&&_t(t,D,C),t==="focusout"&&C&&D.type==="number"&&C.memoizedProps.value!=null&&to(D,"number",D.value)}switch(_t=C?Wi(C):window,t){case"focusin":(Of(_t)||_t.contentEditable==="true")&&(ei=_t,yo=C,na=null);break;case"focusout":na=yo=ei=null;break;case"mousedown":po=!0;break;case"contextmenu":case"mouseup":case"dragend":po=!1,Xf(G,l,U);break;case"selectionchange":if(Gy)break;case"keydown":case"keyup":Xf(G,l,U)}var yt;if(fo)t:{switch(t){case"compositionstart":var bt="onCompositionStart";break t;case"compositionend":bt="onCompositionEnd";break t;case"compositionupdate":bt="onCompositionUpdate";break t}bt=void 0}else ti?Mf(t,l)&&(bt="onCompositionEnd"):t==="keydown"&&l.keyCode===229&&(bt="onCompositionStart");bt&&(Cf&&l.locale!=="ko"&&(ti||bt!=="onCompositionStart"?bt==="onCompositionEnd"&&ti&&(yt=Ef()):(Zl=U,uo="value"in Zl?Zl.value:Zl.textContent,ti=!0)),_t=Iu(C,bt),0<_t.length&&(bt=new jf(bt,t,null,l,U),G.push({event:bt,listeners:_t}),yt?bt.data=yt:(yt=Rf(l),yt!==null&&(bt.data=yt)))),(yt=Oy?ky(t,l):Ny(t,l))&&(bt=Iu(C,"onBeforeInput"),0<bt.length&&(_t=new jf("onBeforeInput","beforeinput",null,l,U),G.push({event:_t,listeners:bt}),_t.data=yt)),zp(G,t,C,l,U)}gm(G,e)})}function Da(t,e,l){return{instance:t,listener:e,currentTarget:l}}function Iu(t,e){for(var l=e+"Capture",i=[];t!==null;){var a=t,r=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||r===null||(a=Ki(t,l),a!=null&&i.unshift(Da(t,a,r)),a=Ki(t,e),a!=null&&i.push(Da(t,a,r))),t.tag===3)return i;t=t.return}return[]}function Ti(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function pm(t,e,l,i,a){for(var r=e._reactName,h=[];l!==null&&l!==i;){var m=l,b=m.alternate,C=m.stateNode;if(m=m.tag,b!==null&&b===i)break;m!==5&&m!==26&&m!==27||C===null||(b=C,a?(C=Ki(l,r),C!=null&&h.unshift(Da(l,C,b))):a||(C=Ki(l,r),C!=null&&h.push(Da(l,C,b)))),l=l.return}h.length!==0&&t.push({event:e,listeners:h})}var _p=/\r\n?/g,Dp=/\u0000|\uFFFD/g;function xm(t){return(typeof t=="string"?t:""+t).replace(_p,`
`).replace(Dp,"")}function bm(t,e){return e=xm(e),xm(t)===e}function Pu(){}function Gt(t,e,l,i,a,r){switch(l){case"children":typeof i=="string"?e==="body"||e==="textarea"&&i===""||Jn(t,i):(typeof i=="number"||typeof i=="bigint")&&e!=="body"&&Jn(t,""+i);break;case"className":iu(t,"class",i);break;case"tabIndex":iu(t,"tabindex",i);break;case"dir":case"role":case"viewBox":case"width":case"height":iu(t,l,i);break;case"style":Sf(t,i,r);break;case"data":if(e!=="object"){iu(t,"data",i);break}case"src":case"href":if(i===""&&(e!=="a"||l!=="href")){t.removeAttribute(l);break}if(i==null||typeof i=="function"||typeof i=="symbol"||typeof i=="boolean"){t.removeAttribute(l);break}i=ru(""+i),t.setAttribute(l,i);break;case"action":case"formAction":if(typeof i=="function"){t.setAttribute(l,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof r=="function"&&(l==="formAction"?(e!=="input"&&Gt(t,e,"name",a.name,a,null),Gt(t,e,"formEncType",a.formEncType,a,null),Gt(t,e,"formMethod",a.formMethod,a,null),Gt(t,e,"formTarget",a.formTarget,a,null)):(Gt(t,e,"encType",a.encType,a,null),Gt(t,e,"method",a.method,a,null),Gt(t,e,"target",a.target,a,null)));if(i==null||typeof i=="symbol"||typeof i=="boolean"){t.removeAttribute(l);break}i=ru(""+i),t.setAttribute(l,i);break;case"onClick":i!=null&&(t.onclick=Pu);break;case"onScroll":i!=null&&Mt("scroll",t);break;case"onScrollEnd":i!=null&&Mt("scrollend",t);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(s(61));if(l=i.__html,l!=null){if(a.children!=null)throw Error(s(60));t.innerHTML=l}}break;case"multiple":t.multiple=i&&typeof i!="function"&&typeof i!="symbol";break;case"muted":t.muted=i&&typeof i!="function"&&typeof i!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(i==null||typeof i=="function"||typeof i=="boolean"||typeof i=="symbol"){t.removeAttribute("xlink:href");break}l=ru(""+i),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",l);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":i!=null&&typeof i!="function"&&typeof i!="symbol"?t.setAttribute(l,""+i):t.removeAttribute(l);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":i&&typeof i!="function"&&typeof i!="symbol"?t.setAttribute(l,""):t.removeAttribute(l);break;case"capture":case"download":i===!0?t.setAttribute(l,""):i!==!1&&i!=null&&typeof i!="function"&&typeof i!="symbol"?t.setAttribute(l,i):t.removeAttribute(l);break;case"cols":case"rows":case"size":case"span":i!=null&&typeof i!="function"&&typeof i!="symbol"&&!isNaN(i)&&1<=i?t.setAttribute(l,i):t.removeAttribute(l);break;case"rowSpan":case"start":i==null||typeof i=="function"||typeof i=="symbol"||isNaN(i)?t.removeAttribute(l):t.setAttribute(l,i);break;case"popover":Mt("beforetoggle",t),Mt("toggle",t),nu(t,"popover",i);break;case"xlinkActuate":El(t,"http://www.w3.org/1999/xlink","xlink:actuate",i);break;case"xlinkArcrole":El(t,"http://www.w3.org/1999/xlink","xlink:arcrole",i);break;case"xlinkRole":El(t,"http://www.w3.org/1999/xlink","xlink:role",i);break;case"xlinkShow":El(t,"http://www.w3.org/1999/xlink","xlink:show",i);break;case"xlinkTitle":El(t,"http://www.w3.org/1999/xlink","xlink:title",i);break;case"xlinkType":El(t,"http://www.w3.org/1999/xlink","xlink:type",i);break;case"xmlBase":El(t,"http://www.w3.org/XML/1998/namespace","xml:base",i);break;case"xmlLang":El(t,"http://www.w3.org/XML/1998/namespace","xml:lang",i);break;case"xmlSpace":El(t,"http://www.w3.org/XML/1998/namespace","xml:space",i);break;case"is":nu(t,"is",i);break;case"innerText":case"textContent":break;default:(!(2<l.length)||l[0]!=="o"&&l[0]!=="O"||l[1]!=="n"&&l[1]!=="N")&&(l=ry.get(l)||l,nu(t,l,i))}}function Hs(t,e,l,i,a,r){switch(l){case"style":Sf(t,i,r);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(s(61));if(l=i.__html,l!=null){if(a.children!=null)throw Error(s(60));t.innerHTML=l}}break;case"children":typeof i=="string"?Jn(t,i):(typeof i=="number"||typeof i=="bigint")&&Jn(t,""+i);break;case"onScroll":i!=null&&Mt("scroll",t);break;case"onScrollEnd":i!=null&&Mt("scrollend",t);break;case"onClick":i!=null&&(t.onclick=Pu);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!cf.hasOwnProperty(l))t:{if(l[0]==="o"&&l[1]==="n"&&(a=l.endsWith("Capture"),e=l.slice(2,a?l.length-7:void 0),r=t[De]||null,r=r!=null?r[l]:null,typeof r=="function"&&t.removeEventListener(e,r,a),typeof i=="function")){typeof r!="function"&&r!==null&&(l in t?t[l]=null:t.hasAttribute(l)&&t.removeAttribute(l)),t.addEventListener(e,i,a);break t}l in t?t[l]=i:i===!0?t.setAttribute(l,""):nu(t,l,i)}}}function we(t,e,l){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Mt("error",t),Mt("load",t);var i=!1,a=!1,r;for(r in l)if(l.hasOwnProperty(r)){var h=l[r];if(h!=null)switch(r){case"src":i=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,e));default:Gt(t,e,r,h,l,null)}}a&&Gt(t,e,"srcSet",l.srcSet,l,null),i&&Gt(t,e,"src",l.src,l,null);return;case"input":Mt("invalid",t);var m=r=h=a=null,b=null,C=null;for(i in l)if(l.hasOwnProperty(i)){var U=l[i];if(U!=null)switch(i){case"name":a=U;break;case"type":h=U;break;case"checked":b=U;break;case"defaultChecked":C=U;break;case"value":r=U;break;case"defaultValue":m=U;break;case"children":case"dangerouslySetInnerHTML":if(U!=null)throw Error(s(137,e));break;default:Gt(t,e,i,U,l,null)}}pf(t,r,m,b,C,h,a,!1),au(t);return;case"select":Mt("invalid",t),i=h=r=null;for(a in l)if(l.hasOwnProperty(a)&&(m=l[a],m!=null))switch(a){case"value":r=m;break;case"defaultValue":h=m;break;case"multiple":i=m;default:Gt(t,e,a,m,l,null)}e=r,l=h,t.multiple=!!i,e!=null?Fn(t,!!i,e,!1):l!=null&&Fn(t,!!i,l,!0);return;case"textarea":Mt("invalid",t),r=a=i=null;for(h in l)if(l.hasOwnProperty(h)&&(m=l[h],m!=null))switch(h){case"value":i=m;break;case"defaultValue":a=m;break;case"children":r=m;break;case"dangerouslySetInnerHTML":if(m!=null)throw Error(s(91));break;default:Gt(t,e,h,m,l,null)}bf(t,i,a,r),au(t);return;case"option":for(b in l)if(l.hasOwnProperty(b)&&(i=l[b],i!=null))switch(b){case"selected":t.selected=i&&typeof i!="function"&&typeof i!="symbol";break;default:Gt(t,e,b,i,l,null)}return;case"dialog":Mt("beforetoggle",t),Mt("toggle",t),Mt("cancel",t),Mt("close",t);break;case"iframe":case"object":Mt("load",t);break;case"video":case"audio":for(i=0;i<_a.length;i++)Mt(_a[i],t);break;case"image":Mt("error",t),Mt("load",t);break;case"details":Mt("toggle",t);break;case"embed":case"source":case"link":Mt("error",t),Mt("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(C in l)if(l.hasOwnProperty(C)&&(i=l[C],i!=null))switch(C){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,e));default:Gt(t,e,C,i,l,null)}return;default:if(eo(e)){for(U in l)l.hasOwnProperty(U)&&(i=l[U],i!==void 0&&Hs(t,e,U,i,l,void 0));return}}for(m in l)l.hasOwnProperty(m)&&(i=l[m],i!=null&&Gt(t,e,m,i,l,null))}function Mp(t,e,l,i){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,r=null,h=null,m=null,b=null,C=null,U=null;for(R in l){var G=l[R];if(l.hasOwnProperty(R)&&G!=null)switch(R){case"checked":break;case"value":break;case"defaultValue":b=G;default:i.hasOwnProperty(R)||Gt(t,e,R,null,i,G)}}for(var D in i){var R=i[D];if(G=l[D],i.hasOwnProperty(D)&&(R!=null||G!=null))switch(D){case"type":r=R;break;case"name":a=R;break;case"checked":C=R;break;case"defaultChecked":U=R;break;case"value":h=R;break;case"defaultValue":m=R;break;case"children":case"dangerouslySetInnerHTML":if(R!=null)throw Error(s(137,e));break;default:R!==G&&Gt(t,e,D,R,i,G)}}Pr(t,h,m,b,C,U,r,a);return;case"select":R=h=m=D=null;for(r in l)if(b=l[r],l.hasOwnProperty(r)&&b!=null)switch(r){case"value":break;case"multiple":R=b;default:i.hasOwnProperty(r)||Gt(t,e,r,null,i,b)}for(a in i)if(r=i[a],b=l[a],i.hasOwnProperty(a)&&(r!=null||b!=null))switch(a){case"value":D=r;break;case"defaultValue":m=r;break;case"multiple":h=r;default:r!==b&&Gt(t,e,a,r,i,b)}e=m,l=h,i=R,D!=null?Fn(t,!!l,D,!1):!!i!=!!l&&(e!=null?Fn(t,!!l,e,!0):Fn(t,!!l,l?[]:"",!1));return;case"textarea":R=D=null;for(m in l)if(a=l[m],l.hasOwnProperty(m)&&a!=null&&!i.hasOwnProperty(m))switch(m){case"value":break;case"children":break;default:Gt(t,e,m,null,i,a)}for(h in i)if(a=i[h],r=l[h],i.hasOwnProperty(h)&&(a!=null||r!=null))switch(h){case"value":D=a;break;case"defaultValue":R=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(s(91));break;default:a!==r&&Gt(t,e,h,a,i,r)}xf(t,D,R);return;case"option":for(var St in l)if(D=l[St],l.hasOwnProperty(St)&&D!=null&&!i.hasOwnProperty(St))switch(St){case"selected":t.selected=!1;break;default:Gt(t,e,St,null,i,D)}for(b in i)if(D=i[b],R=l[b],i.hasOwnProperty(b)&&D!==R&&(D!=null||R!=null))switch(b){case"selected":t.selected=D&&typeof D!="function"&&typeof D!="symbol";break;default:Gt(t,e,b,D,i,R)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var xt in l)D=l[xt],l.hasOwnProperty(xt)&&D!=null&&!i.hasOwnProperty(xt)&&Gt(t,e,xt,null,i,D);for(C in i)if(D=i[C],R=l[C],i.hasOwnProperty(C)&&D!==R&&(D!=null||R!=null))switch(C){case"children":case"dangerouslySetInnerHTML":if(D!=null)throw Error(s(137,e));break;default:Gt(t,e,C,D,i,R)}return;default:if(eo(e)){for(var Xt in l)D=l[Xt],l.hasOwnProperty(Xt)&&D!==void 0&&!i.hasOwnProperty(Xt)&&Hs(t,e,Xt,void 0,i,D);for(U in i)D=i[U],R=l[U],!i.hasOwnProperty(U)||D===R||D===void 0&&R===void 0||Hs(t,e,U,D,i,R);return}}for(var T in l)D=l[T],l.hasOwnProperty(T)&&D!=null&&!i.hasOwnProperty(T)&&Gt(t,e,T,null,i,D);for(G in i)D=i[G],R=l[G],!i.hasOwnProperty(G)||D===R||D==null&&R==null||Gt(t,e,G,D,i,R)}var qs=null,Vs=null;function tr(t){return t.nodeType===9?t:t.ownerDocument}function vm(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Sm(t,e){if(t===0)switch(e){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&e==="foreignObject"?0:t}function Ys(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.children=="bigint"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Gs=null;function Rp(){var t=window.event;return t&&t.type==="popstate"?t===Gs?!1:(Gs=t,!0):(Gs=null,!1)}var $m=typeof setTimeout=="function"?setTimeout:void 0,Op=typeof clearTimeout=="function"?clearTimeout:void 0,wm=typeof Promise=="function"?Promise:void 0,kp=typeof queueMicrotask=="function"?queueMicrotask:typeof wm<"u"?function(t){return wm.resolve(null).then(t).catch(Np)}:$m;function Np(t){setTimeout(function(){throw t})}function cn(t){return t==="head"}function Em(t,e){var l=e,i=0,a=0;do{var r=l.nextSibling;if(t.removeChild(l),r&&r.nodeType===8)if(l=r.data,l==="/$"){if(0<i&&8>i){l=i;var h=t.ownerDocument;if(l&1&&Ma(h.documentElement),l&2&&Ma(h.body),l&4)for(l=h.head,Ma(l),h=l.firstChild;h;){var m=h.nextSibling,b=h.nodeName;h[Zi]||b==="SCRIPT"||b==="STYLE"||b==="LINK"&&h.rel.toLowerCase()==="stylesheet"||l.removeChild(h),h=m}}if(a===0){t.removeChild(r),Ha(e);return}a--}else l==="$"||l==="$?"||l==="$!"?a++:i=l.charCodeAt(0)-48;else i=0;l=r}while(l);Ha(e)}function Xs(t){var e=t.firstChild;for(e&&e.nodeType===10&&(e=e.nextSibling);e;){var l=e;switch(e=e.nextSibling,l.nodeName){case"HTML":case"HEAD":case"BODY":Xs(l),Kr(l);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(l.rel.toLowerCase()==="stylesheet")continue}t.removeChild(l)}}function Bp(t,e,l,i){for(;t.nodeType===1;){var a=l;if(t.nodeName.toLowerCase()!==e.toLowerCase()){if(!i&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(i){if(!t[Zi])switch(e){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(r=t.getAttribute("rel"),r==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(r!==a.rel||t.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||t.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||t.getAttribute("title")!==(a.title==null?null:a.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(r=t.getAttribute("src"),(r!==(a.src==null?null:a.src)||t.getAttribute("type")!==(a.type==null?null:a.type)||t.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&r&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(e==="input"&&t.type==="hidden"){var r=a.name==null?null:""+a.name;if(a.type==="hidden"&&t.getAttribute("name")===r)return t}else return t;if(t=ol(t.nextSibling),t===null)break}return null}function Up(t,e,l){if(e==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!l||(t=ol(t.nextSibling),t===null))return null;return t}function Qs(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState==="complete"}function Lp(t,e){var l=t.ownerDocument;if(t.data!=="$?"||l.readyState==="complete")e();else{var i=function(){e(),l.removeEventListener("DOMContentLoaded",i)};l.addEventListener("DOMContentLoaded",i),t._reactRetry=i}}function ol(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?"||e==="F!"||e==="F")break;if(e==="/$")return null}}return t}var Zs=null;function Tm(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var l=t.data;if(l==="$"||l==="$!"||l==="$?"){if(e===0)return t;e--}else l==="/$"&&e++}t=t.previousSibling}return null}function zm(t,e,l){switch(e=tr(l),t){case"html":if(t=e.documentElement,!t)throw Error(s(452));return t;case"head":if(t=e.head,!t)throw Error(s(453));return t;case"body":if(t=e.body,!t)throw Error(s(454));return t;default:throw Error(s(451))}}function Ma(t){for(var e=t.attributes;e.length;)t.removeAttributeNode(e[0]);Kr(t)}var el=new Map,jm=new Set;function er(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Ul=I.d;I.d={f:Hp,r:qp,D:Vp,C:Yp,L:Gp,m:Xp,X:Zp,S:Qp,M:Wp};function Hp(){var t=Ul.f(),e=Qu();return t||e}function qp(t){var e=Qn(t);e!==null&&e.tag===5&&e.type==="form"?Zd(e):Ul.r(t)}var zi=typeof document>"u"?null:document;function Am(t,e,l){var i=zi;if(i&&typeof e=="string"&&e){var a=We(e);a='link[rel="'+t+'"][href="'+a+'"]',typeof l=="string"&&(a+='[crossorigin="'+l+'"]'),jm.has(a)||(jm.add(a),t={rel:t,crossOrigin:l,href:e},i.querySelector(a)===null&&(e=i.createElement("link"),we(e,"link",t),me(e),i.head.appendChild(e)))}}function Vp(t){Ul.D(t),Am("dns-prefetch",t,null)}function Yp(t,e){Ul.C(t,e),Am("preconnect",t,e)}function Gp(t,e,l){Ul.L(t,e,l);var i=zi;if(i&&t&&e){var a='link[rel="preload"][as="'+We(e)+'"]';e==="image"&&l&&l.imageSrcSet?(a+='[imagesrcset="'+We(l.imageSrcSet)+'"]',typeof l.imageSizes=="string"&&(a+='[imagesizes="'+We(l.imageSizes)+'"]')):a+='[href="'+We(t)+'"]';var r=a;switch(e){case"style":r=ji(t);break;case"script":r=Ai(t)}el.has(r)||(t=v({rel:"preload",href:e==="image"&&l&&l.imageSrcSet?void 0:t,as:e},l),el.set(r,t),i.querySelector(a)!==null||e==="style"&&i.querySelector(Ra(r))||e==="script"&&i.querySelector(Oa(r))||(e=i.createElement("link"),we(e,"link",t),me(e),i.head.appendChild(e)))}}function Xp(t,e){Ul.m(t,e);var l=zi;if(l&&t){var i=e&&typeof e.as=="string"?e.as:"script",a='link[rel="modulepreload"][as="'+We(i)+'"][href="'+We(t)+'"]',r=a;switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":r=Ai(t)}if(!el.has(r)&&(t=v({rel:"modulepreload",href:t},e),el.set(r,t),l.querySelector(a)===null)){switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(l.querySelector(Oa(r)))return}i=l.createElement("link"),we(i,"link",t),me(i),l.head.appendChild(i)}}}function Qp(t,e,l){Ul.S(t,e,l);var i=zi;if(i&&t){var a=Zn(i).hoistableStyles,r=ji(t);e=e||"default";var h=a.get(r);if(!h){var m={loading:0,preload:null};if(h=i.querySelector(Ra(r)))m.loading=5;else{t=v({rel:"stylesheet",href:t,"data-precedence":e},l),(l=el.get(r))&&Ws(t,l);var b=h=i.createElement("link");me(b),we(b,"link",t),b._p=new Promise(function(C,U){b.onload=C,b.onerror=U}),b.addEventListener("load",function(){m.loading|=1}),b.addEventListener("error",function(){m.loading|=2}),m.loading|=4,lr(h,e,i)}h={type:"stylesheet",instance:h,count:1,state:m},a.set(r,h)}}}function Zp(t,e){Ul.X(t,e);var l=zi;if(l&&t){var i=Zn(l).hoistableScripts,a=Ai(t),r=i.get(a);r||(r=l.querySelector(Oa(a)),r||(t=v({src:t,async:!0},e),(e=el.get(a))&&Ks(t,e),r=l.createElement("script"),me(r),we(r,"link",t),l.head.appendChild(r)),r={type:"script",instance:r,count:1,state:null},i.set(a,r))}}function Wp(t,e){Ul.M(t,e);var l=zi;if(l&&t){var i=Zn(l).hoistableScripts,a=Ai(t),r=i.get(a);r||(r=l.querySelector(Oa(a)),r||(t=v({src:t,async:!0,type:"module"},e),(e=el.get(a))&&Ks(t,e),r=l.createElement("script"),me(r),we(r,"link",t),l.head.appendChild(r)),r={type:"script",instance:r,count:1,state:null},i.set(a,r))}}function Cm(t,e,l,i){var a=(a=pt.current)?er(a):null;if(!a)throw Error(s(446));switch(t){case"meta":case"title":return null;case"style":return typeof l.precedence=="string"&&typeof l.href=="string"?(e=ji(l.href),l=Zn(a).hoistableStyles,i=l.get(e),i||(i={type:"style",instance:null,count:0,state:null},l.set(e,i)),i):{type:"void",instance:null,count:0,state:null};case"link":if(l.rel==="stylesheet"&&typeof l.href=="string"&&typeof l.precedence=="string"){t=ji(l.href);var r=Zn(a).hoistableStyles,h=r.get(t);if(h||(a=a.ownerDocument||a,h={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},r.set(t,h),(r=a.querySelector(Ra(t)))&&!r._p&&(h.instance=r,h.state.loading=5),el.has(t)||(l={rel:"preload",as:"style",href:l.href,crossOrigin:l.crossOrigin,integrity:l.integrity,media:l.media,hrefLang:l.hrefLang,referrerPolicy:l.referrerPolicy},el.set(t,l),r||Kp(a,t,l,h.state))),e&&i===null)throw Error(s(528,""));return h}if(e&&i!==null)throw Error(s(529,""));return null;case"script":return e=l.async,l=l.src,typeof l=="string"&&e&&typeof e!="function"&&typeof e!="symbol"?(e=Ai(l),l=Zn(a).hoistableScripts,i=l.get(e),i||(i={type:"script",instance:null,count:0,state:null},l.set(e,i)),i):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,t))}}function ji(t){return'href="'+We(t)+'"'}function Ra(t){return'link[rel="stylesheet"]['+t+"]"}function _m(t){return v({},t,{"data-precedence":t.precedence,precedence:null})}function Kp(t,e,l,i){t.querySelector('link[rel="preload"][as="style"]['+e+"]")?i.loading=1:(e=t.createElement("link"),i.preload=e,e.addEventListener("load",function(){return i.loading|=1}),e.addEventListener("error",function(){return i.loading|=2}),we(e,"link",l),me(e),t.head.appendChild(e))}function Ai(t){return'[src="'+We(t)+'"]'}function Oa(t){return"script[async]"+t}function Dm(t,e,l){if(e.count++,e.instance===null)switch(e.type){case"style":var i=t.querySelector('style[data-href~="'+We(l.href)+'"]');if(i)return e.instance=i,me(i),i;var a=v({},l,{"data-href":l.href,"data-precedence":l.precedence,href:null,precedence:null});return i=(t.ownerDocument||t).createElement("style"),me(i),we(i,"style",a),lr(i,l.precedence,t),e.instance=i;case"stylesheet":a=ji(l.href);var r=t.querySelector(Ra(a));if(r)return e.state.loading|=4,e.instance=r,me(r),r;i=_m(l),(a=el.get(a))&&Ws(i,a),r=(t.ownerDocument||t).createElement("link"),me(r);var h=r;return h._p=new Promise(function(m,b){h.onload=m,h.onerror=b}),we(r,"link",i),e.state.loading|=4,lr(r,l.precedence,t),e.instance=r;case"script":return r=Ai(l.src),(a=t.querySelector(Oa(r)))?(e.instance=a,me(a),a):(i=l,(a=el.get(r))&&(i=v({},l),Ks(i,a)),t=t.ownerDocument||t,a=t.createElement("script"),me(a),we(a,"link",i),t.head.appendChild(a),e.instance=a);case"void":return null;default:throw Error(s(443,e.type))}else e.type==="stylesheet"&&(e.state.loading&4)===0&&(i=e.instance,e.state.loading|=4,lr(i,l.precedence,t));return e.instance}function lr(t,e,l){for(var i=l.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=i.length?i[i.length-1]:null,r=a,h=0;h<i.length;h++){var m=i[h];if(m.dataset.precedence===e)r=m;else if(r!==a)break}r?r.parentNode.insertBefore(t,r.nextSibling):(e=l.nodeType===9?l.head:l,e.insertBefore(t,e.firstChild))}function Ws(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.title==null&&(t.title=e.title)}function Ks(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.integrity==null&&(t.integrity=e.integrity)}var nr=null;function Mm(t,e,l){if(nr===null){var i=new Map,a=nr=new Map;a.set(l,i)}else a=nr,i=a.get(l),i||(i=new Map,a.set(l,i));if(i.has(t))return i;for(i.set(t,null),l=l.getElementsByTagName(t),a=0;a<l.length;a++){var r=l[a];if(!(r[Zi]||r[Ee]||t==="link"&&r.getAttribute("rel")==="stylesheet")&&r.namespaceURI!=="http://www.w3.org/2000/svg"){var h=r.getAttribute(e)||"";h=t+h;var m=i.get(h);m?m.push(r):i.set(h,[r])}}return i}function Rm(t,e,l){t=t.ownerDocument||t,t.head.insertBefore(l,e==="title"?t.querySelector("head > title"):null)}function Fp(t,e,l){if(l===1||e.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof e.precedence!="string"||typeof e.href!="string"||e.href==="")break;return!0;case"link":if(typeof e.rel!="string"||typeof e.href!="string"||e.href===""||e.onLoad||e.onError)break;switch(e.rel){case"stylesheet":return t=e.disabled,typeof e.precedence=="string"&&t==null;default:return!0}case"script":if(e.async&&typeof e.async!="function"&&typeof e.async!="symbol"&&!e.onLoad&&!e.onError&&e.src&&typeof e.src=="string")return!0}return!1}function Om(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}var ka=null;function Jp(){}function Ip(t,e,l){if(ka===null)throw Error(s(475));var i=ka;if(e.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(e.state.loading&4)===0){if(e.instance===null){var a=ji(l.href),r=t.querySelector(Ra(a));if(r){t=r._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(i.count++,i=ir.bind(i),t.then(i,i)),e.state.loading|=4,e.instance=r,me(r);return}r=t.ownerDocument||t,l=_m(l),(a=el.get(a))&&Ws(l,a),r=r.createElement("link"),me(r);var h=r;h._p=new Promise(function(m,b){h.onload=m,h.onerror=b}),we(r,"link",l),e.instance=r}i.stylesheets===null&&(i.stylesheets=new Map),i.stylesheets.set(e,t),(t=e.state.preload)&&(e.state.loading&3)===0&&(i.count++,e=ir.bind(i),t.addEventListener("load",e),t.addEventListener("error",e))}}function Pp(){if(ka===null)throw Error(s(475));var t=ka;return t.stylesheets&&t.count===0&&Fs(t,t.stylesheets),0<t.count?function(e){var l=setTimeout(function(){if(t.stylesheets&&Fs(t,t.stylesheets),t.unsuspend){var i=t.unsuspend;t.unsuspend=null,i()}},6e4);return t.unsuspend=e,function(){t.unsuspend=null,clearTimeout(l)}}:null}function ir(){if(this.count--,this.count===0){if(this.stylesheets)Fs(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var ar=null;function Fs(t,e){t.stylesheets=null,t.unsuspend!==null&&(t.count++,ar=new Map,e.forEach(tx,t),ar=null,ir.call(t))}function tx(t,e){if(!(e.state.loading&4)){var l=ar.get(t);if(l)var i=l.get(null);else{l=new Map,ar.set(t,l);for(var a=t.querySelectorAll("link[data-precedence],style[data-precedence]"),r=0;r<a.length;r++){var h=a[r];(h.nodeName==="LINK"||h.getAttribute("media")!=="not all")&&(l.set(h.dataset.precedence,h),i=h)}i&&l.set(null,i)}a=e.instance,h=a.getAttribute("data-precedence"),r=l.get(h)||i,r===i&&l.set(null,a),l.set(h,a),this.count++,i=ir.bind(this),a.addEventListener("load",i),a.addEventListener("error",i),r?r.parentNode.insertBefore(a,r.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(a,t.firstChild)),e.state.loading|=4}}var Na={$$typeof:L,Provider:null,Consumer:null,_currentValue:dt,_currentValue2:dt,_threadCount:0};function ex(t,e,l,i,a,r,h,m){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Xr(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Xr(0),this.hiddenUpdates=Xr(null),this.identifierPrefix=i,this.onUncaughtError=a,this.onCaughtError=r,this.onRecoverableError=h,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=m,this.incompleteTransitions=new Map}function km(t,e,l,i,a,r,h,m,b,C,U,G){return t=new ex(t,e,l,h,m,b,C,G),e=1,r===!0&&(e|=24),r=Le(3,null,null,e),t.current=r,r.stateNode=t,e=Do(),e.refCount++,t.pooledCache=e,e.refCount++,r.memoizedState={element:i,isDehydrated:l,cache:e},ko(r),t}function Nm(t){return t?(t=ai,t):ai}function Bm(t,e,l,i,a,r){a=Nm(a),i.context===null?i.context=a:i.pendingContext=a,i=Fl(e),i.payload={element:l},r=r===void 0?null:r,r!==null&&(i.callback=r),l=Jl(t,i,e),l!==null&&(Ge(l,t,e),da(l,t,e))}function Um(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var l=t.retryLane;t.retryLane=l!==0&&l<e?l:e}}function Js(t,e){Um(t,e),(t=t.alternate)&&Um(t,e)}function Lm(t){if(t.tag===13){var e=ii(t,67108864);e!==null&&Ge(e,t,67108864),Js(t,67108864)}}var ur=!0;function lx(t,e,l,i){var a=M.T;M.T=null;var r=I.p;try{I.p=2,Is(t,e,l,i)}finally{I.p=r,M.T=a}}function nx(t,e,l,i){var a=M.T;M.T=null;var r=I.p;try{I.p=8,Is(t,e,l,i)}finally{I.p=r,M.T=a}}function Is(t,e,l,i){if(ur){var a=Ps(i);if(a===null)Ls(t,e,i,rr,l),qm(t,i);else if(ax(a,t,e,l,i))i.stopPropagation();else if(qm(t,i),e&4&&-1<ix.indexOf(t)){for(;a!==null;){var r=Qn(a);if(r!==null)switch(r.tag){case 3:if(r=r.stateNode,r.current.memoizedState.isDehydrated){var h=wl(r.pendingLanes);if(h!==0){var m=r;for(m.pendingLanes|=2,m.entangledLanes|=2;h;){var b=1<<31-Zt(h);m.entanglements[1]|=b,h&=~b}pl(r),(qt&6)===0&&(Gu=Qe()+500,Ca(0))}}break;case 13:m=ii(r,2),m!==null&&Ge(m,r,2),Qu(),Js(r,2)}if(r=Ps(i),r===null&&Ls(t,e,i,rr,l),r===a)break;a=r}a!==null&&i.stopPropagation()}else Ls(t,e,i,null,l)}}function Ps(t){return t=no(t),tc(t)}var rr=null;function tc(t){if(rr=null,t=Xn(t),t!==null){var e=c(t);if(e===null)t=null;else{var l=e.tag;if(l===13){if(t=g(e),t!==null)return t;t=null}else if(l===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null)}}return rr=t,null}function Hm(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(ef()){case Xi:return 2;case $:return 8;case _:case q:return 32;case ut:return 268435456;default:return 32}default:return 32}}var ec=!1,fn=null,dn=null,hn=null,Ba=new Map,Ua=new Map,mn=[],ix="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function qm(t,e){switch(t){case"focusin":case"focusout":fn=null;break;case"dragenter":case"dragleave":dn=null;break;case"mouseover":case"mouseout":hn=null;break;case"pointerover":case"pointerout":Ba.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ua.delete(e.pointerId)}}function La(t,e,l,i,a,r){return t===null||t.nativeEvent!==r?(t={blockedOn:e,domEventName:l,eventSystemFlags:i,nativeEvent:r,targetContainers:[a]},e!==null&&(e=Qn(e),e!==null&&Lm(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,a!==null&&e.indexOf(a)===-1&&e.push(a),t)}function ax(t,e,l,i,a){switch(e){case"focusin":return fn=La(fn,t,e,l,i,a),!0;case"dragenter":return dn=La(dn,t,e,l,i,a),!0;case"mouseover":return hn=La(hn,t,e,l,i,a),!0;case"pointerover":var r=a.pointerId;return Ba.set(r,La(Ba.get(r)||null,t,e,l,i,a)),!0;case"gotpointercapture":return r=a.pointerId,Ua.set(r,La(Ua.get(r)||null,t,e,l,i,a)),!0}return!1}function Vm(t){var e=Xn(t.target);if(e!==null){var l=c(e);if(l!==null){if(e=l.tag,e===13){if(e=g(l),e!==null){t.blockedOn=e,I0(t.priority,function(){if(l.tag===13){var i=Ye();i=Qr(i);var a=ii(l,i);a!==null&&Ge(a,l,i),Js(l,i)}});return}}else if(e===3&&l.stateNode.current.memoizedState.isDehydrated){t.blockedOn=l.tag===3?l.stateNode.containerInfo:null;return}}}t.blockedOn=null}function or(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var l=Ps(t.nativeEvent);if(l===null){l=t.nativeEvent;var i=new l.constructor(l.type,l);lo=i,l.target.dispatchEvent(i),lo=null}else return e=Qn(l),e!==null&&Lm(e),t.blockedOn=l,!1;e.shift()}return!0}function Ym(t,e,l){or(t)&&l.delete(e)}function ux(){ec=!1,fn!==null&&or(fn)&&(fn=null),dn!==null&&or(dn)&&(dn=null),hn!==null&&or(hn)&&(hn=null),Ba.forEach(Ym),Ua.forEach(Ym)}function sr(t,e){t.blockedOn===e&&(t.blockedOn=null,ec||(ec=!0,n.unstable_scheduleCallback(n.unstable_NormalPriority,ux)))}var cr=null;function Gm(t){cr!==t&&(cr=t,n.unstable_scheduleCallback(n.unstable_NormalPriority,function(){cr===t&&(cr=null);for(var e=0;e<t.length;e+=3){var l=t[e],i=t[e+1],a=t[e+2];if(typeof i!="function"){if(tc(i||l)===null)continue;break}var r=Qn(l);r!==null&&(t.splice(e,3),e-=3,ts(r,{pending:!0,data:a,method:l.method,action:i},i,a))}}))}function Ha(t){function e(b){return sr(b,t)}fn!==null&&sr(fn,t),dn!==null&&sr(dn,t),hn!==null&&sr(hn,t),Ba.forEach(e),Ua.forEach(e);for(var l=0;l<mn.length;l++){var i=mn[l];i.blockedOn===t&&(i.blockedOn=null)}for(;0<mn.length&&(l=mn[0],l.blockedOn===null);)Vm(l),l.blockedOn===null&&mn.shift();if(l=(t.ownerDocument||t).$$reactFormReplay,l!=null)for(i=0;i<l.length;i+=3){var a=l[i],r=l[i+1],h=a[De]||null;if(typeof r=="function")h||Gm(l);else if(h){var m=null;if(r&&r.hasAttribute("formAction")){if(a=r,h=r[De]||null)m=h.formAction;else if(tc(a)!==null)continue}else m=h.action;typeof m=="function"?l[i+1]=m:(l.splice(i,3),i-=3),Gm(l)}}}function lc(t){this._internalRoot=t}fr.prototype.render=lc.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(s(409));var l=e.current,i=Ye();Bm(l,i,t,e,null,null)},fr.prototype.unmount=lc.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Bm(t.current,2,null,t,null,null),Qu(),e[Gn]=null}};function fr(t){this._internalRoot=t}fr.prototype.unstable_scheduleHydration=function(t){if(t){var e=rf();t={blockedOn:null,target:t,priority:e};for(var l=0;l<mn.length&&e!==0&&e<mn[l].priority;l++);mn.splice(l,0,t),l===0&&Vm(t)}};var Xm=u.version;if(Xm!=="19.1.0")throw Error(s(527,Xm,"19.1.0"));I.findDOMNode=function(t){var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(s(188)):(t=Object.keys(t).join(","),Error(s(268,t)));return t=x(e),t=t!==null?p(t):null,t=t===null?null:t.stateNode,t};var rx={bundleType:0,version:"19.1.0",rendererPackageName:"react-dom",currentDispatcherRef:M,reconcilerVersion:"19.1.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var dr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!dr.isDisabled&&dr.supportsFiber)try{ht=dr.inject(rx),Tt=dr}catch{}}return Va.createRoot=function(t,e){if(!f(t))throw Error(s(299));var l=!1,i="",a=rh,r=oh,h=sh,m=null;return e!=null&&(e.unstable_strictMode===!0&&(l=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onUncaughtError!==void 0&&(a=e.onUncaughtError),e.onCaughtError!==void 0&&(r=e.onCaughtError),e.onRecoverableError!==void 0&&(h=e.onRecoverableError),e.unstable_transitionCallbacks!==void 0&&(m=e.unstable_transitionCallbacks)),e=km(t,1,!1,null,null,l,i,a,r,h,m,null),t[Gn]=e.current,Us(t),new lc(e)},Va.hydrateRoot=function(t,e,l){if(!f(t))throw Error(s(299));var i=!1,a="",r=rh,h=oh,m=sh,b=null,C=null;return l!=null&&(l.unstable_strictMode===!0&&(i=!0),l.identifierPrefix!==void 0&&(a=l.identifierPrefix),l.onUncaughtError!==void 0&&(r=l.onUncaughtError),l.onCaughtError!==void 0&&(h=l.onCaughtError),l.onRecoverableError!==void 0&&(m=l.onRecoverableError),l.unstable_transitionCallbacks!==void 0&&(b=l.unstable_transitionCallbacks),l.formState!==void 0&&(C=l.formState)),e=km(t,1,!0,e,l??null,i,a,r,h,m,b,C),e.context=Nm(null),l=e.current,i=Ye(),i=Qr(i),a=Fl(i),a.callback=null,Jl(l,a,i),l=i,e.current.lanes=l,Qi(e,l),pl(e),t[Gn]=e.current,Us(t),new fr(e)},Va.version="19.1.0",Va}var eg;function xx(){if(eg)return ac.exports;eg=1;function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(u){console.error(u)}}return n(),ac.exports=px(),ac.exports}var bx=xx();const vx={colors:{primary:"#3498db",secondary:"#2c3e50",danger:"#e74c3c",partsPalette:["#3498db","#e74c3c","#2ecc71","#f39c12","#9b59b6","#1abc9c","#34495e","#e67e22","#16a085","#8e44ad","#d35400","#27ae60"]}},Yl={woodTypes:[{id:"pine",name:"Borovica",isDefault:!0},{id:"oak",name:"Dub"},{id:"beech",name:"Buk"},{id:"birch",name:"Breza"},{id:"spruce",name:"Smrek"},{id:"maple",name:"Javor"}],defaultWoodType:"pine",defaultBoard:{width:2800,height:2070},material:{thickness:18}},Sx={constraints:{minWidth:1,maxWidth:1e4,minHeight:1,maxHeight:1e4,minQuantity:1,maxQuantity:999},defaults:{quantity:1,cornerRadius:5},frame:{defaultFrameWidth:70}},$x={sheet:{maxPreviewWidth:600,maxPreviewHeight:400,gridSize:100,backgroundColor:"#f8f9fa",borderColor:"#2c3e50",gridColor:"#e1e8ed"},parts:{strokeWidth:{normal:1},text:{color:"white"}},blocks:{borderColor:"#FF0000",borderWidth:6,innerBorderColor:"#FF0000",innerBorderWidth:2,opacity:1},rotation:{standard:90},formatting:{decimalPlaces:1,unitConversion:{mmToM2:1e6}}},Rt={branding:vx,material:Yl,parts:Sx,visualization:$x},zr={quantity:Rt.parts.defaults.quantity,cornerValue:Rt.parts.defaults.cornerRadius},be=Rt.parts.constraints,Vl={standardWidth:Rt.material.defaultBoard.width,standardHeight:Rt.material.defaultBoard.height},Sl={maxPreviewDimension:400,defaultPadding:40,strokeWidth:2,cornerIndicatorRadius:4,colors:{originalOutline:"#bdc3c7",modifiedStroke:Rt.branding.colors.primary,modifiedFill:"#e8f4fd",cornerIndicator:Rt.branding.colors.danger},dashArray:{dashed:"5,5",solid:"none"}},he={maxPreviewWidth:Rt.visualization.sheet.maxPreviewWidth,maxPreviewHeight:Rt.visualization.sheet.maxPreviewHeight,gridSize:Rt.visualization.sheet.gridSize,strokeWidth:{sheet:2,grid:1},colors:{sheetBackground:Rt.visualization.sheet.backgroundColor,sheetBorder:Rt.visualization.sheet.borderColor,gridLines:Rt.visualization.sheet.gridColor,dimensionText:Rt.branding.colors.secondary},partColors:Rt.branding.colors.partsPalette,fontSize:{dimensions:14},spacing:{dimensionOffset:20}},br=new Map,ki=n=>{if(n.includes("_frame_")){const u=n.match(/^(.*?)_frame_.*?(-\d+)*$/);if(u)return u[1]}if(n.startsWith("block-")){const u=n.match(/^block-(\d+)-/);if(u)return`block-${u[1]}`}if(n.startsWith("subblock-")){const u=n.match(/^subblock-(\d+)-/);if(u)return`block-${u[1]}`}return n.replace(/-\d+(-\d+)*$/,"")},wx=n=>{let u=0;for(let o=0;o<n.length;o++){const s=n.charCodeAt(o);u=(u<<5)-u+s,u=u&u}return Math.abs(u)},Ri=(n,u)=>{let o;if(n.includes("_frame_")?o=`frame_${n.replace(/-\d+$/,"")}`:u!=null&&u.blockId&&u.blockId>0?o=`block-${u.blockId}`:o=`part-${ki(n)}`,br.has(o))return br.get(o);const f=wx(o)%he.partColors.length,c=he.partColors[f];return br.set(o,c),c},$c=()=>{br.clear()},Ex=(n,u,o,s,f)=>{if(!o.enabled)return[];const c=o.width||Rt.parts.frame.defaultFrameWidth,g=n-2*c,y=u-2*c;if(g<=0||y<=0)throw new Error("Frame width is too large for the given dimensions");const x=[],p=f||`Diel ${n}×${u}`;switch(o.type){case"type1":x.push({id:`${s}_frame_top`,width:n,height:c,quantity:1,label:`${p} - Top`,orientation:"fixed",grainDirection:"horizontal",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"top"},{id:`${s}_frame_bottom`,width:n,height:c,quantity:1,label:`${p} - Bottom`,orientation:"fixed",grainDirection:"horizontal",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"bottom"},{id:`${s}_frame_left`,width:y,height:c,quantity:1,label:`${p} - Left`,orientation:"fixed",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"left"},{id:`${s}_frame_right`,width:y,height:c,quantity:1,label:`${p} - Right`,orientation:"fixed",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"right"});break;case"type2":x.push({id:`${s}_frame_top`,width:n,height:c,quantity:1,label:`${p} - Top`,orientation:"rotatable",grainDirection:"horizontal",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"top"},{id:`${s}_frame_bottom`,width:n,height:c,quantity:1,label:`${p} - Bottom`,orientation:"rotatable",grainDirection:"horizontal",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"bottom"},{id:`${s}_frame_left`,width:c,height:y,quantity:1,label:`${p} - Left`,orientation:"rotatable",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"left"},{id:`${s}_frame_right`,width:c,height:y,quantity:1,label:`${p} - Right`,orientation:"rotatable",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"right"});break;case"type3":x.push({id:`${s}_frame_top`,width:g,height:c,quantity:1,label:`${p} - Top`,orientation:"rotatable",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"top"},{id:`${s}_frame_bottom`,width:g,height:c,quantity:1,label:`${p} - Bottom`,orientation:"rotatable",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"bottom"},{id:`${s}_frame_left`,width:c,height:u,quantity:1,label:`${p} - Left`,orientation:"rotatable",grainDirection:"horizontal",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"left"},{id:`${s}_frame_right`,width:c,height:u,quantity:1,label:`${p} - Right`,orientation:"rotatable",grainDirection:"horizontal",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"right"});break;case"type4":x.push({id:`${s}_frame_top`,width:g,height:c,quantity:1,label:`${p} - Top`,orientation:"rotatable",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"top"},{id:`${s}_frame_bottom`,width:g,height:c,quantity:1,label:`${p} - Bottom`,orientation:"rotatable",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"bottom"},{id:`${s}_frame_left`,width:c,height:u,quantity:1,label:`${p} - Left`,orientation:"rotatable",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"left"},{id:`${s}_frame_right`,width:c,height:u,quantity:1,label:`${p} - Right`,orientation:"rotatable",grainDirection:"vertical",isFramePiece:!0,originalPartId:s,frameType:o.type,pieceType:"right"});break;default:throw new Error(`Unknown frame type: ${o.type}`)}return x},Tx=(n,u,o)=>{const s=o.width||Rt.parts.frame.defaultFrameWidth,f=n-2*s,c=u-2*s;switch(o.type){case"type1":return{top:{width:n,height:s},bottom:{width:n,height:s},left:{width:s,height:c},right:{width:s,height:c}};case"type2":return{top:{width:n,height:s},bottom:{width:n,height:s},left:{width:s,height:c},right:{width:s,height:c}};case"type3":return{top:{width:f,height:s},bottom:{width:f,height:s},left:{width:s,height:u},right:{width:s,height:u}};case"type4":return{top:{width:f,height:s},bottom:{width:f,height:s},left:{width:s,height:u},right:{width:s,height:u}};default:throw new Error(`Unknown frame type: ${o.type}`)}},zx=()=>({enabled:!1,type:"type1",width:Rt.parts.frame.defaultFrameWidth,grainDirection:"horizontal"}),jx=n=>$t.useMemo(()=>{const o=[],s=new Map,f=[];n.forEach(x=>{var p;if((p=x.frame)!=null&&p.enabled)try{Ex(x.width,x.height,x.frame,x.id,x.label).forEach(z=>{for(let j=0;j<x.quantity;j++){const H=`${z.id}-${j}`;o.push({id:H,width:z.width,height:z.height,quantity:1,label:z.label,orientation:z.orientation,grainDirection:z.grainDirection,woodType:x.woodType,originalPartId:x.id})}})}catch(v){console.error("Error calculating frame pieces:",v),f.push(x)}else x.blockId&&x.blockId>0?(s.has(x.blockId)||s.set(x.blockId,[]),s.get(x.blockId).push(x)):f.push(x)}),f.forEach(x=>{for(let p=0;p<x.quantity;p++)o.push({id:`${x.id}-${p}`,width:x.width,height:x.height,quantity:1,label:x.label,orientation:x.orientation||"rotatable",woodType:x.woodType,originalPartId:x.id})}),s.forEach((x,p)=>{const v=x.reduce((H,tt)=>H+tt.width*tt.quantity,0),z=Math.max(...x.map(H=>H.height));let j=0;x.forEach(H=>{for(let tt=0;tt<H.quantity;tt++)o.push({id:`${H.id}-${tt}`,width:H.width,height:H.height,quantity:1,label:H.label,orientation:H.orientation||"rotatable",blockId:p,blockPosition:j,blockTotalWidth:v,blockTotalHeight:z,woodType:H.woodType,originalPartId:H.id}),j++})});const c=s.size,g=o.length,y=o.filter(x=>x.blockId).length;return{preparedPieces:o,blockCount:c,totalIndividualPieces:g,blockPieceCount:y}},[n]),Ax=n=>{const u=new Map,o=[];return n.forEach(s=>{s.blockId&&s.blockId>0?(u.has(s.blockId)||u.set(s.blockId,[]),u.get(s.blockId).push(s)):o.push(s)}),o.forEach((s,f)=>{u.set(-(f+1),[s])}),u},jr=n=>{if(n.length===0)return{width:0,height:0};const u=n.reduce((s,f)=>s+f.width,0),o=Math.max(...n.map(s=>s.height));return{width:u,height:o}},wc=(n,u,o)=>{const{width:s,height:f}=jr(n);return s<=u&&f<=o},Cx=(n,u,o,s)=>{if(n.length===0)return[];const f=[];let c=[],g=0;for(const y of n)if(g+y.width>u&&c.length>0){const{width:x,height:p}=jr(c);f.push({blockId:s,parts:[...c],totalWidth:x,totalHeight:p,canFitOnSingleBoard:wc(c,u,o)}),c=[y],g=y.width}else c.push(y),g+=y.width;if(c.length>0){const{width:y,height:x}=jr(c);f.push({blockId:s,parts:c,totalWidth:y,totalHeight:x,canFitOnSingleBoard:wc(c,u,o)})}return f},_x=(n,u,o)=>{const s=Ax(n),f=[];return s.forEach((c,g)=>{const{width:y,height:x}=jr(c),p=wc(c,u,o);if(p||c.length===1)f.push({blockId:g,parts:c,totalWidth:y,totalHeight:x,canFitOnSingleBoard:p});else{const v=Cx(c,u,o,g);f.push({blockId:g,parts:c,totalWidth:y,totalHeight:x,canFitOnSingleBoard:!1,subBlocks:v})}}),f},Gg=n=>{const u=new Set;n.forEach(c=>{c.blockId&&c.blockId>0&&u.add(c.blockId)});const o=u.size>0?Math.max(...u):0,s=Math.max(5,o+3),f=[];for(let c=1;c<=s;c++)f.push(c);return f},Dx=n=>{const u=[];return n.forEach(o=>{for(let s=0;s<o.quantity;s++)u.push({...o,id:`${o.id}-${s}`,quantity:1})}),u},Mx=n=>[...n].sort((u,o)=>Number(o.width)*Number(o.height)-Number(u.width)*Number(u.height)),sc=(n,u,o,s,f,c)=>{for(const g of f){const y=g.rotation===90?Number(g.part.height):Number(g.part.width),x=g.rotation===90?Number(g.part.width):Number(g.part.height);if(!(n>=g.x+y+c||g.x>=n+o+c||u>=g.y+x+c||g.y>=u+s+c))return!0}return!1},Rx=(n,u,o,s,f=10)=>{const{sheetWidth:c,sheetHeight:g,placedParts:y}=n;for(let x=0;x<=g-o;x+=f)for(let p=0;p<=c-u;p+=f)if(!sc(p,x,u,o,y,s)){let v=!1,z=!1;if(x>0){for(let j=x-f;j>=0;j-=f)if(!sc(p,j,u,o,y,s)){v=!0;break}}if(p>0&&!v){for(let j=p-f;j>=0;j-=f)if(!sc(j,x,u,o,y,s)){z=!0;break}}if(!v&&!z)return{x:p,y:x}}return null},Ox=n=>{const u=[];return n.grainDirection==="vertical"?u.push({width:Number(n.height),height:Number(n.width),rotation:90}):u.push({width:Number(n.width),height:Number(n.height),rotation:0}),n.width!==n.height&&n.orientation==="rotatable"&&!n.grainDirection&&u.push({width:Number(n.height),height:Number(n.width),rotation:90}),u},kx=(n,u,o,s=10)=>{const f=Ox(u);let c=null;for(const g of f){const y=Rx(n,g.width,g.height,o,s);y&&(!c||y.y<c.y||y.y===c.y&&y.x<c.x)&&(c={x:y.x,y:y.y,rotation:g.rotation,width:g.width,height:g.height})}return c},Nx=n=>n.placedParts.reduce((o,s)=>o+Number(s.part.width)*Number(s.part.height),0)/(n.sheetWidth*n.sheetHeight),Bx=n=>{const u=n.reduce((s,f)=>s+f.placedParts.reduce((c,g)=>c+Number(g.part.width)*Number(g.part.height),0),0),o=n.reduce((s,f)=>s+f.sheetWidth*f.sheetHeight,0);return o>0?u/o:0},Ux=(n,u,o)=>({...n,placedParts:[...n.placedParts,{part:u,x:o.x,y:o.y,rotation:o.rotation}]}),Lx=(n,u,o)=>({sheetNumber:n,sheetWidth:u,sheetHeight:o,placedParts:[],efficiency:0}),Lc={sheetWidth:2800,sheetHeight:2070,gap:1,stepSize:10,enableLogging:!0},Xg={log:n=>console.log(n),warn:n=>console.warn(n)},Hx={log:()=>{},warn:()=>{}},qx=(n,u=Lc,o=Xg)=>{const{sheetWidth:s,sheetHeight:f,gap:c,stepSize:g,enableLogging:y}=u,x=y?o.log:()=>{},p=y?o.warn:()=>{},v=Dx(n),z=Mx(v);x("🔧 Advanced BLF Algorithm for Mixed-Size Parts"),x(`📦 Processing parts: ${z.map(Z=>`${Z.width}×${Z.height}mm`).join(", ")}`),x(`📋 Sheet size: ${s}×${f}mm`);const j=[],H=[],tt=[...z];let k=1;for(;tt.length>0;){x(`
📄 Starting Sheet ${k}`),x(`📊 Remaining parts: ${tt.length}`);let Z=Lx(k,s,f),B=0,L=0;for(;tt.length>0&&L<tt.length;){let P=!1;for(let Q=0;Q<tt.length;Q++){const rt=tt[Q],J=kx(Z,rt,c,g);if(J){Z=Ux(Z,rt,J),x(`✅ Placed ${rt.width}×${rt.height}mm at (${J.x}, ${J.y}) rotation: ${J.rotation}°`),tt.splice(Q,1),B++,P=!0,L=0;break}}P||L++}if(Z.efficiency=Nx(Z),x(`📋 Sheet ${k} completed: ${Z.placedParts.length} parts, ${(Z.efficiency*100).toFixed(1)}% efficiency`),Z.placedParts.length>0&&(j.push(Z),k++),B===0&&tt.length>0){p("⚠️ Some parts cannot fit on any sheet:"),tt.forEach(P=>{p(`  - ${P.width}×${P.height}mm (too large for ${s}×${f}mm sheet)`),H.push(P)});break}}const O=Bx(j);return x(`
🎯 === CUTTING SUMMARY ===`),x(`📄 Total sheets used: ${j.length}`),x(`📦 Total parts placed: ${j.reduce((Z,B)=>Z+B.placedParts.length,0)}`),x(`❌ Unplaced parts: ${H.length}`),x(`⚡ Overall efficiency: ${(O*100).toFixed(1)}%`),{sheets:j,totalSheets:j.length,overallEfficiency:O,unplacedParts:H}},Vx=(n,u=Lc,o=Xg)=>{const{sheetWidth:s,sheetHeight:f,enableLogging:c}=u,g=c?o.log:()=>{};g("🔧 Advanced BLF Algorithm with Block Support and Wood Type Grouping"),g(`📦 Processing ${n.length} parts with potential blocks`),g(`📋 Sheet size: ${s}×${f}mm`);const y=new Map;n.forEach(Z=>{const B=Z.woodType||"default";y.has(B)||y.set(B,[]),y.get(B).push(Z)}),g(`🌳 Found ${y.size} different wood types:`),y.forEach((Z,B)=>{g(`  - ${B}: ${Z.length} parts`)});const x=[],p=[],v=[],z=[];let j=1;y.forEach((Z,B)=>{g(`
🌳 Processing wood type: ${B} (${Z.length} parts)`);const L=_x(Z,s,f);g(`📦 Created ${L.length} blocks for ${B}`);const P=[],Q=new Map,rt=[],J=new Map;Z.forEach(F=>{F.blockId&&F.blockId>0?(Q.has(F.blockId)||Q.set(F.blockId,[]),Q.get(F.blockId).push(F)):rt.push(F)}),Q.forEach((F,K)=>{const V=L.find(lt=>lt.blockId===K);if(V)if(V.canFitOnSingleBoard){const lt=`block-composite-${K}`,ct={id:lt,width:V.totalWidth,height:V.totalHeight,quantity:1,label:`Block ${K} (${F.length} parts)`,blockId:K,orientation:"fixed",woodType:B};P.push(ct),J.set(lt,F)}else P.push(...F)}),P.push(...rt);const mt=qx(P,u,o),W=mt.sheets.map(F=>({...F,sheetNumber:j++,placedParts:F.placedParts.flatMap(K=>{if(K.part.id.startsWith("block-composite-")){const V=J.get(K.part.id);if(!V)return[K];let lt=K.x;return V.map(ct=>{const wt={part:ct,x:lt,y:K.y,rotation:K.rotation};return lt+=ct.width,wt})}else return[K]})}));x.push(...W),p.push(...mt.unplacedParts),v.push(...L)});const H=x.reduce((Z,B)=>Z+B.placedParts.reduce((L,P)=>L+Number(P.part.width)*Number(P.part.height),0),0),tt=x.reduce((Z,B)=>Z+B.sheetWidth*B.sheetHeight,0),k=tt>0?H/tt:0,O={sheets:x,totalSheets:x.length,overallEfficiency:k,unplacedParts:p,blocks:v,unplacedBlocks:z};return g(`
🎯 === WOOD TYPE GROUPED CUTTING SUMMARY ===`),g(`📄 Total sheets used: ${O.sheets.length}`),g(`🌳 Wood types processed: ${y.size}`),g(`📦 Total blocks created: ${v.length}`),g(`❌ Unplaced parts: ${p.length}`),g(`⚡ Overall efficiency: ${(k*100).toFixed(1)}%`),O},Yx=(n,u=Lc)=>$t.useMemo(()=>{if(n.length===0)return{boardLayout:null,isCalculating:!1,placedPieces:[],unplacedPieces:[],totalBoards:0,overallEfficiency:0};try{const s=n.map(y=>({id:y.id,width:y.width,height:y.height,quantity:y.quantity,orientation:y.orientation||"rotatable",grainDirection:y.grainDirection,label:y.label,blockId:y.blockId,woodType:y.woodType})),f=Vx(s,u,Hx),c=[];f.sheets.forEach(y=>{c.push(...y.placedParts)});const g=n.filter(y=>f.unplacedParts.some(x=>x.id===y.id));return{boardLayout:f,isCalculating:!1,placedPieces:c,unplacedPieces:g,totalBoards:f.totalSheets,overallEfficiency:f.overallEfficiency}}catch(s){return console.error("Board placement failed:",s),{boardLayout:null,isCalculating:!1,placedPieces:[],unplacedPieces:n,totalBoards:0,overallEfficiency:0}}},[n,u]),Gx=(n,u)=>{const[o,s]=$t.useState(n);return $t.useEffect(()=>{const f=setTimeout(()=>{s(n)},u);return()=>{clearTimeout(f)}},[n,u]),o},Xx=n=>n.type!=="none"&&n.type!==void 0,Qg=n=>n?Object.values(n).some(u=>Xx(u)):!1,Zg=n=>!!(n&&Object.values(n).some(u=>u!=="none")),Wg=n=>(n==null?void 0:n.enabled)===!0,Kg=n=>(n==null?void 0:n.enabled)===!0,Qx=(n,u,o,s)=>Qg(n)||Zg(u)||Wg(o)||Kg(s),Zx=()=>{const[n,u]=$t.useState([]),[o,s]=$t.useState({}),[f,c]=$t.useState([]),g=$t.useMemo(()=>n.map(W=>{const F=o[W.id]||{},K=Qg(F.corners),V=Zg(F.edges),lt=Wg(F.lShape),ct=Kg(F.frame),wt=Qx(F.corners,F.edges,F.lShape,F.frame);return{...W,...F,hasCornerModifications:K,hasEdgeTreatments:V,isLShape:lt,isFrame:ct,hasAdvancedConfig:wt}}),[n,o]),y=Gx(g,300),x=jx(y),p=Yx(x.preparedPieces),v=$t.useMemo(()=>({sheetLayout:p.boardLayout,isCalculating:p.isCalculating}),[p.boardLayout,p.isCalculating]),z=$t.useCallback(W=>{const F=`part-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,K={...W,id:F,woodType:W.woodType||Yl.defaultWoodType,color:Ri(F,{blockId:W.blockId,width:W.width,height:W.height})};u(V=>[...V,K])},[]);$t.useEffect(()=>{if(n.filter(F=>!F.color).length>0){const F=n.map(K=>K.color?K:{...K,color:Ri(K.id,{blockId:K.blockId,width:K.width,height:K.height})});u(F)}},[n]),$t.useEffect(()=>{const W=new Map;n.forEach(V=>{V.blockId&&(W.has(V.blockId)||W.set(V.blockId,[]),W.get(V.blockId).push(V))});let F=!1;const K=[...n];W.forEach((V,lt)=>{if(V.length>1){const ct=Ri("",{blockId:lt});V.some(M=>M.color!==ct)&&(F=!0,V.forEach(M=>{const I=K.findIndex(dt=>dt.id===M.id);I!==-1&&(K[I]={...K[I],color:ct})}))}}),F&&u(K)},[n]);const j=$t.useCallback((W,F)=>{u(K=>K.map(V=>{if(V.id===W){const lt={...V,...F};return"blockId"in F&&(lt.color=Ri(V.id,{blockId:lt.blockId,width:lt.width,height:lt.height}),lt.blockId&&!f.find(ct=>ct.blockId===lt.blockId)&&c(ct=>[...ct,{blockId:lt.blockId,woodType:Yl.defaultWoodType}])),lt}return V}))},[f]),H=$t.useCallback((W,F)=>{u(K=>K.map(V=>V.id===W?{...V,woodType:F}:V))},[]),tt=$t.useCallback(W=>{u(F=>F.filter(K=>K.id!==W)),s(F=>{const{[W]:K,...V}=F;return V}),$c()},[]),k=$t.useCallback(()=>{u([]),s({}),$c()},[]),O=$t.useCallback((W,F)=>{s(K=>({...K,[W]:{...K[W],...F}}))},[]),Z=$t.useCallback((W,F,K)=>{s(V=>{var M;const lt=((M=V[W])==null?void 0:M.edges)||{top:"none",right:"none",bottom:"none",left:"none"},wt=["top","right","bottom","left"][F];return{...V,[W]:{...V[W],edges:{...lt,[wt]:K}}}})},[]),B=$t.useCallback((W,F,K)=>{s(V=>{var M;const lt=((M=V[W])==null?void 0:M.corners)||{topLeft:{type:"none"},topRight:{type:"none"},bottomRight:{type:"none"},bottomLeft:{type:"none"}},wt=["topLeft","topRight","bottomRight","bottomLeft"][F];return{...V,[W]:{...V[W],corners:{...lt,[wt]:K}}}})},[]),L=$t.useCallback((W,F)=>{s(K=>{var V;return{...K,[W]:{...K[W],lShape:{enabled:!1,...(V=K[W])==null?void 0:V.lShape,...F}}}})},[]),P=$t.useCallback(()=>n,[n]),Q=$t.useCallback(()=>o,[o]),rt=$t.useCallback(W=>{var M;const F=n.find(I=>I.id===W);if(!F)return null;const K=o[W]||{},V=K.corners&&Object.values(K.corners).some(I=>I!==null),lt=K.edges&&Object.values(K.edges).some(I=>I!=="none"),ct=((M=K.lShape)==null?void 0:M.enabled)===!0;return{...F,...K,hasCornerModifications:V,hasEdgeTreatments:lt,isLShape:ct,hasAdvancedConfig:V||lt||ct}},[n,o]),J=$t.useMemo(()=>n.reduce((W,F)=>W+F.width*F.height*F.quantity,0),[n]),mt=$t.useMemo(()=>n.reduce((F,K)=>F+Number(K.quantity),0),[n]);return{basicParts:n,addDimensionalPart:z,updateDimensionalPart:j,removeDimensionalPart:tt,clearAllParts:k,blockPreparation:x,boardPlacement:p,updateVisualEnhancements:O,updatePartEdge:Z,updatePartCorner:B,updatePartLShape:L,updatePartWoodType:H,blockConfigs:f,updateBlockWoodType:(W,F)=>{c(K=>{const V=K.findIndex(lt=>lt.blockId===W);return V>=0?K.map((lt,ct)=>ct===V?{...lt,woodType:F}:lt):[...K,{blockId:W,woodType:F}]})},getBlockWoodType:W=>{const F=f.find(K=>K.blockId===W);return F?F.woodType:Yl.defaultWoodType},enhancedParts:g,getEnhancedPartById:rt,getDimensionalPartsOnly:P,getBlockPreparationOnly:()=>x,getBoardPlacementOnly:()=>p,getVisualEnhancementsOnly:Q,totalCuttingArea:J,totalPartCount:mt,optimizedLayout:v}},Wx=(n,u)=>{const o=n.filter(f=>f.blockId===u);if(o.length===0)return null;const s=o.reduce((f,c)=>f+c.width*c.quantity,0);return s>Vl.standardWidth?`Blok ${u} je príliš široký (${s}mm > ${Vl.standardWidth}mm)`:null},Kx=n=>{const u=Fx(n);for(const[,o]of u.entries())if(Jx(o)>Vl.standardWidth||[...new Set(o.map(c=>c.woodType))].length>1)return!0;return!1},Fx=n=>{const u=new Map;return n.forEach(o=>{o.blockId&&o.blockId>0&&(u.has(o.blockId)||u.set(o.blockId,[]),u.get(o.blockId).push(o))}),u},Jx=n=>n.reduce((u,o)=>u+o.width*o.quantity,0),Ix=(n,u)=>{const o=n.filter(f=>f.blockId===u);if(o.length<=1)return null;const s=[...new Set(o.map(f=>f.woodType))];return s.length>1?`Blok ${u} obsahuje rôzne typy dreva (${s.join(", ")}). Všetky diely v bloku musia mať rovnaký typ dreva.`:null},Px={top:0,right:1,bottom:2,left:3},tb={topLeft:0,topRight:1,bottomRight:2,bottomLeft:3},eb=n=>{const{width:u,height:o,quantity:s,orientation:f,label:c,...g}=n,y={};return u!==void 0&&(y.width=u),o!==void 0&&(y.height=o),s!==void 0&&(y.quantity=s),f!==void 0&&(y.orientation=f),c!==void 0&&(y.label=c),{cuttingUpdates:y,visualUpdates:g}},lb=n=>Object.entries(n).map(([u,o])=>({edgeIndex:Px[u],value:o})).filter(({edgeIndex:u})=>u!==void 0),nb=n=>Object.entries(n).map(([u,o])=>({cornerIndex:tb[u],cornerData:o})).filter(({cornerIndex:u})=>u!==void 0),ib=(n,u)=>({updateWidth:o=>{u(n.id,{width:o})},updateHeight:o=>{u(n.id,{height:o})},updateQuantity:o=>{u(n.id,{quantity:o})},updateLabel:o=>{u(n.id,{label:o})},updateOrientation:o=>{u(n.id,{orientation:o})},handleEdgeUpdate:(o,s)=>{const c={...n.edges||{top:"none",right:"none",bottom:"none",left:"none"},[o]:s};u(n.id,{edges:c})},handleCornerUpdate:(o,s)=>{const f=n.corners||{topLeft:{type:"none"},topRight:{type:"none"},bottomRight:{type:"none"},bottomLeft:{type:"none"}},c=f[o]||{type:"none"},g={type:s.type||c.type||"none",...s.x!==void 0&&{x:s.x},...s.y!==void 0&&{y:s.y},...s.edgeType&&{edgeType:s.edgeType},...c.x!==void 0&&s.x===void 0&&{x:c.x},...c.y!==void 0&&s.y===void 0&&{y:c.y},...c.edgeType&&!s.edgeType&&{edgeType:c.edgeType}},y={...f,[o]:g};u(n.id,{corners:y})}});var Be=function(){return Be=Object.assign||function(u){for(var o,s=1,f=arguments.length;s<f;s++){o=arguments[s];for(var c in o)Object.prototype.hasOwnProperty.call(o,c)&&(u[c]=o[c])}return u},Be.apply(this,arguments)};function Ja(n,u,o){if(o||arguments.length===2)for(var s=0,f=u.length,c;s<f;s++)(c||!(s in u))&&(c||(c=Array.prototype.slice.call(u,0,s)),c[s]=u[s]);return n.concat(c||Array.prototype.slice.call(u))}var Kt="-ms-",Wa="-moz-",Lt="-webkit-",Fg="comm",Nr="rule",Hc="decl",ab="@import",Jg="@keyframes",ub="@layer",Ig=Math.abs,qc=String.fromCharCode,Ec=Object.assign;function rb(n,u){return xe(n,0)^45?(((u<<2^xe(n,0))<<2^xe(n,1))<<2^xe(n,2))<<2^xe(n,3):0}function Pg(n){return n.trim()}function Hl(n,u){return(n=u.exec(n))?n[0]:n}function At(n,u,o){return n.replace(u,o)}function vr(n,u,o){return n.indexOf(u,o)}function xe(n,u){return n.charCodeAt(u)|0}function Ni(n,u,o){return n.slice(u,o)}function bl(n){return n.length}function t0(n){return n.length}function Qa(n,u){return u.push(n),n}function ob(n,u){return n.map(u).join("")}function lg(n,u){return n.filter(function(o){return!Hl(o,u)})}var Br=1,Bi=1,e0=0,ll=0,se=0,Yi="";function Ur(n,u,o,s,f,c,g,y){return{value:n,root:u,parent:o,type:s,props:f,children:c,line:Br,column:Bi,length:g,return:"",siblings:y}}function pn(n,u){return Ec(Ur("",null,null,"",null,null,0,n.siblings),n,{length:-n.length},u)}function Ci(n){for(;n.root;)n=pn(n.root,{children:[n]});Qa(n,n.siblings)}function sb(){return se}function cb(){return se=ll>0?xe(Yi,--ll):0,Bi--,se===10&&(Bi=1,Br--),se}function fl(){return se=ll<e0?xe(Yi,ll++):0,Bi++,se===10&&(Bi=1,Br++),se}function Hn(){return xe(Yi,ll)}function Sr(){return ll}function Lr(n,u){return Ni(Yi,n,u)}function Tc(n){switch(n){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function fb(n){return Br=Bi=1,e0=bl(Yi=n),ll=0,[]}function db(n){return Yi="",n}function cc(n){return Pg(Lr(ll-1,zc(n===91?n+2:n===40?n+1:n)))}function hb(n){for(;(se=Hn())&&se<33;)fl();return Tc(n)>2||Tc(se)>3?"":" "}function mb(n,u){for(;--u&&fl()&&!(se<48||se>102||se>57&&se<65||se>70&&se<97););return Lr(n,Sr()+(u<6&&Hn()==32&&fl()==32))}function zc(n){for(;fl();)switch(se){case n:return ll;case 34:case 39:n!==34&&n!==39&&zc(se);break;case 40:n===41&&zc(n);break;case 92:fl();break}return ll}function gb(n,u){for(;fl()&&n+se!==57;)if(n+se===84&&Hn()===47)break;return"/*"+Lr(u,ll-1)+"*"+qc(n===47?n:fl())}function yb(n){for(;!Tc(Hn());)fl();return Lr(n,ll)}function pb(n){return db($r("",null,null,null,[""],n=fb(n),0,[0],n))}function $r(n,u,o,s,f,c,g,y,x){for(var p=0,v=0,z=g,j=0,H=0,tt=0,k=1,O=1,Z=1,B=0,L="",P=f,Q=c,rt=s,J=L;O;)switch(tt=B,B=fl()){case 40:if(tt!=108&&xe(J,z-1)==58){vr(J+=At(cc(B),"&","&\f"),"&\f",Ig(p?y[p-1]:0))!=-1&&(Z=-1);break}case 34:case 39:case 91:J+=cc(B);break;case 9:case 10:case 13:case 32:J+=hb(tt);break;case 92:J+=mb(Sr()-1,7);continue;case 47:switch(Hn()){case 42:case 47:Qa(xb(gb(fl(),Sr()),u,o,x),x);break;default:J+="/"}break;case 123*k:y[p++]=bl(J)*Z;case 125*k:case 59:case 0:switch(B){case 0:case 125:O=0;case 59+v:Z==-1&&(J=At(J,/\f/g,"")),H>0&&bl(J)-z&&Qa(H>32?ig(J+";",s,o,z-1,x):ig(At(J," ","")+";",s,o,z-2,x),x);break;case 59:J+=";";default:if(Qa(rt=ng(J,u,o,p,v,f,y,L,P=[],Q=[],z,c),c),B===123)if(v===0)$r(J,u,rt,rt,P,c,z,y,Q);else switch(j===99&&xe(J,3)===110?100:j){case 100:case 108:case 109:case 115:$r(n,rt,rt,s&&Qa(ng(n,rt,rt,0,0,f,y,L,f,P=[],z,Q),Q),f,Q,z,y,s?P:Q);break;default:$r(J,rt,rt,rt,[""],Q,0,y,Q)}}p=v=H=0,k=Z=1,L=J="",z=g;break;case 58:z=1+bl(J),H=tt;default:if(k<1){if(B==123)--k;else if(B==125&&k++==0&&cb()==125)continue}switch(J+=qc(B),B*k){case 38:Z=v>0?1:(J+="\f",-1);break;case 44:y[p++]=(bl(J)-1)*Z,Z=1;break;case 64:Hn()===45&&(J+=cc(fl())),j=Hn(),v=z=bl(L=J+=yb(Sr())),B++;break;case 45:tt===45&&bl(J)==2&&(k=0)}}return c}function ng(n,u,o,s,f,c,g,y,x,p,v,z){for(var j=f-1,H=f===0?c:[""],tt=t0(H),k=0,O=0,Z=0;k<s;++k)for(var B=0,L=Ni(n,j+1,j=Ig(O=g[k])),P=n;B<tt;++B)(P=Pg(O>0?H[B]+" "+L:At(L,/&\f/g,H[B])))&&(x[Z++]=P);return Ur(n,u,o,f===0?Nr:y,x,p,v,z)}function xb(n,u,o,s){return Ur(n,u,o,Fg,qc(sb()),Ni(n,2,-2),0,s)}function ig(n,u,o,s,f){return Ur(n,u,o,Hc,Ni(n,0,s),Ni(n,s+1,-1),s,f)}function l0(n,u,o){switch(rb(n,u)){case 5103:return Lt+"print-"+n+n;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return Lt+n+n;case 4789:return Wa+n+n;case 5349:case 4246:case 4810:case 6968:case 2756:return Lt+n+Wa+n+Kt+n+n;case 5936:switch(xe(n,u+11)){case 114:return Lt+n+Kt+At(n,/[svh]\w+-[tblr]{2}/,"tb")+n;case 108:return Lt+n+Kt+At(n,/[svh]\w+-[tblr]{2}/,"tb-rl")+n;case 45:return Lt+n+Kt+At(n,/[svh]\w+-[tblr]{2}/,"lr")+n}case 6828:case 4268:case 2903:return Lt+n+Kt+n+n;case 6165:return Lt+n+Kt+"flex-"+n+n;case 5187:return Lt+n+At(n,/(\w+).+(:[^]+)/,Lt+"box-$1$2"+Kt+"flex-$1$2")+n;case 5443:return Lt+n+Kt+"flex-item-"+At(n,/flex-|-self/g,"")+(Hl(n,/flex-|baseline/)?"":Kt+"grid-row-"+At(n,/flex-|-self/g,""))+n;case 4675:return Lt+n+Kt+"flex-line-pack"+At(n,/align-content|flex-|-self/g,"")+n;case 5548:return Lt+n+Kt+At(n,"shrink","negative")+n;case 5292:return Lt+n+Kt+At(n,"basis","preferred-size")+n;case 6060:return Lt+"box-"+At(n,"-grow","")+Lt+n+Kt+At(n,"grow","positive")+n;case 4554:return Lt+At(n,/([^-])(transform)/g,"$1"+Lt+"$2")+n;case 6187:return At(At(At(n,/(zoom-|grab)/,Lt+"$1"),/(image-set)/,Lt+"$1"),n,"")+n;case 5495:case 3959:return At(n,/(image-set\([^]*)/,Lt+"$1$`$1");case 4968:return At(At(n,/(.+:)(flex-)?(.*)/,Lt+"box-pack:$3"+Kt+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+Lt+n+n;case 4200:if(!Hl(n,/flex-|baseline/))return Kt+"grid-column-align"+Ni(n,u)+n;break;case 2592:case 3360:return Kt+At(n,"template-","")+n;case 4384:case 3616:return o&&o.some(function(s,f){return u=f,Hl(s.props,/grid-\w+-end/)})?~vr(n+(o=o[u].value),"span",0)?n:Kt+At(n,"-start","")+n+Kt+"grid-row-span:"+(~vr(o,"span",0)?Hl(o,/\d+/):+Hl(o,/\d+/)-+Hl(n,/\d+/))+";":Kt+At(n,"-start","")+n;case 4896:case 4128:return o&&o.some(function(s){return Hl(s.props,/grid-\w+-start/)})?n:Kt+At(At(n,"-end","-span"),"span ","")+n;case 4095:case 3583:case 4068:case 2532:return At(n,/(.+)-inline(.+)/,Lt+"$1$2")+n;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(bl(n)-1-u>6)switch(xe(n,u+1)){case 109:if(xe(n,u+4)!==45)break;case 102:return At(n,/(.+:)(.+)-([^]+)/,"$1"+Lt+"$2-$3$1"+Wa+(xe(n,u+3)==108?"$3":"$2-$3"))+n;case 115:return~vr(n,"stretch",0)?l0(At(n,"stretch","fill-available"),u,o)+n:n}break;case 5152:case 5920:return At(n,/(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/,function(s,f,c,g,y,x,p){return Kt+f+":"+c+p+(g?Kt+f+"-span:"+(y?x:+x-+c)+p:"")+n});case 4949:if(xe(n,u+6)===121)return At(n,":",":"+Lt)+n;break;case 6444:switch(xe(n,xe(n,14)===45?18:11)){case 120:return At(n,/(.+:)([^;\s!]+)(;|(\s+)?!.+)?/,"$1"+Lt+(xe(n,14)===45?"inline-":"")+"box$3$1"+Lt+"$2$3$1"+Kt+"$2box$3")+n;case 100:return At(n,":",":"+Kt)+n}break;case 5719:case 2647:case 2135:case 3927:case 2391:return At(n,"scroll-","scroll-snap-")+n}return n}function Ar(n,u){for(var o="",s=0;s<n.length;s++)o+=u(n[s],s,n,u)||"";return o}function bb(n,u,o,s){switch(n.type){case ub:if(n.children.length)break;case ab:case Hc:return n.return=n.return||n.value;case Fg:return"";case Jg:return n.return=n.value+"{"+Ar(n.children,s)+"}";case Nr:if(!bl(n.value=n.props.join(",")))return""}return bl(o=Ar(n.children,s))?n.return=n.value+"{"+o+"}":""}function vb(n){var u=t0(n);return function(o,s,f,c){for(var g="",y=0;y<u;y++)g+=n[y](o,s,f,c)||"";return g}}function Sb(n){return function(u){u.root||(u=u.return)&&n(u)}}function $b(n,u,o,s){if(n.length>-1&&!n.return)switch(n.type){case Hc:n.return=l0(n.value,n.length,o);return;case Jg:return Ar([pn(n,{value:At(n.value,"@","@"+Lt)})],s);case Nr:if(n.length)return ob(o=n.props,function(f){switch(Hl(f,s=/(::plac\w+|:read-\w+)/)){case":read-only":case":read-write":Ci(pn(n,{props:[At(f,/:(read-\w+)/,":"+Wa+"$1")]})),Ci(pn(n,{props:[f]})),Ec(n,{props:lg(o,s)});break;case"::placeholder":Ci(pn(n,{props:[At(f,/:(plac\w+)/,":"+Lt+"input-$1")]})),Ci(pn(n,{props:[At(f,/:(plac\w+)/,":"+Wa+"$1")]})),Ci(pn(n,{props:[At(f,/:(plac\w+)/,Kt+"input-$1")]})),Ci(pn(n,{props:[f]})),Ec(n,{props:lg(o,s)});break}return""})}}var wb={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},Xe={},Ui=typeof process<"u"&&Xe!==void 0&&(Xe.REACT_APP_SC_ATTR||Xe.SC_ATTR)||"data-styled",n0="active",i0="data-styled-version",Hr="6.1.19",Vc=`/*!sc*/
`,Cr=typeof window<"u"&&typeof document<"u",Eb=!!(typeof SC_DISABLE_SPEEDY=="boolean"?SC_DISABLE_SPEEDY:typeof process<"u"&&Xe!==void 0&&Xe.REACT_APP_SC_DISABLE_SPEEDY!==void 0&&Xe.REACT_APP_SC_DISABLE_SPEEDY!==""?Xe.REACT_APP_SC_DISABLE_SPEEDY!=="false"&&Xe.REACT_APP_SC_DISABLE_SPEEDY:typeof process<"u"&&Xe!==void 0&&Xe.SC_DISABLE_SPEEDY!==void 0&&Xe.SC_DISABLE_SPEEDY!==""&&Xe.SC_DISABLE_SPEEDY!=="false"&&Xe.SC_DISABLE_SPEEDY),qr=Object.freeze([]),Li=Object.freeze({});function Tb(n,u,o){return o===void 0&&(o=Li),n.theme!==o.theme&&n.theme||u||o.theme}var a0=new Set(["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","u","ul","use","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","marker","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"]),zb=/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g,jb=/(^-|-$)/g;function ag(n){return n.replace(zb,"-").replace(jb,"")}var Ab=/(a)(d)/gi,hr=52,ug=function(n){return String.fromCharCode(n+(n>25?39:97))};function jc(n){var u,o="";for(u=Math.abs(n);u>hr;u=u/hr|0)o=ug(u%hr)+o;return(ug(u%hr)+o).replace(Ab,"$1-$2")}var fc,u0=5381,Oi=function(n,u){for(var o=u.length;o;)n=33*n^u.charCodeAt(--o);return n},r0=function(n){return Oi(u0,n)};function o0(n){return jc(r0(n)>>>0)}function Cb(n){return n.displayName||n.name||"Component"}function dc(n){return typeof n=="string"&&!0}var s0=typeof Symbol=="function"&&Symbol.for,c0=s0?Symbol.for("react.memo"):60115,_b=s0?Symbol.for("react.forward_ref"):60112,Db={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},Mb={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},f0={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},Rb=((fc={})[_b]={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},fc[c0]=f0,fc);function rg(n){return("type"in(u=n)&&u.type.$$typeof)===c0?f0:"$$typeof"in n?Rb[n.$$typeof]:Db;var u}var Ob=Object.defineProperty,kb=Object.getOwnPropertyNames,og=Object.getOwnPropertySymbols,Nb=Object.getOwnPropertyDescriptor,Bb=Object.getPrototypeOf,sg=Object.prototype;function d0(n,u,o){if(typeof u!="string"){if(sg){var s=Bb(u);s&&s!==sg&&d0(n,s,o)}var f=kb(u);og&&(f=f.concat(og(u)));for(var c=rg(n),g=rg(u),y=0;y<f.length;++y){var x=f[y];if(!(x in Mb||o&&o[x]||g&&x in g||c&&x in c)){var p=Nb(u,x);try{Ob(n,x,p)}catch{}}}}return n}function Hi(n){return typeof n=="function"}function Yc(n){return typeof n=="object"&&"styledComponentId"in n}function Un(n,u){return n&&u?"".concat(n," ").concat(u):n||u||""}function Ac(n,u){if(n.length===0)return"";for(var o=n[0],s=1;s<n.length;s++)o+=n[s];return o}function Ia(n){return n!==null&&typeof n=="object"&&n.constructor.name===Object.name&&!("props"in n&&n.$$typeof)}function Cc(n,u,o){if(o===void 0&&(o=!1),!o&&!Ia(n)&&!Array.isArray(n))return u;if(Array.isArray(u))for(var s=0;s<u.length;s++)n[s]=Cc(n[s],u[s]);else if(Ia(u))for(var s in u)n[s]=Cc(n[s],u[s]);return n}function Gc(n,u){Object.defineProperty(n,"toString",{value:u})}function Pa(n){for(var u=[],o=1;o<arguments.length;o++)u[o-1]=arguments[o];return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(n," for more information.").concat(u.length>0?" Args: ".concat(u.join(", ")):""))}var Ub=function(){function n(u){this.groupSizes=new Uint32Array(512),this.length=512,this.tag=u}return n.prototype.indexOfGroup=function(u){for(var o=0,s=0;s<u;s++)o+=this.groupSizes[s];return o},n.prototype.insertRules=function(u,o){if(u>=this.groupSizes.length){for(var s=this.groupSizes,f=s.length,c=f;u>=c;)if((c<<=1)<0)throw Pa(16,"".concat(u));this.groupSizes=new Uint32Array(c),this.groupSizes.set(s),this.length=c;for(var g=f;g<c;g++)this.groupSizes[g]=0}for(var y=this.indexOfGroup(u+1),x=(g=0,o.length);g<x;g++)this.tag.insertRule(y,o[g])&&(this.groupSizes[u]++,y++)},n.prototype.clearGroup=function(u){if(u<this.length){var o=this.groupSizes[u],s=this.indexOfGroup(u),f=s+o;this.groupSizes[u]=0;for(var c=s;c<f;c++)this.tag.deleteRule(s)}},n.prototype.getGroup=function(u){var o="";if(u>=this.length||this.groupSizes[u]===0)return o;for(var s=this.groupSizes[u],f=this.indexOfGroup(u),c=f+s,g=f;g<c;g++)o+="".concat(this.tag.getRule(g)).concat(Vc);return o},n}(),wr=new Map,_r=new Map,Er=1,mr=function(n){if(wr.has(n))return wr.get(n);for(;_r.has(Er);)Er++;var u=Er++;return wr.set(n,u),_r.set(u,n),u},Lb=function(n,u){Er=u+1,wr.set(n,u),_r.set(u,n)},Hb="style[".concat(Ui,"][").concat(i0,'="').concat(Hr,'"]'),qb=new RegExp("^".concat(Ui,'\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')),Vb=function(n,u,o){for(var s,f=o.split(","),c=0,g=f.length;c<g;c++)(s=f[c])&&n.registerName(u,s)},Yb=function(n,u){for(var o,s=((o=u.textContent)!==null&&o!==void 0?o:"").split(Vc),f=[],c=0,g=s.length;c<g;c++){var y=s[c].trim();if(y){var x=y.match(qb);if(x){var p=0|parseInt(x[1],10),v=x[2];p!==0&&(Lb(v,p),Vb(n,v,x[3]),n.getTag().insertRules(p,f)),f.length=0}else f.push(y)}}},cg=function(n){for(var u=document.querySelectorAll(Hb),o=0,s=u.length;o<s;o++){var f=u[o];f&&f.getAttribute(Ui)!==n0&&(Yb(n,f),f.parentNode&&f.parentNode.removeChild(f))}};function Gb(){return typeof __webpack_nonce__<"u"?__webpack_nonce__:null}var h0=function(n){var u=document.head,o=n||u,s=document.createElement("style"),f=function(y){var x=Array.from(y.querySelectorAll("style[".concat(Ui,"]")));return x[x.length-1]}(o),c=f!==void 0?f.nextSibling:null;s.setAttribute(Ui,n0),s.setAttribute(i0,Hr);var g=Gb();return g&&s.setAttribute("nonce",g),o.insertBefore(s,c),s},Xb=function(){function n(u){this.element=h0(u),this.element.appendChild(document.createTextNode("")),this.sheet=function(o){if(o.sheet)return o.sheet;for(var s=document.styleSheets,f=0,c=s.length;f<c;f++){var g=s[f];if(g.ownerNode===o)return g}throw Pa(17)}(this.element),this.length=0}return n.prototype.insertRule=function(u,o){try{return this.sheet.insertRule(o,u),this.length++,!0}catch{return!1}},n.prototype.deleteRule=function(u){this.sheet.deleteRule(u),this.length--},n.prototype.getRule=function(u){var o=this.sheet.cssRules[u];return o&&o.cssText?o.cssText:""},n}(),Qb=function(){function n(u){this.element=h0(u),this.nodes=this.element.childNodes,this.length=0}return n.prototype.insertRule=function(u,o){if(u<=this.length&&u>=0){var s=document.createTextNode(o);return this.element.insertBefore(s,this.nodes[u]||null),this.length++,!0}return!1},n.prototype.deleteRule=function(u){this.element.removeChild(this.nodes[u]),this.length--},n.prototype.getRule=function(u){return u<this.length?this.nodes[u].textContent:""},n}(),Zb=function(){function n(u){this.rules=[],this.length=0}return n.prototype.insertRule=function(u,o){return u<=this.length&&(this.rules.splice(u,0,o),this.length++,!0)},n.prototype.deleteRule=function(u){this.rules.splice(u,1),this.length--},n.prototype.getRule=function(u){return u<this.length?this.rules[u]:""},n}(),fg=Cr,Wb={isServer:!Cr,useCSSOMInjection:!Eb},m0=function(){function n(u,o,s){u===void 0&&(u=Li),o===void 0&&(o={});var f=this;this.options=Be(Be({},Wb),u),this.gs=o,this.names=new Map(s),this.server=!!u.isServer,!this.server&&Cr&&fg&&(fg=!1,cg(this)),Gc(this,function(){return function(c){for(var g=c.getTag(),y=g.length,x="",p=function(z){var j=function(Z){return _r.get(Z)}(z);if(j===void 0)return"continue";var H=c.names.get(j),tt=g.getGroup(z);if(H===void 0||!H.size||tt.length===0)return"continue";var k="".concat(Ui,".g").concat(z,'[id="').concat(j,'"]'),O="";H!==void 0&&H.forEach(function(Z){Z.length>0&&(O+="".concat(Z,","))}),x+="".concat(tt).concat(k,'{content:"').concat(O,'"}').concat(Vc)},v=0;v<y;v++)p(v);return x}(f)})}return n.registerId=function(u){return mr(u)},n.prototype.rehydrate=function(){!this.server&&Cr&&cg(this)},n.prototype.reconstructWithOptions=function(u,o){return o===void 0&&(o=!0),new n(Be(Be({},this.options),u),this.gs,o&&this.names||void 0)},n.prototype.allocateGSInstance=function(u){return this.gs[u]=(this.gs[u]||0)+1},n.prototype.getTag=function(){return this.tag||(this.tag=(u=function(o){var s=o.useCSSOMInjection,f=o.target;return o.isServer?new Zb(f):s?new Xb(f):new Qb(f)}(this.options),new Ub(u)));var u},n.prototype.hasNameForId=function(u,o){return this.names.has(u)&&this.names.get(u).has(o)},n.prototype.registerName=function(u,o){if(mr(u),this.names.has(u))this.names.get(u).add(o);else{var s=new Set;s.add(o),this.names.set(u,s)}},n.prototype.insertRules=function(u,o,s){this.registerName(u,o),this.getTag().insertRules(mr(u),s)},n.prototype.clearNames=function(u){this.names.has(u)&&this.names.get(u).clear()},n.prototype.clearRules=function(u){this.getTag().clearGroup(mr(u)),this.clearNames(u)},n.prototype.clearTag=function(){this.tag=void 0},n}(),Kb=/&/g,Fb=/^\s*\/\/.*$/gm;function g0(n,u){return n.map(function(o){return o.type==="rule"&&(o.value="".concat(u," ").concat(o.value),o.value=o.value.replaceAll(",",",".concat(u," ")),o.props=o.props.map(function(s){return"".concat(u," ").concat(s)})),Array.isArray(o.children)&&o.type!=="@keyframes"&&(o.children=g0(o.children,u)),o})}function Jb(n){var u,o,s,f=Li,c=f.options,g=c===void 0?Li:c,y=f.plugins,x=y===void 0?qr:y,p=function(j,H,tt){return tt.startsWith(o)&&tt.endsWith(o)&&tt.replaceAll(o,"").length>0?".".concat(u):j},v=x.slice();v.push(function(j){j.type===Nr&&j.value.includes("&")&&(j.props[0]=j.props[0].replace(Kb,o).replace(s,p))}),g.prefix&&v.push($b),v.push(bb);var z=function(j,H,tt,k){H===void 0&&(H=""),tt===void 0&&(tt=""),k===void 0&&(k="&"),u=k,o=H,s=new RegExp("\\".concat(o,"\\b"),"g");var O=j.replace(Fb,""),Z=pb(tt||H?"".concat(tt," ").concat(H," { ").concat(O," }"):O);g.namespace&&(Z=g0(Z,g.namespace));var B=[];return Ar(Z,vb(v.concat(Sb(function(L){return B.push(L)})))),B};return z.hash=x.length?x.reduce(function(j,H){return H.name||Pa(15),Oi(j,H.name)},u0).toString():"",z}var Ib=new m0,_c=Jb(),y0=Ht.createContext({shouldForwardProp:void 0,styleSheet:Ib,stylis:_c});y0.Consumer;Ht.createContext(void 0);function dg(){return $t.useContext(y0)}var p0=function(){function n(u,o){var s=this;this.inject=function(f,c){c===void 0&&(c=_c);var g=s.name+c.hash;f.hasNameForId(s.id,g)||f.insertRules(s.id,g,c(s.rules,g,"@keyframes"))},this.name=u,this.id="sc-keyframes-".concat(u),this.rules=o,Gc(this,function(){throw Pa(12,String(s.name))})}return n.prototype.getName=function(u){return u===void 0&&(u=_c),this.name+u.hash},n}(),Pb=function(n){return n>="A"&&n<="Z"};function hg(n){for(var u="",o=0;o<n.length;o++){var s=n[o];if(o===1&&s==="-"&&n[0]==="-")return n;Pb(s)?u+="-"+s.toLowerCase():u+=s}return u.startsWith("ms-")?"-"+u:u}var x0=function(n){return n==null||n===!1||n===""},b0=function(n){var u,o,s=[];for(var f in n){var c=n[f];n.hasOwnProperty(f)&&!x0(c)&&(Array.isArray(c)&&c.isCss||Hi(c)?s.push("".concat(hg(f),":"),c,";"):Ia(c)?s.push.apply(s,Ja(Ja(["".concat(f," {")],b0(c),!1),["}"],!1)):s.push("".concat(hg(f),": ").concat((u=f,(o=c)==null||typeof o=="boolean"||o===""?"":typeof o!="number"||o===0||u in wb||u.startsWith("--")?String(o).trim():"".concat(o,"px")),";")))}return s};function qn(n,u,o,s){if(x0(n))return[];if(Yc(n))return[".".concat(n.styledComponentId)];if(Hi(n)){if(!Hi(c=n)||c.prototype&&c.prototype.isReactComponent||!u)return[n];var f=n(u);return qn(f,u,o,s)}var c;return n instanceof p0?o?(n.inject(o,s),[n.getName(s)]):[n]:Ia(n)?b0(n):Array.isArray(n)?Array.prototype.concat.apply(qr,n.map(function(g){return qn(g,u,o,s)})):[n.toString()]}function t1(n){for(var u=0;u<n.length;u+=1){var o=n[u];if(Hi(o)&&!Yc(o))return!1}return!0}var e1=r0(Hr),l1=function(){function n(u,o,s){this.rules=u,this.staticRulesId="",this.isStatic=(s===void 0||s.isStatic)&&t1(u),this.componentId=o,this.baseHash=Oi(e1,o),this.baseStyle=s,m0.registerId(o)}return n.prototype.generateAndInjectStyles=function(u,o,s){var f=this.baseStyle?this.baseStyle.generateAndInjectStyles(u,o,s):"";if(this.isStatic&&!s.hash)if(this.staticRulesId&&o.hasNameForId(this.componentId,this.staticRulesId))f=Un(f,this.staticRulesId);else{var c=Ac(qn(this.rules,u,o,s)),g=jc(Oi(this.baseHash,c)>>>0);if(!o.hasNameForId(this.componentId,g)){var y=s(c,".".concat(g),void 0,this.componentId);o.insertRules(this.componentId,g,y)}f=Un(f,g),this.staticRulesId=g}else{for(var x=Oi(this.baseHash,s.hash),p="",v=0;v<this.rules.length;v++){var z=this.rules[v];if(typeof z=="string")p+=z;else if(z){var j=Ac(qn(z,u,o,s));x=Oi(x,j+v),p+=j}}if(p){var H=jc(x>>>0);o.hasNameForId(this.componentId,H)||o.insertRules(this.componentId,H,s(p,".".concat(H),void 0,this.componentId)),f=Un(f,H)}}return f},n}(),v0=Ht.createContext(void 0);v0.Consumer;var hc={};function n1(n,u,o){var s=Yc(n),f=n,c=!dc(n),g=u.attrs,y=g===void 0?qr:g,x=u.componentId,p=x===void 0?function(P,Q){var rt=typeof P!="string"?"sc":ag(P);hc[rt]=(hc[rt]||0)+1;var J="".concat(rt,"-").concat(o0(Hr+rt+hc[rt]));return Q?"".concat(Q,"-").concat(J):J}(u.displayName,u.parentComponentId):x,v=u.displayName,z=v===void 0?function(P){return dc(P)?"styled.".concat(P):"Styled(".concat(Cb(P),")")}(n):v,j=u.displayName&&u.componentId?"".concat(ag(u.displayName),"-").concat(u.componentId):u.componentId||p,H=s&&f.attrs?f.attrs.concat(y).filter(Boolean):y,tt=u.shouldForwardProp;if(s&&f.shouldForwardProp){var k=f.shouldForwardProp;if(u.shouldForwardProp){var O=u.shouldForwardProp;tt=function(P,Q){return k(P,Q)&&O(P,Q)}}else tt=k}var Z=new l1(o,j,s?f.componentStyle:void 0);function B(P,Q){return function(rt,J,mt){var W=rt.attrs,F=rt.componentStyle,K=rt.defaultProps,V=rt.foldedComponentIds,lt=rt.styledComponentId,ct=rt.target,wt=Ht.useContext(v0),M=dg(),I=rt.shouldForwardProp||M.shouldForwardProp,dt=Tb(J,wt,K)||Li,Et=function(jt,pt,Pt){for(var Nt,ae=Be(Be({},pt),{className:void 0,theme:Pt}),il=0;il<jt.length;il+=1){var al=Hi(Nt=jt[il])?Nt(ae):Nt;for(var Ae in al)ae[Ae]=Ae==="className"?Un(ae[Ae],al[Ae]):Ae==="style"?Be(Be({},ae[Ae]),al[Ae]):al[Ae]}return pt.className&&(ae.className=Un(ae.className,pt.className)),ae}(W,J,dt),S=Et.as||ct,X={};for(var nt in Et)Et[nt]===void 0||nt[0]==="$"||nt==="as"||nt==="theme"&&Et.theme===dt||(nt==="forwardedAs"?X.as=Et.forwardedAs:I&&!I(nt,S)||(X[nt]=Et[nt]));var it=function(jt,pt){var Pt=dg(),Nt=jt.generateAndInjectStyles(pt,Pt.styleSheet,Pt.stylis);return Nt}(F,Et),gt=Un(V,lt);return it&&(gt+=" "+it),Et.className&&(gt+=" "+Et.className),X[dc(S)&&!a0.has(S)?"class":"className"]=gt,mt&&(X.ref=mt),$t.createElement(S,X)}(L,P,Q)}B.displayName=z;var L=Ht.forwardRef(B);return L.attrs=H,L.componentStyle=Z,L.displayName=z,L.shouldForwardProp=tt,L.foldedComponentIds=s?Un(f.foldedComponentIds,f.styledComponentId):"",L.styledComponentId=j,L.target=s?f.target:n,Object.defineProperty(L,"defaultProps",{get:function(){return this._foldedDefaultProps},set:function(P){this._foldedDefaultProps=s?function(Q){for(var rt=[],J=1;J<arguments.length;J++)rt[J-1]=arguments[J];for(var mt=0,W=rt;mt<W.length;mt++)Cc(Q,W[mt],!0);return Q}({},f.defaultProps,P):P}}),Gc(L,function(){return".".concat(L.styledComponentId)}),c&&d0(L,n,{attrs:!0,componentStyle:!0,displayName:!0,foldedComponentIds:!0,shouldForwardProp:!0,styledComponentId:!0,target:!0}),L}function mg(n,u){for(var o=[n[0]],s=0,f=u.length;s<f;s+=1)o.push(u[s],n[s+1]);return o}var gg=function(n){return Object.assign(n,{isCss:!0})};function S0(n){for(var u=[],o=1;o<arguments.length;o++)u[o-1]=arguments[o];if(Hi(n)||Ia(n))return gg(qn(mg(qr,Ja([n],u,!0))));var s=n;return u.length===0&&s.length===1&&typeof s[0]=="string"?qn(s):gg(qn(mg(s,u)))}function Dc(n,u,o){if(o===void 0&&(o=Li),!u)throw Pa(1,u);var s=function(f){for(var c=[],g=1;g<arguments.length;g++)c[g-1]=arguments[g];return n(u,o,S0.apply(void 0,Ja([f],c,!1)))};return s.attrs=function(f){return Dc(n,u,Be(Be({},o),{attrs:Array.prototype.concat(o.attrs,f).filter(Boolean)}))},s.withConfig=function(f){return Dc(n,u,Be(Be({},o),f))},s}var $0=function(n){return Dc(n1,n)},E=$0;a0.forEach(function(n){E[n]=$0(n)});function w0(n){for(var u=[],o=1;o<arguments.length;o++)u[o-1]=arguments[o];var s=Ac(S0.apply(void 0,Ja([n],u,!1))),f=o0(s);return new p0(f,s)}const ot={xs:2,sm:4,md:8,lg:12,xl:16,xxl:20,xxxl:40},ve={sm:4,md:6,lg:8},qi={light:"0 2px 4px rgba(0, 0, 0, 0.1)",medium:"0 4px 8px rgba(0, 0, 0, 0.1)"},N={primary:"#3498db",background:"#f5f6fa",cardBackground:"#ffffff",textPrimary:"#2c3e50",textSecondary:"#7f8c8d",textMuted:"#95a5a6",border:"#e1e8ed",borderLight:"#ddd",success:"#27ae60",warning:"#f39c12",danger:"#e74c3c",info:"#3498db",hoverLight:"#ecf0f1",hoverPrimary:"#2980b9"},vt={fontFamily:{system:'-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'},fontSize:{xs:"0.75rem",sm:"0.875rem",base:"1rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem"},fontWeight:{normal:400,medium:500,semibold:600,bold:700}},Vi={mobile:"480px",tablet:"768px"},E0={modal:1e3,tooltip:2e3},ql={height:{sm:"32px",md:"40px",lg:"48px"},padding:{sm:"4px 8px",md:"8px 12px",lg:"12px 16px"}},Dr={card:{padding:ot.xxl,borderRadius:ve.lg,marginBottom:ot.xxl},button:{padding:"6px 8px"}},i1={maxWidth:"1440px"},a1=w0`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,u1=w0`
  0%, 20% {
    color: rgba(0,0,0,0);
    text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0);
  }
  40% {
    color: ${N.textMuted};
    text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0);
  }
  60% {
    text-shadow: .25em 0 0 ${N.textMuted}, .5em 0 0 rgba(0,0,0,0);
  }
  80%, 100% {
    text-shadow: .25em 0 0 ${N.textMuted}, .5em 0 0 ${N.textMuted};
  }
`,r1=(n="medium")=>{switch(n){case"small":return{size:16,borderWidth:2};case"large":return{size:32,borderWidth:4};case"medium":default:return{size:24,borderWidth:3}}},o1=E.div`
  ${n=>{const u=r1(n.$size),o=n.$color||N.primary;return`
      display: inline-block;
      width: ${u.size}px;
      height: ${u.size}px;
      border: ${u.borderWidth}px solid ${N.borderLight};
      border-top: ${u.borderWidth}px solid ${o};
      border-radius: 50%;
      animation: ${a1} 1s linear infinite;
    `}}
`,s1=E.div`
  ${n=>n.$overlay?`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${n.$transparent?"rgba(255, 255, 255, 0.7)":N.cardBackground};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: ${E0.modal};
    border-radius: 4px;
  `:`
    display: flex;
    align-items: center;
    padding: ${n.$padding!==!1?`${ot.md}px ${ot.lg}px`:"0"};
    background-color: ${n.$transparent?"transparent":N.background};
    border: ${n.$transparent?"none":`1px solid ${N.border}`};
    border-radius: 4px;
    color: ${N.textSecondary};
    font-size: ${vt.fontSize.sm};
  `}
`,c1=E.span`
  font-size: ${vt.fontSize.sm};
  color: ${N.textSecondary};
  margin-left: ${ot.md}px;
`,f1=E.span`
  display: inline-block;
  font-size: ${vt.fontSize.sm};
  color: ${N.textMuted};
  margin-left: ${ot.sm}px;

  &:after {
    content: '...';
    animation: ${u1} 1.5s steps(4, end) infinite;
  }
`,d1=({isLoading:n=!0,message:u="Loading...",overlay:o=!1,transparent:s=!1,size:f="medium",color:c,noPadding:g=!1})=>n?d.jsxs(s1,{$overlay:o,$transparent:s,$padding:!g,children:[d.jsx(o1,{$size:f,$color:c}),u&&d.jsx(c1,{children:u})]}):null,h1=({isLoading:n=!0})=>n?d.jsx(f1,{}):null,m1=({isLoading:n,message:u="Calculating layout...",overlay:o=!1})=>d.jsx(d1,{isLoading:n,message:u,overlay:o}),g1=({isLoading:n})=>d.jsx(h1,{isLoading:n});var tu=n=>n.type==="checkbox",Ln=n=>n instanceof Date,_e=n=>n==null;const T0=n=>typeof n=="object";var ie=n=>!_e(n)&&!Array.isArray(n)&&T0(n)&&!Ln(n),y1=n=>ie(n)&&n.target?tu(n.target)?n.target.checked:n.target.value:n,p1=n=>n.substring(0,n.search(/\.\d+(\.|$)/))||n,x1=(n,u)=>n.has(p1(u)),b1=n=>{const u=n.constructor&&n.constructor.prototype;return ie(u)&&u.hasOwnProperty("isPrototypeOf")},Xc=typeof window<"u"&&typeof window.HTMLElement<"u"&&typeof document<"u";function je(n){let u;const o=Array.isArray(n),s=typeof FileList<"u"?n instanceof FileList:!1;if(n instanceof Date)u=new Date(n);else if(n instanceof Set)u=new Set(n);else if(!(Xc&&(n instanceof Blob||s))&&(o||ie(n)))if(u=o?[]:{},!o&&!b1(n))u=n;else for(const f in n)n.hasOwnProperty(f)&&(u[f]=je(n[f]));else return n;return u}var Vr=n=>/^\w*$/.test(n),oe=n=>n===void 0,Qc=n=>Array.isArray(n)?n.filter(Boolean):[],Zc=n=>Qc(n.replace(/["|']|\]/g,"").split(/\.|\[/)),ft=(n,u,o)=>{if(!u||!ie(n))return o;const s=(Vr(u)?[u]:Zc(u)).reduce((f,c)=>_e(f)?f:f[c],n);return oe(s)||s===n?oe(n[u])?o:n[u]:s},xl=n=>typeof n=="boolean",Ft=(n,u,o)=>{let s=-1;const f=Vr(u)?[u]:Zc(u),c=f.length,g=c-1;for(;++s<c;){const y=f[s];let x=o;if(s!==g){const p=n[y];x=ie(p)||Array.isArray(p)?p:isNaN(+f[s+1])?{}:[]}if(y==="__proto__"||y==="constructor"||y==="prototype")return;n[y]=x,n=n[y]}};const yg={BLUR:"blur",FOCUS_OUT:"focusout"},sl={onBlur:"onBlur",onChange:"onChange",onSubmit:"onSubmit",onTouched:"onTouched",all:"all"},Ll={max:"max",min:"min",maxLength:"maxLength",minLength:"minLength",pattern:"pattern",required:"required",validate:"validate"},v1=Ht.createContext(null);v1.displayName="HookFormContext";var S1=(n,u,o,s=!0)=>{const f={defaultValues:u._defaultValues};for(const c in n)Object.defineProperty(f,c,{get:()=>{const g=c;return u._proxyFormState[g]!==sl.all&&(u._proxyFormState[g]=!s||sl.all),n[g]}});return f};const $1=typeof window<"u"?$t.useLayoutEffect:$t.useEffect;var vl=n=>typeof n=="string",w1=(n,u,o,s,f)=>vl(n)?(s&&u.watch.add(n),ft(o,n,f)):Array.isArray(n)?n.map(c=>(s&&u.watch.add(c),ft(o,c))):(s&&(u.watchAll=!0),o),E1=(n,u,o,s,f)=>u?{...o[n],types:{...o[n]&&o[n].types?o[n].types:{},[s]:f||!0}}:{},Ka=n=>Array.isArray(n)?n:[n],pg=()=>{let n=[];return{get observers(){return n},next:f=>{for(const c of n)c.next&&c.next(f)},subscribe:f=>(n.push(f),{unsubscribe:()=>{n=n.filter(c=>c!==f)}}),unsubscribe:()=>{n=[]}}},Mc=n=>_e(n)||!T0(n);function xn(n,u){if(Mc(n)||Mc(u))return n===u;if(Ln(n)&&Ln(u))return n.getTime()===u.getTime();const o=Object.keys(n),s=Object.keys(u);if(o.length!==s.length)return!1;for(const f of o){const c=n[f];if(!s.includes(f))return!1;if(f!=="ref"){const g=u[f];if(Ln(c)&&Ln(g)||ie(c)&&ie(g)||Array.isArray(c)&&Array.isArray(g)?!xn(c,g):c!==g)return!1}}return!0}var Ne=n=>ie(n)&&!Object.keys(n).length,Wc=n=>n.type==="file",cl=n=>typeof n=="function",Mr=n=>{if(!Xc)return!1;const u=n?n.ownerDocument:0;return n instanceof(u&&u.defaultView?u.defaultView.HTMLElement:HTMLElement)},z0=n=>n.type==="select-multiple",Kc=n=>n.type==="radio",T1=n=>Kc(n)||tu(n),mc=n=>Mr(n)&&n.isConnected;function z1(n,u){const o=u.slice(0,-1).length;let s=0;for(;s<o;)n=oe(n)?s++:n[u[s++]];return n}function j1(n){for(const u in n)if(n.hasOwnProperty(u)&&!oe(n[u]))return!1;return!0}function de(n,u){const o=Array.isArray(u)?u:Vr(u)?[u]:Zc(u),s=o.length===1?n:z1(n,o),f=o.length-1,c=o[f];return s&&delete s[c],f!==0&&(ie(s)&&Ne(s)||Array.isArray(s)&&j1(s))&&de(n,o.slice(0,-1)),n}var j0=n=>{for(const u in n)if(cl(n[u]))return!0;return!1};function Rr(n,u={}){const o=Array.isArray(n);if(ie(n)||o)for(const s in n)Array.isArray(n[s])||ie(n[s])&&!j0(n[s])?(u[s]=Array.isArray(n[s])?[]:{},Rr(n[s],u[s])):_e(n[s])||(u[s]=!0);return u}function A0(n,u,o){const s=Array.isArray(n);if(ie(n)||s)for(const f in n)Array.isArray(n[f])||ie(n[f])&&!j0(n[f])?oe(u)||Mc(o[f])?o[f]=Array.isArray(n[f])?Rr(n[f],[]):{...Rr(n[f])}:A0(n[f],_e(u)?{}:u[f],o[f]):o[f]=!xn(n[f],u[f]);return o}var Ya=(n,u)=>A0(n,u,Rr(u));const xg={value:!1,isValid:!1},bg={value:!0,isValid:!0};var C0=n=>{if(Array.isArray(n)){if(n.length>1){const u=n.filter(o=>o&&o.checked&&!o.disabled).map(o=>o.value);return{value:u,isValid:!!u.length}}return n[0].checked&&!n[0].disabled?n[0].attributes&&!oe(n[0].attributes.value)?oe(n[0].value)||n[0].value===""?bg:{value:n[0].value,isValid:!0}:bg:xg}return xg},_0=(n,{valueAsNumber:u,valueAsDate:o,setValueAs:s})=>oe(n)?n:u?n===""?NaN:n&&+n:o&&vl(n)?new Date(n):s?s(n):n;const vg={isValid:!1,value:null};var D0=n=>Array.isArray(n)?n.reduce((u,o)=>o&&o.checked&&!o.disabled?{isValid:!0,value:o.value}:u,vg):vg;function Sg(n){const u=n.ref;return Wc(u)?u.files:Kc(u)?D0(n.refs).value:z0(u)?[...u.selectedOptions].map(({value:o})=>o):tu(u)?C0(n.refs).value:_0(oe(u.value)?n.ref.value:u.value,n)}var A1=(n,u,o,s)=>{const f={};for(const c of n){const g=ft(u,c);g&&Ft(f,c,g._f)}return{criteriaMode:o,names:[...n],fields:f,shouldUseNativeValidation:s}},Or=n=>n instanceof RegExp,Ga=n=>oe(n)?n:Or(n)?n.source:ie(n)?Or(n.value)?n.value.source:n.value:n,$g=n=>({isOnSubmit:!n||n===sl.onSubmit,isOnBlur:n===sl.onBlur,isOnChange:n===sl.onChange,isOnAll:n===sl.all,isOnTouch:n===sl.onTouched});const wg="AsyncFunction";var C1=n=>!!n&&!!n.validate&&!!(cl(n.validate)&&n.validate.constructor.name===wg||ie(n.validate)&&Object.values(n.validate).find(u=>u.constructor.name===wg)),_1=n=>n.mount&&(n.required||n.min||n.max||n.maxLength||n.minLength||n.pattern||n.validate),Eg=(n,u,o)=>!o&&(u.watchAll||u.watch.has(n)||[...u.watch].some(s=>n.startsWith(s)&&/^\.\w+/.test(n.slice(s.length))));const Fa=(n,u,o,s)=>{for(const f of o||Object.keys(n)){const c=ft(n,f);if(c){const{_f:g,...y}=c;if(g){if(g.refs&&g.refs[0]&&u(g.refs[0],f)&&!s)return!0;if(g.ref&&u(g.ref,g.name)&&!s)return!0;if(Fa(y,u))break}else if(ie(y)&&Fa(y,u))break}}};function Tg(n,u,o){const s=ft(n,o);if(s||Vr(o))return{error:s,name:o};const f=o.split(".");for(;f.length;){const c=f.join("."),g=ft(u,c),y=ft(n,c);if(g&&!Array.isArray(g)&&o!==c)return{name:o};if(y&&y.type)return{name:c,error:y};if(y&&y.root&&y.root.type)return{name:`${c}.root`,error:y.root};f.pop()}return{name:o}}var D1=(n,u,o,s)=>{o(n);const{name:f,...c}=n;return Ne(c)||Object.keys(c).length>=Object.keys(u).length||Object.keys(c).find(g=>u[g]===(!s||sl.all))},M1=(n,u,o)=>!n||!u||n===u||Ka(n).some(s=>s&&(o?s===u:s.startsWith(u)||u.startsWith(s))),R1=(n,u,o,s,f)=>f.isOnAll?!1:!o&&f.isOnTouch?!(u||n):(o?s.isOnBlur:f.isOnBlur)?!n:(o?s.isOnChange:f.isOnChange)?n:!0,O1=(n,u)=>!Qc(ft(n,u)).length&&de(n,u),k1=(n,u,o)=>{const s=Ka(ft(n,o));return Ft(s,"root",u[o]),Ft(n,o,s),n},Tr=n=>vl(n);function zg(n,u,o="validate"){if(Tr(n)||Array.isArray(n)&&n.every(Tr)||xl(n)&&!n)return{type:o,message:Tr(n)?n:"",ref:u}}var _i=n=>ie(n)&&!Or(n)?n:{value:n,message:""},jg=async(n,u,o,s,f,c)=>{const{ref:g,refs:y,required:x,maxLength:p,minLength:v,min:z,max:j,pattern:H,validate:tt,name:k,valueAsNumber:O,mount:Z}=n._f,B=ft(o,k);if(!Z||u.has(k))return{};const L=y?y[0]:g,P=V=>{f&&L.reportValidity&&(L.setCustomValidity(xl(V)?"":V||""),L.reportValidity())},Q={},rt=Kc(g),J=tu(g),mt=rt||J,W=(O||Wc(g))&&oe(g.value)&&oe(B)||Mr(g)&&g.value===""||B===""||Array.isArray(B)&&!B.length,F=E1.bind(null,k,s,Q),K=(V,lt,ct,wt=Ll.maxLength,M=Ll.minLength)=>{const I=V?lt:ct;Q[k]={type:V?wt:M,message:I,ref:g,...F(V?wt:M,I)}};if(c?!Array.isArray(B)||!B.length:x&&(!mt&&(W||_e(B))||xl(B)&&!B||J&&!C0(y).isValid||rt&&!D0(y).isValid)){const{value:V,message:lt}=Tr(x)?{value:!!x,message:x}:_i(x);if(V&&(Q[k]={type:Ll.required,message:lt,ref:L,...F(Ll.required,lt)},!s))return P(lt),Q}if(!W&&(!_e(z)||!_e(j))){let V,lt;const ct=_i(j),wt=_i(z);if(!_e(B)&&!isNaN(B)){const M=g.valueAsNumber||B&&+B;_e(ct.value)||(V=M>ct.value),_e(wt.value)||(lt=M<wt.value)}else{const M=g.valueAsDate||new Date(B),I=S=>new Date(new Date().toDateString()+" "+S),dt=g.type=="time",Et=g.type=="week";vl(ct.value)&&B&&(V=dt?I(B)>I(ct.value):Et?B>ct.value:M>new Date(ct.value)),vl(wt.value)&&B&&(lt=dt?I(B)<I(wt.value):Et?B<wt.value:M<new Date(wt.value))}if((V||lt)&&(K(!!V,ct.message,wt.message,Ll.max,Ll.min),!s))return P(Q[k].message),Q}if((p||v)&&!W&&(vl(B)||c&&Array.isArray(B))){const V=_i(p),lt=_i(v),ct=!_e(V.value)&&B.length>+V.value,wt=!_e(lt.value)&&B.length<+lt.value;if((ct||wt)&&(K(ct,V.message,lt.message),!s))return P(Q[k].message),Q}if(H&&!W&&vl(B)){const{value:V,message:lt}=_i(H);if(Or(V)&&!B.match(V)&&(Q[k]={type:Ll.pattern,message:lt,ref:g,...F(Ll.pattern,lt)},!s))return P(lt),Q}if(tt){if(cl(tt)){const V=await tt(B,o),lt=zg(V,L);if(lt&&(Q[k]={...lt,...F(Ll.validate,lt.message)},!s))return P(lt.message),Q}else if(ie(tt)){let V={};for(const lt in tt){if(!Ne(V)&&!s)break;const ct=zg(await tt[lt](B,o),L,lt);ct&&(V={...ct,...F(lt,ct.message)},P(ct.message),s&&(Q[k]=V))}if(!Ne(V)&&(Q[k]={ref:L,...V},!s))return Q}}return P(!0),Q};const N1={mode:sl.onSubmit,reValidateMode:sl.onChange,shouldFocusError:!0};function B1(n={}){let u={...N1,...n},o={submitCount:0,isDirty:!1,isReady:!1,isLoading:cl(u.defaultValues),isValidating:!1,isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,touchedFields:{},dirtyFields:{},validatingFields:{},errors:u.errors||{},disabled:u.disabled||!1};const s={};let f=ie(u.defaultValues)||ie(u.values)?je(u.defaultValues||u.values)||{}:{},c=u.shouldUnregister?{}:je(f),g={action:!1,mount:!1,watch:!1},y={mount:new Set,disabled:new Set,unMount:new Set,array:new Set,watch:new Set},x,p=0;const v={isDirty:!1,dirtyFields:!1,validatingFields:!1,touchedFields:!1,isValidating:!1,isValid:!1,errors:!1};let z={...v};const j={array:pg(),state:pg()},H=u.criteriaMode===sl.all,tt=$=>_=>{clearTimeout(p),p=setTimeout($,_)},k=async $=>{if(!u.disabled&&(v.isValid||z.isValid||$)){const _=u.resolver?Ne((await J()).errors):await W(s,!0);_!==o.isValid&&j.state.next({isValid:_})}},O=($,_)=>{!u.disabled&&(v.isValidating||v.validatingFields||z.isValidating||z.validatingFields)&&(($||Array.from(y.mount)).forEach(q=>{q&&(_?Ft(o.validatingFields,q,_):de(o.validatingFields,q))}),j.state.next({validatingFields:o.validatingFields,isValidating:!Ne(o.validatingFields)}))},Z=($,_=[],q,ut,at=!0,et=!0)=>{if(ut&&q&&!u.disabled){if(g.action=!0,et&&Array.isArray(ft(s,$))){const ht=q(ft(s,$),ut.argA,ut.argB);at&&Ft(s,$,ht)}if(et&&Array.isArray(ft(o.errors,$))){const ht=q(ft(o.errors,$),ut.argA,ut.argB);at&&Ft(o.errors,$,ht),O1(o.errors,$)}if((v.touchedFields||z.touchedFields)&&et&&Array.isArray(ft(o.touchedFields,$))){const ht=q(ft(o.touchedFields,$),ut.argA,ut.argB);at&&Ft(o.touchedFields,$,ht)}(v.dirtyFields||z.dirtyFields)&&(o.dirtyFields=Ya(f,c)),j.state.next({name:$,isDirty:K($,_),dirtyFields:o.dirtyFields,errors:o.errors,isValid:o.isValid})}else Ft(c,$,_)},B=($,_)=>{Ft(o.errors,$,_),j.state.next({errors:o.errors})},L=$=>{o.errors=$,j.state.next({errors:o.errors,isValid:!1})},P=($,_,q,ut)=>{const at=ft(s,$);if(at){const et=ft(c,$,oe(q)?ft(f,$):q);oe(et)||ut&&ut.defaultChecked||_?Ft(c,$,_?et:Sg(at._f)):ct($,et),g.mount&&k()}},Q=($,_,q,ut,at)=>{let et=!1,ht=!1;const Tt={name:$};if(!u.disabled){if(!q||ut){(v.isDirty||z.isDirty)&&(ht=o.isDirty,o.isDirty=Tt.isDirty=K(),et=ht!==Tt.isDirty);const Ot=xn(ft(f,$),_);ht=!!ft(o.dirtyFields,$),Ot?de(o.dirtyFields,$):Ft(o.dirtyFields,$,!0),Tt.dirtyFields=o.dirtyFields,et=et||(v.dirtyFields||z.dirtyFields)&&ht!==!Ot}if(q){const Ot=ft(o.touchedFields,$);Ot||(Ft(o.touchedFields,$,q),Tt.touchedFields=o.touchedFields,et=et||(v.touchedFields||z.touchedFields)&&Ot!==q)}et&&at&&j.state.next(Tt)}return et?Tt:{}},rt=($,_,q,ut)=>{const at=ft(o.errors,$),et=(v.isValid||z.isValid)&&xl(_)&&o.isValid!==_;if(u.delayError&&q?(x=tt(()=>B($,q)),x(u.delayError)):(clearTimeout(p),x=null,q?Ft(o.errors,$,q):de(o.errors,$)),(q?!xn(at,q):at)||!Ne(ut)||et){const ht={...ut,...et&&xl(_)?{isValid:_}:{},errors:o.errors,name:$};o={...o,...ht},j.state.next(ht)}},J=async $=>{O($,!0);const _=await u.resolver(c,u.context,A1($||y.mount,s,u.criteriaMode,u.shouldUseNativeValidation));return O($),_},mt=async $=>{const{errors:_}=await J($);if($)for(const q of $){const ut=ft(_,q);ut?Ft(o.errors,q,ut):de(o.errors,q)}else o.errors=_;return _},W=async($,_,q={valid:!0})=>{for(const ut in $){const at=$[ut];if(at){const{_f:et,...ht}=at;if(et){const Tt=y.array.has(et.name),Ot=at._f&&C1(at._f);Ot&&v.validatingFields&&O([ut],!0);const Zt=await jg(at,y.disabled,c,H,u.shouldUseNativeValidation&&!_,Tt);if(Ot&&v.validatingFields&&O([ut]),Zt[et.name]&&(q.valid=!1,_))break;!_&&(ft(Zt,et.name)?Tt?k1(o.errors,Zt,et.name):Ft(o.errors,et.name,Zt[et.name]):de(o.errors,et.name))}!Ne(ht)&&await W(ht,_,q)}}return q.valid},F=()=>{for(const $ of y.unMount){const _=ft(s,$);_&&(_._f.refs?_._f.refs.every(q=>!mc(q)):!mc(_._f.ref))&&Pt($)}y.unMount=new Set},K=($,_)=>!u.disabled&&($&&_&&Ft(c,$,_),!xn(S(),f)),V=($,_,q)=>w1($,y,{...g.mount?c:oe(_)?f:vl($)?{[$]:_}:_},q,_),lt=$=>Qc(ft(g.mount?c:f,$,u.shouldUnregister?ft(f,$,[]):[])),ct=($,_,q={})=>{const ut=ft(s,$);let at=_;if(ut){const et=ut._f;et&&(!et.disabled&&Ft(c,$,_0(_,et)),at=Mr(et.ref)&&_e(_)?"":_,z0(et.ref)?[...et.ref.options].forEach(ht=>ht.selected=at.includes(ht.value)):et.refs?tu(et.ref)?et.refs.forEach(ht=>{(!ht.defaultChecked||!ht.disabled)&&(Array.isArray(at)?ht.checked=!!at.find(Tt=>Tt===ht.value):ht.checked=at===ht.value||!!at)}):et.refs.forEach(ht=>ht.checked=ht.value===at):Wc(et.ref)?et.ref.value="":(et.ref.value=at,et.ref.type||j.state.next({name:$,values:je(c)})))}(q.shouldDirty||q.shouldTouch)&&Q($,at,q.shouldTouch,q.shouldDirty,!0),q.shouldValidate&&Et($)},wt=($,_,q)=>{for(const ut in _){if(!_.hasOwnProperty(ut))return;const at=_[ut],et=$+"."+ut,ht=ft(s,et);(y.array.has($)||ie(at)||ht&&!ht._f)&&!Ln(at)?wt(et,at,q):ct(et,at,q)}},M=($,_,q={})=>{const ut=ft(s,$),at=y.array.has($),et=je(_);Ft(c,$,et),at?(j.array.next({name:$,values:je(c)}),(v.isDirty||v.dirtyFields||z.isDirty||z.dirtyFields)&&q.shouldDirty&&j.state.next({name:$,dirtyFields:Ya(f,c),isDirty:K($,et)})):ut&&!ut._f&&!_e(et)?wt($,et,q):ct($,et,q),Eg($,y)&&j.state.next({...o}),j.state.next({name:g.mount?$:void 0,values:je(c)})},I=async $=>{g.mount=!0;const _=$.target;let q=_.name,ut=!0;const at=ft(s,q),et=Ot=>{ut=Number.isNaN(Ot)||Ln(Ot)&&isNaN(Ot.getTime())||xn(Ot,ft(c,q,Ot))},ht=$g(u.mode),Tt=$g(u.reValidateMode);if(at){let Ot,Zt;const Yn=_.type?Sg(at._f):y1($),dl=$.type===yg.BLUR||$.type===yg.FOCUS_OUT,Gr=!_1(at._f)&&!u.resolver&&!ft(o.errors,q)&&!at._f.deps||R1(dl,ft(o.touchedFields,q),o.isSubmitted,Tt,ht),Gl=Eg(q,y,dl);Ft(c,q,Yn),dl?(at._f.onBlur&&at._f.onBlur($),x&&x(0)):at._f.onChange&&at._f.onChange($);const Xl=Q(q,Yn,dl),wl=!Ne(Xl)||Gl;if(!dl&&j.state.next({name:q,type:$.type,values:je(c)}),Gr)return(v.isValid||z.isValid)&&(u.mode==="onBlur"?dl&&k():dl||k()),wl&&j.state.next({name:q,...Gl?{}:Xl});if(!dl&&Gl&&j.state.next({...o}),u.resolver){const{errors:bn}=await J([q]);if(et(Yn),ut){const vn=Tg(o.errors,s,q),lu=Tg(bn,s,vn.name||q);Ot=lu.error,q=lu.name,Zt=Ne(bn)}}else O([q],!0),Ot=(await jg(at,y.disabled,c,H,u.shouldUseNativeValidation))[q],O([q]),et(Yn),ut&&(Ot?Zt=!1:(v.isValid||z.isValid)&&(Zt=await W(s,!0)));ut&&(at._f.deps&&Et(at._f.deps),rt(q,Zt,Ot,Xl))}},dt=($,_)=>{if(ft(o.errors,_)&&$.focus)return $.focus(),1},Et=async($,_={})=>{let q,ut;const at=Ka($);if(u.resolver){const et=await mt(oe($)?$:at);q=Ne(et),ut=$?!at.some(ht=>ft(et,ht)):q}else $?(ut=(await Promise.all(at.map(async et=>{const ht=ft(s,et);return await W(ht&&ht._f?{[et]:ht}:ht)}))).every(Boolean),!(!ut&&!o.isValid)&&k()):ut=q=await W(s);return j.state.next({...!vl($)||(v.isValid||z.isValid)&&q!==o.isValid?{}:{name:$},...u.resolver||!$?{isValid:q}:{},errors:o.errors}),_.shouldFocus&&!ut&&Fa(s,dt,$?at:y.mount),ut},S=$=>{const _={...g.mount?c:f};return oe($)?_:vl($)?ft(_,$):$.map(q=>ft(_,q))},X=($,_)=>({invalid:!!ft((_||o).errors,$),isDirty:!!ft((_||o).dirtyFields,$),error:ft((_||o).errors,$),isValidating:!!ft(o.validatingFields,$),isTouched:!!ft((_||o).touchedFields,$)}),nt=$=>{$&&Ka($).forEach(_=>de(o.errors,_)),j.state.next({errors:$?o.errors:{}})},it=($,_,q)=>{const ut=(ft(s,$,{_f:{}})._f||{}).ref,at=ft(o.errors,$)||{},{ref:et,message:ht,type:Tt,...Ot}=at;Ft(o.errors,$,{...Ot,..._,ref:ut}),j.state.next({name:$,errors:o.errors,isValid:!1}),q&&q.shouldFocus&&ut&&ut.focus&&ut.focus()},gt=($,_)=>cl($)?j.state.subscribe({next:q=>$(V(void 0,_),q)}):V($,_,!0),jt=$=>j.state.subscribe({next:_=>{M1($.name,_.name,$.exact)&&D1(_,$.formState||v,Qe,$.reRenderRoot)&&$.callback({values:{...c},...o,..._})}}).unsubscribe,pt=$=>(g.mount=!0,z={...z,...$.formState},jt({...$,formState:z})),Pt=($,_={})=>{for(const q of $?Ka($):y.mount)y.mount.delete(q),y.array.delete(q),_.keepValue||(de(s,q),de(c,q)),!_.keepError&&de(o.errors,q),!_.keepDirty&&de(o.dirtyFields,q),!_.keepTouched&&de(o.touchedFields,q),!_.keepIsValidating&&de(o.validatingFields,q),!u.shouldUnregister&&!_.keepDefaultValue&&de(f,q);j.state.next({values:je(c)}),j.state.next({...o,..._.keepDirty?{isDirty:K()}:{}}),!_.keepIsValid&&k()},Nt=({disabled:$,name:_})=>{(xl($)&&g.mount||$||y.disabled.has(_))&&($?y.disabled.add(_):y.disabled.delete(_))},ae=($,_={})=>{let q=ft(s,$);const ut=xl(_.disabled)||xl(u.disabled);return Ft(s,$,{...q||{},_f:{...q&&q._f?q._f:{ref:{name:$}},name:$,mount:!0,..._}}),y.mount.add($),q?Nt({disabled:xl(_.disabled)?_.disabled:u.disabled,name:$}):P($,!0,_.value),{...ut?{disabled:_.disabled||u.disabled}:{},...u.progressive?{required:!!_.required,min:Ga(_.min),max:Ga(_.max),minLength:Ga(_.minLength),maxLength:Ga(_.maxLength),pattern:Ga(_.pattern)}:{},name:$,onChange:I,onBlur:I,ref:at=>{if(at){ae($,_),q=ft(s,$);const et=oe(at.value)&&at.querySelectorAll&&at.querySelectorAll("input,select,textarea")[0]||at,ht=T1(et),Tt=q._f.refs||[];if(ht?Tt.find(Ot=>Ot===et):et===q._f.ref)return;Ft(s,$,{_f:{...q._f,...ht?{refs:[...Tt.filter(mc),et,...Array.isArray(ft(f,$))?[{}]:[]],ref:{type:et.type,name:$}}:{ref:et}}}),P($,!1,void 0,et)}else q=ft(s,$,{}),q._f&&(q._f.mount=!1),(u.shouldUnregister||_.shouldUnregister)&&!(x1(y.array,$)&&g.action)&&y.unMount.add($)}}},il=()=>u.shouldFocusError&&Fa(s,dt,y.mount),al=$=>{xl($)&&(j.state.next({disabled:$}),Fa(s,(_,q)=>{const ut=ft(s,q);ut&&(_.disabled=ut._f.disabled||$,Array.isArray(ut._f.refs)&&ut._f.refs.forEach(at=>{at.disabled=ut._f.disabled||$}))},0,!1))},Ae=($,_)=>async q=>{let ut;q&&(q.preventDefault&&q.preventDefault(),q.persist&&q.persist());let at=je(c);if(j.state.next({isSubmitting:!0}),u.resolver){const{errors:et,values:ht}=await J();o.errors=et,at=ht}else await W(s);if(y.disabled.size)for(const et of y.disabled)Ft(at,et,void 0);if(de(o.errors,"root"),Ne(o.errors)){j.state.next({errors:{}});try{await $(at,q)}catch(et){ut=et}}else _&&await _({...o.errors},q),il(),setTimeout(il);if(j.state.next({isSubmitted:!0,isSubmitting:!1,isSubmitSuccessful:Ne(o.errors)&&!ut,submitCount:o.submitCount+1,errors:o.errors}),ut)throw ut},Gi=($,_={})=>{ft(s,$)&&(oe(_.defaultValue)?M($,je(ft(f,$))):(M($,_.defaultValue),Ft(f,$,je(_.defaultValue))),_.keepTouched||de(o.touchedFields,$),_.keepDirty||(de(o.dirtyFields,$),o.isDirty=_.defaultValue?K($,je(ft(f,$))):K()),_.keepError||(de(o.errors,$),v.isValid&&k()),j.state.next({...o}))},Vn=($,_={})=>{const q=$?je($):f,ut=je(q),at=Ne($),et=at?f:ut;if(_.keepDefaultValues||(f=q),!_.keepValues){if(_.keepDirtyValues){const ht=new Set([...y.mount,...Object.keys(Ya(f,c))]);for(const Tt of Array.from(ht))ft(o.dirtyFields,Tt)?Ft(et,Tt,ft(c,Tt)):M(Tt,ft(et,Tt))}else{if(Xc&&oe($))for(const ht of y.mount){const Tt=ft(s,ht);if(Tt&&Tt._f){const Ot=Array.isArray(Tt._f.refs)?Tt._f.refs[0]:Tt._f.ref;if(Mr(Ot)){const Zt=Ot.closest("form");if(Zt){Zt.reset();break}}}}for(const ht of y.mount)M(ht,ft(et,ht))}c=je(et),j.array.next({values:{...et}}),j.state.next({values:{...et}})}y={mount:_.keepDirtyValues?y.mount:new Set,unMount:new Set,array:new Set,disabled:new Set,watch:new Set,watchAll:!1,focus:""},g.mount=!v.isValid||!!_.keepIsValid||!!_.keepDirtyValues,g.watch=!!u.shouldUnregister,j.state.next({submitCount:_.keepSubmitCount?o.submitCount:0,isDirty:at?!1:_.keepDirty?o.isDirty:!!(_.keepDefaultValues&&!xn($,f)),isSubmitted:_.keepIsSubmitted?o.isSubmitted:!1,dirtyFields:at?{}:_.keepDirtyValues?_.keepDefaultValues&&c?Ya(f,c):o.dirtyFields:_.keepDefaultValues&&$?Ya(f,$):_.keepDirty?o.dirtyFields:{},touchedFields:_.keepTouched?o.touchedFields:{},errors:_.keepErrors?o.errors:{},isSubmitSuccessful:_.keepIsSubmitSuccessful?o.isSubmitSuccessful:!1,isSubmitting:!1})},eu=($,_)=>Vn(cl($)?$(c):$,_),Yr=($,_={})=>{const q=ft(s,$),ut=q&&q._f;if(ut){const at=ut.refs?ut.refs[0]:ut.ref;at.focus&&(at.focus(),_.shouldSelect&&cl(at.select)&&at.select())}},Qe=$=>{o={...o,...$}},Xi={control:{register:ae,unregister:Pt,getFieldState:X,handleSubmit:Ae,setError:it,_subscribe:jt,_runSchema:J,_focusError:il,_getWatch:V,_getDirty:K,_setValid:k,_setFieldArray:Z,_setDisabledField:Nt,_setErrors:L,_getFieldArray:lt,_reset:Vn,_resetDefaultValues:()=>cl(u.defaultValues)&&u.defaultValues().then($=>{eu($,u.resetOptions),j.state.next({isLoading:!1})}),_removeUnmounted:F,_disableForm:al,_subjects:j,_proxyFormState:v,get _fields(){return s},get _formValues(){return c},get _state(){return g},set _state($){g=$},get _defaultValues(){return f},get _names(){return y},set _names($){y=$},get _formState(){return o},get _options(){return u},set _options($){u={...u,...$}}},subscribe:pt,trigger:Et,register:ae,handleSubmit:Ae,watch:gt,setValue:M,getValues:S,reset:eu,resetField:Gi,clearErrors:nt,unregister:Pt,setError:it,setFocus:Yr,getFieldState:X};return{...Xi,formControl:Xi}}function U1(n={}){const u=Ht.useRef(void 0),o=Ht.useRef(void 0),[s,f]=Ht.useState({isDirty:!1,isValidating:!1,isLoading:cl(n.defaultValues),isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,submitCount:0,dirtyFields:{},touchedFields:{},validatingFields:{},errors:n.errors||{},disabled:n.disabled||!1,isReady:!1,defaultValues:cl(n.defaultValues)?void 0:n.defaultValues});if(!u.current)if(n.formControl)u.current={...n.formControl,formState:s},n.defaultValues&&!cl(n.defaultValues)&&n.formControl.reset(n.defaultValues,n.resetOptions);else{const{formControl:g,...y}=B1(n);u.current={...y,formState:s}}const c=u.current.control;return c._options=n,$1(()=>{const g=c._subscribe({formState:c._proxyFormState,callback:()=>f({...c._formState}),reRenderRoot:!0});return f(y=>({...y,isReady:!0})),c._formState.isReady=!0,g},[c]),Ht.useEffect(()=>c._disableForm(n.disabled),[c,n.disabled]),Ht.useEffect(()=>{n.mode&&(c._options.mode=n.mode),n.reValidateMode&&(c._options.reValidateMode=n.reValidateMode)},[c,n.mode,n.reValidateMode]),Ht.useEffect(()=>{n.errors&&(c._setErrors(n.errors),c._focusError())},[c,n.errors]),Ht.useEffect(()=>{n.shouldUnregister&&c._subjects.state.next({values:c._getWatch()})},[c,n.shouldUnregister]),Ht.useEffect(()=>{if(c._proxyFormState.isDirty){const g=c._getDirty();g!==s.isDirty&&c._subjects.state.next({isDirty:g})}},[c,s.isDirty]),Ht.useEffect(()=>{n.values&&!xn(n.values,o.current)?(c._reset(n.values,c._options.resetOptions),o.current=n.values,f(g=>({...g}))):c._resetDefaultValues()},[c,n.values]),Ht.useEffect(()=>{c._state.mount||(c._setValid(),c._state.mount=!0),c._state.watch&&(c._state.watch=!1,c._subjects.state.next({...c._formState})),c._removeUnmounted()}),u.current.formState=S1(s,c),u.current}const L1=(n=Vl.standardWidth)=>({required:"Šírka je povinná",min:{value:be.minWidth,message:`Min ${be.minWidth}mm`},max:{value:Math.min(be.maxWidth,n),message:`Max ${Math.min(be.maxWidth,n)}mm (veľkosť dosky)`}}),H1=(n=Vl.standardHeight)=>({required:"Výška je povinná",min:{value:be.minHeight,message:`Min ${be.minHeight}mm`},max:{value:Math.min(be.maxHeight,n),message:`Max ${Math.min(be.maxHeight,n)}mm (veľkosť dosky)`}}),q1=()=>({required:"Počet je povinný",min:{value:be.minQuantity,message:`Min ${be.minQuantity}`},max:{value:be.maxQuantity,message:`Max ${be.maxQuantity}`}}),V1=n=>({width:Number(n.width),height:Number(n.height),quantity:Number(n.quantity),label:n.label||void 0,orientation:n.rotatable?"rotatable":"fixed",blockId:n.blockId||void 0,woodType:n.woodType||void 0,edges:n.edges&&Object.values(n.edges).some(u=>u&&u!=="none")?{top:n.edges.top||"none",right:n.edges.right||"none",bottom:n.edges.bottom||"none",left:n.edges.left||"none"}:void 0}),Y1=(n="primary",u)=>{if(u)return{bg:N.textMuted,color:"white",border:N.textMuted,hoverBg:N.textMuted};switch(n){case"primary":return{bg:N.primary,color:"white",border:N.primary,hoverBg:N.hoverPrimary};case"secondary":return{bg:N.textMuted,color:"white",border:N.textMuted,hoverBg:N.textSecondary};case"danger":return{bg:N.danger,color:"white",border:N.danger,hoverBg:"#c0392b"};case"success":return{bg:N.success,color:"white",border:N.success,hoverBg:"#219653"};case"ghost":return{bg:"transparent",color:N.textPrimary,border:N.border,hoverBg:N.hoverLight};default:return{bg:N.primary,color:"white",border:N.primary,hoverBg:N.hoverPrimary}}},G1=(n="medium")=>{switch(n){case"small":return{padding:Dr.button.padding,fontSize:vt.fontSize.xs};case"large":return{padding:"12px 24px",fontSize:vt.fontSize.base};case"medium":default:return{padding:"8px 16px",fontSize:vt.fontSize.sm}}},nl=E.button`
  ${n=>{const u=Y1(n.variant,n.disabled),o=G1(n.size);return`
      background-color: ${u.bg};
      color: ${u.color};
      border: 1px solid ${u.border};
      border-radius: ${ve.sm}px;
      padding: ${o.padding};
      font-size: ${o.fontSize};
      font-weight: ${vt.fontWeight.semibold};
      cursor: ${n.disabled?"not-allowed":"pointer"};
      transition: background-color 0.2s, transform 0.1s;
      display: inline-block;
      text-align: center;
      width: ${n.fullWidth?"100%":"auto"};

      &:hover {
        background-color: ${n.disabled?u.bg:u.hoverBg};
        ${!n.disabled&&"transform: translateY(-1px);"}
      }

      &:active {
        ${!n.disabled&&"transform: translateY(0px);"}
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }
    `}}
`;E(nl).attrs({variant:"primary"})`
  /* Legacy component, use Button variant="primary" instead */
`;E(nl).attrs({variant:"secondary"})`
  /* Legacy component, use Button variant="secondary" instead */
`;E(nl).attrs({variant:"danger"})`
  /* Legacy component, use Button variant="danger" instead */
`;E(nl).attrs({variant:"primary",size:"small"})`
  /* Legacy component, use Button variant="primary" size="small" instead */
`;const X1=(n="medium")=>{switch(n){case"small":return ot.lg;case"large":return ot.xxxl;case"none":return 0;case"medium":default:return Dr.card.padding}},Rc=E.div`
  ${n=>{const u=X1(n.$padding);let o="none",s=n.$noBorder?"none":`1px solid ${N.border}`;switch(n.$variant){case"elevated":o=qi.medium;break;case"outlined":s=n.$noBorder?"none":`1px solid ${N.border}`;break;case"default":default:o=qi.light,s=n.$noBorder?"none":`1px solid ${N.border}`}return`
      background: ${N.cardBackground};
      border-radius: ${Dr.card.borderRadius}px;
      padding: ${u}px;
      box-shadow: ${o};
      border: ${s};
      margin-bottom: ${Dr.card.marginBottom}px;
      width: ${n.$fullWidth?"100%":"auto"};
    `}}
`,Oc=E.h2`
  color: ${N.textPrimary};
  margin-top: 0;
  margin-bottom: ${ot.xl}px;
  font-size: ${vt.fontSize.xl};
  font-weight: ${vt.fontWeight.semibold};
`;E.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${ot.lg}px;
  padding-bottom: ${ot.md}px;
  border-bottom: 1px solid ${N.border};
`;E.div`
  /* Card body styles */
`;E.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${ot.xl}px;
  padding-top: ${ot.md}px;
  border-top: 1px solid ${N.border};
`;const Fc=E.div`
  display: flex;
  flex-direction: ${n=>n.$direction||"column"};
  gap: ${n=>n.$gap!==void 0?`${n.$gap}px`:`${ot.md}px`};
  margin-bottom: ${n=>n.$marginBottom!==void 0?`${n.$marginBottom}px`:`${ot.lg}px`};
`,M0=(n="medium")=>{switch(n){case"small":return{padding:ql.padding.sm,height:ql.height.sm,fontSize:vt.fontSize.xs};case"large":return{padding:ql.padding.lg,height:ql.height.lg,fontSize:vt.fontSize.base};case"medium":default:return{padding:ql.padding.md,height:ql.height.md,fontSize:vt.fontSize.sm}}},Za=E.input`
  ${n=>{const u=M0(n.$size);return`
      padding: ${u.padding};
      height: 36px; /* Fixed height to match selectors exactly */
      font-size: ${u.fontSize};
      border: 1px solid ${n.$hasError?N.danger:N.borderLight};
      border-radius: ${ve.sm}px;
      width: 100%; /* Always use 100% width */
      box-sizing: border-box;
      background-color: white;
      appearance: textfield; /* Remove spinner arrows for number inputs in Firefox */

      /* Remove spinner arrows for number inputs in Chrome/Safari/Edge */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:focus {
        outline: none;
        border-color: ${n.$hasError?N.danger:N.primary};
        box-shadow: 0 0 0 2px ${n.$hasError?"rgba(231, 76, 60, 0.2)":"rgba(52, 152, 219, 0.2)"};
      }

      &:disabled {
        background-color: ${N.hoverLight};
        cursor: not-allowed;
      }

      &::placeholder {
        color: ${N.textMuted};
      }
    `}}
`;E.textarea`
  ${n=>{const u=M0(n.$size);return`
      padding: ${u.padding};
      font-size: ${u.fontSize};
      border: 1px solid ${n.$hasError?N.danger:N.borderLight};
      border-radius: ${ve.sm}px;
      width: ${n.$fullWidth?"100%":"auto"};
      min-height: ${parseInt(u.height)*2}px;
      resize: vertical;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: ${n.$hasError?N.danger:N.primary};
        box-shadow: 0 0 0 2px ${n.$hasError?"rgba(231, 76, 60, 0.2)":"rgba(52, 152, 219, 0.2)"};
      }

      &:disabled {
        background-color: ${N.hoverLight};
        cursor: not-allowed;
      }

      &::placeholder {
        color: ${N.textMuted};
      }
    `}}
`;E.label`
  display: block;
  font-size: ${vt.fontSize.sm};
  font-weight: ${vt.fontWeight.semibold};
  color: ${N.textPrimary};
  margin-bottom: 4px;
`;const Q1=Fc;E(Za).attrs({type:"number"})`
  /* Additional number input specific styles */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;const Z1=(n="medium")=>{switch(n){case"small":return{padding:"4px 6px",height:ql.height.sm,fontSize:vt.fontSize.xs};case"large":return{padding:"12px 16px",height:ql.height.lg,fontSize:vt.fontSize.base};case"medium":default:return{padding:"8px 12px",height:ql.height.md,fontSize:vt.fontSize.sm}}},Jc=E.select`
  ${n=>{const u=Z1(n.$size);return`
      padding: ${u.padding};
      height: 36px; /* Fixed height to match inputs exactly */
      font-size: ${u.fontSize};
      border: 1px solid ${n.$hasError?N.danger:N.borderLight};
      border-radius: ${ve.sm}px;
      width: ${n.$fullWidth,"100%"}; /* Always use 100% width */
      background-color: white;
      cursor: pointer;
      appearance: auto; /* Show the default dropdown icon */
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: ${n.$hasError?N.danger:N.primary};
        box-shadow: 0 0 0 2px ${n.$hasError?"rgba(231, 76, 60, 0.2)":"rgba(52, 152, 219, 0.2)"};
      }

      &:disabled {
        background-color: ${N.hoverLight};
        cursor: not-allowed;
      }
    `}}
`;E.label`
  display: block;
  font-size: ${vt.fontSize.sm};
  font-weight: ${vt.fontWeight.semibold};
  color: ${N.textPrimary};
  margin-bottom: 4px;
`;E.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
`;E.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;E.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  pointer-events: none;
`;E.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: ${n=>n.$checked?N.primary:"white"};
  border: 1px solid
    ${n=>n.$hasError?N.danger:n.$checked?N.primary:N.borderLight};
  border-radius: 3px;
  transition: all 150ms;
  cursor: ${n=>n.$disabled?"not-allowed":"pointer"};
  opacity: ${n=>n.$disabled?.6:1};

  &:hover {
    border-color: ${n=>n.$disabled?N.borderLight:N.primary};
  }

  &::after {
    content: '';
    display: ${n=>n.$checked?"block":"none"};
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
  }
`;E.label`
  padding-left: 8px;
  font-size: ${vt.fontSize.sm};
  color: ${n=>n.$disabled?N.textMuted:N.textPrimary};
  cursor: ${n=>n.$disabled?"not-allowed":"pointer"};
`;E.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;E.div`
  display: flex;
  border-bottom: 1px solid ${N.border};
  background: ${N.hoverLight};
  border-top-left-radius: ${ve.md}px;
  border-top-right-radius: ${ve.md}px;
  overflow: hidden;
`;const R0=E.button`
  padding: 12px 16px;
  border: none;
  background: ${n=>n.$active?"white":"transparent"};
  color: ${n=>n.$disabled?N.textMuted:n.$active?N.textPrimary:N.textSecondary};
  font-weight: ${n=>n.$active?vt.fontWeight.semibold:vt.fontWeight.normal};
  font-size: ${vt.fontSize.sm};
  cursor: ${n=>n.$disabled?"not-allowed":"pointer"};
  position: relative;
  transition: all 0.2s ease;
  flex: 1;
  text-align: center;

  ${n=>n.$active&&`
    border-bottom: 2px solid ${N.primary};
    margin-bottom: -1px;
  `}

  &:hover {
    background: ${n=>n.$disabled?"transparent":n.$active?"white":N.hoverLight};
  }

  ${n=>n.$hasIndicator&&`
    &::after {
      content: '';
      position: absolute;
      top: 10px;
      right: 10px;
      width: 8px;
      height: 8px;
      background-color: ${N.primary};
      border-radius: 50%;
    }
  `}
`;E.div`
  padding: ${ot.xl}px;
  background: white;
  border-bottom-left-radius: ${ve.md}px;
  border-bottom-right-radius: ${ve.md}px;
  border: 1px solid ${N.border};
  border-top: none;
`;E.div`
  display: ${n=>n.$active?"block":"none"};
`;E(R0)`
  padding: 8px 16px;
  border: 2px solid ${N.primary};
  border-radius: ${ve.md}px;
  background: ${n=>n.$active?N.primary:"white"};
  color: ${n=>n.$active?"white":N.primary};
  margin: 0 4px;

  &:hover {
    background: ${n=>n.$active?N.hoverPrimary:N.hoverLight};
  }
`;E(R0)`
  /* Legacy TabButton from VisualEnhancementEditor */
`;const W1=E.label`
  font-size: ${vt.fontSize.sm};
  font-weight: ${vt.fontWeight.semibold};
  color: ${n=>n.$hasError?N.danger:N.textPrimary};

  ${n=>n.$required&&`
    &::after {
      content: "*";
      color: ${N.danger};
      margin-left: 4px;
    }
  `}
`,K1=E.div`
  color: ${N.danger};
  font-size: ${vt.fontSize.xs};
  margin-top: ${ot.sm}px;
`,F1=E.div`
  color: ${N.textSecondary};
  font-size: ${vt.fontSize.xs};
  margin-top: ${ot.sm}px;
`,yn=({label:n,htmlFor:u,children:o,error:s,hint:f,required:c})=>d.jsxs(Fc,{children:[d.jsx(W1,{htmlFor:u,$hasError:!!s,$required:c,children:n}),o,s&&d.jsx(K1,{children:s}),f&&!s&&d.jsx(F1,{children:f})]}),Ic=E.div`
  padding: ${ot.lg}px;
  background: ${n=>n.$selected?"#e8f4fd":N.cardBackground};
  border-radius: ${ve.md}px;

  ${n=>n.$interactive&&`
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: ${n.$selected?"#d3eafc":N.hoverLight};
      transform: translateY(-1px);
      box-shadow: ${qi.medium};
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${n=>n.$border&&`
    border: 1px solid ${n.$selected?N.primary:N.border};
  `}
`;E(Ic)`
  box-shadow: ${n=>n.$selected?qi.medium:qi.light};
  border: 1px solid
    ${n=>n.$selected?N.primary:N.border};
  margin-bottom: ${ot.md}px;
`;E.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${ot.lg}px;
`;E.div`
  display: flex;
  flex-direction: column;
  gap: ${ot.md}px;
`;const Pc=(n="md")=>{switch(n){case"xs":return ot.xs;case"sm":return ot.sm;case"lg":return ot.lg;case"xl":return ot.xl;case"xxl":return ot.xxl;case"md":default:return ot.md}},O0=E.div`
  display: grid;
  grid-template-columns: ${n=>typeof n.$columns=="number"?`repeat(${n.$columns}, 1fr)`:typeof n.$columns=="string"?n.$columns:"repeat(auto-fill, minmax(200px, 1fr))"};
  gap: ${n=>Pc(n.$gap)}px;
  align-items: ${n=>n.$alignItems||"stretch"};
  justify-content: ${n=>n.$justifyContent||"start"};
`;E.div`
  display: flex;
  flex-direction: row;
  gap: ${n=>Pc(n.$gap)}px;
  align-items: ${n=>n.$alignItems||"center"};
  justify-content: ${n=>n.$justifyContent||"start"};
  flex-wrap: wrap;
`;E.div`
  display: flex;
  flex-direction: column;
  gap: ${n=>Pc(n.$gap)}px;
  align-items: ${n=>n.$alignItems||"stretch"};
  justify-content: ${n=>n.$justifyContent||"start"};
`;E(O0)`
  @media (max-width: ${Vi.tablet}) {
    grid-template-columns: ${n=>n.$tabletColumns?typeof n.$tabletColumns=="number"?`repeat(${n.$tabletColumns}, 1fr)`:n.$tabletColumns:"repeat(2, 1fr)"};
  }

  @media (max-width: ${Vi.mobile}) {
    grid-template-columns: ${n=>n.$mobileColumns?typeof n.$mobileColumns=="number"?`repeat(${n.$mobileColumns}, 1fr)`:n.$mobileColumns:"1fr"};
  }
`;const J1=E(O0).attrs({$gap:"lg"})`
  /* Custom styling for parts list layout */
  grid-template-columns: 1fr;
  align-items: stretch;

  @media (max-width: ${Vi.tablet}) {
    grid-template-columns: 1fr;
  }
`,I1=(n="normal",u)=>{if(u)return u;switch(n){case"title":case"subtitle":return N.textPrimary;case"caption":case"info":return N.textSecondary;case"detail":return N.textMuted;case"label":return N.textPrimary;case"error":return N.danger;case"success":return N.success;case"normal":default:return N.textPrimary}},P1=(n="normal",u)=>{if(u)return vt.fontSize[u];switch(n){case"title":return vt.fontSize["2xl"];case"subtitle":return vt.fontSize.lg;case"caption":case"info":return vt.fontSize.sm;case"detail":case"label":return vt.fontSize.xs;case"normal":default:return vt.fontSize.base}},tv=(n="normal",u)=>{if(u)return vt.fontWeight[u];switch(n){case"title":case"label":return vt.fontWeight.semibold;case"subtitle":return vt.fontWeight.medium;case"normal":case"caption":case"info":case"detail":default:return vt.fontWeight.normal}},$l=E.span`
  color: ${n=>I1(n.$variant,n.$color)};
  font-size: ${n=>P1(n.$variant,n.$size)};
  font-weight: ${n=>tv(n.$variant,n.$weight)};
  text-align: ${n=>n.$align||"left"};
  ${n=>n.$truncate&&`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  `}
  ${n=>n.$uppercase&&"text-transform: uppercase;"}
`,ev=E($l).attrs({$variant:"title"})`
  display: block;
  margin-bottom: 12px;
`;E($l).attrs({$variant:"subtitle"})`
  display: block;
  margin-bottom: 8px;
`;E($l).attrs({$variant:"caption"})``;E($l).attrs({$variant:"info"})``;E($l).attrs({$variant:"detail"})``;E($l).attrs({$variant:"label"})``;E($l).attrs({$variant:"error"})``;E($l).attrs({$variant:"success"})``;E(ev)`
  font-size: ${vt.fontSize.lg};
  margin-top: 16px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${N.border};
`;const lv=E.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${ot.xxxl}px;
  text-align: center;
  background-color: ${N.hoverLight};
  border-radius: 8px;
  border: 1px dashed ${N.border};
  margin: ${ot.xl}px 0;
`,nv=E.div`
  font-size: 2.5rem;
  color: ${N.textMuted};
  margin-bottom: ${ot.lg}px;
`,iv=E($l).attrs({$variant:"subtitle",$weight:"semibold"})`
  margin-bottom: ${ot.md}px;
`,av=E($l).attrs({$variant:"caption"})`
  max-width: 400px;
  margin-bottom: ${ot.xl}px;
`,uv=({title:n,message:u,icon:o,action:s})=>d.jsxs(lv,{children:[o&&d.jsx(nv,{children:o}),n&&d.jsx(iv,{children:n}),d.jsx(av,{children:u}),s&&s]}),rv=(n="medium")=>{switch(n){case"small":return{padding:"4px 8px",fontSize:vt.fontSize.xs};case"large":return{padding:"12px 24px",fontSize:vt.fontSize.base};case"medium":default:return{padding:"8px 16px",fontSize:vt.fontSize.sm}}},ov=E.button`
  ${n=>{const u=rv(n.$size);return`
      padding: ${u.padding};
      font-size: ${u.fontSize};
      background-color: ${n.$active?N.primary:"white"};
      color: ${n.$active?"white":N.textPrimary};
      border: 1px solid ${n.$active?N.primary:N.border};
      cursor: ${n.$disabled?"not-allowed":"pointer"};
      transition: all 0.2s;
      opacity: ${n.$disabled?.6:1};

      &:hover {
        background-color: ${n.$active?N.hoverPrimary:N.hoverLight};
        ${!n.$active&&`color: ${N.textPrimary};`}
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
      }
    `}}
`;E.div`
  display: inline-flex;
  border-radius: ${ve.sm}px;
  overflow: hidden;

  ${ov} {
    border-radius: 0;
    margin-right: -1px;

    &:first-child {
      border-top-left-radius: ${ve.sm}px;
      border-bottom-left-radius: ${ve.sm}px;
    }

    &:last-child {
      border-top-right-radius: ${ve.sm}px;
      border-bottom-right-radius: ${ve.sm}px;
      margin-right: 0;
    }
  }
`;const sv=(n="medium")=>{switch(n){case"small":return{width:30,height:16,circle:12};case"large":return{width:50,height:26,circle:22};case"medium":default:return{width:40,height:20,circle:16}}},k0=E.label`
  display: inline-flex;
  align-items: center;
  gap: ${ot.md}px;
  cursor: ${n=>n.$disabled?"not-allowed":"pointer"};
  user-select: none;
  opacity: ${n=>n.$disabled?.6:1};
`,N0=E.div`
  ${n=>{const{width:u,height:o,circle:s}=sv(n.$size);return`
      position: relative;
      width: ${u}px;
      height: ${o}px;
      background-color: ${n.$checked?N.primary:N.textMuted};
      border-radius: ${o}px;
      transition: background-color 0.2s ease;

      &::after {
        content: '';
        position: absolute;
        top: ${(o-s)/2}px;
        left: ${n.$checked?u-s-(o-s)/2:(o-s)/2}px;
        width: ${s}px;
        height: ${s}px;
        background-color: white;
        border-radius: 50%;
        transition: left 0.2s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }
    `}}
`,B0=E.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`,U0=E.span`
  font-size: 0.875rem;
  color: ${N.textPrimary};
`,L0=({checked:n,onChange:u,disabled:o=!1,size:s="medium",label:f,name:c,id:g})=>{const y=x=>{o||u(x.target.checked)};return d.jsxs(k0,{$disabled:o,children:[d.jsx(B0,{checked:n,onChange:y,disabled:o,name:c,id:g}),d.jsx(N0,{$checked:n,$disabled:o,$size:s}),f&&d.jsx(U0,{children:f})]})};Ht.forwardRef((n,u)=>{const[o,s]=Ht.useState(n.value||!1),f=c=>{s(c.target.checked),n.onChange&&n.onChange(c)};return Ht.useEffect(()=>{n.value!==void 0&&s(n.value)},[n.value]),d.jsxs(k0,{$disabled:n.disabled,children:[d.jsx(B0,{ref:u,checked:o,onChange:f,disabled:n.disabled,name:n.name,id:n.id}),d.jsx(N0,{$checked:o,$disabled:n.disabled,$size:n.size}),n.label&&d.jsx(U0,{children:n.label})]})});const cv=(n="medium")=>{switch(n){case"small":return{padding:`${ot.xs}px ${ot.sm}px`,fontSize:"0.75rem",minSize:16};case"large":return{padding:`${ot.sm}px ${ot.lg}px`,fontSize:"1rem",minSize:32};case"medium":default:return{padding:`${ot.sm}px ${ot.md}px`,fontSize:"0.875rem",minSize:24}}},fv=(n="rounded")=>{switch(n){case"pill":return"9999px";case"square":return"0";case"circle":return"50%";case"rounded":default:return`${ve.sm}px`}},H0=E.span`
  ${n=>{const u=cv(n.$size),o=fv(n.$shape),s=n.$color||N.primary,f=n.$variant==="outlined"?s:"#fff";return`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: ${u.padding};
      font-size: ${u.fontSize};
      border-radius: ${o};
      background-color: ${n.$variant==="outlined"?"transparent":s};
      color: ${f};
      border: ${n.$variant==="outlined"?`1px solid ${s}`:"none"};
      font-weight: 500;

      ${n.$shape==="circle"&&`
        width: ${u.minSize}px;
        height: ${u.minSize}px;
      `}
    `}}
`,q0=E.div`
  ${n=>{const u=n.$size==="small"?14:n.$size==="large"?20:16;return`
      width: ${u}px;
      height: ${u}px;
      border-radius: 3px;
      background-color: ${n.$color||N.primary};
      display: inline-block;
      margin-right: ${ot.md}px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
    `}}
`;E(H0).attrs({$shape:"pill",$size:"small"})`
  ${n=>{const u=()=>{switch(n.$status){case"success":return N.success;case"warning":return N.warning;case"error":return N.danger;case"info":return N.info;case"neutral":default:return N.textMuted}};return`
      background-color: ${n.$variant==="outlined"?"transparent":u()};
      color: ${n.$variant==="outlined"?u():"#fff"};
      border: ${n.$variant==="outlined"?`1px solid ${u()}`:"none"};
    `}}
`;E.div`
  background-color: ${N.textMuted};
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  padding: 2px 6px;
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;

  ${n=>n.$count>0&&`
    background-color: ${N.primary};
  `}
`;const dv=E.div`
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: ${ot.sm}px ${ot.md}px;
  border-radius: ${ve.sm}px;
  font-size: 0.75rem;
  font-weight: 400;
  z-index: ${E0.tooltip};
  box-shadow: ${qi.light};
  white-space: nowrap;
  pointer-events: none;
  opacity: ${n=>n.$visible?1:0};
  visibility: ${n=>n.$visible?"visible":"hidden"};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  max-width: 250px;

  ${n=>{switch(n.$position){case"bottom":return`
          top: calc(100% + 5px);
          left: 50%;
          transform: translateX(-50%);
        `;case"left":return`
          right: calc(100% + 5px);
          top: 50%;
          transform: translateY(-50%);
        `;case"right":return`
          left: calc(100% + 5px);
          top: 50%;
          transform: translateY(-50%);
        `;case"top":default:return`
          bottom: calc(100% + 5px);
          left: 50%;
          transform: translateX(-50%);
        `}}}
`,hv=E.div`
  position: relative;
  display: inline-flex;
`,mv={corners:"#27ae60",edges:"#3498db",lshape:"#f39c12",frame:"#9b59b6"},gv=E(H0)`
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  font-weight: bold;
  cursor: help;
  color: ${n=>n.$type==="lshape"?"#000":"#fff"};
  background-color: ${n=>mv[n.$type]};
  border-radius: 50%;
`,gr=({type:n,tooltipText:u,children:o})=>{const[s,f]=$t.useState(!1);return d.jsxs(hv,{onMouseEnter:()=>f(!0),onMouseLeave:()=>f(!1),children:[d.jsx(gv,{$type:n,$shape:"circle",$size:"small",children:o}),d.jsx(dv,{$visible:s,children:u})]})};E.div`
  display: flex;
  align-items: center;
  gap: ${ot.md}px;
`;E.div`
  background: #fee;
  color: ${N.danger};
  padding: ${ot.md}px ${ot.lg}px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-top: ${ot.sm}px;
  border: 1px solid #fcc;
`;const V0=E(Jc).attrs({$size:"small"})`
  min-width: 90px;
  height: 36px !important; /* Match the input height exactly */
  padding: 4px 8px;

  &:focus {
    border-color: ${N.primary};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`,Y0=E(Jc).attrs({$size:"small"})`
  min-width: 80px;
  height: 36px !important; /* Match the input height exactly */
  padding: 4px 8px;

  &:focus {
    border-color: ${N.success};
    box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
  }
`;E.label`
  display: flex;
  align-items: center;
  gap: ${ot.sm}px;
  font-size: 0.8rem;
  cursor: pointer;

  input {
    margin: 0;
  }
`;const yv=({checked:n,onChange:u,disabled:o})=>d.jsx(L0,{checked:n,onChange:u,disabled:o,size:"small",label:"Rotácia"});E(nl).attrs({variant:"primary"})``;E(nl).attrs({variant:"secondary"})``;E(nl).attrs({variant:"danger"})``;E(nl).attrs({size:"small"})``;const pv=E.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  /* Full width containers that span all columns */
  .full-width {
    grid-column: 1 / -1;
    width: 100%;
  }
`,xv=E.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`,bv=E.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 8px;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
`,vv=E.div`
  flex: 1;
  max-width: 300px;
  min-width: 200px;

  @media (max-width: 768px) {
    max-width: none;
    min-width: auto;
  }
`,Sv=E.div`
  grid-column: 1 / -1;
  width: 100%;

  /* Ensure the FormField and its children take full width */
  > * {
    width: 100%;

    /* Target the FormGroup inside FormField */
    > div {
      width: 100%;
      margin-bottom: 0; /* Remove default margin since we're in a grid */

      /* Target the EdgeFormSelector container */
      > div:last-child {
        width: 100%;
      }
    }
  }
`;E(Q1)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end; // Align items to bottom for consistent heights
  min-height: 70px; // Ensure consistent height for all form fields

  /* For block selector, wood type selector and rotation fields */
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    display: flex;
    flex-direction: column;
    justify-content: flex-end; // Align all fields to bottom consistently
  }

  /* For rotation field specifically - center the toggle vertically */
  &:nth-child(6) {
    display: flex;
    flex-direction: column;

    /* The toggle container styling is now handled by ToggleWrapper */
    .toggle-container {
      display: flex;
      align-items: center;
    }
  }

  &.full-width {
    grid-column: 1 / -1;
    align-items: stretch;
  }

  /* Apply consistent styling for all inputs including selects */
  select,
  input[type='text'],
  input[type='number'] {
    width: 100%;
    height: 36px; // Consistent height for all inputs
    box-sizing: border-box;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  /* Ensure the form fields are styled consistently with the parts list */
  .form-selector {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.875rem;
    background-color: white;
  }
`;E(Ic)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto auto auto auto auto;
  gap: 12px;
  align-items: center;
`;const $v=E(Ic)`
  padding: 16px;
  border-radius: 8px;
  background: white;
  border: 2px solid #e1e8ed;
  display: flex;
  flex-direction: row;
  gap: 16px;
  transition: all 0.2s ease;
  position: relative;
  min-height: 160px; /* Ensure consistent card height */
  cursor: pointer;

  &:hover {
    border-color: #3498db;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
    transform: translateY(-2px);
  }

  ${({$selected:n})=>n&&`
    border-color: #3498db;
    background: #f8fbff;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
  `}
`,wv=E.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0; /* Allow content to shrink */
`,Ev=E.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 140px;
  height: 100%;
  min-height: 140px;
  border-left: 1px solid #e1e8ed;
  padding-left: 16px;
  margin-left: 16px;
`;E.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;const Tv=E.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2px;
  line-height: 1.3;
`,zv=E.div`
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 4px;
  font-weight: 500;
`,jv=E.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`,gc=E.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;

  .value {
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
    line-height: 1.2;
  }

  .label {
    font-size: 0.75rem;
    color: #6c757d;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`,Av=E.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;

  /* Ensure consistent width for all child elements */
  > * {
    min-width: 0; /* Allow shrinking */
  }

  /* Special handling for selectors to ensure consistent sizing */
  select {
    width: 100%;
    height: 32px;
    box-sizing: border-box;
  }

  @media (max-width: ${Vi.tablet}) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`,Cv=E.div`
  display: flex;
  justify-content: flex-end;
`,_v=E.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%);
  border-radius: 8px;
  border: 1px solid #d6ebf7;

  @media (max-width: ${Vi.tablet}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`,yc=E.div`
  text-align: center;
  padding: 8px;

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1.2;
  }

  .label {
    font-size: 0.75rem;
    color: #5a6c7d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
    font-weight: 500;
  }
`;E.div`
  position: relative;
`;const Dv=E.div`
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 400;
  z-index: 2000;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${n=>n.$visible?1:0};
  visibility: ${n=>n.$visible?"visible":"hidden"};
  transition: opacity 0.2s ease, visibility 0.2s ease;
`;E.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;E.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  cursor: help;

  background: ${n=>{switch(n.$type){case"corners":return"#28a745";case"edges":return"#007bff";case"lshape":return"#ffc107";case"frame":return"#6f42c1";default:return"#6c757d"}}};

  color: ${n=>n.$type==="lshape"?"#000":"#fff"};
`;E(Dv)`
  transform: translateY(-100%);
  margin-top: -8px;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #333;
  }
`;E.span`
  font-size: 0.7rem;
  color: #bdc3c7;
`;const Mv=E.div`
  margin-top: ${n=>n.$marginTop||0}px;
`;E.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;const Rv=E.div`
  background: #fee;
  color: #c33;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-top: 4px;
  border: 1px solid #fcc;
`,G0=E.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  /* Ensure the selector takes full width */
  select {
    flex: 1;
    min-width: 0;
  }
`,Ov=E.div`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({$color:n,$blockId:u})=>{if(n)return n;const o=["#3498db","#e74c3c","#2ecc71","#f39c12","#9b59b6","#1abc9c","#34495e","#e67e22"];return o[u%o.length]}};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`,kv=[{value:"none",label:"Bez hrany"},{value:"abs-1mm",label:"ABS 1mm"},{value:"abs-2mm",label:"ABS 2mm"}],Nv={top:"Horná hrana",right:"Pravá hrana",bottom:"Dolná hrana",left:"Ľavá hrana"},Bv=[{value:"none",label:"Bez úpravy"},{value:"bevel",label:"Zokosenie"},{value:"round",label:"Zaoblenie"}],Uv=["topLeft","topRight","bottomLeft","bottomRight"],Lv=E.div`
  display: flex;
  flex-direction: column;
  gap: ${ot.sm}px;
  width: 100%;
`,Hv=E.div`
  display: grid;
  gap: ${ot.sm}px;
  width: 100%;

  ${n=>n.$orientation==="horizontal"?`
      grid-template-columns: repeat(4, 1fr);

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
    `:`
      grid-template-columns: 1fr;
    `}
`,qv=E.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`,Vv=E.label`
  font-size: ${n=>n.$size==="small"?vt.fontSize.xs:vt.fontSize.sm};
  font-weight: ${vt.fontWeight.semibold};
  color: ${N.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,X0=({edges:n={},onEdgeUpdate:u,size:o="small",orientation:s="horizontal"})=>{const f=c=>d.jsxs(qv,{children:[d.jsx(Vv,{$size:o,children:Nv[c]}),d.jsx(Jc,{value:n[c]||"none",onChange:g=>u(c,g.target.value),$size:o,$fullWidth:!0,children:kv.map(g=>d.jsx("option",{value:g.value,children:g.label},g.value))})]},c);return d.jsx(Lv,{$orientation:s,children:d.jsxs(Hv,{$orientation:s,children:[f("top"),f("right"),f("bottom"),f("left")]})})},Yv=E.div`
  height: 36px; /* Match the input height */
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  /* Position toggle to align with input center - optical adjustment */
  padding-top: 9px; /* Slightly less than mathematical center for better visual alignment */
`,Gv=({onAddPart:n,existingParts:u=[]})=>{var H,tt,k;const o=Gg(u),{register:s,handleSubmit:f,reset:c,watch:g,setValue:y,formState:{errors:x,isValid:p}}=U1({mode:"onChange",defaultValues:{quantity:zr.quantity,rotatable:!0,woodType:Yl.defaultWoodType,blockId:void 0,edges:{top:"none",right:"none",bottom:"none",left:"none"}}}),v=g("edges"),z=(O,Z)=>{const B=`edges.${O}`;y(B,Z,{shouldValidate:!0})},j=O=>{const Z=V1({...O,width:Number(O.width),height:Number(O.height),quantity:Number(O.quantity),blockId:O.blockId||void 0});n(Z),c({quantity:zr.quantity,rotatable:!0,woodType:Yl.defaultWoodType,blockId:void 0,width:void 0,height:void 0,label:"",edges:{top:"none",right:"none",bottom:"none",left:"none"}})};return d.jsxs(Rc,{children:[d.jsxs(xv,{children:[d.jsx(Oc,{children:"Pridať nový diel"}),d.jsx(vv,{children:d.jsx(yn,{label:"Názov dielu (voliteľné)",htmlFor:"label",children:d.jsx(Za,{id:"label",type:"text",placeholder:"napr. Polička, Dvierka...",...s("label")})})})]}),d.jsxs("form",{onSubmit:f(j),children:[d.jsxs(pv,{children:[d.jsx(yn,{label:"Šírka (mm)",htmlFor:"width",error:(H=x.width)==null?void 0:H.message,required:!0,children:d.jsx(Za,{id:"width",type:"number",min:be.minWidth,max:Math.min(be.maxWidth,Vl.standardWidth),...s("width",{...L1(Vl.standardWidth),valueAsNumber:!0})})}),d.jsx(yn,{label:"Výška (mm)",htmlFor:"height",error:(tt=x.height)==null?void 0:tt.message,required:!0,children:d.jsx(Za,{id:"height",type:"number",min:be.minHeight,max:Math.min(be.maxHeight,Vl.standardHeight),...s("height",{...H1(Vl.standardHeight),valueAsNumber:!0})})}),d.jsx(yn,{label:"Počet kusov",htmlFor:"quantity",error:(k=x.quantity)==null?void 0:k.message,required:!0,children:d.jsx(Za,{id:"quantity",type:"number",min:be.minQuantity,max:be.maxQuantity,...s("quantity",{...q1(),valueAsNumber:!0})})}),d.jsx(yn,{label:"Blok",htmlFor:"blockId",children:d.jsx(G0,{children:d.jsxs(V0,{id:"blockId",defaultValue:"",...s("blockId",{setValueAs:O=>O===""?void 0:Number(O)}),title:"Priradiť k bloku pre zoskupenie na doske",children:[d.jsx("option",{value:"",children:"Bez bloku"}),o.map(O=>d.jsxs("option",{value:O,children:["Blok ",O]},O))]})})}),d.jsx(yn,{label:"Typ dreva",htmlFor:"woodType",children:d.jsx(Y0,{id:"woodType",...s("woodType"),title:"Typ dreva pre materiál",children:Yl.woodTypes.map(O=>d.jsx("option",{value:O.id,children:O.name},O.id))})}),d.jsx(yn,{label:"Rotácia",htmlFor:"rotatable",children:d.jsx(Yv,{className:"toggle-container",children:d.jsx(L0,{id:"rotatable",checked:!!g("rotatable"),onChange:O=>y("rotatable",O),size:"small"})})}),d.jsx(Sv,{children:d.jsx(yn,{label:"Hrany",children:d.jsx(X0,{edges:v,onEdgeUpdate:z,size:"small",orientation:"horizontal"})})})]}),d.jsx(bv,{children:d.jsx(nl,{type:"submit",variant:"primary",disabled:!p,children:"Pridať diel"})})]})]})},Xv=E.div`
  display: flex;
  gap: 4px;
  align-items: center;
`,Qv=E.span`
  opacity: 0.5;
  font-style: italic;
`,Zv=({part:n})=>d.jsxs(Xv,{children:[n.hasCornerModifications&&d.jsx(gr,{type:"corners",tooltipText:"Upravené rohy",children:"C"}),n.hasEdgeTreatments&&d.jsx(gr,{type:"edges",tooltipText:"Hrany s oblepovaním",children:"H"}),n.isLShape&&d.jsx(gr,{type:"lshape",tooltipText:"L-tvar",children:"L"}),n.isFrame&&d.jsx(gr,{type:"frame",tooltipText:"Rámček",children:"F"}),!n.hasAdvancedConfig&&d.jsx(Qv,{children:"—"})]}),kc=(n,u,o,s,f,c,g,y)=>{const x=f.topLeft||{type:"none"};let p=n,v=u;if(x.type==="bevel"&&x.x&&x.y){const k=(x.x||0)*c;p=n+k,v=u}else if(x.type==="round"&&x.x){const k=(x.x||0)*c;p=n+k,v=u}let z=`M ${p} ${v}`;const j=f.topRight||{type:"none"};if(j.type==="bevel"&&j.x&&j.y){const k=(j.x||0)*c,O=(j.y||0)*c;z+=` L ${n+o-k} ${u}`,z+=` L ${n+o} ${u+O}`}else if(j.type==="round"&&j.x){const k=(j.x||0)*c;z+=` L ${n+o-k} ${u}`,z+=` Q ${n+o} ${u} ${n+o} ${u+k}`}else z+=` L ${n+o} ${u}`;const H=f.bottomRight||{type:"none"};if(H.type==="bevel"&&H.x&&H.y){const k=(H.x||0)*c,O=(H.y||0)*c;z+=` L ${n+o} ${u+s-O}`,z+=` L ${n+o-k} ${u+s}`}else if(H.type==="round"&&H.x){const k=(H.x||0)*c;z+=` L ${n+o} ${u+s-k}`,z+=` Q ${n+o} ${u+s} ${n+o-k} ${u+s}`}else z+=` L ${n+o} ${u+s}`;const tt=f.bottomLeft||{type:"none"};if(tt.type==="bevel"&&tt.x&&tt.y){const k=(tt.x||0)*c,O=(tt.y||0)*c;z+=` L ${n+k} ${u+s}`,z+=` L ${n} ${u+s-O}`}else if(tt.type==="round"&&tt.x){const k=(tt.x||0)*c;z+=` L ${n+k} ${u+s}`,z+=` Q ${n} ${u+s} ${n} ${u+s-k}`}else z+=` L ${n} ${u+s}`;if(x.type==="bevel"&&x.x&&x.y){const k=(x.x||0)*c,O=(x.y||0)*c;z+=` L ${n} ${u+O}`,z+=` L ${n+k} ${u}`}else if(x.type==="round"&&x.x){const k=(x.x||0)*c;z+=` L ${n} ${u+k}`,z+=` Q ${n} ${u} ${n+k} ${u}`}else z+=` L ${n} ${u}`;return z+=" Z",{d:z,fill:y,stroke:g,strokeWidth:Sl.strokeWidth.toString(),strokeDasharray:y==="none"?Sl.dashArray.dashed:Sl.dashArray.solid}},Wv=(n,u,o,s)=>Object.entries(n.corners||{}).map(([f,c])=>{if(c.type==="none")return null;const y=(x=>{switch(x){case"topLeft":return{x:u,y:u};case"topRight":return{x:u+o,y:u};case"bottomRight":return{x:u+o,y:u+s};case"bottomLeft":return{x:u,y:u+s};default:return{x:u,y:u}}})(f);return{key:f,cx:y.x,cy:y.y,r:Sl.cornerIndicatorRadius,fill:Sl.colors.cornerIndicator}}).filter(f=>f!==null),Kv=(n,u=Sl.maxPreviewDimension,o=Sl.defaultPadding)=>{const s=Math.min(u/n.width,u/n.height),f=n.width*s,c=n.height*s,g=f+o*2,y=c+o*2;return{scale:s,width:f,height:c,previewWidth:g,previewHeight:y,padding:o}},Fv=n=>{const{scale:u,width:o,height:s,previewWidth:f,previewHeight:c,padding:g}=Kv(n),y=n.corners||{},x=kc(g,g,o,s,{},u,Sl.colors.originalOutline,"none"),p=kc(g,g,o,s,y,u,Sl.colors.modifiedStroke,Sl.colors.modifiedFill),v=Wv(n,g,o,s);return{originalOutline:x,modifiedShape:p,cornerIndicators:v,previewWidth:f,previewHeight:c}},pc=E.div`
  width: ${n=>n.$width}px;
  height: ${n=>n.$height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`,xc=E.svg`
  width: 100%;
  height: 100%;
  display: block;
`;E.div`
  position: relative;
  width: 100%;
  height: 100%;
`;E.div`
  position: absolute;
  left: ${n=>n.$x}px;
  top: ${n=>n.$y}px;
  width: ${n=>n.$width}px;
  height: ${n=>n.$height}px;
  background: ${n=>n.$color};
  opacity: 0.9;
`;const Jv=({part:n,size:u=60})=>{var x,p;const o=n.width/n.height,c=Math.max(.8,Math.min(1.2,o)),g=c>=1?u:u*c,y=c>=1?u/c:u;return(x=n.frame)!=null&&x.enabled?d.jsx(pc,{$width:g,$height:y,children:d.jsx(xc,{viewBox:`0 0 ${n.width} ${n.height}`,children:tS(n)})}):(p=n.lShape)!=null&&p.enabled?d.jsx(pc,{$width:g,$height:y,children:d.jsx(xc,{viewBox:`0 0 ${n.width} ${n.height}`,children:Pv(n)})}):d.jsx(pc,{$width:g,$height:y,children:d.jsx(xc,{viewBox:`0 0 ${n.width} ${n.height}`,children:Iv(n)})})},Iv=n=>{const u=n.corners||{},s=kc(0,0,n.width,n.height,u,1,"#3498db","#E8F4FD");return d.jsx("path",{d:s.d,fill:s.fill,stroke:s.stroke,strokeWidth:"2",opacity:"0.9"})},Pv=n=>{var p;if(!((p=n.lShape)!=null&&p.enabled))return null;const u=n.lShape.leftWidth||0,o=n.lShape.rightWidth||0,s=Math.min(n.lShape.bottomLeftRadius||0,u,o),f=Math.min(n.lShape.topLeftCutoutRadius||0,u,n.height-o),c=Math.min(n.lShape.innerCutoutRadius||0,n.width-u,n.height-o),g=Math.min(n.lShape.rightBottomCutoutRadius||0,n.width-u,o);let y="M 0,0";f>0?(y+=` L ${u-f},0`,y+=` A ${f},${f} 0 0,1 ${u},${f}`):y+=` L ${u},0`;const x=n.height-o;return c>0?(y+=` L ${u},${x-c}`,y+=` A ${c},${c} 0 0,0 ${u+c},${x}`):y+=` L ${u},${x}`,g>0?(y+=` L ${n.width-g},${x}`,y+=` A ${g},${g} 0 0,1 ${n.width},${x+g}`):y+=` L ${n.width},${x}`,y+=` L ${n.width},${n.height}`,s>0?(y+=` L ${s},${n.height}`,y+=` A ${s},${s} 0 0,1 0,${n.height-s}`):y+=` L 0,${n.height}`,y+=" L 0,0 Z",d.jsx("path",{d:y,fill:"#E8F4FD",stroke:"#3498db",strokeWidth:"2",opacity:"0.9"})},tS=n=>{var y;if(!((y=n.frame)!=null&&y.enabled))return null;const u=n.frame.width||70,o=Math.max(u,n.width*.25),s=n.frame.type,f="#E8F4FD",c="#3498db",g=[{x:s==="type3"||s==="type4"?o:0,y:0,width:s==="type3"||s==="type4"?n.width-2*o:n.width,height:o,label:"top"},{x:s==="type3"||s==="type4"?o:0,y:n.height-o,width:s==="type3"||s==="type4"?n.width-2*o:n.width,height:o,label:"bottom"},{x:0,y:s==="type1"||s==="type2"?o:0,width:o,height:s==="type1"||s==="type2"?n.height-2*o:n.height,label:"left"},{x:n.width-o,y:s==="type1"||s==="type2"?o:0,width:o,height:s==="type1"||s==="type2"?n.height-2*o:n.height,label:"right"}];return d.jsxs(d.Fragment,{children:[g.map((x,p)=>d.jsx("rect",{x:x.x,y:x.y,width:x.width,height:x.height,fill:f,stroke:c,strokeWidth:"2",opacity:"0.9"},p)),d.jsx("rect",{x:o,y:o,width:n.width-2*o,height:n.height-2*o,fill:"none",stroke:c,strokeWidth:"1",strokeDasharray:"4,2",opacity:"0.6"})]})},eS=Ht.memo(({enhancedParts:n,totalArea:u,totalParts:o,selectedPartId:s,onPartSelect:f,onRemovePart:c,onClearAll:g,onPartBlockUpdate:y,onPartRotationUpdate:x,onPartWoodTypeUpdate:p,onPartEdgeUpdate:v})=>{const z=Gg(n),j=(k,O)=>{const Z=O===""?void 0:parseInt(O,10);y(k,Z)},H=(k,O)=>{p(k,O)},tt=(k,O)=>{const Z=n.find(B=>B.id===k);Z&&(Z.blockId?n.forEach(B=>{B.blockId===Z.blockId&&x(B.id,O)}):x(k,O))};return n.length===0?d.jsxs(Rc,{children:[d.jsx(Oc,{children:"Zoznam dielcov"}),d.jsx(uv,{title:"Prázdny zoznam",message:"Zatiaľ nie sú pridané žiadne dielce"})]}):d.jsxs(Rc,{children:[d.jsx(Oc,{children:"Zoznam dielcov"}),d.jsxs(_v,{children:[d.jsxs(yc,{children:[d.jsx("div",{className:"value",children:n.length}),d.jsx("div",{className:"label",children:"Typov dielcov"})]}),d.jsxs(yc,{children:[d.jsx("div",{className:"value",children:o}),d.jsx("div",{className:"label",children:"Kusov celkom"})]}),d.jsxs(yc,{children:[d.jsxs("div",{className:"value",children:[(u/1e6).toFixed(2)," m²"]}),d.jsx("div",{className:"label",children:"Celková plocha"})]})]}),d.jsx(J1,{children:n.map(k=>{var Z,B;const O=[];if(k.blockId){const L=Wx(n,k.blockId);L&&O.push(L);const P=Ix(n,k.blockId);P&&O.push(P)}return d.jsxs(Ht.Fragment,{children:[d.jsxs($v,{$selected:s===k.id,onClick:()=>f(k.id),children:[d.jsxs(wv,{children:[d.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[d.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[d.jsx(q0,{$color:k.color||"#3498db"}),d.jsxs("div",{children:[d.jsx(Tv,{children:k.label||`Diel ${k.width}×${k.height}`}),d.jsxs(zv,{children:[k.width," × ",k.height," mm"]})]})]}),d.jsx(Zv,{part:k})]}),d.jsxs(jv,{children:[d.jsxs(gc,{children:[d.jsx("div",{className:"value",children:k.quantity}),d.jsx("div",{className:"label",children:"ks"})]}),d.jsxs(gc,{children:[d.jsx("div",{className:"value",children:(k.width*k.height*k.quantity/1e6).toFixed(3)}),d.jsx("div",{className:"label",children:"m²"})]}),d.jsxs(gc,{children:[d.jsx("div",{className:"value",children:(k.width*k.height/1e6).toFixed(3)}),d.jsx("div",{className:"label",children:"m²/ks"})]})]}),d.jsxs(Av,{children:[(Z=k.frame)!=null&&Z.enabled?d.jsx("div",{}):d.jsxs(G0,{children:[d.jsxs(V0,{value:k.blockId||"",onChange:L=>j(k.id,L.target.value),onClick:L=>L.stopPropagation(),title:"Priradiť k bloku pre zoskupenie na doske",children:[d.jsx("option",{value:"",children:"Bez bloku"}),z.map(L=>d.jsxs("option",{value:L,children:["Blok ",L]},L))]}),k.blockId&&d.jsx(Ov,{$blockId:k.blockId,$color:k.color,children:k.blockId})]}),d.jsx(Y0,{value:k.woodType||Yl.defaultWoodType,onChange:L=>H(k.id,L.target.value),onClick:L=>L.stopPropagation(),title:"Typ dreva pre materiál",children:Yl.woodTypes.map(L=>d.jsx("option",{value:L.id,children:L.name},L.id))}),(B=k.frame)!=null&&B.enabled?d.jsx("div",{}):d.jsx(yv,{checked:k.orientation==="rotatable",onChange:L=>tt(k.id,L)})]}),d.jsx("div",{style:{marginTop:"12px",width:"100%"},children:d.jsx(X0,{edges:k.edges,onEdgeUpdate:(L,P)=>v(k.id,L,P),size:"small",orientation:"horizontal"})}),d.jsx(Cv,{children:d.jsx(nl,{variant:"danger",size:"small",onClick:L=>{L.stopPropagation(),c(k.id)},children:"Odstrániť"})})]}),d.jsx(Ev,{children:d.jsx(Jv,{part:k,size:120})})]}),O.length>0&&d.jsx("div",{children:O.map((L,P)=>d.jsx(Rv,{children:L},P))})]},k.id)})}),d.jsx(Mv,{$marginTop:ot.lg,children:d.jsx(nl,{variant:"danger",onClick:g,children:"Vymazať všetko"})})]})}),lS=E.div`
  width: 100%;
  max-width: 500px;
  height: ${n=>500/n.$aspectRatio}px;
  max-height: 400px;
  margin: 0 auto 20px;
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`,nS=E.svg`
  max-width: 100%;
  max-height: 100%;
  overflow: visible;
`,Ag=E.div`
  position: absolute;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2c3e50;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid #e1e8ed;

  ${n=>n.$position==="width"?`
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
  `:`
    right: -15px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
  `}
`,iS=E.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #7f8c8d;
  }

  .legend-box {
    width: 16px;
    height: 3px;
    border-radius: 1px;

    &.dashed {
      border: 1px dashed #bdc3c7;
      background: transparent;
    }

    &.solid {
      background: #3498db;
    }
  }

  .legend-circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.corner {
      background: #e74c3c;
    }
  }
`,aS=E.div`
  font-size: 0.75rem;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 16px;
`,uS=Ht.memo(({part:n})=>{const{originalOutline:u,modifiedShape:o,cornerIndicators:s,previewWidth:f,previewHeight:c}=Fv(n),g=d.jsxs(d.Fragment,{children:[d.jsx("path",{d:u.d,fill:u.fill,stroke:u.stroke,strokeWidth:u.strokeWidth,strokeDasharray:u.strokeDasharray}),d.jsx("path",{d:o.d,fill:o.fill,stroke:o.stroke,strokeWidth:o.strokeWidth,strokeDasharray:o.strokeDasharray}),s.map(y=>d.jsx("circle",{cx:y.cx,cy:y.cy,r:y.r,fill:y.fill},y.key))]});return d.jsxs(d.Fragment,{children:[d.jsxs(lS,{$aspectRatio:n.width/n.height,children:[d.jsx(nS,{viewBox:`0 0 ${f} ${c}`,children:g}),d.jsxs(Ag,{$position:"width",children:[n.width," mm"]}),d.jsxs(Ag,{$position:"height",children:[n.height," mm"]})]}),d.jsxs(iS,{children:[d.jsxs("div",{className:"legend-item",children:[d.jsx("div",{className:"legend-box dashed"}),d.jsx("span",{children:"Originál rozmer"})]}),d.jsxs("div",{className:"legend-item",children:[d.jsx("div",{className:"legend-box solid"}),d.jsx("span",{children:"S úpravami"})]}),d.jsxs("div",{className:"legend-item",children:[d.jsx("div",{className:"legend-circle corner"}),d.jsx("span",{children:"Upravený roh"})]})]}),d.jsx(aS,{children:"💡 Úpravy rohov a hrán neovplyvňujú rozloženie na doske - diely sa ukladajú ako obdĺžniky"})]})}),rS=(n,u)=>{const o=n.corners||{},s=g=>{const y=o[g]||{type:"none"};return y.type==="round"&&y.x||0};let f=n.width,c=n.height;switch(u){case"topLeft":f-=s("topRight"),c-=s("bottomLeft");break;case"topRight":f-=s("topLeft"),c-=s("bottomRight");break;case"bottomRight":f-=s("bottomLeft"),c-=s("topRight");break;case"bottomLeft":f-=s("bottomRight"),c-=s("topLeft");break}return Math.max(0,Math.min(f,c))},Cg=(n,u,o)=>{const s=n.corners||{},f=o==="x",c=f?n.width:n.height,g=x=>{const p=s[x]||{type:"none"};return p.type==="bevel"?p[o]||0:p.type==="round"&&p.x||0};let y=0;switch(u){case"topLeft":f?y=g("topRight"):y=g("bottomLeft");break;case"topRight":f?y=g("topLeft"):y=g("bottomRight");break;case"bottomRight":f?y=g("bottomLeft"):y=g("topRight");break;case"bottomLeft":f?y=g("bottomRight"):y=g("topLeft");break}return Math.max(0,c-y)},oS=n=>({topLeft:"Ľavý horný",topRight:"Pravý horný",bottomLeft:"Ľavý dolný",bottomRight:"Pravý dolný"})[n]||n,Q0=(n,u)=>`${n}×${u} mm`,sS=n=>Q0(n.width,n.height),cS=n=>n.label?n.label:Q0(n.width,n.height),fS=n=>{const u=(n.width*n.height/1e6).toFixed(3);return{quantity:n.quantity,area:`${u} m²`}},dS=E.div`
  margin-bottom: 20px;

  h3 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 1.1rem;
  }
`,hS=E.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,mS=E.div`
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 16px;

  h4 {
    color: #2c3e50;
    margin-bottom: 12px;
    font-size: 0.9rem;
    font-weight: 600;
  }
`,yr=E(Fc)`
  label {
    display: block;
    margin-bottom: 4px;
    color: #495057;
    font-weight: 500;
    font-size: 0.85rem;
  }

  select,
  input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 0.85rem;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
`,gS=({part:n,onCornerUpdate:u})=>{const o=s=>{const c=(n.corners||{})[s]||{type:"none"},g=rS(n,s),y=Cg(n,s,"x"),x=Cg(n,s,"y");return d.jsxs(mS,{children:[d.jsx("div",{className:"corner-title",children:oS(s)}),d.jsx(yr,{children:d.jsx("select",{value:c.type,onChange:p=>u(s,{type:p.target.value,x:p.target.value==="none"?void 0:c.x||zr.cornerValue,y:p.target.value==="bevel"?c.y||zr.cornerValue:void 0}),children:Bv.map(p=>d.jsx("option",{value:p.value,children:p.label},p.value))})}),c.type==="bevel"&&d.jsxs(d.Fragment,{children:[d.jsxs(yr,{children:[d.jsx("label",{children:"X (mm)"}),d.jsxs("label",{className:"max-info",children:["max ",Math.floor(y)," mm"]}),d.jsx("input",{type:"number",min:"0",max:Math.floor(y),value:c.x||0,className:(c.x||0)>y?"invalid":"",onChange:p=>{const v=Number(p.target.value),z=Math.min(Math.max(0,v),y);u(s,{x:z})}})]}),d.jsxs(yr,{children:[d.jsx("label",{children:"Y (mm)"}),d.jsxs("label",{className:"max-info",children:["max ",Math.floor(x)," mm"]}),d.jsx("input",{type:"number",min:"0",max:Math.floor(x),value:c.y||0,className:(c.y||0)>x?"invalid":"",onChange:p=>{const v=Number(p.target.value),z=Math.min(Math.max(0,v),x);u(s,{y:z})}})]})]}),c.type==="round"&&d.jsxs(yr,{children:[d.jsx("label",{children:"Polomer (mm)"}),d.jsxs("label",{className:"max-info",children:["max ",Math.floor(g)," mm"]}),d.jsx("input",{type:"number",min:"0",max:Math.floor(g),value:c.x||0,className:(c.x||0)>g?"invalid":"",onChange:p=>{const v=Number(p.target.value),z=Math.min(Math.max(0,v),g);u(s,{x:z})}})]})]},s)};return d.jsxs(dS,{children:[d.jsx("h3",{children:"Rohy"}),d.jsx(hS,{children:Uv.map(s=>o(s))})]})},Z0=(n,u)=>{const o=$t.useRef(void 0);return $t.useCallback((...s)=>{o.current&&clearTimeout(o.current),o.current=setTimeout(()=>{n(...s)},u)},[n,u])},_g=E.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
`,Dg=E.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`,yS=E.div`
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;

  p {
    margin: 0;
    font-size: 1rem;
  }
`,pS=E.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;

  .part-info {
    .label {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 2px;
    }

    .dimensions {
      font-size: 0.9rem;
      color: #7f8c8d;
    }
  }

  .part-stats {
    text-align: right;
    font-size: 0.9rem;
    color: #7f8c8d;

    div {
      margin-bottom: 2px;
    }
  }
`,xS=Ht.memo(({selectedPart:n,onPartUpdate:u})=>{const o=Z0(u,300);if(!n)return d.jsxs(_g,{children:[d.jsx(Dg,{children:"Úprava dielu"}),d.jsx(yS,{children:d.jsx("p",{children:"Vyberte diel zo zoznamu pre úpravy rohov a hrán"})})]});const{handleCornerUpdate:s}=ib(n,o),f=fS(n);return d.jsxs(_g,{children:[d.jsx(Dg,{children:"Úprava dielu"}),d.jsxs(pS,{children:[d.jsxs("div",{className:"part-info",children:[d.jsx("div",{className:"label",children:cS(n)}),d.jsx("div",{className:"dimensions",children:sS(n)})]}),d.jsxs("div",{className:"part-stats",children:[d.jsx("div",{children:d.jsx("strong",{children:f.quantity})}),d.jsx("div",{children:f.area})]})]}),d.jsx(uS,{part:n}),d.jsx(gS,{part:n,onCornerUpdate:s})]})}),bS=n=>{const{width:u,height:o,cutoutStartX:s,cutoutStartY:f,bottomLeftRadius:c,topLeftCutoutRadius:g,innerCutoutRadius:y,rightBottomCutoutRadius:x}=n,p=Math.min(c,u,o),v=Math.min(g,s,f),z=Math.min(y,(u-s)/2,f/2),j=Math.min(x,u-s,o-f);let H="";return H+="M 0,0",v>0?(H+=` L ${s-v},0`,H+=` A ${v},${v} 0 0,1 ${s},${v}`):H+=` L ${s},0`,z>0?(H+=` L ${s},${f-z}`,H+=` A ${z},${z} 0 0,0 ${s+z},${f}`):H+=` L ${s},${f}`,j>0?(H+=` L ${u-j},${f}`,H+=` A ${j},${j} 0 0,1 ${u},${f+j}`):H+=` L ${u},${f}`,H+=` L ${u},${o}`,p>0?(H+=` L ${p},${o}`,H+=` A ${p},${p} 0 0,1 0,${o-p}`):H+=` L 0,${o}`,H+=" L 0,0",H+=" Z",H},vS=(n,u)=>{const o=u.leftWidth||0,s=u.rightWidth||0,f=600,c=450,g=f/n.width,y=c/n.height,x=Math.min(g,y),p=n.width*x,v=n.height*x,z=o*x,j=s*x,H=z,k=v-j,O=(u.bottomLeftRadius||0)*x,Z=(u.topLeftCutoutRadius||0)*x,B=(u.innerCutoutRadius||0)*x,L=(u.rightBottomCutoutRadius||0)*x,P=bS({width:p,height:v,cutoutStartX:H,cutoutStartY:k,bottomLeftRadius:O,topLeftCutoutRadius:Z,innerCutoutRadius:B,rightBottomCutoutRadius:L}),Q=30,rt=p+Q*2,J=v+Q*2;return{previewWidth:p,previewHeight:v,previewLeftWidth:z,previewRightHeight:j,cutoutStartX:H,cutoutStartY:k,path:P,viewBoxWidth:rt,viewBoxHeight:J,shapeOffsetX:Q,shapeOffsetY:Q}},SS=E.svg`
  width: 100%;
  height: 100%;
  max-width: 600px;
  max-height: 450px;
`,$S=({part:n,previewData:u,leftWidth:o,rightHeight:s})=>{const{previewWidth:f,previewHeight:c,path:g,viewBoxWidth:y,viewBoxHeight:x,shapeOffsetX:p,shapeOffsetY:v}=u;return d.jsxs(SS,{viewBox:`0 0 ${y} ${x}`,children:[d.jsx("path",{d:g,fill:"rgba(52, 152, 219, 0.1)",stroke:"#3498db",strokeWidth:"2",transform:`translate(${p}, ${v})`}),d.jsxs("text",{x:p+f/2,y:v+c+20,textAnchor:"middle",fontSize:"16",fill:"#666",fontWeight:"bold",children:[n.width," mm"]}),d.jsxs("text",{x:p-8,y:v+c/2,textAnchor:"middle",fontSize:"16",fill:"#2c3e50",fontWeight:"bold",transform:`rotate(-90, ${p-8}, ${v+c/2})`,children:[n.height," mm"]}),d.jsxs("text",{x:p+20,y:v-10,textAnchor:"start",fontSize:"16",fill:"#e74c3c",fontWeight:"bold",children:[o," mm"]}),d.jsxs("text",{x:p+f+20,y:v+c-30,textAnchor:"middle",fontSize:"16",fill:"#e74c3c",fontWeight:"bold",transform:`rotate(90, ${p+f+20}, ${v+c-30})`,children:[s," mm"]})]})},wS=(n,u)=>({minLeftWidth:10,maxLeftWidth:n-10,minTopHeight:10,maxTopHeight:u-10,minCutWidth:10,maxCutWidth:n-10,minCutHeight:10,maxCutHeight:u-10,maxWidth:n,minWidth:10}),ES=wS,TS=n=>({updateLeftWidth:u=>{n({leftWidth:u})},updateRightWidth:u=>{n({rightWidth:u})},updateEnabled:u=>{n({enabled:u})},updateRadius:(u,o)=>{n({[u]:o})},handleLeftWidthChange:u=>{const o=parseInt(u,10);isNaN(o)||n({leftWidth:o})},handleRightWidthChange:u=>{const o=parseInt(u,10);isNaN(o)||n({rightWidth:o})},handleBottomLeftRadiusChange:u=>{const o=parseInt(u,10);isNaN(o)||n({bottomLeftRadius:o})},handleTopLeftCutoutRadiusChange:u=>{const o=parseInt(u,10);isNaN(o)||n({topLeftCutoutRadius:o})},handleInnerCutoutRadiusChange:u=>{const o=parseInt(u,10);isNaN(o)||n({innerCutoutRadius:o})},handleRightBottomCutoutRadiusChange:u=>{const o=parseInt(u,10);isNaN(o)||n({rightBottomCutoutRadius:o})}}),pr=(n,u,o)=>{const s=u.leftWidth||0,f=u.rightWidth||0,c=u.topLeftCutoutRadius||0,g=u.innerCutoutRadius||0,y=u.rightBottomCutoutRadius||0;switch(o){case"bottomLeft":{const x=n.height,p=n.width;return Math.max(0,Math.min(x,p))}case"topLeftCutout":{const p=n.height-f-g,v=s-g;return Math.max(0,Math.min(p,v))}case"innerCutout":{const x=n.width-s,p=n.height-f,v=Math.max(0,x-y),z=Math.max(0,p-c);return Math.max(0,Math.min(v,z))}case"rightBottomCutout":{const x=n.width-s,p=f,v=x-g,z=p-g;return Math.max(0,Math.min(v,z))}default:return 0}},zS=(n,u)=>({bottomLeft:pr(n,u,"bottomLeft"),topLeftCutout:pr(n,u,"topLeftCutout"),innerCutout:pr(n,u,"innerCutout"),rightBottomCutout:pr(n,u,"rightBottomCutout")}),Mg=E.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
`,Rg=E.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`;E.div`
  margin-bottom: 20px;

  label {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
    cursor: pointer;

    input {
      margin-right: 8px;
    }
  }
`;const jS=E.div`
  background: #e8f4fd;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;

  .total-dimensions {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
  }

  .dimensions-label {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-top: 2px;
  }
`,AS=E.div`
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  min-height: 450px;
`,Og=E.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`,Di=E.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #2c3e50;
  }

  input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
  }
`,kg=E.h3`
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 20px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e1e8ed;
`,CS=E.div`
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;

  p {
    margin: 0;
    font-size: 1rem;
  }
`,W0=Ht.memo(({selectedPart:n,onPartUpdate:u})=>{const s=Z0(p=>{if(!n)return;const v=n.lShape||{enabled:!1};u(n.id,{lShape:{...v,...p}})},300);if(!n)return d.jsxs(Mg,{children:[d.jsx(Rg,{children:"L-tvar konfigurátor"}),d.jsx(CS,{children:d.jsx("p",{children:"Vyberte diel pre úpravu L-tvaru"})})]});const f=n.lShape,c=ES(n.width,n.height),g=f!=null&&f.enabled?zS(n,f):{bottomLeft:0,topLeftCutout:0,innerCutout:0,rightBottomCutout:0},y=TS(s),x=()=>{if(!(f!=null&&f.enabled))return null;const p=f.leftWidth||0,v=f.rightWidth||0,z=vS(n,f);return $S({part:n,previewData:z,leftWidth:p,rightHeight:v})};return f!=null&&f.enabled?d.jsxs(Mg,{children:[d.jsx(Rg,{children:"L-tvar konfigurátor"}),d.jsxs(jS,{children:[d.jsxs("div",{className:"total-dimensions",children:[n.width," × ",n.height," mm"]}),d.jsx("div",{className:"dimensions-label",children:"Celkové rozmery dielu"})]}),d.jsx(AS,{children:x()}),d.jsx(kg,{children:"Šírky výrezu"}),d.jsxs(Og,{children:[d.jsxs(Di,{children:[d.jsx("label",{children:"Šířka levé horní části (mm)"}),d.jsx("input",{type:"number",min:"0",max:c.maxWidth,value:f.leftWidth||0,onChange:p=>y.handleLeftWidthChange(p.target.value)})]}),d.jsxs(Di,{children:[d.jsx("label",{children:"Šířka pravé dolní části (mm)"}),d.jsx("input",{type:"number",min:"0",max:c.maxWidth,value:f.rightWidth||0,onChange:p=>y.handleRightWidthChange(p.target.value)})]})]}),d.jsx(kg,{children:"Zaoblenie rohov"}),d.jsxs(Og,{children:[d.jsxs(Di,{children:[d.jsx("label",{children:"Ľavý dolný roh (mm)"}),d.jsx("input",{type:"number",min:"0",max:g.bottomLeft,value:f.bottomLeftRadius||0,onChange:p=>y.handleBottomLeftRadiusChange(p.target.value)})]}),d.jsxs(Di,{children:[d.jsx("label",{children:"Ľavý horný roh (mm)"}),d.jsx("input",{type:"number",min:"0",max:g.topLeftCutout,value:f.topLeftCutoutRadius||0,onChange:p=>y.handleTopLeftCutoutRadiusChange(p.target.value)})]}),d.jsxs(Di,{children:[d.jsx("label",{children:"Vnútorný roh (mm)"}),d.jsx("input",{type:"number",min:"0",max:g.innerCutout,value:f.innerCutoutRadius||0,onChange:p=>y.handleInnerCutoutRadiusChange(p.target.value)})]}),d.jsxs(Di,{children:[d.jsx("label",{children:"Pravý dolný roh (mm)"}),d.jsx("input",{type:"number",min:"0",max:g.rightBottomCutout,value:f.rightBottomCutoutRadius||0,onChange:p=>y.handleRightBottomCutoutRadiusChange(p.target.value)})]})]})]}):null});W0.displayName="LShapeVisualEditor";const _S=({width:n=80,height:u=60})=>d.jsxs("svg",{width:n,height:u,viewBox:"0 0 80 60",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[d.jsx("rect",{x:"1",y:"1",width:"78",height:"58",stroke:"#333",strokeWidth:"1",fill:"none"}),d.jsx("rect",{x:"1",y:"1",width:"78",height:"15",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"5",y1:"8",x2:"15",y2:"8"}),d.jsx("line",{x1:"20",y1:"8",x2:"30",y2:"8"}),d.jsx("line",{x1:"35",y1:"8",x2:"45",y2:"8"}),d.jsx("line",{x1:"50",y1:"8",x2:"60",y2:"8"}),d.jsx("line",{x1:"65",y1:"8",x2:"75",y2:"8"})]}),d.jsx("rect",{x:"1",y:"44",width:"78",height:"15",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"5",y1:"51",x2:"15",y2:"51"}),d.jsx("line",{x1:"20",y1:"51",x2:"30",y2:"51"}),d.jsx("line",{x1:"35",y1:"51",x2:"45",y2:"51"}),d.jsx("line",{x1:"50",y1:"51",x2:"60",y2:"51"}),d.jsx("line",{x1:"65",y1:"51",x2:"75",y2:"51"})]}),d.jsx("rect",{x:"1",y:"16",width:"15",height:"28",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"3",y1:"22",x2:"13",y2:"22"}),d.jsx("line",{x1:"3",y1:"28",x2:"13",y2:"28"}),d.jsx("line",{x1:"3",y1:"34",x2:"13",y2:"34"}),d.jsx("line",{x1:"3",y1:"40",x2:"13",y2:"40"})]}),d.jsx("rect",{x:"64",y:"16",width:"15",height:"28",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"66",y1:"22",x2:"76",y2:"22"}),d.jsx("line",{x1:"66",y1:"28",x2:"76",y2:"28"}),d.jsx("line",{x1:"66",y1:"34",x2:"76",y2:"34"}),d.jsx("line",{x1:"66",y1:"40",x2:"76",y2:"40"})]}),d.jsx("rect",{x:"16",y:"16",width:"48",height:"28",fill:"#F8F9FA",stroke:"#ddd",strokeWidth:"0.5",strokeDasharray:"2,2"})]}),DS=({width:n=80,height:u=60})=>d.jsxs("svg",{width:n,height:u,viewBox:"0 0 80 60",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[d.jsx("rect",{x:"1",y:"1",width:"78",height:"58",stroke:"#333",strokeWidth:"1",fill:"none"}),d.jsx("rect",{x:"1",y:"1",width:"78",height:"15",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"5",y1:"8",x2:"15",y2:"8"}),d.jsx("line",{x1:"20",y1:"8",x2:"30",y2:"8"}),d.jsx("line",{x1:"35",y1:"8",x2:"45",y2:"8"}),d.jsx("line",{x1:"50",y1:"8",x2:"60",y2:"8"}),d.jsx("line",{x1:"65",y1:"8",x2:"75",y2:"8"})]}),d.jsx("rect",{x:"1",y:"44",width:"78",height:"15",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"5",y1:"51",x2:"15",y2:"51"}),d.jsx("line",{x1:"20",y1:"51",x2:"30",y2:"51"}),d.jsx("line",{x1:"35",y1:"51",x2:"45",y2:"51"}),d.jsx("line",{x1:"50",y1:"51",x2:"60",y2:"51"}),d.jsx("line",{x1:"65",y1:"51",x2:"75",y2:"51"})]}),d.jsx("rect",{x:"1",y:"16",width:"15",height:"28",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"5",y1:"18",x2:"5",y2:"42"}),d.jsx("line",{x1:"8",y1:"18",x2:"8",y2:"42"}),d.jsx("line",{x1:"11",y1:"18",x2:"11",y2:"42"}),d.jsx("line",{x1:"14",y1:"18",x2:"14",y2:"42"})]}),d.jsx("rect",{x:"64",y:"16",width:"15",height:"28",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"67",y1:"18",x2:"67",y2:"42"}),d.jsx("line",{x1:"70",y1:"18",x2:"70",y2:"42"}),d.jsx("line",{x1:"73",y1:"18",x2:"73",y2:"42"}),d.jsx("line",{x1:"76",y1:"18",x2:"76",y2:"42"})]}),d.jsx("rect",{x:"16",y:"16",width:"48",height:"28",fill:"#F8F9FA",stroke:"#ddd",strokeWidth:"0.5",strokeDasharray:"2,2"})]}),MS=({width:n=80,height:u=60})=>d.jsxs("svg",{width:n,height:u,viewBox:"0 0 80 60",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[d.jsx("rect",{x:"1",y:"1",width:"78",height:"58",stroke:"#333",strokeWidth:"1",fill:"none"}),d.jsx("rect",{x:"1",y:"1",width:"15",height:"58",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"5",y1:"3",x2:"5",y2:"57"}),d.jsx("line",{x1:"8",y1:"3",x2:"8",y2:"57"}),d.jsx("line",{x1:"11",y1:"3",x2:"11",y2:"57"}),d.jsx("line",{x1:"14",y1:"3",x2:"14",y2:"57"})]}),d.jsx("rect",{x:"64",y:"1",width:"15",height:"58",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"67",y1:"3",x2:"67",y2:"57"}),d.jsx("line",{x1:"70",y1:"3",x2:"70",y2:"57"}),d.jsx("line",{x1:"73",y1:"3",x2:"73",y2:"57"}),d.jsx("line",{x1:"76",y1:"3",x2:"76",y2:"57"})]}),d.jsx("rect",{x:"16",y:"1",width:"48",height:"15",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"22",y1:"3",x2:"22",y2:"14"}),d.jsx("line",{x1:"28",y1:"3",x2:"28",y2:"14"}),d.jsx("line",{x1:"34",y1:"3",x2:"34",y2:"14"}),d.jsx("line",{x1:"40",y1:"3",x2:"40",y2:"14"}),d.jsx("line",{x1:"46",y1:"3",x2:"46",y2:"14"}),d.jsx("line",{x1:"52",y1:"3",x2:"52",y2:"14"}),d.jsx("line",{x1:"58",y1:"3",x2:"58",y2:"14"})]}),d.jsx("rect",{x:"16",y:"44",width:"48",height:"15",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"22",y1:"46",x2:"22",y2:"57"}),d.jsx("line",{x1:"28",y1:"46",x2:"28",y2:"57"}),d.jsx("line",{x1:"34",y1:"46",x2:"34",y2:"57"}),d.jsx("line",{x1:"40",y1:"46",x2:"40",y2:"57"}),d.jsx("line",{x1:"46",y1:"46",x2:"46",y2:"57"}),d.jsx("line",{x1:"52",y1:"46",x2:"52",y2:"57"}),d.jsx("line",{x1:"58",y1:"46",x2:"58",y2:"57"})]}),d.jsx("rect",{x:"16",y:"16",width:"48",height:"28",fill:"#F8F9FA",stroke:"#ddd",strokeWidth:"0.5",strokeDasharray:"2,2"})]}),RS=({width:n=80,height:u=60})=>d.jsxs("svg",{width:n,height:u,viewBox:"0 0 80 60",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[d.jsx("rect",{x:"1",y:"1",width:"78",height:"58",stroke:"#333",strokeWidth:"1",fill:"none"}),d.jsx("rect",{x:"1",y:"1",width:"15",height:"58",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"3",y1:"8",x2:"13",y2:"8"}),d.jsx("line",{x1:"3",y1:"15",x2:"13",y2:"15"}),d.jsx("line",{x1:"3",y1:"22",x2:"13",y2:"22"}),d.jsx("line",{x1:"3",y1:"29",x2:"13",y2:"29"}),d.jsx("line",{x1:"3",y1:"36",x2:"13",y2:"36"}),d.jsx("line",{x1:"3",y1:"43",x2:"13",y2:"43"}),d.jsx("line",{x1:"3",y1:"50",x2:"13",y2:"50"})]}),d.jsx("rect",{x:"64",y:"1",width:"15",height:"58",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"66",y1:"8",x2:"76",y2:"8"}),d.jsx("line",{x1:"66",y1:"15",x2:"76",y2:"15"}),d.jsx("line",{x1:"66",y1:"22",x2:"76",y2:"22"}),d.jsx("line",{x1:"66",y1:"29",x2:"76",y2:"29"}),d.jsx("line",{x1:"66",y1:"36",x2:"76",y2:"36"}),d.jsx("line",{x1:"66",y1:"43",x2:"76",y2:"43"}),d.jsx("line",{x1:"66",y1:"50",x2:"76",y2:"50"})]}),d.jsx("rect",{x:"16",y:"1",width:"48",height:"15",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"18",y1:"8",x2:"28",y2:"8"}),d.jsx("line",{x1:"32",y1:"8",x2:"42",y2:"8"}),d.jsx("line",{x1:"46",y1:"8",x2:"56",y2:"8"}),d.jsx("line",{x1:"60",y1:"8",x2:"62",y2:"8"})]}),d.jsx("rect",{x:"16",y:"44",width:"48",height:"15",fill:"#E8F4FD",stroke:"#333",strokeWidth:"0.5"}),d.jsxs("g",{stroke:"#666",strokeWidth:"0.5",children:[d.jsx("line",{x1:"18",y1:"51",x2:"28",y2:"51"}),d.jsx("line",{x1:"32",y1:"51",x2:"42",y2:"51"}),d.jsx("line",{x1:"46",y1:"51",x2:"56",y2:"51"}),d.jsx("line",{x1:"60",y1:"51",x2:"62",y2:"51"})]}),d.jsx("rect",{x:"16",y:"16",width:"48",height:"28",fill:"#F8F9FA",stroke:"#ddd",strokeWidth:"0.5",strokeDasharray:"2,2"})]}),OS={type1:_S,type2:DS,type3:MS,type4:RS},kS=()=>Rt.parts.frame.defaultFrameWidth,K0=n=>n.width||kS(),NS=(n,u,o)=>{const s=K0(o),f=n-2*s,c=u-2*s;return{innerWidth:f,innerHeight:c,isValid:f>0&&c>0}},BS=E.div`
  padding: ${ot.lg}px;
  border: 1px solid ${N.border};
  border-radius: 8px;
`,US=E.h3`
  margin: 0 0 ${ot.md}px 0;
  font-size: ${vt.fontSize.lg};
  color: ${N.textPrimary};
`,LS=E.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${ot.md}px;
  margin-bottom: ${ot.md}px;
`,HS=E.div`
  padding: ${ot.sm}px;
  border: 2px solid
    ${n=>n.$selected?N.primary:N.border};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;

  &:hover {
    border-color: ${N.primary};
  }
`,qS=E.div`
  background-color: ${N.background};
  border: 1px solid ${N.border};
  border-radius: 4px;
  padding: ${ot.sm}px ${ot.md}px;
  margin-top: ${ot.md}px;

  > div {
    margin-bottom: ${ot.xs}px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  font-size: ${vt.fontSize.sm};
  margin-top: ${ot.md}px;
`,VS=OS,YS=({frameConfig:n,partWidth:u,partHeight:o,onFrameConfigChange:s})=>{const f=K0(n),{isValid:c}=NS(u,o,n),g=c?Tx(u,o,n):null,y=x=>{s({...n,type:x})};return d.jsxs(BS,{children:[d.jsx(US,{children:"Frame Configuration (Rámček)"}),d.jsx(LS,{children:Object.entries(VS).map(([x,p])=>d.jsx(HS,{$selected:n.type===x,onClick:()=>y(x),children:d.jsx(p,{width:120,height:90})},x))}),n.enabled&&d.jsx(qS,{children:c&&g?d.jsxs(d.Fragment,{children:[d.jsx("div",{children:"Frame will be divided into 4 pieces:"}),d.jsxs("div",{children:["2× ",g.top.width,"×",g.top.height," mm, 2× ",g.left.width,"×",g.left.height," mm"]}),d.jsxs("div",{style:{fontSize:"12px",color:N.textSecondary,marginTop:"8px"},children:["* Frame width: ",f,"mm"]})]}):d.jsxs("div",{style:{color:N.danger},children:["Frame width (",f,"mm) is too large for part dimensions (",u," × ",o," mm)"]})})]})},Ng=n=>{var y,x;if(!n)return{activeConfig:"none",hasCornerConfig:!1,hasEdgeConfig:!1,hasLShapeConfig:!1,isBasicConfigActive:!1,isLShapeConfigActive:!1};const u=n.corners&&Object.values(n.corners).some(p=>p&&p.type!=="none"),o=n.edges&&Object.values(n.edges).some(p=>p!=="none"),s=((y=n.lShape)==null?void 0:y.enabled)===!0,f=!!(n.corners||n.edges),c=!!((x=n.lShape)!=null&&x.enabled);let g="none";return s?g="lshape":(u||o||f)&&(g="basic"),{activeConfig:g,hasCornerConfig:!!u,hasEdgeConfig:!!o,hasLShapeConfig:!!s,isBasicConfigActive:f,isLShapeConfigActive:c}},tf=(n,u,o)=>u==="basic"?o?{lShape:void 0,corners:{topLeft:{type:"none"},topRight:{type:"none"},bottomLeft:{type:"none"},bottomRight:{type:"none"}},edges:GS()}:{corners:void 0,edges:void 0}:u==="lshape"?o?{lShape:{enabled:!0,leftWidth:Math.min(n.width*.3,50),rightWidth:Math.min(n.width*.7,n.width-50)},corners:void 0,edges:void 0}:{lShape:void 0}:{},GS=()=>({top:"none",right:"none",bottom:"none",left:"none"}),XS=n=>tf(n,"basic",!0),QS=n=>tf(n,"lshape",!0),Bg=n=>tf(n,"basic",!1),ZS=E.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
  margin-bottom: 20px;
  overflow: hidden;
`,WS=E.div`
  display: flex;
  border-bottom: 1px solid #e1e8ed;
  background: #f8f9fa;
`,KS=E.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${n=>n.$active?"white":"transparent"};
  color: ${n=>n.$active?"#2c3e50":"#7f8c8d"};
  font-weight: ${n=>n.$active?"600":"400"};
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: ${n=>n.$active?"white":"#e9ecef"};
    color: #2c3e50;
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: -2px;
    z-index: 1;
  }

  ${n=>n.$hasConfig&&`
    &::after {
      content: '●';
      position: absolute;
      top: 4px;
      right: 8px;
      color: #28a745;
      font-size: 0.7rem;
    }
  `}
`,FS=E.div`
  padding: 20px;
`,bc=E.div`
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
`,vc=E.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #2c3e50;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;E.div`
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 8px;
  font-style: italic;
`;const JS=E.div`
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-style: italic;
`,Sc=E.div`
  margin-top: ${n=>n.$marginTop||0}px;
`,IS=Ht.memo(({selectedPart:n,onPartUpdate:u})=>{var y,x,p;const[o,s]=$t.useState("basic");$t.useEffect(()=>{var z;if(!n)return;const v=Ng(n);v.isLShapeConfigActive?s("lshape"):(z=n.frame)!=null&&z.enabled?s("frame"):(v.hasCornerConfig||v.hasEdgeConfig,s("basic"))},[n]);const f=(v,z)=>{if(n){if(v==="basic")if(z){const j=XS(n);u(n.id,{...j,lShape:void 0,frame:void 0}),s("basic")}else{const j=Bg(n);u(n.id,j)}else if(v==="lshape")if(z){const j=QS(n);u(n.id,{...j,frame:void 0}),s("lshape")}else u(n.id,{lShape:void 0});else if(v==="frame")if(z){const j=zx(),H=Bg(n);u(n.id,{...H,lShape:void 0,frame:{...j,enabled:!0,type:"type1"}}),s("frame")}else u(n.id,{frame:void 0})}};if(!n)return d.jsx(JS,{children:"Vyberte diel pre úpravu parametrov"});const c=Ng(n),g=[{id:"basic",label:"Rohy",hasConfig:c.hasCornerConfig||c.hasEdgeConfig},{id:"lshape",label:"L-tvar",hasConfig:c.hasLShapeConfig},{id:"frame",label:"Rámček",hasConfig:((y=n.frame)==null?void 0:y.enabled)||!1}];return d.jsxs(ZS,{role:"tabpanel","aria-label":"Part Editor",children:[d.jsx(WS,{role:"tablist",children:g.map(v=>d.jsx(KS,{$active:o===v.id,$hasConfig:v.hasConfig,onClick:()=>s(v.id),role:"tab","aria-selected":o===v.id,"aria-controls":`tab-content-${v.id}`,children:v.label},v.id))}),d.jsxs(FS,{id:`tab-content-${o}`,role:"tabpanel",children:[o==="basic"&&d.jsxs("div",{children:[d.jsx(bc,{children:d.jsxs(vc,{children:[d.jsx("input",{type:"checkbox",checked:c.isBasicConfigActive,onChange:v=>f("basic",v.target.checked)}),"Použiť základné nastavenia (rohy a hrany)"]})}),c.isBasicConfigActive&&d.jsx(Sc,{$marginTop:ot.lg,children:d.jsx(xS,{selectedPart:n,onPartUpdate:u})})]}),o==="lshape"&&d.jsxs("div",{children:[d.jsx(bc,{children:d.jsxs(vc,{children:[d.jsx("input",{type:"checkbox",checked:c.isLShapeConfigActive,onChange:v=>f("lshape",v.target.checked)}),"Použiť L-tvar konfiguráciu"]})}),c.isLShapeConfigActive&&d.jsx(Sc,{$marginTop:ot.lg,children:d.jsx(W0,{selectedPart:n,onPartUpdate:u})})]}),o==="frame"&&d.jsxs("div",{children:[d.jsx(bc,{children:d.jsxs(vc,{children:[d.jsx("input",{type:"checkbox",checked:((x=n.frame)==null?void 0:x.enabled)||!1,onChange:v=>f("frame",v.target.checked)}),"Použiť rámček konfiguráciu"]})}),((p=n.frame)==null?void 0:p.enabled)&&d.jsx(Sc,{$marginTop:ot.lg,children:d.jsx(YS,{frameConfig:n.frame,onFrameConfigChange:v=>u(n.id,{frame:v}),partWidth:n.width,partHeight:n.height})})]})]})]})}),PS=(n,u,o=he.maxPreviewWidth,s=he.maxPreviewHeight)=>{const f=Math.min(o/n,s/u);return{scale:f,scaledWidth:n*f,scaledHeight:u*f}},t2=(n,u)=>{const o={},s=c=>{if(!u)return"#3498db";if(c.startsWith("block-")||c.startsWith("subblock-")){const x=c.match(/^(?:sub)?block-(?:composite-)?(\d+)/);if(x){const p=parseInt(x[1],10),v=u.find(z=>z.blockId===p);return(v==null?void 0:v.color)||"#3498db"}}const g=ki(c),y=u.find(x=>x.id===g);return(y==null?void 0:y.color)||"#3498db"},f={};return n.forEach(c=>{var x;if(c.part.id.startsWith("block-")||c.part.id.startsWith("subblock-")){const p=c.part.id.match(/^(?:sub)?block-(?:composite-)?(\d+)/);if(p&&u){const v=parseInt(p[1],10);f[v]||(f[v]={partTypes:new Set,totalPieces:0});const z=u.filter(j=>j.blockId===v);z.forEach(j=>{f[v].partTypes.add(j.id)}),f[v].totalPieces=z.reduce((j,H)=>j+(H.quantity||1),0)}return}const g=ki(c.part.id);let y=g;if(c.part.id.includes("_frame_")){const p=c.part.id.split("_frame_")[0];let v="Frame";if(u){const z=u.find(j=>j.id===p);z!=null&&z.label?v=z.label:z!=null&&z.width&&(z!=null&&z.height)&&(v=`${z.width}×${z.height}`)}y=`${v} - rámček`}else{if(u){const p=u.find(v=>v.id===g);if(p!=null&&p.label){y=p.label;const v=[];p.orientation==="fixed"?v.push("pevná orientácia"):p.orientation==="rotatable"&&v.push("otočiteľné"),v.length>0&&(y+=` (${v.join(", ")})`)}else p!=null&&p.width&&(p!=null&&p.height)&&(y=`${p.width}×${p.height}`)}y===g&&c.part.width&&c.part.height&&(y=`${c.part.width}×${c.part.height}`)}o[g]||(o[g]={label:y,color:s(c.part.id),count:0}),c.part.id.includes("_frame_")?((x=c.part.id.split("_frame_")[1])==null?void 0:x.split("-")[0])==="top"&&o[g].count++:o[g].count++}),Object.entries(f).forEach(([c,g])=>{const y=parseInt(c,10),x=`block-${y}`,p=u==null?void 0:u.find(v=>v.blockId===y);o[x]={label:`Blok ${y} (${g.partTypes.size} typov)`,color:(p==null?void 0:p.color)||"#3498db",count:1}}),o},e2=(n,u,o)=>{const s=o.reduce((f,c)=>f+c.part.width*c.part.height,0);return n*u-s},l2=n=>{const u=n.sheets.reduce((f,c)=>f+c.placedParts.length,0),o=u+n.unplacedParts.length,s=o>0?u/o:0;return{totalPlacedParts:u,totalRequestedParts:o,placementRatio:s}},Xa=n=>{const u=n.rotation===90;return{width:u?n.part.height:n.part.width,height:u?n.part.width:n.part.height}},n2=(n,u)=>{if(n.startsWith("block-")||n.startsWith("subblock-")){const f=n.match(/^(?:sub)?block-(?:composite-)?(\d+)/);if(f){const c=parseInt(f[1],10),g=u.filter(x=>x.blockId===c),y=g.find(x=>x.color)||g[0];return(y==null?void 0:y.color)||Rt.branding.colors.partsPalette[0]}}const o=ki(n),s=u.find(f=>f.id===o);return s&&s.color||Rt.branding.colors.partsPalette[0]},i2=()=>({color:Rt.visualization.blocks.borderColor,width:Rt.visualization.blocks.borderWidth,opacity:Rt.visualization.blocks.opacity}),Mi=()=>({color:Rt.visualization.blocks.innerBorderColor,width:Rt.visualization.blocks.innerBorderWidth,opacity:Rt.visualization.blocks.opacity}),Nc=n=>n===Rt.visualization.rotation.standard,kr=n=>{const u=Rt.visualization.formatting.decimalPlaces;return`${(n*100).toFixed(u)}%`},Ug=n=>n/Rt.visualization.formatting.unitConversion.mmToM2,a2=()=>({type:"DTD Laminovaná",thickness:Rt.material.material.thickness,sheetSize:{width:Rt.material.defaultBoard.width,height:Rt.material.defaultBoard.height}}),u2=()=>`order-${Date.now()}`,r2=()=>new Date().toISOString(),Bc={strokeWidth:{part:Rt.visualization.parts.strokeWidth.normal},colors:{sheetBorder:Rt.visualization.sheet.borderColor,partText:Rt.visualization.parts.text.color}},Lg=E.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
`,Hg=E.h2`
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 1.3rem;
`,o2=E.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`,s2=E.button`
  padding: 8px 16px;
  border: 2px solid #3498db;
  border-radius: 6px;
  background: ${n=>n.$active?"#3498db":"white"};
  color: ${n=>n.$active?"white":"#3498db"};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 80px;

  &:hover {
    background: ${n=>n.$active?"#2980b9":"#ecf0f1"};
  }

  .board-name {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .wood-type {
    font-size: 0.7rem;
    font-weight: 400;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`,c2=E.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,f2=E.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  .dimensions {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
  }

  .label {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`,d2=E.svg`
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
  max-width: 100%;
  height: auto;
`,h2=E.rect`
  fill: ${n=>n.$color};
  stroke: ${Bc.colors.sheetBorder};
  stroke-width: ${Bc.strokeWidth.part};
  opacity: 0.8;
`;E.text`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-anchor: middle;
  fill: ${Bc.colors.partText};
  pointer-events: none;
`;const m2=E.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
`,xr=E.div`
  text-align: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;

  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    display: block;
    margin-bottom: 4px;
  }

  .label {
    font-size: 0.75rem;
    color: #7f8c8d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`,g2=E.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
`,y2=E.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #2c3e50;
`,p2=E.div`
  text-align: center;
  color: #7f8c8d;
  padding: 40px 20px;

  p {
    margin: 0;
    font-size: 1rem;
  }
`;E.span`
  font-weight: bold;
  color: #2c3e50;
`;const x2=E.div`
  margin-top: 20px;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
`,b2=E.h4`
  color: #856404;
  margin: 0 0 8px 0;
`,v2=E.div`
  color: #856404;
  font-size: 0.9rem;
`;E.div`
  position: relative;
`;const S2=Ht.memo(({sheetLayout:n,enhancedParts:u=[]})=>{const[o,s]=$t.useState(0),f=$t.useMemo(()=>{if(!n||n.sheets.length===0)return null;const O=n.sheets[o],{sheetWidth:Z,sheetHeight:B,placedParts:L,efficiency:P}=O;return{currentSheet:O,sheetWidth:Z,sheetHeight:B,placedParts:L,efficiency:P,scaledDimensions:PS(Z,B),partGroups:t2(L,u),wastedArea:e2(Z,B,L),layoutStats:l2(n)}},[n,o,u]),c=O=>!O.placedParts||O.placedParts.length===0?"neurčený":O.placedParts[0].part.woodType||"neurčený",g=O=>({pine:"Borovica",oak:"Dub",beech:"Buk",birch:"Breza",spruce:"Smrek",maple:"Javor",borovica:"Borovica",dub:"Dub",buk:"Buk",breza:"Breza",smrek:"Smrek",javor:"Javor",neurčený:"Neurčený"})[O]||O;if(!n||n.sheets.length===0)return d.jsxs(Lg,{children:[d.jsx(Hg,{children:"Rozloženie na doskách"}),d.jsx(p2,{children:d.jsx("p",{children:"Pridajte dielce pre zobrazenie rozloženia na doskách"})})]});const{sheetWidth:y,sheetHeight:x,placedParts:p,efficiency:v,scaledDimensions:{scaledWidth:z,scaledHeight:j},partGroups:H,layoutStats:{totalPlacedParts:tt,totalRequestedParts:k}}=f;return d.jsxs(Lg,{children:[d.jsx(Hg,{children:"Rozloženie na doskách"}),n.sheets.length>1&&d.jsx(o2,{children:n.sheets.map((O,Z)=>{const B=c(O),L=g(B);return d.jsxs(s2,{$active:o===Z,onClick:()=>s(Z),children:[d.jsxs("span",{className:"board-name",children:["Doska ",O.sheetNumber]}),d.jsx("span",{className:"wood-type",children:L})]},O.sheetNumber)})}),d.jsxs(c2,{children:[d.jsxs(f2,{children:[d.jsxs("div",{className:"board-dimensions",children:[y," × ",x," mm"]}),d.jsx("div",{className:"board-label",children:"Rozmery dosky"})]}),d.jsxs(d2,{width:z,height:j,viewBox:`0 0 ${y} ${x}`,children:[d.jsx("rect",{x:"0",y:"0",width:y,height:x,fill:he.colors.sheetBackground,stroke:he.colors.sheetBorder,strokeWidth:he.strokeWidth.sheet}),d.jsx("defs",{children:d.jsx("pattern",{id:"grid",width:he.gridSize,height:he.gridSize,patternUnits:"userSpaceOnUse",children:d.jsx("path",{d:`M ${he.gridSize} 0 L 0 0 0 ${he.gridSize}`,fill:"none",stroke:he.colors.gridLines,strokeWidth:he.strokeWidth.grid})})}),d.jsx("rect",{width:"100%",height:"100%",fill:"url(#grid)"}),p.map(O=>{const Z=n2(O.part.id,u),{width:B,height:L}=Xa(O);return d.jsx("g",{children:d.jsx(h2,{x:O.x,y:O.y,width:B,height:L,$color:Z})},O.part.id)}),(()=>{if(!u)return null;const O=new Map;return p.forEach(Z=>{const B=ki(Z.part.id),L=u.find(P=>P.id===B);L!=null&&L.blockId&&(O.has(L.blockId)||O.set(L.blockId,[]),O.get(L.blockId).push(Z))}),Array.from(O.entries()).map(([Z,B])=>{if(B.length<2)return null;const L=Math.min(...B.map(J=>J.x)),P=Math.min(...B.map(J=>J.y)),Q=Math.max(...B.map(J=>{const{width:mt}=Xa(J);return J.x+mt})),rt=Math.max(...B.map(J=>{const{height:mt}=Xa(J);return J.y+mt}));return d.jsx("rect",{x:L-2,y:P-2,width:Q-L+4,height:rt-P+4,fill:"none",stroke:i2().color,strokeWidth:"3",strokeDasharray:"8,4",opacity:"0.8"},`block-border-${Z}`)})})(),(()=>{if(!u)return null;const O=new Map;p.forEach(B=>{const L=ki(B.part.id),P=u.find(Q=>Q.id===L);P!=null&&P.blockId&&(O.has(P.blockId)||O.set(P.blockId,[]),O.get(P.blockId).push(B))});const Z=[];return O.forEach((B,L)=>{if(B.length<2)return;const P=[...B].sort((Q,rt)=>Q.x-rt.x);for(let Q=0;Q<P.length-1;Q++){const rt=P[Q],J=P[Q+1],{width:mt,height:W}=Xa(rt),F=rt.x+mt;Math.abs(F-J.x)<=5&&Z.push(d.jsx("line",{x1:F,y1:rt.y,x2:F,y2:rt.y+W,stroke:"#34495e",strokeWidth:"4",opacity:"0.9"},`inner-border-${L}-${Q}`))}}),Z})(),p.map(O=>{if(!(O.part.id.startsWith("block-")||O.part.id.startsWith("subblock-"))||!O.part.blockId)return null;const B=u.filter(J=>J.blockId===O.part.blockId);if(B.length===0)return null;const L=[],{width:P,height:Q}=Xa(O),rt=B.reduce((J,mt)=>J+mt.width*mt.quantity,0);if(B.forEach(J=>{for(let mt=0;mt<J.quantity;mt++){const W=J.width/rt*P;L.push({width:W,height:Q})}}),L.length>1){const J=[];if(Nc(O.rotation)){let W=Number(O.y);const F=B.reduce((K,V)=>K+V.height*V.quantity,0);B.forEach(K=>{for(let V=0;V<K.quantity;V++){W>Number(O.y)&&J.push(d.jsx("line",{x1:O.x,y1:W,x2:O.x+P,y2:W,stroke:Mi().color,strokeWidth:Mi().width,opacity:Mi().opacity},`border-${O.part.id}-${J.length}`));const lt=K.height/F*Q;W+=lt}})}else{let W=Number(O.x);for(let F=0;F<L.length-1;F++)W+=Number(L[F].width),J.push(d.jsx("line",{x1:W,y1:O.y,x2:W,y2:O.y+Q,stroke:Mi().color,strokeWidth:Mi().width,opacity:Mi().opacity},`border-${O.part.id}-${F}`))}return J}return null}),d.jsxs("text",{x:y/2,y:x+he.spacing.dimensionOffset,textAnchor:"middle",fontSize:he.fontSize.dimensions,fill:he.colors.dimensionText,children:[y,"mm"]}),d.jsxs("text",{x:-20,y:x/2,textAnchor:"middle",fontSize:he.fontSize.dimensions,fill:he.colors.dimensionText,transform:`rotate(-90, -${he.spacing.dimensionOffset}, ${x/2})`,children:[x,"mm"]})]}),d.jsxs(m2,{children:[d.jsxs(xr,{children:[d.jsx("span",{className:"value",children:n.totalSheets}),d.jsx("div",{className:"label",children:"Počet dosiek"})]}),d.jsxs(xr,{children:[d.jsxs("span",{className:"value",children:[tt,"/",k]}),d.jsx("div",{className:"label",children:"Umiestnené dielce"})]}),d.jsxs(xr,{children:[d.jsx("span",{className:"value",children:kr(n.overallEfficiency)}),d.jsx("div",{className:"label",children:"Celková efektivita"})]}),d.jsxs(xr,{children:[d.jsx("span",{className:"value",children:kr(v)}),d.jsx("div",{className:"label",children:"Efektivita tejto dosky"})]})]}),Object.keys(H).length>0&&d.jsx(g2,{children:Object.entries(H).map(([O,Z])=>d.jsxs(y2,{children:[d.jsx(q0,{$color:Z.color}),Z.label," (",Z.count,"×)"]},O))}),n.unplacedParts.length>0&&d.jsxs(x2,{children:[d.jsx(b2,{children:"Neumiestnené dielce:"}),n.unplacedParts.map(O=>d.jsxs(v2,{children:["• ",O.width,"×",O.height,"mm"," ",O.label&&`(${O.label})`]},O.id))]})]})]})}),qg=E.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e1e8ed;
  margin-top: 20px;
`,Vg=E.h3`
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
`;E.p`
  margin: 0 0 16px 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
`;const $2=E(nl).attrs({variant:"primary"})`
  margin-bottom: 16px;

  &:active {
    background: #21618c;
  }
`,w2=E.pre`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  color: #495057;
  max-height: 600px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`,F0=Ht.memo(({sheetLayout:n,enhancedParts:u=[]})=>{const o=$t.useMemo(()=>{if(!n||!u.length)return null;const f={order:u2(),timestamp:r2(),material:a2(),sheets:n.sheets.map(c=>{const g=c.placedParts;return{sheetNumber:c.sheetNumber,dimensions:{width:c.sheetWidth,height:c.sheetHeight},cuts:g.map(y=>{var x;return{pieceId:y.part.id,position:{x:y.x,y:y.y},dimensions:{width:Nc(y.rotation)?y.part.height:y.part.width,height:Nc(y.rotation)?y.part.width:y.part.height},rotation:y.rotation,pieceType:((x=u.find(p=>p.id===y.part.id))==null?void 0:x.label)||`${y.part.width}x${y.part.height}`}}),efficiency:kr(c.efficiency),wastedArea:c.sheetWidth*c.sheetHeight-g.reduce((y,x)=>y+x.part.width*x.part.height,0)}}),pieces:u.map(c=>({id:c.id,width:c.width,height:c.height,quantity:c.quantity,type:c.label||`${c.width}x${c.height}`,...Object.values(c.edges||{}).some(g=>g!=="none")&&{edges:Object.fromEntries(Object.entries(c.edges||{}).filter(([,g])=>g!=="none"))},...c.hasCornerModifications&&{corners:!0},...c.isLShape&&{lShape:!0},...c.isFrame&&{frame:!0},...c.blockId&&{block:c.blockId},...c.orientation==="rotatable"&&{rotatable:!0}})),...n.unplacedParts.length>0&&{unplacedPieces:n.unplacedParts.map(c=>({id:c.id,width:c.width,height:c.height,originalQuantity:c.quantity||1,reason:"Could not fit on available sheets"}))},summary:(()=>{const c=n.sheets.flatMap(g=>g.placedParts);return{totalPieces:u.reduce((g,y)=>g+y.quantity,0),placedPieces:c.length,unplacedPieces:n.unplacedParts.length,sheets:n.totalSheets,overallEfficiency:kr(n.overallEfficiency),totalMaterialUsed:Ug(n.sheets.reduce((g,y)=>g+y.sheetWidth*y.sheetHeight,0)),totalWastedArea:Ug(n.sheets.reduce((g,y)=>g+(y.sheetWidth*y.sheetHeight-y.placedParts.reduce((x,p)=>x+p.part.width*p.part.height,0)),0))}})(),verification:(()=>{const c=n.sheets.flatMap(x=>x.placedParts),g=u.reduce((x,p)=>x+p.quantity,0),y=c.length;return{expectedPieceCount:g,actualPlacedCount:y,unplacedCount:n.unplacedParts.length,discrepancy:g-(y+n.unplacedParts.length)}})()};return JSON.stringify(f,null,2)},[n,u]),s=()=>{o&&navigator.clipboard.writeText(o)};return o?d.jsxs(qg,{children:[d.jsx(Vg,{children:"Export GAP 010 - Complete Cutting Layout"}),d.jsx($2,{onClick:s,children:"Kopírovať dáta"}),d.jsx(w2,{children:o})]}):d.jsx(qg,{children:d.jsx(Vg,{children:"Export GAP 010 - Complete Cutting Layout"})})});F0.displayName="SupplierDataOutput";const E2=E.div`
  max-width: ${i1.maxWidth};
  margin: 0 auto;
  padding: ${ot.xxl}px;
  font-family: ${vt.fontFamily.system};
  background: ${N.background};
  min-height: 100vh;
`,T2=E.header`
  text-align: center;
  margin-bottom: ${ot.xxxl*1.5}px;

  h1 {
    color: ${N.textPrimary};
    font-size: ${vt.fontSize["3xl"]};
    margin-bottom: ${ot.md}px;
  }

  p {
    color: ${N.textSecondary};
    font-size: ${vt.fontSize.base};
    margin: 0;
  }
`,z2=E.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${ot.xxl}px;

  @media (max-width: ${Vi.tablet}) {
    grid-template-columns: 1fr;
  }
`,j2=E.div`
  display: flex;
  flex-direction: column;
  gap: ${ot.xxl}px;
`,A2=E.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`,C2=E.div`
  position: relative;
`,_2=E.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #666;
  font-size: 16px;
  text-align: center;
`,Yg=E.p`
  margin: 0;

  &.secondary {
    font-size: 14px;
    margin-top: 8px;
  }
`,D2=Ht.memo(eS),M2=Ht.memo(S2),R2=Ht.memo(IS),O2=()=>{const[n,u]=$t.useState(null),{addDimensionalPart:o,updateDimensionalPart:s,removeDimensionalPart:f,clearAllParts:c,optimizedLayout:g,updateVisualEnhancements:y,updatePartEdge:x,updatePartCorner:p,updatePartLShape:v,updatePartWoodType:z,enhancedParts:j,getEnhancedPartById:H,totalCuttingArea:tt,totalPartCount:k}=Zx(),{sheetLayout:O,isCalculating:Z}=g,B=$t.useCallback((mt,W)=>{var F,K;if(W!==void 0){$c();const V=Ri(`block-${W}`,{blockId:W}),lt=j.filter(ct=>ct.blockId===W);s(mt,{blockId:W,color:V}),lt.forEach(ct=>{s(ct.id,{blockId:ct.blockId,color:V})})}else{const V=Ri(mt,{blockId:void 0,width:(F=j.find(lt=>lt.id===mt))==null?void 0:F.width,height:(K=j.find(lt=>lt.id===mt))==null?void 0:K.height});s(mt,{blockId:W,color:V})}},[s,j]),L=$t.useCallback((mt,W)=>{s(mt,{orientation:W?"rotatable":"fixed"})},[s]),P=$t.useCallback((mt,W,F)=>{const V=["top","right","bottom","left"].indexOf(W);V!==-1&&x(mt,V,F)},[x]),Q=$t.useMemo(()=>n?H(n):null,[n,H]),rt=$t.useCallback((mt,W)=>{const{cuttingUpdates:F,visualUpdates:K}=eb(W);Object.keys(F).length>0&&s(mt,F),Object.keys(K).length>0&&y(mt,K),K.edges&&lb(K.edges).forEach(({edgeIndex:lt,value:ct})=>{x(mt,lt,ct)}),K.corners&&nb(K.corners).forEach(({cornerIndex:lt,cornerData:ct})=>{p(mt,lt,ct)}),K.lShape&&v(mt,K.lShape)},[s,y,x,p,v]),J=Kx(j);return d.jsxs(E2,{children:[d.jsxs(T2,{children:[d.jsx("h1",{children:"Konfigurátor porezu"}),d.jsx("p",{children:"Jednoduché nástroj pre plánovanie rozloženia dielcov na doske"}),d.jsx(g1,{isLoading:Z})]}),d.jsxs(z2,{children:[d.jsxs(j2,{children:[d.jsx(Gv,{onAddPart:o,existingParts:j}),d.jsx(D2,{enhancedParts:j,totalArea:tt,totalParts:k,selectedPartId:n||void 0,onPartSelect:u,onRemovePart:f,onClearAll:c,onPartBlockUpdate:B,onPartRotationUpdate:L,onPartWoodTypeUpdate:z,onPartEdgeUpdate:P}),d.jsx(R2,{selectedPart:Q,onPartUpdate:rt})]}),d.jsxs(A2,{children:[d.jsx(C2,{children:J?d.jsx(_2,{children:d.jsxs("div",{children:[d.jsx(Yg,{children:"⚠️ Opravte chyby validácie pred zobrazením náhľadu"}),d.jsx(Yg,{className:"secondary",children:"Skontrolujte šírku blokov v zozname dielcov"})]})}):d.jsxs(d.Fragment,{children:[d.jsx(M2,{sheetLayout:O,enhancedParts:j}),d.jsx(m1,{isLoading:Z,message:"Calculating optimal layout...",overlay:!0})]})}),d.jsx(F0,{sheetLayout:O,enhancedParts:j})]})]})]})},k2=()=>d.jsx(O2,{});bx.createRoot(document.getElementById("root")).render(d.jsx($t.StrictMode,{children:d.jsx(k2,{})}));
