import React from 'react';

import type {NextPage} from 'next';

import {Page} from '../../../src/containers/Page/Page';
import {SourceList} from '../../../src/containers/guess/SourceList/SourceList';

// import styles from 'styles/Home.module.scss';

const Tasks: NextPage = () => {
    return (
        <Page selectedKey="projects">
            <SourceList />
        </Page>
    );
};

export default Tasks;
