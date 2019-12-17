import { HTMLFragment } from '../src/types';
import { ComponentInstance } from '../src/internal-types';
import { render, rendered, ready } from '../src/create-renders';

describe('#render', () => {
  const fragment: HTMLFragment = {
    type: 'html',
    args: undefined,
  };
  let component;
  let result;

  beforeEach(() => {
    component = {};
    result = render(component, jest.fn(() => fragment));
  });

  it('resets the rendered property', () => {
    // eslint-disable-next-line no-underscore-dangle
    expect((component as ComponentInstance).__rendered).toBe(false);
  });

  it('resets the rendered property', () => {
    // eslint-disable-next-line no-underscore-dangle
    expect(result).toBe(fragment);
  });
});

describe('#rendered', () => {
  let component;

  beforeEach(() => {
    component = {
      shadowRoot: {
        querySelectorAll: jest.fn(() => []),
      },
      rendered: jest.fn(),
      emit: jest.fn(),
    };
  });

  it('calls the original rendered once', () => {
    rendered(component);
    expect(component.rendered.mock.calls).toHaveLength(1);
    expect(component.rendered.mock.calls[0]).toEqual([]);
  });

  describe('element has shadowRoot', () => {
    describe('has no children', () => {
      beforeEach(() => {
        rendered(component);
      });

      it('calls the shadowRoot querySelectorAll', () => {
        expect(component.shadowRoot.querySelectorAll.mock.calls).toHaveLength(1);
        expect(component.shadowRoot.querySelectorAll.mock.calls[0]).toEqual(['*']);
      });

      it('marks the element as rendered', () => {
        // eslint-disable-next-line no-underscore-dangle
        expect((component as ComponentInstance).__rendered).toBe(true);
      });

      it('emits a rendered event', () => {
        expect(component.emit.mock.calls).toHaveLength(1);
        expect(component.emit.mock.calls[0]).toEqual(['rendered', undefined, true]);
      });
    });

    describe('has children', () => {
      let innerElements;

      beforeEach(() => {
        innerElements = [{}, { __rendered: false }];
        component.shadowRoot.querySelectorAll = jest.fn(() => innerElements);
        rendered(component);
      });

      it('waits until children are rendered', (done) => setTimeout(() => {
        // eslint-disable-next-line no-underscore-dangle
        expect(component.shadowRoot.querySelectorAll()[1].__rendered).toBe(false);
        // eslint-disable-next-line no-underscore-dangle
        innerElements[1].__rendered = true;

        setTimeout(() => {
          // eslint-disable-next-line no-underscore-dangle
          expect(component.shadowRoot.querySelectorAll()[1].__rendered).toBe(true);
          done();
        });
      }, 100));
    });
  });

  describe('element does not have shadowRoot', () => {
    beforeEach(() => {
      component.querySelectorAll = component.shadowRoot.querySelectorAll;
      component.shadowRoot = undefined;
      rendered(component);
    });

    it('calls the component querySelectorAll', () => {
      expect(component.querySelectorAll.mock.calls).toHaveLength(1);
      expect(component.querySelectorAll.mock.calls[0]).toEqual(['*']);
    });
  });
});

describe('#createReady', () => {
  let component;

  beforeEach(() => {
    component = {
      ready: jest.fn(),
      emit: jest.fn(),
    };
  });

  it('calls the original ready', () => {
    ready(component);
    expect(component.ready.mock.calls).toHaveLength(1);
    expect(component.ready.mock.calls[0]).toEqual([]);
  });

  it('calls the original ready ONLY once', () => {
    ready(component);
    ready(component);
    expect(component.ready.mock.calls).toHaveLength(1);
    expect(component.ready.mock.calls[0]).toEqual([]);
  });
});
