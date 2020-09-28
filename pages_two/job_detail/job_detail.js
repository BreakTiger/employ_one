const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

const WxParse = require('../../wxParse/wxParse.js')

Page({

  data: {
    id: '',

    position: {},

    enterprise: {}
  },

  onLoad: function (options) {
    // console.log(options.id)
    this.setData({
      id: options.id
    })

    this.getBase(options.id)

  },

  // 基本数据
  getBase: function (id) {
    let that = this
    let data = {
      id: id
    }
    util.sendRequest('/zqhr/hall/position/list', 'get', data).then(function (res) {
      console.log(res.result.records[0])
      if (res.code == 0) {
        that.setData({
          position: res.result.records[0]
        })
        let ask = res.result.records[0].jobDescription
        WxParse.wxParse('ask', 'html', ask, that, 5)
        that.getEnterprise(res.result.records[0].enterpriseInfoId)
      } else {
        modal.showToast(res.messgae, 'none')
      }
    })
  },

  // 企业数据
  getEnterprise: function (e) {
    let that = this
    let data = {
      id: e
    }
    util.sendRequest('/zqhr/hall/enterprise/list', 'get', data).then(function (res) {
      console.log(res.result)
      if (res.code == 0) {
        that.setData({
          enterprise: res.result.records[0]
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }
})