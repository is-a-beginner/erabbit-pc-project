<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{showAddress.fullLocation.replace(/ /g,'')+showAddress.address}}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog()" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
  </div>
  <XtxDialog title="切换收货地址" v-model:visible="dialogVisible">
    <div @click="selectedAddress=item" :class="{active:selectedAddress&&selectedAddress.id === item.id}" class="text item" v-for="item in list" :key="item.id">
      <ul>
        <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
        <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
        </ul>
      </div>
      <!-- vue3.0 仅支持v-slot+template写法 -->  
      <template v-slot:footer>
        <XtxButton @click="dialogVisible=false" type="gray" style="margin-right:20px">取消</XtxButton>
        <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
    <!-- 收货地址添加和编辑组件 -->
    <AddressEdit ref="addressEdit" @on-success="successHandler" />
</template>
<script>
import {ref} from 'vue'
import AddressEdit from './address-edit.vue'
export default {
  name: 'CheckoutAddress',
  components: { AddressEdit },
  props: {
    list: {
      type: Array,
      default: () => []
    },
   },
    // 1. 在拥有根元素的组件中，触发自定义事件，有没有emits选项无所谓
    // 2. 如果你的组件渲染的代码片段，vue3.0规范，需要在emits中申明你所触发的自定义事件
    // 3. 提倡：你发了自定义事件，需要在emits选项申明下，代码可读性很高
    emits: ['change'],
  setup (props,{ emit }) {
    // 显示的地址
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item => item.receiver === '张三')
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        if (props.list.length) {
           showAddress.value = props.list[0]
        }
      }
    // 默认通知父组件一个地址
      emit('change',showAddress.value && showAddress.value.id)

    // 对话框显示隐藏
    const dialogVisible = ref(false)

    // 记录当前你选择的地址ID
    const selectedAddress = ref(null)

     // 确认地址
    const confirmAddressFn = () => {
        // 显示地址换成选中的地址
      showAddress.value = selectedAddress.value
         // 通知选中地址ID给父
      emit('change', selectedAddress.value.id)
      dialogVisible.value=false
    }
    const openDialog = () => {
      // 将之前选中的地址改成null
      selectedAddress.value = null
      dialogVisible.value = true
    }
      // 添加收货地址组件
      const addressEdit = ref(null)
      const openAddressEdit = (address) => {
      addressEdit.value.open(address)
   }
       // 成功
      const successHandler = (formData) => {
        const address = props.list.find(item => item.id === formData.id)
        if (address) {
          for (const [key] in address) {
            address[key] === formData[key]
          }
        }
      const json = JSON.stringify(formData)  // 需要克隆下，不然使用的是对象的引用
      props.list.unshift(JSON.parse(json))
    }
    return { showAddress,dialogVisible,selectedAddress,confirmAddressFn ,openDialog,addressEdit,openAddressEdit,successHandler}
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}

.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
