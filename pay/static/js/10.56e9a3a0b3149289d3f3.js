webpackJsonp([10],{"8Uqu":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=s("4LH3"),a={data:function(){return{tradeNo:"",successUrl:"",testProcess:"无",test:"无"}},created:function(){var e=this;this.tradeNo=this.$route.query.tradeNo;var t=this.$route.query.successUrl;null!=t&&""!=t&&"null"!=t&&t&&(this.successUrl=t),setTimeout(function(){e.tradePay()},300)},methods:{ready:function(e){window.AlipayJSBridge?e&&e():document.addEventListener("AlipayJSBridgeReady",e,!1)},tradePay:function(){var e=this;this.ready(function(){var t=this;"undefined"!=typeof AlipayJSBridge?AlipayJSBridge.call("tradePay",{tradeNO:e.tradeNo},function(t){"9000"==t.resultCode&&e.successUrl&&(window.location.href=e.successUrl),"4000"==t.resultCode&&Object(r.Message)({showClose:!0,message:"支付失败",type:""}),"6001"==t.resultCode&&Object(r.Message)({showClose:!0,message:"支付取消",type:""}),"6002"==t.resultCode&&Object(r.Message)({showClose:!0,message:"网络连接出错",type:""})}):setTimeout(function(){t.tradePay()},500)})}}},n={render:function(){var e=this.$createElement;return(this._self._c||e)("div")},staticRenderFns:[]};var o=s("C7Lr")(a,n,!1,function(e){s("HZO7")},null,null);t.default=o.exports},HZO7:function(e,t){}});