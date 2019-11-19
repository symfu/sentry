import React from 'react';
import styled from 'react-emotion';
import {Link} from 'react-router';

import AsyncComponent from 'app/components/asyncComponent';
import space from 'app/styles/space';
import {Panel, PanelBody, PanelItem, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';
import Pagination from 'app/components/pagination';

const Layout = styled('div')`
  display: grid;
  grid-template-columns: 5fr 1fr 1fr 1fr 1fr;
  grid-column-gap: ${space(1.5)};
  width: 100%;
  align-items: center;
  grid-template-areas: 'transaction-name errors rpm p95 p99';

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    grid-template-columns: 5fr 1fr;
    grid-template-areas: 'project-name errors';
  }
`;

const TransactionColumn = styled('div')`
  grid-area: transaction-name;
  overflow: hidden;
`;
const P95Column = styled('div')`
  grid-area: p95;
  text-align: right;

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    display: none;
  }
`;
const P99Column = styled('div')`
  grid-area: p99;
  text-align: right;

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    display: none;
  }
`;
const RpmColumn = styled('div')`
  grid-area: rpm;
  text-align: right;

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    display: none;
  }
`;
const ErrorsColumn = styled('div')`
  grid-area: errors;
  text-align: right;
`;

export default class ProjectStats extends AsyncComponent {
  getEndpoints() {
    const {organization, project} = this.props;
    return [
      [
        'transactionList',
        `/organizations/${organization.slug}/eventsv2/?project=${
          project.id
        }&statsPeriod=14d&field=transaction&field=count(id)&field=p75&field=p95&sort=-p95&per_page=50&query=event.type%3Atransaction`,
      ],
    ];
  }
  renderStreamBody() {
    const {organization, project} = this.props;
    return this.state.transactionList.data.map(row => {
      return (
        <PanelItem key={row.transaction}>
          <Layout>
            <TransactionColumn>
              <Link
                to={`/organizations/${organization.slug}/performance/${
                  project.slug
                }/transactions/${row.transaction}`}
              >
                {row.transaction}
              </Link>
            </TransactionColumn>
            <ErrorsColumn>-</ErrorsColumn>
            <RpmColumn>{row.count_id}</RpmColumn>
            <P95Column>{row.p75}</P95Column>
            <P99Column>{row.p95}</P99Column>
          </Layout>
        </PanelItem>
      );
    });
  }

  renderBody() {
    return (
      <React.Fragment>
        <Panel>
          <PanelHeader>
            <Layout>
              <TransactionColumn>{t('Transaction')}</TransactionColumn>
              <ErrorsColumn>{t('Errors')}</ErrorsColumn>
              <RpmColumn>{t('RPM')}</RpmColumn>
              <P95Column>{t('p75')}</P95Column>
              <P99Column>{t('p95')}</P99Column>
            </Layout>
          </PanelHeader>
          <PanelBody>{this.renderStreamBody()}</PanelBody>
        </Panel>
        <Pagination pageLinks={this.state.transactionListPageLinks} />
      </React.Fragment>
    );
  }
}
