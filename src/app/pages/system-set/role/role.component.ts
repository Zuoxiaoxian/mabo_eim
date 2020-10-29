import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';

import { ROLE_SETTINGS, ROLE_TABLE } from '../table_setting';

import { DatePipe } from '@angular/common';

import { SYSROLEMENU, role_tree_data, SYSROLE, menu_button_list, role_action, MULU  } from '../../../appconfig';

declare let layui;

declare let $;

var store = require('store');

import { HttpserviceService } from '../../../services/http/httpservice.service';

import { url, adminlocalstorage,ssotoken} from '../../../appconfig';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { NbDialogService } from '@nebular/theme';
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';

// 弹出编辑role
import { EditRoleComponent } from '../../../pages-popups/system-set/edit-role/edit-role.component'

import { RoleComponent as AddRoleComponent} from '../../../pages-popups/system-set/role/role.component';
import { Observable } from 'rxjs';

import {LocalDataSource} from "@mykeels/ng2-smart-table";
import { UserInfoService } from '../../../services/user-info/user-info.service';

import { EditDelTooltipComponent } from '../../../pages-popups/prompt-diallog/edit-del-tooltip/edit-del-tooltip.component';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild('dialog') dialog: TemplateRef<any>;
  @ViewChild("mytable") mytable: any;


  get_jili_app_token;


  tree_data;

  // 前端要展示的button 主要是：增、删、改
  buttons;

  // 前端要展示的buttons 主要是：搜索、导入导出
  buttons2;

  // 要删除、修改的行数据 
  rowdata;


  UpSuccess :any = {position: 'bottom-right', status: 'success', conent:"修改成功!"};
  UpDanger :any = {position: 'bottom-right', status: 'danger', conent:"修改失败！"}
  DelSuccess :any = {position: 'bottom-right', status: 'success', conent:"删除成功!"};
  DelDanger :any = {position: 'bottom-right', status: 'danger', conent:"删除失败！"}
  SavSuccess :any = {position: 'top-right', status: 'success', conent:"保存成功!"};
  SavDanger :any = {position: 'top-right', status: 'danger', conent:"保存失败！"}


  constructor(private http: HttpserviceService, private localstorageservice: LocalStorageService,
    private dialogService: NbDialogService, private datapipe: DatePipe, private publicservice: PublicmethodService, private userinfo: UserInfoService,
    private router: Router) { 
    
  }


  table_data = {
    settings: ROLE_TABLE,
    // source: null,
    source: new LocalDataSource(),
  };


  
  ngOnInit(): void {
    
    var $table = $('#roleTable');
    // 初始化table
    var data =  [
      {
        'roleid': 0,
        'role': 'Item 0',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$0',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 1,
        'role': 'Item 1',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$1',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 2,
        'role': 'Item 2',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$2',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 3,
        'role': 'Item 3',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$3',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 4,
        'role': 'Item 4',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$4',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 5,
        'role': 'Item 5',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$5',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 6,
        'role': 'Item 6',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$5',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 7,
        'role': 'Item 7',
        'createdby': 'Item 0 en',
        'createdonion': "全部",
        'lastupdatedby': '$5',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 8,
        'role': 'Item 8',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$5',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 9,
        'role': 'Item 9',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$5',
        'lastupdateon': '2020-9-15 16:22'
      },
      {
        'roleid': 10,
        'role': 'Item 10',
        'createdby': 'Item 0 en',
        'createdon': "全部",
        'lastupdatedby': '$5',
        'lastupdateon': '2020-9-15 16:22'
      }
    ]
    // 加载树状menu  初始化
    this.loadMenu().subscribe((treedata)=>{
      // this.showTreedata(treedata)
      console.log("加载树状menu  初始化>>>>>>>>>>>", treedata)
      this.showTreedata_v2(treedata);
    });

    

    // 加载角色table
    this.loadRole().subscribe((roledata:any[])=>{
      this.table_data.source.load(roledata);
      console.log("加载角色table", roledata);
      // this.table_data.source  = roledata;
    });



    // 得到该页面下的button
    this.getbuttons();

    

    
    
  }
  
  ngAfterViewInit(){
    
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

   // 得到buttons----------------------------------------------------------
  
  getbuttons(){
    // 根据menu_item_role得到 该页面对应的 button！
    var button_list = localStorage.getItem(menu_button_list)? JSON.parse(localStorage.getItem(menu_button_list)): false;
    if (button_list){
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      console.log(button_list)
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      this.publicservice.get_current_pathname().subscribe(res=>{
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
          var mdthod = button["permission"].split(":")[1];
          switch (mdthod) {
            case "add":
              break;
            case "del":
              isactions["del"] = true
              break;
            case "edit":
              isactions["edit"] = true
              break;
            
          }
        })

        if (!isactions["edit"]){
          isactions["edit"] = false
        }
        if (!isactions["del"]){
          isactions["del"] = false
        }

        // var isactions = {};
        // buttons.forEach(button=>{
        //   if (button["permission"].search("add") === -1){
        //     if (button["permission"].search("edit") === -1){
        //       // 编辑不存在
        //       // isactions.push({edit:false})
        //     }else{ // 编辑存在
        //       isactions["edit"] = true
        //     }
        //     if (button["permission"].search("del") === -1){
        //       // isactions.push({del: false})
        //     }else{
        //       isactions["del"] = true
        //     }
        //   }
        // })

        // if (!isactions["edit"]){
        //   isactions["edit"] = false
        // }
        // if (!isactions["del"]){
        //   isactions["del"] = false
        // }
        localStorage.setItem(role_action, JSON.stringify(isactions));
        console.log("_________________________________-isactions---------________________",isactions)
      })
    }
  }


  action(actionmethod){
    console.log("++++++++++++++++++++action(actionmethod)++++++++++++++++++++++++++++", actionmethod);
    var method = actionmethod.split(":")[1];
    console.log("--------------->method", method)
    switch (method) {
      case 'add':
        this.addrole();
        break;
      case 'del':
        this.remove();
        break;
      case 'edit':
        this.editrole();
        break;
      case 'query':
        this.query();
        break;
      // case 'import':
      //   this.import();
      //   break;
      case 'download':
        this.download('角色管理')
        break;
    }

  }


  // 添加role button 弹出框形式
  addrole(){
    var dialogService = this.dialogService;
    open();
    function open() {
      // dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
      dialogService.open(AddRoleComponent)
      // .onClose.subscribe(name => name && this.names.push(name));
    }
  }

  // 修改role button 
  editrole(){
    var rowdata = this.rowdata;
    console.log("修改role button ", rowdata);
    if (rowdata === undefined || rowdata["selected"].length === 0){
      console.log("没有选中行数据", rowdata);
      // 提示选择行数据
      this.dialogService.open(EditDelTooltipComponent, { context: { title: '编辑角色提示', content:   `请选择要需要修改的的行数！`}} ).onClose.subscribe(
        name=>{console.log("----name-----", name)}
      );
    }else if (rowdata["selected"].length > 1){
      console.log("button按钮执行222！ 编辑", rowdata);
      this.dialogService.open(EditDelTooltipComponent, { context: { title: '编辑用户组提示', content:   `请选择一条要需要修改的的行数`}} ).onClose.subscribe(
        name=>{console.log("----name-----", name)}
      );
      
    }else{
      var rowData = rowdata["selected"][0]
      this.dialogService.open(EditRoleComponent, {context: { rowdata: JSON.stringify(rowData)} });
    }

  }

  // 删除role button
  remove(){
    var rowdata = this.rowdata;

    var http = this.http;
    var getsecurity_edit2 = this.getsecurity_edit2;
    var publicservice = this.publicservice;
    var DelSuccess = this.DelSuccess;
    var DelDanger = this.DelDanger;

    if (rowdata === undefined || rowdata["selected"].length === 0){
          console.log("没有选中行数据", rowdata);
          // 提示选择行数据
          this.dialogService.open(EditDelTooltipComponent, { context: { title: '删除角色提示', content:   `请选择要需要删除的的行数！`}} ).onClose.subscribe(
            name=>{console.log("----name-----", name)}
          );
    }else{
      var rowData = rowdata["selected"];
      var text = rowData.length > 1 ? "这些": "这条";
      console.log("-------------------->>>>>>>>>>>>",rowData);
      this.dialogService.open(EditDelTooltipComponent, { context: { title: '删除角色提示', content:   `您确定要删除！${text}数据`,rowData: JSON.stringify(rowData)}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
          if (name){
            rowData.forEach(rd => {
              try {
                getsecurity_edit2('role', 'delete_role', rd, http).subscribe((res)=>{
                  console.log("delete_role", res);
                  if (res["code"] === 1){
                    console.log("------>删除结果", res)
                  }else{
                    throw 'error, 删除失败！'
                  }
                });
                localStorage.removeItem(SYSROLE);
                setTimeout(() => {
                  location.reload();
                }, 1000);
                publicservice.toastr(DelSuccess)
              }catch(err){
                publicservice.toastr(DelDanger)
              }
            });
          }
        }
      );

     

      
    }

    

    
  }

  // 添加 role table icon形式
  addroleIcon(addrole){
    const colums = addrole["newData"];
    console.log("---colums--",colums)
    const table = "role";
    const method = 'insert_role';
    this.http.callRPC(table, method, colums).subscribe((result)=>{
      console.log("^^^^^^",result)
      const res = result['result']['message'][0];
      if (res === 1){
        localStorage.removeItem(SYSROLE);
        this.publicservice.toastr(this.SavSuccess);
        location.reload();
      }else{
        this.publicservice.toastr(this.SavDanger);
      }
      
    })

  }

  //  button导出未excel
  download(title){
    this.mytable.download(title);
  }

   // button 搜索按钮
   query(){
    var employeenumber = $("#employeenumber").val();
    if (employeenumber != ""){
      console.log("button 搜索按钮", employeenumber, "--");
    }
  }





  // 子组件给该组件传递点击得到的行数据！
  runParent(rowdata){
    this.rowdata = rowdata;
    console.log("---子组件传值---", rowdata, rowdata["data"]["roleid"]);
    var roleid = rowdata["data"]["roleid"];
    // var method = "get_systemset_menu";
    var method = "get_menu_role";
    this.loadMenu2(roleid, method).subscribe((treedata)=>{
      this.showTreedata_v2(treedata)
    });


    // disabled  激活保存按钮
    var $save = $("#save");
    $save.attr("class", "layui-btn layui-btn-normal");
  }

  // 同上、删除角色！
  delrole(delrole){
    console.log("删除角色！", delrole);
    var roleid = delrole["data"]["roleid"];
    const colums = {
      lastupdatedby: this.userinfo.getName(),
      roleid: roleid
    };
    console.log("---colums--",colums)
    const table = "role";
    const method = 'delete_role';
    this.http.callRPC(table, method, colums).subscribe((result)=>{
      const baseData = result['result']['message'][0];
      console.log("delete_role", result);
      if (baseData === 1){
        localStorage.removeItem(SYSROLE);
        this.publicservice.toastr(this.DelSuccess);
        location.reload();
      }else{
        this.publicservice.toastr(this.DelDanger);
      }
      
    })
  }

  // 同上修改角色
  uprole(uprole){
    var data = uprole["newData"];
    var insert = {}
    insert["lastupdatedby"] = data["lastupdatedby"];
    insert["role"]  = data["role"];
    insert["active"]  = data["active"];
    insert["roleid"]  = data["roleid"];
    const colums = data;
    console.log("---colums--",colums)
    const table = "role";
    const method = 'update_role';
    this.http.callRPC(table, method, colums).subscribe((result)=>{
      console.log("update_role", result)
      const res = result['result']['message'][0];
      if (res ===1 ){
        localStorage.removeItem(SYSROLE);
        this.publicservice.toastr(this.UpSuccess);
        location.reload();
      }else{
        this.publicservice.toastr(this.UpDanger);
      }
      
    })
  }
  
  // 菜单分配树状图
  showTreedata(treedata){
    // console.log("treedata----",treedata)
    layui.use(['layer', 'form', 'tree', 'util'], function(){
      var layer = layui.layer
      ,tree = layui.tree
      ,form = layui.form
      ,util = layui.util
      // 渲染
      tree.render({
        elem: '#menuFengPei', // 绑定元素
        showCheckbox: true,  //是否显示复选框
        data: treedata,
        id: 'treeid'
      })
      

    });
  }



  

  ngOnDestroy(){
    var $table = $('#roleTable')
    $table.bootstrapTable("destroy");
    ROLE_SETTINGS.columns.pop();
    console.log("销毁： ", ROLE_SETTINGS.columns);

    localStorage.removeItem(SYSROLEMENU); // 销毁菜单分配

  }




  // 需要传入参数 1、得到所有的菜单 2、根据当前用户的id得到对应的菜单
  loadMenu(roles?, methods?){
    console.log("这是 系统设置的  角色  界面！" )
    return new Observable((observe)=>{
      var sysrolemenu = localStorage.getItem(SYSROLEMENU) == null ? [] : JSON.parse(localStorage.getItem(SYSROLEMENU));
      var mulu_language = localStorage.getItem('mulu_language') == null ? 'zh_CN' : localStorage.getItem('mulu_language');
      if(sysrolemenu.length == 0 || mulu_language != localStorage.getItem('currentLanguage')){
        this.publicservice.getMenu().subscribe((data)=>{
          var roles_ = roles === undefined ? data: roles;
          var method_ = methods === undefined ? 'get_systemset_menu_all': methods;
          console.log("这是 系统设置的  角色  界面！", roles_, method_)

          // if (roles_.length === 0){
          //   this.router.navigate([])
          // }

          const colums = {
            languageid: this.http.getLanguageID(),
            roles: data
          };
          console.log("---colums--",colums)
          const table = "menu_item";
          const method = "get_systemset_menu_all";
          this.http.callRPC(table, method, colums).subscribe((result)=>{
            
            const baseData = result['result']['message'][0];
            console.log("sys_role_menu", baseData)
            localStorage.setItem(SYSROLEMENU, JSON.stringify(baseData));
            // 得到特定的树状结构数据
            this.sysrolemenu_to_tree_v2(baseData).subscribe((treedata)=>{
              observe.next(treedata)
            });
          })
        });
      }else{
        console.log("------menu--role tree：", sysrolemenu);
        this.sysrolemenu_to_tree_v2(sysrolemenu).subscribe((treedata)=>{
          observe.next(treedata)
        })
      }

    })
    
    // this.RanderTable(data);
  }

  // 当点击角色是请求菜单
  loadMenu2(roles, methods){
    console.log("点击角色执行", roles, methods);
    localStorage.setItem("click_col_roles", roles);
    return new Observable((observe)=>{
      const colums = {
        languageid: this.http.getLanguageID(),
        roleid: roles
      };
      console.log("---colums--",colums)
      const table = "menu_item";
      const method = methods;
      this.http.callRPC(table, method, colums).subscribe((result)=>{
        console.log("get_menu_role", result);
        // 得到button列表！
        var button_list = [];
        result['result']['message'][0]["allmenu"].forEach(element => {
          if (element["type"] === 2){
            button_list.push(element)
          }
        });
        // const allmenu = result['result']['message'][0]["allmenu"];
        const result_allmenu = result['result']['message'][0]["allmenu"];
        const allmenu = JSON.parse(localStorage.getItem(SYSROLEMENU));
        
        const selectmenu = result['result']['message'][0]["selectmenu"];
        console.log("------------------------result_allmenu",result_allmenu)
        

        // console.log("sys_role_menu", allmenu)
        // localStorage.setItem(SYSROLEMENU, JSON.stringify(allmenu));
        // 得到特定的树状结构数据
        // this.sysrolemenu_to_tree(allmenu, selectmenu).subscribe((treedata)=>{
        //   observe.next(treedata)
        // });
        this.sysrolemenu_to_tree_v2(allmenu, selectmenu).subscribe((res)=>{
          observe.next(res)
        });
      })
    })
    
    // this.RanderTable(data);
  }




  // 菜单分配树状图
  showTreedata_v2(res){

    var http = this.http;
    var publicservice = this.publicservice;
    var success = this.success;
    var danger = this.danger;

    var updatabutton_list = this.updatabutton_list;

    //  加载formSelect模块
    layui.config({
      base: "./assets/pages/system-set/layui/module/"
    }).extend({
    });

    var treedata= res["treedata"]
    var selectmenu = res["selectmenu"]
    console.log("treedata------>",treedata)
    console.log("selectmenu------>",selectmenu);
    var selectment_lsit = []; 
    if (selectmenu != []){
      selectmenu.forEach(element => {
        selectment_lsit.push(element["menuitemid"])
      });
    }
    console.log("selectment_lsit------>",selectment_lsit);
    var checkData;
    layui.use(['layer', 'form', 'eleTree'], function(){
      var layer = layui.layer
      ,form = layui.form
      // 渲染
      var eleTree = layui.eleTree;
      console.log("selectment_lsit------>",selectment_lsit);
      var el2=eleTree.render({
        elem: '#menuFengPei',
        data: treedata, 
        showCheckbox: true,
        defaultExpandAll: false, // 是否默认展开所有节点
        defaultCheckedKeys: selectment_lsit,  // 默认勾选的节点的 key 的数组
        // defaultExpandedKeys: selectment_lsit,    // 默认展开的节点的 key 的数组
        checkStrictly: true, //在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false


      });
      console.log("-=-=-=-=-=-=-=-=-el2-=-=-=-=-=",el2)
      // 节点点击事件
      var select_id = selectment_lsit;
      eleTree.on("nodeChecked(treedata)",function(d) {
        console.log(d.data);    // 点击节点对于的数据
        console.log(d.isChecked);   // input是否被选中
        // var select_id = [];
        if (d.isChecked){
          // 表示该节点被选中！判断是否是父节点
          console.log(d.data["currentData"]);
          // select_id.push(d.data["currentData"]["id"]);
          uniq(select_id, d.data["currentData"]["id"])
          if (d.data["currentData"] != undefined && d.data["currentData"]["children"] != null){
            // 展开所有
            el2.expandNode(d.data["currentData"]["id"])
            var children = d.data["currentData"]["children"]
            children.forEach(element => {
              if (element["children"] != undefined){
                // 展开所有
                el2.expandNode(element["id"])
                // select_id.push(element["id"]);
                uniq(select_id, element["id"])
                var e_children = element["children"];
                e_children.forEach(e_element => {
                  // 按钮
                  // select_id.push(e_element["id"]);
                  uniq(select_id, e_element["id"])
                });
              }else{
                // 菜单
                uniq(select_id, element["id"])
              }
            });
            console.log("该节点为父节点！字节点", children);
            console.log("该节点为父节点！当前节点", d.data["currentData"]);
            // 需要
            // el2.setChecked(select_id,true);
          }
          console.log("点击父节点，默认子节点也选中", select_id)
          
        }else{
          // 取消 el2.unCheckArrNodes(22,24);
          if (d.data["currentData"] != undefined && d.data["currentData"]["children"] != null){
            var children = d.data["currentData"]["children"]
            el2.unExpandNode(d.data["currentData"]["id"]);
            console.log("-----------currentData----------", d.data["currentData"])
            console.log("-----------children----------", children)
            del_unselect(select_id, d.data["currentData"]["id"]);
            children.forEach(element => {
              if (element["children"] != undefined){
                el2.unExpandNode(element["id"]);
                var e_children = element["children"];
                del_unselect(select_id, element["id"])
                e_children.forEach(e_element => {
                  // 按钮
                  del_unselect(select_id, e_element["id"])
                });
              }else{
                // 菜单
                del_unselect(select_id, element["id"])
              }
            });
          }else{
            del_unselect(select_id, d.data["currentData"]["id"])
          }
          console.log("取消的节点", select_id)
        }
        
        el2.setChecked(select_id,true);
        
        // console.log(d.node);    // 点击的dom节点
        // console.log(this);      // input对于的dom
      })


      function uniq(select_id, id) {
        var index = select_id.indexOf(id);
        if (index === -1){
          select_id.push(id)
        }
        
      }

      // 勾选的列表去除，取消勾选的
      function del_unselect(select_id, unselect_id) {
        console.log("select_id, unselect_id", select_id, unselect_id);
        // select_id:勾选的列表， unselect：取消勾选的
        var index = select_id.indexOf(unselect_id);
        if (index != -1){
          select_id.splice(index, 1);
        }
        console.log("勾选的列表去除，取消勾选的 select_id", select_id)
      }
      // el2.setChecked(selectment_lsit)




      // console.log(el2.getChecked(false,true))
      // 获取选中的节点，接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false

      // 2. 是否包含半选节点，默认值为 false

      // 保存按钮---保存更改后的角色对应的菜单
      form.on('submit(save)', function(data){
        // console.log(el2.getChecked(true,false));
        checkData = el2.getChecked(false,true);
        var roles = localStorage.getItem("click_col_roles");
        console.log("得到的选中的数据>>>>>>>>>>>>>>>>>>", checkData,roles);
        var selects = [];
        if (checkData != []){
          checkData.forEach(element => {
            var selects_dict = {};
            selects_dict["menuitemid"] = element["id"]
            selects.push(selects_dict)
          });
          selects[0]["roleid"] = roles;
        }else{
          // checkData 为空
          var item = {};
          item["menuitemid"] = null;
          item["roleid"] = roles;
          selects.push(item);
        }
        // 更新菜单
        const colums = selects;
        console.log("---colums--",colums)
        const table = "menu_item";
        const method = "update_menu_role";
        http.callRPC(table, method, colums).subscribe((result)=>{
          const baseData = result['result']['message'][0];
          if (baseData === 1){
            // publicservice.toastr(SavSuccess);
            success(publicservice);

            // 成功后更新 menu_button_list
            updatabutton_list(publicservice,http);
            localStorage.removeItem(MULU); // 这个是更新左侧目录栏
            setTimeout(() => {
              location.reload();
            }, 1000);
          }else{
            // publicservice.toastr(SavDanger);
            danger(publicservice);
          }
          
        })
        return false;
      })

      console.log("为什么点击无法保存")

    })

  }


  // 更新button_list！
  updatabutton_list(publicservice, http){
    publicservice.getMenu().subscribe((data)=>{
      const colums = {
        languageid: http.getLanguageID(),
        roles: data
      };
      console.log("---更新button_list！--",colums)
      const table = "menu_item";
      const method = "get_menu_by_roles";
      http.callRPC(table, method, colums).subscribe((result)=>{
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



  


  // 根据得到的 sysrolemenu 角色界面的菜单数据得到适用于特定树状结构的数据
  sysrolemenu_to_tree_v2(sysrolemenu, selectmenu?){
    console.log("<<<<<<<<<<<<<<<<sysrolemenu_to_tree_v2>>>>>>>>>>>>>", sysrolemenu, selectmenu)
    /*
    * 需要的特定数据格式： 
      [
        {
          id: ,    // 节点唯一索引，对应数据库中id
          label: , // 节点标题
          checked: , // 是否勾选
          disabled: , // 节点是否为禁止状态，默认为false
          children: , // 子节点，支持设定项同父节点
        }
      ] 
    */
   return new Observable((observe)=>{
     var mulu_list = [];
     var caidan_list = [];
     var aniu_list = [];
     var selectmenu_ = selectmenu === undefined? []: selectmenu;
    //  console.log(">>>>>>>>>>>>>>>>>.,selectmenu_",selectmenu_)


     sysrolemenu.forEach(item => {
       if (item["type"] === 0){
         var mulu = this.get_mulu_list_v2(item);
         if(selectmenu_ != []){
           selectmenu_.forEach(select => {
             if (select["menuitemid"] === mulu["id"]){
              // mulu["checked"] = true;
            }
          });
        }
        mulu_list.push(mulu);
      }else if (item["type"] === 1){
        var caidan = this.get_mulu_list_v2(item);
        if(selectmenu_ != []){
          selectmenu_.forEach(select => {
            if (select["menuitemid"] === caidan["id"]){
              // caidan["checked"] = true
            }
          });
        }
        caidan_list.push(caidan)
      }else{
        var aniu = this.get_mulu_list_v2(item);
        if(selectmenu_ != []){
          selectmenu_.forEach(select => {
            if (select["menuitemid"] === aniu["id"]){
              // aniu["checked"] = true
            }
          });
        }
        aniu_list.push(aniu)
      }
     });
     var caidanList = this.integration_list_v2(caidan_list, aniu_list);
     var muluList = this.integration_list_v2(mulu_list, caidanList);
     
    // 删除父亲id
    var selectmenu_2 = [];
    for (let index = 0; index < selectmenu_.length; index++) {
      const elementid = selectmenu_[index]["menuitemid"];
      for (let j = 0; j < muluList.length; j++) {
        // const element = muluList[index];
        // 根据 elementid 判断muluList[elementid]是否存在 children ，如果children存在，剔除！
        if (muluList[j]["children"].length != 0 ){
          // 判断是否有菜单
          var caidans = muluList[j]["children"];
          for (let c = 0; c < caidans.length; c++) {
            if (caidans[c]["children"].length != 0){ //caidans[c]['id'] === elementid && 
              var annius = caidans[c]["children"];
              for (let a = 0; a < annius.length; a++) {
                if (annius[a]['id'] === elementid){
                  selectmenu_2.push(selectmenu_[index]);
                  continue;
                }
                
              }
            }else{
              if (caidans[c]['id'] === elementid){
                selectmenu_2.push(selectmenu_[index]);
                break;
              }
              // console.log("caidans +++++++++++++++++++++++++++++++++>", elementid, caidans[c])
            }
            
          }
        }else{
          if (muluList[j]['id'] === elementid){
            selectmenu_2.push(selectmenu_[index]);
            break;
          }
          // console.log("item =============================>", elementid, muluList[j])
          
        }
        
      }
      
    }

    console.log("_---------------------------------<<<<<<<<<<<<<<<,,,,,,,,selectmenu_2",selectmenu_2)



     // 数据展示到树状结构中 
    //  this.showTreedata_v2(muluList, selectmenu_)
    
    observe.next({treedata:muluList, selectmenu: selectmenu_});
    // observe.next({treedata:muluList, selectmenu: selectmenu_2});

   })
   
  }

  // 列表整合！
  integration_list_v2(parentList, childList){
    parentList.forEach(parent => {
      var child_list = [];
      childList.forEach(child => {
        if (child["parentid"] === parent["id"]){
          // delete child.parentid;
          // delete parent.parentid;
          child_list.push(child)
        }
        parent["children"] = child_list
      });
    });
    return parentList
  }

  // 得到目录列表、菜单列表、按钮列表
  get_mulu_list_v2(item){
    var mulu: TREEV2 = {
      id:item["id"],
      parentid:item["parentid"],
      label: item["title"],
      checked: false,
      disabled: false,
      children: null,
    }
    return mulu
  }



  // 这是得到角色的 table数据
  loadRole(){
    return new Observable((observe)=>{
      var sysrole = localStorage.getItem(SYSROLE) == null ? [] : JSON.parse(localStorage.getItem(SYSROLE));
      if (sysrole.length === 0){
        const colums = {
        };
        console.log("---colums--",colums)
        const table = "role";
        const method = "get_role";
        this.http.callRPC(table, method, colums).subscribe((result)=>{
          console.log("sys_role--------------------------", result)
          const baseData = result['result']['message'][0];
          localStorage.setItem(SYSROLE, JSON.stringify(baseData));
          // ------
          if (baseData["code"] === 1){
            baseData["message"].forEach(element => {
              element["active"] = element["active"] === 1? '是': '否';
            });
            observe.next(baseData["message"])
          }else{
            this.publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"得到角色失败" + baseData["message"]});
          }
        })
      }else{
        console.log("sys_role", sysrole);
        sysrole["message"].forEach(element => {
          element["active"] = element["active"] === 1? '是': '否';
        });
        observe.next(sysrole["message"])
        
      }

    })
  }


  // 展示状态
  success(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"保存成功!"});
  }
  danger(publicservice){
    publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"保存失败!"});
  }


  

}


interface TREEV2 {
  id: number,    // 节点唯一索引，对应数据库中id
  parentid: number,    // 父节点id
  label: string, // 节点标题
  checked: boolean,// 节点是否初始为选中状态， 默认false
  disabled: boolean, // 节点是否为禁止状态，默认为false
  children: TREEV2[] | null, // 子节点，支持设定项同父节点
}
