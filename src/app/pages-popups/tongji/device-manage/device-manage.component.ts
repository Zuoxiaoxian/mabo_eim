import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { from } from 'rxjs';
import { HttpserviceService } from '../../../services/http/httpservice.service';
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';

// 验证表单
import { Device } from '../form_verification';


declare let layui;

declare let $;

@Component({
  selector: 'ngx-device-manage',
  templateUrl: './device-manage.component.html',
  styleUrls: ['./device-manage.component.scss']
})
export class DeviceManageComponent implements OnInit {

  @Input() title: string;
  @Input() content: string; // 'true': 表示edit 'false':表示add
  @Input() rowData: string;
  // 加载
  loading;
  constructor(private dialogRef: NbDialogRef<DeviceManageComponent>, private http: HttpserviceService, private publicservice: PublicmethodService) { }
  ngOnInit(): void {
  }
  
  ngAfterViewInit(){
    console.log("编辑----添加",this.rowData)
    console.log("编辑----添加  content---",this.content)
    // form 表单
    this.layuiform();
  }

  // form表单
  layuiform(){
    var content = JSON.parse(this.content); // 'true': 表示edit 'false':表示add
    var rowData = this.rowData;
    var http = this.http;
    var dialogRef = this.dialogRef;
    var publicservice = this.publicservice;
    var editsuccess = this.editsuccess;
    var editdanger = this.editdanger;
    var addsuccess = this.addsuccess;
    var adddanger = this.adddanger;

    layui.use(['layer','form','layedit', 'laydate'], function(){
      var layer = layui.layer;
      var form = layui.form;
      var laydate = layui.laydate; // 时间日期
      form.render(); // 刷新all
      form.render('select'); // 刷新select
      form.render("checkbox"); // 刷新checkbox
      form.render();
      //自定义验证规则
      // 验证 表单
      form.verify({
        // 设备名称 验证：devicename character(20)
        devicename: function(value, item){
          console.log("验证、表单: employeeno",Device["devicename"]);
          console.log("验证、表单: value",value);
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
         
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "设备名称不能有特殊字符！"
          }
          if (value.length > 20){
            return "设备名称最大长度不超过20！"
          }

          // if (! new RegExp(Device["devicename"]).test(value)){
          //   if (value.length > 20){
          //     return "设备名称最大长度不超过20！"
          //   }
          //   return "设备名称不能有特殊字符"
          // }
         

        },
        // 设备编号 验证：deviceno character(100)
        deviceno: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "设备编号不能有特殊字符！"
          }
          if (new RegExp(Device["deviceno"]).test(value)){
            if (value.length > 100){
              return "设备编号最大长度不超过100！"
            }
            return "设备编号不能有中文！"
          }
          
        },
        // 资产编号 验证：assetno character(50)
        assetno: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "资产编号不能有特殊字符！"
          }

          if (new RegExp(Device["assetno"]).test(value)){
            if (value.length > 50){
              return "资产编号最大长度不超过100！"
            }
            return "资产编号不能有中文！"
          }
          
        },
        // 出厂编号 验证：factoryno character(50)
        factoryno: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "出厂编号不能有特殊字符！"
          }

          if (new RegExp(Device["factoryno"]).test(value)){
            if (value.length > 50){
              return "出厂编号最大长度不超过100！"
            }
            return "出厂编号不能有中文！"
          }
          
        },
        
        // 购置日期 验证：purchaseon character(50)
        purchaseon: function(value, item){
          console.log("验证、表单: value",value);
          // if (! new RegExp(Device["factoryno"]).test(value)){
          //   if (value.length > 50){
          //     return "出场编号最大长度不超过100！"
          //   }
          //   return "出场编号必须是数字、字母，且不能有特殊字符"
          // }
        },

        // 供应商 验证：supplier character(50)
        supplier: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "供应商不能有特殊字符！"
          }
          if (value.length > 50){
            return "供应商最大长度不超过50！"
          }

          // if (! new RegExp(Device["supplier"]).test(value)){
          //   if (value.length > 50){
          //     return "供应商最大长度不超过50！"
          //   }
          //   return "供应商必须是中文、字母，且不能有特殊字符"
          // }
          
        },
        // 存放地点 验证：location character(50)
        location: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "存放地点不能有特殊字符！"
          }
          if (value.length > 50){
            return "存放地点最大长度不超过50！"
          }
          // if (! new RegExp(Device["location"]).test(value)){
          //   if (value.length > 50){
          //     return "存放地点最大长度不超过50！"
          //   }
          //   return "存放地点必须是数字、字母，且不能有特殊字符"
          // }
          

        },
        // 使用部门 验证：department character(50)
        department: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "使用部门不能有特殊字符！"
          }
          if (value.length > 50){
            return "使用部门最大长度不超过50！"
          }

          // if (! new RegExp(Device["department"]).test(value)){
          //   if (value.length > 50){
          //     return "使用部门最大长度不超过50！"
          //   }
          //   return "使用部门必须是中文、字母，且不能有特殊字符"
          // }
          
        },
        // 科室 验证：groups character(50)
        groups: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "科室不能有特殊字符！"
          }
          if (value.length > 50){
            return "科室最大长度不超过50！"
          }
          // if (! new RegExp(Device["groups"]).test(value)){
          //   if (value.length > 50){
          //     return "科室最大长度不超过50！"
          //   }
          //   return "科室必须是中文、字母，且不能有特殊字符"
          // }
          
        },
        // 归属人 验证：belonged character(50)
        belonged: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "归属人不能有特殊字符！"
          }
          if (value.length > 50){
            return "归属人最大长度不超过50！"
          }
          // if (! new RegExp(Device["belonged"]).test(value)){
          //   if (value.length > 50){
          //     return "归属人最大长度不超过50！"
          //   }
          //   return "归属人必须是中文、字母，且不能有特殊字符"
          // }
          
        },
        // 设备状态 验证：devicestatus character(50)
        devicestatus: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "设备状态不能有特殊字符！"
          }
          if (value.length > 4){
            return "设备状态最大长度不超过4！"
          }
          // if (! new RegExp(Device["devicestatus"]).test(value)){
          //   if (value.length > 4){
          //     return "设备状态最大长度不超过4！"
          //   }
          //   return "设备状态必须是数字，且不能有特殊字符"
          // }
          
        },
        // 创建人 验证：createdby character(50)
        createdby: function(value, item){
          // sql注入和特殊字符 special_str
          var special_sql = Device['special_sql']["special_sql"];
          var special_str = Device['special_sql']["special_str"];

          var sql = special_sql.test(value);
          var str = special_str.test(value);
          if(sql){
            return "防止SQL注入，请不要输入关于sql语句的特殊字符！"
          }
          if (! str){
            return "创建人不能有特殊字符！"
          }
          if (value.length > 50){
            return "创建人最大长度不超过50！"
          }
          // if (! new RegExp(Device["createdby"]).test(value)){
          //   if (value.length > 50){
          //     return "创建人最大长度不超过50！"
          //   }
          //   return "创建人必须是字母、中文，且不能有特殊字符"
          // }
          
        },

      })


      

      // form.render("checkbox"); // 刷新checkbox

      // 是编辑还是新增
      var success;
      var danger;
      var method;
      if (content){ // true: 表示edit
        console.log("---------------------------------表示edit---------------------------------------------")
        success = editsuccess;
        danger = editdanger;
        
        // 注意这里有2个，1[{}],2{}
        // var formdatar = JSON.parse(rowData).length != 1? JSON.parse(rowData): JSON.parse(rowData)[0];
        var formdatar = JSON.parse(rowData)[0];
        // 初始化表单
        form.val("device", formdatar); 
        // 初始化createdon（创建时间）、purchaseon (购置日期)
        console.log('----------------------编辑---------------', formdatar)
        var createdon = formdatar["createdon"];
        var purchaseon = formdatar["purchaseon"];
        method = "dev_update_device";
      }else{ // false: 表示add
        method = "dev_insert_device";
        success = addsuccess;
        danger = adddanger;
      }

      //日期时间选择器
      laydate.render({
        elem: '#createdon'
        ,type: 'datetime'
        // 初始化
        ,value: createdon
        ,isInitValue: true
      });
      laydate.render({
        elem: '#purchaseon'
        ,type: 'datetime'
        // 初始化
        ,value: purchaseon
        ,isInitValue: true
      });

      //监听提交
      form.on('submit(device)', function(data){
        if (content){
          data.field.id = JSON.parse(rowData)[0].id;
        }
        // layer.alert(JSON.stringify(data.field), {
        //   title: '得到的编辑表单的数据'
        // })
        console.log('data.field["active"]', data.field["active"])
        if (data.field["active"] != undefined){
          data.field["active"] = 1;
        }else{
          data.field["active"] = 0;
        }
        var colums = data.field;

        console.log("---colums--",colums, method)
        const table = "device";
        http.callRPC(table, method, colums).subscribe((result)=>{
          console.log("更新设备数据：", result)
          const status = result['result']['message'][0];
          if (status === 1){
            success(publicservice)
            dialogRef.close(true);
            // setTimeout(() => {
            //   location.reload();
            // }, 1000);
          }else{
            danger(publicservice)
          }
        })
        return false;
      });

      

      // // 监听 switch开关！
      // form.on('switch(filter)', function(data){
      //   // console.log("开关是否开启，true或者false", data.elem.checked); //开关是否开启，true或者false
      // });
     
    })

  }

  // × 关闭diallog   及关闭弹框
  closedialog(){
    this.dialogRef.close(false);
  }
  
  // 取消
  cancel(){
    this.dialogRef.close(false);
  }

  // 展示状态
  editsuccess(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"编辑成功!"});
  }
  editdanger(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"编辑失败!"});
  }

  addsuccess(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"添加成功!"});
  }
  adddanger(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"添加失败!"});
  }


}
