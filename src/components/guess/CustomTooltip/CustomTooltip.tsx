import React from 'react';

import numeral from 'numeral';

import {Plan, Product, Project} from '../../../business/types';

import s from './CustomTooltip.module.scss';

export type CustomTooltipProps = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomTooltip = ({active, payload, contentStyle, project}: any) => {
    const {sourceData} = project as Project;

    if (active && payload && payload.length) {
        const plans = sourceData.plans.reduce((acc, plan) => {
            // eslint-disable-next-line no-param-reassign
            acc[plan.id] = {...plan};
            return acc;
        }, {} as Record<string, Plan>);
        const products = sourceData.products.reduce((acc, product) => {
            // eslint-disable-next-line no-param-reassign
            acc[product.id] = {...product};
            return acc;
        }, {} as Record<string, Product>);

        return (
            <div className={s['custom-tooltip']} style={{...contentStyle, padding: 15}}>
                {payload.map((pl: Record<string, string>, index: number) => {
                    const labelParts = `${pl.name}`.split('.');
                    const newLabel = labelParts
                        .map((lp: string) => {
                            if (['byPlan', 'byProduct'].includes(lp)) {
                                return null;
                            }

                            if (plans[lp]) {
                                return plans[lp].name;
                            }
                            if (products[lp]) {
                                return products[lp].name;
                            }

                            return lp;
                        })
                        .filter(Boolean);

                    return (
                        <p
                            key={pl.name}
                            style={{color: pl.color}}
                            className={s.label}
                        >{`${newLabel.join(' ')} : ${numeral(payload[index].value).format(
                            '0.0a',
                        )}`}</p>
                    );
                })}
            </div>
        );
    }

    return null;
};
