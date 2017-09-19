/**
 * @author mrdoob / http://mrdoob.com/
 * @author devingfx / http://devingfx.com/
 */

var UI = {};

UI.Element = class UIElement {

	constructor( dom ) {

		this.dom = typeof dom == 'string' ? document.createElement( dom ) : dom;

	}

	add () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof UI.Element ) {

				this.dom.appendChild( argument.dom );

			} else {

				console.error( 'UI.Element:', argument, 'is not an instance of UI.Element.' );

			}

		}

		return this;

	}

	remove () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof UI.Element ) {

				this.dom.removeChild( argument.dom );

			} else {

				console.error( 'UI.Element:', argument, 'is not an instance of UI.Element.' );

			}

		}

		return this;

	}

	clear () {

		while ( this.dom.children.length ) {

			this.dom.removeChild( this.dom.lastChild );

		}

	}

	setId ( id ) {

		this.dom.id = id;

		return this;

	}

	setClass ( name ) {

		this.dom.className = name;

		return this;

	}

	setStyle ( style, array ) {

		for ( var i = 0; i < array.length; i ++ ) {

			this.dom.style[ style ] = array[ i ];

		}

		return this;

	}

	setDisabled ( value ) {

		this.dom.disabled = value;

		return this;

	}

	setTextContent ( value ) {

		this.dom.textContent = value;

		return this;

	}

}

// properties

var properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
'background', 'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex' ];

properties.forEach( function ( property ) {

	var method = 'set' + property.substr( 0, 1 ).toUpperCase() + property.substr( 1, property.length );

	UI.Element.prototype[ method ] = function () {

		this.setStyle( property, arguments );

		return this;

	};

} );

// events

var events = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'DblClick', 'Change' ];

events.forEach( function ( event ) {

	var method = 'on' + event;

	UI.Element.prototype[ method ] = function ( callback ) {

		this.dom.addEventListener( event.toLowerCase(), callback.bind( this ), false );

		return this;

	};

} );

// Span

UI.Span = class UISpan extends UI.Element {

	constructor () {

		super( 'span' );

	}

}


// Div

UI.Div = class UIDiv extends UI.Element {

	constructor() {

		super( 'div' );

	}

}


// Row

UI.Row = class UIRow extends UI.Div {

	constructor() {

		super();

		this.dom.className = 'Row';

	}

}


// Panel

UI.Panel = class UIPanel extends UI.Div {

	constructor () {

		super();

		this.dom.className = 'Panel';

	}

}


// Text

UI.Text = class UIText extends UI.Span {

	constructor ( text ) {

		super();

		this.dom.className = 'Text';
		this.dom.style.cursor = 'default';
		this.dom.style.display = 'inline-block';
		this.dom.style.verticalAlign = 'middle';

		this.setValue( text );

	}

	getValue () {

		return this.dom.textContent;

	}

	setValue ( value ) {

		if ( value !== undefined ) {

			this.dom.textContent = value;

		}

		return this;

	}

}


// Input

UI.Input = class UIInput extends UI.Element {

	constructor ( text ) {

		super( 'input' );

		var scope = this;

		this.dom.className = 'Input';
		this.dom.style.padding = '2px';
		this.dom.style.border = '1px solid transparent';

		this.dom.addEventListener( 'keydown', function ( event ) {

			event.stopPropagation();

		}, false );

		this.setValue( text );

	}

	getValue () {

		return this.dom.value;

	}

	setValue ( value ) {

		this.dom.value = value;

		return this;

	}

}


// TextArea

UI.TextArea = class UITextArea extends UI.Element {

	constructor( ) {

		super( 'textarea' );
	
		var scope = this;
	
		this.dom.className = 'TextArea';
		this.dom.style.padding = '2px';
		this.dom.spellcheck = false;
	
		this.dom.addEventListener( 'keydown', function ( event ) {
	
			event.stopPropagation();
	
			if ( event.keyCode === 9 ) {
	
				event.preventDefault();
	
				var cursor = scope.dom.selectionStart;
	
				scope.dom.value = scope.dom.value.substring( 0, cursor ) + '\t' + scope.dom.value.substring( cursor );
				scope.dom.selectionStart = cursor + 1;
				scope.dom.selectionEnd = scope.dom.selectionStart;
	
			}
	
		}, false );
	
	}

	getValue () {

		return this.dom.value;

	}

	setValue ( value ) {

		this.dom.value = value;

		return this;

	}

}


// Select

UI.Select = class UISelect extends UI.Element {

	constructor() {

		super( 'select' );

		var scope = this;

		this.dom.className = 'Select';
		this.dom.style.padding = '2px';

	}

	setMultiple ( boolean ) {

		this.dom.multiple = boolean;

		return this;

	}

	setOptions ( options ) {

		var selected = this.dom.value;

		while ( this.dom.children.length > 0 ) {

			this.dom.removeChild( this.dom.firstChild );

		}

		for ( var key in options ) {

			var option = document.createElement( 'option' );
			option.value = key;
			option.innerHTML = options[ key ];
			this.dom.appendChild( option );

		}

		this.dom.value = selected;

		return this;

	}

	getValue () {

		return this.dom.value;

	}

	setValue ( value ) {

		value = String( value );

		if ( this.dom.value !== value ) {

			this.dom.value = value;

		}

		return this;

	}

}


// Checkbox

UI.Checkbox = class UICheckbox extends UI.Element {
	
	constructor( boolean ) {

		super( 'input' );

		var scope = this;

		this.dom.className = 'Checkbox';
		this.dom.type = 'checkbox';

		this.setValue( boolean );

	}

	getValue () {

		return this.dom.checked;

	}

	setValue ( value ) {

		if ( value !== undefined ) {

			this.dom.checked = value;

		}

		return this;

	}

}


// Color

UI.Color = class UIColor extends UI.Element {
	
	constructor() {

		super( 'input' );

		var scope = this;

		this.dom.className = 'Color';
		this.dom.style.width = '64px';
		this.dom.style.height = '17px';
		this.dom.style.border = '0px';
		this.dom.style.padding = '2px';
		this.dom.style.backgroundColor = 'transparent';

		try {

			this.dom.type = 'color';
			this.dom.value = '#ffffff';

		} catch ( exception ) {}

	}

	getValue () {

		return this.dom.value;

	}

	getHexValue () {

		return parseInt( this.dom.value.substr( 1 ), 16 );

	}

	setValue ( value ) {

		this.dom.value = value;

		return this;

	}

	setHexValue ( hex ) {

		this.dom.value = '#' + ( '000000' + hex.toString( 16 ) ).slice( - 6 );

		return this;

	}

}


// Number

UI.Number = class UINumber extends UI.Element {
	
	constructor( number ) {

		super( 'input' );

		var scope = this;

		var dom = this.dom;
		dom.className = 'Number';
		dom.value = '0.00';

		dom.addEventListener( 'keydown', function ( event ) {

			event.stopPropagation();

			if ( event.keyCode === 13 ) dom.blur();

		}, false );

		this.value = 0;

		this.min = - Infinity;
		this.max = Infinity;

		this.precision = 2;
		this.step = 1;
		this.unit = '';

		this.dom = dom;

		this.setValue( number );

		var changeEvent = document.createEvent( 'HTMLEvents' );
		changeEvent.initEvent( 'change', true, true );

		var distance = 0;
		var onMouseDownValue = 0;

		var pointer = [ 0, 0 ];
		var prevPointer = [ 0, 0 ];

		function onMouseDown( event ) {

			event.preventDefault();

			distance = 0;

			onMouseDownValue = scope.value;

			prevPointer = [ event.clientX, event.clientY ];

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

		}

		function onMouseMove( event ) {

			var currentValue = scope.value;

			pointer = [ event.clientX, event.clientY ];

			distance += ( pointer[ 0 ] - prevPointer[ 0 ] ) - ( pointer[ 1 ] - prevPointer[ 1 ] );

			var value = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
			value = Math.min( scope.max, Math.max( scope.min, value ) );

			if ( currentValue !== value ) {

				scope.setValue( value );
				dom.dispatchEvent( changeEvent );

			}

			prevPointer = [ event.clientX, event.clientY ];

		}

		function onMouseUp( event ) {

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			if ( Math.abs( distance ) < 2 ) {

				dom.focus();
				dom.select();

			}

		}

		function onChange( event ) {

			scope.setValue( dom.value );

		}

		function onFocus( event ) {

			dom.style.backgroundColor = '';
			dom.style.cursor = '';

		}

		function onBlur( event ) {

			dom.style.backgroundColor = 'transparent';
			dom.style.cursor = 'col-resize';

		}

		onBlur();

		dom.addEventListener( 'mousedown', onMouseDown, false );
		dom.addEventListener( 'change', onChange, false );
		dom.addEventListener( 'focus', onFocus, false );
		dom.addEventListener( 'blur', onBlur, false );

		return this;

	}

	getValue () {

		return this.value;

	}

	setValue ( value ) {

		if ( value !== undefined ) {

			value = parseFloat( value );

			if ( value < this.min ) value = this.min;
			if ( value > this.max ) value = this.max;

			this.value = value;
			this.dom.value = value.toFixed( this.precision );

			if ( this.unit !== '' ) this.dom.value += ' ' + this.unit;

		}

		return this;

	}

	setPrecision ( precision ) {

		this.precision = precision;

		return this;

	}

	setStep ( step ) {

		this.step = step;

		return this;

	}

	setRange ( min, max ) {

		this.min = min;
		this.max = max;

		return this;

	}

	setUnit ( unit ) {

		this.unit = unit;

		return this;

	}

}


// Integer

UI.Integer = class UIInteger extends UI.Element {

	constructor( number ) {

		super();

		var scope = this;

		var dom = document.createElement( 'input' );
		dom.className = 'Number';
		dom.value = '0';

		dom.addEventListener( 'keydown', function ( event ) {

			event.stopPropagation();

		}, false );

		this.value = 0;

		this.min = - Infinity;
		this.max = Infinity;

		this.step = 1;

		this.dom = dom;

		this.setValue( number );

		var changeEvent = document.createEvent( 'HTMLEvents' );
		changeEvent.initEvent( 'change', true, true );

		var distance = 0;
		var onMouseDownValue = 0;

		var pointer = [ 0, 0 ];
		var prevPointer = [ 0, 0 ];

		function onMouseDown( event ) {

			event.preventDefault();

			distance = 0;

			onMouseDownValue = scope.value;

			prevPointer = [ event.clientX, event.clientY ];

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

		}

		function onMouseMove( event ) {

			var currentValue = scope.value;

			pointer = [ event.clientX, event.clientY ];

			distance += ( pointer[ 0 ] - prevPointer[ 0 ] ) - ( pointer[ 1 ] - prevPointer[ 1 ] );

			var value = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
			value = Math.min( scope.max, Math.max( scope.min, value ) ) | 0;

			if ( currentValue !== value ) {

				scope.setValue( value );
				dom.dispatchEvent( changeEvent );

			}

			prevPointer = [ event.clientX, event.clientY ];

		}

		function onMouseUp( event ) {

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			if ( Math.abs( distance ) < 2 ) {

				dom.focus();
				dom.select();

			}

		}

		function onChange( event ) {

			scope.setValue( dom.value );

		}

		function onFocus( event ) {

			dom.style.backgroundColor = '';
			dom.style.cursor = '';

		}

		function onBlur( event ) {

			dom.style.backgroundColor = 'transparent';
			dom.style.cursor = 'col-resize';

		}

		onBlur();

		dom.addEventListener( 'mousedown', onMouseDown, false );
		dom.addEventListener( 'change', onChange, false );
		dom.addEventListener( 'focus', onFocus, false );
		dom.addEventListener( 'blur', onBlur, false );

		return this;

	}

	getValue () {

		return this.value;

	}

	setValue ( value ) {

		if ( value !== undefined ) {

			value = parseInt( value );

			this.value = value;
			this.dom.value = value;

		}

		return this;

	}

	setStep ( step ) {

		this.step = parseInt( step ); 

		return this;

	}

	setRange ( min, max ) {

		this.min = min;
		this.max = max;

		return this;

	}

}


// Break

UI.Break = class UIBreak extends UI.Element {
	
	constructor() {

		super( 'br' );

		this.dom.className = 'Break';

	}

}


// HorizontalRule

UI.HorizontalRule = class UIHorizontalRule extends UI.Element {

	constructor() {

		super( 'hr' );

		this.dom.className = 'HorizontalRule';

	}

}


// Button

UI.Button = class UIButton extends UI.Element {

	constructor( value ) {

		super( 'button' );

		this.dom.className = 'Button';
		this.dom.textContent = value;

	}

	setLabel ( value ) {

		this.dom.textContent = value;

		return this;

	}

}


// Modal

UI.Modal = class UIModal extends UI.Div {

	constructor ( value ) {

		super();

		var scope = this;

		var dom = this.dom

		dom.style.position = 'absolute';
		dom.style.width = '100%';
		dom.style.height = '100%';
		dom.style.backgroundColor = 'rgba(0,0,0,0.5)';
		dom.style.display = 'none';
		dom.style.alignItems = 'center';
		dom.style.justifyContent = 'center';
		dom.addEventListener( 'click', function ( event ) {

			scope.hide();

		} );

		this.container = new UI.Panel();
		this.container.dom.style.width = '200px';
		this.container.dom.style.padding = '20px';
		this.container.dom.style.backgroundColor = '#ffffff';
		this.container.dom.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';

		this.add( this.container );

	}

	show ( content ) {

		this.container.clear();
		this.container.add( content );

		this.dom.style.display = 'flex';

		return this;

}

	hide () {

		this.dom.style.display = 'none';

		return this;

}

}

