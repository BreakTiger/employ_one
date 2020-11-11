const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    area: [],
    areaname: '',

    eductaion: [],
    eductaionname: '',

    jobname: '',

    choice_one: 0,

    is_show: false

  },

  onLoad: function (options) {

    this.areaList()

    this.educationList()

    this.typeList()
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

  //职位：
  // 岗位类型 - 1
  typeList: function () {
    let that = this
    let data = {
      type: 'jobtype',
      pageSize: 200
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          type_one: res.result.records
        })
        that.typesList(res.result.records[0].id)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 岗位类型 - 2
  typesList: function (e) {
    let that = this
    let data = {
      type: 'jobname',
      parentid: e,
      pageSize: 300
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          type_two: res.result.records
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
  toJob: function () {
    this.setData({
      is_show: true
    })
  },

  choice_title: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      choice_one: index
    })
    that.typesList(e.currentTarget.dataset.item.id)
  },

  choice_right: function (e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    this.setData({
      jobname: item.dataName,
      is_show: false
    })
  },

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