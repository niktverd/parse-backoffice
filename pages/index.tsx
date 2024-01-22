import React from 'react';

import type {NextPage} from 'next';

import {Page} from '../src/containers/Page/Page';

const Home: NextPage = () => {
    return <Page selectedKey="home">Parse Backoffice</Page>;
};

export default Home;
