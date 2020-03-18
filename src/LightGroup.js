import React from 'react';
import { Box, Button, Heading, Grid } from 'grommet';
import { Cafeteria, Lounge, Restaurant, Directions, Book, FormViewHide, Add, Subtract } from 'grommet-icons';
import Config from './config';

class LightGroup extends React.Component {
    constructor(props) {
        super(props);
        this.requestFailed = false;
        this.data = null;
        this.id = this.props.id
        this.state = {
            on: false,
            bri:0,
            hue:0,
            sat:0
        };
    }

    componentDidMount() {
        this.getGroupState();
        this.timer = setInterval(() => this.getGroupState(),10000);
    }

    getGroupState() {
        const url = Config.hue_url + '/api/' + Config.hue_username + '/groups/' + this.id;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }
                return response;
            })
            .then(d => d.json())
            .then(d => {
                this.data = d;
                this.requestFailed = false;
                this.setState({
                    newData: new Date(),
                    on: this.data.action.on,
                    bri: this.data.action.bri,
                    hue: this.data.action.hue,
                    sat: this.data.action.sat
                });
            }, () => {
                this.requestFailed = true;
                this.setState({ newData: new Date() });
            })
        return ;
    }

    setGroupState(id, on, bri, hue, sat) {
        const url = Config.hue_url + '/api/' + Config.hue_username + '/groups/' + id + '/action';
        const bodyData = '{"on":' + on + ',"bri":' + bri + ',"hue":' + (hue == null ? 0 : hue) + ',"sat":' + (sat == null ? 0 : sat) + '}';
        console.log(bodyData)
        fetch(url, { method: 'PUT', body: bodyData })
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }
                return response;
            })
            .then(d => d.json())
            .then(d => {
                this.requestFailed = false;
                this.getGroupState();
            }, () => {
                this.requestFailed = true;
            })
        return ;
    }

    handleToggle() {
        this.setGroupState(this.id, !this.state.on, this.state.bri, this.state.hue, this.state.sat)
    }

    handleBrightnessUp() {
        const newBri = Math.min(254, this.state.bri + 51)
        this.setGroupState(this.id, this.state.on, newBri, this.state.hue, this.state.sat)
    }

    handleBrightnessDown() {
        const newBri = Math.max(0, this.state.bri - 51)
        this.setGroupState(this.id, this.state.on, newBri, this.state.hue, this.state.sat)
    }

    showIcon(name) {
        switch(name) {
            case 'Dining Room':
                return (<Cafeteria size="large"></Cafeteria>)
            case 'Kitchen':
                return (<Restaurant size="large"></Restaurant>)
            case 'Bedroom':
                return (<FormViewHide size="large"></FormViewHide>)
            case 'Office':
                return (<Book size="large"></Book>)
            case 'Hall':
                return (<Directions size="large"></Directions>)
            case 'Living Room':
                return (<Lounge size="large"></Lounge>)
            default:
                return (null)
        }
    }

    render() {
        return ( 
            <Box
                elevation="small"
                key={this.id}
                background={(this.state.on ? "light-2" : "dark-2")}
                align="center"
            >
                <Heading 
                    level="3"
                    textAlign="center"
                    onClick={() => this.handleToggle()}
                    margin="xsmall"
                >
                    {this.props.name}
                </Heading>
                <Grid
                    columns={{
                        count: 3,
                        size: "auto"
                    }}
                    gap="medium"
                    margin={{
                        "top": "none",
                        "bottom": "small",
                        "left": "small",
                        "right": "small"
                    }}
                >
                    <Button plain={false} icon={<Subtract />} onClick={() => this.handleBrightnessDown()} />
                    <Box onClick={() => this.handleToggle()} align="center">
                        {this.showIcon(this.props.name)}
                        <Heading level="3" textAlign="center">{Math.round(this.state.bri/2.54)}%</Heading>
                    </Box>
                    <Button plain={false} icon={<Add />} onClick={() => this.handleBrightnessUp()} />
                </Grid>
            </Box>
        );
    }
}

export default LightGroup;
