import React from 'react';
import './todo.css';
import Storage from './Storage';

  const current = new Date();
          const date = `${current.getMonth()+1}/${current.getDate()}/${current.getFullYear()}`;

const Todo = () => (  

   <div className='desk'>
   
   <div className="notebook"> 
  
        <div className='cover'>
          <h1 className='header-todo'> Today's Tasks <br>
           </br>{date}
           
          </h1>
        
       <Storage/>  
    
      <div className='side'>  
           
    </div>
   
</div>
</div>


</div>
);
export default Todo;