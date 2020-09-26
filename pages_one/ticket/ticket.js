const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    detail: {},
    code: ''
  },

  onLoad: function (options) {
    this.getType()
  },

  getType: function () {
    let that = this
    let data = {
      token: wx.getStorageSync('token')
    }
    util.sendRequest('/zqhr/app/ticket/getticket', 'get', data).then(function (res) {
      console.log(res.result)
      if (res.code == 200) {
        that.setData({
          detail: res.result,
          code: app.globalData.imaUrl + res.result.qrCodeAddress
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 面试管理
  one: function () {
    wx.navigateTo({
      url: '/pages_four/record/record',
    })
  },

  // 收到简历
  two: function () {
    wx.navigateTo({
      url: '/pages_four/vitae_count/vitae_count',
    })
  }
})