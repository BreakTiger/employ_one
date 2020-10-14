const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    type: '', //媒体类型

    img: [], //图片

    vd: '', //视频

    edType: 0 // 0 保存 1 修改  根据获取的已上传内容来判断

  },

  onLoad: function (options) {
    this.getMedia()
  },

  // 获取媒体数据
  getMedia: function () {
    let that = this
    let data = {
      enterpriseInfoId: wx.getStorageSync('company').id
    }
    util.sendRequest('/zqhr/hall/enterpriseMultimedia/list', 'get', data).then(function (res) {
      if (res.code == 0) {
        // console.log(res.result.records[0])
        // let result = res.result.records[0]
        // that.setData({
        //   type:result.multimediaType
        // })

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
        let list = that.data.img

        let img = res.tempFilePaths

        // 限制图片的张数为五张
        let lists = list.concat(img)
        that.setData({
          img: lists.slice(0, 5)
        })

      },
      fail: function (res) {
        modal.showToast('图片选择失败', 'none')
      }
    })
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
          that.setData({
            vd: file.tempFilePath
          })
        } else {
          modal.showToast('你选择的视频过大', 'none')
        }
      },
      fail: function () {
        modal.showToast('选择视频失败', 'none')
      }
    })
  },

  // 删除 图片 /  视频  1 图片 2视频
  toDel: function (e) {
    let that = this
    let types = e.currentTarget.dataset.type
    if (types == 1) {
      let index = e.currentTarget.dataset.index
      let list = that.data.img
      list.splice(index, 1)
      that.setData({
        img: list
      })
    } else {
      that.setData({
        vd: ''
      })
    }
  },

  // 保存上传
  toSave: function () {
    let that = this

  },


})