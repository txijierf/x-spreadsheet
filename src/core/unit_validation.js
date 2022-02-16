

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
                let unitPattern = this.getPattern(info, unit.text)


                console.log("pattern " + unitPattern + " for unit " + unit.text)

                if( unitPattern!= null){
                    this.validate_row(x,Number(hasUnit) +1,rows._[x].cells,unitPattern)
                }
            }
            // let unitPattern = this.getPattern(info, unit)
            // console.log("pattern " + unitPattern + " for unit " + unit)
            // if(unit != undefined && unitPattern != null){
            //     this.validate_row(rownum,hasUnit +1,rows._[x].cells,unitPattern)
            // }
        }
    }


    validate_row(ri,sci ,row,pattern){

        let numCols = this.datas.cols.len;

        for(var i = sci; i<numCols;i++){

            if(this.isAttributeColumn(i)){
                let checkText = row[i].text;
                console.log("checktext: " + checkText)
                if(checkText != undefined && !checkText.match(pattern) ){
                    console.log("errors")
                    this.errors.set(`${ri}_${i}`,"comnbruh")
                }
                else if(checkText != undefined && checkText.match(pattern) ){
                    
                    this.errors.delete(`${ri}_${i}`)
                }
            }
        }

    }

    getPattern(info,text){
        for(let key in info){
            
            if(info[key].unitOfMeasurement === text){
                return info[key].pattern
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