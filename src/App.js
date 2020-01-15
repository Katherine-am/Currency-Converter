import React, { Component } from 'react';
import styled from 'styled-components';

const ConversionContainer = styled.div`
    background: lightgrey;
    border-radius: 0.5em;
    display: flex;
    align-items: center;
    width: 40%;
    height: 10vh;
    margin: 0 auto;
    align-items: center;
    margin-top: 2em;
    flex-wrap: wrap;
    padding: 4em 0em;
`;

const ConversionGroup = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const StyledSelect = styled.select`
    display: inline-flex;
    width: 10em;
    height: 1em;
    margin-right: 1em;
    font-family: Arial;
    background: grey;
    color: white;
    border: none;
    border-radius: 0.25em;
`;

const StyledInput = styled.input`
    display: inline-flex;
    border-radius: 0.5em;
    border: 1px solid lightgrey;
`;

class App extends Component {

    constructor(props) {
        super(props);
        this.currencies = ["AUD", "CAD", "CHF", "CNY", "INR", "USD", "EUR", "GBP", "JPY", "NZD"];
        this.cached = {};
        this.state = {
            base: "USD",
            comparitor: "EUR",
            value: 0,
            converted: 0
        };
    }

    makeSelection = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    changeValue = (event) => {
        this.setState({
            value: event.target.value,
            converted: null
        }, this.recalculate);
    }

    recalculate = () => {
        const value = parseFloat(this.state.value);
        if(isNaN(value)) {
            return;
        }
        
        if (this.cached[this.state.base] !== undefined && Date.now() - this.cached[this.state.base].timestamp < 1000 * 60) {
            this.setState({
                converted: this.cached[this.state.base].rates[this.state.comparitor] * value
            });
            return;
        }

        fetch(`https://api.exchangeratesapi.io/latest?base=${this.state.base}`)
        .then(res => res.json())
        .then(data => {
            this.cached[this.state.base] = {
                rates: data.rates,
                timestamp: Date.now()
            };
            this.setState({
                converted: data.rates[this.state.comparitor] * value
            });
        });
    }

    componentDidMount() {
        console.log("App component mounted")
    }

    render() {
        return (
            <ConversionContainer>
                <ConversionGroup>
                    <StyledSelect 
                        onChange={this.makeSelection} 
                        name="base" 
                        value={this.state.base}
                        >
                        {this.currencies.map(currency => <option key={currency} value={currency}>{currency}</option>)}
                    </StyledSelect>
                    <StyledInput 
                        onChange={this.changeValue} 
                        value={this.state.value} 
                        />
                </ConversionGroup>
                <ConversionGroup>
                    <StyledSelect 
                        onChange={this.makeSelection} 
                        name="comparitor" 
                        value={this.state.comparitor}
                        >
                        {this.currencies.map(currency => <option key={currency} value={currency}>{currency}</option>)}
                    </StyledSelect>
                    <StyledInput 
                        disabled={true} 
                        value={this.state.converted === null ? "Calculating..." : this.state.converted} 
                        />
                </ConversionGroup>
            </ConversionContainer>
        )
    }
}

export default App;