import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Axios
import axios from 'axios';

// Material components
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel
} from '@material-ui/core';

// Shared services
import { getOrders } from 'services/order';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent,
  Status
} from 'components';

// Component styles
import styles from './styles';

const statusColors = {
  delivered: 'success',
  pending: 'info',
  refund: 'danger'
};

class OrdersTable extends Component {
  signal = false;

  state = {
    isLoading: false,
    limit: 10,
    orders: [],
    ordersTotal: 0,
    nSolicitud: []
  };

  async getOrders(limit) {
    try {
      this.setState({ isLoading: true });

      const { orders, ordersTotal } = await getOrders(limit);

      if (this.signal) {
        this.setState({
          isLoading: false,
          orders,
          ordersTotal
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error
        });
      }
    }
  }

  componentDidMount() {
    this.signal = true;

    const { limit } = this.state;

    this.getOrders(limit);

    const id = localStorage.getItem('id');
    //const id = '1'
    const tipo = localStorage.getItem('tipo_usuario');
    let url = ''
    if (tipo == 'Administrador') {
      url = 'https://cerinfo-api.herokuapp.com/solicituds'
    } else {
      url = `https://cerinfo-api.herokuapp.com/user/solicituds`
    }

    axios.get(url, { params: { usuario_id: id } })
      .then(res => {
        this.setState({ nSolicitud: res.data });
      })
  }

  deleteSolicitud(id) {
    const u_id = localStorage.getItem('id');
    let url = 'https://cerinfo-api.herokuapp.com/solicituds/'
    this.setState({ isLoading: true });
    axios.delete(url + id)
      .then(res => {
        console.log(res)
        axios.get(url, { params: { usuario_id: u_id } })
          .then(res => {
            this.setState({ nSolicitud: res.data, isLoading: false });
          })
      })
  }

  componentWillUnmount() {
    this.signal = false;
  }

  render() {
    const { classes, className } = this.props;
    const { isLoading, orders, ordersTotal, nSolicitud } = this.state;
    const rootClassName = classNames(classes.root, className);
    const showOrders = !isLoading && orders.length > 0;
    const tipo = localStorage.getItem('tipo_usuario');

    return (
      <Portlet className={rootClassName}>
        {/* <PortletHeader noDivider>
          <PortletLabel
            subtitle={`${ordersTotal} in total`}
            title="Latest orders"
          />
          <PortletToolbar>
            <Button
              className={classes.newEntryButton}
              color="primary"
              size="small"
              variant="outlined"
            >
              New entry
            </Button>
          </PortletToolbar>
        </PortletHeader> */}
        <PerfectScrollbar>
          <PortletContent
            className={classes.portletContent}
            noPadding
          >
            {isLoading && (
              <div className={classes.progressWrapper}>
                <CircularProgress />
              </div>
            )}
            {showOrders && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tablecell}>ID Prestamo</TableCell>
                    <TableCell align="left">Libro</TableCell>
                    <TableCell align="left"> Fecha Solicitud </TableCell>
                    {tipo == 'Administrador' ? <TableCell align="left">Usuario</TableCell> : null}
                    {tipo == 'Administrador' ? <TableCell align="left">Registro de usuario</TableCell> : null}
                    {tipo == 'Administrador' ? <TableCell align="left">Dar de baja</TableCell> : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nSolicitud.map(solicitud => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={solicitud.id}
                    >
                      <TableCell className={classes.tablecell}>{solicitud.id}</TableCell>
                      <TableCell className={classes.tablecell}>
                        {solicitud.libro.titulo_libro}
                      </TableCell>
                      <TableCell className={classes.tablecell}>
                        {moment(solicitud.created_at).format('DD/MM/YYYY')}
                      </TableCell>
                      {tipo == 'Administrador' ? <TableCell className={classes.tablecell}>
                        {solicitud.usuario.nombre_usuario}
                      </TableCell> : null}
                      {tipo == 'Administrador' ? <TableCell className={classes.tablecell}>
                        {solicitud.usuario.registro_usuario}
                      </TableCell> : null}
                      {tipo == 'Administrador' ? <TableCell className={classes.tablecell}>
                        <Button
                          color="primary"
                          size="small"
                          variant="outlined"
                          type="button"
                          onClick={() => { this.deleteSolicitud(solicitud.id) }}
                        >
                          X
                        </Button>
                      </TableCell> : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </PortletContent>
        </PerfectScrollbar>
      </Portlet>
    );
  }
}

OrdersTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrdersTable);
