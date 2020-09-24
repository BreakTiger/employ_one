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

  // 编辑
  toEditor: function () {

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
          let list = that.data.list
          let data = {
            id: e.currentTarget.dataset.id
          }
          util.sendRequest('/jeecg-boot/app/staff/delete', 'get', data).then(function (res) {
            console.log(res)
            if (res.code == 200) {
              modal.showToast(res.messgae)
              list.splice(index, 0)
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
  toChange: function () {

  },

  // 添加企业员工
  toAdd: function () {
    wx.navigateTo({
      url: '/pages_four/add_ staff/add_ staff',
    })
  },


})