import {
  Input,
  OnInit,
  NgZone,
  Component,
  Directive,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core'

@Directive( {
  selector: '[text] [option.color] [option.auto] [option.duration] [option.multiply]'
} )
export class TextShuffleDirective {

  @Input() public text!: string

  @Input( 'option.auto' ) public auto: boolean = false
  
  @Input( 'option.color' ) public color: Array < string > = [

    '#ff3100',
    '#ff8000',
    '#ffc600',
    '#88ff00',
    '#00ff71',
    '#00e8ff',
    '#0084ff',
    '#3100ff',
    '#ff00e1',
    '#ff003e',
    '#e6e6e6',
    '#808080',
    '#333333'
  ]

  @Input( 'option.duration' ) public duration: number = 500

  @Input( 'option.multiply' ) public multiply: number = 2.0
}

@Component( {
  selector: 'text-shuffle',
  templateUrl: './text-shuffle.component.html'
} )
export class TextShuffleComponent extends TextShuffleDirective implements OnInit, AfterViewChecked {

  private chk: any
  private parent: Element
  private content: any
  private context!: CanvasRenderingContext2D
  private animation: any
  private attribute: any
  private subscription: any

  constructor(

    private zone: NgZone,
    private cdrRef: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {

    super()

    this.cdrRef.detach()

    this.parent = this.elementRef.nativeElement

    this.color = this.getShuffle( this.color )

    this.chk = {

      change: false
    }

    this.content = {}

    this.animation = {}
  }

  ngOnInit(): void {}

  ngOnLoad(): void {

    try {

      this.content = {

        word: this.getWord,
        char: this.getCharacter(),
        prefix: this.getCharacter(),
        suffix: new Array < string > ()
      }

      var span = this.parent.querySelector( 'span' )!

      span.textContent = this.text

      let rect = span.getBoundingClientRect()

      let compute = window.getComputedStyle( span )

      this.attribute = {

        line: [],
        color: compute.color,
        width: rect.width * this.multiply,
        height: rect.height * this.multiply,
        letter: this.getSize( compute.letterSpacing )
      }

      var canvas = this.parent.querySelector( 'canvas' )!

      canvas.width = this.attribute.width

      canvas.height = this.attribute.height

      canvas.style.width = rect.width + 'px'

      canvas.style.height = rect.height + 'px'

      canvas.style.letterSpacing = this.getSize( compute.letterSpacing, 'px' )

      this.context = canvas.getContext( '2d' )!

      this.context.font = [ compute.fontWeight, this.getSize( compute.fontSize, 'px' ), compute.fontFamily ].join( ' ' )

      this.context.fillStyle = compute.color

      this.context.textBaseline = 'top'

      this.setLine( this.content.word )

      if ( this.auto ) return this.onEnter()

      this.setText()

    } catch ( e ) {

      console.log( e )
    }
  }

  ngOnDestroy(): void {

    clearTimeout( this.animation.change )

    this.animation.change = null

    for ( let key in this.subscription ) {

      this.subscription[ key ].unsubscribe()
    }
  }

  ngOnChanges(): void {

    if ( this.text == null || this.text == undefined ) return

    this.ngOnLoad()
  }

  ngAfterViewChecked(): void {

    if ( this.text == null || this.text == undefined ) return

    clearTimeout( this.animation.change )

    this.animation.change = null

    this.zone.runOutsideAngular( _ => {

      if ( this.chk.change ) return

      this.cdrRef.detectChanges()

      this.animation.change = setTimeout( ( _: any ) => {

        this.chk.change = true

        this.ngOnLoad()

      }, 100 )
    } )
  }

  /**
   * Change resolution.
   * @param size Compute size px or em
   * @param suffix Add a suffix
   * @returns 
   */
  getSize( size: string, suffix?: string ): any {

    let num = ( parseFloat( size.replace( /[px|em]/g, '' ) ) || 0 ) * this.multiply

    if ( suffix ) return num + suffix

    return num
  }

  /**
   * Shuffle strings.
   * @param shuffle Array of letters
   * @returns 
   */
  getShuffle( shuffle: Array < string > ): Array < string > {

    return shuffle.sort( _ => .5 - Math.random() )
  }

  /**
   * String to character array
   * @param char String text
   * @returns 
   */
  getCharacter( char: string = this.text ): Array < string > {

    return char.split( '' )
  }

  /**
   * Divide into words
   */
  get getWord(): Array< string > {

    return this.text.split( ' ' )
  }

  /**
   * Calculate the actual size that is drawn on canvas.
   * @param character Array of letters
   * @param line 
   */
  setLine( character: Array < string > , line: Array < string > = [] ) {

    for ( let char of character ) {

      line.push( char )

      var join = line.join( ' ' )

      var measure = this.context.measureText( join )

      let maximum = measure.width + ( this.attribute.letter * join.length )

      if ( this.attribute.width < maximum ) {

        if ( line.length < 2 ) {

          this.setLine( this.getCharacter( char ), line )

          continue
        }

        let pop = line.pop()!

        join = line.join( ' ' )

        line = [ pop ]

        measure = this.context.measureText( join )

        this.attribute.line.push( {

          box: {

            ascent: measure.actualBoundingBoxAscent,
            descent: measure.actualBoundingBoxDescent
          },
          font: {

            ascent: measure.fontBoundingBoxAscent,
            descent: measure.fontBoundingBoxDescent
          },
          length: join.length
        } )
      }
    }

    if ( line.length > 0 ) {

      let join = line.join( ' ' )

      let measure = this.context.measureText( join )

      this.attribute.line.push( {

        box: {

          ascent: measure.actualBoundingBoxAscent,
          descent: measure.actualBoundingBoxDescent
        },
        font: {

          ascent: measure.fontBoundingBoxAscent,
          descent: measure.fontBoundingBoxDescent
        },
        length: join.length
      } )
    }
  }

  /**
   * Draw text.
   */
  setText(): void {

    let clone = JSON.parse( JSON.stringify( this.attribute.line ) )

    let line = clone.shift()

    var l = 0

    var x = 0

    var y = line.font.ascent

    var next = () => {

      try {

        if ( line && line.length < ++l ) {

          let size = line.font.descent - line.font.ascent

          line = clone.shift()

          x = 0

          l = 0

          y = y + size + ( line.font.ascent / 2 )
        }
      } catch ( _ ) {}
    }

    this.content.suffix = this.getShuffle( this.content.suffix )

    this.context.clearRect( 0, 0, this.attribute.width, this.attribute.height )

    this.context.fillStyle = this.attribute.color

    for ( let char of this.content.prefix ) {

      let measure = this.context.measureText( char )

      this.context.fillText( char, x, y )

      x = x + ( measure.width + this.attribute.letter )

      next()
    }

    var idx = 0

    for ( let char of this.content.suffix ) {

      if ( idx > this.color.length ) idx = 0

      let measure = this.context.measureText( char )

      this.context.fillStyle = this.color[ idx++ ]

      this.context.fillText( char, x, y )

      x = x + ( measure.width + this.attribute.letter )

      next()
    }
  }

  /**
   * Mouse event
   */
  onEnter(): void {

    if ( this.chk.change == false ) return

    this.content = {

      word: this.getWord,
      char: this.getCharacter(),
      prefix: new Array < string > (),
      suffix: this.getCharacter()
    }

    this.animation.frame = window.requestAnimationFrame( _ => this.onUpdate() )

    this.onTimer()
  }

  onLeave(): void {

    if ( this.chk.change == false ) return

    this.content.prefix = this.getCharacter()

    this.content.suffix = new Array < string > ()

    window.cancelAnimationFrame( this.animation.frame )

    clearTimeout( this.animation.timeout )

    this.context.clearRect( 0, 0, this.attribute.width, this.attribute.height )

    this.setText()
  }

  onTimer(): void {

    this.animation.timeout = setTimeout( ( _: any ) => {

      let char = this.content.char.shift()

      this.content.prefix.push( char )

      this.content.suffix.splice( this.content.suffix.indexOf( char ), 1 )

      if ( this.content.char.length > 0 ) {

        this.onTimer()

      } else {

        this.onLeave()
      }
    }, this.duration / this.text.length )
  }

  onUpdate(): void {

    this.animation.frame = window.requestAnimationFrame( _ => this.onUpdate() )

    this.setText()
  }
}