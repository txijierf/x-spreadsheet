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


export default class deletePopup extends Modal {

     

    constructor(spread) {
        
        super(t('contextmenu.delete-popup'), [
            h('div', `${cssPrefix}-buttons`).children(
                new Button('yes').on('click', () => this.btnClick('yes')),
                new Button('no').on('click', () => this.btnClick('no')),
            ),
            ]);

            this.spread = spread;
            this.validation_location = -1;
    }

    btnClick(action) {
        if(action === 'yes'){
            this.hide();
            

            if( this.validation_location != -1){
                this.spread.datas[this.spread.getCurrentSheetIndex()].rows.deleteColumn(this.validation_location,this.validation_location+1);
                this.validation_location = -1;
            }

            this.spread.datas[this.spread.getCurrentSheetIndex()].delete('column');
            this.spread.reRender();
            //this.hide();
        }
        else if(action === 'no'){
            this.hide();
        }
    }
}
