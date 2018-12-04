var utils = require("../../utils/util.js");

Page({
  data: {
    imgs: [
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_02.png",
        imageheight: 320
      },
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_03.png",
        imageheight: 320
      },
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_04.png",
        imageheight: 320
      },
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_05.png",
        imageheight: 320
      },
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_06.png",
        imageheight: 320
      },
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_07.png",
        imageheight: 320
      },
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_08.png",
        imageheight: 320
      },
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_09.png",
        imageheight: 320
      },
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_10.png",
        imageheight: 320
      },
      {
        src: "http://www.kmeila.com/kameila/qgimg/正品保障_11.png",
        imageheight: 320
      }
    ]
  },
  imageLoad: function (e) {
    var idx = e.target.dataset.idx
    var imgs = this.data.imgs
    var item = imgs[idx]
    var imageHeight = utils.imageUtil(e)
    item.imageheight = imageHeight
    this.setData({
      imgs: imgs
    })
  }
})
