import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { filterHeroes } from "../../actions";

const HeroesFilters = () => {
    const dispatch = useDispatch();
    const {filters} = useSelector(state => state);
    const {request} = useHttp()
    const [typesOfFilters, setFilters] = useState([])

    useEffect(() => {
        // Получение данных из JSON-файла при загрузке компонента
        dispatch(filterHeroes('all'))
        request('http://localhost:3001/filters')
            .then(data => setFilters(data))
            .catch(e => console.log(e))
    }, []);

    const applyFilter = (filterType, e) => {
        dispatch(filterHeroes(filterType));
        // Hier löschen wir die Attributklasse „aktiv“
        e.target.parentNode.childNodes.forEach(child => {
            if (child.classList.contains('active')) {
                child.classList.remove('active');
            }
        });
        //Hier fügen wir diese Attributklasse zu den angeklickten Elementen hinzu.
        e.target.className += ' active';
    }

    //сделать так чтобы при нажатии на кнопку изменялся фильтр
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {typesOfFilters.map((filter) => {
                        return (
                            <button key={filter['id']} onClick={(e) => applyFilter(filter.type, e)} className={filter['class']}>{filter['title']}</button>
                        )
                    }) }
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;