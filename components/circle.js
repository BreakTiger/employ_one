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
        canvasWidth: '',
        canvasHeight: ''
    },

    ready: function() {

        let that = this

        let percent = (this.properties.percent * 100).toFixed(0)

        this.draw(percent, 1500)

    },

    methods: {

        /*
         * percent:百分比 
         * animTime:动画时间
         */
        draw: function(percent, animTime) {
            let that = this

            const ctx2 = wx.createCanvasContext('runCanvas', this)
            that.setData({
                ctx2: ctx2,
                percentage: percent,
                animTime: animTime
            });

            let time = that.data.animTime / that.data.percentage;

            const query = wx.createSelectorQuery().in(this)
            query.select('.bigCircle').boundingClientRect((rect) => {

                that.setData({
                    canvasWidth: rect.width,
                    canvasHeight: rect.height
                })

                // 计算圆心
                var w = parseInt(rect.width / 2); //获取canvas宽的的一半
                var h = parseInt(rect.height / 2); //获取canvas高的一半，

                that.canvasTap(0, that.data.percentage, time, w, h)

            }).exec()
        },

        /**
         * 动画效果：
         * start 起始百分比
         * end 结束百分比
         * w,h 圆心坐标
         */
        canvasTap(start, end, time, w, h) {
            let that = this
            start++;
            if (start > end) {
                return false;
            }
            that.run(start, w, h);
            setTimeout(function() {
                that.canvasTap(start, end, time, w, h);
            }, time);
        },

        /**
         * 绘制圆形进度条方法
         * c 其实百分比
         * w h 圆心坐标
         */
        run(c, w, h) {
            let that = this;
            let num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI;
            that.data.ctx2.arc(w, h, w - 8, -0.5 * Math.PI, num); //每个间隔绘制的弧度

            // 根据进度判断颜色
            if (c < 50) {
                that.data.ctx2.setStrokeStyle("#FF0000");
            } else if (c < 100) {
                that.data.ctx2.setStrokeStyle("#90ff90");
            } else if (c == 100) {
                that.data.ctx2.setStrokeStyle("#00FF00");
            }

            that.data.ctx2.setLineWidth("13");

            that.data.ctx2.setLineCap("butt");

            that.data.ctx2.stroke();

            that.data.ctx2.draw();

        },



    }
})