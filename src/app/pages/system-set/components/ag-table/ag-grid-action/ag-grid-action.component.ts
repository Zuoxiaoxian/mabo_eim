import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ICellRendererAngularComp } from 'ag-grid-angular';


// ===========================

import { ViewCell } from 'ng2-smart-table';

import { NbDialogService } from '@nebular/theme';

import { EditUserEmployeeComponent } from '../../../../../pages-popups/system-set/edit-user-employee/edit-user-employee.component';
import { HttpserviceService } from '../../../../../services/http/httpservice.service';
import { Observable } from 'rxjs';
import { PublicmethodService } from '../../../../../services/publicmethod/publicmethod.service';

import { EditDelTooltipComponent }  from '../../../../../pages-popups/prompt-diallog/edit-del-tooltip/edit-del-tooltip.component';

declare let layui;

declare let $;

// ===========================
@Component({
  selector: 'ngx-ag-grid-action',
  templateUrl: './ag-grid-action.component.html',
  styleUrls: ['./ag-grid-action.component.scss']
})
export class AgGridActionComponent implements OnInit, ICellRendererAngularComp {
  private params: any;

  constructor(private router: Router,private dialogService: NbDialogService, private http: HttpserviceService, private publicservice: PublicmethodService) { }

  agInit(params: any) {
    this.params = params;
  }

  ngOnInit(): void {
    // console.log("-----------------------------------------")
    // console.log("-----------------------------------------")
  }
 

  // 调用父方法
  public device_info(item) {
    console.log("-----------------item-------------------", item)
    console.log("-----------------this.params.node.-------------------", this.params.node.data);
    var rowData = this.params.node.data
    console.log("-----------------params-------------------", this.params)
    switch (item) {
      case "edit":
        this.edit(rowData);
        break;
      case "del":
        this.remove(rowData);
        break;
    }

    
    console.log("解析值：《《《《《《《《《《《《《《《《《《《《《《", this.params.context)
    
  }

  refresh(): boolean {
    return false;
  }

  ngAfterViewInit(){
    this.isactive();
    console.log("**********************************************")
    
    this.publicservice.get_current_pathname().subscribe(res=>{console.log(res)})
  }


  // 是否禁用button
  isactive(){
    var button_list = localStorage.getItem("employee_action")? JSON.parse(localStorage.getItem("employee_action")): false;
    if (button_list){
      if (button_list["edit"]){ // 编辑存在
        $(".edit-edit").attr("disabled", false);
        $(".edit-edit").attr("class", "buedit edit-edit");
      }else{
        $(".edit-edit").attr("disabled", true);
        $(".edit-edit").attr("class", "disable_edit edit-edit");
      }

      if (button_list["del"]){ // 删除存在
        $(".remove-remove").attr("disabled", false);
        $(".remove-remove").attr("class", "buremove remove-remove");
      }else{
        $(".remove-remove").attr("disabled", true);
        $(".remove-remove").attr("class", "disable_remove remove-remove");
      }

          

      // console.log("actions_list>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",button_list);

    }

  }

  edit(rowData){
    
    // 得到所有的角色--数据
    this.getsecurity('employee', 'get_rolename', {}).subscribe((res)=>{
      console.log("employee_result---role", res);
      // 根据用户id得到用户组
      // 根据用户角色得到，用户对应的组
      var column = {
        employeeid:  rowData["employeeid"] // 用户id
      }

      this.getsecurity("groups", "get_groups", column).subscribe((goups:any[])=>{
        console.log("根据用户角色得到，用户对应的组:", goups, "res", res);
        this.dialogService.open(EditUserEmployeeComponent, { closeOnBackdropClick: false,context: { rowdata: JSON.stringify(rowData), res: JSON.stringify(res), goups: JSON.stringify(goups)} })
      });

    });
    // this.dialogService.open(EditUserEmployeeComponent, { context: { rowdata: JSON.stringify(this.rowData)} })


  }

  remove(rowData){
    var http = this.http;
    var rowData = rowData;
    var e_name =  rowData["name"]
    var e_email =  rowData["email"]

    var getsecurity2 = this.getsecurity2;
    var publicservice = this.publicservice;
    var success = this.success;
    var danger = this.danger;

    this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '删除用户提示', content:   `确定要删除${e_name}吗？`, rowData: JSON.stringify(rowData)}} ).onClose.subscribe(
      name=>{
        console.log("----name-----", name);
        if (name){
          // 在这里执行删除 用户！
          getsecurity2('employee', 'delete_employee', rowData, http).subscribe((res)=>{
            console.log("delete_employee", res);
            if (res === 1){
              // publicservice.toastr(DelSuccess);
              success(publicservice)
              location.reload();
            }else{
              // publicservice.toastr(DellDanger);
              danger(publicservice)
            }
          });
        }
      }
    );

    
  }

  // 展示状态
  success(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"删除成功!"});
  }
  danger(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"删除失败!"});
  }

  // 请求得到 表get_employee中的数据！
  getsecurity(table: string, method: string, colums: object){
    return new Observable((res)=>{

      this.http.callRPC(table, method, colums).subscribe((result)=>{
        var employee_result =  result['result']['message'][0];
        console.log("employee_result", employee_result);
        res.next(employee_result)
      })
    })
  }
  // 请求得到 表get_employee中的数据！
  getsecurity2(table: string, method: string, colums: object, http){
    return new Observable((res)=>{

      http.callRPC(table, method, colums).subscribe((result)=>{
        var employee_result =  result['result']['message'][0];
        console.log("employee_result", employee_result);
        res.next(employee_result)
      })
    })
  }



}
