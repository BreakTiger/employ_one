Component({

  properties: {

    names: {
      type: String,
      value: ''
    },

    percent: {
      type: Number,
      value: ''
    }

  },

  data: {
    percentage: 0, //百分比
    animTime: '', // 动画执行时间
  },

  ready: function () {

    // this.draw('runCanvas',40,1000);

    let that = this

    this.draw(this.properties.percent, 1000)

  },

  methods: {

    /*
     * percent:百分比 
     * animTime:动画时间
     */
    draw: function (percent, animTime) {

      // const query = wx.createSelectorQuery()
      // query.select('#runCanvas')
      //   .fields({ node: true, size: true })
      //   .exec((res) => {
      //     console.log(res)

      //     // const canvas = res[0].node
      //     // const ctx = canvas.getContext('2d')

      //     // const dpr = wx.getSystemInfoSync().pixelRatio
      //     // canvas.width = res[0].width * dpr
      //     // canvas.height = res[0].height * dpr
      //     // ctx.scale(dpr, dpr)

      //     // ctx.fillRect(0, 0, 100, 100)
      //   })

      // let that = this
      // const ctx2 = wx.createCanvasContext('Canvas');
      // that.setData({
      //   ctx2: ctx2,
      //   percentage: percent * 100,
      //   animTime: animTime
      // });

      // let time = that.data.animTime / that.data.percentage;

      // that.canvasTap(0, that.data.percentage, time, 99, 99)
    },

    /**
     * 动画效果
     * start 起始百分比
     * end 结束百分比
     * w,h 其实就是圆心横纵坐标
     */
    canvasTap(start, end, time, w, h) {
      var that = this;
      start++;
      if (start > end) {
        return false;
      }
      that.run(start, w, h);
      setTimeout(function () {
        that.canvasTap(start, end, time, w, h);
      }, time);
    },

    // 绘制圆形进度条方法
    run(c, w, h) {
      let that = this;
      var num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI;
      that.data.ctx2.arc(w, h, w - 8, -0.5 * Math.PI, num); //每个间隔绘制的弧度
      that.data.ctx2.setStrokeStyle("#ff5000");
      that.data.ctx2.setLineWidth("16");
      that.data.ctx2.setLineCap("butt");
      that.data.ctx2.stroke();
      that.data.ctx2.draw();
    },



  }
})
