import React, {useCallback, useMemo, useState} from 'react';
import {Button} from 'react-bootstrap';
import {Plus, Geo} from 'react-bootstrap-icons';
import GoogleMapReact from 'google-map-react';

import {ReportsModal} from './reports-modal/ReportsModal';
import {UsersOnlyGuard} from 'components/users-only-guard/UsersOnlyGuard';

import {useToggle} from 'utils/hook-utils';
import {MAP_OPTIONS} from 'constants/constants';

const SlopeMarker = ({text, reports, handleOnClick}) => (
    <div className="slope-marker" onClick={handleOnClick}>
        {text}
        <div className="indicator">
            {reports}
        </div>
    </div>
);

function SimpleMap(props) {
    const [mapInstance, setMapInstance] = useState(null);
    const [slopePayload, setSlopePayload] = useState({});
    const [showModal, toggleModal] = useToggle(false);

    const openReportsModal = useCallback(
        (slopeData) => {
            setSlopePayload(slopeData);
            toggleModal();
        },
        [toggleModal]
    );

    const slopesMarkers = useMemo(
        () => props.slopes.map((slope, index) => (
            <SlopeMarker
                key={index}
                lat={slope.latitude}
                lng={slope.longitude}
                text={slope.name}
                reports={slope.reports.length}
                handleOnClick={() => openReportsModal(slope)}
            />
        )),
        [props.slopes, openReportsModal]
    );

    const handleApiLoaded = (map, maps) => {
        setMapInstance(map);
    };

    const centerMap = (center) => {
        if (mapInstance) {
            mapInstance.setCenter(props.center);
        }
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: 'calc(100vh - 76px)', width: '100vw' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyBryq1X58tcuMszC01d2ojKV29K-EJwC3c' }}
                center={props.center}
                defaultZoom={props.zoom}
                options={MAP_OPTIONS}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
            >
                {slopesMarkers}
            </GoogleMapReact>
            <div className="action-buttons">
                <UsersOnlyGuard>
                    <Button className="mr-2" variant="primary" onClick={props.toggleReportModal}>
                        <Plus size={32} />
                    </Button>
                </UsersOnlyGuard>
                <Button variant="primary" onClick={() => props.getLocation(centerMap)}>
                    <Geo size={32} />
                </Button>
            </div>
            <ReportsModal
                slopePayload={slopePayload}
                showModal={showModal}
                toggleModal={toggleModal} />
        </div>
    );
}

SimpleMap.defaultProps = {
    center: {
        lat: 59.95,
        lng: 30.33
    },
    zoom: 13
};

export default SimpleMap;
