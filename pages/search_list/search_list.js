const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    worklist: []
  },

  onLoad: function (options) {
    console.log(JSON.parse(options.detail))
    this.setData({
      imaUrl: app.globalData.imaUrl
    })
    this.getList(JSON.parse(options.detail))
  },

  // 人才列表
  getList: function (detail) {
    let that = this
    let data = {
      pageNo: that.data.page,
      pageSize: 10,
      workArea: detail.area,
      intendedIndustries: detail.trade,
      education: detail.education,
      name: detail.word
    }
    util.sendRequest('/zqhr/hall/curriculumvitae/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.settle(res.result.records)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 整理，并计算求职者年龄
  settle: function (list) {
    let that = this
    let arr = []
    list.forEach(function (item) {
      if (item.enable == 1) {
        let age = util.ages(item)
        item.age = age
        arr.push(item)
      }

    })
    console.log(arr)
    that.setData({
      worklist: arr
    })
  },

  // 简历详情
  toWorkerDetail: function (e) {
    let that = this
    let detail = e.currentTarget.dataset.item
    let data = {
      curriculumVitaeId: detail.id,
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/app/interview/browse', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        app.globalData.worker = detail
        wx.navigateTo({
          url: '/pages/vitae/vitae',
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


})