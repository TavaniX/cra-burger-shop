import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Order from './Order';
import MenuAdmin from './MenuAdmin';
import SampleBurgers from '../sample-burgers';
import Burger from './Burger';
import base from '../base';
import firebase from 'firebase/app';
import SignIn from './Auth/SignIn';

class App extends React.Component {
    static propTypes = {
        match: PropTypes.object
    };

    state = {
        burgers: {},
        order: {}
    };

    // синхро с бд и загрузка стейта из бд
    componentDidMount() {
        const { params } = this.props.match;

        // считываем, что было записано в ls
        const localStorageRef = localStorage.getItem(params.restaurantId);
        
        if(localStorageRef) {
            this.setState({ order: JSON.parse(localStorageRef) });
        };

        this.ref = base.syncState(`${ params.restaurantId }/burger`, {
            context: this,
            state: 'burgers'
        });
    };

    // при обновлении списка бургеров в компоненте Order
    componentDidUpdate() {
        const { params } = this.props.match;
        localStorage.setItem(params.restaurantId, JSON.stringify(this.state.order));
    };
    
    // т.к. firebase работает через socket, нужно почистить 
    componentWillUnmount() {
        base.removeBinding(this.ref);
    };

    addBurger = burger => {
        // 1. делаю копию объекта state
        const burgers = { ...this.state.burgers };
        // 2. добавляю новый бургер в копию объекта стейт бургер
        burgers[`burger${Date.now()}`] = burger;
        // 3. записываю обновленный объект burgers в стейт App
        this.setState({ burgers });
    };

    updateBurger = (key, updatedBurger) => {
        // 1. делаю копию объекта state
        const burgers = { ...this.state.burgers };
        // 2. обновляю нужный бургер
        burgers[key] = updatedBurger;
        // 3. записываю обновленный объект burgers в стейт App
        this.setState({ burgers });
    };

    deleteBurger = (key) => {
        // 1. делаю копию объекта state
        const burgers = { ...this.state.burgers };
        // 2. удаляю бургер
        burgers[key] = null;
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

    deleteFromOrder = key => {
        // 1. делаю копию объекта state
        const order = { ...this.state.order };
        // 2. удаляю бургер
        delete order[key];
        // 3. записываю обновленный объект обратно в стейт App
        this.setState({ order });
    };

    handleLogOut = async () => {
        await firebase.auth().signOut();
        window.location.reload();
    };

    render() {
        return(
            <SignIn>
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
                    <Order 
                        deleteFromOrder={ this.deleteFromOrder }
                        burgers={ this.state.burgers} 
                        order={ this.state.order } 
                    />
                    <MenuAdmin 
                        addBurger={ this.addBurger } 
                        loadSampleBurgers= { this.loadSampleBurgers }
                        burgers={ this.state.burgers }
                        updateBurger={ this.updateBurger }
                        deleteBurger={ this.deleteBurger }
                        handleLogOut={ this.handleLogOut }
                    />
                </div>
            </SignIn>
        );
    };
}

export default App;