import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { filterHeroes } from "../../actions";
// Задача для этого компонента:
// Активный фильтр имеет класс active
// Представьте, что вы попросили бэкенд-разработчика об этом

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

    const applyFilter = filterType => {
        dispatch(filterHeroes(filterType))
    }

    //сделать так чтобы при нажатии на кнопку изменялся фильтр
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {typesOfFilters.map((filter) => {
                        return (
                            <button key={filter['id']} onClick={() => applyFilter(filter.type)} className={filter['class']}>{filter['title']}</button>
                        )
                    }) }
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;