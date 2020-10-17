const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

const QRCode = require('../../utils/qr-core.js')

let qrcode = null;

Page({

  data: {
    detail: {},
    qrcodeWidth: 0
  },

  onLoad: function (options) {
    
    this.setData({
      detail: app.globalData.codeData
    })

    console.log(app.globalData.codeData)

    this.getCode(app.globalData.codeData.qrCode)

  },

  getCode: function (code) {
    let that = this
    const ctx = wx.createCanvasContext('canvas')
    const rate = wx.getSystemInfoSync().windowWidth / 750
    //二维码宽高
    let qrcodeWidth = rate * 400
    that.setData({
      qrcodeWidth: qrcodeWidth
    })
    qrcode = new QRCode('canvas', {
      usingIn: that,
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: "#000000", //前景颜色
      colorLight: "white", //背景颜色
      correctLevel: QRCode.CorrectLevel.H,
    })

    let id = code
    console.log(code)
    qrcode.makeCode(code)
  },

  // 面试管理
  one: function () {
    wx.navigateTo({
      url: '/pages_four/record/record',
    })
  },

  // 收到简历
  two: function () {
    wx.navigateTo({
      url: '/pages_four/vitae_count/vitae_count',
    })
  },

  onPullDownRefresh: function () {
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading',
    //   duration: 1000
    // })
    // this.getType()
    // setTimeout(() => {
    //   wx.stopPullDownRefresh()
    // }, 1000);
  },
})