const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    isexisting: 1,
    list: [],
    load: ''
  },

  onShow: function () {
    this.setData({
      page: 1
    })
    this.getList()
    app.setWatcher(app.noticeData, this); // 设置监听器

  },

  watch: { // 监听
    admission(newValue) { // admission 要监测的具体数据
      let that = this
      if (newValue == true) {
        that.setData({
          total: app.noticeData.noticeTotal,
          nlist: app.noticeData.noticeList
        })
        that.showDialog();
      }
    }
  },

  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },

  showDialog() { // 显示弹出框
    this.dialog.showDialog();
  },

  //取消事件
  _cancelEvent() {
    app.noticeData.admission = false
    this.dialog.hideDialog();
    app.onShow()
  },

  //确认事件
  _confirmEvent() {
    app.noticeData.admission = false
    wx.navigateTo({
      url: '/pages/list/list?list=' + JSON.stringify(app.noticeData.noticeList)
    })
    this.dialog.hideDialog();
    app.onShow()
  },

  changeds: function (e) {
    let that = this
    that.setData({
      page:1,
      isexisting: e.currentTarget.dataset.type
    })
    that.getList()
  },


  // 列表
  getList: function () {
    let that = this
    let data = {
      pageNo: that.data.page,
      pageSize: 10,
      isexisting: that.data.isexisting
    }
    util.sendRequest('/zqhr/hall/jobfair/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          list: res.result.records
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
    let token = wx.getStorageSync('token')

    if (token) {
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
    } else {
      wx.showModal({
        title: "提示",
        content: "请先登录",
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
      isexisting: that.data.isexisting
    }
    util.sendRequest('/zqhr/hall/jobfair/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.setData({
            page: data.pageNo,
            list: old.concat(news)
          })
        } else {
          // modal.showToast('已经到底了', 'none')
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }
})