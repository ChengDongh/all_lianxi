//index.js
//获取应用实例
// const app = getApp()
var items = [];
var imagelist = [];
var timer
Page({
  data: {
    width: 0,
    height: 0,
    itemList: [{
        id: 1,
        image: '../img/1.png', //图片地址
        top: 0, //初始图片的位置 
        left: 0,
        width: 50,
        height: 50,
        active: false,
        z_index: 1,
        sign: 1
      },
      {
        id: 2,
        image: '../img/2.png', //图片地址
        top: 50,
        left: 0,
        width: 50,
        height: 50,
        active: false,
        z_index: 1,
        sign: 2
      },
      {
        id: 3,
        image: '../img/3.png', //图片地址
        top: 100,
        left: 0,
        width: 50,
        height: 50,
        active: false,
        z_index: 1,
        sign: 3
      }
    ],
    itemList1: [],
    top: "",
    coordinate: [],
    distance: [],
    images: [{
        id: 1,
        img: '../img/4.png',
        sign: 0,
      },
      {
        id: 2,
        img: '../img/4.png',
        sign: 0
      },
      {
        id: 3,
        img: '../img/4.png',
        sign: 0
      },
      {
        id: 4,
        img: '../img/4.png',
        sign: 0
      },
      {
        id: 5,
        img: '../img/4.png',
        sign: 0
      },
      {
        id: 6,
        img: '../img/4.png',
        sign: 0
      },
      {
        id: 7,
        img: '../img/4.png',
        sign: 0
      },
      {
        id: 8,
        img: '../img/4.png',
        sign: 0
      },
      {
        id: 9,
        img: '../img/4.png',
        sign: 0
      }
    ],
    images_num: [3, 2, 1, 2, 2, 1, 3, 1, 3],
    images_old: [{
        id: 1,
        img: '../img/3.png',
        sign: 0,
      },
      {
        id: 2,
        img: '../img/2.png',
        sign: 0
      },
      {
        id: 3,
        img: '../img/1.png',
        sign: 0
      },
      {
        id: 4,
        img: '../img/2.png',
        sign: 0
      },
      {
        id: 5,
        img: '../img/2.png',
        sign: 0
      },
      {
        id: 6,
        img: '../img/1.png',
        sign: 0
      },
      {
        id: 7,
        img: '../img/3.png',
        sign: 0
      },
      {
        id: 8,
        img: '../img/1.png',
        sign: 0
      },
      {
        id: 9,
        img: '../img/3.png',
        sign: 0
      }
    ],
    prompting_time: 1000,
    imagesNew_num: [],
    move: false,
    show: true,
    text: '开始游戏',
    time: 20,
    back_image: '../img/back.jpg',
    box_img: '../img/4.png',
    end_img:'../img/5.png',
    box_width:0,
    box_height: 0,
    img_box_width:0,
    img_box_height: 0,
    box_num:3,
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLaunch: function() {
    this.setData({
      itemList1: itemList
    })
  },
  onLoad: function (options) {
    // console.log(options.source)
    var that = this;
    items = that.data.itemList;
    imagelist = that.data.images;
    let box_width = that.data.box_num * (that.data.itemList[0].width + 4);
    let box_height = that.data.box_num * (that.data.itemList[0].height + 4);
    let img_box_width = that.data.itemList[0].width + 4;
    let img_box_height = that.data.itemList.length * (that.data.itemList[0].height) + 4;
    that.setData({
      itemList1: that.data.itemList,
      box_width: box_width,
      box_height: box_height,
      img_box_width: img_box_width,
      img_box_height: img_box_height
    })
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
  onShow: function() {
    var that = this;
    var query = wx.createSelectorQuery();
    var query1 = wx.createSelectorQuery();
    query.select('#box').boundingClientRect()
    query.select('#img_box').boundingClientRect()
    for (let i = 1; i <= that.data.images.length; i++) {
      query1.select('#box' + i).boundingClientRect()
    }
    query.exec(function(res) {
      that.setData({
        top: res[0].top
      })
    });
    query1.exec(function(res) {
      for (let i in res) {
        let coord = {};
        let x = res[i].left + res[i].width / 2;
        let y = res[i].top + res[i].height / 2;
        let lf = res[i].left;
        let lt = res[i].top;
        coord.x = x;
        coord.y = y;
        coord.lf = lf;
        coord.lt = lt;
        that.data.coordinate.push(coord)
      }
    })

  },
  touchS: function(e) {
    // items = this.data.itemList1
    if (this.data.move == true) {
      for (let i in items) {
        if (items[i].id == e.currentTarget.dataset.index) {
          items[i].active = true
        } else {
          items[i].active = false
        }
      }
      this.setData({ //赋值 
        itemList: items,
      })
    }

  },
  touchM: function(e) {
    if (this.data.move == true) {
      for (let i in items) {
        if (items[i].active == true) {
          items[i].z_index = 9999
          items[i].left = e.touches[0].clientX - items[i].width / 2 - (this.data.width - items[i].width);
          items[i].top = e.touches[0].clientY - items[i].height / 2 - 100;
        }
      }
      this.setData({
        itemList: items,
      })
    }
  },
  touchE: function(e) {
    var that = this;
    if (that.data.move == true) {
      
      let img_lf = e.target.offsetLeft;
      let img_lt = e.target.offsetTop;
      for (let i in that.data.coordinate) {
        let coord_x = that.data.coordinate[i].x - (that.data.width - that.data.itemList[0].width / 2);
        let coord_y = that.data.coordinate[i].y - 100 - that.data.itemList[0].height / 2;
        var distance = Math.sqrt((coord_x - img_lf) * (coord_x - img_lf) + (coord_y - img_lt) * (coord_y - img_lt))
        that.data.distance.push(distance)
      };
      //距离最近的索引
      var index = that.data.distance.indexOf(Math.min.apply(Math, that.data.distance))
      //赋到最近的方框里
      if (e.target.offsetLeft < -that.data.itemList[0].width) {
        for (let i in items) {
          if (items[i].id == e.currentTarget.dataset.index) {
            items[i].left = that.data.itemList1[i].left
            items[i].top = that.data.itemList1[i].top
            items[i].z_index = 1
            imagelist[index].img = items[i].image
            imagelist[index].sign = items[i].sign
          }
        }
      } else {
        for (let i in items) {
          if (items[i].id == e.currentTarget.dataset.index) {
            items[i].left = that.data.itemList1[i].left
            items[i].top = that.data.itemList1[i].top
            items[i].z_index = 1
          }
        }
      }
      //填充后的图片标识
      let imagesNew_num = []
      for (let index in imagelist) {
        imagesNew_num.push(imagelist[index].sign)
      }
      that.setData({ //赋值 
        itemList: items,
        distance: [],
        images: imagelist,
        imagesNew_num: imagesNew_num
      })
      let num = 0;
      for (let i in that.data.images) {
        if (that.data.images[i].img != that.data.box_img) {
          num++
        }
      }
      if (num == that.data.images.length) {
        clearInterval(timer)
        if (that.data.images_num.toString() == that.data.imagesNew_num.toString()) {
          wx.showToast({
            title: '闯关成功',
            icon:'none',
            success(res) {
              for (let val of imagelist) {
                val.img = that.data.box_img;
                val.sign = 0;
              }
              that.setData({
                images: imagelist,
                show: true,
                move: false,
                text: '开始下一关',
                itemList: that.data.itemList1,
                time: 20
              })
            }
          })
        } else {
          this.fail();
        }
      }
    }
  },
  start: function() {
    var that = this;
    var count = that.data.time;
    that.setData({
      images: that.data.images_old,
      show: false
    });
    var time = setTimeout(() => {
      that.setData({
        images: imagelist,
        move: true,
      });
      clearTimeout(time)
    }, that.data.prompting_time);
    timer = setInterval(() => {
      if (count<=0){
        clearInterval(timer)
        that.fail();
      }else{
        count --;
        that.setData({
          time:count
        })
      } 
    }, 1000)
  },
  //闯关失败
  fail:function(){
    var that = this;
    var image_end = that.data.images;
    for (let i in that.data.images) {
      if (that.data.images[i].img != that.data.images_old[i].img) {
        image_end[i].img = that.data.end_img
      }
    }
    wx.showToast({
      title: '闯关失败',
      icon: 'none',
      duration: 2000,
      success(res) {
        for (let val of imagelist) {
          val.img = that.data.box_img;
          val.sign = 0;
        }
        that.setData({
          images: image_end,
          show: true,
          move: false,
          text: '重新开始',
          itemList: that.data.itemList1,
          time: 20
        })
      }
    })
  },
  onUnload: function () {
    clearInterval(timer)
  },
  onShareAppMessage: function () {
    return {

      title: '自定义分享标题',

      desc: '自定义分享描述',

      path: '/pages/logs/logs'

    }
  }
})