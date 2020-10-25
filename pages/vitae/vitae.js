const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

const WxParse = require('../../wxParse/wxParse.js')

let token = wx.getStorageSync('token')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    type: 0,
    id: ''
  },

  onLoad: function (options) {

    let that = this

    that.setData({
      imaUrl: app.globalData.imaUrl
    })

    console.log(app.globalData.worker)

    that.setData({
      detail: app.globalData.worker
    })

    let article = app.globalData.worker.workHistory
    if (article) {
      WxParse.wxParse('article', 'html', article, that, 5);
    }

    that.getType()

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

  //简历收藏状态
  getType: function () {
    let that = this
    let data = {
      curriculumVitaeId: that.data.detail.id
    }
    util.sendRequest('/zqhr/app/resumecollection/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          id: res.result.records[0].id
        })
        if (res.result.records.length == 0) { //未收藏
          console.log('未收藏')
          that.setData({
            type: 0
          })
        } else { //收藏
          console.log('收藏')
          that.setData({
            type: 1,
            id: res.result.records[0].id
          })
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })

  },

  // 收藏
  toCollect: function () {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      let data = {
        createBy: wx.getStorageSync('company').id,
        curriculumVitaeId: that.data.detail.id,
        enterpriseInfoId: wx.getStorageSync('company').id
      }
      util.sendRequest('/zqhr/app/resumecollection/collection', 'post', data).then(function (res) {
        if (res.code == 200) {
          modal.showToast('收藏成功')
          that.getType()
          setTimeout(() => {
            that.setData({
              type: 1
            })
          }, 2000);
        } else {
          modal.showToast(res.message, 'none')
        }
      })
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

  //取消收藏
  toCancel: function () {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      let data = {
        id: that.data.id
      }
      util.sendRequest('/zqhr/app/resumecollection/cancelcollection', 'get', data).then(function (res) {
        console.log(res)
        if (res.code == 200) {
          modal.showToast('取消收藏')
          setTimeout(() => {
            that.setData({
              type: 0
            })
          }, 2000);

        } else {
          modal.showToast(res.message, 'none')
        }
      })
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
  }


})