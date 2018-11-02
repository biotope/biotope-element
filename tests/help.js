const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

require('basichtml').init({
    window: global
});
