const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

const WxParse = require('../../wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },


  onLoad: function (options) {
    console.log(app.globalData.notice)
    let that = this
    that.setData({
      detail: app.globalData.notice
    })

    let article = app.globalData.notice.invitation
    WxParse.wxParse('article', 'html', article, that, 5)

  },

  // 报名
  join: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      jobFairId: app.globalData.notice.jobFairId,
      token: wx.getStorageSync('token'),
      createBy: wx.getStorageSync('company').id
    }
    util.sendRequest('/jeecg-boot/hall/entryenterprise/entry', 'post', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        wx.showModal({
          title: "提示",
          content: "报名成功",
          showCancel: false
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 返回
  back: function () {
    wx.navigateBack({
      delta: 0,
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})