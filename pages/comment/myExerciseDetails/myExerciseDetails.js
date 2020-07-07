Page({
  data: {
      imageList:[
          {src:'../../../image/testImage.jpg',name:'雄安',id:0},
          {src:'../../../image/testImage.jpg',name:'Shopli',id:1},
          {src:'../../../image/testImage.jpg',name:'王大锤',id:2},
          {src:'../../../image/testImage.jpg',name:'Shopli',id:3},
          {src:'../../../image/testImage.jpg',name:'Shopli',id:5}
        ],
      progessList:[
          {src:'../../../image/testImage.jpg',name:'雄安',id:0,number:87.382},
          {src:'../../../image/testImage.jpg',name:'Shopli',id:1,number:80.900},
          {src:'../../../image/testImage.jpg',name:'王大锤',id:2,number:50.100},
          {src:'../../../image/testImage.jpg',name:'Shopli',id:3,number:20.600},
          {src:'../../../image/testImage.jpg',name:'winter',id:4,number:10.300},
          {src:'../../../image/testImage.jpg',name:'Shopli',id:3,number:20.600},
          {src:'../../../image/testImage.jpg',name:'winter',id:4,number:10.300},
          {src:'../../../image/testImage.jpg',name:'Shopli',id:3,number:20.600},
          {src:'../../../image/testImage.jpg',name:'winter',id:4,number:10.300},
          {src:'../../../image/testImage.jpg',name:'winter',id:4,number:10.300}
        ],
        parentData:{},
        allMyFriendActivityNum:0,
        allMyFriendActivityVo:{},
        myActivityAndMileStoneVo:{},
        myFriendActivityVo:{},
        mileStoneList:[],
        rewardVal:"",
        flag:false
  },
  onLoad: function (options) {
     var that = this;
     that.setData({
      parentData: {}      
     })
     var optionsData = JSON.parse(options.data);
     that.setData({
        parentData: optionsData      
     })
     that.tagsShare();
     that.searchSend();
  },
  tagsShare:function () {
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
  //选择条目
  searchSend(parase){
    var that = this;
    wx.request({
     url:'http://106.54.73.125:8102/remote/myactivity/detail',
     data:{
      //activityId: that.data.parentData.id,
      activityId: 10,
      uid:'1',
    },
    method:"POST",
     header:{
       'Content-Type':'application/json'
     },
    success: function (res) {
      if(res.data.data !== null){
        res.data.data.allMyFriendActivityVo.forEach(item=>{
          item.stepsNum = that.cutStr(item.steps);
        })
        // for(let key  in res.data.data.myActivityAndMileStoneVo){
        //   console.log(key + '---' + res.data.data.myActivityAndMileStoneVo[key])
        // }
        res.data.data.myActivityAndMileStoneVo.mileStoneList.forEach(item=>{
          item.mileStoneTarget = that.cutStr(item.mileStoneTarget);
        })
        that.setData({
          allMyFriendActivityNum: res.data.data.allMyFriendActivityNum
        })
        that.setData({
          allMyFriendActivityVo: res.data.data.allMyFriendActivityVo
        })
        that.setData({
          myActivityAndMileStoneVo: res.data.data.myActivityAndMileStoneVo
        })
        that.setData({
          mileStoneList: res.data.data.myActivityAndMileStoneVo.mileStoneList
        })
        that.setData({
          myFriendActivityVo: res.data.data.myFriendActivityVo
        })
        that.data.mileStoneList.forEach((item,index)=>{
          if(that.data.mileStoneList.length-1 === index){
            that.setData({
              rewardVal:item.reward + item.mileStoneType
            })
          }
        })
        that.mySxerciseDateil();
      }
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
    })
  },
  mySxerciseDateil(types){
    var that = this;
    var array = [{activityId:'10'}];
    wx.request({
      url:'http://106.54.73.125:8102/remote/myactivity/take/status?uid=1',
      data : JSON.stringify(array), 
    method:"POST",
     header:{
       'Content-Type':'application/json'
     },
    success: function (res) {
       if(res.data.data !== null){
          that.setData({
            flag : res.data.data[0].flag
          })
      }
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
    })
  },
  backPageBtn:function () {
    wx.navigateBack({
      url: '../../exercise/exercise'
    })
  },
  allPersonNum:function () {
    var that = this;
    var data = JSON.stringify(that.data.allMyFriendActivityVo);  
    wx:wx.navigateTo({
      url: '../../comment/friendActivity/friendActivity?data='+data,
    })
  },
  canlenBtn:function () {
    var that = this;
    that.setData({
      editStute: false
    })
  },
  confirmBtn:function() {
    var that = this;
    var listParas =[];
    that.setData({
      editStute: false
    })
    if(that.data.myTagData.length > 0){
      that.data.myTagData.forEach(item=>{
          listParas.push(
                {
                  order: "1",
                  tag: item.tag,
                  uid: '1'
                }
            )
      })
    }else{
      listParas =[]
    }
    that.setData({
      tabLists:that.data.myTagData
    })
    that.refreTagList(listParas);
  },
    // 隐藏遮罩层
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
      this.animation.translateY(950).step()
      this.setData({
        animationData: this.animation.export(),
      })
      this.setData({
        editStute:false
      })
      this.setData({
        editSwith: true
      })
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
  cutStr:function(num){  
    var result = [ ], counter = 0;
    num = (num || 0).toString().split('');
    for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(num[i]);
    if (!(counter % 3) && i != 0) { result.unshift(','); }
    }
    return result.join('');  
  }
})