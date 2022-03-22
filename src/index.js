/* global window, document */
import { h } from './component/element';
import DataProxy from './core/data_proxy';
import Sheet from './component/sheet';
import Bottombar from './component/bottombar';
import { cssPrefix } from './config';
import { locale } from './locale/locale';
import './index.less';


class Spreadsheet {
  constructor(selectors, options = {}) {
    let targetEl = selectors;
    this.options = { showBottomBar: true, ...options };
    this.sheetIndex = 1;
    this.datas = [];
    if (typeof selectors === 'string') {
      targetEl = document.querySelector(selectors);
    }
    this.bottombar = this.options.showBottomBar ? new Bottombar(() => {
      if (this.options.mode === 'read') return;
      const d = this.addSheet();
      this.sheet.resetData(d);
    }, (index) => {
      const d = this.datas[index];
      this.sheet.resetData(d);
    }, () => {
      this.deleteSheet();
    }, (index, value) => {
      this.datas[index].name = value;
      this.sheet.trigger('change');
    }) : null;
    this.data = this.addSheet();
    const rootEl = h('div', `${cssPrefix}`)
      .on('contextmenu', evt => evt.preventDefault());
    // create canvas element
    targetEl.appendChild(rootEl.el);
    this.sheet = new Sheet(rootEl, this.data);
    if (this.bottombar !== null) {
      rootEl.child(this.bottombar.el);
    }
  }

  addSheet(name, active = true) {
    const n = name || `sheet${this.sheetIndex}`;
    const d = new DataProxy(n, this.options, this.datas, this);
    d.change = (...args) => {
      this.sheet.trigger('change', ...args);
    };
    this.datas.push(d);
    // console.log('d:', n, d, this.datas);
    if (this.bottombar !== null) {
      this.bottombar.addItem(n, active, this.options);
    }
    this.sheetIndex += 1;
    return d;
  }

  deleteSheet() {
    if (this.bottombar === null) return;

    const [oldIndex, nindex] = this.bottombar.deleteItem();
    if (oldIndex >= 0) {
      this.datas.splice(oldIndex, 1);
      if (nindex >= 0) this.sheet.resetData(this.datas[nindex]);
      this.sheet.trigger('change');
    }
  }

  loadData(data) {
    const ds = Array.isArray(data) ? data : [data];
    if (this.bottombar !== null) {
      this.bottombar.clear();
    }
    this.datas = [];
    if (ds.length > 0) {
      for (let i = 0; i < ds.length; i += 1) {
        const it = ds[i];
        const nd = this.addSheet(it.name, i === 0);
        nd.setData(it);
        if (i === 0) {
          this.sheet.resetData(nd);
        }
      }
    }
    return this;
  }

  getSheet(){
    return this.sheet;
  }

  getData() {
    return this.datas.map(it => it.getData());
  }

  // return the index of currently active spreadsheet
  // added by Sheldon Su 2021/02/23
  getCurrentSheetIndex(){
    return this.bottombar.getActiveSheet()
  }

  getCell(ri,ci){
    return this.datas[this.getCurrentSheetIndex()].getCell(ri, ci);
  }
  
  // Insert a row in Sheet at rowNum
  // added by Sheldon Su 2021/02/23
  insertRowAt(rowNum){
    const currentSheet = this.datas[this.getCurrentSheetIndex()];
    currentSheet.insert('row', 1, rowNum)
  }

  getRow(rowNum){
    let x = this.datas[this.getCurrentSheetIndex()].rows._[rowNum];
    if(x == undefined){
      return undefined;
    }
    return this.datas[this.getCurrentSheetIndex()].rows._[rowNum].cells;
  }

  findDataSheetbyName(n){
    
    for(var sheetData in this.datas){
      

      if(this.datas[sheetData].name == n){
        return this.datas[sheetData];
      }
    }
    return null;
  }

  // Insert a col in Sheet at rowNum
  // added by Sheldon Su 2021/02/23
  insertColAt(colNum){
    const currentSheet = this.datas[this.getCurrentSheetIndex()];
    currentSheet.insert('column', 1, colNum)
  }

   // add greater Than conditional formatting
  addGreterThan(minRi, maxRi, minCi, maxCi, value, style, index){
    const targetProxy = this.datas[index];
    targetProxy.addGreaterThan(minRi, maxRi, minCi, maxCi, value, style)
  }

  addOtherGreaterThan(minRi, maxRi, minCi, maxCi, val1, val2, style, index) {
    
    const targetProxy = this.datas[index];
    targetProxy.addOtherGreaterThan(minRi, maxRi, minCi, maxCi, val1, val2, style);
  }

  cellText(ri, ci, text, sheetIndex = 0, lockOverride = false) {
    this.datas[sheetIndex].setCellText(ri, ci, text, 'finished', lockOverride);
    return this;
  }

  cell(ri, ci, sheetIndex = 0) {
    return this.datas[sheetIndex].getCell(ri, ci);
  }

  cellStyle(ri, ci, sheetIndex = 0) {
    return this.datas[sheetIndex].getCellStyle(ri, ci);
  }

  reRender() {
    this.sheet.table.render();
    return this;
  }

  on(eventName, func) {
    
    this.sheet.on(eventName, func);
    return this;
  }

  validate() {
    
    const { validations } = this.data;
    return validations.errors.size <= 0;
  }

  addValidation(ri, ci, sheetIndex = 0) {
    
    this.datas[0].addValidation('cell', 'B7', {
      operator: 'be',
      required: false,
      type: 'number',
      value: ['1', '3']
    })
  }

  change(cb) {
    
    this.addValidation(0, 0)
    this.sheet.on('change', cb);
    return this;
  }

  static locale(lang, message) {
    locale(lang, message);
  }
}

const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);

if (window) {
  window.x_spreadsheet = spreadsheet;
  window.x_spreadsheet.locale = (lang, message) => locale(lang, message);
}

export default Spreadsheet;
export {
  spreadsheet,
};
