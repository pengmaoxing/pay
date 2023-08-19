import fly from '../common/flyioRequest'
import qs from 'qs'
import URL from '../common/flyioRequest'

export const baseURL = URL.config.baseURL + process.env.HASHNAME;
// export const baseURL = "http://www.yunqufu.com"
// export const baseURL = "https://test.pay.lingyundata.com"
// export const baseURL = "http://192.168.1.150:80"
/* 
 * 查询使用get ， 修改使用post
 */

/* 网页支付 */
export function getWebPay (payWay, totalPrice, userId='', openId = '', storeId='', disCountPrice='', memberId='', code='', merchantId = '', remarks = '') {
	return fly.request( '/order/app/web_pay', qs.stringify({
		payWay,
		totalPrice,
		userId,
		openId,
		storeId,
    disCountPrice,
		memberId,
		code,
		merchantId,
		remarks
	}),{
		method: 'post',
	})
}

/* 获取订单列表 */
export function getOrderList ( pageNumber, pageSize, start_payTime, end_payTime, payWay, status) {
	return fly.request({
		url : '/order/app/query_order', 
		method: 'get',
		params: {
			pageNumber,
			pageSize,
			start_payTime,
			end_payTime,
			payWay,
			status
		}
	})
}
/* 获取订单详情 */
export function getOrderDetails ( orderNumber) {
	return fly.request({
		url : '/order/app/order_detail', 
		method: 'get',
		params: {
			orderNumber
		}
	})
}

/* 微信授权登录 */
export function wxLogin ( userId) {
	return fly.request({
		url : '/order/app/wx_login', 
		method: 'get',
		params: {
			userId
		}
	})
}

/* 扫描实体二维码支付-方法1 */
export function scanBlankQRcode ( blankQrCodeId) {
	return fly.request({
		url : '/merchant/qrcode/app/scan_blank_qrcode', 
		method: 'get',
		params: {
			blankQrCodeId
		}
	})
}


/* 获取商家名 */
//参数:操作人id(扫码进入获得):userId ;商户Id：merchantId（微信卡券跳转获得）
export function getMerchantName ( userId, merchantId='') {
	return fly.request({
		url : '/merchant/admin/find_merchant_name', 
		method: 'get',
		params: {
			userId,
			merchantId
		}
	})
}
/* 获取会员卡详情 */
//参数:商户id:userId
export function getMerchantMemberCard ( userId, merchantId) {
	return fly.request({
		url : '/merchant/admin/find_card_detail', 
		method: 'get',
		params: {
			userId,
			merchantId
		}
	})
}

/* 加入会员发送短信 */
export function webVerificationCode ( userId, phone, merchantId='') {
	return fly.request({
		url : '/member/admin/web_verification_code', 
		method: 'get',
		params: {
			userId,
			phone,
			merchantId
		}
	})
}
/* 添加会员 */
export function webRegister (userId, phone, code, openId, merchantId='') {
	return fly.request( '/member/admin/web_register', qs.stringify({
		userId,
		phone,
		code,
		openId,
		merchantId
	}),{
		method: 'post',
	})
}
/* 获取会员个人卡券 */
export function getMemberCouponList ( memberId, userId = '') {
	return fly.request({
		url : '/member/person_coupon/member_coupon_list', 
		method: 'get',
		params: {
			memberId,
			userId,
		}
	})
}
/* 获取支付后广告地址*/
export function getAdvertisement (platform,userId,storeId,merchantId) {
  return fly.request({
    url : '/advertise/on_management/select',
    method: 'get',
    params: {
      platform,
      userId,
      storeId,
      merchantId,
    }
  })
}
//传给后端广告的计费模式
export function getAdverCount (id,status) {
  return fly.request( '/advertise/on_management/cost', qs.stringify({
    id,
    status,
  }),{
    method: 'post',
  })
}
