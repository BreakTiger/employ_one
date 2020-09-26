const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {
    page: 1,
    list: []
  },

  onShow: function () {
    this.setData({
      page: 1
    })
    this.getList()
  },

  // 列表
  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page,
      pageSize: 10
    }
    util.sendRequest('/jeecg-boot/app/interview/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          list: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
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
    util.sendRequest('/jeecg-boot/app/interview/browse', 'get', data).then(function (res) {
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

  // 新增面试
  toAdd: function () {
    wx.navigateTo({
      url: '/pages_four/add_record/add_record',
    })
  },

  // 删除记录
  toDetele: function (e) {
    let that = this
    wx.showModal({
      title: "提示",
      content: "是否删除该面试记录",
      success: function (res) {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index
          let list = that.data.list
          let data = {
            id: e.currentTarget.dataset.id
          }
          util.sendRequest('/jeecg-boot/app/interview/delete', 'get', data).then(function (res) {
            console.log(res)
            if (res.code == 200) {
              modal.showToast(res.message)
              list.splice(index, 1)
              that.setData({
                list: list
              })
            } else {
              modal.showToast(res.message, 'none')
            }
          })
        }
      }
    })
  },
})