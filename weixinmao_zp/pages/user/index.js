Page({

  data: {

  },

  onLoad: function (options) {

  },


  onShow: function () {

  },

  // 跳转:

  // 通知
  notice: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages_four/notice/notice',
    })
  },

  // 匹配简历
  toMatchnote: function () {
    wx.navigateTo({
      url: "/weixinmao_zp/pages_four/match/match"
    })
  },

  // 编辑企业信息
  toEditcompany: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages_four/edit/edit"
    })
  },

  // 职位管理
  toMyjoblist: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages_four/position/position"
    })
  },


  // 求职简历
  vitae: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages_four/record/record',
    })
  },

  // 求职面试历史
  toHistory: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages_four/history/history',
    })
  },

  // 收藏简历
  collect: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages/mysave/index',
    })
  },

  // 退出登录
  loginout: function (e) {
    wx.clearStorageSync('companyid');
    wx.redirectTo({
      url: "/weixinmao_zp/pages/message/index"
    })
  },





  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})