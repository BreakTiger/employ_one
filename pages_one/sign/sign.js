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
    company: {},
    time: '',
    id: '',
    sid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    that.setData({
      id: options.id,
      sid: options.sid,
      company: wx.getStorageSync('company'),
      time: year + '/' + month + '/' + day + '/' + hour + ':' + minute + ':' + second
    })
  },

  sign: function () {
    let that = this
    let data = {
      createBy: that.data.id,
      signTime: that.data.time,
      jobFairId: that.data.sid,
      id: that.data.id,
      signStatus: 1,
      token:wx.getStorageSync('token')
    }
    util.sendRequest('/zqhr/hall/sign/scan', 'post', data, 1).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        wx.setStorageSync('sign', year + '/' + month + '/' + day)
        wx.showModal({
          title: "提示",
          content: "签到成功,请签到后，扫码领取平板电脑",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 0,
              })
            }
          }
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })

  },

})