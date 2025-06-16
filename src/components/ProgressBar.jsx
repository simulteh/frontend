import React from 'react'
import './style/ProgressBar.css' //Для стилей

function ProgressBar (task) {
    //Значения по умолчанию
    let completed = task.completed ?? 0
    let total = task.total ?? 1
     
    //Нахождение процента выполнения
    const procent = total > 0 ? Math.round ((completed / total)*100) : 0

    const ProgressColor = () => {
        if (procent < 50) return '#ff0000'
        if (procent < 69) return '#ffa500'   
        if (procent > 70) return '#00ff00'
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
             width: '${procent}%',
             backgroundColor: ProgressColor()
          }
          }>
          </div>            
         </div>

        {/*Выполненные задания*/}
         <div className='CompletedTasks'>
            {completed}/{total} заданий            
         </div>
        </div> 
    )
}

export default ProgressBar