import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import styled from 'react-emotion';

import space from 'app/styles/space';

import GlobalSelectionHeader from 'app/components/organizations/globalSelectionHeader';
import withGlobalSelection from 'app/utils/withGlobalSelection';
import withOrganization from 'app/utils/withOrganization';
import withTeamsForUser from 'app/utils/withTeamsForUser';
import AsyncView from 'app/views/asyncView';
import SentryTypes from 'app/sentryTypes';
import NoProjectMessage from 'app/components/noProjectMessage';
import PageHeading from 'app/components/pageHeading';
import Pagination from 'app/components/pagination';
import {PageContent, PageHeader} from 'app/styles/organization';
import {Panel, PanelBody, PanelItem, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';

const Layout = styled('div')`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  grid-column-gap: ${space(1.5)};
  width: 100%;
  align-items: center;
  grid-template-areas: 'project-name errors rpm p95 p99';

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    grid-template-columns: 5fr 1fr;
    grid-template-areas: 'project-name errors';
  }
`;

const ProjectColumn = styled('div')`
  grid-area: project-name;
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

class PerformanceContainer extends AsyncView {
  static propTypes = {
    organization: SentryTypes.Organization,
    teams: PropTypes.array,
  };

  getTitle() {
    return 'Performance';
  }

  renderStreamBody() {
    const {organization, teams} = this.props;
    return teams.map(team => {
      return team.projects.map(project => {
        return (
          <PanelItem key={project.slug}>
            <Layout>
              <ProjectColumn>
                <Link
                  to={`/organizations/${organization.slug}/performance/${project.slug}/`}
                >
                  {project.slug}
                </Link>
              </ProjectColumn>
              <ErrorsColumn>{t('Errors')}</ErrorsColumn>
              <RpmColumn>{t('RPM')}</RpmColumn>
              <P95Column>{t('p95')}</P95Column>
              <P99Column>{t('p99')}</P99Column>
            </Layout>
          </PanelItem>
        );
      });
    });
  }

  renderBody() {
    const {organization} = this.props;
    return (
      <React.Fragment>
        <GlobalSelectionHeader organization={organization} />
        <PageContent>
          <NoProjectMessage organization={organization}>
            <PageHeader>
              <PageHeading>{t('Performance')}</PageHeading>
            </PageHeader>
            <div>
              <Panel>
                <PanelHeader>
                  <Layout>
                    <ProjectColumn>{t('Project')}</ProjectColumn>
                    <ErrorsColumn>{t('Errors')}</ErrorsColumn>
                    <RpmColumn>{t('RPM')}</RpmColumn>
                    <P95Column>{t('p95')}</P95Column>
                    <P99Column>{t('p99')}</P99Column>
                  </Layout>
                </PanelHeader>
                <PanelBody>{this.renderStreamBody()}</PanelBody>
              </Panel>
              <Pagination pageLinks={this.state.releaseListPageLinks} />
            </div>
          </NoProjectMessage>
        </PageContent>
      </React.Fragment>
    );
  }
}

export default withGlobalSelection(
  withOrganization(withTeamsForUser(PerformanceContainer))
);
export {PerformanceContainer};
