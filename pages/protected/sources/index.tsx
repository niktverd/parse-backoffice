import React from 'react';

import type {NextPage} from 'next';

import {Page} from '../../../src/ui/containers/Page/Page';
import {SourceList} from '../../../src/ui/containers/SourceList/SourceList';

// import styles from 'styles/Home.module.scss';

const Tasks: NextPage = () => {
    return (
        <Page selectedKey="projects">
            <SourceList />
        </Page>
    );
};

export default Tasks;
