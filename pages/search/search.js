const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    area: [],
    areaname: '',

    trade: [],
    tradename: '',

    eductaion: [],
    eductaionname: ''

  },

  onLoad: function (options) {

    this.areaList()

    this.tradeList()

    this.educationList()

  },

  areaList: async function () {
    let that = this
    let data = {
      type: 'area'
    }
    await util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          area: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  tradeList: async function () {
    let that = this
    let data = {
      type: 'industrytype'
    }
    await util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          trade: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  educationList: async function () {
    let that = this
    let data = {
      type: 'education'
    }
    await util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          eductaion: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


  getArea: function (e) {
    let that = this
    let list = that.data.area
    let index = e.detail.value
    that.setData({
      areaname: list[index].dataName
    })
  },

  getTrade: function (e) {
    let that = this
    let list = that.data.trade
    let index = e.detail.value
    that.setData({
      tradename: list[index].dataName
    })
  },

  getEducation: function (e) {
    let that = this
    let list = that.data.eductaion
    let index = e.detail.value
    that.setData({
      eductaionname: list[index].dataName
    })
  },

  // 提交
  toSearch: function (e) {
    let that = this
    let detail = {
      word: that.data.word,
      area: that.data.areaname,
      trade: that.data.tradename,
      education: that.data.eductaionname
    }
    wx.navigateTo({
      url: '/pages/search_list/search_list?detail=' + JSON.stringify(detail),
    })
  },


})