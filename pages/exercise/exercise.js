//新增
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeListData:[], 
    timeData:[],
    collectionImage: 0,
    flg:false,
    indexNumFlg:'',
    swithTitle:[{name:'**健康',value:0},{name:'个人发起',value:1}],
    topTitle:[{name:'全部',id:0},{name:'跑步',id:1},{name:'步行',id:2},{name:'答题',id:3}],
    topTitleIndex:0,
    activeIndex:0,
    endTimeData:[],
    sortData:[],
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
  topTitleSwith:function(e){
     var that = this;
     var index =  e.currentTarget.dataset.index;
     that.setData({
        topTitleIndex:index
     })
     that.searchSend(that.data.topTitle[index].name)
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
     url:'http://106.54.73.125:8101/remote/activity/list',
     data:{
      currentPage: 1,
      pageSize: 10,
      status: 0,
      type: types === '全部'? '': types
    },
    method:"POST",
     header:{
       'Content-Type':'application/json'
     },
    success: function (res) {
       if(res.data.data !== null){
          that.setData({
            activeListData: res.data.data
          })
          that.setData({
            iamgeUrl: res.data.data
          })
         let timeAllData=[];
         let endAllData=[];
         let sortDataWare =[];
         res.data.data.forEach((item)=>{
            timeAllData.push(that.timestampToTime(item.createTime));
            var endTime = item.endTime.split('/');
            var str1 = endTime[1].split("").reverse().join("");
            if(endTime[0].substr(0,1) !== '0'){
              var strsend = endTime[0].substr(0,1);+endTime[0].substr(1,2);
            }else{
              var strsend = '0'+endTime[0].substr(1,2); 
            }
            var endTimeRever = endTime[2]+'.'+str1+'.'+strsend;
            endAllData.push(endTimeRever)
            var lengthNum =  item.milestoneEntities.length-1;
            var rewardData = item.milestoneEntities[lengthNum].reward
            sortDataWare.push(rewardData)
              that.setData({
                sortData:sortDataWare
              })
            that.setData({
              timeData: timeAllData
            })
            that.setData({
              endTimeData: endAllData
            })
         })
       }else{
          that.setData({
            activeListData: []
          })
       }
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
    })
  },
  timestampToTime :function (timestamp){
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '.';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
      var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
      return Y+M+D;
  },
  listItemShow(e){
    var that = this;
    var dataFlg = e.currentTarget.dataset.index;
    var dataJson = {
        id:'1',
        imageUrl:that.data.activeListData[dataFlg].coverImageLocation
    }
    var dataJsonNum = JSON.stringify(dataJson);
    wx.navigateTo({
      url: '../comment/exerciseDetails/exerciseDetails?data='+ dataJsonNum
    })
  },
  onShareAppMessage: function (res) {

    if (res.from === 'button') {
 
    
 
    }
 
    return {
 
      title: "真好",

      path: '../exercise/exercise'
 
    }

  }
})