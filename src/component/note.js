import { h } from './element';
import Icon from './icon';
import { cssPrefix } from '../config';
import { bind, unbind } from './event';

export default class Notes {
  
        constructor(viewFn,sheet) {
            this.viewFn = viewFn
            // this.getSelectBox = getSelectBox
            this.sheet = sheet;
            console.log(sheet);
            this.updateCBs = [] // array of functions to call on update
            this.el = h('div', `${cssPrefix}-note`).on('mouseleave', () => this.hideEl()).hide()
        }
//     constructor(viewFn, getSelectBox, getSelectedIndexes) {
//         this.viewFn = viewFn;
//         this.getSelectBox = getSelectBox;
//         this.getSelectedIndexes = getSelectedIndexes;
//         this.notes = {}; // {"ri-ci": "comment"}
//         this.updateCBs = []; // array of functions to call on update
//         this.el = h('div', `${cssPrefix}-note`).on('mouseleave', () => this.hideEl()).hide();
//         this.activeIndexes = [-1, -1];
//     }

    addUpdateCBs(cb) {
        this.updateCBs.push(cb)
    }

    runCBs(action, ri, ci, newNote) {
        for (let cb of this.updateCBs) {
            cb(action, ri, ci, newNote)
        }
    }

//     getNote(ri, ci) {
//         return this.notes[`${ri}-${ci}`] || "";
//     }

//     setNote(ri, ci, note) {
//         this.notes[`${ri}-${ci}`] = note;
//         this.runCBs('update', ri, ci, note)
//     }

    hasNote(ri, ci) {
        return this.getNote(ri, ci) !== "";
    }

    getNote(ri, ci) {
        
        return this.sheet.data.comments[`${ri}-${ci}`] || ""
    }

    setNote(ri, ci, note) {
        // this.activeIndexes = [ri, ci]
        this.sheet.data.comments[`${ri}-${ci}`] = note
        for (let cb of this.updateCBs) {
            cb(ri, ci)
        }
    }

    showNote(ri, ci, x) {
        // remove any previous children of el
        for (let child of this.el.children()) {
            this.el.removeChild(child)
        }
        const text = this.getNote(ri, ci) || ""
//                 .on('blur', () => this.hideEl())
//         const { top, left, width } = this.getSelectBox().getBoundingClientRect()
//         this.el.css('top', `${top}px`).css('left', `${left + width + 5}px`)
        this.el.children(
            h('textarea', `${cssPrefix}-notetext`)
                .on('change', (e) => this.setNote(ri, ci, e.target.value))
                .on('blur', () => {if(text === ""){this.hideEl();}})
                .on('mousewheel', () => {console.log('mouse wheel');this.hideEl();})
                .children(text)
        )
        const { top, left, width } = x;
        // magic numbers??
        this.el.css('top', `${top + 290}px`).css('left', `${left+ width+90+2}px`)
        this.el.show()
        this.el.children()[0].focus()
    }

    clearNote(ri, ci) {
        this.setNote(ri, ci, "")
//         this.runCBs('delete', ri, ci, "")
    }
    
    hideEl() {
        if (![...this.el.children()].includes(document.activeElement)) {
            this.el.hide()
        } 
    }

//     hideEl() {
//         const [sri, sci] = this.getSelectedIndexes()
//         const [ari ,aci] = this.activeIndexes
//         if (![...this.el.children()].includes(document.activeElement) && (sri !== ari || sci !== aci)) {
//             this.el.hide()
//         }
//     }
}
