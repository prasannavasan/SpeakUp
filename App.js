import React, {Component} from 'react';
import {
  TouchableHighlight, 
  StyleSheet,
  Text,
  View,
  Image,
  TextInput
} from "react-native";
import Voice from "react-native-voice";


export default class App extends Component {
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
    statement: ''
  }
  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
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
    });
  };

  onSpeechError = e => {
    // eslint-disable-next-line
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = e => {
    // eslint-disable-next-line
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
    });
  };

  onSpeechPartialResults = e => {
    // eslint-disable-next-line
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

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
      statement: ''
    });

    try {
      await Voice.start('en-US');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    this.setState({
      statement: this.state.results.join()
    });
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
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
      statement: ''
    });
  };
  calculator(word) {
    word = word.toLowerCase();                                     //word.downcase!
    if (word.length <= 0) { return 0; }                             //return 1 if word.length <= 3
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
    return word.match(/[aeiouy]{1,2}/g).length;
  }
  render() {
    return (
      <View style={styles.container}>

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

        <View style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}>
          {this.state.results.map((result, index) => {
            return (
              <Text key={`result-${index}`} style={styles.stat}>
                {result}
              </Text>
            );
          })}
        </View>

        <View>
          <Text>
            Total Syllables Detected = {this.calculator(this.state.statement)}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end"
          }}
        >
          <View style={{ height: 70, flex: 1 }}>
            <TouchableHighlight onPress={this._destroyRecognizer}>
              {/* <Image style={styles.button} source={require('./images/button.png')} /> */}
              <Text style={styles.action}>Reset</Text>
            </TouchableHighlight>
          </View>
          <View style={{ height: 70, flex: 1 }}>
            <TouchableHighlight onPress={this._startRecognizing}>
              <Text style={styles.action}>Start</Text>
            </TouchableHighlight>
          </View>
          <View style={{ height: 70, flex: 1,}}>
            <TouchableHighlight onPress={this._stopRecognizing}>
              <Text style={styles.action}>Stop</Text>
            </TouchableHighlight>
          </View>
        </View>

      </View>
    );
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
