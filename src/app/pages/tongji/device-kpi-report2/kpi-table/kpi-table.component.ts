import { Component, OnInit, ViewChild } from '@angular/core';
import { DEVICE_KPI_REPORT_SETTINGS } from '../../tongji_tablesettings';

import {LocalDataSource} from "@mykeels/ng2-smart-table";
import { PublicmethodService } from '../../../../services/publicmethod/publicmethod.service';
import { Observable } from 'rxjs';
import { HttpserviceService } from '../../../../services/http/httpservice.service';
import { ActivatedRoute } from '@angular/router';
import { DeviceKpiReport2Service } from '../device-kpi-report2-service';


@Component({
  selector: 'ngx-kpi-table',
  templateUrl: './kpi-table.component.html',
  styleUrls: ['./kpi-table.component.scss']
})
export class KpiTableComponent implements OnInit {
  @ViewChild("mytable") mytable:any;

  source:LocalDataSource

  // 设备报表KPI报表 table数据
  device_kpi_report_table_data = {
    settings: DEVICE_KPI_REPORT_SETTINGS,
    source: new LocalDataSource(),
  };

  isdownload: boolean = false;
  constructor(private publicservice: PublicmethodService, private http: HttpserviceService, private deviceservice: DeviceKpiReport2Service) { 
    
  }

  ngOnInit(): void {
    // 初始化button
    // 初始化table
    this.inittable();
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

  // plv8请求
  querst(table: string, method: string, colmun: Object){
  return new Observable((observe)=>{
    this.http.callRPC(table, method, colmun).subscribe((result)=>{
      observe.next(result);
    })

  })
  }

  // 初始化table
  inittable(){
    var current_range = this.publicservice.selectedMoments;
    // 得到table数据
    var table = "device";
    var methond = "dev_get_kpi_device";
    // var colmun = {
    //   start: current_range[0],
    //   end: current_range[1]
    // }
    var colmun = {
      start: '2020-10-1',
      end: '2020-11-21'
    }
    console.log("----colmun----",colmun)
    this.querst(table, methond, colmun).subscribe(res=>{
      console.log("-----------------res", res)
      const rowData = res['result']['message'][0];
      if (rowData.length > 0){
        // var after_datas = this.show_table_before(rowData);
        // 根据id排序
        rowData.sort(function(data1,data2){return data1.deviceid - data2.deviceid});
        this.device_kpi_report_table_data.source.load(rowData);
      }
    })
  };

  download(){
    console.log("这是----download，kpi 报表");
    this.mytable.download('设备KPI报表')
  }

  


  // device_kpi_report_table_data
}
