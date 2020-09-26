const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {

    //职位列表
    joblist: [],
    jobName: '',

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
    this.jobList()
    this.educationList()
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

  //学历-列表
  educationList: function () {
    let that = this
    let data = {
      type: 'education'
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          education: res.result.records
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
      jobName: list[index].postName
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
    } else if (!that.data.educationName) {
      modal.showToast('请选择最高学历', 'none')
    } else if (!that.data.experienceName) {
      modal.showToast('请设置工作经验', 'none')
    } else if (!data.address) {
      modal.showToast('请输入现居住地', 'none')
    } else if (!data.email) {
      modal.showToast('请输入邮箱', 'none')
    } else if (!(/^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/.test(data.email))) {
      modal.showToast('请输入合法的邮箱', 'none')
    } else if (!data.tel) {
      modal.showToast('请输入手机号码', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(data.tel))) {
      modal.showToast('请输入合法的电话号码', 'none')
    } else if (!data.idcard) {
      modal.showToast('请输入身份证号码', 'none')
    } else if (!(/(^\d{15}$)|(^\d{17}(\d|X)$)/.test(data.idcard))) {
      modal.showToast('请输入合法的身份号码', 'none')
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
        that.setData({
          photo: app.globalData.imaUrl + detail.result
        })
        that.save(data)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 保存
  save: function (data) {
    let that = this
    let param = {
      postName: that.data.jobName,
      name: data.name,
      gender: that.data.sex,
      birthday: that.data.birth,
      education: that.data.educationName,
      workExperience: that.data.experienceName,
      habitation: data.address,
      email: data.email,
      phone: data.tel,
      photographResumeAddress: that.data.photo,
      createBy: wx.getStorageSync('company').id,
      idcard: data.idcard
    }
    console.log(param)
    util.sendRequest('/zqhr/hall/curriculumvitae/add', 'post', param).then(function (res) {
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