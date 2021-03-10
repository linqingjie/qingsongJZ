// components/aa.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow:{
      type:Boolean,
      value:false
    },
    bookingData:{
      type:Object,
      value:{}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    removeData(e){
      let _id = e.currentTarget.dataset._id;
      this.triggerEvent('remove', {_id});
    }
  },
  
 
  
})
