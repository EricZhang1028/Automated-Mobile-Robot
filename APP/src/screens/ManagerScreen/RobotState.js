import React, { Component } from 'react';
import { Container, Card, CardItem, Text, Left, Right, Button, Body } from 'native-base';

export default class RobotState extends Component {
  render() {
    return (
      <Container>
        <Card>
          <CardItem header bordered>
            <Text>機器人電量</Text>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>電量：85%</Text>
            </Body>
          </CardItem>
        </Card>

        {/* <Card>
          <CardItem header bordered>
            <Text>目前任務佇列</Text>
          </CardItem>
          <CardItem bordered>
            <Body><Text>任務1</Text></Body>
            <Left><Text>從：SL202</Text></Left>
            <Right><Text>到：SL208</Text></Right>
          </CardItem>
          <CardItem bordered>
            <Body><Text>任務1</Text></Body>
            <Left><Text>從：SL223</Text></Left>
            <Right><Text>到：SL238</Text></Right>
          </CardItem>
          <CardItem bordered>
            <Body><Text>任務1</Text></Body>
            <Left><Text>從：SL243</Text></Left>
            <Right><Text>到：SL228</Text></Right>
          </CardItem>
        </Card> */}

        <Card>
          <CardItem header bordered>
            <Text>緊急控制</Text>
          </CardItem>
          <CardItem bordered style={{alignSelf:"center"}}>
            <Button bordered danger>
              <Text>暫停服務</Text>
            </Button>
          </CardItem>

        </Card>
      </Container>
    );
  }
}