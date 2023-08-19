import {Message} from 'element-ui';
export const textToast = (text) => {
	// uni.showToast({
	// 	title: text,
	// 	duration: 1000,
	// 	icon: 'none'
	// });
  Message({
    showClose: true,
    message: text? text:'操作有误',
    type: ''
  });
}

export const loading = () => {
	uni.showLoading({
		title: '加载中',
		mask: true
	});
}
