<template>
	<div>
		<!-- <p>二维码</p> -->
		<p class="lf-tip">{{tip}}</p>
	</div>
</template>

<script>
	import { wxLogin, scanBlankQRcode, baseURL} from '../../api/vueAPI.js'
	export default {
		data() {
			return {
				testText: '初始',
				testArr: '',
				testRes:'暂无数据',
				tip: '',
				userId: '',
				totalPrice: '',
				blankQrCodeId: '',
				storeId: '',
				wxAppId: '',
			};
		},
		created() {
			console.log("created-qrcode")
			// this.testText = ( ua.match(/MicroMessenger/i) == 'micromessenger' )? '微信':'非微信';
			// this.testArr = (ua.match(/AlipayClient/i) == 'alipayclient')? '支付宝':'非支付宝';
			this.blankQrCodeId = this.$route.query.id
			// window.location.href = baseURL + "/merchant/qrcode/app/judge?id="+ this.blankQrCodeId		//跳转外部链接
			// return
			scanBlankQRcode(this.blankQrCodeId).then(res => {
				console.log(res)
				/* 链接信息保存 */
				this.userId = res.obj.userId;
				this.totalPrice = res.obj.totalPrice;
				this.storeId = res.obj.storeId;
				this.wxAppId = res.obj.wxAppId;
				sessionStorage.setItem('userId',this.userId)
				sessionStorage.setItem('totalPrice',this.totalPrice)
				sessionStorage.setItem('storeId',this.storeId)
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
					window.location.href = baseURL + "/order/app/ali_login?userId="+this.userId+"&storeId="+this.storeId+"&price="+this.totalPrice		//跳转外部链接
					// window.location.href = baseURL + "/order/app/ali_login?userId="+ this.$route.query.userId		//跳转外部链接
					return
				}
				this.tip = '请用对应程序进行扫码';
			}).catch(err => {
				console.log(err)
			})
		},
		methods:{
			
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
	.lf-tip{
		height: 31.25rem;
		line-height: 31.25rem;
		text-align: center;
		font-size: 1.875rem;
	}
</style>
