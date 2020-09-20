const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    detail: {},

    //行业
    list_one: [],
    trade: '',

    //性质
    list_two: [],
    property: '',

    //规模
    list_three: [],
    scale: '',

    logo: ''
  },


  onLoad: function (options) {
    this.getBase()

    this.getList_one()

    this.getList_two()

    this.getList_three()
  },

  // 企业信息
  getBase: function () {
    let that = this
    let data = {
      id: wx.getStorageSync('company').id
    }
    util.sendRequest('/jeecg-boot/hall/enterprise/list', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        let detail = res.result.records[0]
        that.setData({
          detail: detail,
          trade: detail.trade,
          property: detail.nature,
          scale: detail.scale
        })
        if (detail.logoAddress) { //logo存在
          console.log('存在：', detail.logoAddress)
          that.setData({
            logo: detail.logoAddress
          })
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
      type: 'industry'
    }
    util.sendRequest('/jeecg-boot/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
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
      type: 'nature'
    }
    util.sendRequest('/jeecg-boot/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
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
      type: 'scale'
    }
    util.sendRequest('/jeecg-boot/base/list', 'get', data).then(function (res) {
      // console.log(res.result.records)
      if (res.code == 0) {
        that.setData({
          list_three: res.result.records
        })
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 选择
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

  // logo上传
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

  // 提交验证  图片 和 介绍 不做限制
  forSubmit: function (e) {
    let that = this
    let data = e.detail.value
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
    } else if (!(/^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/.test(data.email))) {
      modal.showToast('请输入合法的邮箱', 'none')
    } else if (!data.address) {
      modal.showToast('请输入地址信息', 'none')
    } else {

      if (that.data.logo) { //存在
        // 二次判断
        console.log(that.data.logo.indexOf(app.globalData.imaUrl) != -1)
        if (that.data.logo.indexOf(app.globalData.imaUrl) != -1) {
          that.upForms(data)
        } else {
          that.upImg(that.data.logo, data)
        }

      } else {
        that.upForms(data)
      }
    }
  },

  // 上传图片
  upImg: async function (img, param) {
    let that = this
    let data = {
      systype: 'appEnterprise'
    }
    await util.upLoading(img, data).then(function (res) {
      let datas = JSON.parse(res)
      console.log(datas)
      if (datas.code == 200) {
        that.setData({
          logo: app.globalData.imaUrl + datas.result
        })
        that.upForms(param)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 提交修改
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
      logoAddress: that.data.logo,
      updateBy: wx.getStorageSync('company').id
    }
    console.log('参数：', param)
    util.sendRequest('/jeecg-boot/hall/enterprise/editById', 'post', param).then(function (res) {
      console.log(res)
      if (res.code == 0) {
        modal.showToast(res.message)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  }
})