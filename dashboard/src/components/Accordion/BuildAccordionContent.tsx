import { MdFolderOpen } from 'react-icons/md';

import { useMemo, useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import { useNavigate, useParams } from '@tanstack/react-router';

import {
  AccordionItemBuilds,
  BuildCountsResponse,
} from '@/types/tree/TreeDetails';

import { useBuildStatusCount } from '@/api/TreeDetails';

import StatusChartMemoized, {
  Colors,
  IStatusChart,
} from '../StatusChart/StatusCharts';

import LinksGroup from '../LinkGroup/LinkGroup';

import { Button } from '../ui/button';

import QuerySwitcher from '../QuerySwitcher/QuerySwitcher';

import { IAccordionItems } from './Accordion';

export interface IBuildAccordionContent {
  testStatus: {
    failTests: number;
    errorTests: number;
    passTests: number;
    skipTests: number;
  };
  kernelImage?: string;
  buildLogs?: string;
  kernelConfig?: string;
  dtb?: string;
  systemMap?: string;
  modules?: string;
}

export interface ILinksGroup {
  kernelImage?: string;
  buildLogs?: string;
  kernelConfig?: string;
  dtb?: string;
  systemMap?: string;
  modules?: string;
}

const blueText = 'text-blue';

const AccordBuildStatusChart = ({
  buildCountsData,
}: {
  buildCountsData: BuildCountsResponse;
}): JSX.Element => {
  const { build_counts } = buildCountsData;

  const chartElements: IStatusChart['elements'] = useMemo(() => {
    return [
      {
        value: build_counts.pass_tests ?? 0,
        label: 'buildAccordion.testSuccess',
        color: Colors.Green,
      },
      {
        value: build_counts.error_tests ?? 0,
        label: 'buildAccordion.testError',
        color: Colors.Red,
      },
      {
        value: build_counts.skip_tests ?? 0,
        label: 'buildAccordion.testSkipped',
        color: Colors.DimGray,
      },
      {
        value: build_counts.miss_tests ?? 0,
        label: 'buildAccordion.testMiss',
        color: Colors.Gray,
      },
      {
        value: build_counts.fail_tests ?? 0,
        label: 'buildAccordion.testFail',
        color: Colors.Yellow,
      },
      {
        value: build_counts.done_tests ?? 0,
        label: 'buildAccordion.testDone',
        color: Colors.Blue,
      },
    ];
  }, [
    build_counts.done_tests,
    build_counts.error_tests,
    build_counts.fail_tests,
    build_counts.miss_tests,
    build_counts.pass_tests,
    build_counts.skip_tests,
  ]);

  return (
    <>
      {chartElements.some(slice => slice.value > 0) && (
        <div className="min-w-[400px]">
          <StatusChartMemoized
            type="chart"
            title={<FormattedMessage id="buildAccordion.testStatus" />}
            elements={chartElements}
          />
        </div>
      )}
    </>
  );
};

const AccordionBuildContent = ({
  accordionData,
}: IAccordionItems): JSX.Element => {
  const { treeId } = useParams({ from: '/tree/$treeId/' });

  //TODO: Fix the typing for not using as
  const contentData = accordionData as AccordionItemBuilds;

  const { data, status } = useBuildStatusCount(
    { buildId: contentData.id ?? '' },
    { enabled: !!contentData.id },
  );

  const navigate = useNavigate({ from: '/tree/$treeId' });

  const navigateToBuildDetails = useCallback(() => {
    navigate({
      to: `/tree/${treeId}/build/${contentData.id}`,
      params: { treeId },
      search: prev => prev,
    });
  }, [contentData.id, navigate, treeId]);

  const links = useMemo(
    () => [
      contentData.kernelImage
        ? {
            title: <FormattedMessage id="buildAccordion.kernelImage" />,
            icon: <MdFolderOpen className={blueText} />,
            linkText: <span>{`kernel/${contentData.kernelImage}`}</span>,
          }
        : undefined,
      contentData.kernelConfig
        ? {
            title: <FormattedMessage id="buildAccordion.kernelConfig" />,
            icon: <MdFolderOpen className={blueText} />,
            link: contentData.kernelConfig,
            linkText: <FormattedMessage id="buildAccordion.kernelConfigPath" />,
          }
        : undefined,
      contentData.dtb
        ? {
            title: <FormattedMessage id="buildAccordion.dtb" />,
            icon: <MdFolderOpen className={blueText} />,
            link: contentData.dtb,
            linkText: <FormattedMessage id="buildAccordion.dtbs" />,
          }
        : undefined,
      contentData.buildLogs
        ? {
            title: <FormattedMessage id="buildAccordion.buildLogs" />,
            icon: <MdFolderOpen className={blueText} />,
            link: contentData.buildLogs,
            linkText: <FormattedMessage id="buildAccordion.logs" />,
          }
        : undefined,
      contentData.systemMap
        ? {
            title: <FormattedMessage id="buildAccordion.systemMap" />,
            icon: <MdFolderOpen className={blueText} />,
            link: contentData.systemMap,
            linkText: <FormattedMessage id="buildAccordion.systemMapPath" />,
          }
        : undefined,
      contentData.modules
        ? {
            title: <FormattedMessage id="buildAccordion.modules" />,
            icon: <MdFolderOpen className={blueText} />,
            link: contentData.modules,
            linkText: <FormattedMessage id="buildAccordion.modulesZip" />,
          }
        : undefined,
    ],
    [
      contentData.buildLogs,
      contentData.dtb,
      contentData.kernelConfig,
      contentData.kernelImage,
      contentData.modules,
      contentData.systemMap,
    ],
  );

  return (
    <>
      <div className="flex flex-row justify-between">
        <QuerySwitcher data={data} status={status} skeletonClassname="h-[60px]">
          {data && <AccordBuildStatusChart buildCountsData={data} />}
        </QuerySwitcher>
        <div className="flex flex-col gap-8">
          <LinksGroup links={links} />
          <Button
            variant="outline"
            className="w-min rounded-full border-2 border-black text-sm text-dimGray hover:bg-mediumGray"
            onClick={navigateToBuildDetails}
          >
            <FormattedMessage id="buildAccordion.showMore" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default AccordionBuildContent;
