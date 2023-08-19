<template>
	<div>
			<div v-if="merchantName!=null && merchantName!=''" class="title-head" :style="{height: htmlProportion * 150 + 'px'}">{{merchantName? merchantName:""}}</div>
		<div class="lf-pay-panel" :style="{height: htmlProportion * 300 + 'px'}">
			<div>
				<div class="one">
					<span class="text-sm">请向收银员询问应付金额</span>
				</div>
				<div class="two">
					<span class="text-llg">{{yenSymbol}} {{actualPayment}}</span>
				</div>
				<div class="three">
					<input class="text-grey" type="text" placeholder="添加备注(20个字以内)">
				</div>
			</div>
		</div>
		<div class="lf-pay-btn" :style="{height: htmlProportion * 200 + 'px'}">
			<div @click="payment">
				<span class="text-lg">付 款</span>
			</div>
		</div>
	</div>
</template>

<script>
	import {getWebPay, getMerchantName} from '../../../api/vueAPI.js'
	import {Message} from 'element-ui';
	export default{
		data() {
			return{
				htmlProportion: '',		//屏幕长宽比例
				htmlWidth: '',		//屏幕宽
				htmlheight: '',		//屏幕高
				isWxPay: true,	
				yenSymbol: '\u00A5',	//金钱符号
				payMoney: '',	//支付金额
				actualPayment: '',		//实际支付
				discountPrice: '',		//微信支付openId
				openId: '',		//商户门店userId
				userId: '',		//操作人
				storeId: '',	//商户id
				price: '',
				timeStamp:'',
				orderNumber: '',
				merchantName: '',
				/* 测试用显示数据~ */
				testProcess: '',
				testMoney: '',
				testRes: '',
				testFail: '',
				testData: '',
			}
		},
		created() {
			this.htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
			this.htmlheight = document.documentElement.clientHeight || document.body.clientHeight;
			this.htmlProportion = this.htmlWidth / 750 ;
			// console.log(this.htmlWidth);
			// console.log(this.htmlheight);
			let payMoney = this.$route.query.paymentMoney
			if(payMoney != null && payMoney != '' && payMoney){
				this.payMoney = payMoney;
			}
			let discountPrice = this.$route.query.discountPrice
			if(discountPrice != null && discountPrice != '' && discountPrice){
				this.discountPrice = discountPrice;
			}
			let openId = this.$route.query.openId
			if(openId != null && openId != '' && openId){
				this.openId = openId;
			}
			let userId = this.$route.query.userId
			if(userId != null && userId != '' && userId){
				this.userId = userId;
			}
			let storeId = this.$route.query.storeId
			if(storeId != null && storeId != '' && storeId){
				this.storeId = storeId;
			}
			let memberId = this.$route.query.memberId
			if(memberId != null && memberId != '' && memberId){
				this.memberId = memberId;
			}
			let code = this.$route.query.code
			if(code != null && code != '' && code){
				this.code = code;
			}
			let merchantId = sessionStorage.getItem("merchantId")
			if(merchantId != null && merchantId != '' && merchantId){
				this.merchantId = merchantId;
			}
			console.log(this.payMoney, this.discountPrice, this.openId, this.userId, this.storeId, this.memberId, this.code, this.merchantId)
			// this.testProcess = '创建页面'
			// this.testMoney = this.payMoney
			getMerchantName(this.userId).then(res => {
				console.log(res)
        this.merchantName = res.obj
			}).catch(err => {
				console.log(err)
			})
			if(this.discountPrice != null && this.discountPrice != '' && this.discountPrice){
				this.actualPayment = (this.payMoney - this.discountPrice).toFixed(2)
			}else{
				this.actualPayment = this.payMoney
			}
			
		},
		methods:{
			/* 付款 */
			payment() {
				// this.testProcess = '进行付款'
				getWebPay(1, this.payMoney, this.userId, this.openId, this.storeId, this.discountPrice, this.memberId, this.code, this.merchantId).then(res => {
					// this.testProcess = '付款接口调取成功，进行付款跳转'
					console.log(res)
					this.testRes = JSON.stringify(res)
          switch(parseInt(res.obj.openWay)){
            case 1:  /* 第三方支付-/ */
              // this.testProcess = '进行第三方支付'易融码 *
              window.location.href = res.obj.payUrl  //跳转外部链接
              break
            case 2:   /* openWay=2 微信官方支付 */
              // this.testProcess = '进行官方支付'
              this.wxPay(res.obj.jsPayResponse);
              this.price = this.payMoney-this.discountPrice
              this.timeStamp = res.obj.jsPayResponse.timeStamp
              this.orderNumber = res.obj.jsPayResponse.orderNumber
              break
          }


        }).catch(err => {
					console.log(err)
					// this.testProcess = '付款接口调取失败，尝试获得错误信息'
					// this.testFail = err
				})
				/* 跳转付款成功 */
				// this.$router.push({
				// 	path:'/wx/paySuccess',	//地址
				// 	query:{}	//传参
				// })
			},
			/* 进行微信官方支付 */
			wxPay(payObj) {
				if (typeof WeixinJSBridge == "undefined"){
					if( document.addEventListener ){
						document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					}else if (document.attachEvent){
						document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
						document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					}
				}else{
					this.onBridgeReady(payObj);
					this.testData = payObj;
				}
			},
			/* 唤醒微信支付*/
			onBridgeReady(payObj) {
				let that = this;
				// alert(JSON.stringify(payObj))
				// this.testProcess = '进行微信唤醒'
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": payObj.appId,     		//公众号名称，由商户传入     
						"timeStamp":payObj.timeStamp,         //时间戳，自1970年以来的秒数     
						"nonceStr":payObj.nonceStr, 	//随机串     
						"package":payObj.pkg,     
						"signType":payObj.signType,         //微信签名方式：     
						"paySign":payObj.paySign 		//微信签名 
					},
					function(res){
						// that.testProcess = '唤醒结束，进行返回值事件'
						if(res.err_msg == "get_brand_wcpay_request:ok" ){
						// 使用以上方式判断前端返回,微信团队郑重提示：
								//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							// alert("支付成功");
							// that.$router.push({
							// 	path: "/wx/paySuccess",
							// 	query:{
							// 		price: that.price,
							// 		timeStamp: that.timeStamp,
							// 		orderNumber: that.orderNumber
							// 	}	//传参
							// })
							console.log("支付成功");
							that.$router.push({
								path: "/advertisement",
								query:{
                  userId:that.userId,
                  storeId:that.storeId,
                  merchantId:that.merchantId,
                  price: that.price,
                  timeStamp: that.timeStamp,
                  orderNumber: that.orderNumber
                }	//传参
							})
						} 
						if(res.err_msg == "get_brand_wcpay_request:cancel"){
							alert("支付取消");
							// alert(JSON.stringify(res))
						}
						if(res.err_msg == "get_brand_wcpay_request:fail"){
							alert('支付失败')
							alert(JSON.stringify(res))
						}
						if(res.err_msg == "total_fee"){
							alert('缺少参数')
						}
					}
				);
			}
		}
	}
</script>

<style>
	body{
		background-color: #F5F2F0;
		margin: 0;
		padding: 0;
		/* font-size: 1.125rem; */
	}
	.text-sm{	/* 14 */
		font-size: 0.875rem;
	}
	.text-lg{	/* 24 */
		font-size: 1.5rem;
	}
	.text-llg{	/* 36 */
		font-size: 2.25rem;
	}
	.text-weight{
		font-weight: 800;
	}
	.text-ff4500{	/* 橙红 */
		color: #ff4500;
	}
	.text-2dc26f{	/* 绿 */
		color: #2dc26f;
	}
	.text-grey{		/* 草灰 */
		color: #a9a9a9;
	}
	.margin-right-10{
		margin-right: 0.625rem;
	}
	.lf-nav{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		/* height: 80px; */
		background-color: #F1F1F3;
		border-bottom: 0.0625rem solid #bdbdc6;
	}
	.lf-nav-mat{
		width: 100%;
		/* height: 40px; */
	}
	.lf-nav-text{
		width: 100%;
		/* height: 80px; */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-nav-text > div{
		display: flex;
		align-items: center;
	}
	.lf-nav-text span{
		margin: 0 0.625rem;
	}
	.lf-store-name{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-pay-panel{
		width: 100%;
		/* margin-left: -0.3125rem; */
		/* padding: 0 0.3125rem; */
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FFF;
		border-top: 0.0625rem solid #bdbdc6;
		border-bottom: 0.0625rem solid #bdbdc6;
	}
	.lf-pay-panel > div{
		width: 80%;
		height: 80%;
	}
	.lf-pay-panel .one {
		width: 100%;
		height: 20%;
		display: flex;
		align-items: center;
	}
	.lf-pay-panel .two {
		width: 100%;
		height: 50%;
		display: flex;
		align-items: center;
		border-bottom: 0.0625rem solid #bdbdc6;
	}
	.lf-pay-panel .three {
		width: 100%;
		height: 30%;
		display: flex;
		align-items: center;
	}
	.lf-pay-panel .three input {
		border: 0;
	}
	.lf-pay-btn{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-pay-btn > div{
		width: 80%;
		height: 60%;
		background-color: #ff4500;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.625rem;
		color: #FFF;
	}
	.text-sm{	/* 14 */
		font-size: 0.875rem;
	}
	.text-lg{	/* 24 */
		font-size: 1.5rem;
	}
	.text-llg{	/* 36 */
		font-size: 2.25rem;
	}
	.text-weight{
		font-weight: 800;
	}
	.text-ff4500{	/* 橙红 */
		color: #ff4500;
	}
	.text-2dc26f{	/* 绿 */
		color: #2dc26f;
	}
	.text-grey{		/* 草灰 */
		color: #a9a9a9;
	}
	.margin-right-10{
		margin-right: 0.625rem;
	}
	.lf-nav{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		/* height: 80px; */
		background-color: #F1F1F3;
		border-bottom: 0.0625rem solid #bdbdc6;
	}
	.lf-nav-mat{
		width: 100%;
		/* height: 40px; */
	}
	.lf-nav-text{
		width: 100%;
		/* height: 80px; */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-nav-text > div{
		display: flex;
		align-items: center;
	}
	.lf-nav-text span{
		margin: 0 0.625rem;
	}
	.lf-store-name{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
    background: white;
	}
  .title-head
  {
  /* 商户标题*/
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
  }
	.lf-pay-panel{
		width: 100%;
		/* margin-left: -0.3125rem; */
		/* padding: 0 0.3125rem; */
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FFF;
		/*border-top: 0.0625rem solid #bdbdc6;*/
		/*border-bottom: 0.0625rem solid #bdbdc6;*/
	}
	.lf-pay-panel > div{
		width: 80%;
		height: 80%;
	}
	.lf-pay-panel .one {
		width: 100%;
		height: 20%;
		display: flex;
		align-items: center;
	}
	.lf-pay-panel .two {
		width: 100%;
		height: 50%;
		display: flex;
		align-items: center;
		border-bottom: 0.0625rem solid #bdbdc6;
	}
	.lf-pay-panel .three {
		width: 100%;
		height: 30%;
		display: flex;
		align-items: center;
	}
	.lf-pay-panel .three input {
		border: 0;
	}
	.lf-pay-btn{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-pay-btn > div{
		width: 80%;
		height: 60%;
		background-color: #ff4500;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.625rem;
		color: #FFF;
	}
</style>
