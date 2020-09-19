const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    detail: {},

    list: [], //行业 性质 规模

    trade: '',

    property: '',

    scale: '',

    logo: ''
  },


  onLoad: function (options) {
    let detail = wx.getStorageSync('company')
    
    // let logo = app.globalData.imaUrl + detail.logoAddress
    // if (detail.logoAddress) {
    //   console.log(111)
    //   this.setData({
    //     logo: logo
    //   })
    // }

    // console.log(app.globalData.imaUrl + detail.logoAddress)

    console.log(wx.getStorageSync('company'))

    this.setData({
      detail: detail
    })
  },

})