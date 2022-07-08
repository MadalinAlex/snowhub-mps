import React, {useState, useEffect, useCallback} from 'react';
import _ from 'lodash';

import Endpoint from 'services/api/endpoint';
import SimpleMap from 'components/map/Map';
import {Loader} from 'components/loader/Loader';
import {AddReportModal} from './page-components/AddReportModal';

import {useToggle} from 'utils/hook-utils';

import './Dashboard.scss';

const DEFAULT_COORDS = {
    latitude: 45.9432,
    longitude: 24.9668
};

function Dashboard(props) {
    const [loading, setLoading] = useState(true);
    const [position, setPosition] = useState({});
    const [slopes, setSlopes] = useState([]);
    const [showModal, toggleModal] = useToggle(false);

    const fetchSlopes = () => {
        Endpoint.api.getSlopes().then(setSlopes);
    };

    const handleLocalization = (location) => {
        setPosition(location);
        setLoading(false);
    }

    const getLocation = useCallback(
        (localizationHandler = handleLocalization) => {
            navigator.geolocation.getCurrentPosition(localizationHandler);
        },
        []
    );

    useEffect(
        () => {
            getLocation();
            fetchSlopes();
        },
        [getLocation]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSlopes();
        }, 20000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <Loader />
    }

    return (
        <React.Fragment>
            <SimpleMap
                center={{
                    lat: _.get(position, 'coords.latitude', 45.9432),
                    lng: _.get(position, 'coords.longitude', 24.9668),
                }}
                getLocation={getLocation}
                toggleReportModal={toggleModal}
                slopes={slopes} />
            <AddReportModal
                slopes={slopes}
                onReportAdd={fetchSlopes}
                showModal={showModal}
                coords={_.get(position, 'coords', DEFAULT_COORDS)}
                toggleModal={toggleModal} />
        </React.Fragment>
    );
}

export {Dashboard};
