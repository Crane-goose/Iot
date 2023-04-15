// 获取当前host，用于提供url以建立websocket
const host = window.location.host
// 从当前网址里获取设备id ,比如 https://127.0.0.1/equipmentId/789 分析得到设备ID为789，若没有则为123456
var equipmentId = window.location.pathname.split("/")[2] || "123456"

// 创建websocket连接
const socket = new WebSocket('ws://'+host);
// 如果是部署到服务器并配置了SSL证书，应该使用wss协议 
// const socket = new WebSocket('wss://'+host);

// 如果建立连接
socket.onopen=function () {
  console.log("websocket connect!")
  var data = JSON.stringify({equipmentId:equipmentId})
  socket.send(data)
}

// 监听接收数据
socket.onmessage=function (msg) {
  console.log("-->",msg.data)
  try {
    // 将JSON字符串反转为JSON对象
    var data = JSON.parse(msg.data)
    data.forEach(function (d) {
      //将接收到的数据 更新到echart图表里
      //updateMyChart(d.time,d.value)
      updateMyChart(d.time, d.value1, d.value2, d.value3, d.value4, d.value5, d.value6)
    });
  } catch (error) {
    console.log('error:',error)
  }
}

socket.onclose=function () {
  console.log("websocket close.")
}

socket.onerror=function () {
  console.log("websocket error:",event)
}

function postData(equipmentId,actionString){
  // 发送控制指令
  if(!equipmentId){
    return console.log('没设备，不可发送指令')
  }
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var params = 'action='+actionString
  httpRequest.open('POST', '/led/'+equipmentId);
  httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  httpRequest.send(params);
}


//给开关灯按钮添加事件，发起请求 POST /led/:id
document.getElementById('open-led').onclick = ()=>{
  postData(equipmentId,'open')
}

document.getElementById('close-led').onclick = ()=>{
  postData(equipmentId,'close')
}




// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));

var option = {
  animation: false,

  //下方图例
  legend: {
    bottom: 10,
    left: 'center',
    data: ['通道1', '通道2', '通道3', '通道4', '通道5', '通道6'],
    textStyle:{
      color:'#fff',
      fontWeight:900,
      fontSize:24
    }
  },
  //弹窗提示
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: function (pos, params, el, elRect, size) {
      var obj = { top: 10 };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
      return obj;
    },
    extraCssText: 'width: 170px'
  },
  //坐标轴指示器
  axisPointer: {
    link: { xAxisIndex: 'all' },
    label: {
      backgroundColor: '#777'
    }
  },
  //工具栏组件：右上角
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: false
      },
      brush: {
        type: ['lineX', 'clear']
      }
    }
  },
  //区域选择，没发现有啥用
  brush: {
    xAxisIndex: 'all',
    brushLink: 'all',
    outOfBrush: {
      colorAlpha: 0.1
    }
  },
  //设置文本颜色，大小
  textStyle:{
    color:'#fff',
    fontWeight:900,
    fontSize:24
  },
  //设置图标标题
  title: {
    text: '检测信息',
    left: 'center',
    textStyle:{
      color:'#fff',
      fontWeight:900,
      fontSize:24
    }
  },
  //图标位置
  grid: 
    {
      left: '10%',
      right: '8%',
      height: '65%'
    },
  //x轴配置
  xAxis: 
    {
      type: 'category',
      data: [],
      name: '时间' ,
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
      }
    },
  //y轴配置
  yAxis: [
    {
      scale: true,
      name: '幅值',
      splitArea: {
        show: true
      }
    },
    // {
    //   scale: true,
    //   gridIndex: 1,
    //   splitNumber: 2,
    //   axisLabel: { show: false },
    //   axisLine: { show: false },
    //   axisTick: { show: false },
    //   splitLine: { show: false }
    // }
  ],
  //区域缩放配置
  dataZoom: [
    
    {
      type: 'inside',
      xAxisIndex: [0, 1],
      start: 70,
      end: 100
    },
    {
      show: true,
      xAxisIndex: [0, 1],
      type: 'slider',
      //距离容器顶部距离
      top: '85%',
      start: 70,
      end: 100
    }
  ],
  //绘制折线图
  series: [
    //增加5条曲线，总计6条
    {
    name: '通道1',
    data: [],
    type: 'line',
    smooth: true,
    // lineStyle: {
    //   normal: { opacity: 0.5 }
    // }
    },
    {
      name: '通道2',
      data: [],
      type: 'line',
      smooth: true
    },
    {
      name: '通道3',
      data: [],
      type: 'line',
      smooth: true
    },
    {
      name: '通道4',
      data: [],
      type: 'line',
      smooth: true
    },
    {
      name: '通道5',
      data: [],
      type: 'line',
      smooth: true
    },
    {
      name: '通道6',
      data: [],
      type: 'line',
      smooth: true
    }    
  ]
};

// 指定图表的配置项和数据
// var option = {
     
//   //原本就有的
//   color:'#fff',
//   textStyle:{
//     color:'#fff',
//     fontWeight:900,
//     fontSize:24
//   },
//   title: {
//     text: '实时温度',
//     textStyle:{
//       color:'#fff'
//     }
//   },
//   xAxis: {
//     type: 'category',
//     data: []
//   },
//   yAxis: {
//     type: 'value'
//   },
//   series: [
//     //增加5条曲线，总计6条
//     {
//     data: [],
//     type: 'line',
//     smooth: true
//     },
//     {
//       data: [],
//       type: 'line',
//       smooth: true
//     },
//     {
//       data: [],
//       type: 'line',
//       smooth: true
//     },
//     {
//       data: [],
//       type: 'line',
//       smooth: true
//     },
//     {
//       data: [],
//       type: 'line',
//       smooth: true
//     },
//     {
//       data: [],
//       type: 'line',
//       smooth: true
//     }    
//   ]
// };

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

// 给echart插入新数据
function updateMyChart(time, val1, val2, val3, val4, val5, val6) {
  var value1 = Number(val1)
  var value2 = Number(val2)
  var value3 = Number(val3)
  var value4 = Number(val4)
  var value5 = Number(val5)
  var value6 = Number(val6)
  //如果value不是数值则跳过
  // if(typeof value !== 'number'){
  //   console.log('不是数值，跳过：',value,value instanceof Number)
  //   return ;
  // }
  //增加5条曲线
  option.xAxis.data.push(time)
  option.series[0].data.push(value1)
  option.series[1].data.push(value2)
  option.series[2].data.push(value3)
  option.series[3].data.push(value4)
  option.series[4].data.push(value5)
  option.series[5].data.push(value6)
  // 如果数据超过10个，把第一个数据删除。
  // if(option.xAxis.data.length > 10){
  //   option.xAxis.data.shift()
  //   option.series[0].data.shift()
  // }
  myChart.setOption(option);
}

function getHistory() {
  //获取历史数据
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = ()=>{
    if( httpRequest.readyState === 4){
      // 4	DONE	下载操作已完成。
      const data = JSON.parse(httpRequest.responseText)
      console.log("history:",data)
      data.forEach((v)=>{
        //updateMyChart(v.time,v.value)
        updateMyChart(v.time, v.value1, v.value2, v.value3, v.value4, v.value5, v.value6)
      })
    }
  };

  httpRequest.open('GET', '/history/'+equipmentId);
  httpRequest.send();
}
getHistory()


function getEquipmentList() {
  // 获取设备列表打印出来方便调试
  var httpRequest = null;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = ()=>{
    if( httpRequest.readyState === 4){
      // 4	DONE	下载操作已完成。
      console.log('设备列表：',JSON.parse(httpRequest.responseText))
    }
  };

  httpRequest.open('GET', '/equipment-list');
  httpRequest.send();
}

getEquipmentList()


