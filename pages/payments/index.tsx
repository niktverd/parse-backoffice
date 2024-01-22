import React from 'react';

import type {NextPage} from 'next';

import {Page} from '../../src/containers/Page/Page';
import {Payments} from '../../src/containers/Payments/Payments';

// import styles from 'styles/Home.module.scss';

const PaymentsPage: NextPage = () => {
    return (
        <Page selectedKey="payments">
            <Payments />
        </Page>
    );
};

export default PaymentsPage;
