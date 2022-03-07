import { h } from './element';
import Suggest from './suggest';
import { cssPrefix } from '../config';

export default class FormSelect {
  constructor(key, items, width, getTitle = it => it, change = () => {}) {
    this.key = key;
    this.width = width;
    this.getTitle = getTitle;
    this.change = change;
    this.vchange = () => {};
    this.el = h('div', `${cssPrefix}-form-select`);
    this.suggest = new Suggest(items.map(it => ({ key: it, title: this.getTitle(it) })), (it) => {
      this.itemClick(it.key);
      change(it.key);
      this.vchange(it.key);
    }, width, this.el);
    this.el.children(
      this.itemEl = h('div', 'input-text').html(this.getTitle(key)),
      this.suggest.el,
    ).on('click', () => this.show());
  }

  show() {
    this.suggest.search('');
  }


  itemClick(it) {
    
    this.key = it;
    this.itemEl.html(this.getTitle(it));
  }

  setItems(itemlist, keyname){
    this.items = itemlist;
    this.key= keyname;

    this.el.html("");

    this.suggest = new Suggest(this.items.map(it => ({ key: it, title: this.getTitle(it) })), (it) => {
      this.itemClick(it.key);
      this.change(it.key);
      this.vchange(it.key);
    }, this.width, this.el);


    this.el.children(
      this.itemEl = h('div', 'input-text').html(this.getTitle(this.key)),
      this.suggest.el,
    ).on('click', () => this.show());

  }

  val(v) {
    if (v !== undefined) {
      this.key = v;
      this.itemEl.html(this.getTitle(v));
      return this;
    }
    return this.key;
  }
}
