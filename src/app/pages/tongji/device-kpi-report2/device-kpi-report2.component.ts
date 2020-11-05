import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { menu_button_list } from '../../../appconfig';

import { Router } from '@angular/router'
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';
declare let layui;

declare let $;

import { DeviceKpiReport2Service } from './device-kpi-report2-service';
import { HttpserviceService } from '../../../services/http/httpservice.service';
@Component({
  selector: 'ngx-device-kpi-report2',
  templateUrl: './device-kpi-report2.component.html',
  styleUrls: ['./device-kpi-report2.component.scss']
})
export class DeviceKpiReport2Component implements OnInit, OnDestroy {
  @ViewChild("departmentselect") departmentselect:any;
  @ViewChild("device_tpye") device_tpye:any;
  @ViewChild("asset_number") asset_number:any;
  @ViewChild("daterange") daterange:any;

  // 下拉框---部门
  departments = {
    name: "部门信息",
    placeholder: '请选择部门',
    groups:[
      { title: '动力', datas: [{ name: '动力-1' },{ name: '动力-2' },{ name: '动力-3' },{ name: '动力-4' }] },
      { title: '资产', datas: [{ name: '资产-1' },{ name: '资产-2' },{ name: '资产-3' },{ name: '资产-4' }] },
      { title: '新能源', datas: [{ name: '新能源-1' },{ name: '新能源-2' },{ name: '新能源-3' },{ name: '新能源-4' }] },
    ]
  };

  // 下拉框---设备类型
  devicetpye = {
    placeholder: "请选择设备类型",
    name: '设备类型',
    datas: [
      { name: 'GT-2030-123' },
      { name: 'GT-2030-149' },
      { name: 'GT-2030-230' },
      { name: 'GT-2030-359' },
      { name: 'GT-2030-666' },
    ]
  }


  // 下拉框---资产编号
  assetsnumber = {
    placeholder: "请选择资产编号",
    name: '资产编号',
    datas: [
      { name: 'GT1918-1720TM' },
      { name: 'GT1917-1819TM' },
      { name: 'GT1916-1919TM' },
      { name: 'GT1915-2018TM' },
      { name: 'GT1914-2117TM' },
      { name: 'GT1913-2216TM' },
    ]
  }

  // 前端要展示的button 主要是：增、删、改
  buttons;

  // 前端要展示的buttons 主要是：搜索、导入导出
  buttons2;

  // 发送给 日期
  divice_kpi_report = {
    divice_kpi_report: true,
    test_task_manage: false,
    man_hourkpi: false,
  };

  // 日期范围
  date_ranges = "device_kpi_date_range"

  // tree_input_data 树状选择下拉框 
  dev_get_device_department;

  constructor( private router: Router, private publicservice: PublicmethodService, private deviceservice: DeviceKpiReport2Service, private http: HttpserviceService) { 
    

  }

  ngOnInit(): void {
    this.getbuttons();
    this.initdate();

    // 得到树状data、并渲染：get_tree_input_data()
    this.get_tree_input_data();
    



  }

  ngOnDestroy(){
    // 删除 man-hour-kpi-report2-buttons
    localStorage.removeItem("device-kpi-report2-buttons");
    localStorage.removeItem("kpi_for_detail");
  }

  // 初始化日期范围
  initdate(){
    var date_ranges = this.date_ranges
    layui.use('laydate', function(){
      var laydate = layui.laydate;
      //日期范围
      laydate.render({
        elem: '#divice_kpi_report'
        ,range: true
        // ,trigger: 'click'//呼出事件改成click
        ,done: function(value, date, endDate){
          localStorage.setItem(date_ranges, JSON.stringify(value))
          console.log(value); //得到日期生成的值，如：2017-08-18
          console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
          console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
        }
      });


    })
  }

  // 得到日期
  getselect(){
    var date_range = localStorage.getItem(this.date_ranges)? localStorage.getItem(this.date_ranges): false;
    if (date_range){
      var date = JSON.parse(date_range).split(' - ');
      console.log("date--->", date)
      var date_list = date;
      localStorage.removeItem(this.date_ranges)
      return date_list
    }
    // var date_list = [this.datepipe.transform(this.selectedMoments[0],'yyyy-MM-dd'), this.datepipe.transform(this.selectedMoments[1],'yyyy-MM-dd')];
    // return date_list;
  }


  // kpi报表
  kpireport(){
    this.router.navigate(['/pages/tongji/deviceKpiReport/kpitable'])
  }
  // kpi 详情
  kpidetail(){
    this.router.navigate(['/pages/tongji/deviceKpiReport/kpidetail'])
  }

  // 得到buttons----------------------------------------------------------
  getbuttons(){
    // 根据menu_item_role得到 该页面对应的 button！
    var button_list = localStorage.getItem(menu_button_list)? JSON.parse(localStorage.getItem(menu_button_list)): false;
    if (button_list){
      // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      // console.log(button_list)
      // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      var man_hour_kpi_report2_buttons = localStorage.getItem("device-kpi-report2-buttons") ===null? false: JSON.parse(localStorage.getItem("device-kpi-report2-buttons"))

      if (man_hour_kpi_report2_buttons){
        this.buttons = man_hour_kpi_report2_buttons["buttons"];
        this.buttons2 = man_hour_kpi_report2_buttons["buttons2"];
      }else{
        this.publicservice.get_current_pathname().subscribe(res=>{
          console.log("get_current_pathname   ", res);
          var currentmenuid = res["id"];
          var buttons = [];
          // 分离搜索、导入、导出
          var buttons2 = [];
          
          button_list.forEach(button => {
            if (currentmenuid === button["parentid"]){
              var method = button["permission"].split(":")[1];
              // 该界面--设备kpi报表！按钮功能 搜索、导出 method === "import"
              console.log("---->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",method)
              if ( method === "query" ||  method === "download" ){
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
          
          localStorage.setItem("device-kpi-report2-buttons", JSON.stringify({buttons: buttons, buttons2: buttons2}))
          console.log("-----------buttons2--------",buttons2);
          console.log("-----------buttons--------",buttons);
  
        })

      }
    }
  };




  // button按钮
  action(actionmethod){
    console.log("++++++++++++++++++++action(actionmethod)++++++++++++++++++++++++++++", actionmethod);
    var method = actionmethod.split(":")[1];
    console.log("--------------->method", method)
    switch (method) {
      // case 'add':// 没有新增功能！
      //   this.add("新增");
      //   break;
      // case 'del':
      //   this.del();
      //   break;
      // case 'edit':
      //   this.edit();
      //   break;
      case 'query':
        this.query();
        break;
      // case 'import': // 没有导入功能！
      //   this.import("导入");
      //   break;
      case 'download':
        // this.download('设备KPI报表')
        this.download()
        break;
    }

  }

  // 搜索按钮
  query(){
    var departmentselect_data = this.departmentselect.getselect();
    var device_tpye_data = this.device_tpye.getselect();
    var asset_number_data = this.asset_number.getselect();
    var daterange_data = this.getselect()
    console.log("<------------搜索----------->", departmentselect_data, device_tpye_data,asset_number_data, daterange_data);
    // 将搜索的值发布！
    this.deviceservice.changeData(
      {
        department:departmentselect_data, 
        device_tpye:device_tpye_data,
        asset_number: asset_number_data,
        daterange:daterange_data
      }
    )
    // this.test_task_table_data.source = null;
  }

  // 导出文件
  download(){
    // this.mytable.download(title);
    // localStorage.setItem("device_kpi_table_down", JSON.stringify(true))
    // 发布方
    this.deviceservice.changeMessage(true)

  };

  // 初始化 tree input
  input_tree(treedata){
    var that = this;
    console.log("**********初始化 tree input********", treedata, that)
    //  加载 eleTree 模块
    layui.config({
      base: "./assets/pages/system-set/layui/module/"
    }).extend({
        eleTree3: "eleTree/eleTree"
    });

    layui.use(['layer', 'form', 'eleTree',], function(){
      var layer = layui.layer
      ,form = layui.form
      var eleTree = layui.eleTree
      // =================
      var el5;
      var $ele5 = $(".ele5")
      // 鼠标移入事件！
      $("[name='anniunparentname']").mouseenter(function (e) {
        e.stopPropagation();
        if(!el5){
            el5=eleTree.render({
                elem: '.ele5',
                data: treedata,
                // url: "../eleTree/tree.json",
                defaultExpandAll: false, // 是否默认展开所有节点
                expandOnClickNode: false,
                highlightCurrent: true, // 是否高亮当前选中节点
            });
        }
        $ele5.show();
        // $(".ele5").toggle();

        
        

      });
      $(".col-md-2").mouseleave(function(e){
        // console.log("鼠标移出====================");
        
        $(".ele5").hide();

      })
      // input被选中事件
      eleTree.on("nodeClick(data5)",function(d) {
          $("[name='anniunparentname']").val(d.data.currentData.label)
          // console.log(d.data);    // 点击节点对应的数据
          // console.log("当前选择的数据的id", d.data.currentData.id, d.data.currentData.label);    // 点击节点对应的数据
          // console.log("------------>选择的数据的 id",d.data.currentData.id)
          // 判断是否是父节点，根据 d.data.currentData.children 的长度是否 > 0 
          if (d.data.currentData.children.length > 0){
            // 表示为部门！
            var children = d.data.currentData.children;
            console.log("children: \t", children);
            that.send_selected_data(children);
          }else{
            // 部门下的子节点！
            var currentData = d.data.currentData;
            that.send_selected_data([currentData]);
            console.log("currentData: \t", currentData)
          }
          // console.log(d.isChecked);   // input是否被选中
          // console.log(d.node);    // 点击的dom节点
          // console.log(this);      // input对应的dom
          $(".ele5").hide();
      }) 
      $(document).on("click",function() {
          $(".ele5").hide();
      })

      // =================
    });
  }


  // 得到 tree input 的数据！
  get_tree_input_data(){
    // 得到设备信息！ 树状选择框--需要
    var colmun = {
    }
    this.http.callRPC('device', 'dev_get_device_department', colmun).subscribe((res)=>{
      // console.log("get_menu_role", result)
      this.dev_get_device_department = res['result']['message'][0]
      if (this.dev_get_device_department.code === 1){
        var treedata = this.dev_get_device_department.message;
        console.log("dev_get_device_department---------------------------->>>", treedata);
        var handled_treedata = this.handle_treedata_befare(treedata); // 将数据处理成 tree data 需要的格式！
        // tree input             
        this.input_tree(handled_treedata);
      }else{
        // 没有得到 tree data
      }
    })
  }

  // 将原始数据处理成 tree data 需要的数据！
  handle_treedata_befare(treedata:any[]){
    var item = {}
    var obj_list = [];
    var exit_td_obj_ch_list = [];
    for (let index = 0; index < treedata.length; index++) {
      const tditem = treedata[index];

      if (!item[tditem["department"]]){
        item[tditem["department"]] = 1;
        var td_obj_ch: TREEV2 = {
          id: tditem.id,    // 节点唯一索引，
          parentid: index,    // 父节点id
          label: tditem.devicename, // 节点标题
          checked: false,// 节点是否初始为选中状态， 默认false
          disabled: false, // 节点是否为禁止状态，默认为false
          children: [],
          deviceno: tditem.deviceno,
          deviceid: tditem.deviceid,
          parent_label: tditem.department
        }
        var td_obj:TREEV2 = {
          id: index,    // 节点唯一索引，
          parentid: null,    // 父节点id
          label: tditem.department, // 节点标题
          checked: false,// 节点是否初始为选中状态， 默认false
          disabled: false, // 节点是否为禁止状态，默认为false
          children: [
            td_obj_ch,
          ], // 子节点，支持设定项同父节点
          deviceno: null,
          deviceid: null,
          parent_label: null
        }
        obj_list.push(td_obj)
      }else{
        // 表明 是 部门（父节点），需要添加子节点
        var td_obj_ch: TREEV2 = {
          id: tditem.id,    // 节点唯一索引，
          parentid: index,    // 父节点id
          label: tditem.devicename, // 节点标题
          checked: false,// 节点是否初始为选中状态， 默认false
          disabled: false, // 节点是否为禁止状态，默认为false
          children: [],
          deviceno: tditem.deviceno,
          deviceid: tditem.deviceid,
          parent_label: tditem.department
        }
        exit_td_obj_ch_list.push(td_obj_ch);
      }
    }
    console.log("----------------->>>>> 部门\t不\t重复的", obj_list);
    console.log("\n\n\n----------------->>>>> 部门重复的", exit_td_obj_ch_list);
    obj_list.forEach(obj=>{ // 部门节点 + 部门下的子节点
      exit_td_obj_ch_list.forEach(exit_obj=>{  // 部门下的子节点
        if (obj.label === exit_obj.parent_label ){
          exit_obj.parentid = obj.id;
          obj.children.push(exit_obj);
        }
      })
    })
    console.log("----------------->>>>> 部门\t不\t重复的=====处理后的！  ", obj_list);
    return obj_list;
  }

  // 调用子组件 kpi-table 将 根据选择的input的值传递过去！
  send_selected_data(data){
    // data 为发送给子组件的数据！  这tm是路由，不是子组件！
    console.log("---------------------------")
    console.log("--------------发送给子组件的数据-------------", data)
    console.log("---------------------------")
  }


}

interface TREEV2 {
  id: number,    // 节点唯一索引，对应数据库中id
  parentid: number | null,    // 父节点id
  label: string, // 节点标题
  checked: boolean,// 节点是否初始为选中状态， 默认false
  disabled: boolean, // 节点是否为禁止状态，默认为false
  children: TREEV2[] | [], // 子节点，支持设定项同父节点
  deviceno: string | null, // 设备编号
  deviceid: string | null, // 设备id
  parent_label: string | null // 父节点 label

}

// 树状结构 实例！
var data =  [
  {
      "id": 1,
      "label": "安徽省",
      "children": [
          {
              "id": 2,
              "label": "马鞍山市",
              "disabled": true,
              "children": [
                  {
                      "id": 3,
                      "label": "和县"
                  },
                  {
                      "id": 4,
                      "label": "花山区",
                      "checked": true
                  }
              ]
          },
          {
              "id": 22,
              "label": "淮北市",
              "children": [
                  {
                      "id": 23,
                      "label": "濉溪县"
                  },
                  {
                      "id": 24,
                      "label": "相山区",
                      "checked": true
                  }
              ]
          }
      ]
  },
  {
      "id": 5,
      "label": "河南省",
      "children": [
          {
              "id": 6,
              "label": "郑州市"
          }
      ]
  },
  {
      "id": 10,
      "label": "江苏省",
      "children": [
          {
              "id": 11,
              "label": "苏州市"
          },
          {
              "id": 12,
              "label": "南京市",
              "children": [
                  {
                      "id": 13,
                      "label": "姑苏区"
                  },
                  {
                      "id": 14,
                      "label": "相城区"
                  }
              ]
          }
      ]
  }
]