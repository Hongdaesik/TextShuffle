## TextShuffle Angular Library.

A library that randomly mixes input strings and outputs them from the front digit.

You can check out the demo <a href="https://bettep.org/shuffle">here</a>.

![Excute](https://raw.githubusercontent.com/Hongdaesik/text-shuffle/master/DEMO.gif)

<br><br>

## Installation

```bash
npm install text-shuffle --save
```

<br><br>

## Usage

Import into your @NgModule.
```typescript
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextShuffleModule } from 'text-shuffle'

@NgModule({

  imports: [

    FormsModule,
    TextShuffleModule
  ],
  declarations: []
})
export class MyModule {}
```

Then, using your component.
```typescript
@Component( {

  selector: 'app',
  template: '<text-shuffle [text]="text" [option.auto]="option.auto" [option.color]="option.color" [option.duration]="option.duration" [option.multiply]="option.multiply"></text-shuffle>'
} )
export class AppComponent {

  /* require */
  public text: string = 'TextShuffle, Put your mouse pointer here!'

  /* optional */
  public option: any = {

    auto: true,
    color: [

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
    ],
    duration: 500,
    multiply: 2.0
  }
}
```

<br><br>

## Parameter
|Name|Type|Description|Default|
|---|---|---|---|
|[text]|string|String to output.|"''"|
|[option.auto]|boolean|Whether the shuffle animation is automatic.|`true`|
|[option.color]|Array|Text transformation color.|`['#ff3100','#ff8000','#ffc600','#88ff00','#00ff71','#00e8ff','#0084ff','#3100ff''#ff00e1','#ff003e','#e6e6e6','#808080','#333333']`|
|[option.duration]|number|Time of animation operation.|500|
|[option.multiply]|number|Size scale drawn on the canvas.|2.0|

<br><br>

## Change Log

`1.0.0` : Initial release.

<br><br>

## License

MIT

<br><br>

## Other programs

<https://bettep.org>