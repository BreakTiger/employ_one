// list.js
var app = getApp();
Page({
  data: {
    city: wx.getStorageSync('companyinfo').city,
    isCars: true, // 选择车源开关
    isSort: true, // 选择排序开关
    isPrice: true, // 选择价格开关
    isType: true,
    loadMore: '',
    list: [{
      id: "165",
      companyid: "65",
      companyname: "广东智应网络科技有限公司",
      thumb: "https://api.site100.cn/attachment/images/31/2018/06/fJMlMulw7jM5sBi83mLq8bhu0bJ37z.gif",
      jobnum: 10
    }, {
      id: "170",
      companyid: "640",
      companyname: "广西骏领信息咨询服务有限公司",
      thumb: "https://api.site100.cn/attachment/images/31/2019/09/cKQzQgejqrHzLgnrG6HAhNQFgQgr66.jpg",
      jobnum: 0,
      joblist_four: []
    }, {
      id: "192",
      companyid: "934",
      companyname: "柯淳网络服务中心",
      thumb: "https://api.site100.cn/attachment/images/31/2020/02/YJf7Jpk7KhDPJOc2meKP22Rgk27Ks7.jpg",
      jobnum: 0,
      joblist_four: []
    }, {
      id: "195",
      companyid: "1002",
      companyname: "重庆乐湛科技有限公司",
      thumb: "https://api.site100.cn/attachment/images/31/2020/03/oqzX0Xk2I2jTj462z4wwb4TX2i86bW.jpg",
      jobnum: 0,
      joblist_four: []
    }],
    house_list: [],
    housetypelist: [],
    houseareaid: 0,
    housepriceid: 0,
    housetype: 0,
    total: {
      companycount: 4,
      jobcount: 10,
      jobrecordcount: 46
    },
    activeinfo: {
      id: "29",
      uniacid: "31",
      title: "6月15日城南大型招聘会，与你相约！",
      createtime: "1528636289",
      content: "&lt;p&gt;6月15日城南大型招聘会，与你相约！&lt;/p&gt;",
      sort: "0",
      pid: "0",
      hits: "0",
      status: "0",
      thumb: "images/31/2018/06/V2o1411zUeYITz4o12BpDzIFzhb2eb.png",
      money: "0.00",
      begintime: "2019-03-02",
      endtime: "2021-11-17",
      mainwork: "招聘猫平台",
      fuwork: "人力资源中心"
    },
    page: 1
  },
  // 首屏渲染
  onLoad(params) {
    var that = this;
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
    // var data = { 'name': '住宅', 'id': 1 };
    wx.setNavigationBarTitle({
      title: '企业招聘',
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3274e5',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    console.log('1111')
    return;
    var housetypelist = [{
      'name': '按最新发布时间',
      'id': 1
    }];

    //  housetypelist.push(data);
    // var id = params.id;
    var id = 29;
    var typeid = 0;
    var carid = 0;
    var priceid = 0;
    this.setData({
      housetypelist: housetypelist,
      typeid: typeid,
      carid: carid,
      priceid: priceid
    });

    app.util.request({
      'url': 'entry/wxapp/getinitinfo',
      success: function (res) {
        if (!res.data.message.errno) {
          var activetitle = res.data.data.activetitle;


          that.setData({
            activetitle: activetitle,
            city: wx.getStorageSync('companyinfo').city,
            arealist: res.data.data.arealist,
            housepricelist: res.data.data.housepricelist,
            title: '',
            price: '',
            typetitle: ''
          })
        }
      }
    });

    app.util.request({
      'url': 'entry/wxapp/getactivedetail',
      data: {
        id: id
      },
      success: function (res) {
        if (!res.data.message.errno) {
          that.setData({
            list: res.data.data.list,
            total: res.data.data.total,
            activeinfo: res.data.data.activeinfo
          })
        }
      },
      complete: function () {

        wx.hideNavigationBarLoading(); //完成停止加载
        wx.stopPullDownRefresh();
      }
    });

  },
  gethouselist: function (e) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/getjoblist',
      data: {
        page: that.data.page,
        houseareaid: that.data.houseareaid,
        housepriceid: that.data.housepriceid,
        housetype: that.data.housetype
      },
      success: function (res) {
        if (!res.data.message.errno) {
          that.setData({
            joblist: res.data.data.joblist,
            jobcatelist: res.data.data.jobcatelist

          })
        }
      },
      complete: function () {
        that.setData({
          loadMore: ''
        })

      }
    });
  },

  doSendjob: function (e) {
    var that = this;
    var jobid = e.currentTarget.dataset.id;
    var userinfo = wx.getStorageSync('userInfo');
    console.log(userinfo);
    var companyid = e.currentTarget.dataset.companyid;
    console.log(companyid);
    console.log(jobid);
    app.util.request({
      'url': 'entry/wxapp/sendjob',
      data: {
        jobid: jobid,
        companyid: companyid,
        sessionid: userinfo.sessionid,
        uid: userinfo.memberInfo.uid
      },
      success: function (res) {

        if (!res.data.message.errno) {
          if (res.data.data.error == 0) {
            wx.showToast({
              title: '投递成功!',
              icon: 'success',
              duration: 2000
            })

          } else if (res.data.data.error == 2) {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return
          } else if (res.data.data.error == 3) {

            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false,
              success: function (res) {
                wx.navigateTo({
                  url: "/weixinmao_zp/pages/mynote/index"
                })
              }
            })
            return
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false
            })
            return
          }
          that.setData({
            data: res.data.data.jobdetail,
          })
        }
      }
    });


  },
  toNewHouseDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/weixinmao_zp/pages/jobdetail/index?id=" + id
    })

  },
  toSearch: function (e) {
    wx.navigateTo({
      url: "/weixinmao_zp/pages/search/index"
    })

  },
  selectcarsitem: function (e) {
    var carid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;

    this.setData({
      carid: carid,
      isCars: true,
      title: title
    });
    this.data.houseareaid = carid;
    this.gethouselist();

  },
  selectpriceitem: function (e) {
    var priceid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    this.setData({
      priceid: priceid,
      isPrice: true,
      price: title
    });
    this.data.housepriceid = priceid;
    this.gethouselist();
  },
  selecttypeitem: function (e) {
    var typeid = e.currentTarget.id;
    var title = e.currentTarget.dataset.title;
    this.setData({
      typeid: typeid,
      isType: true,
      typetitle: title
    });
    this.data.housetype = typeid;
    this.gethouselist();
  },
  // 下拉加载
  onReachBottom(params) {
    var that = this;
    that.setData({
      loadMore: '正在加载中...'
    })
    this.data.page = this.data.page + 1;
    this.gethouselist();
  },
  // 点击搜索
  clickSearch: function (e) {
    wx.switchTab({
      url: '/pages/search/search'
    })
  },
  // 点击列表
  clickList: function () {
    wx.navigateTo({
      url: '../cars/cars'
    })
  },
  // 选择排序方式
  selectCars: function (e) {
    var that = this;
    that.setData({
      isSort: true,
      isPrice: true,
      isType: true,
      isCars: (!that.data.isCars)
    })
  },
  selectPrice: function () {
    var that = this;
    that.setData({
      isSort: true,
      isCars: true,
      isType: true,
      isPrice: (!that.data.isPrice)
    })
  },
  selectType: function () {
    var that = this;
    that.setData({
      isSort: true,
      isCars: true,
      isPrice: true,
      isType: (!that.data.isType)
    })
  },
  selectSort: function () {
    var that = this;
    that.setData({
      isCars: true,
      isPrice: true,
      isType: true,
      isSort: (!that.data.isSort)
    })
  },
  selectBrand: function () {
    wx.navigateTo({
      url: '../brand/brand'
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad();
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: '找工作-' + wx.getStorageSync('companyinfo').name,
      path: '/weixinmao_zp/pages/findjob/index'
    }
  }
})