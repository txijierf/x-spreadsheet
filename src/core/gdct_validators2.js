



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
                let key = `${attr}-${cat}`;
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
            let attr_cat = key.split(`-`);
            this.validators[key].forEach(valData =>{
                this.validate(attr_cat[0], attr_cat[1],valData);
            });
        }
    }


    validate(attr,cat,vData){
        let {type,vInfo} = vData;
        let y = Number(this.datas.rows.findInputColOnRow(this.search_row,attr));
        
        let x = Number(this.findCategoryRow(cat));
        if(isNaN(x) || isNaN(y)){return;}

        console.log("validating cell %d %d",x,y)
        console.log(this.datas)
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


    findCategoryRow(cat){
       console.log(this.datas.rows._ )
        for(let row_num in this.datas.rows._){
            let check_cell = this.datas.rows._[row_num].cells[this.search_col].text
            
            if(check_cell === cat){
                return row_num;
            }
        }
        return null
    }



    validateAttribute(n,v,ri){
        let {operator, value } = v;
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
            let attrcol = this.datas.findInputColOnRow(9,value);
            if(attrcol === undefined){return true}

            let attrtext = this.datas.getCell(ri,Number(attrcol));
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


