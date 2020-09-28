const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

// 时间戳
var timestamp = new Date().getTime();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: [],
    load: ''
  },

  onLoad: function (options) {
    this.getList()
  },

  // 列表
  getList: function () {
    let that = this
    let data = {
      pageNo: that.data.page,
      pageSize: 10,
    }
    util.sendRequest('/zqhr/hall/jobfair/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          list:res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 搜索
  toSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // 报名参会
  join: function (e) {
    let that = this
    let data = {
      createBy: wx.getStorageSync('company').id,
      enterpriseInfoId: wx.getStorageSync('company').id,
      jobFairId: e.currentTarget.dataset.item.id,
      token: wx.getStorageSync('token')
    }
    util.sendRequest('/zqhr/hall/entryenterprise/entry', 'post', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        modal.showToast(res.message)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 进入会场
  toVenue: function (e) {
    app.globalData.venue = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages_two/venue/venue',
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
      pageNo: that.data.page + 1,
      pageSize: 10,
    }
    util.sendRequest('/zqhr/hall/jobfair/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.setData({
            page: data.pageNo,
            list:old.concat(news)
          })
        } else {
          modal.showToast('已经到底了', 'none')
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }
})