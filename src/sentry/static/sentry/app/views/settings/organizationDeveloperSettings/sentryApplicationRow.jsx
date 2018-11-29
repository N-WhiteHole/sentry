import React from 'react';
import {Box, Flex} from 'grid-emotion';
import {Link} from 'react-router';
import Button from 'app/components/button';
import Confirm from 'app/components/confirm';
import SentryAppAvatar from 'app/components/avatar/sentryAppAvatar';
import PropTypes from 'prop-types';
import {PanelItem} from 'app/components/panels';
import {t} from 'app/locale';
import styled from 'react-emotion';
import space from 'app/styles/space';
import {withTheme} from 'emotion-theming';
import CircleIndicator from 'app/components/circleIndicator';

export default class SentryApplicationRow extends React.PureComponent {
  static propTypes = {
    app: PropTypes.object.isRequired,
    orgId: PropTypes.string.isRequired,
    installs: PropTypes.array,
    onInstall: PropTypes.func,
    onUninstall: PropTypes.func,
    showPublishStatus: PropTypes.bool,
  };

  static defaultProps = {
    showPublishStatus: false,
  };

  renderUninstall(install) {
    const message = (
      <React.Fragment>
        Are you sure you want to remove the {install.app.slug} installation ?
      </React.Fragment>
    );
    return (
      <Confirm
        message={message}
        priority="danger"
        onConfirm={() => this.props.onUninstall(install)}
      >
        <StyledButton borderless icon="icon-trash" data-test-id="sentry-app-uninstall">
          Remove
        </StyledButton>
      </Confirm>
    );
  }

  render() {
    let {app, orgId, installs, showPublishStatus} = this.props;
    const isInstalled = installs && installs.length > 0;

    return (
      <SentryAppItem>
        <StyledFlex>
          <SentryAppAvatar size={36} sentryApp={app} />
          <SentryAppBox>
            <SentryAppName>
              {showPublishStatus ? (
                <SentryAppLink to={`/settings/${orgId}/developer-settings/${app.slug}/`}>
                  {app.name}
                </SentryAppLink>
              ) : (
                app.name
              )}
            </SentryAppName>
            <SentryAppDetails>
              {showPublishStatus ? (
                <PublishStatus published={app.status === 'published'} />
              ) : (
                <React.Fragment>
                  <Status enabled={isInstalled} />
                  <StyledLink onClick={() => {}}>Learn More</StyledLink>
                </React.Fragment>
              )}
            </SentryAppDetails>
          </SentryAppBox>
          {!showPublishStatus ? (
            <Box>
              {!isInstalled ? (
                <Button
                  onClick={() => this.props.onInstall(app)}
                  size="small"
                  icon="icon-circle-add"
                  className="btn btn-default"
                >
                  {t('Install')}
                </Button>
              ) : (
                this.renderUninstall(installs[0])
              )}
            </Box>
          ) : (
            <Box>
              <Button
                icon="icon-trash"
                size="small"
                onClick={() => {}}
                className="btn btn-default"
              />
            </Box>
          )}
        </StyledFlex>
      </SentryAppItem>
    );
  }
}

const SentryAppItem = styled(PanelItem)`
  flex-direction: column;
  padding: 5px;
`;

const StyledFlex = styled(Flex)`
  justify-content: center;
  padding: 10px;
`;

const SentryAppBox = styled(Box)`
  padding-left: 15px;
  padding-right: 15px;
  flex: 1;
`;

const SentryAppDetails = styled(Flex)`
  align-items: center;
  margin-top: 6px;
  font-size: 0.8em;
`;

const SentryAppName = styled('div')`
  font-weight: bold;
`;

const StyledLink = styled(Link)`
  color: ${p => p.theme.gray2};
`;

const SentryAppLink = styled(Link)`
  color: ${props => props.theme.textColor};
`;

const StyledButton = styled(Button)`
  color: ${p => p.theme.gray2};
`;

const Status = styled(
  withTheme(({enabled, ...props}) => {
    return (
      <Flex align="center">
        <CircleIndicator
          size={6}
          color={enabled ? props.theme.success : props.theme.gray2}
        />
        <div {...props}>{enabled ? t('Installed') : t('Not Installed')}</div>
      </Flex>
    );
  })
)`
  color: ${props => (props.enabled ? props.theme.success : props.theme.gray2)};
  margin-left: ${space(0.5)};
  font-weight: light;
  &:after {
    content: '|';
    color: ${p => p.theme.gray1};
    margin-left: ${space(0.75)};
    font-weight: normal;
  }
  margin-right: ${space(0.75)};
`;

const PublishStatus = styled(
  withTheme(({published, ...props}) => {
    return (
      <Flex align="center">
        <div {...props}>{published ? t('published') : t('unpublished')}</div>
      </Flex>
    );
  })
)`
  color: ${props => (props.published ? props.theme.success : props.theme.gray2)};
  font-weight: light;
  margin-right: ${space(0.75)};
`;
