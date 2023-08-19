<template>
	<div>
		<!-- <p>openId: {{openId}}</p>
		<p>appId: {{payObj.appId}}</p>
		<p>timeStamp: {{payObj.timeStamp}}</p>
		<p>nonceStr: {{payObj.nonceStr}}</p>
		<p>package: {{payObj.package}}</p>
		<p>signType: {{payObj.signType}}</p>
		<p>paySign: {{payObj.paySign}}</p>
		<p>successUrl: {{successUrl}}</p>
		<p>进程：{{testProcess}}</p>
		<p>test：{{test}}</p> -->
	</div>
</template>

<script>
	import {Message} from 'element-ui';
	export default{
		data() {
			return{
				openId:'',
				payObj:{
					"appId": '',     		//公众号名称，由商户传入
					"timeStamp":'',         //时间戳，自1970年以来的秒数     
					"nonceStr":'', 	//随机串     
					"package":'',     
					"signType":'',         //微信签名方式：     
					"paySign":'' 		//微信签名 
				},
				successUrl:'',
				testProcess: '无',
				test: '无',
			}
		},
		created() {
			this.openId = this.$route.query.openId
			this.payObj.appId = this.$route.query.appId
			this.payObj.timeStamp = this.$route.query.timeStamp
			this.payObj.nonceStr = this.$route.query.nonceStr
			this.payObj.package = this.$route.query.package
			this.payObj.signType = this.$route.query.signType
			this.payObj.paySign = this.$route.query.paySign
			// this.successUrl = this.$route.query.successUrl
			let successUrl = this.$route.query.successUrl;
			if(successUrl != null && successUrl != '' && successUrl != 'null' && successUrl){
				this.successUrl = successUrl
			}
			setTimeout(() => {
				this.wxPay()
			},500)
		},
		methods: {
			/* 进行微信官方支付 */
			wxPay() {
				// this.testProcess = '开始支付'
				if (typeof WeixinJSBridge == "undefined"){
					if( document.addEventListener ){
					// this.testProcess = '准备唤醒2'
						document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(), false);
					}else if (document.attachEvent){
					// this.testProcess = '准备唤醒3.1'
						document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady()); 
					// this.testProcess = '准备唤醒3.2'
						document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady());
					}
				}else{
					// this.testProcess = '准备唤醒1'
					this.onBridgeReady();
				}
			},
			/* 唤醒微信支付*/
			onBridgeReady() {
				// this.testProcess = '进行微信唤醒'
				let that = this;
				// this.test = typeof WeixinJSBridge
				if(typeof WeixinJSBridge == "undefined"){
					setTimeout(() => {
						this.wxPay()
					},500)
					return
				}
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": that.payObj.appId,     		//公众号名称，由商户传入     
						"timeStamp": that.payObj.timeStamp,         //时间戳，自1970年以来的秒数     
						"nonceStr": that.payObj.nonceStr, 	//随机串     
						"package": that.payObj.package,     
						"signType": that.payObj.signType,         //微信签名方式：     
						"paySign": that.payObj.paySign 		//微信签名 
					},
					function(res){
						// that.testProcess = '唤醒结束，进行返回值事件'
						if(res.err_msg == "get_brand_wcpay_request:ok" ){
							// that.testProcess = '支付成功'
							if(that.successUrl){
								window.location.href = that.successUrl
							}
						}else{
							// that.testProcess = '支付失败'
						}
						if(res.err_msg == "get_brand_wcpay_request:cancel"){
							Message({
							  showClose: true,
							  message: '支付取消',
							  type: ''
							});
						}
						if(res.err_msg == "get_brand_wcpay_request:fail"){
							Message({
							  showClose: true,
							  message: '支付失败',
							  type: ''
							});
						}
						if(res.err_msg == "total_fee"){
							Message({
							  showClose: true,
							  message: '支付失败，原因：缺少参数',
							  type: ''
							});
						}
					}
				);
			}
		}
	}
</script>

<style>
	
</style>
