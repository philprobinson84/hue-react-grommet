import React from 'react';
import { Grid } from 'grommet';
import Config from './config';
import LightGroup from './LightGroup';

class Lights extends React.Component {
    constructor(props) {
        super(props);
        this.requestFailed = false;
        this.data = null;
    }

    componentDidMount() {
        this.fetchGroups();
    }

    getHueGroupsUrl() {
        return Config.hue_url + '/api/' + Config.hue_username + '/groups';
    }

    fetchGroups() {
        const url = this.getHueGroupsUrl();

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
                this.setState({ newData: new Date() });
            }, () => {
                this.requestFailed = true;
                this.setState({ newData: new Date() });
            })
    }

    render() {
        if (this.requestFailed) {
            const url = this.getHueGroupsUrl();
            return <p className='warning'>Could not fetch from {url}</p>
        }

        if (!this.data) {
            return <p>Loading...</p>;
        }

        if (this.data[0] !== undefined) {
            return <p className='warning'>{this.data[0].error.description}</p>;
        }

        const data = this.data;
        console.log(data);
        const hueGroups = [];
        Object.keys(data).forEach(function (id, index) {
            const item = data[id];
            if (item.type === "Room") {
            const group = <LightGroup key={id} id={id} name={data[id].name} />
                hueGroups.push(group);
            };
        });

        return (
            <Grid
                columns={{
                    count: 2,
                    size: "auto"
                }}
                gap="small"
                fill
            >
                {hueGroups}
            </Grid>
        );
    }
}

export default Lights;