import React, {Component} from 'react';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  ImageBackground
} from "react-native";
import Voice from "react-native-voice";
import { createStackNavigator, createAppContainer } from "react-navigation";

class HomeScreen extends React.Component {
  state = {
    titleText: "Shall we read this",
    bodyText: 'John likes to eat banana and drink water everyday. He likes to lead a healthy life.',
    recognized: '',
    pitch: '',
    error: '',
    end: '',
    started: '',
    results: [],
    partialResults: [],
    statement: '',
    backgroundColor: '#80FFFF',
    prompt: ''
  }
  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    //Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart = e => {
    // eslint-disable-next-line
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized = e => {
    // eslint-disable-next-line
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: '√',
    });
  };

  onSpeechEnd = e => {
    // eslint-disable-next-line
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
      backgroundColor: '#80FFFF'
    });
  };

  onSpeechError = e => {
    // eslint-disable-next-line
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
      backgroundColor: '#80FFFF'
    });
  };

  onSpeechResults = e => {
    // eslint-disable-next-line
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
    });
    const resultWords = e.value[0].split(" ");
    const givenWords = ["john", "likes", "to", "eat", "banana", "and", "drink", "water", "every", "day", "he", "lead", "a", "healthy", "life"];
    var last_element = resultWords[resultWords.length - 1].toLowerCase();
    if (givenWords.indexOf(last_element) > -1) {
      this.setState({
        backgroundColor: "#40FF19",
        prompt: "YOU ARE DOING AMAZING!"
      });
    } else {
      this.setState({
        backgroundColor: "#CC0000",
        prompt: "Almost There, Let's Try Harder!"
      });
    }
  };

  // onSpeechPartialResults = e => {
  //   // eslint-disable-next-line
  //   console.log('onSpeechPartialResults: ', e);
  //   this.setState({
  //     partialResults: e.value,
  //   });
  // };

  onSpeechVolumeChanged = e => {
    // eslint-disable-next-line
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });
  };

  _startRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
      statement: '',
      backgroundColor: '#80FFFF',
      prompt: ''
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      statement: this.state.results.join(),
      backgroundColor: '#80FFFF',
      prompt:''
    });
    var score = this.score();
    var totSyllables = this.calculator(this.state.statement);
    this.props.navigation.navigate('Details', {
      score: score,
      totsyl: totSyllables
    });
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
      statement: '',
      backgroundColor: '#80FFFF',
      prompt:''
    });
  };
  calculator(word) {
    word = word.toLowerCase();                                     //word.downcase!
    if (word.length <= 0) { return 0; }                             //return 1 if word.length <= 3
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
    return word.match(/[aeiouy]{1,2}/g).length;
  }
  score() {
    var existing = 23;
    var spoken = this.calculator(this.state.statement);
    if (spoken < 5 | spoken > 80) {
      return 1;
    }
    else if ((spoken < 10) | (spoken > 70)) {
      return 2;
    }
    else if ((spoken < 15) | (spoken > 40)) {
      return 3;
    }
    else if ((spoken < 20) | (spoken > 30)) {
      return 4;
    }
    else {
      return 5;
    }
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: this.state.backgroundColor
        }}
      >
        <View style={{ top: 100 }}>
          <Text style={styles.baseText}>
            <Text style={styles.titleText}>
              {this.state.titleText}
              {"\n"}
              {"\n"}
              {"\n"}
            </Text>
            <Text style={styles.bodyText} numberOfLines={5}>
              {this.state.bodyText}
            </Text>
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {/* {this.state.results.map((result, index) => {
            return (
              <Text key={`result-${index}`} style={styles.stat}>
                {result}
              </Text>
            );
          })} */}
        </View>

        <View>
          {/* <Text>
            Total Syllables Detected ={" "}
            {this.calculator(this.state.statement)}
          </Text> */}
          <Text style={styles.bodyText}>{this.state.prompt}</Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
            bottom: 25
          }}
        >
          <View style={{ height: 70, flex: 1 }}>
            <TouchableHighlight onPress={this._destroyRecognizer}>
              <ImageBackground
                style={styles.button}
                source={require("./images/Reset.png")}
              >
                <Text style={styles.action}>Reset</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
          <View style={{ height: 70, flex: 1 }}>
            <TouchableHighlight onPress={this._startRecognizing}>
              <ImageBackground
                style={styles.button}
                source={require("./images/Start.png")}
              >
                <Text style={styles.action}>Start</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
          <View style={{ height: 70, flex: 1 }}>
            <TouchableHighlight onPress={this._stopRecognizing}>
              <ImageBackground
                style={styles.button}
                source={require("./images/Stop.png")}
              >
                <Text style={styles.action}>Stop</Text>
              </ImageBackground>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}


class DetailsScreen extends React.Component {
  render() {
    const { navigation } = this.props;
    const score = navigation.getParam('score', '0');
    const totalSyllables = navigation.getParam('totsyl', "0");

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <Text>
          Syllables Expected: 25{"\n"}
          Syllables Detected: {JSON.stringify(totalSyllables)}{"\n"}{"\n"}
          Pitch: 17{"\n"}
          Frequency: 7{"\n"}
          Wave cycles: 47{"\n"}
          Nodes: 21{"\n"}{"\n"}
          Score: {JSON.stringify(score)}{"\n"}{"\n"}
        </Text>
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);
const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#80FFFF"
  },
  button: {
    width: 50,
    height: 50,
    right: -30,
  },
  button2: {
    width: 180,
    height: 180
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
    top: 50
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  submitButton: {
    position: "absolute",
    top: 90,
    left: 30
  },
  baseText: {
    fontFamily: "Cochin"
  },
  bodyText: {
    fontSize: 25
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
