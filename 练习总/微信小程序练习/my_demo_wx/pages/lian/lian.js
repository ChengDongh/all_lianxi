// pages/lian/lian.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctx:'',
    canvas:'',
    canalpha: 0,
    cirradius: 100,
    smciradius: 15,
    ani: false,
    speed: 30,
    ins: false,
    n: 0,
    num: 1,
    angel:[1,2],
    speed2: 200,
    over: false,
    INTERID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var ctx = wx.createCanvasContext('firstCanvas');
    that.setData({
      ctx
    })
    that.mapact()
  },
  mapact:function(){
    var ctx = this.data.ctx;
    var canalpha = this.data.canalpha;
    canalpha += Math.PI / this.data.speed2;
    this.setData({
      canalpha
    })
    if (!this.data.over) {
      ctx.clearRect(0, 0, 700, 700);
      ctx.save();
      this.drawmap();
      ctx.restore();
      this.overgame();
      
    } else {
      clearInterval(this.data.INTERID)
      console.log('lose');
      
    }
  },
  drawmap:function(){
    var ctx = this.data.ctx;
    ctx.setFillStyle('black');
    ctx.translate(250, 250);
    ctx.rotate(this.data.canalpha);
    ctx.translate(-250, -250);
    ctx.beginPath();
    ctx.arc(250, 250, this.data.cirradius, 0, Math.PI * 2, true);
    ctx.moveTo(250, 350);
    ctx.lineTo(250, 450);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.setFillStyle('red');
    ctx.beginPath();
    ctx.arc(250, 465, this.data.smciradius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    
    for (var j = 1; j <= this.data.angel.length; j++) {
      ctx.setFillStyle('black');
      ctx.beginPath();
      ctx.arc(250 + Math.sin(this.data.angel[j]) * 215, 600 - (350 - Math.cos(this.data.angel[j]) * 215), this.data.smciradius, 0, Math.PI * 2, true);
      ctx.moveTo(250 + Math.sin(this.data.angel[j]) * 200, 450 - (200 * (1 - Math.cos(this.data.angel[j]))));
      ctx.lineTo(250 + Math.sin(this.data.angel[j]) * 100, 450 - (200 - Math.cos(this.data.angel[j]) * 100));
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
    if (!this.data.ins) {
      this.drawNail(this.data.num);
    } else {
      this.nailact(this.data.num);
    }
  },
  overgame:function(){
    for (var j = 0; j < this.data.angel.length; j++) {
      if ((Math.abs(Math.sin((this.data.angel[this.data.num - 1] - this.data.angel[j]) / 2)) < 3 / 43) && (j != this.data.num - 1)) {
        this.setData({
          over:true
        })
      }
    }
  },
  drawNail:function(){
    var ctx = this.data.ctx
    ctx.setFillStyle('red');
    ctx.beginPath();
    ctx.arc(250 + Math.sin(this.data.canalpha) * 350, 600 - (1 - Math.cos(this.data.canalpha)) * 350, this.data.smciradius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.draw();
  },
  run:function(){
    var INTERID = setInterval(this.mapact, 30);
    this.setData({
      ani:true,
      INTERID
    })
  },
  insert:function(){
    if (this.data.ani) {
      this.setData({
        ins:true
      })
    } else {
      return;
    }
  },
  nailact:function(i){
    var ctx = this.data.ctx
    var n = this.data.n
    var angel = this.data.angel;
    var num = this.data.num
    ctx.setFillStyle('red');
    if ((350 - (this.data.n + 1) * this.data.speed) >= 215) {
      ctx.beginPath();
      ctx.arc(250 + Math.sin(this.data.canalpha) * (350 - this.data.n * this.data.speed), 600 - (350 - Math.cos(this.data.canalpha) * (350 - this.data.n * this.data.speed)), this.data.smciradius, 0, Math.PI * 2, true)
      ctx.closePath();
      ctx.fill();
      n++;
      this.setData({
        n
      })
    } else {
      num++;
      n = 0;
      angel[i] = this.data.canalpha
      this.setData({
        angel,
        num,
        n,
        ins:false
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // runs: function() {
  //   var ctx = this.data.ctx;
  //   ctx.setFillStyle('black');
  //   ctx.translate(200, 200);
  //   ctx.rotate(this.data.canalpha);
  //   ctx.translate(-200, -200);
  //   ctx.beginPath();
  //   ctx.arc(200, 200, 60, 0, Math.PI * 2, true);
  //   ctx.moveTo(200, 200);
  //   ctx.lineTo(200, 320);
  //   ctx.closePath();
  //   ctx.fill();
  //   ctx.stroke();
  //   ctx.setFillStyle('green');
  //   ctx.beginPath();
  //   ctx.arc(200, 320, 10, 0, Math.PI * 2, true);
  //   ctx.closePath();
  //   ctx.fill();
  //   // ctx.draw();
  //   var canalpha = this.data.canalpha + Math.PI / 200;
  //   this.setData({
  //     canalpha
  //   });
  //   for (var j = 0; j <= this.data.angel.length; j++) {
  //     ctx.fillStyle = "red";
  //     ctx.beginPath();
  //     ctx.arc(200 + Math.sin(this.data.angel[j]) * 140, 400 - (200 - Math.cos(this.data.angel[j]) * 130), 10, 0, Math.PI * 2, true);
  //     ctx.moveTo(200, 200);
  //     ctx.lineTo(200 + Math.sin(this.data.angel[j]) * 140, 400 - (200 - Math.cos(this.data.angel[j]) * 130));
  //     ctx.fill();
  //     ctx.stroke();
  //     ctx.closePath();

  //   }
  //   if (!this.data.ins) {
  //     this.drawNail(this.data.num);
  //   } else {
  //     this.nailact(this.data.num);
  //   }
  // },
  // drawNail: function(i) {
  //   // var ctx = this.data.ctx;
  //   this.data.ctx.fillStyle = "green";
  //   this.data.ctx.beginPath();
  //   this.data.ctx.arc(200 + Math.sin(this.data.canalpha) * 200, 400 - (1 - Math.cos(this.data.canalpha)) * 200, 10, 0, Math.PI * 2, true);
  //   this.data.ctx.closePath();
  //   this.data.ctx.fill();
  //   this.data.ctx.draw();
  //   // ctx.fillText(i, 247 + Math.sin(this.data.canalpha) * 350, 605 - (1 - Math.cos(this.data.canalpha)) * 350);
  // },

  // run: function() {
  //   var that = this;
  //   setInterval(function() {
  //     that.runs()
  //   }, 30)
  // },
  // insert: function() {
  //   var n = this.data.n
  //   console.log(n)
  //   this.data.ctx.fillStyle = "green";
  //   console.log(200 - (n + 1) * 30)
  //   if ((320 - (this.data.n + 1) * 30) >= 215) {
  //     this.data.ctx.beginPath();
  //     this.data.ctx.arc(250 + Math.sin(this.data.canalpha) * (350 - this.data.n * 30), 600 - (350 - Math.cos(this.data.canalpha) * (350 - this.data.n * 30)), 10, 0, Math.PI * 2, true)
  //     this.data.ctx.closePath();
  //     this.data.ctx.fill();
  //     n++;
  //     this.setData({
  //       n
  //     })
  //   } else {
  //     console.log(1)
  //     angel[i] = canalpha;
  //     num++;
  //     n = 0;
  //     ins = false;
  //   }
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})