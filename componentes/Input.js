import React from 'react';
import {Animated, View, Text} from 'react-native';
import {Item, Input, Label, Icon} from 'native-base';


const ALabel=Animated.createAnimatedComponent(Label);
const AInput=Animated.createAnimatedComponent(Input);

export default class CustomInput extends React.Component{
    constructor(props) {
        super(props);
        this.state={ color: new Animated.Value(0), focused:0}
    }

    render(){
        let color= this.state.color.interpolate({
            inputRange:[0,1],
            outputRange:[this.props.blurColor,this.props.focusColor]
        });
        return ( 
            <Item {...this.props.item} style={{...this.props.item.style,borderColor:this.state.focused?"transparent":this.props.blurColor}}>
                <ALabel style={{color:color}} >{this.props.text}</ALabel>
                
                <AInput onChangeText={(email) => this.props.textChange(email)} value={this.props.value} 
                onFocus={this.focus} onBlur={this.blur} secureTextEntry={this.props.secureTextEntry}
                style={{color:color}} >             
                </AInput>

                <View style={{position:"absolute",right:10,bottom:15,flexDirection:"row-reverse"}}>
                    {this.props.value!=""?<Icon style={{color:this.props.focusColor, fontSize:24}} key={Math.random()}
                     name={"closecircle"} type={"AntDesign"} onPress={()=>{this.props.textChange("")}} />
                    :null }
                    {this.props.password&&this.props.value!=""?<Icon style={{color:this.props.focusColor,marginRight: 10, fontSize:28}} key={Math.random()}
                     name={this.props.secureTextEntry?"eye-off":"eye"} onPress={this.props.visible} />
                    :null}
                </View> 
               
            </Item> 
        );
    }

    focus=async ()=>{
        await this.setState({focused:1});
        Animated.timing(this.state.color,{
            toValue:1,
            duration:1500
        }).start();
    }
    blur=async ()=>{
        await this.setState({focused:0})
        Animated.timing(this.state.color,{
            toValue:0,
            duration:1500
        }).start();
    }
}
    