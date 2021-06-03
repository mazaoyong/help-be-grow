## time-picker 使用演示

```javascript
    import React, { Component } from 'react';
    import TimePicker from 'components/time-picker';

    class Demo extends Component {
        state = {
            times: [{
                active: false,
                timeRange: ['00:00', '23:59'],
                workDays: [0, 1]
            }]
        };

        handleChange = data => {
            this.setState({
                times: data
            });
        }

        render() {
            return (
                <TimePicker
                    value={this.state.times}
                    onChange={this.handleChange}
                />
            );
        }
    }
```
