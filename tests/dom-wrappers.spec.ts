import { render, html } from 'lighterhtml';
import { ComponentInstance } from '../src/internal-types';
import { createPartial, createRender } from '../src/create-html';

jest.mock('lighterhtml', (): object => ({
  render: jest.fn(),
  html: jest.fn(),
}));

describe('#dom-wrappers', () => {
  afterEach(() => {
    (render as jest.Mock).mockClear();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (html as any as jest.Mock).mockClear();
  });

  describe('#createPartial', () => {
    it('returns the html function', () => {
      expect(createPartial()).toBe(html);
    });
  });

  describe('#createRender', () => {
    const context = {
      __created: true,
      shadowRoot: {},
    };
    let mockRender: jest.Mock;
    let mockPost: jest.Mock;

    beforeEach(() => {
      mockRender = jest.fn();
      mockPost = jest.fn();
    });

    it('returns a render function', () => {
      expect(typeof createRender(context as ComponentInstance, mockRender, mockPost)).toBe('function');
    });

    describe('executing normally', () => {
      beforeEach(() => {
        createRender(context as ComponentInstance, mockRender, mockPost)();
      });

      it('lighterhtml render is called once', () => {
        expect((render as jest.Mock).mock.calls).toHaveLength(1);
      });

      it('lighterhtml render is called with the shadowRoot context', () => {
        expect((render as jest.Mock).mock.calls[0][0]).toBe(context.shadowRoot);
      });

      describe('lighterhtml processed the rendering', () => {
        beforeEach(() => {
          ((render as jest.Mock).mock.calls[0][1])();
        });

        it('original render is called once', () => {
          expect(mockRender.mock.calls).toHaveLength(1);
        });

        it('post render is called afterwards', (done) => setTimeout(() => {
          expect(mockPost.mock.calls).toHaveLength(1);
          done();
        }));
      });
    });

    describe('there is no shadowRoot', () => {
      beforeEach(() => {
        context.shadowRoot = undefined;
        createRender(context as ComponentInstance, mockRender, mockPost)();
      });

      it('passes the entire context to the render function', () => {
        expect((render as jest.Mock).mock.calls[0][0]).toBe(context);
      });
    });

    describe('component has not processed all attributes yet', () => {
      let result;

      beforeEach(() => {
        // eslint-disable-next-line no-underscore-dangle
        context.__created = false;
        result = createRender(context as ComponentInstance, mockRender, mockPost)();
      });

      it('render function returns null', () => {
        expect(result).toBe(null);
      });

      it('original render is not called', () => {
        expect(mockRender.mock.calls).toHaveLength(0);
      });
    });
  });
});
