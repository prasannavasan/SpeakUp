import React, {Component} from 'react';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  ImageBackground,
  AsyncStorage,
  Alert
} from "react-native";
import Voice from "react-native-voice";
import { createStackNavigator, createAppContainer } from "react-navigation";
import {
  Grid,
  LineChart,
  XAxis,
  YAxis,
  PieChart
} from "react-native-svg-charts";
import Stars from "react-native-stars";
import { Circle, G, Line } from "react-native-svg";


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
  state = {
    scoreArray: []
  };
  async saveKey(value) {
    AsyncStorage.getItem("score3", (err, result) => {
      const id = [value];
      if (result !== null) {
        console.log("Data Found", result);
        var newIds = JSON.parse(result).concat(id);
        AsyncStorage.setItem("score3", JSON.stringify(newIds));
      } else {
        console.log("Data Not Found");
        AsyncStorage.setItem("score3", JSON.stringify(id));
      }
    });
    Alert.alert(
      'Saved',
      'Your score is saved for Progress Tracking',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  async getKey() {
    try {
      const value = await AsyncStorage.getItem("score3");
      if (value !== null) {
        const valueCheck = JSON.parse(value);
        this.setState({
          scoreArray: value
        });
        var valueCheckNumberArray = valueCheck.map(Number);
        console.log(JSON.parse(myArray));
      }
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
    this.props.navigation.navigate("Charts", {
      DataValues: valueCheckNumberArray
    });
  }
  _renderTest() {
    if (true) {
      return (
        <Button title="Progress Tracker" onPress={this.getKey.bind(this)} />
      );
    } else {
      return null;
    }
  }

  render() {
    const { navigation } = this.props;
    const score = navigation.getParam("score", "1");
    const totalSyllables = navigation.getParam("totsyl", "0");
    var message = '"Good Job!"';
    if (score > 3) {
      message = "Perfect! You are doing really good.";
    }
    else if (score > 1) {
      message = "Good Job! Lets try more";
    }
    else {
      message = "Good Job! Lets try harder again";
    }



    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <View style={{ top: 120 }}>
          <Stars
            display={score}
            spacing={8}
            count={5}
            starSize={40}
            backingColor="white"
            fullStar={require("./images/starFilled.png")}
            emptyStar={require("./images/starEmpty.png")}
          />
          <Text style={styles.titleText}>
            {"\n"}
          </Text>
          <Text style={styles.titleText}>{message}</Text>
        </View>
        {/* <View>

        </View>
        <Text style={styles.titleText}>
          {"\n"}
          {"\n"}
          {"\n"}
          {"\n"}
        </Text> */}

        {/* <Text>
          {"\n"}
          {"\n"}
          {"\n"}
          {"\n"}
          Syllables Expected: 25{"\n"}
          Syllables Detected: {JSON.stringify(totalSyllables)}
          {"\n"}
          {"\n"}
          Pitch: 17{"\n"}
          Frequency: 7{"\n"}
          Wave cycles: 47{"\n"}
          Nodes: 21{"\n"}
          {"\n"}
          Score: {JSON.stringify(score)}
          {"\n"}
          {"\n"}
        </Text>
        <Text>Scores are = {this.state.scoreArray}</Text> */}
        {/* <Button
          title="Save My Score"
          onPress={this.saveKey(JSON.stringify(score))}
        /> */}
        <View style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bottom: 50
        }}>
          <Text style={styles.titleText}>
            {"\n"}
          </Text>
          <Button
            style={styles.formButton}
            onPress={this.saveKey.bind(this, JSON.stringify(score))}
            title="Save Score"
            color="#2196f3"
            accessibilityLabel="Get Key"
          />
          <Text style={styles.titleText}>
            {"\n"}
          </Text>
          <Button title="Progress Tracker" onPress={this.getKey.bind(this)} />
          <Text style={styles.titleText}>
            {"\n"}
          </Text>
          {this._renderTest()}
          <Text style={styles.titleText}>
            {"\n"}
          </Text>
          <Button title="Connect" onPress={this.getKey.bind(this)} />
        </View>

        {/* <Button
          style={styles.formButton}
          onPress={this.getKey.bind(this)}
          title="Get Key"
          color="#2196f3"
          accessibilityLabel="Get Key"
        /> */}
        {/* <Text>
          {"\n"}
          {"\n"}
        </Text> */}
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate("Home")}
          style={{ bottom: 50, right: 175 }}
        >
          <ImageBackground
            style={styles.button}
            source={require("./images/home.png")}
          >
            <Text style={styles.action}>Home</Text>
          </ImageBackground>
        </TouchableHighlight>
        {/* <Button
          style={{ bottom: 100 }}
          title="Home"
          onPress={() => this.props.navigation.navigate("Home")}
        /> */}
      </View>
    );
  }
}

class ChartsScreen extends React.Component {
  render() {
    const { navigation } = this.props;
    const scoreArray = navigation.getParam("DataValues", []);
    const data = scoreArray.slice(Math.max(scoreArray.length - 10, 1));
    const dataPie = [90, 10]

    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 30





    const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)

    const pieData = dataPie
      .filter(value => value > 0)
      .map((value, index) => ({
        value,
        svg: {
          fill: randomColor(),
          onPress: () => console.log("press", index)
        },
        key: `pie-${index}`
      }));

    return (
      <View>
        <View>
          <PieChart style={{ height: 200, top: 80 }} data={pieData} />
        </View>
        <View style={{ top: 100, left: 75 }}>
          <Text style={styles.titleText}>
            Accuracy of Speech (%)
            {"\n"}
            {"\n"}
          </Text>
        </View>
        <View>
          <View
            style={{
              height: 200,
              padding: 20,
              flexDirection: "row",
              top: 100
            }}
          >
            <YAxis
              data={data}
              style={{ marginBottom: xAxisHeight }}
              contentInset={verticalContentInset}
              svg={axesSvg}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <LineChart
                style={{ flex: 1 }}
                data={data}
                contentInset={verticalContentInset}
                svg={{ stroke: "rgb(134, 65, 244)" }}
              >
                <Grid />
              </LineChart>
              <XAxis
                style={{ marginHorizontal: -10, height: xAxisHeight }}
                data={data}
                formatLabel={(value, index) => index}
                contentInset={{ left: 10, right: 10 }}
                svg={axesSvg}
              />
            </View>
          </View>
          <View style={{ top: 75, left: 40 }}>
            <Text style={styles.titleText}>
              Scores over the last 10 attempts
            </Text>
          </View>
        </View>
        <View style={{ top: 150 }}>
          {/* <Button
            title="Go to Score"
            onPress={() => this.props.navigation.navigate("Details")}
          /> */}
          {/* <Button
            title="Go to Home"
            onPress={() => this.props.navigation.navigate("Home")}
          /> */}
          <Text style={styles.titleText}>
            {"\n"}
            {"\n"}
            {"\n"}
            {"\n"}

          </Text>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate("Home")}
            style={{ bottom: 50 }}
          >
            <ImageBackground
              style={styles.button}
              source={require("./images/home.png")}
            >
              <Text style={styles.action}>Home</Text>
            </ImageBackground>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.props.navigation.navigate("Details")}
            style={{ bottom: 105, right: -270 }}
          >
            <ImageBackground
              style={styles.button}
              source={require("./images/score.png")}
            >
              <Text style={styles.action}>Score</Text>
            </ImageBackground>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
    Charts: ChartsScreen
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
  buttonStar: {
    width: 200,
    height: 200
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
