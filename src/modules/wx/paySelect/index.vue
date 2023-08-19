<template>
	<div class="lf-box">
		<!-- 导航栏 -->
		<!-- <div class="lf-nav" :style=" {height: htmlProportion * 120 + 'px'} ">
			<div class="lf-nav-mat" :style=" {height: htmlProportion * 40 + 'px'} "></div>
			<div class="lf-nav-text" :style=" {height: htmlProportion * 80 + 'px'} ">
				<div>
					<span class="lf-icon-close text-lg"></span>
					<span>向商户付款</span>
				</div>
				<span class="lf-icon-ellipsis text-lg"></span>
			</div>
		</div>
		<div class="lf-mat" :style="{height: htmlProportion * 120 + 'px'}"></div> -->
		<!-- 内容 -->
		<!--  :style="{height: htmlheight  + 'px'}" -->
		<!-- <div class="lf-content"> -->
			<div class="lf-content-payPanel margin-0-auto" 
				:style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 472 + 'px','margin-bottom':htmlProportion * 110 + 'px'}"
				>
				<div class="lf-new-demand" :style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 152 + 'px'}">
					<span>{{merchantName}}</span>
				</div>
				<div>
					<div class="one">
						<span class="text-grey text-sm" style="margin-bottom: 1.25rem">付款金额</span>
					</div>
					<div class="four">
						<span class="text-llg" style="margin-bottom: 0.3125rem;">{{yenSymbol}}</span>
						<input :class="[{'text-lllg':!moneyInputSwitch},{'text-llg':moneyInputSwitch && !moneyInputSwitchSM},{'text-lg':moneyInputSwitchSM}]" type="number" v-model="paymentMoney" @change="judgeCoupon" @focus="inputEmpty">
					</div>
					<div class="two" @click="showCoupon">
						<span class="text-ff4500 iconfont  lf-icon-youhuiquan" style="margin-bottom: -1.25rem;"></span>
						<div class="text-grey text-sm" style="margin-bottom: -1.25rem;">
							<span v-if="isSelectCoupon">{{isSelectCoupon.remark}}</span>
							<span v-else>{{ canUseCouponList.length ? canUseCouponList.length+'张可用优惠券': couponList.length ? '有'+couponList.length+'张优惠券':'暂无可用优惠'}}</span>
							<span class="iconfont lf-icon-right"></span>
						</div>
					</div>
					<!-- <div class="three">
						<span class="text-grey text-sm" style="margin-bottom: 0.3125rem;">还需支付</span>
						<span :class="[{'text-llg':!moneyInputSwitchAP},{'text-lg':moneyInputSwitchAP}]" style="color: #8a8a8a;">{{yenSymbol}} {{actualPayment}}</span>
					</div> -->
				</div>
				<!-- zht 于2019.11.26 添加 -备注栏 -->
				<div class="remark" :style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 80 + 'px', bottom: '-'+ htmlProportion * 80 + 'px'}">
					<input class="text-grey" type="text" maxlength="20" placeholder="添加备注(20个字以内)" v-model="remarks">
				</div>
			</div>
			<!-- 是会员 -->
			<div class="lf-content-payWay margin-0-auto" v-if="isMember"
				:style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 270 + 'px'}">
				<div>
					<span class="text-grey">选择付款方式</span>
					<span class="text-ff4500 iconfont lf-icon-liwu"></span>
				</div>
				<div>
					<div>
						<span class="text-2dc26f iconfont lf-icon-weixinzhifu margin-right-10"></span>
						<span class="text-sm">微信支付</span>
					</div>
					<span v-if="isWxPay" class="text-ff4500 iconfont lf-icon-icon-radio" :class="{'lf-icon-icon-radio1':isMemberRadio}" @click="changeMemberPayWay(true)"></span>
					<span v-else class="iconfont lf-icon-icon-radio1"></span>
				</div>
				<div>
					<div>
						<span class="text-ff4500 iconfont lf-icon-huiyuanqia-copy margin-right-10"></span>
						<span class="text-sm">会员储值卡({{yenSymbol}}{{memberMoney}})</span>
					</div>
					<span v-if="isWxPay" class="text-ff4500 iconfont lf-icon-icon-radio" :class="{'lf-icon-icon-radio1':!isMemberRadio}" @click="changeMemberPayWay(false)"></span>
					<span v-else class="iconfont lf-icon-icon-radio1"></span>
				</div>
			</div>
			<!-- 不是会员 -->
			<div class="lf-content-payWay margin-0-auto" v-else
				:style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 180 + 'px'}">
				<div>
					<span class="text-grey">选择付款方式</span>
					<span class="text-ff4500 iconfont lf-icon-liwu"></span>
				</div>
				<div>
					<div>
						<span class="text-2dc26f iconfont lf-icon-weixinzhifu margin-right-10"></span>
						<span>微信支付</span>
					</div>
					<span v-if="isWxPay" class="text-ff4500 iconfont lf-icon-icon-radio"></span>
					<span v-else class="iconfont lf-icon-icon-radio1"></span>
				</div>
			</div>
			<div class="lf-content-btn lf-content-btn-one margin-0-auto" 
				:style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 100 + 'px'}"
				@click="payConfirmModal" :class="[{'bg-ff4500': !payLoading},{'bg-ad2f00': payLoading}]">
				<div class="icon-loading" v-if="payLoading"></div>
				<span class="text-weight">付款</span>
			</div>
			<div class="lf-content-btn lf-content-btn-two margin-0-auto" v-if="!isMember"
				:style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 100 + 'px'}"
				@click="jumpAddMember">
				<span class="text-weight">加入会员</span>
			</div>
			<!-- <div></div> -->
			<!-- <div></div> -->
			<!-- <div></div> -->
			<!-- <div></div> -->
		<!-- </div> -->
		<!-- 优惠券选取 -->
		<transition name="couponSelect">
			<div v-if="isShowCoupon">
				<div class="lf-cover"></div>
				<div class="lf-coupon-modal padding" :style="{width:htmlWidth - 20 + 'px'}">
					<p class="confirm"><span class="text-sm">选择优惠券</span><span class="text-ssm btn" @click="closeCoupon">确定</span></p>
					<div class="lf-no-coupon" @click="changeSelection(-1)">
						<span class="text-ssm text-weight">不使用优惠券</span>
						<img src="../../../assets/selection_orange.png" v-if="isShowSelection">
						<img src="../../../assets/selection_grey.png" v-else>
					</div>
					<div class="lf-coupon-box">
						<!-- 可用优惠券 -->
						<div class="lf-count-canCoupon" v-if="canUseCouponList.length">
							<img class="img" src="../../../assets/line_452.png">
							<span class="text-sm">可用优惠券({{canUseCouponList.length}}张)</span>
							<img class="img" src="../../../assets/line_452.png">
						</div>
						<div class="lf-coupon-card coupon-bg-01 relative" v-for="(card,key) in canUseCouponList">
							<!-- <div class="lf-coupon-cover"></div> -->
							<div class="one">
								<div class="up">
                  <img src="../../../assets/icon_member_default.png">
<!--                  <img :src="card.photoSrc? card.photoSrc:'../../../assets/icon_member_default.png'">-->
									<div>
										<span class="text-weight">{{card.name}}</span>
										<span class=" text-orange">
											<span class="text-weight">{{yenSymbol}}{{card.money}}</span>
											<span class="text-ssm lf-coupon">{{card.miniExpendLimit == 0 ? '满任意金额可用':'满'+card.miniExpendLimit+'金额可用'}}</span>
										</span>
									</div>
								</div>
								<div class="down">
									<span class="text-grey text-ssm">有效期：{{card.validTimeStart.split(' ')[0]}}—{{card.validTimeEnd.split(' ')[0]}}</span>
								</div>
							</div>
							<div class="two" @click="changeSelection(key)">
								<img src="../../../assets/selection_orange.png" v-if="card.selectStatus">
								<img src="../../../assets/circular_orange.png" v-else>
							</div>
						</div>
						<!-- 不可用优惠券 -->
						<div class="lf-count-canCoupon" v-if="canNotUseCouponList.length">
							<img class="img" src="../../../assets/line_452.png">
							<span class="text-sm">不可用优惠券({{canNotUseCouponList.length}}张)</span>
							<img class="img" src="../../../assets/line_452.png">
						</div>
						<div class="lf-coupon-card coupon-bg-02 relative" v-for="(card,key) in canNotUseCouponList">
							<!-- <div class="lf-coupon-cover"></div> -->
							<div class="one">
								<div class="up">
                  <img src="../../../assets/icon_member_default.png">
<!--                  <img :src="card.photoSrc? card.photoSrc:'../../../assets/icon_member_default.png'">-->
									<div>
										<span class="text-weight">{{card.name}}</span>
										<span class=" text-grey">
											<span class="text-weight">{{yenSymbol}}{{card.money}}</span>
											<span class="text-ssm lf-coupon-no">{{card.miniExpendLimit == 0 ? '满任意金额可用':'满'+card.miniExpendLimit+'金额可用'}}</span>
										</span>
									</div>
								</div>
								<div class="down">
									<span class="text-grey text-ssm">有效期：{{card.validTimeStart.split(' ')[0]}}—{{card.validTimeEnd.split(' ')[0]}}</span>
								</div>
							</div>
							<div class="two">
								<img src="../../../assets/circular_grey.png">
							</div>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<!-- 错误提示 -->
		<transition name="tip">
			<div class="lf-err-tip" v-if="isPayErr">付款金额有误</div>
			<div class="lf-err-tip" v-if="isBalanceErr">会员余额不足</div>
		</transition>
	</div>
</template>

<script>
	import { getMemberCouponList, getWebPay, getMerchantName, baseURL} from '../../../api/vueAPI.js'
	import {Message} from 'element-ui';
	export default{
		data() {
			return{
				htmlProportion: '',		//屏幕长宽比例
				htmlWidth: '',		//屏幕宽
				htmlheight: '',		//屏幕高
				isWxPay: true,
				yenSymbol: '\u00A5',	//金钱符号
				paymentMoney: 0,
				actualPayment: 0,
				isMember: false,		//会员判断
				isMemberRadio: true,	//是否会员支付
				isPayErr: false,		//付款金额有误错误提示框显示
				isBalanceErr: false,		//会员余额不足错误提示框显示
				isShowCoupon: false,	//优惠券列表模态框显示
				isShowSelection: true,	//是否不使用优惠券
				couponList: [],				//所有优惠券
				canUseCouponList:[],		//可使用优惠券列表
				canNotUseCouponList:[],		//不可使用优惠券列表
				isSelectCoupon:'',		//选中的优惠券
				memberMoney:'',
				memberId:'',
        memberOpenId:'',
				openId:'',
				userId:'',
				storeId:'',
				discountPrice: 0,
				code:'',
				merchantId: '',
        timeStamp:'',
        orderNumber: '',
				merchantName: '',
				moneyInputSwitch: false, //付款金额输入超过6位时，变更为小一号字体
				moneyInputSwitchSM: false, //付款金额输入超过12位时，变更为更小一号字体
				moneyInputSwitchAP: false, //还需金额输入超过12位时，变更为更小一号字体
				payLoading: false,
				remarks: '', //备注
				wxAppId: ''
			}
		},
		created() {
			this.htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
			this.htmlheight = document.documentElement.clientHeight || document.body.clientHeight;
			this.htmlProportion = this.htmlWidth / 750 ;
			// console.log(this.htmlWidth);
			// console.log(this.htmlheight);
			/* 获取openId和memberId信息 */
			let openId = this.$route.query.openId;
			if(openId != null && openId != undefined && openId != 'undefined' && openId != '' && openId){
				this.openId = openId
			}
			let memberId = this.$route.query.memberId;
			if(memberId != null && memberId != undefined && memberId != 'undefined' && memberId != '' && memberId != 'null' && memberId){
				this.memberId = memberId
			}
			/* 获取merchantId信息 */
			let merchantId = this.$route.query.merchantId;
      if(merchantId != null && merchantId != undefined && merchantId != 'undefined' && merchantId != '' && merchantId != 'null' && merchantId){
        this.merchantId = merchantId
        sessionStorage.setItem("merchantId",this.merchantId)
      }
      let memberOpenId = this.$route.query.memberOpenId;
      if(memberOpenId != null && memberOpenId != undefined && memberOpenId != 'undefined' && memberOpenId != '' && memberOpenId != 'null' && memberOpenId){
        this.memberOpenId = memberOpenId
      }	
			/* 将微信重定向信息缓存起来，在手机浏览器没有时 */
			/* 且为网站扫码时 */
			let wxAppIdCache = localStorage.getItem('wxAppId')
			if(wxAppIdCache != null && wxAppIdCache != undefined && wxAppIdCache != 'undefined' && wxAppIdCache != '' && wxAppIdCache != 'null' && wxAppIdCache){
				this.wxAppId = wxAppIdCache
				localStorage.removeItem('wxAppId')
			}
			if(this.wxAppId != ''){
				let faceDate = {
					openId: this.openId,
					memberId: this.memberId,
					merchantId: this.merchantId,
					memberOpenId: this.memberOpenId
				}
				localStorage.setItem(this.wxAppId, JSON.stringify(faceDate))
			}
			/* 判断是否为会员 */
			if(this.memberId){
				this.isMember = true
			}else{
				this.isMember = false
			}
			/* 获取storeId信息（有的话） */
			let storeId = sessionStorage.getItem("storeId");
			if(storeId != null && storeId != '' && storeId != 'null'  && storeId != 'undefined' && storeId){
				this.storeId = storeId
			}
			/* 获取userId（有的话） */
			let userId = sessionStorage.getItem('userId');
			if(this.userId != null && userId != '' && userId){
				this.userId = userId
			}
			/* 金额获取 */
			let totalPrice = sessionStorage.getItem('totalPrice')
			if(totalPrice != null && totalPrice != '' && totalPrice){
				this.paymentMoney = totalPrice
				//计算还需支付金额
				this.actualPayMoney()
			}else{
				this.paymentMoney = 0;
			}
			// window.location.href = ''
			this.getMemberCouponList();
			/* 获取商户信息-用于商户名显示 */
			getMerchantName(this.userId, this.merchantId).then(res => {
				console.log(res)
			  this.merchantName = res.obj
			}).catch(err => {
				console.log(err)
			})
		},
		watch:{
			isPayErr(val,oldVal){
				if(val === true){
					setTimeout(() => {
						this.isPayErr = false;
					},1500)
				}
			},
			isBalanceErr(val,oldVal){
				if(val === true){
					setTimeout(() => {
						this.isBalanceErr = false;
					},1500)
				}
			},
			paymentMoney(val,oldVal){
				// if(parseInt(this.paymentMoney) > 10000){
				// 	this.paymentMoney = '10000';
				// 	return
				// }
				if(this.paymentMoney.trim().match(/^[0-9]+([.]{1}[0-9]{1,2})?$/)){
					if(this.paymentMoney.length === 2 && this.paymentMoney.indexOf('.') === -1 && this.paymentMoney[0] == 0){
						this.paymentMoney = this.paymentMoney.replace(0,'')
					}
				}
				if(this.paymentMoney.length > 6){
					this.moneyInputSwitch = true
					if(this.paymentMoney.length > 12){
						this.moneyInputSwitchSM = true
					}else{
						this.moneyInputSwitchSM = false
					}
				}else{
					this.moneyInputSwitch = false
				}
			},
			actualPayment(val,oldVal){
				if(parseFloat(this.actualPayment) < 0){
					this.actualPayment = '0'
				}
				if(this.paymentMoney.length > 12){
					this.moneyInputSwitchAP = true
				}else{
					this.moneyInputSwitchAP = false
				}
			},
			payLoading(val,oldVal){
				if(this.payLoading == true){
					setTimeout(() => {
						this.payLoading = false
					},2000)
				}
			}
		},
		methods:{
			//清空输入框
			inputEmpty() {
				this.paymentMoney = ''
			},
			/* 页面跳转-加入会员 */
			jumpAddMember () {
				/* 加入会员 */
				this.$router.push({
          //加入会员用memberOpenId，付款还是用原来的openid
					path:'/wx/memberCard',
					query:{openId: this.memberOpenId, merchantId: this.merchantId}	//传参
				})
			},
			/* 付款确认框 */
			payConfirmModal() {
				if(this.payLoading == true){
					return
				}
				this.payLoading = true;
				// alert("判断优惠券")
				//付款确认提示
				// if(confirm('确认要进行付款吗?') === true){
					this.paymentJump()
				// }else{
					//false时
				// }
			},
			/* 付款判断-微信/会员储值卡 */
			paymentJump() {
				/* 付款 */
				//确认付款
				try{
					if(this.paymentMoney.trim().match(/^[0-9]+([.]{1}[0-9]{1,2})?$/)){
						console.log("付款判断")
						//会员储值卡支付
						if(this.isMemberRadio && this.isMember){
							console.log("会员储值卡付款判断")
							// this.payLoading = false;
							if(this.memberMoney >= this.actualPayment){
								this.memberPayment()
							}else{
								this.isBalanceErr = true;
							}
							return
						}
						console.log("进入微信支付-即将付款")
						console.log(this.paymentMoney, this.discountPrice, this.openId, this.userId, this.storeId, this.memberId, this.code, this.merchantId)
						//跳转微信支付页
						// this.payLoading = false;
						if(this.paymentMoney-this.discountPrice<=0)
						{
					    this.$message({
					      message:'最少需要付0.01元',
					      type:'error'
					    })
					  }else
					    {
								/* 将微信支付移植于此页，直接调用支付，停止跳转 zht修改于2019.08.30 */
								this.wxpayment() //进行微信支付
								return
					      this.$router.push({
					        path:'/wx/pay',
					        query:{
					          paymentMoney: this.paymentMoney,
					          openId: this.openId,
					          userId: this.userId,
					          storeId: this.storeId,
					          discountPrice: this.discountPrice,
					          memberId: this.memberId,
					          code: this.code,
					          merchantId: this.merchantId
					        }	//传参
					      })
					    }
					}else{
						// this.payLoading = false;
						this.isPayErr = true;
					}
				}catch(e){
					// this.payLoading = false;
					this.isPayErr = true;
				}
			},
			/* 支付 */
			/* 会员储值支付 */
			memberPayment() {
			  let that = this
				console.log("进行会员储值卡付款")
        if(that.paymentMoney-that.discountPrice<=0)
        {//付款金额要大于支付金额
          this.$message({
            message:'最少需要付0.01元',
            type:'error'
          })
        }
        else
          {
            getWebPay(4, that.paymentMoney, that.userId, that.openId, that.storeId, that.discountPrice, that.memberId, that.code, that.merchantId, that.remarks).then(res => {
              //that.price = res.obj.jsPayResponse.price
              that.price = that.paymentMoney - that.discountPrice
              that.timeStamp = res.obj.timeStamp
              that.orderNumber = res.obj.orderNumber
              console.log('price'+that.price)
              console.log('timeStamp'+that.timeStamp)
              console.log('orderNumber'+that.orderNumber)
              // alert("支付成功")
              //跳转广告
              this.$router.push({
                path:'/advertisement',
                query:{
                  userId:that.userId,
                  storeId:that.storeId,
                  merchantId:that.merchantId,
                  price: that.price,
                  timeStamp: that.timeStamp,
                  orderNumber: that.orderNumber
                }	//传参
              })
            }).catch(err => {
              console.log(err)
            })
          }

			},
			/* 打开优惠券模态框 */
			showCoupon() {
			  console.log("所有券",this.couponList)
				if(!this.isMember){
					return
				}
				/* 正则判断付款金额 */
				if(!(this.paymentMoney+'').trim().match(/^[0-9]+([.]{1}[0-9]{1,2})?$/)){
					this.isPayErr = true;
					return
				}
				/* 处理优惠券 */
				this.canUseCouponList = [];
				this.canNotUseCouponList = [];
				for (let coupon of this.couponList) {
					if(coupon.miniExpendLimit <= parseInt(this.paymentMoney)){
						this.canUseCouponList.push(coupon);
					}else{
						this.canNotUseCouponList.push(coupon);
					}
				}
        console.log("可用券",this.canUseCouponList)
        console.log("不可用券",this.canNotUseCouponList)
				/* 查看是否有选中优惠券 */
				if(!this.isSelectCoupon){
					this.isShowCoupon = true;
					return
				}
				for (let key in this.canUseCouponList) {
					if(this.canUseCouponList[key].id === this.isSelectCoupon.id){
						this.canUseCouponList[key].selectStatus = true
					}else{
						this.canUseCouponList[key].selectStatus = false
					}
				}
				this.isShowCoupon = true;
				// this.getMemberCouponList();
			},
			/* 关闭优惠券模态框 */
			closeCoupon() {
				//计算还需支付金额
				this.actualPayMoney()
				this.isShowCoupon = false;
			},
			/* 改变优惠券选择 */
			changeSelection(key){
				console.log("选择优惠券",key)
				switch(parseInt(key)){
					case -1:	//选择不使用优惠券
						console.log("不用")
						this.isShowSelection = true
						for (let i in this.canUseCouponList) {
							this.canUseCouponList[i].selectStatus = false
						}
						this.isSelectCoupon = ''
						this.code = ''
						this.discountPrice = 0
						break;
					default:
						console.log("用券")
						this.isShowSelection = false
						for (let i in this.canUseCouponList) {
							this.canUseCouponList[i].selectStatus = false
						}
						this.canUseCouponList[key].selectStatus = true
						this.isSelectCoupon = this.canUseCouponList[key]
						this.code = this.canUseCouponList[key].code
						this.discountPrice = this.canUseCouponList[key].money
						break;
				}
			},
			/* 改变会员支付方式 */
			changeMemberPayWay(boolean){
				if(boolean){
					this.isMemberRadio = false;
				}else{
					this.isMemberRadio = true;
				}
			},
			/* 获取个人会员优惠券列表 */
			getMemberCouponList() {
				console.log("会员判断",this.isMember,this.memberId)
				if(this.isMember === false){
					return
				}
				getMemberCouponList( this.memberId, this.userId).then(res => {
					console.log(res)
					this.memberMoney = res.obj.balance;
					if(this.memberMoney == '0'){
						this.isMemberRadio = false
					}
					for (let s of res.obj.personCoupons) {
						s['selectStatus'] = false
						// s['photoSrc'] = this.getPic(s.photoId)
					}
					this.couponList = res.obj.personCoupons;
					console.log(this.couponList)
				}).catch(err => {
					console.log(err)
				})
			},
			/* 判断当前优惠券可用与不可用-change事件 */
			judgeCoupon() {
				console.log("判断优惠券是否可用")
				this.actualPayMoney()
				/* 判断当前选中优惠券是否还可以使用 */
				if(this.isSelectCoupon){
					if(this.isSelectCoupon.miniExpendLimit >= parseInt(this.paymentMoney)){
						this.isSelectCoupon = '';
					}
				}
				/* 处理优惠券列表 */
				this.canUseCouponList = [];
				this.canNotUseCouponList = [];
				for (let coupon of this.couponList) {
					if(coupon.miniExpendLimit <= parseInt(this.paymentMoney)){
						this.canUseCouponList.push(coupon);
					}else{
						this.canNotUseCouponList.push(coupon);
					}
				}
				// console.log("选中优惠券",this.isSelectCoupon)
				// console.log("优惠券列表",this.couponList)
				// console.log("可用优惠券",this.canUseCouponList)
				// console.log("不可用优惠券",this.canNotUseCouponList)
			},
			/* 计算还需支付金额 */
			actualPayMoney() {
				this.actualPayment = this.paymentMoney
				if(this.isSelectCoupon){
					this.actualPayment = (this.actualPayment - this.isSelectCoupon.money).toFixed(2)
				}
			},
			/* 图片回显 */
			getPic(val) {
				var url = baseURL + '/fms/upload/resource/' + val
				return url
			},
			/* 将微信支付移植于此页， zht于2019.08.30修改~ */
			/* 付款-微信官方 */
			wxpayment() {
				// this.testProcess = '进行付款'
				getWebPay(1, this.paymentMoney, this.userId, this.openId, this.storeId, this.discountPrice, this.memberId, this.code, this.merchantId, this.remarks).then(res => {
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
						document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(payObj), false);
					}else if (document.attachEvent){
						document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(payObj)); 
						document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(payObj));
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
							// alert("支付取消");
							// alert(JSON.stringify(res))
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
							// alert('支付失败')
							// alert(JSON.stringify(res))
						}
						if(res.err_msg == "total_fee"){
							Message({
							  showClose: true,
							  message: '支付失败，原因：缺少参数',
							  type: ''
							});
							// alert('缺少参数')
						}
					}
				);
			},
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
	.text-llmg{
		font-size: 2.625rem;
	}
	.text-lllg{	/* 48 */
		font-size: 3rem;
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
	.text-orange{	/* 橙色 */
		color: #ff4500;
	}
	.text-grey{		/* 草灰 */
		color: #a9a9a9;
	}
	.relative{
		position: relative;
	}
	.margin-right-10{
		margin-right: 0.625rem;
	}
	.padding{
		padding: 0.625rem;
	}
	.lf-box{
		background-color: #F5F2F0;
		width: 100%;
		height: 100vh;
	}
	.lf-box > div{
		margin-top: 20px;
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
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.margin-0-auto{
		margin: 0 auto;
	}
	.lf-content-payPanel{
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.lf-content-payPanel > div{
		width: 90%;
		height: 80%;
	}
	.lf-content-payPanel .one {
		width: 100%;
		height: 6%;
		display: flex;
		align-items: center;
	}
	.lf-content-payPanel .four{
		width: 100%;
		height: 5rem;
		display: flex;
		/* justify-content: space-between; */
		align-items: center;
		border-bottom: 0.0625rem solid #bdbdc6;
	}
	.lf-content-payPanel .four input{
		width: 90%;
		height: 3rem;
		border: 0;
		/* padding: 0.1875rem 0.3125rem; */
		margin: 0 0 0.3125rem 0.625rem;
	}
	.lf-content-payPanel .two {
		width: 100%;
		height: 43%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 0.0625rem solid #bdbdc6;
	}
	.lf-content-payPanel .two input{
		width: 90%;
		height: 1.5rem;
		border: 0;
	}
	.lf-content-payPanel .three {
		width: 100%;
		height: 60%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: -0.625rem;
	}
	.lf-content-payPanel .remark{
		background-color: #FFF;
		position: absolute;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lf-content-payPanel .remark input{
		border: 0;
		width: calc(90% - 6px);
		padding: 5px 3px;
		border-bottom: 1px solid #C8C8C8;
	}
	.lf-content-payWay{
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
	}
	.lf-content-payWay > div {
		width: 90%;
		height: 45%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-content-payWay > div > div {
		display: flex;
		align-items: center;
	}
	.lf-content-btn{
		background-color: #DDD;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 0.0625rem solid #ff4500;
		border-radius: 0.1875rem;
	}
	.lf-content-btn-one {
		/* background-color: #ff4500; */
		transition: all 0.3s;
		color: #FFF;
	}
	.lf-content-btn-two {
		background-color: #F5F2F0;
		color: #ff4500;
	}
	.lf-err-tip{
		width: 9.375rem;
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
	.lf-cover{
		width: 100vh;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		background-color: rgba(0,0,0,0.5);
	}
	.lf-coupon-modal{
		/* width: 100vh; */
		height: 50vh;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 101;
		background-color: #FFF;
	}
	.lf-coupon-modal .confirm{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.625rem;
	}
	.lf-coupon-modal .confirm .btn{
		padding: 0.125rem 0.625rem;
		color: #FFF;
		background-color: #FF4500;
		border-radius: 0.1875rem;
	}
	.lf-no-coupon{
		width: 94%;
		border: 0.0625rem solid #F1F1F3;
		padding: 1% 3%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.625rem;
	}
	.lf-no-coupon img{
		width: 0.9375rem;
		height: 0.9375rem;
	}
	/* .couponSelect-leave-active {
		transition: opacity .3s;
	}
	.couponSelect-enter, .couponSelect-leave-to {
		opacity: 0;
	} */
	.lf-coupon-box{
		width: 100%;
		height: 80%;
		overflow-x: hidden;
		overflow-y: auto;
	}
	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
	.lf-coupon-card{
		width: 94%;
		height: 29%;
		padding: 3% 3%;
		margin-bottom: 0.625rem;
		display: flex;
		justify-content: flex-start;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	.coupon-bg-01{
		background-image: url(../../../assets/coupon_card_01.png);
	}
	.coupon-bg-02{
		background-image: url(../../../assets/coupon_card_02.png);
	}
	.lf-coupon-card .one{
		height: 100%;
		width: 74%;
	}
	.lf-coupon-card .two{
		height: 100%;
		width: 26%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lf-coupon-card .two img{
		height: 1.875rem;
		width: 1.875rem;
		margin-left: 0.625rem;
	}
	.lf-coupon-card .one .up{
		width: 100%;
		height: 75%;
		/* background-color: #0077AA; */
		display: flex;
		justify-content: flex-start;
	}
	.lf-coupon-card .one .up div{
		width: 100%;
		height: 75%;
		/* background-color: #0077AA; */
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.lf-coupon-card .one .up img{
		width: 3.125rem;
		height: 3.125rem;
		margin-right: 0.625rem;
	}
	.lf-coupon-card .one .up .lf-coupon{
		padding: 0.125rem 0.3125rem;
		margin-left: 0.3125rem;
		border: 0.0625rem solid #ff4500;
		border-radius: 0.125rem;
	}
	.lf-coupon-card .one .up .lf-coupon-no{
		padding: 0.125rem 0.3125rem;
		margin-left: 0.3125rem;
		border: 0.0625rem solid #e0e0e0;
		border-radius: 0.125rem;
	}
	.lf-coupon-card .one .down{
		width: 100%;
		height: 25%;
	}
	.lf-count-canCoupon{
		width: 100%;
		height: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin: 0.3125rem 0;
		/* background-color: #F1F1F3; */
	}
	.lf-count-canCoupon .img{
		width: 30%;
		height: 0.125rem;
	}
	.lf-coupon-cover{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.3);
	}
	.lf-new-demand{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lf-new-demand span{
		font-size: 1.5rem;
		color: #3198FF;
		font-weight: 600;
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
