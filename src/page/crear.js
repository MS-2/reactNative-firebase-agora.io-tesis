import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, KeyboardAvoidingView, TextInput  } from 'react-native';
import { Form, Toast, Button,Container, Content, Item, Title,Body, Card, Input, Label, ListItem, Picker, Row } from 'native-base';
import { Header, Icon } from 'react-native-elements'

import firebase from 'firebase';
import User from '../../User'

export default class Crear extends React.Component {

  static navigationOptions = {
    header: null,
  };
    constructor(props) {
      super(props);
      this.state = { 
        token: '',
        email:'',
        password:'1234',
        nombre:'',
        cargo:'',
        celular:'',
        cedula:'',
        apellido:'',
      };
    };

    componentDidMount(){
      AsyncStorage.getItem("token").then((value) => {
        this.setState({token: value});
    })
  }


  render(){
    return (
      <Container> 
         
        <Header  containerStyle={{backgroundColor: 'rgb(24,60,95)', height:100}}
        placement="left"
        leftComponent={{ text: 'Volver', style: { color: 'white' }, onPress: () => this.props.navigation.navigate('admin') }}
        />
      
        <Content enableOnAndroid style={{paddingHorizontal:25, marginTop:10}}>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Text style={{fontSize:24, fontWeight:"bold"}}>Registro de usuarios</Text>
        <View style={{marginTop:10, flexDirection: 'row'}}>
  
          <TextInput underlineColorAndroid={'black'} style={{marginRight:75}} placeholder='nombre de usuario' onChangeText={(nombre) => this.setState({nombre})} value={this.state.nombre} autoCompleteType='off' />
    
          <TextInput underlineColorAndroid={'black'}  placeholder='apellido familiar' onChangeText={(apellido) => this.setState({apellido})} value={this.state.apellido} autoCompleteType='off'/>
        </View>

          <TextInput underlineColorAndroid={'black'} style={{marginTop:10}} keyboardType={"email-address"} placeholder='email@ejemplo.com' onChangeText={(email) => this.setState({email})} value={this.state.email} autoCapitalize='none' maxLength={75}/>

          <TextInput underlineColorAndroid={'black'} style={{marginTop:10}} keyboardType={"numeric"} placeholder='cedula' onChangeText={(cedula) => this.setState({cedula})} value={this.state.cedula} maxLength={8} autoCapitalize='none'/>
      
          <TextInput underlineColorAndroid={'black'} style={{marginTop:10}} keyboardType={"numeric"} placeholder='numero de celular' onChangeText={(celular) => this.setState({celular})} value={this.state.celular} maxLength={11} autoCapitalize='none'/>   

          <Picker style={{ marginTop: 10 }} selectedValue={this.state.cargo} onValueChange={(itemValue) => this.setState({ cargo: itemValue })}>
            <Picker.Item label="seleccione tipo de cargo" value="" />
            <Picker.Item label="soldado raso" value="soldado" />
            <Picker.Item label="cabo" value="cabo" />
            <Picker.Item label="sargento" value="sargento" />
          </Picker>      

          <TextInput underlineColorAndroid={'black'} style={{marginTop:10}} placeholder='cargo' onChangeText={(cargo) => this.setState({cargo})} value={this.state.cargo} maxLength={40}/>

          <Item style={{marginTop:10}}>
            <Label>contraseña fija =></Label>
            <Input style={{borderRadius:4, borderColor:'gray'}} editable = {false} onChangeText={(password) => this.setState({password})} value={this.state.password}/>
          </Item>


        <Button block style={{ backgroundColor: "green", marginTop:10, marginHorizontal:10, marginBottom: 20, }} onPress={this.register}>
            <Text style={{color: "white", paddingHorizontal:10}}>REGISTRAR</Text> 
        </Button>
        </KeyboardAvoidingView> 
        </Content>
      
      
      </Container>
      );
    }

    register = () => {
  
        fetch("https://api-open.herokuapp.com/register", {     
          method: "post",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },     
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            cargo: this.state.cargo,
            cedula: this.state.cedula,
            celular: this.state.celular,
          })    
        })
        .then((response) => response.json())
        .then((res) => {
      
          if (res.success === true) {

            User.phone = res.user._id;
            firebase.database().ref('users/'+User.phone).set({name:res.user.nombre});

            fetch("https://api-open.herokuapp.com/secret", {
            method: "get",         
            headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":this.state.token},
            })
            .then((response) => response.json())
            .then((users) => { 


              AsyncStorage.removeItem('list');
              AsyncStorage.setItem('list',JSON.stringify(users));
              alert("usuario creado con exito");
              this.props.navigation.push("admin");
  
               })
            .catch(function(error) {
                console.log("err : "+error);
    
            });

    
          } else {
            alert("el correo ya esta registrado");
          }
  
      })
      .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
        alert("problema de conexion");
      });
    };


};

  
  const styles = StyleSheet.create({
    h1: {
    fontSize:24,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: 'center',
    alignSelf: "center"   
    },

    container: {
      flex: 1,
    },

    centrar: {
    alignItems: "center",
    justifyContent: 'center',
    alignSelf: "center"      
    },

  });
  
  
  

     
  