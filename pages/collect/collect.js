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

  // 收藏列表
  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/jeecg-boot/app/resumecollection/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 取消收藏
  toCancle: function (e) {
    let that = this
    wx.showModal({
      title: "提示",
      content: "是否取消收藏",
      success: function (res) {
        if (res.confirm) {
          let list = that.data.list
          let index = e.currentTarget.dataset.index
          let data = {
            id: e.currentTarget.dataset.id
          }
          util.sendRequest('/jeecg-boot/app/resumecollection/cancelcollection', 'get', data).then(function (res) {
            console.log(res)
            if (res.code == 200) {
              list.splice(index, 1)
              that.setData({
                list: list
              })
            } else {
              modal.showToast(res.message, 'none')
            }
          })
        }
      }
    })




  },

  // 查看简历详情
  toDetail: function (e) {
    let that = this
    let data = {
      id: e.currentTarget.dataset.id
    }
    util.sendRequest('/jeecg-boot/hall/curriculumvitae/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        app.globalData.worker = res.result.records[0]
        wx.navigateTo({
          url: '/pages/vitae/vitae',
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 邀请面试
  toInvite: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.item)
    wx.showModal({
      title: '提示',
      content: "是否发送面试邀约给该投递人",
      success: function (res) {
        if (res.confirm) {

        }
      }
    })
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