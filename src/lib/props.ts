import { IUIPropertyOptions, IUIPropertySettings, IUIPropertyCallback, IUIProperty, Base } from './interfaces';
import { dP, typeOf, isInt, splat, isDOM, isStr, isNumeric } from './dab';
import { qS, each } from './utils';

export class UIProp extends Base implements IUIProperty {

	protected __s: IUIPropertySettings;

	get type(): string { return this.__s.type }
	get tag(): string | Element { return this.__s.tag }
	get html(): HTMLElement { return this.__s.html }
	get editable(): boolean { return this.__s.editable }
	get data(): { [id: string]: any } { return this.__s.data }
	get nodeName(): string { return this.html.nodeName.toLowerCase() }

	get onChange(): IUIPropertyCallback | undefined { return this.__s.onChange }
	set onChange(fn: IUIPropertyCallback | undefined) { this.__s.onChange = fn }

	get value(): number | boolean | string | string[] {
		let
			val = (<any>this.html)[this.__s.getter];	//select.selectedOptions
		if (!this.__s.htmlSelect) {
			switch (this.type) {
				case "integer":
					return isNaN(val = parseInt(val)) ? 0 : val
				case "number":
					return isNaN(val = parseFloat(val)) ? 0 : val
			}
			return val
		} else if (this.__s.selectMultiple) {
			return [].map.call(val, (option: HTMLOptionElement) => option.value)
		} else
			return (<HTMLSelectElement>this.html).options[val].value
	}

	set value(val: number | boolean | string | string[]) {
		if (!this.editable) {
			//call onchange to get UI value
			let
				newValue = this.onChange && this.onChange(val, 2, this, <any>void 0);
			(<any>this.html)[this.__s.getter] = (newValue == undefined) ? val : newValue
			return
		}
		if (!this.__s.htmlSelect) {
			let
				valtype = typeOf(val);

			if ((this.type == "text" && valtype == "string") ||
				(this.type == "boolean" && valtype == "boolean") ||
				(this.type == "integer" && isInt(val)) ||
				(this.type == "number" && isNumeric(val))
			)
				(<any>this.html)[this.__s.getter] = val;
		}
		else {
			if (this.__s.selectMultiple) {
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

	constructor(options: IUIPropertyOptions) {
		super(options);
		if (!(this.__s.html = <HTMLElement>(isDOM(options.tag) ? (options.tag) : qS(<string>options.tag))))
			throw 'wrong options';
		(<any>this.html).dab = this;
		switch (this.nodeName) {
			case 'input':
				this.__s.type = (<HTMLInputElement>this.html).type.toLowerCase();
				this.__s.editable = true;
				switch (this.type) {
					case 'radio':
					case 'checkbox':
						this.__s.type = "boolean";
						this.__s.getter = 'checked';
						break;
					case 'submit':
					case 'button':
						throw 'HTML input tag type invalid';
					case 'text':
					case 'number':
						//TML5 input types stays the same
						break;
					case 'password':
					case 'hidden':	//prop.type is text
					default:
						//•color	•date	•datetime	•datetime-local	•email	•month	•number	•range	•search
						//•tel	•time	•url	•week
						this.__s.type = 'text';
				}
				break;
			case 'textarea':
				this.__s.type = 'text';
				this.__s.editable = true;
				break;
			case 'select':
				this.__s.htmlSelect = true;
				switch ((<HTMLSelectElement>this.html).type.toLowerCase()) {
					case 'select-one':
						this.__s.getter = "selectedIndex";	//'<any>null';
						break;
					case 'select-multiple':
						this.__s.getter = "selectedOptions";	//'<any>null'
						this.__s.selectMultiple = true;
						break;
				}
				this.__s.type = "integer";
				//define properties for 'SELECT'
				let
					index: number = -1;
				this.__s.selectCount = (<any>this.html).length;
				//later return an array for select multiple
				dP(this, "index", {
					get: () => index,
					set(value: number) {
						(value >= 0 && value < this.__s.selectCount) &&	// this.options.length
							((index != -1) && (this.html.options[index].selected = !1),
								this.html.options[index = value].selected = !0,
								this.trigger());
					}
				});

				dP(this, "selectedOption", {
					get: () => (<any>this.html).options[(<any>this.html).selectedIndex]
				});
				break;
			default:
				//later check this for all text HTMLElements
				this.__s.getter = 'innerHTML'
		};
		//this's set only if it's an editable property
		this.editable
			&& this.html.addEventListener('change', this.trigger);
	}

	public destroy() {
		this.editable
			&& this.html.removeEventListener('change', this.trigger);
	}

	private trigger(e: any): void {
		//when comming from UI, this is the DOM Element
		// 	otherwise it's the property
		let
			prop: UIProp | null = this instanceof UIProp ? this : (<any>this).dab;
		if (!prop || !prop.onChange)
			return;
		prop.html.blur();
		prop.onChange(
			prop.value,			//this cache current value
			(e) ? 1 : 2,		// 1 == 'ui' : 2 == 'prop'
			prop,				//not needed, but just in case
			e					//event if UI triggered
		)
	}

	public defaults(): IUIPropertySettings {
		return <IUIPropertySettings>{
			tag: "",
			onChange: void 0,
			data: {},
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

	static container(props: { [id: string]: IUIPropertyOptions }): { [id: string]: UIHook } {
		let
			root: { [id: string]: UIHook } = {};
		each(props, (p: IUIPropertyOptions, key: string) => root[key] = new UIHook(new UIProp(p)));
		return root
	}

}

export class UIHook {

	constructor(public prop: UIProp) { }

	get value(): number | boolean | string | string[] { return this.prop.value }
	set value(value: number | boolean | string | string[]) { this.prop.value = value }

}