const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

let date = new Date()

Page({


  data: {

    //职位列表
    joblist: [],
    jobName: '',
    e_id: '',

    //性别
    sex: null,

    //出生
    birth: '',

    // 照片
    photo: ''
  },


  onLoad: function (options) {
    this.jobList()
  },

  // 职位 - 列表
  jobList: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id,
      pageNo: 1,
      pageSize: 100
    }
    util.sendRequest('/zqhr/hall/position/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          joblist: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


  //职位 - 选择
  getJob: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.joblist
    that.setData({
      jobName: list[index].postName,
      e_id: list[index].id
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

  // 拍照上传
  toImg: function () {
    let that = this
    wx.chooseImage({
      sourceType: ['camera'],
      success(res) {
        that.setData({
          photo: res.tempFilePaths[0]
        })
      }
    })
  },

  // 提交
  formSubmit: function (e) {
    let that = this
    let data = e.detail.value
    if (!that.data.jobName) {
      modal.showToast('请输入面试职位', 'none')
    } else if (!data.name) {
      modal.showToast('请输入姓名', 'none')
    } else if (!that.data.sex) {
      modal.showToast('请选择性别', 'none')
    } else if (!that.data.birth) {
      modal.showToast('请选择出生年份', 'none')
    } else if (!data.email) {
      modal.showToast('请输入邮箱', 'none')
    } else if (!data.tel) {
      modal.showToast('请输入手机号码', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(data.tel))) {
      modal.showToast('请输入合法的电话号码', 'none')
    } else if (!that.data.photo) {
      modal.showToast('请上传简历照片', 'none')
    } else {
      that.upImg(that.data.photo, data)
    }
  },

  // 上传
  upImg: async function (path, data) {
    let that = this
    let param = {
      systype: 'appEnterprise'
    }
    await util.upLoading(path, param).then(function (res) {
      let detail = JSON.parse(res)
      if (detail.code == 200) {
        that.save(data, detail.result)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 保存
  save: function (data, photo) {
    let that = this
    let param = {
      postName: that.data.jobName,
      name: data.name,
      gender: that.data.sex,
      birthday: that.data.birth,
      email: data.email,
      phone: data.tel,
      photographResumeAddress: photo,
      createBy: wx.getStorageSync('company').id,
    }
    console.log(param)
    util.sendRequest('/zqhr/hall/curriculumvitae/add', 'post', param).then(function (res) {
      console.log(res.result)
      if (res.code == 200) {

        that.toFinish(res.result)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  toFinish: function (e) {
    let that = this
    let data = {
      createBy: wx.getStorageSync('company').id,
      curriculumVitaeId: e,
      enterpriseInfoId: wx.getStorageSync('company').id,
      enterprisePostReleaseId: that.data.e_id,
      interviewstate: 'invite',
      submitResumeTime: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    }
    util.sendRequest('/zqhr/app/interview/invite', 'post', data).then(function (res) {
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