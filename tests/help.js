const chai = require('chai');
const sinonChai = require('sinon-chai');
const { JSDOM } = require('jsdom');

chai.use(sinonChai);
const expect = chai.expect;

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
class HTMLUnknownElement { }

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLUnknownElement = HTMLUnknownElement;
