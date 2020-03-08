import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert, Modal, TouchableOpacity, Image } from 'react-native';
import { Button,Container, Content, Item,CardItem , Card, Left, Thumbnail, Body, Right } from 'native-base';
import { Header, Icon, Avatar  } from 'react-native-elements'
import io from 'socket.io-client';

import User from '../../User'
import firebase from 'firebase';

export default class Admin extends React.Component {
  
  static navigationOptions = {
    header: null,
    headerVisible: false,
  };
    constructor(props) {
      super(props);
      this.state = { 
        id:'',
        token:'',
        modalVisible: false,
        name: '',
        apellido: '',
        email: '',
        ced: '',
        cel: '',
        list: [],
        CON: null,          //unica conexion socket
      };
    };

    setModalVisible(visible, name, apelli, email, ced, cel) {
      this.setState({     
        modalVisible: visible,
        name : name,
        apellido: apelli,
        email: email,
        ced: ced,
        cel: cel   
      });  
    }

    fire = () =>{
      AsyncStorage.getItem("list").then((value) => {
        this.setState({list: JSON.parse(value)});
      })
    }

    componentDidMount(){
      AsyncStorage.getItem("token").then((value) => {
        this.setState({token: value});
      })
      AsyncStorage.getItem("list").then((value) => {
        this.setState({list: JSON.parse(value)});
        this.socket = io('https://api-open.herokuapp.com');      
        this.setState({CON: this.socket});
      })
      this.renderUsuarios();

    }

    confirmarBorrar(id) {
      this.setState({id: id})
      Alert.alert(
        'Confirma seleccion',
        'al seleccionar YES se eliminara al usuario y toda su data de la base de datos, desea continuar?', 
        [
          { text: 'NO', style: 'cancel' }, { text: 'YES', onPress: () => this.eliminarUsuario(this.state.id) },
        ]
      );
    }

    eliminarUsuario(){
      fetch("https://api-open.herokuapp.com/delete", {     
        method: "delete",
        headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":this.state.token},    
        body: JSON.stringify({id:this.state.id}) 
      })
      .then((response) => response.json())
      .then((res) => {

      if (res.success === true) {

        firebase.database().ref('users').child(res.data._id).remove();
        firebase.database().ref('messages').child(res.data._id).remove();
       
        fetch("https://api-open.herokuapp.com/secret", {
        method: "get",         
        headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":this.state.token},
        })
        .then((response) => response.json())
        .then((users) => { 
          AsyncStorage.removeItem('list');
          AsyncStorage.setItem('list',JSON.stringify(users));
          this.fire();
          this.props.navigation.push("admin");
          })
        .catch(function(error) {
            console.log("err : "+error);
        });
      }
    })
    .catch(function(error) {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
      alert("no se pudo borrar el usuario");
    });
    };

    renderUsuarios =()=>{
      const lista = this.state.list.filter(admin => admin.nombre != "Admin");

      return  lista.map((usuario, index)=>{
        return (
        <Card key={index}>
        <CardItem header button onPress={() => {this.setModalVisible(true, usuario.nombre, usuario.apellido, usuario.email, usuario.cedula, usuario.celular)}}>
          <Left>
            <Thumbnail  source={{uri: 'https://solhub.com.br/img/user.jpg'}} />
            <Body>
              <Text>{usuario.nombre}</Text>
              <Text>{usuario.cargo}</Text>
            </Body>
          </Left> 
          <Right>
            <View style={{alignItems:"center", justifyContent:"center", flexDirection: "row", marginHorizontal:5, paddingHorizontal:5}}>
            <TouchableOpacity transparent style={{...styles.botonllamar, marginRight:10}} onPress={() =>this.props.navigation.navigate("agora", {
                channelName: usuario._id,
                onCancel: (message) => {
                  this.setState({
                    visible: true,
                    message
                  });
                }
              })}>
              <Icon name='call' color='green' size={30}></Icon>
            </TouchableOpacity>        
            <TouchableOpacity transparent style={{...styles.botonllamar, marginLeft:10}} onPress={()=>{this.confirmarBorrar(usuario._id)}}>
              <Icon name='delete' color='red' size={30} ></Icon>
            </TouchableOpacity>
            </View>
          </Right>
        </CardItem>
        </Card>
        )
      })
    }


    logout = async () => {
      
    }
 
  render(){

  
    return (
      <Container>  
          <Content >
          <Header containerStyle={{backgroundColor: '#015d52', height:100}}
                  placement="left"
                  leftComponent={{ text: 'SALIR', style: { color: 'red' }, onPress: () => this.props.navigation.navigate('index') }}
                  // centerComponent={{ text: 'refresh',  color: 'green' , onPress: () =>  this.fire() }}
                  rightComponent={{ icon: 'forward', color: '#fff', onPress: () => this.props.navigation.navigate('crear') }}
          />
          <View>
            {  this.renderUsuarios() }
            <Modal 
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <View style={styles.overlay}>
              <View style={styles.container}>
                <View style={styles.header}></View>
                  <Image style={styles.avatar} source={{uri: 'https://solhub.com.br/img/user.jpg'}}/>
                  <Icon name='add-a-photo' color='grey' onPress={() => {this.setModalVisible(!this.state.modalVisible)}}></Icon>
                  <View style={styles.body}>
                    <View style={styles.bodyContent}>
                      <Text style={styles.name}>{this.state.name} {this.state.apellido}</Text>
                      <Text style={styles.info}>{this.state.ced} / {this.state.cel}</Text>
                      <Text style={styles.info}>{this.state.email}</Text>
                      <Text style={styles.description}> Lorem ipsum dolor sit amet, saepe sapientem eu nam.</Text>           
                      <TouchableOpacity style={styles.buttonContainer} onPress={()=>{this.props.navigation.navigate('chat',{nombre: this.state.name, socket: this.state.CON}); this.setModalVisible(!this.state.modalVisible)}}>
                        <Text>Conversacion</Text>  
                      </TouchableOpacity>              
                      <TouchableOpacity style={styles.buttonContainer} onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                        <Text>Volver</Text> 
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </Content>
      </Container>
      );
    }
  }
  //   rgb(24,60,95) blue open marino
  //   rgb(8,174,146) verde open mas oscuro
  const styles = StyleSheet.create({

    overlay: {
      position:"absolute",
      justifyContent:"center",
      alignItems:"center",
      width: 320,
      height:500,
      backgroundColor: 'rgba(149,214,198,0.9)',
      borderRadius: 14,
      top: 100,
      left:20
    },

    center: {
      alignItems: "center",
      justifyContent: 'center',
      alignSelf: 'center'   
    },

    form: { 
      backgroundColor: '#fff',
      alignItems: "center",
      justifyContent: "center",   
    },

    tx: {
      justifyContent:"center",
      color:'white',
      fontWeight:"bold",
      fontSize:18    
    },

    botonllamar:  {
      height:42,
      width:42,
      borderRadius: 42/2,
      borderWidth:1,
      padding:5
    },

    header: {
      backgroundColor: 'transparent',
      height:200,
    },

    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      borderColor: "white",
      marginBottom:10,
      alignSelf:'center',
      position: 'absolute',
      marginTop:130
    },

    name:{
      fontSize:22,
      color:"#FFFFFF",
      fontWeight:'600',
    },

    body:{
      marginTop:40,
    },

    bodyContent: {
      flex: 1,
      alignItems: 'center',
      padding:30,
    },
    name:{
      fontSize:24,
      color: "#696969",
      fontWeight: "500"
    },
    info:{
      fontSize:18,
      color: "#00BFFF",
      marginTop:10
    },
    description:{
      fontSize:16,
      color: "#696969",
      marginTop:10,
      textAlign: 'center'
    },
    buttonContainer: {
      marginTop:10,
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width:250,
      borderRadius:30,
      backgroundColor: "silver",
    },
  });
  
  