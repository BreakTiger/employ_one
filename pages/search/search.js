const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    area: [],
    areaname: '',

    eductaion: [],
    eductaionname: '',

    jobname: ''

  },

  onLoad: function (options) {

    this.areaList()

    this.educationList()

  },

  // 区域列表
  areaList: async function () {
    let that = this
    let data = {
      type: 'area'
    }
    await util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          area: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 学历列表
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

  // 选项：

  // 区域
  getArea: function (e) {
    let that = this
    let list = that.data.area
    let index = e.detail.value
    that.setData({
      areaname: list[index].dataName
    })
  },

  // 学历
  getEducation: function (e) {
    let that = this
    let list = that.data.eductaion
    let index = e.detail.value
    that.setData({
      eductaionname: list[index].dataName
    })
  },

  // 职位

  // 提交
  toSearch: function (e) {
    let that = this
    let detail = {
      area: that.data.areaname,
      trade: that.data.jobname,
      education: that.data.eductaionname
    }
    wx.navigateTo({
      url: '/pages/search_list/search_list?detail=' + JSON.stringify(detail),
    })
  },


})