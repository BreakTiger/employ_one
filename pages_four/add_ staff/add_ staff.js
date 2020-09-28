const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {
    sex: '',
    ed_type: false
  },

  onLoad: function (options) {
    let detail = JSON.parse(options.detail)
    if (detail) {
      console.log(detail)
      this.setData({
        ed_type: true,
        sex: detail.sex,
        name: detail.name,
        phone: detail.phone,
        psw: detail.password,
        idcard: detail.idcard
      })

      wx.setNavigationBarTitle({
        title: '修改员工',
      })
    }
  },

  // 性别
  radioChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },

  formSubmit: function (e) {
    let that = this
    let data = e.detail.value
    console.log(data)
    if (!data.name) {
      modal.showToast('请输入姓名', 'none')
    } else if (!that.data.sex) {
      modal.showToast('请选择性别', 'none')
    } else if (!data.tel) {
      modal.showToast('请输入手机号码', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(data.tel))) {
      modal.showToast('请输入合法的电话号码', 'none')
    } else if (!data.psw) {
      modal.showToast('请设置密码', 'none')
    } else if (!data.idcard) {
      modal.showToast('请输入身份证号码', 'none')
    } else if (!(/(^\d{15}$)|(^\d{17}(\d|X)$)/.test(data.idcard))) {
      modal.showToast('请输入合法的身份号码', 'none')
    } else {
      let param = {
        enterpriseInfoId: wx.getStorageSync('company').id,
        gender: that.data.sex,
        idcard: data.idcard,
        name: data.name,
        password: data.psw,
        phone: data.tel,
        createBy: wx.getStorageSync('company').id
      }
      console.log(param)
      if (!that.data.ed_type) {
        that.add(param)
      } else {
        that.editor(param)
      }
    }
  },

  add: function (param) {
    let that = this
    util.sendRequest('/zqhr/app/staff/add', 'post', param).then(function (res) {
      console.log(res)
      if (res.code == 200) {
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

  editor: function (param) {
    let that = this
    param.updateBy = wx.getStorageSync('company').id
    util.sendRequest('/zqhr/app/staff/editById', 'post', param).then(function (res) {
      console.log(res)
      if (res.code == 200) {
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