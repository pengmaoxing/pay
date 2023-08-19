<template>
	<div>
<!--		 <div>-->
<!--			<button class="weui_btn primary" @click="jump('/zfb/paySuccess')">支付宝</button>-->
<!--			<button class="weui_btn primary" @click="jump('/wx/paySelect')">微信</button>-->
<!--			<button class="weui_btn primary" @click="jump('/qrcode')">二维码</button>-->
<!--		</div>-->
<!--		<div class="test">-->
<!--			<p>当前进程: {{testText}}</p>-->
<!--			<p>userId: {{testArr}}</p>-->
<!--			<p>接口反馈: {{testRes}}</p>-->
<!--		</div>-->
		<p class="lf-all-tip">{{tip}}</p>
	</div>
</template>

<script>
	import { wxLogin, baseURL} from '../../api/vueAPI.js'
	export default {
		data() {
			return {
				testText: '初始',
				testArr: '',
				testRes:'暂无数据',
				tip: '',
				userId: '',
				storeId:'',
				price:'',
				totalPrice: '',
				wxAppId: '',
			};
		},
		created() {
			console.log("created")
      sessionStorage.clear();
			/* 判断过期 */
			let endTime = this.$route.query.endTime
			let nowTime = new Date().getTime()
			if(nowTime > endTime){
				this.tip = "二维码已过期"
				return
			}
			let that = this;
			// this.testText = ( ua.match(/MicroMessenger/i) == 'micromessenger' )? '微信':'非微信';
			// this.testArr = (ua.match(/AlipayClient/i) == 'alipayclient')? '支付宝':'非支付宝';
			/* 接收信息，空的则拒绝保存 */
			let userId = this.$route.query.userId;
			if(userId != null && userId != undefined && userId != 'undefined' && userId != '' && userId != 'null' && userId){
				sessionStorage.setItem('userId',userId)
				this.userId = userId
			}
			let totalPrice = this.$route.query.totalPrice;
			if(totalPrice != null && totalPrice != undefined && totalPrice != 'undefined' && totalPrice != '' && totalPrice != 'null' && totalPrice){
				sessionStorage.setItem('totalPrice',totalPrice)
				this.price = totalPrice
			}
			let storeId = this.$route.query.storeId;
			if(storeId != null && storeId != '' && storeId != undefined && storeId != 'undefined' && storeId != 'null' && storeId != 'undefined' && storeId){
				sessionStorage.setItem('storeId',storeId)
				this.storeId = storeId
			}
			let wxAppId = this.$route.query.wxAppId;
			if(wxAppId != null && wxAppId != '' && wxAppId != undefined && wxAppId != 'undefined' && wxAppId != 'null' && wxAppId != 'undefined' && wxAppId){
				console.log(wxAppId)
				localStorage.setItem('wxAppId',wxAppId)
				this.wxAppId = wxAppId
			}
			// this.testText = this.$route.query.totalPrice
			// this.testArr = JSON.stringify(this.$route.query)
			let ua = window.navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i) == 'micromessenger'){
				/* 检查是否登录过且有储存数据 */
				let faceDateCache = ''
				if(this.wxAppId != ''){
					faceDateCache = JSON.parse(localStorage.getItem(this.wxAppId))
				}else{
					/* 重定向接口 */
					window.location.href = baseURL + "/order/app/wx_login?userId="+ this.userId		//跳转外部链接
					return
				}
				console.log("faceDateCache", faceDateCache)
				if(faceDateCache != null && faceDateCache != undefined && faceDateCache != 'undefined' && faceDateCache != '' && faceDateCache != 'null' && faceDateCache){
					if(faceDateCache.openId != null && faceDateCache.openId != undefined && faceDateCache.openId != 'undefined' && faceDateCache.openId != '' && faceDateCache.openId != 'null' && faceDateCache.openId) {
						//存在则直接使用数据进行跳转
						this.$router.push({
							path:'/wx/paySelect',
							query:{
								openId: faceDateCache.openId,
								memberId: faceDateCache.memberId,
								merchantId: faceDateCache.merchantId,
								memberOpenId: faceDateCache.memberOpenId
							}	//传参
						})
						return
					}
				}
				/* 重定向接口 */
				window.location.href = baseURL + "/order/app/wx_login?userId="+ this.userId		//跳转外部链接
				return
			}
			if(ua.match(/AlipayClient/i) == 'alipayclient'){
				/* 重定向接口 */
				window.location.href = baseURL + "/order/app/ali_login?userId="+this.userId+"&storeId="+this.storeId+"&price="+this.price		//跳转外部链接
				// window.location.href = baseURL + "/order/app/ali_login?userId="+ this.$route.query.userId		//跳转外部链接
				return
			}
			// this.testText = '请用对应程序进行扫码';
			this.tip = '请用对应程序进行扫码';
		},
		methods:{
			/* 对应页面跳转 */
			jump(url) {
				this.$router.push({
					path:url,
					query:{}	//传参
				})
			}
		}
	}
</script>

<style>
	button{
		width: 100%;
		height: 3.125rem;
		margin: 2rem 0;
	}
	.test{
		position: fixed;
		bottom: 30%;
		left: 10%;
		height: 6.25rem;
		width: 70%;
		background-color: #FFF;
		border: 0.1875rem solid #000;
		z-index: 100;
		color: #000;
	}
	.lf-all-tip{
		height: 31.25rem;
		line-height: 31.25rem;
		text-align: center;
		font-size: 1.875rem;
	}
</style>
