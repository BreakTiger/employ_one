const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    id: '',

    position: {},

    enterprise: {},

    info: ''

  },

  onLoad: function (options) {
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
      // console.log(res.result.records[0])
      if (res.code == 0) {
        let info = res.result.records[0].jobDescription
        info = info
          .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
          .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
          .replace(/<p>/ig, '<p class="p_class">')
          .replace(/<span([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<span')
          .replace(/<span([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<span')
          .replace(/<span>/ig, '<span class="p_class">')
        console.log(info)

        that.setData({
          info: info,
          position: res.result.records[0]
        })


        // WxParse.wxParse('ask', 'html', ask, that, 5)
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
      // console.log(res.result)
      if (res.code == 0) {
        that.setData({
          enterprise: res.result.records[0]
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })

    this.getBase(this.data.id)

    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  }
})