import Component, { SVGFragment } from '@biotope/element';

export class ExampleText extends Component {
  public static componentName = 'example-svg';

  public render(): SVGFragment {
    return this.svg`
    <svg height="${100}" width="100">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      Sorry, your browser does not support inline SVG.  
    </svg> 
    `;
  }
}

ExampleText.register();
