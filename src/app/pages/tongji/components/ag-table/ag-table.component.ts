import { Component, OnInit, Input, ViewChild,Output, EventEmitter } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

import { AgGridActionComponent } from './ag-grid-action/ag-grid-action.component';

import * as XLSX from 'xlsx';

declare let $;

interface Data {
  action: boolean,
  columnDefs: any, // 列字段
  rowData: any // 行数据
}


@Component({
  selector: 'ngx-ag-table',
  templateUrl: './ag-table.component.html',
  styleUrls: ['./ag-table.component.scss']
})
export class AgTableComponent implements OnInit {
  @Input("tableDatas") tableDatas:any;

  @ViewChild('agGrid') agGrid: AgGridAngular;   // 实例在组件可访问
  @Output() private nzpageindexchange = new EventEmitter<any>(); // 分页
  @Output() private clickrow = new EventEmitter<any>(); // 传递给父组件 点击的含数据


  gridApi;
  gridColumnApi;
  paginationPageSize = 10; // 每页多少条数
  paginationNumberFormatter;   // 设置每页展示条数
  suppressScrollOnNewData = true; // 更改时网格不要滚动到顶部
  suppressPaginationPanel = true; // 隐藏用于导航的默认ag-Grid控件 即隐藏自带的分页组件
  suppressRowClickSelection = false; // true 则单击行时将不会发生行选择 仅在需要复选框选择时使用

  
  

  rowSelection; // 选中行
  frameworkComponents; // 表格渲染组件！

  // 分页
  current = 1;  // 当前页
  totalPageNumbers=10;  // 总数据条数
  setPageCount = 10;     // 默认每页10条数据
  private requestPageCount = 5; // 每次请求的数目

  

  selectedRows = [];     // 行选择数据

  is_filter_data = false;  // 是否是搜索的数据

  columnDefs; // 列字段
  rowData; // 行数据
  action; // 是否操作

  constructor() { 
  }
  
  // action = { field: 'action', headerName: '操作', cellRendererFramework: AgGridActionComponent, pinned: 'right'};
  // action = { field: 'action', headerName: '操作', cellRendererFramework: AgGridActionComponent, pinned: 'right'};
  // action = { field: 'action', headerName: '操作', cellRenderer: 'agGridActionComponent', pinned: 'right'};
  
  ngOnInit(): void {
    // this.gridOptions();
    console.log("agGrid========================", this.agGrid)
    
  }
  

  // kpi_detail
  ngAfterViewInit(){
  }
  
  // ---------------
  gridOptions(employee_agGrid){
    this.columnDefs =  employee_agGrid["columnDefs"]// 列字段
    this.rowData =  employee_agGrid["rowData"]; // 行数据
    this.action =  employee_agGrid["action"]; // 是否操作


    // this.paginationPageSize = 10;
    this.rowSelection = 'multiple';

    
    console.log("*****************************************vtableDatas")
    console.log("***************************************** tableDatas", employee_agGrid)
    console.log("*****************************************tableDatas");

    if (this.action){
      console.log("action===================", this.action);
      console.log("this.tableDatas.columnDefs======this.tableDatas.columnDefs", this.columnDefs, "index: ",this.columnDefs.indexOf(action));
      // user-employee
      var action = { field: 'action', headerName: '操作', cellRendererFramework: AgGridActionComponent, pinned: 'right'};
      this.columnDefs.forEach(column => {
        if (column["field"] === "action"){
          var index = this.columnDefs.indexOf(column);
          this.columnDefs.splice(index, 1);
        }
      });
      this.columnDefs.push(action);
        
  

      // this.tableDatas.columnDefs.push(this.action)
      // 表示具有操作功能
      // this.frameworkComponents = {
      //   // agGridActionComponent: AgGridActionComponent
      //   countryCellRenderer: this.tableDatas.action_action
      // }
    }

    // 详细  设备报表kpi详情
    

    // this.rowData = this.tableDatas.rowData;
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    console.log("^^^^^^^^^^^^^^this.rowData^^^^^^^^^^^^^^",this.rowData)
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    this.totalPageNumbers = this.rowData.length
    // this.columnDefs = this.columnDefs;
    console.log("------------------->>>>>>>>>>>>>>>>>>>>",this.columnDefs,"this.totalPageNumbers",this.totalPageNumbers)

    console.log("tableDatas===================", this.tableDatas)
  };

  

  // 渲染 详情
  KpiDetailRender(){}


  // 分页！
  onPaginationChanged(event) {
    console.warn("onPaginationChanged>>", event);
  }

  // onGridReady
  onGridReady(params) {
    console.warn("params>>", params);

    console.warn(params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  // 点击行数据
  onRowClicked(event) {
    console.log("点击行数据",event);
    this.clickrow.emit(event.data)
  }

  // 页码改变的回调
  pageIndexChange(event) {
    // 页面跳转
    this.gridApi.paginationGoToPage(event - 1);

    // 总页数
    let totalPages = this.totalPageNumbers / this.setPageCount;
    // 当前页数
    let currentPage = event - 1;
    // 判断是否触发请求
    if (currentPage + 1 >= totalPages) {
      // 构造请求参数
      const offset = this.totalPageNumbers;
      // 每次请求的条数 * 每页的条数
      const limit = this.requestPageCount * this.setPageCount;
      // this.get_interface_cockpit(limit, offset);
      console.log("页码改变的回调 offset  limit", offset, limit);
      this.nzpageindexchange.emit({offset: offset, limit: limit})
    }
  }

  // 每页条数改变的回调
  pageSizeChange(event) {
    console.warn("pageSizeChange 每页条数改变的回调>>", event);
    // 更新每页展示条数
    this.setPageCount = event;
    this.gridApi.paginationSetPageSize(Number(event));
  }

  // 选中行数
  onSelectionChanged(event) {
    this.selectedRows = this.gridApi.getSelectedRows();
    console.warn(this.selectedRows);
  }

  // onPageSizeChanged2()
  onPageSizeChanged2(){
    // 更新每页展示条数
    this.setPageCount = this.paginationPageSize;
    console.log("----------------\nonPageSizeChanged---\n", this.paginationPageSize,"更新每页展示条数", this.setPageCount, "总条数",this.totalPageNumbers)
    this.gridApi.paginationSetPageSize(Number(this.paginationPageSize));
  }

  // 父组件调用，得到选中的数据
  getselectedrows(){
    return this.selectedRows;
  }
  

  // 过滤器已修改，但未应用。当过滤器具有“应用”按钮时使用。
  onfilterModified(event) {
    this.totalPageNumbers = this.gridApi.getModel().rootNode.childrenAfterFilter.length;
    this.is_filter_data = this.totalPageNumbers === this.tableDatas.rowData.length ? false : true;
  }




  // 得到选中的数据！
  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data );
    const selectedDataStringPresentation = selectedData.map(node => node.name + ' ' + node.loginname).join(', ');
    console.log("得到选中的数据！", )
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

  //************************************************  导入信息



  // 导出文件名
  filename;

  // 导出功能
  download(title){
    this.filename = title + ".xlsx";
    console.log("csv名称----", this.filename);
    console.log("this.columnDefs----", this.columnDefs);
    var columns = this.columnDefs;
    var table_header = [];
    var table_data = [];
    
    if (this.rowData.length != 0){
      for (let k of columns){ // columns []
        if(k["field"] != "action"){ // 去掉 操作(options)选项
          table_header.push(k['headerName']);
        }
      }
      console.log("table_header----", table_header);
      table_data.push(table_header);
      var data = this.rowData;
      console.log("导出数据>>>>>>>>", data)
      data.forEach(element => {
        var data_item = [];
        for (let k in element){
          if (k != "id"){
            data_item.push(element[k]);
          }
        }
        

        table_data.push(data_item);
      });
      
    }else{
      var data = this.rowData;
      
      for (let k in columns){
        if(k != "options"){ // 去掉 操作(options)选项
          table_header.push(columns[k]['title']);
        }
      }
      table_data.push(table_header);
      data.forEach(element => {
        var data_item = [];
        for (let d in element){
          data_item.push(element[d]);
        }
        table_data.push(data_item);
      })
    }
    console.log("table_data=====", table_data);
    this.export(table_data);


  }

  // -----------------------将data写入workbook中-----------------------------
  async export(datas) {
    const wb: XLSX.WorkBook = this.write(datas);
    // const filename: string = "SheetJSIonic.xlsx"; // 导出的文件名！
    /* save to file */
    XLSX.writeFile(wb, this.filename);
  };

  // -----------------------创建worksheet和workbook-----------------------------
  write(datas): XLSX.WorkBook {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(datas);
    
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    return wb;
  };



  // 父组件调用，告诉该组件数值改变了！
  update_agGrid(tableDatas){
    this.rowData = tableDatas.rowData;
    console.log("父组件调用，告诉该组件数值改变了！=========",tableDatas)
    console.log("父组件调用，告诉该组件数值改变了！=========this.rowData",this.rowData)
    // 刷新
    
    // this.agGrid.api.setRowData(rowData);
    this.totalPageNumbers = tableDatas.rowData.length;
    // this.gridApi.updateRowData()
    this.gridApi.setRowData(this.rowData);
    // this.agGrid.api.redrawRows();
  }

  // 父组件调用！ 填充表格
  init_agGrid(employee_agGrid){
    console.log("初始化-------父组件调用！ 填充表格=======", employee_agGrid)
    this.gridOptions(employee_agGrid);
  }
}
