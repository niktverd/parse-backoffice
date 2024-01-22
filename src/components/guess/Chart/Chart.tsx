import React, {useState} from 'react';

import {ChartMixed, Check, Pencil, TrashBin} from '@gravity-ui/icons';
import _, {flatten, omit, reverse, uniq, zip} from 'lodash';
import numeral from 'numeral';
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

import {Project} from '../../../business/types';
import {flattenObject} from '../../../business/utils';
import {OnProjectChangeArgs} from '../../../types/common';
import {Flex} from '../../Flex/Flex';
import {ParameterControls} from '../../ParameterControls/ParameterControls';
import {randomHex} from '../../utils/common';
import {CustomTooltip} from '../CustomTooltip/CustomTooltip';

import s from './Chart.module.scss';

type ReportType = {[key: string]: number | ReportType};

type ChartProps = {
    title?: string;
    description?: string;
    namePrefix: string;
    project: Project;
    reportData: ReportType[];
    previewOnly?: boolean;
    handleDeleteChart?: () => void;
    onChangeTitle?: (value: string) => void;
    onChangeDescription?: (value: string) => void;
    onChange: (event: OnProjectChangeArgs) => void;
};

export const Chart = ({
    reportData,
    project,
    previewOnly = false,
    handleDeleteChart,
    onChange,
    namePrefix,
}: ChartProps) => {
    const [graphHeight] = useState(300);
    const [editable, setEditable] = useState(false);
    const options = _.get(project, `${namePrefix}.options`) || {};

    const handleChange =
        !previewOnly && editable
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (event: any) => {
                  onChange(event);
              }
            : undefined;

    const dataKeys = [];
    const optionsEntries = (Object.entries(options) as unknown) as [string, string[]];
    for (const [__, optionArray] of optionsEntries) {
        const _dataKeys: string[] = [...dataKeys];
        for (const opt of optionArray) {
            for (const dk of _dataKeys) {
                dataKeys.push(`${dk}.${opt}`);
            }

            dataKeys.push(opt);
        }
    }

    const flatData = reportData.map((item) => flattenObject(omit(item, 'month')));
    const aok = flatData.map((item) => Object.keys(item));
    const ufaok = uniq(flatten(aok));
    const aor = ufaok.map((item) => item.split('.'));
    let maxLength = 3;
    aor.forEach((item) => {
        if (maxLength < item.length) {
            maxLength = item.length;
        }
    });
    const even = aor.map((item) => {
        while (item.length < maxLength) {
            item.unshift('');
        }

        return item;
    });
    const transposedFull = zip.apply(_, even) as string[][];
    const transposed = transposedFull.map((item) => uniq(item));
    const [params, ...restReversed] = reverse(transposed);
    const selectors = reverse(restReversed);

    return (
        <div className={s['chars-layout']}>
            <Flex className={s.header}>
                <Flex className={s['icon-container']}>
                    <ChartMixed width={36} height={36} />
                </Flex>
                <div className={s['input-container']}>
                    <input
                        type="text"
                        value={_.get(project, `${namePrefix}.title`)}
                        className={s.input}
                        onChange={handleChange}
                        disabled={!editable}
                        name={`${namePrefix}.title`}
                    />
                </div>
                {editable && handleDeleteChart ? (
                    <button className={s['button-container']} onClick={handleDeleteChart}>
                        <TrashBin />
                    </button>
                ) : null}
                {previewOnly ? null : (
                    <button
                        className={s['button-container']}
                        onClick={() => setEditable(!editable)}
                    >
                        {editable ? <Check /> : <Pencil />}
                    </button>
                )}
            </Flex>
            <div className={s['input-container']}>
                {editable ? (
                    <textarea
                        value={_.get(project, `${namePrefix}.description`)}
                        onChange={handleChange}
                        name={`${namePrefix}.description`}
                    />
                ) : (
                    <div className={s.textarea}>
                        {_.get(project, `${namePrefix}.description`) || '-'}
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height={graphHeight}>
                <LineChart
                    width={1000}
                    height={600}
                    data={flatData}
                    margin={{top: 5, right: 20, left: 10, bottom: 5}}
                >
                    <XAxis
                        dataKey="month"
                        type="category"
                        tick={true}
                        tickFormatter={(_value: string, index: number) =>
                            index % 2 ? (index + 1).toString() : ''
                        }
                    />
                    <YAxis tickFormatter={(value) => numeral(value).format('0a')} />

                    <Tooltip
                        trigger="hover"
                        contentStyle={{backgroundColor: 'rgb(0 0 0 / 0.7)'}}
                        content={<CustomTooltip project={project} />}
                    />
                    <CartesianGrid stroke="#050505aa" />
                    {uniq(dataKeys).map((dk) => {
                        return (
                            <Line
                                key={dk}
                                type="monotone"
                                dataKey={dk}
                                stroke={randomHex({min: 150})}
                                // yAxisId={0}
                            />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
            <div>
                {!previewOnly && editable
                    ? selectors.map((group, index) => {
                          return (
                              <div key={index} className={s['controls-group']}>
                                  {group.map((pc) => {
                                      if (!pc) {
                                          return null;
                                      }

                                      return (
                                          <ParameterControls
                                              key={pc}
                                              paramKey={pc}
                                              index={index}
                                              project={project}
                                              namePrefix={`${namePrefix}`}
                                              onChange={onChange}
                                          />
                                      );
                                  })}
                              </div>
                          );
                      })
                    : null}
            </div>
            <div className={s['controls-group']}>
                {!previewOnly && editable
                    ? params.map((pc) => (
                          <ParameterControls
                              key={pc}
                              paramKey={pc}
                              index={selectors.length}
                              project={project}
                              namePrefix={`${namePrefix}`}
                              onChange={onChange}
                          />
                      ))
                    : null}
            </div>
        </div>
    );
};
