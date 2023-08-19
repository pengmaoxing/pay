<template>
	<div>
		<!-- <p>tradeNo:{{tradeNo}}</p>
		<p>successUrl:{{successUrl}}</p>
		<p>test:{{test}}</p>
		<p>进程：{{testProcess}}</p> -->
	</div>
</template>

<script>
	import {Message} from 'element-ui';
	export default{
		data() {
			return{
				tradeNo:'',
				successUrl:'',
				testProcess: '无',
				test:'无',
			}
		},
		created() {
			this.tradeNo = this.$route.query.tradeNo
			let successUrl = this.$route.query.successUrl;
			if(successUrl != null && successUrl != '' && successUrl != 'null' && successUrl){
				this.successUrl = successUrl
			}
			setTimeout(() => {
				this.tradePay()
				// this.testProcess = '开始支付'
			},300)
		},
		methods: {
			// 由于js的载入是异步的，所以可以通过该方法，当AlipayJSBridgeReady事件发生后，再执行callback方法
			ready(callback) {
			    if (window.AlipayJSBridge) {
						// this.testProcess = '载入1'
			        callback && callback();
			    } else {
						// this.testProcess = '载入2'
			        document.addEventListener('AlipayJSBridgeReady', callback, false);
			    }
			},
			tradePay() {
				let that = this
			  this.ready(function(){
						// that.testProcess = '准备唤起1'
					// that.test = typeof AlipayJSBridge
					if(typeof AlipayJSBridge == "undefined"){
						setTimeout(() => {
							this.tradePay()
						},500)
						return
					}
			      // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
						// that.testProcess = '准备唤起2'
			      AlipayJSBridge.call("tradePay", {
			          tradeNO: that.tradeNo
			      }, function (data) {
			          if ("9000" == data.resultCode) {
									// that.testProcess = '支付成功'
									if(that.successUrl){
										window.location.href = that.successUrl
									}
			          }else{
									// that.testProcess = '支付失败'
								}
			          if ("4000" == data.resultCode) {
									Message({
									  showClose: true,
									  message: '支付失败',
									  type: ''
									});
			          }
			          if ("6001" == data.resultCode) {
									Message({
									  showClose: true,
									  message: '支付取消',
									  type: ''
									});
			          }
			          if ("6002" == data.resultCode) {
									Message({
									  showClose: true,
									  message: '网络连接出错',
									  type: ''
									});
			          }
			      });
			  });
			}
		}
	}
</script>

<style>
	
</style>
