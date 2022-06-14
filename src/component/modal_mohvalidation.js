import Modal from './modal';
import FormInput from './form_input';
import FormSelect from './form_select';
import FormField from './form_field';
import FormOption from './form_option';
import Button from './button';
import { t } from '../locale/locale';
import { h } from './element';
import { cssPrefix } from '../config';
import cell from '../core/cell';

const fieldLabelWidth = 100;

export default class ModalMOHValidation extends Modal {
  constructor(spread) {
    
    const attributeField = new FormField( // value should be initialized
      new FormInput('280px', '2021/22 Q2 Actual, 2021/22 Q2 Budget, ...'),
      { required: true },
      `${t('MOHValidation.attributes')}`
    );
    
    const categoryField = new FormField(
      new FormInput('280px', 'Current Assets, Liabilities, ...'),
      { required: true },
      `${t('MOHValidation.categories')}`
    );
    

    const valueField = new FormField( // operator
      new FormOption('Select Attribute',[],'160px'),
      { required: true },
    );
    // RELATIVE type operators
    const of = new FormField( // operator
      new FormSelect('be',
        ['req','be', 'nbe', 'eq', 'neq', 'lt', 'lte', 'gt', 'gte'],
        '160px',
        it => t(`dataValidation.operator.${it}`),
        it => this.criteriaOperatorSelected(it)),
      { required: true },
      `${t('MOHValidation.validationType')}`,
    );
    const minvf = new FormField( // min
      new FormInput('70px', '10'),
      { required: true },
    );
    const maxvf = new FormField( // max
      new FormInput('70px', '100'),
      { required: true},
    );

    const max_value = new FormField( // operator
      new FormOption('Select Attribute',[],'160px'),
      { required: true },
    );

    const min_value = new FormField( // operator
      new FormOption('Select Attribute',[],'160px'),
      { required: true },
    );


    const vf = new FormField( // value
      new FormInput('70px', '10'),
      { required: true, type: 'number' },
    ).hide();

    
    const sheetField = new FormField( // sheetName
      new FormSelect('',[],"160px"),
      { required: false},
      `${t('MOHValidation.sheetLabel')}`,
    );

    super(t('contextmenu.moh-validation'), [
      h('div', `${cssPrefix}-form-fields`).children(
        attributeField.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        categoryField.el,
      ),
      h('div', `${cssPrefix}-form-fields`).children(
        of.el,
        min_value.el,
        max_value.el,
        valueField.el,
        sheetField.el,
        
      ),
      h('div', `${cssPrefix}-buttons`).children(
        new Button('cancel').on('click', () => this.btnClick('cancel')),
        new Button('remove').on('click', () => this.btnClick('remove')),
        new Button('save', 'primary').on('click', () => this.btnClick('save')),
      ),
    ]);

    this.attributeList = [];
    this.selectAttributelist= [];
    this.selectCategories = [];
    this.max_value = max_value;
    this.min_value = min_value;
    this.attributeField = attributeField;
    this.categoryField = categoryField;
    this.spread = spread;
    //this.attribute_selection = attribute_selection;
    this.valueField = valueField;
    this.cellRange = null;
    this.of = of;
    this.minvf = minvf;
    this.maxvf = maxvf;
    this.vf = vf;
    
    this.sheetField = sheetField;
    this.change = () => {};
  }

  showVf(it) {
    const hint = it === 'date' ? '2018-11-12' : '10';
    
    
    this.valueField.show();
  }

  criteriaSelected(it) {
    const {
      of,
      min_value,
      max_value,
      sheetField,
    } = this;
    // it === 'format' | 'value' | 'relative'
    if (it === 'format') {
      of.hide();
      min_value.hide();
      max_value.hide();
      
      sheetField.hide();
    } else if (it === 'value') {
      of.hide();
      min_value.hide();
      max_value.hide();
      
      sheetField.hide();
    } else if (it === 'relative') {
      of.show();
      min_value.show();
      max_value.show();
      this.valueField.hide();
      sheetField.show();
    }
    //this.attribute_selection.show();
  }

  criteriaOperatorSelected(it) {
    if (!it) return;
    const {
      min_value, max_value, vf,valueField
    } = this;
    if (it === 'be' || it === 'nbe') {
      min_value.show();
      max_value.show();
     
      valueField.hide();
    } 
    else if(it === 'req'){
      valueField.hide();
      min_value.hide();
      max_value.hide();
    }
    else {
      
      //attribute_selection.show();
      valueField.show();
     
      min_value.hide();
      max_value.hide();
    }
  }

  btnClick(action) {
    
    
    if (action === 'cancel') {
      this.hide();
    } else if (action === 'remove') {
      this.change('remove');
      this.hide();
    } else if (action === 'save') {
     
      const attr = this.attributeField.val();
      const ref = this.categoryField.val();
      const operator = this.of.val();

      let value; let type;
      if(operator === 'be' || operator === 'nbe' ){
        value = [this.min_value.val(),this.max_value.val()];
        type = (isNaN(value[0]) || isNaN(value[1])) ? 'attribute' : 'number';
      }
      else if(operator === 'req'){
        value = '';
        type = 'required';
      }
      else{
        value = this.valueField.val();
        type = isNaN(value) ? 'attribute' : 'number';
      }
      

      console.log("hi we are saving");
      
      //this.spread.datas[this.spread.getCurrentSheetIndex()].addGDCTValidaton(this.cellRange,type,{operator,value});
      //this.spread.datas[this.spread.getCurrentSheetIndex()].GDCTValidators2.addValidation(this.selectAttributelist,this.selectCategories,type, {operator,value})
      
    //   this.spread.datas[this.spread.getCurrentSheetIndex()].UnitValidation.validate({0: {createdAt: "2020-01-01T00:00:00.000Z",
    //   dataType: "decimal(<12,4)",
    //   note: "decimal(<12,4)",
    //   pattern: "^-?\\d{1,11}(\\.\\d{1,4})?$",
    //   unitOfMeasurement: "$",
    //   updatedAt: "2022-01-24T15:18:06.650Z",
    //   updatedBy: "test8@test.com",
    //   _id: "61dd99c8ac08fa1d29776f6a"},
    //   1:{
    //     dataType: "int",
    //     note: "'Case' should be integer data type",
    //     pattern: "^\\d+$",
    //     unitOfMeasurement: "Case"
    //   },
    //   2:{
    //     dataType: "date",
    //     note: "Please enter a date like 31-12-2022",
    //     pattern: "^([012]\\d|[3][01])-([0]\\d|[1][12])-(\\d{4})$",
    //     unitOfMeasurement: "Day"
    //   }
    // })
    //this.spread.addOtherGreaterThan(10,10,8,8,'=h11',0.5,{bgcolor: '#FFEF00'},this.spread.getCurrentSheetIndex())
      
      this.addValDesc(operator);
      //this.spread.datas[this.spread.getCurrentSheetIndex()].resetCommentsandErrors();
      
      this.hide();
      this.of.input.itemClick('req');
      this.criteriaOperatorSelected('req');
    }
  }

  // adds the decriptrion of the validation applied
  // ['be', 'nbe', 'eq', 'neq', 'lt', 'lte', 'gt', 'gte']
  addValDesc(t){
    let desc;
    

    if(t === 'be' || t === 'nbe'){
      desc = this.min_value.val() + " and " + this.max_value.val();
    }
    else{
      desc = this.valueField.val()
    }

    

    let spread_row = this.spread.datas[this.spread.getCurrentSheetIndex()].rows;

    let sheetname = this.sheetField.input.key;

    let line = "[" + this.categoryField.val() + "]" + " " + t + " " + "[" + desc+"] in [" + sheetname +"];";

    if(this.selectAttributelist){
      this.selectAttributelist.forEach(attr_name => {
        var c = spread_row.findInputColOnRow(9,attr_name);
        if(c != undefined){
          let desc_cell = this.spread.datas[this.spread.getCurrentSheetIndex()].getCell(1,c);
          if(desc_cell != undefined && desc_cell.text != undefined){
            this.spread.datas[this.spread.getCurrentSheetIndex()].setCellText(1,c,desc_cell.text + line);
          }else{
            this.spread.datas[this.spread.getCurrentSheetIndex()].setCellText(1,c,line);
          }

         //this.randomFunction(c);
          
        }
      })
    }

    
    
   
    

  }
  
  getAttributeList(){
    var attribute_data_row = this.spread.getRow(9);
    var attr_verifacion_row = this.spread.getRow(0);
    console.log("atrribute data row");
    console.log(attribute_data_row);

    this.spread.datas.forEach((d) => console.log(d.getRow(9)));

    //console.log(this.spread.datas[this.spread.getCurrentSheetIndex()].getRow(9));
    var attribute_list = []
    var a2 = []
    if(attribute_data_row === undefined){return a2;}
    Object.keys(attribute_data_row).forEach((key) =>{
      let x = attr_verifacion_row[key];
      if(x === undefined){}
      else if(x.text !=undefined  && (!isNaN(x.text))){
        attribute_list.push({key: attribute_data_row[key].text , title: attribute_data_row[key].text});
        a2.push(attribute_data_row[key].text);
      }
    } );
    
    //console.log(a2);
    return a2;
  }


  getAttributeList2(){

    var attribute_list = []
    var a2 = []

    this.spread.datas.forEach((d) =>{
      let attribute_data_row = d.getRow(9);
      let attr_verifacion_row = d.getRow(0);

      if(attribute_data_row != undefined && attr_verifacion_row != undefined){
        Object.keys(attribute_data_row).forEach((key) =>{
          let x = attr_verifacion_row[key];
          if(x === undefined){}
          else if(x.text !=undefined  && (!isNaN(x.text))){
            attribute_list.push({key: attribute_data_row[key].text , title: attribute_data_row[key].text});
            a2.push(attribute_data_row[key].text);
          }
        });
      }

    });

    return a2;
  }

  //
  selectedAtrributesandCategories(cellR,alist){
    this.cellRange = cellR;
    var attr = ""; 
    var cat = "";
    var catList = []
    var attrs = [];
    var attribute_data_row = this.spread.getRow(9);

    if(attribute_data_row === undefined){return attrs;}
    
    var start_col = cellR.sci;
    var end_col = cellR.eci;

    for (let i = start_col; i < end_col+1; i++) {
      if(attribute_data_row[i] != undefined && alist.includes(attribute_data_row[i].text)){
        attr += attribute_data_row[i].text+","
        attrs.push(attribute_data_row[i].text);
      }
    }

    for(let i = cellR.sri; i < cellR.eri+1; i++){
      let x = this.spread.getCell(i,1)
      if(x != undefined && x.text != undefined ){
        cat += this.spread.getCell(i,1).text+","
        catList.push(this.spread.getCell(i,1).text);
      }
    }

    this.attributeField.val(attr);
    this.categoryField.val(cat);
    this.selectAttributelist = attrs;
    this.selectCategories = catList;

    return attrs;
  }


  getSheetList(){
    return this.spread.datas.map((sheetdata) => sheetdata.name);
  }

  prepare(cellR){
    var attrList = this.getAttributeList2();
    var selectedAttr = this.selectedAtrributesandCategories(cellR,attrList);
    var sheetlist = this.getSheetList();
    
    console.log("helllooooooo")
    console.log("sheet list:", sheetlist);
    
    var nonselectedAttrs = attrList.filter(x => !(selectedAttr.includes(x)) );
    this.attributeList = attrList;
    this.sheetField.input.setItems(sheetlist,this.spread.datas[this.spread.getCurrentSheetIndex()].name)
    this.valueField.input.setItems(nonselectedAttrs);
    this.min_value.input.setItems(nonselectedAttrs);
    this.max_value.input.setItems(nonselectedAttrs);
    this.valueField.input.setItems(nonselectedAttrs);

  }


  // randomFunction(s){
   
  //   let validate_row = this.spread.getRow(1);
  //   console.log("validate_row: ", validate_row)
  //   for(var key in validate_row){

  //     if(validate_row[key].text != undefined){
  //       console.log("CELL " + key)
  //       let p1 = validate_row[key].text.split(';'); //array with multiplevalidations
  //       console.log(p1);
  //       const r = /\((.*?)\) (\w+) \((.*?)\) in ((.*?)\)/;
  //       p1.forEach((valString) =>{
          
  //         if(valString.length > 0){
  //           let res = valString.match(r);
  //           console.log(res)
           
  //         }
  //       })
  //     }
  //   }



    


  // }

  // validation: { mode, ref, validator }
  setValue(v) {
    if (v) {
      const {
        of, vf, min_value, max_value,
      } = this;
      const {
        mode, ref, validator,
      } = v;
      const {
        type, operator, value,
      } = validator || { type: 'list' };
      
      of.val(operator);
      this.criteriaSelected(type);
      
      this.criteriaOperatorSelected(of.val());
    }
    else{

    }
    
    this.show();
  }
}
