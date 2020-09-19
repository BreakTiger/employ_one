const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

let date = new Date()
const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDate()
const hour = date.getHours()
const minute = date.getMinutes()
const second = date.getSeconds()

Page({

  data: {
    sid: '',
    code: '',
    time: ''
  },


  onLoad: function (options) {
    let that = this
    that.setData({
      sid: options.sid,
      code: options.code,
      time: year + '/' + month + '/' + day + '/' + hour + ':' + minute + ':' + second
    })
  },

  // 领取
  gets: function () {
    let that = this
    let data = {
      createBy: wx.getStorageSync('company').id,
      ipadCode: that.data.code,
      jobFairId: that.data.sid,
      token: wx.getStorageSync('token'),
      borrowingTime: year + '/' + month + '/' + day + '/' + hour + ':' + minute + ':' + second,
      borrowState: 1
    }
    util.sendRequest("/jeecg-boot/hall/tabletpc/scan", 'post', data).then(function (res) {
      if (res.code == 200) {
        modal.showToast(res.message)
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 归还
  rback: function () {
    let that = this
    let data = {
      borrowState: -1,
      updateBy: wx.getStorageSync('company').id,
      ipadCode: that.data.code,
      jobFairId: that.data.sid,
      token: wx.getStorageSync('token'),
      returnTime: year + '/' + month + '/' + day + '/' + hour + ':' + minute + ':' + second,
    }
    util.sendRequest('/jeecg-boot/hall/tabletpc/repay', 'post', data).then(function (res) {
      if (res.code == 200) {
        modal.showToast(res.message)
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }


})