import React, {Component} from 'react';
import styled from 'react-emotion';

import space from 'app/styles/space';
import {Panel, PanelBody, PanelItem, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';

const Layout = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: ${space(1.5)};
  width: 100%;
  align-items: center;
  grid-template-areas: 'errors rpm p95 p99';
`;

const P95Column = styled('div')`
  grid-area: p95;
  text-align: center;
`;
const P99Column = styled('div')`
  grid-area: p99;
  text-align: center;
`;
const RpmColumn = styled('div')`
  grid-area: rpm;
  text-align: center;
`;
const ErrorsColumn = styled('div')`
  grid-area: errors;
  text-align: center;
`;

export default class ProjectStats extends Component {
  render() {
    return (
      <Layout>
        <ErrorsColumn>
          <Panel>
            <PanelHeader>{t('Errors')}</PanelHeader>
            <PanelBody>
              <PanelItem>1.56%</PanelItem>
            </PanelBody>
          </Panel>
        </ErrorsColumn>
        <RpmColumn>
          <Panel>
            <PanelHeader>{t('RPM')}</PanelHeader>
            <PanelBody>
              <PanelItem>1,631</PanelItem>
            </PanelBody>
          </Panel>
        </RpmColumn>
        <P95Column>
          <Panel>
            <PanelHeader>{t('p95')}</PanelHeader>
            <PanelBody>
              <PanelItem>534ms</PanelItem>
            </PanelBody>
          </Panel>
        </P95Column>
        <P99Column>
          <Panel>
            <PanelHeader>{t('p99')}</PanelHeader>
            <PanelBody>
              <PanelItem>3.7s</PanelItem>
            </PanelBody>
          </Panel>
        </P99Column>
      </Layout>
    );
  }
}
