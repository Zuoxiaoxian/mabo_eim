import { Component, OnInit, ViewChild } from '@angular/core';
import { DEVICE_KPI_REPORT_SETTINGS } from '../../tongji_tablesettings';

import {LocalDataSource} from "@mykeels/ng2-smart-table";
import { PublicmethodService } from '../../../../services/publicmethod/publicmethod.service';
import { Observable } from 'rxjs';
import { HttpserviceService } from '../../../../services/http/httpservice.service';
import { ActivatedRoute } from '@angular/router';
import { DeviceKpiReport2Service } from '../device-kpi-report2-service';

declare let $;

@Component({
  selector: 'ngx-kpi-table',
  templateUrl: './kpi-table.component.html',
  styleUrls: ['./kpi-table.component.scss']
})
export class KpiTableComponent implements OnInit {
  @ViewChild("ag_Grid") agGrid:any;

  source:LocalDataSource



  // 是否导出
  isdownload: boolean = false;
  // =============================agGrid
  isloding: boolean = false;
  // kpi_for_detail localstorage 点击的行数据

  // =============================agGrid
  constructor(private publicservice: PublicmethodService, private http: HttpserviceService, private deviceservice: DeviceKpiReport2Service) { 
    
  }

  ngOnInit(): void {
    // 初始化agGrid==============
    this.getetabledata();
    // 初始化agGrid==============

    console.log("======导出=====", this.isdownload);
    // 订阅方,得到属性
    this.deviceservice.currentMessage.subscribe(res=>{
      console.log("订阅方：", res);
      if (res){
        this.download()
      }
    });

    // 订阅方得到数据
    this.deviceservice.currentData.subscribe(res=>{
      console.log("查询：", res)
    })
  }

  ngAfterViewInit(){
    
  }
  

  // plv8请求
  querst(table: string, method: string, colmun: Object){
  return new Observable((observe)=>{
    this.http.callRPC(table, method, colmun).subscribe((result)=>{
      observe.next(result);
    })

  })
  }



  download(){
    console.log("这是----download，kpi 报表");
    this.agGrid.download('设备KPI报表')
  }

  
  // =================================================agGrid

  tableDatas = {
    action: false,
    columnDefs:[ // 列字段 多选：headerCheckboxSelection checkboxSelection , flex: 1 自动填充宽度
      { field: 'devicename', headerName: '设备名称', headerCheckboxSelection: true, checkboxSelection: true, autoHeight: true, fullWidth: true, minWidth: 50,resizable: true, pinned: 'left'},
      { field: 'deviceid', headerName: '设备id',  resizable: true, minWidth: 10},
      { field: 'department', headerName: '部门信息', resizable: true, minWidth: 10},
      { field: 'starttime', headerName: '开始时间', resizable: true},
      { field: 'endtime', headerName: '结束时间', resizable: true},
      { field: 'sumruntime', headerName: '累计运行时长(h)', resizable: true, minWidth: 10},
      
      { field: 'avgtime', headerName: '平均运行时长(h)', resizable: true, minWidth: 10},
      { field: 'ratetime', headerName: '开动率(%)', resizable: true, minWidth: 10}, // 自定义设备编号！
      { field: 'belonged', headerName: '负责人', resizable: true, minWidth: 10},
      // 这个是跳转到详情kpi的 https://www.ag-grid.com/javascript-grid-cell-rendering-components/
      // { field: 'option', headerName: '详情', resizable: true, minWidth: 10, cellRenderer: 'optionCellRenderer'},
      {
        field: 'option', 
        headerName: '详情', 
        resizable: true, 
        minWidth: 10,
        pinned: 'right',
        cellRenderer: function(params){
          var div = document.createElement('div');
          div.innerHTML = `<a href=${params.value} style="text-decoration: blink;" id="btn-simple">详情</a>`
          
          return div
        }
      }

    ],
    rowData: [ // data
      { name: 'Toyota', loginname: 'Celica', role_name: 35000, groups_name: 'add', active: 1, employeeno: "123", email:"123@qq.com", phoneno: "17344996821",pictureurl: null,department: "ZJX", lastsignondate:"2020"},
      // { name: 'Ford', loginname: 'Mondeo', role_name: 32000, groups_name: 'add', active: 1, employeeno: "123", email:"123@qq.com", phoneno: "17344996821",pictureurl: null,department: "ZJX", lastsignondate:"2020" },
      // { name: 'Porsche', loginname: 'Boxter', role_name: 72000, groups_name: 'add', active: 1, employeeno: "123", email:"123@qq.com", phoneno: "17344996821",pictureurl: null,department: "ZJX", lastsignondate:"2020" }
    ]
  };

  private gridData = [];
  
  getetabledata(event?){
    var offset;
    var limit;
    console.log("event------------------------------------------------", event);
    if (event != undefined){
      offset = event.offset;
      limit = event.limit;
    }else{
      offset = 0;
      limit = 50;
    }
    var colmun = {
      start: '2020-10-1',
      end: '2020-11-21',
      offset: offset,
      limit: limit,
    }
    // 得到设备信息！
    this.http.callRPC('device', 'dev_get_kpi_device_limit', colmun).subscribe((res)=>{
      // console.log("get_menu_role", result)
      var get_employee_limit = res['result']['message'][0]
      console.log("dev_get_device---------------------------->>>", get_employee_limit);

      this.isloding = false;
      // 发布组件，编辑用户的组件
      // this.publicservice.getcomponent(Add_Edit_DeviceManageComponent);
      // this.publicservice.getmethod("optionCellRenderer");

      var message = res["result"]["message"][0];
      this.add_detail_kpi(message);
      this.gridData = [];
      this.gridData.push(...message)
      this.tableDatas.rowData = this.gridData;
      this.agGrid.init_agGrid(this.tableDatas); // 告诉组件刷新！
    })
  }

  pageabledata(event?){
    var offset;
    var limit;
    console.log("event------------------------------------------------", event);
    if (event != undefined){
      offset = event.offset;
      limit = event.limit;
    }else{
      offset = 0;
      limit = 50;
    }
    var colmun = {
      start: '2020-10-1',
      end: '2020-11-21',
      offset: offset,
      limit: limit,
    }
    // this.getsecurity('sys_security_log', 'get_security_log_limit', {offset:event.offset,limit:10});
    // 得到员工信息！{offset: offset, limit: limit}
    this.http.callRPC('device', 'dev_get_kpi_device_limit', colmun).subscribe((res)=>{
      // console.log("get_menu_role", result)
      var get_employee_limit = res['result']['message'][0]
      console.log("device---", get_employee_limit);

      this.isloding = false;
      // 发布组件，编辑用户的组件
      // this.publicservice.getcomponent(Add_Edit_DeviceManageComponent);
      // this.publicservice.getmethod("dev_delete_device");


      var message = res["result"]["message"][0];

      this.gridData.push(...message)
      this.tableDatas.rowData = this.gridData;
      this.agGrid.init_agGrid(this.tableDatas); // 告诉组件刷新！
    })
  }

  updatetabledata(event?){
    var offset;
    var limit;
    console.log("event------------------------------------------------", event, this.agGrid);
    if (event != undefined){
      offset = event.offset;
      limit = event.limit;
    }else{
      offset = 0;
      limit = 50;
    }
    var colmun = {
      start: '2020-10-1',
      end: '2020-11-21',
      offset: offset,
      limit: limit,
    }
    // this.getsecurity('sys_security_log', 'get_security_log_limit', {offset:event.offset,limit:10});
    // 得到员工信息！
    this.http.callRPC('deveice', 'dev_get_kpi_device_limit', colmun).subscribe((res)=>{
      console.log("updatetabledata\n\n", res)
      var get_employee_limit = res['result']['message'][0]
      console.log("deveice", get_employee_limit, "this.agGrid",this.agGrid);

      this.isloding = false;
      // 发布组件，编辑用户的组件
      // this.publicservice.getcomponent(Add_Edit_DeviceManageComponent);
      // this.publicservice.getmethod("dev_delete_device");
      var message = res["result"]["message"][0];
      this.gridData.push(...message)
      this.tableDatas.rowData = this.gridData;
      this.agGrid.update_agGrid(this.tableDatas); // 告诉组件刷新！
    })

  }
      

  // nzpageindexchange 页码改变的回调
  nzpageindexchange_ag(event){
    console.log("页码改变的回调", event);
    this.pageabledata(event);
  }


  // =================================================agGrid
  // { field: 'option', headerName: '详情', resizable: true, minWidth: 10, cellRenderer: 'optionCellRenderer'},
  // 添加详情link
  add_detail_kpi(datas:any[]){
    var option = '/pages/tongji/deviceKpiReport/kpidetail';
    datas.forEach(data=>{
      data["option"] =  option
    })
    
  }

  // 点击行数据 子组件调用
  clickrow(data){
    localStorage.setItem("kpi_for_detail", JSON.stringify(data))
  }



  // device_kpi_report_table_data
}
