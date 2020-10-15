const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    page: 1,
    list: []
  },

  onLoad: function (options) {
    this.setData({
      imaUrl: app.globalData.imaUrl
    })
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/zqhr/hall/curriculumvitae/AllMatchinglist', 'get', data).then(function (res) {
      console.log(res.result.records)
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
      let age = util.ages(item)
      item.age = age
      arr.push(item)
    })
    that.setData({
      list: arr
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  }
})