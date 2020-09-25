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


  // 删除
  toDel: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否删除该职位',
      success: function (res) {
        if (res.confirm) {
          let list = that.data.list
          let index = e.currentTarget.dataset.index
          let data = {
            id: e.currentTarget.dataset.id
          }
          util.sendRequest('/jeecg-boot/hall/position/delete', 'DELETE', data).then(function (res) {
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

  // 开启 / 关闭 
  isOpen: function (e) {
    let that = this
    let list = that.data.list
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    let data = {}
    if (type == 1) {
      console.log('关闭')
      data = {
        enable: -1,
        id: id
      }
    } else {
      console.log('开启')
      data = {
        enable: 1,
        id: id
      }
    }
    util.sendRequest('/jeecg-boot/hall/position/enable', 'get', data).then(function (res) {
      if (res.code == 200) {
        // 根据type,来JS变动enable
        let temp_str = 'list[' + index + '].enable';
        if (type == 1) {
          that.setData({
            [temp_str]: -1
          })
        } else {
          that.setData({
            [temp_str]: 1
          })
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })


  },
})