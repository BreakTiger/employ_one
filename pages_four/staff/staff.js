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

  // 员工列表
  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/jeecg-boot/app/staff/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})