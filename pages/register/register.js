const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    choice: 0
  },

  checkboxChange: function (e) {
    console.log(e)
    if (e.detail.value) {
      this.setData({
        choice: e.detail.value
      })
    } else {
      this.setData({
        choice: 0
      })
    }
  },

  // 提交表单
  formSubmit: function (e) {
    let that = this
    console.log(e)
    // 验证
    let data = e.detail.value
    if (!data.companyname) {
      modal.showToast('请输入企业名称', 'none')
    } else if (!data.companycode) {
      modal.showToast('请输入企业信用代码', 'none')
    } else if (!(/^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(data.companycode))) {
      modal.showToast('请输入合法的企业信用代码', 'none')
    } else if (!data.mastername) {
      modal.showToast('请填写负责人', 'none')
    } else if (!data.tel) {
      modal.showToast('请输入联系电话', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(data.tel)) && !(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(data.tel))) {
      modal.showToast('请输入合法的联系电话', 'none')
    } else if (!data.mail) {
      modal.showToast('请输入邮箱', 'none')
    } else if (!data.psw) {
      modal.showToast('请设置密码', 'none')
    } else if (that.data.choice == 0) {
      modal.showToast('请先同意《企业入驻协议》', 'none')
    } else {
      let param = {
        createBy: data.tel,
        enterpriseName: data.companyname,
        companyPrincipal: data.mastername,
        phone: data.tel,
        email: data.mail,
        creditCode: data.companycode,
        password: data.psw,
        account: data.tel
      }
      util.sendRequest('/zqhr/hall/enterprise/add', 'post', param).then(function (res) {
        if (res.code == 200) {
          wx.showModal({
            title: '提示',
            content: '提交成功,请耐心等待我们的审核！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 0
                })
              }
            }
          })
        } else {
          modal.showToast(res.message, 'none')
        }
      })
    }
  }
})