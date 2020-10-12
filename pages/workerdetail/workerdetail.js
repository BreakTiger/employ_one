// const app = getApp()
// const util = require('../../utils/util.js')
// import modal from '../../modals.js'

// const WxParse = require('../../wxParse/wxParse.js')


// Page({

//   data: {
//     detail: {},
//     header:''
//   },

//   onLoad: function (options) {
//     let that = this;
//     console.log(app.globalData.worker)
//     that.setData({
//       detail: app.globalData.worker
//     })

//     if(app.globalData.worker.headimgAddress){
//       that.setData({
//         header:app.globalData.imaUrl + app.globalData.worker.headimgAddress
//       })
//     }

//     // let article = app.globalData.worker.jobDescription
//     // WxParse.wxParse('article', 'html', article, that, 5)

//   },


//   onPullDownRefresh: function () {

//   },

//   onReachBottom: function () {

//   },

//   onShareAppMessage: function () {

//   }
// })