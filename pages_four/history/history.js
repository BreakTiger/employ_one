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

      } else {
        modal.showToast(res.messgae, 'none')
      }
    })
  },


  toWatch: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages/workerdetail/index',
    })
  },

})