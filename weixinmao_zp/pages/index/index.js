const app = getApp();

Page({

  data: {

    imgheights: [], //轮播图高度列表

    banners: [], //轮播图列表

    swiperCurrent: '',

    notelist: [
      {
        name: '张学航',
        sex: '1',
        jobtitle: '产品经理',
        age: '24',
        education: '大专',
        express:'一年以下',
        createtime:'一小时前'
      },
      {
        name: '李勇存',
        sex: '1',
        jobtitle: '项目经理',
        age: '35',
        education: '本科',
        express:'10年',
        createtime:'一小时前'
      },
      {
        name: '张雪',
        sex: '1',
        jobtitle: '前端工程师',
        age: '22',
        education: '本科',
        express:'一年以下',
        createtime:'一小时前'
      }

    ], //优秀人才列表

    indeximg: true,

    isuser: true,

  },

  // 计算 - 轮播图 - 图片高度
  imageLoad: function (e) {
    var imgwidth = e.detail.width
    var imgheight = e.detail.height
    //宽高比  
    var ratio = imgwidth / imgheight;

    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里  
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights
    })

  },

  // 轮播指示点更新
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },


  onLoad: function (options) {
    var that = this;

    if (options) {
      if (options.hasOwnProperty("scene")) {
        var scene = decodeURIComponent(options.scene);
        var uid_array = scene.split('=');
        var uid = parseInt(uid_array[1]);
        wx.setStorageSync('tid', uid);
      }
    }

    var userid = 0;

    var appuser = wx.getStorageSync('userInfo');
    console.log(appuser);

    if (appuser) {
      if (appuser.hasOwnProperty("wxInfo")) {
        that.data.isuser = true;
        userid = appuser.memberInfo.uid;
        that.setData({
          isuser: that.data.isuser
        });
      }
    }


    app.util.request({
      'url': 'entry/wxapp/Sysinit',
      data: { userid: userid },
      success: function (res) {

        if (res.statusCode == 200) {

          that.setData({

            searchtitle: res.data.data.searchtitle,

            companycount: res.data.data.companycount, //入驻企业数

            jobcount: res.data.data.jobcount, //职位数

            notecount: res.data.data.notecount, //简历数

          })

          if (res.data.data.intro.ischeck == 0) {
            that.setData({
              ischeck: 0,
              indeximg: res.data.data.indeximg
            });
            if (res.data.data.intro.isright == 1) {
              var userinfo = wx.getStorageSync('userInfo');
              if (userinfo) {
                if (userinfo.hasOwnProperty("wxInfo")) {
                  that.setData({
                    isuser: true
                  })
                }
              } else {
                that.setData({
                  isuser: false
                })
              }
            } else {
              that.setData({
                isuser: true
              })
            }
          } else {
            that.setData({
              ischeck: 1,
              intro: res.data.data.intro,
              isuser: true
            });
          }

          if (res.data.data.intro.isgps == 0) {
            var cityinfo = wx.getStorageSync('cityinfo');
            if (cityinfo) {
              wx.setStorageSync('city', cityinfo.name);
              that.initpage();
            } else {
            }
          } else {
            that.initpage();
          }

        }

      }
    })
  },

  initpage: function () {
    var that = this;

    var city = wx.getStorageSync('city');

    app.util.request({

      'url': 'entry/wxapp/GetIndexList',
      data: { city: city },
      success: function (res) {

        if (!res.data.message.errno) {

          wx.setStorageSync('companyinfo', res.data.data.intro);
          wx.setStorageSync('companyinfo', res.data.data.intro);

          // console.log(res.data.data);

          wx.setStorageSync('cityinfo', res.data.data.cityinfo);

          that.setData({
            banners: res.data.data.bannerlist,
            // notelist: res.data.data.notelist
          })

        }
      },
      complete: function () {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }

    });

  },


  // 跳转：

  // 搜索
  toSearch: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages/searchnote/index',
    })
  },

  // 招聘会
  toMeeting: function () {
    wx.switchTab({
      url: '/weixinmao_zp/pages/findjob/index',
    })
  },

  // 企业登录
  companyLogin: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages/message/index',
    })
  },

  // 扫码签到
  scanSign: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success: function (res) {
        console.log(res)
        wx.navigateTo({
          url: '/weixinmao_zp/pages_one/sign/sign',
        })
      }

    })
  },

  // 我的收藏
  myCollect: function () {
    wx.navigateTo({
      url: '/weixinmao_zp/pages/mysave/index',
    })
  },

  // 扫码领取
  scanGet: function () {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success: function (res) {
        console.log(res)
        wx.navigateTo({
          url: '/weixinmao_zp/pages_one/gain/gain',
        })
      }

    })
  },


  // 发布职位
  toAddCompanyjob: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/addCompanyjob/index"
    })
  },

  // 更多
  toMore: function () {
    wx.switchTab({
      url: '/weixinmao_zp/pages/findworker/index',
    })
  },

  // 简历详情
  toWorkerdetial: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/workerdetail/index?id=" + id
    })
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
  },


  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/index/index'
    }
  }
})