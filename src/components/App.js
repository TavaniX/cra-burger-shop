import React from 'react';
import Header from './Header';
import Order from './Order';
import MenuAdmin from './MenuAdmin';
import SampleBurgers from '../sample-burgers';
import Burger from './Burger';
import base from '../base';

class App extends React.Component {

    state = {
        burgers: {},
        order: {}
    };

    componentDidMount() {
        console.log('mount success')
    }

    addBurger = burger => {
        // 1. делаю копию объекта state
        const burgers = { ...this.state.burgers };
        // 2. добавляю новый бургер в копию объекста стей бургер
        burgers[`burger${Date.now()}`] = burger;
        // 3. записываю обновленный объект burgers в стейт App
        this.setState({ burgers });
    };

    loadSampleBurgers = () => {
        this.setState({ burgers: SampleBurgers })
    };

    addToOrder = key => {
        // 1. делаю копию объекта state
        const order = { ...this.state.order };
        // 2. добавляю ключ к заказу со значением 1, либо обновляю текущее значение
        order[key] = order[key] + 1 || 1;
        // 3. записываю обновленный объект обратно в стейт App
        this.setState({ order });
    };

    render() {
        return(
            <div className="burger-paradise">
                <div className='menu'>
                    <Header title='Very hot burger'/>
                    <ul className='burgers'>
                        {
                            Object.keys(this.state.burgers).map(key => {
                                return <Burger 
                                    key={ key } 
                                    index={ key }
                                    addToOrder = { this.addToOrder }
                                    details={ this.state.burgers[key] }
                                />;
                            }) 
                        }
                    </ul>
                </div>
                <Order burgers={ this.state.burgers} order={ this.state.order } />
                <MenuAdmin 
                    addBurger={ this.addBurger } 
                    loadSampleBurgers= { this.loadSampleBurgers } 
                />
            </div>
        );
    };
}

export default App;