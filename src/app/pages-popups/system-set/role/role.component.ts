import { Component, OnInit } from '@angular/core';

import { NbDialogRef } from '@nebular/theme';
import { HttpserviceService } from '../../../services/http/httpservice.service';
import { UserInfoService } from '../../../services/user-info/user-info.service';


import { SYSROLE, AddSuccess,  AddDanger} from '../../../appconfig';

// 验证表单！
import { AddRole } from '../form_verification';
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';

declare let layui;

declare let $;

@Component({
  selector: 'ngx-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor(protected dialogRef: NbDialogRef<RoleComponent>, private http: HttpserviceService, private userinfo: UserInfoService,
    private publicservice: PublicmethodService) { }

  ngOnInit(): void {
    var dialogRef = this.dialogRef
    var confirm = this.confirm;
    var userinfo = this.userinfo;
    var http = this.http;
    var success = this.success;
    var danger = this.danger;
    var publicservice = this.publicservice;
    
    layui.use(['layer','form','layedit'], function(){
      var layer = layui.layer;
      var form = layui.form;
      // 验证 表单
      form.verify({
        role: function(value, item){
          console.log("验证、表单: employeeno",AddRole["role"]);
          console.log("验证、表单: value",value);
          // sql注入和特殊字符 special_str
          var special_sql = AddRole['special_sql']["special_sql"];
          var special_str = AddRole['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "角色名称不能有特殊字符！"
          }
          if (! new RegExp(AddRole["role"]).test(value)){
            if (value.length > 20){
              return "角色名称最大长度不超过20！"
            }
            return "角色名称不能有特殊字符或中文字符"
          }
          

        },
        role_name: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = AddRole['special_sql']["special_sql"];
          var special_str = AddRole['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "角色名称不能有特殊字符！"
          }
          if (! new RegExp(AddRole["role_name"]).test(value)){
            if (value.length > 100){
              return "角色名称最大长度不超过100！"
            }
            return "角色名称必须为中文，且不能有特殊字符"
          }
          
        },

      })
      
      form.render("checkbox"); // 刷新checkbox
      
      //监听提交
      form.on('submit(role)', function(data){
        
        // 调用确认！
        var is_success = confirm(data.field, userinfo,http);
        if (is_success){
          dialogRef.close(true);
          // 刷新界面
          localStorage.removeItem(SYSROLE);
          success(publicservice);
          // setTimeout(() => {
          //   location.reload();
          // }, 1000);
          return false;
        }else{
          danger(publicservice);

        }
      });

      // 监听 switch开关！
      form.on('switch(filter)', function(data){
        // console.log("开关是否开启，true或者false", data.elem.checked); //开关是否开启，true或者false
      });
     
    })

  }

   // × 关闭diallog   及关闭弹框
   closedialog(){
    this.dialogRef.close(false);
  }
  
  // 确定
  confirm(data, userinfo,http){
    console.log("修改--确认",data,userinfo.getName());
    const colums = {
      role: data["role"],
      role_name: data["role_name"],
      visible: data["visible"] === "on"? 1: 0,
      roledetail: data["remark"],
      // 角色添加只有管理员可以，
      createdby: userinfo.getName()
    };
    console.log("---colums--",colums)
    const table = "role";
    const method = 'insert_role';
    http.callRPC(table, method, colums).subscribe((result)=>{
      const baseData = result['result']['message'][0];
      console.log("delete_role", baseData)
      
    })

    
    return true
  }
  // 取消
  cancel(){
    this.dialogRef.close(false);
  }

  // 展示状态
  success(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"添加成功!"});
  }
  danger(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"添加失败!"});
  }


}
