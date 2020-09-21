const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'


Page({

  data: {
    detail: {}
  },

  onLoad: function (options) {
    console.log(app.globalData.worker)
    this.setData({
      detail: app.globalData.worker
    })
  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})