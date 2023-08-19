<template>
		<p class="lf-tip">{{tip}}</p>
</template>

<script>
	export default{
		data() {
			return{
				tip: '',
			}
		},
		created() {
			let tip = this.$route.query.errMsg
			if(tip != null && tip != '' && tip != 'null' && tip){
				this.tip = tip
			}
		},
		methods:{
			
		}
	}
</script>

<style>
	.lf-tip{
		height: 31.25rem;
		line-height: 31.25rem;
		text-align: center;
		font-size: 1.875rem;
	}
</style>
