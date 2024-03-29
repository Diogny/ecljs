import { dP, typeOf, isInt, splat, isStr, isNumeric, isFn } from 'dabbjs/dist/lib/dab';
import { qS, isDOM } from 'dabbjs/dist/lib/dom';
import { each } from 'dabbjs/dist/lib/misc';
import { IUIPropertyCallback, Base, IPropContainerDefaults, IReactPropDefaults, IUIPropertyDefaults, IReactProp, IReactPropHook } from './interfaces';

export class ReactProp extends Base implements IReactProp {

  protected $!: IReactPropDefaults;

  /**
   * @description returns an object [key]::any with the property inside data
   */
  get _(): { [id: string]: any } { return this.$._ }

  /**
   * @description get/set the value of the react property
   */
  get value(): any { return this.$.value }

  /**
   * @param {any} val setters new value
   */
  set value(val: any) {
    this.$.value = val;
    this.onChange && this.onChange(val, 2, this, <any>void 0)
  }

  /**
   * @description creates a react property
   * @param options [key]::value object as description
   *
   * valid [options] are:
   * - value: property default value, default is undefined.
   * - _: [key]::value object with internal data
   * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
   */
  constructor(options: { [id: string]: any }) {
    super(options);
    isFn(options.onChange) && (this.onChange = options.onChange);
  }

  dispose(): void {
    //
  }

  /**
   * @description onchange event (value: any, where: number, prop: IReactProp, e: any): any | void
   *
   */
  onChange: IUIPropertyCallback | undefined;

  /**
   * @description class property defaults. Only these keys are copied internally
   */
  public defaults(): IReactPropDefaults {
    return <IReactPropDefaults>{
      _: {},
      value: void 0
    }
  }
}

export class UIProp extends ReactProp {

  protected $!: IUIPropertyDefaults;

  get type(): string { return this.$.type }

  get html(): HTMLElement { return this.$.html }
  get editable(): boolean { return this.$.editable }

  get tag(): string | Element { return this.$.tag }
  get nodeName(): string { return this.html.nodeName.toLowerCase() }
  get react(): boolean { return this.editable || this.$.htmlSelect }

  /**
   * @description creates a react UI property
   * @param options [key]::value object as description
   *
   * valid [options] are:
   * - tag: this's required as a valid DOM selector query
   * - value: property default value, default is undefined.
   * - _: [key]::value object with internal data
   * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
   */
  constructor(options: { [id: string]: any }) {
    super(options);
    if (!(this.$.html = <HTMLElement>(isDOM(options.tag) ? (options.tag) : qS(<string>options.tag))))
      throw new Error('wrong options');
    (<any>this.html).dab = this;
    switch (this.nodeName) {
      case 'input':
        this.$.type = (<HTMLInputElement>this.html).type.toLowerCase();
        this.$.editable = true;
        switch (this.type) {
          case 'radio':
          case 'checkbox':
            this.$.type = "boolean";
            this.$.getter = 'checked';
            break;
          case 'submit':
          case 'button':
            throw new Error('HTML input tag type invalid');
          case 'text':
          case 'number':
            //TML5 input types stays the same
            break;
          case 'password':
          case 'hidden':	//prop.type is text
          default:
            //•color	•date	•datetime	•datetime-local	•email	•month	•number	•range	•search
            //•tel	•time	•url	•week
            this.$.type = 'text';
        }
        break;
      case 'textarea':
        this.$.type = 'text';
        this.$.editable = true;
        break;
      case 'select':
        this.$.htmlSelect = true;
        switch ((<HTMLSelectElement>this.html).type.toLowerCase()) {
          case 'select-one':
            this.$.getter = "selectedIndex";	//'<any>null';
            break;
          case 'select-multiple':
            this.$.getter = "selectedOptions";	//'<any>null'
            this.$.selectMultiple = true;
            break;
        }
        this.$.type = "integer";
        //define properties for 'SELECT'
        let
          index: number = -1;
        this.$.selectCount = (<any>this.html).length;
        //later return an array for select multiple
        dP(this, "index", {
          get: () => index,
          set(value: number) {
            (value >= 0 && value < (<any>this).$.selectCount) &&	// this.options.length
              ((index != -1) && ((<any>this).html.options[index].selected = !1),
                (<any>this).html.options[index = value].selected = !0,
                (<any>this).trigger());
          }
        });
        dP(this, "selectedOption", {
          get: () => (<any>this.html).options[(<any>this.html).selectedIndex]
        });
        break;
      default:
        //later check this for all text HTMLElements
        this.$.getter = 'innerHTML'
    };
    //this's set only if it's an editable property
    this.react
      && this.html.addEventListener('change', this.trigger);
  }

  get value(): any {
    if (!this.react) {
      return this.$.value
    }
    let
      val = (<any>this.html)[this.$.getter];	//select.selectedOptions
    if (!this.$.htmlSelect) {
      switch (this.type) {
        case "integer":
          return isNaN(val = parseInt(val)) ? 0 : val
        case "number":
          return isNaN(val = parseFloat(val)) ? 0 : val
      }
      return val
    } else if (this.$.selectMultiple) {
      return [].map.call(val, (option: HTMLOptionElement) => option.value)
    } else
      return (<HTMLSelectElement>this.html).options[val].value
  }

  set value(val: any) {
    if (!this.react) {
      this.$.value = val;
      //call onchange to get UI value
      let
        transfValue = this.onChange && this.onChange(val, 2, this, <any>void 0);
      //write to DOM transformed value, if undefined write "val"
      (<any>this.html)[this.$.getter] = (transfValue == undefined) ? val : transfValue
      return
    }
    if (!this.$.htmlSelect) {
      let
        valtype = typeOf(val);

      if ((this.type == "text" && valtype == "string") ||
        (this.type == "boolean" && valtype == "boolean") ||
        (this.type == "integer" && isInt(val)) ||
        (this.type == "number" && isNumeric(val))
      )
        (<any>this.html)[this.$.getter] = val;
    }
    else {
      if (this.$.selectMultiple) {
        let
          values = splat(val).map((num: any) => num + '');

        [].forEach.call((<any>this.html).options, (option: HTMLOptionElement) => {
          (values.indexOf(option.value) >= 0) && (option.selected = true)
        })
      } else {
        if (isStr(this.value)) {
          val = [].findIndex.call((<any>this.html).options,
            (option: HTMLOptionElement) => option.value == val
          )
        }
        (<HTMLSelectElement>this.html).selectedIndex = <number>val | 0
      }
    }
    this.trigger(null)
  }

  public dispose() {
    this.react
      && this.html.removeEventListener('change', this.trigger);
  }

  private trigger(e: any): void {
    //when comming from UI, this is the DOM Element
    // 	otherwise it's the property
    let
      prop: UIProp | null = this instanceof UIProp ? this : (<any>this).dab;
    if (!prop)
      return;
    prop.html.blur();
    prop.onChange && prop.onChange(
      prop.value,			//this cache current value
      (e) ? 1 : 2,		// 1 == 'ui' : 2 == 'prop'
      prop,				//not needed, but just in case
      e					//event if UI triggered
    )
  }

  /**
   * @description class property defaults. Only these keys are copied internally
   */
  public defaults(): IUIPropertyDefaults {
    return <IUIPropertyDefaults>{
      _: {},
      value: void 0,
      tag: "",
      html: <any>void 0,
      type: "text",
      selected: false,
      editable: false,
      getter: "value",
      htmlSelect: false,
      selectCount: 1,
      selectMultiple: false,
    }
  }

}

export class PropContainer extends Base {

  protected $!: IPropContainerDefaults;

  get props(): { [id: string]: IReactPropHook } { return this.$._ }

  get modified(): boolean { return this.$.modified }
  set modified(value: boolean) { this.$.modified = value }

  /**
   * @description creates a property container
   * @param props [key]::value object
   *
   * [key] is property name, ::value is valid prop [options]:
   * - value: set prop default value.
   * - _: [key]::value object with internal data
   * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
   * - modify: triggers container modified, default to true
   */
  constructor(props: { [id: string]: { [id: string]: any } }) {
    super();
    each(props, (options: { [id: string]: any }, key: string) => this.$._[key] = hook(this, key, options))
  }

  /**
   * @description class property defaults. Only these keys are copied internally
   */
  public defaults(): IPropContainerDefaults {
    return <IPropContainerDefaults>{
      _: {},
      modified: false
    }
  }
}

/**
 * @description creates a property hook to container properties
 * @param parent container
 * @param name hook/prop name
 * @param options [key]::value options
 *
 * valid [options] are:
 * - value: property default value, default is undefined.
 * - _: [key]::value object with internal data
 * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
 * - modify: triggers container modified, default to true
 * - label --experiment to use shorter names
 */
function hook(parent: PropContainer, name: string, options: { [id: string]: any }): IReactPropHook {
  var
    //defaults to "true" if not defined
    onModify = options.modify == undefined ? true : options.modify,
    p = (options.tag) ? new UIProp(options) : new ReactProp(options),
    modified = false,
    prop: { [id: string]: any } = {};
  dP(prop, "value", {
    get(): any {
      return p.value
    },
    set(value: any) {
      p.value = value;
      //trigger father's modified only if defined, defaults to "true"
      modified = true;
      onModify && ((<any>parent).$.modified = true)
    }
  });
  dP(prop, "name", { get(): string { return name } });
  dP(prop, "modified", { get(): boolean { return modified } });
  dP(prop, "prop", { get(): ReactProp { return p } });
  //shortcut returns the data of the property
  dP(prop, "_", { get(): { [id: string]: any } { return p._ } });
  Object.freeze(prop);
  return <any>prop
}
