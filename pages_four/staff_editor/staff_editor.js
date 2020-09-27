const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  onLoad: function (options) {
    this.setData({
      detail: JSON.parse(options.detail)
    })
    console.log(JSON.parse(options.detail))
  },

  // 立即修改
  formSubmit: function (e) {
    let that = this
    let data = e.detail.value
    console.log(data)
    if (!data.old) {
      modal.showToast('请输入旧密码', 'none')
    } else if (!data.new) {
      modal.showToast('请输入新密码', 'none')
    } else {
      let param = {
        id: that.data.detail.id,
        oldpsw: data.old,
        newpsw: data.new
      }
      console.log(param)
      // 判断修改的角色
      if (that.data.detail.role == 1) {
        that.change_one(param)
      } else {
        that.change_two(param)
      }
    }
  },

  // 修改管理员密码
  change_one: function (e) {
    console.log('管理员')
    let that = this
    util.sendRequest('/zqhr/app/staff/UpdatePasswordAdmin', 'get', e).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        modal.showToast(res.message)
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


  change_two: function (e) {
    console.log('员工')
    let that = this
    util.sendRequest('/zqhr/app/staff/UpdatePasswordStaff', 'get', e).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        modal.showToast(res.message)
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 2000);
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }


})