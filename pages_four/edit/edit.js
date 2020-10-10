const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    detail: {}, //所有数据

    //行业
    list_one: [],
    trade: '',

    //性质
    list_two: [],
    property: '',

    //规模
    list_three: [],
    scale: '',

    // Logo
    logo: '',

    // 执照
    license: '',

    // 上传状态
    loadingType: false,

    // 输入框placeholder提示:
    tempenterpriseName: '请输入企业名称',
    tempmastername: '请输入负责人',
    tempidcard: '请输入负责人身份证',
    tempphone: '请输入电话',
    tempemail: '请输入邮箱',
    tempaddress: '请输入地址'

  },

  onLoad: function (options) {

    this.getBase()

    this.getList_one()

    this.getList_two()

    this.getList_three()

    this.getList_four()

  },

  // 企业信息
  getBase: function () {
    let that = this
    let data = {
      id: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/hall/enterprise/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let detail = res.result.records[0]
        console.log(detail)

        //存在基础数据时，绑定：
        if (detail) {

          // 绑定内容
          that.setData({
            detail: detail,
            trade: detail.trade, //企业行业
            property: detail.nature, //企业性质
            scale: detail.scale, //人员规模
            area: detail.area,//所在区域
          })

          // 判断logo和执照是否存在
          // 1.logo
          if (detail.logoAddress) { //logo存在
            console.log('存在：', detail.logoAddress)
            that.setData({
              logo: app.globalData.imaUrl + detail.logoAddress,
              logoAddress: detail.logoAddress
            })
          }

          // 2.执照
          if (detail.businessLicenseAddress) { //营业执照存在
            console.log('存在：', detail.businessLicenseAddress)
            that.setData({
              license: app.globalData.imaUrl + detail.businessLicenseAddress,
              licenseAddress: detail.businessLicenseAddress
            })
          }
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 基础数据列表:

  //行业
  getList_one: function () {
    let that = this
    let data = {
      type: 'industrytype',
      pageSize: 200
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          list_one: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //性质
  getList_two: function () {
    let that = this
    let data = {
      type: 'nature',
      pageSize: 200
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          list_two: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //规模
  getList_three: function () {
    let that = this
    let data = {
      type: 'scale',
      pageSize: 200
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          list_three: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  //规模
  getList_four: function () {
    let that = this
    let data = {
      type: 'area',
      pageSize: 200
    }
    util.sendRequest('/zqhr/base/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        that.setData({
          list_four: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 选择行业，性质，规模，以及所属区域
  getOne: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.list_one
    that.setData({
      trade: list[index].dataName
    })
  },

  getTwo: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.list_two
    that.setData({
      property: list[index].dataName
    })
  },

  getThree: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.list_three
    that.setData({
      scale: list[index].dataName
    })
  },

  getFour: function (e) {
    let that = this
    let index = e.detail.value
    let list = that.data.list_four
    that.setData({
      area: list[index].dataName
    })
  },

  // 输入框INPUT的placeholder提示的聚焦展示操作

  // 1.获取光标
  getInputValue(e) {
    var name = e.currentTarget.dataset.type
    this.setData({
      [name]: '',
    })
  },

  //2.失去光标
  blurInputValue(e) {
    var name = e.currentTarget.dataset.type
    if (name == 'tempenterpriseName') {
      this.setData({
        [name]: '请输入企业名称',
      })
    } else if (name == 'tempmastername') {
      this.setData({
        [name]: '请输入负责人',
      })
    } else if (name == 'tempidcard') {
      this.setData({
        [name]: '请输入负责人身份证',
      })
    } else if (name == 'tempphone') {
      this.setData({
        [name]: '请输入电话',
      })
    } else if (name == 'tempemail') {
      this.setData({
        [name]: '请输入邮箱',
      })
    } else if (name == 'tempaddress') {
      this.setData({
        [name]: '请输入地址',
      })
    }
  },

  // 选择本地图片上传

  // 1.logo
  getLogo: function () {
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let img = res.tempFilePaths[0]
        that.setData({
          logo: img
        })
      },
      fail: function (res) {
        modal.showToast('图片选择失败', 'none')
      }
    })
  },

  // 2.营业执照上传
  getLicense: function () {
    let that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let img = res.tempFilePaths[0]
        that.setData({
          license: img
        })
      },
      fail: function (res) {
        modal.showToast('图片选择失败', 'none')
      }
    })
  },

  // 保存

  // 1.判断，验证信息
  // PS:logo，执照，以及介绍不做限制，其他都要
  forSubmit: function (e) {
    let that = this
    let data = e.detail.value
    console.log(data)

    // 判断
    if (!data.name) {
      modal.showToast('请输入企业名称', 'none')
    } else if (!that.data.trade) {
      modal.showToast('请选择企业行业', 'none')
    } else if (!that.data.property) {
      modal.showToast('请选择企业性质', 'none')
    } else if (!that.data.scale) {
      modal.showToast('请设置企业规模', 'none')
    } else if (!data.mastername) {
      modal.showToast('请输入企业负责人', 'none')
    } else if (!data.tel) {
      modal.showToast('请输入电话号码', 'none')
    } else if (!(/^1[3456789]\d{9}$/.test(data.tel))) {
      modal.showToast('请输入合法的电话号码', 'none')
    } else if (!data.email) {
      modal.showToast('请输入邮箱', 'none')
    } else if (!data.address) {
      modal.showToast('请输入地址信息', 'none')
    } else if (!data.idcard) {
      modal.showToast('请输入负责人身份证', 'none')
    } else {

      // 判断
      if (!(that.data.logo == app.globalData.imaUrl + that.data.detail.logoAddress)) {
        console.log('不相等1')
        that.upImg(that.data.logo, data)
      } else if (!(that.data.license == app.globalData.imaUrl + that.data.detail.businessLicenseAddress)) {
        console.log('不相等2')
        that.upLicense(that.data.license, data)
      } else {
        that.upForms(data)
      }
    }
  },

  // logo上传
  upImg: async function (img, param) {
    let that = this
    let data = {
      systype: 'appEnterprise'
    }
    await util.upLoading(img, data).then(function (res) {
      let datas = JSON.parse(res)
      console.log(datas.result)
      if (datas.code == 200) {

        that.setData({
          logo: app.globalData.imaUrl + datas.result,
          logoAddress: datas.result
        })

        if (!(that.data.license == app.globalData.imaUrl + that.data.detail.businessLicenseAddress)) {
          that.upLicense(that.data.license, param)
        } else {
          that.upForms(param)
        }

      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 执照上传
  upLicense: async function (img, param) {
    let that = this
    let data = {
      systype: 'appEnterprise'
    }
    await util.upLoading(img, data).then(function (res) {
      let datas = JSON.parse(res)
      console.log(datas.result)
      if (datas.code == 200) {
        that.setData({
          license: app.globalData.imaUrl + datas.result,
          licenseAddress: datas.result
        })

        if (!(that.data.logo == app.globalData.imaUrl + that.data.detail.logoAddress)) {
          that.upImg(that.data.logo, param)
        } else {
          that.upForms(param)
        }

      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 2.上传信息
  upForms: async function (datas) {
    let that = this
    let param = {
      id: that.data.detail.id,
      enterpriseName: datas.name,
      trade: that.data.trade,
      nature: that.data.property,
      scale: that.data.scale,
      companyPrincipal: datas.mastername,
      phone: datas.tel,
      email: datas.email,
      address: datas.address,
      synopsis: datas.introduce,
      logoAddress: that.data.logoAddress,
      businessLicenseAddress: that.data.licenseAddress,
      area: that.data.area,
      examinestate: that.data.detail.examinestate,
      idcard: datas.idcard,
      updateBy: wx.getStorageSync('company').id
    }
    console.log('参数：', param)
    util.sendRequest('/zqhr/hall/enterprise/editById', 'post', param).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        modal.showToast(res.message)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }



})