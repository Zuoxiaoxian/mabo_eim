import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpserviceService } from '../../../services/http/httpservice.service';


import { NbDialogService } from '@nebular/theme';
import { UserEmployeeComponent as AddUserEmployeeComponent } from '../../../pages-popups/system-set/user-employee/user-employee.component';

import { EditUserEmployeeComponent } from '../../../pages-popups/system-set/edit-user-employee/edit-user-employee.component';

import { EditDelTooltipComponent } from '../../../pages-popups/prompt-diallog/edit-del-tooltip/edit-del-tooltip.component';

import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';

import { SYSMENU,menu_button_list,employee_action } from '../../../appconfig';
import { Observable } from 'rxjs';


declare let $;
declare let layui;

import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
  selector: 'ngx-user-employee',
  templateUrl: './user-employee.component.html',
  styleUrls: ['./user-employee.component.scss']
})
export class UserEmployeeComponent implements OnInit {
  @ViewChild("agGrid") agGrid: any;


  constructor(private http: HttpserviceService, private dialogService: NbDialogService, 
    private publicmethod: PublicmethodService) { 

      // 得到用户组和角色 get_groupname get_rolename
      this.http.callRPC("role", "get_rolename",{}).subscribe(roles=>{
        this.get_rolename = roles["result"]["message"][0];
        localStorage.setItem("employee_rolename", JSON.stringify(this.get_rolename))
      });
      this.http.callRPC("role", "get_groupname",{}).subscribe(roles=>{
        this.get_groupname = roles["result"]["message"][0];
        localStorage.setItem("employee_groupname", JSON.stringify(this.get_groupname))
      });

    }





  // 全部角色、用户组
  get_rolename;
  get_groupname;


  // 前端要展示的button 主要是：增、删、改
  buttons;

  // 前端要展示的buttons 主要是：搜索、导入导出
  buttons2;

  // 要删除、修改的行数据 
  rowdata;


  // 分页
  employee_data = [];

  // isloding 加载agGrid
  isloding = true;
  

  DelSuccess :any = {position: 'bottom-right', status: 'success', conent:"删除成功!"};
  DellDanger :any = {position: 'bottom-right', status: 'danger', conent:"删除失败！"}

  importdata: AOA = [[1,2], [3,4]];
  
  
  ngOnInit(): void {

    // ====================================agGrid
      // 初始化table
      this.getemployee();

    // ====================================agGrid

    
    // 得到员工，并在table中展示！
    // this.getsecurity('employee', 'get_employee', {});
    // this.getsecurity('employee', 'get_employee_limit', {offset:0,limit:10,numbers:0});
    // 得到该页面下的button
    this.getbuttons();
    this.init_employee_group();
    
  }

  ngAfterViewInit(){
    // 初始化table
    
  }

  ngOnDestory(){
    localStorage.removeItem(SYSMENU);
    localStorage.removeItem("employee_rolename");
    localStorage.removeItem("employee_groupname");
  }


  // =================================================agGrid

  tableDatas = {
    action: true,
    columnDefs:[ // 列字段 多选：headerCheckboxSelection checkboxSelection
      { field: 'name', headerName: '姓名', headerCheckboxSelection: true, checkboxSelection: true, autoHeight: true, fullWidth: true, minWidth: 50,},
      { field: 'loginname', headerName: '域账号',  },
      { field: 'role_name', headerName: '角色名称', },
      { field: 'groups_name', headerName: '用户组', },
      { field: 'active', headerName: '是否启用', },
      { field: 'employeeno', headerName: '编号', },
      { field: 'email', headerName: '邮箱', },
      { field: 'phoneno', headerName: '手机号', },
      { field: 'pictureurl', headerName: '头像地址', },
      { field: 'department', headerName: '部门', },
      { field: 'lastsignondate', headerName: '最后登录时间', },
      
    ],
    rowData: [ // data
      { name: 'Toyota', loginname: 'Celica', role_name: 35000, groups_name: 'add', active: 1, employeeno: "123", email:"123@qq.com", phoneno: "17344996821",pictureurl: null,department: "ZJX", lastsignondate:"2020"},
      // { name: 'Ford', loginname: 'Mondeo', role_name: 32000, groups_name: 'add', active: 1, employeeno: "123", email:"123@qq.com", phoneno: "17344996821",pictureurl: null,department: "ZJX", lastsignondate:"2020" },
      // { name: 'Porsche', loginname: 'Boxter', role_name: 72000, groups_name: 'add', active: 1, employeeno: "123", email:"123@qq.com", phoneno: "17344996821",pictureurl: null,department: "ZJX", lastsignondate:"2020" }
    ]
  };

  private gridData = [];
  
  getemployee(event?){
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
    // 得到员工信息！
    this.http.callRPC('emeployee', 'get_employee_limit', {offset: offset, limit: limit}).subscribe((res)=>{
      // console.log("get_menu_role", result)
      var get_employee_limit = res['result']['message'][0]
      console.log("get_employee_limit", get_employee_limit);

      this.isloding = false;
      // 发布组件，编辑用户的组件 和删除所需要的 plv8 函数 delete_employee
      this.publicmethod.getcomponent(EditUserEmployeeComponent);
      this.publicmethod.getmethod("delete_employee");

      var message = res["result"]["message"][0];
      if( message.code === 0){
        // 表示token过期了，跳转到 / 
      }
      // 处理data
      var result_data = message.message.reverse();
      if (result_data[0] && result_data[0][0]["numbers"]){
        var other_result_data = result_data.splice(1, result_data.length);
      }else{
        var other_result_data = result_data;
      }
      var other_result_data_after = [];
      other_result_data.forEach(result => {
        other_result_data_after = other_result_data_after.concat(result);
      });
      console.log("-------other_result_data_after-----------",other_result_data_after);
      // -----------------------
      var result = other_result_data_after;
      var employee_list = [];
      for (let item of result){
        var rids = [];
        var items_dict = {};
        var role_name_lists = []; 
        var groups_name_lists = []; 
        for (let element of result){
          var rid_name = {}
          if (item["employeeid"] === element["employeeid"]){
            // items_dict["active"] = element["active"] == 1?'是': "否";
            items_dict["active"] = element["active"] == 1?'是': "否";
            items_dict["company"] = element["company"];
            items_dict["department"] = element["department"];
            items_dict["email"] = element["email"];
            items_dict["employeeid"] = element["employeeid"];
            items_dict["employeeno"] = element["employeeno"];
            items_dict["facility"] = element["facility"];
            items_dict["loginname"] = element["loginname"];
            items_dict["name"] = element["name"];
            items_dict["phoneno"] = element["phoneno"];
            items_dict["pictureurl"] = element["pictureurl"];
            items_dict["rid"] = element["rid"];
            items_dict["groupid"] = element["groupid"];
            
            items_dict["role"] = element["role"];
            items_dict["lastsignondate"] = element["lastsignondate"];
            
            items_dict["role_name"] = element["role_name"];

            rid_name["role"] = element["role"];
            rid_name["rid"] = element["rid"];
            var role_name_str: string | null = element["role_name"] ? element["role_name"]: null;
            var groups_name_str: string | null = element["groups"] ? element["groups"]: null;
            // rid_name["role_name"] =  role_name_str.replace(/\s/g, "");
            role_name_lists.push(role_name_str)
            groups_name_lists.push(groups_name_str)
            rids.push(rid_name)
            items_dict["rids"] = rids;
            items_dict["role_name"] = role_name_lists;
            items_dict["groups_name"] = groups_name_lists;
            continue
          }else{
            
          }
        }
        // 处理 role_names，将以第一， 去掉！
        employee_list.push(items_dict)
      }

      // 列表去重！
      var unique_result = unique(employee_list, "employeeid")

      unique_group_role(unique_result, "groups_name");
      unique_group_role(unique_result, "role_name");

      console.log("***************************************************")
      console.log("*******************unique_result****************", unique_result)
      this.gridData.push(...unique_result)
      this.tableDatas.rowData = this.gridData;
      
      console.log("***************************************************")
      function unique(arr, field) { // 根据employeeid去重
        const map = {};
        const res = [];
        for (let i = 0; i < arr.length; i++) {
          if (!map[arr[i][field]]) {
            map[arr[i][field]] = 1;
            res.push(arr[i]);
          }
        }
        return res;
      };

      // groups_name、role_name去重
      function unique_group_role(arr, fild){
        arr.forEach(element => {
          var arr_list = [];
          var groups_name_list = element[fild];
          groups_name_list.forEach(groups => {
            if(arr_list.indexOf(groups) === -1){
              arr_list.push(groups)
            }
          });
          // arr_list [] 改为 str
          element[fild] = arr_list.join(";")
        });
      }

    })
  }

  // nzpageindexchange 页码改变的回调
  nzpageindexchange(event){
    console.log("页码改变的回调", event);
    this.getemployee(event);
  }


  // =================================================agGrid
 
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

        console.log("-----------buttons--------",buttons);
        console.log("-----------buttons2--------",buttons2);


        

        
        // =======================================================
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
        localStorage.setItem(employee_action, JSON.stringify(isactions));
        console.log("_________________________________-isactions---------________________",isactions)
      })
    }
  }

 

  // 初始化用户组表！
  init_employee_group(){
    this.getsecurity_edit("group_", "get_group", {}).subscribe(res=>{
      var result =  res;
      if (result){
        
        console.log("初始化用户组表！", result);
        localStorage.setItem("employee_group_all_", JSON.stringify(result))
      }else{
        // 获取用户组失败！
        localStorage.setItem("employee_group_all_", JSON.stringify([]))
      }
    })
  }

  // 请求得到 表get_employee中的数据！
  getsecurity_edit(table: string, method: string, colums: object){
    return new Observable((res)=>{
      this.http.callRPC(table, method, colums).subscribe((result)=>{
        var employee_result =  result['result']['message'][0];
        res.next(employee_result)
      })
    })
  }

  getsecurity_edit2(table: string, method: string, colums: object, http){
    return new Observable((res)=>{

      http.callRPC(table, method, colums).subscribe((result)=>{
        var employee_result =  result['result']['message'][0];
        console.log("employee_result", employee_result);
        res.next(employee_result)
      })
    })
  }


  // 将得到的employee的数据，处理成编辑、添加需要的数据！
  edit_add_emplyee_data(result){
    console.log("result", result)
    var employee_list = [];
    for (let item of result){
      var rids = [];
      var items_dict = {};
      var role_name_lists = []; 
      var groups_name_lists = []; 
      for (let element of result){
        var rid_name = {}
        if (item["employeeid"] === element["employeeid"]){
          // items_dict["active"] = element["active"] == 1?'是': "否";
          items_dict["active"] = element["active"] == 1?'是': "否";
          items_dict["company"] = element["company"];
          items_dict["department"] = element["department"];
          items_dict["email"] = element["email"];
          items_dict["employeeid"] = element["employeeid"];
          items_dict["employeeno"] = element["employeeno"];
          items_dict["facility"] = element["facility"];
          items_dict["loginname"] = element["loginname"];
          items_dict["name"] = element["name"];
          items_dict["phoneno"] = element["phoneno"];
          items_dict["pictureurl"] = element["pictureurl"];
          items_dict["rid"] = element["rid"];
          items_dict["groupid"] = element["groupid"];
          
          items_dict["role"] = element["role"];
          items_dict["lastsignondate"] = element["lastsignondate"];
          
          items_dict["role_name"] = element["role_name"];

          rid_name["role"] = element["role"];
          rid_name["rid"] = element["rid"];
          var role_name_str: string | null = element["role_name"] ? element["role_name"]: null;
          var groups_name_str: string | null = element["groups"] ? element["groups"]: null;
          // rid_name["role_name"] =  role_name_str.replace(/\s/g, "");
          role_name_lists.push(role_name_str)
          groups_name_lists.push(groups_name_str)
          rids.push(rid_name)
          items_dict["rids"] = rids;
          items_dict["role_name"] = role_name_lists;
          items_dict["groups_name"] = groups_name_lists;
          continue
        }else{
          
        }
      }
      // 处理 role_names，将以第一， 去掉！
      employee_list.push(items_dict)
    }
    
    // 列表去重！
    var unique_result =  this.unique(employee_list, "employeeid")


    // groups_name、role_name去重
    this.unique_group_role(unique_result, "groups_name");
    this.unique_group_role(unique_result, "role_name");

    return unique_result
  }

  // 根据employeeid去重
  unique(arr, field) {
    const map = {};
    const res = [];
    for (let i = 0; i < arr.length; i++) {
      if (!map[arr[i][field]]) {
        map[arr[i][field]] = 1;
        res.push(arr[i]);
      }
    }
    return res;
  }

  // groups_name、role_name去重
  unique_group_role(arr, fild){
    arr.forEach(element => {
      var arr_list = [];
      var groups_name_list = element[fild];
      groups_name_list.forEach(groups => {
        if(arr_list.indexOf(groups) === -1){
          arr_list.push(groups)
        }
      });
      // arr_list [] 改为 str
      element[fild] = arr_list.join(";")
    });
  }


  // button按钮执行！新增
  add(){
    this.dialogService.open(AddUserEmployeeComponent,{closeOnBackdropClick: false});
  }

  // button按钮执行！ 编辑
  edit(){
    // 得到选中的aggrid rowdatas
    var rowdata = this.agGrid.getselectedrows();
    console.log("------------rowdata--------------", rowdata)
    console.log("------------得到选中的aggrid rowdatas--------------", rowdata)
    if (rowdata.length === 0){
      console.log("没有选中行数据", rowdata);
      // 提示选择行数据  EditDelTooltipComponent
      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '编辑用户提示', content: "请选择要需要修改的的行数！"}} ).onClose.subscribe(
        name=>{console.log("----name-----", name)}
      );

      
    }else if (rowdata.length > 1){
      console.log("button按钮执行222！ 编辑", rowdata);
      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '编辑用户提示', content:   `请选择一条要需要修改的的行数！`}} ).onClose.subscribe(
        name=>{console.log("----name-----", name)}
      );
    }else{

     

      var rowData = rowdata[0]
      this.getsecurity_edit('employee', 'get_rolename', {}).subscribe((res)=>{
        console.log("employee_result-------------->", res);
        // 根据用户角色得到，用户对应的组
        var column = {
          employeeid:  rowData["employeeid"] // 用户id
        }
        this.getsecurity_edit("groups", "get_groups", column).subscribe((goups:any[])=>{
          console.log("根据用户角色得到，用户对应的组:", goups, "res", res);
          this.dialogService.open(EditUserEmployeeComponent, { closeOnBackdropClick: false,context: { rowdata: JSON.stringify(rowData), res: JSON.stringify(res), goups: JSON.stringify(goups)} }).onClose.subscribe(
            name=>{
              console.log("----编辑-----", name);
            }
          );
        });
        // this.dialogService.open(EditUserEmployeeComponent, { context: { rowdata: JSON.stringify(rowData), res: JSON.stringify(res)}})
      });

    }
  }

  // button按钮执行删除！
  del(){
    var rowdata = this.agGrid.getselectedrows();;
    var getsecurity_edit2 = this.getsecurity_edit2;
    var publicservice = this.publicmethod;
    var success = this.success;
    var danger = this.danger;
    var http = this.http;
    console.log("------------rowdata--------------", rowdata)
    if ( rowdata.length === 0){
      console.log("没有选中行数据", rowdata);
      // 提示选择行数据
      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '删除用户提示', content:   `请选择要需要删除的行数！`}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);

        }
      );
    }else{
      var rowData = rowdata;
      var text = rowData.length > 1 ? "这些": "这条";
      console.log("-------------------->>>>>>>>>>>>",rowData)
      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '删除用户提示', content:   `确定要删除${text}数据吗？`, rowData: JSON.stringify(rowData)} } ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
          if (name){
            try {
              rowData.forEach(rd => {
                getsecurity_edit2('employee', 'delete_employee', rd, http).subscribe((res)=>{
                  console.log("delete_employee", res);
                  if (res === 1){
                  }else{
                    throw 'error, 删除失败！'
                  }
                });
              });
              setTimeout(() => {
                location.reload();
              }, 1000);
              // publicservice.toastr(DelSuccess);
              success(publicservice)
              // layer.close(index);
            }catch(err){
              // publicservice.toastr(DelDanger);
              danger(publicservice)
              
            }
          }

        }
      );

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
        this.importfile();
        break;
      case 'download':
        this.download('用户管理')
        break;
    }

  }

  // button 搜索按钮
  query(){
    var employeenumber = $("#employeenumber").val();
    if (employeenumber != ""){
      console.log("button 搜索按钮", employeenumber, "--");
    }
  }

  //  button导出未excel
  download(title){
    this.agGrid.download(title);
  }





  // 点击行执行
  runParent(rowdata){
    this.rowdata = rowdata;
    console.log("点击行执行：", rowdata)
  }
  
  

  // 编辑
  uprole(uprow){
    console.log("编辑行执行：", uprow)
  }
  // 添加
  addroleIcon(addrow){
    console.log("添加行执行：", addrow)
  }








 

  // 导入文件
  importfile(){
    var input = document.getElementById("import");
    // js执行点击input
    input.click();
  }

  // ----------------------------导入---------------------------
  onFileChange(evt: any){
    const target: DataTransfer = <DataTransfer>(evt.target);
    console.log("导入：---------------------------", target);
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.importdata = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
      // console.log("importdata: ", this.importdata); // 这是读取的数据转为json

      this.analysis_sheet_to_json_to_ng2(this.importdata)
    };
    reader.readAsBinaryString(target.files[0]);

  }

  // 将sheet_json转换为smart-table 数据格式！ 
  analysis_sheet_to_json_to_ng2(importdata){
    var rowData_list = importdata.slice(1,importdata.length);
    console.log("导入-----rowData_list---->", rowData_list)
    var columns = this.tableDatas.columnDefs;
    var columnsList = [];
    for (let k of columns){ // columns 不是 dict 用 of 不要用in
      if (k["field"] != "action"){ // 去掉操作
        columnsList.push(k["field"]);
      }
    };
    console.log("columnsList----->", columnsList);

    var rowData = []; // rowData 就是table需要的source
    rowData_list.forEach(element => {
      var item = {};
      if(element.length != 0){
        for (let index = 0; index < element.length; index++) {
          item[columnsList[index]] = element[index];
        }
        rowData.push(item);
      }
      
    });
    console.log("rowData---->", rowData);
    
    try{
      // 插入数据库之前 处理数据
      var datas = this.option_table_before(rowData)
      console.log("插入数据库之前 处理数据---->", datas);
      // 将导入的数据存入数据库
      // this.dev_insert_device(datas);

      // 将 rowData 显示到 agGrid中
      this.tableDatas.rowData = rowData
      this.agGrid.update_agGrid(this.tableDatas)
      // this.gridData = [];
      // this.gridData.push(...rowData)
      // this.tableDatas.rowData = this.gridData;

      // 将导入的数据展示在table中
      // var after_datas = this.show_table_before(rowData)
      // this.table_data.source.load(rowData);

    }catch(err){
      alert(String(err))
    }
  }

  // ----------------------------导入---------------------------

  // 将导入的数据插入到数据库中
  dev_insert_device(datas){
    const table = "employee";
    const method = 'insert_employee';
    try {
      datas.forEach(rd => {
        this.http.callRPC(table, method, rd).subscribe((result)=>{
          console.log("插入设备数据：", result)
          const status = result['result']['message'][0];
          if (status === 1){
          }else{
            throw `error,${status}`
          }
        })
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
      this.importsuccess()
    }catch(err){
      console.log("err: ", err)
      this.importdanger()
    }

    
  }

  // 编辑修改前，处理一下选中的table数据
  option_table_before(datas){
    var after_datas_role: any[] =[];
    var active;
    datas.forEach(data => {
      var after_datas: any[] =[];
      switch (data["active"]) {
        case "是":
          active = 1;
          break;
          case "否":
            active = 0;
            break;
      };
      
      var after_data_: OptionEmployeeData = {
        active:active,
        department:data["department"],
        email:data["email"],
        employeeid:null,
        employeeno:data["employeeno"],
        lastupdatedby:data["lastupdatedby"],
        loginname:data["loginname"],
        name:data["name"],
        password:"3bf6e666ad793b1e2c69b3da472504d4", // 默认密码 
        phone:data["phoneno"],
      }
      after_datas.push(after_data_);
      var rids_list = this.handle_groups_and_roles(data, "role_name")
      var groups_list = this.handle_groups_and_roles(data, "groups_name")
      rids_list.forEach(item=>{
        after_datas.push(item);
      })
      groups_list.forEach(item=>{
        after_datas.push(item);
      })
      console.log("===============after_datas==========>",after_datas);
      after_datas_role.push(after_datas)
      console.log("===============rids_list==========>",rids_list);
    });
    return after_datas_role
  }
  // 处理 groups_name: "理化试验科"    role_name: "普通用户;执行方"
  handle_groups_and_roles(data, fild){
    // var groups_name = data["groups_name"].split(";");
      var names = data[fild].split(";");
      // 得到用户组和角色
      if (fild != "groups_name"){
        var get_name = JSON.parse(localStorage.getItem("employee_rolename"));
        var key = "rids";
        var key_name = "role_name"
        var id = "rid"
      }else{
        var get_name = JSON.parse(localStorage.getItem("employee_groupname"));
        var key = "gids";
        var key_name = "groups"
        var id = "groupid"
      }
      var rids_list = [];
      var res = get_name;
      names.forEach(rn => {
        var rids = {};
        res.forEach(r => {
          if (r[key_name] === rn){
            rids[key] = r[id];
            rids_list.push(rids)
          }
        });
      });
      return rids_list
      console.log("names_____________", rids_list);




  }


// 展示状态
success(publicservice){
  publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"删除成功!"});
}
danger(publicservice){
  publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"删除失败!"});
}
// 展示状态
importsuccess(){
  this.publicmethod.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"导入成功!"});
}
importdanger(){
  this.publicmethod.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"导入失败!"});
}

}
// table 中每行数据类型！ 这是将table中的数据改回原始数据
interface OptionEmployeeData {
  active:number,
  department:string,
  email:string,
  employeeid:number,
  employeeno:string,
  lastupdatedby:string,
  loginname:number,
  name:string,
  password:string,
  phone:string,
}
interface ROLE {
  rids: number
}

interface GROUP {
  gids: number
}