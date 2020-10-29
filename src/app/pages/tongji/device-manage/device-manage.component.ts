import { Component, OnInit, ViewChild } from '@angular/core';

import { DEVICE_MANAGE_SETTINGS } from '../tongji_tablesettings';

import { menu_button_list, device_action } from '../../../appconfig';

import { DeviceManageComponent as Add_Edit_DeviceManageComponent } from '../../../pages-popups/tongji/device-manage/device-manage.component';
import { EditDelTooltipComponent } from '../../../pages-popups/prompt-diallog/edit-del-tooltip/edit-del-tooltip.component';


import * as XLSX from 'xlsx';
type AOA = any[][];

import {LocalDataSource} from "@mykeels/ng2-smart-table";
import { PublicmethodService } from '../../../services/publicmethod/publicmethod.service';
import { NbDialogService } from '@nebular/theme';
import { HttpserviceService } from '../../../services/http/httpservice.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-device-manage',
  templateUrl: './device-manage.component.html',
  styleUrls: ['./device-manage.component.scss']
})
export class DeviceManageComponent implements OnInit {

  @ViewChild("departmentselect") departmentselect:any;
  @ViewChild("device_tpye") device_tpye:any;
  @ViewChild("asset_number") asset_number:any;
  @ViewChild("mytable") mytable:any;

  constructor(private publicservice: PublicmethodService, private dialogService: NbDialogService, private http: HttpserviceService) { }


  importdata: AOA = [[1,2], [3,4]];

  // 导出文件名
  filename;

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
  assets = {
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

  source:LocalDataSource

  // 设备监控table数据
  device_manage_table_data = {
    settings: DEVICE_MANAGE_SETTINGS,
    source: new LocalDataSource(),
  }

  // 前端要展示的button 主要是：增、删、改
  buttons;

  // 前端要展示的buttons 主要是：搜索、导入导出
  buttons2;

  // 要删除、修改的行数据 
  rowdata = [];

  // 每一页展示多少条数据
  nzPageSize;

  // plv8请求
  querst(table: string, method: string, colmun: Object){
    return new Observable((observe)=>{
      this.http.callRPC(table, method, colmun).subscribe((result)=>{
        observe.next(result);
      })

    })
  }


  ngOnInit(): void {
    // this.device_manage_table_data.source["data"] = [
    //   { id: '1', devicename: "AVL电机测试台架", assetno: "1001231", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '2', devicename: "AVL电机测试台架", assetno: "1001232", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '3', devicename: "AVL电机测试台架", assetno: "1001233", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '4', devicename: "AVL电机测试台架", assetno: "1001234", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '5', devicename: "AVL电机测试台架", assetno: "1001235", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '6', devicename: "AVL电机测试台架", assetno: "1001236", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '7', devicename: "AVL电机测试台架", assetno: "1001237", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '8', devicename: "AVL电机测试台架", assetno: "1001238", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '9', devicename: "AVL电机测试台架", assetno: "1001239", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '10', devicename: "AVL电机测试台架", assetno: "1001231", department: "新能源电机试验室", type: "性能", devicestatus: "运行", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '11', devicename: "AVL电机测试台架", assetno: "1001232", department: "新能源电机试验室", type: "性能", devicestatus: "停止", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '12', devicename: "AVL电机测试台架", assetno: "1001233", department: "新能源电机试验室", type: "性能", devicestatus: "维护", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    //   // { id: '13', devicename: "AVL电机测试台架", assetno: "1001234", department: "新能源电机试验室", type: "性能", devicestatus: "故障", statusTime: "19.8", belonged: "李云龙", createdon: "2020-11-02 12:12:12" },
    // ];
    this.getbuttons();

    this.inittable();
  }

  ngAfterViewInit(){
    // document.getElementsByClassName('devicename')['0'].style.width ='10px'
    // document.getElementsByClassName('devicename')['0'].style.border ='1px red solid'
    // document.getElementsByClassName('devicename')['0'].style.overflow ='hidden'
    // var devicename = document.getElementsByClassName('devicename');
    // console.log('--devicename--', devicename)
  }


  // 初始化table
  inittable(){
    // 得到table数据
    var table = "device";
    var methond = "dev_get_device";
    var colmun = {}
    this.querst(table, methond, colmun).subscribe(res=>{
      console.log("-----------------res", res)
      const rowData = res['result']['message'][0];
      if (rowData.length > 0){
        var after_datas = this.show_table_before(rowData);
        // 根据id排序
        after_datas.sort(function(data1,data2){return data1.id - data2.id});
        this.device_manage_table_data.source.load(after_datas);
      }
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

        console.log("-----------buttons2--------",buttons2);
        console.log("-----------buttons--------",buttons);
        

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
        localStorage.setItem(device_action, JSON.stringify(isactions));
        console.log("_________________________________-isactions---------________________",isactions)
      })
    }
  }


  // button按钮
  action(actionmethod){
    console.log("++++++++++++++++++++action(actionmethod)++++++++++++++++++++++++++++", actionmethod);
    var method = actionmethod.split(":")[1];
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
        this.download('设备管理')
        break;
    }

  }

  // button add
  add(){
    console.log("button----add");
    this.dialogService.open(Add_Edit_DeviceManageComponent, { context: { title: '添加设备', content:  'false'}} )
  }

  // button del  -- dev_delete_device
  del(){
    console.log("删除-设备管理", this.rowdata);
    if (this.rowdata.length === 0){
      // 未选中
      this.dialogService.open(EditDelTooltipComponent, { context: { title: '删除设备提示', content:   `请选择要需要删除的的行数！`}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
        }
      );

    }else if (this.rowdata.length === 1){
      // 选中一条
      var table = 'device';
      var method = 'dev_delete_device';
      var colums = this.rowdata[0];
      this.http.callRPC(table, method, colums).subscribe((result)=>{
        const status = result['result']['message'][0];
        if (status === 1){
          this.delsuccess()
          setTimeout(() => {
            location.reload();
          }, 1000);
        }else{
          this.deldanger()
        }
      })
    }else{
      // 选中多条
      var rowData = this.rowdata;
      try {
        rowData.forEach(colums => {
          var table = 'device';
          var method = 'dev_delete_device';
          this.http.callRPC(table, method, colums).subscribe((result)=>{
            const status = result['result']['message'][0];
            if (status === 1){
            }else{
              throw 'error, 删除失败！'
            }
          })
        });
        location.reload();
        this.delsuccess()
      }catch(err){
        this.deldanger()
      }

      

    }
  }
  
  // button deit
  edit(){
    console.log("编辑-设备管理", this.rowdata);
    if (this.rowdata.length === 0){
      // 未选中
      this.dialogService.open(EditDelTooltipComponent, { context: { title: '编辑设备提示', content:   `请选择要需要编辑的的行数！`}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
        }
        );
        
      }else if (this.rowdata.length === 1){
        // 选中一条
        console.log("选中一条", this.rowdata);
      this.dialogService.open(Add_Edit_DeviceManageComponent, { context: { title: '编辑设备提示', content:   `true`, rowData: JSON.stringify(this.rowdata)}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
        }
      );
    }else{
      // 选中多条
      this.dialogService.open(EditDelTooltipComponent, { context: { title: '编辑设备提示', content:   `请选择要一条需要编辑的的行数！`}} ).onClose.subscribe(
        name=>{
          console.log("----name-----", name);
        }
      );
    }
  }

  // 点击行，选中行
  runParent(rowdata){
    this.rowdata = this.option_table_before(rowdata["selected"]);
    
    console.log("---子组件传值---", this.rowdata);
  }


  // 导入文件
  importfile(){
    var input = document.getElementById("import");
    // js执行点击input
    input.click();
  }

  // 搜索按钮
  query(){
    var departmentselect_data = this.departmentselect.getselect();
    var device_tpye_data = this.device_tpye.getselect();
    var asset_number_data = this.asset_number.getselect();
    console.log("<------------搜索----------->", departmentselect_data, device_tpye_data,asset_number_data)
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
    console.log("rowData_list---->", rowData_list)
    var columns = this.device_manage_table_data.settings['columns'];
    var columnsList = [];
    for (let k in columns){
      columnsList.push(k);
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
    
    // 插入数据库之前 处理数据
    var datas = this.option_table_before(rowData)
    console.log("插入数据库之前 处理数据---->", datas);
    // 将导入的数据存入数据库
    this.dev_insert_device(datas);

    // this.device_manage_table_data.source["data"] = rowData;
    // 将导入的数据展示在table中
    // this.device_manage_table_data.source.load(rowData);
    var after_datas = this.show_table_before(rowData)
    this.device_manage_table_data.source.load(after_datas);

  }

  // ----------------------------导入---------------------------

  // 导出文件
  download(title){
    this.mytable.download(title);
  };


  // 将导入的数据插入到数据库中
  dev_insert_device(datas){
    const table = "device";
    const method = 'dev_insert_device';
    try {
      datas.forEach(rd => {
        this.http.callRPC(table, method, rd).subscribe((result)=>{
          console.log("插入设备数据：", result)
          const status = result['result']['message'][0];
          if (status === 1){
          }else{
            throw 'error, 删除失败！'
          }
        })
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
      this.success()
    }catch(err){
      console.log("err: ", err)
      this.danger()
    }

    
  }

  // 在展示表格前，处理一下数据
  show_table_before(datas){
    console.log("datas---->", datas)
    console.log("datas[0]---->", datas[0].devicename)
    var after_datas: DeviceData[] =[];
    var type;
    var devicestatus;
    datas.forEach(data => {
      switch (data["type"]) {
        case 1:
          type = "台架设备";
          break;
          case 2:
            type = "移动资产";
            break;
          case 3:
            type = "举升机";
          break;
          case 402:
            type = "其它设备";
          break;
      };
      switch (data["devicestatus"]) {
        case 1:
          devicestatus = "在用";
          break;
          case 2:
            devicestatus = "封存";
            break;
          case 3:
            devicestatus = "停用";
          break;
          case 4:
            devicestatus = "闲置";
          break;
          case 402:
            devicestatus = "其它";
          break;
      }
      var after_data: DeviceData = {
        id: data.id,
        devicename:data.devicename,
        deviceno:data.deviceno,
        type:type,
        active:data.active === 1? "是": "否",
        assetno:data.assetno,
        factoryno:data.factoryno,
        deviceid:data.deviceid,
        purchaseon:data.purchaseon,
        supplier:data.supplier,
        location:data.location,
        department:data.department,
        groups:data.groups,
        belonged:data.belonged,
        devicestatus:devicestatus,
        createdby:data.createdby,
        createdon:data.createdon
      }
      after_datas.push(after_data)
    });
    
    
    return after_datas
  };

  // 编辑修改前，处理一下选中的table数据
  option_table_before(datas){
    var after_datas: OptionDeviceData[] =[];
    var type;
    var devicestatus;
    datas.forEach(data => {
      switch (data["type"]) {
        case "台架设备":
          type = 1;
          break;
          case "移动资产":
            type = 2;
            break;
          case "举升机":
            type = 3;
          break;
          default:
            type = 402;
          break;
      };
      switch (data["devicestatus"]) {
        case "在用":
          devicestatus = 1;
          break;
          case "封存":
            devicestatus = 2;
            break;
          case "停用":
            devicestatus = 3;
          break;
          case "闲置":
            devicestatus = 4;
            break;
          default:
            devicestatus = 402;
          break;
      }
      var after_data: OptionDeviceData = {
        id: data.id,
        devicename:data.devicename,
        deviceno:data.deviceno,
        type:type,
        active:data.active === "是"? 1: 0,
        assetno:data.assetno,
        factoryno:data.factoryno,
        deviceid:data.deviceid,
        purchaseon:data.purchaseon,
        supplier:data.supplier,
        location:data.location,
        department:data.department,
        groups:data.groups,
        belonged:data.belonged,
        devicestatus:devicestatus,
        createdby:data.createdby,
        createdon:data.createdon
      }
      after_datas.push(after_data)
    });
    return after_datas
  }

  // 展示状态
  success(){
    this.publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"导入成功!"});
  }
  danger(){
    this.publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"导入失败!"});
  }
  delsuccess(){
    this.publicservice.showngxtoastr({position: 'toast-top-right', status: 'success', conent:"删除成功!"});
  }
  deldanger(){
    this.publicservice.showngxtoastr({position: 'toast-top-right', status: 'danger', conent:"删除失败!"});
  }
  // 分页
  nzpageindexchange(event){
    console.log("用户--分页：", event);
    var offset = (event.current - 1) * event.nzPageSize; 
    console.log("offset: limit", offset, event.nzPageSize)
    // this.getsecurity('employee', 'get_employee_limit', {offset:offset,limit:event.nzPageSize});
  
    // this.querst(table, methond, colmun).subscribe(res=>{
    //   console.log("-----------------res", res)
    //   const rowData = res['result']['message'][0];
    //   if (rowData.length > 0){
    //     var after_datas = this.show_table_before(rowData);
    //     // 根据id排序
    //     after_datas.sort(function(data1,data2){return data1.id - data2.id});
    //     this.device_manage_table_data.source.load(after_datas);
    //   }
    // })
    // this.getsecurity('employee', 'get_employee_limit', {offset:0,limit:this.nzPageSize,numbers:0});
  }

}



// table 中每行数据类型！这是展示table需要的数据
interface DeviceData {
  id: number,
  devicename:string,
  deviceno:string,
  type:string,
  active:string,
  assetno:string,
  factoryno:string,
  deviceid:number,
  purchaseon:string,
  supplier:string,
  location:string,
  department:string,
  groups:string,
  belonged:string,
  devicestatus:string,
  createdby:string,
  createdon:string
}

// table 中每行数据类型！ 这是将table中的数据改回原始数据
interface OptionDeviceData {
  id: number,
  devicename:string,
  deviceno:string,
  type:number,
  active:number,
  assetno:string,
  factoryno:string,
  deviceid:number,
  purchaseon:string,
  supplier:string,
  location:string,
  department:string,
  groups:string,
  belonged:string,
  devicestatus:number,
  createdby:string,
  createdon:string
}
