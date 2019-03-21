import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as Api from './api';

const Init = async (opts) => {
    try {
        Api.config.companyId = opts.companyId;
        let settings = await Api.fetchSettings();
        if (!settings.isActive) {
            return;
        }
        const container = document.createElement('div');
        container.id = 'widget_omni_chanel';
        document.body.appendChild(container);
        Api.setConfig({
            companyId: opts.companyId,
            ...settings
        });
        ReactDOM.render(<App settings={settings} />, document.getElementById('widget_omni_chanel'));
    } catch (err) {
        console.error(err);
    }
}
export { Init as Widget }