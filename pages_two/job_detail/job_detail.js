const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    id: ''
  },

  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
  },



  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})