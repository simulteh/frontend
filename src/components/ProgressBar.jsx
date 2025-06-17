import React from 'react'
import '../style/ProgressBar.css' //Для стилей

export const ProgressBar = (task) => {
    //Значения по умолчанию
    const completed = task.completed ?? 65
    const total = task.total ?? 100
     
    //Нахождение процента выполнения
    const procent = total > 0 ? Math.round ((completed / total)*100) : 0

    const ProgressColor = () => {
        if (procent < 50) return '#ff0000'
        if (procent <= 69) return '#ffa500'   
        if (procent >= 70) return '#00ff00'
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
              width: procent*1.5,
              backgroundColor: ProgressColor()
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