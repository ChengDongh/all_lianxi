//index.js
//获取应用实例
const app = getApp()
const ctx = wx.createCanvasContext('myCanvas');
const ctx1 = wx.createCanvasContext('myCanvas1')
var arcs = [];
var arc_d = {}
Page({
  data: {
    width: '',
    height: '',
    img: '',
    type: 1,
    shareImg: [],
    isd: false
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function(res) {
        that.setData({
          width: res.screenWidth,
          height: res.windowHeight
        })
      }
    })
  },
  touchS: function(e) {
    var arc = {};
    arc.x = e.touches[0].x;
    arc.y = e.touches[0].y;

    if (arcs.length <= 3) {
      arcs.push(arc)
      for (var index in arcs) {
        if (index <= 3) {
          ctx.save()
          ctx.arc(arcs[index].x, arcs[index].y, 0.1, 0, 2 * Math.PI);
        }
      }
    }
    if (arcs.length == 4) {
      ctx.closePath();
    }
    // ctx.clip()
    ctx.stroke()
    ctx.draw(true, function() {})
  },

  touchM: function(e) {
    var arb = {};
    arb.x = e.touches[0].x;
    arb.y = e.touches[0].y;
    for (let i in arcs) {
      if ((arb.x - arcs[i].x >= -20 && arb.x - arcs[i].x <= 20) && (arb.y - arcs[i].y >= -20 && arb.y - arcs[i].y <= 20)) {
        if (this.data.type == 1) {
          ctx.clearRect(0, 0, 320, 200);
          arcs[i].x = e.touches[0].x;
          arcs[i].y = e.touches[0].y;
          for (var index in arcs) {
            if (index <= 3) {
              ctx.arc(arcs[index].x, arcs[index].y, 0.1, 0, 2 * Math.PI);
            }
          }
          ctx.closePath();
          ctx.drawImage(this.data.img, 0, 0, 320, 200);
          ctx.stroke()
          ctx.draw(false, function() {})
        }
      }
    }
  },
  photo: function() {
    var that = this;
    wx.chooseImage({
      success: function(res) {
        ctx.drawImage(res.tempFilePaths[0], 0, 0, 320, 200);
        ctx.draw();
        that.setData({
          img: res.tempFilePaths[0]
        })
      }
    })
  },
  cat_photo: function() {
    var that = this;
    that.setData({
      type: 2
    })
    // ctx.save();
    ctx.rect(0, 0, 320, 200)
    ctx.clip();
    ctx.fill()
    ctx.clearRect(0, 0, 320, 200);
    ctx.restore();

    ctx.draw(true, function() {
      setTimeout(() => {
        // 将生成的canvas图片，转为真实图片
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          canvasId: 'myCanvas',
          success: function(res) {
            var shareImg = that.data.shareImg
            shareImg.push(res.tempFilePath)
            that.setData({
              shareImg: shareImg,
            })
            ctx.drawImage(that.data.img, 0, 0, 320, 200);
            ctx.draw(false, function() {
              // arcs=[];
            });
            that.cat();
          },
          fail: function(res) {}
        })
      }, 500)
    });
  },
  cat: function() {
    for (let i in this.data.shareImg) {
      ctx1.drawImage(this.data.shareImg[i]);
      ctx1.draw(true, function() {

      });
    }
  },
  touchS1: function(e) {
    var x = e.touches[0].x;
    var y = e.touches[0].y;
    arc_d.x = x;
    arc_d.y = y;
    var a = (arcs[1].x - arcs[0].x) * (y - arcs[0].y) - (arcs[1].y - arcs[0].y) * (x - arcs[0].x);
    var b = (arcs[2].x - arcs[1].x) * (y - arcs[1].y) - (arcs[2].y - arcs[1].y) * (x - arcs[1].x);
    var c = (arcs[3].x - arcs[2].x) * (y - arcs[2].y) - (arcs[3].y - arcs[2].y) * (x - arcs[2].x);
    var d = (arcs[0].x - arcs[3].x) * (y - arcs[3].y) - (arcs[0].y - arcs[3].y) * (x - arcs[3].x);
    if ((a > 0 && b > 0 && c > 0 && d > 0) || (a < 0 && b < 0 && c < 0 && d < 0)) {
      console.log(111)
      this.setData({
        isd: true
      })
    }else{
      this.setData({
        isd: false
      })
    }
  },
  touchM1: function(e) {
    console.log(e)
    var that = this;
    console.log(that.data.isd)
    if (that.data.isd == true) {
      var a1 = 1;
      var a2 = 1;
      var bbb = [{}, {}, {}, {}]
      var x = e.touches[0].x;
      var y = e.touches[0].y;
      var arc_x = x - arc_d.x;
      var arc_y = y - arc_d.y;
      arc_d.x = e.touches[0].x;
      arc_d.y = e.touches[0].y;
      arcs[0].x = (arcs[0].x + arc_x);
      arcs[0].y = arcs[0].y + arc_y;
      arcs[1].x = arcs[1].x + arc_x;
      arcs[1].y = arcs[1].y + arc_y;
      arcs[2].x = arcs[2].x + arc_x;
      arcs[2].y = arcs[2].y + arc_y;
      arcs[3].x = arcs[3].x + arc_x;
      arcs[3].y = arcs[3].y + arc_y;
      bbb[0].x = arcs[0].x;
      bbb[0].y = arcs[0].y;
      bbb[1].x = arcs[1].x;
      bbb[1].y = arcs[1].y;
      bbb[2].x = arcs[2].x;
      bbb[2].y = arcs[2].y;
      bbb[3].x = arcs[3].x;
      bbb[3].y = arcs[3].y;
      // ctx1.clearRect();
      for (var index in bbb) {
        if (index <= 3) {
          ctx1.save()
        ctx1.arc(bbb[index].x, bbb[index].y, 0.1, 0, 2 * Math.PI);
        }
      }
      ctx1.closePath();
      ctx1.clip();
      ctx1.restore();
      // ctx1.drawImage(that.data.shareImg[0])
      ctx1.stroke()
     
      ctx1.draw(false,function(){
        
      });
    }
  }
})