const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [
      {
        thumb: 'http://120.79.207.87:8091//img/zqzpImg/1.jpg'
      },
      {
        thumb: 'http://120.79.207.87:8091//img/zqzpImg/2.jpg'
      },
      {
        thumb: 'http://120.79.207.87:8091//img/zqzpImg/3.jpg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      util.sendRequest('/jeecg-boot/app/user/login', 'get', data, 1).then(function (res) {
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