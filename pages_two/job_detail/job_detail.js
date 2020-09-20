const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    id: '',

    position: {},

    enterprise: {}
  },

  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
    this.getBase(options.id)

    this.getEnterprise(options.id)


  },

  // 基本数据
  getBase: function (id) {
    let that = this
    let data = {
      id: id
    }
    util.sendRequest('/jeecg-boot/hall/position/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          position: res.result.records[0]
        })
      } else {
        modal.showToast(res.messgae, 'none')
      }
    })
  },

  // 企业数据
  getEnterprise: function (id) {
    let that = this
    let data = {
      id: id
    }
    util.sendRequest('/jeecg-boot/hall/enterprise/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          enterprise: res.result.records[0]
        })
      } else {
        modal.showToast(res.message, 'none')
      }
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