/* @flow */
import * as React from 'react';
import {
  StyleSheet,
  Animated,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Image,
  View,
  AsyncStorage,
  Text
} from 'react-native';
import { Form, Button,Container, Content, Item } from 'native-base';
import CustomInput from '../../componentes/Input';

import firebase from 'firebase';
import User from '../../User'

async function requestCameraAndAudioPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default class Index extends React.Component {

  static navigationOptions = {
    headerStyle: {height: 100}, 
    headerTitle: (
    <View style={{alignSelf:"center", flex:1}}>
      <Image style={{width:350,height:100, resizeMode:'center'}} source={require('../../assets/logo_web.png')}/>
    </View>
  ),
  };
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  this.state = {
    text: '',
    // email:'administrador@gmail.com',
    email:'a',
    password:'1234',
    hidePassword:true,
    };
  };

  componentDidMount(){
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(_ => {
        
      });
    }

    var firebaseConfig = {
      apiKey: "AIzaSyCaP3B-YzcYDn6iOKd5tuN9smJvoKxj1pY",
      authDomain: "dailyapp-7f10c.firebaseapp.com",
      databaseURL: "https://dailyapp-7f10c.firebaseio.com",
      projectId: "dailyapp-7f10c",
      storageBucket: "dailyapp-7f10c.appspot.com",
      messagingSenderId: "861234610321",
      appId: "1:861234610321:web:5754147d5627cf2d"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log("firebase on !");
    }  
  }

  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('user');

     };



  render() {



    return (
    <Container>  
      <View style={{height:6 ,position:"absolute", bottom:0,left:0, width:360, flexDirection:"row"}}>

      </View>
        <Content enableOnAndroid>
          <Form style={{paddingTop:10}}>
          <CustomInput  text="Email"
                        item={{stackedLabel:true}}
                        value={this.state.email}
                        textChange={(email)=>this.setState({email})}
                        focusColor={'#015d52'}
                        blurColor={'#015d52'}
          />
          <CustomInput  text="Contraseña"
                        item={{stackedLabel:true}} 
                        secureTextEntry={this.state.hidePassword}
                        value={this.state.password}
                        textChange={(password)=>this.setState({password})}
                        focusColor={'#015d52'}
                        blurColor={'silver'}              
                        visible={()=>this.setState({hidePassword:!this.state.hidePassword})} password 
          />
          </Form>

    
          {!this.state.isLoading?<Button style={{backgroundColor:"#015d52", marginTop:10, marginHorizontal:10 }} block onPress={this.login}>
            <Text style={{color: "white", paddingHorizontal:20 }}>ENTRAR</Text> 
          </Button>:null}

        </Content>
        <Item style={{position:'absolute',bottom:15,right:15}}>
            <Text style={{color:'rgb(24,60,95)'}} button onPress={() => this.openWorldLink()}>Open World Page</Text>
        </Item>
        <Item style={{position:'absolute',bottom:15,left:15}}>
            <Text>RIF:XXXXXXX-X</Text>
        </Item>
    </Container>
    );
  }

  login = async () => {

    fetch("https://api-open.herokuapp.com/login", {     
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },     
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      })    
    })
    .then((response) => response.json())
    .then((res) => {
  
    if (res.success === true && this.state.email == 'Admin' ||  this.state.email == 'admin') {

      AsyncStorage.setItem('token',res.data);
      AsyncStorage.setItem('userdata',JSON.stringify(res.user));
      AsyncStorage.setItem('user',res.id);

      fetch("https://api-open.herokuapp.com/secret", {
      method: "get",         
      headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":res.data},
      })
      .then((response) => response.json())
      .then((users) => { 

          AsyncStorage.setItem('list',JSON.stringify(users));
          this.props.navigation.navigate("admin");

         })

    } else if (res.success === true){

      AsyncStorage.setItem('token',res.data);
      AsyncStorage.setItem('userdata',JSON.stringify(res.user));
      AsyncStorage.setItem('user',res.id);
      User.phone = res.id;
      fetch("https://api-open.herokuapp.com/secret", {
        method: "get",         
        headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":res.data},
        })
        .then((response) => response.json())
        .then((users) => { 
            AsyncStorage.setItem('list',JSON.stringify(users));
            this.props.navigation.navigate("lista");
  
           })

      }
  })
  .catch(function(error) {
    console.log('Hubo un problema con la petición Fetch:' + error.message);

    // this.notLoading();
    ToastAndroid.show("datos incorrectos o problemas con el internet", ToastAndroid.SHORT);
  });
};


  openWorldLink = () => {
    WebBrowser.openBrowserAsync('http://openworldconsult.com.ve/');
  };


}

const styles = StyleSheet.create({
  colors: {
    backgroundColor: "#6200ee"
  },
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    flexDirection: 'column',
  },
  wrapper: {
    flex: 1,
  },
  inputContainerStyle: {
    margin: 8,
    flex: 2
  },
  buttonContainerStyle: {
    flex: 2
  },
  contenStyle : {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor:"blue",
  },
  centrar: {
   
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
});

