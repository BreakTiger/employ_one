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
      page: 1,
      role: wx.getStorageSync('person').userRole
    })
    this.getList()
  },

  // 员工列表
  getList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page,
      pageSize: 10,
      role: wx.getStorageSync('person').userRole,
      staffManageId: wx.getStorageSync('person').userId
    }
    util.sendRequest('/zqhr/app/staff/list', 'get', data).then(function (res) {
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

  // 编辑
  toEditor: function (e) {
    wx.navigateTo({
      url: '/pages_four/add_ staff/add_ staff?detail=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },

  // 删除
  toDelete: function (e) {
    let that = this

    wx.showModal({
      title: "提示",
      content: "是否删除该员工",
      success: function (res) {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index
          console.log(index)
          let list = that.data.list
          let data = {
            id: e.currentTarget.dataset.id
          }
          util.sendRequest('/zqhr/app/staff/delete', 'get', data).then(function (res) {
            console.log(res)
            if (res.code == 200) {
              modal.showToast(res.message)
              list.splice(index, 1)
              that.setData({
                list: list
              })
            } else {
              modal.showToast(res.messgae, 'none')
            }
          })
        }
      }
    })
  },

  // 修改密码
  toChange: function (e) {
    wx.navigateTo({
      url: '/pages_four/staff_editor/staff_editor?detail=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },

  // 添加企业员工
  toAdd: function () {
    wx.navigateTo({
      url: '/pages_four/add_ staff/add_ staff',
    })
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    this.setData({
      page: 1
    })
    this.getList()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

  onReachBottom: function () {
    let that = this
    let old = that.data.list
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: that.data.page + 1,
      pageSize: 10,
      role: wx.getStorageSync('person').userRole,
      staffManageId: wx.getStorageSync('person').userId
    }
    util.sendRequest('/zqhr/app/staff/list', 'get', data).then(function (res) {
      console.log(res.result.records)
      if (res.code == 0) {
        let news = res.result.records
        if (news.length != 0) {
          that.setData({
            list: old.concat(news),
            page: data.pageNo
          })
        } else {

        }
      } else {
        modal.showToast(res.messgae, 'none')
      }
    })
  }
})