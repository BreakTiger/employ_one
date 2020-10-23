const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: []
  },

  onLoad:function(){
    this.setData({
      imaUrl: app.globalData.imaUrl
    })
    this.getBanner()
  },

  getBanner: function () {
    let that = this
    util.sendRequest('/zqhr/app/enterprisenotice/rotatepictures', 'get', {}).then(function (res) {
      if (res.code == 0) {
        that.setData({
          banners: res.result
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 立即登录
  formSubmit: function (e) {
    let that = this
    if (e.detail.value.name == '') {
      modal.showToast('请输入账号', 'none')
    } else if (e.detail.value.password == '') {
      modal.showToast('请输入密码', 'none')
    } else {
      let data = {
        account: e.detail.value.name,
        psw: e.detail.value.password
      }
      util.sendRequest('/zqhr/app/user/login', 'get', data, 1).then(function (res) {
        if (res.code == 200) {
          console.log(res.result)
          let company = res.result.enterprise
          wx.setStorageSync('company', company)
          let token = res.result.tokenModel.token
          wx.setStorageSync('token', token)
          let person = res.result.tokenModel
          wx.setStorageSync('person', person)
          wx.navigateBack({
            delta: 0,
          })
          app.onShow()
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  },


  // 立即注册
  toRegister: function () {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  // 忘记密码
  toForget: function () {
    wx.navigateTo({
      url: '/pages/forget/forget',
    })
  }
})