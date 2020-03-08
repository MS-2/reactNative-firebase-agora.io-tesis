/* @flow */
import * as React from 'react';
import {
  StyleSheet,
  ToastAndroid,
  Image,
  View,
  TextInput,
  AsyncStorage,
  Text
} from 'react-native';
import {Button} from 'native-base';



export default class Cambiar extends React.Component {

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
  this.state = {
      vieja: null,
      nueva: null,
      id: this.props.navigation.getParam('id'),
      token: null
    };
  };

  componentDidMount(){
    AsyncStorage.getItem("token").then((value) => {
        this.setState({token: value});
      })
  }



  render() {

    return (
        <View>
            <Text style={{fontSize:22,color:'#015d52', alignSelf:"center", padding:5}}>cambio de contraseña</Text>

            <View style={{padding:15}}>

                <TextInput  underlineColorAndroid={'black'} 
                        
                            placeholder='contraseña actual' 
                            onChangeText={(vieja) => this.setState({vieja})} 
                            value={this.state.vieja} 
                            autoCompleteType='off' 
                />
  
                <TextInput  underlineColorAndroid={'black'} 
                            minLength={4}
                            maxLength={12}
                            placeholder='contraseña nueva 4-12 caracteres' 
                            onChangeText={(nueva) => this.setState({nueva})} 
                            value={this.state.nueva} 
                            autoCompleteType='off' 
                />

                <Button style={{backgroundColor:'#015d52'}} onPress={this.cambiar}>
                    <Text style={{color:'white', alignSelf:"center", paddingHorizontal:100}}>cambiar contraseña</Text>
                </Button>

            </View>
        </View>
    );
  }

  cambiar = async () => {

    fetch("https://api-open.herokuapp.com/cambiarpass", {     
      method: "post",
      headers:{"Accept":"application/json","Content-Type":"application/json","Authorization":this.state.token},    
      body: JSON.stringify({
        id:     this.state.id,
        vieja:  this.state.vieja,
        nueva:  this.state.nueva,
      })    
    })
    .then((response) => response.json())
    .then((res) => {
        console.log("asd"+res);
        if (res) {
            alert("cambio de clave exitoso");
        }else{
            alert("problema con el cambio de contraseña");
        }
  })
  .catch(function(error) {
    console.log('Hubo un problema con la petición Fetch:' + error.message);

    // this.notLoading();
    ToastAndroid.show("datos incorrectos", ToastAndroid.SHORT);
  });
};


}

const styles = StyleSheet.create({
  centrar: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
});

