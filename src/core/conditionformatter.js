import ConditionFactory from "./conditionfactory";
import alphabet, { xy2expr } from "./alphabet";

// middleman for conditional formatting - makes setting up easier/less verbose
export default class ConditionFormatter {
  constructor(rows, getCellText) {
    this.ConditionFactory = new ConditionFactory(rows, getCellText);
    this.conditionalFormatting = [];
    // for reading and writing data -> template: { functionName: str, params: [] }
    this.variances = {};
    this.formattingData = [];
  }

  // generates conditional styles for given cell
  generateStyles(ri, ci, text) {
    let style = {};
    this.conditionalFormatting.forEach(
      (test) => {
        (style = { ...style, ...test(ri, ci, text) })
      }
    );
    return style;
  }

  // generates object and adds to formatting data
  addFormattingData(functionName, params) {
    this.formattingData.push({ functionName, params });
  }

  // get formatting data
  getData() {
    return this.formattingData;
  }

  // set formatting data
  setData(formattingData) {
    formattingData.forEach((data) => {
      this[data.functionName](...data.params);
    });
  }

  attemptFix(rindex, cindex, findex){
    //console.log(this.variances,this.variances[rindex],findex)
    if(this.variances[rindex] != undefined && this.variances[rindex][findex] != undefined){
      //console.log('XDDDDDDD')
      ///console.log(rindex,rindex,cindex,cindex,'=' + xy2expr(cindex-1,rindex-1).toLocaleLowerCase(), this.variances[rindex][findex],{bgcolor: '#FFEF00'})
      //this.addOtherGreaterThan(rindex,rindex,cindex,cindex,'=' + xy2expr(cindex-1,rindex).toLocaleLowerCase(), this.variances[rindex][findex],{bgcolor: '#FFEF00'})

      this.conditionalFormatting.push(this.ConditionFactory.otherGreaterThan( rindex,rindex,cindex,cindex,'=' + xy2expr(cindex-1,rindex).toLocaleLowerCase(), this.variances[rindex][findex],{bgcolor: '#FFEF00'}))
      this.addFormattingData("addOtherGreaterThan", [rindex,rindex,cindex,cindex,'=' + xy2expr(cindex-1,rindex).toLocaleLowerCase(), this.variances[rindex][findex],{bgcolor: '#FFEF00'}])
    }
    
  }

  hasConditional(x,y,fName){

    for(var f in this.formattingData){
      
      if(this.formattingData[f].functionName === fName && this.formattingData[f].params[0] == x && this.formattingData[f].params[2] == y){
        return true;
      }
    }

    return false;
  }

  addOtherGreaterThan(minRi, maxRi, minCi, maxCi, val1, val2, style) {
    // console.log('MY ARGS', arguments)
    this.conditionalFormatting.push(
      this.ConditionFactory.otherGreaterThan(
        minRi,
        maxRi,
        minCi,
        maxCi,
        val1,
        val2,
        style
      )
    );
    this.addFormattingData("addOtherGreaterThan", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      val1,
      val2,
      style,
    ]);
    if(this.variances[minRi]){
      this.variances[minRi].push(val2)

    }
    else{
      this.variances[minRi] = [val2]
    }
  }

  // functions to create conditions
  addGreaterThan(minRi, maxRi, minCi, maxCi, value, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.greaterThan(
        minRi,
        maxRi,
        minCi,
        maxCi,
        value,
        style
      )
    );
    this.addFormattingData("addGreaterThan", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      value,
      style,
    ]);
  }

  addLessThan(minRi, maxRi, minCi, maxCi, value, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.lessThan(minRi, maxRi, minCi, maxCi, value, style)
    );
    this.addFormattingData("addLessThan", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      value,
      style,
    ]);
  }

  addBetween(minRi, maxRi, minCi, maxCi, low, high, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.between(
        minRi,
        maxRi,
        minCi,
        maxCi,
        low,
        high,
        style
      )
    );
    this.addFormattingData("addBetween", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      low,
      high,
      style,
    ]);
  }

  // value is base number, tolerance is acceptable range from base number
  addVariance(minRi, maxRi, minCi, maxCi, value, tolerance, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.variance(
        minRi,
        maxRi,
        minCi,
        maxCi,
        value,
        tolerance,
        style
      )
    );
    this.addFormattingData("addVariance", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      value,
      tolerance,
      style,
    ]);
  }

  addEqualTo(minRi, maxRi, minCi, maxCi, value, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.equal(minRi, maxRi, minCi, maxCi, value, style)
    );
    this.addFormattingData("addEqualTo", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      value,
      style,
    ]);
  }

  addTextContains(minRi, maxRi, minCi, maxCi, value, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.textContains(
        minRi,
        maxRi,
        minCi,
        maxCi,
        value,
        style
      )
    );
    this.addFormattingData("addTextContains", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      value,
      style,
    ]);
  }

  addCheckDuplicate(minRi, maxRi, minCi, maxCi, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.duplicateValues(minRi, maxRi, minCi, maxCi, style)
    );
    this.addFormattingData("addCheckDuplicate", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      style,
    ]);
  }

  addTopXItems(minRi, maxRi, minCi, maxCi, x, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.topXItems(minRi, maxRi, minCi, maxCi, x, style)
    );
    this.addFormattingData("addTopXItems", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      x,
      style,
    ]);
  }

  addTopXPercent(minRi, maxRi, minCi, maxCi, x, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.topXPercent(minRi, maxRi, minCi, maxCi, x, style)
    );
    this.addFormattingData("addTopXPercent", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      x,
      style,
    ]);
  }

  addBottomXItems(minRi, maxRi, minCi, maxCi, x, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.bottomXItems(minRi, maxRi, minCi, maxCi, x, style)
    );
    this.addFormattingData("addBottomXItems", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      x,
      style,
    ]);
  }

  addBottomXPercent(minRi, maxRi, minCi, maxCi, x, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.bottomXPercent(minRi, maxRi, minCi, maxCi, x, style)
    );
    this.addFormattingData("addBottomXPercent", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      x,
      style,
    ]);
  }

  addAboveAverage(minRi, maxRi, minCi, maxCi, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.aboveAverage(minRi, maxRi, minCi, maxCi, style)
    );
    this.addFormattingData("addAboveAverage", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      style,
    ]);
  }

  addBelowAverage(minRi, maxRi, minCi, maxCi, style) {
    this.conditionalFormatting.push(
      this.ConditionFactory.belowAverage(minRi, maxRi, minCi, maxCi, style)
    );
    this.addFormattingData("addBelowAverage", [
      minRi,
      maxRi,
      minCi,
      maxCi,
      style,
    ]);
  }
}

// style constants for convenience
const redBorderStyle = ["normal", "#8b0000"];

export const redFill = { bgcolor: "#ffcccb" };
export const darkRedText = { color: "#8b0000" };
export const redBorder = {
  border: {
    left: redBorderStyle,
    right: redBorderStyle,
    top: redBorderStyle,
    bottom: redBorderStyle,
  },
};
export const redFillDarkRedText = { bgcolor: "#ffcccb", color: "#8b0000" };
export const yellowFillDarkYellowText = {
  bgcolor: "#ffffa0",
  color: "#666600",
};
export const greenFillDarkGreenText = { bgcolor: "#99e2b4", color: "#344e41" };

export const styles = {
  redFillDarkRedText,
  redFill,
  darkRedText,
  redBorder,
  yellowFillDarkYellowText,
  greenFillDarkGreenText,
};
