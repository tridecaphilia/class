import React, { Component } from "react";
{
  /* Week2 Task 1 Imports */
}
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  Button,
  StyleSheet
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
// import { CAMPSITES } from "../shared/campsites";
// import { COMMENTS } from "../shared/comments";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postComment, postFavorite } from "../redux/ActionCreators";
// import { RotationGestureHandler } from "react-native-gesture-handler";

const mapStateToProps = (state) => {
  return {
    campsites: state.campsites,
    comments: state.comments,
    favorites: state.favorites
  };
};
// Workshop 2 Task 3
const mapDispatchToProps = {
  postFavorite: (campsiteId) => postFavorite(campsiteId),
  postComment: (campsiteId, rating, author, text) =>
    postComment(campsiteId, rating, author, text)
};

function RenderComments({ comments }) {
  const renderCommentItem = ({ item }) => {
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.text}</Text>
        {/* <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text> */}
        <Rating
          readonly
          startingValue={item.rating}
          imageSize={10}
          style={{ alignItems: "flex-start", paddingVertical: "5%" }}
        />

        <Text
          style={{ fontSize: 12 }}
        >{`-- ${item.author}, ${item.date}`}</Text>
      </View>
    );
  };

  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </Card>
  );
}

function RenderCampsite(props) {
  const { campsite } = props;

  if (campsite) {
    return (
      <Card
        featuredTitle={campsite.name}
        // image={require("./images/react-lake.jpg")}>
        // redux
        image={{ uri: baseUrl + campsite.image }}
      >
        <Text style={{ margin: 10 }}>{campsite.description}</Text>
        <View style={styles.cardRow}>
          <Icon
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            raised
            reverse
            onPress={() =>
              props.favorite
                ? console.log("Already set as a favorite")
                : props.markFavorite()
            }
          />

          {/* Week2 Task 1 Pencil Icon */}
          <Icon
            name="pencil"
            type="font-awesome"
            color="#5637DD"
            raised
            reverse
            onPress={() => props.onShowModal()}
          />
        </View>
      </Card>
    );
  }
  return <View />;
}

class CampsiteInfo extends Component {
  // Week2 Task 1 State
  constructor(props) {
    super(props);
    this.state = {
      //     // campsites: CAMPSITES,
      //     // comments: COMMENTS,
      //     favorite: false
      showModal: false,
      rating: 5,
      author: "",
      text: ""
    };
  }

  static navigationOptions = {
    title: "Campsite Information"
  };
  // Week2 Task1 Event Handler
  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  // Week 2 Task 3
  handleComment(campsiteId) {
    // console.log(JSON.stringify(this.state));
    this.props.postComment(
      (campsiteId, this.state.rating, this.state.author, this.state.text)
    );
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      showModal: false,
      rating: 5,
      author: "",
      text: ""
    });
  }
  // markFavorite() {
  //   this.setState({ favorite: true });
  // }

  markFavorite(campsiteId) {
    this.props.postFavorite(campsiteId);
  }

  render() {
    // const campsite = this.state.campsites.filter(
    //   (campsite) => campsite.id === campsiteId
    // )[0];
    // const comments = this.state.comments.filter(
    //   (comment) => comment.campsiteId === campsiteId
    // );
    // redux

    const campsiteId = this.props.navigation.getParam("campsiteId");
    const campsite = this.props.campsites.campsites.filter(
      (campsite) => campsite.id === campsiteId
    )[0];
    const comments = this.props.comments.comments.filter(
      (comment) => comment.campsiteId === campsiteId
    );

    return (
      <ScrollView>
        <RenderCampsite
          campsite={campsite}
          // favorite={this.state.favorite}
          // markFavorite={() => this.markFavorite()}
          favorite={this.props.favorites.includes(campsiteId)}
          markFavorite={() => this.markFavorite(campsiteId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComments
          comments={comments}
          // postComment={postComment}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              startingValue={this.state.rating}
              imageSize={40}
              onFinishRating={(rating) => this.setState({ rating: rating })}
              style={{ paddingVertical: 10 }}
            />
            <Input
              placeholder="Author"
              leftIcon={<Icon name="user-o" type="font-awesome" />}
              leftIconContainerStyle={{ paddingright: 10 }}
              onChangeText={(author) => this.setState({ author: author })}
              value={this.state.author}
            />
            <Input
              placeholder="Comment"
              leftIcon={<Icon name="comment-o" type="font-awesome" />}
              leftIconContainerStyle={{ paddingright: 10 }}
              onChangeText={(text) => this.setState({ text: text })}
              value={this.state.text}
            />
            <View style={{ margin: 10 }}>
              <Button
                onPress={() => {
                  this.handleComment(campsiteId);
                  this.resetForm();
                }}
                color="#5637DD"
                title="Submit"
              />
            </View>

            <View style={{ margin: 10 }}>
              <Button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                color="#808080"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20
  },
  modal: {
    justifyContent: "center",
    margin: 20
  }
});

// export default CampsiteInfo;
export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
