const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {
    page: 1,
    list: []
  },


  onShow: function () {
    this.getList()
  },

  getList: function () {
    let that = this
    let data = {
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/jeecg-boot/hall/position/list', 'get', data).then(function (res) {
      console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 编辑
  toEdit: function (e) {
    wx.navigateTo({
      url: '/pages/addJob/addJob?detail=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },

  // 添加职位
  addcompanyjob: function () {
    wx.navigateTo({
      url: '/pages/addJob/addJob',
    })
  },


  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})