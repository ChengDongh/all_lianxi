<template>
  <div class="hello">
    <div style="padding: 20px 0">
      <span style="padding-bottom: 20px;display: block">上传图片:</span><br>
      <div style="width: 150px;height: 60px" v-if="uploadList !=''" class="demo-upload-list">
        <img :src="uploadList">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(uploadList)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
        </div>
      </div>
      <Upload
        ref="upload"
        :show-upload-list="false"
        name="img"
        multiple
        :format="['jpg','jpeg','png']"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
        type="drag"
        action="https://yiapi.qiqiangkeji.com/upload"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
    </div>
    <div v-if="visible" style="width: 100vw;height: 100vh;background: rgba(0,0,0,0.1);position: absolute;top: 0;z-index: 999"></div>
    <div style="width: 600px;height: 300px;margin: 0 auto;position: relative;z-index: 9999" v-if="visible">
      <Icon @click="closeVisible" style="position: absolute;right: -14px;top: -14px;" size="30" type="ios-close-circle-outline" />
      <img style="width: 100%;height: 100%" :src="uploadList" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '',
      uploadList:'',
      visible:false,
    }
  },
  created(){

  },
  methods:{
    handleRemove() {
      this.uploadList = ''
    },
    handleView(){
      this.visible = true;
    },
    closeVisible(){
      this.visible = false;
    },
    handleSuccess (res) {
      if(res.code == 0){
        this.uploadList = res.data.url
      }else {
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
      }else {
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
  .paging{
    float:right;
    margin-top:10px;
  }
</style>
