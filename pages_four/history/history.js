const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    page: 1,
    list: []
  },

  onLoad: function (options) {
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      interviewstate: 'finish',
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/zqhr/app/interview/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.messgae, 'none')
      }
    })
  },

  // 查看简历
  toWatch: function (e) {
    let that = this
    let data = {
      id: e.currentTarget.dataset.item.id
    }
    util.sendRequest('/zqhr/hall/curriculumvitae/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        console.log(res.result.records[0])
        let item = res.result.records[0]
        let age = util.ages(item)
        item.age = age
        that.addlog(item)
      } else {
        modal.showToast(res.message)
      }
    })
  },

  addlog: function (detail) {
    let that = this
    let data = {
      curriculumVitaeId: detail.id,
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/app/interview/browse', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        app.globalData.worker = detail
        wx.navigateTo({
          url: '/pages/workerdetail/workerdetail',
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //评价面试
  toFinsh: function (e) {
    wx.navigateTo({
      url: '/pages_four/finish/finish?detail=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },

})