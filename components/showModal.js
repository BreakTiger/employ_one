Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    title: { // 属性名
      type: String, 
      value: '标题' 
    },
    content: {
      type: Array,
      value: '弹窗内容'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确定'
    },
    tips: {
      type: String,
      value: '显示'
    },
    judge: {
      type: String,
      value: '判断'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    move: function () {
      return
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: true
      })
    },
    toCall:function(e){    
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel,
        success: function () {
          console.log('成功拨打电话')
        }
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent");
    }
  }
})
