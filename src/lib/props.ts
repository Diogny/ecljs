import { IUIPropertyOptions, IUIPropertySettings, IUIPropertyCallback, IUIProperty } from './interfaces';
import { attr, isFn, dP, typeOf, isInt, splat, isElement, isStr, isNumeric } from './dab';
import { qS } from './utils';

//... in progress...
export default class UIProp implements IUIProperty {

	protected __s: IUIPropertySettings;

	get id(): string { return this.__s.id }
	get type(): string { return this.__s.type }
	get name(): string { return this.__s.name }
	get tag(): string | Element { return this.__s.tag }
	get html(): HTMLElement { return this.__s.html }
	get editable(): boolean { return this.__s.editable }
	get data(): { [id: string]: any } { return this.__s.data }

	get nodeName(): string { return this.html.nodeName.toLowerCase() }

	get onChange(): IUIPropertyCallback | undefined { return this.__s.onChange }

	set onChange(fn: IUIPropertyCallback | undefined) {
		isFn(fn) && (this.__s.onChange = fn)
	}

	get value(): number | string | string[] {
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

	set value(val: number | string | string[]) {
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
			//this.getsetSelect(<HTMLSelectElement>this.html, 'selectedIndex', splat(val));
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
		//trigger the property change event
		this.selectionUiChanged(null);
	}

	constructor(options: IUIPropertyOptions) {
		//set default values
		this.__s = <IUIPropertySettings><unknown>{
			type: "text",
			selected: false,
			editable: false,
			getter: "value",
			htmlSelect: false,
			selectCount: 1,
			selectMultiple: false,
		};
		if (!options
			|| !(this.__s.html = <HTMLElement>(isElement(options.tag) ? (options.tag) : qS(<string>options.tag)))
		)
			throw 'wrong options';
		//this's useful, p.theme.value during initialization to have a local needed value
		this.__s.data = options.data || {};
		//set event handler if any, this uses setter for type checking
		this.onChange = options.onChange;
		//copy toString function
		this.__s.toStringFn = options.toStringFn;
		//self contain inside the html dom object for onchange event
		(<any>this.html).dab = this;
		//set properties
		this.__s.tag = options.tag;
		this.__s.name = <string>this.html.getAttribute("name");
		this.__s.id = this.html.id || attr(this.html, "prop-id") || ('property' + UIProp._propId++);

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
								this.selectionUiChanged());
					}
				});

				dP(this, "selectedOption", {
					get: () => (<any>this.html).options[(<any>this.html).selectedIndex]
				});

				break;
			default:
				if (UIProp.textOnly.indexOf(this.nodeName) >= 0) {
					this.__s.getter = 'innerText';
				} else
					throw `Unsupported HTML tag: ${this.nodeName}`;
		};
		//later see how can I register change event only for editable properties
		this.html.addEventListener('change', this.selectionUiChanged);
	}

	public toString(): string {
		return this.__s.toStringFn ? this.__s.toStringFn() : `${this.id}: ${this.value}`
	}

	private selectionUiChanged(e: any): void {
		//when comming from UI, this is the DOM Element
		// 	otherwise it's the property
		let
			prop: UIProp | null = this instanceof UIProp ? this : (<any>this).dab;
		if (prop && prop.onChange)
			prop.onChange(
				prop.value,			//this cache current value
				(e) ? 1 : 2,		// 1 == 'ui' : 2 == 'prop'
				prop,				//not needed, but just in case
				e					//event if UI triggered
			)
	}

	private static textOnly = "a|abbr|acronym|b|bdo|big|cite|code|dfn|em|i|kbd|label|legend|li|q|samp|small|span|strong|sub|sup|td|th|tt|var".split('|');
	private static _propId = 1;

}