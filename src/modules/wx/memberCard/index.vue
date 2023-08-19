<template>
	<div>
		<!-- 导航栏 -->
		<!-- <div class="lf-nav" :style=" {height: htmlProportion * 120 + 'px'} ">
			<div class="lf-nav-mat" :style=" {height: htmlProportion * 40 + 'px'} "></div>
			<div class="lf-nav-text" :style=" {height: htmlProportion * 80 + 'px'} ">
				<div>
					<span class="lf-icon-close text-lg"></span>
					<span>用户名</span>
				</div>
				<span class="lf-icon-ellipsis text-lg"></span>
			</div>
		</div>
		<div class="lf-mat" :style="{height: htmlProportion * 120 + 'px'}"></div> -->,
		<div class="lf-mat" :style="{height: htmlProportion * 40 + 'px'}"></div>
		<!-- 内容 -->
		<div class="lf-content" :style="{height: htmlheight - (htmlProportion * 200) -1 + 'px'}">
			<div class="lf-content-card">
				<div class="lf-card-box" :style="{height: htmlProportion * 850 + 'px'}">
					<!-- 会员卡部分 -->
					<div class="lf-card" :style="[{height: htmlProportion * 350 + 'px'},cardSrcBox]"
               >
						<div>
							<div class="lf-card-head">
								<div class="lf-img-head">
                  <img v-if="merchantSrc" :src="merchantSrc">
                  <img v-else src="../../../assets/icon_member_default.png">
								</div>
								<div class="lf-head-text">
									<span class="text-sm text-white">{{memberDetail.merchantName}}</span>
									<span>
										<span class="text-yellow iconfont lf-icon-vip"></span>
										<span class="text-ssm text-white">{{memberDetail.name}}</span>
									</span>
								</div>
							</div>
							<div>
								<span class="text-sm lf-card-text">会员卡号</span>
								<div class="margin-top-10">
									<span class="text-white text-weight text-letter">{{memberDetail.id? memberDetail.id:'88** **** ****'}}</span>
								</div>
							</div>
						</div>
					</div>
					<!-- 会员卡详情跳转 -->
					<div class="lf-card-details text-sm" @click="jumpMemberDetails">
						<div>
							<span class="iconfont lf-icon-xingxing text-yellow margin-right-10"></span>
							<span>权益</span>
						</div>
						<div class="text-grey">
							<span>查看会员卡详情</span>
							<span class="iconfont lf-icon-right"></span>
						</div>
					</div>
					<!-- 会员手机验证 -->
					<div class="lf-iphone-checking" :style="{height: htmlProportion * 200 + 'px'}">
						<div>
							<span class="margin-right-10">手机号</span>
							<input type="number" v-model="phone" style="font-size: 0.875rem;padding: 0.3125rem 0.625rem;" placeholder="请输入您的手机号">
						</div>
						<div>
							<span class="margin-right-10">验证码</span>
							<input class="lf-code-width margin-right-10" v-model="code" style="font-size: 0.875rem;padding: 0.3125rem 0.625rem;" type="number" placeholder="输入验证码" maxlength="6">
							<div>
                <span v-if="isGetCode" class="lf-code-btn text-ssm" :class="{showHighCode:phone}" @click="getCode">获取验证码</span>
                <span v-else class="lf-code-btn text-sm" :class="{showHighCode:phone}">{{showTime}}s可获取</span>
							</div>
						</div>
					</div>
					<!-- 立即领取按钮 -->
					<div class="lf-card-btn" :class="{showHighCode:code}" :style="{height: htmlProportion * 100 + 'px'}" @click="getMemberCard">
						<span class="text-lg text-white">立即领取</span>
					</div>
				</div>
				<div>
					<span @click="jumpMemberServiceAgreement" class="text-ff4500 text-sm">登录即同意《会员服务协议》</span>
				</div>
			</div>
		</div>
		<div class="lf-mat" :style="{height: htmlProportion * 40 + 'px'}"></div>
		<!-- 错误提示 -->
		<transition name="tip">
			<div class="lf-err-tip" v-if="isErr">手机号输入有误</div>
		</transition>
	</div>
</template>

<script>
	import { webVerificationCode, webRegister, getMerchantMemberCard, baseURL} from '../../../api/vueAPI.js'
	export default{
		data() {
			return{
				htmlProportion: '',		//屏幕长宽比例
				htmlWidth: '',		//屏幕宽
				htmlheight: '',		//屏幕高
				isWxPay: true,	
				userId: '',
				openId: '',
				merchantId:'',
				phone: '',
				code: '',
				isErr: false,	//错误提示模态框
				showErr: '',
				memberDetail:'',
				merchantSrc:'',
        cardSrcBox:'',
				cardSrc: '',
        isGetCode:true,
        showTime:60,
			}
		},
		created() {
			this.htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
			this.htmlheight = document.documentElement.clientHeight || document.body.clientHeight;
			this.htmlProportion = this.htmlWidth / 750 ;
			// console.log(this.htmlWidth);
			// console.log(this.htmlheight);
			/* 获取openId */
			let openId = this.$route.query.openId;
			if(openId != null && openId != '' && openId != 'null' && openId){
				this.openId = openId
			}
			/* 获取userId或merchantId */
			let userId = sessionStorage.getItem('userId');
			if(userId != null && userId != '' && userId != 'null' && userId){
				this.userId = userId
			}
			let merchantId = this.$route.query.merchantId;
			if(merchantId != null && merchantId != '' && merchantId != 'null' && merchantId){
				this.merchantId = merchantId
			}
			console.log(this.merchantSrc)
			/* 获取会员卡信息 */
			this.getMerchantMemberCardDetail();
		},
		mounted() {
			
		},
		watch:{
			/* 错误提示1.5秒后消失 */
			isErr(val,oldVal){
				if(val === true){
					setTimeout(() => {
						this.isErr = false;
					},1500)
				}
			},
      cardSrc(val,oldVal){
			  if(this.cardSrc){
			    this.cardSrcBox = {'backgroundImage': 'url(' + this.cardSrc + ')'}
        }
      },
		},
		methods:{
			/* 获取会员卡信息 */
			getMerchantMemberCardDetail() {
				getMerchantMemberCard(this.userId, this.merchantId).then(res => {
					console.log(res)
					this.memberDetail = res.obj
					this.merchantSrc = this.getPic(this.memberDetail.merchantPhotoId)
					this.cardSrc = this.getPic(this.memberDetail.backgroundPictureId)
				}).catch(err => {
					console.log(err)
				})
			},
			/* 会员服务协议页面跳转 */
			jumpMemberServiceAgreement () {
				this.$router.push({
					path:'/wx/memberServiceAgreement',
					query:{}	//传参
				})
			},
			/* 跳转会员卡详情 */
			jumpMemberDetails() {
				this.$router.push({
					path:'/wx/memberDetails',
					query:{userId:this.userId, merchantId: this.merchantId}	//传参
				})
			},
			/* 获取验证码 */
			getCode() {
				if(!this.phone){
					return
				}
				if(this.phone.match(/^1[3456789]\d{9}$/)){
					/* 获取code */
					webVerificationCode(this.userId, this.phone, this.merchantId).then(res => {
					  this.isGetCode = false
            const timeTip = setInterval(() => {
              if(this.showTime <= 0){
                clearInterval(timeTip)
                this.isGetCode = true
                this.showTime = 60
              }
              this.showTime--
            },1000)
						console.log(res)
						alert(res.msg)
					}).catch(err => {
						console.log(err)
					})
				}else{
					// this.showErr = "手机号输入有误"
					this.isErr = true;
				}
			},
			/* 领取会员卡 */
			getMemberCard() {
				if(!this.phone){
					return
				}
				if(!this.code){
					return
				}
				/* 添加会员 */
				webRegister(this.userId, this.phone, this.code, this.openId, this.merchantId).then(res => {
					console.log(res)
					alert(res.msg)
					this.$router.push({
						path:'/wx/paySelect',
						query:{
							openId: this.openId, 
							memberId: res.obj,
						}	//传参
					})
				}).catch(err => {
					console.log(err)
				})
			},
			/* 图片回显 */
			getPic(val) {
				var url = baseURL + '/fms/upload/resource/' + val
				return url
			},
		}
	}
</script>

<style>
	body{
		background-color: #FFF;
		margin: 0;
		padding: 0;
		/* font-size: 1.125rem; */
	}
	.text-ssm{	/* 10 */
		font-size: 0.625rem;
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
	.text-c8c8c8{
		color: #c8c8c8;
	}
	.text-grey{		/* 草灰 */
		color: #a9a9a9;
	}
	.text-white{	/* 白色 */
		color: #FFF;
	}
	.text-yellow{	/* 黄色 */
		color: #ffe728;
	}
	.margin-right-10{
		margin-right: 0.625rem;
	}
	.lf-mat{
		/* background-color: #FFF; */
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
	.lf-content{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-content-card{
		width: 80%;
		height: 97%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	.lf-card-box{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}
	.lf-card{
		width: 100%;
    background-image: url('../../../assets/bg_card.png');
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 0.9375rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-card > div{
		width: 85%;
		height: 85%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
	}
	.lf-card-head{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.lf-img-head{
		width: 2.5rem;	/* 40 */
		height: 2.5rem;
		background-color: #FFF;
		border-radius: 50%;
		margin-right: 0.625rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-img-head > img{
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 50%;
	}
	.lf-head-text{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-content: center;
	}
	.lf-card-text{
		border: 0.0625rem solid #FFF;
		color: #FFF;
		padding: 0.125rem 0.25rem;
		margin-top: -0.625rem;
	}
	.margin-top-10{
		margin-top:0.625rem
	}
	.text-letter{
		letter-spacing: 0.1875rem;
	}
	.lf-card-details{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-content: center;
	}
	.lf-iphone-checking{
		width: 100%;
	}
	.lf-iphone-checking > div{
		width: 100%;
		height: 50%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 0.0625rem solid #F1F1F3;
	}
	.lf-iphone-checking input{
		border:0;
		font-size: 1rem;
	}
	.lf-code-width{
		width: 30%;
	}
	.lf-code-btn{
		background-color: #ffcc8f;
		border-radius: 0.1875rem;
		color: #FFF;
		padding: 0.3125rem;
	}
	.lf-card-btn{
		width: 100%;
		background-color: #ffcc8f;
		border-radius: 3.125rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.showHighCode{
		background-color: #ff4500;
	}
	.lf-err-tip{
		padding: 0 0.625rem;
		height: 2.1875rem;
		position: fixed;
		top: 6.25rem;
		left: calc(50% - 4.6875rem);
		text-align: center;
		line-height: 2.1875rem;
		font-weight: 800;
		color: #FFF;
		background-color: rgba(0,0,0,0.8);
		border-radius: 0.3125rem;
	}
	.tip-leave-active {
		transition: opacity .5s;
	}
	.tip-enter, .tip-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}
</style>
