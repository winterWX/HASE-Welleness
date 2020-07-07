//新增
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    timeData:[],
    inputSearchData:'',
    collectionImage: 0,
    flg:false,
    indexNumFlg:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     wx.request({
      url:'http://106.54.73.125:8102/remote/article/collection/queryArticleList',
      method:"POST",
      data:{
         uid:1,
         currentPage:1,
         pageSize:10
     },
      header:{
        'Content-Type':'application/json'
      },
      success: function (res) {
          if(res.data.data !== null){
            let timeAllData=[];
            res.data.data.forEach(item=>{
                item.isCollect = true
            })
            that.setData({
             listData: res.data.data
            })
            res.data.data.forEach((item)=>{
              timeAllData.push(that.timestampToTime(item.createTime));
              that.setData({
                timeData: timeAllData
              })
            })
          }
     },
     fail: function (res) {
       console.log('.........fail..........');
     }
     })
  },
  bindKeyInput: function(e){
    var inputNameData = e.detail.value
    this.setData({
        inputSearchData: inputNameData
     });
  },
  listClick : function(e){
    var goodsId = e.currentTarget.dataset.itemid;  
    console.log('goodsId',goodsId)    
    wx.navigateTo({                                
      url: '../collectDetails/collectDetails?goodsId='+ goodsId      
    })
  },
  searchSend(){
    var that = this;
    var inputVal = this.data.inputSearchData.replace(/^\s+|\s+$/g,"");
    wx.request({
     url:'http://106.54.73.125:8101/remote/article/list',
     data:{
       currentPage:'1',
       pageSize:'1000',
       research: inputVal,
       status:1,
    },
    method:"POST",
     header:{
       'Content-Type':'application/json'
     },
    success: function (res) {
       if(res.data.data !== null){
         let timeAllData=[];
         res.data.data.forEach(item=>{
             item.isCollect = true
         })
         that.setData({
          listData: res.data.data
         })
         res.data.data.forEach((item)=>{
           timeAllData.push(that.timestampToTime(item.createTime));
           that.setData({
             timeData: timeAllData
           })
         })
       }
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
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
  }
})