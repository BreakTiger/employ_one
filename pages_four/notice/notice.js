const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {
    page: 1,
    list: []
  },

  onLoad: function (options) {
    this.getList()
  },

  // 列表
  getList: function () {
    let that = this
    let data = {
      enterpriseid: wx.getStorageSync('company').id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/zqhr/hall/jobfair/invitationlist', 'get', data).then(function (res) {
      console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 详情跳转
  toDetail: function (e) {
    app.globalData.notice = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages_four/notice_detail/notice_detail',
    })
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    this.setData({
      page: 1
    })
    this.getList()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  onReachBottom: function () {
    let that = this
    let old = that.data.list
    let data = {
      enterpriseid: wx.getStorageSync('company').id,
      pageNo: that.data.page + 1,
      pageSize: 10
    }
    util.sendRequest('/zqhr/hall/jobfair/invitationlist', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.setData({
            list: old.concat(news),
            page:data.pageNo
          })
        } else {

        }
      } else {
        modal.showToast(res.message, 'none')
      }

    })
  }


})