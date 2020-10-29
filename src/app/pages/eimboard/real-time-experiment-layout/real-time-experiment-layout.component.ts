import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import * as screenfull from 'screenfull';
import { Screenfull } from 'screenfull';
import { LayoutService } from '../../../@core/utils';

// echart
let rtm3 = require('../../../../assets/eimdoard/rtm3/js/rtm3');
let rtm3a = require('../../../../assets/eimdoard/rtm3/js/rtm3a');
let expChart = require('../../../../assets/eimdoard/rtm3/js/explayout');
declare var $:any;

@Component({
  selector: 'ngx-real-time-experiment-layout',
  templateUrl: './real-time-experiment-layout.component.html',
  styleUrls: ['./real-time-experiment-layout.component.scss']
})
export class RealTimeExperimentLayoutComponent implements OnInit {
  is_not_fullscreen = false;

  //实时数据
  real_time_data = {
    title: '结构试验室布局',
    address: 'S1111环境试验室',//地址
    //第二行数据
    firstcol:{
      title:'运营指标',
      secondrow:'活跃设备数/监控设备总数'
    },
    secondcol:{
      title:'实验室设备分布',
      secondrow: '设备运行时长/总时长',
    },
    thirdcol:{
      title:'设备健康信息',
      secondrow :'试验任务进度',
    },
    structure: [{name:'结构1'},{name:'结构3'},{name:'结构2'}]
  };

  task_data: any = {
    title: [
      {name:'任务名称',bind:'taskname'},
      {name:'参数',bind:'param'},
      {name:'状态',bind:'plan'},
      {name:'有误报告',bind:'report'},
    ],
    data:[
      {taskname:'MTS 329',param:'55',plan:'已完成',report:'无',class:'location_div_1',tipShow:false},
      {taskname:'MTS HPU',param:'48',plan:'已完成',report:'无',class:'location_div_2',tipShow:false},
      {taskname:'MTS MAST',param:'66',plan:'80%',report:'无',class:'location_div_3',tipShow:false},
      {taskname:'TESTLINE',param:'88',plan:'60%',report:'无',class:'location_div_4',tipShow:false},
      {},
      {},
      {},
      {},
    ]
  }
  messageInterval:any;//定时器

  constructor (private layoutService: LayoutService,private router:Router) { }

  ngOnInit(): void {
    // percentage_1
    // echarts.init(document.getElementById(f)
    let i = 1;
    this.messageInterval = setInterval(f=>{
      this.getMessageData(i);
      i++;
    },1000)
    
    // this.layoutService.onInitLayoutSize().subscribe(f =>{
      
    // })
    this.layoutService.onChangeLayoutSize().subscribe(f =>{
      this.initChart();
    })
    this.initChart();

  }

  initChart(){
    if(document.getElementById('percentage_1'))
        expChart.create_percentage_chart({number:'523',percentage:4,color:'rgb(153,255,255)'},echarts.init(document.getElementById('percentage_1')));
      if(document.getElementById('percentage_2'))
        expChart.create_percentage_chart({number:'298',percentage:36,color:'rgb(255,255,0)'},echarts.init(document.getElementById('percentage_2')));
      if(document.getElementById('percentage_3'))
        expChart.create_percentage_chart({number:'523',percentage:64,color:'rgb(195,255,244)'},echarts.init(document.getElementById('percentage_3')));
      // 警告条数
      rtm3.create_third_first({number: '11条', title: '警告条数'}, 'third_first_one');
      rtm3.create_third_first({number: '11条', title: '警告条数'}, 'third_first_two');
      rtm3.create_third_first({number: '11条', title: '警告条数'}, 'third_first_three');

      var data  = {
        title:'2018上半年检测统计',
        information:[["type", "2012", "2013"],
      ["一月", 320, 332],
      ["二月", 220, 182],
      ["三月", 150, 232],
      ["4月", 98, 77],
      ["5月", 98, 77],
      ["6月", 98, 77],
      ["7月", 98, 77],
      ["9月", 98, 77]]}
      if(document.getElementById('line_chart_1'))
        expChart.cteate_chart(data,echarts.init(document.getElementById('line_chart_1')));
  }

  /**
   * 头部左边的左右跳转阿牛
   * @param clickName
   */
  top_left_click(clickName){
    switch (clickName) {
      case 'left':
        console.log('点击向左按钮');
        break;
      case 'right':
        console.log('点击向右按钮');
        break
    }
  }

  create_line_chart(){
    var color = ['#F35331','#2499F8','#3DF098','#33B734'];
    var plan_data1 = [];
    var plan_data2 = [];
    var plan_xAxis = [];
    for (var i = 1; i <= 7; i++) {
      plan_xAxis.push("3月"+i+"日");
      plan_data1.push(Math.round(Math.random() * 100));
      plan_data2.push(Math.round(Math.random() * 100));
    }
    var gauge_data_3 = {
      plan_xAxis:plan_xAxis,
      plan_data1:plan_data1,
      plan_data2:plan_data2,
      seriesData:[
        {
          name: '计划完成数',
          type: 'bar',
          itemStyle:
            {
              normal: {color: color[1]},
              emphasis: {color: color[2]}
            },
          barWidth : 12,
          data:plan_data1
        },
        {
          name: '实际完成数',
          type: 'line',
          itemStyle: {
            normal: {
              color: '#F90',
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#CCC',
                  fontSize:12
                }
              },
              lineStyle:{
                color:'#F90',
                width:4
              }
            },
            emphasis: {
              color: '#FF0'
            }
          },
          symbolSize: 4,
          data: plan_data2
        }
      ],
      legendData:['计划完成数','实际完成数']
    };

    rtm3.create_line_chart(gauge_data_3);
  }

  clickTotask(item){
    console.log('跳转到'+item.taskname)
    let queryParams = {
      deviceid:'device_boyang_01',
      is_not_fullscreen:this.is_not_fullscreen,
      url:'pages/board/expLayout',
      goTo:'',
    };
    item.taskname == 'MTS 329'?
      queryParams.goTo = 'pages/board/rtm3':
      item.taskname == 'MTS HPU'?
        queryParams.goTo = 'pages/board/rtm3a':
        item.taskname == 'TESTLINE'?
          queryParams.goTo = 'pages/board/rtm2':
          item.taskname == 'MTS MAST'?
            queryParams.goTo = 'pages/board/rtm':
            '';

    this.router.navigate([queryParams.goTo],{queryParams:queryParams});
  }

  structureChange(){
    console.log('当前显示实验室改变')
  }

  //移入
  location_over(item){
    // console.log('移入');
    item.tipShow = false; 
  }
  //移出
  location_move(item){
    // console.log('移出');
    item.tipShow = true; 
  }

  getMessageData(i){
    let message = + i + '、插入消息插入消息插入消息插入消息插入消息' ;
    $('#ul_message').prepend(`<li id="li_${i}" title="${message}"><div>${message}</div></li>`);
    $(`#ul_message li`).attr('class', 'li_c');
  }


  //全屏
  showAllTemplate(){
    const board = document.getElementsByTagName('ngx-eimboard')[0];
    const sf = <Screenfull>screenfull;
    if (sf.isEnabled){ // sf.isEnabled 布尔值，判断是否允许进入全屏！
      this.is_not_fullscreen = sf.isFullscreen;
      sf.toggle(board)
    }
  };

  ngOnDestroy(){
    clearInterval(this.messageInterval);
  }

}
