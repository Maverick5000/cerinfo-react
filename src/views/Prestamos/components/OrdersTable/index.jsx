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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

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
    nPrestamos: [],
    open: false,
    detalle_multa: '',
    estado_multa: '',
    monto_multa: '',
    selectedUser: '',
    selectedLibro: ''
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
    let url = '';
    if (tipo == 'Administrador') {
      url = 'https://cerinfo-api.herokuapp.com/prestamos';
    } else {
      url = `https://cerinfo-api.herokuapp.com/user/prestamos`;
    }
    this.setState({ isLoading: true });
    axios.get(url, { params: { usuario_id: id } }).then(res => {
      this.setState({ nPrestamos: res.data, isLoading: false });
    });
  }

  deletePrestamo(id) {
    const u_id = localStorage.getItem('id');
    let url = 'https://cerinfo-api.herokuapp.com/prestamos/';
    this.setState({ isLoading: true });
    axios.delete(url + id).then(res => {
      console.log(res);
      axios.get(url, { params: { usuario_id: u_id } }).then(res => {
        this.setState({ nPrestamos: res.data, isLoading: false });
      });
    });
  }

  crearMulta(data) {
    axios
      .post('https://cerinfo-api.herokuapp.com/multas', {
        usuario_id: data.selectedUser,
        libro_id: data.selectedLibro,
        detalle_multa: data.detalle_multa,
        estado_multa: data.estado_multa,
        monto_multa: data.monto_multa
      })
      .then(res => {
        console.log(res);
        this.handleClose();
      });
  }

  mapPrestamo = () => {
    const tipo = localStorage.getItem('tipo_usuario');
    const { classes } = this.props;
    const { nPrestamos } = this.state;
    let data = nPrestamos.map(prestamo => (
      <TableRow className={classes.tableRow} hover key={prestamo.id}>
        <TableCell className={classes.tablecell}>{prestamo.id}</TableCell>
        <TableCell className={classes.tablecell}>
          {prestamo.libro.titulo_libro}
        </TableCell>
        <TableCell className={classes.tablecell}>
          {moment(prestamo.fecha_prestamo).format('DD/MM/YYYY')}
        </TableCell>
        <TableCell className={classes.tablecell}>
          {moment(prestamo.fecha_devolucion).format('DD/MM/YYYY')}
        </TableCell>
        {tipo == 'Administrador' ? (
          <TableCell className={classes.tablecell}>
            {prestamo.usuario.nombre_usuario}
          </TableCell>
        ) : null}
        {tipo == 'Administrador' ? (
          <TableCell className={classes.tablecell}>
            {prestamo.usuario.registro_usuario}
          </TableCell>
        ) : null}
        {tipo == 'Administrador' ? (
          <TableCell className={classes.tablecell}>
            <Button
              color='primary'
              size='small'
              variant='outlined'
              type='button'
              onClick={() => {
                this.deletePrestamo(prestamo.id);
              }}>
              X
            </Button>
          </TableCell>
        ) : null}
        {tipo == 'Administrador' ? (
          <TableCell className={classes.tablecell}>
            <Button
              color='primary'
              size='small'
              variant='outlined'
              type='button'
              onClick={() => {
                this.handleClickOpen(prestamo.usuario.id, prestamo.libro.id);
              }}>
              Crear Multa
            </Button>
          </TableCell>
        ) : null}
      </TableRow>
    ));
    return data;
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillUnmount() {
    this.signal = false;
  }

  handleClickOpen = (selectedUser, selectedLibro) => {
    this.setState({
      open: true,
      selectedUser: selectedUser,
      selectedLibro: selectedLibro
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

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
          <PortletContent className={classes.portletContent} noPadding>
            {this.state.open ? (
              <Dialog
                fullWidth={'xl'}
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Crear Multa</DialogTitle>
                <DialogContent
                  style={{ display: 'flex', flexDirection: 'column' }}>
                  <DialogContentText>Crear nueva multa</DialogContentText>
                  <TextField
                    onChange={this.handleChange.bind(this)}
                    name={'monto_multa'}
                    autoFocus
                    margin='dense'
                    id='monto_multa'
                    label='Monto'
                    type='number'
                    fullWidth
                  />
                  <TextField
                    name={'detalle_multa'}
                    onChange={this.handleChange.bind(this)}
                    margin='dense'
                    id='detalle_multa'
                    label='Detalle'
                    type='text'
                    fullWidth
                  />
                  <TextField
                    name={'estado_multa'}
                    onChange={this.handleChange.bind(this)}
                    margin='dense'
                    id='estado_multa'
                    label='Estado'
                    type='text'
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    type={'button'}
                    onClick={this.handleClose}
                    color='primary'>
                    Cancelar
                  </Button>
                  <Button
                    type={'button'}
                    onClick={() => {
                      this.crearMulta(this.state);
                    }}
                    color='primary'>
                    Crear
                  </Button>
                </DialogActions>
              </Dialog>
            ) : null}
            {isLoading && (
              <div className={classes.progressWrapper}>
                <CircularProgress />
              </div>
            )}
            {showOrders && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tablecell}>
                      ID Prestamo
                    </TableCell>
                    <TableCell className={classes.tablecell} align='left'>
                      Libro
                    </TableCell>
                    <TableCell className={classes.tablecell} align='left'>
                      {' '}
                      Fecha Prestamo{' '}
                    </TableCell>
                    <TableCell className={classes.tablecell} align='left'>
                      Fecha Devolucion
                    </TableCell>
                    {tipo == 'Administrador' ? (
                      <TableCell align='left'>Usuario</TableCell>
                    ) : null}
                    {tipo == 'Administrador' ? (
                      <TableCell align='left'>Registro de usuario</TableCell>
                    ) : null}
                    {tipo == 'Administrador' ? (
                      <TableCell align='left'>Dar de baja</TableCell>
                    ) : null}
                    {tipo == 'Administrador' ? (
                      <TableCell align='left'>Crear Multa</TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>{this.mapPrestamo()}</TableBody>
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
