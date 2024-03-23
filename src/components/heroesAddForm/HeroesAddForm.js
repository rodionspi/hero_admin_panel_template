import { v4 as uuidv4} from "uuid";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { updateHeroesArr, heroesFetchingError } from '../../actions';
    
// Задача для этого компонента:
// Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться

const HeroesAddForm = () => {
    const {heroes} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();
    const [presenceOfCharacter, setPresenceOfCharacter] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        element: ''
    });
    const [elementsArr, setElementsArr] = useState([]);

    useEffect(() => {
        // Получение данных из JSON-файла при загрузке компонента
        request('http://localhost:3001/filters')
            .then(data => setElementsArr(data))
            .catch(e => console.log(e))
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };

    const addNewHero = (e) => {
        e.preventDefault();
        const data = formData;
        data['id'] = uuidv4();
        const elementPresenceCheck = ({name, description, element}) => (name === data.name && description === data.description && element === data.element);
        if(!heroes.some(obj => elementPresenceCheck(obj))) {
            if(presenceOfCharacter === 'The character is already on the list') {
                setPresenceOfCharacter('')
            }
            request("http://localhost:3001/heroes", 'POST', JSON.stringify(data))
                .then(res => {
                    const newHeroesList =  [...heroes, res]
                    dispatch(updateHeroesArr(newHeroesList))
                })
                .catch(() => dispatch(heroesFetchingError()))
        } else {
            setPresenceOfCharacter('The character is already on the list')
            //Оповещение о том что персонаж уже в листе 
        }
        setFormData({
            name: '',
            description: '',
            element: ''
        });
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={addNewHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={formData.name}
                    onChange={handleChange}/>
            </div>

            <div className="mb-3">
                <label htmlFor="description" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="description" 
                    className="form-control" 
                    id="description" 
                    placeholder="Что я умею?"
                    value={formData.description}
                    onChange={handleChange}
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={formData.element}
                    onChange={handleChange}>
                    {elementsArr.map((element, i) => (
                        <option key={i} value={element['type']}>{element['title']}</option>
                    ))}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
            <p>{presenceOfCharacter}</p>
        </form>
    )
}

export default HeroesAddForm;