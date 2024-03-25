import {useHttp} from '../../hooks/http.hook';
import {useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    CSSTransition,
    TransitionGroup,
  } from 'react-transition-group';

import { heroesFetching, heroesFetched, heroesFetchingError, updateHeroesArr } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import './heroesList.scss';

const HeroesList = () => {
    const {heroes, filters, heroesLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => data.filter(hero => filters === 'all' ? hero : hero.element === filters))
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))
        // eslint-disable-next-line
    }, [filters]);


    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }
    
    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        const deleteHero = (name) => {
            const newHeroesArr = heroes.filter(obj => obj.name !== name)
            dispatch(updateHeroesArr(newHeroesArr));
            const id = arr.find(obj => obj.name === name).id;
            request(`http://localhost:3001/heroes/${id}`, 'DELETE')
                .catch(() => dispatch(heroesFetchingError()))

        };
        return arr.map(({id, ...props}) => {
            return (
                //узнать зачем нужен реф и сделать transitinGroup
                <CSSTransition
                    key={id}
                    timeout={500}
                    classNames="item">
                    <HeroesListItem key={id} {...props} deleteHero={(name) => deleteHero(name)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(heroes);
    return (
        <ul>
            <TransitionGroup className="todo-list">
                {elements}
            </TransitionGroup>
        </ul>
    )
}

export default HeroesList;