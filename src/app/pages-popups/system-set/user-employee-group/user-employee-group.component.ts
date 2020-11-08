
import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Observable } from 'rxjs';
import { HttpserviceService } from '../../../services/http/httpservice.service';
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';
import { UserInfoService } from '../../../services/user-info/user-info.service';

// 验证表单！
import { EmployeeGroup } from '../form_verification';


declare let layui;

declare let $;

@Component({
  selector: 'ngx-user-employee-group',
  templateUrl: './user-employee-group.component.html',
  styleUrls: ['./user-employee-group.component.scss']
})
export class UserEmployeeGroupComponent implements OnInit {
  @Input() rowdata: string;
  @Input() res: string;

  constructor(protected dialogRef: NbDialogRef<UserEmployeeGroupComponent>, private http: HttpserviceService, private publicmethod: PublicmethodService, private userinfo: UserInfoService) { }


  UpSuccess :any = {position: 'bottom-end', status: 'success', conent:"修改成功!"};
  UpDanger :any = {position: 'bottom-end', status: 'danger', conent:"修改失败！"}


  ngOnInit(): void {
    this.getform();
  }

  // 监听表单 employeeid,group, createdby,active
  getform(){
    var userinfo = this.userinfo;
    var getsecurity = this.getsecurity;
    var publicmethod = this.publicmethod;
    var dialogRef = this.dialogRef;
    var success = this.success;
    var danger = this.danger;

    var http = this.http;
    layui.use('form', function(){
      var form = layui.form;
      // 验证 表单
      form.verify({
        group_: function(value, item){
          console.log("验证、表单: AddEmployee",EmployeeGroup);
          console.log("验证、表单: employeeno",EmployeeGroup["group_"]);
          console.log("验证、表单: value",value);
          console.log("验证、表单: item",item);
          // sql注入和特殊字符 special_str
          var special_sql = EmployeeGroup['special_sql']["special_sql"];
          var special_str = EmployeeGroup['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "组名称不能有特殊字符！"
          }
          if (value.length > 20){
            return "组名称最大长度不超过20！"
          }
          // if (! new RegExp(EmployeeGroup["group_"]).test(value)){
          //   return "组名称不能有特殊字符或中文字符"
          // }
          
        },
        group_name: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = EmployeeGroup['special_sql']["special_sql"];
          var special_str = EmployeeGroup['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "组名称不能有特殊字符！"
          }
          
          if (value.length > 100){
            return "组名称最大长度不超过100！"
          }
          // if (! new RegExp(EmployeeGroup["group_name"]).test(value)){
          //   return "组名称不能有特殊字符"
          // }
          
          
        },
        
      })

      form.render("checkbox"); // 刷新复选框！

      form.on("submit(submit)", function(data){
        //获取表单区域所有值
        console.log("v======获取表单区域所有值",data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        console.log(data.field) //被执行事件的元素DOM对象，一般为button对象
        var send_data = data.field;
        send_data["active"] = send_data["active"] === "on"? 1: 0;
        send_data["createdby"] = userinfo.getLoginName();
        console.log("提交修改的",  send_data) //被执行事件的元素DOM对象，一般为button对象
        // 更新修改的数据！ insert_group 
        getsecurity("employee", "insert_group",send_data,http).subscribe((res)=>{
          console.log("KKKKKKKKKKK", res);
          if (res ===1 ){
            // publicmeth
            success(publicmethod)
            dialogRef.close(send_data);
            
          }else{
            danger(publicmethod)
          }
        })
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      })
    });
  }

  
  // × 关闭diallog   及关闭弹框
  closedialog(){
    this.dialogRef.close(false);
  }

  // 取消
  cancel(){
    this.dialogRef.close(false);
  }


  getsecurity(table: string, method: string, colums: object, http){
    return new Observable((res)=>{
      http.callRPC(table, method, colums).subscribe((result)=>{
        console.log("更新用户信息！", result)
        var result =  result['result']['message'][0];
        res.next(result)
      })
    })
  }

  // 展示状态
  success(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"添加成功!"});
  }
  danger(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"添加失败!"});
  }

}
