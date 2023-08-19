<template>
	<div>
		<!-- 导航栏 -->
		<!-- <div class="lf-nav" :style=" {height: htmlProportion * 120 + 'px'} ">
			<div class="lf-nav-mat" :style=" {height: htmlProportion * 40 + 'px'} "></div>
			<div class="lf-nav-text" :style=" {height: htmlProportion * 80 + 'px'} ">
				<div>
					<span class="lf-icon-close text-lg"></span>
					<span>会员卡详情</span>
				</div>
				<span class="lf-icon-ellipsis text-lg"></span>
			</div>
		</div>
		<div class="lf-mat" :style="{height: htmlProportion * 120 + 'px'}"></div> -->
		<div class="lf-mat" :style="{height: htmlProportion * 40 + 'px'}"></div>
		<!-- 内容 -->
		<div class="lf-content">
			<div class="lf-bottom-line" :style="{height: htmlProportion * 70 + 'px'}">
				<span class="text-md">会员卡详情</span>
			</div>
			<div class="lf-mat" :style="{height: htmlProportion * 40 + 'px'}"></div>
			<div>
				<span class="text-grey margin-right-10">特权说明</span>
				<span class="text-sm">{{memberDetail.privilegeExplain}}</span>
			</div>
			<div class="lf-mat" :style="{height: htmlProportion * 50 + 'px'}"></div>
			<div>
				<span class="text-grey margin-right-10">有效日期</span>
				<span class="text-sm">永久有效</span>
			</div>
			<div class="lf-mat" :style="{height: htmlProportion * 50 + 'px'}"></div>
			<div>
				<span class="text-grey margin-right-10">商家电话</span>
				<span class="text-sm">{{memberDetail.phone}}</span>
			</div>
			<div class="lf-mat" :style="{height: htmlProportion * 50 + 'px'}"></div>
			<div>
				<span class="text-grey margin-right-10">使用须知</span>
				<span class="text-sm">{{memberDetail.tip ? memberDetail.tip:'无'}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { getMerchantMemberCard} from '../../../api/vueAPI.js'
	export default{
		data() {
			return{
				htmlProportion: '',		//屏幕长宽比例
				htmlWidth: '',		//屏幕宽
				htmlheight: '',		//屏幕高
				isWxPay: true,	
				memberDetail: '',
				userId: '',
				merchantId: '',
			}
		},
		created() {
			this.htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
			this.htmlheight = document.documentElement.clientHeight || document.body.clientHeight;
			this.htmlProportion = this.htmlWidth / 750 ;
			// console.log(this.htmlWidth);
			// console.log(this.htmlheight);
			// this.userId = sessionStorage.getItem('userId');
			/* 获取userId或merchantId */
			let userId = sessionStorage.getItem('userId');
			if(userId != null && userId != '' && userId != 'null' && userId){
				this.userId = userId
			}
			let merchantId = this.$route.query.merchantId;
			if(merchantId != null && merchantId != '' && merchantId != 'null' && merchantId){
				this.merchantId = merchantId
			}
			/* 获取会员卡信息 */
			getMerchantMemberCard(this.userId, this.merchantId).then(res => {
				console.log(res)
				this.memberDetail = res.obj
			}).catch(err => {
				console.log(err)
			})
		},
		methods:{
			
		}
	}
</script>

<style>
	body{
		background-color: #FFF;
		/* font-size: 1.125rem; */
	}
	.text-sm{	/* 14 */
		font-size: 0.875rem;
	}
	.text-md{	/* 18 */
		font-size: 1.125rem;
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
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}
	.lf-content > div{
		width: 95%;
	}
	.lf-bottom-line{
		border-bottom: 0.0625rem solid #e6e6ea;
	}
</style>
