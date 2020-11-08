import { Component, OnInit } from '@angular/core';


import { NbDialogService } from '@nebular/theme';

import { EditDelTooltipComponent } from '../../../pages-popups/prompt-diallog/edit-del-tooltip/edit-del-tooltip.component';

declare let layui;

declare let $;


import { HttpserviceService } from '../../../services/http/httpservice.service';

import { url, adminlocalstorage, ssotoken, SYSMENU, SYSMENUEDIT,MULU, menu_button_list, Data, loginurl } from '../../../appconfig';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';

// 弹出的组件 -- 添加组件
import { MenuComponent as  MenuComponent2 } from '../../../pages-popups/system-set/menu/menu.component';

import { EditMenuComponent } from '../../../pages-popups/system-set/edit-menu/edit-menu.component';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  get_jili_app_token;
  headers
  


  // 前端要展示的button
  buttons;
  isactions;


  constructor(private http: HttpserviceService, private localstorageservice: LocalStorageService,
    private publicservice: PublicmethodService, private dialogService: NbDialogService,
    private toastrService: NbToastrService, private router: Router) { 
    // local store 得到token id 
    var admintoken = JSON.parse(localStorage.getItem(adminlocalstorage))? JSON.parse(localStorage.getItem(adminlocalstorage)): false;
    var token = localStorage.getItem(ssotoken)? localStorage.getItem(ssotoken): false;
    if (admintoken){
      this.headers = { "Content-Type": "application/json", "indent": "4", "Authorization": "Bearer " + admintoken.token}
    }else{
      console.log("得到用户菜单：这个是从统一认证平添登录的");
      // this.headers = { "Content-Type": "application/json", "indent": "4", "Authorization": "Bearer " + ssotoken.token};

    }


  }

  ngOnInit(): void {
    // 初始化table
    // this.getsysmenu_withuser();
    this.getbuttons();
    this.loadMenu();
  }
  
  ngAfterViewInit(){
    // this.loadMenu();
    // this.get_buttons();

  }


  // 得到当前界面的buttons
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
        
        button_list.forEach(button => {
          if (currentmenuid === button["parentid"]){
            // button["permission"] = button["permission"].split(":")[1].replace(/\s/g, "");
            button["permission"] = button["permission"];
            buttons.push(button);
            
          }
        });

        // -----------------------------------------------------------------------------------
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

        // -----------------------------------------------------------------------------------

        this.buttons = buttons;
        this.isactions = isactions;
        console.log("_________________________________-this.buttons---------________________",this.buttons);
        console.log("_________________________________-this.isactions---------________________",this.isactions);
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
        this.updatabutton_list();
        setTimeout(() => {
          this.addmenu()
        }, 1000);
        break;
      case 'del':
        this.updatabutton_list();
        setTimeout(() => {
          this.delmenu();
        }, 1000);
        break;
      case 'edit':
        this.updatabutton_list();
        setTimeout(() => {
          this.editmenu();
        }, 1000);
        break;
      // case 'query':
      //   this.query();
      //   break;
      // case 'import':
      //   this.import();
      //   break;
      // case 'download':
      //   this.download('用户管理')
      //   break;
    }

  }



 
  // 新增菜单函数
  addmenu(){
    var dialogService = this.dialogService;
    var $table = $('#menuTable');
    console.log("根据id得到行数据  ",$table.bootstrapTable('getData'));
    open();
    
    // 弹出函数
    function open() {
      // dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
      dialogService.open(MenuComponent2, {closeOnBackdropClick: false,})
    }
  }

  // 删除行数据
  delmenu(){
    var $table = $('#menuTable');
    // var rowmenu = localStorage.getItem("clickrow");
    var rowmenu = $table.bootstrapTable('getSelections');
    console.log("--获取选中的行数据--", rowmenu)

    var deleteitem = this.deleteitem;
    var publicservice = this.publicservice;
    var success = this.success;
    var danger = this.danger;
    if (rowmenu.length != 0){
      var row = rowmenu[0];
      var http = this.http;
      console.log("要删除的行数据！", rowmenu);
      
      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '提示', content:   `确定要删除${row.title}吗？`,rowData: JSON.stringify(row)}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
          if (name){
            $table.bootstrapTable('remove', {
              field: 'id',
              values: [row.id]
            });
            // 调用删除功能
            deleteitem(row, http, publicservice, success, danger)
          }
        }
      );

    }else{
      // 提示选择行数据

      this.dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '提示', content:   `请选择一行数据！`}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
          
        }
      );
    }
  }

  // 这是删除按钮调用-删除 数据库中的数据！
  deleteitem(row, http, publicservice, success, danger){
    const colums = {
      id: row["id"],
      textid: row["textid"]
    };
    console.log("---colums--",colums)
    const table = "menu_item";
    const method = "delete_menu_item";
    http.callRPC(table, method, colums).subscribe((result)=>{
      const status = result['result']['message'][0];
      if (status === 1){
        // 表示删除成功！
        // alert("删除成功")
        localStorage.removeItem(MULU);
        localStorage.removeItem(SYSMENU);
        success(publicservice)
        setTimeout(() => {
          location.reload();
        }, 1000);
      }else{
        // alert("删除失败！")
        danger(publicservice)
      }
    })
  }

  // 修改行数据函数
  editmenu(){
    var $table = $('#menuTable');
    var rowmenu = $table.bootstrapTable('getSelections');
    if (rowmenu.length != 0){
      var row = rowmenu[0];
      localStorage.setItem(SYSMENUEDIT, JSON.stringify(row));
      this.open();
    }else{
      // 提示选择行数据
      this.dialogService.open(EditDelTooltipComponent, { context: { title: '提示', content:   `请选择一行数据！`}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
        }
      );
    }
  }

  // 修改button弹出
  open() {
    // dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    this.dialogService.open(EditMenuComponent)
  }
  
  // 初始化table
  RanderTable(data, ){
    var dialogService = this.dialogService;
    var $table = $('#menuTable');
    var headers = this.headers;
    var http = this.http
    var publicservice = this.publicservice
    var success = this.success
    var danger = this.danger
    var Data = Data;
    

    var isactions = this.isactions;

    console.log("-------------------this.isactions-------------------", isactions);
    if (isactions === undefined){
      location.reload();
    }
    
    $(function() {
        $table.bootstrapTable({
            idField: 'id',
            data:data,
            dataTpye: 'jsonp',
            showColumns: false,
            columns: [
              {
                field: 'ck',
                checkbox: true,
                width: '10',
                // formatter: function(value, row, index){
                //   if (row.ck == true){

                //   }
                //   return { checked: true }
                // }
              },
              
              {
                field: 'title',
                title: '目录名称',
                width: '150',
              },
              {
                field: 'orderindex',
                title: '排序',
                sortable: true,
                align: 'center',
                width: '50',
              },
              {
                field: 'type',
                title: '类型',
                align: 'center',
                width: '100',
                formatter: typeFormatter
              },
              {
                field: 'permission',
                title: '权限标识',
                align: 'center',
                width: '50',
                formatter: permissionFormatter
              },
              {
                field: 'active',
                title: '是否启用',
                align: 'center',
                width: '50',
                formatter: activeFormatter
              },
              {
                field: 'link',
                title: '路由',
                align: 'center',
                width: '50',
              },
              {
                field: 'icon',
                title: '菜单图标',
                align: 'center',
                width: '100',
              },
              
              {
                  field: 'action',
                  title: '操作',
                  width: '200',
                  align: 'center',
                  events: {
                    'click .edit': function (e, value, row, index) {
                        // alert('You click like action, row: ' + JSON.stringify(row));
                        // 将行数据保存在local storage中！
                        localStorage.setItem(SYSMENUEDIT, JSON.stringify(row));
                        // 弹出
                        open();
                        
                    },
                    'click .remove': function (e, value, row, index) {
                        console.log("删除的row数据：", row);
                        dialogService.open(EditDelTooltipComponent, { closeOnBackdropClick: false,context: { title: '删除菜单提示', content:   `确定要删除${row.title}吗？`,rowData: JSON.stringify(row)}} ).onClose.subscribe(
                          name=>{
                            console.log("----name-----", name);
                            if (name){
                              $table.bootstrapTable('remove', {
                                field: 'id',
                                values: [row.id]
                              });
                              // 调用删除功能
                              deleteitem(row, publicservice, success, danger)
                            }
                          }
                        );

                        // 删除之后 应该需要更新table
                        // getdata_for_table();
                        
                    }
                  },
                  formatter: actionFormatter,
              },
            ],
            //   data: data,
            //   在那一列展示树形
            treeShowField: 'title',
            // 指定父id列
            parentIdField: 'parentid',
            
            onResetView: function() {

              console.log("-------------------------------------->>>>>>",$table.bootstrapTable('getOptions').columns)
                $table.treegrid({
                    treeColumn: 1,
                    onChange: function() {
                      // $table.bootstrapTable('resetWidth')
                    }
                })
                //只展开树形的第一级节点
                if($table.treegrid('getRootNodes').length != 0){
                  // $table.treegrid('getRootNodes').treegrid('expand'); // 只展开树形的第一级节点
                  $table.treegrid('getRootNodes').treegrid('collapseAll'); // 不展开

                }

                
            },
            // classes: "table table-bordered  table-hover table-primary:hover",
        })
        
    })
      

    // 样式！
    $("#menuTable").children("tbody").children("tr").children("td").attr("style", "padding: 0px 12px; text-align: center;");
    $("#menuTable tbody tr td:nth-child(2)").attr("style", "")
    function typeFormatter(value, row, index) {
    if (value === 1) {
        return '<span class="label label-success">菜单</span>'
    }
    if (value === 0) {
        return '<span class="label label-success">目录</span>'
      }
      if (value === 2) {
        return '<span class="label label-info">按钮</span>'
    }
    return '-'
    };

    function permissionFormatter(value, row, index) {
      return `<span class="label label-success">${value}</span>`
    }

    // 是否启用
    function activeFormatter(value, row, index){
      if (value == 1) {
        return '<span class="label label-info">是</span>'
      }
      if (value == 0) {
        return '<span class="label label-success">否</span>'
      }
    }

    function statusFormatter(value, row, index) {
    if (value === 1) {
        return '<span class="label label-success">正常</span>'
    }
    return '<span class="label label-default">锁定</span>'
    }


    // 操作
    function actionFormatter(value, row, index) {
      var edit_class = "buedit edit-edit edit";
      var del_class = "buremove edit-edit remove ";
      // disable_edit
      
      if (isactions["edit"]){}else{
        edit_class = "disable_edit edit-edit";
        
      }
      if(isactions["del"]){}else{
        del_class = "disable_remove remove-remove";
      }

      return [
        `<button class="${edit_class}">`,
        '<a class="btn " href="javascript:void(0)" title="编辑" style="color:#464545">',
        '<i class="nb-edit" style="font-size: 32px; "></i>',
        '</a>  ',
        '</button>',
        
        `<button class="${del_class}">`,
        '<a class="btn " href="javascript:void(0)" title="删除"   style="color:#464545">',
        '<i class="nb-trash"  style="font-size: 32px; "></i>',
        '</a>',
        '</button>',
      ].join('')
      // return [
      //   '<a class="edit btn btn-info" href="javascript:void(0)" title="编辑" style="color:#ffffff; margin-right: 50px; " ">',
      //   '<i class="nb-edit" style="font-size: 32px; "></i>',
      //   '</a>  ',
      //   '<a class="remove btn btn-danger" href="javascript:void(0)" title="删除"   style="color:#ffffff">',
      //   '<i class="nb-trash"  style="font-size: 32px; "></i>',
      //   '</a>'
      // ].join('')

    }



    // 删除功能
    function deleteitem(row, publicservice, success, danger){
      const colums = {
        id: row["id"],
        textid: row["textid"]
      };
      console.log("---colums--",colums)
      const table = "menu_item";
      const method = "delete_menu_item";
      http.callRPC(table, method, colums).subscribe((result)=>{
        console.log("删除菜单---=====",result)
        const status = result['result']['message'][0];
        if (status === 1){
          // 表示删除成功！
          // alert("删除成功")
          localStorage.removeItem(MULU);
          localStorage.removeItem(SYSMENU);
          success(publicservice)
          setTimeout(() => {
            location.reload();
          }, 1000);
        }else{
          // alert("删除失败！")
          danger(publicservice)
        }
      })
    }

    // ajax请求
    function getdata_for_table() {
      // window.location.reload();
      $.ajax({
          url: url,
          type: "POST",
          headers: headers,
          data: JSON.stringify({
              "jsonrpc": "2.0",
              "method": "getsysmenu_withuser",
              "params": {},
              "id": "1"
            }),
          dataType: "json",
          success: analysisMenu,
          error: function(err){
              alert("失败")
          }
      });
    }

    // 解析menu
    function analysisMenu(res) {
      console.log("params: ", res)
      var mulu = res['msg']['mulu'];
      var caidan = res['msg']['caidan'];
      
      // 菜单
      var caidan_lsit = [];
      caidan.forEach(element => {
        var dict_item = {};
        dict_item["ck"] = null;
        dict_item["id"] = element['menu_id'];
        dict_item["pid"] = Number(element['parent_id']);
        // 得到上级菜单名称
        mulu.forEach(m => {
          if (Number(element['parent_id']) == m['menu_id'])
          dict_item["parentname"] = m['name'];
          
        });
        dict_item["name"] = element['name'];
        dict_item["menuurl"] = element['url'];
        dict_item["permissionValue"] = element['perms'];
        dict_item["status"] = element['type']; // type
        caidan_lsit.push(dict_item);
      });

      // 目录
      var mulu_lsit = [];
      mulu.forEach(element => {
        var dict_item = {};
        dict_item["ck"] = null;
        dict_item["id"] = element['menu_id'];
        dict_item["pid"] = Number(element['parent_id']);
        dict_item["name"] = element['name'];
        dict_item["menuurl"] = element['url'];
        dict_item["permissionValue"] = element['perms'];
        dict_item["status"] = element['type'];
        mulu_lsit.push(dict_item)
      });
      
      var data = caidan_lsit.concat(mulu_lsit);
      // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",data)
      // $table.bootstrapTable({data: data});
      $table.bootstrapTable('refreshOptions', {data: data})
    }
    

    // 出入编辑前的行数据和编辑之后得到的表单数据，输出 整合后的行数据作为最终的含数据！
    function lastrowdata(oldrowdata, formdata) {
      console.log("编辑前的行数据", oldrowdata);
      console.log("编辑之后得到的表单数据", formdata);
      oldrowdata["link"] = formdata["link"];
      oldrowdata["title"] = formdata["title"];
      oldrowdata["orderindex"] = formdata["orderindex"];
      oldrowdata["type"] = formdata["type"];
      oldrowdata["icon"] = formdata["icon"];
      oldrowdata["type"] = formdata["type"];
      return oldrowdata
    }

    // 弹出函数
    function open() {
      dialogService.open(EditMenuComponent,{closeOnBackdropClick: false,});
      // dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
      // .onClose.subscribe(name => name && this.names.push(name));
    }


  }

  

  ngOnDestory(){
    // 销毁table
    var $table = $('#menuTable');
    $table.bootstrapTable('desstrooy');
  }

  loadMenu(){
    console.log("这是 系统设置的菜单界面！")
    var sysmenu = localStorage.getItem(SYSMENU) == null ? [] : JSON.parse(localStorage.getItem(SYSMENU));
    var mulu_language = localStorage.getItem('mulu_language') == null ? 'zh_CN' : localStorage.getItem('mulu_language');
    if(sysmenu.length == 0 || mulu_language != localStorage.getItem('currentLanguage')){
      this.publicservice.getMenu().subscribe((data:any[])=>{
        if (data.length === 0){
          // 表示token 过期，返回登录界面
          this.router.navigate([loginurl]);
        }else{
          const colums = {
            languageid: this.http.getLanguageID(),
            roles: data
          };
          console.log("---colums--",colums)
          const table = "menu_item";
          // const method = "get_systemset_menu";
          const method = "get_systemset_menu_all";
          this.http.callRPC(table, method, colums).subscribe((result)=>{
            console.log("---------------->>>>",result)
            const baseData = result['result']['message'][0];
            if (baseData != "T"){
              var menu = this.dataTranslation(baseData);
              localStorage.setItem(SYSMENU, JSON.stringify(menu));
              // 按钮
              this.RanderTable(menu);
            }
          })
        }

      });
    }else{
      var menu = this.dataTranslation(sysmenu);

      console.log("------menu--目录：", sysmenu);
      this.RanderTable(menu);
    }
    
  }

  dataTranslation(baseMenu) {
    // 生成父子数据结构
    console.log("-=-=-=-=-=-=baseMenu-=-=-=-=",baseMenu)
    let nodeData = [];
    baseMenu.forEach(item => {
      let map = {};
      map["id"] = item.id;
      map["link"] = item.link;
      map["active"] = item.active;
      map["orderindex"]=item.orderindex;
      map["title"] = item.title;
      map["icon"] = item.icon;
      map["type"] = item.type;
      map["textid"] = item.textid;
      map["permission"] = item.permission === null ? null: item.permission;
      
      if (item.parentid === null){
        map["parentid"] = 0;
      }else{
        map["parentid"] = item.parentid;
      }
      nodeData.push(map)
    });
    
    
    
    return nodeData;
  }
  

  // 更新button_list，在修改、新增、删除后！
  updatabutton_list(){
    this.publicservice.getMenu().subscribe((data)=>{
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
            var method = element["permission"].split(":")[1];
            // info success warning danger  primary
            switch (method) {
              case 'add':
                element['class']="info"
              break;
              case 'del':
                element['class']="danger"
                break;
              case 'edit':
                element['class']="warning"
                break;
              case 'query':
                element['class']="success"
                break;
              case 'import':
                element['class']="primary"
                break;
              case 'download':
                element['class']="primary"
                break;
            }
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



  
  


  
}
