import React from 'react';

import type {NextPage} from 'next';

import {ApiKeys} from '../../../src/ui/containers/ApiKeys/ApiKeys';
import {Page} from '../../../src/ui/containers/Page/Page';

// import styles from 'styles/Home.module.scss';

const ApiKeysPage: NextPage = () => {
    return (
        <Page selectedKey="projects">
            <ApiKeys />
        </Page>
    );
};

export default ApiKeysPage;
