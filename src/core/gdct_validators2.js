



export class GDCTValidators2{

    constructor(datas,spread) {
        this.datas = datas;
        this.spread = spread;
        this.validators = {};
        this.errors = new Map();
        this.search_row = 9;
        this.search_col = 1;
    }


    getError(ri, ci) {
        return this.errors.get(`${ri}_${ci}`);
    }

    clearErrors(){
        this.errors = new Map();
    }


    //
    addValidation(attrList,catList,type,vInfo){
        
        attrList.forEach(attr => {
            catList.forEach(cat => {
                let key = `${attr}_${cat}`;
                if(this.validators[key] != undefined){
                    this.validators[key].push({type,vInfo});
                }
                else{
                    this.validators[key] = [{type,vInfo}];
                }
                this.validate(attr,cat,{type,vInfo});
            });
        });
        console.log("our validation list:");
        console.log(this.validators);
        
    }

    validateAll(){
        for(var key in this.validators){
            let attr_cat = key.split(`_`);
            this.validators[key].forEach(valData =>{
                this.validate(attr_cat[0], attr_cat[1],valData);
            });
        }
    }

    validateAll2(){
        let validate_row = this.spread.getRow(1);
        console.log("validate_row: ", validate_row)
        for(var key in validate_row){

            if(validate_row[key].text != undefined){
                console.log("CELL " + key)
                let p1 = validate_row[key].text.split(';'); //array with multiplevalidations
                const r = /\[(.*?)\] (\w+) \[(.*?)\] in \[(.*?)\]/;
                p1.forEach((valString) =>{    
                    let res = valString.match(r);
                    if(res != null){
                        let cat_list = res[1].split(',')
                        let op = res[2]
                        let val_list = res[3]
                        let sheet_name = res[4]
                        console.log(res)
                        this.applyValidations(cat_list,op,val_list,Number(key), sheet_name);
                    }      
                })
            }
        }
    }

    applyValidations(cat_list,operator,val,ci,sheet_name){
        
        let vdata = {}
        let value; let type;
        if(operator === 'be' || operator === 'nbe'){
            value = val.split(' and ');
            type = (isNaN(value[0]) || isNaN(value[1])) ? 'attribute' : 'number';
        }
        else if(operator === 'req'){
            value = '';
            type = 'required';
        }
        else{
            value = val;
            type = isNaN(value) ? 'attribute' : 'number';
        }

        vdata = {type,vInfo:{operator,value,sheet_name}}
        

        cat_list.forEach((cat) => {
            if(cat.length > 0){console.log("applying validations to %s with info " , cat); this.validate2(ci,cat,vdata)}
        })
        
    }

    validate2(ci,cat,vData){
        let {type,vInfo} = vData;
        let y = ci;
        
        let x = Number(this.findCategoryRow(cat,this.datas));
        
        if(isNaN(x) || isNaN(y)){return;}

        if(type === 'number'){
            let t = this.datas.getCell(x,y);
            if(t.text != undefined) {
                
                if(!this.validateNumber(t.text,vInfo)){  
                    console.log('error number set for %d &d', x,y);
                    this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`);
                    let sheet = this.spread.getSheet()
                    if(sheet){sheet.notes.addNote(x,y,`cell value must be ${vInfo.operator} ${vInfo.value}` + '\n'); }
                }
                // else{
                //     this.errors.delete(`${x}_${y}`);
                //     let sheet = this.spread.getSheet()
                //     if(sheet){sheet.notes.clearNote(x,y);}
                // }
            }
        }
        else if(type === 'attribute'){
            let t = this.datas.getCell(x,y);
           
            if(t.text != undefined) {
                console.log("hitting ", x,y);
                if(!this.validateAttribute(t.text,vInfo,x,cat)){ 
                    console.log('error set for %d &d', x,y);
                    this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`)
                    let sheet = this.spread.getSheet()
                    if(sheet){sheet.notes.addNote(x,y,`cell value must be ${vInfo.operator} ${vInfo.value}` + '\n'); console.log("note sett for %d %d", x , y)}
                }
                // else{
                //     this.errors.delete(`${x}_${y}`);
                //     let sheet = this.spread.getSheet()
                //     if(sheet){sheet.notes.clearNote(x,y);}
                    
                    
                // }
            }
        }
        else if(type === 'required'){

            let t = this.datas.getCell(x,y);
            if(t) {
                if(t.text === undefined || t.text === ''){
                    this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`)
                    let sheet = this.spread.getSheet()
                    if(sheet){sheet.notes.addNote(x,y,`cell must contain a value` + '\n'); console.log("Note SETTT");}
                }
                // else{
                //     this.errors.delete(`${x}_${y}`);
                //     let sheet = this.spread.getSheet()
                //     if(sheet){sheet.notes.clearNote(x,y);}
                // }
            }
        
        }

    }


    validate(attr,cat,vData){
        let {type,vInfo} = vData;
        let y = Number(this.datas.rows.findInputColOnRow(this.search_row,attr));
        
        let x = Number(this.findCategoryRow(cat,this.datas));
        
        if(isNaN(x) || isNaN(y)){return;}

        
        if(type === 'number'){
            let t = this.datas.getCell(x,y);
            if(t.text != undefined) {
                
                if(!this.validateNumber(t.text,vInfo)){  
                    console.log('error number set for %d &d', x,y);
                    this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`);
                    let sheet = this.spread.getSheet()
                    if(sheet){sheet.notes.setNote(x,y,`incorrect type, expected ${vInfo.operator} ${vInfo.value}`); }
                }
                else{
                    this.errors.delete(`${x}_${y}`);
                    let sheet = this.spread.getSheet()
                    if(sheet){sheet.notes.clearNote(x,y);}
                }
            }
        }
        else if(type === 'attribute'){
            let t = this.datas.getCell(x,y);
           
            if(t.text != undefined) {
                console.log("hitting ", x,y);
                if(!this.validateAttribute(t.text,vInfo,x)){ 
                    console.log('error set for %d &d', x,y);
                    this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`)
                    let sheet = this.spread.getSheet()
                    if(sheet){sheet.notes.setNote(x,y,`incorrect type, expected ${vInfo.operator} ${vInfo.value}`); console.log("note sett for %d %d", x , y)}
                }
                else{
                    this.errors.delete(`${x}_${y}`);
                    let sheet = this.spread.getSheet()
                    if(sheet){sheet.notes.clearNote(x,y);}
                    
                    
                }
            }
        }
        else if(type === 'required'){

            let t = this.datas.getCell(x,y);
            if(t) {
                if(t.text === undefined || t.text === ''){
                    this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`)
                    let sheet = this.spread.getSheet()
                    if(sheet){sheet.notes.setNote(x,y,`incorrect type, expected ${vInfo.operator} ${vInfo.value}`); console.log("Note SETTT");}
                }
                else{
                    this.errors.delete(`${x}_${y}`);
                    let sheet = this.spread.getSheet()
                    if(sheet){sheet.notes.clearNote(x,y);}
                }
            }
        
        }

    }


    validateNumber(n,v){
        let {operator, value } = v;
        
        let pinput = parseInt(n);
        
        console.log("pinput " + pinput + " pvalue " + value + " ??? " + operator);
        switch(operator){
            case 'gt':
                return pinput > parseInt(value);
            case 'lt':
                return pinput < parseInt(value);
            case 'gte':
                return pinput >= parseInt(value);
            case 'lte':
                return pinput <= parseInt(value);
            case 'eq':
                return pinput == parseInt(value);
            case 'neq':
                return pinput != parseInt(value);
            case 'be':
                return pinput > parseInt(value[0]) && pinput < parseInt(value[1]);
            case 'nbe':
                return pinput < parseInt(value[0]) || pinput > parseInt(value[1]);
        }
    }


    findCategoryRow(cat, d){
       
        for(let row_num in d.rows._){
            let check_cell = d.rows._[row_num].cells[this.search_col].text
            
            if(check_cell === cat){
                return row_num;
            }
        }
        return null
    }

    

    findAttrCol(attr, sn){
        console.log("GGGGGGGGGG " + sn);
        let d = this.spread.findDataSheetbyName(sn);
        console.log("GGGGGGGGG3 " + d);
        if(d === null){return undefined;}

        return d.findInputColOnRow(9,attr)
    }


    validateAttribute(n,v,ri,cat){
        let {operator, value,sheet_name } = v;
        
        let pinput = Number(n);


        if(operator === 'be' || operator === 'nbe'){

            let attrcol = this.datas.findInputColOnRow(9,value[0]);
            let attrcol2 = this.datas.findInputColOnRow(9,value[1]);

            if(attrcol === undefined || attrcol2 === undefined){return true;}
            
            let attrtext = this.datas.getCell(ri,Number(attrcol));
            let attrtext2 = this.datas.getCell(ri,Number(attrcol2));

            if(attrtext.text === undefined|| attrtext2.text === undefined){ return true;}

            

            switch(operator){
                case 'be':
                    return pinput > parseInt(attrtext.text) && pinput < parseInt(attrtext2.text);
                case 'nbe':
                    return pinput < parseInt(attrtext.text) || pinput > parseInt(attrtext2.text);
            }

        }else{
            let sheetData = this.spread.findDataSheetbyName(sheet_name);
            let attrcol = this.findAttrCol(value,sheet_name)//this.datas.findInputColOnRow(9,value);
            let colrow = this.findCategoryRow(cat,this.spread.findDataSheetbyName(sheet_name))
            if(attrcol === undefined || colrow === null ){return true; console.log("cant find")}
            console.log("NINJA WE MADE IT !!!!!")
            let attrtext = sheetData.getCell(colrow,Number(attrcol));
            console.log("hiii " + attrtext.text)
            if(attrtext.text === undefined){ return true;}

            switch(operator){
                case 'gt':
                    return pinput > Number(attrtext.text);
                case 'lt':
                    return pinput < Number(attrtext.text);
                case 'gte':
                    return pinput >= Number(attrtext.text);
                case 'lte':
                    return pinput <= Number(attrtext.text);
                case 'eq':
                    return pinput == Number(attrtext.text);
                case 'neq':
                    return pinput != Number(attrtext.text);
            }
        }

        return true;


    }


    
        


}


