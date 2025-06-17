import React, { useState } from 'react'; // импорт React и хука useState
import './CourseFilter.css';

const CourseFilter = () => { // компонент CourseFilter для фильтрации курсов
    const [selectedCategories, setSelectedCategories] = useState([]); // состояния для хранения категорий, выбранных цен, уровня сложности
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [difficulty, setDifficulty] = useState('');

    // Тестовые категории
    const categories = ['Программирование', 'Дизайн', 'Маркетинг', 'Бизнес', 'Языки'];

    const applyFilters = () => { // это для применения фильтров 
        console.log('Применены фильтры:', {
            selectedCategories,
            priceRange: [minPrice, maxPrice],
            difficulty
        });
    };

    const resetFilters = () => { // это функция для сброса всех фильтров 
        setSelectedCategories([]); // сброс выбранных категорий 
        setMinPrice(0); // сброс минимальной цены
        setMaxPrice(100000); // сброс максимальной цены
        setDifficulty(''); // сброс уровня сложности
    };

    return (
        <div className="course-filter">
            <h3>Фильтр курсов</h3> 
            <div>
                <h4>Категории</h4>
                {categories.map(category => (
                    <div key={category}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => {
                                if (e.target.checked) { // это отвечает за то отмечен ли выбор ползователя, тоесть добавляеет выбранную категорию в массив
                                    setSelectedCategories([...selectedCategories, category]);
                                } else { // а это ЕСЛИ пользователь снимает выбор, то код(?) удаляет категорию из массива
                                    setSelectedCategories(selectedCategories.filter(c => c !== category));
                                } 
                            }}
                        />
                        {category}
                    </div>
                ))} 
            </div>
            <div>
                <h4>Цена</h4>
                <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    placeholder="Минимум"
                />
                <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    placeholder="Максимум"
                />
            </div>
            <div>
                <h4>Уровень сложности</h4>
                {['Начальный', 'Средний', 'Продвинутый'].map(level => (
                    <div key={level}>
                        <input
                            type="radio"
                            value={level}
                            checked={difficulty === level}
                            onChange={() => setDifficulty(level)}
                        />
                        {level}
                    </div>
                ))}
            </div>
            <button onClick={applyFilters}>Применить</button> 
            <button onClick={resetFilters}>Сбросить</button>
        </div>
    );
};

export default CourseFilter;
