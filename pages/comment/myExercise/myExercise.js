//新增
Page({
  data: {
    activeListData:[], 
    allActiveListData:[],
    collectionImage: 0,
    flg:false,
    indexNumFlg:'',
    swithTitle:[{name:'已报名',value:0},{name:'我发起的',value:1}],
    activeIndex:0,
    iamgeUrl:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     var defultFlg = '';
     that.searchSend(defultFlg);
  },
  topTabbr:function(e) {
    var that = this;
    var index =  e.currentTarget.dataset.index;
    that.setData({
       activeIndex:index
    })
  },
  searchSend(types){
    var that = this;
    wx.request({
     url:'http://106.54.73.125:8102/remote/myactivity/list',
     data:{
      currentPage: '1',
      pageSize: '10',
      uid:'1'
      // ,
      // status: 0,
      // type: types === '全部'? '': types
    },
    method:"POST",
     header:{
       'Content-Type':'application/json'
     },
    success: function (res) {
       if(res.data.data !== null){
          console.log('res.data.data',res.data.data);
          res.data.data.forEach((item,index)=>{
            item.startTime = item.startTime.replace(/-/g,".");
            item.endTime = item.endTime.replace(/-/g,".");
            item.startTime = item.startTime.substring(0,10);
            item.endTime = item.endTime.substring(0,10);
            that.data.allActiveListData.push(item);
          })
          that.setData({
            activeListData: that.data.allActiveListData
          })
      }
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
    })
  },
  listItemShow(e){
    var that = this;
    var dataFlg = e.currentTarget.dataset.index;
    var dataJson = {
        id:'1',
        imageUrl:that.data.activeListData[dataFlg].thumb
    }
    var dataJsonNum = JSON.stringify(dataJson);
    wx.navigateTo({
      url: '../../comment/myExerciseDetails/myExerciseDetails?data='+ dataJsonNum
    })
  },
})