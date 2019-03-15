import Component from '../../../src/index';

class ChildSlot extends Component<any, any> {
	static componentName = 'x-child-slot';
	render() {
		this.html`
			<style>
				:host {
					color: orange;
				}
			
				::slotted(*) {
					color: blue;
				}
			</style>
			<slot />
			<p>I'm not slotted.</p>
    `;
	}
}

export default ChildSlot;
