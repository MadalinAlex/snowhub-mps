import React from 'react';
import PropTypes from 'prop-types';

import './Panel.scss';

function Panel({title, subtitle, children, className, size}) {
    const classNames = ['main-panel', size, className];

    return (
        <div className={classNames.join(' ')}>
            <h3 className="title">{title}</h3>
            <div className="subtitle">{subtitle}</div>
            {children}
        </div>
    );
}

Panel.SIZE = {
    AUTO: 'auto-panel',
    FLUID: 'fluid-panel'
};

Panel.defaultProps = {
    size: Panel.SIZE.FLUID
};

Panel.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    size: PropTypes.oneOf([
        Panel.SIZE.AUTO,
        Panel.SIZE.FLUID
    ])
};

export {Panel};
