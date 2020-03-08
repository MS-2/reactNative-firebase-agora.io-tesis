import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert, Modal, TouchableOpacity, ToastAndroid, BackHandler, Image, SafeAreaView, FlatList } from 'react-native';
import {Container, Content, Item, Input,CardItem, Card, Left, Thumbnail, Body, Right, ListItem } from 'native-base';
import { Header, Icon, Divider  } from 'react-native-elements';
import io from 'socket.io-client';
import ImagePicker from 'react-native-image-picker';

import User from '../../User'
import firebase from 'firebase';

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

YellowBox.ignoreWarnings(['Warning: Cant perform a React state update on an unmounted component' ]);

export default class Lista extends React.Component {

    static navigationOptions = {
        header: null,
        headerVisible: false,
      };
    constructor(props) {
      super(props);
      this.state = { 
        modalVisible: false,
        list2: [],            //lista devuelta de socket
        objetoUsuario: null,  //realmente recibira es un string TODOS los datos del users
        nombre: null,         //nombre del usuario
        socket: null,         //id del socket del usuario
        id: null,            //id del usuario en mongo
        CON: null,          //unica conexion socket
        online: null,        //numero de usuarios conectados
        avatarSource: 'https://solhub.com.br/img/user.jpg',
        foto: 'https://solhub.com.br/img/user.jpg',
        contador: null,
        contador2: null,
        users : []        //usuarios lista
      };
    };

    
    _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('userdata'); //el value es un puto STRINGGGGGGGG
        if (value !== null) {
          this.setState({objetoUsuario : value });
          this.setState({nombre : JSON.parse(value).nombre });
          this.setState({id : JSON.parse(value)._id });
          this.socket.emit('user',{nombre:this.state.nombre, id:this.state.id});
        }
      } catch (error) {
        alert("error");
      }
    };

    salir = async() => {
      AsyncStorage.removeItem('userdata');
      this.socket.close();
      this.props.navigation.navigate('index');
    }

    componentDidMount(){

      let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val) => {

          let person = val.val();
          person.phone = val.key;
          if (person.phone == User.phone)
          {
            User.name = person.name
          } 
          else  
          {
            this.setState((prevState) =>{ 
                    return { users: [...prevState.users, person] }
                    })
          }
        }
      )
      this._retrieveData();
      this.usersonline();
      BackHandler.addEventListener('hardwareBackPress', this.backPressed);
      console.disableYellowBox = true;

      this.socket.on('chat message', (m)=> {
        let istrue=this.state.contador;
        let contador=!istrue;
        if (!contador) {
          this.setState({contador});
        }    
          // ToastAndroid.show("el usuario en lista " + " te escribio un mensaje", ToastAndroid.SHORT);
      }); 
      
      

  }

    renderRow = ({item}) =>{
      var base64 = 'data:image/png;base64,';
      var a;
      if (!item.photo) {
        a =  'https://solhub.com.br/img/user.jpg';
      }else{
        a = base64 + item.photo;
      }
      return(
          <Card>
            <CardItem header button onPress={()=> {this.setState({contador2 : true});this.props.navigation.navigate('vista',item,{contador2:this.state.contador2});}}>
            <Left>
          <Thumbnail  source={{uri:a}} />
          <Body>
            <Text >{item.name}</Text>
            {this.state.contador2 ? true : <Icon name="message" color='red'></Icon>   }
          </Body>
        </Left>
        <Right>
          <View style={{alignItems:"center", justifyContent:"center", flexDirection: "row"}}>
            <TouchableOpacity 
            style={styles.botonllamar} 
            onPress={() =>this.props.navigation.navigate("agora", 
                {
                  channelName: item.name,
                  onCancel: (message) => {
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
            </TouchableOpacity>
          </View>
        </Right>     
      </CardItem>
      </Card>     
      )
    }

    componentWillUnmount() {
      BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

     backPressed = () => {
      Alert.alert(
        'Dejar App',
        'Desea salir de la aplicacion?',
        [
          {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Yes', onPress: () => {this.salir(); BackHandler.exitApp();}},
        ],
        { cancelable: false });
        return true;
    }

     usersonline=()=>{
      this.socket = io('https://api-open.herokuapp.com');      
      this.setState({CON: this.socket});
      this.socket.on('connectedUsers', onlineUsers => {  
        this.setState({online:onlineUsers.length});
        this.setState({list2:onlineUsers});
          var i = 0;
          while (i < this.state.list2.length) {
              if (this.state.list2[i].socket == this.socket.id) {
                  this.setState({socket:this.socket.id});
                  break;
              }
              i++;
          }
        this.state.list2.splice(i, 1);     
        }
      );
     }



  setModalVisible(visible) {
    this.setState({     
      modalVisible: visible, 
    });  
  }

  selectorImage = async () => {

    ImagePicker.showImagePicker({noData:false, mediaType:'photo', quality: 0.1}, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        alert('foto de perfil cancelada');
      } else {
        firebase.database().ref('users/'+User.phone).update({photo:response.data});
        this.setState({
          avatarSource: response.uri
        });

      }
    });


  }



      render(){
        // name='add-a-photo'
        var temp = '';
        if (this.state.avatarSource === 'https://solhub.com.br/img/user.jpg') {
          temp = 'add-a-photo';
        }
        return (
        <Container>  
          <Content style={{paddingBottom:50}} >
          <Header   containerStyle={{backgroundColor: '#015d52', height:100}}
                    placement="left"
                    centerComponent={{text: 'conectados : '+this.state.online,  style: { color: 'white' } }}
                    rightComponent={{ icon: 'person', color: '#fff', onPress: () => this.setModalVisible(true) }}
            />
            <Card style={{backgroundColor:'red', borderRadius:14, marginHorizontal:10}}>
            <CardItem header button onPress={() => { this.setState({contador : true});this.props.navigation.navigate('chat',{socket: this.state.CON, contador: this.state.contador})}}>
              <Left>
                <Body style={{flexDirection:"row"}}>
                  <Text >chat comun </Text><Icon name="group"></Icon>   
     {this.state.contador ? false : <Icon name="message" color='red'></Icon>   }
                </Body>
              </Left>
              <Right>
                <View style={{alignItems:"center", justifyContent:"center", flexDirection: "row"}}>
                  <TouchableOpacity 
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
                  </TouchableOpacity>

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
                        <Image style={styles.avatar} source={{uri: this.state.avatarSource}}></Image>
                        <Icon name={temp} color='grey' onPress={() => {this.selectorImage()}}></Icon>
                        <View style={styles.body}>
                          <View style={styles.bodyContent}>
                            <Text style={styles.name}>{this.state.nombre} </Text>
                            <Text style={styles.info}>{this.state.socket} / </Text>
                            <Text style={styles.info}>{this.state.id}</Text>          
                            <TouchableOpacity style={styles.buttonContainer} onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                              <Text>Volver</Text> 
                            </TouchableOpacity>   
                            <TouchableOpacity style={styles.buttonContainer} onPress={()=>{this.setModalVisible(!this.state.modalVisible); this.props.navigation.navigate("cambiar", {id:this.state.id});}}>
                              <Text>cambiar contraseña</Text>  
                            </TouchableOpacity>              
                            <TouchableOpacity style={styles.buttonContainer} onPress={() => {this.setModalVisible(!this.state.modalVisible); this.salir();}}>
                              <Text style={{color:'red'}}>salir App</Text> 
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </Right>     
            </CardItem>
            </Card>
            {/* <Button onPress={() => this.backPressed()}><Text>refresh</Text></Button> */}
       

          </Content>
          <ListItem itemDivider style={{height: 12, backgroundColor: '#015d52'}}>
              <Text style={{alignItems:"center", fontSize:14, fontWeight:"bold", color:'white' }}>lista de usuarios:</Text>
            </ListItem> 
   
              <FlatList data={this.state.users} renderItem={this.renderRow} keyExtractor={(item)=>item.phone}>

              </FlatList>

        </Container>  
             
        );

      }
   
    }
  
  const styles = StyleSheet.create({
    adduser: {
      alignItems: "flex-start",
      justifyContent: 'flex-start',
      alignSelf: 'flex-start'    
    },

    input:  {
      padding: 10, 
      borderWidth: 1,
      width:'85%',
      borderColor: 'black',
      marginBottom: 10,
      borderRadius: 5,
    },

    botonllamar:  {
      height:42,
      width:42,
      borderRadius: 42/2,
      borderWidth:1,
      padding:5
    },

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
      marginTop:7,
      height:40,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width:250,
      borderRadius:30,
      backgroundColor: "silver",
    },

  });
  
  