const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

// 时间戳
var timestamp = Date.parse(new Date());


Page({

  /**
   * 页面的初始数据
   */
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
      pageNo: that.data.page,
      pageSize: 10,
    }
    util.sendRequest('/jeecg-boot/hall/jobfair/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.settle(res.result.records)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 整理
  settle: function (list) {
    let that = this

    list.forEach(function (item, index) {

      let time1 = that.transform(item.holdingtimeStart)

      let time2 = that.transform(item.holdingtimeEnd)

      // 判断活动状态
      if (time1 > timestamp) {
        item.status = "未开始"
      } else if (time1 < timestamp && time2 > timestamp) {
        item.status = "进行中"
      } else if (time2 < timestamp) {
        item.status = "已结束"
      }

    })

    that.setData({
      list: list
    })
  },

  // 转时间戳:
  transform: function (time) {
    var date = new Date(time.replace(/-/g, '/'));
    return date.getTime();
  },

  // 报名参会
  join: function (e) {
    let that = this

    console.log(timestamp)

    let time1 = that.transform(e.currentTarget.dataset.item.entrytimeEnd)
    console.log(time1)

    let time2 = that.transform(e.currentTarget.dataset.item.entrytimeStart)
    console.log(time2)

    // 判断
    if (time1 > timestamp) {
      wx.showModal({
        title: '提示',
        content: '未到活动报名时间',
        showCancel: false
      })
    } else if (time1 < timestamp && time2 > timestamp) {
      let data = {
        enterpriseInfoId: wx.getStorageSync('company').id,
        jobFairId: item.id,
        token: wx.getStorageSync('token')
      }
      util.sendRequest('/jeecg-boot/hall/entryenterprise/entry', 'post', data).then(function (res) {
        console.log(res)
        if (res.code == 0) {
          modal.showToast('报名成功')
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    } else if (time2 < timestamp) {
      wx.showModal({
        title: '提示',
        content: '活动报名时间已截止',
        showCancel: false
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

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})