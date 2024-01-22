import React, {Fragment} from 'react';

import {PayPalButtons, PayPalScriptProvider} from '@paypal/react-paypal-js';
import type {NextPage} from 'next';

import s from './Payments.module.scss';

type PaymentsProps = {} & React.PropsWithChildren;
const paypalClienId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export const Payments: NextPage<PaymentsProps> = (_props: PaymentsProps) => {
    return (
        <Fragment>
            <h1>Plans</h1>

            <div className={s.plans}>
                {['free', 'business', 'investor'].map((subscriptionPlan) => {
                    return (
                        <div key={subscriptionPlan} className={s.plan}>
                            <h3>{subscriptionPlan}</h3>
                            {paypalClienId ? (
                                <PayPalScriptProvider
                                    options={{
                                        clientId: paypalClienId,
                                        intent: 'subscription',
                                        vault: true,
                                        currency: 'USD',
                                    }}
                                >
                                    <PayPalButtons
                                        style={{
                                            layout: 'horizontal',
                                            shape: 'pill',
                                            label: 'subscribe',
                                            color: 'black',
                                        }}
                                        createSubscription={(_data, actions) => {
                                            return actions.subscription.create({
                                                plan_id: 'P-8YP55027XM3365445MU4VRZQ',
                                            });
                                        }}
                                    />
                                </PayPalScriptProvider>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </Fragment>
    );
};
