import React from 'react';
import {Jumbotron, CardDeck, Card, Button} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import {PAGES} from 'configs/routes';

import './Home.scss';
// TODO: Add util or index file for multiple images import
import ill1 from 'static/ill1.jpg';
import ill2 from 'static/ill2.jpg';
import ill5 from 'static/ill5.jpg';
import ill8 from 'static/ill8.jpg';
import ill7 from 'static/ill7.jpg';
import members from 'static/members.png';
import app from 'static/app.png';

function Home(props) {
    const history = useHistory();

    const redirectToMap = () => history.push(PAGES.dashboard);

    return (
        <div id="home">
            <Jumbotron>
                <h1>SnowHub</h1>
                <h3>We make skiing better togheter</h3>
                <br />
                <br />
                <Button size="lg" onClick={redirectToMap}>
                    Discover our interactive map
                </Button>
            </Jumbotron>
            <CardDeck>
                <Card>
                    <Card.Img variant="top" src={ill8} />
                    <Card.Body>
                        <Card.Title>Share data with users</Card.Title>
                        <Card.Text>
                            Return to your favorite spot but remember to always share your experience with others.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src={ill5} />
                    <Card.Body>
                        <Card.Title>Enjoy skiing</Card.Title>
                        <Card.Text>
                            Enjoy skiing knowing everything before going there. Avoid any unwanted events
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src={ill1} />
                    <Card.Body>
                        <Card.Title>Find what you need</Card.Title>
                        <Card.Text>
                            Use our map to find everything you need using just a simple click or tap.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Img variant="top" src={ill2} />
                    <Card.Body>
                        <Card.Title>Get rewarded</Card.Title>
                        <Card.Text>
                            Get rewarded by being at the top of the leaderboards and enjoying exclusive events
                        </Card.Text>
                    </Card.Body>
                </Card>
            </CardDeck>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div
                style={{
                    background: "#E5F0FD",
                    width: "100%",
                    height: "400px"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        padding: "24px",
                        allignItems: "center"
                    }}
                >
                    <Card.Body>
                        <Card.Title>
                            <h2>Are you a slope administrator or a local business owner?</h2>
                        </Card.Title>
                        <Card.Text>
                            <h4>Contact us to post events or share your business with the whole community!</h4>
                        </Card.Text>
                        <Button size="md" onClick={redirectToMap}>
                            Contact us
                        </Button>
                    </Card.Body>
                    <Card.Img style={{width: "500px", borderRadius: "20px"}} variant="top" src={ill7} />
                </div>
            </div>
            <Card.Img style={{width: "100%"}} variant="top" src={members} />
            <Card.Img style={{width: "100%"}} variant="top" src={app} />
        </div>
    );
}

export {Home};
