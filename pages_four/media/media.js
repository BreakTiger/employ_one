const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    //媒体类型
    type_one: 0, //图片
    type_two: 0, //视频

    img: [], //图片
    imgAddress: [],

    vd: {}, //视频
    vdAddress: {},

    edType: 0 //操作类型  0 保存 1 修改  根据获取的已上传内容来判断

  },

  onLoad: function (options) {

    this.getPower()

    this.getMedia()

  },

  // 上传权限
  getPower: function () {
    let that = this
    let data = {
      id: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/hall/enterprise/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let detail = res.result.records[0]
        if (detail.isuploadpictures == 1) {
          that.setData({
            type_one: 1
          })
        }

        if (detail.isuploadvideo == 1) {
          that.setData({
            type_two: 1
          })
        }

      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 获取媒体数据
  getMedia: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/hall/enterpriseMultimedia/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        let list = res.result.records
        if (list.length != 0) {
          let one = []
          let two = ''
          list.forEach(function (item) {
            if (item.multimediaType == 'img') {
              one.push({
                id: item.id,
                path: app.globalData.imaUrl + item.multimediaAddress
              })
            } else {
              two = {
                id: item.id,
                path: app.globalData.imaUrl + item.multimediaAddress
              }
            }
          })
          that.setData({
            img: one,
            vd: two
          })
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 选择图片
  choseImg: function () {
    let that = this
    wx.chooseImage({
      count: 5,
      success: function (res) {
        let img = res.tempFilePaths
        console.log(img)

        // 限制总图片张数为五张
        let list = that.data.img

        // // 判断
        // if (list.length == 0) {
        //   that.upImage(img)
        // } else {
        //   let num = 5 - list.length
        //   that.upImage(img.slice(0, num))
        // }

      },
      fail: function (res) {
        modal.showToast('图片选择失败', 'none')
      }
    })
  },

  // 上传图片
  upImage: async function (list) {
    let that = this
    console.log(list)
    // // let one = []
    // // let two = []
    // let data = {
    //   systype: 'appEnterprise'
    // }
    // for (let i = 0; i < list.length; i++) {
    //   let item = list[i]
    //   console.log(item)
    //   await util.upLoading(item, data).then(function (res) {
    //     let datas = JSON.parse(res)
    //     console.log(datas.result)
    //     if (datas.code == 200) {

    //       one.push(app.globalData.imaUrl + datas.result)

    //       two.push(datas.result)

    //       let data = {
    //         createBy: wx.getStorageSync('company').id,
    //         enterpriseInfoId: wx.getStorageSync('company').id,
    //         multimediaAddress: datas.result,
    //         multimediaType: "img"
    //       }
    //       that.save(data)
    //     } else {
    //       modal.showToast(res.message, 'none')
    //     }
    //   })

    // }

    // console.log(one)

    // console.log(two)

    // that.setData({
    //   img: one,
    //   imgAddress: two
    // })

  },


  // 选择视频
  choiceVideo: function () {
    let that = this
    wx.chooseMedia({
      count: 1,
      mediaType: 'video',
      success: function (res) {
        let maxSize = 20 * 1024 * 1024
        let file = res.tempFiles[0]
        // 判断文件大小
        if (file.size <= maxSize) {
          that.upVideo(file.tempFilePath)
        } else {
          modal.showToast('你选择的视频过大', 'none')
        }
      },
      fail: function () {
        modal.showToast('选择视频失败', 'none')
      }
    })
  },

  // 上传视频
  upVideo: async function (path) {
    let that = this
    let data = {
      systype: 'appEnterprise'
    }
    await util.upLoading(path, data).then(function (res) {
      let datas = JSON.parse(res)
      console.log(datas.result)
      if (datas.code == 200) {

        // that.setData({
        //   vd: app.globalData.imaUrl + datas.result,
        //   vdAddress: datas.result
        // })
        // let data = {
        //   enterpriseInfoId: wx.getStorageSync('company').id,
        //   multimediaAddress: datas.result,
        //   multimediaType: "video",
        //   createBy: wx.getStorageSync('company').id
        // }
        // that.save(data)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 保存
  save: async function (param) {
    let that = this
    console.log('参数:', param)
    await util.sendRequest('/zqhr/hall/enterpriseMultimedia/add', 'post', param).then(function (res) {
      if (res.code == 200) {
        modal.showToast(res.message)
        console.log(res)
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },

  // 删除 图片 /  视频  1 图片 2视频
  toDel: function (e) {
    let that = this
    let types = e.currentTarget.dataset.type
    let data = {
      id: e.currentTarget.dataset.id
    }
    util.sendRequest('/zqhr/hall/enterpriseMultimedia/delete', 'get', data).then(function (res) {
      console.log(res)
      if (res.code == 200) {
        modal.showToast(res.message)
        if (types == 1) {
          let index = e.currentTarget.dataset.index
          let list = that.data.img
          list.splice(index, 1)
          let lists = that.data.imgAddress
          lists.splice(index, 1)
          that.setData({
            img: list,
            imgAddress: lists
          })
        } else {
          that.setData({
            vd: {},
            vdAddress: {}
          })
        }
      } else {
        modal.showToast(res.message, 'none')
      }
    })
  },


})