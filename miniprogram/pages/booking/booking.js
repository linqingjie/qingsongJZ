let tool = require('../../js/tool');
//获取小程序的实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //记录收入支出选中状态
    activeIndex:0,
    //记账类型(收入-支出)
    bookingType: [
      {
        title: '收入',
        type: 'sr'
      },
      {
        title: '支出',
        type: 'zc'
      }
    ],
    bool:true,
    //选择日期
    date:'选择日期',
    //轮播图图标数据
    icon:[],
    //记录收入支出类型（例如餐饮）选中状态
    activeIndexs:-1,
    loading:true,
    //记录轮播图第几页
    bannerNum:'',
    // 支付账户数据
    account:[
      {
        name:'现金',
        type:'xj'
      },
      {
        name:'微信',
        type:'wx'
      },
      {
        name:'支付宝',
        type:'zfb'
      },
      {
        name:'信用卡',
        type:'xyk'
      },
      {
        name:'储蓄卡',
        type:'cxk'
      },
    ],
    //支付账户选中类型
    aType:-1,
    //支付账户选中下标
    aindex:-1,
    //输入金额
    money:'',
    //备注
    comment:'',
    //当前时间
    currentDate:'',
    //账户名
    accountName:'',
    //用户是否已经授权
    isAuth: false
  },
   //设置输入框的值
   setValue(e) {
    let key = e.currentTarget.dataset.key;

    let value = e.detail.value;

    if (key == 'comment' && /[<>]/.test(value)) {
      wx.showToast({
        title: '备注不包含<>符号',
        icon: 'none',
        duration: 3000
      })
      this.setData({
        [key]: ''
      })
      return;
    }

    this.setData({
      [key]: e.detail.value
    })

  },
  //选择账户类型
  accounts(e){
    let index = e.currentTarget.dataset.index;
    this.data.aindex=index;
    this.data.accountName=this.data.account[index]
   this.setData({
     aindex:index
   })
  //  console.log(this.data.accountName);
  },
  //切换收入或支出
  toggleBookingType(e) {
    //e:事件对象
    //获取下标
    let index =Number(e.currentTarget.dataset.index);
    if (index == this.data.activeIndex) {
      console.log('拦截');
      return;
    }
    //如果需要将数据同步到view, 必须使用this.setData()
    this.setData({
      activeIndex:index
    })
    console.log(this.data.activeIndex);
  },
  //切换收入支出类型（例如餐饮）
  toggleType(e){
    // 图标下标
    let index = e.currentTarget.dataset.index;
    
    //轮播图页数
    let indexs = e.currentTarget.dataset.indexs;

    if (index == this.data.activeIndexs && indexs == this.data.bannerNum) {
      console.log('拦截');
      return;
    }
    //如果需要将数据同步到view, 必须使用this.setData()
    this.setData({
      activeIndexs: index,
      bannerNum:indexs,
    })
  },
 
  // 查询记账子类型
  findBookingSubType(){
    //启动加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.cloud.callFunction({
      //云函数名称
      name:'lookup',
      data:{
        //集合名称
        listName:'icons'
      }
    }).then(res=>{
     
      wx.hideLoading();
      let num =Math.ceil(res.result.data.length/10)
      for(let i=0;i<num;i++){
        this.data.icon[i]=res.result.data.splice(0,10);
      }
      
      this.setData({
        icon:this.data.icon
      })
      this.setData({
        loading:false
      });
    }).catch(err=>{
      wx.hideLoading();
      console.log('err==>',err);
    })
  },
  //保存记账数据
  save() {
    //判断是否填写金额
    if (!this.data.money) {
      return wx.showToast({
        title: '填写金额',
        icon: 'none',
        duration: 3000
      })
    }
    //判断是否选择子类型
    if (this.data.activeIndexs == -1) {
      return wx.showToast({
        title: '选择记账类型(餐饮, 购物等)',
        icon: 'none',
        duration: 3000
      })
    }

    //判断是否选择账户
    if (this.data.aindex == -1 ) {
      return wx.showToast({
        title: '选择账户类型',
        icon: 'none',
        duration: 3000
      })
    }

    //判断是否选择日期
    if (this.data.date == '选择日期') {
      return wx.showToast({
        title: '选择日期',
        icon: 'none',
        duration: 3000
      })
    }
    let data={
      date:this.data.date,
      money:this.data.money,
      comment:this.data.comment,
      listName:'booking',
    };
    //获取收入-支出类型
    data.mainType = this.data.bookingType[this.data.activeIndex];
    //获取子类型
   data.subType = this.data.icon[this.data.bannerNum][this.data.activeIndexs];
    //获取账户类型
    data.account = this.data.accountName
    //添加记账数据
    this.createBooking(data);
  },
  //添加记账数据
  createBooking(data){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.cloud.callFunction({
      name:'create_data',
      data
    }).then(res=>{
      wx.hideLoading();
      this.setData({
        accountName:'',
        bannerNum:'',
        activeIndexs:-1,
        date:'选择日期',
        comment:'',
        money:'',
        aindex:-1,
        aType:-1,
      })
      console.log('res ==> ', res);
    }).catch(err => {
      wx.hideLoading();
      console.log('err ==> ', err);
    })
  },
  onLoad:function(options){
    this.findBookingSubType()
     //获取当前日期
     let date = new Date();
     this.data.currentDate = tool.formatDate(date, 'yyyy-MM-dd');
     this.setData({
       currentDate: this.data.currentDate
     })
  },
   //获取用户授权信息
   getuserAuthInfo(res) {
    console.log('res ==> ', res);
    if (res.detail.userInfo) {
      app.globalData.isAuth = true;
      this.setData({
        isAuth: true
      })
    }
    
  },
  onShow() {
    this.setData({
      isAuth: app.globalData.isAuth
    })
  }

  
})