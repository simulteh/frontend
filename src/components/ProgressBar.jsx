import React from 'react'
import '../style/ProgressBar.css' //Для стилей

export const ProgressBar = (task) => {
    //Значения по умолчанию
    const completed = task.completed ?? 2
    const total = task.total ?? 10
     
    //Нахождение процента выполнения
    const procent = total > 0 ? Math.round((completed / total)*100) : 0

    const ProgressColor = () => {
        if (procent < 50) return '#FF3042'
        if (procent <= 69) return '#FF9F43'   
        if (procent >= 70) return '#21C971'
    }
    
    return(
        /*Контейнер для компонента*/
        <div className='ProgressBarContainer'>

        {/*Процент выполнения*/}
         <div className='ProgressBarProcent'> {procent}% </div>

        {/*Шкала прогресса*/}   
         <div className='ProgressBarRectangle'>
         {/*Заполненная часть шкалы прогресса*/}
          <div className='ProgressBarColor'
           style={{
              width: procent*3.4,
              backgroundColor: ProgressColor(),
              filter: 'blur(1.4px)',             
          }}>
          </div>            
         </div>

        {/*Выполненные задания*/}
         <div className='CompletedTasks'>
            {completed}/{total} заданий            
         </div>
        </div> 
    )
}