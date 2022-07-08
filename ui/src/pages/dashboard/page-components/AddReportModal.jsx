import React, {useEffect, useMemo, useState} from 'react';
import {Button, Modal, Alert} from 'react-bootstrap';
import Select from 'react-select'
import _ from 'lodash';

import Endpoint from 'services/api/endpoint';

import {handleSuccess} from 'utils/utils';
import {USER_ACTIONS} from 'constants/constants';
import {REPORT_TYPE_MAP, REPORT_TYPE_LABELS} from 'configs/reports-config';

function AddReportModal({showModal, toggleModal, onReportAdd, coords, slopes}) {
    const [errorMessage, setErrorMessage] = useState('');
    const [reportType, setReportType] = useState('');
    const [reportSlope, setReportSlope] = useState('');
    const [description, setDescription] = useState('');

    const reportTypeOptions = useMemo(
        () => (
            Object.keys(REPORT_TYPE_MAP).map(typeOption => (
                {
                    value: REPORT_TYPE_MAP[typeOption],
                    label: REPORT_TYPE_LABELS[typeOption]
                }
            ))
        ),
        []
    );

    const slopesOptions = useMemo(
        () => (
            slopes.map(slopeData => (
                {
                    value: slopeData,
                    label: slopeData.name
                }
            ))
        ),
    [slopes]
    );

    const reportSuccessCb = () => {
        toggleModal();
        onReportAdd();
    };

    const handleFormSubmit = () => {
        const payload = {
            type: reportType.value,
            description: _.get(description, ['target', 'value']),
            slope_id: reportSlope.value._id
        };

        Endpoint.api.addReport(payload)
            .then(() => handleSuccess(reportSuccessCb, USER_ACTIONS.REPORT_ADD))
            .catch(errResponse => {
                setErrorMessage(_.get(errResponse, 'message', 'Unknown Error'));
            });
    }

    return (
        <Modal
            show={showModal}
            onHide={toggleModal}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add a new report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
                <div>
                    <Select
                        onChange={setReportSlope}
                        options={slopesOptions} />
                    <br />
                    <Select
                        onChange={setReportType}
                        options={reportTypeOptions} />
                    <br />
                    <textarea rows={7} onChange={setDescription} />
                    <br />
                    <Button onClick={handleFormSubmit} variant="primary">Add Report</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export {AddReportModal};
