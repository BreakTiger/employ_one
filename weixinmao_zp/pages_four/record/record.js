// pages_one/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 新增面试
  toAdd: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages_four/add_record/add_record',
    })
  },

  toWatch: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages/workerdetail/index',
    })
  },

  toFinsh:function(){
    wx.navigateTo({
      url: '/weixinmao_zp/pages_four/finish/finish',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})