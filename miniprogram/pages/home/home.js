let tool = require('../../js/tool');
Page({

  data: {
    "navigationBarTitleText":"首页",
    // 骨架屏
    loading:true,
    //是否显示删除
    isShow:false,
    //当前日期
    currentDate: '',
     //当前日的记账数据
     currentDateBooking: [],
     //当天收入和支出的总额
    currentDateMoney: {
      sr: 0,
      zc: 0
    },
    //显示x月x日
    date: '',
    pickerDate: {
      //当月01号
      start: '',

      //当月当日
      end: ''
    },

    //本月总额(收入-支出-结余)
    currentMonthBooking: {
      sr: 0,
      srDecimal: '',
      zc: 0,
      zcDecimal: '',
      jy: 0,
      jyDecimal: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前日期
    let currentDate = tool.formatDate(new Date(), 'yyyy-MM-dd');
    let d = currentDate.split('-');
    this.data.pickerDate.start = d[0] + '-' + d[1] + '-01';
    this.data.pickerDate.end = currentDate;
    this.setData({
      currentDate,
      pickerDate: this.data.pickerDate
    })
  },

    //切换日期
    toggleCurrentDate(e) {
      if (e.detail.value == this.data.currentDate) {
        return;
      }
  
      this.setData({
        currentDate: e.detail.value
      })
  
      this.getBookingDataByDate();
  
    },

  onReady:function(){
    setTimeout(()=>{
      this.setData({
        loading:false
      })
    },500)
  },

  onShow: function () {
    this.getBookingDataByDate();
    this.findBookingByMonth();
  },

    //获取当天记账数据
  getBookingDataByDate(){
      wx.showLoading({
        title: '加载中...',
        mask: true
      });

      wx.cloud.callFunction({
        name:'lookup',
        data:{
          date:this.data.currentDate,
          listName:'booking'
        }
      }).then(res => {
        wx.hideLoading();
          //清空当日收入和支出总额
      this.setData({
        currentDateMoney: {
          sr: 0,
          zc: 0
        }
      })
      let date = this.data.currentDate.split('-');
      date = date[1] + '月' + date[2] + '日';
      //计算当天的收入和支出总额
      res.result.data.forEach(v => {
        this.data.currentDateMoney[v.mainType.type] += Number(v.money);
        v.money = Number(v.money).toFixed(2);
      })
      for (let key in this.data.currentDateMoney) {
        this.data.currentDateMoney[key] = this.data.currentDateMoney[key].toFixed(2);
      }

        this.setData({
          currentDateBooking: res.result.data,
          date,
          currentDateMoney: this.data.currentDateMoney
        })
      }).catch(err => {
        wx.hideLoading();
        console.log('err ==> ', err);
      })
  },

  // 获取当月的记账数据
  findBookingByMonth(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name:'summary',
      data:{
        start: this.data.pickerDate.start,
        end: this.data.pickerDate.end
      }
    }).then(res=>{
      this.data.currentMonthBooking= {
        sr: 0,
        srDecimal: '',
        zc: 0,
        zcDecimal: '',
        jy: 0,
        jyDecimal: '',
      }
      res.result.data.forEach(v => {
        this.data.currentMonthBooking[v.mainType.type] += Number(v.money);
      })

      this.data.currentMonthBooking.jy = this.data.currentMonthBooking.sr - this.data.currentMonthBooking.zc;

      let keys = ['sr', 'zc', 'jy'];
      keys.forEach(v => {
        let data = this.data.currentMonthBooking[v].toFixed(2).split('.');
        this.data.currentMonthBooking[v] = data[0];
        this.data.currentMonthBooking[v + 'Decimal'] = data[1];
      })
      this.setData({
        currentMonthBooking: this.data.currentMonthBooking
      })
    }).catch(err => {
      wx.hideLoading();
      console.log('err ==> ', err);
    })
  }
})