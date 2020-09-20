const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

const WxParse = require('../../wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

    WxParse.wxParse('article', 'html', article, that, 5);

    that.getType()
  },

  //简历收藏状态
  getType: function () {
    let that = this

  },

  // 收藏
  toCollect: function () {
    let that = this
  },

  //取消收藏
  toCancel: function () {
    let that = this
  }


})