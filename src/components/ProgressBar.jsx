import React from 'react'
import '../style/ProgressBar.css' //Для стилей

export const ProgressBar = (task) => {
    //Значения по умолчанию
    const completed = task.completed ?? 8
    const total = task.total ?? 10
     
    //Нахождение процента выполнения
    const procent = total > 0 ? Math.round((completed / total)*100) : 0
    
    return(
        /*Контейнер для компонента*/
        <div className='ProgressBarContainer'>

        {/*Процент выполнения*/}
         <div className='ProgressBarProcent'> {procent}% </div>

        {/*Шкала прогресса*/}   
         <div className='ProgressBarRectangle'>
         {/*Заполненная часть шкалы прогресса*/}
          <div className='ProgressBarColor'
           style={{ width: procent*3.4 }}>
          </div>            
         </div>

        {/*Выполненные задания*/}
         <div className='CompletedTasks'>
            {completed}/{total} заданий            
         </div>
        </div> 
    )
}