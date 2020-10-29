import { Component, OnInit, ViewChild } from '@angular/core';
import { MAN_HOUR_KPI_REPORT_SETTINGS } from '../../tongji_tablesettings';
import {LocalDataSource} from "@mykeels/ng2-smart-table";
import { Observable } from 'rxjs';
import { HttpserviceService } from '../../../../services/http/httpservice.service';
import { ManKpiReport2Service } from '../man-hour-kpi-report2.service';

@Component({
  selector: 'ngx-man-kpi-table',
  templateUrl: './man-kpi-table.component.html',
  styleUrls: ['./man-kpi-table.component.scss']
})
export class ManKpiTableComponent implements OnInit {
  @ViewChild("mytable") mytable:any;

  // 工时KPI报表 table
  man_hour_kpi_table_data = {
    settings: MAN_HOUR_KPI_REPORT_SETTINGS,
    source: new LocalDataSource(),
  };


  constructor(private http: HttpserviceService, private mankpiservice: ManKpiReport2Service) { }

  ngOnInit(): void {
    // 初始化table
    this.inittable();

    // 订阅方,得到属性  导出!
    this.mankpiservice.currentMessage.subscribe(res=>{
      console.log("订阅方：", res);
      if (res){
        this.download()
      }
    })

    // 订阅方得到数据
    this.mankpiservice.currentData.subscribe(res=>{
      console.log("mankpiservice 查询：", res)
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
    // 得到table数据
    var table = "device";
    var methond = "dev_get_device_status";
    var colmun = {
      start:"2020-10-1",end:"2020-11-21"
    }
    this.querst(table, methond, colmun).subscribe(res=>{
      console.log("-----------------res", res)
      const rowData = res['result']['message'][0];
      if (rowData.length > 0){
        // var after_datas = this.show_table_before(rowData);
        // 根据id排序
        rowData.sort(function(data1,data2){return data1.deviceid - data2.deviceid});
        this.man_hour_kpi_table_data.source.load(rowData);
      }
    })
  }

  // 导出
  download(){
    this.mytable.download('工时KPI报表')
  }



}
