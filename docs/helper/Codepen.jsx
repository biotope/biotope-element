import React from 'react';

const createEmbedUrl = (username, penId) => `//codepen.io/${username}/embed/${penId}/?height=265&theme-id=0&default-tab=js,result&embed-version=2`;

const Codepen = ({ username = '', penId = '' }) => (
    <iframe height='265' scrolling='no' title='CSS Variables Polyfill' src={createEmbedUrl(username, penId)} frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width: '100%' }}>

    </iframe>
);

export default Codepen;
