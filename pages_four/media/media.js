const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({

  data: {

    img: [],

    vd: '',

  },

  onLoad: function (options) {

  },

  // 选择图片
  choseImg: function () {
    let that = this
    let list = that.data.img
    console.log(list)
    let l_length = list.length
    console.log(l_length)
    wx.chooseImage({
      count: 5,
      success: function (res) {
        let img = res.tempFilePaths
        console.log(img)
        // 判断

        that.setData({
          img: list.concat(img)
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
        console.log('文件最大：', maxSize)
        let file = res.tempFiles[0]
        console.log(file)
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


})