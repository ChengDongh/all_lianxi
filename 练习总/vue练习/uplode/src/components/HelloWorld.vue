<template>
  <div class="hello">
    <!--<div style="padding: 20px 0">-->
      <!--<span style="padding-bottom: 20px;display: block">上传图片:</span><br>-->
      <!--<div style="width: 150px;height: 60px" v-if="uploadList !=''" class="demo-upload-list">-->
        <!--<img :src="uploadList">-->
        <!--<div class="demo-upload-list-cover">-->
          <!--<Icon type="ios-eye-outline" @click.native="handleView(uploadList)"></Icon>-->
          <!--<Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>-->
        <!--</div>-->
      <!--</div>-->
      <!--<Upload-->
        <!--ref="upload"-->
        <!--:show-upload-list="false"-->
        <!--name="img"-->
        <!--multiple-->
        <!--:format="['jpg','jpeg','png']"-->
        <!--:before-upload="handleBeforeUpload"-->
        <!--:on-success="handleSuccess"-->
        <!--type="drag"-->
        <!--action="https://yiapi.qiqiangkeji.com/upload"-->
        <!--style="display: inline-block;width:58px;">-->
        <!--<div style="width: 58px;height:58px;line-height: 58px;">-->
          <!--<Icon type="ios-camera" size="20"></Icon>-->
        <!--</div>-->
      <!--</Upload>-->
    <!--</div>-->
    <!--<div v-if="visible"-->
         <!--style="width: 100vw;height: 100vh;background: rgba(0,0,0,0.1);position: absolute;top: 0;z-index: 999"></div>-->
    <!--<div style="width: 600px;height: 300px;margin: 0 auto;position: relative;z-index: 9999" v-if="visible">-->
      <!--<Icon @click="closeVisible" style="position: absolute;right: -14px;top: -14px;" size="30"-->
            <!--type="ios-close-circle-outline"/>-->
      <!--<img style="width: 100%;height: 100%" :src="uploadList" alt="">-->
    <!--</div>-->
    <!--<div style="width: 204px;height: 400px;overflow-y: auto;border: 1px solid #eee;margin: 0 auto">-->
      <!--<img style="width: 200px;height: 300px;" :class="{active:imagesIndex == index}" @click="change(index)"-->
           <!--v-for="(item,index) in images" :key="index" :src="item.img" alt="">-->
    <!--</div>-->
    <!--<button @click="go(1)">上移</button>-->
    <!--<button @click="go(-1)">下移</button>-->
    <!--<button @click="del">删除</button>-->
    <div>{{phone | telHide}}</div>
    <input type="file" @change="upload($event)" />
  </div>

</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: '',
        uploadList: '',
        visible: false,
        images: [],
        isActive: null,
        imagesIndex: -1,
        phone:'13912345678',
      }
    },
    created() {

    },
    methods: {
      upload(event){
        var fromData = new FormData();
        fromData.append('img',event.target.files[0])
        // var data = {
        //   username: 'admin',
        //   password: '123456'
        // }
        var that = this;
        that.$http({
          url:that.$http.adornUrl('/upload'),
          method:'post',
          data: fromData
        }).then(({
          data
        }) => {
          console.log(data)
        }).catch(() => {
          console.log(9999)
        })
      },
      del() {
        this.images.splice(this.imagesIndex, 1);
        this.imagesIndex = -1;
      },
      go(index) {
        if (this.imagesIndex == -1) {
          return;
        }
        var i = this.imagesIndex;
        if (index == 1) {
          if (i != 0) {
            var t = this.images[i - 1];
            this.$set(this.images, i - 1, this.images[i]);
            this.$set(this.images, i, t);
            this.imagesIndex = i - 1
          }
        } else {
          if (i != (this.images.length - 1)) {
            var t = this.images[i + 1]
            this.$set(this.images, i + 1, this.images[i])
            this.$set(this.images, i, t)
            this.imagesIndex = i + 1
          }
        }
        // var t = this.arr[0]
        // this.$set(this.arr,0,this.arr[1]);
        // this.$set(this.arr,1,t);
      },
      change(index) {
        this.imagesIndex = index;
      },
      handleRemove() {
        this.uploadList = ''
      },
      handleView() {
        this.visible = true;
      },
      closeVisible() {
        this.visible = false;
      },
      handleSuccess(res) {
        var data = {}
        if (res.code == 0) {
          this.uploadList = res.data.url;
          data.img = res.data.url;
          this.images.push(data);
        } else {
          this.$Message.info('图片上传失败，请重新上传');
        }
      },
      handleBeforeUpload(file) {
        this.uploadList = '';
        this.visible = false;
        const check = this.uploadList.length < 2;
        if (!check) {
          this.$Notice.warning({
            title: '最多上传一个'
          });
        } else {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const file = reader.result
            return file
          }
        }
        return check;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .active {
    border: 2px solid red
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .paging {
    float: right;
    margin-top: 10px;
  }
</style>
