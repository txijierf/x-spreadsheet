import { xy2expr, expr2xy } from './alphabet';

export class UnitValidation{
    constructor(datas,spread) {
        this.datas = datas;
        this.errors = new Map();
        this.spread = spread;
        this.search_row = 9;
    }

    getError(ri, ci) {
        return this.errors.get(`${ri}_${ci}`);
    }

    // {createdAt: "2020-01-01T00:00:00.000Z",
    // dataType: "decimal(<12,4)",
    // note: "decimal(<12,4)",
    // pattern: "^-?\\d{1,11}(\\.\\d{1,4})?$",
    // unitOfMeasurement: "$",
    // updatedAt: "2022-01-24T15:18:06.650Z",
    // updatedBy: "test8@test.com",
    // _id: "61dd99c8ac08fa1d29776f6a"}

    validate(info){
        var hasUnit =  this.datas.findInputColOnRow(this.search_row,"Unit of Measure");
        console.log("unit of measure column " + hasUnit)
        if(hasUnit === undefined){return;}

        var rows = this.datas.rows;
        for(var x = this.search_row +1 ; x<this.datas.rows.len; x++){

            let unit = rows.getCell(x,Number(hasUnit))
            if(unit != null && unit.text != undefined){
                let unitInfo = this.getUnit(info, unit.text)


                console.log("pattern " + unitInfo.pattern + " for unit " + unit.text)

                if( unitInfo!= null){
                    this.validate_row(x,Number(hasUnit),rows._[x].cells,unitInfo)
                }
            }
            // let unitPattern = this.getPattern(info, unit)
            // console.log("pattern " + unitPattern + " for unit " + unit)
            // if(unit != undefined && unitPattern != null){
            //     this.validate_row(rownum,hasUnit +1,rows._[x].cells,unitPattern)
            // }
        }
    }


    validate_row(ri,uci ,row,unitInfo){

        let numCols = this.datas.cols.len;

        let errorcells = "";

        for(var i = uci+1; i<numCols;i++){

            if(this.isAttributeColumn(i)){
                let checkText = row[i].text;
                console.log("checktext: " + checkText)
                if(checkText != undefined && !checkText.match(unitInfo.pattern) ){
                    console.log("errors %d %d", ri, i)
                    errorcells += xy2expr(i,ri) +',';
                }
            }
        }

        if(errorcells == ""){
            this.errors.delete(`${ri}_${uci}`)
            let sheet = this.spread.getSheet()
            if(sheet){sheet.notes.clearNote(ri,uci);}
        }else{
            this.errors.set(`${ri}_${uci}`,unitInfo.note)
            let sheet = this.spread.getSheet()
            if(sheet){sheet.notes.setNote(ri,uci,'For ' + errorcells+ unitInfo.note);}
        }

        

    }

    getUnit(info,text){
        for(let key in info){
            
            if(info[key].unitOfMeasurement === text){
                return info[key]
            }
        }

        return null;
    }

    isAttributeColumn(ci){
        let attr = this.datas.getCell(this.search_row,ci);
        let attrid = this.datas.getCell(0,ci);
        if(attr === null || attr.text === undefined || attrid === null || attrid.text === undefined){return false;}
        if(Number(attrid.text) === NaN){return false;}
        return true;



    }


}