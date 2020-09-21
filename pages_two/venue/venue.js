const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    item: {},
    page: 1,
    list: []
  },

  onLoad: function (options) {
    
   
    let item = app.globalData.venue
    console.log(item)

    wx.setNavigationBarTitle({
      title: item.name,
    })

    let that = this

    that.setData({
      item: item
    })

    that.getList()
  },

  getList: function () {

    let that = this
    let data = {
      jobfairId: that.data.item.id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/jeecg-boot/hall/entryenterprise/list', 'get', data).then(function (res) {
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

  // 查看详情
  toDeatil: function (e) {
    wx.navigateTo({
      url: '/pages_two/venue_detali/venue_detali?id=' + e.currentTarget.dataset.id,
    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})