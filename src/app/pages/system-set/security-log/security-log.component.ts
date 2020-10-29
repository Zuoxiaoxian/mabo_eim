import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpserviceService } from '../../../services/http/httpservice.service';

import { SECURITY_TABLE } from '../table_setting';
import {LocalDataSource} from "@mykeels/ng2-smart-table";

import { menu_button_list } from '../../../appconfig';
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';

@Component({
  selector: 'ngx-security-log',
  templateUrl: './security-log.component.html',
  styleUrls: ['./security-log.component.scss']
})
export class SecurityLogComponent implements OnInit {
  @ViewChild("mytable") mytable: any;

  constructor(private http: HttpserviceService, private publicmethod: PublicmethodService) { }


  // source:LocalDataSource

  table_data = {
    settings: SECURITY_TABLE,
    // source: null,
    source: new LocalDataSource(),
  };

  // 前端要展示的button 主要是：增、删、改
  buttons;

  // 前端要展示的buttons 主要是：搜索、导入导出
  buttons2;

  // security_log_data 安全日志
  security_log_data = [];

  ngOnInit(): void {
    
    this.table_data.source["data"] = [
      {active: 1,
        application: "local",
        employeeid: 1,
        id: 1814,
        info: "登录成功！",
        logintime: "2020-09-22T07:05:11.259Z",
        machinename: "mabo",
        result: 1,
        severity: null,
        source: "172.18.0.4"}
    ];
    // 初始化 操作日志！
    var limit = this.table_data.settings.pager.perPage; // 每一页展示多少条数据
    this.getsecurity('sys_security_log', 'get_security_log_limit', {offset:0,limit:10, numbers:0});
    // this.getsecurity('sys_security_log', 'get_security_log', {});

    this.getbuttons();
  }


  // 得到buttons----------------------------------------------------------
  getbuttons(){
    // 根据menu_item_role得到 该页面对应的 button！
    var button_list = localStorage.getItem(menu_button_list)? JSON.parse(localStorage.getItem(menu_button_list)): false;
    if (button_list){
      this.publicmethod.get_current_pathname().subscribe(res=>{
        console.log("get_current_pathname   ", res);
        var currentmenuid = res["id"];
        var buttons = [];
        // 分离搜索、导入、导出
        var buttons2 = [];
        
        button_list.forEach(button => {
          if (currentmenuid === button["parentid"]){
            var method = button["permission"].split(":")[1];
            if ( method === "query" || method === "import" || method === "download" ){
              buttons2.push(button)
            }else{
              buttons.push(button);
            }
            
          }
        });

        // 对button进行排序 根据 title(导入、导出), 或者是 permission(menu:import)
        buttons2.forEach(b=>{
          switch (b["permission"].split(":")[1]) {
            case "query":
              b["order_"] = 0;
              break;
            case "import":
              b["order_"] = 1;
              break;
            case "download":
              b["order_"] = 2;
              break;

          }
        })

        // -----排序
        buttons2.sort(function(item1, item2){
          return item1["order_"] - item2["order_"]
        });

        this.buttons = buttons;
        this.buttons2 = buttons2;

        // console.log("-----------buttons2--------",buttons2)
      })
    }
  }


  action(actionmethod){
    // console.log("++++++++++++++++++++action(actionmethod)++++++++++++++++++++++++++++", actionmethod);
    var method = actionmethod.split(":")[1];
    // ====================================================
    switch (method) {
      // case 'import':
        // this.import();
        // break;
      case 'download':
        this.download('安全日志');
        break;
    }

  }

  //  button导出未excel
  download(title){
    this.mytable.download(title);
  }

  // 分页
  nzpageindexchange(event){
    console.log("用户--分页：", event);
    var offset = (event.current - 1) * event.nzPageSize; 
    // console.log("offset: limit", offset, event.nzPageSize)
    this.getsecurity('sys_security_log', 'get_security_log_limit', {offset:offset, limit:event.nzPageSize});
  }

  pagechange(event){
    console.log("用户--分页：", event);
    this.getsecurity('sys_security_log', 'get_security_log_limit', {offset:event.offset,limit:10});
  }


  // 请求得到 表sys_security_log中的数据！
  getsecurity(table: string, method: string, colums: object){
    this.http.callRPC(table, method, colums).subscribe((result)=>{
      // 如何动态加载页数 
      var result_data = result['result']['message'][0]; 
      if (result_data[1] && result_data[1][0] != undefined){
        // 表示初始化
        this.mytable.change_count(result_data[1][0]["numbers"]);
        this.security_log_data.push(...result_data[0])
        this.table_data.source.load(this.security_log_data);
      }else{
        this.security_log_data.push(...result_data)
        this.table_data.source.load(this.security_log_data);
      }
      console.log("分页：", this.security_log_data)
    })
 
  }

}
