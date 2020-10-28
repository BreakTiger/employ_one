const app = getApp()
const util = require('../../utils/util.js')
import modal from '../../modals.js'

Page({


  data: {
    html: '',
    formats: {},
  },

  onLoad: function (options) {
    let html = app.globalData.describe
    if (html) {
      this.setData({
        html: html
      })
    }
  },

  // 初始化
  onEditorReady: function () {
    let that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
      that.editorCtx.setContents({
        html: that.data.html
      })
    }).exec()
  },

  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },

  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },

  blur() {
    this.editorCtx.blur()
  },

  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    this.editorCtx.format(name, value)
  },

  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },

  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },

  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },

  removeFormat() {
    this.editorCtx.removeFormat()
  },

  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },

  // 插入图片
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },

  // 保存
  toSave: function () {
    let that = this
    that.editorCtx.getContents({
      success: function (res) {
        console.log(res.html)
        let html = res.html
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
          describe: html
        })
        wx.navigateBack({//返回
          delta: 1
        })
      }
    })
  },



})