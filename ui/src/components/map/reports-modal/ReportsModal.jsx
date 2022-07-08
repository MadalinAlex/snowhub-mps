import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Modal} from 'react-bootstrap';
import _ from 'lodash';

import Endpoint from 'services/api/endpoint';
import {ReportCard} from 'components/cards/reports-card/ReportCard';
import {LoadingCard} from 'components/cards/loading-card/LoadingCard';
import {NoDataCard} from 'components/cards/no-data-card/NoDataCard';

import {handleFail, handleSuccess} from 'utils/utils';
import {USER_ACTIONS} from 'constants/constants';

import './ReportsModal.scss';

function ReportsModal({showModal, toggleModal, ...props}) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = useCallback(
        () => {
            setLoading(true);

            Endpoint.api.getReports().then(reports => {
                const reportsData = [];

                reports.forEach((report) => {
                    const slopeReports = _.get(props.slopePayload, 'reports', []);

                    if (slopeReports.indexOf(report._id) !== -1) {
                        reportsData.push(report);
                    }
                });

                setReports(reportsData);
                setLoading(false);
            });
        },
        [props.slopePayload]
    );

    const vote = useCallback(
        (payload) => {
            Endpoint.api.voteReport(payload)
                .then(() => handleSuccess(fetchReports, USER_ACTIONS.REPORT_INTERACTION))
                .catch((err) => handleFail(err));
        },
        [fetchReports]
    );

    useEffect(fetchReports, [props.slopePayload, fetchReports]);

    const reportsList = useMemo(
        () => {
            const sortedReports = _.orderBy(reports, ['time'],['desc']);

            if (loading) {
                return <LoadingCard />;
            }

            if (_.isEmpty(sortedReports)) {
                return <NoDataCard image={NoDataCard.IMAGE.NO_REPORTS} title={"No reports for this slope. Enjoy skiing!"}/>
            }

            return sortedReports.map((report, index) => (
                <ReportCard
                    key={index}
                    report={report}
                    onVote={vote} />
            ))
        },
        [reports, vote, loading]
    );

    return (
        <Modal
            className="reports-modal"
            show={showModal}
            onHide={toggleModal}
            backdrop="static"
            keyboard={false}
            size="md"
        >
            <Modal.Header closeButton>
                <Modal.Title>Reports for {props.slopePayload.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {reportsList}
            </Modal.Body>
        </Modal>
    );
}

export {ReportsModal};
