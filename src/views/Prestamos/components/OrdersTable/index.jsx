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
    nPrestamos: []
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
    if (tipo == 'Administrador'){
      url = 'https://cerinfo-api.herokuapp.com/prestamos'
    } else {
      url = `https://cerinfo-api.herokuapp.com/user/prestamos`
    }

    axios.get(url, { params: { usuario_id: id } })
      .then(res => {
        this.setState({ nPrestamos: res.data });
      })
  }

  componentWillUnmount() {
    this.signal = false;
  }

  render() {
    const { classes, className } = this.props;
    const { isLoading, orders, ordersTotal, nPrestamos } = this.state;
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
                    <TableCell>ID Prestamo</TableCell>
                    <TableCell align="left">Libro</TableCell>
                    <TableCell align="left"> Fecha Prestamo </TableCell>
                    <TableCell align="left">Fecha Devolucion</TableCell>
                    {tipo == 'Administrador' ? <TableCell align="left">Usuario</TableCell> : null }
                    {tipo == 'Administrador' ? <TableCell align="left">Registro de usuario</TableCell> : null }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nPrestamos.map(prestamo => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={prestamo.id}
                    >
                      <TableCell>{prestamo.id}</TableCell>
                      <TableCell className={classes.customerCell}>
                        {prestamo.libro.titulo_libro}
                      </TableCell>
                      <TableCell>
                        {moment(prestamo.fecha_prestamo).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        {moment(prestamo.fecha_devolucion).format('DD/MM/YYYY')}
                      </TableCell>
                      {tipo == 'Administrador' ? <TableCell>
                        {prestamo.usuario.nombre_usuario}
                      </TableCell> : null }
                      {tipo == 'Administrador' ? <TableCell>
                        {prestamo.usuario.registro_usuario}
                      </TableCell> : null }
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
