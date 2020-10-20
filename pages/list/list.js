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
      list: JSON.parse(options.list),
      imaUrl: app.globalData.imaUrl
    })
  },

  // 详情 - 增加查看次数
  toWorkerDetail: function (e) {
    let that = this
    let item = e.currentTarget.dataset.item
    let data = {
      curriculumVitaeId: item.id,
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/app/interview/browse', 'get', data).then(function (res) {
      if (res.code == 200) {
        app.globalData.worker = item
        wx.navigateTo({
          url: '/pages/vitae/vitae',
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  }
})