const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    login: 0,
    company: {}
  },


  onLoad: function (options) {
    let that = this
    let token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 去登陆
  toLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 退出登录
  loginout: function () {
    let that = this
    wx.showModal({
      title: "提示",
      content: "是否退出登录",
      success: function (res) {
        if (res.confirm) {
          let data = {
            token: wx.getStorageSync('token')
          }
          util.sendRequest('/jeecg-boot/app/user/logout', 'get', data).then(function (res) {
            console.log(res)
            if (res.code == 0) {
              modal.showToast(res.message)
              wx.clearStorage()
              that.setData({
                login: 0
              })
            } else {
              modal.showToast(res.message, 'none')
            }
          })
        }
      }
    })
  },

  onShow: function () {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      that.setData({
        company: wx.getStorageSync('company'),
        login: 1
      })
    }
  },

  // 跳转:

  // 通知
  notice: function () {
    wx.navigateTo({
      url: '/pages_four/notice/notice',
    })
  },

  // 匹配简历
  toMatchnote: function () {
    wx.navigateTo({
      url: "/pages_four/match/match"
    })
  },

  // 编辑企业信息
  toEditcompany: function (e) {
    wx.navigateTo({
      url: "/pages_four/edit/edit"
    })
  },

  // 职位管理
  toMyjoblist: function (e) {
    wx.navigateTo({
      url: "/pages_four/position/position"
    })
  },

  // 员工管理
  toStaff: function () {
    wx.navigateTo({
      url: '/pages_four/staff/staff',
    })
  },

  // 求职简历
  vitae: function () {
    wx.navigateTo({
      url: '/pages_four/record/record',
    })
  },

  // 求职面试历史
  toHistory: function () {
    wx.navigateTo({
      url: '/pages_four/history/history',
    })
  },

  // 收藏简历
  collect: function () {
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})