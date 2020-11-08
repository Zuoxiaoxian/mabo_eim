import { Component, OnInit } from '@angular/core';

import { menu_button_list } from '../../../appconfig';
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';

@Component({
  selector: 'ngx-operation-log',
  templateUrl: './operation-log.component.html',
  styleUrls: ['./operation-log.component.scss']
})
export class OperationLogComponent implements OnInit {

  constructor(private publicmethod: PublicmethodService) { }

   // 前端要展示的button 主要是：增、删、改
   buttons;

   // 前端要展示的buttons 主要是：搜索、导入导出
   buttons2;


  ngOnInit(): void {
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
    // this.agGrid.download(title);
  }


}
