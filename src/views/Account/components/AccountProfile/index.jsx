import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Avatar, Typography, Button, LinearProgress } from '@material-ui/core';

// Shared components
import { Portlet, PortletContent, PortletFooter } from 'components';

import Gravatar from 'react-gravatar'
// Component styles
import styles from './styles';

class AccountProfile extends Component {
  render() {
    const { classes, className, ...rest } = this.props;
    const paterno = localStorage.getItem('paterno_usuario');
    const materno = localStorage.getItem('materno_usuario');
    const nombre = localStorage.getItem('nombre_usuario');
    const email = localStorage.getItem('email');

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletContent>
          <div className={classes.details}>
            <div className={classes.info}>
              <Typography variant="h2">{nombre}</Typography>
              <Typography
                className={classes.locationText}
                variant="body1"
              >
                {paterno} {materno}
              </Typography>
              <Typography
                className={classes.dateText}
                variant="body1"
              >
                {email}
              </Typography>
            </div>
            <Gravatar
              email={email ? email : 'test@gmail.com'}
              default= 'identicon'
              className={classes.avatar}
              size={150}
            />
          </div>
          {/* <div className={classes.progressWrapper}>
            <Typography variant="body1">Profile Completeness: 70%</Typography>
            <LinearProgress
              value={70}
              variant="determinate"
            />
          </div> */}
        </PortletContent>
        {/* <PortletFooter>
          <Button
            className={classes.uploadButton}
            color="primary"
            variant="text"
          >
            Upload picture
          </Button>
          <Button variant="text">Remove picture</Button>
        </PortletFooter> */}
      </Portlet>
    );
  }
}

AccountProfile.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AccountProfile);
