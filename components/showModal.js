Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },

  properties: {

    total: {
      type: Number,
      value: ''
    },

    arrs: {
      type: Array,
      value: ''
    },
        
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

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

    // 取消
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },

    // 查看
    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent");
    }

  }
})
