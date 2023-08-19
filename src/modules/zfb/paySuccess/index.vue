<template>
	<div>
		<!-- 导航栏 -->
		<!-- <div class="lf-nav" :style=" {height: htmlProportion * 120 + 'px'} ">
			<div class="lf-nav-mat" :style=" {height: htmlProportion * 40 + 'px'} "></div>
			<div class="lf-nav-text" :style=" {height: htmlProportion * 80 + 'px'} ">
				<div>
					<span class="lf-icon-close text-lg"></span>
					<span>给商户付款</span>
				</div>
				<span class="lf-icon-ellipsis text-lg"></span>
			</div>
		</div>
		<div class="lf-mat" :style="{height: htmlProportion * 120 + 'px'}"></div> -->
		<!-- 内容 -->
		<div class="lf-store-name" :style="{height: htmlProportion * 150 + 'px'}">
			<span class="text-lg">{{merchantName? merchantName:''}}</span>
		</div>
		<div class="lf-pay-panel" :style="{height: htmlProportion * 300 + 'px'}">
			<div>
				<div class="one">
					<span class="text-sm">请向收银员询问应付金额</span>
				</div>
				<div class="two">
					<span class="text-llg">{{yenSymbol}} </span>
          <input v-model="payMoney" type="number" style="font-size:2.25rem;width:80%;border: none;" @focus="inputEmpty"></input>
				</div>
				<div class="three">
					<input class="text-grey" type="text" maxlength="20" placeholder="添加备注(20个字以内)" v-model="remarks">
				</div>
			</div>
		</div>
		<div class="lf-pay-btn" :style="{height: htmlProportion * 200 + 'px'}">
			<div @click="payment" :class="[{'bg-ff4500': !payLoading},{'bg-ad2f00': payLoading}]">
				<!-- <image src="../../../assets/loading.png" mode=""></image> -->
				<div class="icon-loading" v-if="payLoading"></div>
				<span class="text-lg">付 款</span>
			</div>
		</div>
		<!-- <p>userId: {{userId}}</p> -->
		<!-- <p>进程状态: {{testProcess}}</p> -->
		<!-- <p>支付金额: {{testMoney}}</p> -->
		<!-- <p>接口反馈: {{testRes}}</p> -->
		<!-- <p>错误信息: {{testFail}}</p> -->
		<!-- <button @click="payTest">按钮</button> -->
	</div>
</template>

<script>
	import {getWebPay, getMerchantName} from '../../../api/vueAPI.js'
	export default{
		data() {
			return{
				htmlProportion: '',		//屏幕长宽比例
				htmlWidth: '',		//屏幕宽
				htmlheight: '',		//屏幕高
				isWxPay: true,	
				yenSymbol: '\u00A5',	//金钱符号
				payMoney: '',		//实付金额
				userId: '',		//商户门店userId
				remarks: '', //备注
				testProcess: '',
				testMoney: '',
				testRes: '暂无数据',
				testFail: '暂无错误信息',
				merchantName: '',
				storeId: '',
				buyerId: '',
				merchantId: '',
				memberOpenId: '',
				price: '',
				timeStamp: '',
				orderNumber: '',
				payLoading: false,
			}
		},
		created() {
			this.htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
			this.htmlheight = document.documentElement.clientHeight || document.body.clientHeight;
			this.htmlProportion = this.htmlWidth / 750 ;
			// console.log(this.htmlWidth);
			// console.log(this.htmlheight);
			/* 获取 */
			this.testProcess = '开始'
			let buyerId = this.$route.query.buyerId
			if(buyerId != null && buyerId != '' && buyerId != 'null' && buyerId){
				this.openId = buyerId
			}
			let payMoney = this.$route.query.price
			if(payMoney != null && payMoney != '' && payMoney != 'null' && payMoney){
				this.payMoney = payMoney
			}
			let userId = this.$route.query.userId
			if(userId != null && userId != '' && userId != 'null' && userId){
				this.userId = userId
				this.testProcess = userId
			}
			let storeId = this.$route.query.storeId
			if(storeId != null && storeId != '' && storeId != 'null' && storeId){
				this.storeId = storeId
			}
			let merchantId = this.$route.query.merchantId;
			if(merchantId != null && merchantId != '' && merchantId != 'null' && merchantId){
			  this.merchantId = merchantId
			}
			getMerchantName(this.userId, this.merchantId).then(res => {
				// this.testRes = res
				console.log(res)
				this.merchantName = res.obj
			}).catch(err => {
				console.log(err)
					this.testFail = err
			})
		},
		watch:{
			payLoading(val,oldVal){
				if(this.payLoading == true){
					setTimeout(() => {
						this.payLoading = false
					},2000)
				}
			}
		},
		methods:{
			/* 付款 */
			payment() {
				if(this.payLoading == true){
					return
				}
				this.payLoading = true;
				this.testProcess = '进行付款'
        var temp= /^\d+\.?\d{0,2}$/;
				if(temp.test(this.payMoney))
        {
          if(this.payMoney!=0)
          {
            getWebPay(2, this.payMoney, this.userId, this.openId, this.storeId, '' , '', '', '', this.remarks).then(res => {
              this.testProcess = '付款接口调取成功，进行付款跳转;'+res.obj.openWay
							// this.payLoading = false;
              console.log(res)
							this.timeStamp = res.obj.payTime
							this.orderNumber = res.obj.orderNumber
							switch(parseInt(res.obj.openWay)){
								case 1: //用链接直接打开
									this.testProcess = '链接直接打开'
									window.location.href = res.obj.payUrl		//跳转外部链接-支付宝支付链接
									break;
								case 2: //支付宝官方唤醒支付
									this.testProcess = '开始唤醒付款'
									this.tradePay(res.obj.tradeNo);
									break;
							}
            }).catch(err => {
							// this.payLoading = false;
              console.log(err)
              this.testProcess = '付款接口调取失败，尝试获得错误信息'
              this.testFail = err
            })
          }else{
						// this.payLoading = false;
					}
        }else
          {
						// this.payLoading = false;
            this.$message.warning('金额错误')
          }
			},
			//清空输入框
			inputEmpty() {
				this.payMoney = ''
			},
			// 由于js的载入是异步的，所以可以通过该方法，当AlipayJSBridgeReady事件发生后，再执行callback方法
			ready(callback) {
			    if (window.AlipayJSBridge) {
			        callback && callback();
			    } else {
			        document.addEventListener('AlipayJSBridgeReady', callback, false);
			    }
			},
			tradePay(tradeNO) {
				let that = this
				this.testProcess = '进行唤醒付款'
			  this.ready(function(){
			      // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
			      AlipayJSBridge.call("tradePay", {
			          tradeNO: tradeNO
			      }, function (data) {
			          if ("9000" == data.resultCode) {
									that.testProcess = '唤醒付款成功'
									that.$router.push({
										path: "/zfb/advertisement",
										query:{
									    userId:that.userId,
									    storeId:that.storeId,
									    merchantId:that.merchantId,
									    price: that.payMoney,
									    timeStamp: that.timeStamp,
									    orderNumber: that.orderNumber
									  }	//传参
									})
			          }
			      });
			  });
			}
		}
	}
</script>

<style>
	body{
		background-color: #F5F2F0;
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
		width: 100%;
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
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0.625rem;
		color: #FFF;
		transition: all 0.3s;
	}
	.bg-ff4500{
		background-color: #ff4500;
	}
	.bg-ad2f00{
		background-color: #ad2f00;
	}
	.icon-loading{
		width: 1.5rem;
		height: 1.5rem;
		margin-right: 0.625rem;
		background-image: url('../../../assets/loading.png');
		background-repeat: no-repeat;
		background-size: 1.5rem 1.5rem;
		transition: all 0.3s;
	}
</style>
