import React from 'react';
import { Box, Heading } from 'grommet';
import { Cafeteria, Lounge, Restaurant, Run, Book, PowerCycle } from 'grommet-icons';
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

    showIcon(name) {
        switch(name) {
            case 'Dining Room':
                return (<Cafeteria size="xlarge"></Cafeteria>)
            case 'Kitchen':
                return (<Restaurant size="xlarge"></Restaurant>)
            case 'Bedroom':
                return (<PowerCycle size="xlarge"></PowerCycle>)
            case 'Office':
                return (<Book size="xlarge"></Book>)
            case 'Hall':
                return (<Run size="xlarge"></Run>)
            case 'Living Room':
                return (<Lounge size="xlarge"></Lounge>)
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
                padding="medium"
                onClick={() => this.handleToggle()}
            >
                <Heading>
                    {this.props.name}
                </Heading>
                {this.showIcon(this.props.name)}
            </Box>
        );
    }
}

export default LightGroup;
