Page({
  data: {
    detailsData: {},
    createTime: '',
    hideModal: true,
    animationData: {},
    changeDataUrl: '',
    collectionImage: 0,
    flg:false,
    indexNumFlg:''
  },
  onLoad: function (options) {
     var that = this;
     var idNum =  options.goodsId;
      wx.request({
        url:`http://106.54.73.125:8101/remote/article/detail?id=${idNum}`,
        method:"GET",
        header:{
          'Content-Type':'application/json'
        },
        success: function (res) {
         that.setData({
           detailsData: res.data.data
         })
         if(res.data.data.content !== ''){
            var backData = res.data.data.content;
            var newUrl = '';
            var baseUrl ='http://106.54.73.125:8101/upload';
            String.prototype.replaceAll = function (FindText, RepText) {
              return this.replace(new RegExp(FindText, "g"), RepText);
            }
            newUrl = backData.replaceAll('../upload', baseUrl);
            that.setData({
              changeDataUrl : newUrl
            })
         }
         if(res.data.data !== null){
          that.setData({
            createTime: that.timestampToTime(res.data.data.createTime)
          })
         }
       },
       fail: function (res) {
         console.log('.........fail..........');
       }
      })
  },
  shareBottom: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 100,//动画的持续时间 默认600ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();  //调用显示动画
    }, 100)
  },
  //隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 100,  //动画的持续时间 默认800ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',  //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 100)  //先执行下滑动画，再隐藏模块
  },
  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()  //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  collectionImageShare:function(e){
    var indexNum = e.currentTarget.dataset.index
    var that = this;
    that.setData({
      indexNumFlg : indexNum
    })
    that.setData({
      flg : !that.data.flg
    })
    if(that.data.flg){
      that.setData({
        collectionImage:1
      })
    }else{
      that.setData({
        collectionImage:0
      })
    }
},
  timestampToTime :function (timestamp){
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    return Y+M+D;
  },
})