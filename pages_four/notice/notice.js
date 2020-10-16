const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {
    page: 1,
    list: []
  },

  onShow: function () {
    this.getList()
  },

  // 列表
  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/zqhr/app/enterprisenotice/list', 'get', data).then(function (res) {
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
    let that = this
    let item = e.currentTarget.dataset.item
    let data = {
      id: item.id
    }
    util.sendRequest('/zqhr/app/enterprisenotice/read', 'get', data).then(function (res) {
      if (res.code == 200) {
        app.globalData.notice = e.currentTarget.dataset.item
        wx.navigateTo({
          url: '/pages_four/notice_detail/notice_detail',
        })
      } else {
        modal.showToast(res.message, 'none')
      }
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
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page+1,
      pageSize: 10
    }
    util.sendRequest('/zqhr/app/enterprisenotice/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.setData({
            list: old.concat(news),
            page: data.pageNo
          })
        } else {

        }
      } else {
        modal.showToast(res.message, 'none')
      }

    })
  }


})