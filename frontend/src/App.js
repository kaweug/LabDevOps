import React, { Component } from 'react';
import axios from 'axios';
import logo from './static/logo.svg';
import './static/App.css';

class App extends Component {
  constructor(props) {
     super(props);
     this.state = {tripDistance: 12, consumedFuel: 1, fuelAvg: 0};
     this.changeTripDistance = this.changeTripDistance.bind(this);
     this.changeFuelConsumption = this.changeFuelConsumption.bind(this);
   }

   changeTripDistance(event) {
     const dist = event.target.value ? event.target.value : this.state.tripDistance;
     this.setState({tripDistance: dist === 0 ? 1 : dist, consumedFuel: this.state.consumedFuel, fuelAvg: this.state.fuelAvg});
     this.handleBackend();
   }

   changeFuelConsumption(event) {
     const fuel = event.target.value ? event.target.value : event.target.consumedFuel;
     this.setState({tripDistance: this.state.tripDistance, consumedFuel: fuel, fuelAvg: this.state.fuelAvg});
     this.handleBackend();
   }

   async handleBackend() {
     const refx = this;
     axios.get('/fuelAvg', {
         params: {
           distance: this.state.tripDistance,
           fuel: this.state.consumedFuel
         }
       })
       .then(function (response) {
         refx.setState({tripDistance: refx.state.tripDistance, consumedFuel: refx.state.consumedFuel, fuelAvg: parseFloat(response.data).toFixed(2)});
       })
       .catch(function (error) {
         console.log(error);
       });
   }

   async handleClick() {
     console.log(await axios.get('/api'));
   }

   render() {
     return (
     <div className="App">
       <header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
         <div>
           <button onClick={this.handleClick}>Invoke action on backend!</button>
         </div>
         <p>
           Edit to reload -> Helllo Labs. : )
         </p>

         <form>
           <ul>
             <li>
               <label>
                 Zrobiona odległość trasy:
                 <input type="number" min="1" value={this.state.tripDistance || 0} onChange={this.changeTripDistance}/>
               </label>
             </li>
             <li>
               <label>
                 Ilość zużytego paliwa:
                 <input type="number" min="0" value={this.state.consumedFuel || 1} onChange={this.changeFuelConsumption}/>
               </label>
             </li>
           </ul>
         </form>
         Średnie spalanie wynosi: {this.state.fuelAvg}!
         <p/>
         <a
           className="App-link"
           href="https://reactjs.org"
           target="_blank"
           rel="noopener noreferrer"
         >
           Learn React
         </a>
       </header>
     </div>
   );
 }
}

export default App;
