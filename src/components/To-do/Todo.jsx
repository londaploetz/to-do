import React from 'react';
import './todo.css';
import Storage from './Storage';
import postit from "../../Assets/postit.png"

  const current = new Date();
          const date = `${current.getMonth()+1}/${current.getDate()}/${current.getFullYear()}`;

const Todo = () => (  

   <div className='desk'>
   
   <div className="notebook"> 
        <div className='cover'>
          <h1 className='header-todo'> TODAY'S TASKS <br>
           </br>{date}
           
          </h1>
        
       <Storage/>  
    
      <div className='side'>  
           
    </div>
   
</div>
</div>
<img src={postit} className="pencil" alt='postit img'/>

</div>
);
export default Todo;