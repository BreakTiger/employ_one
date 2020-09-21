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
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/jeecg-boot/app/interview/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 新增面试
  toAdd: function () {
    wx.navigateTo({
      url: '/pages_four/add_record/add_record',
    })
  },

  // 查看简历
  toWatch: function (e) {
    let that = this
    let data = {
      id: e.currentTarget.dataset.id
    }
    util.sendRequest('/jeecg-boot/hall/curriculumvitae/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let list = util.ages(res.result.records[0])
        // app.globalData.worker = res.result.records[0]
        // wx.navigateTo({
        //   url: '/pages/workerdetail/workerdetail',
        // })
      } else {
        modal.showToast(res.message)
      }
    })
    // wx.navigateTo({
    //   url: '/pages/workerdetail/workerdetail',
    // })
  },

  toFinsh: function () {
    wx.navigateTo({
      url: '/pages_four/finish/finish',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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