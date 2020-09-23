const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {
    detail: {}
  },

  onLoad: function (options) {
    this.getType()
  },

  getType: function () {
    let that = this
    let data = {
      token: wx.getStorageSync('token')
    }
    util.sendRequest('/jeecg-boot/app/ticket/getticket', 'get', data).then(function (res) {
      console.log(res.result)
      if (res.code == 200) {
        that.setData({
          detail: res.result
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },




})