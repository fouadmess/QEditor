import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var require: any;
const Quill = require('quill');

@Component({
	selector: 'ms-qeditor',
	template: `<div class="quill-editor"></div>`,
	styleUrls: ['./qeditor.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => QEditorComponent),
		multi: true
	}],
	encapsulation: ViewEncapsulation.None
})
export class QEditorComponent implements AfterViewInit, ControlValueAccessor, OnChanges {

	/**
	 * The editor instance
	 */
	public quillEditor: any;

	/**
	 * The editor DOM element
	 */
	public editorElem: HTMLElement;

	/**
	 * The content of the editor
	 */
	public content: any;

	/**
	 * Defaults modules and toolbar
	 */
	public defaultModules = {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],
			['blockquote', 'code-block'],

			[{ 'header': 1 }, { 'header': 2 }],
			[{ 'list': 'ordered' }, { 'list': 'bullet' }],
			[{ 'script': 'sub' }, { 'script': 'super' }],
			[{ 'indent': '-1' }, { 'indent': '+1' }],
			[{ 'direction': 'rtl' }],

			[{ 'size': ['small', false, 'large', 'huge'] }],
			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

			[{ 'color': new Array<any>() }, { 'background': new Array<any>() }],
			[{ 'font': new Array<any>() }],
			[{ 'align': new Array<any>() }],

			['clean'],
			['link', 'image', 'video']
		]
	};

	/**
	 * The configuration
	 */
	@Input() options: Object;
	@Input() spellcheck: boolean;

	/**
	 * The editor events
	 */
	@Output() blur: EventEmitter<any> = new EventEmitter();
	@Output() focus: EventEmitter<any> = new EventEmitter();
	@Output() ready: EventEmitter<any> = new EventEmitter();
	@Output() change: EventEmitter<any> = new EventEmitter();

	/**
	 * The model events
	 */
	onModelChange: Function = () => { };
	onModelTouched: Function = () => { };

	/**
	 * Constructor
	 * @param elementRef 
	 */
	constructor(private elementRef: ElementRef) { }

	/**
	 * Lifecycle hook that is called after a component's view has 
	 * been fully initialized.
	 */
	ngAfterViewInit() {
		this.editorElem = this.elementRef.nativeElement.children[0];

		/* Set config */
		this.quillEditor = new Quill(this.editorElem, Object.assign({
			modules: this.defaultModules,
			placeholder: '',
			readOnly: false,
			theme: 'snow',
			boundary: document.body
		}, this.options || {}));

		if (this.content) {
			this.quillEditor.pasteHTML(this.content);
		}

		if (!this.spellcheck) {
			this.quillEditor.root.spellcheck = false;
			this.quillEditor.root.focus();
			this.quillEditor.root.blur();
		}

		/* Emit ready event when the editor is */
		this.ready.emit(this.quillEditor);

		/* Mark model as touched if editor lost focus */
		this.quillEditor.on('selection-change', (range: any) => {
			if (!range) {
				this.onModelTouched();
				this.blur.emit(this.quillEditor);
			} else {
				this.focus.emit(this.quillEditor);
			}
		});

		/* Update model if text changes */
		this.quillEditor.on('text-change', (delta: any, oldDelta: any, source: any) => {
			let html = this.editorElem.children[0].innerHTML;
			const text = this.quillEditor.getText();

			if (html === '<p><br></p>') html = null;

			this.onModelChange(html);

			this.change.emit({
				editor: this.quillEditor,
				html: html,
				text: text
			});
		});
	}

	/**
	 * Lifecycle hook that is called when any data-bound 
	 * property of a directive changes.
	 */
	ngOnChanges(changes: SimpleChanges) {
		if (changes['readOnly'] && this.quillEditor) {
			this.quillEditor.enable(!changes['readOnly'].currentValue);
		}
	}

	/**
	 * Writes a new value to the element.
	 * @param currentValue 
	 */
	writeValue(currentValue: any) {
		this.content = currentValue;

		if (this.quillEditor) {
			if (currentValue) {
				this.quillEditor.pasteHTML(currentValue);
				return;
			}

			this.quillEditor.setText('');
		}
	}

    /**
     * Registers a callback function that should be called when the control's value
     * changes in the UI.
	 */
	registerOnChange(fn: Function): void {
		this.onModelChange = fn;
	}

    /**
     * Registers a callback function that should be called when the control receives
     * a blur event.
	 */
	registerOnTouched(fn: Function): void {
		this.onModelTouched = fn;
	}
}