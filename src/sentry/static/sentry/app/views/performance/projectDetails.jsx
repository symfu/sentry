import React from 'react';

import GlobalSelectionHeader from 'app/components/organizations/globalSelectionHeader';
import withGlobalSelection from 'app/utils/withGlobalSelection';
import withOrganization from 'app/utils/withOrganization';
import AsyncView from 'app/views/asyncView';
import SentryTypes from 'app/sentryTypes';
import NoProjectMessage from 'app/components/noProjectMessage';
import PageHeading from 'app/components/pageHeading';
import {PageContent, PageHeader} from 'app/styles/organization';
import {t} from 'app/locale';

import ProjectStats from './projectStats';
import ProjectTransactions from './projectTransactions';

class PerformanceProjectDetails extends AsyncView {
  static propTypes = {
    organization: SentryTypes.Organization,
  };

  getEndpoints() {
    const {params} = this.props;
    return [['project', `/projects/${params.orgId}/${params.projectId}/`]];
  }

  getTitle() {
    return 'Performance';
  }

  renderBody() {
    const {organization} = this.props;
    const {project} = this.state;
    return (
      <React.Fragment>
        <GlobalSelectionHeader
          organization={organization}
          shouldForceProject
          forceProject={project}
        />
        <PageContent>
          <NoProjectMessage organization={organization}>
            <PageHeader>
              <PageHeading>{t('Project Overview')}</PageHeading>
            </PageHeader>
            <ProjectStats organization={organization} project={project} />
            <ProjectTransactions organization={organization} project={project} />
          </NoProjectMessage>
        </PageContent>
      </React.Fragment>
    );
  }
}

export default withGlobalSelection(withOrganization(PerformanceProjectDetails));
export {PerformanceProjectDetails};
