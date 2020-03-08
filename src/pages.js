/* @flow */
import PageView from './page/index';
import AgoraView from './page/agora';
import AdminView from './page/admin';
import ListaView from './page/lista';
import CrearView from './page/crear';
import VistaView from './page/vista';
import ChatList from './page/chat';
import CambiarView from './page/cambiar';

export const routesMap = {

  index: PageView,
  agora: AgoraView,
  admin: AdminView,
  lista: ListaView,
  crear: CrearView,
  vista: VistaView,
  chat:  ChatList,
  cambiar:CambiarView
};

export default PageView;