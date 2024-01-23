import React from 'react';

import type {NextPage} from 'next';

import {ApiKeys} from '../../../src/containers/ApiKeys/ApiKeys';
import {Page} from '../../../src/containers/Page/Page';

// import styles from 'styles/Home.module.scss';

const ApiKeysPage: NextPage = () => {
    return (
        <Page selectedKey="projects">
            <ApiKeys />
        </Page>
    );
};

export default ApiKeysPage;
