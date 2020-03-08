import React from 'react';
import { Dimensions, Text , TextInput, StyleSheet, KeyboardAvoidingView, View, TouchableOpacity,ToastAndroid, FlatList } from 'react-native';
import { Container, Content } from 'native-base';
import { Header, Icon } from 'react-native-elements';
import User from '../../User'
import firebase from 'firebase';
import { HeaderBackButton } from 'react-navigation-stack';



export default class Vista extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    person: {
      name: this.props.navigation.getParam('name'),
      phone: this.props.navigation.getParam('phone'),
    },
    mensaje: '',
    mensajeList: [],
    contador: this.props.navigation.getParam('contador', false)
  }

  handle = key => val => {
    this.setState({[key]: val})
  }

  sendMensaje = async () => {
    if (this.state.mensaje.length > 0) {
        let mId = firebase.database().ref('messages').child(User.phone).child(this.state.person.phone).push().key;
        let update = {};
        let mens = {
            mens: this.state.mensaje,
            time: firebase.database.ServerValue.TIMESTAMP,
            from: User.phone
        }
        update['messages/'+User.phone+'/'+this.state.person.phone+'/'+mId ] = mens;
        update['messages/'+this.state.person.phone+'/'+User.phone+'/'+mId ] = mens;
        firebase.database().ref().update(update);
        this.setState({mensaje: ''});
    }
  }

  converTime = (time) => {
    let d =  new Date(time);
    let c =  new Date();
    let result = (d.getHours()< 10 ? '0' : '' ) +d.getHours()+ ':';
    result += (d.getMinutes() < 10 ? '0': '')+ d.getMinutes(); 
    if(c.getDay() !== d.getDay()){
      result = d.getDay()+ '/' + d.getMonth() + '/' + result;
    }
    return result;
  }
    

  renderRow = ({item}) =>{
    return(
      <View style={{flexDirection: "row", width:'70%', alignSelf: item.from===User.phone ? 'flex-end': 'flex-start', backgroundColor: item.from===User.phone ? '#00897b' : '#7cb342', borderRadius:5, marginBottom:20}}>
          <Text style={{color: '#fff', padding:7, fontSize:16}}>{item.mens}</Text>
          <Text style={{color: '#eee', padding:3, fontSize:12}}>{this.converTime(item.time)}</Text>
      </View>
    )
  }


  componentDidMount(){
    this.setState({contador: false});
    firebase.database().ref('messages').child(User.phone).child(this.state.person.phone)
    .on('child_added', (value)=> {
      this.setState((prevState)=>{
        return {
          mensajeList: [...prevState.mensajeList, value.val()]
        }
      })
    })  

  }


  render(){
    let {height} =  Dimensions.get('window');
    return (
      <Container>
        <KeyboardAvoidingView style={styles.container} enabled> 
          <Header   containerStyle={{backgroundColor: 'rgb(24,60,95)', height:100}}
                    placement="left"
                    leftComponent={<HeaderBackButton tintColor="white" onPress={() => this.props.navigation.goBack()} />}
                    centerComponent={{text: this.state.person.name,  style: { color: 'white' } }}
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
 
          <FlatList 
            ref = "flatList" onContentSizeChange={()=> this.refs.flatList.scrollToEnd()}
            style={{padding:10, height:height *0.8, backgroundColor:'bisque' }} 
            data={this.state.mensajeList} 
            renderItem={this.renderRow} 
            keyExtractor={(item, index)=>index.toString()}>
          </FlatList>

    
          <View style={{position:"relative", bottom: 0, flexDirection:'row',  alignItems: "center", marginHorizontal:5}}>
            <TextInput 
                        autoCorrect={false} 
                        onSubmitEditing={()=> this.sendMensaje()} 
                        style={styles.input} 
                        value={this.state.mensaje} 
                        placeholder='escriba su mensaje...' 
                        onChangeText={this.handle('mensaje')}
                        >
            </TextInput>
          <TouchableOpacity style={styles.btnText} onPress={()=>{this.sendMensaje()}}><Icon name='send' color='white'></Icon></TouchableOpacity>
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
    backgroundColor: 'rgba(149,214,198,0.9)', 
  },

});

