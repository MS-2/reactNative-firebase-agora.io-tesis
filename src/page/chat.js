import React from 'react';
import { StyleSheet, Text, TextInput, View, AsyncStorage, Alert, Modal, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Container, Content } from 'native-base';
import { Header, Icon } from 'react-native-elements'
import {ToastAndroid} from 'react-native';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { HeaderBackButton } from 'react-navigation-stack';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

YellowBox.ignoreWarnings(['Warning: Cant perform a React state update on an unmounted component' ]);

// this.socket.emit("chat message", (this.state.n.replace(/['"]+/g, ''))+':'+this.state.chatMessage); uitar comillas

export default class Chat extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    messages: [],
    chatMessage: null,
    contador: this.props.navigation.getParam('contador', false),
    s: this.props.navigation.getParam('soc', ''),
    socket: this.props.navigation.getParam('socket',''),
    nombre: null,
    // mensajesLocal: [],
    NuevoMensaje: [],
    date: '',
  }

  mensajes = () => {

    fetch("https://api-open.herokuapp.com/mensajes", {     
      method: "get",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }   
    })
    .then((response) => response.json())
    .then((res) => {
      this.setState({mensajesLocal: res});
      // AsyncStorage.setItem('salacomun',JSON.stringify(res)); 
  })
  .catch(function(error) {
    console.log('Hubo un problema con la petición Fetch:' + error.message);
    alert("problemas1");
  });
};

  cargardatos = async () => {
    try {
      const value = await AsyncStorage.getItem('userdata'); //el value es un STRINGGGGGGGG  
      const m2 = await AsyncStorage.getItem('salacomun'); //el value es un STRINGGGGGGGG        
      if (value !== null) {
        this.setState({objetoUsuario : value });
        this.setState({nombre : JSON.parse(value).nombre });
        // this.setState({mensajesLocal :  JSON.parse(m2)});
      }

    } catch (error) {
      alert("error aqui");
    }
  };

  socketfuncion = ()=>{
    this.state.socket.on("chat message", (msg, sender) =>{
   
      this.setState({ messages: [...this.state.messages, ...[{"message":msg, "sender":sender }]] });
      // let prueba = this.state.mensajesLocal.concat(...this.state.messages);
      // this.setState({NuevoMensaje : prueba });
      // AsyncStorage.setItem('todochat', JSON.stringify(this.state.NuevoMensaje));

    });  
  }

  componentDidMount(){

    this.setState({contador: false});
    
    this.obtenerFecha();
    // this.mensajes();

    // this.cargardatos();

    this.socketfuncion();

    this.cargardatos();


  }

  obtenerFecha =()=>{
    var that = this;
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear().toString().substr(-2); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    min = min > 9 ? min : '0' + min;
    that.setState({ date: date + '/' + month + '/' + year + '/' + hours + ':' + min }); 
    // that.setState({ date: date + '/' + month + '/' + hours + ':' + min }); 
  }


  submitChatMessage(){
    if (this.state.chatMessage !== '') {
        this.state.socket.emit("chat message",this.state.chatMessage,this.state.nombre );
        this.setState({chatMessage: ''});  
  } else
    return;
  }

  borrarchat = () => {
    Alert.alert(
      'Eliminar conversacion',
      'Desea eliminar el historial del chat, afectara solo tu chat?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () =>{ this.borrarbd(); this.borrar()}},
      ],
      { cancelable: false });
      return true;
  }

  borrar(){
      this.state.mensajesLocal = [];
      this.setState({NuevoMensaje:[], mensajesLocal:[], messages:[]});
      AsyncStorage.removeItem('salacomun');
  }

  borrarbd=()=>{
    fetch("https://api-open.herokuapp.com/vaciar", {     
      method: "get",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }   
    })
    .then((response) => response.json())
    .then((res) => {


  })
  .catch(function(error) {
    console.log('Hubo un problema con la petición Fetch:' + error.message);
    alert("problemas2");
  });

  }

  render(){

    const itemId = this.props.navigation.getParam('nombre', 'NO-default');

    // const test = this.state.NuevoMensaje.filter(chatMessage => chatMessage.m !== null || chatMessage.m !== undefined);
    const chatMessages =  this.state.messages.map((chatMessage, index) =>     
        <View key={index} style={{flexDirection: "row", width:'90%', backgroundColor:'#00897b', marginBottom:10, borderRadius:7}}>

   
          <Text style={{fontSize:16}}>{chatMessage.sender} : </Text>
          <Text style={{color: '#fff', padding:7, fontSize:16}}>{chatMessage.message}</Text>
          <Text style={{position:"absolute", color: '#eee', fontSize:12, left:230}}>{this.state.date}</Text>
         

        </View>
      );
{/* behavior="padding" */}
    return (
      <Container>
        <KeyboardAvoidingView style={styles.container} enabled> 

          <Header   containerStyle={{backgroundColor: 'rgb(24,60,95)', height:100}}
                    placement="left"
                    leftComponent={<HeaderBackButton tintColor="white" onPress={() => this.props.navigation.goBack()} />}
                    centerComponent={{text: itemId,  style: { color: 'white' }, onPress: () => this.borrarchat()  }}
                    rightComponent={               <TouchableOpacity 
                      style={styles.botonllamar} 
                      onPress={() =>
                      this.props.navigation.navigate("agora", {channelName: 'todos', onCancel: (message) => {
                              this.setState({
                                visible: true,
                                message
                              });
                            }
                          }
                        )
                      }
                      >
                      <Icon name='call' color='green' size={30}></Icon>
                      </TouchableOpacity>}
          />
          <Content style={styles.overlay} ref={c => (this.component = c)}>
          {chatMessages}
          <View style={{position:'relative', backgroundColor: 'transparent', height:70 }}></View>
          </Content>

          <View style={{position:"relative", bottom: 0, flexDirection:'row',  alignItems: "center", marginHorizontal:5,}}>
            <TextInput  maxLength={100}
                        autoCorrect={true} 
                        style={styles.input} value={this.state.mensaje} 
                        placeholder='escriba su mensaje...' 
                        value={this.state.chatMessage}
                        onChangeText={chatMessage => this.setState({ chatMessage })}
                        >
            </TextInput>
          <TouchableOpacity style={styles.btnText} onPress={()=>{this.submitChatMessage();this.component._root.scrollToEnd();} }><Icon name='send' color='white'></Icon></TouchableOpacity>
 
        </View>   
        
      </KeyboardAvoidingView>
    </Container>
    );
  }
}
const styles = StyleSheet.create({
  
  container: {
    flex: 1
  },

  btnText:{
    padding:10,
    width: 42,
    height: 42,
    borderRadius: 42/2,
    backgroundColor: '#00897b'
  },

  input:{
    width:'85%',
  },

  overlay: {
    position:"relative",
    width: '100%',
    height:220,
    backgroundColor: 'bisque',
  },

});









