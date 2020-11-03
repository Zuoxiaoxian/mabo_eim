import { Component, OnInit,Input } from '@angular/core';

import { LocalStorageService } from '../../../services/local-storage/local-storage.service';


import { HttpserviceService } from '../../../services/http/httpservice.service';

import { SYSROLE, UpSuccess, UpDanger } from '../../../appconfig';

declare let layui;

declare let $;

import { NbDialogRef } from '@nebular/theme';

import { UserInfoService } from '../../../services/user-info/user-info.service';
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';

// 验证表单！
import { AddRole } from '../form_verification';


@Component({
  selector: 'ngx-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  @Input() rowdata: string;

  constructor(private localstorageservice: LocalStorageService, private http: HttpserviceService,
    protected dialogRef: NbDialogRef<EditRoleComponent>,
    private userinfoservice: UserInfoService,
    private publicservice: PublicmethodService,
    ) {
   
   }

  ngOnInit(): void {
    var rowdata = JSON.parse(this.rowdata);
    rowdata['active'] =rowdata['active'] == "是"? 1: 0;
    console.log("得到的编辑角色数据：this.rowdata", this.rowdata);
    console.log("得到的编辑角色数据：rowdata", this.rowdata);


    var dialogRef = this.dialogRef
    var confirm = this.confirm;
    var http = this.http;
    var userinfoservice = this.userinfoservice;
    var publicservice = this.publicservice;
    var success = this.success;
    var danger = this.danger;

    var formdatar = {}; 
    layui.use(['layer','form','layedit'], function(){
      var layer = layui.layer;
      var form = layui.form;
      //自定义验证规则
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
      
      //监听提交
      form.on('submit(role)', function(data){
        // layer.alert(JSON.stringify(data.field), {
        //   title: '得到的编辑表单的数据'
        // })
        var colums = {
          role: data.field["role"],
          role_name: data.field["role_name"],
          active: data.field["visible"] === "on"? 1: 0,
          roledetail: data.field["remark"],
          roleid: rowdata["roleid"],
          lastupdatedby: userinfoservice.getName()
        };

        console.log("---colums--",colums)
        const table = "role";
        const method = 'update_role';
        http.callRPC(table, method, colums).subscribe((result)=>{
          console.log("更新角色数据：", result)
          const status = result['result']['message'][0];
          console.log("更新角色数据：status", status)
          if (status["code"] === 1){
            localStorage.removeItem(SYSROLE);
            dialogRef.close(true)
            success(publicservice)
            // SYSROLE
            // location.reload();
          }else{
            danger(publicservice, status["message"])
          }
        })
        return false;
      });

      form.render("checkbox"); // 刷新checkbox
      

      // 初始化表单
      formdatar["role"] = rowdata["role"];
      formdatar["role_name"] = rowdata["role_name"];
      // formdatar["roleid"] = rowdata["roleid"]; 
      formdatar["visible"] = rowdata["active"] === 1? true: false;
      formdatar["remark"] = rowdata["roledetail"];

      form.val("role", formdatar); 

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
  confirm(data){
    console.log("修改--确认", data);
    return true
  }
  // 取消
  cancel(){
    this.dialogRef.close(false);
  }


  // 展示状态
  success(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"修改成功!"});
  }
  danger(publicservice,message){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"修改失败!" + message });
  }



}
