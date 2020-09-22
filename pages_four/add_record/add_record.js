const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {

    //性别
    sex: null,

    //出生
    birth: '',

    //学历
    education: [],
    educationName: '',

    //工作经验
    experience: ['无经验', '1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
    experienceName: '',

    // 照片
    photo: ''
  },


  onLoad: function (options) {
    this.educationList()
  },

  //学历-列表
  educationList: function () {
    let that = this
    let data = {
      type: 'education'
    }
    util.sendRequest('/jeecg-boot/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          education: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


  //性别 - 选择
  radioChange: function (e) {
    let that = this
    that.setData({
      sex: e.detail.value
    })
  },

  // 出生日期 - 选择
  getBirth: function (e) {
    let that = this
    that.setData({
      birth: e.detail.value
    })
  },

  //学历 - 选择
  getEducation: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.education
    that.setData({
      educationName: list[index].dataName
    })
  },

  //工作经验 - 选择
  getExperience: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.experience
    that.setData({
      experienceName: list[index]
    })
  },

  // 拍照上传
  toImg: function () {
    wx.chooseImage({
      sourceType: ['camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
      }
    })
  },

  // 提交
  formSubmit: function (e) {
    let that = this
    let data = e.detail.value
    console.log(data)
    if (!data.job) {
      modal.showToast('请输入面试职位', 'none')
    } else if (!data, name) {
      modal.showToast('请输入姓名', 'none')
    } else if (!that.data.sex) {
      modal.showToast('请选择性别', 'none')
    } else if (!that.data.birth) {
      modal.showToast('请选择出生年份', 'none')
    } else if (!that.data.educationName) {
      modal.showToast('请选择最高学历', 'none')
    } else if (!that.data.experienceName) {
      modal.showToast('请设置工作经验', 'none')
    } else if (!data.address) {
      modal.showToast('请输入现居住地', 'none')
    } else if (!data.email) {
      modal.showToast('请输入邮箱', 'none')
    } else if (!data.tel) {
      modal.showToast('请输入手机号码', 'none')
    } else if (!that.data.photo) {
      modal.showToast('请上传简历照片', 'none')
    } else {
      console.log(1111)
    }
  }
})