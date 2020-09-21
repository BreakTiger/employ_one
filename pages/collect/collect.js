const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

let token = wx.getStorageSync('token')

Page({

  data: {
    page: 1,
    list: []
  },

  onLoad: function (options) {
    if (token) {
      this.getList()
    } else {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
    }

  },

  getList: function () {
    let that = this
    let data = {

    }
  },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})