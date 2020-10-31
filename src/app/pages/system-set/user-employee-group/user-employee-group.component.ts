import { Component, OnInit, ViewChild } from '@angular/core';


import { SYSMENU,menu_button_list,employeegroup_action } from '../../../appconfig';
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';

import { EMPLOYEEGROUP_TABLE } from '../table_setting';
import {LocalDataSource} from "@mykeels/ng2-smart-table";
import { HttpserviceService } from '../../../services/http/httpservice.service';
import { Observable } from 'rxjs';
import { NbDialogService } from '@nebular/theme';


import { EditUserEmployeeGroupComponent } from '../../../pages-popups/system-set/edit-user-employee-group/edit-user-employee-group.component';
import { UserEmployeeGroupComponent as AddUserEmployeeGroupComponent} from '../../../pages-popups/system-set/user-employee-group/user-employee-group.component';
import { EditDelTooltipComponent } from '../../../pages-popups/prompt-diallog/edit-del-tooltip/edit-del-tooltip.component';



declare let $;
declare let layui;

@Component({
  selector: 'ngx-user-employee-group',
  templateUrl: './user-employee-group.component.html',
  styleUrls: ['./user-employee-group.component.scss']
})
export class UserEmployeeGroupComponent implements OnInit {
  @ViewChild("agGrid") agGrid: any;


  table_data = {
    settings: EMPLOYEEGROUP_TABLE,
    // source: null,
    source: new LocalDataSource(),
  };

  // 前端要展示的button 主要是：增、删、改
  buttons;

  // 前端要展示的buttons 主要是：搜索、导入导出
  buttons2;

  // 要删除、修改的行数据 
  rowdata;

  // 加载table
  isloding = false;
 


  DelSuccess :any = {position: 'bottom-right', status: 'success', conent:"删除成功!"};
  DellDanger :any = {position: 'bottom-right', status: 'danger', conent:"删除失败！"}
  GetDanger :any = {position: 'top-right', status: 'waring', conent:"获取用户组！"}


  constructor(private publicmethod: PublicmethodService, private http: HttpserviceService, private dialogService: NbDialogService) { 
    // this.updatabutton_list();
    // 改界面具有的button
    this.getbuttons();
    
  }

  ngOnInit(): void {

    // ====================================agGrid
      // 初始化table
      this.getetabledata();
    // ====================================agGrid
    
  }

  // 调用plv8函数！
  getsecurity_edit(table: string, method: string, colums: object){
    return new Observable((res)=>{
      this.http.callRPC(table, method, colums).subscribe((result)=>{
        console.log("用户组 调用plv8函数", result);
        res.next(result)
      })
    })
  }

  getsecurity_edit2(table: string, method: string, colums: object, http){
    return new Observable((res)=>{

      http.callRPC(table, method, colums).subscribe((result)=>{
        console.log("删除用户组： ", result);
        var employee_result =  result['result']['message'][0];
        console.log("employee_result", employee_result);
        res.next(employee_result)
      })
    })
  }




  // 得到buttons----------------------------------------------------------
  
  getbuttons(){
    // 根据menu_item_role得到 该页面对应的 button！
    var button_list = localStorage.getItem(menu_button_list)? JSON.parse(localStorage.getItem(menu_button_list)): false;
    if (button_list){
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      console.log(button_list)
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
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

        console.log("-----------buttons2--------",buttons2)

        // ====================================================
        var isactions = {};
        buttons.forEach(button=>{
          if (button["permission"].search("add") === -1){
            if (button["permission"].search("edit") === -1){
              // 编辑不存在
              // isactions.push({edit:false})
            }else{ // 编辑存在
              isactions["edit"] = true
            }
            if (button["permission"].search("del") === -1){
              // isactions.push({del: false})
            }else{
              isactions["del"] = true
            }
          }
        })

        if (!isactions["edit"]){
          isactions["edit"] = false
        }
        if (!isactions["del"]){
          isactions["del"] = false
        }
        localStorage.setItem(employeegroup_action, JSON.stringify(isactions));
        console.log("_________________________________-isactions---------________________",isactions)
      })
    }
  }


  action(actionmethod){
    console.log("++++++++++++++++++++action(actionmethod)++++++++++++++++++++++++++++", actionmethod);
    var method = actionmethod.split(":")[1];
    // ====================================================
    console.log("--------------->method", method)
    switch (method) {
      case 'add':
        this.add();
        break;
      case 'del':
        this.del();
        break;
      case 'edit':
        this.edit();
        break;
      case 'query':
        this.query();
        break;
      case 'import':
        this.import();
        break;
      case 'download':
        this.download('用户组管理')
        break;
    }

  }

  // button 新增用户组
  add(){
    this.dialogService.open(AddUserEmployeeGroupComponent, {closeOnBackdropClick: false,});
  }

  // button 编辑用户组
  edit(){
    // var rowdata = this.rowdata;
    // 得到选中的aggrid rowdatas
    var rowdata = this.agGrid.getselectedrows();
    console.log("=====this.rowdata",rowdata);
    if ( rowdata.length === 0){
      console.log("没有选中行数据", rowdata);
      // 提示选择行数据
      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '编辑用户组提示', content:   `请选择要需要修改的的行数！`}} ).onClose.subscribe(
        name=>{console.log("----name-----", name)}
      );
      // this.dialogService.open(EditUserEmployeeGroupComponent, { context: { rowdata: JSON.stringify(this.rowdata), res: JSON.stringify(res)} })
    }else if (rowdata.length > 1){
      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '编辑用户组提示', content:   `请选择一条要需要修改的的行数`}} ).onClose.subscribe(
        name=>{console.log("----name-----", name)}
      );
      
    }
    else{
      var rowdata_ = rowdata[0]
      console.log("---------------------rowdata_===",rowdata_)
      rowdata_["active"] = rowdata_["active"] === "是" || rowdata_["active"] === 1? 1 :0;
      console.log("---------------------rowdata_===",rowdata_)
      this.dialogService.open(EditUserEmployeeGroupComponent, { closeOnBackdropClick: false,context: { rowdata: JSON.stringify(rowdata_)} })

    }
  }

  // button删除用户组
  del(){
    var rowdata = this.rowdata;

    if (rowdata === undefined || rowdata["selected"].length === 0){
      console.log("没有选中行数据", rowdata);
      // 提示选择行数据
      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '删除用户组提示', content:   `请选择要需要删除的行！`}} ).onClose.subscribe(
        name=>{console.log("----name-----", name)}
      );
      // this.dialogService.open(EditUserEmployeeGroupComponent, { context: { rowdata: JSON.stringify(this.rowdata), res: JSON.stringify(res)} })
    }else {
      var rowData = rowdata["selected"]
      var rownum = rowData.length > 1? "这些": "这条";
      var getsecurity_edit2 = this.getsecurity_edit2;
      var publicservice = this.publicmethod;
      var http = this.http;
      var success = this.success;
      var danger = this.danger;
      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '删除用户组提示', content:   `确定要删除${rownum}数据吗？`,rowData: JSON.stringify(rowData)}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
          if (name){
            try {
              rowData.forEach(rd => {
                console.log("--------------------------<<<<<<<<<<<<<<<", rd)
                getsecurity_edit2('groups', 'delete_group', rd, http).subscribe((res)=>{
                  console.log("delete_group", res);
                  if (res === 1){
                  }else{
                    // DelDanger["conent"] = res
                    // publicservice.toastr(DelDanger);
                    danger(publicservice)
                    throw 'error, 删除失败！'
                  }
                });
              });
              setTimeout(() => {
                location.reload();
              }, 1000);
              // publicservice.toastr(DelSuccess);
              success(publicservice)
            }catch(err){
              // publicservice.toastr(DelDanger)
              danger(publicservice)
            }
          }
        }
      );
      // this.dialogService.open(EditUserEmployeeGroupComponent, { context: { rowdata: JSON.stringify(rowdata)} })

    }
  }


  // button 搜索按钮
  query(){
    var employeenumber = $("#employeenumber").val();
    if (employeenumber != ""){
      console.log("button 搜索按钮", employeenumber, "--");
    }
  }

  // button 导入excel
  import(){
    
  }

  //  button导出未excel
  download(title){
    this.agGrid.download(title);
  }

  // 点击行执行
  runParent(rowdata){
    console.log("点击行执行：", rowdata)
    if (rowdata["isSelected"]){
      
      this.getsecurity_edit("group_", "get_group", {}).subscribe(res=>{
        var result =  res['result']['message'][0];
        if (result){
          result.forEach(r => {
            r["active"] = r["active"] === 1 ? '是': '否';
          });
          result.forEach(element => {
            if (element["groupid"] === rowdata["selected"][0]["groupid"]){
              this.rowdata = rowdata;
              console.log("点击行执行：222", rowdata)
            }
          });
        }else{
          // 获取用户组失败！
          this.publicmethod.toastr(this.GetDanger);
        }
      })

    }
  }
  
  

  // 编辑
  uprole(uprow){
    console.log("编辑行执行：", uprow)
  }
  // 添加
  addroleIcon(addrow){
    console.log("添加行执行：", addrow)
  }


  // 更新button_list！
  updatabutton_list(){
    this.publicmethod.getMenu().subscribe((data)=>{
      const colums = {
        languageid: this.http.getLanguageID(),
        roles: data
      };
      console.log("---更新button_list！--",colums)
      const table = "menu_item";
      const method = "get_menu_by_roles";
      this.http.callRPC(table, method, colums).subscribe((result)=>{
        console.log("---更新button_list！--",result)

        const baseData = result['result']['message'][0];
        var button_list = [];
        baseData.forEach(element => {
          if (element["type"] === 2 ){
            button_list.push(element);
          }
        });
        localStorage.setItem(menu_button_list, JSON.stringify(button_list));
      })

      


    });
    
  }

  // 展示状态
  success(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"删除成功!"});
  }
  danger(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"删除失败!"});
  }


  // =================================================agGrid

  tableDatas = {
    action: true,
    columnDefs:[ // 列字段 多选：headerCheckboxSelection checkboxSelection , flex: 1 自动填充宽度
      { field: 'group', headerName: '组名称', headerCheckboxSelection: true, checkboxSelection: true, autoHeight: true, fullWidth: true, minWidth: 50,resizable: true},
      { field: 'group_name', headerName: '用户组英文名称',  resizable: true, flex: 1},
      { field: 'createdon', headerName: '创建时间', resizable: true, flex: 1},
      { field: 'createdby', headerName: '创建人', resizable: true, flex: 1},
      { field: 'active', headerName: '是否启用', resizable: true, flex: 1},
      // { field: 'options', headerName: '操作', resizable: true, flex: 1},
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
    // this.getsecurity('sys_security_log', 'get_security_log_limit', {offset:event.offset,limit:10});
    // 得到员工信息！
    // this.http.callRPC('group_', 'get_group', {offset: offset, limit: limit}).subscribe((res)=>{
    this.http.callRPC('group_', 'get_group', {}).subscribe((res)=>{
      // console.log("get_menu_role", result)
      var get_employee_limit = res['result']['message'][0]
      console.log("get_employee_limit", get_employee_limit);

      this.isloding = false;
      // 发布组件，编辑用户的组件
      this.publicmethod.getcomponent(EditUserEmployeeGroupComponent);
      this.publicmethod.getmethod("delete_group");


      var message = res["result"]["message"][0];
      if (message){
        message.forEach(r => {
          r["active"] = r["active"] === 1 ? '是': '否';
        });
        console.log("初始化用户组表！", message)
      }
      this.gridData.push(...message)
      this.tableDatas.rowData = this.gridData;
      this.agGrid.update_agGrid(this.tableDatas); // 告诉组件刷新！
    })
  }

  // nzpageindexchange 页码改变的回调
  nzpageindexchange(event){
    console.log("页码改变的回调", event);
    this.getetabledata(event);
  }


  // =================================================agGrid


}
